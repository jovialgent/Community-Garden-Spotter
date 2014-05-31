$(function(){
    var map =  $('#mapDiv');
    var titleBar = $('#titlebar');
    var filter = $('#filterNavigator');
    var report = $('#report');
    var helperWindow =  $('#helperWindow');
    var filterNavigatorWindowSize = "200px";

    var helperWindow = {
        openFilter :{
            headerText : "Let's start!",
            bodyText : "Click on the shovel to begin your community gardening."
        }
    }

    //Hide Windows
    $('#report').hide();
    $('#helperWindow').hide();


    //Hover
    $('#titlebar span img').hover(function(evt){
        var thisImg = $(this);
        //alert("WORKS?");
        thisImg.attr('src', '/assets/images/shovelGreenHover.png');

    },
                                  function(evt){
                                      var thisImg = $(this);
                                      thisImg.attr('src', '/assets/images/shovelGreen.png');
                                  }
                                 );

    //Keypresses
    $('body').keypress(function(evt){
        console.log(evt.which);

        var showFilterNavigator = {
            left : "0"

        };

        var openFilterNavigator = {
            left : filterNavigatorWindowSize
        }

        var hideFilterNavigator = {
            left : "-"+filterNavigatorWindowSize

        };

        var closeFilterNavigator = {
            left : "0"
        }

        var hideWindow = {
            effect : "slide",
            direction: "right"
        }

        var showWindow = {
            effect : "slide",
            direction: "left"
        }

        var mapVisible = $('#mapDiv').is(':visible');

        //By pressing 'o', this will open the filter navigator
        //window.
        if(evt.which === 111 && mapVisible){
            map.animate(openFilterNavigator);
            titleBar.animate(openFilterNavigator);
            filter.animate(showFilterNavigator);

        }

        //By pressing 'w', this will close the filter navigator
        //window.
        if(evt.which === 119 && mapVisible){
            map.animate(closeFilterNavigator);
            titleBar.animate(closeFilterNavigator);
            filter.animate(hideFilterNavigator);

        }

        //By pressing 'r', this will show the report.
        if(evt.which === 114 && mapVisible){
            map.hide(showWindow);
            titleBar.hide(showWindow);
            report.show(hideWindow);
        }

        //By pressing 'm', this will show the map
        if(evt.which === 109){
            map.show(showWindow);
            titleBar.show(showWindow);
            report.hide(hideWindow);

        }
    });

    //Helper Functions
    var buildHelpWindow = function(data){
        helperWindow.empty();
        var html = "";
        html += "<h1 class='helperWindowHeader'>"+data.headerText+"</h1>";
        html += "<p class='helperWindowText'>"+data.bodyText+"</p>";
        helperWindow.html(html);

    };


});
