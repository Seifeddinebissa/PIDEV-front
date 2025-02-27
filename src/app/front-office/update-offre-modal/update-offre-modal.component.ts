import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Offre } from 'src/app/front-office/offer/offer.component'; 
@Component({
  selector: 'app-update-offre-modal',
  templateUrl: './update-offre-modal.component.html',
  styleUrls: ['./update-offre-modal.component.css']
})
export class UpdateOffreModalComponent {
  updatedOffer: Offre;

  constructor(
    public dialogRef: MatDialogRef<UpdateOffreModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Offre 
  ) {
    this.updatedOffer = { ...data };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    this.dialogRef.close(this.updatedOffer);
  }
}
