/* https://github.com/LabMember-001  */


	// This configuration variable can be overwritten wherever you want later 
	// on as you wish or add your own site variables for user configuration.
let swmpConfig = {
	autoplay: 'true', // Autoplay media when launched by SWMP.
	loop: 'true', // Loop media when launched by SWMP.
	//jumpForward: 30, // Unfinished
	//jumpBackward: 10, // Unfinished
	volume: 60,
	theme: 'default', //Default theme
	themes: //All themes
		[
			['default', 'MPC Light'],
			['dark', 'MPC Dark'],
			['kurisu', 'Kurisumasu']
		]
}

if (localStorage.swmpVolume == undefined) {
	localStorage.swmpVolume = swmpConfig.volume;
} else {
	swmpConfig.volume = localStorage.swmpVolume;
}

if (localStorage.swmpTheme == undefined) {
	localStorage.swmpTheme = 'default';
} else {
	swmpConfig.theme = localStorage.swmpTheme;
}

if (localStorage.swmpAutoplay == undefined) {
	localStorage.swmpAutoplay = 'true';
} else {
	swmpConfig.autoplay = localStorage.swmpAutoplay;
}

if (localStorage.swmpLoop == undefined) {
	localStorage.swmpLoop = 'true';
} else {
	swmpConfig.loop = localStorage.swmpLoop;
}


// Add style to head when DOM is loaded.

