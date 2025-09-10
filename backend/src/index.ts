import express from 'express';
import bodyParser from 'body-parser';
import userAPI from './api/user';
import _http, { createServer } from 'http'; 
import VARS from './config/vars';
import connectDB from './config/db';
import cors from 'cors';
import employeeAPI from './api/employee';

const app = express();
const server = createServer(app);

const port = VARS.PORT;
const urlencodedParser = bodyParser.urlencoded({ extended: false, limit: '1mb' });
app.use(bodyParser.json(), urlencodedParser);
app.use(express.json({ limit: '1mb' }))
const allowedOrigins = [VARS.CLIENT_URI, VARS.SERVER_URI].filter(Boolean) as string[];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ****************   START OF API     ****************
app.use('/users', userAPI)
app.use('/employee', employeeAPI)
// ****************   END OF API     ****************


// ****************   START OF DB CONNECTION     ****************
connectDB()
// ****************   END OF DB CONNECTION     ****************

// Start the server
server.listen(port, () => {
  console.log(`-> Ready on http://localhost:${port}`);
});