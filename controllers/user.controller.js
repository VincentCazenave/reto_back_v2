const { type } = require('os');
const { exit } = require('process');
const { QueryTypes } = require('sequelize');
const uuidv4 = require("uuid")
const db = require("../models");

const sequelize = db.sequelize;

    /* TODO
           Vérifier la nullité des params pour toutes les routes
           Générer id (uuid ?)   
           Gérer le fait que query s'exe 2 fois
           mailCheck / username check / password check -> front ?  
    */

    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    exports.createUser = async (req,res) => {
        try {
            const id = guid();
            const username = req.body.username;
            const mail = req.body.mail;
            //check(mail).normalizeEmail().isEmail();
            const password = req.body.password;
            if(username == ""){
                return res.json("Le username n'est pas renseigné correctement");
            }
            if(mail == ""){
                return res.json("Le mail n'est pas renseigné correctement");
            } 
            if(password == ""){
                return res.json("Le mot de passe n'est pas renseigné correctement");
            }

            const mailCheck = await sequelize.query("SELECT userID FROM user WHERE mail = "+sequelize.escape(mail)+"", {QueryTypes: type.SELECT});

            if(mailCheck[0] != ""){
                return res.json("Ce mail est déjà utilisé");
            }

            const usernameCheck = await sequelize.query("SELECT userID FROM user WHERE username = "+sequelize.escape(username)+"", {QueryTypes: type.SELECT});
            
            if(usernameCheck[0] != ""){
                return res.json("Ce username est déjà utilisé");
            }

            const user = await sequelize.query("INSERT INTO `user`(`userID`, `username`, `mail`, `password`, `challengeDate`, `challengeID`, `status`, `nombreChallenge`, `score`) VALUES (" +sequelize.escape(id)+"," +sequelize.escape(username)+"," +sequelize.escape(mail)+"," +sequelize.escape(password)+",null,null,null, 0, 0)", {type: QueryTypes.INSERT})
            console.log(user);
            return res.json(user);

        }catch (err) {
            res.send(err);
        }
    }

    exports.getUserByCredentials = async (req,res) => {
        try {
            const mail = req.body.mail;
            const password = req.body.password;

            if(mail == ""){
                return res.json("Le mail n'est pas renseigné correctement");
            } 
            if(password == ""){
                return res.json("Le mot de passe n'est pas renseigné correctement");
            }

            const user = await sequelize.query("SELECT * FROM user WHERE mail = " +sequelize.escape(mail)+" AND password = "+sequelize.escape(password)+"", {type: QueryTypes.SELECT});
            
            if(user.length < 0){
                return res.send(null);
            }else{
                console.log(user);
                return res.send(user);
            }
        } catch (error) {
            res.sendStatus(404);
        }
        
    }

    exports.getUsers = async (req,res) => {
        try{    
            const user = await sequelize.query("SELECT * FROM user", {type: QueryTypes.SELECT});
            res.send (user);
        }catch (err){
            res.sendStatus(400);
        }
    }

    exports.getUserByID = async (req,res) => {
        try{    
            const id = req.body.id;
            const user = await sequelize.query("SELECT * FROM user WHERE userID = " +sequelize.escape(id)+"", {type: QueryTypes.SELECT});
            res.send (user);
        }catch (err){
            res.sendStatus(400);
        }
    }
    
    exports.getUserByMail = async (req,res) => {
        try {
            const mail = req.query.mail;
            const user = await sequelize.query("SELECT * FROM user WHERE mail = " +sequelize.escape(mail)+"", {type: QueryTypes.SELECT});
            if(user < 0){
                return res.send(null);
            }else{
                return res.send(user);
            }
        } catch (error) {
            
        }
    }

    exports.updateUser = async (req,res) => {
        
        try {
            
            const id = req.body.id;
            console.log(id);
            
            //Check si username n'existe pas (front ?)
            if(req.body.username){
                
                const username = req.body.username;
                const usernameCheck = await sequelize.query("SELECT * FROM user WHERE username = "+sequelize.escape(username)+"", {QueryTypes: type.SELECT});
                
                if(!usernameCheck){
                    const userUpdate = await sequelize.query("UPDATE user SET username = "+sequelize.escape(username) +" WHERE (`userID`) ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE})
                    return res.json("username updated !")
                }else{
                    return res.json("This username is already taken");
                }
            }

            // Check si mail n'existe pas dans les user ( peut être le faire dans le front ?)
            if(req.body.mail){
                const mail = req.body.mail;
                console.log(mail);
                const mailCheck = await sequelize.query("SELECT * FROM user WHERE mail = "+sequelize.escape(mail)+"", {QueryTypes: type.SELECT});
                
                if(!mailCheck){
                    const userUpdate = await sequelize.query("UPDATE user SET mail = "+sequelize.escape(mail) +" WHERE userID ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE})
                    return res.json("Mail updated !")
                }else{
                    return res.json("This mail is already taken");
                }
            }

            // check avant si password différent de celui d'avant ! (chexk ca dans front ?)
            if(req.body.password){
                const password = req.body.password;
                const passwordCheck = await sequelize.query("SELECT * FROM user WHERE password = "+sequelize.escape(password)+" AND userID = "+sequelize.escape(id)+"", {QueryTypes: type.SELECT});
                
                if(!passwordCheck){
                    const userUpdate = await sequelize.query("UPDATE user SET password = "+sequelize.escape(password) +" WHERE userID ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE})
                    return res.json("New password updated !")
                }else{
                    res.json("Incorrect password");
                }
            }

            if(req.body.challengeDate){
                console.log("ici");
                const date = req.body.challengeDate;
                const dateUpdate = await sequelize.query("UPDATE user SET challengeDate = "+sequelize.escape(date) +" WHERE userID ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE});
                return res.json("The challenge date has been updated");
            }

            if(req.body.challengeId){
                console.log("ici");

                const challengeId = req.body.challengeId;
                const challengeIdUpdate = await sequelize.query("UPDATE user SET challengeID = "+sequelize.escape(challengeId) +" WHERE userID ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE});
                return res.json("The challenge ID has been updated")
            }

            if(req.body.status){
                console.log("ici");

                const status = req.body.status;
                const statusUpdate = await sequelize.query("UPDATE user SET status = "+sequelize.escape(status) +" WHERE userID ="+sequelize.escape(id)+"", {type: QueryTypes.UPDATE});
                return res.json("The status has been updated")
            }

            return res.json("Aucune modification effectuée")
        } catch (err) {
            res.sendStatus(400);
        }
    }

    exports.deleteUserByID = async (req,res) => {
        try {
            const id = req.body.id;
            const user = await sequelize.query("DELETE * FROM user WHERE userID = " +sequelize.escape(id)+"", {type: QueryTypes.DELETE});
            res.send(user);
        } catch (err) {
            res.sendStatus(400)
        }
    }

    exports.getUserChallengeID = async (req,res) => {
        try {
            const id = req.body.id;
            const challengeID = await sequelize.query("SELECT challengeID FROM user WHERE userID = " +sequelize.escape(id)+"", {type: QueryTypes.SELECT});
            res.send(challengeID);
        } catch (err) {
            res.sendStatus(400)
        }
    }

    exports.updateUserChallenge = async (req,res) => {
        try {
            const id = req.body.id;
            const challengeID = req.body.challengeID;
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');;
            const challPatch = await sequelize.query("UPDATE user SET `challengeID` = "+sequelize.escape(challengeID)+", `challengeDate` =" +sequelize.escape(date)+",`status` = false WHERE userID = " +sequelize.escape(id)+"", {type: QueryTypes.UPDATE});
            res.send('OK');
        } catch (error) {
            res.sendStatus(400);
        }
    }

    
    