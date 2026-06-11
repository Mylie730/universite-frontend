import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [CommonModule, MatCardModule, Sidebar],
  templateUrl: './mes-cours.html',
  styleUrl: './mes-cours.css',
})
export class MesCours {
  cours = [
    { nom: 'Technologie Web', enseignant: 'M. Diallo', horaire: 'Lundi 10:00 - 12:00' },
    { nom: 'Base de Données', enseignant: 'Mme Ndiaye', horaire: 'Mardi 14:00 - 16:00' },
    { nom: 'Architecture Logicielle', enseignant: 'M. Ba', horaire: 'Jeudi 08:00 - 10:00' },
  ];
}
