import {AfterViewInit, Component,ElementRef, ViewChild,TemplateRef} from '@angular/core';
import { MaterialModule } from '../../../shared-imports/imports';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ClientService } from '../../services/client.service';
import { HousesService } from '../../services/houses.service';
import { ReceiptService } from '../../services/receipt.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SystemParametersService } from '../../services/system-parameters.service';
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
  last_reading:string;
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
  userUpdateForm!:FormGroup
  houseForm!: FormGroup;
  houseUpdateForm!:FormGroup
  receiptForm!: FormGroup;
  receiptUpdateForm!:FormGroup
  systemParamsForm!:FormGroup
  

  loadUserForm:boolean=false
  loadUserUpdateForm:boolean=false
  loadHousesForm:boolean = false
  loadHousesUpdateForm:boolean=false
  loadReceiptForm:boolean =false
  loadReceiptUpdateForm:boolean=false
  loadSystemParamsForm:boolean = false
  @ViewChild('addReceiptDialog') addReceiptDialog!: TemplateRef<any>;
  @ViewChild('addHouseDialog') addHouseDialog!: TemplateRef<any>;
  @ViewChild('addUsersDialog') addUsersDialog!: TemplateRef<any>;
  @ViewChild('receiptPreviewDialog') receiptPreviewDialog!: TemplateRef<any>;
  @ViewChild('updateUserDialog') updateUserDialog!: TemplateRef<any>;
  @ViewChild('openUpdateHouseDial') openUpdateHouseDial!: TemplateRef<any>;
  @ViewChild('openUpdateReceiptDialog') openUpdateReceiptDialog!: TemplateRef<any>;
  @ViewChild('deleteUserDial') deleteUserDial!: TemplateRef<any>;
  @ViewChild('deleteHouseDial') deleteHouseDial!: TemplateRef<any>;
  @ViewChild('deleteReceiptDial') deleteReceiptDial!: TemplateRef<any>;
  @ViewChild('openSystParameterDial') openSystParameterDial!: TemplateRef<any>;



  @ViewChild('receiptPreview', { static: false }) receiptPreview!: ElementRef;


  receipt: any = null;

  receiptItems: any[] = [];

  formattedDate: string = '';

  receiptClientName:any

  houseNameNo:any

  currentID:any
  currentHouseID:any
  currentReceiptId:any

  systemParams:any



  generatePDF() {
    const element = this.receiptPreview.nativeElement;
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`receipt_${this.receipt.receipt_number}.pdf`);
    });
  }
  

  data:any


   // Function to allow only future dates
   futureDatesOnly = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to start of the day
    return d !== null && d > today; // Disable past and today
  };



  usersObject: usersObjects[] = [];
  displayedUserColumns: string[] = ['id', 'username', 'national_id', 'phone_number','actions'];
  dataUsersSource = new MatTableDataSource<usersObjects>(this.usersObject);


  housesObject: housesObject[] = []; 
  displayedHosesColumns: string[] = ['id', 'house_number','last_reading', 'due_date', 'rent_amount','actions'];
  dataHousesSource = new MatTableDataSource<housesObject>(this.housesObject);


  receiptObject: receiptObject[] = [];
  displayedReceiptColumns: string[] = ['receipt_number', 'total_amount', 'date_issued', 'monthly_rent','rental_deposit', 'electricity_deposit','electricity_bill',  'water_deposit','water_bill', 'service_charge', 'security_charge', 'previous_balance','other_charges','actions'];
  dataReceiptSource = new MatTableDataSource<receiptObject>(this.receiptObject);


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  receiptData:any

  ngAfterViewInit() {
    this.dataUsersSource.paginator = this.paginator;
    this.dataHousesSource.paginator = this.paginator2;
    this.dataReceiptSource.paginator = this.paginator3;
  }

    constructor(private clientService:ClientService, private housesService:HousesService, private receiptService:ReceiptService,private dialog: MatDialog,private fb: FormBuilder,private toastr: ToastrService,private systemParamsService:SystemParametersService){

      this.getUserForm();
      this.getHouseForm();
      this.getReceiptForm();
      this.getUserUpdateForm();
      this.getHouseUpdateForm();
      this.getReceiptUpdateForm();
      this.getSystemParamsForm()
    }

    getSystemParamsForm(){
      this.systemParamsForm = this.fb.group({
        unit_cost:[0, [Validators.required, Validators.min(0)]],
        base_value:[0, [Validators.required, Validators.min(0)]],
      })
    }

    getUserForm(){
      
      this.userForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        national_id: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        phone_number: ['', [Validators.required, Validators.pattern(/^(07|01)\d{8}$/)]]
      });
    }
    getUserUpdateForm(){
      
      this.userUpdateForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        national_id: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        phone_number: ['', [Validators.required, Validators.pattern(/^(07|01)\d{8}$/)]]
      });
    }
    getHouseForm(){
      this.houseForm = this.fb.group({
        house_number: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]], // Alphanumeric
        due_date: ['', [Validators.required]], // Future date validation done in submit function
        rent_amount: [0, [Validators.required, Validators.min(1000)]], // Min rent 1000
        last_reading: [0, [Validators.required, Validators.min(0)]], // Min last reading 0
      });
    }
    getHouseUpdateForm(){
      this.houseUpdateForm = this.fb.group({
        house_number: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]], // Alphanumeric
        due_date: ['', [Validators.required]], // Future date validation done in submit function
        rent_amount: [0, [Validators.required, Validators.min(1000)]], // Min rent 1000
        last_reading: [0, [Validators.required, Validators.min(0)]], // Min last reading 0
      });
    }
    getReceiptForm(){
      this.receiptForm = this.fb.group({
        client: [null, Validators.required],  // Dropdown should be null
        house: [null, Validators.required],   // Dropdown should be null
        monthly_rent: [0, [Validators.required, Validators.min(1)]], 
        rental_deposit: [0, [Validators.required, Validators.min(0)]],
        electricity_deposit: [0, [Validators.required, Validators.min(0)]],
        electricity_bill: [0, [Validators.required, Validators.min(0)]],
        water_deposit: [0, [Validators.required, Validators.min(0)]],
        water_bill: [0, [Validators.required, Validators.min(0)]],
        service_charge: [0, [Validators.required, Validators.min(0)]],
        security_charge: [0, [Validators.required, Validators.min(0)]],
        previous_balance: [0, [Validators.required, Validators.min(0)]],
        other_charges: [0, [Validators.required, Validators.min(0)]],
        previous_water_reading: [null, Validators.required],
        current_water_reading: [null, Validators.required],
      });
    }


    getReceiptUpdateForm(){
      this.receiptUpdateForm = this.fb.group({
        client: [null, Validators.required],  // Dropdown should be null
        house: [null, Validators.required],   // Dropdown should be null
        monthly_rent: [0, [Validators.required, Validators.min(1)]], 
        rental_deposit: [0, [Validators.required, Validators.min(0)]],
        electricity_deposit: [0, [Validators.required, Validators.min(0)]],
        electricity_bill: [0, [Validators.required, Validators.min(0)]],
        water_deposit: [0, [Validators.required, Validators.min(0)]],
        water_bill: [0, [Validators.required, Validators.min(0)]],
        service_charge: [0, [Validators.required, Validators.min(0)]],
        security_charge: [0, [Validators.required, Validators.min(0)]],
        previous_balance: [0, [Validators.required, Validators.min(0)]],
        other_charges: [0, [Validators.required, Validators.min(0)]],
        previous_water_reading: [null, Validators.required],
        current_water_reading: [null, Validators.required],
      });
    }

    formatDate(date: Date): string {
      return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
    }

    ngOnInit(){
      console.log(localStorage.getItem('access_token'));
      console.log(localStorage.getItem('refresh_token'));

      this.getUsersData();
      this.getHousesData();
      this.getReceiptData();
      this.getSystemParams();

    }

    getSystemParams(){
        this.systemParamsService.getData().subscribe({
          next: (response) => {
            console.log('System parameters:', response);
            this.systemParams = response;
          },
          error: (error) => {
            console.error('Error fetching system parameters:', error);
          }
        })
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
  }


    openAddReceiptDial() {
      this.getReceiptForm();
        let dialogRef = this.dialog.open(this.addReceiptDialog);
        dialogRef.afterClosed().subscribe(result => {
      
            if (result !== undefined) {
                if (result === 'yes') {
          
                } else if (result === 'no') {
                   
                }
            }
        })
    }


    submitReceiptForm() {
      this.loadReceiptForm = true;
      if (this.receiptForm.valid) {
        console.log('Form Data:', this.receiptForm.value);
        this.receiptService.addReceipts(this.receiptForm.value).subscribe(
          (response) => {
            console.log("Receipt added successfully.", response);
            this.getReceiptData();
            this.loadReceiptForm = false;
            this.receiptForm.reset();  // Keep this instead of re-initializing the form
            this.dialog.closeAll();
            this.toastr.success('Receipt saved successfully!', 'Success');
          },
          (error) => {
            console.error("Error adding user.", error);
            this.loadReceiptForm = false;
          }
        );
      } else {
        console.log(this.receiptForm.value);
        console.log('Form is invalid!');
      }
    }


    calculateWaterBill() {
      const prevReading = Number(this.receiptForm.get('previous_water_reading')?.value) || 0;
      const currentReading = Number(this.receiptForm.get('current_water_reading')?.value) || 0;
    
      const totalUnits = Math.max(currentReading - prevReading, 0); // Prevent negative values
      let waterBill = (this.systemParams?.unit_cost * totalUnits);
      waterBill +=this.systemParams?.base_value
    
      console.log(`Previous: ${prevReading}, Current: ${currentReading}, Units: ${totalUnits}, Bill: ${waterBill}`);
    
      this.receiptForm.patchValue({ water_bill: waterBill });
    }
    

    calculateUpdatesWaterBill() {
      const prevReading = Number(this.receiptUpdateForm.get('previous_water_reading')?.value) || 0;
      const currentReading = Number(this.receiptUpdateForm.get('current_water_reading')?.value) || 0;
    
      const totalUnits = Math.max(currentReading - prevReading, 0); // Prevent negative values
      let waterBill = (this.systemParams?.unit_cost * totalUnits);
      waterBill +=this.systemParams?.base_value
    
      console.log(`Previous: ${prevReading}, Current: ${currentReading}, Units: ${totalUnits}, Bill: ${waterBill}`);
    
      this.receiptUpdateForm.patchValue({ water_bill: waterBill });
    }
    



    openAddHousestDial() {
      this.getHouseForm();
      let dialogRef = this.dialog.open(this.addHouseDialog);
      dialogRef.afterClosed().subscribe(result => {
    
          if (result !== undefined) {
              if (result === 'yes') {
                 
              } else if (result === 'no') {
            
              }
          }
      })
    }


    checkHouseNumber(){
      const inputHouseNumber = this.houseForm.value.house_number?.trim(); // Ensure it's a string
      const matchedHouse = this.dataHousesSource.data.find(
        (house: any) => String(house.house_number) === String(inputHouseNumber)
      );

      if (matchedHouse) {
        this.houseForm.get('house_number')?.setValue('');
        this.toastr.info("House number already exists!"," Try add House number")
      } else {
      }
    }

    checkUserIdNumber(){
      const inputIDNumber = this.userForm.value.national_id?.trim(); // Ensure it's a string
      const matchedHouse = this.dataUsersSource.data.find(
        (user: any) => String(user.national_id) === String(inputIDNumber)
      );

      if (matchedHouse) {
        this.userForm.get('national_id')?.setValue('');
        this.toastr.info("National ID already exists!"," User Exists")
      } else {
      }
    }

    checkUserPhoneNumber(){
      const inputIDNumber = this.userForm.value.phone_number?.trim(); // Ensure it's a string
      const matchedHouse = this.dataUsersSource.data.find(
        (user: any) => String(user.phone_number) === String(inputIDNumber)
      );

      if (matchedHouse) {
        this.userForm.get('phone_number')?.setValue('');
        this.toastr.info("Phone Number already exists!"," User Exists")
      } else {
      }
    }

    submitHouseForm() {
      this.loadHousesForm = true
      if (this.houseForm.valid) {
        const formData = this.houseForm.value;
        console.log('Form Submitted:', formData);
  
        // Ensure due_date is a future date
        const today = new Date();
        const selectedDate = new Date(formData.due_date);
        if (selectedDate <= today) {
          alert('Due date must be a future date.');
          return;
        }

        const data = {
          house_number: formData.house_number,
          due_date: this.formatDate(selectedDate),
          rent_amount: formData.rent_amount,
          client_id: formData.client_id
        }
        
        this.housesService.addHouses(data).subscribe(
          (response) => {
            console.log("House added successfully.", response);
            this.toastr.success('House saved successfully!', 'Success');
            this.getHousesData();
            this.loadHousesForm = false
            this.dialog.closeAll()
            this.houseForm.reset();
          },
          (error) => {
            console.error("Error adding user.", error);
            this.toastr.error('Something went wrong!', 'Error');
            this.loadHousesForm = false
          }
        )


        console.log('Validated Data:', formData);
      }
    }
  


    openAddUserstDial() {
      this.getUserForm();
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
      this.loadUserForm =true
      if (this.userForm.valid) {
        console.log("Form Submitted!", this.userForm.value);
        this.clientService.addUser(this.userForm.value).subscribe(
          (response) => {
            this.toastr.success('User saved successfully!', 'Success');
            this.dialog.closeAll();
            this.getUsersData();
            this.loadUserForm = false
            this.userForm.reset();
          },
          (error) => {
            console.error("Error adding user.", error);
            this.toastr.error('Something went wrong!', 'Error');
            this.loadUserForm = false
          }
        )
      } else {
        console.log("Form has errors.");
      }
    }




    generateReceipt(id:any){
      this.receiptData = id
      this.receipt = this.receiptData;
      console.log ( this.receipt.client )


      this.receiptClientName = this.dataUsersSource.data.find((u: any) => u.id === this.receipt.client)?.username || "User not found";
      this.houseNameNo = this.dataHousesSource.data.find((u: any) => u.id === this.receipt.house)?.house_number || "House not found";

  
      

            // Format the receipt items dynamically
      this.receiptItems = [
        { label: 'Monthly Rent', amount: parseFloat(this.receipt.monthly_rent) },
        { label: 'Rental Deposit', amount: parseFloat(this.receipt.rental_deposit) },
        { label: 'Electricity Deposit', amount: parseFloat(this.receipt.electricity_deposit) },
        { label: 'Electricity Bill', amount: parseFloat(this.receipt.electricity_bill) },
        { label: 'Water Deposit', amount: parseFloat(this.receipt.water_deposit) },
        { label: 'Water Bill', amount: parseFloat(this.receipt.water_bill) },
        { label: 'Service Charge', amount: parseFloat(this.receipt.service_charge) },
        { label: 'Security Charge', amount: parseFloat(this.receipt.security_charge) },
        { label: 'Previous Balance', amount: parseFloat(this.receipt.previous_balance) },
        { label: 'Other Charges', amount: parseFloat(this.receipt.other_charges) }
      ];

      this.formattedDate = new Date(this.receipt.date_issued).toLocaleDateString();
    }



    openReceiptReview() {
      let dialogRef = this.dialog.open(this.receiptPreviewDialog,{
        width: '800px',
        height: 'auto',
        panelClass: 'receipt-preview-dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
              if (result === 'yes') {
             
              } else if (result === 'no') {
          
              }
          }
      })
  }


  getHouseDetails(id: any) {

    const houseObject = this.dataHousesSource.data.find(house => house.id === id);
    console.log(houseObject)
    this.receiptForm.patchValue({ monthly_rent: houseObject?.rent_amount });
    this.receiptForm.patchValue({ previous_water_reading: houseObject?.last_reading });
  
  }


  updateUser(id:any){
    console.log(id)
    const userObject = this.dataUsersSource.data.find(house => house.id === id);
    this.userUpdateForm.patchValue({ username: userObject?.username });
    this.userUpdateForm.patchValue({ national_id: userObject?.national_id });
    this.userUpdateForm.patchValue({ phone_number: userObject?.phone_number });
    this.currentID = id
    let dialogRef = this.dialog.open(this.updateUserDialog);
    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            if (result === 'yes') {
      
            } else if (result === 'no') {
     
            }
        }
    })
  }

  submitUserUpdateForm() {

    this.loadUserUpdateForm =true
    if (this.userUpdateForm.valid) {
      console.log("Form Submitted!", this.userUpdateForm.value);
      this.clientService.updateUser(this.currentID,this.userUpdateForm.value).subscribe(
        (response) => {
          this.toastr.success('User Update successfully!', 'Success');
          this.dialog.closeAll();
          this.getUsersData();
          this.loadUserUpdateForm = false
          this.userUpdateForm.reset();
        },
        (error) => {
          console.error("Error Updating user.", error);
          this.toastr.error('Something went wrong!', 'Error');
          this.loadUserUpdateForm = false
        }
      )
    } else {
      console.log("Form has errors.");
    }
  }

  deleteUser(id:any){
    console.log(id)
    const userObject = this.dataUsersSource.data.find(house => house.id === id);
    console.log(userObject)
    let dialogRef = this.dialog.open(this.deleteUserDial);
    dialogRef.afterClosed().subscribe(result => {

        if (result !== undefined) {
            if (result === 'yes') {
            
              this.clientService.deleteUser(id).subscribe(
                (response) => {
                  this.toastr.success('User Deleted successfully!', 'Success');
                  this.getUsersData();
                },
                (error) => {
                  console.error("Error deleting user.", error);
                  this.toastr.error('Something went wrong!', 'Error');
                }
              )
          
            } else if (result === 'no') {
          
            }
        }
    })
  }


  updateHouses(id:any){
    const houseObject = this.dataHousesSource.data.find(house => house.id === id);
    console.log(houseObject)

    this.houseUpdateForm.patchValue({ house_number: houseObject?.house_number });
    this.houseUpdateForm.patchValue({ due_date: houseObject?.due_date });
    this.houseUpdateForm.patchValue({ rent_amount: houseObject?.rent_amount });
    this.houseUpdateForm.patchValue({ last_reading: houseObject?.last_reading });

    this.currentHouseID = id

    let dialogRef = this.dialog.open(this.openUpdateHouseDial);
    dialogRef.afterClosed().subscribe(result => {
    
        if (result !== undefined) {
            if (result === 'yes') {
      
            } else if (result === 'no') {
    
            }
        }
    })

  }

  submitHouseUpdateForm(){
    this.loadHousesUpdateForm = true
    if (this.houseUpdateForm.valid) {
      const formData = this.houseUpdateForm.value;
      console.log('Form Submitted:', formData);

      // Ensure due_date is a future date
      const today = new Date();
      const selectedDate = new Date(formData.due_date);
      if (selectedDate <= today) {
        alert('Due date must be a future date.');
        return;
      }

      const data = {
        house_number: formData.house_number,
        due_date: this.formatDate(selectedDate),
        rent_amount: formData.rent_amount,
        client_id: formData.client_id
      }
      
      this.housesService.updateHouse(this.currentHouseID,data).subscribe(
        (response) => {
          this.toastr.success('House Updated successfully!', 'Success');
          this.getHousesData();
          this.loadHousesUpdateForm = false
          this.dialog.closeAll()
          this.houseUpdateForm.reset();
        },
        (error) => {
          console.error("Error adding user.", error);
          this.toastr.error('Something went wrong!', 'Error');
          this.loadHousesUpdateForm = false
        }
      )


      console.log('Validated Data:', formData);
    }
  }

  deleteHouses(id:any){
    const houseObject = this.dataHousesSource.data.find(house => house.id === id);
    console.log(houseObject)
    let dialogRef = this.dialog.open(this.deleteHouseDial);
    dialogRef.afterClosed().subscribe(result => {
    
        if (result !== undefined) {
            if (result === 'yes') {
              this.housesService.deleteHouses(id).subscribe(
                (response) => {
                  this.toastr.success('House Deleted successfully!', 'Success');
                  this.getHousesData();
                },
                (error) => {
                  console.error("Error deleting user.", error);
                  this.toastr.error('Something went wrong!', 'Error');
                }
              )
            } else if (result === 'no') {
                // TODO: Replace the following line with your code.
                console.log('User clicked no.');
            }
        }
    })


    
  }

  getReceiptId(id:any){
    this.currentReceiptId = id.receipt_number
    this.receiptUpdateForm.patchValue({ client: id?.client });
    this.receiptUpdateForm.patchValue({ house: id?.house });
    this.receiptUpdateForm.patchValue({ monthly_rent: id?.monthly_rent });
    this.receiptUpdateForm.patchValue({ rental_deposit: id?.rental_deposit });
    this.receiptUpdateForm.patchValue({ electricity_deposit: id?.electricity_deposit });
    this.receiptUpdateForm.patchValue({ electricity_bill: id?.electricity_bill });
    this.receiptUpdateForm.patchValue({ water_deposit: id?.water_deposit });
    this.receiptUpdateForm.patchValue({ water_bill: id?.water_bill });
    this.receiptUpdateForm.patchValue({ service_charge: id?.service_charge });
    this.receiptUpdateForm.patchValue({ security_charge: id?.security_charge });
    this.receiptUpdateForm.patchValue({ previous_balance: id?.previous_balance });
    this.receiptUpdateForm.patchValue({ other_charges: id?.other_charges });
    this.receiptUpdateForm.patchValue({ previous_water_reading: id?.previous_water_reading });
    this.receiptUpdateForm.patchValue({ current_water_reading: id?.current_water_reading });
    
    let dialogRef = this.dialog.open(this.openUpdateReceiptDialog);
    dialogRef.afterClosed().subscribe(result => {
    
        if (result !== undefined) {
            if (result === 'yes') {
            
            } else if (result === 'no') {
          
            }
        }
    })
  }

  submitReceiptUpdateForm(){
    this.loadReceiptUpdateForm = true
    if (this.receiptUpdateForm.valid) {
      console.log("Form Submitted!", this.receiptUpdateForm.value);
      this.receiptService.updateReceipt(this.currentReceiptId,this.receiptUpdateForm.value).subscribe(
        (response) => {
          this.toastr.success('Receipt Update successfully!', 'Success');
          this.dialog.closeAll();
          this.getReceiptData();
          this.loadReceiptUpdateForm = false
          this.receiptUpdateForm.reset();
        },
        (error) => {
          console.error("Error Updating user.", error);
          this.toastr.error('Something went wrong!', 'Error');
          this.loadReceiptUpdateForm = false
        }
      )
    } else {
      console.log("Form has errors.");
    }
  }

  deleteReceipt(id:any){
    this.currentReceiptId = id.receipt_number
    console.log(this.currentReceiptId)

    let dialogRef = this.dialog.open(this.deleteReceiptDial);
    dialogRef.afterClosed().subscribe(result => {
    
        if (result !== undefined) {
            if (result === 'yes') {
              this.receiptService.deleteReceipt(this.currentReceiptId).subscribe(
                (response) => {
                  this.toastr.success('Receipt Deleted successfully!', 'Success');
                  this.getReceiptData();
                },
                (error) => {
                  console.error("Error deleting user.", error);
                  this.toastr.error('Something went wrong!', 'Error');
                }
              )
            } else if (result === 'no') {

            }
        }
    })

  }

  updateSystemParameters(){
    this.loadSystemParamsForm = true
    if (this.systemParamsForm.valid){
      console.log("Form Submitted!", this.systemParamsForm.value);
      this.systemParamsService.updateSystemParams(this.systemParamsForm.value).subscribe(
        (response) => {
          this.toastr.success('System Parameters Update successfully!', 'Success');
          this.dialog.closeAll();
          this.getSystemParams();
          this.loadSystemParamsForm = false
          this.systemParamsForm.reset();
        },
        (error) => {
          console.error("Error Updating user.", error);
          this.toastr.error('Something went wrong!', 'Error');
          this.loadSystemParamsForm = false
        }
      )
    }
    else{
      console.log("Form has errors.")
    }
  }



  openSystemSettings(){

    this.systemParamsForm.patchValue({ unit_cost: this.systemParams?.unit_cost });
    this.systemParamsForm.patchValue({ base_value: this.systemParams?.base_value });
    let dialogRef = this.dialog.open(this.openSystParameterDial,{
      width: '800px',
      height: 'auto',
      panelClass: 'receipt-preview-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
    
        if (result !== undefined) {
            if (result === 'yes') {
        
            } else if (result === 'no') {
               
            }
        }
    })
  }


} 
