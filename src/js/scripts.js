// Current Application instance
var app = new function() {
    // Selected column WebId
    this.Column = '';
}

// Get column cache key name(required selected column)
function getColumnCacheKey(){
	if (isEmpty(app.Column)){ return ''; }
	return app.Column + '-info';
};
	
// Get articles cache key name(required selected column)
function getArticlesCacheKey() {
	if (isEmpty(app.Column)){ return ''; }
	return app.Column + '-articles';
};

// Get latest articles cache key
function getLatestCacheKey(){
    return 'latest';
}

// Column API url
var columnUrl = function(name) {
    return apiUrl + 'Columns/'+ name + '.json?apikey=' + apiKey;
}

// Column latest articles API url
var articleLatestUrl = function(column) {
    // TODO: Missing .json extension, server side app has routing problem
    return  apiUrl + 'ColumnArticles/'+ column + '.json?apikey=' + apiKey + '&limit=10&skip=0&startts=0&endts=0';
}

// Get latest articles
var latestArticlesUrl = function(){
    // TODO: Missing .json extension, server side app has routing problem
    return  apiUrl + 'Articles.json?apikey=' + apiKey + '&limit=5&skip=0&startts=0&endts=0';
}

// Get article image
var getArticleImage = function(article){
	return '<img class="framed" src="http://img8.hvg.hu/image.aspx?id='+article.DefaultImageId+'&amp;view=a7ce225f-67ef-4b6d-b77d-59581e02f304" align="left">';
}

// Get article image(latest)
var getArticleImageListView = function(article){
	return '<img src="http://img8.hvg.hu/image.aspx?id='+article.DefaultImageId+'&amp;view='+imageViews.List+'">';
}

// Get article url link
var getArticleUrl = function(article, content){
	var ret = '<a href="#cikk" data-url="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" data-transition="pop" title="' + article.Caption + '">' + content + '</a>'
	return ret;
} 

// Custom bind to page before create
$(document).bind( "pagebeforecreate", function() {
    var url = latestArticlesUrl();

    // get data
    $.getJSON(url, function() {	console.log('success'); })
        .done(function(data) { renderLatest(data); })
        .fail(function() { console.log('error'); })
        .always(function() { console.log('complete'); });
});

// Custom bind to open "Világ" column button
$('#btn-vilag').bind('click', function(event, ui) {
    app.Column = 'vilag';
    loadColumn();
});

// Custom bind to open "Tudomány" column button
$('#btn-tudomany').bind('click', function(event, ui) {
    app.Column = 'tudomany';
    loadColumn();
});

// Custom bind to 'rovat' Back bind
$('#rovat a[name=back]').bind('click', function(event, ui){
   app.Column = '';
});

// Custom bind to article on click
function bindingArticleClick(){
	$('#rovat .content a').bind('click', function(event, ui){
		var url = this.dataset.url;
		document.getElementById("article-content").src = url;
	});
}

// Render latest article
function renderLatest(data){
    var ret = '';
    $.each(data.Data, function(index, item) {
		var content = '';
		if (!isEmpty(item.DefaultImageId)){
			content = content + getArticleImageListView(item);
		}
		content = content + '<h3>'+ item.Caption +'</h3>' + '<p>' + item.Lead + '</p>';
		content = content + '<p class= "ui-li-aside"><strong>' + localTime(item.ReleaseDate) +'</strong></p>';
		content = '<li>' + getArticleUrl(item, content) + '</li>';
		
		ret = ret + content;
    });

    $('#base #latest').html(ret);
	$('#base #latest').listview('refresh');
}

// Render article body
// TODO: Make a handlebarsjs remplate
function renderArticle(article){
	var caption = '<h3>' + getArticleUrl(article, article.Caption) + '</h3>';
	var image = '';
	if (!isEmpty(article.DefaultImageId)){
		var i = getArticleImage(article);
		image = getArticleUrl(article, i);
	}
		
	var lead = '<p>'+article.Lead+'</p>';
	var info = '<p class="columnarticleinfo">'
				+ '<img class="transparent" src="http://img5.hvg.hu/static/skins/default/img/new-icons/time.png" alt="ido">'+ localDateTime(article.ReleaseDate) 
				+ getArticleUrl(article, '<img class="transparent" alt="szerzo" src="http://img9.hvg.hu/static/skins/default/img/new-icons/author.png">MTI')
				+ '</p>';

	var ret = '<div class="article">'+ caption + image + lead + info + '</div>';
	return ret;
}

// Load column latest article data to page
function loadColumnLatestContent(data){
	if (isEmpty(data.Data)){
		console.log('empty data');
		return;
	}

	var columnContent = $('#rovat .content');
	var articles = '';
	$.each(data.Data, function(index, item) {
		articles = articles + renderArticle(item);
	});
	columnContent.html(articles);
	
	bindingArticleClick();
	
    // save to storage
	Storage.setItem(getArticlesCacheKey(), JSON.stringify(data));
}

// Load column latest data
function loadColumnLatest(column){
	var url = articleLatestUrl(column);

	// load from cache
	if (Storage.isEnabled){
		var cache = Storage.getItem(getArticlesCacheKey());
		if (!isEmpty(cache)){
			loadColumnLatestContent(JSON.parse(cache));
		}
	}

    // get data
	$.getJSON(url, function() { console.log('success'); })
	.done(function(data) { loadColumnLatestContent(data); })
	.fail(function() { console.log('error'); })
	.always(function() { console.log('complete'); });
}

// Load column data to page
function loadColumnContent(data){
    $('#rovat h1').text(data.Name);
	
	// save to storage
	Storage.setItem(getColumnCacheKey(), JSON.stringify(data));
}

// Load column data
function loadColumn() {
	var url = columnUrl(app.Column);

    // load from cache
    if (Storage.isEnabled){
        var cache = Storage.getItem(getColumnCacheKey());
        if (!isEmpty(cache)){
            loadColumnContent(JSON.parse(cache));
        }
    }

    // get data
	$.getJSON(url, function() {	console.log('success'); })
	.done(function(data) { loadColumnContent(data); loadColumnLatest(data.WebId); })
	.fail(function() { console.log('error'); })
	.always(function() { console.log('complete'); });
}