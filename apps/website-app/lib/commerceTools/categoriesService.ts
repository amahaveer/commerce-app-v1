import { CategoryItem } from '@/types/Category';
import { sdk } from '@/sdk/CommercetoolsSDK';
import { IncomingMessage } from 'http';
import { ServerOptions } from '@royalcyber/unified-commerce';

import { getCookie } from '@/utils/cookieManager';
import { cookieName } from '@/context/OktaTokenContext';
const oktaToken = getCookie(cookieName);
console.log('okta token------->>>>>>>>', oktaToken);
export const categoryService = {
  fetchCategories: async (): Promise<{ results: CategoryItem[] }> => {
    sdk.defaultConfigure('en');
    try {
      const response = await sdk.composableCommerce.product.queryCategories(
        {},
        {
          serverOptions: {
            req: {
              headers: {
                'client-type': 'web',
                locale: 'en_US',
                Authorization:
                  `Bearer ${oktaToken}`,
              },
            } as unknown as IncomingMessage,
          } as ServerOptions,
        },
      );
      if (!response.isError) {
        console.log('Category List Data: category service file', response);

        const items = response.data?.data?.items || [];
        return { results: items };
      } else {
        console.error('SDK Error Response:', response.error);
        throw new Error(response.error.message || 'An error occurred while fetching categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
}
