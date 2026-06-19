import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FiliereLite {
  id: number;
  nom: string;
}

export interface FormationRequest {
  nom: string;
  type?: string;
  niveau: string;
  dateDebut: string;
  dateFin: string;
  montantFinancement?: number | null;
  typeFinancement?: string;
  nombreFormesHommes?: number | null;
  nombreFormesFemmes?: number | null;
  filiere?: { id: number } | null;
}

export interface MatiereRequest {
  nom: string;
  code?: string;
  description?: string;
  lienPdfCours?: string;
  lienPdfTd?: string;
  imageUrl?: string;
}

export interface MatiereResponse {
  id: number;
  nom: string;
  code?: string;
  description?: string;
  lienPdfCours?: string;
  lienPdfTd?: string;
  imageUrl?: string;
}

export interface FormationResponse {
  id: number;
  nom: string;
  type?: string;
  niveau: string;
  dateDebut: string;
  dateFin: string;
  montantFinancement?: number | null;
  typeFinancement?: string;
  nombreFormesHommes?: number | null;
  nombreFormesFemmes?: number | null;
  filiere?: FiliereLite | null;
  matieres?: MatiereResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private apiUrl = 'http://localhost:8080/api/formations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FormationResponse[]> {
    return this.http.get<FormationResponse[]>(this.apiUrl);
  }

  create(request: FormationRequest): Observable<FormationResponse> {
    return this.http.post<FormationResponse>(this.apiUrl, request);
  }

  update(id: number, request: FormationRequest): Observable<FormationResponse> {
    return this.http.put<FormationResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMatiere(formationId: number, request: MatiereRequest): Observable<MatiereResponse> {
    return this.http.post<MatiereResponse>(`${this.apiUrl}/${formationId}/matieres`, request);
  }

  getMatieresByFormation(formationId: number): Observable<MatiereResponse[]> {
    return this.http.get<MatiereResponse[]>(`${this.apiUrl}/${formationId}/matieres`);
  }

  getAllMatieres(): Observable<MatiereResponse[]> {
    return this.http.get<MatiereResponse[]>(`${this.apiUrl}/matieres`);
  }

  deleteMatiere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matieres/${id}`);
  }

  uploadMatierePdf(
    matiereId: number,
    type: 'cours' | 'td',
    file: File,
  ): Observable<MatiereResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MatiereResponse>(
      `${this.apiUrl}/matieres/${matiereId}/upload-pdf?type=${type}`,
      formData,
    );
  }
}
