import { inject, Service } from '@angular/core';
import { DocumentItem, DocumentRequest, DocumentResponse } from "../models/libre-office.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Service()
export class LibreOfficeService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/onlyoffice/documents';

  public list(): Observable<DocumentItem[]> {
    return this.http.get<DocumentItem[]>(this.api);
  }

  public upload(file: File): Observable<DocumentResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DocumentResponse>(`${this.api}/upload`, form);
  }

  public create(req: DocumentRequest): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(this.api, req);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
