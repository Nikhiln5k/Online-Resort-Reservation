import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  authForm: FormGroup;

  // private auth = getAuth();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: ServicesService,
    private toastr: ToastrService
  ) {
    // Initialize forms with validation
    this.authForm = this.fb.group({
      name: ['', !this.isLoginMode ? [Validators.required] : []],
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
        this.toastr.info('Please fill the form completely');
        // console.log(this.authForm.errors);
        // console.log(this.authForm.controls);
        return;
      }
      const formData = this.authForm.value;
      if (this.isLoginMode) {
        // Login
        this.authService.login(formData).subscribe({
          next: (res: any) => {
            this.toastr.success('Login successful');
            this.authForm.reset();
            try {
              const uid = res?.id || '';
              const token = res?.token || '';
              const role = res?.role || '';
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('uid', uid);
              sessionStorage.setItem('role', role);
              this.router.navigate(['/']);
            } catch (storageError) {
              // console.error('Error storing session data:', storageError);
              this.toastr.error('An error occurred while storing session data.');
            }
          },
          error: (err) => {
            // console.error('Login failed:', err);
            this.toastr.error(
              `Login failed: ${
                err?.error.message || 'An error occurred. Please try again.'
              }`
            );
          },
        });
      } else {
        // Register
        this.authService.register(formData).subscribe({
          next: () => {
            this.toastr.success('Registration successful');
            this.authForm.reset();
            this.toggleMode();
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.toastr.error(
              `Registration failed: ${
                err?.error.message || 'An error occurred. Please try again.'
              }`
            );
          },
        });
      }
    } catch (error) {
      // console.error('Unexpected error in onSubmit:', error);
      this.toastr.error('An unexpected error occurred. Please try again.');
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
            // console.log('Google Sign-Up Success:', response);
            this.toastr.success('Sign-Up Successful!');
            const token = response.loginToken;
            const uid = response.user.id;
            const role = response.user.role;
            sessionStorage.setItem('uid', uid);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role);
            this.router.navigate(['/']);
          },
          (error) => {
            // console.error('Error in Google Sign-Up:', error);
            this.toastr.error('Sign-Up Failed. Please try again.');
          }
        );
      })
      .catch((error) => {
        // console.error('Error during Google sign-in:', error);
        this.toastr.error('Google Sign-In Failed.');
      });
  }
}
