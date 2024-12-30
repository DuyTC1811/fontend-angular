import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Example } from '../../core/models/example';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  data: Example[] = [
    { id: 1, persion: 'John Doe', interest: 'Reading books', age: 25 },
    { id: 2, persion: 'Jane Smith', interest: 'Playing football', age: 30 },
    { id: 3, persion: 'Tom Johnson', interest: 'Photography', age: 40 },
    { id: 4, persion: 'Alice Brown', interest: 'Traveling', age: 35 },
    { id: 5, persion: 'Bob White', interest: 'Music', age: 28 },
    { id: 6, persion: 'Sara Wilson', interest: 'Cooking', age: 22 },
    { id: 7, persion: 'Michael Green', interest: 'Hiking', age: 45 },
    { id: 8, persion: 'Emily Taylor', interest: 'Dancing', age: 19 },
    { id: 9, persion: 'David Lee', interest: 'Gardening', age: 33 },
    { id: 10, persion: 'Laura Clark', interest: 'Painting', age: 27 },
    { id: 11, persion: 'Chris Young', interest: 'Gaming', age: 21 },
    { id: 12, persion: 'Sophia Adams', interest: 'Yoga', age: 29 },
    { id: 13, persion: 'Daniel Brown', interest: 'Fishing', age: 38 },
    { id: 14, persion: 'Nancy Allen', interest: 'Writing', age: 24 },
    { id: 15, persion: 'Robert Scott', interest: 'Cycling', age: 36 },
    { id: 16, persion: 'Jessica Evans', interest: 'Knitting', age: 32 },
    { id: 17, persion: 'Mark Harris', interest: 'Swimming', age: 42 },
    { id: 18, persion: 'Megan Turner', interest: 'Running', age: 20 },
    { id: 19, persion: 'Paul Hall', interest: 'Chess', age: 31 },
    { id: 20, persion: 'Rachel Moore', interest: 'Singing', age: 26 },
  ];

  totalAge = this.data.reduce((sum, item) => sum + item.age, 0);
  averageAge = this.totalAge / this.data.length;
}
