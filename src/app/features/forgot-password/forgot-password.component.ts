
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

}
