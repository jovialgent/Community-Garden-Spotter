$(function(){
    $('#report').hide();
    $('body').keypress(function(evt){
        console.log(evt.which);
        var showFilterNavigator = {
            left : "0"

        };

        var openFilterNavigator = {
            left : "120px"
        }
        
        var hideFilterNavigator = {
            left : "-120px"

        };

        var closeFilterNavigator = {
            left : "0"
        }

        //By pressing 'o', this will open the filter navigator
        //window.
        if(evt.which === 111 ){
            $('#mapDiv').animate(openFilterNavigator);
            $('#titleBar').animate(openFilterNavigator);
            $('#filterNavigator').animate(showFilterNavigator);

        }
        
        //By pressing 'w', this will close the filter navigator
        //window.
        if(evt.which === 119){
            $('#mapDiv').animate(closeFilterNavigator);
            $('#titleBar').animate(closeFilterNavigator);
            $('#filterNavigator').animate(hideFilterNavigator);

        }
    });
});
