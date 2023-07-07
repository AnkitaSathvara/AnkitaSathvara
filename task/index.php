<!doctype html>

<html lang="en">

	<head>

		<meta charset="utf-8">

		<title>AJAX/PHP/CURL/JSON example</title>
		<meta name="description" content="AJAX/PHP/CURL/JSON example">
		<meta name="author" content="Ankitaben Sathvara">

	</head>

	<body>

		<select id="selPostalcode">
			<option value="8775">8775</option>
			<option value="8774">8774</option>
			<option value="8772">8772</option>
			<option value="8784">8784</option>
		</select>

		<select id="selCountrycode">
			
			<option value="CH">CH</option>
		</select>


		<button id="btnRun">Run</button>

		<br><br>

		<div id="divResults">
			
			<table>

				<tr>
					<td align="right">
						Langitude: 
					</td>
					<td id="txtLangitude">
						
					</td>

				</tr>

				<tr>
					<td align="right">
						Latitude: 
					</td>
					<td id="txtLatitude">
						
					</td>

				</tr>

				

				
			</table>

		</div>

		<script type="application/javascript" src="libs/js/jquery-2.2.3.min.js"></script>
		<script type="application/javascript" src="libs/js/script.js"></script>

	</body>

</html>
