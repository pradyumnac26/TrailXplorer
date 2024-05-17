import googlemaps
import boto3
from photos_api import API_KEY 
from boto3.dynamodb.conditions import Key

gmaps = googlemaps.Client(key = API_KEY)
s3 = boto3.client('s3') 

dynamodb = boto3.resource('dynamodb')
table= dynamodb.Table("trails")

def upload_to_s3(trail):
    if trail.get('photo_references') is not None:
        count = 0
        for photo_reference in trail['photo_references']:
            photo_id = photo_reference
            photo_width = 1000                     
            photo_height = 1000

            raw_image_data = gmaps.places_photo(photo_reference = photo_id, max_width = photo_width, max_height = photo_height)

            f = open('MyDownloadedImage.jpg', 'wb')
    
            # save the raw image data to the file in chunks.
            for chunk in raw_image_data:
                if chunk:
                    f.write(chunk)
            f.close()

            bucket = 'trail-explorer-images'
            file_name = 'MyDownloadedImage.jpg'
            key_name = str(trail['trail_id']) + '_'  + str(count) + '.jpg'
            count += 1
            s3.upload_file(file_name, bucket, key_name)

def query_table():
    filtering_exp = Key('state_name').eq('wyoming')
    return table.query(KeyConditionExpression=filtering_exp)['Items']


trails = query_table()
for trail in trails:
    upload_to_s3(trail)