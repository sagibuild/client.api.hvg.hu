// Current Application instance
var app = new function () {
    "use strict";

    // Selected column WebId
    this.Column = '';

    // Get column cache key name(required selected column)
    this.getColumnCacheKey = function () {
        if (isEmpty(this.Column)) {
            return '';
        }
        return this.Column + '-info';
    };

    // Get articles cache key name(required selected column)
    this.getArticlesCacheKey = function () {
        if (isEmpty(this.Column)) {
            return '';
        }
        return this.Column + '-articles';
    };

    // Get latest articles cache key
    this.getLatestCacheKey = function () {
        return 'latest';
    };
};

// Url class
var url = new function () {
    "use strict";

    // Column API url
    this.columnUrl = function (name) {
        return apiUrl + 'Columns/' + name + '.json?apikey=' + apiKey;
    };

    // Column latest articles API url
    this.articleLatestUrl = function (column) {
        // TODO: Missing .json extension, server side app has routing problem
        return  apiUrl + 'ColumnArticles/' + column + '?apikey=' + apiKey + '&limit=5&skip=0&startts=0&endts=0';
    };

    // Get latest articles
    this.latestArticlesUrl = function () {
        // TODO: Missing .json extension, server side app has routing problem
        return  apiUrl + 'Articles.json?apikey=' + apiKey + '&limit=5&skip=0&startts=1225535100&endts=1345939200';
    };
	
	// Get all columns
	this.columnsUrl = function(){
        return apiUrl + 'Columns.json?apikey=' + apiKey;		
	};

	// Get cover
	this.coverUrl = function () {
		return apiUrl + 'Cover.json?apikey=' + apiKey;
	};
};

// Page class
var page = new function () {
    "use strict";

    // START selectors

    this.btnVilag = $('#btn-vilag');

    this.btnTudomany = $('#btn-tudomany');

    // END selectors

	// START renderer
    
	// Get article image
    this.getArticleImage = function (article) {
        return '<img class="framed" src="http://img8.hvg.hu/image.aspx?id=' + article.DefaultImageId + '&amp;view=' + imageViews.Cover + '" align="left">';
    };

    // Get article image(latest)
    this.getArticleImageListView = function (article) {
        return '<img src="http://img8.hvg.hu/image.aspx?id=' + article.DefaultImageId + '&amp;view=' + imageViews.List + '">';
    };

    // Get article url link
    this.getArticleUrl = function (article, content) {
        return '<a href="#cikk" data-url="' + siteArticleUrl(article.Column.WebId, article.WebId) + '" data-transition="pop" title="' + article.Caption + '">' + content + '</a>';
    };

    // Render article body
    // TODO: Make a handlebarsjs remplate
    this.renderArticle = function (article) {
        var caption = '<h3>' + this.getArticleUrl(article, article.Caption) + '</h3>';
        var image = '';
        if (!isEmpty(article.DefaultImageId)) {
            var i = this.getArticleImage(article);
            image = this.getArticleUrl(article, i);
        }

        var lead = '<p>' + article.Lead + '</p>';
        var info = '<p class="columnarticleinfo">'
            + '<img class="transparent" src="http://img5.hvg.hu/static/skins/default/img/new-icons/time.png" alt="ido">' + localDateTime(article.ReleaseDate)
            + this.getArticleUrl(article, '<img class="transparent" alt="szerzo" src="http://img9.hvg.hu/static/skins/default/img/new-icons/author.png">MTI')
            + '</p>';

        return '<div class="article">' + caption + image + lead + info + '</div>';
    }

    // Render latest article
    this.renderLatest = function (article) {
        var content = '';
        if (!isEmpty(article.DefaultImageId)) {
            content = content + this.getArticleImageListView(article);
        }

        content = content + '<h3>' + article.Caption + '</h3>' + '<p>' + article.Lead + '</p>';
        content = content + '<p class= "ui-li-aside"><strong>' + localTime(article.ReleaseDate) + '</strong></p>';
        content = '<li>' + this.getArticleUrl(article, content) + '</li>';
        return content;
    }
	
	// END renderer
};

