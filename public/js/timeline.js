window.addEventListener('DOMContentLoaded', initialize, false);


var retrieved_data 			= {};
retrieved_data.moves 		= {};
retrieved_data.houses 		= {};
retrieved_data.places 		= {};
retrieved_data.episodes 	= {};
retrieved_data.characters 	= {};


/* Chargement des infos des épisodes */
	$.get('api/get/moves', function(data)
	{
		retrieved_data.moves = JSON.parse(data);
		console.log(retrieved_data.moves);
	});

	$.get('api/get/houses', function(data)
	{
		retrieved_data.houses = JSON.parse(data);
		console.log(retrieved_data.houses);
	});

	$.get('api/get/places', function(data)
	{
		retrieved_data.places = JSON.parse(data);
		console.log(retrieved_data.places);
	});

	$.get('api/get/episodes', function(data)
	{
		retrieved_data.episodes = JSON.parse(data);
		console.log(retrieved_data.episodes);
	});

	$.get('api/get/characters', function(data)
	{
		retrieved_data.characters = JSON.parse(data);
		console.log(retrieved_data.characters);
	});




/* Chargement de la timeline */
	function initialize()
	{
		var screenWidth = screen.width;
		console.log(screenWidth);
		var graduations = Math.floor(screenWidth/30);
		var initial_position = $('#cursor_begin').offset().left;
		var episodeFound;
		initial_position = Math.round(initial_position);
		console.log(graduations);

		var posX, posY, offset;
		$('#cursor_begin').draggable(
	    {
	    	grid: [graduations, 0],
	    	snap: true,
	    	snapMode: 'both',
	    	containment: 'html',
	        drag: function(){
	            offset = $(this).offset();

	            posX = offset.left;
	            posY = offset.top;
	            posX = Math.round(posX);
	            posY = Math.round(posY);

	            $('#posX').text('X: ' + posX);
	            $('#posY').text('Y: ' + posY);

	            findEpisode(initial_position, posX, graduations);          
	        }
	    });

	    //getInfosEpisode(episodeFound);    
	}




/* Canvas */
	function changePersonagePosition()
	{
		var map_canvas = document.getElementById('map_canvas'),
			episode	   = 10,
			season	   = 3;

		// Always check for properties and methods, to make sure your code doesn't break in other browsers.
		if (map_canvas && map_canvas.getContext) 
		{
		  	// Get the 2d context.Remember: you can only initialize one context per element.
		  	var context = map_canvas.getContext('2d');
		  	if (context) 
		  	{
		   		// (posX, posY, width, height)
		   		context.fillRect(10, 100, 2, 100);
		   		//console.log('posX : '+posX);
		   		//console.log('posY : '+posY);
		  	}
		}
		else
		{
			console.log('Error : couldn\'t get context !');
		}
	}




/* Find episode */
	function findEpisode(initial_position, posX, graduations)
	{
		var episode = compteur = ((posX - initial_position)/graduations)+1;
		var season  = 1;
		if (episode >= 10)
		{
			season++;
			episode = episode - 9;
			if (episode >= 10)
			{
				season++;
				episode = episode - 9;
			}
		}
		$('#identifier').text('S0'+season+'E'+episode);
		var episodeFound = 'S0'+season+'E'+episode;
		return episodeFound;
	}