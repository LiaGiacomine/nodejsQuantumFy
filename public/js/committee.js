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
        url: "http://localhost:3000/committee_data",
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
            committee = data["Data"][i]["committee"];
            a.href = "http://localhost:3000/committee/individual/" + committee;
            topic_text = document.createTextNode(committee);
            li.appendChild(topic_text);
            a.appendChild(li);
            committee_list.appendChild(a);
        }



    


    }

});