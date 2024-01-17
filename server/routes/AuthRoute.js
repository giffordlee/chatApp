const { Signup, Login, searchUsers } = require("../controllers/authControllers");
const { userVerification, protect } = require("../middlewares/authMiddleware")
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification).get("/", protect, searchUsers);


module.exports = router;