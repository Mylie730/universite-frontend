import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-enseignant-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Navbar],
  templateUrl: './enseignant-home.html',
  styleUrl: './enseignant-home.css',
})
export class EnseignantHome {
  actions = [
    { titre: 'Préparer mes cours', icon: 'menu_book', route: '/formations' },
    { titre: 'Suivre les étudiants', icon: 'school', route: '/etudiants' },
    { titre: 'Communication pédagogique', icon: 'campaign', route: '/communication' },
  ];
}
