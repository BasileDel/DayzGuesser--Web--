import { Component } from '@angular/core';


// suppression de la barre de défilement
document.documentElement.style.overflow = 'hidden'; // Empêche le défilement par défaut
document.documentElement.style.overflowY = 'scroll'; // Active le défilement vertical
document.documentElement.style.scrollbarWidth = 'none'; // Cache la barre pour Firefox

const styleElement = document.createElement('style');
styleElement.innerHTML = `
  body::-webkit-scrollbar {
    display: none; /* Cache la barre pour Chrome, Safari et Edge */
  }
`;
document.head.appendChild(styleElement);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
