import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  stars = [1, 2, 3, 4, 5];
  currentRating = 0;
  hoverRatings = 0;
  feedback = '';
  constructor(
    private roomService: ServicesService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private toastr: ToastrService
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
      this.toastr.warning('room not found');
      return;
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
        this.toastr.error('error fetching room details', err.message);
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
        this.toastr.error(err.message);
      }
    })
  }
  selectRating(rating: number): void {
    this.currentRating = rating;
  }

  hoverRating(rating: number): void {
    this.hoverRatings = rating;
  }
  resetHover(): void {
    this.hoverRatings = 0;
  }

  resetForm(): void {
    this.currentRating = 0;
    this.feedback = '';
  }

  submitFeedback(): void {
    if (this.currentRating === 0) {
      this.toastr.warning('Please select a rating.');
      return;
    }
    if (!this.feedback.trim()) {
      this.toastr.warning('Please enter your feedback.');
      return;
    }
    const roomId = this.route.snapshot.paramMap.get('id');
    if(!roomId){
      this.toastr.error('roomId required')
      return;
    }
    const userId = sessionStorage.getItem('uid');
    const review = {
      userId: userId,
      rating: this.currentRating,
      comment: this.feedback,
    };
    this.roomService.postReviews(roomId, review).subscribe({
      next:(res) => {
        // console.log('Review submitted:', review);
        this.toastr.info('Thank you for your feedback!');
        this.toastr.success(res.message);
        this.getReviews(roomId);
      },
      error:(err) => {
        this.toastr.error(err.message);
      }
    })
    this.resetForm();
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
      this.toastr.warning('User ID and Room ID are required');
      return;
    }
    const formData = this.bookingData.value;
    const data = { ...formData, userId, roomId, totalPrice: this.totalPrice };
    this.roomService.bookRoom(data).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
}
