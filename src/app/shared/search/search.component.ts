import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Province } from 'src/app/models/province.model';
import { AdvertService } from 'src/app/services/advert.service';
import { ProvinceService } from 'src/app/services/province.service';

@Component({
  selector: 'pl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() applyFiltersEmitter = new EventEmitter<AdvertFilter>();

  spinnerStyle = Spinkit;
  searchForm!: FormGroup;
  provinces: Province[];
  loading: boolean;
  selectedProvince: Province;
  selectedCity: string;
  selectedMaxFilter: number;
  selectedMinFilter: number;
  selectedKeyWord: string;

  get advertFilter(): AdvertFilter {
    return this.advertService.advertFilter;
  }
  set advertFilter(value: AdvertFilter) {
    this.advertService.advertFilter = value;
  }

  constructor(
    private advertService: AdvertService,
    private router: Router,
    private fb: FormBuilder,
    private provinceService: ProvinceService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.createForm();
    this.provinceService.getProvinces().subscribe({
      next: provinces => {
        this.provinces = provinces;
        this.selectedProvince = this.advertService.advertFilter.selectedProvince;
        this.selectedCity = this.advertService.advertFilter.selectedCity;
        this.selectedMaxFilter = this.advertService.advertFilter.selectedMaxFilter;
        this.selectedMinFilter = this.advertService.advertFilter.selectedMinFilter;
        this.selectedKeyWord = this.advertService.advertFilter.selectedKeyWords;
        this.loading = false;
      }, error: (err: any) => {
        console.log(err);
      }
    });
  }

  createForm(): void {
    this.searchForm = this.fb.group({
      keyWord: ''
    });
  }

  cancelFilterProvince() {
    this.selectedProvince = undefined;
    this.selectedCity = undefined;
  }

  cancelFilterCity() {
    this.selectedCity = undefined;
  }

  cancelFilterMinimum() {
    this.selectedMinFilter = undefined;
  }

  cancelFilterMaximum() {
    this.selectedMaxFilter = undefined;
  }

  filterProvince(province: Province) {
    this.selectedProvince = province;
    this.selectedCity = undefined;
  }

  filterCity(city: string) {
    this.selectedCity = city;
  }

  filterMinimum(minimum: number) {
    this.selectedMinFilter = minimum;
  }

  filterMaximum(maximum: number) {
    this.selectedMaxFilter = maximum;
  }

  filterKeyWord(keyWord: string) {

  }

  clearAll() {
    this.selectedProvince = undefined;
    this.selectedCity = undefined;
    this.selectedMinFilter = undefined;
    this.selectedMaxFilter = undefined;
    this.finaliseAdvertFilter();
    this.applyFiltersEmitter.emit(this.advertFilter);
  }

  finaliseAdvertFilter() {
    const advertFilter = new AdvertFilter();
    advertFilter.selectedProvince = this.selectedProvince;
    advertFilter.selectedCity = this.selectedCity;
    advertFilter.selectedMinFilter = this.selectedMinFilter;
    advertFilter.selectedMaxFilter = this.selectedMaxFilter;
    advertFilter.selectedKeyWords = this.searchForm.get('keyWord')?.value.trim();
    this.advertFilter = advertFilter;
  }

  search() {
    this.finaliseAdvertFilter();
    this.applyFiltersEmitter.emit(this.advertFilter);
    this.loading = false;
    if (this.router.url === "/home") {
      this.router.navigate(['/sale-list']);
    }
  }
}