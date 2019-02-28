import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import {MainRouter} from "./routes/MainRouter";

class App {
    public app: express.Application
    public mainRoutes: MainRouter = new MainRouter()

    constructor(){
        this.app = express()
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: true}))
        this.app.use(cors())
        this.app.use('/statics', express.static('./static'))
        this.mainRoutes.routes(this.app)
    }
}

export default new App().app
