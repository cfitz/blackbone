define ["jquery", "lodash", "backbone", "vendor/backbone.layoutmanager"], ($, _, Backbone) ->
  
  # Patch collection fetching to emit a `fetch` event.
  Backbone.Collection::fetch = (->
    fetch = Backbone.Collection::fetch
    ->
      @trigger "fetch"
      fetch.apply this, arguments
  )()
  
  # set ajax params without brackets []
  $.ajaxSettings.traditional = true
  
  # Provide a global location to place configuration settings and module
  # creation.
  app =
    
    # The root path to run the application.
    root: "/"
    pushState: true
    solrURL: "http://localhost:8983/solr/select"
    defaultQuery: ""
    defaultRequestHandler: "search"
    defaultFacetFieldsArray: ["format", "pub_date", "subject_topic_facet"]
    defaultPerPage: 5
    defaultSortField: "score desc, pub_date_sort desc, title_sort asc"
    paginationSize: 2
    perPageArray: [3, 5, 10, 15, 20, 50]
    sortFieldArray: ["score asc", "score desc"]
    hlSimplePre: "<em>"
    hlSimplePro: "</em>"

  
  # Localize or create a new JavaScript Template object.
  JST = window.JST = window.JST or {}
  
  # Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure
    
    # Allow LayoutManager to augment Backbone.View.prototype.
    manage: true
    prefix: "templates/"
    fetch: (path) ->
      
      # Concatenate the file extension.
      path = path + ".html"
      
      # If cached, use the compiled template.
      return JST[path]  if JST[path]
      
      # Put fetch into `async-mode`.
      done = @async()
      
      # Seek out the template asynchronously.
      $.get app.root + path, (contents) ->
        done JST[path] = _.template(contents)


  
  # Mix Backbone.Events, modules, and layout management into the app object.
  _.extend app,
    
    # Create a custom object with a nested Views object.
    module: (additionalProps) ->
      _.extend
        Views: {}
      , additionalProps

    
    # Helper for using layouts.
    useLayout: (options) ->
      
      # Create a new Layout with options.
      layout = new Backbone.Layout(_.extend(
        el: "body"
      , options))
      
      # Cache the refererence.
      @layout = layout
  , Backbone.Events
