import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-espace-td',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, Navbar],
  templateUrl: './espace-td.html',
  styleUrl: './espace-td.css',
})
export class EspaceTd {
  tds = [
    {
      titre: 'TD Angular - Composants',
      cours: 'Développement Web',
      dateLimite: '2026-06-12',
      statut: 'À rendre',
    },
    {
      titre: 'TD SQL - Requêtes jointures',
      cours: 'Base de Données',
      dateLimite: '2026-06-18',
      statut: 'En cours',
    },
  ];
}
