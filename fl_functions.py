import os, shutil
import tensorflowjs as tfjs
import tensorflow as tf
import numpy as np
'''
The function 
'''
def average_model(local_model_folder, global_model_folder):
    folder_list=os.listdir(local_model_folder)
    if len(folder_list)<5:
        return "Not Enough models found"
    else:
        model_weights=list()
        new_weights=list()
        for model in folder_list:
            with tf.Graph().as_default():
                local_model=tfjs.converters.load_keras_model(local_model_folder+'/'+model+'/model.json')
                model_weights.append(local_model.get_weights())
        new_weights=list()

        for weights_list_tuple in zip(*model_weights):
            for models_ in zip(*weights_list_tuple):
                new_weights.append(np.array([np.nanmean(models_,axis=0)]))
        tf.keras.backend.clear_session()
        global_model= create_model()
        global_model.set_weights(new_weights)
        print(global_model.summary())
        if (update_model(global_model, global_model_folder)):
            for folder in folder_list:
                shutil.rmtree(local_model_folder+'/'+folder)

def create_compile_model(global_model_folder):
    if os.path.isfile(global_model_folder+'/model.json'):
        return( "Global Model Already Exist")
    else:
        model=create_model()
        update_model(model, global_model_folder)
        return("Model created and saved")


def create_model():
    x=tf.keras.Input(shape=(1,))
    layer=tf.keras.layers.Dense(units=1, input_shape=(1,))
    output=layer.apply(x)
    model =tf.keras.Model(inputs=x, outputs=output)
    return model
 

'''
The function updates the global model and increment the version number
'''
def update_model(model, global_model_folder):
    try:
        tfjs.converters.save_keras_model(model, global_model_folder)
        filename=global_model_folder+'/version.txt'
        version=-1
        if os.path.isfile(filename):
            handle=open(filename)
            version=int(handle.readline())
            handle.close()
        handle=open(filename, 'w')
        handle.write(str(version+1))
        handle.close()
    except:
        return False
    return True

def get_model_version(global_model_folder):
    filename=global_model_folder+'/version.txt'
    version=0
    if os.path.isfile(filename):
        handle=open(filename)
        version=int(handle.readline())
        handle.close()
    return version