import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'],
})
export class RoomDetailsComponent implements OnInit {
  roomDetails: any;
  bookingData: FormGroup;
  totalPrice: number = 0;
  reviews: any[] = [];
  constructor(
    private roomService: ServicesService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder
  ) {
    this.bookingData = fb.group({
      checkIn: '',
      checkOut: '',
      totalPrice: '',
    });
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (!roomId) {
      return alert('room not found');
    }
    this.fetchRoom(roomId);
    this.getReviews(roomId);
    this.bookingData.valueChanges.subscribe(() => this.calculateTotalPrice());
  }

  fetchRoom(roomId: string) {
    this.ngxLoader.start();
    this.roomService.getRoomDetails(roomId).subscribe({
      next: (res) => {
        this.roomDetails = res;
      },
      error: (err) => {
        console.error('error fetching room details', err.message);
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  // reviews
  getReviews(roomId: string){
    this.roomService.getReviews(roomId).subscribe({
      next:(res) => {
        this.reviews = res;
      },
      error:(err) =>{
        console.error(err.message);
      }
    })
  }
  
  calculateTotalPrice() {
    const { checkIn, checkOut } = this.bookingData.value;

    if (checkIn && checkOut && this.roomDetails?.price) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate > checkInDate) {
        const diffTime = Math.abs(
          checkOutDate.getTime() - checkInDate.getTime()
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // number of days
        this.totalPrice = diffDays * this.roomDetails.price;
      } else {
        this.totalPrice = 0;
      }
    } else {
      this.totalPrice = 0;
    }
  }

  bookRoom() {
    const userId = sessionStorage.getItem('uid');
    const roomId = this.route.snapshot.paramMap.get('id');
    if (!userId || !roomId) {
      return alert('User ID and Room ID are required');
    }
    const formData = this.bookingData.value;
    const data = { ...formData, userId, roomId, totalPrice: this.totalPrice };
    this.roomService.bookRoom(data).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }
}
