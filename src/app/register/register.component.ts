import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements AfterViewInit {
  userExistsEmail: User | null = null;
  userExistsUsername: User | null = null;
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  cin = '';
  address = '';
  email = '';
  msg = '';
  image: File | null = null;
  imagePreview: string | null = null;
  role: string = 'STUDENT';
  availableRoles = ['STUDENT', 'ADMIN', 'HR', 'TRAINER', 'COMPANY'];

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  isCameraOpen: boolean = false;
  capturedPhoto: string | null = null;
  stream: MediaStream | null = null;
  isSubmitting: boolean = false;
  showError: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Ensure DOM elements are ready
  }

  onFileChange(event: any) {
    this.image = event.target.files[0];
    this.capturedPhoto = null; 
    this.isCameraOpen = false; 
    this.closeCamera(); 
    if (this.image) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imagePreview = e.target.result);
      reader.readAsDataURL(this.image);
    } else {
      this.imagePreview = null;
    }
  }

  async startCamera() {
    try {
      this.isCameraOpen = true;
      this.image = null; 
      this.imagePreview = null; 
      this.capturedPhoto = null; 
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (err) {
      this.msg = 'Failed to access camera. Please allow camera access or select a file.';
      this.isCameraOpen = false;
      console.error('Camera error:', err);
    }
  }

  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedPhoto = canvas.toDataURL('image/jpeg');
  }

  confirmPhoto() {
    if (this.capturedPhoto) {
      this.dataURLtoFile(this.capturedPhoto, 'captured-photo.jpg').then((file) => {
        this.image = file;
        this.closeCamera();
      });
    }
  }

  async dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('cin', this.cin);
      formData.append('address', this.address);
      formData.append('email', this.email);
      formData.append('roles', this.role);

      if (this.image) {
        formData.append('image', this.image);
      } else if (this.capturedPhoto) {
        fetch(this.capturedPhoto)
          .then(res => res.blob())
          .then(blob => {
            formData.append('image', blob, 'captured-photo.jpg');
          });
      }

      this.isSubmitting = true;
      this.showError = false;

      forkJoin({
        usernameCheck: this.authService.existusername(this.username),
        emailCheck: this.authService.existemail(this.email)
      }).subscribe({
        next: (results) => {
          if (results.usernameCheck) {
            this.showError = true;
            this.msg = 'Username already exists';
            this.isSubmitting = false;
            return;
          }
          if (results.emailCheck) {
            this.showError = true;
            this.msg = 'Email already exists';
            this.isSubmitting = false;
            return;
          }

          this.authService.register(formData).subscribe({
            next: (response) => {
              console.log('Registration successful:', response);
              this.router.navigate(['/login']);
            },
            error: (error) => {
              console.error('Registration error:', error);
              this.showError = true;
              this.msg = error.message || 'Registration failed. Please try again.';
              this.isSubmitting = false;
            }
          });
        },
        error: (error) => {
          console.error('Error checking username/email:', error);
          this.showError = true;
          this.msg = 'Error checking username/email. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.showError = true;
      this.msg = 'Please fill in all required fields correctly.';
    }
  }
}