# dataset_to_dynamodb_migration

Repository to convert csv to DynamoDB json.

## Requirements

* Volta or Node `16.19.0`.

## Installation

Install the project with Volta or Node `16.19.0` using your host machine.

```
npm install
```

## How to use this script

- Prepare input csv file. You can refer the sample csv file in `./output/sample.csv`

- Update `index.js` based on input csv file

- Update the following parts in `package.json` to specify input csv file path and output json file path.

```
"start": "node index.js \"./output/sample.csv\" \"./output/output.json\"",
```

- Run `npm run start`