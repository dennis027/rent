import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService} from "../services/auth/login.service" // Import your auth service
import { jwtDecode } from "jwt-decode";  // Install with: npm install jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getAccessToken();

    if (token && this.isTokenValid(token)) {
      return true;
    } else {
      this.router.navigate(['/login']); 
      return false;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token); // ✅ No default import issue
      const expiry = decodedToken.exp;
      const now = Math.floor(Date.now() / 1000);

      return expiry > now;
    } catch (error) {
      return false;
    }
  }
}