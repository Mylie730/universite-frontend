import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Navbar } from '../../shared/navbar/navbar';
import {
  AdministrationService,
  Budget,
  DocumentAdministratif,
  Partenaire,
  Personnel,
  Stage,
} from '../../core/services/administration';

@Component({
  selector: 'app-administration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    Navbar,
  ],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class AdministrationPage implements OnInit {
  documents: DocumentAdministratif[] = [];
  budgets: Budget[] = [];
  personnels: Personnel[] = [];
  partenaires: Partenaire[] = [];
  stages: Stage[] = [];
  loadingDocuments = false;
  loadingBudgets = false;
  loadingPersonnels = false;
  loadingPartenaires = false;
  loadingStages = false;

  newDocument: DocumentAdministratif = {
    titre: '',
    type: '',
    dateDocument: '',
    description: '',
    fichierUrl: '',
  };

  newBudget: Budget = {
    anneeBudgetaire: new Date().getFullYear(),
    projetBudget: '',
    noteOrientation: '',
    budgetPrevu: 0,
    budgetRealise: 0,
  };

  newPersonnel: Personnel = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    fonction: '',
    dateRecrutement: '',
    typePersonnel: '',
    grade: '',
    specialite: '',
    departement: '',
  };

  newPartenaire: Partenaire = {
    nom: '',
    typePartenaire: '',
    contactNom: '',
    contactEmail: '',
    contactTelephone: '',
    description: '',
  };

  newStage: Stage = {
    entreprise: '',
    dateDebut: '',
    dateFin: '',
    rapportStageUrl: '',
    evaluation: '',
    statutInsertion: '',
  };

  constructor(
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadBudgets();
    this.loadPersonnels();
    this.loadPartenaires();
    this.loadStages();
  }

  loadDocuments(): void {
    this.loadingDocuments = true;
    this.administrationService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data ?? [];
        this.loadingDocuments = false;
      },
      error: () => {
        this.documents = [];
        this.loadingDocuments = false;
        this.notify('Impossible de charger les documents administratifs', 'warn');
      },
    });
  }

  loadBudgets(): void {
    this.loadingBudgets = true;
    this.administrationService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data ?? [];
        this.loadingBudgets = false;
      },
      error: () => {
        this.budgets = [];
        this.loadingBudgets = false;
        this.notify('Impossible de charger les budgets', 'warn');
      },
    });
  }

  loadPersonnels(): void {
    this.loadingPersonnels = true;
    this.administrationService.getPersonnels().subscribe({
      next: (data) => {
        this.personnels = data ?? [];
        this.loadingPersonnels = false;
      },
      error: () => {
        this.personnels = [];
        this.loadingPersonnels = false;
        this.notify('Impossible de charger les personnels', 'warn');
      },
    });
  }

  loadPartenaires(): void {
    this.loadingPartenaires = true;
    this.administrationService.getPartenaires().subscribe({
      next: (data) => {
        this.partenaires = data ?? [];
        this.loadingPartenaires = false;
      },
      error: () => {
        this.partenaires = [];
        this.loadingPartenaires = false;
        this.notify('Impossible de charger les partenaires', 'warn');
      },
    });
  }

  loadStages(): void {
    this.loadingStages = true;
    this.administrationService.getStages().subscribe({
      next: (data) => {
        this.stages = data ?? [];
        this.loadingStages = false;
      },
      error: () => {
        this.stages = [];
        this.loadingStages = false;
        this.notify('Impossible de charger les stages', 'warn');
      },
    });
  }

  createDocument(): void {
    if (!this.newDocument.titre || !this.newDocument.type || !this.newDocument.dateDocument) {
      this.notify('Titre, type et date du document sont obligatoires', 'warn');
      return;
    }

    this.administrationService.createDocument(this.newDocument).subscribe({
      next: () => {
        this.notify('Document ajouté avec succès', 'success');
        this.newDocument = {
          titre: '',
          type: '',
          dateDocument: '',
          description: '',
          fichierUrl: '',
        };
        this.loadDocuments();
      },
      error: () => this.notify('Échec de création du document', 'warn'),
    });
  }

  createBudget(): void {
    if (!this.newBudget.anneeBudgetaire) {
      this.notify('L’année budgétaire est obligatoire', 'warn');
      return;
    }

    this.administrationService.createBudget(this.newBudget).subscribe({
      next: () => {
        this.notify('Budget ajouté avec succès', 'success');
        this.newBudget = {
          anneeBudgetaire: new Date().getFullYear(),
          projetBudget: '',
          noteOrientation: '',
          budgetPrevu: 0,
          budgetRealise: 0,
        };
        this.loadBudgets();
      },
      error: () => this.notify('Échec de création du budget', 'warn'),
    });
  }

  createPersonnel(): void {
    if (!this.newPersonnel.nom || !this.newPersonnel.prenom || !this.newPersonnel.fonction) {
      this.notify('Nom, prénom et fonction sont obligatoires', 'warn');
      return;
    }

    this.administrationService.createPersonnel(this.newPersonnel).subscribe({
      next: () => {
        this.notify('Personnel ajouté avec succès', 'success');
        this.newPersonnel = {
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          fonction: '',
          dateRecrutement: '',
          typePersonnel: '',
          grade: '',
          specialite: '',
          departement: '',
        };
        this.loadPersonnels();
      },
      error: () => this.notify('Échec de création du personnel', 'warn'),
    });
  }

  createPartenaire(): void {
    if (!this.newPartenaire.nom) {
      this.notify('Le nom du partenaire est obligatoire', 'warn');
      return;
    }

    this.administrationService.createPartenaire(this.newPartenaire).subscribe({
      next: () => {
        this.notify('Partenaire ajouté avec succès', 'success');
        this.newPartenaire = {
          nom: '',
          typePartenaire: '',
          contactNom: '',
          contactEmail: '',
          contactTelephone: '',
          description: '',
        };
        this.loadPartenaires();
      },
      error: () => this.notify('Échec de création du partenaire', 'warn'),
    });
  }

  createStage(): void {
    if (!this.newStage.entreprise) {
      this.notify('Le nom de l’entreprise est obligatoire', 'warn');
      return;
    }

    this.administrationService.createStage(this.newStage).subscribe({
      next: () => {
        this.notify('Stage ajouté avec succès', 'success');
        this.newStage = {
          entreprise: '',
          dateDebut: '',
          dateFin: '',
          rapportStageUrl: '',
          evaluation: '',
          statutInsertion: '',
        };
        this.loadStages();
      },
      error: () => this.notify('Échec de création du stage', 'warn'),
    });
  }

  private notify(message: string, type: 'success' | 'warn'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-warn'],
    });
  }
}
