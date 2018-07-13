import { getUsdConversionRate, processMetadata } from './DataAccess';
import { ConversionResult, Currency, ServiceResponse } from './types';
import currencies from '../models/Currencies.json';
import { logError } from './DataAccess/Logger';

export const executeConversionSteps = async (
	amountToConvert: number,
	baseCurrency: string,
	destinationCurrency: string
): Promise<ServiceResponse> => {
	let serviceResponse: ServiceResponse;
	try {
		const { usdToBaseCurrencyRate, usdToDestinationCurrencyRate } = await getUsdConversionRate(baseCurrency, destinationCurrency);
		const destinationToBaseCurrencyRate: number = usdToDestinationCurrencyRate / usdToBaseCurrencyRate;
		const conversionResult: ConversionResult =  {
			result: destinationToBaseCurrencyRate * amountToConvert,
			metadata: await processMetadata(amountToConvert / usdToBaseCurrencyRate , destinationCurrency)
		};
		serviceResponse = buildServiceResponse(200, conversionResult);
	} catch (error) {
		logError(error);
		serviceResponse = buildServiceResponse(500, {
			error: 'Internal Server Error',
		});
	}

	return serviceResponse;
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

const buildServiceResponse = (statusCode: number, body: any): ServiceResponse => ({
	statusCode,
	body: JSON.stringify(body),
	headers: {},
	isBase64Encoded: false
})
