/*
Makes Ajax call to script which connects with db to
return the specified paper along with all of its information

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get the name of the paper that was clicked
    var url = window.location.href;
    var end_of_str = url.length;
    paperid = url.slice(url.indexOf("/individual/") + 12, end_of_str);

    //Set the form to add comment to db table equal to the paper id
    $("#comment_form").action = "/papers/addcomment/" + paperid;
    
    //Get comments for table from ajax call which will return
    //all the data about the paper to be outputted 
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
            console.log('Error: ' + paper_data);
        }
    });

    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED
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

    function addToPage(data){
        //Get all components from db
        paper_title = data["Data"][0]["paper_title"];
        paper_description = data["Data"][0]["paper_description"];
        paper_authors = data["Data"][0]["paper_authors"];
        paper_pdf = data["Data"][0]["paper_pdf"];
        paper_type = data["Data"][0]["paper_type"];
        paper_comments = data["Data"][0]["paper_comments"];
        paper_likes = data["Data"][0]["paper_likes"];
        paper_stars = data["Data"][0]["paper_stars"];

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
        //ON HOVER CHANGE THE IMAGE TO ENCOURAGE LIKE
        $(".container #likes").mouseover(function(){
            $("#likes").attr("src","../../../public/img/afterLike.png");
        }).mouseleave(function(){
            $("#likes").attr("src","../../../public/img/beforeLike.jpg");
        });
        $(".container .paper_likes").mouseover(function(){
            $("#likes").attr("src","../../../public/img/afterLike.png");
        }).mouseleave(function(){
            $("#likes").attr("src","../../../public/img/beforeLike.jpg");
        });
        $(".container").css({"position":"relative", "text-align":"center","color":"black"});
       
       
        //ON HOVER CHANGE THE IMAGE TO ENCOURAGE STAR
        $(".paper_stars").html(paper_stars);
        $(".container #stars").mouseover(function(){
            $("#stars").attr("src","../../../public/img/afterStar.svg");
        }).mouseleave(function(){
            $("#stars").attr("src","../../../public/img/beforeStar.svg");
        });
        $(".container .paper_stars").mouseover(function(){
            $("#stars").attr("src","../../../public/img/afterStar.svg");
        }).mouseleave(function(){
            $("#stars").attr("src","../../../public/img/beforeStar.svg");
        });
        $(".paper_stars").css({"position":"absolute","top":"50%","left":"50%", "transform":"translate(-50%,-50%)"});
        
         //ON CLICK, CHECK IF USER IS LOGGED IN, IF SO ALLOW LIKE
         $(".container .paper_likes").click(function(){
            var user = $("#top #welcome_user").html();
            //user = user.slice(user.indexOf("Welcome ")+ 8 ,user.length);
            var reg = $("#top #register i").html();

            if (reg != "Sign up"){
                user = user.slice(user.indexOf("Welcome ")+ 8 ,user.length);
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function (like_added) {
                    },
                    error: function() {
                        console.log('Error: ');
                    }
                });
            }
         });

         $(".container #likes").click(function(){
            var user = $("#top #welcome_user").html();
            //user = user.slice(user.indexOf("Welcome ")+ 8 ,user.length);
            var reg = $("#top #register i").html();
            
            if (reg != "Sign up"){
                user = user.slice(user.indexOf("Welcome ")+ 8 ,user.length);
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/papers/addlike/" + paperid + "/" + user,
                    dataType: "JSON", // data type expected from server
                    success: function (like_added) {
                    },
                    error: function() {
                        console.log('Error: ');
                    }
                });
            }
        });
    }

    function addCommentsToTable(comments, comment_count){
        //  Create table in specified division
        var myTableDiv = document.getElementById("paper_comments_table");
        var table = document.createElement("TABLE");
        table.style.border ="ridge";

        var tableHead = document.createElement("THEAD");
        var tr = document.createElement("TR");
        tableHead.appendChild(tr);

        //Create table headers

        //COMMENT
        var th1 = document.createElement("TH");
        var th1data = document.createTextNode("Comments");
        th1.appendChild(th1data);
        table.appendChild(th1);

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
            //Add paper title to column 1 in row

            //Link TITLE to PDF
            var p1 = document.createElement("P");
            //TITLE from query -> JSON obj
            paper_comment = comments["Data"][row_count]["paper_comments"];
            p1.appendChild(document.createTextNode(paper_comment));
            p1.style.fontWeight = "bold";
            td1.appendChild(p1);
            tableBody.appendChild(td1);

            //Next row
            row_count = row_count + 1;

        }
        
        myTableDiv.appendChild(table);
    }

});