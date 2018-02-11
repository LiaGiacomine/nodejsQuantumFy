/*
    Adds blogs to page from database
    Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED
    var url = window.location.href;
    var end_of_str = url.length;
    committee_name_id = url.slice(url.indexOf("/individual_ranking/") + 20, end_of_str);
    committee_name = committee_name_id.slice(0, committee_name_id.indexOf("/"));
    committee_id = committee_name_id.slice(committee_name_id.indexOf("/")+1,committee_name_id.length);
    alert(committee_id);
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
            alert(paper_count);
            getRanking(data, paper_count);
        }
    });

    function getRanking(data, paper_count){
     
        for (i=0;i<paper_count;i++){
            paper_id = data["Data"][i]["paper_id"];
            
            $.ajax({
                type: "GET",
                url: "/papers/get_individual_data/" + paper_id,
                dataType: "JSON", // data type expected from server
                success: function (data) {
                    //Call function to add paper returned to page
                    addPaperToPage(data);
                },
                error: function() {
                    console.log('Error:');
                }
            });
        }
    }

    function addPaperToPage(data){
        
        var committee_list = document.getElementById("committee_list");
        var li = document.createElement("LI");
        var a = document.createElement("A");
        paper_title = data["Data"][0]["paper_title"];
        topic_text = document.createTextNode(paper_title);
        li.appendChild(topic_text);
        committee_list.appendChild(li);
       }

});