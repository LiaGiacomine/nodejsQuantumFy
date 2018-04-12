/*
Makes Ajax call to script which connects with db to
return all the papers in the database

Author: Liandra Giacomine
*/

//GET THE NUMBER OF PAPERS TO ADD TO THE TABLE THUS THE NUMBER OF ROWS
$(document).ready(function(){
    //GET PAPER ID

    var url = window.location.href;
    var end_of_str = url.length;
    var keyword = url.slice(url.indexOf("/search/") + 8, end_of_str);
    keyword = keyword.replace(/%20/g, " ");

    if (keyword == null) {
        $(".section_title").html("Please enter a valid input");
    } else {
        $.ajax({
            type: "GET",
            url: "/papers/paperdata/search/" + keyword,
            dataType: "JSON", // data type expected from server
            success: function (data) {
                //Get size of JSON object (number of papers)
                paper_count = Object.keys(data["Data"]).length;
                //Call function to create table with papers in data object
                if (data["Data"] != "Keyword not found") {
                    paperSearch(paper_count, data);
                    $(".section_title").html("Below are the papers containing \"" + keyword + "\"");
                } else {
                    $(".section_title").html("No papers with \"" + keyword + "\"");
                }
                //Syntax to get JSON objects:
            },
            error: function() {
                console.log('Error: ' + data);
            }
        });
    }


    function paperSearch(paper_count, data){

    //  Create table in specified division
    var myTableDiv = document.getElementById("paper_main_table");
    var table = document.createElement("TABLE");
    table.style.border ="ridge";
    table.style.marginTop ="40px";
    
    var tableHead = document.createElement("THEAD");
    var tr = document.createElement("TR");
    tableHead.appendChild(tr);

    //Create table headers

    //TITLE
    var th1 = document.createElement("TH");
    var th1data = document.createTextNode("Title");
    th1.appendChild(th1data);
    th1.style.paddingBottom = "12px";
    th1.style.paddingTop = "8px";
    th1.style.textAlign = "center";
    th1.style.backgroundColor = "#4CAF50";
    th1.style.color = "white";
    th1.style.fontSize = "1.5em";
    th1.style.fontFamily = "Arial";
    table.appendChild(th1);


    //Add table body
    var tableBody = document.createElement("TBODY");
    table.appendChild(tableBody);
    table.style.marginLeft = "10%";
    table.style.width = "80%";

    row_count = 0;


    while (row_count != paper_count) {
        
        //Create ROW
        var row = document.createElement("TR");
        tableBody.appendChild(row);
        
        //Add PAPER TITLE to ROW
        var td1 = document.createElement('TD');
        td1.style.border = "1px solid #ddd";
        td1.style.padding = "8px";
        //Link TITLE to PDF
        var a = document.createElement("A");
        td1.appendChild(a);
        var p1 = document.createElement("P");
        //TITLE from query -> JSON obj
        paper_title = data["Data"][row_count]["paper_title"];
        p1.appendChild(document.createTextNode(paper_title));
        p1.style.fontWeight = "bold";
        a.href = "/papers/individual/" + data["Data"][row_count]["paper_id"];
        a.style.color = "black";
        //a.style.textDecoration = "none";
        a.style.fontSize = "1.2em";
        a.appendChild(p1);
        
        //DESCRIPTION from query
        paper_description = data["Data"][row_count]["paper_description"];
        var p2 = document.createElement("P"); 
        p2.appendChild(document.createTextNode(paper_description));
        td1.appendChild(p2);
        
        //Add PAPER TITLE to ROW
        //Eventually make the like and star a page where you can see who
        //Has liked the paper
        // var p3 = document.createElement("P");
        // paper_likes = data["Data"][row_count]["paper_likes"];
        // paper_stars = data["Data"][row_count]["paper_stars"];
        // p3.appendChild(document.createTextNode("LIKES: " + paper_likes + " STARS: " + paper_stars));
        // td1.appendChild(p3);
        row.appendChild(td1);
        
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }


});