import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;
  userDetails = {
    username : '',
    email : '',
    password : ''
  }
  
  private auth = getAuth(); 
  constructor( private router: Router ) {}

  navigateTo() {
    this.router.navigate(['/']);
  }
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      // login
      signInWithEmailAndPassword(this.auth, this.userDetails.email, this.userDetails.password)
        .then((result) => {
          console.log('Login successful:', result);
          this.router.navigate(['/'])
        })
        .catch((error) => {
          console.error('Login failed:', error.message);
        });
    } else {
      // Signup 
      createUserWithEmailAndPassword(this.auth, this.userDetails.email, this.userDetails.password)
        .then((result) => {
          console.log('Signup successful:', result.user);
          this.router.navigate(['/auth'])
        })
        .catch((error) => {
          console.error('Signup failed:', error.message);
        });
    }
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(async(result) => {
        console.log('Google Sign-In successful:', result.user);
        const user = result.user;
        this.userDetails.username = user.displayName || '';
        this.userDetails.email = user.email || '';
        this.userDetails.password = user.phoneNumber || '';
        console.log(this.userDetails);
        const token = await user.getIdToken();
        sessionStorage.setItem('token', token);
        this.router.navigate(['/'])
      })
      .catch((error) => {
        console.error('Google Sign-In failed:', error.message);
      });
  }
}
