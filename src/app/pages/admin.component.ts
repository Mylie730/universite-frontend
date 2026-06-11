import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div class="admin-container">
      <h1>Gestion des Utilisateurs</h1>

      <mat-card class="create-user-card">
        <mat-card-title>Créer un Nouvel Utilisateur</mat-card-title>
        <mat-card-content>
          <form [formGroup]="createUserForm" (ngSubmit)="onCreateUser()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom</mat-label>
              <input matInput formControlName="nom" required />
              <mat-error *ngIf="createUserForm.get('nom')?.hasError('required')">
                Le nom est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Prénom</mat-label>
              <input matInput formControlName="prenom" required />
              <mat-error *ngIf="createUserForm.get('prenom')?.hasError('required')">
                Le prénom est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required />
              <mat-error *ngIf="createUserForm.get('email')?.hasError('required')">
                L'email est requis
              </mat-error>
              <mat-error *ngIf="createUserForm.get('email')?.hasError('email')">
                Email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de Passe</mat-label>
              <input matInput formControlName="motDePasse" type="password" required />
              <mat-error *ngIf="createUserForm.get('motDePasse')?.hasError('required')">
                Le mot de passe est requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rôle</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="ADMIN">Administrateur</mat-option>
                <mat-option value="PROFESSEUR">Professeur</mat-option>
                <mat-option value="ETUDIANT">Étudiant</mat-option>
              </mat-select>
              <mat-error *ngIf="createUserForm.get('role')?.hasError('required')">
                Le rôle est requis
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              <mat-icon>error</mat-icon>
              {{ errorMessage }}
            </div>

            <div class="success-message" *ngIf="successMessage">
              <mat-icon>check_circle</mat-icon>
              {{ successMessage }}
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="createUserForm.invalid || loading"
              class="full-width"
            >
              <span *ngIf="!loading">Créer l'Utilisateur</span>
              <span *ngIf="loading">Création en cours...</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .admin-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
      }

      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }

      .create-user-card {
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      mat-form-field {
        display: block;
        margin-bottom: 1.5rem;
      }

      .full-width {
        width: 100%;
      }

      .error-message {
        color: #d32f2f;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background-color: #ffebee;
        border-radius: 4px;
        border-left: 4px solid #d32f2f;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .success-message {
        color: #388e3c;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background-color: #e8f5e9;
        border-radius: 4px;
        border-left: 4px solid #388e3c;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      button {
        margin-top: 1rem;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  createUserForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private initializeForm(): void {
    this.createUserForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ETUDIANT', [Validators.required]],
    });
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = this.createUserForm.value;

    this.authService.createUser(userData).subscribe({
      next: (response: AuthResponse) => {
        this.loading = false;
        this.successMessage = `✅ Utilisateur créé: ${response.email}`;
        this.createUserForm.reset({ role: 'ETUDIANT' });

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création';
      },
    });
  }
}
