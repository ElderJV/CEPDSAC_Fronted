import { Component, Input } from '@angular/core';
import { ActionButtonsAdminComponent } from '../action-buttons-admin/action-buttons-admin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table-admin',
  imports: [ActionButtonsAdminComponent , CommonModule],
  templateUrl: './data-table-admin.component.html',
  styleUrl: './data-table-admin.component.css',
})
export class DataTableAdminComponent {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
}
