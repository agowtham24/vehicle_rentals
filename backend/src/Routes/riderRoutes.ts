import { Router } from "express";
import {
  createRider,
  getRiderByMobile,
  updateRider,
} from "../Controllers/riderController";
import { RiderValidator } from "../Validations/rider";
import { verifyToken } from "../Utils/Jwt";

const riderRouter = Router();

riderRouter.post("/", RiderValidator.create, createRider);
riderRouter.get(
  "/",
  verifyToken,
  // RiderValidator.getRiderByMobile,
  getRiderByMobile
);
riderRouter.patch("/:id", verifyToken, updateRider);

export default riderRouter;