window.addEventListener('DOMContentLoaded', (event) => {
if (!document.getElementById("swmp-stylesheet")) { // Don't bother injecting style on demo page.
var swmpStyle = document.createElement('style');
swmpStyle.innerHTML = `

/* INJECTED BY SWMP */
div.swmp {
	--swmp-background: #e6e6e6;
	--swmp-container-border: #000;
	--swmp-controls-background: var(--swmp-background);
	--swmp-text-color: #000;
	--swmp-button-background: var(--swmp-background);
	--swmp-button-mask-color: #000;

	--swmp-seek-height: 30px;
	--swmp-seek-offset: 10px;

	--swmp-seek-background: var(--swmp-controls-background);
	--swmp-seek-progress-color: lightgrey;
	--swmp-seek-border-left: darkgray;
	--swmp-seek-border-top: darkgray;
	--swmp-seek-border-right: #fff;
	--swmp-seek-border-bottom: #fff;

	--swmp-range-thumb-color: var(--swmp-controls-background);
	--swmp-range-thumb-border-left: #fff;
	--swmp-range-thumb-border-top: #fff;
	--swmp-range-thumb-border-right: #000;
	--swmp-range-thumb-border-bottom: #000;

	--swmp-btn-border-left: #fff;
	--swmp-btn-border-top: #fff;
	--swmp-btn-border-right: #000;
	--swmp-btn-border-bottom: #000;

	--swmp-btn-border-left-active: #000;
	--swmp-btn-border-top-active: #000;
	--swmp-btn-border-right-active: #fff;
	--swmp-btn-border-bottom-active: #fff;

}

div.swmp.theme-dark, div.swmp.theme-dark * {
	--swmp-background: #333;
	--swmp-container-border: #000;
	--swmp-controls-background: var(--swmp-background);
	--swmp-text-color: #888;
	--swmp-button-background: var(--swmp-background);
	--swmp-button-mask-color: #888;

	--swmp-seek-height: 30px;
	--swmp-seek-offset: 10px;

	--swmp-seek-progress-color: #555;
	--swmp-seek-border-left: #1a1a1a;
	--swmp-seek-border-top: #1a1a1a;
	--swmp-seek-border-right: #464646;
	--swmp-seek-border-bottom: #464646;

	--swmp-range-thumb-color: var(--swmp-background);
	--swmp-range-thumb-border-left: #777;
	--swmp-range-thumb-border-top: #777;
	--swmp-range-thumb-border-right: #000;
	--swmp-range-thumb-border-bottom: #000;

	--swmp-btn-border-left: #777;
	--swmp-btn-border-top: #777;
	--swmp-btn-border-right: #000;
	--swmp-btn-border-bottom: #000;

	--swmp-btn-border-left-active: #000;
	--swmp-btn-border-top-active: #000;
	--swmp-btn-border-right-active: #777;
	--swmp-btn-border-bottom-active: #777;
}

div.swmp.theme-kurisu, div.swmp.theme-kurisu * {
	--swmp-background: #a44242;
	--swmp-text-color: #fff;
	--swmp-button-mask-color: #fff;
}

div.swmp.demo-container {
	max-width:320px;
	height: auto;
	margin: auto;	
}

div.swmp.container {
	position: relative;
	display: inline-flex;
	flex-direction: column;
	padding: 2px;
	background: var(--swmp-background);
	font-family: -apple-system,BlinkMacSystemFont,URW Gothic, MS PGothic, Helvetica, sans-serif;
	font-size: 11pt;
	text-indent: 4px;
	letter-spacing: 1px;
	color: var(--swmp-text-color);
	border: 1px solid var(--swmp-container-border);
	line-height: 1; /* futaba/buri themes */
	z-index: 1;
	overflow: hidden;
	resize: horizontal;
	min-width: 320px;
	width: 320px;
	outline: none;
}

div.swmp.window.window-container {
	display: flex;
	justify-content: space-between;
	padding-bottom: 2px;
}

div.swmp.fullscreen div.window.window-container, div.swmp.fullscreen div.settings.settings-container {
	display: none;
}

div.swmp.minimized video {
	display: none;
}

div.swmp.fullscreen video {
	display: block;
}

span.swmp.window.window-titlebar {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-user-select: none;
	user-select: none;
	flex: 1 0 auto;
	max-width: 260px;
	position: relative;
	margin: auto;
	cursor: move;
}

span.swmp.window.window-buttons-contain {
	display: flex;
	flex: 0 1 auto;
}

div.swmp.container.audio {
	display: block;
}

div.swmp.video-container {
	max-width:320px;
	height: auto;	
}

div.swmp.container.fullscreen {
	background: #000;
	position: unset!important; /* more safari behavior junk */
	width: 100%;
	height: auto;

}

div.swmp.container.fullscreen video {
	width: auto;
	height: auto;
}

div.swmp video {
	width: 100%;
	height: auto;
}

div.swmp audio {
	min-width: 320px;
	min-height: 40px;
}

div.swmp.controls {
	bottom: 0;
	left: 0;
	background: var(--swmp-controls-background);
	width: 100%;
	display: flex;
	flex-direction: column;
}

div.swmp.fullscreen div.swmp.controls {
	position: absolute;
	opacity: 0;
	transition: opacity 1s 1s ease-out;
}

div.swmp.fullscreen div.swmp.controls:hover {
	opacity: 1;
	position: absolute;
	transition: none;
}

div.swmp.controls span.seek-container {
	display: flex;
	width: calc(100% - 6px);
	height: var(--swmp-seek-height);
	margin: auto;
	/*position: relative;*/
}

div.swmp.controls span.seek-container input.swmp.seeker {
	width: calc(100% - var(--swmp-seek-offset));
	left: calc(var(--swmp-seek-offset) / 2);
	-webkit-appearance: none;
	background: #0000;
	padding: 0;
	margin: 0;
	height: var(--swmp-seek-height);
	position: absolute;
	z-index: 1;
	cursor: pointer;
	-webkit-margin-top: -14px; /* webkit */
}

span.swmp input[type="range"]::-webkit-slider-runnable-track {
	width: 100%;
	height: 6px;
	cursor: pointer;
	background: #0000;
	border-radius: 0px;
	border: 1px solid #000;
	border-left-color: var(--swmp-seek-border-left);
	border-top-color: var(--swmp-seek-border-top);
	border-right-color: var(--swmp-seek-border-right);
	border-bottom-color: var(--swmp-seek-border-bottom);
}

span.swmp input[type="range"]::-moz-range-track {
	width: 100%;
	height: 6px;
	cursor: pointer;
	background: #0000;
	border-radius: 0px;
	border: 1px solid #000;
	border-left-color: var(--swmp-seek-border-left);
	border-top-color: var(--swmp-seek-border-top);
	border-right-color: var(--swmp-seek-border-right);
	border-bottom-color: var(--swmp-seek-border-bottom);
}

span.swmp progress::-webkit-progress-bar {
	background: #0000;
}

span.swmp progress::-webkit-progress-value {
	background: var(--swmp-seek-progress-color);
}

span.swmp progress::-moz-progress-bar {
	background: var(--swmp-seek-progress-color);
}

span.swmp input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	border: 4px solid var(--swmp-range-thumb-color);
	height: 8px;
	width: 2px;
	border-radius: 0;
	padding: 4px 3px;
	background: #0000;
	background: linear-gradient(180deg, var(--swmp-seek-border-top) 10%, var(--swmp-seek-background) 10%, var(--swmp-seek-background) 90%, var(--swmp-seek-border-bottom) 90%);
	cursor: pointer;
	margin-top: -6px;
	box-shadow: 1px 1px 0px 0px var(--swmp-range-thumb-border-bottom), -1px -1px 0px 0px var(--swmp-range-thumb-border-top);
}

span.swmp input[type="range"]::-moz-range-thumb {
	appearance: none;
	border: 4px solid var(--swmp-range-thumb-color);
	height: 8px;
	width: 6px;
	border-radius: 0;
	/*background: #0000;*/
	background: linear-gradient(180deg, var(--swmp-seek-border-top) 10%, var(--swmp-seek-background) 10%, var(--swmp-seek-background) 90%, var(--swmp-seek-border-bottom) 90%);
	cursor: pointer;
	box-shadow: 1px 1px 0px 0px var(--swmp-range-thumb-border-bottom), -1px -1px 0px 0px var(--swmp-range-thumb-border-top);
}

span.swmp input[type="range"]::-webkit-range-progress {
	height: 6px;
	background-color: #0000
}

span.swmp input[type="range"]::-moz-range-progress {
	height: 6px;
	background-color: #0000 
}

span.swmp progress.volume {
	width: 50px;
	position: absolute;
	height: 6px;
	right: 8px;
	border: none;
	bottom: 7px;
	z-index: 0;
	background: var(--swmp-seek-background);
}

span.swmp input.volume[type="range"] {
	-webkit-appearance: none;
	background: #0000;
	padding: 0;
	margin-left: 2px;
	cursor: pointer;
	position: relative;
}

span.swmp input.volume[type="range"]::-webkit-slider-thumb {
	padding: 4px 2px;
	width: 2px;
}

span.swmp input.volume[type="range"]::-moz-range-thumb {
	padding: 0 1px;
	width: 1px;
}

div.swmp.controls span.seek-container progress.swmp.progress {
	width: 100%;
	height: 6px;
	z-index: 0;
	position: relative;
	background: var(--swmp-seek-background);
	bottom: -12px;
	/*left: 5px;*/
	border: none;
}

span.swmp.row-bottom {
	display: flex;
	flex-direction: row;
	height: 20px;
	margin-bottom: 2px;
}

div.swmp.fullscreen span.swmp.row-bottom {
	padding-bottom: 5px;
}

span.swmp.buttons-container {
	height: 100%;
}

select.swmp.selector {
	-webkit-appearance: none;
	appearance: none;
	background: var(--swmp-button-background);
	border: 1px solid var(--swmp-text-color);
	color: var(--swmp-text-color);
	outline: none;
	border-radius: 0;
	width: 85px;
	overflow: hidden;
	text-overflow: ellipsis;
}

label.swmp.settings {
	display: inline-flex;
	flex-direction: row-reverse;
}

input.swmp.settings {
	margin: -2px 0 0 4px;
	border: 1px solid var(--swmp-text-color);
	appearance: none;
	-webkit-appearance: none;
	outline: none;
	width: 14px;
	height: 14px;
	background: var(--swmp-controls-background);
}

input.swmp.settings:checked {
	outline: 5px inset var(--swmp-text-color);
	outline-offset: -8px;
}

button.swmp.button {
	min-width: 26px;
	height: 100%;
	display: inline-block;
	cursor: pointer;
	margin-left: 2px;
	margin-right: 2px;
	color: var(--swmp-button-mask-color);
	background: var(--swmp-button-background);
	border: 1px solid;
	border-bottom-color: var(--swmp-btn-border-bottom);
	border-right-color: var(--swmp-btn-border-right);
	border-top-color: var(--swmp-btn-border-top);
	border-left-color: var(--swmp-btn-border-left);
	filter: unset; /* 4chan tomorrow theme buttons */
}

button.swmp.button span {
	display: block;
	width: 16px;
	height: 16px;
	image-rendering: pixelated;
	background-repeat: no-repeat;
	background-color: var(--swmp-button-mask-color);
	-webkit-mask-image: var(--image);
	mask-image: var(--image);
	-webkit-mask-size: 16px;
	mask-size: 16px;
	/*-webkit-mask-position-x: -2px;
	mask-position-x: 0;*/
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;

}

span.swmp.window button {
	height: 20px;
	min-width: 22px;
	width: 22px;
}

button.swmp.button.window-minimize span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVRYR+3V0Q0AMAQFQPYfuv7apAPg4yzguQQZw5XD/UMAAgQIECCwTuA0fcc7+C8gAIFxgaYleG3W3QECBAgQaBcokVQGIRA6KiEAAAAASUVORK5CYII=');
	margin-top: 2px;
	-webkit-mask-size: 12px;
	mask-size: 12px;
}

button.swmp.button.window-close span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9UlEQVRoge2Y2woCMRBD5699dB79a7ViQfDWaZNMFybQR5NzVndhNatUKpUjxe/nctT+Vn59HsYItf+1nDFC7f9Ujhyh9v8qR4xQ+0fKV0bY/XYKDERHIvDtnGcEWBIyeIaEHB4pkQaPkEiHnwXxyc9QE/0mtrjyCgkZfA9SQg7fg5BIg+9ZkUiH75mR2Aa+xS0uwHyzC8Vt/ieULuG2fhOnSfgA3LYSDoBOk2DAyySi8O1RyXyzo8P3pEuswKdLIODTJJDwcgkGvFQiMhKBV/UPj0yXC/r/jiyXC/q/jsDKBf1vI/ByQf8jbtz/bdj9lUqlAs4N+1iFrUSwCpcAAAAASUVORK5CYII=');
	margin-top: 2px;
	-webkit-mask-size: 12px;
	mask-size: 12px;
}

button.swmp.button.playbutton span {
	--image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8klEQVRoQ+3aMQ6DMAyF4XDycjCGVmrPBRmapVLkJLafn1GRMiHB/+EpEVtJfm3J+8vtAO86kb2uI8tkfidwfsM/WSA9QBsAPUQC0ENGAbSQWQAdZBVAA9ECwiFWgDCINQAO8QLAIN4AdwgK4AZBA8whUQAzSDRADWEBLEPYANMQVsAwhB0gQrIAupA/AHR60d2bs09APFRgBYjhbfJsgOFwNsB0OAtgOTwaoA6PApiFowHm4SiAW7g3wD3cCwALtwbAw60AYeFaQHj4KoAmfBZAFz4KoA2XAPThPcCz3njU9QJtFdWvud2vBuovgn5A+glcJSF8MQrukbIAAAAASUVORK5CYII=);
}

button.swmp.button.playbutton.playing span {
	--image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAtUlEQVRoQ+2Y2w6AIAxD5f8/2kuCRgiJbdjDMMfnxUE5o9WyLf6Uxde//W4D+8SJuGKE9OqbhrxUFCGkFxt4qQ1CInpX2SMWCIGQwc1ILBACIRBqFQixd1HUkF4MMUMs8taVESVGupFGDZpACIROBTCy5tOsMhGiijiMIb2IEkQJkTeihCAUUUIQ6S4hShAliBKVAZwYJzbuTn7ufoiFExs04cRpndg4xRyl7uDlWPWE+aTbwAFy3FQxPpmarQAAAABJRU5ErkJggg==);
}

button.swmp.button.stopbutton span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUUlEQVRYR+3Xuw0AIAwD0WQC2H9LJuDXICFqm+KywEWvc4b50tyP7x7oIpE6O221bgEeQAABBBBAAAEEEEAAAQTsAkW0jPYqei0jUf9k7ON0AGFsNSFlb3+JAAAAAElFTkSuQmCC');
}

button.swmp.button.fullscreen, .swmp.timer-container {
	margin-left: auto;
	cursor: default;
}

button.swmp.button.fullscreen span {
	--image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4T2NkoBAwQvX/x2EOQXmCCghZgG4AjE/IYzAXMw4jAwj5Gac8sYFG0AB4qBLplOEYCwOfF4gMfExlADQ3GBE+X9RsAAAAAElFTkSuQmCC');
}

button.swmp.button.volume span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAG1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABp4cHsAAAACHRSTlMA1WZ/JZz0Rme5O54AAACGSURBVDjL5ZIxCoAwDEWjVXDs6OjUWXDxRl6hqyL2H9uqKKL5oKtmzIOXNvkiP6qc9LOSAAciAoiIAAcdRNEGmrtoBQb1TbSCFt3eK3CUSAr0KliUlQbEA1YFCTCqID47qMAAwztAVXS4x2RfffC8kusSw7O100Px0/Iw0PjwwPGI0lB/s2bRbW7duVgj2wAAAABJRU5ErkJggg==')
}

button.swmp.button.volume.min span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAd0lEQVR42u2Xuw2AMAwFr41YhKmyVyp2YhZ6pwEJqJDgmRTv3PukV/gDxpjBKDRl+5mV0LWvbIRKUGjEXrJoZIIjGongHI1AcI3mc8E9mpeCeFwWWGCBBTqBfNj9MK4TFk7CykxZ+glnS8LhlXI6Akws/gCMGZAO8wpmVouK9vcAAAAASUVORK5CYII=')
}

button.swmp.button.volume.max span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEVHcEwAAAAAAAAAAAAAAADTrAj/AAAABXRSTlMA/4hD1KmiQHMAAACwSURBVDjL1ZPBDYMwDEV/nQzAIwwAVQdoNoD9l+qhgAyKW/VGfbHkp/wk9rf0//EI6sZ8Kqx5oj/U07IdgKcHlXfOcNAyVpCA4oU2oAqDF9pB9pcYK7hLAkYnBJKMUZqgc0IgaaJIFYp0Yw/JYJAy9CegBUZZA1SYlWA4gwxdExgUCWiA/mfQlgovj56bog/6loRN/Nz2w6CSG1Q82tgMoX1iw8UWDU0dr8HXxblwvAAGdxy1HX87LAAAAABJRU5ErkJggg==')
}

button.swmp.button.volume.mute span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACnRSTlMACZko0v9e9AufnFf4OQAAAJdJREFUeJzlkrsNgDAMRCMhL8BO6WluBmZha2LZDvmdRA1uUHi+S/xJ6Uexk/9bJuAEMcIabBmQQNLknFBw2KERFyMFcEEFalROMAlCaUYFWKoLBDU81wUdkCobgGbHDT0Q/06gSOJJA3hqeKmgd7BX0TpY5V2v2ibO3bW2L+YRg5on6KOtRT9AzdIy2PrwheMrmi4GPhk3sCZY/9usUnQAAAAASUVORK5CYII=')
}

span.swmp.volume-container {
	display: flex;
	width: 60px;
	height: 100%;
	position: relative;
}

span.swmp.volume-container input.swmp.volume.range {
	width: 50px;
	vertical-align: top;
	position: relative;
}

button.swmp.button:active {
	/*background: #cacaca;*/
	border-bottom-color: var(--swmp-btn-border-bottom-active);
	border-right-color: var(--swmp-btn-border-right-active);
	border-top-color: var(--swmp-btn-border-top-active);
	border-left-color: var(--swmp-btn-border-left-active);
}

button.swmp.button:focus {
	/*outline: 1px dotted var(--swmp-text-color);
	outline-offset: -3px;*/
}

span.swmp.timer-container {
	display: inline-table;
	margin-right: 5px;
}

span.swmp.timer-container span.swmp.time {
	display: table-cell;
	vertical-align: bottom;
}`;
document.querySelector("head").appendChild(swmpStyle);
}
});


