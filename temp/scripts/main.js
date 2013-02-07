(function() {

  require(["app", "router", "modules/solrita"], function(app, Router, Solrita) {
    var solrPaginatedCollection;
    solrPaginatedCollection = new Solrita.SolrPaginatedCollection();
    app.router = new Router({
      collection: solrPaginatedCollection
    });
    app.router.initLayout();
    Backbone.history.start({
      pushState: app.pushState,
      root: app.root
    });
    return $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
      var href, root;
      href = {
        prop: $(this).prop("href"),
        attr: $(this).attr("href")
      };
      root = location.protocol + "//" + location.host + app.root;
      if (href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
        return $("body").scrollTop(0);
      }
    });
  });

}).call(this);
