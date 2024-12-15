import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [
    NgClass
  ]
})
export class MapComponent implements OnInit {
  map!: Map; // La carte OpenLayers
  marker!: Feature<Point>; // Un seul marqueur
  vectorSource!: VectorSource; // Source des données vectorielles
  markerLayer!: VectorLayer<VectorSource>; // Couche vectorielle pour afficher le marqueur
  isExpanded: boolean = false; // Indique si la carte est pliée ou dépliée

  ngOnInit(): void {
    this.initMap();
  }

  toggleMap(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Initialisation de la carte et des couches.
   */
  private initMap(): void {
    // Création de la source vectorielle pour les marqueurs
    this.vectorSource = new VectorSource();

    // Création de la couche vectorielle pour les marqueurs
    this.markerLayer = new VectorLayer({
      source: this.vectorSource,
    });

    // Initialisation de la carte
    this.map = new Map({
      target: 'map', // ID de l'élément HTML où la carte sera affichée
      layers: [
        new TileLayer({
          source: new OSM(), // Source OpenStreetMap
        }),
        this.markerLayer, // Ajout de la couche de marqueurs
      ],
      view: new View({
        center: fromLonLat([0, 0]), // Centre initial en coordonnées géographiques
        zoom: 2, // Niveau de zoom initial
      }),
    });

    // Ajout d'un événement de clic sur la carte
    this.map.on('singleclick', (event) => {
      const coordinates = event.coordinate; // Récupérer les coordonnées du clic
      console.log('Coordonnées cliquées :', coordinates);

      // Ajouter ou déplacer un marqueur sur la carte
      this.addOrMoveMarker(coordinates);
    });
  }

  /**
   * Ajoute un marqueur ou déplace un marqueur existant.
   * @param coordinates Les coordonnées du clic.
   */
  private addOrMoveMarker(coordinates: number[]): void {
    if (this.marker) {
      // Si le marqueur existe, on le déplace
      const geometry = this.marker.getGeometry() as Point;
      geometry.setCoordinates(coordinates);
    } else {
      // Sinon, on crée un nouveau marqueur
      this.marker = new Feature({
        geometry: new Point(coordinates),
      });

      // Style du marqueur (cercle rouge avec bordure blanche)
      const markerStyle = new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#FF0000', // Rouge
          }),
          stroke: new Stroke({
            color: '#FFFFFF', // Blanc
            width: 2,
          }),
        }),
      });

      this.marker.setStyle(markerStyle);

      // Ajout du marqueur à la source vectorielle
      this.vectorSource.addFeature(this.marker);
    }
  }
}
