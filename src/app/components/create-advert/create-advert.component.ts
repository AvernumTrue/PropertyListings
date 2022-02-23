import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import provinces from 'src/app/models/province-data';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';
import { delay } from 'rxjs';
import { AdvertStatus } from 'src/app/models/advert.status.enum';

@Component({
  selector: 'pl-create-advert',
  templateUrl: './create-advert.component.html',
  styleUrls: ['./create-advert.component.css']
})
export class CreateAdvertComponent implements OnInit {

  advertForm: FormGroup;
  errorMessage: string;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;

  advert: Advert;
  advertId: number;

  provinces = provinces;

  get isEditing() {
    return this.advertId != 0;
  }

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    headline: {
      required: 'Please enter a headline.',
      minlength: 'Headline must be at least 10 characters long.',
      maxlength: 'Headline cannot be longer than 100 characters.',
    },
    details: {
      required: 'Please enter details.',
      minlength: 'Details must be at least 10 characters long.',
      maxlength: 'Details cannot be longer than 1000 characters.',
    },
    price: {
      required: 'Please enter a price.',
      min: 'Price must be at least 10000.',
      max: 'Price cannot be more than 100000000.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private advertService: AdvertService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  selectMessage(message: string) {
    switch (message) {
      case "invalidMessage":
        this.primaryMessage = "";
        this.dangerMessage = "Please ensure all fields are valid.";
        this.successMessage = "";
        break;
      case "saveErrorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an error publishing the advert.";
        this.successMessage = "";
        break;
      case "saveSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Successfully published, navigating to My Adverts page...";
        break;
      case "savingMessage":
        this.primaryMessage = "Publishing...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      default:
        console.log("No Message");
        break;
    }
  }

  createForm(): void {

    this.advertForm = this.fb.group({
      headline: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      price: ['', [Validators.required, Validators.min(10000), Validators.max(100000000)]],
      id: 0
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

  finaliseAdvert() {
    const advert = new Advert();
    advert.id = this.advertId;
    advert.headline = this.advertForm.get('headline')?.value;
    advert.province = this.advertForm.get('province')?.value;
    advert.city = this.advertForm.get('city')?.value;
    advert.details = this.advertForm.get('details')?.value;
    advert.price = this.advertForm.get('price')?.value;
    advert.advertStatus = AdvertStatus.Live;
    this.advert = advert;
    console.log(this.advertForm.get('province')?.value);
  }

  submit() {
    this.disableButtons = true;
    if (this.advertForm.status === 'VALID') {
      this.selectMessage("savingMessage");
      this.addAdvert();
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
    }
    this.advertForm.markAllAsTouched();
  }

  addAdvert() {
    this.finaliseAdvert();
    this.advertService.addAdvert(this.advert).pipe(delay(2000)).subscribe({
      next: () => {
        this.onSaveComplete();
      },
      error: () => {
        this.disableButtons = false;
        this.selectMessage("saveErrorMessage");
      }
    });
  }

  async onSaveComplete(): Promise<void> {
    this.selectMessage("saveSuccessMessage");
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.advertForm.reset();
    this.router.navigate(['/my-adverts']);
  }
}
