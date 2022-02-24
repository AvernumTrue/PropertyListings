import { AdvertStatus } from "./advert.status.enum";

export class Advert {
  userId: number;// This is the ID of the user who owns the advert
  advertStatus: AdvertStatus;
  id: number;
  headline: string;
  province: string;
  city: string;
  details: string;
  price: number;
}