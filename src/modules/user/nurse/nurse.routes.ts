import { Router } from "express";

import isAuth from "../../../middleware/isAuth";
import { nurseProfileController } from "./nurse.controller";

const router = Router();

router.post("/create", isAuth(), nurseProfileController.createdNurseProfile);
router.get("/get", isAuth(), nurseProfileController.getNurseProfile);
router.put("/update", isAuth(), nurseProfileController.updateNurseProfile);
router.get("/get-all", isAuth(), nurseProfileController.getAllNurseProfiles);


export const nurseProfileRouter = router;
