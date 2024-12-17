import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../services/game.service';
import { MapService } from '../services/map.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: false,
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  location: any = null; // Données de l'API
  error: string | null = null;

  // Initialisation des variables
  isLoading: boolean = false;
  rounds: number = 5;
  currentRound: number = 1;
  timer: number = 90;
  interval: any;

  totalScore: number = 0;
  roundScores: number[] = [];
  correctAnswer: [number, number] = [0, 0]; // Coordonnées par défaut
  userGuess: [number, number] | null = null;

  gameState: 'playing' | 'reviewing' | 'end' = 'playing';
  isMapDisabled: boolean = false;

  constructor(private gameService: GameService, private mapService: MapService) {}

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  ngOnInit(): void {
    this.startGame();
  }

  /* ---------------------------- Charger une localisation ---------------------------- */
  randomLocationScreenshot(): void {
    this.isLoading = true;
    this.gameService.getRandomLocation().subscribe({
      next: (data) => {
        this.location = data;

        // Mise à jour des coordonnées correctes
        this.correctAnswer = [data.xCoordinate, data.yCoordinate];
        console.log(`Coordonnées correctes : X=${data.xCoordinate}, Y=${data.yCoordinate}`);

        this.isLoading = false; // Désactive le chargement
      },
      error: (err) => {
        this.error = 'An error occurred while fetching data.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  /* ---------------------------- Méthodes de jeu ---------------------------- */
  startGame(): void {
    this.currentRound = 1;
    this.totalScore = 0;
    this.roundScores = [];
    this.startRound();
  }

  startRound(): void {
    this.timer = 90;
    this.userGuess = null;
    this.gameState = 'playing';
    this.isMapDisabled = false;

    this.mapService.enableInteractions((event: L.LeafletMouseEvent) => {
      this.mapComponent['addOrMoveMarker']([event.latlng.lat, event.latlng.lng]);
      this.mapComponent.userGuess.emit([event.latlng.lat, event.latlng.lng]);
    });

    this.randomLocationScreenshot(); // Récupère une nouvelle localisation
    this.startTimer();
  }

  startTimer(): void {
    this.stopTimer();
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.submitGuess();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  submitGuess(): void {
    if (!this.userGuess) {
      console.log('Temps écoulé, aucun guess fait.');
      this.userGuess = null;
    }
    this.finishRound();
  }

  private finishRound(): void {
    this.isMapDisabled = true;
    this.mapService.disableInteractions();
    this.stopTimer();
    this.gameState = 'reviewing';
    this.calculateScore();

    this.mapService.addMarkersAndLine(this.userGuess!, this.correctAnswer);
    this.mapService.expandMap();
  }

  nextRound(): void {
    if (this.currentRound < this.rounds) {
      this.currentRound++;
      this.startRound();
    } else {
      this.endGame();
    }
  }

  calculateScore(): void {
    if (!this.userGuess) {
      this.roundScores.push(0);
      return;
    }

    const distance = this.getDistance(this.userGuess, this.correctAnswer);
    const timeBonus = this.timer * 10;

    const roundScore = Math.max(10000 - distance - timeBonus, 0);
    const roundedScore = Math.floor(roundScore);

    this.roundScores.push(roundedScore);
    this.totalScore += roundedScore;
  }

  endGame(): void {
    this.gameState = 'end';
    this.stopTimer();
  }

  getDistance(guess: [number, number], correct: [number, number]): number {
    const dx = guess[0] - correct[0];
    const dy = guess[1] - correct[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  handleUserGuess(guess: [number, number]): void {
    this.userGuess = guess;
  }
}
