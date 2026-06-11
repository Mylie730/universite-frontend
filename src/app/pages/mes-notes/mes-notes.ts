import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [CommonModule, MatCardModule, Sidebar],
  templateUrl: './mes-notes.html',
  styleUrl: './mes-notes.css',
})
export class MesNotes {
  notes = [
    { matiere: 'Technologie Web', note: 15, coefficient: 3 },
    { matiere: 'Base de Données', note: 14, coefficient: 2 },
    { matiere: 'Architecture Logicielle', note: 16, coefficient: 3 },
  ];
}
