import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
