// Generated by CoffeeScript 1.6.1
(function() {

  $(function() {
    var charTPL, characters, filter, find, getOutput, houseTPL, houses, moves, output, setCheckboxes, setFilter, sidebar, sortItems, timeout, toggleAll, toggler, updateSidebar;
    $.ajaxSetup({
      async: false
    });
    characters = houses = moves = output = [];
    sidebar = $('#sidebar-wrapper');
    filter = $('#sidebar-filter');
    toggler = $('#sidebar-toggler');
    find = function(a, k, v) {
      return a.filter(function(e, i) {
        return e[k] === v;
      });
    };
    timeout = function(t, c) {
      return setTimeout(c, t);
    };
    houseTPL = function(v) {
      return '<li class="sidebar-item-house"><strong><label><input type="checkbox" id="house_' + v.i + '" class="sidebar-check-house">' + v.name + '</label></strong><ul></ul></li>';
    };
    charTPL = function(v) {
      return '<li class="sidebar-item-char"><label><input type="checkbox" id="char_' + v.i + '_' + v.j + '" class="sidebar-check-char" data-name="' + v.name + '">' + v.name + '</label></li>';
    };
    sortItems = function() {
      var c, h, sort, _i, _j, _len, _len1;
      sort = function(a, b) {
        return a['name'] > b['name'];
      };
      houses.sort(sort);
      for (_i = 0, _len = houses.length; _i < _len; _i++) {
        h = houses[_i];
        h['characters'] = [];
        for (_j = 0, _len1 = characters.length; _j < _len1; _j++) {
          c = characters[_j];
          if (c['blazon'] === h['name']) {
            h['characters'].push(c);
          }
        }
        h['characters'].sort(sort);
      }
      return houses = houses.filter((function(e, i) {
        return e['characters'].length;
      }));
    };
    updateSidebar = function() {
      var c, h, house_item, i, j, _i, _j, _len, _len1, _ref, _results;
      _results = [];
      for (i = _i = 0, _len = houses.length; _i < _len; i = ++_i) {
        h = houses[i];
        house_item = $(houseTPL({
          i: i,
          name: h['name']
        }));
        _ref = h['characters'];
        for (j = _j = 0, _len1 = _ref.length; _j < _len1; j = ++_j) {
          c = _ref[j];
          $(charTPL({
            i: i,
            j: j,
            name: c['name']
          })).appendTo(house_item.children('ul'));
        }
        _results.push(house_item.appendTo(sidebar));
      }
      return _results;
    };
    getOutput = function() {
      var i, j, k, move, v, _results;
      for (k in output) {
        v = output[k];
        if (typeof v !== 'object') {
          continue;
        }
        move = find(moves, 'name', v['name']);
        if (!move.length) {
          continue;
        }
        delete move[0]['name'];
        delete move[0]['find'];
        v['moves'] = (function() {
          var _ref, _results;
          _ref = move[0];
          _results = [];
          for (i in _ref) {
            j = _ref[i];
            _results.push(j);
          }
          return _results;
        })();
      }
      _results = [];
      for (k in output) {
        v = output[k];
        _results.push(v);
      }
      return _results;
    };
    setCheckboxes = function() {
      var token;
      $('.sidebar-check-house').on('change', function() {
        var v;
        v = $(this).is(':checked');
        return $(this).parents('.sidebar-item-house').find('input').not(this).each(function() {
          this.checked = v;
          return $(this).change();
        });
      });
      token = false;
      return $('.sidebar-check-char').on('change', function() {
        var checkChars, checkHouse, m, parent;
        parent = $(this).parents('.sidebar-item-house');
        checkHouse = parent.find('.sidebar-check-house');
        checkChars = parent.find('.sidebar-check-char');
        if ($(this).is(':not(:checked)')) {
          checkHouse.attr('checked', false);
        }
        if (checkHouse.is(':not(:checked)') && checkChars.filter(':checked').length === checkChars.length) {
          checkHouse.click();
        }
        m = $(this).attr('id').match(/char_([0-9]+)_([0-9]+)/);
        if ($(this).is(':checked')) {
          output[$(this).attr('id')] = houses[parseInt(m[1])]['characters'][parseInt(m[2])];
        } else {
          delete output[$(this).attr('id')];
        }
        clearTimeout(token);
        return token = timeout(50, function() {
          return console.log(getOutput());
        });
      });
    };
    setFilter = function() {
      return filter.on('keyup', function() {
        var v;
        v = this.value.toLowerCase();
        return $('.sidebar-check-char').each(function() {
          var parent;
          parent = $(this).parents('.sidebar-item-char');
          if (this.dataset.name.toLowerCase().indexOf(v) > -1) {
            return parent.slideDown();
          } else {
            return parent.slideUp();
          }
        });
      });
    };
    toggleAll = function() {
      var v;
      v = $('.sidebar-check-house:checked').length !== $('.sidebar-check-house').length;
      return $('.sidebar-check-house').each(function() {
        this.checked = v;
        return $(this).change();
      });
    };
    $.get('api/get/characters', function(d) {
      return characters = JSON.parse(d);
    });
    $.get('api/get/houses', function(d) {
      return houses = JSON.parse(d);
    });
    $.get('api/get/moves', function(d) {
      return moves = JSON.parse(d);
    });
    sortItems();
    updateSidebar();
    setCheckboxes();
    setFilter();
    toggler.on('click', toggleAll);
    return toggleAll();
  });

}).call(this);
