/*
Makes Ajax call to script which connects with db to
return the specified paper along with all of its information

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //GET PAPER ID
    var url = window.location.href;
    var end_of_str = url.length;
    paperid = url.slice(url.indexOf("/individual/") + 12, end_of_str);

    //GET DATA ABOUT PAPER BY USING PAPER ID FOR QUERY
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/papers/get_individual_data/" + paperid,
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

    //GET COMMENTS MADE ABOUT PAPER
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/papers/get_paper_comments/" + paperid,
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
            addCommentsToTable(data, comment_count);
        }
    });
    
     //ON HOVER CHANGE COLOUR OF LIKE or STAR TO INDICATE POSSIBILITY OF CLICK
    function allowHover(attr){
        var before_extension;
        var after_extension;
        if (attr == "like"){
            before_extension = "jpg";
            after_extension = "png";
        } else{
            before_extension = "svg";
            after_extension = "svg";
        }
        $(".container #" + attr + "s").mouseover(function(){
            $("#" + attr + "s").attr("src","../../../public/img/after" + attr + "." + after_extension);
        }).mouseleave(function(){
            $("#" + attr + "s").attr("src","../../../public/img/before" + attr + "." + before_extension);
        });
        $(".container .paper_" + attr).mouseover(function(){
            $("#" + attr + "s").attr("src","../../../public/img/after" + attr + "." + after_extension);
        }).mouseleave(function(){
            $("#" + attr + "s").attr("src","../../../public/img/before" + attr + "." + before_extension);
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
            url: "http://localhost:3000/papers/does_like_exist/" + paperid + "/" + user,
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
            url: "http://localhost:3000/papers/does_star_exist/" + paperid + "/" + user,
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
                    url: "http://localhost:3000/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                        location.reload();
                    },
                    error: function(err) {
                    }
                    
                });

            });

            $(".container #likes").click(function(){
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#likes").attr("src","../../../public/img/afterlike.png");
                        location.reload();
                    },
                    error: function(err) {
                    }
                });
            });
        } else {
            $(".container #likes").attr("src","../../../public/img/afterlike.png");
            $(".container .paper_likes").click(function(){
                alert("You have already liked this");
            });
            $(".container #likes").click(function(){
                alert("You have already liked this");
            });
        }
    }


    function styleStar(star){
        if (star["Star"] == "Star does not exist"){
            allowHover("star");
            $(".container .paper_stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/papers/addstar/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/afterstar.svg");
                        location.reload();
                    },
                    error: function(err) {
                    }
                    
                });
            });

            $(".container #stars").click(function(){
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/papers/addstar/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function () {
                        $("#stars").attr("src","../../../public/img/afterstar.svg");
                        location.reload();
                    },
                    error: function(err) {
                    }
                });
            });

        } else {
            $(".container #stars").attr("src","../../../public/img/afterstar.svg");
            $(".container .paper_stars").click(function(){
                alert("You have already given a star");
            });
            $(".container #stars").click(function(){
                alert("You have already given a star");
            });
        }
    }


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
        $(".paper_description").html(paper_description);
        $(".paper_type").html("Type: " + paper_type);
        $(".paper_authors").html("Authors: "+ paper_authors);
        $(".paper_pdf").html(paper_pdf);
        $(".paper_pdf").attr("href",paper_pdf);
        $(".paper_likes").html(paper_likes);
        //ADD CSS to position the elements
        $(".paper_likes").css({"position":"absolute","top":"50%","left":"50%", "transform":"translate(-50%,-50%)"});
        $(".container").css({"position":"relative", "text-align":"center","color":"black"});    

    }

    function addCommentsToTable(comments, comment_count){
        //  Create table in specified division
        var myTableDiv = document.getElementById("paper_comments_table");
        var table = document.createElement("TABLE");
        table.style.width = "100%";
        table.style.border ="ridge";

        var tableHead = document.createElement("THEAD");
        var tr = document.createElement("TR");
        tableHead.appendChild(tr);

        //Create table headers

        //COMMENT
        var th= document.createElement("TH");
        th.style.backgroundColor = "lightgrey";
        var thdata = document.createTextNode("Comments");
        th.appendChild(thdata);
        table.appendChild(th);

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
            td1.style.border = "1px solid #ddd";
            //Add paper title to column 1 in row

            //Link TITLE to PDF
            var p = document.createElement("P");
            //TITLE from query -> JSON obj
            paper_comment = comments["Data"][row_count]["paper_comments"];
            p.appendChild(document.createTextNode(paper_comment));
            p.style.fontWeight = "bold";
            td1.appendChild(p);

            //Link TITLE to PDF
            var i = document.createElement("I");
            username = comments["Data"][row_count]["username"];
            i.appendChild(document.createTextNode(username));
            i.style.fontWeight = "bold";
            td1.appendChild(i);

            tableBody.appendChild(td1);

            //Next row
            row_count = row_count + 1;

        }
        
        myTableDiv.appendChild(table);
    }
    

});