import os
from flask import Flask, render_template, request, json, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS

import uuid
import json
import os, os.path
import numpy as np
from fl_functions import average_model, create_compile_model, get_model_version

app=Flask(__name__, template_folder='', static_url_path="/static", static_folder="static")
app.config['UPLOAD_FOLDER']="uploads"
app.config['GLOBAL_MODEL_FOLDER']="globals"
CORS(app)


@app.route('/')

@app.route("/home")
def home():
    return render_template('index.html')

@app.route("/upload", methods=['POST'])
def upload():
    upload_model(request)
    return home()


@app.route('/models')
def model():
    json_data = json.load(open("./globals/model.json"))
    return jsonify(json_data)


@app.route('/group1-shard1of1.bin')
def load_shards():
    return send_from_directory('globals', 'group1-shard1of1.bin')

@app.route('/get_version')
def send_version():
    return jsonify({"version":app.config['GLOBAL_MODEL_VERSION']})
'''
The methods uploads pre-trained model and calls the averaging method 
'''
def upload_model(request):
    filename=str(uuid.uuid4())
    upload_dir_path=app.config['UPLOAD_FOLDER']+'/'+filename
    os.makedirs(upload_dir_path)
    f=request.files['model.json']
    f.save(upload_dir_path+'/'+f.filename)
    f=request.files['model.weights.bin']
    f.save(upload_dir_path+'/'+f.filename)
    print("File Uploaded")
    print("Starting model averaging")
    average_model(app.config['UPLOAD_FOLDER'], app.config['GLOBAL_MODEL_FOLDER'])
    app.config['GLOBAL_MODEL_VERSION']=get_model_version(app.config['GLOBAL_MODEL_FOLDER'])

if __name__ == "__main__":
    create_compile_model(app.config['GLOBAL_MODEL_FOLDER'])
    app.config['GLOBAL_MODEL_VERSION']=get_model_version(app.config['GLOBAL_MODEL_FOLDER'])
    average_model(app.config['UPLOAD_FOLDER'],app.config['GLOBAL_MODEL_FOLDER'])
    app.run(debug=True)