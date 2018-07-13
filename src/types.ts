export interface ConversionMetadataEntity {
	totalRequests: number,
	totalAmount: number,
	currencyRequestsCountMap: CurrencyRequestsCountMap
}

export interface ConversionMetadataResult {
	mostPopularDestinationCurrency: string[];
	totalAmount: number;
	totalRequests: number;
}

export interface ConversionResult {
	result: number,
	metadata: ConversionMetadataResult;
}

export interface Currency {
	code: string,
	name: string
}

export interface CurrencyRequestsCountMap {
	[code: string]: number
}

export interface ServiceResponse {
	statusCode: number;
	body: any;
	headers: {
		[key: string]: any
	}
	isBase64Encoded: boolean;
}
