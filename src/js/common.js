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
		if (!this.isEnabled() || isEmpty(key)){ return undefined; }
		return localStorage[key];
	};
	
	// set an element to storage
	this.setItem = function(key, value){
		if (!this.isEnabled() || isEmpty(key)){ return; }
		localStorage[key] = value;
	};
	
	// remove an element from storage
	this.removeItem = function(key) {
		if (!this.isEnabled() || isEmpty(key)){ return; }
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
	return value == null // NULL value
        || value == undefined // undefined
        || value == 'undefined' // undefined
        || value.length == 0 // Array is empty
        || value == '00000000-0000-0000-0000-000000000000' // Guid empty
        ;
}

// Datetime helper
function localDateTime(timeStamp){
    var dt = new Date(timeStamp);
    return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
}

// Local time
function localTime(timeStamp){
    var dt = new Date(timeStamp);
    return dt.toLocaleTimeString();
}

// datetime padding (6 => 06)
Number.prototype.padLeft = function (base, chr) {
	var len = (String(base || 10).length - String(this).length) + 1;
	return len > 0 ? new Array(len).join(chr || '0') + this : this;
}