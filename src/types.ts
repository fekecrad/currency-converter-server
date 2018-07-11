export interface Currency {
	code: string,
	name: string
}

export interface ConversionResult {
	result: number,
	metadata: ConversionMetadata;
}

export interface ConversionMetadata {
	mostPopularDestinationCurrency: string;
	amountConvertedInUsd: number;
	numberOfConversionRequestsMade: number;
}

export interface ServiceResponse {
	statusCode: number;
	body: any;
	headers: {
		[key: string]: any
	}
	isBase64Encoded: boolean;
}
