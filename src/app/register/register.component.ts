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
  imagePreview: string | null = null; // For previewing selected file
  role: string = 'STUDENT';
  availableRoles = ['STUDENT', 'ADMIN', 'HR', 'TRAINER', 'COMPANY'];

  // Camera-related properties
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  isCameraOpen: boolean = false;
  capturedPhoto: string | null = null;
  stream: MediaStream | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Ensure DOM elements are ready
  }

  // Handle file selection and generate preview
  onFileChange(event: any) {
    this.image = event.target.files[0];
    this.capturedPhoto = null; // Clear captured photo
    this.isCameraOpen = false; // Close camera if open
    this.closeCamera(); // Stop camera stream
    if (this.image) {
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = e.target?.result as string);
      reader.readAsDataURL(this.image);
    } else {
      this.imagePreview = null;
    }
  }

  // Start the camera
  async startCamera() {
    try {
      this.isCameraOpen = true;
      this.image = null; // Clear selected file
      this.imagePreview = null; // Clear file preview
      this.capturedPhoto = null; // Clear previous captured photo
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (err) {
      this.msg = 'Failed to access camera. Please allow camera access or select a file.';
      this.isCameraOpen = false;
      console.error('Camera error:', err);
    }
  }

  // Capture photo from video feed
  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.capturedPhoto = canvas.toDataURL('image/jpeg');
  }

  // Confirm captured photo and convert to File
  confirmPhoto() {
    if (this.capturedPhoto) {
      this.dataURLtoFile(this.capturedPhoto, 'captured-photo.jpg').then((file) => {
        this.image = file;
        this.closeCamera();
      });
    }
  }

  // Convert data URL to File
  async dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  // Close camera and stop stream
  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  onSubmit() {
    if (!this.image) {
      this.msg = 'Please select or capture a profile image.';
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('email', this.email);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('cin', this.cin);
    formData.append('address', this.address);
    formData.append('image', this.image);
    formData.append('roles', this.role);

    // Check if username and email already exist
    forkJoin([
      this.authService.existusername(this.username),
      this.authService.existemail(this.email),
    ]).subscribe({
      next: ([usernameResult, emailResult]) => {
        if (usernameResult) {
          this.msg = 'Username already exists';
        } else if (emailResult) {
          this.msg = 'Email already exists';
        } else {
          // Proceed with registration
          this.authService.register(formData).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error('Registration failed', err);
              this.msg = 'Registration failed. Please try again.';
            },
          });
        }
      },
      error: (err) => {
        console.error('Error checking username/email', err);
        this.msg = 'Error verifying username or email. Please try again.';
      },
    });
  }
}