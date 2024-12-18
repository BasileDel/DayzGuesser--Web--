import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapInstance!: L.Map;
  private clickHandler!: (event: L.LeafletMouseEvent) => void;
  private isToggleHidden: boolean = false; // État pour cacher le bouton

  setMapInstance(map: L.Map): void {
    this.mapInstance = map;
  }

  disableInteractions(): void {
    if (!this.mapInstance) return;

    // this.mapInstance.dragging.disable();
    // this.mapInstance.touchZoom.disable();
    // this.mapInstance.doubleClickZoom.disable();
    // this.mapInstance.scrollWheelZoom.disable();
    // this.mapInstance.boxZoom.disable();
    // this.mapInstance.keyboard.disable();

    this.mapInstance.off('click'); // Désactive le clic uniquement
  }

  enableInteractions(clickHandler: (event: L.LeafletMouseEvent) => void): void {
    if (!this.mapInstance) return;

    this.mapInstance.dragging.enable();
    this.mapInstance.touchZoom.enable();
    this.mapInstance.doubleClickZoom.enable();
    this.mapInstance.scrollWheelZoom.enable();
    this.mapInstance.boxZoom.enable();
    this.mapInstance.keyboard.enable();

    // Réactive explicitement le clic
    this.mapInstance.on('click', clickHandler);
  }

  addMarkersAndLine(userGuess: [number, number], correctAnswer: [number, number]): void {
    if (this.mapInstance) {
      // Nettoyer les anciens marqueurs et lignes
      this.mapInstance.eachLayer((layer) => {
        if (!(layer instanceof L.ImageOverlay)) {
          this.mapInstance.removeLayer(layer);
        }
      });

      // Ajouter le marqueur pour la réponse correcte (rouge)
      const correctIcon = L.icon({
        iconUrl: 'assets/pin/LocationPin.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const correctMarker = L.marker(correctAnswer, { icon: correctIcon }).addTo(this.mapInstance);

      // Ajouter le marqueur pour la position utilisateur (bleu)
      const userIcon = L.icon({
        iconUrl: 'assets/pin/GuessPin.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const userMarker = L.marker(userGuess, { icon: userIcon }).addTo(this.mapInstance);

      // Tracer la ligne en pointillés entre les deux points
      const line = L.polyline([userGuess, correctAnswer], {
        color: 'black',
        dashArray: '5, 10',
        weight: 3,
      }).addTo(this.mapInstance);

      // Calculer le point médian entre les deux positions
      const midPoint: [number, number] = [
        (userGuess[0] + correctAnswer[0]) / 2, // Moyenne des latitudes
        (userGuess[1] + correctAnswer[1]) / 2, // Moyenne des longitudes
      ];

      this.recenterAndZoom(userGuess, correctAnswer);

      // Recentrer la carte sur le point médian avec un niveau de zoom adapté
      // this.mapInstance.setView(midPoint, -5); // Niveau de zoom 0 pour bien voir les pins et la ligne
    }
  }

  calculateDynamicZoom(distance: number): number {
    if (distance < 1000) {
      return -2; // Zoom proche si les points sont proches
    } else if (distance < 3000) {
      return -3; // Zoom moyen
    } else if (distance < 6000) {
      return -4; // Zoom éloigné
    } else {
      return -5; // Zoom très éloigné pour de grandes distances
    }
  }

  recenterAndZoom(userGuess: [number, number], correctAnswer: [number, number]): void {
    if (!this.mapInstance) return;

    // Calculer le point médian
    const midPoint: [number, number] = [
      (userGuess[0] + correctAnswer[0]) / 2,
      (userGuess[1] + correctAnswer[1]) / 2,
    ];

    // Calculer la distance entre les deux points
    const distance = this.calculateDistance(userGuess, correctAnswer);
    console.log(`Distance between points: ${distance} meters`);

    // Déterminer un niveau de zoom dynamique
    const zoomLevel = this.calculateDynamicZoom(distance);

    // Appliquer le point médian et le niveau de zoom
    this.mapInstance.setView(midPoint, zoomLevel);

    console.log(`Recentering map to midpoint ${midPoint} with zoom level ${zoomLevel}`);
  }

  // Méthode pour calculer la distance entre deux points
  calculateDistance(pointA: [number, number], pointB: [number, number]): number {
    const dx = pointB[0] - pointA[0]; // Différence en X
    const dy = pointB[1] - pointA[1]; // Différence en Y

    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.round(distance); // Retourne la distance arrondie
  }


  /* ---------------------------- Methods button ---------------------------- */
  hideToggleButton(): void {
    this.isToggleHidden = true; // Masque le bouton
  }

  showToggleButton(): void {
    this.isToggleHidden = false; // Affiche le bouton
  }

  isToggleButtonHidden(): boolean {
    return this.isToggleHidden; // Retourne l'état d'affichage
  }
}
