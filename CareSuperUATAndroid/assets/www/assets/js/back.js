// Back button - BEGINS

$(document).ready(function(){


    if((window.history.length == 1) || (window.location.href.match("secure$"))){
        $(".urlBack").hide();
    }
    else{ 
        $(".urlBack").show();
    }

    $(".urlBack").on('click', function(){
        window.history.back(-1);
    });

	});



// Back button - ENDS

