import { Router } from "express";
import { salesController } from '../controllers/salesController';

class SalesRoutes {
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/new', salesController.getNewSales);
        this.router.get('/items/:id', salesController.getSaleItems);
        this.router.get('/ranking', salesController.getRankingSales);
        this.router.post('/', salesController.create);
        this.router.post('/new', salesController.createNew);
        this.router.put('/', salesController.putSale);
        this.router.delete('/:id', salesController.delete);
    }
}

const productsRoutes = new SalesRoutes();
export default productsRoutes.router;