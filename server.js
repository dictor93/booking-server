const express = require('express');
const dbClient = require("mongodb").MongoClient;
var cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.get(/hotels(\/d)?/, (request, response) => {
    console.log(request.url.split('/'));
    const { url } = request;
    const hotelId = url.split('/')[2];
    console.log(hotelId);
    dbClient.connect("mongodb://admin:kbvbityrj22@ds163825.mlab.com:63825/heroku_21ltqj5s", function(err, client){
	    if(err){
            response.statusCode = 500;
            response.send('somwthing wrong');
        }else{
            const db = client.db('heroku_21ltqj5s');
            const collection = db.collection('Hotels'); 
            collection.find(hotelId?{id: parseInt(hotelId)}: {})
            .toArray(function(err,docs){
                if(err){
                    console.log('err',err);
                }else{
                    response.json(docs);
                    console.log(docs);
                }
            });
        }
    });
});

app.get(/\/.?/,(req, res) => {
    res.send('Server is work');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})