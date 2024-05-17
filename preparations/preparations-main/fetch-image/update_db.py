import boto3
from boto3.dynamodb.conditions import Key
from photos_api import place_search

dynamodb = boto3.resource('dynamodb')
table= dynamodb.Table("trails")

def query_table():
        filtering_exp = Key('state_name').eq('wyoming')
        return table.query(KeyConditionExpression=filtering_exp)['Items']

def get_trails():
    response = table.get_item(
            Key={
                'state_name': 'wyoming',
                'trail_id': 10348039
            }
        )
    return response['Item']

def update_trail(state_name, trail_id, description, photo_references):
    response = table.update_item(
        Key={
            'state_name': state_name ,
            'trail_id': trail_id
        },
        UpdateExpression="set description = :description, photo_references = :photo_references",
        ExpressionAttributeValues={
            ':description': description,
            ':photo_references': photo_references
        },
        ReturnValues="UPDATED_NEW"
    )
    return response

def update_db():
    trails = query_table()
    for trail in trails:
        try:
            state_name = trail['state_name']
            trail_id = trail['trail_id']
            location = str(trail['_geoloc']['lat']) + ', ' + str(trail['_geoloc']['lng'])
            place_details = place_search(location)
            description = ''
            if (place_details['result'].get('editorial_summary') != None):
                description = place_details['result']['editorial_summary']['overview']

            photo_references = []
            count = 0
            for photo in place_details['result']['photos']:
                photo_references.append(photo['photo_reference'])
                count += 1
                if count == 5:
                    break
            update_trail(state_name, trail_id, description, photo_references)
        except Exception as e:
             continue
        
def update_db2():
    trail = get_trails()
    state_name = trail['state_name']
    trail_id = trail['trail_id']
    location = str(trail['_geoloc']['lat']) + ', ' + str(trail['_geoloc']['lng'])
    place_details = place_search(location)
    description = ''
    if (place_details['result'].get('editorial_summary') != None):
        description = place_details['result']['editorial_summary']['overview']

    photo_references = []
    count = 0
    for photo in place_details['result']['photos']:
        photo_references.append(photo['photo_reference'])
        count += 1
        if count == 5:
            break
    update_trail(state_name, trail_id, description, photo_references)

update_db()