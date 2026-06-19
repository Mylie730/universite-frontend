import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Navbar } from '../../shared/navbar/navbar';
import { InsertionService } from '../../core/services/insertion';

@Component({
  selector: 'app-insertion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule, Navbar],
  templateUrl: './insertion.html',
  styleUrl: './insertion.css',
})
export class Insertion implements OnInit {
  stats = [
    { label: 'Sortants vers auto-emploi', valeur: 0 },
    { label: 'Sortants vers emploi salarié', valeur: 0 },
  ];

  constructor(
    private insertionService: InsertionService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.insertionService.getStats().subscribe({
      next: (data) => {
        this.stats = [
          { label: 'Sortants vers auto-emploi', valeur: data.autoEmploi ?? 0 },
          { label: 'Sortants vers emploi salarié', valeur: data.emploiSalarie ?? 0 },
        ];
      },
      error: () => {
        this.snackBar.open('Impossible de charger les statistiques d’insertion', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-warn'],
        });
      },
    });
  }
}
