export interface Config {
	openExchangeRatesAppId: string | undefined;
	stage: string | undefined;
}

export const getConfig = (): Config => ({
	openExchangeRatesAppId: process.env.OXR_APP_ID,
	stage: process.env.STAGE
});
