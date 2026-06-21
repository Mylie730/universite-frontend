import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../shared/navbar/navbar';
import { Creneau, EmploiDuTempsService } from '../../core/services/emploi-du-temps';
import { FormationService } from '../../core/services/formation';

@Component({
  selector: 'app-gestion-emplois-du-temps',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, Navbar],
  templateUrl: './gestion-emplois-du-temps.html',
  styleUrl: './gestion-emplois-du-temps.css',
})
export class GestionEmploisDuTemps implements OnInit {
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  matieres: string[] = [];

  form = {
    jour: 'Lundi',
    matiere: '',
    autreMatiere: '',
    heureDebut: '',
    heureFin: '',
    salle: '',
  };

  creneaux: Creneau[] = [];

  constructor(
    private emploiDuTempsService: EmploiDuTempsService,
    private formationService: FormationService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadMatieres();
  }

  ajouter(): void {
    const matiereFinale =
      this.form.matiere === 'Autre' ? this.form.autreMatiere.trim() : this.form.matiere.trim();

    if (!matiereFinale || !this.form.heureDebut || !this.form.heureFin) {
      return;
    }

    this.emploiDuTempsService.add({
      jour: this.form.jour,
      matiere: matiereFinale,
      heureDebut: this.form.heureDebut,
      heureFin: this.form.heureFin,
      salle: this.form.salle.trim(),
    });

    this.form = {
      jour: 'Lundi',
      matiere: this.matieres[0] || '',
      autreMatiere: '',
      heureDebut: '',
      heureFin: '',
      salle: '',
    };

    this.load();
  }

  supprimer(id: string): void {
    this.emploiDuTempsService.remove(id);
    this.load();
  }

  private load(): void {
    this.creneaux = this.emploiDuTempsService.getAll();
  }

  private loadMatieres(): void {
    this.formationService.getAllMatieres().subscribe({
      next: (data) => {
        const uniques = Array.from(
          new Set((data || []).map((m) => (m.nom || '').trim()).filter((nom) => nom.length > 0)),
        );
        this.matieres = [...uniques, 'Autre'];
        if (!this.form.matiere && this.matieres.length > 0) {
          this.form.matiere = this.matieres[0];
        }
      },
      error: () => {
        this.matieres = ['Autre'];
        this.form.matiere = 'Autre';
      },
    });
  }
}
