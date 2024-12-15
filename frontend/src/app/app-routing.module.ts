import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent }, // Route pour la page de jeu
  { path: '**', redirectTo: '' }, // Redirection des routes non trouvées
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
