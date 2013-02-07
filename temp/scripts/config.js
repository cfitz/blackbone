(function() {

  require.config({
    deps: ["main"],
    paths: {
      jquery: "vendor/jquery.min",
      lodash: "vendor/lodash.min",
      backbone: "vendor/backbone-min"
    },
    shim: {
      backbone: {
        deps: ["lodash", "jquery"],
        exports: "Backbone"
      },
      "vendor/backbone.layoutmanager": ["backbone"],
      "vendor/backbone.paginator": ["backbone"],
      "vendor/bootstrap/js/bootstrap": ["jquery"],
      "vendor/spin": []
    }
  });

}).call(this);
