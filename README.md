# Fluent IndexedDB

This package is based on [IndexedDB with Promises](https://www.npmjs.com/package/idb) 
and provides a fluent way to interact with the database while still returning promises. 
It also includes the [IndexedDB Shim Polyfill](https://www.npmjs.com/package/indexeddbshim) 
for browser compatibility.

## Installation

Pull in the package through NPM.

Run `npm install fluent-indexed-db`

## Usage

Open the database and upgrade as per the needs
```javascript
import DB from '../idb/src/index';

var database = new DB;
database.open('test-db', 4, function (upgradeDB) {
    switch(upgradeDB.oldVersion) {
        case 0:
            let keyValStore = DB.createObject(upgradeDB, 'keyVal');
            let keyValStore = DB.createObject(upgradeDB, 'vehicles');
            let keyValStore = DB.createObject(upgradeDB, 'people', { keyPath: 'id' });
        case 1:
            DB.deleteObject(upgradeDB, 'people');
            DB.createObject(upgradeDB, 'drivers', { keyPath: 'id' });
        case 2:
            DB.createIndex(upgradeDB, 'drivers', 'experience', 'years_driving');
        case 3:
            DB.createIndex(upgradeDB, 'vehicles', 'capacity', 'seats');
    }
});
```

####Create an entry [database.get(objectStore, create, value)]
Create the value `bar` with the key `foo`


```javascript
database.create('keyVal', 'foo', 'bar');
```

####Read one value [database.get(objectStore, key)]
Read the created value under the key `foo`

```javascript
database.get('keyval', 'foo').then(function (value) {
    console.log(value);
});
```

####Read all values [database.all(objectStore, index = null, filter = null)]
Read all the values contained in a given store. The index and the filter are both optional.
```javascript
database.all('vehicles', 'capacity', 8).then(function (values) {
    console.log(values);
});

database.all('vehicles').then(function (values) {
    console.log(values);
});
```

####Read all values but use a cursor [database.allUsingCursor(objectStore, index = null, filter = null)]
You might want to read all the values but one at a time. For that use the cursor.

```javascript
database.allUsingCursor('vehicles').then(function logVehicle(cursor) {
    if (! cursor) return;
    console.log("Cursor at: ", cursor.value.seats);

    return cursor.continue().then(logVehicle);
}).then(() => {
    console.log("Done cursoring");
});

database.allUsingCursor('vehicles', 'capacity', 8).then(function logVehicle(cursor) {
    if (! cursor) return;
    console.log("Cursor at: ", cursor.value.seats);

    return cursor.continue().then(logVehicle);
}).then(() => {
    console.log("Done cursoring");
});
```

####Insert multiple values [database.insert(objectStore, values)]

Insert multiple values to the object store. The second argument is an array that contains the values.

```javascript
database.insert('vehicles', [
    {
        'seats' : 4,
        'registration' : 123456,
        'color': 'blue'
    },
    {
        'seats' : 8,
        'registration' : 654321,
        'color': 'red'
    },
]);
```

####Clear the data store [database.clear(objectStore)]

This function is useful when you need to truncate the whole data store.

```javascript
database.clear('vehicles');
```


####Get the count [database.count(objectStore, filter)]

This function is useful when you need to get the total number of items in the store. The second
 argument is used to filter the results to meet a certain criteria.

```javascript
database.count('vehicles').then((count) => {
     console.log(count);
});
```


####Delete an item from the store [database.deleteKey(objectStore, key)]

When you need to remove an item from the store, call this function with the store and the key as the
arguments.

```javascript
database.deleteKey('keyVal', 'foo');
```

####Get the current database promise [database.getDatabase()]

When you need to perform any other function not provided by this package, call the `getDatabase` function
and you will receive the current database as a promise.

```javascript
var dbPromise = database.getDatabase();

dbPromise.then(function (db) {
    var transaction = db.transaction('keyVal', 'readwrite');
    transaction.objectStore('keyVal')
    .put('bar', 'foo');
    
    return transaction.complete;
})
```

##Support

For any inquiries or support please drop a mail at smodavproductions@gmail.com

##License

This Package is licenced under the [MIT license](http://opensource.org/licenses/MIT).
