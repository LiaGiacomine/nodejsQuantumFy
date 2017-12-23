var express = require("express");
var login = require('./login');
var router = express.Router();

module.exports = function(app) {

    //RENDERS THE FILES SO THEY APPEAR ON WEBSITE
    // WHEN GIVEN THE STRING IN GET
    app.get("/", function(req,res, next) {
        res.render("pages/index");
        next();
    });

    app.get("/about", function(req,res, next){
        res.render("pages/about");
        next();
    });

    app.get("/blog", function(req,res, next){
        res.render("pages/blog");
        next();
    });

    app.get("/login", function(req,res, next){
        res.render("pages/login");
        next();
    });

    app.get("/register", function(req,res, next){
        res.render("pages/register");
        next();
    });

    app.get("/papers/index", function(req,res, next){
        res.render("pages/papers/index");
        next();
    });

    app.get("/papers/thermodynamics", function(req,res, next){
        res.render("pages/papers/thermodynamics");
        next();
    });

    app.get("/papers/metrology", function(req,res,next){
        res.render("pages/papers/metrology");
        next();
    });

    app.get("/papers/shannon", function(req,res, next){
        res.render("pages/papers/shannon");
        next();
    });

    app.get("/papers/cryptography", function(req,res, next){
        res.render("pages/papers/cryptography");
        next();
    });

    app.get("/papers/computing", function(req,res,next){
        res.render("pages/papers/computing");
        next();
    });

    app.get("/papers/black_hole", function(req,res,next){
        res.render("pages/papers/black_hole");
        next();
    });

    app.get("/papers/correlations", function(req,res,next){
        res.render("pages/papers/correlations");
        next();
    });

    app.post("/register", login.register);
    app.post("/login", login.login);

}