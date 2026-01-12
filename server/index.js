import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connect } from './config/database.js';
import userRoutes from './routes/AuthRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
import bidRoutes from './routes/BidRoutes.js';
import dotenv from "dotenv"
import helmet from 'helmet';
dotenv.config()

const app = express();
const port = process.env.port || 5000;

connect();
app.use(express.json());
app.use(cookieParser());

app.use(helmet());

const corsoptions = {
    origin: 'http://localhost:5173',
    methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
    credentials: true,
}
app.use(cors(corsoptions));
app.set('trust proxy', 'loopback')

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/gigs", projectRoutes);
app.use("/api/v1/bids", bidRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running",
    });
});


app.listen(port, () => {
    console.log(`Worker is listening on port ${port}.`);
});