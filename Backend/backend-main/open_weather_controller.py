import boto3

dynamodb = boto3.resource('dynamodb')
table= dynamodb.Table("open-weather")

def open_weather_api():
    response = table.scan()
    items = response.get('Items', [])
    return items