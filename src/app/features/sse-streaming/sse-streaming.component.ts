import { Component, computed, inject, signal } from '@angular/core';
import { SseStreamingService } from "../../core/services/sse-streaming.service";
import { rxResource } from "@angular/core/rxjs-interop";
import { scan, takeWhile } from "rxjs";
import { Progress, SseEvent } from "../../core/models/sse-streaming";

@Component({
  imports: [],
  selector: 'app-sse-streaming',
  styleUrl: './sse-streaming.component.scss',
  templateUrl: './sse-streaming.component.html',
})
export class SseStreamingComponent {
  public sseUrl: string = 'http://localhost:8080';
  private sse = inject(SseStreamingService);

  jobId = signal<string | undefined>(undefined);

  progress = rxResource({
    params: () => this.jobId(),
    stream: ({ params: id }) =>
      this.sse.stream<Progress>(`${this.sseUrl}/demo/jobs/${id}/stream`, { mode: 'full' }).pipe(
        takeWhile(e => e.event !== 'done'),
        scan(
          (acc, e) => [...acc, e], [] as SseEvent<Progress>[]
        ),
      ),
    defaultValue: [],
  });

  public percent = computed(
    () => this.progress.value().at(-1)?.data.percent ?? 0
  );

  public start(id: string) {
    this.jobId.set(id);
  }

  public stop() {
    this.jobId.set(undefined);  // params = undefined → huỷ stream
  }
}
