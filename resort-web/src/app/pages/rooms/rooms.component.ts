import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  currentPage: number = 1;
  limit: number = 2;
  totalPages: number = 1;
  loading: boolean = false;
  error: string | null = null;

  constructor(private router: Router, private roomsService: ServicesService, private ngxLoader: NgxUiLoaderService) {}

  ngOnInit(): void {
    this.loadRooms();
    if(this.loading){
      this.ngxLoader.start();
    } else{
      this.ngxLoader.stop();
    }
  }

  loadRooms(): void {
    this.loading = true
    this.roomsService.getAllRooms(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.rooms = response.data;
        this.totalPages = Math.ceil(response.count / this.limit);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching rooms. Please try again later.';
        this.loading = false;
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRooms();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRooms();
    }
  }

  navigateTo(id:string): void {
    this.router.navigate(['room-details']);
    localStorage.setItem('roomId',id);
  }

  calculateStarRating(reviews: { userId: string; rating: number }[]): string {
    if (!reviews || reviews.length === 0) {
      return '☆☆☆☆☆';
    }
    // const rating = "★★★★★☆☆☆☆☆";
    // const totalStars = 5;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round(totalRating / reviews.length); // average
    const fullStars = '★'.repeat(averageRating);
    const emptyStars = '☆'.repeat(5 - averageRating);

    return fullStars + emptyStars;
  }
}
