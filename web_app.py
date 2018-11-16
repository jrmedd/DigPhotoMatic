import os
import glob
import base64
from flask import Flask, render_template, request, make_response, jsonify
from flask_limiter import Limiter
from twython import Twython

APP = Flask(__name__)

    
LIMITER = Limiter(APP, default_limits=["10 per minute", "1 per second"])

APP_KEY =  os.environ.get('APP_KEY')
APP_SECRET = os.environ.get('APP_SECRET')
ACCESS_TOKEN = os.environ.get('ACCESS_TOKEN')
ACCESS_SECRET = os.environ.get('ACCESS_SECRET')
twitter = Twython(APP_KEY, APP_SECRET, ACCESS_TOKEN, ACCESS_SECRET)

@APP.route('/', methods=['GET'])
def index():
    return render_template('index.html', num_frames=len(glob.glob('static/frames/frame*')))

@APP.route('/tweet', methods=["POST"])
@LIMITER.limit(["20 per minute", "1 per second"])
def tweet():
    tweet_content = request.get_json()
    imgdata = tweet_content.get('image')
    encoded = imgdata.split(",")[1]
    jpg = base64.b64decode(encoded)
    filename="latest_image.jpg"
    with open(filename, 'wb') as image_file:
        image_file.write(jpg)
    with open(filename, 'rb') as image_file:
        twitter.update_status_with_media(status=tweet_content.get('status'),  media=image_file)
    return jsonify(posted=True)

if __name__ == '__main__':
    APP.run(host="0.0.0.0", debug=True)
