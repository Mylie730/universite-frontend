import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-responsable-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Navbar],
  templateUrl: './responsable-home.html',
  styleUrl: './responsable-home.css',
})
export class ResponsableHome {
  actions = [
    { titre: 'Suivi des formations', icon: 'menu_book', route: '/formations' },
    { titre: 'Planification pédagogique', icon: 'event_note', route: '/administration' },
    { titre: 'Réunions tutorat', icon: 'groups', route: '/communication' },
  ];
}
