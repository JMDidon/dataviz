$(document).ready(function(){

$.ajax(
      {
        type: 'POST',
        url:  'api.php',
        data: 'variable=valeur&variable2=valeur2',
        success: function(data)
        {
          var content = data;
          var objet = eval('(' + content + ')');
          console.log(objet);
          var retrieved_data = {};
          retrieved_data.moves = {};
retrieved_data.houses = {};
retrieved_data.places = {};
retrieved_data.episodes = {};
retrieved_data.characters = {};


/* Chargement des infos des épisodes */
$.get('api/get/moves', function(data)
{
retrieved_data.moves = JSON.parse(data);
//console.log(retrieved_data.moves);
});

$.get('api/get/houses', function(data)
{
retrieved_data.houses = JSON.parse(data);
//console.log(retrieved_data.houses);
});

$.get('api/get/places', function(data)
{
retrieved_data.places = JSON.parse(data);
//console.log(retrieved_data.places);
});

$.get('api/get/episodes', function(data)
{
retrieved_data.episodes = JSON.parse(data);
//console.log(retrieved_data.episodes);
});

$.get('api/get/characters', function(data)
{
retrieved_data.characters = JSON.parse(data);
//console.log(retrieved_data.characters);
});

        }
      });

});


