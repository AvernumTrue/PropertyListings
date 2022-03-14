export class User {
  id!: number;
  forenames!: string;
  surname!: string;
  email!: string;
  password!: string;
  isAdmin!: boolean;
  phoneNumber?: string;
  favouriteHouses?: number[] = [];
}