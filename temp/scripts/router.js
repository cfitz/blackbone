(function() {

  define(["jquery", "lodash", "backbone", "app", "modules/solrita"], function($, _, Backbone, app, Solrita) {
    var AppRouter;
    AppRouter = Backbone.Router.extend({
      collection: {},
      initialize: function(options) {
        return this.collection = options.collection;
      },
      routes: {
        "search*params": "searchAction",
        "*actions": "defaultAction"
      },
      defaultAction: function(actions) {
        this.reset();
        this.collection.query = app.defaultQuery;
        this.collection.facetQueries = [];
        return this.collection.search();
      },
      searchAction: function(params) {
        var facetQueries, start;
        this.reset();
        params = this._getParamsFromArguments(arguments_);
        this.collection.query = this._getQueryFromParams(params);
        this.collection.perPage = this._getNumFromParams(params);
        start = this._getStartFromParams(params);
        this.collection.currentPage = 0;
        if (start !== 0) {
          this.collection.currentPage = Math.floor(start / this.collection.perPage);
        }
        facetQueries = this._getFacetQueriesFromParams(params);
        this.collection.facetQueries = facetQueries;
        return this.collection.search();
      },
      initLayout: function() {
        var main, self;
        self = this;
        return main = app.useLayout({
          template: "layouts/main",
          views: {
            "#search": new Solrita.Views.SearchView({
              collection: self.collection
            }),
            "#results-header": new Solrita.Views.ResultsHeaderView({
              collection: self.collection
            }),
            "#results": new Solrita.Views.ResultsView({
              collection: self.collection
            }),
            "#facets": new Solrita.Views.FacetsView({
              collection: self.collection
            }),
            "#filters": new Solrita.Views.FiltersView({
              collection: self.collection
            }),
            "#pagination": new Solrita.Views.PaginationView({
              collection: self.collection
            })
          }
        }).render();
      },
      _getQueryFromParams: function(params) {
        var queryParam;
        queryParam = params.q;
        if (queryParam === undefined || queryParam === "") {
          queryParam = app.defaultQuery;
        }
        return unescape(queryParam);
      },
      _getStartFromParams: function(params) {
        var startParam;
        startParam = params.start;
        if (startParam === undefined) {
          startParam = 0;
        }
        return startParam;
      },
      _getNumFromParams: function(params) {
        var numParam;
        numParam = params.num;
        if (numParam === undefined) {
          numParam = app.defaultPerPage;
        }
        return numParam;
      },
      _getFacetQueriesFromParams: function(params) {
        var facetQueriesArray, facetQueriesParam;
        facetQueriesArray = [];
        facetQueriesParam = params.fq;
        if (facetQueriesParam !== undefined) {
          if (_.isArray(facetQueriesParam)) {
            facetQueriesArray = facetQueriesParam;
          } else {
            facetQueriesArray.push(facetQueriesParam);
          }
        }
        return facetQueriesArray;
      },
      _getParamsFromArguments: function(args) {
        var paramString, result;
        paramString = args[0];
        result = {};
        if (!paramString) {
          return result;
        }
        $.each(paramString.split("&"), function(index, value) {
          var currentValue, key, param;
          if (value) {
            param = value.split("=");
            key = param[0];
            if (key.lastIndexOf("?", 0) === 0) {
              key = key.substring(1, key.lenght);
            }
            value = param[1];
            currentValue = result[key];
            if (currentValue === undefined) {
              return result[key] = value;
            } else if (_.isArray(currentValue)) {
              return currentValue.push(value);
            } else {
              return result[key] = [currentValue, value];
            }
          }
        });
        return result;
      },
      reset: function() {
        if (this.collection.length) {
          return this.collection.reset();
        }
      }
    });
    return AppRouter;
  });

}).call(this);
