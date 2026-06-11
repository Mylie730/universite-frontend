import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private apiUrl = 'http://localhost:8080/api/etudiants';

  constructor(private http: HttpClient) {}

  getAllEtudiants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEtudiant(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createEtudiant(etudiant: any): Observable<any> {
    return this.http.post(this.apiUrl, etudiant);
  }

  updateEtudiant(id: number, etudiant: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, etudiant);
  }

  deleteEtudiant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchEtudiants(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
