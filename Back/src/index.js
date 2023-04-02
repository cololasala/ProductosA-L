import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const { Application } = express; // ver para que sirve despues
import  indexRoutes from './routes/indexRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import salesRoutes from './routes/salesRoutes';

class Server {
    app

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.set('port', process.env.PORT || 4200);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}))
    }

    routes() {
        this.app.use('/', indexRoutes);
        this.app.use('/api/products', productsRoutes);
        this.app.use('/api/sales', salesRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'));
        console.log('Server on port: ' + this.app.get('port'));
    }
}

const server = new Server();
server.start();