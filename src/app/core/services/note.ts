import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NoteSaisieRequest {
  etudiantId: number;
  coursId: number;
  valeur: number;
  semestre: string;
  anneeAcademique: string;
}

export interface NoteResponse {
  id?: number;
  coursNom?: string;
  valeur?: number;
  coefficient?: number;
  semestre?: string;
  anneeAcademique?: string;
  etudiantId?: number;
  etudiantNomComplet?: string;
}

export interface BulletinResponse {
  etudiantId?: number;
  etudiantNomComplet?: string;
  semestre?: string;
  anneeAcademique?: string;
  moyenneGenerale?: number;
  mention?: string;
  publie?: boolean;
  notes?: NoteResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/api/notes';

  constructor(private http: HttpClient) {}

  saisirOuModifier(request: NoteSaisieRequest): Observable<NoteResponse> {
    return this.http.post<NoteResponse>(this.apiUrl, request);
  }

  listerNotesEtudiant(etudiantId: number): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  listerMesNotes(): Observable<NoteResponse[]> {
    return this.http.get<NoteResponse[]>(`${this.apiUrl}/me`);
  }

  publierBulletin(
    etudiantId: number,
    semestre: string,
    anneeAcademique: string,
  ): Observable<BulletinResponse> {
    const params = new HttpParams()
      .set('etudiantId', etudiantId)
      .set('semestre', semestre)
      .set('anneeAcademique', anneeAcademique);

    return this.http.post<BulletinResponse>(`${this.apiUrl}/bulletins/publier`, null, { params });
  }

  consulterBulletinPublie(
    etudiantId: number,
    semestre: string,
    anneeAcademique: string,
  ): Observable<BulletinResponse> {
    const params = new HttpParams()
      .set('etudiantId', etudiantId)
      .set('semestre', semestre)
      .set('anneeAcademique', anneeAcademique);

    return this.http.get<BulletinResponse>(`${this.apiUrl}/bulletins`, { params });
  }

  consulterMonBulletinPublie(
    semestre: string,
    anneeAcademique: string,
  ): Observable<BulletinResponse> {
    const params = new HttpParams()
      .set('semestre', semestre)
      .set('anneeAcademique', anneeAcademique);

    return this.http.get<BulletinResponse>(`${this.apiUrl}/bulletins/me`, { params });
  }
}
