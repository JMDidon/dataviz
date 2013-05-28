/* Chargement de la timeline */
	function initialize()
	{
		var screenWidth = screen.width;
		var graduations = Math.round(screenWidth/28);
		console.log(graduations);
		var initial_position = $('#cursor_begin').offset().left;
		initial_position = Math.round(initial_position);

		var posX, posY, offset;
		$('#cursor_begin').draggable(
	    {
	    	grid: [graduations, 0],
	    	snap: true,
	    	snapMode: 'both',
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
		var episode = ((posX - initial_position)/graduations)+1;
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
		console.log('S0'+season+'E'+episode);
	}
	
	
	
// Launch
  initialize();