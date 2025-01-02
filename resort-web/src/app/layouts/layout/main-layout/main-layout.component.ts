import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit{
  constructor(private ngxLoader: NgxUiLoaderService, private router:Router) {}
  
  ngOnInit(): void {

    this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
    }, 1500);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.ngxLoader.start();
      }
      
      if (event instanceof NavigationEnd || event instanceof NavigationError) {
        this.ngxLoader.stop();
      }
    });
  }

}
