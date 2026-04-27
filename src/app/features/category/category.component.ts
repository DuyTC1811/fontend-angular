import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Example } from '../../core/models/example';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  public readonly data = signal<Example[]>([
    { id: 1, person: 'John Doe', interest: 'Reading books', age: 25 },
    { id: 2, person: 'Jane Smith', interest: 'Playing football', age: 30 },
    { id: 3, person: 'Tom Johnson', interest: 'Photography', age: 40 },
    { id: 4, person: 'Alice Brown', interest: 'Traveling', age: 35 },
  ]);

  public readonly totalAge = computed(() =>
    this.data().reduce((sum, item) => sum + item.age, 0)
  );

  public readonly averageAge = computed(() => {
    const items = this.data();

    if (items.length === 0) {
      return 0;
    }

    return this.totalAge() / items.length;
  });

  public form: Example = {
    id: 0,
    person: '',
    interest: '',
    age: 0,
  };

  public isEditMode = false;

  public save(): void {
    if (!this.form.person?.trim() || !this.form.interest?.trim() || this.form.age <= 0) {
      alert('Please fill all fields');
      return;
    }

    if (this.isEditMode) {
      this.update();
      return;
    }

    this.create();
  }

  private create(): void {
    const newItem: Example = {
      ...this.form,
      id: this.generateId(),
    };

    this.data.update((items) => [...items, newItem]);
    this.resetForm();
  }

  public edit(item: Example): void {
    this.form = { ...item };
    this.isEditMode = true;
  }

  private update(): void {
    this.data.update((items) =>
      items.map((item) => {
        if (item.id === this.form.id) {
          return { ...this.form };
        }

        return item;
      })
    );

    this.resetForm();
  }

  public delete(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this item?');

    if (!confirmed) {
      return;
    }

    this.data.update((items) => items.filter((item) => item.id !== id));

    if (this.form.id === id) {
      this.resetForm();
    }
  }

  public cancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      id: 0,
      person: '',
      interest: '',
      age: 0,
    };

    this.isEditMode = false;
  }

  private generateId(): number {
    const items = this.data();

    if (items.length === 0) {
      return 1;
    }

    return Math.max(...items.map((item) => item.id)) + 1;
  }
}