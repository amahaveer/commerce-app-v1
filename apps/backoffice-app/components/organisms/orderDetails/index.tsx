'use client';

import { Box, Typography, IconButton } from '@mui/material';
import TabsComponent from '@/components/atoms/tabs';
import SelectDropdown from '@/components/atoms/SelectDropdown';
import useTranslate from 'hooks/useTranslate';
import IconTextLink from '@/components/atoms/IconTextLink';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import { getPublishStatusOptions } from 'utils';
import { useOrders } from 'context/orders';
import { usePermissions } from 'context/permissions.context';
import { tabConfigurations } from './tabDef';

const OrderDetailsComponent = () => {

  const { translate } = useTranslate();
  const { orderDetails } = useOrders();
  const { hasPermission } = usePermissions();
  const publishStatusOptions = getPublishStatusOptions();

  const tabsData = tabConfigurations
    .filter(tab => !tab.permission || hasPermission(tab.permission))
    .map(tab => ({
      label: translate(tab.label), // Assuming translate is used for labels
      path: tab.path,
      content: <tab.component />,
    }));



  return (
    <Box className="flex flex-col pt-4">
      <IconTextLink
        wrapperClass='text-customBlue-periwinkle pl-10'
        textClass='text-[0.875rem]'
        text={translate("orders.toOrderList")}
        icon={<ListOutlinedIcon className='w-[1rem] h-[1rem]' />}
      />
      <Box className="flex flex-row px-10 items-center mt-2">
        <Box>
          <Typography className="text-2xl mb-2 mt-2 font-medium">
            {orderDetails.orderNumber}
          </Typography>
        </Box>
        {/* <Box className="ml-auto">
          <SelectDropdown
            options={[]}
            className='w-[21.375rem]'
            placeholder={translate("product.selectStore")}
            prefixIcon={<BusinessOutlinedIcon className='text-customGray mr-2' />}
            placeholderStyle='not-italic text-customGray'
          />
        </Box> */}
      </Box>

      <Box className='mt-4'>
        <TabsComponent
          tabs={tabsData}
          tabsWrapperClass='px-6'
          contentClass='h-[65vh] overflow-y-auto'
        //   tabsChildren={getTabsChildren()}
        />
      </Box>
    </Box>
  );
};

export default OrderDetailsComponent;
