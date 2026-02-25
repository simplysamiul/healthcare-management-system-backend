import { AuthRoutes } from "../module/auth/auth.route";
import { specialityRoutes } from "../module/speciality/speciality.route";

import { Router } from "express";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", specialityRoutes);
router.use("/users", userRoutes);
router.use("/doctors", doctorRoutes);



export const indexRoute = router;