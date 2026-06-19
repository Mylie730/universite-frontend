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
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Navbar } from '../../shared/navbar/navbar';
import {
  FormationService,
  FormationRequest,
  FormationResponse,
  MatiereRequest,
  MatiereResponse,
} from '../../core/services/formation';

interface FiliereOption {
  id: number;
  nom: string;
  description?: string;
}

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
    MatSelectModule,
    Navbar,
  ],
  templateUrl: './formations.html',
  styleUrl: './formations.css',
})
export class FormationsPage implements OnInit {
  formations: FormationResponse[] = [];
  filieres: FiliereOption[] = [];
  loading = false;
  saving = false;
  editingId: number | null = null;
  selectedFormationIdForMatiere: number | null = null;
  addingMatiere = false;
  uploadingMatiereId: number | null = null;
  uploadingType: 'cours' | 'td' | null = null;

  newMatiere: MatiereRequest = {
    nom: '',
    code: '',
    description: '',
  };

  newFiliere: { nom: string; description: string } = {
    nom: '',
    description: '',
  };
  addingFiliere = false;

  displayedColumns: string[] = [
    'id',
    'nom',
    'type',
    'filiere',
    'niveau',
    'dateDebut',
    'dateFin',
    'montantFinancement',
    'typeFinancement',
    'nombreFormesHommes',
    'nombreFormesFemmes',
    'actions',
  ];

  formationForm: FormGroup;

  constructor(
    private formationService: FormationService,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.formationForm = this.fb.group({
      nom: ['', Validators.required],
      type: [''],
      niveau: ['', Validators.required],
      filiereId: [null],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      montantFinancement: [null],
      typeFinancement: [''],
      nombreFormesHommes: [null],
      nombreFormesFemmes: [null],
    });
  }

  ngOnInit(): void {
    this.loadFilieres();
    this.loadFormations();
  }

  loadFilieres(): void {
    this.http.get<FiliereOption[]>('http://localhost:8080/api/filieres').subscribe({
      next: (data) => {
        this.filieres = data ?? [];
      },
      error: () => {
        this.notify('Erreur chargement filières', 'warn');
      },
    });
  }

