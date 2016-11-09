require('indexeddbshim');
var connector = require('idb');

export default class DB {
    open(dbName, version = 1, upgrade = null) {
        this.database = connector.open(dbName, version, upgrade);
    }

    getDatabase() {
        return this.database;
    }

    get(dbObject, key) {
        return this.database.then((db) => {
            return db.transaction(dbObject)
                .objectStore(dbObject)
                .get(key);
        });
    }

    create(dbObject, key, value) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject, 'readwrite');
            transaction.objectStore(dbObject)
                .put(value, key);

            return transaction.complete;
        });
    }

    insert(dbObject, values) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject, 'readwrite');
            let store = transaction.objectStore(dbObject);

            values.forEach((value) => {
                store.put(value);
            });

            return transaction.complete;
        });
    }

    all(dbObject, index = null, filter) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject)
                .objectStore(dbObject);

            if (index) {
                return transaction.index(index).getAll(filter);
            }

            return transaction.getAll();
        });
    }

    allUsingCursor(dbObject, index = null, filter) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject)
                .objectStore(dbObject);

            if (index) {
                transaction = transaction.index(index);
            }

            return transaction.openCursor();
        });
    }

    clear(dbObject) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject, 'readwrite');
            transaction.objectStore(dbObject).clear();
        });
    }

    deleteKey(dbObject, key) {
        return this.database.then((db) => {
            let transaction = db.transaction(dbObject, 'readwrite');
            transaction.objectStore(dbObject).delete(key);
        });
    }

    count(dbObject, key = null) {
        return this.database.then((db) => {
            return db.transaction(dbObject).objectStore(dbObject).count(key);
        });
    }

    static createObject(upgradeDB, dbObject, options) {
        return upgradeDB.createObjectStore(dbObject, options)
    }

    static deleteObject(upgradeDB, dbObject) {
        return upgradeDB.deleteObjectStore(dbObject);
    }
}
