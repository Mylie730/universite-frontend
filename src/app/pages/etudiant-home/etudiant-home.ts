import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-etudiant-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Sidebar, Navbar],
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
      title: 'Emploi du temps',
      description: 'Consultez votre emploi du temps fixé par l’administration.',
      icon: 'calendar_month',
      route: '/emploi-du-temps',
    },
    {
      title: 'Mon profil',
      description: 'Accédez à vos informations personnelles et académiques.',
      icon: 'person',
      route: '/mon-compte',
    },
  ];
}
