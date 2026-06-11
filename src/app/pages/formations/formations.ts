import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Navbar } from '../../shared/navbar/navbar';
import {
  FormationService,
  FormationRequest,
  FormationResponse,
} from '../../core/services/formation';

@Component({
  selector: 'app-formations-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    Navbar,
  ],
  templateUrl: './formations.html',
  styleUrl: './formations.css',
})
export class FormationsPage implements OnInit {
  formations: FormationResponse[] = [];
  loading = false;
  saving = false;
  editingId: number | null = null;

  displayedColumns: string[] = ['id', 'nom', 'type', 'niveau', 'dateDebut', 'dateFin', 'actions'];

  formationForm: FormGroup;

  constructor(
    private formationService: FormationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.formationForm = this.fb.group({
      nom: ['', Validators.required],
      type: [''],
      niveau: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      montantFinancement: [null],
      typeFinancement: [''],
      nombreFormesHommes: [null],
      nombreFormesFemmes: [null],
    });
  }

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.loading = true;
    this.formationService.getAll().subscribe({
      next: (data) => {
        this.formations = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('Erreur chargement formations', 'warn');
      },
    });
  }

  submitFormation(): void {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.formationForm.value as FormationRequest;

    const request$ = this.editingId
      ? this.formationService.update(this.editingId, payload)
      : this.formationService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.notify(this.editingId ? 'Formation mise à jour' : 'Formation ajoutée', 'success');
        this.resetForm();
        this.loadFormations();
      },
      error: () => {
        this.saving = false;
        this.notify('Impossible d’enregistrer la formation', 'warn');
      },
    });
  }

  editFormation(formation: FormationResponse): void {
    this.editingId = formation.id;
    this.formationForm.patchValue({
      nom: formation.nom ?? '',
      type: formation.type ?? '',
      niveau: formation.niveau ?? '',
      dateDebut: formation.dateDebut ?? '',
      dateFin: formation.dateFin ?? '',
      montantFinancement: formation.montantFinancement ?? null,
      typeFinancement: formation.typeFinancement ?? '',
      nombreFormesHommes: formation.nombreFormesHommes ?? null,
      nombreFormesFemmes: formation.nombreFormesFemmes ?? null,
    });
  }

  deleteFormation(id: number): void {
    if (!confirm('Supprimer cette formation ?')) {
      return;
    }

    this.formationService.delete(id).subscribe({
      next: () => {
        this.notify('Formation supprimée', 'success');
        this.loadFormations();
      },
      error: () => {
        this.notify('Suppression impossible', 'warn');
      },
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.formationForm.reset();
  }

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
