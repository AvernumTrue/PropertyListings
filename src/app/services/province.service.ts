import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Province } from '../models/province.model';

@Injectable({
  providedIn: 'root'
})

export class ProvinceService {

  private provinceUrl: string = 'api/provinces';
  // private provinceUrl: string = 'api/brokenAPI';  // used for testing broken API 
  constructor(private http: HttpClient) {
  };

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(this.provinceUrl).pipe(delay(2000));
  }
} 