// Custom bind to page before create
$(document).bind("pagebeforecreate", function () {
    // TODO: add time cache
    // load from cache
    if (Storage.isEnabled) {
        var cache = Storage.getItem(app.getLatestCacheKey());
        if (!isEmpty(cache)) {
            //loadLatestContent(JSON.parse(cache));
        }
    }

    // get data
    $.getJSON(url.latestArticlesUrl(), function () {
        console.log('success');
    })
        .done(function (data) {
            loadLatestContent(data);
        })
        .fail(function () {
            console.log('error');
        })
        .always(function () {
            console.log('complete');
        });
});

// Custom bind to open "Világ" column button
page.btnVilag.bind('click', function (event, ui) {
    app.Column = 'vilag';
    loadColumn();
});

// Custom bind to open "Tudomány" column button
page.btnTudomany.bind('click', function (event, ui) {
    app.Column = 'tudomany';
    loadColumn();
});

// Custom bind to 'rovat' Back bind
$('#rovat a[name=back]').bind('click', function (event, ui) {
    app.Column = '';
});

// Custom bind to article on click
function bindingArticleClick() {
    $('#rovat .content a').bind('click', function (event, ui) {
        document.getElementById("article-content").src = this.dataset.url;
    });
}

// Load column latest article data to page
function loadLatestContent(data) {
    if (isEmpty(data.Data)) {
        console.log('empty data');
        return;
    }

    var articles = '';
    $.each(data.Data, function (index, item) {
        articles = articles + page.renderLatest(item);
    });

    $('#base #latest').html(articles);
    $('#base #latest').listview('refresh');

    // save to cache
    Storage.setItem(app.getLatestCacheKey(), JSON.stringify(data));
}

// Load column latest article data to page
function loadColumnLatestContent(data) {
    if (isEmpty(data.Data)) {
        console.log('empty data');
        return;
    }

    var columnContent = $('#rovat .content');
    var articles = '';
    $.each(data.Data, function (index, item) {
        articles = articles + page.renderArticle(item);
    });
    columnContent.html(articles);

    bindingArticleClick();

    // save to cache
    Storage.setItem(app.getArticlesCacheKey(), JSON.stringify(data));
}

// Load column latest data
function loadColumnLatest(column) {
    // load from cache
    if (Storage.isEnabled) {
        var cache = Storage.getItem(app.getArticlesCacheKey());
        if (!isEmpty(cache)) {
            loadColumnLatestContent(JSON.parse(cache));
        }
    }

    // get data
    $.getJSON(url.articleLatestUrl(column), function () {
        console.log('success');
    })
        .done(function (data) {
            loadColumnLatestContent(data);
        })
        .fail(function () {
            console.log('error');
        })
        .always(function () {
            console.log('complete');
        });
}

// Load column data to page
function loadColumnContent(data) {
    $('#rovat h1').text(data.Name);

    // save to cache
    Storage.setItem(app.getColumnCacheKey(), JSON.stringify(data));
}

// Load column data
function loadColumn() {
    // load from cache
    if (Storage.isEnabled) {
        var cache = Storage.getItem(app.getColumnCacheKey());
        if (!isEmpty(cache)) {
            loadColumnContent(JSON.parse(cache));
        }
    }

    // get data
    $.getJSON(url.columnUrl(app.Column), function () {
        console.log('success');
    })
        .done(function (data) {
            loadColumnContent(data);
            loadColumnLatest(data.WebId);
        })
        .fail(function () {
            console.log('error');
        })
        .always(function () {
            console.log('complete');
        });
}



// **********************************************
// **********************************************
// FFOS
// **********************************************
// **********************************************

