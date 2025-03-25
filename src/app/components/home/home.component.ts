import {AfterViewInit, Component, ViewChild,TemplateRef} from '@angular/core';
import { MaterialModule } from '../../../shared-imports/imports';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/client.service';
import { HousesService } from '../../services/houses.service';
import { ReceiptService } from '../../services/receipt.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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


  userForm!: FormGroup;
  rentForm!: FormGroup;
  rentalForm!: FormGroup;

  @ViewChild('addReceiptDialog') addReceiptDialog!: TemplateRef<any>;
  @ViewChild('addHouseDialog') addHouseDialog!: TemplateRef<any>;
  @ViewChild('addUsersDialog') addUsersDialog!: TemplateRef<any>;
  

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

    constructor(private clientService:ClientService, private housesService:HousesService, private receiptService:ReceiptService,private dialog: MatDialog,private fb: FormBuilder){


        this.userForm = this.fb.group({
          username: ['', [Validators.required, Validators.minLength(3)]],
          national_id: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
          phone_number: ['', [Validators.required, Validators.pattern(/^07\d{8}$/)]]
        });


        this.rentForm = this.fb.group({
          house_number: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]], // Alphanumeric
          due_date: ['', [Validators.required]], // Future date validation done in submit function
          rent_amount: [null, [Validators.required, Validators.min(1000)]], // Min rent 1000
          client_id: [null, [Validators.required, Validators.min(1)]], // Positive integer
        });

        this.rentalForm = this.fb.group({
          client: [null, Validators.required],
          house: [null, Validators.required],
          monthly_rent: [null, [Validators.required, Validators.min(1)]],
          rental_deposit: [null, [Validators.required, Validators.min(0)]],
          electricity_deposit: [null, [Validators.required, Validators.min(0)]],
          electricity_bill: [null, [Validators.required, Validators.min(0)]],
          water_deposit: [null, [Validators.required, Validators.min(0)]],
          water_bill: [null, [Validators.required, Validators.min(0)]],
          service_charge: [null, [Validators.required, Validators.min(0)]],
          security_charge: [null, [Validators.required, Validators.min(0)]],
          previous_balance: [null, [Validators.required, Validators.min(0)]],
          other_charges: [null, [Validators.required, Validators.min(0)]],
        });

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


    openAddReceiptDial() {
        let dialogRef = this.dialog.open(this.addReceiptDialog);
        dialogRef.afterClosed().subscribe(result => {
      
            if (result !== undefined) {
                if (result === 'yes') {
          
                } else if (result === 'no') {
                   
                }
            }
        })
    }


  submitForm() {
    if (this.rentalForm.valid) {
      console.log('Form Data:', this.rentalForm.value);
    } else {
      console.log('Form is invalid!');
    }
  }


    openAddHousestDial() {
      let dialogRef = this.dialog.open(this.addHouseDialog);
      dialogRef.afterClosed().subscribe(result => {
    
          if (result !== undefined) {
              if (result === 'yes') {
                 
              } else if (result === 'no') {
            
              }
          }
      })
    }

    submitRentForm() {
      if (this.rentForm.valid) {
        const formData = this.rentForm.value;
        console.log('Form Submitted:', formData);
  
        // Ensure due_date is a future date
        const today = new Date();
        const selectedDate = new Date(formData.due_date);
        if (selectedDate <= today) {
          alert('Due date must be a future date.');
          return;
        }
        
        console.log('Validated Data:', formData);
      }
    }
  


    openAddUserstDial() {
      let dialogRef = this.dialog.open(this.addUsersDialog);
      dialogRef.afterClosed().subscribe(result => {
    
          if (result !== undefined) {
              if (result === 'yes') {
                 
              } else if (result === 'no') {
            
              }
          }
      })
    }


    submitUserForm() {
      if (this.userForm.valid) {
        console.log("Form Submitted!", this.userForm.value);
      } else {
        console.log("Form has errors.");
      }
    }

} 
