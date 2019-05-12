//module loads

var express = require('express');
var app = express();
var fs = require('fs');

var multer = require('multer');
var tf = require('@tensorflow/tfjs-node');
var session = require('express-session');





//Variables
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = 'uploads/' + req.session.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
        //cb(null, file.fieldname + '-' + Date.now())
    }
})

const max_session = 10000;
var session_ids = [];
var upload = multer({
    storage: storage
});
const app_dir = __dirname + '/built_app';
const upload_dir = __dirname + '/uploads';


app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 's3Cur3',
    name: 'sessionId'
}))



// Server programs



//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(app_dir));
app.get('/', function (req, res) {
    req.session.regenerate()
    // if (req.session.id) {
    // res.session.id = req.session.id;

    // } else {
    //create_random_session_id();
    //res.session.id = session_ids[-1];
    // }
    console.log(res.session.id);
    res.sendFile(app_dir + '/index.html');
});


var cpUpload = upload.fields([{
    name: 'model.json'
}, {
    name: 'model.weights.bin'
}])
app.post('/upload', cpUpload, function (req, res, next) {
    update_global_model();
    res.send('POST Request');
});

app.put('/lalaa_upload', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});


//helper programs
function create_random_session_id() {
    var session_id = Math.floor(Math.random * max_session)
    if (session_ids.indexOf(r) === -1) session_ids.push(session_id);
}
async function update_global_model() {
    var models = [];
    console.log(fs.readdirSync('uploads'))
    var files = fs.readdirSync('uploads/')
    if (files.length < 2) {
        console.log("Not Yet");
    } else {
        for (i in files){
            const model = await tf.loadLayersModel('file://uploads/' + files[i] + '/model.json');
            models.push(model);
        }
    }
    //listing all files using forEach
    console.log(models[0].predict(tf.tensor2d([89], [1, 1])).dataSync());
}