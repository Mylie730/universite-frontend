import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isAdmin = false;
  isEtudiant = false;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Étudiants', icon: 'school', route: '/etudiants' },
    { label: 'Communication', icon: 'campaign', route: '/communication' },
    { label: 'Administration', icon: 'folder', route: '/administration' },
    { label: 'Appui Insertion', icon: 'trending_up', route: '/insertion' },
    { label: 'Formations', icon: 'menu_book', route: '/formations' },
  ];

  etudiantMenuItems = [
    { label: 'Accueil Étudiant', icon: 'home', route: '/etudiant-home' },
    { label: 'Mes cours', icon: 'menu_book', route: '/mes-cours' },
    { label: 'Mes notes', icon: 'grade', route: '/mes-notes' },
    { label: 'Bulletins', icon: 'description', route: '/bulletins' },
    { label: 'Espace TD', icon: 'assignment', route: '/espace-td' },
    { label: 'Mon profil', icon: 'person', route: '/mon-compte' },
  ];

  constructor(private authService: AuthService) {
    this.isAdmin = this.authService.isAdmin();
    this.isEtudiant = this.authService.isEtudiant();
  }

  get visibleMenuItems() {
    return this.isEtudiant ? this.etudiantMenuItems : this.menuItems;
  }
}
