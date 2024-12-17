import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  isLoading: boolean = true; // Indicateur de chargement
  @Output() userGuess = new EventEmitter<[number, number]>(); // Événement pour signaler les coordonnées cliquées

  ngOnInit(): void {
    this.initMap();
  }

  toggleMap(): void {
    this.isExpanded = !this.isExpanded;

    // Recalcule la taille de la carte après basculement
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 300);
  }

  resetMap(): void {
    this.map.eachLayer((layer) => {
      if (!(layer instanceof L.ImageOverlay)) {
        this.map.removeLayer(layer);
      }
    });
    this.marker = null!;
  }

  private initMap(): void {
    const imageBounds = L.latLngBounds(
      [0, 0],        // Coin inférieur gauche (ymin, xmin)
      [15360, 15360] // Coin supérieur droit (ymax, xmax)
    );

    // Initialisation de la carte
    this.map = L.map('map', {
      center: [7680, 7680], // Centre de la carte
      zoom: 0,              // Zoom initial (dézoomé)
      minZoom: -2,          // Permet de dézoomer davantage
      maxZoom: 3,           // Niveau de zoom maximum
      crs: L.CRS.Simple,    // Utiliser une projection plate (pixels)
      maxBounds: imageBounds, // Empêche de sortir des limites
      maxBoundsViscosity: 1.0,
      zoomControl: false,   // Désactive les boutons de zoom
      attributionControl: false, // Désactive le texte d'attribution
    });

    const imageUrl = 'assets/georeferenced/day-z-sakhal-watermarked_georeferenced.png'; // Chemin vers l'image locale
    const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
      opacity: 1.0,
      interactive: true,
    });

    imageOverlay.on('loading', () => {
      this.isLoading = true; // La carte charge encore
    });

    imageOverlay.on('load', () => {
      this.isLoading = false; // La carte est complètement chargée
    });

    imageOverlay.addTo(this.map);

    this.map.fitBounds(imageBounds);

    // Gestion des clics sur la carte pour ajouter ou déplacer un marqueur
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.addOrMoveMarker([lat, lng]);
      this.userGuess.emit([lat, lng]); // Signale les coordonnées cliquées
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
