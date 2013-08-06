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