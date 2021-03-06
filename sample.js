var grid = [	[0,	0, 0, 0, 0, '1', 0, 0, 0, 0, 0,0,0],
				[0, 0, 0, 0, 0, '1', 0, '2', 0, '3', 0,0,0],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, '3', 0,0,'5'],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, '3', 0,0,'5'],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, '3', 0,0,'5'],
				[0, '6', '6', '6,4', '6', '6,1', '6', '6,2', '6', '6,3', '6','6','6,5'],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, '3', 0,0,'5'],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, '3', 0,0,0],
				['7', '7', '7', '7,4', '7', '7,1', 0, '2', 0, '3', 0,0,0],
				[0, 0, 0, '4', 0, '1', 0, '2', 0, 0, 0,0,0],
                [0, 0, 0, '4', 0, '1', 0, '2', 0, 0, 0,0,0],
                [0, 0, 0, '4', 0, '1', 0, '2', 0, 0, 0,0,0],
                [0, 0, 0, 0, 0, 0, 0, '2', 0, 0, 0,0,0]
			];

var clues = ["to apportion or distribute (something) in a new or different way; to earmark or designate (something) for a new or different purpose",
             "buried erosional or non-depositional surface separating two rock masses or strata of different agesm indicating that sediment deposition was not continous",
             "a fence or other abstacle that prevents movement or access",
             "defamiliarization",
             "relating to a firm, institution, or society",
             "the things and conditions around a person or thing",
             "lying dormant or hidden until circumstances are suitable for development or manifestation"
            ];

var answers = ["reallocation",
             "unconformity",
             "barriers",
             "ostranenie",
             "house",
             "surroundings",
             "latent"
            ];

//Draw grid
$.each(grid,function(i) {

    var row = $('<tr></tr>');

	$.each(this,function(j) {
        if (this == 0) {
        	$(row).append('<td class="square empty"></td>');  
        } else {
            var question_number = String(grid[i][j]).split(",");
            
            var starting_number = '';
            var question_number_span = '';
            
            for(var k = 0;k < question_number.length;k++) {
                var direction = get_direction(question_number[k]);
                var startpos = get_startpos(question_number[k],direction);
                
                if(direction == "horizontal" && startpos[0] == i && startpos[1] == j) {
                    starting_number += question_number[k]+",";               
                } else if(direction == "vertical" && startpos[0] == j && startpos[1] == i){
                    starting_number += question_number[k]+",";
                }              
                
            }
            if(starting_number != "") {
                question_number_span = '<span class="question_number">'+starting_number.replace(/(^,)|(,$)/g, "")+'</span>';   
            }
            
            $(row).append('<td class="letter-td">'+question_number_span+'<div class="square letter" data-number="'+this+'" contenteditable="true"></div></td>'); 
        }
    });
    $("#crossword-inner").append(row);
});

//Draw hints
var vertical_hints = $('<div id="vertical_hints"></div>');
var horizontal_hints = $('<div id="horizontal_hints"></div>');

$.each(clues,function(index) {
    
    var direction = get_direction(index+1);
    
    if(direction == "horizontal") {
        $(horizontal_hints).append('<div class="hint">'+(index+1)+'. '+clues[index]+'</hint>');
    } else if(direction == "vertical") {
    	$(vertical_hints).append('<div class="hint">'+(index+1)+'. '+clues[index]+'</hint>');
    }
});

$("#vertical_hints_container").append(vertical_hints);
$("#horizontal_hints_container").append(horizontal_hints);

$(".letter").keyup(function() {
    var this_text = $(this).text();
    if(this_text.length > 1){
    	$(this).text(this_text.slice(0,1));
    }
});

$(".letter").click(function() {
    document.execCommand('selectAll',false,null);
    
    $(".letter").removeClass("active");
    $(this).addClass("active");
    
    $(".hint").css("color","#468c4b");
    
    var question_numbers = String($(this).data("number")).split(",");
    
    $.each(question_numbers,function(){
        $("#hints .hint:nth-child("+this+")").css("color","red");
    });
});

$("#solve").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    $.each(question_numbers,function(){
        fillAnswer(this);
    });
});

$("#clear_all").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    $.each(question_numbers,function(){
        clearAnswer(this);
    });
});

$("#clue").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    showClue(question_numbers[0],$(".letter.active").parent().index(),$(".letter.active").parent().parent().index());
});

function get_direction(question_number){
    for(var i=0;i < grid.length;i++){
    	for(var j=0;j < grid[i].length;j++){
            if(String(grid[i][j]).indexOf(question_number) != -1){            
                if(grid[i+1][j] == question_number || grid[i-1][j] == question_number){
                    return "vertical";
                }

                if(grid[i][j+1] == question_number || grid[i][j-1] == question_number){
                    return "horizontal";
                }
            }
    	}
    }
}
    
function get_startpos(question_number,direction){
	if(direction == "horizontal"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){
                if(String(grid[i][j]).indexOf(question_number) != -1){            
                    return [i,j];
                }
            }
        }
    }
    
    else if(direction == "vertical"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){
                if(String(grid[j][i]).indexOf(question_number) != -1){            
                     return [i,j];
                }
            }
        }
    }
}
    
function fillAnswer(question_number){
    $("#crossword td div").css("color","#468c4b");
    
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    
    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#crossword tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text(answer_letters[i]);
        }
    	 
    } else if(direction == "vertical"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#crossword tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text(answer_letters[i]);
        }
    	 
    }
}

function clearAnswer(question_number){
    $("#crossword td div").css("color","#468c4b");
    
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    
    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#crossword tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text('');
        }
    	 
    } else if(direction == "vertical"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#crossword tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text('');
        }
    	 
    }
}

function showClue(question_number,i,j){
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    
    if(direction == "horizontal"){
        $("#crossword tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[i - startpos[1]]).css("color","#468c4b");
    } else if(direction == "vertical"){
        $("#crossword tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[j - startpos[1]]).css("color","#468c4b");
    }
}































