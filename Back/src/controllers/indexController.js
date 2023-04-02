export class IndexController {

    index(req, res) {
        res.send('Back response');
    }
}

export const indexController = new IndexController();