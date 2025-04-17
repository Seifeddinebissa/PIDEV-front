import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PageResponse } from 'src/app/back-office/models/Entreprise';
import { EntrepriseService } from 'src/app/back-office/services/entreprise.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  
  // Define custom icon
  private customIcon = L.icon({
    iconUrl: 'assets/img/iconmap.gif', // Path to your custom icon
    iconSize: [25, 41],    // Size of the icon [width, height]
    iconAnchor: [12, 41],  // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34]  // Point from which the popup should open relative to the iconAnchor
  });

  constructor(private entrepriseService: EntrepriseService) {}

  ngOnInit(): void {
    this.initMap();
    this.loadEntreprises();
  }

  private initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      (response: PageResponse<any>) => {
        response.content.forEach(entreprise => {
          if (entreprise.latitude && entreprise.longitude) {
            const marker = L.marker([entreprise.latitude, entreprise.longitude], {
              icon: this.customIcon  // Apply the custom icon here
            })
              .addTo(this.map)
              .bindPopup(`
                <b>${entreprise.name}</b><br>
                ${entreprise.sector}<br>
                ${entreprise.location}
              `);
            this.markers.push(marker);
          }
        });
      },
      (error) => {
        console.error('Error loading entreprises:', error);
      }
    );
  }
}