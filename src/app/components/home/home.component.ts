import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared-imports/imports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor(){
      
    }

    ngOnInit(){
      console.log(localStorage.getItem('access_token'));
      console.log(localStorage.getItem('refresh_token'));


    }


      logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log(localStorage.getItem('access_token'));
    console.log(localStorage.getItem('refresh_token'));
  }
} 
