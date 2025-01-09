import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit{
  roomDetails: any;
  loading:boolean = false;
  constructor (private roomService: ServicesService, private router: Router, private ngxLoader: NgxUiLoaderService) {};

  ngOnInit(): void {
    const rommId = localStorage.getItem('roomId');
    if(!rommId){
      return alert('room not found')
    }
    this.fetchRoom(rommId);
    if(this.loading){
      this.ngxLoader.start();
    } else{
      this.ngxLoader.stop();
    }
  }

  fetchRoom(roomId:string){
    this.loading = true;
    this.roomService.getRoomDetails(roomId).subscribe({
      next:(res) =>{
        this.roomDetails = res;
      },
      error:(err)=>{
        console.error('error fetching room details',err.message);
      }
    })
  }
}
