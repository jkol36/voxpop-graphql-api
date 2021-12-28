import express from "express";
import {ApolloServer, AuthenticationError} from "apollo-server-express";
import {ApolloEngine} from "apollo-engine";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {logger} from "./data/utils/logger";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import {createServer} from "http";
import dotenvConfig from 'dotenv';

import {authenticate, createGuestUser, login, register} from "./data/utils/authentication";

import {schema} from "./data/schema";

if (process.env.NODE_ENV === "dev") {
    dotenvConfig.config({path: "./.env"});
}


const localHostCors = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
}
const GRAPHQL_PORT = process.env.PORT;

logger.info("Database", process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {useMongoClient: true});

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '17mb'}));
app.use(localHostCors);

//  Uncomment the codes below if you want to make these endpoints to accept localhost calls
app.all("/login", localHostCors);
app.all("/authenticate", localHostCors);
app.all("/register", localHostCors);
app.all("/guest", localHostCors);

app.post('/register', register);
app.post('/login', login);
app.post('/authenticate', authenticate);
app.post('/guest', createGuestUser);

const server = new ApolloServer({
    schema,
    introspection: true,
    tracing: true,
    cacheControl: true,
    engine: false,
    logging: {
        level: "DEBUG" // Engine Proxy logging level. DEBUG, INFO (default), WARN or ERROR.
    },
    playground: {
        settings: {
            'editor.cursorShape': 'line'
        }
    },
    context: async ({req, connection}) => {

        // get the user token from the headers
        let authToken = "";
        if (connection) {
            authToken = connection.context.authorization || connection.context.token || connection.context.authToken;
            console.log("[SUBSCRIPTION CONNECTION]")
        } else {
            authToken = req.headers.authorization || req.headers.token;
        }

        let isIntrospection = req && req.body.operationName === 'IntrospectionQuery';
        if (!isIntrospection) {
            if (!authToken) {
                const authErrorMessage = "Auth token not found in request";
                throw new AuthenticationError(authErrorMessage);
            } else if (authToken && authToken.length) {
                const authSecret = process.env.SECRET;
                const jwt = (jsonwebtoken);
                const decodedJwtTokenRequest = jwt.decode(authToken, {complete: true});
                if (!decodedJwtTokenRequest) {
                    throw new AuthenticationError('Auth token supplied is corrupted');
                }
                const user = Object.assign({}, decodedJwtTokenRequest.payload);
                try {
                    jwt.verify(authToken, authSecret);
                    // add the user to the context
                    return {user};
                } catch (err) {
                    logger.error(err.message);
                    if (err.message === 'invalid issuer') {
                        throw new AuthenticationError('Token issued cannot be used in this endpoint.');
                    }
                    if (err.name === 'JsonWebTokenError' || err.message === 'invalid signature') {
                        throw new AuthenticationError("Invalid access token because of " + err.message);
                    } else if (err.name === 'TokenExpiredError') {
                        throw new AuthenticationError("Access token has expired");
                    }
                }
            }
        }
    }
});

server.applyMiddleware({app, path: '/graphql'});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const isDevelop = process.env.NODE_ENV === "" || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';
if (isDevelop) {
    httpServer.listen({port: GRAPHQL_PORT}, () => {
        console.log(`Apollo Server on http://localhost:${GRAPHQL_PORT}/graphql`);
    });
} else {
    const engine = new ApolloEngine({
        apiKey: process.env.APOLLO_ENGINE_API_KEY
    });
    engine.listen({
        port: GRAPHQL_PORT,
        httpServer: httpServer
    }, () => {
        console.log(`Apollo Server on http://localhost:${GRAPHQL_PORT}/graphql`);
    });
}

