const express = require('express');
const cors = require('cors');
const fs = require('fs');

// import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const createExpressServer = () => {

	// mongoose.connect(databaseUrl).then(() => console.log(`> Connected to mongodb: ${databaseUrl}`));

	const server = express();
	server.use(bodyParser.json({limit: '1mb'}));
	server.use(bodyParser.urlencoded({ extended: true }));
	// bodyparser middleware required for auth
	server.use(cors());
	// server.use('/upload', upload);
	// server.use('/graphql', graphqlExpress({ schema }));
	// server.use(useragent.express());
	// if (process.env.NODE_ENV !== 'production') server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

	return server;

}

module.exports = {
	createExpressServer
}