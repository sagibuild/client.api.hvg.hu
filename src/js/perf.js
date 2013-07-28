// Performance
var performance = new function(){

    // Get DOM element count
    this.getDOMCount = function() {
        return document.getElementsByTagName("*").length;
    };
};
