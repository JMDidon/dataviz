// Generated by CoffeeScript 1.6.1
(function() {

  $(function() {
    var Characters, blazonTPL, charTPL, getItems, initialize, setCheckboxes, sidebar, sidebarFilter, updateSidebar;
    sidebar = $('#sidebar-wrapper');
    sidebarFilter = $('#sidebar-filter');
    Characters = [];
    getItems = function(characters, blazons) {
      var b, c, _i, _j, _len, _len1;
      blazons.sort((function(a, b) {
        return a['name'] > b['name'];
      }));
      for (_i = 0, _len = blazons.length; _i < _len; _i++) {
        b = blazons[_i];
        b['characters'] = [];
        for (_j = 0, _len1 = characters.length; _j < _len1; _j++) {
          c = characters[_j];
          if (c['blazon'] === b['name']) {
            b['characters'].push(c);
          }
        }
        b['characters'].sort((function(a, b) {
          return a['name'] > b['name'];
        }));
      }
      return blazons.filter((function(e, i) {
        return e['characters'].length;
      }));
    };
    blazonTPL = function(v) {
      return '<li class="sidebar-item-blazon"><strong><label><input type="checkbox" id="blazon_' + v.i + '" class="sidebar-check-blazon">' + v.name + '</label></strong><ul></ul></li>';
    };
    charTPL = function(v) {
      return '<li><label><input type="checkbox" id="char_' + v.i + '_' + v.j + '" class="sidebar-check-char">' + v.name + '</label></li>';
    };
    updateSidebar = function(characters, blazons) {
      var blazon, blazon_item, char, i, items, j, _i, _j, _len, _len1, _ref;
      items = getItems(characters, blazons);
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        blazon = items[i];
        blazon_item = $(blazonTPL({
          i: i,
          name: blazon['name']
        }));
        _ref = blazon['characters'];
        for (j = _j = 0, _len1 = _ref.length; _j < _len1; j = ++_j) {
          char = _ref[j];
          $(charTPL({
            i: i,
            j: j,
            name: char['name']
          })).appendTo(blazon_item.children('ul'));
        }
        blazon_item.appendTo(sidebar);
      }
      return items;
    };
    setCheckboxes = function(blazons) {
      $('.sidebar-check-blazon').each(function() {
        return $(this).on('change', function() {
          var v;
          v = $(this).is(':checked');
          return $(this).parents('.sidebar-item-blazon').find('input').not(this).each(function() {
            this.checked = v;
            return $(this).change();
          });
        });
      });
      return $('.sidebar-check-char').each(function() {
        return $(this).on('change', function() {
          var m;
          m = $(this).attr('id').match(/char_([0-9]+)_([0-9]+)/);
          if ($(this).is(':checked')) {
            Characters[$(this).attr('id')] = blazons[parseInt(m[1])]['characters'][parseInt(m[2])];
          } else {
            delete Characters[$(this).attr('id')];
          }
          return console.log(Characters);
        });
      });
    };
    initialize = function(characters, blazons) {
      blazons = updateSidebar(characters, blazons);
      return setCheckboxes(blazons);
    };
    return $.get('api/get/characters', function(characters) {
      return $.get('api/get/blazons', function(blazons) {
        return initialize(JSON.parse(characters), JSON.parse(blazons));
      });
    });
  });

}).call(this);
