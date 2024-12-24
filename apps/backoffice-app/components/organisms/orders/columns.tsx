"use client"
import { GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "utils";

export const orderColumns: GridColDef[] = [
    {
        field: 'orderNumber',
		headerName: 'Order number',
        width: 160,
        flex: 1,
    },
    {
        field: "totalPrice.centAmount",
        headerName: "Order final total (gross)",
        flex: 1,
        renderCell: ({ row }) => {
			return formatCurrency(row.totalPrice);
        },
    },
    {
        field: "numberOfOrder",
        headerName: "No. of order items",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
    {
        field: "category_level",
        headerName: "Total quantity of items",
        flex: 1,
    },
    {
        field: "orderState",
        headerName: "Order status",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
    {
        field: "paymentState",
        headerName: "Payment status",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
    {
        field: "customerEmail",
        headerName: "Email (order)",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
    {
        field: "createdAt",
        headerName: "Date created",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
    {
        field: "lastModifiedAt",
        headerName: "Date modified",
        flex: 1,
        renderCell: (params) => {
			return params.row.externalId
        },
    },
]