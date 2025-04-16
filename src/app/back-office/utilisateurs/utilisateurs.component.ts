// utilisateurs.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent {
  image: File | null = null;
  newUser: User = {
    id: 0,
    username: '',
    password: '',
    email: '',
    roles: [],
    firstName: '',
    cin: '',
    lastName: '',
    address: '',
    enabled: true,
    accountLocked: false
  };

  rolesInput: string = '';
  filteredUsers: User[] = [];
  paginatedUsers: User[] = []; // Added for pagination
  searchTerm: string = '';
  selectedRole: string = '';
  availableRoles: string[] = ['STUDENT', 'ADMIN', 'HR', 'TRAINER', 'COMPANY'];
  users: User[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5; // Items per page, adjustable
  totalPages: number = 0;

  constructor(private service: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: () => console.error('Failed to load users')
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.selectedRole || 
        (user.roles && user.roles.includes(this.selectedRole));

      return matchesSearch && matchesRole;
    });
    
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page when searching
    this.applyFilters();
  }

  onRoleChange() {
    this.currentPage = 1; // Reset to first page when changing role
    this.applyFilters();
  }

  // Pagination controls
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  openModal(): void {
    this.newUser = {
      id: 0,
      username: '',
      password: '',
      email: '',
      roles: [],
      firstName: '',
      cin: '',
      lastName: '',
      address: '',
      enabled: true,
      accountLocked: false
    };
    this.rolesInput = '';
  }

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  save() {
    const formData = new FormData();
    formData.append('username', this.newUser.username);
    formData.append('password', this.newUser.password);
    formData.append('email', this.newUser.email);
    formData.append('firstName', this.newUser.firstName);
    formData.append('lastName', this.newUser.lastName);
    formData.append('cin', this.newUser.cin);
    formData.append('address', this.newUser.address);
    if (this.image) {
      formData.append('image', this.image);
    }
    formData.append('roles', this.newUser.roles.join(','));
    
    this.service.register(formData).subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers(); // Refresh list after adding
      },
      error: (err) => console.error('ajout failed', err)
    });
  }

  closeModal(): void {
    this.newUser = {
      id: 0,
      username: '',
      password: '',
      email: '',
      roles: [],
      firstName: '',
      cin: '',
      lastName: '',
      address: '',
      enabled: true,
      accountLocked: false
    };
    this.rolesInput = '';

    const modal = document.getElementById('userModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  unblock(id: number) {
    const formData = new FormData();
    formData.append('id', id.toString());
    this.service.unblock(formData).subscribe(() => {
      this.loadUsers(); // Refresh after unblock
    });
  }

  block(id: number) {
    const formData = new FormData();
    formData.append('id', id.toString());
    this.service.block(formData).subscribe(() => {
      this.loadUsers(); // Refresh after block
    });
  }
}