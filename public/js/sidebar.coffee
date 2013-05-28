$ ->
  
  # Setup
  # ----------------------------------------
  $.ajaxSetup async:false
  characters = blazons = moves = output = []
  sidebar = $ '#sidebar-wrapper'
  filter = $ '#sidebar-filter'
  toggler = $ '#sidebar-toggler'
  
  
  
  # Helpers
  # ----------------------------------------
  Array.prototype.find = (k, v) -> @.filter (e,i) -> e[k] is v
  timeout = (t, c) -> setTimeout c, t
  
  
  
  # Templates
  # ----------------------------------------
  blazonTPL = (v) -> '<li class="sidebar-item-blazon"><strong><label><input type="checkbox" id="blazon_'+v.i+'" class="sidebar-check-blazon">'+v.name+'</label></strong><ul></ul></li>'
  charTPL = (v) -> '<li class="sidebar-item-char"><label><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char" data-name="'+v.name+'">'+v.name+'</label></li>'
  
  
  
  # Functions
  # ----------------------------------------
  # get items
  sortItems = ->
    blazons.sort ( (a,b) -> a['name'] > b['name'] )
    for b in blazons
      b['characters'] = []
      for c in characters
        b['characters'].push c if ( $.inArray b['name'], ( $.map c['blazon'].split(','), $.trim ) ) isnt -1
      b['characters'].sort ( (a,b) -> a['name'] > b['name'] )
    blazons = blazons.filter ( (e, i) -> e['characters'].length )
    
  # update sidebar
  updateSidebar = ->
    for b, i in blazons
      blazon_item = $ blazonTPL { i: i, name: b['name'] }
      $( charTPL { i: i, j: j, name: c['name'] } ).appendTo blazon_item.children('ul') for c, j in b['characters']
      blazon_item.appendTo sidebar
    
  # merge moves on a character
  getOutput = ->
    for v, k of output
      continue if typeof k isnt 'object'
      move = ( moves.find 'name', k['name'] )
      continue if not move.length
      delete move[0]['name']
      delete move[0]['find']
      k['moves'] = ( j for i, j of move[0] )
    output
      
  # set checkboxes
  setCheckboxes = ->
    $('.sidebar-check-blazon').on 'change', -> 
      v = $(@).is ':checked'
      $(@).parents('.sidebar-item-blazon').find('input').not(@).each ->
        @.checked = v
        do $(@).change
    token = false
    $('.sidebar-check-char').on 'change', -> 
      $(@).parents('.sidebar-item-blazon').find('.sidebar-check-blazon').attr('checked', false) if $(@).is ':not(:checked)'
      m = $(@).attr('id').match /char_([0-9]+)_([0-9]+)/
      if $(@).is ':checked' then output[$(@).attr('id')] = blazons[parseInt(m[1])]['characters'][parseInt(m[2])] else delete output[$(@).attr('id')]
      clearTimeout token
      token = timeout 50, -> console.log do getOutput #********** SEND DATA HERE **********#
        
  # set filter
  setFilter = ->
    filter.on 'keyup', -> 
      v = @.value.toLowerCase()
      $('.sidebar-check-char').each ->
        parent = $(@).parents('.sidebar-item-char').hide()
        do $(@).parents('.sidebar-item-char').show if @.dataset.name.toLowerCase().indexOf(v) > -1
    
  # select/deselect all
  toggleAll = ->
    v = $('.sidebar-check-blazon:checked').length isnt $('.sidebar-check-blazon').length
    $('.sidebar-check-blazon').each -> 
      @.checked = v
      do $(@).change
        
        
        
  # Initialize
  # ----------------------------------------
  $.get 'api/get/characters', (d) -> characters = JSON.parse(d)
  $.get 'api/get/blazons', (d) -> blazons = JSON.parse(d)
  $.get 'api/get/moves', (d) -> moves = JSON.parse(d)
  
  do sortItems
  do updateSidebar
  do setCheckboxes
  do setFilter
  
  toggler.on 'click', toggleAll 
  do toggleAll