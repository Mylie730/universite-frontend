import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Navbar } from '../../shared/navbar/navbar';
import {
  CommunicationRequest,
  CommunicationResponse,
  CommunicationService,
} from '../../core/services/communication';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    Navbar,
  ],
  templateUrl: './communication.html',
  styleUrl: './communication.css',
})
export class Communication implements OnInit {
  communications: CommunicationResponse[] = [];
  loading = false;
  saving = false;
  editingId: number | null = null;
  communicationForm: FormGroup;

  displayedColumns: string[] = ['id', 'titre', 'type', 'date', 'auteur', 'actions'];

  constructor(
    private communicationService: CommunicationService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.communicationForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      date: ['', Validators.required],
      auteur: ['', Validators.required],
      contenu: [''],
    });
  }

  ngOnInit(): void {
    this.loadCommunications();
  }

  loadCommunications(): void {
    this.loading = true;
    this.communicationService.getAll().subscribe({
      next: (data) => {
        this.communications = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('Erreur chargement communications', 'warn');
      },
    });
  }

  submitCommunication(): void {
    if (this.communicationForm.invalid) {
      this.communicationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.communicationForm.value as CommunicationRequest;

    const request$ = this.editingId
      ? this.communicationService.update(this.editingId, payload)
      : this.communicationService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.notify(
          this.editingId ? 'Communication mise à jour' : 'Communication ajoutée',
          'success',
        );
        this.resetForm();
        this.loadCommunications();
      },
      error: () => {
        this.saving = false;
        this.notify('Impossible d’enregistrer la communication', 'warn');
      },
    });
  }

  editCommunication(item: CommunicationResponse): void {
    this.editingId = item.id;
    this.communicationForm.patchValue({
      titre: item.titre ?? '',
      type: item.type ?? '',
      date: item.date ?? '',
      auteur: item.auteur ?? '',
      contenu: item.contenu ?? '',
    });
  }

  deleteCommunication(id: number): void {
    if (!confirm('Supprimer cette communication ?')) {
      return;
    }

    this.communicationService.delete(id).subscribe({
      next: () => {
        this.notify('Communication supprimée', 'success');
        this.loadCommunications();
      },
      error: () => {
        this.notify('Suppression impossible', 'warn');
      },
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.communicationForm.reset();
  }

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
