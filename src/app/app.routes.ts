import { Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'home',component:HomeComponent,canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'login' } 
];
