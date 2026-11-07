import { Service } from '@angular/core';
import { SseEvent } from "../models/sse-streaming";
import { Observable } from "rxjs";

@Service()
export class SseStreamingService {
  // Nếu dùng JWT: private auth = inject(AuthService);

  public stream<T>(url: string, body?: unknown): Observable<SseEvent<T>> {
    return new Observable<SseEvent<T>>(subscriber => {
      const ctrl = new AbortController();

      (async () => {
        const res = await fetch(url, {
          method: body ? 'POST' : 'GET',
          headers: {
            Accept: 'text/event-stream',
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${this.auth.token()}`,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          throw new Error(`SSE HTTP ${res.status}`);
        }

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          buffer += value.replace(/\r\n?/g, '\n');
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() ?? '';
          for (const b of blocks) {
            const evt = this.parse<T>(b);
            if (evt) subscriber.next(evt);
          }
        }
        subscriber.complete();
      })()
        .catch(err => {
          if (err.name !== 'AbortError') {
            subscriber.error(err);
          }
        });

      return () => ctrl.abort();
    });
  }

  private parse<T>(block: string): SseEvent<T> | null {
    let event = 'message', id: string | undefined;
    const data: string[] = [];
    for (const line of block.split('\n')) {
      if (!line || line.startsWith(':')) {
        continue;
      }
      const i = line.indexOf(':');
      const field = i === -1 ? line : line.slice(0, i);
      const val = i === -1 ? '' : line.slice(i + 1).replace(/^ /, '');
      if (field === 'event') {
        event = val;
      } else if (field === 'data') {
        data.push(val);
      } else if (field === 'id') {
        id = val;
      }
    }
    if (!data.length) {
      return null;
    }
    const raw = data.join('\n');
    let parsed: any = raw;
    try {
      parsed = JSON.parse(raw);
    } catch {
    }
    return { id, event, data: parsed };
  }
}