  addFiliere(): void {
    if (!this.newFiliere.nom.trim()) {
      this.notify('Le nom de la filière est obligatoire', 'warn');
      return;
    }

    this.addingFiliere = true;
    this.http
      .post<FiliereOption>('http://localhost:8080/api/filieres', {
        nom: this.newFiliere.nom.trim(),
        description: this.newFiliere.description?.trim() || '',
      })
      .subscribe({
        next: (created) => {
          this.addingFiliere = false;
          this.notify('Filière ajoutée avec succès', 'success');
          this.filieres = [...this.filieres, created];
          this.formationForm.patchValue({ filiereId: created.id });
          this.newFiliere = { nom: '', description: '' };
        },
        error: () => {
          this.addingFiliere = false;
          this.notify('Impossible d’ajouter la filière', 'warn');
        },
      });
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
    const formValue = this.formationForm.value as {
      nom: string;
      type?: string;
      niveau: string;
      filiereId?: number | null;
      dateDebut: string;
      dateFin: string;
      montantFinancement?: number | null;
      typeFinancement?: string;
      nombreFormesHommes?: number | null;
      nombreFormesFemmes?: number | null;
    };

    const nom = (formValue.nom ?? '').trim();
    const type = (formValue.type ?? '').trim();
    const niveau = (formValue.niveau ?? '').trim();
    const dateDebut = formValue.dateDebut;
    const dateFin = formValue.dateFin;

    if (!nom || !niveau || !dateDebut || !dateFin) {
      this.saving = false;
      this.notify('Veuillez renseigner tous les champs obligatoires', 'warn');
      return;
    }

    if (new Date(dateFin) < new Date(dateDebut)) {
      this.saving = false;
      this.notify('La date de fin doit être postérieure ou égale à la date de début', 'warn');
      return;
    }

    const toNullableNumber = (value: unknown): number | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const payload: FormationRequest = {
      nom,
      type: type || undefined,
      niveau,
      dateDebut,
      dateFin,
      montantFinancement: toNullableNumber(formValue.montantFinancement),
      typeFinancement: (formValue.typeFinancement ?? '').trim() || undefined,
      nombreFormesHommes: toNullableNumber(formValue.nombreFormesHommes),
      nombreFormesFemmes: toNullableNumber(formValue.nombreFormesFemmes),
    };

    if (formValue.filiereId && formValue.filiereId > 0) {
      payload.filiere = { id: Number(formValue.filiereId) };
    }

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
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.notify(
          this.getBackendErrorMessage(error, 'Impossible d’enregistrer la formation'),
          'warn',
        );
      },
    });
  }

  editFormation(formation: FormationResponse): void {
    this.editingId = formation.id;
    this.formationForm.patchValue({
      nom: formation.nom ?? '',
      type: formation.type ?? '',
      niveau: formation.niveau ?? '',
      filiereId: formation.filiere?.id ?? null,
      dateDebut: formation.dateDebut ?? '',
      dateFin: formation.dateFin ?? '',
      montantFinancement: formation.montantFinancement ?? null,
      typeFinancement: formation.typeFinancement ?? '',
      nombreFormesHommes: formation.nombreFormesHommes ?? null,
      nombreFormesFemmes: formation.nombreFormesFemmes ?? null,
    });
  }

  selectFormationForMatiere(formationId: number): void {
    this.selectedFormationIdForMatiere = formationId;
    this.newMatiere = {
      nom: '',
      code: '',
      description: '',
    };
  }

  addMatiere(): void {
    if (!this.selectedFormationIdForMatiere) {
      this.notify('Veuillez sélectionner une formation', 'warn');
      return;
    }

    if (!this.newMatiere.nom?.trim()) {
      this.notify('Le nom de la matière est obligatoire', 'warn');
      return;
    }

    this.addingMatiere = true;
    this.formationService
      .addMatiere(this.selectedFormationIdForMatiere, this.newMatiere)
      .subscribe({
        next: (matiere: MatiereResponse) => {
          this.addingMatiere = false;
          this.notify('Matière ajoutée avec succès', 'success');

          const formation = this.formations.find(
            (f) => f.id === this.selectedFormationIdForMatiere,
          );
          if (formation) {
            formation.matieres = [...(formation.matieres ?? []), matiere];
          }

          this.newMatiere = {
            nom: '',
            code: '',
            description: '',
          };
        },
        error: () => {
          this.addingMatiere = false;
          this.notify('Impossible d’ajouter la matière', 'warn');
        },
      });
  }

  uploadMatierePdf(event: Event, matiereId: number, type: 'cours' | 'td'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      this.notify('Veuillez sélectionner un fichier PDF', 'warn');
      input.value = '';
      return;
    }

    this.uploadingMatiereId = matiereId;
    this.uploadingType = type;

    this.formationService.uploadMatierePdf(matiereId, type, file).subscribe({
      next: (updatedMatiere) => {
        this.formations = this.formations.map((formation) => ({
          ...formation,
          matieres: (formation.matieres ?? []).map((matiere) =>
            matiere.id === matiereId ? { ...matiere, ...updatedMatiere } : matiere,
          ),
        }));

        this.notify(
          type === 'cours' ? 'PDF de cours uploadé avec succès' : 'PDF de TD uploadé avec succès',
          'success',
        );
        this.uploadingMatiereId = null;
        this.uploadingType = null;
        input.value = '';
      },
      error: () => {
        this.notify('Échec de l’upload du PDF', 'warn');
        this.uploadingMatiereId = null;
        this.uploadingType = null;
        input.value = '';
      },
    });
  }

  deleteMatiere(id: number): void {
    if (!confirm('Supprimer cette matière ?')) {
      return;
    }

    this.formationService.deleteMatiere(id).subscribe({
      next: () => {
        this.notify('Matière supprimée', 'success');
        this.formations = this.formations.map((formation) => ({
          ...formation,
          matieres: (formation.matieres ?? []).filter((m) => m.id !== id),
        }));
      },
      error: (error: HttpErrorResponse) => {
        this.notify(this.getBackendErrorMessage(error, 'Suppression impossible'), 'warn');
      },
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
      error: (error: HttpErrorResponse) => {
        this.notify(this.getBackendErrorMessage(error, 'Suppression impossible'), 'warn');
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

  private getBackendErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const backendMessage = error?.error?.message;
    if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    if (typeof error?.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    return fallback;
  }
}
