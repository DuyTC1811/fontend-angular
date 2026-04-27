
import { Component } from '@angular/core';
import { Example } from '../../core/models/example';

@Component({
  selector: 'app-category',
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  data: Example[] = [
    { id: 1, person: 'John Doe', interest: 'Reading books', age: 25 },
    { id: 2, person: 'Jane Smith', interest: 'Playing football', age: 30 },
    { id: 3, person: 'Tom Johnson', interest: 'Photography', age: 40 },
    { id: 4, person: 'Alice Brown', interest: 'Traveling', age: 35 },
    { id: 5, person: 'Bob White', interest: 'Music', age: 28 },
    { id: 6, person: 'Sara Wilson', interest: 'Cooking', age: 22 },
    { id: 7, person: 'Michael Green', interest: 'Hiking', age: 45 },
    { id: 8, person: 'Emily Taylor', interest: 'Dancing', age: 19 },
    { id: 9, person: 'David Lee', interest: 'Gardening', age: 33 },
    { id: 10, person: 'Laura Clark', interest: 'Painting', age: 27 },
    { id: 11, person: 'Chris Young', interest: 'Gaming', age: 21 },
    { id: 12, person: 'Sophia Adams', interest: 'Yoga', age: 29 },
    { id: 13, person: 'Daniel Brown', interest: 'Fishing', age: 38 },
    { id: 14, person: 'Nancy Allen', interest: 'Writing', age: 24 },
    { id: 15, person: 'Robert Scott', interest: 'Cycling', age: 36 },
    { id: 16, person: 'Jessica Evans', interest: 'Knitting', age: 32 },
    { id: 17, person: 'Mark Harris', interest: 'Swimming', age: 42 },
    { id: 18, person: 'Megan Turner', interest: 'Running', age: 20 },
    { id: 19, person: 'Paul Hall', interest: 'Chess', age: 31 },
    { id: 20, person: 'Rachel Moore', interest: 'Singing', age: 26 },
  ];

  totalAge = this.data.reduce((sum, item) => sum + item.age, 0);
  averageAge = this.totalAge / this.data.length;
}
