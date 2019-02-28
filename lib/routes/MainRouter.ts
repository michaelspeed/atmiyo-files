import {Application} from 'express'
import AtmiyoContoller from "../controllers/AtmiyoContoller";

export class MainRouter {

    public atmiyoController: AtmiyoContoller = new AtmiyoContoller()

    public routes(app: Application): void {
        app.route('/imgs/:fileID')
            .get(this.atmiyoController.AtmiyoGet);
        app.route('/imgs')
            .post(this.atmiyoController.AtmiyoPost);
    }
}
