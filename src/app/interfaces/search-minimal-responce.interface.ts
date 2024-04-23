
import { ISearchMinimal } from './search-minimal.interface';
import { IPointMin } from './point-min-interface';

export interface ISearchMinimalResponse {
    filter: ISearchMinimal;
    items: IPointMin[];
    count: number;
}
