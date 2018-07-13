import { DynamoDB } from 'aws-sdk';

import { getConfig } from '../../config';
import { ConversionMetadataEntity, ConversionMetadataResult, CurrencyRequestsCountMap } from "../types";

const db = getConfig().stage === 'dev' ? new DynamoDB.DocumentClient({
	region: 'localhost',
	endpoint: 'http://localhost:8000'
}) : new DynamoDB.DocumentClient();

const tableName: string = 'currencyConverterMetaData';

export const processMetadata =  async (
	currentConversionInUsd: number,
	currentDestinationCurrency: string
): Promise<ConversionMetadataResult> => {	
	let metadataEntity: ConversionMetadataEntity | null = await getMetadata();

	if (!metadataEntity) {
		metadataEntity = {
			totalRequests: 1,
			totalAmount: currentConversionInUsd,
			currencyRequestsCountMap: {
				[currentDestinationCurrency]: 1
			}
		};

		await insertMetadata(metadataEntity);
	} else {
		metadataEntity.totalRequests++;
		metadataEntity.totalAmount += currentConversionInUsd;

		if (!metadataEntity.currencyRequestsCountMap[currentDestinationCurrency]) {
			metadataEntity.currencyRequestsCountMap[currentDestinationCurrency] = 1;	
		} else {
			metadataEntity.currencyRequestsCountMap[currentDestinationCurrency]++;
		}

		await updateMetadata(metadataEntity)
	}

	return {
		mostPopularDestinationCurrency: getMostPopularDestinationCurrencies(
			metadataEntity.currencyRequestsCountMap
		),
		totalAmount: metadataEntity.totalAmount,
		totalRequests: metadataEntity.totalRequests
	};
}

const getMetadata = async (): Promise<ConversionMetadataEntity | null> => {
	const output = await db.get({
		TableName: tableName,
		Key: { id: 'metadata' },
		AttributesToGet: ['value']
	}).promise();

	return output.Item ? output.Item.value : null;
}

const insertMetadata = async (conversionMetadataEntity: ConversionMetadataEntity): Promise<void> => {
	await db.put({
		TableName: tableName,
		Item: {
			id: 'metadata',
			value: conversionMetadataEntity,
		}
	}).promise();
}

const updateMetadata = async (conversionMetadataEntity: ConversionMetadataEntity): Promise<void> => {
	await db.update({
		TableName: tableName,
		Key: {
			id: 'metadata',
		},
		UpdateExpression: 'SET #value = :value',
		ExpressionAttributeNames: {
			'#value': 'value',
		},
		ExpressionAttributeValues: {
			':value': conversionMetadataEntity
		}
	}).promise();
}

const getMostPopularDestinationCurrencies = (
	currencyRequestsCountMap: CurrencyRequestsCountMap
): string[]=> {
	let currencyRequestsCountTmp: number = 0;
	return Object.keys(currencyRequestsCountMap).reduce((acc: string[], currency: string): string[] => {
		const count: number = currencyRequestsCountMap![currency];

		if (currencyRequestsCountTmp < count) {
			acc = [currency];
			currencyRequestsCountTmp = count;
			return acc;
		}

		if (currencyRequestsCountTmp === count && count > 0) {
			acc!.push(currency);
		}

		return acc;
	}, [])
}
