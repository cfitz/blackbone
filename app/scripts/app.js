define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone",

  // Plugins.
  "vendor/backbone.layoutmanager",

  ], function ($, _, Backbone) {

    // Patch collection fetching to emit a `fetch` event.
    Backbone.Collection.prototype.fetch = function () {
      var fetch = Backbone.Collection.prototype.fetch;
      return function () {
        this.trigger("fetch");
        return fetch.apply(this, arguments);
      };
    }();

    // set ajax params without brackets []
    $.ajaxSettings.traditional = true;

    // Provide a global location to place configuration settings and module
    // creation.
     var app = {
        // The root path to run the application.
        root: "/",
        pushState: true,
        solrURL: "http://localhost:8983/solr/select",
        defaultQuery: "",
        defaultRequestHandler: "search",
        defaultFacetFieldsArray: ["format","pub_date", "subject_topic_facet", ],
        defaultPerPage: 5,
        defaultSortField: "score desc, pub_date_sort desc, title_sort asc",
        paginationSize: 2,
        perPageArray: [3, 5, 10, 15, 20, 50],
        sortFieldArray: ["score asc", "score desc"],
        hlSimplePre: "<em>",
        hlSimplePro: "</em>"
      };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Configure LayoutManager with Backbone Boilerplate defaults.
    Backbone.LayoutManager.configure({
      // Allow LayoutManager to augment Backbone.View.prototype.
      manage: true,

      prefix: "templates/",

      fetch: function (path) {
        // Concatenate the file extension.
        path = path + ".html";

        // If cached, use the compiled template.
        if (JST[path]) {
          return JST[path];
        }

        // Put fetch into `async-mode`.
        var done = this.async();

        // Seek out the template asynchronously.
        $.get(app.root + path, function (contents) {
          done(JST[path] = _.template(contents));
        });
      }
    });

    // Mix Backbone.Events, modules, and layout management into the app object.
    return _.extend(app, {
      // Create a custom object with a nested Views object.
      module: function (additionalProps) {
        return _.extend({
          Views: {}
        }, additionalProps);
      },

      // Helper for using layouts.
      useLayout: function (options) {
        // Create a new Layout with options.
        var layout = new Backbone.Layout(_.extend({
          el: "body"
        }, options));

        // Cache the refererence.
        return this.layout = layout;
      }
    }, Backbone.Events);

  });
