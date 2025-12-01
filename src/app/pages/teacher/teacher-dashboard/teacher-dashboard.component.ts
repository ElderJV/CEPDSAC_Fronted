import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, BookOpen } from "lucide-angular";

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {
  LayoutDashboard = LayoutDashboard;
  BookOpen = BookOpen;
}
