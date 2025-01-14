import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  rooms: any[] = [];
  activeTab:string = 'manage-rooms';
  isEditModalOpen = false;
  editableRoom: any = {};
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  error: string | null = null;
  newRoom: any = {
    title: '',
    price: null,
    description: '',
    images: [],
    amenities: []
  };
  bookings: any[] = [];
  
  imagesInput: string = '';
  amenitiesInput: string = '';
  
  updateImages(imagesInput: string): void {
    this.newRoom.images = imagesInput.split(',').map((url) => url.trim());
  }
  
  updateAmenities(amenitiesInput: string): void {
    this.newRoom.amenities = amenitiesInput.split(',').map((item) => item.trim());
  }

  constructor(private services: ServicesService, private ngxLoader: NgxUiLoaderService) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadBookings();
  }

  loadRooms(): void {
    this.ngxLoader.start();
    this.services.getAllRooms(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.rooms = response.data;
        this.totalPages = Math.ceil(response.count / this.limit);
      },
      error: (err) => {
        this.error = 'Error fetching rooms. Please try again later.';
      },
      complete:()=>{
        this.ngxLoader.stop();
      }
    });
  }

  // Switch tabs
  switchTab(tab: string) {
    this.activeTab = tab;
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

  openEditModal(room: any) {
    this.editableRoom = { ...room };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveChanges() {
    const roomId = this.editableRoom._id;
    const token = sessionStorage.getItem('token')
    if(!roomId || !token){
      return console.error('required roomId and token');
    }
    if (typeof this.editableRoom.images === 'string') {
      this.editableRoom.images = this.editableRoom.images.split(',').map((url: string) => url.trim());
    }
    // console.log(this.editableRoom);
    const headers = {
      Authorization: `Bearer ${token}`
    }
    this.services.updateRoom(roomId, this.editableRoom, headers).subscribe({
      next:(res) => {
        console.log(res?.message);
        this.loadRooms();
      },
      error:(err) => {
        console.log(err.message);
      }
    })
    this.closeEditModal();
  }

  // delete room
  deleteRoom(id: string) {
    const token = sessionStorage.getItem('token')
    if(!id || !token){
      return console.error('required roomId and token');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    }
    this.services.deleteRoom(id, headers).subscribe({
      next:(res) => {
        console.log(res.message);
        this.loadRooms()
      },
      error:(err) => {
        console.error(err.message);
      }
    })
  }
  // add room
  addRoom() {
    this.ngxLoader.start();
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization : `Bearer ${token}`
    }
    if(!token){
      console.error('token required');
      this.ngxLoader.stop();
      return;
    }
    this.services.addRoom(this.newRoom, headers).subscribe({
      next:(res) => {
        console.log(res?.message);
        this.loadRooms();
      },
      error:(err) => {
        console.log(err.message);
        this.ngxLoader.stop();
      },
      complete:()=>{
        this.ngxLoader.stop();
      }
    })
  }

  // get all bookings
  loadBookings(){
    this.ngxLoader.start();
    const token = sessionStorage.getItem('token')
    if(!token){
      return console.error('token required');
    }
    const headers = {
      Authorization: `Bearer ${token}`
    }
    this.services.getAllBookings(headers).subscribe({
      next:(res) => {
        this.bookings = res.allBookings;
      },
      error:(err) => {
        console.error(err.message);
        this.ngxLoader.stop();
      },
      complete:()=>{
        this.ngxLoader.stop();
      }
    })
  }

  // confirm booking
  confirmBooking(id: string){
    if(!id){
      return console.log('id required');
    };
    this.services.updateBookingStatus(id, { status: 'Confirmed' }).subscribe({
      next:(res)=>{
        alert(res.message);
      },
      error:(err)=>{
        console.error(err.message);
      }
    })
  }
}
