import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CategoryInfo, CategoryListResp, CreateCategoryReq, UpdateCategoryReq } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/categories';

  public getList(limit = 10, offset = 0): Observable<CategoryListResp> {
    return this.http.get<CategoryListResp>(
      `${this.baseUrl}/list?limit=${limit}&offset=${offset}`,
    );
  }

  public getInfo(categoryId: string): Observable<CategoryInfo> {
    return this.http.get<CategoryInfo>(`${this.baseUrl}/info/${categoryId}`);
  }

  public create(request: CreateCategoryReq): Observable<CategoryInfo> {
    return this.http.post<CategoryInfo>(this.baseUrl, request);
  }

  public update( categoryId: string, request: UpdateCategoryReq): Observable<CategoryInfo> {
    return this.http.put<CategoryInfo>(
      `${this.baseUrl}/${categoryId}`,
      request,
    );
  }

  public delete(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${categoryId}`);
  }
}
