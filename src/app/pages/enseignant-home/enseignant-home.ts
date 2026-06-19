import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Navbar } from '../../shared/navbar/navbar';
import { FormationResponse, FormationService } from '../../core/services/formation';

@Component({
  selector: 'app-enseignant-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Navbar],
  templateUrl: './enseignant-home.html',
  styleUrl: './enseignant-home.css',
})
export class EnseignantHome implements OnInit {
  actions = [
    { titre: 'Préparer mes cours', icon: 'menu_book', route: '/formations' },
    { titre: 'Suivre les étudiants', icon: 'school', route: '/etudiants' },
    { titre: 'Communication pédagogique', icon: 'campaign', route: '/communication' },
  ];

  formations: FormationResponse[] = [];

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.formationService
      .getAll()
      .pipe(
        switchMap((formations) => {
          const safeFormations = formations ?? [];
          if (safeFormations.length === 0) {
            return of([]);
          }

          const needFallback = safeFormations.some((f) => !f.matieres);
          if (!needFallback) {
            return of(safeFormations);
          }

          return forkJoin(
            safeFormations.map((formation) =>
              this.formationService.getMatieresByFormation(formation.id).pipe(
                map((matieres) => ({
                  ...formation,
                  matieres: matieres ?? [],
                })),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (data) => (this.formations = data ?? []),
        error: () => (this.formations = []),
      });
  }
}
