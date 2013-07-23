// Protocol (http, https)
var protocol = 'https'

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