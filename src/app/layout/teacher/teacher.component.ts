import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarTeacherComponent } from '../../components/sidebar-teacher/sidebar-teacher.component';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [RouterOutlet, SidebarTeacherComponent],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})


export class TeacherComponent {

}
