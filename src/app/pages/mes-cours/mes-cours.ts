import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Sidebar } from '../../shared/sidebar/sidebar';
import {
  FormationResponse,
  FormationService,
  MatiereResponse,
} from '../../core/services/formation';
import { CoursResponse, CoursService } from '../../core/services/cours';

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [CommonModule, MatCardModule, Sidebar],
  templateUrl: './mes-cours.html',
  styleUrl: './mes-cours.css',
})
export class MesCours implements OnInit {
  formations: FormationResponse[] = [];
  loading = false;
  errorMessage = '';
  selectedMatiereId: number | null = null;
  coursByMatiere: Record<number, CoursResponse[]> = {};
  loadingCoursByMatiere: Record<number, boolean> = {};
  private readonly backendBaseUrl = 'http://localhost:8080';

  constructor(
    private formationService: FormationService,
    private coursService: CoursService,
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  private normalizeUrl(url?: string | null): string | undefined {
    const value = (url ?? '').trim();

    if (!value) {
      return undefined;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith('/')) {
      return `${this.backendBaseUrl}${value}`;
    }

    return `${this.backendBaseUrl}/${value}`;
  }

  private normalizeCours(cours: CoursResponse): CoursResponse {
    return {
      ...cours,
      lienPdfCours: this.normalizeUrl(cours.lienPdfCours),
      lienPdfTd: this.normalizeUrl(cours.lienPdfTd),
      lienMeet: cours.lienMeet ?? undefined,
    };
  }

  private normalizeMatiere(matiere: MatiereResponse): MatiereResponse {
    return {
      ...matiere,
      lienPdfCours: this.normalizeUrl(matiere.lienPdfCours),
      lienPdfTd: this.normalizeUrl(matiere.lienPdfTd),
    };
  }

  private normalizeFormation(formation: FormationResponse): FormationResponse {
    return {
      ...formation,
      nom: formation.nom ?? (formation as unknown as { nomFormation?: string }).nomFormation ?? '',
      matieres: (formation.matieres ?? []).map((m) => this.normalizeMatiere(m)),
    };
  }

  loadFormations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationService
      .getAll()
      .pipe(
        map((formations) => (formations ?? []).map((f) => this.normalizeFormation(f))),
        switchMap((formations) => {
          if (formations.length === 0) {
            return of([]);
          }

          const needFallback = formations.some((f) => !f.matieres || f.matieres.length === 0);
          if (!needFallback) {
            return of(formations);
          }

          return forkJoin(
            formations.map((formation) =>
              this.formationService.getMatieresByFormation(formation.id).pipe(
                map((matieres) => ({
                  ...formation,
                  matieres: (matieres ?? formation.matieres ?? []).map((m) =>
                    this.normalizeMatiere(m),
                  ),
                })),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (data) => {
          this.formations = (data ?? []).map((f) => this.normalizeFormation(f));
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement formations /mes-cours:', error);
          this.formations = [];
          this.errorMessage = 'Impossible de charger les cours pour le moment.';
          this.loading = false;
        },
      });
  }

  private normalizeText(value: string | undefined | null): string {
    return (value ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private isCoursMatchingMatiere(
    coursNom: string | undefined,
    matiereNom: string | undefined,
  ): boolean {
    const cours = this.normalizeText(coursNom);
    const matiere = this.normalizeText(matiereNom);

    if (!cours || !matiere) {
      return false;
    }

    return cours === matiere || cours.includes(matiere) || matiere.includes(cours);
  }

  toggleMatiereResources(matiere: MatiereResponse, formationId: number): void {
    if (this.selectedMatiereId === matiere.id) {
      this.selectedMatiereId = null;
      return;
    }

    this.selectedMatiereId = matiere.id;

    if (this.coursByMatiere[matiere.id]) {
      return;
    }

    this.loadingCoursByMatiere[matiere.id] = true;

    this.coursService.getAll(formationId).subscribe({
      next: (cours) => {
        const coursAssocies = (cours ?? [])
          .map((c) => this.normalizeCours(c))
          .filter((c) => this.isCoursMatchingMatiere(c.nom, matiere.nom));
        this.coursByMatiere[matiere.id] = coursAssocies;
        this.loadingCoursByMatiere[matiere.id] = false;
      },
      error: (error) => {
        console.error('Erreur chargement ressources matière:', error);
        this.coursByMatiere[matiere.id] = [];
        this.loadingCoursByMatiere[matiere.id] = false;
      },
    });
  }

  hasResources(cours: CoursResponse): boolean {
    return !!(cours.lienPdfCours || cours.lienPdfTd || cours.lienMeet);
  }
}
