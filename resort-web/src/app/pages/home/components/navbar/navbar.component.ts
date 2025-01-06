import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor ( private router: Router ) {}

  toggleMenu: boolean = false;
  user: boolean = false;

  ngOnInit(): void {
    if(sessionStorage.getItem('token')){
    this.user = true;
  }
  }

  onToggleMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  // navigate
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}
