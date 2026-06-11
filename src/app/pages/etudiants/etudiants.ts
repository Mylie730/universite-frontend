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
    'numeroMatricule',
    'nom',
    'prenom',
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

  constructor(
    private etudiantService: EtudiantService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.etudiantForm = this.fb.group({
      numeroMatricule: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateNaissance: ['', Validators.required],
      formation: ['', Validators.required],
      promo: ['', Validators.required],
      anneeDebut: ['', Validators.required],
      anneeSortie: [''],
      diplomes: [''],
      autresFormations: [''],
    });
  }

  ngOnInit(): void {
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
        this.etudiants = data ?? [];
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
    const payload = this.etudiantForm.value;

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
      error: () => {
        this.saving = false;
        this.notify('Échec enregistrement étudiant', 'warn');
      },
    });
  }

  editEtudiant(etudiant: any): void {
    this.editingId = etudiant.id;
    this.etudiantForm.patchValue({
      numeroMatricule: etudiant.numeroMatricule ?? '',
      nom: etudiant.nom ?? '',
      prenom: etudiant.prenom ?? '',
      email: etudiant.email ?? '',
      dateNaissance: etudiant.dateNaissance ?? '',
      formation: etudiant.formation ?? '',
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

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
