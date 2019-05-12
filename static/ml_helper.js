async function create_model() {
    let m;
    try {
        console.log('Loading locals');
        m = await tf.loadLayersModel('indexeddb://local-model');
    } catch (err) {
        console.log('Loading global model');
        try {
            console.log('Trying from indexdb global model');
            m = await tf.loadLayersModel('indexeddb://global-model');
        } catch {
            console.log('Trying from server global model');
            m=await load_global_model();
        }
        await m.save('indexeddb://global-model');
    }
    enable_buttons();
    console.log(m.predict(tf.tensor2d([6], [1, 1])).dataSync());
    console.log(m);
    return m;
}

//The function trains the model on client side
async function train() {
    //disable all buttons before training starts
    disable_buttons("Model is being trained please wait");

    //training parameters
    const learningRate = 0.000001;
    const optimizer = tf.train.sgd(learningRate);
    model.compile({
        loss: 'meanSquaredError',
        optimizer: optimizer
    });
    //fitting model
    await model.fit(X, Y, {
        epoch: 1000000
    });
    //save model on server side
    await model.save('indexeddb://local-model');
    //enable all buttons when training ends
    enable_buttons();

    send_model_to_server(model);
}

function predict(X) {
    return model.predict(X).dataSync();
}

// Uploads local model to server
async function send_model_to_server(model) {
    await model.save('http://127.0.0.1:5000/upload')
}


async function get_server_version() {
    let ver;
    await $.ajax({
        url: "http://127.0.0.1:5000/get_version",
        type: 'get',
        dataType: "JSON",
        success: function (data) {
            ver = data;
        }
    });
    return ver;
}
async function get_local_version(){
    return await get_version();
}


//checks for availability of global model if present fetchs it
async function get_global_model() {
    disable_buttons();
    global_ver=await get_server_version();
    version= await get_local_version();
    if (global_ver['version']<=version['version']){
        console.log('Update not needed')
    }else{
        model= await load_global_model();
        console.log('Model Updated not needed')
    }
    enable_buttons();
}


async function load_global_model(){
    m = await tf.loadLayersModel('http://127.0.0.1:5000/models', strict=false);
    set_version(await get_server_version());
    return m;
}