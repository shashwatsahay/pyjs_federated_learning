//Base index file which contains the basic functionality form ml releated code please look into ml_helper.js
//Define global constants

const size=1000;
const rand_idx_size=100;
const rand_idx = getRandomInts(size+4, rand_idx_size);
const full_train_set= traing_set_creator(size);
var version=null;
let model;

//initialise_db
intilize_version();
//Training data set creator

function train_subseter(arr, rand_idx){
    var train_subset=[[],[]];
    for (var i in rand_idx){
        train_subset[0].push(arr[0][rand_idx[i]]);
        train_subset[1].push(arr[1][rand_idx[i]]);
    }
    return train_subset;
}
const train_set=train_subseter(full_train_set, rand_idx);
const X=tf.tensor2d(train_set[0], [rand_idx_size,1]);
const Y= tf.tensor2d(train_set[1], [rand_idx_size,1]);


//load model
create_model().then((result)=>{
    model=result;

});


document.getElementById('predictButton').addEventListener('click', (e1, ev) =>{
     let val=parseInt(document.getElementById('inputValue').value);
     document.getElementById('output').innerText=predict(tf.tensor2d([val], [1,1]));
});

document.getElementById('trainButton').addEventListener('click', (e1, ev) =>{
    train();
});

document.getElementById('fetchGlobalButton').addEventListener('click', (e1, ev) =>{
    get_global_model();
});

function disable_buttons(msg){
    document.getElementById('trainButton').disabled=true;
    document.getElementById('trainButton').innerText=msg;
    document.getElementById('predictButton').disabled=true;
    document.getElementById('predictButton').innerText=msg;
    document.getElementById('fetchGlobalButton').disabled=true;
    document.getElementById('fetchGlobalButton').innerText=msg;
}

function enable_buttons(){
    document.getElementById('trainButton').disabled=false;
    document.getElementById('trainButton').innerText="Train Model";
    document.getElementById('predictButton').disabled=false;
    document.getElementById('predictButton').innerText="Predict";
    document.getElementById('fetchGlobalButton').disabled=false;
    document.getElementById('fetchGlobalButton').innerText="Fetch global model";
}

//Code related to training set creation will be deleted in future edition 
function traing_set_creator(size){
    var X=[];
    var Y=[];
    for (let i=-3; i<=size; i++){
        X.push(i);
        Y.push((2*i)-1);
    }
    return [X,Y];
}

function getRandomInts(size, rand_idx_size){
    var arr = []
    while(arr.length < rand_idx_size){
        var r = Math.floor(Math.random()*size) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return(arr);
}


