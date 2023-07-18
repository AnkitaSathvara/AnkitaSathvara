	$('#btnRun').click(function() {

		$.ajax({
			url: "libs/php/postalCodeCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#selCountry').val(),
				lang: $('#selLanguage').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtLat').html(result['data'][0]['lat']);
					$('#txtLong').html(result['data'][0]['lng']);
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});
