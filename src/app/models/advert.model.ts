import { AdvertStatus } from "./advert.status.enum";

export class Advert {
  advertStatus: AdvertStatus;
  id: number;
  headline: string;
  province: string;
  city: string;
  details: string;
  price: number;
}