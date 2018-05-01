/*
    Adds blogs to page from database
    Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED
    $.ajax({
        type: "GET",
        url: "/committee_data",
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function(err) {
            console.log('Error: ' + err);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            committee_count = Object.keys(data["Data"]).length;
            addCommitteeToPage(data, committee_count);
        }
    });

    function addCommitteeToPage(data, committee_count){
     
        var committee_list = document.getElementById("committee_list");
        for (i=0;i<committee_count;i++){
            var li = document.createElement("LI");
            var a = document.createElement("A");
            li.style.fontSize = "1.3em";
            li.style.margin = "30px";
            li.style.textAlign = "center";
            li.style.marginLeft = "20%";
            li.style.marginRight = "30%";
            li.style.padding = "10px";
            li.style.listStyleType = "none";
            li.style.borderLeft = "20px solid green";
            li.style.backgroundColor = "lightgrey";
            a.style.textDecoration = "none";
            a.style.color = "black";
            a.style.fontSize = "1.1em";
            a.style.fontFamily = "Arial";
            committee = data["Data"][i]["committee"];
            id = data["Data"][i]["committee_id"];
            a.href = "/committee/individual_ranking/"+ committee.replace(" ","_") + "/" + id;
            topic_text = document.createTextNode(committee);
            li.appendChild(topic_text);
            a.appendChild(li);
            committee_list.appendChild(a);
        }



    


    }

});