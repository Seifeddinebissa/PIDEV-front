import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  user: User | null = null;
  image: File | null = null;
  currentPass:string='';
  newPass:string='';
  confirmPass:string='';
  errorMsg: string = '';
  constructor(private service: AuthenticationService,private router:Router) {}

  ngOnInit() {
    this.user = new User();
    this.service.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        console.log(this.user)
      },
      error: () => console.error('Failed to load profile'),
    });
  }

  onFileChange(event:any) {
    this.image = event.target.files[0];
  }
  onSubmit() {
    const formData = new FormData();
    if (this.user && this.user.id) {
      formData.append('id', this.user.id.toString());
    } else {
      formData.append('id', ''); // Valeur par défaut si this.user ou this.user.id est undefined
    }
    formData.append('username', this.user?.username || '');
    formData.append('email', this.user?.email || '');
    formData.append('firstName', this.user?.firstName || '');
    formData.append('lastName', this.user?.lastName || '');
    formData.append('cin', this.user?.cin || '');
    formData.append('address', this.user?.address || '');
    if (this.image) {
      formData.append('image', this.image);
    }

    this.service.update(formData).subscribe({
      next: () => {
        this.router.navigate(['/profile'])
      },
      error: (err) => console.error('Registration failed', err)
    });
  }

  updatePassword() {
    const formData = new FormData();
    formData.append('oldPassword', this.currentPass);
    formData.append('newPassword', this.newPass);
    formData.append('id', this.user?.id.toString() || '');
    if(this.newPass != this.confirmPass){
      this.errorMsg = 'Passwords do not match';
    }else{
      this.service.updatePassword(formData).subscribe({
        next: () => {
        this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Password update failed', err);
          if (err.status == 222) {
            console.log('Old password is incorrect');
            this.errorMsg = 'Old password is incorrect';
          }else if (err.status == 200) { 
            this.router.navigate(['/profile']);
          }
          else {
            this.errorMsg = 'Failed to update password';
          }
        }
      });
    }

  }
test(){
  console.log("iam working");
}
}
