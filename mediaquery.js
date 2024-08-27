function resize(){
    if($(window).width()>1200){
        $(".brand").addClass("fs-4").removeClass("fs-5 fs-6")
        $(".nav-link").addClass("fs-6").addClass("text-center")
        }
    else if($(window).width()>990){
        $(".brand").removeClass("fs-4 fs-6").addClass("fs-5")
        $(".nav-link").removeClass("fs-6").addClass("text-center")
        }
    else if($(window).width()>500){
        $(".brand").removeClass("fs-4 fs-6").addClass("fs-5")
        $(".nav-link").removeClass("fs-6 text-center")
    }else{
        $(".brand").removeClass("fs-4 fs-5").addClass("fs-6")
        $(".nav-link").removeClass("fs-6 text-center")
    }
}
$(document).ready(function(){
    resize()
})

$( window ).on( "resize", function() {
    resize()
})