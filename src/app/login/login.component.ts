import { User } from './../models/user';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

   user: User | null = null;
  username = '';
  password = '';
  loginErrorMsg='';
  showError: boolean = false;


  captchaCode: string = '';
  userCaptchaAnswer: string = '';
  @ViewChild('captchaCanvas') captchaCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngAfterViewInit() {
    this.generateCaptcha(); // Generate CAPTCHA after the view is initialized
  }

  // Generate a random string and draw it on the canvas
  generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = '';
    for (let i = 0; i < 6; i++) {
      this.captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.userCaptchaAnswer = ''; // Reset user input
    this.drawCaptcha(); // Draw the CAPTCHA on the canvas
  }

  // Draw the CAPTCHA text on the canvas with some distortion
  drawCaptcha() {
    const canvas = this.captchaCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random noise lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.stroke();
    }

    // Draw the CAPTCHA text with distortion
    ctx.font = '30px Arial';
    ctx.fillStyle = '#333';
    for (let i = 0; i < this.captchaCode.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 30, 40);
      ctx.rotate((Math.random() - 0.5) * 0.4); // Random rotation
      ctx.fillText(this.captchaCode[i], 0, 0);
      ctx.restore();
    }
  }

  // Validate CAPTCHA
  isCaptchaValid(): boolean {
    return this.userCaptchaAnswer.toLowerCase() === this.captchaCode.toLowerCase();
  }

  onSubmit() {
    if (!this.isCaptchaValid()) {
      this.showError = true;
      this.loginErrorMsg = 'Incorrect CAPTCHA answer. Please try again.';
      this.generateCaptcha(); // Regenerate CAPTCHA on failure
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.showError = true;
        if (error.status === 333) {
          console.error('Login failed: Account is blocked');
          this.loginErrorMsg = 'Your account is blocked. Please contact support.';
        } else {
          console.error('Login failed:', error);
          this.loginErrorMsg = 'Invalid username or password. Please try again.';
        }
        this.generateCaptcha(); // Regenerate CAPTCHA on login failure
      }
    });
  }
  closeError() {
    this.showError = false;
    this.loginErrorMsg = '';
  }
}
