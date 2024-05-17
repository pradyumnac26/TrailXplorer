import boto3
from boto3.dynamodb.conditions import Attr, Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table= dynamodb.Table("trails")

def sort_items(items,key,reverse):
    items.sort(key=lambda item: item.get(key, 0), reverse=reverse)
    return items

def get_trail_details(state_name, trail_id):
    try:
        response = table.get_item(
            Key={
                'state_name': state_name,
                'trail_id': int(trail_id)
            }
        )
        return response['Item']
    except:
        return  {"error": "Item not found."}

def get_trails_by_difficulty_rating(difficulty_rating, state_name=None):
    if difficulty_rating is None:
        difficulty_rating = '7'
    if state_name is None:
        response = table.scan(
            FilterExpression=Attr('difficulty_rating').lte(int(difficulty_rating))
        )
    else:
        response = table.query(
            KeyConditionExpression=Key('state_name').eq(state_name),
            FilterExpression=Attr('difficulty_rating').lte(int(difficulty_rating))
        )
    items = response.get('Items', [])
    return sort_items(items,'difficulty_rating',True)[:15]

def get_trails_by_length(length,state_name=None):
    if length is None:
        length = '339570.74'
    if state_name is None:   
        response = table.scan(
            FilterExpression=Attr('length').lte(Decimal(length))
        )
    else:
        response = table.query(
            KeyConditionExpression=Key('state_name').eq(state_name),
            FilterExpression=Attr('length').lte(Decimal(length))
        )
    items = response.get('Items', [])
    return sort_items(items,'length',True)[:15]

def get_trails_by_rating(state_name, rating):
    if rating is None:
        rating = '5'
    if state_name is None:
        response = table.scan(
            FilterExpression = Attr('avg_rating').gte(Decimal(rating))
        )
    else:
        response = table.query(
            KeyConditionExpression = Key('state_name').eq(state_name),
            FilterExpression = Attr('avg_rating').gte(Decimal(rating))
        )
    items = response.get('Items', [])
    return sort_items(items, 'avg_rating', True)[:15]

def trails_search(state_name=None, trail_name=None):
    try:
        if state_name is None or state_name == '':
            return {"error": "State Name is Required."}

        if trail_name is None:
            response = table.query(
                KeyConditionExpression=Key('state_name').eq(state_name)
            )
        else:
            response = table.query(
                KeyConditionExpression = Key('state_name').eq(state_name),
                FilterExpression = Attr('name').contains(trail_name)
            )
        items = response.get('Items', [])
        return items
    except:
        return {"error": "Server met with an error"}

