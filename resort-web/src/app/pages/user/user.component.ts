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
  bookings:any = null;
  isAdmin:boolean = false;

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

  navigateTo(path:string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('uid');
    const role = sessionStorage.getItem('role');
    if (userId) {
      this.getUserDetails(userId);
      this.getBookings(userId);
      if(role == 'admin'){
        this.isAdmin = true;
      }
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

  // get user bookings
  getBookings(userId:string){
    this.userService.getUserBookings(userId).subscribe({
      next:(res) => {
        this.bookings = res.userBookings;
      },
      error:(err)=>{
        alert(err.message);
      }
    })
  }

  // cancel booking
  cancelBooking(bookingId: string): void {
    const confirmCancel = confirm('Are you sure you want to cancel this booking?');
    if (confirmCancel) {
      this.userService.updateBookingStatus(bookingId, { status: 'Cancelled' }).subscribe({
        next: (response) => {
          alert(response.message || 'Booking cancelled successfully.');
          this.getBookings(sessionStorage.getItem('uid')!); // Refresh bookings
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          alert('Error cancelling booking. Please try again.');
        },
      });
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
    this.updateUserdata();
  }

  logout() {
    sessionStorage.clear();
    alert('Logged out success')
    this.router.navigate(['/']);
  }
}
