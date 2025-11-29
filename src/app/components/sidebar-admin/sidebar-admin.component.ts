import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css',
})
export class SidebarAdminComponent {
  showProgramacionSubmenu = false;
  showMatriculasSubmenu = false;

  toggleProgramacionSubmenu() {
    this.showProgramacionSubmenu = !this.showProgramacionSubmenu;
  }

  toggleMatriculasSubmenu() {
    this.showMatriculasSubmenu = !this.showMatriculasSubmenu;
  }
}
