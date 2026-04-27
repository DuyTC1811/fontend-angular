import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { CategoryInfo, CreateCategoryReq, UpdateCategoryReq } from '../../core/models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit{
  private readonly categoryService = inject(CategoryService);

  public readonly categories = signal<CategoryInfo[]>([]);
  public readonly total = signal(0);
  public readonly limit = signal(10);
  public readonly offset = signal(0);

  public readonly isLoading = signal(false);
  public readonly isEditMode = signal(false);
  public readonly errorMessage = signal('');

  public editingCategoryId: string | null = null;

  public form: CreateCategoryReq = {
    name: '',
    description: '',
    displayOrder: 0,
    enabled: true,
  };

  public ngOnInit(): void {
    this.loadCategories();
  }

  public loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getList(this.limit(), this.offset()).subscribe({
      next: (response) => {
        console.log('Categories loaded', response);
        this.categories.set(response.items);
        this.total.set(response.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log('Load categories failed', error);
        this.errorMessage.set('Không tải được danh sách category');
        this.isLoading.set(false);
      },
    });
  }

  public save(): void {
    if (!this.form.name?.trim()) {
      this.errorMessage.set('Category name không được để trống');
      return;
    }

    if (this.isEditMode()) {
      this.update();
      return;
    }

    this.create();
  }

  private create(): void {
    const request: CreateCategoryReq = {
      name: this.form.name.trim(),
      description: this.form.description?.trim(),
      displayOrder: this.form.displayOrder ?? 0,
      enabled: this.form.enabled ?? true,
    };

    this.isLoading.set(true);

    this.categoryService.create(request).subscribe({
      next: () => {
        this.resetForm();
        this.loadCategories();
      },
      error: (error) => {
        console.log('Create category failed', error);
        this.errorMessage.set(
          error?.error?.description || error?.error?.message || 'Tạo category thất bại'
        );
        this.isLoading.set(false);
      },
    });
  }

  public edit(item: CategoryInfo): void {
    this.editingCategoryId = item.categoryId;
    this.isEditMode.set(true);

    this.form = {
      name: item.name,
      description: item.description ?? '',
      displayOrder: item.displayOrder,
      enabled: item.enabled,
    };
  }

  private update(): void {
    if (!this.editingCategoryId) {
      return;
    }

    const request: UpdateCategoryReq = {
      name: this.form.name.trim(),
      description: this.form.description?.trim(),
      displayOrder: this.form.displayOrder ?? 0,
      enabled: this.form.enabled ?? true,
    };

    this.isLoading.set(true);

    this.categoryService.update(this.editingCategoryId, request).subscribe({
      next: () => {
        this.resetForm();
        this.loadCategories();
      },
      error: (error) => {
        console.log('Update category failed', error);
        this.errorMessage.set(
          error?.error?.description ||
            error?.error?.message ||
            'Cập nhật category thất bại'
        );
        this.isLoading.set(false);
      },
    });
  }

  public deleteCategory(categoryId: string): void {
    const confirmed = confirm('Bạn có chắc muốn xóa category này không?');

    if (!confirmed) {
      return;
    }

    this.isLoading.set(true);

    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.log('Delete category failed', error);
        this.errorMessage.set('Xóa category thất bại');
        this.isLoading.set(false);
      },
    });
  }

  public cancel(): void {
    this.resetForm();
  }

  public nextPage(): void {
    this.offset.update((value) => value + this.limit());
    this.loadCategories();
  }

  public previousPage(): void {
    this.offset.update((value) => Math.max(value - this.limit(), 0));
    this.loadCategories();
  }

  private resetForm(): void {
    this.form = {
      name: '',
      description: '',
      displayOrder: 0,
      enabled: true,
    };

    this.editingCategoryId = null;
    this.isEditMode.set(false);
    this.errorMessage.set('');
  }
}
