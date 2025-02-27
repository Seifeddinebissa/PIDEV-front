import { Component, OnInit } from '@angular/core';
import { OffreService } from '../services/offre.service';  
import { Offre } from '../Models/offre.model'; 
import { MatDialog } from '@angular/material/dialog';
import { UpdateOffreModalComponent } from 'src/app/front-office/update-offre-modal/update-offre-modal.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-offre',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  
  offres: Offre[] = []; 
  loading: boolean = true;  
  error: string | null = null;  

  constructor(
    private offreService: OffreService,
    public dialog: MatDialog,
    private router: Router
  ) {} 


  deleteOffre(id: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.loading = true;
      this.offreService.deleteOffre(id).subscribe(
        (response) => {
          console.log('Response from backend:', response); 
          this.offres = this.offres.filter(offer => offer.id !== id);
          this.loading = false;
        },
        (error) => {
          console.error('Failed to delete offer:', error);  
          this.error = 'Failed to delete offer';
          this.loading = false;
        }
      );
    }
  }
  
  openUpdateDialog(offer: Offre): void {
    const dialogRef = this.dialog.open(UpdateOffreModalComponent, {
      width: '800px',
      data: offer, 
      position: { top: '10%', left: '40%' }, 
      panelClass: 'custom-dialog-container'
    });
  
    dialogRef.afterClosed().subscribe((result: Offre) => {
      if (result) {
        this.updateOffre(result); 
      }
    });
  }
  

  updateOffre(updatedOffer: Offre): void {
    this.loading = true;

    this.offreService.updateOffre(updatedOffer.id, updatedOffer).subscribe(
      (response) => {
        console.log('Offer updated successfully:', response);

        const index = this.offres.findIndex(offer => offer.id === updatedOffer.id);
        if (index !== -1) {
          this.offres[index] = response;  
        }

        this.loading = false;
      },
      (error) => {
        console.error('Failed to update offer:', error);
        this.error = 'Failed to update offer';
        this.loading = false;
      }
    );
  }


  

  goToPage(): void {
    this.router.navigate(['/create-offre']);  // Replace '/desired-page' with the actual path
  }

  ngOnInit(): void {
    // Use the service to get the data
    this.offreService.getOffres().subscribe(
      (data) => {
        this.offres = data;  // Store the data in the offres array
        this.loading = false;  // Set loading to false once data is fetched
      },
      (error) => {
        console.error('Error fetching data:', error);  // Handle error
        this.loading = false;  // Set loading to false when there is an error
        this.error = 'There was an error fetching the offers. Please try again later.';  // Display a user-friendly error message
      }
    );
  }
}
export { Offre };

