import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-insertion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, Navbar],
  templateUrl: './insertion.html',
  styleUrl: './insertion.css',
})
export class Insertion {
  stats = [
    { label: 'Sortants vers auto-emploi', valeur: 42 },
    { label: 'Sortants vers emploi salarié', valeur: 68 },
    { label: 'Partenaires actifs', valeur: 17 },
  ];
}
