import express from "express";
import registerUser, {
    verification,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOTP,
    changePassword,

} from "../controller/controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/verify/:token", verification); // Gmail verification link


router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/changepassword", changePassword);

export default router;