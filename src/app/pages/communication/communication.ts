import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, Navbar],
  templateUrl: './communication.html',
  styleUrl: './communication.css',
})
export class Communication {
  comptesRendus = [
    { titre: 'Réunion pédagogique', type: 'Réunion', date: '2026-05-10', auteur: 'Direction' },
    {
      titre: 'Webinaire Orientation',
      type: 'Webinaire',
      date: '2026-05-15',
      auteur: 'Appui insertion',
    },
  ];
}
