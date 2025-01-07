import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode:boolean = true;
  authForm: FormGroup;

  private auth = getAuth();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: ServicesService
  ) {
    // Initialize forms with validation
    this.authForm = this.fb.group({
      name: ['',!this.isLoginMode? [Validators.required]:[]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  navigateTo() {
    this.router.navigate(['/']);
  }
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    try {
      if (this.authForm.invalid) {
        alert('Please fill the form completely');
        console.log(this.authForm.errors);
        console.log(this.authForm.controls);
        return;
      }
  
      const formData = this.authForm.value;
  
      if (this.isLoginMode) {
        // Login
        this.authService.login(formData).subscribe({
          next: (res: any) => {
            alert('Login successful');
            this.authForm.reset();
            try {
              const uid = res?.id || '';
              const token = res?.token || '';
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('uid', uid);
              this.router.navigate(['/']);
            } catch (storageError) {
              console.error('Error storing session data:', storageError);
              alert('An error occurred while storing session data.');
            }
          },
          error: err => {
            console.error('Login failed:', err);
            alert(`Login failed: ${err?.error.message || 'An error occurred. Please try again.'}`);
          }
        });
      } else {
        // Register
        this.authService.register(formData).subscribe({
          next: () => {
            alert('Registration successful');
            this.authForm.reset();
          },
          error: err => {
            console.error('Registration failed:', err);
            alert(`Registration failed: ${err?.error.message || 'An error occurred. Please try again.'}`);
          }
        });
      }
    } catch (error) {
      console.error('Unexpected error in onSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }
  
  // google signup
  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();
        this.authService.googleSignUp(idToken).subscribe(
          (response) => {
            console.log('Google Sign-Up Success:', response);
            alert('Sign-Up Successful!');
            const token = response.loginToken;
            const uid = response.user.id;
            sessionStorage.setItem('uid', uid);
            sessionStorage.setItem('token', token);
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error in Google Sign-Up:', error);
            alert('Sign-Up Failed. Please try again.');
          }
        );
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
        alert('Google Sign-In Failed.');
      });
  }
}
