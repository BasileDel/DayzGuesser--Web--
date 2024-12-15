import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importez ce module
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import {MapComponent} from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MapComponent,
    // Ajoutez-le ici
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
