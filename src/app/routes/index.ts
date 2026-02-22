import { AuthRoutes } from "../module/auth/auth.route";
import { specialityRoutes } from "../module/speciality/speciality.route";

import { Router } from "express";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/specialties", specialityRoutes)



export const indexRoute = router;