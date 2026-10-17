import { Component, effect, ElementRef, input, OnDestroy, signal, viewChild } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${pdfjsLib.version}`;

@Component({
  imports: [],
  selector: 'app-frame-view-pdf',
  styleUrl: './frame-view-pdf.component.scss',
  templateUrl: './frame-view-pdf.component.html',
})
export class FrameViewPdfComponent implements OnDestroy {
  /** URL của file PDF, hoặc bytes (Uint8Array) */
  src = input<string | Uint8Array>('https://pdfobject.com/pdf/sample.pdf');
  maxScale = input(1.5);

  loading = signal(false);
  error = signal<string | null>(null);

  private viewer = viewChild<ElementRef<HTMLDivElement>>('viewer');
  private pages = viewChild<ElementRef<HTMLDivElement>>('pages');

  private pdf?: PDFDocumentProxy;
  private scale = 0;
  private gen = 0;
  private openId = 0;
  private tasks = new Map<HTMLCanvasElement, RenderTask>();
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  private loadingTask?: PDFDocumentLoadingTask;

  constructor() {
    effect(() => {
      const src = this.src();
      const viewer = this.viewer()?.nativeElement;
      if (viewer) {
        this.open(src, viewer).then(r => {
        });
      }
    });
  }

  private async open(src: string | Uint8Array, viewer: HTMLDivElement) {
    const id = ++this.openId;
    this.loading.set(true);
    this.error.set(null);

    this.cancelAll();
    this.pages()?.nativeElement.replaceChildren();
    this.pdf = undefined;
    const oldTask = this.loadingTask;
    this.loadingTask = undefined;
    await oldTask?.destroy();
    const task = pdfjsLib.getDocument(
      typeof src === 'string' ? { url: src } : { data: src.slice() } // worker chiếm buffer
    );
    this.loadingTask = task;

    try {
      const pdf = await task.promise;
      if (id !== this.openId) {
        return; // src đã đổi, task này đã bị destroy ở lần open sau
      }

      this.pdf = pdf;
      this.setupObservers(viewer);
      this.scale = 0;
      viewer.scrollTop = 0;
      await this.layout();
    } catch (e: any) {
      if (id === this.openId) {
        this.error.set('Không mở được PDF: ' + (e?.message ?? e));
      }
    } finally {
      if (id === this.openId) {
        this.loading.set(false);
      }
    }
  }

  private setupObservers(viewer: HTMLDivElement) {
    if (this.io) return;
    // Lazy render: chỉ vẽ trang khi gần lọt vào khung nhìn
    this.io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          this.io!.unobserve(e.target);
          this.drawPage(e.target as HTMLCanvasElement)
            .then(r => {
            });
        }
      }),
      { root: viewer, rootMargin: '800px 0px' }
    );
    // Vừa chiều ngang: tính lại khi khung đổi kích thước
    this.ro = new ResizeObserver(() => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.layout(), 150);
    });
    this.ro.observe(viewer);
  }

  private async layout() {
    const pdf = this.pdf, viewer = this.viewer()?.nativeElement, host = this.pages()?.nativeElement;
    if (!pdf || !viewer || !host) return;

    const w1 = (await pdf.getPage(1)).getViewport({ scale: 1 }).width;
    const next = Math.min(this.maxScale(), (viewer.clientWidth - 32) / w1);
    if (Math.abs(next - this.scale) < 0.01) return;
    this.scale = next;

    const ratio = viewer.scrollTop / Math.max(1, viewer.scrollHeight);
    this.cancelAll();
    host.replaceChildren();

    for (let n = 1; n <= pdf.numPages; n++) {
      const vp = (await pdf.getPage(n)).getViewport({ scale: this.scale });
      if (pdf !== this.pdf) {
        return;
      }
      const cv = document.createElement('canvas');
      cv.dataset['page'] = String(n);
      cv.style.width = Math.floor(vp.width) + 'px';
      cv.style.height = Math.floor(vp.height) + 'px';
      host.append(cv);
      this.io!.observe(cv);
    }
    viewer.scrollTop = ratio * viewer.scrollHeight;
  }

  private async drawPage(cv: HTMLCanvasElement) {
    const gen = this.gen, pdf = this.pdf;
    if (!pdf) {
      return;
    }
    const page = await pdf.getPage(Number(cv.dataset['page']));
    if (gen !== this.gen) {
      return; // đã layout lại, bỏ lần vẽ cũ
    }

    const vp = page.getViewport({ scale: this.scale });
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.floor(vp.width * dpr);
    cv.height = Math.floor(vp.height * dpr);

    const task = page.render({
      canvas: cv, // v6: dùng canvas thay cho canvasContext
      viewport: vp,
      transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
    });
    this.tasks.set(cv, task);
    try {
      await task.promise;
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') {
        console.error(e);
      }
    } finally {
      this.tasks.delete(cv);
    }
  }

  /** Dừng mọi lần vẽ đang chạy và vô hiệu các lần vẽ đang chờ */
  private cancelAll() {
    this.gen++;
    this.io?.disconnect();
    this.tasks.forEach(t => t.cancel());
    this.tasks.clear();
  }

  ngOnDestroy() {
    clearTimeout(this.resizeTimer);
    this.cancelAll();
    this.ro?.disconnect();
    this.loadingTask?.destroy();
  }
}
