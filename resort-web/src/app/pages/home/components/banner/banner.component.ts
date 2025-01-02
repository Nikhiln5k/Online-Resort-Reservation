import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  constructor(private router:Router){}
  bgImage = 'assets/bannerBg.jpg'

  navigateToRooms(){
    this.router.navigate(['rooms'])
  }
  navigateToAbout(){
    this.router.navigate(['about'])
  }
}
