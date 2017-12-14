var express = require("express");
var router = express.Router();

module.exports = function(app) {

    app.get("/", function(eq,res) {
        res.render("pages/index");
    });

    app.get("/about", function(req,res){
        res.render("pages/about")
    });

    app.get("/blog", function(req,res){
        res.render("pages/blog")
    });

    app.get("/login", function(req,res){
        res.render("pages/login")
    });

    app.get("/register", function(req,res){
        res.render("pages/register")
    });

    app.get("/papers/index", function(req,res){
        res.render("pages/papers/index")
    });

    app.get("/papers/thermodynamics", function(req,res){
        res.render("pages/papers/thermodynamics")
    });

    app.get("/papers/metrology", function(req,res){
        res.render("pages/papers/metrology")
    });

    app.get("/papers/shannon", function(req,res){
        res.render("pages/papers/shannon")
    });

    app.get("/papers/cryptography", function(req,res){
        res.render("pages/papers/cryptography")
    });

    app.get("/papers/computing", function(req,res){
        res.render("pages/papers/computing")
    });

    app.get("/papers/black_hole", function(req,res){
        res.render("pages/papers/black_hole")
    });

    app.get("/papers/correlations", function(req,res){
        res.render("pages/papers/correlations")
    });
    

    
}