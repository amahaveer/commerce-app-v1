"use client"
import { GridColDef } from "@mui/x-data-grid";


export const variantInventoryColumns: GridColDef[] = [
	{
		field: 'channelName',
		headerName: 'Channel name',
		width: 160,
		flex: 1,
	},
	{
		field: 'channelKey',
		headerName: 'Channel key',
		flex: 1,
	},
	{
		field: 'quantityOnStock',
		headerName: 'Quantity',
		flex: 1,
	},
	{
		field: 'availableQuantity',
		headerName: 'Available Quantity',
		flex: 1,
	},
	{
		field: 'Country',
		headerName: 'Average restock period (days)',
		flex: 1,
	},
	{
		field: 'Customer group',
		headerName: 'Expected Delivery',
		flex: 1,
	},
];
