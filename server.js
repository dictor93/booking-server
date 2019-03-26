const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

var cors = require('cors');
server.use(cors());
server.use(middlewares);
server.use(router);

server.listen(port, (err) => {
    if(err) {
        console.log(err);
    }
    console.log('server listen on port: ', port);
});
