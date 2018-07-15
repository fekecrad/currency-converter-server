import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getConfig } from '../../config';

const OXR_API_URL = 'https://openexchangerates.org/api/';
const OXR_API_APP_ID = getConfig().openExchangeRatesAppId;

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: OXR_API_URL
});

export const getUsdConversionRate = async (baseCurrency: string, destinationCurrency: string): Promise<{
	usdToBaseCurrencyRate: number,
	usdToDestinationCurrencyRate: number
}> => {
	const response: AxiosResponse = await axiosInstance.get(
		`latest.json?app_id=${OXR_API_APP_ID}&symbols=${baseCurrency},${destinationCurrency}`
	);

	if (response.status !== 200) {
		throw new Error(response.data.description);
	}

	return {
		usdToBaseCurrencyRate: response.data.rates[baseCurrency],
		usdToDestinationCurrencyRate: response.data.rates[destinationCurrency]
	};
};
