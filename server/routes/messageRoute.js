const { protect } = require("../middlewares/authMiddleware")
const { allMessages, sendMessage } = require("../controllers/messageControllers");
const router = require("express").Router();

router.get("/:chatId/:page", protect, allMessages);
router.post("/", protect, sendMessage);

module.exports = router;
