import pool from '../database';
class ProductsController {

    getProducts = async(req, res) => {
        await pool.query('SELECT * FROM products', (err, rows) => {
            if (err) {
                throw err
            } else {
                res.json(rows);
            }
        })
    }

    create = async(req, res) => {
        const newProduct = req.body.product;
        await pool.query('INSERT INTO products set ?', [newProduct]);
        res.json({'text': 'creating a product'});
    }

    put = async(req, res) => {
        const { product } = req.body;
        await pool.query('UPDATE products SET ? WHERE id = ?', [product, product.id]);
        await pool.query('UPDATE sales SET product = ? where idProduct = ?', [product.name, product.id]);
        res.json({'text': 'update a product'});
    }

    delete = async(req, res) => {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({'text': 'delete a product'});
    }
}

export const productsController = new ProductsController();