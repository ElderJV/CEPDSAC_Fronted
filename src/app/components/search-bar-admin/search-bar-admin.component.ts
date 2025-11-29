import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar-admin',
  imports: [],
  templateUrl: './search-bar-admin.component.html',
  styleUrl: './search-bar-admin.component.css'
})
export class SearchBarAdminComponent {
  @Input() placeholderText: string = 'Search...';
  @Input() nuevoBotonName: string = 'Generic button'
  
  @Output() search = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
