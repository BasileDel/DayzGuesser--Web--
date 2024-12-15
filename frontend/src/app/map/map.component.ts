import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [NgClass],
})
export class MapComponent implements OnInit {
  private map!: L.Map; // Instance de la carte Leaflet
  private marker!: L.Marker; // Marqueur unique
  protected isExpanded: boolean = false; // Indique si la carte est pliée ou dépliée

  ngOnInit(): void {
    this.initMap();
  }

  toggleMap(): void {
    this.isExpanded = !this.isExpanded;

    // Recalcule la taille de la carte après basculement
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  private initMap(): void {
    // Définir les limites de la carte
    const bounds = L.latLngBounds(
      L.latLng(-85.0511287798066, -180), // Coin inférieur gauche en coordonnées EPSG:3857
      L.latLng(85.0511287798066, 180)   // Coin supérieur droit
    );

    // Initialisation de la carte
    this.map = L.map('map', {
      center: [0, 0], // Centre initial
      zoom: 2,        // Zoom initial
      maxBounds: bounds, // Limite pour empêcher de sortir de la carte
      maxBoundsViscosity: 1.0, // Forcer les limites
    });

    // Chargement des tuiles depuis MapTiler
    const maptilerTiles = L.tileLayer(
      'https://api.maptiler.com/tiles/649bb2df-b652-4335-abac-af4936dc3d0e/{z}/{x}/{y}.png?key=G56xJT68pizG6yihT24a',
      {
        attribution: '&copy; <a href="https://maptiler.com/">MapTiler</a> &copy; OpenStreetMap contributors',
        tileSize: 512, // Taille des tuiles MapTiler
        zoomOffset: -1, // Décalage adapté aux tuiles 512x512
        minZoom: 0,     // Niveau de zoom minimum valide
        maxZoom: 20,    // Niveau de zoom maximum fourni par MapTiler
        errorTileUrl: 'https://api.maptiler.com/resources/logo.svg', // Tuile d'erreur personnalisée
      }
    );


    // Ajout des tuiles à la carte
    maptilerTiles.addTo(this.map);

    // Gestion des clics sur la carte pour ajouter ou déplacer un marqueur
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.addOrMoveMarker([lat, lng]);
      console.log(`Coordonnées cliquées : X=${lng}, Y=${lat}`);
    });
  }

  private addOrMoveMarker(coordinates: [number, number]): void {
    if (this.marker) {
      // Déplacer le marqueur existant
      this.marker.setLatLng(coordinates);
    } else {
      // Créer un nouveau marqueur
      const markerIcon = L.icon({
        iconUrl: 'assets/pin.png', // Chemin vers l'icône du marqueur
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      this.marker = L.marker(coordinates, { icon: markerIcon }).addTo(this.map);
    }
  }
}
