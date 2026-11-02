import { Component, computed, inject, signal } from '@angular/core';
import { Observable } from "rxjs";
import {
  ACCEPT_EXT,
  DOC_TYPES,
  DocType,
  DocumentItem,
  DocumentResponse,
  MAX_SIZE_MB
} from "../../core/models/libre-office.model";
import { LibreOfficeService } from "../../core/services/libre-office.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  imports: [
    DatePipe,
    FormsModule
  ],
  selector: 'app-frame-libre-office',
  styleUrl: './frame-libre-office.component.scss',
  templateUrl: './frame-libre-office.component.html',
})
export class FrameLibreOfficeComponent {
  private service = inject(LibreOfficeService);
  private router = inject(Router);

  readonly docTypes = DOC_TYPES;
  readonly accept = ACCEPT_EXT.join(',');

  documents = signal<DocumentItem[]>([]);
  loading = signal(true);
  busy = signal(false);
  error = signal<string | null>(null);
  dragOver = signal(false);

  showCreate = signal(false);
  newName = signal('');
  newType = signal<DocType>('DOCX');

  isEmpty = computed(
    () => !this.loading() && this.documents().length === 0
  );

  constructor() {
    this.load();
  }

  public load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: document => {
        this.documents.set(document);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không tải được danh sách tài liệu');
        this.loading.set(false);
      },
    });
  }

  // ---------- Upload ----------
  public onFileSelected(input: HTMLInputElement): void {
    const file = input.files?.[0];
    input.value = ''; // cho phép chọn lại cùng file
    if (file) this.upload(file);
  }

  public onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      this.upload(file);
    }
  }

  public onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragOver.set(true);
  }

  private upload(file: File): void {
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
    if (!ACCEPT_EXT.includes(ext)) {
      this.error.set(`Định dạng ${ext} không được hỗ trợ`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      this.error.set(`File vượt quá ${MAX_SIZE_MB}MB`);
      return;
    }
    this.run(this.service.upload(file));
  }

  // ---------- Tạo mới ----------
  openCreate(type?: DocType): void {
    if (type) {
      this.newType.set(type);
    }
    this.newName.set('');
    this.showCreate.set(true);
  }

  public submitCreate(): void {
    const name = this.newName().trim();
    if (!name) return;
    this.run(this.service.create({ name, type: this.newType() }));
  }

  // ---------- Chung ----------
  open(id: string): void {
    this.router.navigate(['/libre-office', id]).then(() => {
    });
  }

  iconOf(ext: string): string {
    if (['xlsx', 'xls', 'ods', 'csv'].includes(ext)) return '📊';
    if (['pptx', 'ppt', 'odp'].includes(ext)) return '📽️';
    if (ext === 'pdf') return '📕';
    return '📄';
  }

  private run(req: Observable<DocumentResponse>): void {
    this.busy.set(true);
    this.error.set(null);
    req.subscribe({
      next: r => {
        this.busy.set(false);
        this.showCreate.set(false);
        this.open(r.id);                    // tạo xong mở editor luôn
      },
      error: e => {
        this.busy.set(false);
        this.error.set(e?.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại');
      },
    });
  }

  public remove(d: DocumentItem, event: MouseEvent): void {
    event.stopPropagation(); // không mở editor khi bấm nút xóa
    if (!confirm(`Xóa tài liệu "${d.name}"?`)) {
      return;
    }

    this.busy.set(true);
    this.service.delete(d.id).subscribe({
      next: () => {
        this.documents.update(list => list.filter(x => x.id !== d.id));
        this.busy.set(false);
      },
      error: e => {
        this.busy.set(false);
        this.error.set(e?.error?.message ?? 'Không xóa được tài liệu');
      },
    });
  }
}
