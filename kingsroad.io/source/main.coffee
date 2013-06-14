
$ ->

  # Setup
  # ----------------------------------------
  $.ajaxSetup async:false
  
  sidebar       = $ '#sidebar-wrapper'
  filter        = $ '#sidebar-filter'
  toggler       = $ '#sidebar-toggler'
  map           = $ '#map'
  timeline      = $ '#timeline'
  cursor_start  = $ '#cursor_start'
  cursor_end		= $ '#cursor_end'
  episodes      = $ '#episodes'
  
  Characters = Houses = Moves = Episodes = Places = output = []
  FROM = 0
  TO = 1



  # Helpers
  # ----------------------------------------
  find = (a, k, v) -> a.filter (e,i) -> e[k] is v
  timeout = (t, c) -> setTimeout c, t
  slug = (t) -> t.toLowerCase().replace(new RegExp(' ', 'g'),'-').replace(/[^\w-]+/g,'')
  addZero = (n) -> n = if n.toString().length is 1 then '0'+n else n



  # Templates
  # ----------------------------------------
  houseTPL      = (v) -> '<li><input type="checkbox" id="house_'+v.i+'" class="sidebar-check-house"><label for="house_'+v.i+'" class="sidebar-item-house"><img src="//drive.google.com/uc?export=download&confirm=no_antivirus&id='+v.img+'"> '+v.name+'</label><ul></ul></li>'
  charTPL       = (v) -> '<li><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char" data-name="'+v.name+'"><label for="char_'+v.i+'_'+v.j+'" class="sidebar-item-char"><label><img src="//drive.google.com/uc?export=download&confirm=no_antivirus&id='+v.img+'" width="40" height="40" class="photo" style="border-color:'+v.color+'"> '+v.name+'</label></li>'
  charPointTPL  = (v) -> '<figure><a href="'+v.url+'" target="_blank"><img src="//drive.google.com/uc?export=download&confirm=no_antivirus&id='+v.img+'" width="40" height="40" class="photo '+v.dead+'" style="border-color:'+v.color+'" title="'+v.name+'"><figcaption>'+v.episode+'</figcaption></a></figure>'
  episodesTPL   = (v) -> v.first.id+': <a href="'+v.first.url+'" target="_blank">'+v.first.name+'</a> ~ '+v.last.id+': <a href="'+v.last.url+'" target="_blank">'+v.last.name+'</a>'
  
  

  # Filter placeholder
  # ----------------------------------------
  filter.val filter[0].dataset.placeholder
  filter.on 'focus', -> ( $(@).val '' ) if @.value is @.dataset.placeholder
  filter.on 'blur', -> ( $(@).val @.dataset.placeholder ) if $.trim($(@).val()) is ''
  


  # Functions
  # ----------------------------------------
  # get items
  sortItems = ->
    sort = (a,b) -> a['name'] > b['name']
    Houses.sort sort
    for h in Houses
      h['characters'] = []
      for c in Characters
        h['characters'].push c if c['house'] is h['name']
      h['characters'].sort sort
    Houses = Houses.filter ( (e, i) -> e['characters'].length )

  # update sidebar
  updateSidebar = ->
    for h, i in Houses
      house_item = $ houseTPL { i: i, name: h['name'], img: h['image'] }
      $( charTPL { i: i, j: j, name: c['name'], img: c['image'], color: h['color'] } ).appendTo house_item.children('ul') for c, j in h['characters']
      house_item.appendTo sidebar

  # merge Moves on a character
  getOutput = ->
    for k, v of output
      continue if typeof v isnt 'object'
      move = find Moves, 'name', v['name']
      continue if not move.length
      delete move[0]['name']
      delete move[0]['find']
      v['moves'] = ( j for i, j of move[0] )
    v for k, v of output

  # set checkboxes
  setCheckboxes = ->
    $('.sidebar-check-house').on 'change', -> 
      v = $(@).is ':checked'
      $(@).parents('li').find('input').not(@).each ->
        @.checked = v
        do $(@).change
    token = false
    $('.sidebar-check-char').on 'change', -> 
      parent      = $(@).parents('li')
      checkHouse  = parent.find '.sidebar-check-house'
      checkChars  = parent.find '.sidebar-check-char' 
      checkHouse.attr('checked', false) if $(@).is ':not(:checked)'
      checkHouse.click() if checkHouse.is(':not(:checked)') and checkChars.filter(':checked').length is checkChars.length
      m = $(@).attr('id').match /char_([0-9]+)_([0-9]+)/
      if $(@).is ':checked' then output[$(@).attr('id')] = Houses[parseInt(m[1])]['characters'][parseInt(m[2])] else delete output[$(@).attr('id')]
      clearTimeout token
      token = timeout 50, -> updateMap getOutput()

  # set filter
  setFilter = ->
    filter.on 'keyup', -> 
      v = @.value.toLowerCase()
      $('.sidebar-check-char').each ->
        parent = $(@).parent()
        if @.dataset.name.toLowerCase().indexOf(v) > -1 then do parent.slideDown else do parent.slideUp

  # select/deselect all
  toggleAll = ->
    v = $('.sidebar-check-house:checked').length isnt $('.sidebar-check-house').length
    $('.sidebar-check-house').each -> 
      @.checked = v
      do $(@).change
  
  
  
  # Map
  # ----------------------------------------
  updateMap = (chars) ->
    map.empty()
    $.each chars, (k, char) ->
      moves = char.moves.filter (e,i) -> i >= FROM and i <= TO and $.trim(e) isnt '' 
      color = find(Houses, 'name', char.house)[0].color
      char.dead = ''
      points = []
      $.each moves, (i, place) ->
        if /Dead:.+/.test place
          place = place.replace 'Dead:', ''
          char.dead = 'dead'
        p = find(Places, 'name', place)[0]
        if p
          t = $('<div id="'+slug(place)+'" class="map-pt"><div class="map-pt-box"><h2 class="map-pt-name">')
          t.find('.map-pt-name').text(p.name)
          t.css({left:p.x+'%',top:p.y+'%'})
          t.appendTo(map) if not $(map).find('#'+slug(place)).length
          points.push [parseFloat(p.x)*9, parseFloat(p.y)*6.5]
          $(charPointTPL({episode:getHumanEpisode(i), name:char.name, url: char.url, dead: char.dead, img:char.image, color:color})).appendTo(map.find('#'+slug(place)).children('.map-pt-box')) if i is moves.length-1
      draw points, color


  # map.on 'mousemove', (e) ->
  #   console.log Math.round((e.pageX-map.offset().left)/map.width()*10000)/100+' : '+Math.round((e.pageY-map.offset().top)/map.height()*10000)/100
  
  
  
  # Cursors
  # ----------------------------------------
  setCursors = ->
    cursor_end.css 'left', cursor_end.offset().left-timeline.offset().left+step
    $('.cursor').draggable {
      grid: [step, 0]
      axis: 'x'
      snap: true
      snapMode: 'both'
      containment: timeline
      cursor: 'pointer'
      opacity: '0.5'
      drag: -> 
        do updatePositions
        do updateEpisodes
      stop: ->
        if parseInt(cursor_start.offset().left) >= parseInt(cursor_end.offset().left)-step
          o = if $(@).is(cursor_end) then 1 else -1
          $(@).css 'left', $('.cursor').not(@).offset().left-timeline.offset().left+o*step
        do updatePositions
        do updateEpisodes
        updateMap getOutput()
    }
    
  updatePositions = ->
    FROM = Math.ceil((cursor_start.offset().left-timeline.offset().left)/step)
    TO = Math.ceil((cursor_end.offset().left-timeline.offset().left)/step)
    
  updateEpisodes = ->
    cursor_start.text getHumanEpisode FROM
    cursor_end.text getHumanEpisode TO
    episodes.html episodesTPL {first: Episodes[FROM], last: Episodes[TO]}
    
  getHumanEpisode = (n) -> 'S0'+Math.ceil((n+1)/10)+'E'+addZero(n%10+1)
  
  
  
  # Draw
  # ----------------------------------------
  transition = (path) ->
    path.transition()
      .duration(2000)
      .attrTween("stroke-dasharray", tweenDash)
  
  tweenDash = ->
    l = @.getTotalLength()
    i = d3.interpolateString("0," + l, l + "," + l)
    (t) -> i(t)
    
  draw = (points, color = '#000') ->
    line = d3.svg.line()
    svg = d3.select(".map").append("svg").datum(points)
    svg.append("path").style("stroke", color).style("opacity", ".5").style("stroke-dasharray", "1,3").attr("d", line)
    svg.append("path").style("stroke", color).attr("d", line).call(transition)



  # Initialize
  # ----------------------------------------  
  $.get 'api/get/characters', (d) -> Characters = JSON.parse(d)
  $.get 'api/get/houses',     (d) -> Houses     = JSON.parse(d)
  $.get 'api/get/moves',      (d) -> Moves      = JSON.parse(d)
  $.get 'api/get/episodes',   (d) -> Episodes   = JSON.parse(d)
  $.get 'api/get/places',     (d) -> Places     = JSON.parse(d)
  
  step = (timeline.width()-cursor_start.width())/(Episodes.length-1)
  
  do sortItems
  do updateSidebar
  do setCheckboxes
  do setFilter
  
  toggler.on 'click', toggleAll 
  do toggleAll
  
  do setCursors
  do updateEpisodes