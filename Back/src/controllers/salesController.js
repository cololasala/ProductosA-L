import pool from '../database';

export class SalesController {

    /* Al eliminar un producto solo muestro aquellas facturas que no tienen el producto eliminado */
    getNewSales = async (req, res) => {
        await pool.query('SELECT new_sales.id, new_sales.client, new_sales.saleTotal, new_sales.paid, new_sales.create_at FROM new_sales WHERE id IN (SELECT idSale FROM sale_product) ORDER BY create_at DESC', (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.json(rows);
            }
        });
    }

    getSaleItems = async (req, res) => {
        const { id } = req.params;
        await pool.query('SELECT products.name, products.sellingPrice, sale_product.quantity FROM sale_product INNER JOIN products ON sale_product.idProduct = products.id WHERE idSale = ?', [id], (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.json(rows);
            }
        })
    }

    getRankingSales = async (req, res) => {
        await pool.query('SELECT products.name, sum(sale_product.quantity) as total FROM products INNER JOIN sale_product ON products.id = sale_product.idProduct GROUP BY name ORDER BY sum(sale_product.quantity) DESC', (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.json(rows);
            }
        });
    }

    create = async (req, res) => {
        const newSale = req.body.sale;
        await pool.query(`INSERT INTO sales set ?`, [newSale]);
        this.putProduct(newSale);
        res.json({ 'text': 'creating a sale' });
    }

    createNew = async (req, res) => {
        const newSale = (({ client, paid, saleTotal }) => ({ client, paid, saleTotal }))(req.body);
        const listProducts = (({ sellList }) => ({ sellList }))(req.body);
        const inserted = await pool.query(`INSERT INTO new_sales set ?`, [newSale]); // guardado en new_sales (seria la factura)

        if (inserted) {
            setTimeout(async() => {
                await pool.query(`SELECT id FROM new_sales ORDER BY id DESC LIMIT 1`, function (err, rows) {
                    const { id } = rows[0];
                    listProducts.sellList.forEach(async (product) => {
                        await pool.query(`INSERT INTO sale_product SET idSale = ?, idProduct = ?, quantity = ?`, [id, product.item.id, product.quantity]);
                        await pool.query(`UPDATE products SET quantity = quantity - ? WHERE products.id = ?`, [product.quantity, product.item.id]);
                    });
                });
    
                res.json({ 'text': 'creating a new sale' });
            }, 1000)
            
        }

    }

    putSale = async (req, res) => {
        const { sale: { id } } = req.body;
        await pool.query(`UPDATE new_sales SET paid = 1 WHERE id = ?`, [id]);
        res.json({ 'text': 'update a paid of a sale' });
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await pool.query(`DELETE FROM new_sales WHERE id = ?`, [id]);
        res.json({ 'text': 'delete a sale' });
    }
}

export const salesController = new SalesController();