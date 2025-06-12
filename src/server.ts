// src/server.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Tự động nhận file .ts
import postRoutes from './routes/postRoutes';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Chào mừng đến với Game Nexus API! (Running on TypeScript)');
});

app.listen(PORT, () => {
    console.log(`Server TypeScript đang chạy trên cổng http://localhost:${PORT}`);
});