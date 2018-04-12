/*
    Adds blogs to page from database
    Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED
    var number_of_likes;
    var url = window.location.href;
    var end_of_str = url.length;
    committee_name_id = url.slice(url.indexOf("/individual_ranking/") + 20, end_of_str);
    committee_name = committee_name_id.slice(0, committee_name_id.indexOf("/"));
    committee_id = committee_name_id.slice(committee_name_id.indexOf("/")+1,committee_name_id.length);
    
    //Number of likes and stars paper has from ajax
    
    //GET RANKING OF PAPERS BY SPECIFIED COMMITTEE
    $.ajax({
        type: "GET",
        url: "/papers/committee_ranking/" + committee_id,
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function(err) {
            console.log('Error: ' + err);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            paper_count = Object.keys(data["Data"]).length;
            getRanking(data, paper_count);
        }
    });

    //ADD THIS TO THE PAGE
    function getRanking(data, paper_count){
     
        for (i=0;i<paper_count;i++){

            paper_id = data["Data"][i]["paper_id"];

            const number_of_stars = data["Data"][i]["total"];

            
            //AJAX TO GET NUMBER OF LIKES PAPER HAS
            $.ajax({
                type: "GET",
                url: "/papers/number_of_likes/" + paper_id,
                dataType: "JSON", // data type expected from server
                success: function () {
                }
            }).done(function(paper_likes){
                total_likes = paper_likes["Data"][0]["total"];
                number_of_likes = total_likes;
            });

            //GET DATA ON EACH INDIVIDUAL PAPER, THUS TITLE, LINK..
            $.ajax({
                type: "GET",
                url: "/papers/get_individual_data/" + paper_id,
                dataType: "JSON", // data type expected from server
                success: function (data) {
                },
                error: function() {
                    console.log('Error:');
                }
                }).done(function(data){
                    addPaperToPage(data, number_of_stars);
            });

        }
    }


    function addPaperToPage(data, stars){
        

        var committee_list = document.getElementById("committee_list");
        committee_list.style.borderLeft = "10px solid rgb(63, 228, 106)";
        committee_list.style.borderRight = "10px solid rgb(63, 228, 106)";
        var li = document.createElement("LI");
        var a = document.createElement("A");
        var br = document.createElement("BR");
        li.style.fontFamily = "arial";
        li.style.marginBottom = "30px";
        li.style.backgroundColor = "rgba(223, 223, 223, 0.25)";
        //li.style.backgroundColor = "rgba(63, 228, 106,0.1)";
        paper_title = data["Data"][0]["paper_title"];

        //ADD TITLE
        paper_title = data["Data"][0]["paper_title"];
        topic_text = document.createTextNode(paper_title);
        a.appendChild(topic_text);

        //Add paper LINK 
        a.href = "/papers/individual/" + data["Data"][0]["paper_id"];
        //a.style.textDecoration = "none";
        a.style.color = "black";
        li.appendChild(a);
        li.appendChild(br);

        //ADD NUMBER OF LIKES PAPER HAS
        var img_like = document.createElement("IMG");
        img_like.setAttribute("src","../../../public/img/afterlike.png");
        img_like.style.height = "20px";
        img_like.style.marginTop = "10px";
        li.appendChild(img_like);

        var b1 = document.createElement("B");
        b1.appendChild(document.createTextNode(number_of_likes));
        b1.style.marginRight = "20px";
        b1.style.marginLeft = "4px";
        li.appendChild(b1);

        //ADD NUMBER OF STARS PAPER HAS
        var img_star = document.createElement("IMG");
        img_star.setAttribute("src","../../../public/img/afterstar.png");
        img_star.style.height = "20px";
        img_like.style.marginTop = "10px";
        li.appendChild(img_star);

        var b2 = document.createElement("B");
        b2.appendChild(document.createTextNode(stars));
        b2.style.marginLeft = "4px";
        li.appendChild(b2);

        //ADD PDF LINK
        var a2 = document.createElement("A");
        a2.href= data["Data"][0]["paper_pdf"];
        var img_pdf = document.createElement("IMG");
        img_pdf.setAttribute("src","../../../public/img/pdf.png");
        img_pdf.style.height = "20px";
        img_pdf.style.marginLeft = "15px";
        img_pdf.style.marginTop = "10px";
        a2.appendChild(img_pdf);

        var b3 = document.createElement("B");
        b3.appendChild(document.createTextNode("PDF"));
        b3.style.marginLeft = "4px";
        b3.style.fontFamily = "arial";
        b3.style.fontSize = ".9em";
        li.appendChild(b3);

        a2.style.textDecoration = "none";
        a2.style.color = "black";
        a2.appendChild(b3);
        li.appendChild(a2);

        committee_list.appendChild(li);
       }

});