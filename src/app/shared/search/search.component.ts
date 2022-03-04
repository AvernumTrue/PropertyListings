import { Component, Input, OnInit } from '@angular/core';
import { Province } from 'src/app/models/province.model';
import { ProvinceService } from 'src/app/services/province.service';

@Component({
  selector: 'pl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  provinces: Province[];
  loading: boolean;
  selectedProvince: Province;

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

  filterProvince(province: Province) {
    this.selectedProvince = province;
    console.log(province)
  }

  filterCity(city: string) {
    console.log(city)
  }

  filterMinimum(minimum: number) {
    console.log(minimum)
  }

  filterMaximum(maximum: number) {
    console.log(maximum)
  }

  filterKeyWord(keyWord: string) {
    console.log(keyWord)
  }

}