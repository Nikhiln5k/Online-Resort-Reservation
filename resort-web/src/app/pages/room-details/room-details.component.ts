import { Component, OnInit } from '@angular/core';
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
  constructor(
    private roomService: ServicesService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    const rommId = this.route.snapshot.paramMap.get('id');
    if (!rommId) {
      return alert('room not found');
    }
    this.fetchRoom(rommId);
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
      complete:()=>{
        this.ngxLoader.stop();
      }
    });
  }
}
