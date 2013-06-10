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


/* Load timeline */
	function initialize()
	{
		var initial_position_begin  = $('#cursor_begin').offset().left,
			initial_position_end 	= $('#cursor_end').offset().left,
			cursor_begin 			= document.getElementById('cursor_begin'),
			cursor_end				= document.getElementById('cursor_end'),
			screenWidth 			= screen.availWidth,
			cursor_width			= cursor_begin.offsetWidth,
			graduations 			= Math.floor((screenWidth-cursor_width)/28),
			posX,
			offset;
	
		// We find the position of each cursor and we save it in the attribute "data-posX" of each cursor
			initial_position_begin  = Math.round(initial_position_begin);
			initial_position_end	= Math.round(initial_position_end);
			cursor_begin.setAttribute('data-posX', initial_position_begin);
			cursor_end.setAttribute('data-posX', initial_position_end);
		
			$('#posBegin').text('Begin: ' + initial_position_begin);
			$('#posEnd').text('End: ' + initial_position_end);

		
		// Make the cursors draggable
			$('.draggable').draggable(
		    {
		    	grid: [graduations, 0],
		    	snap: true,
		    	snapMode: 'both',
		    	containment: 'html',
		    	cursor: 'pointer',
		    	opacity: '0.5',
		    	drag: function() {
		    		offset = $(this).offset();
		            posX = offset.left;
		            posX = Math.round(posX);

		            // We verify which cursor is being dragged
			            if(this.getAttribute('id') == 'cursor_begin')
			            {
			            	$('#posBegin').text('Begin: '+posX);
			            	cursor_begin.setAttribute('data-posX', posX);

			            	// This condition verifies if cursor_begin is being dragged over the other cursor.
			            	// If that's the case, we push the second cursor.
				            	if(parseInt(cursor_begin.getAttribute('data-posX')) >= parseInt(cursor_end.getAttribute('data-posX'))-graduations)
					            {
					            	document.getElementById('cursor_end').style.left = (posX+graduations)+'px';
					            	cursor_end.setAttribute('data-posX', posX);
					            	findLastEpisode(initial_position_end, posX, graduations);
					            }
					        // We'll find the next episode
				            	findFirstEpisode(initial_position_begin, posX, graduations);
			            }
			            else
			            {
			            	$('#posEnd').text('End: '+posX);
			            	cursor_end.setAttribute('data-posX', posX);
			            	if (parseInt(cursor_end.getAttribute('data-posX')) <= parseInt(cursor_begin.getAttribute('data-posX'))+graduations)
				            {
				            	document.getElementById('cursor_begin').style.left = (posX-graduations)+'px';
				            	cursor_begin.setAttribute('data-posX', posX);
				            	findFirstEpisode(initial_position_begin, posX, graduations);
				            }
				            findLastEpisode(initial_position_end, posX, graduations);
			            } // End If
		        }   // End drag
		    }); // End draggable
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