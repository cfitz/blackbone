# Set the require.js configuration for your application.
require.config
  
  # Initialize the application with the main application file.
  deps: ["main"]
  paths:
    jquery: "vendor/jquery.min"
    lodash: "vendor/lodash.min"
    backbone: "vendor/backbone-min"

  shim:
    backbone:
      deps: ["lodash", "jquery"]
      exports: "Backbone"

    "vendor/backbone.layoutmanager": ["backbone"]
    "vendor/backbone.paginator": ["backbone"]
    
    # Twitter Bootstrap depends on jQuery.
    "vendor/bootstrap/js/bootstrap": ["jquery"]
    
    # spinjs: http://fgnass.github.com/spin.js/
    "vendor/spin": []