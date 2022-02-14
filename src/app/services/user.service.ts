import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userUrl: string = 'api/users';
  constructor(private http: HttpClient) { };

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  editUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.userUrl}`, user, { headers });
  }

  addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    user.id = null as any;
    return this.http.post<User>(`${this.userUrl}`, user, { headers });
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${id}`);
  }

  // private initialiseUser(): User {

  //   return {
  //     id: 0,
  //     userId: 0,
  //     forenames: '',
  //     surname: '',
  //     email: '',
  //     password: '',
  //     isAdmin: false,
  //   };
  // }
}