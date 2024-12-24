import { httpClient } from "./httpClient"
import { GET_CUSTOMER_BY_ID_URL, GET_CUSTOMER_TYPE_URL } from "./path"


export const getCustomers = async () => {
    const data = await httpClient.get(GET_CUSTOMER_TYPE_URL);
    return data;
}

export const getCustomerDetail = async (payload: any = {}) => {
    try {
        const { param, } = payload;
        const url = `${GET_CUSTOMER_BY_ID_URL}/${param}`
        const data = await httpClient.get(url);
        return data
    } catch (error) {
        return []
    }
}

export const fetchCustomerAddressesById = async (customerId: string) => {
    try {
        return {
            shippingAddress: [
                {
                    id: 1, firstName: "William", lastName: "mark", email: "mark@gmail.com", streetName: "APT547", houseNumber: "44",
                    apartment: "suit4", city: "Khi", postalCode: "555", region: "Newyork", country: "Canada"
                },
                {
                    id: 2, firstName: "William", lastName: "mark", email: "mark@gmail.com", streetName: "APT547", houseNumber: "44",
                    apartment: "suit4", city: "Khi", postalCode: "555", region: "Newyork", country: "Canada"
                },
            ],
            billingAddress: [
                {
                    id: 3, firstName: "William", lastName: "mark", email: "mark@gmail.com", streetName: "APT547", houseNumber: "44",
                    apartment: "suit4", city: "Khi", postalCode: "555", region: "Newyork", country: "Canada"
                },
                {
                    id: 4, firstName: "William", lastName: "mark", email: "mark@gmail.com", streetName: "APT547", houseNumber: "44",
                    apartment: "suit4", city: "Khi", postalCode: "555", region: "Newyork", country: "Canada"
                },
            ]
        }
    } catch (error) {

    }
}


