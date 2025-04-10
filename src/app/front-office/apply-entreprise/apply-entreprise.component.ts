import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';
import { Application, Offre } from '../Models/offre.model';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService


@Component({
  selector: 'app-apply-entreprise',
  templateUrl: './apply-entreprise.component.html',
  styleUrls: ['./apply-entreprise.component.css']
})
export class ApplyEntrepriseComponent implements OnInit {
  appliedOffres: Offre[] = [];
  applications: Application[] = [];
  loading: boolean = true;
  error: string | null = null;
  staticStudentId: number = 123; // Change based on login system

  constructor(private offreService: OffreService, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.loadAppliedOffers();
  }

  loadAppliedOffers(): void {
    this.offreService.getApplications(this.staticStudentId).subscribe({
      next: (applications: Application[]) => {
        console.log('Applications fetched:', applications);
        this.applications = applications; // Store applications
        this.appliedOffres = applications.map(app => app.offre);
        console.log('Applied offers:', this.appliedOffres);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching applications:', err);
        this.loading = false;
        this.error = 'Failed to load applied offers.';
      }
    });
  }

  updateStatus(applicationId: number, status: string): void {
    if (!applicationId) {
      console.error('Application ID is undefined');
      return;
    }

    this.offreService.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        console.log(`Application ${applicationId} status updated to ${status}`);
        this.loadAppliedOffers(); // Refresh list after update
        this.showNotification(`${status.charAt(0).toUpperCase() + status.slice(1)} successfully!`, 'success');


        setTimeout(() => {
          this.offreService.removeApplication(applicationId).subscribe({
            next: () => {
              this.toastr.info('Application auto-removed after 2 minutes');
              this.loadAppliedOffers();
            },
            error: (err) => {
              console.error('Error removing application:', err);
            }
          });
        }, 1 * 60 * 1000); // 2 minutes
      },
      
      
      error: (err) => {
        console.error('Error updating application status:', err);
        this.showNotification('Error updating application status', 'error');
      }
    });
  }

  removeApplicationNow(applicationId: number): void {
  if (confirm('Are you sure you want to withdraw this application?')) {
    this.offreService.removeApplication(applicationId).subscribe({
      next: () => {
        this.toastr.success(
          'Application removed successfully',
          'Student Applied Offers',
          {
            positionClass: 'toast-top-right', // Move to top-right
            progressBar: true,
            closeButton: true,
            enableHtml: true,
            timeOut: 4000,
          }
        );
        this.loadAppliedOffers();
      },
      error: (err) => {
        console.error('Error removing application:', err);
        this.toastr.error('Failed to remove application', 'Error', {
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
        });
      },
    });
  }
}

showNotification(message: string, type: string): void {
  const toastOptions = {
    positionClass: 'toast-top-right', // Move to top-right
    timeOut: 4000,
    progressBar: true,
    closeButton: true,
    enableHtml: true,
    easing: 'ease-in-out',
    easeTime: 300,
  };

  switch (type) {
    case 'success':
      this.toastr.success(message, 'Student Applied Offers', toastOptions);
      break;
    case 'error':
      this.toastr.error(message, 'Error', toastOptions);
      break;
    case 'info':
      this.toastr.info(message, 'Info', toastOptions);
      break;
    default:
      this.toastr.show(message, 'Notification', toastOptions);
      break;
  }
}
  
  

  

  
  
  
  
  
}  
