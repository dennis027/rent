import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService} from '../app/services/auth/login.service' // Import your auth service
import { jwtDecode } from "jwt-decode";  // Install with: npm install jwt-decode

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'new-era';

  constructor(private authService: LoginService, private router: Router) {}

  ngOnInit() {
    const token = this.authService.getAccessToken();
    
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const expiry = decodedToken.exp;
      const now = Math.floor(Date.now() / 1000);

      if (expiry < now) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }
}

