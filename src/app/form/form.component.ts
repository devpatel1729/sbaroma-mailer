// import { Component } from '@angular/core';
// import { MailService } from '../services/mail.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-form',
//   templateUrl: './form.component.html',
//   styleUrls: ['./form.component.scss'],
// })
// export class FormComponent {
//   public emailForm: FormGroup; // FormGroup for the form
//   private selectedFile: File | null = null; // Initialized with null to avoid TypeScript errors
//   public subject: string = '';
//   public htmlContent: string = '';
//   public errorMessage: string = '';
//   public successMessage: string = '';

//   constructor(private service: MailService, private fb: FormBuilder) {
//     this.emailForm = this.fb.group({
//       subject: ['', Validators.required],
//       htmlContent: ['', Validators.required],
//     });
//   }

//   onChange(e: any) {
//     this.selectedFile = e.target.files[0];
//     console.log(this.selectedFile);
//   }

//   sendMail(e: any) {
//     console.log('Entered');

//     if (!this.selectedFile || !this.subject || !this.htmlContent) {
//       this.errorMessage = 'Please fill all fields and select a file.';
//       return;
//     }

//     const formData = new FormData();
//     if (this.selectedFile) {
//       formData.append('file', this.selectedFile, this.selectedFile.name);
//     }

//     formData.append('subject', this.emailForm.get('subject')?.value);
//     formData.append('htmlContent', this.emailForm.get('htmlContent')?.value);

//     this.service.send(formData).subscribe((res: any) => {
//       console.log(res);
//     });
//   }

//   // save() {
//   //   console.log(this.file);
//   // }
// }
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '../services/mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public emailForm: FormGroup;
  public selectedFile: File | null = null;
  public errorMessage: string = '';
  public successMessage: string = '';
  public fileError: any;
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private service: MailService) {
    this.emailForm = this.fb.group({
      subject: ['', Validators.required],
      htmlContent: ['', Validators.required],
    });
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //   }
  // }

  onFileChange(event: any): void {
    const file = event.target.files[0]; // Get the first file
    this.fileError = null; // Reset error message

    // if (file) {
    //   // Check file type
    //   const validExtensions = ['.xlsx', '.xls'];
    //   const fileExtension = file.name.split('.').pop();

    //   if (validExtensions.includes('.' + fileExtension)) {
    //     this.selectedFile = file; // Assign the valid file to the selectedFile property
    //   } else {
    //     this.fileError = 'Please upload a valid Excel file (.xlsx or .xls).';
    //     this.selectedFile = null; // Reset selectedFile on error
    //   }
    // }

    if (file) {
      // Check file type using MIME type
      const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
      ];
  
      if (validMimeTypes.includes(file.type)) {
        this.selectedFile = file; // Assign the valid file to the selectedFile property
      } else {
        this.fileError = 'Please upload a valid Excel file (.xlsx or .xls).';
        this.selectedFile = null; // Reset selectedFile on error
      }
    }
  }

  sendMail(event: any) {
    this.isLoading = true;
    event.preventDefault();
    console.log(this.emailForm);
    this.isSubmitted = true;

    if (!this.selectedFile || !this.emailForm.valid) {
      this.errorMessage = 'Please fill all fields and select a file.';
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile!, this.selectedFile!.name);
    formData.append('subject', this.emailForm.get('subject')?.value);
    formData.append('htmlContent', this.emailForm.get('htmlContent')?.value);

    this.service.send(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Emails sent successfully!';
        this.errorMessage = '';
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: 'Emails Sent Successfully',
          icon: 'success',
          timer: 3000, // Set the timer to 3000 milliseconds (3 seconds)
          timerProgressBar: true,
        });
        this.clearFields();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error sending emails. Please try again.';
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send Email',
          icon: 'error',
          timer: 3000, // Set the timer to 3000 milliseconds (3 seconds)
          timerProgressBar: true,
        });
        console.error('Error:', err);
        this.clearFields();
      },
    });
  }

   // Method to clear input fields
   clearFields() {
    this.selectedFile = null;
    // Clear the file input field
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
    this.emailForm.reset(); // Reset the form fields
    this.fileError = null; // Reset any file error messages
    this.isSubmitted = false; // Reset submission state
  }
}
