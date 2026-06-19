import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Navbar } from '../../shared/navbar/navbar';
import { EtudiantService } from '../../core/services/etudiant';
import { FormationService } from '../../core/services/formation';

@Component({
  selector: 'app-etudiants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule,
    Navbar,
  ],
  templateUrl: './etudiants.html',
  styleUrls: ['./etudiants.css'],
})
export class Etudiants implements OnInit {
  etudiants: any[] = [];
  displayedColumns: string[] = [
    'id',
    'ine',
    'nom',
    'prenom',
    'genre',
    'formation',
    'promo',
    'anneeDebut',
    'anneeSortie',
    'actions',
  ];

  loading = false;
  saving = false;
  searchQuery = '';
  editingId: number | null = null;

  etudiantForm: FormGroup;
  formations: any[] = [];

  constructor(
    private etudiantService: EtudiantService,
    private formationService: FormationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.etudiantForm = this.fb.group({
      ine: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      genre: ['', Validators.required],
      formationId: [null, Validators.required],
      promo: ['', Validators.required],
      anneeDebut: ['', Validators.required],
      anneeSortie: ['', Validators.required],
      diplomes: [''],
      autresFormations: [''],
    });
  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.loading = true;
    this.etudiantService.getAllEtudiants().subscribe({
      next: (data) => {
        this.etudiants = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('Impossible de charger les étudiants', 'warn');
      },
    });
  }

  search(): void {
    if (!this.searchQuery?.trim()) {
      this.loadEtudiants();
      return;
    }

    this.loading = true;
    this.etudiantService.searchEtudiants(this.searchQuery.trim()).subscribe({
      next: (data) => {
        this.etudiants = data?.content ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('Erreur lors de la recherche', 'warn');
      },
    });
  }

  submitEtudiant(): void {
    if (this.etudiantForm.invalid) {
      this.etudiantForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.etudiantForm.value;
    const payload = {
      ine: formValue.ine,
      nom: formValue.nom,
      prenom: formValue.prenom,
      dateNaissance: formValue.dateNaissance,
      genre: formValue.genre,
      promo: formValue.promo,
      anneeDebut: formValue.anneeDebut,
      anneeSortie: formValue.anneeSortie,
      diplomes: formValue.diplomes,
      autresFormations: formValue.autresFormations,
      formation: formValue.formationId ? { id: Number(formValue.formationId) } : null,
    };

    const request$ = this.editingId
      ? this.etudiantService.updateEtudiant(this.editingId, payload)
      : this.etudiantService.createEtudiant(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.notify(
          this.editingId ? 'Dossier étudiant mis à jour' : 'Étudiant inscrit avec succès',
          'success',
        );
        this.resetForm();
        this.loadEtudiants();
      },
      error: (error) => {
        this.saving = false;

        if (error?.status === 403) {
          this.notify(
            "Inscription refusée: vous n'avez pas les droits (profil requis: ADMIN, PROFESSEUR ou RESPONSABLE_FORMATION)",
            'warn',
          );
          return;
        }

        const backendMessage = error?.error?.message;
        const validationErrors = error?.error?.errors
          ? Object.values(error.error.errors).join(' | ')
          : null;

        this.notify(backendMessage || validationErrors || 'Échec enregistrement étudiant', 'warn');
      },
    });
  }

  editEtudiant(etudiant: any): void {
    this.editingId = etudiant.id;
    this.etudiantForm.patchValue({
      ine: etudiant.ine ?? '',
      nom: etudiant.nom ?? '',
      prenom: etudiant.prenom ?? '',
      dateNaissance: etudiant.dateNaissance ?? '',
      genre: etudiant.genre ?? '',
      formationId: etudiant.formation?.id ?? null,
      promo: etudiant.promo ?? '',
      anneeDebut: etudiant.anneeDebut ?? '',
      anneeSortie: etudiant.anneeSortie ?? '',
      diplomes: etudiant.diplomes ?? '',
      autresFormations: etudiant.autresFormations ?? '',
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.etudiantForm.reset();
  }

  deleteEtudiant(id: number): void {
    if (!confirm('Confirmer la suppression de cet étudiant ?')) {
      return;
    }

    this.etudiantService.deleteEtudiant(id).subscribe({
      next: () => {
        this.notify('Étudiant supprimé', 'success');
        this.loadEtudiants();
      },
      error: () => {
        this.notify('Suppression impossible', 'warn');
      },
    });
  }

  loadFormations(): void {
    this.formationService.getAll().subscribe({
      next: (data) => {
        this.formations = data ?? [];
      },
      error: () => {
        this.formations = [];
      },
    });
  }

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
