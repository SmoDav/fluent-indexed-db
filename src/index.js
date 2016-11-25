"use strict";
require('indexeddbshim');
var connector = require('idb');

(function (){
    function exp() {
        this.open = function(dbName, version = 1, upgrade = null) {
            this.database = connector.open(dbName, version, upgrade);
        },

        this.getDatabase = function () {
            return this.database;
        },

        this.get = function (dbObject, key) {
            return this.database.then((db) => {
                return db.transaction(dbObject)
                    .objectStore(dbObject)
                    .get(key);
            });
        },

        this.create = function (dbObject, key, value) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject, 'readwrite');
                transaction.objectStore(dbObject)
                    .put(value, key);

                return transaction.complete;
            });
        },

        this.insert = function (dbObject, values) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject, 'readwrite');
                let store = transaction.objectStore(dbObject);

                values.forEach((value) => {
                    store.put(value);
                });

                return transaction.complete;
            });
        },

        this.all = function (dbObject, index = null, filter = null) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject)
                    .objectStore(dbObject);

                if (index) {
                    return transaction.index(index).getAll(filter);
                }

                return transaction.getAll();
            });
        },

        this.allUsingCursor = function (dbObject, index = null, filter = null) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject)
                    .objectStore(dbObject);

                if (index) {
                    transaction = transaction.index(index);
                }

                return transaction.openCursor(filter);
            });
        },

        this.clear = function (dbObject) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject, 'readwrite');
                transaction.objectStore(dbObject).clear();
            });
        },

        this.deleteKey = function (dbObject, key) {
            return this.database.then((db) => {
                let transaction = db.transaction(dbObject, 'readwrite');
                transaction.objectStore(dbObject).delete(key);
            });
        },

        this.count = function (dbObject, filter = null) {
            return this.database.then((db) => {
                return db.transaction(dbObject).objectStore(dbObject).count(filter);
            });
        },

        this.createObject = function (upgradeDB, dbObject, options) {
            return upgradeDB.createObjectStore(dbObject, options)
        },

        this.deleteObject = function (upgradeDB, dbObject) {
            return upgradeDB.deleteObjectStore(dbObject);
        },

        this.createIndex = function (upgradeDB, dbObject, indexName, keyColumn) {
            return upgradeDB.transaction.objectStore(dbObject).createIndex(indexName, keyColumn);
        }
    }

    if (typeof module !== 'undefined') {
        module.exports = new exp();
    } else {
        self.fluentDb = new exp();
    }
}());
