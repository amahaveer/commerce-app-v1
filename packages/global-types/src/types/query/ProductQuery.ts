import { Filter } from './Filter';
import { PaginatedQuery } from './PaginatedQuery';
import { Facet } from './Facet';

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortAttributes {
  [key: string]: any;
}

export interface ProductQuery extends PaginatedQuery {
  category?: string;
  categories?: string[];
  productIds?: string[];
  productKeys?: string[];
  productRefs?: string[];
  productType?: string;
  skus?: string[];
  query?: string;
  filters?: Filter[];
  facets?: Facet[];
  sortAttributes?: SortAttributes;
  expand?: string[];
}
