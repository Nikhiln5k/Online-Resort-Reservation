import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  constructor ( private router: Router, private userService: ServicesService ) {}

  activeTab: string = 'profile-management';
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

  // userDetails
  profile: any;

  ngOnInit(): void {
    const userId = sessionStorage.getItem('uid');

    if(!userId){
      return alert('User not found')
    }
    this.getUserDetails(userId);
  }

  async getUserDetails(userId: string): Promise<void> {
    try {
      const response = await this.userService.getUser(userId).toPromise(); // Convert Observable to Promise
      this.profile = response;
      console.log('User details:', this.profile);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

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
    console.log(this.profile)
    alert('Profile updated successfully!');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
