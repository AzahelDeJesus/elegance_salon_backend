const express = require("express");
const { resetPassword, forgotPassword, signIn, signUp, resetPasswordGet, user } = require("../controllers/AuthControlllers");
const { validateToken } = require("../middlewares/tokenValidate");
const router = express.Router();


router.get("/user",validateToken,user)
router.get("/recoverPassword/:token",resetPasswordGet);
router.get("/:token",resetPasswordGet);
router.get("/resetPassword/:token",resetPasswordGet);
router.post("/signUp",signUp);
router.post("/signIn",signIn);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword/:token",resetPassword)



module.exports = router;