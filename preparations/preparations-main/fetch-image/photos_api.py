
# isntall the library
# pip install googlemaps
# pip install Pillow

# import the libraries
import googlemaps
from PIL import Image
import json
# Define the API Key.
API_KEY = 'Get your own key'

# Define the Client
gmaps = googlemaps.Client(key = API_KEY)

#{'lat': 38.38925, 'lng': -109.86797}
def place_search(location):
    # Do a simple nearby search where we specify the location
    # in lat/lon format, along with a radius measured in meters
    places_result  = gmaps.places_nearby(location=location, radius = 1000)
    place = places_result['results'][0]
    
    i = 0
   
    my_place_id = place['place_id']
    # define the fields you would liked return. Formatted as a list.
    #print(json.dumps(place))
    my_fields = ['name','formatted_phone_number', 'photo', 'editorial_summary']

    # make a request for the details using the Places API.
    places_details  = gmaps.place(place_id = my_place_id , fields= my_fields)
    # print get the photo id for each photo for each place, returned as a dictionary.
    #print(json.dumps(places_details) )
    # for photo in places_details['result']['photos']:
    #     # define parameters of our photo request.
    #     photo_id = photo['photo_reference']
    #     photo_width = 400                      
    #     photo_height = 400

    #     # request the image, using the Places Photot API.
    #     raw_image_data = gmaps.places_photo(photo_reference = photo_id, max_width = photo_width, max_height = photo_height)
    #     #print(raw_image_data)
    #     # raw image data is returned so we will save that raw data to a JPG file.
    #     f = open('MyDownloadedImage.jpg', 'wb')
    
    #     # save the raw image data to the file in chunks.
    #     for chunk in raw_image_data:
    #         if chunk:
    #             f.write(chunk)
    #     f.close()

    #     # we will open the newly saved photo, to display the photo.
    #     im = Image.open('MyDownloadedImage.jpg')
    #     im.show()
    #print(json.dumps(places_details))
    return places_details



# location='38.38925, -109.86797'
# place_search(location)
