'use client';
import { GridColDef } from '@mui/x-data-grid';

const locale = 'en';

export const orderColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Order number',
    width: 160,
    flex: 1
  },
  {
    field: 'sku',
    headerName: 'Order Status',
    flex: 1
  },
  {
    field: 'key',
    headerName: 'Payment Status',
    flex: 1
  },
  {
    field: 'images',
    headerName: 'Shipment Status',
    flex: 1
  },
  {
    field: 'pricing_from',
    headerName: 'Order Total',
    flex: 1
  },
  {
    field: 'inventory',
    headerName: 'Date Created',
    flex: 1
  },
];
