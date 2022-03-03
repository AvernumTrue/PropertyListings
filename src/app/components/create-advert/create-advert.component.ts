import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';
import { AdvertStatus } from 'src/app/models/advert.status.enum';
import { Spinkit } from 'ng-http-loader';
import { Province } from 'src/app/models/province.model';
import { ProvinceService } from 'src/app/services/province.service';

@Component({
  selector: 'pl-create-advert',
  templateUrl: './create-advert.component.html',
  styleUrls: ['./create-advert.component.css']
})
export class CreateAdvertComponent implements OnInit {

  spinnerStyle = Spinkit;
  loading = true;
  advertForm: FormGroup;
  saveErrorMessage: string;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  provinces: Province[];
  selectedProvince: Province;

  advert: Advert;
  advertId: number;

  get isEditing() {
    return this.advertId != 0;
  }

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    headline: {
      pattern: 'Headline must be at least 10 non-whitespace characters long.',
      required: 'Please enter a headline.',
      minlength: 'Headline must be at least 10 characters long.',
      maxlength: 'Headline cannot be longer than 100 characters.',
    },
    details: {
      pattern: 'Details must be at least 10 non-whitespace characters long.',
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
    private route: ActivatedRoute,
    private router: Router,
    private provinceService: ProvinceService,
    private advertService: AdvertService) {
    this.advertId = Number(route.snapshot.paramMap.get('advertIndex'));
  }

  ngOnInit(): void {

    this.provinceService.getProvinces().subscribe({
      next: provinces => {
        this.provinces = provinces;
        this.loading = false;
      }, error: (err: any) => {
        console.log(err);
      }
    });

    if (this.advertId !== 0) {
      this.advertService.getAdvert(this.advertId).subscribe({
        next: advert => {
          this.advert = advert;
          this.onProvinceChanged(this.advert.province);
          this.createForm();
          this.loading = false;
        }, error: err => {
          console.log(err);
        }
      });
    }
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
        this.dangerMessage = "There was an error saving the advert.";
        this.successMessage = "";
        break;
      case "saveSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Advert saved, navigating to My Adverts page...";
        break;
      case "savingMessage":
        this.primaryMessage = "Saving...";
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
      headline: [this.advert?.headline ?? '', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.pattern(/(\s*(?:\S\s*){10,100}$)/)]],
      province: [this.advert?.province ?? '', [Validators.required]],
      city: [this.advert?.city ?? '', [Validators.required]],
      details: [this.advert?.details ?? '', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), Validators.pattern(/(\s*(?:\S\s*){10,1000}$)/)]],
      price: [this.advert?.price ?? '', [Validators.required, Validators.min(10000), Validators.max(100000000)]],
    });

    this.advertForm.get('province')?.valueChanges.subscribe(
      (value: string) => this.onProvinceChanged(value)
    );
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

  onProvinceChanged(selectedProvince: string) {
    const result = this.provinces.find((province) => {
      this.advertForm.patchValue({
        city: ''
      })
      return province.province === selectedProvince;
    });
    this.selectedProvince = result;
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
    advert.userId = Number(localStorage.getItem('loggedInId'));
    this.advert = advert;
  }

  submit() {
    this.disableButtons = true;
    if (this.advertForm.status === 'VALID') {
      this.selectMessage("savingMessage");
      if (this.isEditing) {
        this.editAdvert();
      }
      if (!this.isEditing) {
        this.addAdvert();
      }
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
    }
    this.advertForm.markAllAsTouched();
  }

  editAdvert() {
    this.finaliseAdvert();
    this.advertService.editAdvert(this.advert).subscribe({
      next: () => {
        this.onSaveComplete();
      },
      error: () => {
        this.selectMessage("saveErrorMessage");
      }
    });
  }

  addAdvert() {
    this.finaliseAdvert();
    this.advertService.addAdvert(this.advert).subscribe({
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