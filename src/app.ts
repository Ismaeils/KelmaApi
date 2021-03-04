import express from "express";
import routes from "./api/routes"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
routes(app);

app.listen(80, ()=> console.log('server running'));