// SWMP Code

class swmp {

	constructor(obj) {
		this.name = 'Simple Web Media Player';
		
		if (obj.id == undefined) {
		this.id = this.uuid();
		} else {
			this.id = obj.id;
		}

		this.type = obj.type; // "video" or "audio" player.
		this.mime = obj.mime; // MIME type for source, Example: "video/webm". Feed to enable checking for file support (webm not supported by iOS)
		this.url = obj.url; // File Location
		this.poster = obj.poster; // Optional Video Preview for when autoplay is off.
		this.autoplay = obj.autoplay; // Optional Autoplay
		this.loop = obj.loop // Optional Loop
		this.windowed = obj.windowed; // Optional set false to disable windowed mode and place inline
		
		this.defaultVolume = parseInt(swmpConfig.volume);

		if (this.url == undefined) {
			console.log('No media given');
			return false;
		}

		if (obj.title == undefined) {
			this.title = this.getFileName(obj.url);
		} else {
			this.title = obj.title; // If Applicable, assign from existing parameters on IB.
		}

		// Check URL for Type and Mime, also sets mime+type based on fileextension in url
		if (this.checkURL(this.url) == false) {
			return false;
		}

		// Create Container
		this.container = document.createElement('div');
		this.container.setAttribute('class', 'swmp container');
		this.container.setAttribute('id', this.id);
		this.container.setAttribute('tabindex', '0');

		// Create Player HTML5 Video or Audio format.
		if (this.type == 'video') {
			this.container.classList.add('video');
			this.player = document.createElement('video');
			this.player.setAttribute('class', 'swmp video player');
			if (this.poster != false && this.poster != undefined) {
				this.player.setAttribute('poster', this.poster);
			}
		} else if (this.type == 'audio') {
			this.container.classList.add('audio');
			this.player = document.createElement('audio');
			this.player.setAttribute('class', 'swmp audio player');
		} else {
			console.log(`SWMP Error: invalid type of ${this.type}.`);
			return false;
		}

		// Check Format Support
		if (this.mime != undefined) {
			if (this.player.canPlayType(this.mime) == '') {
				this.container.innerHTML = `Your browser can't play this format: ${this.mime}`;
				return false;
			}
		}

		// Add Theme
		if (swmpConfig.theme != undefined) {
			this.container.classList.add(`theme-${swmpConfig.theme}`)
		}

		// Create Window Container
		if (this.windowed != false) {
			this.windowContainer = document.createElement('div');
			this.windowContainer.setAttribute('class', 'swmp window window-container');
			this.container.appendChild(this.windowContainer);

				// Create Title/WindowDragbar and put inside Window Container
				this.windowTitlebar = document.createElement('span');
				this.windowTitlebar.setAttribute('class', 'swmp window window-titlebar');
				if (this.title != undefined) {
					this.windowTitlebar.innerHTML = `<span class="swmp window window-title">${this.title}</span>`;
				} else {		 // Maybe add extract filename only from external sites later?
					this.windowTitlebar.innerHTML = `<span class="swmp window window-title">${this.url}</span>`;
				}
				/*this.windowTitlebar.addEventListener("click", (event) => {
					alert('click');
				});*/
				this.windowContainer.appendChild(this.windowTitlebar);

				// Create Window Buttons Container
				this.windowButtonsContain = document.createElement('span');
				this.windowButtonsContain.setAttribute('class', 'swmp window window-buttons-contain');
				this.windowContainer.appendChild(this.windowButtonsContain);

				// Create Minimize Button (Video only)
				if (this.type == 'video') {
					this.windowMinimize = document.createElement('button');
					this.windowMinimize.setAttribute('class', 'swmp button window-minimize');
					this.windowMinimize.innerHTML = '<span></span>';
					this.windowMinimize.addEventListener('click', (event) => {
						event.preventDefault();
						if (this.container.classList.contains('minimized') ) {
							this.container.classList.remove('minimized');
						} else {
							this.container.classList.add('minimized');
						}
					});
					this.windowButtonsContain.appendChild(this.windowMinimize);
				}

				// Create Close Button
				this.windowClose = document.createElement('button');
				this.windowClose.setAttribute('class', 'swmp button window-close');
				this.windowClose.innerHTML = '<span></span>';
				this.windowClose.addEventListener('click', (event) => {
					event.preventDefault();
					this.container.remove();
				});
				this.windowButtonsContain.appendChild(this.windowClose);

				// Window Event
				this.makeDraggable(this.container);


				// Disable Default Context Menu on Titlebar
				this.windowTitlebar.addEventListener('contextmenu', function(evt) { 
				  evt.preventDefault();
				}, false);
				// Right Click Event
				this.windowTitlebar.addEventListener('mousedown', (event) => {
					event.preventDefault();
					switch (event.which) {
						case 3: //rightclick
						this.openSettings();
							break;	
					}
				});


		}


		// Preload metadata
		this.player.setAttribute('preload', 'metadata');

		// Put Player inside Container
		this.container.appendChild(this.player);

		// Create and put Source inside Player
		this.source = document.createElement('source');
		this.source.setAttribute('src', this.url);
		if (this.mime != undefined) {
			this.source.setAttribute('type', this.mime);
		}
		this.player.appendChild(this.source);

		// Is Autoplay?
		if ( (swmpConfig.autoplay == true || swmpConfig.autoplay == 'true') && this.autoplay != false) {
			this.player.setAttribute('autoplay', true);
		}

		// Is Loop?
		if ( (swmpConfig.loop == true || swmpConfig.loop == 'true') && this.loop != false) {
			this.player.setAttribute('loop', true);
		}

		// Create and put Controls inside Container
		this.controls = document.createElement('div');
		this.controls.setAttribute('class', 'swmp controls');
		this.container.appendChild(this.controls);

		// Disable Default Context Menu on Controls
		this.controls.addEventListener('contextmenu', function(evt) { 
		  evt.preventDefault();
		}, false);
		// Right Click Event
		this.controls.addEventListener('mousedown', (event) => {
			switch (event.which) {
				case 3: //rightclick
				this.openSettings();
					break;	
			}
		});

		// Create Progress/Seeker Container
		this.seekContain = document.createElement('span');
		this.seekContain.setAttribute('class', 'swmp seek-container');
		//this.seekContain.textContent = 'seek-cntnr';
		this.controls.appendChild(this.seekContain);

		// Create Progress Bar
		this.progress = document.createElement('progress');
		this.progress.setAttribute('value', '0');
		this.progress.setAttribute('min', '0');
		this.progress.setAttribute('max', '1000');
		this.progress.setAttribute('step', '1');
		this.progress.setAttribute('class', 'swmp progress');
		this.seekContain.appendChild(this.progress);

		// Create Seeker Input
		this.seeker = document.createElement('input');
		this.seeker.setAttribute('type', 'range');
		this.seeker.setAttribute('value', '0');
		this.seeker.setAttribute('min', '0');
		this.seeker.setAttribute('max', '1000');
		this.seeker.setAttribute('step', '1');
		this.seeker.setAttribute('class', 'swmp seeker');
		this.seekContain.appendChild(this.seeker);

		// Create a Row Bottom Container
		this.bottomRow = document.createElement('span');
		this.bottomRow.setAttribute('class', 'swmp row-bottom');
		this.controls.appendChild(this.bottomRow);

		// Create Buttons Container
		this.buttonsContain = document.createElement('span');
		this.buttonsContain.setAttribute('class', 'swmp buttons-container');
		this.bottomRow.appendChild(this.buttonsContain);

		// Create Play/Pause Button and put inside Controls
		this.playbutton = document.createElement('button');
		this.playbutton.setAttribute('class', 'swmp button playbutton');
		this.playbutton.innerHTML = "<span></span>" // ◀
		this.playbutton.addEventListener("click", event => {
			event.preventDefault();
			if (this.player.paused ) {
				this.player.play();
			} else {
				this.player.pause();
			}
		});
		this.buttonsContain.appendChild(this.playbutton);

		// Create a Stop/Reload Button and put inside Controls
		this.stopbutton = document.createElement('button');
		this.stopbutton.setAttribute('class', 'swmp button stopbutton');
		this.stopbutton.innerHTML = "<span></span>"; // ■
		this.stopbutton.addEventListener("click", event => {
			event.preventDefault();
			this.player.pause();
			this.seeker.value = 0;
			this.seeker.setAttribute("value", 0);
			this.progress.value = 0;
			this.progress.setAttribute("value", 0);
			this.player.currentTime = 0;
			this.currentTimer.textContent = '00:00';
		});
		this.buttonsContain.appendChild(this.stopbutton);

		// Create a Volume Container
		this.volumeContain = document.createElement('span');
		this.volumeContain.setAttribute('class', 'swmp volume-container');
		this.bottomRow.appendChild(this.volumeContain);

		// Create a Volume Button and put inside Buttons Container
		this.volumeButton = document.createElement('button');
		this.volumeButton.setAttribute('class', 'swmp button volume');
		this.volumeButton.innerHTML = "<span></span>";
		this.volumeButton.addEventListener("click", event => {
			event.preventDefault();
			this.toggleMute();
		});
		this.buttonsContain.appendChild(this.volumeButton);

		// Create a Volume Progress and put inside Volume Container
		this.volumeProgress = document.createElement('progress');
		this.volumeProgress.setAttribute('value', this.defaultVolume);
		this.volumeProgress.setAttribute('min', '0');
		this.volumeProgress.setAttribute('max', '100');
		this.volumeProgress.setAttribute('step', '1');
		this.volumeProgress.setAttribute('class', 'swmp volume progress');
		this.volumeContain.appendChild(this.volumeProgress);

		// Create a Volume Input and put inside Volume Container
		this.volumeRange = document.createElement('input');
		this.volumeRange.setAttribute('type', 'range');
		this.volumeRange.setAttribute('value', this.defaultVolume);
		this.volumeRange.setAttribute('min', '0');
		this.volumeRange.setAttribute('max', '100');
		this.volumeRange.setAttribute('step', '1');
		this.volumeRange.setAttribute('class', 'swmp volume range');
		this.volumeContain.appendChild(this.volumeRange);

		// Create a Timer Container and put inside Controls
		this.timerContain = document.createElement('span');
		this.timerContain.setAttribute('class', 'swmp timer-container');
		this.bottomRow.appendChild(this.timerContain);

		// Create a timerCurrent and put inside Timer Container
		this.currentTimer = document.createElement('span');
		this.currentTimer.setAttribute('class', 'swmp time current');
		this.currentTimer.textContent = '00:00';
		this.timerContain.appendChild(this.currentTimer);

		// Add a separator between timer
		this.timerSeperator = document.createElement('span');
		this.timerSeperator.setAttribute('class', 'swmp time separator');
		this.timerSeperator.textContent = '/';
		this.timerContain.appendChild(this.timerSeperator);

		// Create a totalTimer and put inside Timer Container
		this.totalTimer = document.createElement('span');
		this.totalTimer.setAttribute('class', 'swmp time total');
		this.totalTimer.textContent = '00:00';
		this.timerContain.appendChild(this.totalTimer);

		// Create a Fullscreen Button and put inside Bottom Row Container
		if (this.type == 'video') {
			this.fullscreenbutton = document.createElement('button');
			this.fullscreenbutton.setAttribute('class', 'swmp button fullscreen');
			this.fullscreenbutton.innerHTML = "<span></span>"; // ▣
			this.fullscreenbutton.addEventListener("click", event => {
				event.preventDefault();
				this.fullscreen(this.container);
			});
			this.bottomRow.appendChild(this.fullscreenbutton);
		}

		this.player.addEventListener('click', event => {
			this.togglePlay();
		});

		this.player.addEventListener('dblclick', event => {
			this.fullscreen(this.container);
		});

		this.container.addEventListener('keydown', event => {
			if (event.repeat) { return } // Don't spam

			switch(event.key) { 
				case ' ': //Space
					this.togglePlay();
					break;
				case 'f':
					this.fullscreen(this.container);
					break;
				case 'm':
					this.toggleMute();
					break;
				case 'x':
					this.container.remove();
					break;
				default:
					return;
			}

			event.preventDefault();

		}, true);

		this.player.onended = (event) => {
			this.player.classList.remove('playing');
			this.playbutton.classList.remove('playing');
			this.seeker.value = 0;
			this.progress.value = 0;
			clearInterval(this.player.interval);
			this.currentTimer.textContent = '00:00';
		};

		this.player.addEventListener('loadedmetadata', (event) => {
			this.totalTimer.textContent = this.formatSeconds(this.player.duration);
		});


		this.player.onplay = (event) => {
			this.player.classList.add('playing');
			this.playbutton.classList.add('playing');
			var self = this;
			this.player.interval = window.setInterval(function(event) {
				self.player.timeupdate()
			}, 40);
		};

		this.player.onpause = (event) => {
			this.player.classList.remove('playing');
			this.playbutton.classList.remove('playing');
			clearInterval(this.player.interval);
		};

		this.player.onerror = (event) => {
			clearInterval(this.player.interval);
			var _error = this.player.error.message;
			this.container.innerHTMl = _error;
		}

		this.player.timeupdate = (event) => {
			this.seeker.value = Math.floor(this.player.currentTime / this.player.duration * this.seeker.max);
			this.seeker.setAttribute("value", this.seeker.value);
			this.progress.value = this.seeker.value;
			this.progress.setAttribute("value", this.seeker.value);
			this.updateTimer();
		};

		this.seeker.oninput = (event) => {
			//on mousedown temporary add a mute to avoid annoying seeking sounds?
			this.player.currentTime = Math.floor(this.player.duration * this.seeker.value / this.seeker.max);
			this.progress.value = this.seeker.value;
			this.progress.setAttribute("value", this.seeker.value);
			this.updateTimer();
		};

		this.container.addEventListener('fullscreenchange', event => {
			const fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement;

			if (!fullscreenElement) {
				this.container.classList.remove('fullscreen');
			} else {
				this.container.classList.add('fullscreen');
			}
		});

		this.formatSeconds = (seconds) => {
			this._sec_num = parseInt(seconds, 10)
			this._hours   = Math.floor(this._sec_num / 3600)
			this._minutes = Math.floor(this._sec_num / 60) % 60
			this._seconds = this._sec_num % 60

		    return [this._hours,this._minutes,this._seconds]
		    	.map(v => v < 10 ? "0" + v : v)
		    	.filter((v,i) => v !== "00" || i > 0)
		    	.join(":")
		}

		this.updateTimer = () => {
			this.currentTimer.textContent = this.formatSeconds(this.player.currentTime);
			//this.totalTimer.textContent = this.formatSeconds(this.player.duration);
		}

		this.fullscreen = (element) => {
			const fullscreenElement =
			document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement;

			if (fullscreenElement) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen(); //Safari sucks
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				this.container.classList.remove('fullscreen');
			} else {
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
				this.container.classList.add('fullscreen');
			}
		}

