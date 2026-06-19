import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentAdministratif {
  id?: number;
  titre: string;
  type: string;
  dateDocument: string;
  description?: string;
  fichierUrl?: string;
}

export interface Budget {
  id?: number;
  anneeBudgetaire: number;
  projetBudget?: string;
  noteOrientation?: string;
  budgetPrevu?: number;
  budgetRealise?: number;
}

export interface Personnel {
  id?: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  fonction: string;
  dateRecrutement?: string;
  typePersonnel?: string;
  grade?: string;
  specialite?: string;
  departement?: string;
}

export interface Partenaire {
  id?: number;
  nom: string;
  typePartenaire?: string;
  contactNom?: string;
  contactEmail?: string;
  contactTelephone?: string;
  description?: string;
}

export interface Stage {
  id?: number;
  entreprise: string;
  dateDebut?: string;
  dateFin?: string;
  rapportStageUrl?: string;
  evaluation?: string;
  statutInsertion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdministrationService {
  private baseUrl = 'http://localhost:8080/api/administration';

  constructor(private http: HttpClient) {}

  // Documents
  getDocuments(): Observable<DocumentAdministratif[]> {
    return this.http.get<DocumentAdministratif[]>(`${this.baseUrl}/documents`);
  }

  createDocument(payload: DocumentAdministratif): Observable<DocumentAdministratif> {
    return this.http.post<DocumentAdministratif>(`${this.baseUrl}/documents`, payload);
  }

  updateDocument(id: number, payload: DocumentAdministratif): Observable<DocumentAdministratif> {
    return this.http.put<DocumentAdministratif>(`${this.baseUrl}/documents/${id}`, payload);
  }

  getDocumentById(id: number): Observable<DocumentAdministratif> {
    return this.http.get<DocumentAdministratif>(`${this.baseUrl}/documents/${id}`);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/documents/${id}`);
  }

  // Budgets
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.baseUrl}/budgets`);
  }

  createBudget(payload: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.baseUrl}/budgets`, payload);
  }

  updateBudget(id: number, payload: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/budgets/${id}`, payload);
  }

  getBudgetById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/budgets/${id}`);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/budgets/${id}`);
  }

  // Personnels
  getPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.baseUrl}/personnels`);
  }

  createPersonnel(payload: Personnel): Observable<Personnel> {
    return this.http.post<Personnel>(`${this.baseUrl}/personnels`, payload);
  }

  updatePersonnel(id: number, payload: Personnel): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.baseUrl}/personnels/${id}`, payload);
  }

  getPersonnelById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.baseUrl}/personnels/${id}`);
  }

  deletePersonnel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/personnels/${id}`);
  }

  // Partenaires
  getPartenaires(): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.baseUrl}/partenaires`);
  }

  createPartenaire(payload: Partenaire): Observable<Partenaire> {
    return this.http.post<Partenaire>(`${this.baseUrl}/partenaires`, payload);
  }

  updatePartenaire(id: number, payload: Partenaire): Observable<Partenaire> {
    return this.http.put<Partenaire>(`${this.baseUrl}/partenaires/${id}`, payload);
  }

  getPartenaireById(id: number): Observable<Partenaire> {
    return this.http.get<Partenaire>(`${this.baseUrl}/partenaires/${id}`);
  }

  deletePartenaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/partenaires/${id}`);
  }

  // Stages
  getStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.baseUrl}/stages`);
  }

  createStage(payload: Stage): Observable<Stage> {
    return this.http.post<Stage>(`${this.baseUrl}/stages`, payload);
  }

  updateStage(id: number, payload: Stage): Observable<Stage> {
    return this.http.put<Stage>(`${this.baseUrl}/stages/${id}`, payload);
  }

  getStageById(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.baseUrl}/stages/${id}`);
  }

  deleteStage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stages/${id}`);
  }
}
