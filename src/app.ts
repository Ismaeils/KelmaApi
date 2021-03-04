import express from "express";
import routes from "./api/routes"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

routes(app);

app.listen(80, ()=> console.log('server running'));