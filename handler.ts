import { Callback, Context, Handler } from 'aws-lambda';

import { executeConversionSteps, getMetadata} from './src';

export const convert: Handler = async (event: any, context: Context, callback: Callback) => {
	const requestBody = JSON.parse(event.body);
	callback(null, await executeConversionSteps(
		requestBody.value,
		requestBody.from,
		requestBody.to
	));
};

export const metadata: Handler = async (event: any, context: Context, callback: Callback) => {
	callback(null, await getMetadata());
};
