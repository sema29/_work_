// logging.routes.ts
// @ts-ignore
import http from 'http'
const apiData = require("../controllers/apiData.controllers");




module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/getAllData", apiData.getAllData);


   
    

};