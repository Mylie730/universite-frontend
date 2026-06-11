import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, MatTooltipModule],

  templateUrl: './app.html',

  styleUrl: './app.css',
})
export class App {}
