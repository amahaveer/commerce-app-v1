'use client';
import { getCustomerDetail, getCustomers } from 'app/api/customer.api';
import { initialAddCustomerValues } from 'constants/customer.constant';

import { eToolbarButtonActions } from '@/components/molecules/SaveToolBar/type';
import { createContext, useContext, useEffect, useState } from 'react';
import { AddCustomerForm, IExposeCutomer } from 'types/customer.type';
import { useStepper } from './stepper';

export const CustomerContext = createContext<IExposeCutomer>({
  customers: [],
  openDrawer: false,
  addCustomerForm: {},
  setAddCustomerForm: () => {},
  setOpenDrawer: () => {},
  setMappedCustomerData: () => {},
  mappedCustomerData: initialAddCustomerValues,
  onToolbarAction: () => {}
});

export const CustomerProvider = ({ children, customerId }: any) => {
  const { onNext, onBack } = useStepper();
  const [customers, setCustomers] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [customerDetail, setCustomerdetail] = useState([]);
  const [addCustomerForm, setAddCustomerForm] = useState<any>(
    initialAddCustomerValues
  );
  const [mappedCustomerData, setMappedCustomerData] = useState(
    initialAddCustomerValues
  );
  const [selectedFilters, setSelectedFilters] = useState([
    { label: '', field: '', selectedValue: [], exact: true }
  ]);

  useEffect(() => {
    getCustomerHandler();
    if (customerId) {
      getCustomerDetailHandler();
    }
  }, [customerId]);

  const getCustomerHandler = async () => {
    try {
      const data = await getCustomers();
      customerFormMapper(data);
      setCustomers(data?.customers || []);
    } catch (error) {
      return;
    }
  };

  const onToolbarAction = (actionType: eToolbarButtonActions) => {
    const actions = {
      cancel: null,
      save: null,
      next: onNext,
      back: onBack
    };
    actions[actionType]?.();
  };
  const expose: IExposeCutomer = {
    customers: customers,
    openDrawer,
    // selectedFilters,
    addCustomerForm,
    setAddCustomerForm,
    setOpenDrawer,
    setMappedCustomerData,
    mappedCustomerData,
    onToolbarAction
    // setSelectedFilters
  };

  const customerFormMapper = (customers?: any) => {
    const data = customers.customer.body;
    const customerForm: AddCustomerForm = {
      generalInfo: {
        id: data?.id,
        email: data?.email,
        customerName: data?.firstName,
        customerLastName: data?.lastName,
        externalId: data?.externalId,
        customerGroup: data?.customerGroup,
        createdAt: data?.createdAt,
        modifiedAt: data?.modifiedAt
      },
      addresses: {
        id: data?.id,
        firstName: data?.addresses?.firstname,
        lastName: data?.addresses?.lastname,
        streetName: data?.addresses?.streetName,
        streetNumber: data?.addresses?.streetNumber,
        postalCode: data?.addresses?.postalCode,
        city: data?.addresses?.city,
        region: data?.addresses?.region,
        country: data?.addresses?.country
      }
    };
    setMappedCustomerData(customerForm);
  };

  const getCustomerDetailHandler = async () => {
    try {
      const data = await getCustomerDetail({ param: customerId });
      setCustomerdetail(data);
      customerFormMapper(data);
    } catch (error) {
      console.log('ERROR::', error);
      return;
    }
  };

  return (
    <CustomerContext.Provider value={expose}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);

  if (context === undefined) {
    throw new Error('Component Must be used within a Product Provider');
  }

  return context;
};
