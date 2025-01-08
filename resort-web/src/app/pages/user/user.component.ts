import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {

  userData: FormGroup;
  activeTab: string = 'profile-management';
  isEditing: boolean = false;
  // userDetails
  profile: any = null;

  constructor(
    private router: Router,
    private userService: ServicesService,
    private fb: FormBuilder
  ) {
    this.userData = this.fb.group({
      name: '',
      email: '',
    });
  }

  navigateTo() {
    this.router.navigate(['/']);
  }

  // Sample data for bookings
  bookings = [
    {
      id: '#101',
      roomType: 'Deluxe',
      checkIn: '2025-01-10',
      checkOut: '2025-01-15',
      status: 'Upcoming',
    },
    {
      id: '#102',
      roomType: 'Suite',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      status: 'Completed',
    },
    {
      id: '#103',
      roomType: 'Standard',
      checkIn: '2025-01-05',
      checkOut: '2025-01-07',
      status: 'Cancelled',
    },
  ];


  ngOnInit(): void {
    const userId = sessionStorage.getItem('uid');
    if (userId) {
      this.getUserDetails(userId);
    } else {
      alert('User not logged! please login.');
      this.router.navigate(['/auth']);
    }
  }

  // get user
  getUserDetails(userId: string): void {
    this.userService.getUser(userId).subscribe({
      next: (response) => {
        this.profile = response;
        this.userData.patchValue({
          name: this.profile.name,
          email: this.profile.email,
        });
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details. Please try again.');
      },
    });
  }

  // update user details
  updateUserdata(): void {
    const userId = sessionStorage.getItem('uid');
    if (!userId) {
      console.error('User not found! please login.');
      this.router.navigate(['/auth']);
      return;
    }
    const userDetails = this.userData.value;
    this.userService.updateUser(userId, userDetails).subscribe({
      next: (response) => {
        alert(response?.message || 'User updated successfully.');
        this.profile = response?.user;
        this.toggleEdit(false);
      },
      error: (error) => {
        console.error('Error updating user details:', error);
        alert('Error updating user details. Please try again.');
      },
    });
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
    this.updateUserdata();
  }

  logout() {
    sessionStorage.clear();
    alert('Logged out success')
    this.router.navigate(['/']);
  }
}
