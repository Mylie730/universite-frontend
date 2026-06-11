import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-etudiant-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Sidebar],
  templateUrl: './etudiant-home.html',
  styleUrl: './etudiant-home.css',
})
export class EtudiantHome {
  cards = [
    {
      title: 'Mes cours',
      description: 'Consultez votre planning de cours et les contenus pédagogiques.',
      icon: 'menu_book',
      route: '/mes-cours',
    },
    {
      title: 'Mes notes',
      description: 'Visualisez vos notes et résultats d’évaluations.',
      icon: 'grade',
      route: '/mes-notes',
    },
    {
      title: 'Mon profil',
      description: 'Accédez à vos informations personnelles et académiques.',
      icon: 'person',
      route: '/etudiants',
    },
  ];
}
