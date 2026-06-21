import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../shared/navbar/navbar';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Creneau, EmploiDuTempsService } from '../../core/services/emploi-du-temps';

type CalendarCell = {
  creneau: Creneau | null;
  rowSpan: number;
  hidden: boolean;
};

@Component({
  selector: 'app-emploi-du-temps',
  standalone: true,
  imports: [CommonModule, MatCardModule, Navbar, Sidebar],
  templateUrl: './emploi-du-temps.html',
  styleUrl: './emploi-du-temps.css',
})
export class EmploiDuTemps implements OnInit {
  creneaux: Creneau[] = [];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  heures = this.generateHeures('08:00', '20:00', 60);
  stepMinutes = 60;
  celluleMap: Record<string, CalendarCell> = {};

  constructor(private emploiDuTempsService: EmploiDuTempsService) {}

  ngOnInit(): void {
    this.creneaux = this.emploiDuTempsService.getAll();
    this.buildCelluleMap();
  }

  getCellule(jour: string, heure: string): CalendarCell {
    return this.celluleMap[`${jour}_${heure}`] || { creneau: null, rowSpan: 1, hidden: false };
  }

  private buildCelluleMap(): void {
    const map: Record<string, CalendarCell> = {};

    for (const jour of this.jours) {
      for (const heure of this.heures) {
        map[`${jour}_${heure}`] = { creneau: null, rowSpan: 1, hidden: false };
      }
    }

    for (const c of this.creneaux) {
      const debut = this.toMinutes(c.heureDebut);
      const fin = this.toMinutes(c.heureFin);
      const span = Math.max(1, Math.ceil((fin - debut) / this.stepMinutes));
      const startKey = `${c.jour}_${c.heureDebut}`;

      if (map[startKey]) {
        map[startKey] = { creneau: c, rowSpan: span, hidden: false };

        for (let i = 1; i < span; i++) {
          const nextMinute = debut + i * this.stepMinutes;
          const nextHour = this.toHourString(nextMinute);
          const nextKey = `${c.jour}_${nextHour}`;
          if (map[nextKey]) {
            map[nextKey] = { creneau: null, rowSpan: 1, hidden: true };
          }
        }
      }
    }

    this.celluleMap = map;
  }

  private generateHeures(start: string, end: string, stepMinutes: number): string[] {
    const result: string[] = [];
    let current = this.toMinutes(start);
    const endMin = this.toMinutes(end);

    while (current < endMin) {
      result.push(this.toHourString(current));
      current += stepMinutes;
    }

    return result;
  }

  private toMinutes(value: string): number {
    const [h, m] = value.split(':').map((v) => Number(v));
    return h * 60 + m;
  }

  private toHourString(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}
