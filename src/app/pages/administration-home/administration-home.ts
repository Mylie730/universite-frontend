import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-administration-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, Navbar],
  templateUrl: './administration-home.html',
  styleUrl: './administration-home.css',
})
export class AdministrationHome {
  actions = [
    { titre: 'Gestion documentaire', icon: 'folder', route: '/administration' },
    { titre: 'Communication interne', icon: 'campaign', route: '/communication' },
    { titre: 'Suivi insertion', icon: 'trending_up', route: '/insertion' },
  ];
}
