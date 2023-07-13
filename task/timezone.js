	$('#btnRun').click(function() {

		$.ajax({
			url: "libs/php/timezone.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#selCountry').val(),
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtLongitude').html(result['data'][0]['longitude']);
					$('#txtLatitude').html(result['data'][0]['latitude']);
				
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
