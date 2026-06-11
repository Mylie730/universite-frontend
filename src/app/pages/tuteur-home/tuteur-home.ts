import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-tuteur-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Navbar],
  templateUrl: './tuteur-home.html',
  styleUrl: './tuteur-home.css',
})
export class TuteurHome {
  actions = [
    { titre: 'Suivi tutorat', icon: 'support_agent', route: '/communication' },
    { titre: 'Suivi étudiants', icon: 'school', route: '/etudiants' },
    { titre: 'Planning activités', icon: 'calendar_month', route: '/administration' },
  ];
}
