import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connect } from './config/database.js';
import userRoutes from './routes/AuthRoutes.js';
import projectRoutes from './routes/ProjectRoutes.js';
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
app.use("/api/v1/project", projectRoutes);

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running",
    });
});


app.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}.`);
});