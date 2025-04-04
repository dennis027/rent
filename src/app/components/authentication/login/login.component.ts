import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/auth/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  credIncorrect:boolean = false;
  addingCred:boolean = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router:Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
   
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);
    }
  }
  login() {
    this.credIncorrect= false
    this.addingCred =true
    console.log(this.loginForm.value)
    this.loginService.loginUser(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);  
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

       this.router.navigate(['/home']);

       this.addingCred =false
      },
      error: (err) => {
        console.error("Login failed:", err);
        this.credIncorrect= true

        this.addingCred =false
      }
    });
  }



}