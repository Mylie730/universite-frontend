import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Navbar } from '../../shared/navbar/navbar';
import { NoteService, BulletinResponse } from '../../core/services/note';

@Component({
  selector: 'app-administration-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
    Navbar,
  ],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class AdministrationPage {
  documents = [
    { type: 'Courrier arrivé', ref: 'CA-2026-001', date: '2026-05-01' },
    { type: 'Note de service', ref: 'NS-2026-017', date: '2026-05-08' },
    { type: 'Circulaire', ref: 'CIR-2026-002', date: '2026-05-11' },
  ];

  bulletin: BulletinResponse | null = null;
  loadingBulletin = false;
  publishing = false;

  publishForm = this.createPublishForm();
  consultForm = this.createConsultForm();

  constructor(
    private noteService: NoteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  publierBulletin(): void {
    if (this.publishForm.invalid) {
      this.publishForm.markAllAsTouched();
      return;
    }

    const { etudiantId, semestre, anneeAcademique } = this.publishForm.value;
    if (etudiantId == null || !semestre || !anneeAcademique) {
      this.notify('Formulaire incomplet', 'warn');
      return;
    }

    this.publishing = true;
    this.noteService.publierBulletin(etudiantId, semestre, anneeAcademique).subscribe({
      next: () => {
        this.publishing = false;
        this.notify('Bulletin publié avec succès', 'success');
      },
      error: () => {
        this.publishing = false;
        this.notify('Échec publication bulletin', 'warn');
      },
    });
  }

  consulterBulletin(): void {
    if (this.consultForm.invalid) {
      this.consultForm.markAllAsTouched();
      return;
    }

    const etudiantId = this.consultForm.value.etudiantId;
    if (etudiantId == null) {
      return;
    }

    const { semestre, anneeAcademique } = this.publishForm.value;
    if (!semestre || !anneeAcademique) {
      this.notify('Renseigne semestre et année académique pour la consultation', 'warn');
      return;
    }

    this.loadingBulletin = true;
    this.noteService.consulterBulletinPublie(etudiantId, semestre, anneeAcademique).subscribe({
      next: (data) => {
        this.bulletin = data;
        this.loadingBulletin = false;
      },
      error: () => {
        this.bulletin = null;
        this.loadingBulletin = false;
        this.notify('Aucun bulletin publié trouvé', 'warn');
      },
    });
  }

  private createPublishForm() {
    return this.fb.group({
      etudiantId: [null as number | null, Validators.required],
      semestre: ['', Validators.required],
      anneeAcademique: ['', Validators.required],
    });
  }

  private createConsultForm() {
    return this.fb.group({
      etudiantId: [null as number | null, Validators.required],
    });
  }

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
