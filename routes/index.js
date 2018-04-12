var mysql = require("mysql");
var express = require("express");
var router = express.Router();

var admin = require('./admin');
var login = require('./login');
var committee = require('./committee');
var papers = require('./papers');

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
        HTML
    */

    app.get("/", function(req,res, next){
        res.render("pages/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });


    /*
        COMMITTEE PAGES
    */

    app.get("/committee/index", function(req,res, next){
        res.render("pages/committee/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/committee/individual_ranking/:committee_name/:committee_id", function(req,res, next){
        res.render("pages/committee/individual_ranking", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    /*
        BLOG PAGES
    */

    app.get("/blog/index", function(req,res, next){
        res.render("pages/blog/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    /*
        SUMMARY PAGES
    */

    app.get("/summaries/index", function(req,res, next){
        res.render("pages/summaries/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/summaries/write_summary", function(req,res, next){
        res.render("pages/summaries/write_summary", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/summaries/summary_sent", function(req,res, next){
        res.render("pages/summaries/summary_sent", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee
        });
        next();
    });


    /*
        LOGIN PAGES
    */

    app.get("/login/user", function(req,res, next){
        res.render("pages/login/user", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/login/author", function(req,res, next){
        res.render("pages/login/author", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/login/admin", function(req,res, next){
        res.render("pages/login/admin", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/login/loginSuccessful", function(req,res, next){
        res.render("pages/login/loginSuccess", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    app.get("/login/logout_first", function(req,res, next){
        res.render("pages/login/logout_first", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "None",
            committee: req.session.committee
        });
        next();
    });

    /*
        REGISTER PAGES
    */

    app.get("/register/user", function(req,res, next){
        res.render("pages/register/user", {
            err: "None",
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee
        });
        next();
    });

    app.get("/register/author", function(req,res, next){
        res.render("pages/register/author", {
            err: "None",
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee
        });
        next();
    });

    /*
        PAPER PAGES
    */

    app.get("/papers/index", function(req,res, next){
        res.render("pages/papers/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/papers/individual/:paperid", function(req, res, next){
        res.render("pages/papers/show_individual",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/papers/from/:timeline", function(req, res, next){
        res.render("pages/papers/papers_from",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/papers/search/:keyword", function(req, res, next){
        res.render("pages/papers/search",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    /*
        USER PAGES
    */

    app.get("/user/index", function(req,res, next){
        res.render("pages/user/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });


    /*
        ADMIN PAGES
    */

    app.get("/admin/index", function(req,res, next){
        res.render("pages/admin/index", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/committee", function(req,res, next){
        res.render("pages/admin/committee", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/summaries", function(req,res, next){
        res.render("pages/admin/summaries", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/blog", function(req,res, next){
        res.render("pages/admin/blog", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/addcommittee", function(req,res, next){
        res.render("pages/admin/addcommittee", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/addsummary", function(req,res, next){
        res.render("pages/admin/addsummary", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/addblog", function(req,res, next){
        res.render("pages/admin/addblog", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/individual/:title", function(req, res, next){
        res.render("pages/admin/individual_summary",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/manage_committee/:title/:id", function(req, res, next){
        res.render("pages/admin/individual_committee",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    app.get("/admin/manage_admin", function(req, res, next){
        res.render("pages/admin/manage_admin",{
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            committee: req.session.committee,
            err: "None"
        });
        next();
    });

    /*
        FUNCTIONS INVOLVING ADMIN 
    */

    //Gets SUMMARIES FROM ADMIN DATABASE
    app.get("/admin/check_summaries", admin.getchecksummaries);

    app.get("/summaries/author_summaries", admin.getauthorsummaries);   

    //Gets individual summary
    app.get("/admin/individual_summary/:summary_id", admin.individualsummary);

    //ADDS SUMMARY TO ADMIN DATABASE
    app.post("/submit_summary", admin.submitsummary);
    
    //ADDS SUMMARY TO ADMIN DATABASE
    app.post("/delete_summary/:summary_id", admin.deletesummary);
       
    //ADDS SUMMARY TO ADMIN DATABASE
    app.post("/accept_summary/:summary_id/:author_name/:author_email/:paper_title/:summary/:date", admin.acceptsummary);   
    
    //ADD NEWS TO DB
    app.post("/admin/postnews", admin.postnews); 

    /*
        FUNCTIONS INVOLVING PAPER DATABASE
    */

    //An  ajax call is made to this from the paper page using dynamic_table script
    //to get the json response which is all the papers in order to be
    //outputted in the dynamic table
    app.get("/paperdata",papers.paperdata);

    //Returns the papers from the specified time
    app.get("/paperdata/get_papers_from/:timeline", papers.papers_from);
    
    //SEARCH FOR PAPERS
    app.get("/papers/paperdata/search/:keyword", papers.search);

    //NUMBER OF LIKES
    app.get("/papers/number_of_likes/:paper_id", papers.likes_total);

    //NUMBER OF STARS
    app.get("/papers/number_of_stars/:paper_id", papers.stars_total);

    //An  ajax call is made to this from the paper page using the individial_paper script
    //to get the json response contains all the information stored in the db about the paper 
    app.get("/papers/get_individual_data/:paperid", papers.individualpaper);

    //Returns the comments made about the paper speficied
    app.get("/papers/get_paper_comments/user/:paperid", papers.getusercomments);
    
    //Returns the comments made about the paper speficied
    app.get("/papers/get_paper_comments/committee/:paperid", papers.getcommitteecomments);
      
    //ADD USER COMMENT
    app.post("/papers/addusercomment/:paperid/:username", papers.addusercomment);
    
    //DELETE COMMITTEE COMMENT
    app.post("/papers/deleteusercomment/:paperid/:comment_id", papers.deleteusercomment);
    
    //ADD COMMITTEE COMMENT
    app.post("/papers/addcommitteecomment/:paperid/:committee_id/:username", papers.addcommitteecomment);
    
    //DELETE COMMITTEE COMMENT
    app.post("/papers/deletecommitteecomment/:paperid/:comment_id", papers.deletecommitteecomment);
    
    //ADD AUTHOR REPLY
    app.post("/papers/author_reply/:paperid/:username/:comment_id/:reply", papers.addauthorreply);
    
    //GET AUTHOR REPLY
    app.get("/papers/get_author_reply/:comment_id", papers.getauthorreply);
    
    //CHECK LIKE EXISTS
    app.get("/papers/does_like_exist/:paperid/:username", papers.checklike);

    //CHECK STAR EXISTS
    app.get("/papers/does_star_exist/:paperid/:username", papers.checkstar);

    //CHECK STAR EXISTS
    app.get("/papers/committee_ranking/:committee_id", papers.committee_ranking);
        
    //ADD LIKE
    app.post("/papers/addlike/:paperid/:username", papers.addlike);

    //DELETe LIKE
    app.post("/papers/deletelike/:paperid/:username", papers.deletelike);
        
    //ADD STAR
    app.post("/papers/addstar/:committee_id/:paperid/:username", papers.addstar);
    
    //DELETE STAR
    app.post("/papers/deletestar/:committee_id/:paperid/:username", papers.deletestar);
    
    /* 
     for user page, using PAPER DB
    */

    //CHECK LIKES GIVEN BY USER
    app.get("/paper/likes/by/:username", papers.likes_by_user);
    
    //CHECK STARS GIVEN BY USER
    app.get("/paper/stars/by/:username", papers.stars_by_user);
    
   //CHECK USER COMMENTS MADE BY USER
    app.get("/paper/user/comments/by/:username", papers.comments_by_user);
   
    //CHECK COMMITTEE COMMENTS MADE BY USER
   app.get("/paper/committee/comments/by/:username", papers.committee_comments_by_user);
   
    
    /*
        FUNCTIONS INVOLVING COMMITTEE DATABASE
    */

    //GET ALL TYPES OF COMMITTES
    app.get("/committee_data", committee.committee_data);
    
    //Return all members of specified committee
    app.get("/committee/members/:committee_id", committee.members);

    // An  ajax call is made to this from the individual committee page using the individual_committee script
    // add a member to the committee
    app.post("/committee/addmember/:committee_id/:username", committee.committee_addmember);

    //Delete a member from the committee
    app.post("/committee/delete/:committee_id/:username", committee.committee_deletemember);
    
    //ADDS COMMITTEE TO DB
    app.post("/committee/addcommittee", committee.addcommittee);   
    
    //DELETES COMMITTEE FROM DB
    app.post("/delete/committee/:committee_id", committee.deletecommittee);   
    
    /*
      REGISTER & LOGIN
    */

    //GET LIST OF MEMBERS
    app.get("/user_list", login.userlist);
    
    //GET LIST OF ADMIN
    app.get("/admin_list", login.adminlist);
    
    //REGISTER USER
    app.post("/register_user", login.register_user);
    
    //REGISTER AUTHOR
    app.post("/register_author", login.register_author);

    //USER LOGIN
    app.post("/userlogin", login.userlogin);

    //Update user with committee
    app.post("/user/add/committee/:committee_id/:username", login.add_committee);
    
    //Set committee value to null
    app.post("/user/delete/committee/:username", login.delete_committee);
    
    //ADDS SUMMARY TO ADMIN DATABASE
    app.post("/admin/add_admin/:email", login.add_admin);
        
    //ADDS SUMMARY TO ADMIN DATABASE
    app.post("/admin/delete_admin/:email", login.delete_admin);
         
        
    //AUTHOR LOGIN
    app.post("/authorlogin", login.authorlogin);

    //ADMIN LOGIN
    app.post("/adminlogin", login.adminlogin);

    /*
        FUNCTIONS INVOLVING THE BLOG 
    */

    app.get("/blog/get_news", admin.getnews)

    // app.get("/blog/get_summaries", admin.getsummaries)



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