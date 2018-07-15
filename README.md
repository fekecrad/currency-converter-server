# Currency converter api
To run locally:
1. make sure that you are logged in to AWS (e.g. using aws-cli)
2. clone the repo `git clone https://github.com/fekecrad/currency-converter-server.git && cd currency-converter-server`
3. install dependencies `yarn`
4. install local DynamoDB `sls dynamodb install` (more info here: https://github.com/99xt/serverless-dynamodb-local)
5. start local DynamoDB `sls dynamodb start`
6. create `serverless.env.yml` in the project root with the content below and replace `OXR_APP_ID` with your own
```
dev:
  OXR_APP_ID: your-open-exchange-rates-app-id-for-local-environment
  STAGE: dev
prod:
  OXR_APP_ID: your-open-exchange-rates-app-id-for-production-environment
  STAGE: prod
```
7. run the project `yarn dev`

