$ ->
  
  # Setup
  # ----------------------------------------
  $.ajaxSetup async:false
  characters = houses = moves = output = []
  sidebar = $ '#sidebar-wrapper'
  filter  = $ '#sidebar-filter'
  toggler = $ '#sidebar-toggler'
  
  
  
  # Helpers
  # ----------------------------------------
  find = (a, k, v) -> a.filter (e,i) -> e[k] is v
  timeout = (t, c) -> setTimeout c, t
  
  
  
  # Templates
  # ----------------------------------------
  houseTPL = (v) -> '<li class="sidebar-item-house"><strong><label><input type="checkbox" id="house_'+v.i+'" class="sidebar-check-house">'+v.name+'</label></strong><ul></ul></li>'
  charTPL  = (v) -> '<li class="sidebar-item-char"><label><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char" data-name="'+v.name+'">'+v.name+' <img src="//drive.google.com/uc?export=download&confirm=no_antivirus&id='+v.img+'" width="20" height="20"></label></li>'
  
  
  
  # Functions
  # ----------------------------------------
  # get items
  sortItems = ->
    sort = (a,b) -> a['name'] > b['name']
    houses.sort sort
    for h in houses
      h['characters'] = []
      for c in characters
        h['characters'].push c if c['blazon'] is h['name']
      h['characters'].sort sort
    houses = houses.filter ( (e, i) -> e['characters'].length )
    
  # update sidebar
  updateSidebar = ->
    for h, i in houses
      house_item = $ houseTPL { i: i, name: h['name'] }
      $( charTPL { i: i, j: j, name: c['name'], img: c['image'] } ).appendTo house_item.children('ul') for c, j in h['characters']
      house_item.appendTo sidebar
    
  # merge moves on a character
  getOutput = ->
    for k, v of output
      continue if typeof v isnt 'object'
      move = find moves, 'name', v['name']
      continue if not move.length
      delete move[0]['name']
      delete move[0]['find']
      v['moves'] = ( j for i, j of move[0] )
    v for k, v of output
      
  # set checkboxes
  setCheckboxes = ->
    $('.sidebar-check-house').on 'change', -> 
      v = $(@).is ':checked'
      $(@).parents('.sidebar-item-house').find('input').not(@).each ->
        @.checked = v
        do $(@).change
    token = false
    $('.sidebar-check-char').on 'change', -> 
      parent      = $(@).parents '.sidebar-item-house'
      checkHouse  = parent.find '.sidebar-check-house'
      checkChars  = parent.find '.sidebar-check-char' 
      checkHouse.attr('checked', false) if $(@).is ':not(:checked)'
      checkHouse.click() if checkHouse.is(':not(:checked)') and checkChars.filter(':checked').length is checkChars.length
      m = $(@).attr('id').match /char_([0-9]+)_([0-9]+)/
      if $(@).is ':checked' then output[$(@).attr('id')] = houses[parseInt(m[1])]['characters'][parseInt(m[2])] else delete output[$(@).attr('id')]
      clearTimeout token
      token = timeout 50, -> console.log do getOutput #********** SEND DATA HERE **********#
        
  # set filter
  setFilter = ->
    filter.on 'keyup', -> 
      v = @.value.toLowerCase()
      $('.sidebar-check-char').each ->
        parent = $(@).parents('.sidebar-item-char')
        if @.dataset.name.toLowerCase().indexOf(v) > -1 then do parent.slideDown else do parent.slideUp
    
  # select/deselect all
  toggleAll = ->
    v = $('.sidebar-check-house:checked').length isnt $('.sidebar-check-house').length
    $('.sidebar-check-house').each -> 
      @.checked = v
      do $(@).change
        
        
        
  # Initialize
  # ----------------------------------------
  $.get 'api/get/characters', (d) -> characters = JSON.parse(d)
  $.get 'api/get/houses',     (d) -> houses     = JSON.parse(d)
  $.get 'api/get/moves',      (d) -> moves      = JSON.parse(d)
  
  do sortItems
  do updateSidebar
  do setCheckboxes
  do setFilter
  
  toggler.on 'click', toggleAll 
  do toggleAll