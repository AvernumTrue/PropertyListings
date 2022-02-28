import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Advert } from '../models/advert.model';

@Injectable({
  providedIn: 'root'
})

export class AdvertService {

  private advertUrl: string = 'api/adverts';
  // private advertUrl: string = 'api/brokenAPI';  // used for testing broken API 
  constructor(private http: HttpClient) {
  };

  getAdvert(id: number): Observable<Advert> {
    return this.http.get<Advert>(`${this.advertUrl}/${id}`).pipe(delay(2000));
  }

  getAdverts(): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000));
  }

  editAdvert(advert: Advert): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Advert>(`${this.advertUrl}`, advert, { headers }).pipe(delay(2000));
  }

  addAdvert(advert: Advert): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    advert.id = null as any;
    return this.http.post<Advert>(`${this.advertUrl}`, advert, { headers }).pipe(delay(2000));
  }

  getAdvertsByUserId(userId: number): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl).pipe(map(x => x.filter(a => a.userId === userId && a.advertStatus !== "DELETED"))).pipe(delay(2000));
  }

} 