import { Injectable } from '@angular/core';

export interface Creneau {
  id: string;
  jour: string;
  matiere: string;
  heureDebut: string;
  heureFin: string;
  salle?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmploiDuTempsService {
  private readonly storageKey = 'uchk_emplois_du_temps';

  private defaultCreneaux: Creneau[] = [
    {
      id: this.generateId(),
      jour: 'Lundi',
      matiere: 'Algorithmes',
      heureDebut: '08:00',
      heureFin: '10:00',
      salle: 'A1',
    },
    {
      id: this.generateId(),
      jour: 'Mardi',
      matiere: 'Bases de données',
      heureDebut: '10:00',
      heureFin: '12:00',
      salle: 'B2',
    },
  ];

  getAll(): Creneau[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.defaultCreneaux));
      return [...this.defaultCreneaux];
    }

    try {
      const parsed = JSON.parse(raw) as Creneau[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  add(creneau: Omit<Creneau, 'id'>): void {
    const current = this.getAll();
    const updated: Creneau[] = [
      ...current,
      {
        id: this.generateId(),
        ...creneau,
      },
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  remove(id: string): void {
    const current = this.getAll();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
