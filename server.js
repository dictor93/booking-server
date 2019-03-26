const express = require('express');
const bodyParser = require("body-parser");
const dbClient = require("mongodb").MongoClient;
var cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
const conf = require('./dbConf');

app.use(bodyParser.json());

const { dbUser, dbPwd, dbServer, dbPort, database, collectionHotels, collectionBookings } = conf;

const dbFullPath = `mongodb://${dbUser}:${dbPwd}@${dbServer}:${dbPort}/${database}`;

app.get(/hotels(\/d)?/, (request, response) => {
    console.log(request.url.split('/'));
    const { url } = request;
    const hotelId = url.split('/')[2];
    console.log(hotelId);
    dbClient.connect(dbFullPath, function (err, client) {
        if (err) {
            response.sendStatus(500);
            response.send('somwthing wrong');
        } else {
            const db = client.db(database);
            const collection = db.collection(collectionHotels);
            collection.find(hotelId ? { id: parseInt(hotelId) } : {})
                .toArray(function (err, docs) {
                    if (err) {
                        console.log('err', err);
                    } else {
                        response.json(docs);
                        console.log(docs);
                    }
                });
        }
        client.close();
    });
});

app.get(/bookings(\/.)?/, (request, response) => {
    const { url } = request;
    const userId = url.split('/')[2];
    console.log(userId);
    dbClient.connect(dbFullPath, function (err, client) {
        if (err) {
            response.sendStatus(500);
            response.send('somwthing wrong');
        } else {
            const db = client.db(database);
            const collection = db.collection(collectionBookings);
            collection.find(userId ? { _id: userId } : {})
                .toArray(function (err, docs) {
                    if (err) {
                        console.log('err', err);
                    } else {
                        response.json(docs);
                        console.log(docs);
                    }
                });
        }
        client.close();
    });
});

app.put('/bookings', (request, response) => {
    if (!request.body) return response.sendStatus(400);
    const userId = request.body.id;
    console.log(userId);
    const bookings = request.body.bookings;
    dbClient.connect(dbFullPath, function (err, client) {
        if (err) {
            response.sendStatus(500);
            response.send({ err, text: 'something wrong' });
        } else {
            const db = client.db(database);
            const collection = db.collection(collectionBookings);
            collection.save( { _id: parseInt(userId) || 'default', bookings })
                .then((resp) => {
                    if(resp.ok);
                    response.json(resp)
                    console.log(resp);
                }).catch(err => {
                    response.send({ err, text: 'something wrong' });
                });
        }
        client.close();
    });
});

app.get(/\/.?/, (req, res) => {
    res.send('Server is work');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})