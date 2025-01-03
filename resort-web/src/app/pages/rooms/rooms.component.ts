import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {
  constructor ( private router: Router ) {}

  bgImage = 'assets/9 Modern Minimalist Living Room Designs_ Embrace Simplicity and Elegance.jpeg'

  rooms = [
    {
      name: 'Deluxe Room',
      description: 'A luxurious room with all modern amenities.',
      price: 120,
      image: 'assets/9 Modern Minimalist Living Room Designs_ Embrace Simplicity and Elegance.jpeg',
      rating:'★★★★☆'
    },
    {
      name: 'Standard Room',
      description: 'Comfortable and affordable.',
      price: 80,
      image: 'assets/Best Gray Bedroom Ideas and Design Inspiration [Montenegro Stone House Renovation Vision Board].jpeg',
      rating:'★★★★☆'
    },
    {
      name: 'Standard Room',
      description: 'Comfortable and affordable.',
      price: 80,
      image: 'assets/Relaxing Japandi Bedroom Designs.jpeg',
      rating:'★★★★★'
    },
    {
      name: 'Standard Room',
      description: 'Comfortable and affordable.',
      price: 80,
      image: 'assets/Valentina Deckenleuchte, 2 Farben, 3_5_6-flammig 5 flammes-blanc.jpeg',
      rating:'★★★★☆'
    },
  ];

  navigateTo() {
    this.router.navigate(['room-details']);
  }

  currentPage = 1;
  itemsPerPage = 3; // Number of items per page
  paginatedRooms = this.rooms.slice(0, this.itemsPerPage);
  totalPages = Math.ceil(this.rooms.length / this.itemsPerPage);

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRooms = this.rooms.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

}
