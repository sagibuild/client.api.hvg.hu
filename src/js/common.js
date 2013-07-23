// NOTE: this file don't contain jquery or another javascript framework function
// NOTE: this file don't contain application specific function

// Local Storage
var Storage = new function() {
	// Current browser has local storage feature
	this.isEnabled = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };
	
	// return an element from storage
	this.getItem = function(key){
		if (!this.isEnabled()){ return undefined; }
		return localStorage[key];
	};
	
	// set an element to storage
	this.setItem = function(key, value){
		if (!this.isEnabled()){ return; }
		localStorage[key] = value;
	};
	
	// remove an element from storage
	this.removeItem = function(key) {
		if (!this.isEnabled()){ return; }
		localStorage.removeItem(key);
	};
	
	// clear storage
	this.clear = function(){
		if (!this.isEnabled()){ return; }
		localStorage.clear(); 
	};
};

// Current value is empty
function isEmpty(value){
	if (value == null // NULL value
        || value == undefined // undefined
        || value == 'undefined' // undefined
        || value.length == 0 // Array is empty
        || value == '00000000-0000-0000-0000-000000000000') // Guid is empty
    {
		return true;
	}
	
	return false;
}

// Datetime helper
function localDateTime(timeStamp){
    var dt = new Date(timeStamp);
    return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
}