function setActivity(id, isVisible){
	var activity = $('#'+id);
	if (isVisible){
		activity.show();
	}
	else {
		activity.hide();
	}
}

// ********************************************
// **** COLUMN
// ********************************************
function bindColumnLinks(column, backLink) {

	var backButton = document.querySelector('#btn-' + column.WebId + '-back');
	var rovat = document.querySelector('#rovatok-' + column.WebId);
	// bind click event
	if (backLink == 'rovatok') {
		// in
		document.querySelector('#btn-rovatok-' + column.WebId).addEventListener('click', function () {
			rovat.className = 'current';
			document.querySelector('[data-position="current"]').className = 'left';

			// out
			$(backButton).unbind("click");
			backButton.href = "#drawer";
			backButton.addEventListener('click', function () {
				rovat.className = 'right';
				document.querySelector('[data-position="current"]').className = 'current';
			});
		});	
	}
	else if (backLink == 'kezdo') {
		// in
		document.querySelector('#btn-kezdo-' + column.WebId).addEventListener('click', function () {
			rovat.className = 'current';
			document.querySelector('[data-position="current"]').className = 'left';

			// out
			$(backButton).unbind("click");
			backButton.href ="#";
			backButton.addEventListener('click', function () {
				rovat.className = 'right';
				document.querySelector('[data-position="current"]').className = 'current';
			});
		});
	}
	else if (backLink == 'cikkek') {
		// in

		// out
	}
	else if (backLink == 'close') {
		// exit
		document.querySelector('#btn-' + column.WebId + '-close').addEventListener('click', function () {
			rovat.className = 'right';
			document.querySelector('[data-position="current"]').className = 'current';
		});
	}
	
}

function renderColumnInColumns(column, backLink){
	// insert field
	var field = '<section id="rovatok-'+ column.WebId + '" role="region" data-position="right">'
		+ '<header class="fixed">'
		+ '<a id="btn-' + column.WebId + '-back" href="#"><span class="icon icon-back">back</span></a>'
		+ '<menu type="toolbar"><a id="btn-' + column.WebId + '-close" href="#">'
		+ '<span class="icon icon-close">close'
		+ '</span></a></menu>'
		+ '<h1>'+ column.Name+ '</h1>'
		+ '</header>'
		+ ' <article class="content scrollable header">'
		+ ' <header><h2>Normal</h2></header>'
		+ ' <div>'
        +	' <button>Default</button>'
        +	' <button class="recommend">Recommend</button>'
        +	' <button class="danger">Danger</button>'
		+ ' </div>'
		+ ' </article>'
		+ ' </section>';
	var $body = $(document.body);
	$body.prepend(field);
		
	// add to drawer
	var $list = $(document.getElementsByName("rovatok"));
	$list.append('<li><a href="#" id="btn-rovatok-'+column.WebId+'">'+column.Name+'</a></li>')
	
	bindColumnLinks(column, backLink);
	bindColumnLinks(column, 'close');
}

function loadColumnsContent(columns){
	// TODO: cache and empty check
	$.each(columns.Data, function(key, value){
		renderColumnInColumns(value, 'rovatok');
	});
}

function loadColumns(){
	// TODO: cache

	// get data
    $.getJSON(url.columnsUrl(), function () {
    })
        .done(function (data) {
            loadColumnsContent(data);
        })
        .fail(function () {
            console.log('error');
        })
        .always(function () {
        });
}

// ********************************************
// **** COVER
// ********************************************
function renderColumnLeads(article) {
	// TODO: check empty

	var image = '';
	if (!isEmpty(article.DefaultImageId)) {
		image = '<aside>' + page.getArticleImageListView(article) + '</aside>';
	}

	var content = '<header style="cursor:pointer" id="btn-kezdo-' + article.Column.WebId + '">' + article.Column.Name + '</header> <ul> <li>'
					+ ' <a href="#">' + image
					+ '  <p>' + article.Caption + '</p> <p>' + article.Lead + '</p> </a>'
					+ ' </li> </ul>';

	var $columnLeads = $(document.getElementById("rovat-vezeto"));
	$columnLeads.append(content);

	// bind link
	bindColumnLinks(article.Column, 'kezdo');
}

