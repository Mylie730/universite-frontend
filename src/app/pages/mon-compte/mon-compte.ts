import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-mon-compte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Navbar,
  ],
  templateUrl: './mon-compte.html',
  styleUrl: './mon-compte.css',
})
export class MonCompte {
  loading = false;
  successMessage = '';
  errorMessage = '';

  form;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Veuillez compléter tous les champs correctement.';
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'La confirmation du mot de passe ne correspond pas.';
      return;
    }

    this.loading = true;

    this.authService
      .changePassword({
        currentPassword: currentPassword || '',
        newPassword: newPassword || '',
        confirmPassword: confirmPassword || '',
      })
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Mot de passe modifié avec succès.';
          this.form.reset();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Échec de la modification du mot de passe.';
          this.loading = false;
        },
      });
  }
}
