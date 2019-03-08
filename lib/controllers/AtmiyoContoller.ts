import {Request, Response} from 'express'
import DB from '../db'
import {ObjectId} from "bson";
import {GridFSBucket} from "mongodb";
import * as multer from "multer";
import {Readable} from "stream";

export default class AtmiyoContoller {
    public AtmiyoGet(req: Request, res: Response) {
        const database = new DB();
        database.ConnectToServer().then(mainDb => {
            let fileID;
            try {
                fileID = new ObjectId(req.params.fileID)
            } catch (e) {
                return res.status(400).json({message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"})
            }
            res.set('content-type', 'image/png');
            res.set('accept-ranges', 'bytes');
            let bucket = new GridFSBucket(mainDb, {
                bucketName: 'atmiyobasket'
            });
            let downloadStream = bucket.openDownloadStream(fileID);
            downloadStream.pipe(res, {end: true})
        })
    }
    public AtmiyoPost(req: Request, res: Response) {
        const database = new DB();
        database.ConnectToServer().then(mainDb => {
            console.log(mainDb);
            const storage = multer.memoryStorage();
            const upload = multer();
            upload.single('atmiyo')(req, res, async (err) => {
                if(err){
                    return res.status(400).json({message: "Upload Request Validation Failed"})
                } else if (!req.body.name){
                    return res.status(400).json({message: "No file name provided"})
                }

                let fileName = req.body.name;
                const readableStream = new Readable();
                readableStream.push(req.file.buffer);
                readableStream.push(null);
                let bucket = new GridFSBucket(mainDb, {
                    bucketName: 'atmiyobasket'
                });
                let uploadStream = bucket.openUploadStream(fileName);
                let id = uploadStream.id;
                readableStream.pipe(uploadStream);
                await uploadStream.on('error', (error) => {
                    console.log(error);
                    return res.status(500).json({messsage:"Error uploading file"})
                });
                await uploadStream.on('finish', () => {
                    console.log(uploadStream);
                    return res.status(201).json({
                        message: "File uploaded successfully, stored under Mongo ObjectID: " + id,
                        fileid: {
                            artist: id
                        }
                    })
                })
            })
        })
    }
}
