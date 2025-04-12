import { Router } from "express";
import {
  createRider,getRiderByMobile,updateRider
} from "../Controllers/riderController";

const riderRouter = Router();

riderRouter.post("/",createRider );
riderRouter.get("/",getRiderByMobile );
riderRouter.patch("/:id",updateRider );

export default riderRouter;
