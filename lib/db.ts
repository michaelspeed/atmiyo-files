import * as MongoDB from 'mongodb'

const MongoClient = MongoDB.MongoClient

export default class DB {
    public db: any;
    public ConnectToServer(): Promise<any> {
        return MongoClient.connect("mongodb://atbeats@polaris.achtunglabs.co:27017/?authSource=atbeats")
            .then(alldb => {
                return this.db = alldb.db('atbeats')
            }).catch(error => {return error})
    }
}
