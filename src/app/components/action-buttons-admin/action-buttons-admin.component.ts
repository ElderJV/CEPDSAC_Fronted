import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-action-buttons-admin',
  imports: [],
  templateUrl: './action-buttons-admin.component.html',
  styleUrl: './action-buttons-admin.component.css'
})
export class ActionButtonsAdminComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();
}
