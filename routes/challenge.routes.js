const express = require('express');

const challenge = require('../controllers/challenge.controller.js');

var router = require('express').Router();
    
router.get("/challenge", challenge.getChallenge);

router.get("/challenge/id", challenge.getChallengeByID);

router.get("/challenge/random", challenge.getRandomChallenge);

// router.get("/challenge/categories", challenge.getChallengeCategories);

module.exports = router;