import {
  GetProductQuery,
  ProductQueryQuery,
  QueryProductCategoriesQuery,
} from '../queries/ProductQueries';
import { Category, FilterField, Product } from 'shared/types/product';
import { SDKResponse, ServerOptions } from '@royalcyber/unified-commerce';
import { PaginatedResult, ProductPaginatedResult } from 'shared/types/result';

type GetProductAction = (
  query: GetProductQuery,
  options?: { serverOptions?: ServerOptions },
) => Promise<SDKResponse<Product>>;

type ProductQueryAction = (
  query: ProductQueryQuery,
  options?: { serverOptions?: ServerOptions },
) => Promise<SDKResponse<ProductPaginatedResult>>;

type QueryProductCategoriesAction = (
  query: QueryProductCategoriesQuery,
  options?: { serverOptions?: ServerOptions },
) => Promise<SDKResponse<PaginatedResult<Category>>>;

type GetSearchableProductAttributesAction = (options?: {
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<FilterField[]>>;

type GetCategoryProductAction = (
  id: string,
  options?: { serverOptions?: ServerOptions },
) => Promise<SDKResponse<{ categoryId: string, products: Product[] }>>;

export {
  type GetProductAction,
  type ProductQueryAction,
  type QueryProductCategoriesAction,
  type GetSearchableProductAttributesAction,
  type GetCategoryProductAction,
};
