export interface SseEvent<T = unknown> {
  id?: string;
  event: string;
  data: T;
}

export interface Progress {
  jobId: string;
  percent: number;
}
