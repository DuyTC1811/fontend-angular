import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ChatMessage, NotificationMessage, WsError } from "../../core/models/ws-message";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StompService } from "../../core/services/stomp.service";
import { DatePipe } from "@angular/common";

@Component({
  imports: [
    DatePipe
  ],
  selector: 'app-websocket',
  styleUrl: './websocket.component.scss',
  templateUrl: './websocket.component.html',
})
export class WebsocketComponent {
  private readonly stomp = inject(StompService);
  private readonly logEl = viewChild<ElementRef<HTMLUListElement>>('log');

  readonly status = this.stomp.status;
  readonly me = this.stomp.username;
  readonly lastError = this.stomp.lastError;

  readonly nameInput = signal('duy');
  readonly draft = signal('');
  readonly messages = signal<ChatMessage[]>([]);
  readonly notifications = signal<NotificationMessage[]>([]);

  readonly isOpen = computed(
    () => this.status() === 'OPEN'
  );
  readonly canConnect = computed(
    () => this.status() === 'CLOSED' && this.nameInput().trim().length > 0
  );
  readonly canSend = computed(
    () => this.isOpen() && this.draft().trim().length > 0
  );

  constructor() {
    this.stomp.watch<ChatMessage>('/topic/chat')
      .pipe(takeUntilDestroyed())
      .subscribe(m => this.messages.update(l => [...l, m].slice(-200)));

    this.stomp.watch<NotificationMessage>('/user/queue/notifications')
      .pipe(takeUntilDestroyed())
      .subscribe(n => this.notifications.update(l => [n, ...l].slice(0, 20)));

    this.stomp.watch<WsError>('/user/queue/errors')
      .pipe(takeUntilDestroyed())
      .subscribe(e => this.lastError.set(`${e.code}: ${e.message}`));

    // Tự cuộn xuống tin mới nhất
    effect(() => {
      this.messages();
      const el = this.logEl()?.nativeElement;
      if (el) {
        queueMicrotask(
          () => (el.scrollTop = el.scrollHeight)
        );
      }
    });
  }

  connect(): void {
    if (!this.canConnect()) {
      return;
    }
    this.stomp.connect(
      this.nameInput().trim(),
      () => localStorage.getItem('access_token')
    );
  }

  disconnect(): void {
    void this.stomp.disconnect();
  }

  send(e: Event): void {
    e.preventDefault();
    if (!this.canSend()) {
      return;
    }

    const text = this.draft().trim();
    try {
      // "/echo abc" → chỉ mình nhận lại qua /user/queue/notifications
      if (text.startsWith('/echo ')) {
        this.stomp.publish('/app/chat.echo', { content: text.slice(6) });
      } else {
        this.stomp.publish('/app/chat.send', { content: text });
      }
      this.draft.set('');
    } catch {
      this.lastError.set('Mất kết nối, chưa gửi được tin nhắn');
    }
  }

  clearNotifications(): void {
    this.notifications.set([]);
  }
}
