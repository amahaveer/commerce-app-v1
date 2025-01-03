import { ICreateVariantExternalImage, IMappedProductForm } from "types/product.type";
import { getProductAction } from "./actions/product";
import { httpClient } from "./httpClient"
import { GET_PRODUCT_DETAIL_URL, GET_PRODUCT_URL, UPDATE_PRODUCT_URL, CREATE_PRODUCT_URL } from "./path"
import { createSlug } from "utils/product";
import { IRequestPayload } from "types/global";
import sdk, { sdkServerOptions } from "./sdkClient";


export const getProducts = async () => {
	const result = await sdk.composableCommerce.product.query({}, {
        serverOptions: sdkServerOptions
	});
	if (result.isError)  return {results: [], total: 0};

	const items = result.data.data.items
	return {results: items, total: result.data.data.total};
}

export const getProductDetail = async (payload: any = {}) => {
	try {
		const { param, } = payload;
		const result = await sdk.composableCommerce.product.getProduct({ id: param }, {
			serverOptions: sdkServerOptions
		});
		if (result.isError)  return {results: [], total: 0};
		console.log("result.data.data", result.data.data)
		return result.data.data;

	} catch (error) {
		return []
	}
}

export const updateProduct = async (payload: any = {}) => {
	const { body } = payload;
	const actions: Array<any> = [];
	Object.keys(body).map((key) => {
		const data = body[key]
		const action: any = getProductAction(data);
		action && actions.push(action?.[key]);
	})
	const mappedData = {
		...payload,
		body: {
			actions
		}
	}
	return httpClient.post(UPDATE_PRODUCT_URL, mappedData)
}

export const addProductVariantImage = (payload: IRequestPayload<ICreateVariantExternalImage> = {}) => {
	const { body } = payload;
	const actions = [];
	const data = getProductAction(body).addImage;
	actions.push(data);
	const mappedData = {
		...payload,
		body: { actions }
	}
	return httpClient.post(UPDATE_PRODUCT_URL, mappedData)
}

export const createProduct = async (payload: IMappedProductForm) => {

	const createPayload = {
		productType: {
			id: payload.selectedProductType,
			typeId: "product-type"
		},
		categories: payload.generalInfo.categories?.map((item) => ({
			typeId: "category",
			id: item.id
		})),
		name: payload.generalInfo.productName,
		slug: {
			"en": createSlug(payload.generalInfo.productName['en-US'])
		},
		masterVariant: payload.masterVariant, 
		variants: payload.variants
	}
	return httpClient.post(CREATE_PRODUCT_URL, {body: createPayload})
}




