var express = require("express");
var router = express.Router();

module.exports = function(app) {

    app.get("/", function(req,res, next) {
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/index");
        next();
    });

    app.get("/about", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/about");
        next();
    });

    app.get("/blog", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/blog");
        next();
    });

    app.get("/login", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/login");
        next();
    });

    app.get("/register", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/register");
        next();
    });

    app.get("/papers/index", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/index");
        next();
    });

    app.get("/papers/thermodynamics", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/thermodynamics");
        next();
    });

    app.get("/papers/metrology", function(req,res,next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/metrology");
        next();
    });

    app.get("/papers/shannon", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/shannon");
        next();
    });

    app.get("/papers/cryptography", function(req,res, next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/cryptography");
        next();
    });

    app.get("/papers/computing", function(req,res,next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/computing");
        next();
    });

    app.get("/papers/black_hole", function(req,res,next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/black_hole");
        next();
    });

    app.get("/papers/correlations", function(req,res,next){
        res.header("Access-Control-Allow-Origin", "https://arxiv.org/list/quant-ph/new");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.render("pages/papers/correlations");
        next();
    });
    

    
}