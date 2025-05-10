import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Use CommonModule, NOT BrowserModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Add other shared imports as needed

@NgModule({
  imports: [
    CommonModule, // Correct for shared modules
    FormsModule,
    ReactiveFormsModule,
    // Other shared imports
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Export other shared components, directives, or pipes
  ],
  declarations: [
    // Shared components, directives, or pipes
  ]
})
export class SharedModule { }