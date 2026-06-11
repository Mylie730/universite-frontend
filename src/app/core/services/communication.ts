import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommunicationRequest {
  titre: string;
  type: string;
  date: string;
  auteur: string;
  contenu?: string;
}

export interface CommunicationResponse {
  id: number;
  titre: string;
  type: string;
  date: string;
  auteur: string;
  contenu?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private apiUrl = 'http://localhost:8080/api/communications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CommunicationResponse[]> {
    return this.http.get<CommunicationResponse[]>(this.apiUrl);
  }

  create(request: CommunicationRequest): Observable<CommunicationResponse> {
    return this.http.post<CommunicationResponse>(this.apiUrl, request);
  }

  update(id: number, request: CommunicationRequest): Observable<CommunicationResponse> {
    return this.http.put<CommunicationResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
