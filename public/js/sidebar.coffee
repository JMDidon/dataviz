$ ->

  # Setup
  # ----------------------------------------
  $.ajaxSetup async:false
  Characters = Houses = Moves = Places = Episodes = output = []
  sidebar = $ '#sidebar-wrapper'
  filter  = $ '#sidebar-filter'
  toggler = $ '#sidebar-toggler'



  # Helpers
  # ----------------------------------------
  find = (a, k, v) -> a.filter (e,i) -> e[k] is v
  timeout = (t, c) -> setTimeout c, t



  # Templates
  # ----------------------------------------
  houseTPL = (v) -> '<li><strong><label class="sidebar-item-house"><input type="checkbox" id="house_'+v.i+'" class="sidebar-check-house">'+v.name+'</label></strong><ul></ul></li>'
  charTPL  = (v) -> '<li class="sidebar-item-char"><label><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char" data-name="'+v.name+'"><img src="//drive.google.com/uc?export=download&confirm=no_antivirus&id='+v.img+'" width="40" height="40"> '+v.name+'</label></li>'


  # Sidebar functions
  # ----------------------------------------
  # get items
  sortItems = ->
    sort = (a,b) -> a['name'] > b['name']
    Houses.sort sort
    for h in Houses
      h['Characters'] = []
      for c in Characters
        h['Characters'].push c if c['blazon'] is h['name']
      h['Characters'].sort sort
    Houses = Houses.filter ( (e, i) -> e['Characters'].length )

  # update sidebar
  updateSidebar = ->
    for h, i in Houses
      house_item = $ houseTPL { i: i, name: h['name'] }
      $( charTPL { i: i, j: j, name: c['name'], img: c['image'] } ).appendTo house_item.children('ul') for c, j in h['Characters']
      house_item.appendTo sidebar

  # merge Moves on a character
  getOutput = ->
    for k, v of output
      continue if typeof v isnt 'object'
      move = find Moves, 'name', v['name']
      continue if not move.length
      delete move[0]['name']
      delete move[0]['find']
      v['Moves'] = ( j for i, j of move[0] )
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
      if $(@).is ':checked' then output[$(@).attr('id')] = Houses[parseInt(m[1])]['Characters'][parseInt(m[2])] else delete output[$(@).attr('id')]
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
  $.get 'api/get/characters', (d) -> Characters = JSON.parse(d)
  $.get 'api/get/houses',     (d) -> Houses     = JSON.parse(d)
  $.get 'api/get/moves',      (d) -> Moves      = JSON.parse(d)
  $.get 'api/get/places',     (d) -> Places     = JSON.parse(d)
  $.get 'api/get/episodes',   (d) -> Episodes   = JSON.parse(d)

  do sortItems
  do updateSidebar
  do setCheckboxes
  do setFilter

  toggler.on 'click', toggleAll 
  do toggleAll