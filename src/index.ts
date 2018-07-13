import { getUsdConversionRate, processMetadata } from './DataAccess';
import { ConversionResult, ServiceResponse, Currency } from './types';
import currencies from '../models/Currencies.json';

export const executeConversionSteps = async (
	amountToConvert: number,
	baseCurrency: string,
	destinationCurrency: string
): Promise<ServiceResponse> => {
	// const { usdToBaseCurrencyRate, usdToDestinationCurrencyRate } = await getUsdConversionRate(baseCurrency, destinationCurrency);
	// const destinationToBaseCurrencyRate: number = usdToDestinationCurrencyRate / usdToBaseCurrencyRate;

	const conversionResult: ConversionResult =  {
		result: 1,
		metadata: await processMetadata(/* destinationToBaseCurrencyRate * amountToConvert */ 10, destinationCurrency)
	};

	const response: ServiceResponse = {
		statusCode: 200,
		body: JSON.stringify(conversionResult),
		headers: {},
		isBase64Encoded: false
	}

	return response;
};

export const getCurrencies = (): ServiceResponse => {
	const result: Currency[] = Object.keys(currencies).map((code: string): Currency => ({
		 code,
		 name: (<any>currencies)[code]
	}));
	return {
		statusCode: 200,
		body: JSON.stringify(result),
		headers: {},
		isBase64Encoded: false
	};
}
