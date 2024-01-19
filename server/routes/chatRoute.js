const { protect } = require("../middlewares/authMiddleware")
const { accessChat, fetchChats, createGroupChat, createPersonalChat, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatControllers")
const router = require("express").Router();

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.post('/personal', protect, createPersonalChat);

router.put('/rename', protect, renameGroup);
router.put('/groupadd', protect, addToGroup);
router.put('/groupremove', protect, removeFromGroup);


module.exports = router;
