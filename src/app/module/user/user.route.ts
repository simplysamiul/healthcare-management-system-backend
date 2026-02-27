import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorSchema } from "./user.va;idation";



const router = Router();



router.post("/create-doctor", validateRequest(createDoctorSchema), userController.createDoctor);

export const userRoutes = router;