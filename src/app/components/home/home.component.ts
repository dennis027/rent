import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MaterialModule } from '../../../shared-imports/imports';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/client.service';
import { HousesService } from '../../services/houses.service';
import { ReceiptService } from '../../services/receipt.service';

export interface usersObjects {
  id: string;
  username: number;
  national_id: number;
  phone_number: string;
}




export interface housesObject {
  id: string;
  house_number: number;
  due_date: number;
  rent_amount: string;
}



export interface receiptObject {
  receipt_number: string;
  total_amount: number;
  date_issued: number;
  monthly_rent: string;
  rental_deposit: string;
  electricity_deposit: number;
  electricity_bill: number;
  water_deposit: string;
  water_bill: string;
  service_charge: number;
  security_charge: number;
  previous_balance: string;
  symbol: string;
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  data:any


  usersObject: usersObjects[] = [];
  displayedUserColumns: string[] = ['id', 'username', 'national_id', 'phone_number'];
  dataUsersSource = new MatTableDataSource<usersObjects>(this.usersObject);


  housesObject: housesObject[] = []; 
  displayedHosesColumns: string[] = ['id', 'house_number', 'due_date', 'rent_amount'];
  dataHousesSource = new MatTableDataSource<housesObject>(this.housesObject);


  receiptObject: receiptObject[] = [];
  displayedReceiptColumns: string[] = ['receipt_number', 'total_amount', 'date_issued', 'monthly_rent','rental_deposit', 'electricity_deposit','electricity_bill',  'water_deposit','water_bill', 'service_charge', 'security_charge', 'previous_balance','other_charges'];
  dataReceiptSource = new MatTableDataSource<receiptObject>(this.receiptObject);


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  ngAfterViewInit() {
    this.dataUsersSource.paginator = this.paginator;
    this.dataHousesSource.paginator = this.paginator2;
    this.dataReceiptSource.paginator = this.paginator3;
  }

    constructor(private clientService:ClientService, private housesService:HousesService, private receiptService:ReceiptService){
      
    }

    ngOnInit(){
      console.log(localStorage.getItem('access_token'));
      console.log(localStorage.getItem('refresh_token'));

      this.getUsersData();
      this.getHousesData();
      this.getReceiptData();

    }

    getUsersData(){
      this.clientService.getData().subscribe({
        next: (response) => {
          this.data = response;
          this.dataUsersSource.data = this.data;
          console.log('Data received:', response);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
    }

    getHousesData(){
      this.housesService.getData().subscribe({
        next: (response) => {
          this.data = response;
          this.dataHousesSource.data = this.data;
          console.log('Data received:', response);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
    }

    getReceiptData(){
      this.receiptService.getData().subscribe({
        next: (response) => {
          this.data = response;
          this.dataReceiptSource.data = this.data;
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
