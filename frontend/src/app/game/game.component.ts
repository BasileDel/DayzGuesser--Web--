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

  /* ---------------------------- Random loading ScreeShot ---------------------------- */
  ngOnInit(): void {
    this.randomLocationScreenshot();
    this.startGame();
  }


  randomLocationScreenshot(): void {
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
    }, 2000);
  } // Attendre 1 seconde avant de charger les données



  /* ---------------------------- Round Method ---------------------------- */
  // Initialisation
  rounds: number = 5;
  currentRound: number = 1;
  timer: number = 90;
  interval: any;

  totalScore: number = 0;
  roundScores: number[] = [];

  correctAnswer: [number, number] = [7680, 7680];
  userGuess: [number, number] | null = null;

  gameState: 'playing' | 'reviewing' | 'end' = 'playing';
  isMapDisabled: boolean = false; // Par défaut, la carte est interactive


  // Timer
  startGame(): void {
    this.currentRound = 1;
    this.totalScore = 0;
    this.roundScores = [];
    this.startRound();
  }

  startRound(): void {
    this.timer = 90; // Réinitialise le timer
    this.userGuess = null; // Réinitialise le guess utilisateur
    this.gameState = 'playing'; // Passe à l'état de jeu
    this.startTimer(); // Démarre le timer automatiquement
  }

  startTimer(): void {
    this.stopTimer(); // Stoppe le timer précédent, si nécessaire
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.submitGuess(); // Passe automatiquement au guess si le temps est écoulé
      }
    }, 1000); // Décompte toutes les secondes
  }

  stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval); // Stoppe le timer en cours
    }
  }

  submitGuess(): void {
    this.stopTimer(); // Stoppe le timer une fois que le guess est soumis
    this.isMapDisabled = true; // Désactive la carte en ajoutant le voile

    this.gameState = 'reviewing'; // Passe à l'état de révision (affiche les réponses)

    this.calculateScore(); // Calcule le score
    setTimeout(() => this.nextRound(), 3000); // Passe au prochain round après un délai
  }

  nextRound(): void {
    if (this.currentRound < this.rounds) {
      this.currentRound++;
      this.randomLocationScreenshot(); // Charge une nouvelle image
      this.isMapDisabled = false; // Réactive la carte
      this.startRound(); // Démarre le round suivant
    } else {
      this.endGame(); // Termine le jeu après le dernier round
    }
  }

  calculateScore(): void {
    if (!this.userGuess) return; // Si aucun guess, pas de score

    const distance = this.getDistance(this.userGuess, this.correctAnswer);
    const timeBonus = this.timer * 10;

    // Calcul du score et suppression des chiffres après la virgule
    const roundScore = Math.max(10000 - distance - timeBonus, 0);
    const roundedScore = Math.floor(roundScore); // Supprime les chiffres après la virgule

    this.roundScores.push(roundedScore); // Enregistrer le score arrondi pour le round
    this.totalScore += roundedScore; // Ajouter au score total
  }


  endGame(): void {
    this.gameState = 'end'; // Passe à l'état de fin de jeu
    this.stopTimer(); // Arrête le timer si ce n'est pas fait
  }

  getDistance(guess: [number, number], correct: [number, number]): number {
    const dx = guess[0] - correct[0];
    const dy = guess[1] - correct[1];
    return Math.sqrt(dx * dx + dy * dy); // Calcule la distance entre les deux points
  }

  handleUserGuess(guess: [number, number]): void {
    this.userGuess = guess; // Met à jour la position cliquée
    console.log('User Guess:', this.userGuess); // Optionnel : pour vérifier les coordonnées
  }



}
