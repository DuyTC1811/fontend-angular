import {Component}        from '@angular/core';
import { FormsModule } from '@angular/forms';  // ← thêm dòng này
import {TwoFactorService}      from "../../core/services/two-factor.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  qrImageUrl: SafeUrl | null = null;
  private objectUrl: string | null = null;
  showSetup2FA = false;
  totpCode = '';
  message = '';
  is2FAEnabled = false;

  constructor(
    private twoFactorService: TwoFactorService,
    private sanitizer: DomSanitizer
  ) {
  }

  onEnable2FA(): void {
    this.twoFactorService.enable2FA().subscribe({
      next: (blob: Blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
        this.showSetup2FA = true;
      },
      error: () => {
        this.message = 'Không thể tạo QR code';
      }
    });
  }

  onConfirmSetup(): void {
    this.twoFactorService.verify2FASetup(this.totpCode).subscribe({
      next: () => {
        this.is2FAEnabled = true;
        this.showSetup2FA = false;
        this.message = 'Bật 2FA thành công!';
        this.cleanupQR();
      },
      error: () => {
        this.message = 'Mã xác thực không đúng, thử lại';
      }
    });
  }

  private cleanupQR(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
      this.qrImageUrl = null;
    }
  }


  ngOnDestroy(): void {
    this.cleanupQR();
  }
}
