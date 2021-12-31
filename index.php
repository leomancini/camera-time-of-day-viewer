<!DOCTYPE HTML>
<html>
	<head>
		<title>Every Day</title>
		<link rel='stylesheet/less' href='resources/css/style.less?nocache=132543657'>
		<script src='//cdnjs.cloudflare.com/ajax/libs/less.js/3.11.1/less.min.js'></script>
		<meta name='viewport' content='width=device-width, initial-scale=1'>
	</head>
	<body>
		<div id='time'></div>
		<div id='controls'>
			<div id='sliders'>
				<div class='sliderOutputPair'>Hour: <span class='output' id='hour'></span><input type='range' min='00' max='23' value='12' class='slider' id='hour'></div>
				<div class='sliderOutputPair'>Minute: <span class='output' id='minute'></span><input type='range' min='00' max='59' value='00' class='slider' id='minute'></div>
			</div>
			<div id='buttons'>
                <div id='buttonsSet'>
                    <button id='sunrise'>Sunrise</button>
                    <button id='sunset'>Sunset</button>
                    <button id='solar_noon'>Solar Noon</button>
                    <button id='civil_twilight_begin'>Twilight AM</button>
                    <button id='civil_twilight_end'>Twilight PM</button>
                    <small>Powered by <a href='https://sunrise-sunset.org/api' target='_blank'>Sunrise-Sunset API</a></small>
                </div>
			</div>
		</div>
		<div id='spinner'></div>
		<div id='images'></div>
		<script src='resources/js/main.js'></script>
	</body>
</html>