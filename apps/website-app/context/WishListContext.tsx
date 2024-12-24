"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { sdk } from '@/sdk/CommercetoolsSDK';
import { cookieName } from '@/context/OktaTokenContext';
import { getCookie } from '@/utils/cookieManager';
import { IncomingMessage } from 'http';
import { ServerOptions } from '@royalcyber/unified-commerce';


type WishListItem = {
  productId: number;
  name: string;
  count: number;
  imageUrl: string;
  lineItemId: string
  variant: {
    id: string
    price: any
    images: string[]
    sku: string
  }
};

type WishListContextType = {
  wishList: WishListItem[];
  
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  setLoading: Dispatch<SetStateAction<boolean>>
  loading: boolean
  wishListCount: number
};

const WishListContext = createContext<WishListContextType | undefined>(undefined);

export const WishListProvider = ({ children }: { children: ReactNode }) => {
  const [wishList, setWishList] = useState<WishListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const oktaToken = getCookie(cookieName)


  // Fetch initial wishlist items from JSON
  useEffect(() => {
    setLoading(true)
    const fetchWishListItems = async () => {
      try {
        const response = await sdk.composableCommerce.wishlist.getWishlist({ serverOptions: {
          req: {
            headers: {
              'client-type': 'web',
              locale: 'en',
              Authorization:
                `Bearer ${oktaToken}`,
            },
          } as unknown as IncomingMessage,
        } as ServerOptions,
      })
        if (response.isError) {
          throw new Error('Failed to fetch wishlist items');
        }
        // const data: WishListItem[] = await response.json();
        setWishList(response.data.data.lineItems || []);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    };

    fetchWishListItems();
  }, []);

  // Function to handle incrementing or decrementing quantity
  const incrementQuantity = async(id: string) => {
    const wishListItem = wishList.filter((item) => item.lineItemId === id)
    setWishList((prevWishList) =>
      prevWishList.map((item) =>
        item.lineItemId === id 
          ? { ...item, count: Math.min(item.count + 1, 10) } // Limit to a maximum of 10
          : item
      )
    );
    if(wishListItem.length){
     const response =  await sdk.composableCommerce.wishlist.updateItem({lineItem:{id }, count: wishListItem[0].count + 1}, { serverOptions: {
      req: {
        headers: {
          'client-type': 'web',
          locale: 'en',
          Authorization:
            `Bearer ${oktaToken}`,
        },
      } as unknown as IncomingMessage,
    } as ServerOptions,

  })
  setWishList(response.data.data.lineItems || []);
}
  };
  

  const decrementQuantity = async (id: string) => {
    const wishListItem = wishList.filter((item) => item.lineItemId === id) || []
    setWishList((prevWishList) =>
      prevWishList.map((item) =>
        item.lineItemId === id && item.count > 1 
          ? { ...item, count: item.count - 1 } 
          : item
      )
    );
    if(wishListItem.length){
    const response = await sdk.composableCommerce.wishlist.updateItem({lineItem:{id }, count: wishListItem[0].count - 1}, { serverOptions: {
      req: {
        headers: {
          'client-type': 'web',
          locale: 'en',
          Authorization:
            `Bearer ${oktaToken}`,
        },
      } as unknown as IncomingMessage,
    } as ServerOptions,
  })
  setWishList(response.data.data.lineItems || []);

  }
  };

  // Remove item from wishlist
  const removeItem = async (id: string) => {
    setWishList((prevWishList) => prevWishList.filter((item) => item.lineItemId !== id));
    const response = await sdk.composableCommerce.wishlist.removeItem({lineItem:{id }}, { serverOptions: {
      req: {
        headers: {
          'client-type': 'web',
          locale: 'en',
          Authorization:
            `Bearer ${oktaToken}`,
        },
      } as unknown as IncomingMessage,
    } as ServerOptions,
  })
  setWishList(response.data.data.lineItems || []);
  };

  

  return (
    <WishListContext.Provider
      value={{
        wishList,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        loading,
        wishListCount: wishList.length,
        setLoading
      }}
    >
      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = () => {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error('useWishList must be used within a WishListProvider');
  }
  return context;
};
