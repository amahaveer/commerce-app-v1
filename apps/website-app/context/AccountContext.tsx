"use client";

import { Account } from 'shared/types/account';
import { cookieName } from '@/context/OktaTokenContext';
import { sdk } from '@/sdk/CommercetoolsSDK';
import { getCookie } from '@/utils/cookieManager';
import { ServerOptions } from '@royalcyber/unified-commerce';
import { IncomingMessage } from 'http';
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';


type AccountContextType = {
  account?: Account | null;
  loggedIn: boolean;
};


const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const oktaToken = getCookie(cookieName);

  useEffect(() => {
    setLoading(true);
    const fetchAccountDetails = async () => {
      try {
        const accountResponse = await sdk.composableCommerce.account.getAccount({
          serverOptions: {
            req: {
              headers: {
                'client-type': 'web',
                locale: 'en',
                Authorization:
                  `Bearer ${oktaToken}`,
              },
            } as unknown as IncomingMessage,
          } as ServerOptions,
        });
        setAccount(accountResponse?.data?.data?.account || null);
      } catch (err:any) {
        setError(err.message || 'Error fetching account details');
      } finally {
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        loggedIn: !!account,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};
