import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CoursRequest {
  code: string;
  nom: string;
  semestre: string;
  coefficient: number;
  formationId: number;
  lienPdfCours?: string;
  lienPdfTd?: string;
  lienMeet?: string;
}

export interface CoursResponse {
  id: number;
  code: string;
  nom: string;
  semestre: string;
  coefficient: number;
  formationId: number;
  formationNom?: string;
  lienPdfCours?: string;
  lienPdfTd?: string;
  lienMeet?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CoursService {
  private apiUrl = 'http://localhost:8080/api/cours';

  constructor(private http: HttpClient) {}

  create(request: CoursRequest): Observable<CoursResponse> {
    return this.http.post<CoursResponse>(this.apiUrl, request);
  }

  update(id: number, request: CoursRequest): Observable<CoursResponse> {
    return this.http.put<CoursResponse>(`${this.apiUrl}/${id}`, request);
  }

  getAll(formationId?: number): Observable<CoursResponse[]> {
    let params = new HttpParams();
    if (formationId != null) {
      params = params.set('formationId', formationId);
    }
    return this.http.get<CoursResponse[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<CoursResponse> {
    return this.http.get<CoursResponse>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
