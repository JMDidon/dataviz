window.addEventListener('DOMContentLoaded', initialize, false);


var retrieved_data 				= {};
	retrieved_data.moves 		= {};
	retrieved_data.houses 		= {};
	retrieved_data.places 		= {};
	retrieved_data.episodes 	= {};
	retrieved_data.characters 	= {};


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


/* Chargement de la timeline */
	function initialize()
	{
		var screenWidth 			= screen.width,
			graduations 			= Math.floor(screenWidth/30),
			initial_position_begin  = $('#cursor_begin').offset().left,
			initial_position_end 	= $('#cursor_end').offset().left,
			cursor_begin 			= document.getElementById('cursor_begin'),
			cursor_end				= document.getElementById('cursor_end'),
			episodeFound,
			posX,
			offset;
	
		// On prend la position de chaque élément et on l'enregistre dans l'attribut data-posX de chaque curseur
			initial_position_begin  = Math.round(initial_position_begin);
			initial_position_end	= Math.round(initial_position_end);
			cursor_begin.setAttribute('data-posX', initial_position_begin);
			cursor_end.setAttribute('data-posX', initial_position_end);
		
			$('#posBegin').text('Begin: ' + initial_position_begin);
			$('#posEnd').text('End: ' + initial_position_end);

		
		// Fonction pour rendre draggable les curseurs
			$('.draggable').draggable(
		    {
		    	grid: [graduations, 0],
		    	snap: true,
		    	snapMode: 'both',
		    	containment: 'html',
		    	cursor: 'pointer',
		        drag: function(){
		            offset = $(this).offset();
		            posX = offset.left;
		            posX = Math.round(posX);

		        // On détecte quel est le curseur que l'on drag
		            if(this.getAttribute('id') == 'cursor_begin')
		            {
		            	// On teste la valeur de posX du début par rapport à la fin
		            	$('#posBegin').text('Begin: '+posX);
		            	cursor_begin.setAttribute('data-posX', posX);
		            	if(parseInt(cursor_begin.getAttribute('data-posX'))+graduations > parseInt(cursor_end.getAttribute('data-posX')))
		            	{
		            		return false;
		            	}
		            	else
		            	{
		            		// Si c'est bon, on va chercher quel est l'épisode grâce aux données
		            		findFirstEpisode(initial_position_begin, posX, graduations);
		            	}
		            	// End if
		            }
		            else
		            {
		        		// Idem pour le curseur de fin
		            	$('#posEnd').text('End: '+posX);
		            	cursor_end.setAttribute('data-posX', posX);
		            	if(parseInt(cursor_end.getAttribute('data-posX')) < parseInt(cursor_begin.getAttribute('data-posX'))+graduations)
		            	{
		            		return false;
		            	}
		            	else
		            	{
		            		findLastEpisode(initial_position_end, posX, graduations);
		            	}
		            	// End if
		            } // End if
		        } // End drag
		    }); // End draggable
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


/* Find episodes */
	function findFirstEpisode(initial_position, posX, graduations)
	{
		var episode = Math.floor(((posX - initial_position)/graduations)+1); 
		var season  = 1;
		if (episode >= 11)
		{
			season++;
			episode = episode - 10;
			if (episode >= 11)
			{
				season++;
				episode = episode - 10;
			}
		}
		$('#identifierBegin').text('Épisode de début : S0'+season+'E'+episode);
		var episodeFound = 'S0'+season+'E'+episode;
		return episodeFound;
	}

	function findLastEpisode(initial_position, posX, graduations)
	{
		var episode = Math.floor(((posX - initial_position)/graduations)+10);
		/*console.log('initial_position : '+initial_position);
		console.log('posX : '+posX);
		console.log('episode : '+episode);*/
		var season  = 3;
		if (episode < 1)
		{
			season--;
			episode = episode + 10;
			if (episode < 1)
			{
				season--;
				episode = episode + 10;
			}
		}
		$('#identifierEnd').text('Épisode de fin : S0'+season+'E'+episode);
		var episodeFound = 'S0'+season+'E'+episode;
		return episodeFound;
	}