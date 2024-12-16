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
  isLoading: boolean = true; // Indicateur de chargement

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

  private initMap(): void {
    // Étendue de l'image géoréférencée avec L.latLngBounds
    const imageBounds = L.latLngBounds(
      [0, 0],        // Coin inférieur gauche (ymin, xmin)
      [15360, 15360] // Coin supérieur droit (ymax, xmax)
    );

    // Initialisation de la carte
    this.map = L.map('map', {
      center: [9680, 7680], // Centre de la carte
      zoom: 0,              // Zoom initial (dézoomé)
      minZoom: -3,          // Permet de dézoomer davantage
      maxZoom: 3,           // Niveau de zoom maximum
      crs: L.CRS.Simple,    // Utiliser une projection plate (pixels)
      maxBounds: imageBounds, // Empêche de sortir des limites
      maxBoundsViscosity: 1.0,
    });

    // Ajouter l'image géoréférencée avec ImageOverlay
    const imageUrl = 'assets/georeferenced/day-z-sakhal-watermarked_georeferenced.png'; // Chemin vers l'image locale
    const imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
      opacity: 1.0,
      interactive: true,
    });

    imageOverlay.addTo(this.map);

    // Ajuster la vue pour englober toute l'image
    this.map.fitBounds(imageBounds);

    // Gestion des événements de chargement
    imageOverlay.on('loading', () => {
      this.isLoading = true;
    });

    imageOverlay.on('load', () => {
      this.isLoading = false;
    });

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
