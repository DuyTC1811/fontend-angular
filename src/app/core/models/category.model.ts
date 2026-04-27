export interface CategoryInfo {
  categoryId: string;
  name: string;
  description?: string;
  displayOrder: number;
  enabled: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CategoryListResp {
  items: CategoryInfo[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateCategoryReq {
  name: string;
  description?: string;
  displayOrder?: number;
  enabled?: boolean;
}

export interface UpdateCategoryReq {
  name: string;
  description?: string;
  displayOrder?: number;
  enabled?: boolean;
}