const user = require('../controllers/user.controller.js');
var router = require('express').Router();
    
router.post("/user", user.createUser);

router.get("/user", user.getUsers);

router.post("/user/sign", user.getUserByCredentials);

router.get("/user/mail", user.getUserByMail);

router.get("/user/id", user.getUserByID);

router.patch("/user/id", user.updateUser);

router.delete("/user/id", user.deleteUserByID);

router.get("/user/id/challenge", user.getUserChallengeID);

router.patch("/user/id/challenge", user.updateUserChallenge); 

module.exports = router;