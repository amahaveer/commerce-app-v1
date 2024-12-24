"use client"

import DataTable from '@/components/atoms/DataTable';
import { Box, IconButton, Typography } from '@mui/material';
import CustomButton from '@/components/atoms/Button';
import { variantInventoryColumns } from './column';
import { InfoOutlined } from '@mui/icons-material';
import useTranslate from 'hooks/useTranslate';
import { useEffect, useState } from 'react';
import AppDrawer from '@/components/atoms/AppDrawer';
import ManageVariantInventory from './manageInventory';
import { getInventoryByQuery } from 'app/api/inventory.api';
import { useProducts } from 'context/product';
import { useLanguage } from 'context/language.context';
import { IVariant } from 'types/product.type';

interface IPropsType {
	variantId: number
}

const VariantInventory = (props: IPropsType) => {

	const { variantId } = props;
	const { translate } = useTranslate();
	const { locale } = useLanguage();
	const { mappedProductData: { variants } } = useProducts();
	const [openManageInventoryDrawer, setOpenManageInventoryDrawer] = useState(false);
	const [inventories, setInventories] = useState([]);

	const getInventoriesHandler = async () => {
		try {
			const selectedVariant: any = variants.find((variant) => variant.id === variantId);
			if (!selectedVariant) return;
			const data = await getInventoryByQuery({ query: `where=sku="${selectedVariant.sku}"&expand=supplyChannel`});
			if (!data.results?.length) return;
			const mappedObj = data.results.map((item: any, index: number) =>  ({
				id: item.id,
				no: index+1,
				channelName: item.supplyChannel.obj.name[locale],
				channelKey: item.supplyChannel.obj.key,
				quantityOnStock: item.quantityOnStock,
				availableQuantity: item.availableQuantity,
			}))
			setInventories(mappedObj)
		} catch (error) {
			console.log("ERROR:getInventoriesHandler", error)
		}
	}

	useEffect(() => {
		getInventoriesHandler();
	}, [])


	return (
		<Box className="flex flex-col px-4 pt-10">

			<Box className="flex flex-row items-center">
				<Box className="flex w-[47rem]">
					<IconButton className='text-customBlue-sky' aria-label="Info">
						<InfoOutlined />
					</IconButton>
					<Typography>{translate("product.manageAddInventoryForVariantAndSku")}</Typography>
				</Box>

				<Box className="ml-auto">
					<CustomButton.Add 
						title={translate("product.addInventory")} 
						onClick={()=>setOpenManageInventoryDrawer(true)} 
					/>
				</Box>
			</Box>

			<Box className="pt-10">
				<DataTable
					columns={variantInventoryColumns}
					rows={inventories}
				/>
			</Box>

			<AppDrawer open={openManageInventoryDrawer} onClose={() => setOpenManageInventoryDrawer(false)} >
				<ManageVariantInventory />
			</AppDrawer>

		</Box>
	)
}

export default VariantInventory;