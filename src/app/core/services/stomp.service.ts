import { DestroyRef, inject, Service, signal } from '@angular/core';
import { RxStomp, RxStompState } from "@stomp/rx-stomp";
import { map, Observable } from "rxjs";

export type WsStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

@Service()
export class StompService {
  private readonly rxStomp = new RxStomp();

  readonly status = signal<WsStatus>('CLOSED');
  readonly username = signal<string | null>(null);
  readonly lastError = signal<string | null>(null);

  public wsUrl: string = 'ws://localhost:8080/ws';

  constructor() {
    this.rxStomp.connectionState$.subscribe(s => this.status.set(RxStompState[s] as WsStatus));
    this.rxStomp.stompErrors$.subscribe(f => this.lastError.set(f.headers['message'] ?? 'STOMP error'));
    this.rxStomp.webSocketErrors$.subscribe(() =>
      this.lastError.set(`Không kết nối được ${this.wsUrl}`),
    );
    inject(DestroyRef).onDestroy(() => void this.rxStomp.deactivate());
  }

  connect(username: string, getToken?: () => string | null): void {
    if (this.rxStomp.active) return;
    this.username.set(username);
    this.lastError.set(null);

    this.rxStomp.configure({
      brokerURL: this.wsUrl,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      reconnectDelay: 3_000,
      // Chạy lại trước MỖI lần connect/reconnect → luôn lấy token mới nhất
      beforeConnect: client => {
        const token = getToken?.();
        client.configure({
          connectHeaders: {
            username,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      },
      debug: msg => console.debug('[STOMP]', msg),
    });
    this.rxStomp.activate();
  }

  async disconnect(): Promise<void> {
    await this.rxStomp.deactivate();
    this.username.set(null);
  }

  /** Gọi trước hay sau connect đều được – RxStomp tự subscribe lại khi reconnect */
  watch<T>(destination: string): Observable<T> {
    return this.rxStomp.watch({ destination }).pipe(map(f => JSON.parse(f.body) as T));
  }

  /** retryIfDisconnected: false → không queue, offline thì throw ngay */
  publish<T>(destination: string, body: T): void {
    this.rxStomp.publish({ destination, body: JSON.stringify(body), retryIfDisconnected: false });
  }
}
