import { Router } from "express";
import { productsController } from '../controllers/productsController';

class ProductRoutes {
    router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', productsController.getProducts);
        this.router.post('/', productsController.create);
        this.router.put('/', productsController.put);
        this.router.delete('/:id', productsController.delete);
    }
}

const productsRoutes = new ProductRoutes();
export default productsRoutes.router;