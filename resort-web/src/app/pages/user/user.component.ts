import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor ( private router: Router) {}

  activeTab: string = 'booking-history';
  isEditing: boolean = false;

  navigateTo(){
    this.router.navigate(['/'])
  }

  // Sample data for bookings
  bookings = [
    { id: '#101', roomType: 'Deluxe', checkIn: '2025-01-10', checkOut: '2025-01-15', status: 'Upcoming' },
    { id: '#102', roomType: 'Suite', checkIn: '2024-12-20', checkOut: '2024-12-25', status: 'Completed' },
    { id: '#103', roomType: 'Standard', checkIn: '2025-01-05', checkOut: '2025-01-07', status: 'Cancelled' },
  ];

  // Sample profile data
  profile = {
    name: 'John',
    email: 'john@gmail.com',
    phone: '6536568989',
  };

  // Switch tabs
  switchTab(tab: string) {
    this.activeTab = tab;
  }

  toggleEdit(editing: boolean) {
    this.isEditing = editing;
  }

  // Save profile changes
  saveProfile() {
    this.isEditing = false;
    alert('Profile updated successfully!');
  }

}
