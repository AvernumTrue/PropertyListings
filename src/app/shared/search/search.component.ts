import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Province } from 'src/app/models/province.model';
import { ProvinceService } from 'src/app/services/province.service';

@Component({
  selector: 'pl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() applyFiltersClicked = new EventEmitter<AdvertFilter>();

  provinces: Province[];
  loading: boolean;
  selectedProvince: Province;
  selectedCity: string;
  selectedMaxFilter: number;
  selectedMinFilter: number;
  selectedKeyWord: string[];
  advertFilter: AdvertFilter;

  constructor(
    private provinceService: ProvinceService) {
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
    console.log(province);
  }

  filterCity(city: string) {
    this.selectedCity = city;
    console.log(city);
  }

  filterMinimum(minimum: number) {
    this.selectedMinFilter = minimum;
    console.log(minimum);
  }

  filterMaximum(maximum: number) {
    this.selectedMaxFilter = maximum;
    console.log(maximum);
  }

  filterKeyWord(keyWord: string) {
    // TODO 
    console.log(keyWord);
  }

  finaliseAdvertFilter() {
    const advertFilter = new AdvertFilter();
    advertFilter.selectedProvince = this.selectedProvince;
    advertFilter.selectedCity = this.selectedCity;
    advertFilter.selectedMinFilter = this.selectedMinFilter;
    advertFilter.selectedMaxFilter = this.selectedMaxFilter;
    this.advertFilter = advertFilter;
  }

  applyFilters() {
    this.finaliseAdvertFilter();
    this.applyFiltersClicked.emit(this.advertFilter);
  }
}