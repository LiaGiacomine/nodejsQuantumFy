var mysql = require("mysql");
var express = require("express");
var login = require('./login');
var blog = require('./blog');
var papers = require('./papers');
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

    /*
        RENDER ALL PAGES:
        HTML, CSS, JS
    */

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

    app.get("/papers/individual/:paperid", function(req, res, next){
        res.render("pages/papers/show_individual",{
            session: req.session,
            user: req.session.username
        });
        next();
    });

    /*
        FUNCTIONS INVOLVING PAPER DATABASE
    */

    //An  ajax call is made to this from the paper page using dynamic_table script
    //to get the json response which is all the papers in order to be
    //outputted in the dynamic table 
    app.get("/paperdata",papers.paperdata);

    //An  ajax call is made to this from the paper page using the individial_paper script
    //to get the json response contains all the information stored in the db about the paper 
    app.get("/papers/get_individual_data/:paperid", papers.individualpaper);

    //Returns the comments made about the paper speficied
    app.get("/papers/get_paper_comments/:paperid", papers.getpapercomments);
  
    //ADD COMMENT
    app.post("/papers/addcomment/:paperid/:username", papers.addcomment);

    //CHECK LIKE EXISTS
    app.get("/papers/does_like_exist/:paperid/:username", papers.checklike);

    //ADD LIKE
    app.post("/papers/addlike/:paperid/:username", papers.addlike);

    /*
        FUNCTIONS INVOLVING USER DATABASE
    */

    //REGISTER
    app.post("/register", login.register);

    //LOGIN
    app.post("/login", login.login);

    /*
        FUNCTIONS INVOLVING BLOG DATABASE
    */

    //GET ALL BLOGS
    app.get("/blogdata", blog.blogdata);

    //GET SPEFIFIC BLOG
    app.get("/blog/get_blog_post/:blogid", blog.individualblogpost);

    //GET SPECIFIC BLOG COMMENTS
    app.get("/blog/get_blog_comments/:blogid", blog.getblogcomments);

    //ADD BLOG POST
    app.post("/blog/addpost/:username/:date", blog.addpost);

    //ADD COMMENT
    app.post("/blog/add_comment/:blogid/:username", blog.addcomment);


    //LOGOUT
    app.get('/logout',function(req,res,next){
        req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            //Once session is destroyed redirect to Home page
            res.redirect("/");
            next();
        }
        });
    });


}