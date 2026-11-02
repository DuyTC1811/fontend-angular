import { Component, computed, input, signal } from '@angular/core';
import { httpResource } from "@angular/common/http";
import { DocumentEditorModule } from "@onlyoffice/document-editor-angular";
import { RouterLink } from "@angular/router";
import type { Config, DocumentStateChangeEvent, ErrorEvent, WarningEvent } from '@onlyoffice/doceditor-types';

@Component({
  imports: [
    DocumentEditorModule,
    RouterLink
  ],
  selector: 'app-frame-libre-office-editor',
  styleUrl: './frame-libre-office-editor.component.scss',
  templateUrl: './frame-libre-office-editor.component.html',
})
export class FrameLibreOfficeEditorComponent {
  id = input.required<string>();

  /** URL của server OnlyOffice Document Server */
  readonly documentServerUrl = 'http://192.168.122.102:8081/';

  /** Config thô từ backend (không có events) */
  private serverConfig = httpResource<Config>(
    () => `/api/onlyoffice/${this.id()}/config`
  );

  status = this.serverConfig;
  ready = signal(false);
  unsaved = signal(false);
  editorError = signal<string | null>(null);

  /** Config hoàn chỉnh = config backend + events */
  config = computed<Config | undefined>(() => {
    if (!this.serverConfig.hasValue()) {
      return undefined;
    }
    return {
      ...this.serverConfig.value(),
      width: '100%',
      height: '100%',
      events: {
        onDocumentReady: () => this.ready.set(true),
        // true: đang sửa (chưa gửi lên ONLY-OFFICE);
        // false: đã đồng bộ lên ONLY-OFFICE (CHƯA lưu về MinIO)
        onDocumentStateChange: (changeEvent: DocumentStateChangeEvent) =>
          this.unsaved.set(changeEvent.data ?? false),

        // Lỗi từ ONLY-OFFICE
        onError: (errorEvent: ErrorEvent) =>
          this.editorError.set(`Lỗi ${errorEvent.data?.errorCode ?? '?'}: ${errorEvent.data?.errorDescription ?? ''}`),

        // Cảnh báo từ ONLY-OFFICE
        onWarning: (warningEvent: WarningEvent) =>
          console.warn('ONLY-OFFICE warning', warningEvent.data?.warningCode, warningEvent.data?.warningDescription),
      },
    };
  });

  onLoadComponentError = (code: number, desc: string) => {
    // -1: không tải được api.js,
    // -2: sai documentServerUrl,
    // -3: thiếu DocsAPI
    this.editorError.set(`Không tải được editor (${code}): ${desc}`);
  };
}
