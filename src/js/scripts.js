// Column API url
var columnUrl = function(name) { return apiUrl + 'Columns/'+ name + '.json?apikey=' + apiKey; }

// Column latest articles API url
var articleLatestUrl = function(column) { return  apiUrl + 'ColumnArticles/'+ column + '.json?apikey=' + apiKey + '&limit=10&skip=0&startts=0&endts=0'; }

// Custom bind to popup button
$('#btn-popup').bind('click', function(event, ui) {
  $('#api-url').html(apiUrl);
});

// Custom bind to open "Világ" column button
$('#btn-rovat').bind('click', function(event, ui) {
  loadColumn('vilag');
});

// Render article body
// TODO: Make a handlebarsjs remplate
function renderArticle(article){
	var caption = '<h3><a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" data-transition="pop" title="' + article.Caption + '">' + article.Caption + '</a></h3>';
	var image = '';
	if (article.DefaultImageId != '00000000-0000-0000-0000-000000000000'){
		image = '<a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" data-transition="pop" title="' + article.Caption + '">'
				+ '<img class="framed" src="http://img8.hvg.hu/image.aspx?id='+article.DefaultImageId+'&amp;view=a7ce225f-67ef-4b6d-b77d-59581e02f304" align="left">'
				+ '</a>';
	}
		
	var lead = '<p>'+article.Lead+'</p>';
	var info = '<p class="columnarticleinfo">'
				+ '<img class="transparent" src="http://img5.hvg.hu/static/skins/default/img/new-icons/time.png" alt="ido">'+ localDateTime(article.ReleaseDate) 
				+ '<a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" data-transition="pop" title="' + article.Caption + '"><img class="transparent" alt="szerzo" src="http://img9.hvg.hu/static/skins/default/img/new-icons/author.png">MTI</a>'
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
	
    // save to storage
	Storage.setItem('vilag',JSON.stringify(data));
}

// Load column latest data
function loadColumnLatest(column){
	var url = articleLatestUrl(column);

	// load from cache
	if (Storage.isEnabled){
		var cache = Storage.getItem('vilag');
		if (!isEmpty(cache)){
			loadColumnLatestContent(JSON.parse(cache));
		}
	}

    // get data
	$.getJSON(url, function() { console.log( "success" ); })
	.done(function(data) { loadColumnLatestContent(data); })
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "complete" ); });
}

// Load column data to page
function loadColumnContent(data){
    $('#rovat h1').text(data.Name);
}

// Load column data
function loadColumn(name) {
	var url = columnUrl(name);

    // load from cache
    if (Storage.isEnabled){
        var cache = Storage.getItem('vilag-rovat');
        if (!isEmpty(cache)){
            loadColumnContent(JSON.parse(cache));
        }
    }

    // get data
	$.getJSON(url, function() {	console.log( "success" ); })
	.done(function(data) { loadColumnContent(data); loadColumnLatest(data.WebId); })
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "complete" ); });
}