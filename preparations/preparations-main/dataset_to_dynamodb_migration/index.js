const fs = require('fs');

const { marshall } = require('@aws-sdk/util-dynamodb');
const csv = require('csvtojson');

const INPUT_CSV_FILE_PATH_ARG_INDEX = 2;
const OUTPUT_JSON_FILE_PATH_ARG_INDEX = 3;
const inputCsvFilePath = process.argv[INPUT_CSV_FILE_PATH_ARG_INDEX];
const outputJsonFilePath = process.argv[OUTPUT_JSON_FILE_PATH_ARG_INDEX];

let formattedJson = '';

const isBoolean = (str) => {
  return str.toLowerCase() === 'true';
};

if (fs.existsSync(outputJsonFilePath)) {
  fs.unlinkSync(outputJsonFilePath);
}

csv()
  .fromFile(inputCsvFilePath)
  .then((rows) => {
    console.info(`Total number of csv rows:${rows.length}`);
    rows.forEach((row, index) => {
      // Show progress in log
      const currentRow = index + 1;
      console.info(`Processing csv rows:${currentRow}/${rows.length}`);

      // Convert csv to DynamoDB json
      const newRow = {
        trail_id: Number(row.trail_id),
        name: String(row.name),
        area_name: String(row.area_name),
        city_name: String(row.city_name),
        state_name: String(row.state_name),
        country_name: String(row.country_name),
        _geoloc: 	{
          lat: Number(row.lat),
          lng: Number(row.lng)
        },
        popularity:	Number(row.popularity),
        length: Number(row.length),
        elevation_gain: Number(row.elevation_gain),
        difficulty_rating: Number(row.difficulty_rating),
        route_type: String(row.route_type),
        visitor_usage: Number(row.visitor_usage),
        avg_rating: Number(row.avg_rating),
        num_reviews: Number(row.num_reviews),
        features: (row.features).substr(1, row.features.length - 2).replaceAll('\'', "").replaceAll(",","").split(" "),
        activities: (row.activities).substr(1, row.features.length - 2).replaceAll('\'', "").replaceAll(",","").split(" "),
        units: String(row.units),
        lat: Number(row.lat),
        lng: Number(row.lng),
        summer_temp: Number(row.summer_temp),
        winter_temp: Number(row.winter_temp),
        annual_rain: Number(row.annual_rain),
        annual_snow: Number(row.annual_snow),
        dogs_no: isBoolean(row['dogs-no']),
        forest: isBoolean(row.forest),
        river: isBoolean(row.river)
      };

      const ddbJson = {};
      ddbJson.Item = marshall(newRow);

      // concatenate each DynamoDB json
      formattedJson += `${JSON.stringify(ddbJson, null, 2)}\n`;
    });
    // Write json content to json file
    fs.appendFile(outputJsonFilePath, formattedJson, (err) => {
      if (err) {
        throw err;
      }
    });
    console.info(
      `DynamoDB json was generated, outputJsonFilePath=${outputJsonFilePath}`,
    );
  });
