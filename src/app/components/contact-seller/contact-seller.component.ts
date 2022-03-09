import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Spinkit } from 'ng-http-loader';
import { Advert } from 'src/app/models/advert.model';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css']
})
export class ContactSellerComponent implements OnInit {

  @Input() advert: Advert;

  contactForm: FormGroup;
  spinnerStyle = Spinkit;
  loading: boolean;
  user: User; primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  contact: Contact;

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    name: {
      required: 'Please enter a name.',
      minlength: 'Name must be at least 8 characters.',
      maxlength: 'Name cannot exceed 100 characters.',
      pattern: 'Forename must include a letter.',
    },
    email: {
      required: 'Please enter your email address.',
      minlength: 'Email address must be at least 6 characters.',
      maxlength: 'Email address cannot exceed 100 characters.',
      email: 'Please enter a valid email address',
    },
    message: {
      required: 'Please enter a message for the seller.',
      minlength: 'Message must be at least 10 characters.',
      maxlength: 'Message cannot exceed 2000 characters.',
    },
    number: {
      maxlength: 'Phone Number cannot exceed 100 characters.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getUser(this.advert.userId).subscribe({
      next: user => {
        this.user = user;
        console.log(this.user);
        this.loading = false;
      }, error: err => {
        console.log(err);
      }
    });
    this.createForm();
  }

  selectMessage(message: string) {
    switch (message) {
      case "invalidMessage":
        this.primaryMessage = "";
        this.dangerMessage = "Please ensure all fields are valid.";
        this.successMessage = "";
        break;
      case "errorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an sending the message.";
        this.successMessage = "";
        break;
      case "successMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Message sent succesfully";
        break;
      case "sendingMessage":
        this.primaryMessage = "Sending...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      default:
        console.log("No Message");
        break;
    }
  }

  createForm(): void {

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/(^[\s\S]*[A-Za-z]{1,100}[\s\S]*$)/)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.email]],
      number: ['', [Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
  }

  isInvalid(c: AbstractControl): boolean {
    return (c.touched || c.dirty) && c.errors != null;
  }

  getErrorMessage(controlName: string, c: AbstractControl): string | void {
    if (!this.isInvalid(c)) return undefined;
    const failedValidationTypes = Object.keys(c.errors ?? {});
    if (failedValidationTypes.length === 0) return undefined;
    return this.validationMessage[controlName]?.[failedValidationTypes[0]] ?? `Validation ${failedValidationTypes[0]} failed`;
  }

  finaliseContact() {
    const contact = new Contact();
    contact.name = this.contactForm.get('name')?.value.trim();
    contact.email = this.contactForm.get('email')?.value.trim();
    contact.number = this.contactForm.get('number')?.value.trim();
    contact.message = this.contactForm.get('message')?.value.trim();
    this.contact = contact;
  }

  submit() {
    this.disableButtons = true;
    if (this.contactForm.status === 'VALID') {
      this.selectMessage("sendingMessage");
      this.finaliseContact();
      console.log(`Fake Sending Email${this.contact}`);
      this.messageSent()
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
    }
    this.contactForm.markAllAsTouched();
  }

  // TODO : contactForm's validators are not resetting correctly
  messageSent() {
    this.selectMessage("successMessage");
    this.contactForm.reset();
    this.contactForm.controls['name'].clearValidators();
    this.contactForm.controls['email'].clearValidators();
    this.contactForm.controls['message'].clearValidators();
    this.contactForm.controls['name'].markAsPristine();
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
    this.disableButtons = false;
  }
}

// The following info should be displayed and captured in this component:
// - Display the seller’s first and last name
// - Display the seller’s phone number
// - Display the seller’s email address.
// - Display a ‘Add to Favourites’ icon. If clicked, add this advert to the user’s list of favourite
// adverts.
// - Also display a contact form underneath the above detail with the following information:
// o Your Name string: required: min 5 chars, max 100 chars: Name of the user.
// o Your Email string: required: min 6 chars, max 100 chars: Check for @ only, no
// other validation necessary
// o Your Number string: not required: min 0 chars, max 100 chars: Free text, no
// validation
// o Message string: required: min 10 chars, max 2000 chars: Free text
// Actions:
// - Send Message: Validate the fields and just display a message ‘Email Sent’. We won’t
// integrate any email sending as it’s beyond the scope of this project.
// o On validation failure, highlight failed input’s and display failure alert.
// o On success, clear all inputs and display success alert.
