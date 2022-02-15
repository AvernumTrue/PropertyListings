
import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})

export class UserData implements InMemoryDbService {

  createDb(): { users: User[] } {
    const users: User[] = [
      {
        id: 1,
        userId: 1,
        forenames: 'User 1',
        surname: 'Surname 1',
        email: '1@1.com',
        password: 'password1',
        isAdmin: false,
      },
      {
        id: 2,
        userId: 2,
        forenames: 'User 2',
        surname: 'Surname 2',
        email: '2@2.com',
        password: 'password2',
        isAdmin: false,
      },
      {
        id: 3,
        userId: 3,
        forenames: 'User 3',
        surname: 'Surname 3',
        email: '3@3.com',
        password: 'password3',
        isAdmin: false,
      },
      {
        id: 4,
        userId: 4,
        forenames: 'User 4',
        surname: 'Surname 4',
        email: '4@4.com',
        password: 'password4',
        isAdmin: false,
      },
    ]
    return { users };
  }
}