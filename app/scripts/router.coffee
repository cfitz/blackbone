define ["jquery", "lodash", "backbone", "app", "modules/solrita"], ($, _, Backbone, app, Solrita) ->
  AppRouter = Backbone.Router.extend(
    collection: {}
    initialize: (options) ->
      @collection = options.collection

    routes:
      "search*params": "searchAction"
      "*actions": "defaultAction"

    defaultAction: (actions) ->
      @reset()
      @collection.query = app.defaultQuery
      @collection.facetQueries = []
      @collection.search()

    searchAction: (params) ->
      @reset()
      params = @_getParamsFromArguments(arguments_)
      @collection.query = @_getQueryFromParams(params)
      @collection.perPage = @_getNumFromParams(params)
      start = @_getStartFromParams(params)
      @collection.currentPage = 0
      @collection.currentPage = Math.floor(start / @collection.perPage)  if start isnt 0
      facetQueries = @_getFacetQueriesFromParams(params)
      @collection.facetQueries = facetQueries
      @collection.search()

    initLayout: ->
      self = this
      main = app.useLayout(
        template: "layouts/main"
        views:
          "#search": new Solrita.Views.SearchView(collection: self.collection)
          "#results-header": new Solrita.Views.ResultsHeaderView(collection: self.collection)
          "#results": new Solrita.Views.ResultsView(collection: self.collection)
          "#facets": new Solrita.Views.FacetsView(collection: self.collection)
          "#filters": new Solrita.Views.FiltersView(collection: self.collection)
          "#pagination": new Solrita.Views.PaginationView(collection: self.collection)
      ).render()

    _getQueryFromParams: (params) ->
      queryParam = params.q
      queryParam = app.defaultQuery  if queryParam is `undefined` or queryParam is ""
      unescape queryParam

    _getStartFromParams: (params) ->
      startParam = params.start
      startParam = 0  if startParam is `undefined`
      startParam

    _getNumFromParams: (params) ->
      numParam = params.num
      numParam = app.defaultPerPage  if numParam is `undefined`
      numParam

    _getFacetQueriesFromParams: (params) ->
      facetQueriesArray = []
      facetQueriesParam = params.fq
      if facetQueriesParam isnt `undefined`
        if _.isArray(facetQueriesParam)
          facetQueriesArray = facetQueriesParam
        else
          facetQueriesArray.push facetQueriesParam
      facetQueriesArray

    _getParamsFromArguments: (args) ->
      paramString = args[0]
      result = {}
      return result  unless paramString
      $.each paramString.split("&"), (index, value) ->
        if value
          param = value.split("=")
          key = param[0]
          key = key.substring(1, key.lenght)  if key.lastIndexOf("?", 0) is 0
          value = param[1]
          currentValue = result[key]
          if currentValue is `undefined`
            result[key] = value
          else if _.isArray(currentValue)
            currentValue.push value
          else
            result[key] = [currentValue, value]

      result

    reset: ->
      @collection.reset()  if @collection.length
  )
  AppRouter
