import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MaterialModule } from '../../../shared-imports/imports';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/client.service';

export interface usersObjects {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const Users: usersObjects[] = [

];


export interface housesObject {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const Houses: housesObject[] = [

];


export interface receiptObject {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const Receipt: receiptObject[] = [
  
];


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  data:any


  displayedUserColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataUsersSource = new MatTableDataSource<usersObjects>(Users);

  displayedHosesColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataHousesSource = new MatTableDataSource<housesObject>(Houses);

  displayedReceiptColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataReceiptSource = new MatTableDataSource<receiptObject>(Receipt);


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  ngAfterViewInit() {
    this.dataUsersSource.paginator = this.paginator;
    this.dataHousesSource.paginator = this.paginator2;
    this.dataReceiptSource.paginator = this.paginator3;
  }

    constructor(private clientService:ClientService){
      
    }

    ngOnInit(){
      console.log(localStorage.getItem('access_token'));
      console.log(localStorage.getItem('refresh_token'));

      this.clientService.getData().subscribe({
        next: (response) => {
          this.data = response;
          console.log('Data received:', response);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });

    }


      logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log(localStorage.getItem('access_token'));
    console.log(localStorage.getItem('refresh_token'));
  }
} 
