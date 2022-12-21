const { QueryTypes } = require('sequelize');

const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;

const sequelize = db.sequelize;

exports.getChallenge = async (req,res) => {
    try {
        const category = req.query.category.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
        const categories = ['sport', 'creativite', 'sante'];
        var exists = 0;

        for(var i = 0 ; i<categories.length ; i++){
            console.log(category);
            console.log(categories[i])
            if(category.localeCompare(categories[i]) == 0){
                exists = 1;
            break;
            }
        }

        if(exists == 0){
            return res.json("Selectionnez une catégorie de challenge ou bien vérifiez qu'elle est corectement renseignée");
        }

        const challenge = await sequelize.query("SELECT * FROM challenge WHERE (`category`) = "+sequelize.escape(category)+" ORDER BY RAND() LIMIT 1", {type: QueryTypes.SELECT});
        return res.json(challenge);
    } catch (error) {
        res.sendStatus(400);
    }
}

exports.getChallengeByID = async (req,res) => {
    const id = req.body.id;
    const chall = await sequelize.query("SELECT * FROM challenge WHERE challengeID = " +sequelize.escape(id)+'', {type: QueryTypes.SELECT});
    res.send(chall);
}

exports.getRandomChallenge = async (req,res) => {
    try {
        const randomChallenge = await sequelize.query("SELECT * FROM challenge ORDER BY RAND() LIMIT 1 ", {type: QueryTypes.SELECT});
        res.send(randomChallenge)
    } catch (error) {
        res.sendStatus(400);
    }
}

// exports.getChallengeCategories = async (req,res) => {
//     try {
//         const categories = 
//     }catch{

//     }
// }
