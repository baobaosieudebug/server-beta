const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
require('dotenv').config();
const express = require('express');
const http = require('http');
const db = require('./config/database.ts');
const typeDefs = require('./types/typeDefs');
const resolvers = require('./resolvers/resolvers');
const cors = require('cors');
const socket = require('./socket/socket');
bodyParser = require('body-parser');


const port  = process.env.PORT;

// Connect database
db.connect();

app = express().use(bodyParser.json());
const httpServer = http.createServer(app);
const route = require('./routes');

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  },
});

socket(io);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
route(app);

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startApolloServer();


httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = io;


//on su kien tu webhook
// emit su kien len admin

//on su kien tu admin emit
// goi lai web hook de hien thi ra text