import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Etudiants } from './pages/etudiants/etudiants';
import { AdminComponent } from './pages/admin.component';
import { Communication } from './pages/communication/communication';
import { AdministrationPage } from './pages/administration/administration';
import { Insertion } from './pages/insertion/insertion';
import { FormationsPage } from './pages/formations/formations';
import { EtudiantHome } from './pages/etudiant-home/etudiant-home';
import { MesCours } from './pages/mes-cours/mes-cours';
import { MesNotes } from './pages/mes-notes/mes-notes';
import { MonCompte } from './pages/mon-compte/mon-compte';
import { Bulletins } from './pages/bulletins/bulletins';
import { EspaceTd } from './pages/espace-td/espace-td';
import { EmploiDuTemps } from './pages/emploi-du-temps/emploi-du-temps';
import { GestionEmploisDuTemps } from './pages/gestion-emplois-du-temps/gestion-emplois-du-temps';

import { authGuard } from './core/guards/auth-guard';
import { AuthService } from './core/services/auth';

const rootRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  if (authService.isEtudiant()) {
    return router.parseUrl('/etudiant-home');
  }

  return router.parseUrl('/dashboard');
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    component: Login,
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  {
    path: 'etudiants',
    component: Etudiants,
    canActivate: [authGuard],
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
  },

  {
    path: 'communication',
    component: Communication,
    canActivate: [authGuard],
  },

  {
    path: 'administration',
    component: AdministrationPage,
    canActivate: [authGuard],
  },

  {
    path: 'insertion',
    component: Insertion,
    canActivate: [authGuard],
  },

  {
    path: 'formations',
    component: FormationsPage,
    canActivate: [authGuard],
  },

  {
    path: 'etudiant-home',
    component: EtudiantHome,
    canActivate: [authGuard],
  },

  {
    path: 'mes-cours',
    component: MesCours,
    canActivate: [authGuard],
  },

  {
    path: 'mes-notes',
    component: MesNotes,
    canActivate: [authGuard],
  },

  {
    path: 'mon-compte',
    component: MonCompte,
    canActivate: [authGuard],
  },

  {
    path: 'bulletins',
    component: Bulletins,
    canActivate: [authGuard],
  },

  {
    path: 'espace-td',
    component: EspaceTd,
    canActivate: [authGuard],
  },

  {
    path: 'emploi-du-temps',
    component: EmploiDuTemps,
    canActivate: [authGuard],
  },

  {
    path: 'gestion-emplois-du-temps',
    component: GestionEmploisDuTemps,
    canActivate: [authGuard],
  },
];
