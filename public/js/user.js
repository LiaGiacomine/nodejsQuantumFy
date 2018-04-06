/*
Makes Ajax call to script which connects with db to
return the specified paper along with all of its information

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //GET USERNAME TO THEN EXTRACT MORE INFORMATION
    welcome_user = $("#welcome_user").html(); 
    username = welcome_user.slice(8, welcome_user.length);

    //GET PAPERS THIS USER HAS LIKED
    $.ajax({
        type: "GET",
        url: "/paper/likes/by/" + username,
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Call function to add paper returned to page
            like_count = Object.keys(data["Data"]).length;
            if (data["Data"] != "Like does not exist") {
                addLikes(data, like_count);
            }
        },
        error: function() {
            console.log('Error:');
        }
    });

    //GET PAPERS THIS USER HAS GIVEN A STAR TO, IF IS A COMMITTEE MEMBER
    if ($("#committee").html() != null) {
        $.ajax({
            type: "GET",
            url: "/paper/stars/by/" + username,
            dataType: "JSON", // data type expected from server
            success: function (data) {
                //Call function to add paper returned to page
                star_count = Object.keys(data["Data"]).length;
                if (data["Data"] != "Star does not exist") {
                    addStars(data, star_count);
                }
            },
            error: function() {
                console.log('Error:');
            }
        });
            //GET PAPERS THIS USER HAS COMMENTED ON
        $.ajax({
            type: "GET",
            url: "/paper/committee/comments/by/" + username,
            dataType: "JSON", // data type expected from server
            success: function (data) {
                //Call function to add paper returned to page
                comment_count = Object.keys(data["Data"]).length;
                if (data["Data"] != "Comment does not exist") {
                    addComments(data, comment_count);
                }
            },
            error: function() {
                console.log('Error:');
            }
        });
    }

    //GET PAPERS THIS USER HAS COMMENTED ON
    $.ajax({
        type: "GET",
        url: "/paper/user/comments/by/" + username,
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Call function to add paper returned to page
            comment_count = Object.keys(data["Data"]).length;
            if (data["Data"] != "Comment does not exist") {
                addComments(data, comment_count);
            }
        },
        error: function() {
            console.log('Error:');
        }
    });

    // LINK TO PAPERS USER HAS GIVEN A LIKE TO
    function addLikes(data, like_count){

        likes_div = document.getElementById("likes_by_user");

        var p = document.createElement("p");
        topic_title = document.createTextNode("You have liked the following papers:");
        p.style.fontFamily = "Arial";
        p.style.textDecoration = "underline";
        p.style.marginLeft = "15px";
        p.appendChild(topic_title);
        likes_div.appendChild(p);

        for (i=0; i < like_count;i++) {
            //GET DATA ON EACH INDIVIDUAL PAPER, THUS TITLE, LINK..
            $.ajax({
                type: "GET",
                url: "/papers/get_individual_data/" + data["Data"][i]["paper_id"],
                dataType: "JSON", // data type expected from server
                success: function () {
            },
            error: function() {
                console.log('Error:');
                }
            }).done(function(data){
                addPaperLikeToPage(data);
            });

        function addPaperLikeToPage(data){

            //ADD PAPER TITLE TO LIKE SECTION
            var a = document.createElement("A");
            var br = document.createElement("BR");
            a.href = "/papers/individual/" + data["Data"][0]["paper_id"];
            a.style.marginLeft = "15px";
            a.style.textDecoration = "none";
            a.style.color = "green";
            paper_title = data["Data"][0]["paper_title"];
            topic_text = document.createTextNode(paper_title);
            a.appendChild(topic_text);
            likes_div.appendChild(a);
            likes_div.appendChild(br);
        }

        }
    }

     // LINK TO PAPERS USER HAS GIVEN A STAR TO
    function addStars(data, star_count){
        
        stars_div = document.getElementById("stars_by_user");
        
        var p = document.createElement("p");
        p.style.fontFamily = "Arial";
        p.style.textDecoration = "underline";
        p.style.marginLeft = "15px";
        topic_title = document.createTextNode("You have given a star to the following papers:");
        p.appendChild(topic_title);
        stars_div.appendChild(p);

        for (i=0; i < star_count;i++) {
            //GET DATA ON EACH INDIVIDUAL PAPER, THUS TITLE, LINK..
            $.ajax({
                type: "GET",
                url: "/papers/get_individual_data/" + data["Data"][i]["paper_id"],
                dataType: "JSON", // data type expected from server
                success: function () {
            },
            error: function() {
                console.log('Error:');
                }
            }).done(function(data){
                addPaperStarToPage(data);
            });

        function addPaperStarToPage(data){

            //ADD PAPER TITLE TO LIKE SECTION
            var a = document.createElement("A");
            var br = document.createElement("BR");
            a.href = "/papers/individual/" + data["Data"][0]["paper_id"];
            a.style.marginLeft = "15px";
            a.style.textDecoration = "none";
            a.style.color = "green";
            paper_title = data["Data"][0]["paper_title"];
            topic_text = document.createTextNode(paper_title);
            a.appendChild(topic_text);
            a.appendChild(br);
            stars_div.appendChild(a);
        }

        }
    }


    // LINK TO PAPERS USER HAS COMMENTED ON
    function addComments(data, comment_count){
        comments_div = document.getElementById("comments_by_user");
        var p = document.createElement("p");
        p.style.fontFamily = "Arial";
        p.style.textDecoration = "underline";
        p.style.marginLeft = "15px";
        topic_title = document.createTextNode("You have commented on the following papers:");
        p.appendChild(topic_title);
        comments_div.appendChild(p);

        paper_id_list = [];

        for (i=0; i < comment_count;i++) {
            //GET DATA ON EACH INDIVIDUAL PAPER, THUS TITLE, LINK..
            paper_id = data["Data"][i]["paper_id"];
            //If the user has commented twice, do not show the paper twice
            if (paper_id_list.indexOf(paper_id) == -1) { 
                $.ajax({
                    type: "GET",
                    url: "/papers/get_individual_data/" + paper_id,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                },
                error: function() {
                    console.log('Error:');
                    }
                }).done(function(data){
                    addPaperCommentToPage(data);
                });
                //Add the paper_id to the list in order to check for occurrence > 1
                paper_id_list += paper_id;

                function addPaperCommentToPage(data){

                    //ADD PAPER TITLE TO LIKE SECTION
                    var a = document.createElement("A");
                    var br = document.createElement("BR");
                    a.href = "/papers/individual/" + data["Data"][0]["paper_id"];
                    a.style.marginLeft = "15px";
                    a.style.textDecoration = "none";
                    a.style.color = "green";
                    paper_title = data["Data"][0]["paper_title"];
                    topic_text = document.createTextNode(paper_title);
                    a.appendChild(topic_text);
                    comments_div.appendChild(br);
                    comments_div.appendChild(a);
                }
            }
        }
    }        

});