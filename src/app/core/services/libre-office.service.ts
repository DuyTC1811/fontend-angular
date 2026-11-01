import { inject, Service } from '@angular/core';
import { CreateDocumentRequest, DocumentCreated, DocumentItem } from "../models/libre-office.model";
import { delay, Observable, of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Service()
export class LibreOfficeService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/onlyoffice/documents';
  // TODO: đổi thành false khi backend sẵn sàng
  private useMock = false;
  private mockDocs: DocumentItem[] = [];

  list(): Observable<DocumentItem[]> {
    if (this.useMock) {
      return of([...this.mockDocs]).pipe(delay(300));
    }
    return this.http.get<DocumentItem[]>(this.api);
  }

  upload(file: File): Observable<DocumentCreated> {
    if (this.useMock) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      return this.mockAdd(file.name, ext);
    }
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DocumentCreated>(`${this.api}/upload`, form);
  }

  create(req: CreateDocumentRequest): Observable<DocumentCreated> {
    if (this.useMock) {
      const ext = req.type.toLowerCase();
      const name = req.name.endsWith(`.${ext}`) ? req.name : `${req.name}.${ext}`;
      return this.mockAdd(name, ext);
    }
    return this.http.post<DocumentCreated>(this.api, req);
  }

  private mockAdd(name: string, fileExt: string): Observable<DocumentCreated> {
    if (name.includes('error')) {
      return throwError(
        () => ({ error: { message: 'Mock lỗi server' } })
      );
    }
    const id = crypto.randomUUID();
    this.mockDocs.unshift({ id, name, fileExt, currentVersion: 1, updatedAt: new Date().toISOString() });
    return of({ id, name, fileExt }).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
