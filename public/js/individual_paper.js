/*
Makes Ajax call to script which connects with db to
return the specified paper along with all of its information

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //GET PAPER ID
    var url = window.location.href;
    var end_of_str = url.length;
    var paperid = url.slice(url.indexOf("/individual/") + 12, end_of_str);
    committee = $("#committee").html(); 
    //GET DATA ABOUT PAPER BY USING PAPER ID FOR QUERY
    $.ajax({
        type: "GET",
        url: "/papers/get_individual_data/" + paperid,
        dataType: "JSON", // data type expected from server
        success: function (paper_data) {
            //Call function to add paper returned to page
            data = paper_data;
            addToPage(data);
        },
        error: function() {
            console.log('Error:');
        }
    });

    //GET USER COMMENTS MADE ABOUT PAPER
    $.ajax({
        type: "GET",
        url: "/papers/get_paper_comments/user/" + paperid,
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function() {
            console.log('Error: ' + paper_comments);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            comment_count = Object.keys(data["Data"]).length;
            $("#user_table_title").html(comment_count + " user comments");
            addCommentsTable(data, comment_count,"user");
        } else {
            $("#user_table_title").html("");
        }
        $("#user_table_title").css({"font-family":"Arial","font-size":"1em","margin-left":"5%","font-weight":"bold","color":"grey"});
    });

    //GET COMMITTEE COMMENTS MADE ABOUT PAPER
     $.ajax({
        type: "GET",
        url: "/papers/get_paper_comments/committee/" + paperid,
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function() {
            console.log('Error: ' + paper_comments);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            comment_count = Object.keys(data["Data"]).length;
            $("#committee_table_title").html(comment_count + " committee comments");
            addCommentsTable(data, comment_count,"committee");
        } else {
            $("#committee_table_title").html("");
        }
        $("#committee_table_title").css({"font-family":"Arial","font-size":"1em","margin-left":"5%","font-weight":"bold","color":"grey"});
    });

    // ================================================================
    // Colour-change on hovering if they have not liked/stared the paper
    // ================================================================

     //ON HOVER CHANGE COLOUR OF LIKE or STAR TO INDICATE POSSIBILITY OF CLICK
    function allowHover(attr){
        var extension = "png";
        $(".container #" + attr + "s").mouseover(function(){
            $("#" + attr + "s").attr("src","../../../public/img/after" + attr + "." + extension);
        }).mouseleave(function(){
            $("#" + attr + "s").attr("src","../../../public/img/before" + attr + "." + extension);
        });
        $(".container .paper_" + attr).mouseover(function(){
            $("#" + attr + "s").attr("src","../../../public/img/after" + attr + "." + extension);
        }).mouseleave(function(){
            $("#" + attr + "s").attr("src","../../../public/img/before" + attr + "." + extension);
        });
    }
    
    //CHECK IF USER HAS ALREADY LIKED THE PAPER
    var user = $("#top #welcome_user").html();
    var reg = $("#top #register i").html();
    //IF THEY HAVEN'T LOGGED IN ALLOW TO HOVER OVER LIKE AND STAR
    //ALERT THAT THEY MUST LOG IN IN ORDER TO STAR OR LIKE
    if (reg == "Sign up"){
        allowHover("like");
        allowHover("star");
    //IF THEY HAVE LOGGED IN THEN CHECK IF THEY HAVE ALREADY GIVEN A LIKE/STAR TO THE PAPER 
    //IF NOT THEN ALLOW THEM TO LIKE/STAR IT IF THEY WISH TO
    } else {
        user = user.slice(user.indexOf("Welcome ")+ 8 ,user.length);
        //CHECK LIKE
        $.ajax({
            type: "GET",
            url: "/papers/does_like_exist/" + paperid + "/" + user,
            dataType: "JSON", // data type expected from server
            success: function () {
            },
            error: function() {
            }
        }).done(function(like){
            styleLike(like)
        });

        //CHECK STAR EXISTS
        $.ajax({
            type: "GET",
            url: "/papers/does_star_exist/" + paperid + "/" + user,
            dataType: "JSON", // data type expected from server
            success: function () {
            },
            error: function() {
            }
        }).done(function(star){
            styleStar(star)
        });

    }

    //IF LIKE DOES NOT EXIST, ALLOW HOVER OVER LIKE TO SHOW THIS
    //ALLOW USER TO LIKE THE PAPER TOO
    //HOWEVER IF LIKE DOES EXIST LET THEM KNOW THEY HAVE ALREADY LIKED IT
    function styleLike(like){
        if (like["Like"] == "Like does not exist"){
            allowHover("like");
            $(".container .paper_likes").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                    },
                    error: function(err) {
                    } 
                });
                location.reload();
            });

            $(".container #likes").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });
        } else {
            $(".container #likes").attr("src","../../../public/img/afterlike.png");
            $(".container .paper_likes").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/deletelike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });

            $(".container #likes").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/deletelike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });
        }
    }


    function styleStar(star){
        if (star["Star"] == "Star does not exist"){
            allowHover("star");
            $(".container .paper_stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/addstar/" + committee + "/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/afterstar.svg");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });

            $(".container #stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/addstar/" + committee + "/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/afterstar.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });

        } else {
            $(".container #stars").attr("src","../../../public/img/afterstar.png");
            $(".container .paper_stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/deletestar/" + committee + "/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/beforestar.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });
            $(".container #stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "/papers/deletestar/" + committee + "/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/beforestar.png");
                    },
                    error: function(err) {
                    }
                });
                location.reload();
            });
        }
    }
    // ================================================================
    // ADD PAPER DATA AND STYLE
    // ================================================================

    function addToPage(data){
        //Get all components from db
        paper_title = data["Data"][0]["paper_title"];
        paper_description = data["Data"][0]["paper_description"];
        paper_authors = data["Data"][0]["paper_authors"];
        paper_pdf = data["Data"][0]["paper_pdf"];
        paper_type = data["Data"][0]["paper_type"];
        //paper_comments = data["Data"][0]["paper_comments"];
        paper_likes = data["Data"][0]["paper_likes"];
        paper_likes= "";
        //paper_stars = data["Data"][0]["paper_stars"];
        paper_stars = "";

        //ADD VALUES TO INNER HTML OF THE SELECTED ELEMENTS
        $(".paper_title").html(paper_title);
        $(".paper_title").css({"font-family":"Arial","font-size":"2em","margin-left":"5%","color":"rgb(62, 163, 63)"});
        $(".paper_description").html(paper_description);
        $(".paper_description").css({"font-family":"Arial","font-size":"1.1em","margin-left":"5%","margin-right":"10%","font-weight":"lighter"});
        $(".paper_type").html("Type: " + paper_type);
        $(".paper_type").css({"font-family":"Arial","font-size":"1em","margin-left":"5%","font-weight":"lighter"});
        $(".paper_authors").html("Authors: "+ paper_authors);
        $(".paper_authors").css({"font-family":"Arial","font-size":"1.2em","margin-left":"5%","font-weight":"lighter"});
        $(".paper_pdf").html(paper_pdf);
        $(".paper_pdf").attr("href",paper_pdf);
        $(".paper_pdf").css({"font-family":"Arial","margin-left":"5%"});

        //AJAX TO GET NUMBER OF LIKES AND STARS PAPER HAS
        var total_likes;
        $.ajax({
            type: "GET",
            url: "/papers/number_of_stars/" + paperid,
            dataType: "JSON", // data type expected from server
            success: function () {
            },
            error: function() {
                console.log('Error:');
            }
        }).done(function(paper_data){
            //Call function to add paper returned to page
            total_likes = paper_data["Data"][0]["total"];
            type_of = "Stars";
            addLikesStars(type_of, total_likes);
        });

        //AJAX TO GET NUMBER OF LIKES AND STARS PAPER HAS
        var total_stars;
        $.ajax({
            type: "GET",
            url: "/papers/number_of_likes/" + paperid,
            dataType: "JSON", // data type expected from server
            success: function () {
        },
        error: function() {
            console.log('Error:');
        }
        }).done(function(paper_data){
            //Call function to add paper returned to page
            total_stars = paper_data["Data"][0]["total"];
            type_of = "Likes";
            addLikesStars(type_of, total_stars);
        });


        $(".paper_Likes_sum").css({"font-family":"Arial","font-size":"1.2em","margin-left":"5%","font-weight":"lighter","border-bottom":"6px solid lightblue", "background-color":"whitesmoke", "width": "100px","height": "35px", "text-align":"center", "font-weight":"bold"});
        $(".paper_Stars_sum").css({"font-family":"Arial","font-size":"1.2em","margin-left":"5%","font-weight":"lighter","border-bottom":"6px solid #F0E68C", "background-color":"whitesmoke", "width": "100px","height": "35px", "text-align":"center", "font-weight":"bold"});
        $(".paper_likes").html(total_likes);
        //ADD CSS to position the elements
        $(".paper_likes").css({"position":"absolute","top":"50%","left":"50%", "transform":"translate(-50%,-50%)"});
        $(".paper_likes").css("font-family","Arial");
        $(".container").css({"position":"relative", "text-align":"center","color":"black"});    

    }

    function addLikesStars(type_of, total) {
        $(".paper_" + type_of + "_sum").html(" " + type_of + ": " + total);
    }

    // ================================================================
    // ADD USER AND COMMITTEE COMMENTS
    // ================================================================


    function addCommentsTable(comments, comment_count, type){
        //  Create table in specified division
        var myTableDiv = document.getElementById("paper_comments_table_" + type);
        var table = document.createElement("TABLE");
        table.style.width = "70%";
        //table.style.border ="ridge";
        table.style.marginLeft = "5%";
        var tableHead = document.createElement("THEAD");
        var tr = document.createElement("TR");
        tableHead.appendChild(tr);

        //Add table body
        var tableBody = document.createElement("TBODY");
        table.appendChild(tableBody);

        row_count = 0;

        while (row_count != comment_count) {
            
            //Create ROW
            var row = document.createElement("TR");
            tableBody.appendChild(row);
            
            //Add PAPER TITLE to ROW
            var td1 = document.createElement('TD');
            td1.style.borderBottom = "1px solid grey";
            td1.style.width = "50%";
            //td1.style.border = "1px solid #ddd";
            //Add paper title to column 1 in row

            //Link TITLE to PDF
            var p = document.createElement("P");
            //TITLE from query -> JSON obj
            paper_comment = comments["Data"][row_count]["paper_comments"];
            p.appendChild(document.createTextNode(paper_comment));
            p.style.fontWeight = "lighter";
            p.style.fontFamily = "Arial";
            p.style.fontSize = ".8em";
            td1.appendChild(p);

            comment_id = comments["Data"][row_count]["comment_id"];
            committee_id = comments["Data"][row_count]["committee_id"];
            username = comments["Data"][row_count]["username"];
            
            if (type == "committee") {

                $.ajax({
                    type: "GET",
                    url: "/papers/get_author_reply/" + comment_id,
                    dataType: "JSON", // data type expected from server
                    success: function (data) {
                        //IF REPLY EXISTS THEN SHOW IT
                        if (data["Data"]!="No data Found..") {
                    
                            var row2 = document.createElement("TR");
                            tableBody.appendChild(row2);
                
                            //Add AUTHORS REPLY TO COMMITTEE COMMENT
                            var td2 = document.createElement('TD');
                            //td2.style.border = "1px solid #ddd";
                            var p = document.createElement("P");
                            p.style.fontFamily = "Arial";
                            p.style.fontWeight = "lighter";
                            p.style.fontSize = ".7em";
                            p.style.color = "grey";
                            p.style.marginLeft = "30px";
                            p.appendChild(document.createTextNode(data["Data"][0]["username"] + "'s reply to committee"));
                            td2.appendChild(p);
                            var i2 = document.createElement("I");
                            i2.appendChild(document.createTextNode(data["Data"][0]["reply"]));
                            i2.style.fontWeight = "lighter";
                            i2.style.fontFamily = "Arial";
                            i2.style.marginLeft = "30px";
                            i2.style.fontSize = ".8em";
                            td2.appendChild(i2);
                        tableBody.appendChild(td2);
                        }
                    },
                    error: function(err) {
                    }
                });
            } else {
                var i = document.createElement("I");
                i.appendChild(document.createTextNode(username));
                //ADD LINK TO THEIR USER PAGE

                i.style.fontSize = ".7em";
                i.style.fontWeight = "bold";
                td1.appendChild(i);
            }

            user_type = $("#user_type").html();
            //If user is admin type 3 allow to delete user comments
            if ((user_type==3 || user_type==4) && type=="user"){
                //Link TITLE to PDF
                var del_button = document.createElement("input");
                del_button.type = "button";
                del_button.value = "DELETE";
                del_button.id = "delete_comment";
                del_button.style.marginLeft = "20px";
                del_button.style.marginTop = "10px";
                del_button.style.height = "40px";
                del_button.style.fontFamily = "Arial";
                del_button.style.backgroundColor = "red";
                del_button.style.color = "white";
                del_button.onclick = function(){
                    if (confirm("Press OK to confirm delete")) {
                        $.ajax({
                            type: "POST",
                            url: "/papers/deleteusercomment/" + paperid + "/" + comment_id,
                            dataType: "JSON", // data type expected from server
                            success: function () {
                            },
                            error: function(err) {
                            }
                        });
                        location.reload();
                    }
                };

                td1.appendChild(del_button);

            //If user is admin type 4 allow to delete committee comments
            } else if (user_type==4 && type=="committee") {
                //Link TITLE to PDF
                var del_button = document.createElement("input");
                del_button.type = "button";
                del_button.value = "DELETE";
                del_button.id = "delete_comment";
                del_button.style.fontFamily = "Arial";
                del_button.style.marginLeft = "20px";
                del_button.style.marginTop = "10px";
                del_button.style.height = "40px";
                del_button.style.backgroundColor = "red";
                del_button.style.color = "white";
                del_button.onclick = function(){
                    if (confirm("Press OK to confirm delete")) {
                        $.ajax({
                            type: "POST",
                            url: "/papers/deletecommitteecomment/" + paperid + "/" + comment_id,
                            dataType: "JSON", // data type expected from server
                            success: function () {
                            },
                            error: function(err) {
                            }
                        });
                        location.reload();
                    }
                }
                td1.appendChild(del_button);

            //If user is an author
            } else if (user_type==2 && type=="committee"){
                //Link TITLE to PDF
                var reply_button = document.createElement("input");
                reply_button.type = "button";
                reply_button.value = "REPLY";
                reply_button.style.fontFamily = "Arial";
                reply_button.id = "reply_comment";
                reply_button.style.marginLeft = "20px";
                reply_button.style.marginTop = "10px";
                reply_button.style.height = "40px";
                reply_button.style.backgroundColor = "lightgrey";
                reply_button.style.color = "black";

                reply_button.onclick = function(){
                    var reply = prompt("Please enter your reply:");
                    if (reply != null || reply != "") {
                        if (confirm("Please confirm you would like to send this reply")) {
                            $.ajax({
                                type: "POST",
                                url: "/papers/author_reply/" + paperid + "/" + username + "/" + comment_id + "/" + reply,
                                dataType: "JSON", // data type expected from server
                                success: function () {
                                },
                                error: function(err) {
                                }
                            });
                            location.reload();
                        }
                    }
                }
                td1.appendChild(reply_button);
            }
            
            tableBody.appendChild(td1);

            //Next row
            row_count = row_count + 1;

        }
        
        myTableDiv.appendChild(table);
    }
    

});