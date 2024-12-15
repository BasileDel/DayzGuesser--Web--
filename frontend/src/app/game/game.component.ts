import {Component, OnInit} from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    standalone: false,
    styleUrl: './game.component.css'
})

export class GameComponent implements OnInit {
  location: any = null; // Données de l'API
  error: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.gameService.getRandomLocation().subscribe({
        next: (data) => {
          this.location = data;
        },
        error: (err) => {
          this.error = 'An error occurred while fetching data.';
          console.error(err);
        }
      });
    }, 2000); // Attendre 1 seconde avant de charger les données
  }

  // Affiche la carte
  isMapExpanded: boolean = false;

  toggleMap(): void {
    this.isMapExpanded = !this.isMapExpanded;
  }

  onLocationSelected(location: { x: number; y: number }): void {
    console.log('User selected location:', location);
    // Garde les coordonnées ou fais une action
  }

}
