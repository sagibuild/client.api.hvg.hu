// NOTE: this file don't contain jquery or another javascript framework function

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
	if (value == null || value == undefined || value == 'undefined' || value.length == 0){
		return true;
	}
	
	return false;
}

// Datetime helper
function localDateTime(input){
	return input.replace("T"," ").replace(/-/g,'. ');
}