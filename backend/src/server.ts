import express from "express";
import dotenv from 'dotenv';
import { appConfig } from "./config/app.config.js";
import { initializeApplicationContext } from "./config/app.context.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

// Routes
import createUserRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Application Context - Spring Boot benzeri
initializeApplicationContext();


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes (container initialize edildikten sonra)
app.use(`${appConfig.apiPrefix}/users`, createUserRoutes());

app.use(errorMiddleware);

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port} in ${appConfig.env} mode`);
    console.log(`API available at http://localhost:${appConfig.port}${appConfig.apiPrefix}`);
});