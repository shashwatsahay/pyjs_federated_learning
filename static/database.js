function intilize_version() {
    var request = window.indexedDB.open('local_variables');
    request.onerror = function (event) {
        db_connection.request.result;
        console.log('The database connection could not be established')
    };

    var db;
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        objectStore = db.createObjectStore('model_version', {
            autoIncrement: true
        });
    }
    request.onsuccess = function (event) {
        db = request.result;
        console.log('The database is opened successfully')
        var mytran = db.transaction(['model_version'], 'readwrite')
            .objectStore('model_version')
            .get(1).onerror = function (event) {
            db.transaction(['model_version'], 'readwrite')
            .objectStore('model_version')
            .add({
                'version': null
            });
        };
    };

}

async function get_version() {
    return new Promise(function (resolve) {
        var request = window.indexedDB.open('local_variables');
        request.onsuccess = function () {
            db = request.result;
            mytran = db.transaction(['model_version'], 'readwrite')
            objstr = mytran.objectStore('model_version')
            objstr.get(1).onsuccess = function (event) {
                return resolve(event.target.result)
            };
        }
    })
}

function set_version(val) {
    var request = window.indexedDB.open('local_variables');
    request.onsuccess = function () {
        db = request.result;
        mytran = db.transaction(['model_version'], 'readwrite')
            .objectStore('model_version').put(val, 1)
            mytran.onsuccess = function (event) {
                console.log('The data has been updated successfully');
              };
            
              mytran.onerror = function (event) {
                console.log('The data has been updated failed');
              }
    };
}