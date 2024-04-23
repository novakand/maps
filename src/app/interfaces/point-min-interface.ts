import { ISmallImage } from './images-small.interface';
import { PointServiceType } from '../enums/point-service.type.enum';

export interface IPointMin {
    name: string;
    address: string;
    country: string;
    city: string;
    countryIso: string;
    zipCode: string;
    region: string;
    id: number | string;
    languageId: number;
    location: string;
    latitude: number;
    longitude: number;
    ratings: any;
    smallImage: ISmallImage;
    type: PointServiceType;
}
