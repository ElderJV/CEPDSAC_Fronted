import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarUserComponent } from '../../components/sidebar-user/sidebar-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, SidebarUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {}
