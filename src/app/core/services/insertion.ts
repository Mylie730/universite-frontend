import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InsertionStatResponse {
  label: string;
  valeur: number;
}

export interface PartenaireRequest {
  nom: string;
  type?: string;
  contact?: string;
}

export interface PartenaireResponse {
  id: number;
  nom: string;
  type?: string;
  contact?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InsertionService {
  private statsUrl = 'http://localhost:8080/api/insertion/stats';
  private partenairesUrl = 'http://localhost:8080/api/insertion/partenaires';

  constructor(private http: HttpClient) {}

  getStats(): Observable<InsertionStatResponse[]> {
    return this.http.get<InsertionStatResponse[]>(this.statsUrl);
  }

  getPartenaires(): Observable<PartenaireResponse[]> {
    return this.http.get<PartenaireResponse[]>(this.partenairesUrl);
  }

  createPartenaire(request: PartenaireRequest): Observable<PartenaireResponse> {
    return this.http.post<PartenaireResponse>(this.partenairesUrl, request);
  }

  deletePartenaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.partenairesUrl}/${id}`);
  }
}
