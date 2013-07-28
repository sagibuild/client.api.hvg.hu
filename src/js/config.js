// Protocol (http, https)
var protocol = 'https';

// API base url
var baseUrl = 'api.hvg.hu';

// API version
var apiVersion = 'v1';

// Application version
var appVersion = 'AndroidApp';

// API Key(need load in client)
var apiKey = '';

// Return the API url
apiUrl = protocol + '://' + baseUrl + '/' + apiVersion + '/' + appVersion + '/';

// Site url
var siteUrl = 'm.hvg.hu/app';

// Program Identifier
var programId = 'Test client v 0.12';

// Get site column url
function siteColumnUrl(columnWebId){
	return 'http://' + siteUrl + '/' + columnWebId + '/';
}

// Get site article url
function siteArticleUrl(columnWebId, articleWebId){
	return siteColumnUrl(columnWebId) + articleWebId;
}

// Image views
var imageViews = new function(){
	// Cover type
	this.Cover = 'a70d3c70-9f98-4448-ab52-2d0428925f98'; 
	
	// Cover thumbnail
	this.CoverThumb = 'ecd0c21f-a404-4750-9e6e-c0e96b68575f';
	
	// List type
	this.List = '00156696-8854-4210-a0e4-bea4911c228c';
	
	// Leading
	this.Leading = 'c4219d90-6095-4b18-9d4c-616dce019189';
}