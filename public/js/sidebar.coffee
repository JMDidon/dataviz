$ ->
  sidebar = $ '#sidebar-wrapper'
  sidebarFilter = $ '#sidebar-filter'
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
  charTPL = (v) -> '<li><label><input type="checkbox" id="char_'+v.i+'_'+v.j+'" class="sidebar-check-char">'+v.name+'</label></li>'
  
  # update sidebar
  updateSidebar = (characters, blazons) ->
    items = getItems characters, blazons
    for blazon, i in items
      blazon_item = $ blazonTPL { i: i, name: blazon['name'] }
      $( charTPL { i: i, j: j, name: char['name'] } ).appendTo blazon_item.children('ul') for char, j in blazon['characters']
      blazon_item.appendTo sidebar
    items
      
  # set checkboxes
  setCheckboxes = (blazons) ->
    $('.sidebar-check-blazon').each -> 
      $(@).on 'change', -> 
        v = $(@).is ':checked'
        $(@).parents('.sidebar-item-blazon').find('input').not(@).each ->
          @.checked = v
          do $(@).change
    $('.sidebar-check-char').each ->
      $(@).on 'change', -> 
        m = $(@).attr('id').match /char_([0-9]+)_([0-9]+)/
        if $(@).is ':checked' then Characters[$(@).attr('id')] = blazons[parseInt(m[1])]['characters'][parseInt(m[2])] else delete Characters[$(@).attr('id')]
        #********** SEND DATA BELOW **********#
        console.log Characters
        


  # initialize
  initialize = (characters, blazons) ->
    blazons = updateSidebar characters, blazons
    setCheckboxes blazons
    
    
  # get data
  $.get 'api/get/characters', (characters) -> 
    $.get 'api/get/blazons', (blazons) -> initialize JSON.parse(characters), JSON.parse(blazons)