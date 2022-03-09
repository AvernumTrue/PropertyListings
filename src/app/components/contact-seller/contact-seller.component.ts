import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pl-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css']
})
export class ContactSellerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

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
