(function() {

  define(["jquery", "lodash", "backbone", "vendor/backbone.layoutmanager"], function($, _, Backbone) {
    var JST, app;
    Backbone.Collection.prototype.fetch = (function() {
      var fetch;
      fetch = Backbone.Collection.prototype.fetch;
      return function() {
        this.trigger("fetch");
        return fetch.apply(this, arguments);
      };
    })();
    $.ajaxSettings.traditional = true;
    app = {
      root: "/",
      pushState: true,
      solrURL: "http://localhost:8983/solr/select",
      defaultQuery: "",
      defaultRequestHandler: "search",
      defaultFacetFieldsArray: ["format", "pub_date", "subject_topic_facet"],
      defaultPerPage: 5,
      defaultSortField: "score desc, pub_date_sort desc, title_sort asc",
      paginationSize: 2,
      perPageArray: [3, 5, 10, 15, 20, 50],
      sortFieldArray: ["score asc", "score desc"],
      hlSimplePre: "<em>",
      hlSimplePro: "</em>"
    };
    JST = window.JST = window.JST || {};
    Backbone.LayoutManager.configure({
      manage: true,
      prefix: "templates/",
      fetch: function(path) {
        var done;
        path = path + ".html";
        if (JST[path]) {
          return JST[path];
        }
        done = this.async();
        return $.get(app.root + path, function(contents) {
          return done(JST[path] = _.template(contents));
        });
      }
    });
    return _.extend(app, {
      module: function(additionalProps) {
        return _.extend({
          Views: {}
        }, additionalProps);
      },
      useLayout: function(options) {
        var layout;
        layout = new Backbone.Layout(_.extend({
          el: "body"
        }, options));
        return this.layout = layout;
      }
    }, Backbone.Events);
  });

}).call(this);