		this.toggleMute = () => {
			if (this.player.muted) {
				this.volumeButton.classList.remove('mute');
				this.player.muted = false;
				this._volume = Math.floor(this.player.volume * 100);
				this.volumeRange.setAttribute('value', this._volume );
				this.volumeRange.value = this._volume;
				this.volumeProgress.setAttribute('value', this._volume );
				this.volumeProgress.value = this._volume;
			} else {
				this.volumeButton.classList.add('mute');
				this.player.muted = true;
				this.volumeRange.setAttribute('value', 0 );
				this.volumeRange.value = 0;
				this.volumeProgress.setAttribute('value', 0 );
				this.volumeProgress.value = 0;
			}
		}

		this.togglePlay = () => {
			if (this.player.paused ) {
				this.player.play();
			} else {
				this.player.pause();
			}			
		}

		this.updateVolume = (firstrun = false) => {

			this.volumeButton.classList.remove('mute');

			if (firstrun == true) {
				this.volumeRange.setAttribute('value', this.defaultVolume);
				this.volumeProgress.setAttribute('value', this.defaultVolume);
				this.playerVolume = this.defaultVolume;
				this.volumeButton.classList.add('min');
			}

			if (this.player.muted) {
				this.player.muted = false;
			}

			this.volumeRange.setAttribute('value', this.volumeRange.value );
			this.volumeProgress.setAttribute('value', this.volumeRange.value );
			this.player.volume = parseFloat(this.volumeRange.value / 100);

			if (this.player.volume > 0.50) {
				this.volumeButton.classList.add('max');
				this.volumeButton.classList.remove('med');
				this.volumeButton.classList.remove('min');
			} else if (this.player.volume > 0.10) {
				this.volumeButton.classList.add('med');
				this.volumeButton.classList.remove('max');
				this.volumeButton.classList.remove('min');
			} else if (this.player.volume > 0.05) {
				this.volumeButton.classList.add('min');
				this.volumeButton.classList.remove('max');
				this.volumeButton.classList.remove('med');
			}

			localStorage.swmpVolume = this.volumeRange.value;
			swmpConfig.volume = this.volumeRange.value;
		}

