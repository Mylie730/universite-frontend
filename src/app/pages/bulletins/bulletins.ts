import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-bulletins',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, Navbar],
  templateUrl: './bulletins.html',
  styleUrl: './bulletins.css',
})
export class Bulletins {
  displayedColumns: string[] = ['cours', 'note', 'moyenne', 'mention', 'semestre'];

  bulletins = [
    { cours: 'Développement Web', note: 16, moyenne: 14.2, mention: 'Bien', semestre: 'S1' },
    { cours: 'Base de Données', note: 14, moyenne: 13.5, mention: 'Assez bien', semestre: 'S1' },
    { cours: 'Algorithmique', note: 17, moyenne: 15.1, mention: 'Bien', semestre: 'S2' },
  ];
}
