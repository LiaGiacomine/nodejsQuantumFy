var mysql = require("mysql");
var express = require("express");
var login = require('./login');
var router = express.Router();

//Set up connection with database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "arxiv_papers"
});

module.exports = function(app) {

    app.get("/", function(req,res, next){
        res.render("pages/index", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/about", function(req,res, next){
        res.render("pages/about", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/blog", function(req,res, next){
        res.render("pages/blog", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/login", function(req,res, next){
        res.render("pages/login", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/register", function(req,res, next){
        res.render("pages/register", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/loginSuccessful", function(req,res, next){
        res.render("pages/loginSuccess", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/papers/index", function(req,res, next){
        res.render("pages/papers/index", {
            session: req.session,
            user: req.session.username
        });
        next();
    });

    //An  ajax call is made to this from the paper page using dynamic_table script
    //to get the json response which is all the papers in order to be
    //outputted in the dynamic table 
    app.get("/paperdata", function(req,res) {
        var data = {
            "Data": ""
        };
        //Selects all papers in the table in the order of most stars
        db.query("SELECT * FROM paper_data ORDER BY paper_stars DESC",function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
    });


    //An  ajax call is made to this from the paper page using the individial_paper script
    //to get the json response contains all the information stored in the db about the paper 
    app.get("/papers/individual/:paperid", function(req, res, next){
        res.render("pages/papers/show_individual",{
            session: req.session,
            user: req.session.username
        });
        next();
    });

    app.get("/papers/get_individual_data/:paperid", function(req,res, next){
        //get the name of the paper
        var paperid = req.params.paperid;
        //Store JSON result to be extracted in data
        var data = {
            "Data": ""
        };
        db.query("SELECT * FROM paper_data WHERE paper_id = ?",paperid,function(err, rows, fields){
            if(rows.length != 0){
                data["Data"] = rows;
                res.json(data);
            }else{
                data["Data"] = 'No data Found..';
                res.json(data);
            }
            });
    });

    app.get("/papers/get_paper_comments/:paperid", function(req,res, next){
        //get the name of the paper
        var paperid = req.params.paperid;
        //Store JSON result to be extracted in data
        var data = {
            "Data": ""
        };
        db.query("SELECT * FROM comments WHERE paper_id = ?",paperid,function(err, rows, fields){
            if(rows.length != 0){
                data["Data"] = rows;
                res.json(data);
            }else{
                data["Data"] = 'No data Found..';
                res.json(data);
            }
            });
    });

    //LOGOUT
    app.get('/logout',function(req,res){
        req.session.destroy(function(err) {
          if(err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
    });

    //ADD COMMENT
    app.post("/papers/addcomment/:paperid", function(req,res){
            
        //Get the values entered in register form
        var comment = req.body.post_comment;
        var paperid = req.params.paperid;

        var new_comment = {"paper_id": parseInt(paperid), "paper_comments": comment};

        db.query('INSERT INTO comments SET ?', new_comment, function(error, results, fields){
            if (error) {
                console.log("error occured", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                console.log("solution is: ", results);
                //This reloads the page after the comment has been added
                res.redirect("/papers/individual/" + paperid.toString());
            }
        });
    
        req.checkBody('post_comment', 'You can not enter a blank commment').notEmpty();

        
        var errors = req.validationErrors();
    });

    /////////ADD LIKE///////////
    app.post("/papers/addlike/:paperid/:username", function(req,res){

        var paperid = req.params.paperid;
        var username = req.params.username;

        var data = {
            "Data": ""
        };

        var add_like  = {"paper_id": parseInt(paperid), "username": username.toString()};
    
        //CHECK IF USER HAS ALREADY LIKED THIS PAPER
        var like_already_set=[];
        db.query('SELECT COUNT(*) AS c FROM likes WHERE paper_id = ? AND username = ?',[parseInt(paperid),username.toString()], function(error, results, fields){
            if (error) {
                console.log("error occured", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                like_already_set.push(JSON.stringify(results[0]));
                like_already_set = like_already_set[0][5];
                console.log(like_already_set);
                //This reloads the page after the comment has been added
                // res.redirect("/papers/individual/" + paperid.toString());
            }
        });

        //IF USER HAS LIKED PAPER DONT LET THEM LIKE AGAIN
        //ELSE ADD A LIKE TO THE TABLE
        if (like_already_set == 0){
            db.query('INSERT INTO likes SET ?',[add_like], function(error, results, fields){
                if (error) {
                    console.log("error occured", error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    //This reloads the page after the comment has been added
                    res.redirect("/papers/individual/" + paperid.toString());
                }
            });
        } else {
            res.send(500,'showAlert');
        }


    });


    app.post("/register", login.register);
    app.post("/login", login.login);


}