		this.volumeRange.oninput = (event) => {
			this.updateVolume();
		};

		this.player.addEventListener('volumechange', this.updateVolume() );

		this.updateVolume(true); // First time Run

		this.openSettings = () => {
			// Settings Menu

			if (this.container.querySelector('.settings-container') != null) {
				this.settingsContainer.remove();
				return false; //Already open
			}

			this.settingsContainer = document.createElement('div');
			this.settingsContainer.setAttribute('class', 'swmp settings settings-container');
			this.settingsContainer.innerHTML = 'Configuration:';
			this.container.appendChild(this.settingsContainer);

			/*// Create Close Settings Button
			this.settingsClose = document.createElement('button');
			this.settingsClose.setAttribute('class', 'swmp button settings settings-close');
			this.settingsClose.innerHTML = 'Close Settings';
			this.settingsClose.addEventListener('click', (event) => {
				this.settingsContainer.remove();
			});
			this.settingsContainer.appendChild(this.settingsClose);*/

			this.br = document.createElement('br');
			this.settingsContainer.appendChild(this.br);

			this.themeSelector = document.createElement('select');
			this.themeSelector.setAttribute('class', 'swmp selector settings theme-selector');

			this.themes = '';
			swmpConfig.themes.forEach(theme => {
				if (localStorage.swmpTheme == theme[0]) {
					this.themeSelector.value = theme[0];
					this.themes += `<option value="${theme[0]}" selected>${theme[1]}</option>`;
				} else {
					this.themes += `<option value="${theme[0]}">${theme[1]}</option>`;
				}
			});
			this.themeSelector.innerHTML = this.themes;

			this.themeSelector.onchange = (event) => {
				if (this.themeSelector.value == '') {
					return false;
				} else {
					this.removeClassByPrefix(this.container, 'theme-') //regex remove [theme-*]
					this.container.classList.add(`theme-${this.themeSelector.value}`);
					swmpConfig.theme = this.themeSelector.value;
					localStorage.swmpTheme = this.themeSelector.value;
				}
			}
			this.settingsContainer.appendChild(this.themeSelector);

			this.autoplayLabel = document.createElement('label');
			this.autoplayLabel.setAttribute('class', 'swmp settings label autoplay-label');
			this.autoplayLabel.textContent = 'Autoplay';
			this.autoplayCheck = document.createElement('input');
			this.autoplayCheck.setAttribute('class', 'swmp settings input autoplay-input');
			this.autoplayCheck.setAttribute('type', 'checkbox');
			if (localStorage.swmpAutoplay == 'true') {
				this.autoplayCheck.setAttribute('checked', 'checked');
			}
			this.autoplayCheck.addEventListener('change', (event) => {
				if (this.autoplayCheck.checked == true) {
					this.autoplayCheck.setAttribute('checked', 'checked');
					localStorage.swmpAutoplay = 'true';
				} else {
					this.autoplayCheck.removeAttribute('checked');
					localStorage.swmpAutoplay = 'false';
				}
			});
			this.autoplayLabel.appendChild(this.autoplayCheck);
			this.settingsContainer.appendChild(this.autoplayLabel);

			this.loopLabel = document.createElement('label');
			this.loopLabel.setAttribute('class', 'swmp settings label loop-label');
			this.loopLabel.textContent = 'Loop';
			this.loopCheck = document.createElement('input');
			this.loopCheck.setAttribute('class', 'swmp settings input loop-input');
			this.loopCheck.setAttribute('type', 'checkbox');
			if (localStorage.swmpLoop == 'true') {
				this.loopCheck.setAttribute('checked', 'checked');
			}
			this.loopCheck.addEventListener('change', (event) => {
				if (this.loopCheck.checked == true) {
					this.loopCheck.setAttribute('checked', 'checked');
					this.player.setAttribute('loop', 'true');
					localStorage.swmpLoop = 'true';
				} else {
					this.loopCheck.removeAttribute('checked');
					this.player.removeAttribute('loop');
					localStorage.swmpLoop = 'false';
				}
			});
			this.loopLabel.appendChild(this.loopCheck);
			this.settingsContainer.appendChild(this.loopLabel);
			

		}
	}

	removeClassByPrefix(el, prefix) {
		let pattern = '(' + prefix + '(\\s|(-)?(\\w*)(\\s)?)).*?';
		var regEx = new RegExp(pattern, 'g');
		el.className = el.className.replace(regEx, '');
	}

	// Probably gonna use imagenumber(multifile)+postnumber for ID to check if existing window is open
	uuid() {
		// Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
		var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });		
	    return uuid;
	}

		// Nice as this would be to use for some things since it's simpler...
		// I need to check fileext manually on most imageboards anyways to not waste requests.
		// Not needed for this script.
	/*getContentType(url) {
		var response = fetch(url, {
			method: 'HEAD',
			//mode: 'cors',
			cache: 'default',
			referrerPolicy: 'no-referrer'
		}).then( data => )
	}*/

	getFileName(url) {
		return url.split('/').pop().split('#')[0].split('?')[0];
	}

	checkURL(url) {
		// Check filename in URL for Type / MIME.
 		this.fileExt = url.split(/[#?]/)[0].split('.').pop().trim();
 		this.fileExt = this.fileExt.toLowerCase();

 		switch (this.fileExt) {
 				//VIDEO
 			case 'avi':
 				this.type = 'video';
 				this.mime = 'video/x-msvideo'
 				break;
 			case 'mpeg':
 				this.type = 'video';
 				this.mime = 'video/mpeg'
 				break;
 			case 'mpg':
 				this.type = 'video';
 				this.mime = 'video/mpeg'
 				break;
 			case 'ogv':
 				this.type = 'video';
 				this.mime = 'video/ogg'
 				break;
 			case 'mp4':
 				this.type = 'video';
 				this.mime = 'video/mp4'
 				break;
 			case 'webm':
 				this.type = 'video';
 				this.mime = 'video/webm'
 				break;
 				//AUDIO
 			case 'wav':
 				this.type = 'audio';
 				this.mime = 'audio/x-wav'
 				break;
 			case 'mp3':
 				this.type = 'audio';
 				this.mime = 'audio/mpeg'
 				break;
 			case 'm4a':
 				this.type = 'audio';
 				this.mime = 'audio/mp4'
 				break;
 			case 'mp2':
 				this.type = 'audio';
 				this.mime = 'audio/mpeg'
 				break;
 			case 'ogg':
 				this.type = 'audio';
 				this.mime = 'audio/ogg'
 				break;
 			default:
 				console.log('No matching ext/mime');
 				return false;
 		}
 		return true; //If valid
	}

		makeDraggable(elmnt) {
			var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
			elmnt.querySelector('.window-titlebar').onmousedown = dragMouseDown;
			elmnt.style.position = 'fixed';
			elmnt.style.top = '100px';
			elmnt.style.left = window.innerWidth - 600 + 'px';

			function dragMouseDown(e) {

				e = e || window.event;
				e.preventDefault();
				switch (e.which) {
					case 1: //leftclick
						pos3 = e.clientX;
						pos4 = e.clientY;
						document.onmouseup = closeDragElement;
						document.onmousemove = elementDrag;
						break;
					case 3: //rightclick
						break;	
				}
			}

			function elementDrag(e) {
				e = e || window.event;
				e.preventDefault();
				var winW = document.documentElement.clientWidth || document.body.clientWidth;
				var winH = document.documentElement.clientHeight || document.body.clientHeight;
				var maxX = winW - elmnt.offsetWidth - 1;
				var maxY = winH - elmnt.offsetHeight - 1;
				// calculate the new cursor position:
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;
				// set the element's new position:
				//console.log((elmnt.offsetLeft - pos1), maxY, (elmnt.offsetLeft - pos1), maxX);
				if((elmnt.offsetTop - pos2) <= maxY && (elmnt.offsetTop - pos2) >= 10){
					elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				}
				if((elmnt.offsetLeft - pos1) <= maxX && (elmnt.offsetLeft - pos1) >= 10){
					elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
				}
			}

			function closeDragElement() {
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}

}