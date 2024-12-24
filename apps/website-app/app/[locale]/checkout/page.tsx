"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Checkout from '@/components/CheckoutPage/Checkout'
import { sdk } from '@/sdk/CommercetoolsSDK';
import { IncomingMessage } from 'http';
import { ServerOptions } from '@royalcyber/unified-commerce';
import { AddCartItemPayload } from '@/sdk/composable-commerce/types/payloads/CartPayloads';
import { getCookie } from '@/utils/cookieManager';
import { cookieName } from '@/context/OktaTokenContext';

const page = ({slug} : any) => {
  
  return (
    <div className='bg-[var(--tp-common-grey-background)]'>
      <Checkout /> 
    </div>
  )
}

export default page
