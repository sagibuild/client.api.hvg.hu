$('#btn-popup').bind('click', function(event, ui) {
  $('#api-url').html(apiUrl);
});

$('#btn-rovat').bind('click', function(event, ui) {
  loadColumn('vilag');
});

function renderArticle(article){
	var caption = '<h3><a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" title="' + article.Caption + '">' + article.Caption + '</a></h3>';
	var image = '';
	if (article.DefaultImageId != '00000000-0000-0000-0000-000000000000'){
		image = '<a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" title="' + article.Caption + '">'
				+ '<img class="framed" src="http://img8.hvg.hu/image.aspx?id='+article.DefaultImageId+'&amp;view=a7ce225f-67ef-4b6d-b77d-59581e02f304" align="left">'
				+ '</a>';
	}
		
	var lead = '<p>'+article.Lead+'</p>';
	var info = '<p class="columnarticleinfo">'
				+ '<img class="transparent" src="http://img5.hvg.hu/static/skins/default/img/new-icons/time.png" alt="ido">'+ localDateTime(article.ReleaseDate) 
				+ '<a href="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" title="' + article.Caption + '"><img class="transparent" alt="szerzo" src="http://img9.hvg.hu/static/skins/default/img/new-icons/author.png">MTI</a>'
				+ '</p>';

	var ret = '<div class="article">'+ caption + image + lead + info + '</div>';
	return ret;
}

function loadColumnLatestContent(data){
	if (isEmpty(data)){
		console.log('empty data');
		return;
	}
	
	var columnContent = $('#rovat .content');
	$.each(data, function(index, item) {
		columnContent.append(renderArticle(item));
	});
	
	Storage.setItem('vilag',JSON.stringify(data));
}

function loadColumnLatest(column){
	var url = apiUrl + 'ColumnArticles/'+ column + '.json?apikey=' + apiKey + '&limit=10&skip=0&startts=0&endts=0';  

	// load from cache
	if (Storage.isEnabled){
		var cache = Storage.getItem('vilag');
		if (!isEmpty(cache)){
			loadColumnLatestContent(JSON.parse(cache));
		}
	}

	$.getJSON(url, function() { console.log( "success" ); })
	.done(function(data) { loadColumnLatestContent(data); })
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "complete" ); });
}

function loadColumn(name) {
	var url = apiUrl + 'Columns/'+ name + '.json?apikey=' + apiKey;  
	$.getJSON(url, function() {
		console.log( "success" );
	})
	.done(function(data) { 
		$('#rovat h1').text(data.Name);
		loadColumnLatest(data.WebId);
		console.log( "second success" ); 
		})
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "complete" ); });
}