function renderRightArticles(article) {
	// TODO: check empty

	var image = '';
	if (!isEmpty(article.DefaultImageId)) {
		image = '<aside>' + page.getArticleImageListView(article) + '</aside>';
	}

	var content = '<ul> <li> <a href="#">'
					+ image
					+ '  <p>' + article.Caption + '</p> <p>' + article.Lead + '</p> </a>'
					+ ' </li> </ul>';

	var $rightArticles = $(document.getElementById("jobb"));
	$rightArticles.append(content);
}

function renderLeadArticles(value) {

}

function loadCoverContent(cover) {
	// TODO: cache and empty check

	// draw only after documnet ready
	$(document).ready(function () {
		$.each(cover.LeadArticles, function (key, value) {
			renderLeadArticles(value);
		});

		$.each(cover.RightArticles, function (key, value) {
			renderRightArticles(value);
		});

		$.each(cover.ColumnLeads, function (key, value) {
			renderColumnLeads(value);
		});

		$.each(cover.Rates, function (key, value) {
			// renderColumnInColumns(value);
		});

		$.each(cover.Weathers, function (key, value) {
			// renderColumnInColumns(value);
		});
	});
}

function loadCover() {
	// TODO: Cache

	// get data
	$.getJSON(url.coverUrl(), function () {
		// show loading bar
		setActivity('home-activity', true);
	})
        .done(function (data) {
        	loadCoverContent(data);
        	// hide loading bar
        	setActivity('home-activity', false);

        })
        .fail(function () {
        	console.log('error');
        })
        .always(function () {
        });
}

// ********************************************
// **** LATEST
// ********************************************

function renderClock(dateTime) {
	var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');
	var digits = {};
	var positions = ['h1', 'h2', ':', 'm1', 'm2'];
	var currentTime = new Date(dateTime);
	var now = [currentTime.getHours().padLeft(), currentTime.getMinutes().padLeft()].join("");

	var clock = '<div class="clock"><div class="display"><div class="digits">';
	$.each(positions, function () {
		if (this == ':') {
			clock = clock + '<div class="dots"></div>';
		}
		else {
			var n = digit_to_name[0];
			if (this == 'h1') {
				n = digit_to_name[now[0]];
			}
			else if (this == 'h2') {
				n = digit_to_name[now[1]];
			}
			else if (this == 'm1') {
				n = digit_to_name[now[2]];
			}
			else if (this == 'm2') {
				n = digit_to_name[now[3]];
			}

			var pos = '<div class="' + n + '">';
			for (var i = 1; i < 8; i++) {
				pos = pos + '<span class="d' + i + '"></span>';
			}

			pos = pos + '</div>';
			clock = clock + pos;
		}
	});

	clock = clock + '</div></div></div>';

	return clock;
}

function renderLatestArticles(article) {
	var content = '<ul> <li> <a href="#"><aside>' + renderClock(article.ReleaseDate) + '</aside>'
					+ '  <p>' + article.Caption + '</p> <p>' + article.Lead + '</p> </a>'
					+ ' </li> </ul>';

	var $latestArticles = $(document.getElementById("friss"));
	$latestArticles.append(content);
}

function loadLatestContent(latestArticles) {
	// TODO: cache and empty check
	$.each(latestArticles.Data, function (key, value) {
		// TODO: server side error, duplicated record
		if (key < 5) {
			renderLatestArticles(value);
		}
	});
}

function loadLatest() {
	// get data
	$.getJSON(url.latestArticlesUrl(), function () {
	})
        .done(function (data) {
        	loadLatestContent(data)
        })
        .fail(function () {
        	console.log('error');
        })
        .always(function () {
        });
}