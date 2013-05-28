$ ->
  # array find helper
  Array.prototype.find = (k, v) -> @.filter (e,i) -> e[k] is v
  
  # elements
  sidebar = $ '#sidebar-wrapper'
  filter = $ '#sidebar-filter'
  Characters = []
  
  # get items
  getItems = (characters, blazons) ->
    blazons.sort ( (a,b) -> a['name'] > b['name'] )
    for b in blazons
      b['characters'] = []
      for c in characters
        b['characters'].push c if c['blazon'] is b['name']
      b['characters'].sort ( (a,b) -> a['name'] > b['name'] )
    blazons.filter ( (e, i) -> e['characters'].length )
    
  # templates
  blazonTPL = (v) -> '<li class="sidebar-item-blazon"><strong><label><input type="checkbox" id="blazon_'+v.i+'" class="sidebar-check-blazon">'+v.name+'</label></strong><ul></ul></li>'
  charTPL = (v) -> '<li class="sidebar-item-char"><label><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char" data-name="'+v.name+'">'+v.name+'</label></li>'
  
  # update sidebar
  updateSidebar = (characters, blazons) ->
    sidebar.html ''
    items = getItems characters, blazons
    for blazon, i in items
      blazon_item = $ blazonTPL { i: i, name: blazon['name'] }
      $( charTPL { i: i, j: j, name: char['name'] } ).appendTo blazon_item.children('ul') for char, j in blazon['characters']
      blazon_item.appendTo sidebar
    items
    
  # merge moves on a character
  mergeMoves = (moves) ->
    for v, k of Characters
      continue if typeof k isnt 'object'
      move = ( moves.find 'name', k['name'] )
      continue if not move.length
      delete move[0]['name']
      delete move[0]['find']
      k['moves'] = ( j for i, j of move[0] )
      
  # set checkboxes
  setCheckboxes = (blazons, moves) ->
    $('.sidebar-check-blazon').on 'change', -> 
      v = $(@).is ':checked'
      $(@).parents('.sidebar-item-blazon').find('input').not(@).each ->
        @.checked = v
        do $(@).change
    token = false
    $('.sidebar-check-char').on 'change', -> 
      m = $(@).attr('id').match /char_([0-9]+)_([0-9]+)/
      if $(@).is ':checked' then Characters[$(@).attr('id')] = blazons[parseInt(m[1])]['characters'][parseInt(m[2])] else delete Characters[$(@).attr('id')]
      clearTimeout token
      token = setTimeout ( ->
        #********** SEND DATA BELOW **********#
        mergeMoves moves
        console.log Characters
      ), 100
        
  # set filter
  setFilter = (characters, blazons) ->
    filter.on 'keyup', -> 
      v = @.value.toLowerCase()
      $('.sidebar-check-char').each ->
        parent = $(@).parents('.sidebar-item-char').hide()
        do $(@).parents('.sidebar-item-char').show if @.dataset.name.toLowerCase().indexOf(v) > -1
        


  # initialize
  initialize = (characters, blazons) ->
    blazons = updateSidebar characters, blazons
    $.get 'api/get/moves', (moves) ->
      setCheckboxes blazons, JSON.parse(moves)
      setFilter characters, blazons
    
    
  # get data
  $.get 'api/get/characters', (characters) -> 
    $.get 'api/get/blazons', (blazons) -> initialize JSON.parse(characters), JSON.parse(blazons)