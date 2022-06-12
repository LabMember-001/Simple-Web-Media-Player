// ==UserScript==
// @name     4chan \ IB Media Player
// @description		Windowed and configurable media player for 4chan and other imageboards running vichan, tinyib, wakaba, lynxchan, and jschan.
// @author https://github.com/LabMember-001
// @version  1.0
// @grant    none

// @run-at      document-end

// @match https://*.(4chan|4channel).org/*
// @match https://*.(smuglo.li|smugloli.net)/*
// @match https://*.kissu.moe/*
// @match https://*.2kind.moe/*
// @match https://*.1chan.net/*
// @match https://*.otterchat.net/*
// @match https://*.fatchan.org/*
// @match https://*.7chan.org/*
// @match https://*.420chan.org/*
// @match https://*.anon.cafe/*

// @match https://*.archived.moe/*
// @match https://*.4plebs.org/*
// @match https://*.warosu.org/*

// @match https://*/*

// ==/UserScript==


// @match https://*/*
// Most of the sites above are purely to test scripts.

console.log('Loading IB Media Player.');

/* Repository:	 																						*/
/* https://github.com/LabMember-001/Simple-Web-Media-Player */
/* https://okabe.moe/projects/simplewebmediaplayer 					*/
/*																													*/
/*                                              						*/
/* 																													*/

/* 		== BOARD SUPPORT == 
// Script will alter behavior on different imageboard backends
// When adding custom board scripts, alter board behavior on bottom of the script. You'll need some knowledge on JS.
// In most cases, simply adding an @match to the top of this script to turn it on for that domain will work 
// as it captures all link presses and checks for webm.
// If you want more compatability, check the issue tracker for existing requests and if there are none, you may request help.
*/

/* 		== SCRIPT CONFIGURATION ==
// To define a board as a precoded backend type (vichan, tinyib, lynxchan, etc) simply
// add a regex for that domain in the swmpBoards category below these comments.
*/

/* 		== TO DO ==
//
// High priority
// - Resizing
//
// Medium Priority
// - Loading poster for large files
// - Make window move stop if you release mouseup outside of the screen.
// - Automatic backend script detection.
//
// Low Priority
// - Title length
// - Fix support for archived.moe redirection urls.
// - Fix the god damn & from player.php in vichan title.
// - Youtube support
// - Fix titles on some backends. (Mostly just vichan+4chan taking original filename right now).
*/

/* 		== Current Script Support ==
// Yotsuba (4chan)
// Tinyboard/Vichan/Infinity
// Fuuka
// TinyIB
// Wakaba
// FoolFuuka (Not archived.moe's redirects, but 4plebs is fine).
// Kusaba
*/

/* 	== Script Specific Bugs == 
// - Vichan shows original title when clicked on video thumb, but not link.
// - Doesnt grab titles on Fuuka, TinyIB, Wakaba, FoolFuuka
//
*/

/*
// 		== Missing Script Support ==
// Some Kusaba sites have issues loading video when clicked on thumbnail. Links typically work. 7chan is fine.
// Phutaba has a slight bug with videos which shows file information when hovering over player depending on which link you click.
// Some of the bigger Lynxchan sites are very modified and have no thumbnail click support.
// jschan and vichan will not properly work if not added to the board specific types. Should be fixable for me later.
// InfinityNext does not work. Don't care.
*/

 // Get domain
var currentUrl = window.location.href;

	// Board Types - probably temporary.
var swmpBoards = {
 	fourchan: // For title support, otherwise works well without adding here.
  		['https:\/\/*..*(4chan|4channel).org\/*'], 
  vichan:  // For Title and thumbnail click support. Not great without due to thumbnails.
  		['https:\/\/*..*(smuglo.li|smugloli.net)\/*', 
       'https:\/\/*..*2kind.moe\/*',
       'https:\/\/*..*kissu.moe\/*'], // Also works on new UI (lolnoty) as long as it's in here.
  tinyib: // Title support not written, otherwise works well without adding here.
  		['https:\/\/*..*1chan.net\/*'], 
  wakaba: // Title support not written, otherwise works well without adding here.
  		['https:\/\/*..*otterchat.net\/*'], 
  lynxchan: // Title support not written, otherwise works well without adding here.
  		['https:\/\/*..*anon.cafe\/*'], 
  jschan: // Title support not written. Jschan installations *must* be added here to work properly.
  		['https:\/\/*..*fatchan.org\/*'] 
}

	// regex to check the backend script of current domain
var backendScript = [];
Object.keys(swmpBoards).forEach(script => {
  swmpBoards[script].forEach(regex => {
    if (currentUrl.match(regex)) {
      backendScript = script;
    }
  })
});

console.log(backendScript);


	// This configuration variable can be overwritten wherever you want later 
	// on as you wish or add your own site variables for user configuration.
var swmpConfig = {
	autoplay: 'true', // Autoplay media when launched by SWMP.
	loop: 'true', // Loop media when launched by SWMP.
	positionTop: '100',
  positionOffset: '100',
  positionSide: 'right',
	volume: 60,
	theme: 'default', //Default theme
	themes: //All themes
		[
			['default', 'MPC Light'],
			['dark', 'MPC Dark'],
			['kurisu', 'Kurisumasu'],
      ['bluemoon', 'Blue Moon']
		],
	files: 'avi|mpeg|mpg|ogv|mp4|webm|wav|mp3|m4a|mp2|ogg',
  allowMultiple: 'false'
}

	// Initialize site configuration. As of now it's on a per site basis and not using GM values, I like different designs.
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

if (localStorage.swmpAllowMultiple == undefined) {
	localStorage.swmpAllowMultiple = 'false';
} else {
	swmpConfig.allowMultiple = localStorage.swmpAllowMultiple;
}


// Add style to head when DOM is loaded.

if (!document.getElementById("swmp-stylesheet")) { // Don't bother injecting style on demo page.
var swmpStyle = document.createElement('style');
swmpStyle.innerHTML = `

/* INJECTED BY SWMP / IB MEDIA PLAYER */
.swmp * {
	background: none;
	border: 0;
	outline: 0;
	margin: 0;
	padding: 0;
	line-height: 1;
	height: unset;
	width: unset;
	font-family: -apple-system,BlinkMacSystemFont,URW Gothic, MS PGothic, Helvetica, sans-serif;
	font-size: 11pt;
	text-indent: 4px;
	letter-spacing: 1px;
	color: var(--swmp-text-color);

}

div.swmp {
	--swmp-background: #e6e6e6;
	--swmp-container-border: #000;
	--swmp-player-container-background: #000;
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

div.swmp.swmp-theme-dark, div.swmp.swmp-theme-dark * {
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

div.swmp.swmp-theme-kurisu, div.swmp.swmp-theme-kurisu * {
	--swmp-background: #a44242;
	--swmp-text-color: #fff;
	--swmp-button-mask-color: #fff;
}

div.swmp.swmp-theme-bluemoon, div.swmp.swmp-theme-bluemoon * {
	--swmp-background: #272d37;
	--swmp-text-color: #eee;
	--swmp-button-mask-color: #d3d3d3;
	--swmp-controls-background: #49525D;
	--swmp-btn-border-left: #DDDDDD;
	--swmp-btn-border-top: #DDDDDD;
	--swmp-range-thumb-border-top: #ddd;
	--swmp-range-thumb-color: #272d37;
}

div.swmp.swmp-container {
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
	min-width: 320px;
	width: auto;
	outline: none;
}

div.swmp.swmp-window.swmp-window-container {
	display: flex;
	justify-content: space-between;
	padding-bottom: 2px;
}

div.swmp.swmp-fullscreen div.swmp-window.swmp-window-container, div.swmp.swmp-fullscreen div.swmp-settings.swmp-settings-container {
	display: none;
}

div.swmp.swmp-minimized video {
	display: none;
}

div.swmp.swmp-fullscreen video {
	display: block;
}

span.swmp.swmp-window.swmp-window-titlebar {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-user-select: none;
	user-select: none;
	position: relative;
	margin: auto;
	cursor: move;
	width: 100%;
	text-align: center;
	display: block;
}

span.swmp.swmp-window.swmp-window-title {
	display: block;
	max-width: 260px;
	text-overflow: ellipsis;
	overflow: hidden;
	margin: auto;
	line-height: 1.5;
	margin-bottom: -2px;
}

span.swmp.swmp-window.swmp-window-buttons-contain {
	display: flex;
	flex: 0 1 auto;
}

div.swmp .swmp-player-container {
	display: flex;
	height: 100%;
	background: var(--swmp-player-container-background);
}

div.swmp.swmp-container.swmp-audio {
	display: block;
}

div.swmp.swmp-container.swmp-fullscreen {
	background: #000;
	position: unset!important; /* more safari behavior junk */
	width: 100%;
	height: auto;

}

div.swmp.swmp-container.swmp-fullscreen video {
	width: 100%;
	height: auto;
	max-width: 100%;
	max-height: 100%;
}

div.swmp video {
	max-width: 500px;
	max-height: 500px;
	width: auto;
	height: auto;
	margin: auto;
}

div.swmp audio {
	min-width: 320px;
	min-height: 40px;
}

div.swmp.swmp-controls {
	bottom: 0;
	left: 0;
	background: var(--swmp-controls-background);
	width: 100%;
	display: flex;
	flex-direction: column;
}

div.swmp.swmp-fullscreen div.swmp.swmp-controls {
	position: absolute;
	opacity: 0;
	transition: opacity 0.5s 1s ease-out;
}

div.swmp.swmp-fullscreen div.swmp.swmp-controls:hover {
	opacity: 1;
	position: absolute;
	transition: none;
}

div.swmp.swmp-controls span.swmp-seek-container {
	display: flex;
	width: calc(100% - 6px);
	height: var(--swmp-seek-height);
	margin: auto;
	/*position: relative;*/
}

div.swmp.swmp-controls span.swmp-seek-container input.swmp.swmp-seeker {
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

span.swmp input[type="range"] {
	background: none;
	border: 0;
	outline: 0;
}

span.swmp progress.swmp-volume {
	width: 50px;
	position: absolute;
	height: 6px;
	right: 8px;
	border: none;
	bottom: 7px;
	z-index: 0;
	background: var(--swmp-seek-background);
}

span.swmp input.swmp-volume[type="range"] {
	-webkit-appearance: none;
	background: #0000;
	padding: 0;
	margin-left: 2px;
	cursor: pointer;
	position: relative;
}

span.swmp input.swmp-volume[type="range"]::-webkit-slider-thumb {
	padding: 4px 2px;
	width: 2px;
}

span.swmp input.swmp-volume[type="range"]::-moz-range-thumb {
	padding: 0 1px;
	width: 1px;
}

div.swmp.swmp-controls span.swmp-seek-container progress.swmp-progress {
	width: 100%;
	height: 6px;
	z-index: 0;
	position: relative;
	background: var(--swmp-seek-background);
	bottom: -12px;
	/*left: 5px;*/
	border: none;
}

span.swmp.swmp-row-bottom {
	display: flex;
	flex-direction: row;
	height: 20px;
	margin-bottom: 2px;
}

div.swmp.swmp-fullscreen span.swmp.swmp-row-bottom {
	padding-bottom: 5px;
}

span.swmp.swmp-buttons-container {
	height: 100%;
}

select.swmp.swmp-selector {
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

label.swmp.swmp-settings {
	display: inline-flex;
	flex-direction: row-reverse;
}

input.swmp.swmp-settings {
	margin: -2px 0 0 4px;
	border: 1px solid var(--swmp-text-color);
	appearance: none;
	-webkit-appearance: none;
	outline: none;
	width: 14px;
	height: 14px;
	background: var(--swmp-controls-background);
}

input.swmp.swmp-settings:checked {
	outline: 5px inset var(--swmp-text-color);
	outline-offset: -8px;
}

button.swmp.swmp-button {
	min-width: 26px;
	height: 100%;
	padding: 0 4px;
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

button.swmp.swmp-button span {
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

span.swmp.swmp-window button {
	height: 20px;
	min-width: 22px;
	width: 22px;
}

button.swmp.swmp-button.swmp-window-minimize span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVRYR+3V0Q0AMAQFQPYfuv7apAPg4yzguQQZw5XD/UMAAgQIECCwTuA0fcc7+C8gAIFxgaYleG3W3QECBAgQaBcokVQGIRA6KiEAAAAASUVORK5CYII=');
	margin-top: 2px;
	-webkit-mask-size: 12px;
	mask-size: 12px;
}

button.swmp.swmp-button.swmp-window-close span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9UlEQVRoge2Y2woCMRBD5699dB79a7ViQfDWaZNMFybQR5NzVndhNatUKpUjxe/nctT+Vn59HsYItf+1nDFC7f9Ujhyh9v8qR4xQ+0fKV0bY/XYKDERHIvDtnGcEWBIyeIaEHB4pkQaPkEiHnwXxyc9QE/0mtrjyCgkZfA9SQg7fg5BIg+9ZkUiH75mR2Aa+xS0uwHyzC8Vt/ieULuG2fhOnSfgA3LYSDoBOk2DAyySi8O1RyXyzo8P3pEuswKdLIODTJJDwcgkGvFQiMhKBV/UPj0yXC/r/jiyXC/q/jsDKBf1vI/ByQf8jbtz/bdj9lUqlAs4N+1iFrUSwCpcAAAAASUVORK5CYII=');
	margin-top: 2px;
	-webkit-mask-size: 12px;
	mask-size: 12px;
}

button.swmp.swmp-button.swmp-playbutton span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8klEQVRoQ+3aMQ6DMAyF4XDycjCGVmrPBRmapVLkJLafn1GRMiHB/+EpEVtJfm3J+8vtAO86kb2uI8tkfidwfsM/WSA9QBsAPUQC0ENGAbSQWQAdZBVAA9ECwiFWgDCINQAO8QLAIN4AdwgK4AZBA8whUQAzSDRADWEBLEPYANMQVsAwhB0gQrIAupA/AHR60d2bs09APFRgBYjhbfJsgOFwNsB0OAtgOTwaoA6PApiFowHm4SiAW7g3wD3cCwALtwbAw60AYeFaQHj4KoAmfBZAFz4KoA2XAPThPcCz3njU9QJtFdWvud2vBuovgn5A+glcJSF8MQrukbIAAAAASUVORK5CYII=');
}

button.swmp.swmp-button.swmp-playbutton.swmp-playing span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAtUlEQVRoQ+2Y2w6AIAxD5f8/2kuCRgiJbdjDMMfnxUE5o9WyLf6Uxde//W4D+8SJuGKE9OqbhrxUFCGkFxt4qQ1CInpX2SMWCIGQwc1ILBACIRBqFQixd1HUkF4MMUMs8taVESVGupFGDZpACIROBTCy5tOsMhGiijiMIb2IEkQJkTeihCAUUUIQ6S4hShAliBKVAZwYJzbuTn7ufoiFExs04cRpndg4xRyl7uDlWPWE+aTbwAFy3FQxPpmarQAAAABJRU5ErkJggg==');
}

button.swmp.swmp-button.swmp-stopbutton span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUUlEQVRYR+3Xuw0AIAwD0WQC2H9LJuDXICFqm+KywEWvc4b50tyP7x7oIpE6O221bgEeQAABBBBAAAEEEEAAAQTsAkW0jPYqei0jUf9k7ON0AGFsNSFlb3+JAAAAAElFTkSuQmCC');
}

button.swmp.swmp-button.swmp-fullscreen, .swmp.swmp-timer-container {
	margin-left: auto;
}

button.swmp.swmp-button.swmp-fullscreen span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4T2NkoBAwQvX/x2EOQXmCCghZgG4AjE/IYzAXMw4jAwj5Gac8sYFG0AB4qBLplOEYCwOfF4gMfExlADQ3GBE+X9RsAAAAAElFTkSuQmCC');
}

button.swmp.swmp-button.swmp-volume span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAG1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABp4cHsAAAACHRSTlMA1WZ/JZz0Rme5O54AAACGSURBVDjL5ZIxCoAwDEWjVXDs6OjUWXDxRl6hqyL2H9uqKKL5oKtmzIOXNvkiP6qc9LOSAAciAoiIAAcdRNEGmrtoBQb1TbSCFt3eK3CUSAr0KliUlQbEA1YFCTCqID47qMAAwztAVXS4x2RfffC8kusSw7O100Px0/Iw0PjwwPGI0lB/s2bRbW7duVgj2wAAAABJRU5ErkJggg==')
}

button.swmp.swmp-button.swmp-volume.swmp-min span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAd0lEQVR42u2Xuw2AMAwFr41YhKmyVyp2YhZ6pwEJqJDgmRTv3PukV/gDxpjBKDRl+5mV0LWvbIRKUGjEXrJoZIIjGongHI1AcI3mc8E9mpeCeFwWWGCBBTqBfNj9MK4TFk7CykxZ+glnS8LhlXI6Akws/gCMGZAO8wpmVouK9vcAAAAASUVORK5CYII=')
}

button.swmp.swmp-button.swmp-volume.swmp-max span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEVHcEwAAAAAAAAAAAAAAADTrAj/AAAABXRSTlMA/4hD1KmiQHMAAACwSURBVDjL1ZPBDYMwDEV/nQzAIwwAVQdoNoD9l+qhgAyKW/VGfbHkp/wk9rf0//EI6sZ8Kqx5oj/U07IdgKcHlXfOcNAyVpCA4oU2oAqDF9pB9pcYK7hLAkYnBJKMUZqgc0IgaaJIFYp0Yw/JYJAy9CegBUZZA1SYlWA4gwxdExgUCWiA/mfQlgovj56bog/6loRN/Nz2w6CSG1Q82tgMoX1iw8UWDU0dr8HXxblwvAAGdxy1HX87LAAAAABJRU5ErkJggg==')
}

button.swmp.swmp-button.swmp-volume.swmp-mute span {
	--image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACnRSTlMACZko0v9e9AufnFf4OQAAAJdJREFUeJzlkrsNgDAMRCMhL8BO6WluBmZha2LZDvmdRA1uUHi+S/xJ6Uexk/9bJuAEMcIabBmQQNLknFBw2KERFyMFcEEFalROMAlCaUYFWKoLBDU81wUdkCobgGbHDT0Q/06gSOJJA3hqeKmgd7BX0TpY5V2v2ibO3bW2L+YRg5on6KOtRT9AzdIy2PrwheMrmi4GPhk3sCZY/9usUnQAAAAASUVORK5CYII=')
}

span.swmp.swmp-volume-container {
	display: flex;
	width: 60px;
	height: 100%;
	position: relative;
}

span.swmp.swmp-volume-container input.swmp.swmp-volume.swmp-range {
	width: 50px;
	vertical-align: top;
	position: relative;
}

button.swmp.swmp-button:active {
	/*background: #cacaca;*/
	border-bottom-color: var(--swmp-btn-border-bottom-active);
	border-right-color: var(--swmp-btn-border-right-active);
	border-top-color: var(--swmp-btn-border-top-active);
	border-left-color: var(--swmp-btn-border-left-active);
}

button.swmp.swmp-button:focus {
	/*outline: 1px dotted var(--swmp-text-color);
	outline-offset: -3px;*/
}

span.swmp.swmp-timer-container {
	display: inline-table;
	margin-right: 5px;
	cursor: default;
}

span.swmp.swmp-timer-container span.swmp.swmp-time {
	display: table-cell;
	vertical-align: bottom;
}`;
document.querySelector("head").appendChild(swmpStyle);
}


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
		this.container.setAttribute('class', 'swmp swmp-container');
		this.container.setAttribute('id', this.id);
		this.container.setAttribute('tabindex', '0');

		// Create Player HTML5 Video or Audio format.
		if (this.type == 'video') {
			this.container.classList.add('video');
			this.player = document.createElement('video');
			this.player.setAttribute('class', 'swmp swmp-video swmp-player');
			if (this.poster != false && this.poster != undefined) {
				this.player.setAttribute('poster', this.poster);
			}
		} else if (this.type == 'audio') {
			this.container.classList.add('audio');
			this.player = document.createElement('audio');
			this.player.setAttribute('class', 'swmp swmp-audio swmp-player');
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
			this.container.classList.add(`swmp-theme-${swmpConfig.theme}`)
		}

		// Create Window Container
		if (this.windowed != false) {
			this.windowContainer = document.createElement('div');
			this.windowContainer.setAttribute('class', 'swmp swmp-window swmp-window-container');
			this.container.appendChild(this.windowContainer);

				// Create Title/WindowDragbar and put inside Window Container
				this.windowTitlebar = document.createElement('span');
				this.windowTitlebar.setAttribute('class', 'swmp swmp-window swmp-window-titlebar');
				if (this.title != undefined) {
					this.windowTitlebar.innerHTML = `<span class="swmp swmp-window swmp-window-title">${this.title}</span>`;
				} else {		 // Maybe add extract filename only from external sites later?
					this.windowTitlebar.innerHTML = `<span class="swmp swmp-window swmp-window-title">${this.url}</span>`;
				}
				/*this.windowTitlebar.addEventListener("click", (event) => {
					alert('click');
				});*/
				this.windowContainer.appendChild(this.windowTitlebar);

				// Create Window Buttons Container
				this.windowButtonsContain = document.createElement('span');
				this.windowButtonsContain.setAttribute('class', 'swmp swmp-window swmp-window-buttons-contain');
				this.windowContainer.appendChild(this.windowButtonsContain);

				// Create Minimize Button (Video only)
				if (this.type == 'video') {
					this.windowMinimize = document.createElement('button');
					this.windowMinimize.setAttribute('class', 'swmp swmp-button swmp-window-minimize');
					this.windowMinimize.innerHTML = '<span></span>';
					this.windowMinimize.addEventListener('click', (event) => {
						event.preventDefault();
						if (this.container.classList.contains('swmp-minimized') ) {
							this.container.classList.remove('swmp-minimized');
						} else {
							this.container.classList.add('swmp-minimized');
						}
					});
					this.windowButtonsContain.appendChild(this.windowMinimize);
				}

				// Create Close Button
				this.windowClose = document.createElement('button');
				this.windowClose.setAttribute('class', 'swmp swmp-button swmp-window-close');
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

    
    // Create Player Container and Put inside Container
    this.playerContainer = document.createElement('div');
    this.playerContainer.setAttribute('class', 'swmp-player-container');
    this.container.appendChild(this.playerContainer);
    
		// Put Player inside Video Container
		this.playerContainer.appendChild(this.player);

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
		this.controls.setAttribute('class', 'swmp swmp-controls');
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
		this.seekContain.setAttribute('class', 'swmp swmp-seek-container');
		//this.seekContain.textContent = 'seek-cntnr';
		this.controls.appendChild(this.seekContain);

		// Create Progress Bar
		this.progress = document.createElement('progress');
		this.progress.setAttribute('value', '0');
		this.progress.setAttribute('min', '0');
		this.progress.setAttribute('max', '1000');
		this.progress.setAttribute('step', '1');
		this.progress.setAttribute('class', 'swmp swmp-progress');
		this.seekContain.appendChild(this.progress);

		// Create Seeker Input
		this.seeker = document.createElement('input');
		this.seeker.setAttribute('type', 'range');
		this.seeker.setAttribute('value', '0');
		this.seeker.setAttribute('min', '0');
		this.seeker.setAttribute('max', '1000');
		this.seeker.setAttribute('step', '1');
		this.seeker.setAttribute('class', 'swmp swmp-seeker');
		this.seekContain.appendChild(this.seeker);

		// Create a Row Bottom Container
		this.bottomRow = document.createElement('span');
		this.bottomRow.setAttribute('class', 'swmp swmp-row-bottom');
		this.controls.appendChild(this.bottomRow);

		// Create Buttons Container
		this.buttonsContain = document.createElement('span');
		this.buttonsContain.setAttribute('class', 'swmp swmp-buttons-container');
		this.bottomRow.appendChild(this.buttonsContain);

		// Create Play/Pause Button and put inside Controls
		this.playbutton = document.createElement('button');
		this.playbutton.setAttribute('class', 'swmp swmp-button swmp-playbutton');
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
		this.stopbutton.setAttribute('class', 'swmp swmp-button swmp-stopbutton');
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
		this.volumeContain.setAttribute('class', 'swmp swmp-volume-container');
		this.bottomRow.appendChild(this.volumeContain);

		// Create a Volume Button and put inside Buttons Container
		this.volumeButton = document.createElement('button');
		this.volumeButton.setAttribute('class', 'swmp swmp-button swmp-volume');
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
		this.volumeProgress.setAttribute('class', 'swmp swmp-volume swmp-progress');
		this.volumeContain.appendChild(this.volumeProgress);

		// Create a Volume Input and put inside Volume Container
		this.volumeRange = document.createElement('input');
		this.volumeRange.setAttribute('type', 'range');
		this.volumeRange.setAttribute('value', this.defaultVolume);
		this.volumeRange.setAttribute('min', '0');
		this.volumeRange.setAttribute('max', '100');
		this.volumeRange.setAttribute('step', '1');
		this.volumeRange.setAttribute('class', 'swmp swmp-volume swmp-range');
		this.volumeContain.appendChild(this.volumeRange);

		// Create a Timer Container and put inside Controls
		this.timerContain = document.createElement('span');
		this.timerContain.setAttribute('class', 'swmp swmp-timer-container');
		this.bottomRow.appendChild(this.timerContain);

		// Create a timerCurrent and put inside Timer Container
		this.currentTimer = document.createElement('span');
		this.currentTimer.setAttribute('class', 'swmp swmp-time swmp-current');
		this.currentTimer.textContent = '00:00';
		this.timerContain.appendChild(this.currentTimer);

		// Add a separator between timer
		this.timerSeperator = document.createElement('span');
		this.timerSeperator.setAttribute('class', 'swmp swmp-time swmp-separator');
		this.timerSeperator.textContent = '/';
		this.timerContain.appendChild(this.timerSeperator);

		// Create a totalTimer and put inside Timer Container
		this.totalTimer = document.createElement('span');
		this.totalTimer.setAttribute('class', 'swmp swmp-time swmp-total');
		this.totalTimer.textContent = '00:00';
		this.timerContain.appendChild(this.totalTimer);

		// Create a Fullscreen Button and put inside Bottom Row Container
		if (this.type == 'video') {
			this.fullscreenbutton = document.createElement('button');
			this.fullscreenbutton.setAttribute('class', 'swmp swmp-button swmp-fullscreen');
			this.fullscreenbutton.innerHTML = "<span></span>"; // ▣
			this.fullscreenbutton.addEventListener("click", event => {
				event.preventDefault();
				this.fullscreen(this.container);
			});
			this.bottomRow.appendChild(this.fullscreenbutton);
		}

		this.playerContainer.addEventListener('click', event => {
			this.togglePlay();
		});

		this.playerContainer.addEventListener('dblclick', event => {
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
			this.player.classList.remove('swmp-playing');
			this.playbutton.classList.remove('swmp-playing');
			this.seeker.value = 0;
			this.progress.value = 0;
			clearInterval(this.player.interval);
			this.currentTimer.textContent = '00:00';
		};

		this.player.addEventListener('loadedmetadata', (event) => {
			this.totalTimer.textContent = this.formatSeconds(this.player.duration);
		});


		this.player.onplay = (event) => {
			this.player.classList.add('swmp-playing');
			this.playbutton.classList.add('swmp-playing');
			var self = this;
			this.player.interval = window.setInterval(function(event) {
				self.player.timeupdate()
			}, 40);
		};

		this.player.onpause = (event) => {
			this.player.classList.remove('swmp-playing');
			this.playbutton.classList.remove('swmp-playing');
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
				this.container.classList.remove('swmp-fullscreen');
			} else {
				this.container.classList.add('swmp-fullscreen');
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
				this.container.classList.remove('swmp-fullscreen');
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
				this.container.classList.add('swmp-fullscreen');
			}
		}

		this.toggleMute = () => {
			if (this.player.muted) {
				this.volumeButton.classList.remove('swmp-mute');
				this.player.muted = false;
				this._volume = Math.floor(this.player.volume * 100);
				this.volumeRange.setAttribute('value', this._volume );
				this.volumeRange.value = this._volume;
				this.volumeProgress.setAttribute('value', this._volume );
				this.volumeProgress.value = this._volume;
			} else {
				this.volumeButton.classList.add('swmp-mute');
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

			this.volumeButton.classList.remove('swmp-mute');

			if (firstrun == true) {
				this.volumeRange.setAttribute('value', this.defaultVolume);
				this.volumeProgress.setAttribute('value', this.defaultVolume);
				this.playerVolume = this.defaultVolume;
				this.volumeButton.classList.add('swmp-min');
			}

			if (this.player.muted) {
				this.player.muted = false;
			}

			this.volumeRange.setAttribute('value', this.volumeRange.value );
			this.volumeProgress.setAttribute('value', this.volumeRange.value );
			this.player.volume = parseFloat(this.volumeRange.value / 100);

			if (this.player.volume > 0.50) {
				this.volumeButton.classList.add('swmp-max');
				this.volumeButton.classList.remove('swmp-med');
				this.volumeButton.classList.remove('swmp-min');
			} else if (this.player.volume > 0.10) {
				this.volumeButton.classList.add('swmp-med');
				this.volumeButton.classList.remove('swmp-max');
				this.volumeButton.classList.remove('swmp-min');
			} else if (this.player.volume > 0.05) {
				this.volumeButton.classList.add('swmp-min');
				this.volumeButton.classList.remove('swmp-max');
				this.volumeButton.classList.remove('swmp-med');
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

			if (this.container.querySelector('.swmp-settings-container') != null) {
				this.settingsContainer.remove();
				return false; //Already open
			}

			this.settingsContainer = document.createElement('div');
			this.settingsContainer.setAttribute('class', 'swmp swmp-settings swmp-settings-container');
			this.settingsContainer.innerHTML = 'Settings:';
			this.container.appendChild(this.settingsContainer); //maybe move this after buttons tbh

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
			this.themeSelector.setAttribute('class', 'swmp swmp-selector swmp-settings swmp-theme-selector');

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
					this.removeClassByPrefix(this.container, 'swmp-theme-') //regex remove [theme-*]
					this.container.classList.add(`swmp-theme-${this.themeSelector.value}`);
					swmpConfig.theme = this.themeSelector.value;
					localStorage.swmpTheme = this.themeSelector.value;
				}
			}
			this.settingsContainer.appendChild(this.themeSelector);

      
      	// Autoplay Settings
			this.autoplayLabel = document.createElement('label');
			this.autoplayLabel.setAttribute('class', 'swmp swmp-settings swmp-label swmp-autoplay-label');
			this.autoplayLabel.textContent = 'Autoplay';
			this.autoplayCheck = document.createElement('input');
			this.autoplayCheck.setAttribute('class', 'swmp swmp-settings swmp-input swmp-autoplay-input');
			this.autoplayCheck.setAttribute('type', 'checkbox');
			if (localStorage.swmpAutoplay == 'true') {
				this.autoplayCheck.setAttribute('checked', 'checked');
			}
			this.autoplayCheck.addEventListener('change', (event) => {
				if (this.autoplayCheck.checked == true) {
					this.autoplayCheck.setAttribute('checked', 'checked');
					localStorage.swmpAutoplay = 'true';
          swmpConfig.autoplay = 'true';
				} else {
					this.autoplayCheck.removeAttribute('checked');
					localStorage.swmpAutoplay = 'false';
          swmpConfig.autoplay = 'false';
				}
			});
			this.autoplayLabel.appendChild(this.autoplayCheck);
			this.settingsContainer.appendChild(this.autoplayLabel);

      	// Loop Settings
			this.loopLabel = document.createElement('label');
			this.loopLabel.setAttribute('class', 'swmp swmp-settings swmp-label swmp-loop-label');
			this.loopLabel.textContent = 'Loop';
			this.loopCheck = document.createElement('input');
			this.loopCheck.setAttribute('class', 'swmp swmp-settings swmp-input swmp-loop-input');
			this.loopCheck.setAttribute('type', 'checkbox');
			if (localStorage.swmpLoop == 'true') {
				this.loopCheck.setAttribute('checked', 'checked');
			}
			this.loopCheck.addEventListener('change', (event) => {
				if (this.loopCheck.checked == true) {
					this.loopCheck.setAttribute('checked', 'checked');
					this.player.setAttribute('loop', 'true');
					localStorage.swmpLoop = 'true';
          swmpConfig.loop = 'true';
				} else {
					this.loopCheck.removeAttribute('checked');
					this.player.removeAttribute('loop');
          localStorage.swmpLoop = 'false';
					swmpConfig.loop = 'false';
				}
			});
			this.loopLabel.appendChild(this.loopCheck);
			this.settingsContainer.appendChild(this.loopLabel);
      
      	// Multiple Players Settings
			this.multiLabel = document.createElement('label');
			this.multiLabel.setAttribute('class', 'swmp swmp-settings swmp-label swmp-multi-label');
			this.multiLabel.textContent = 'Multi';
			this.multiCheck = document.createElement('input');
			this.multiCheck.setAttribute('class', 'swmp swmp-settings swmp-input swmp-multi-input');
			this.multiCheck.setAttribute('type', 'checkbox');
			if (localStorage.swmpAllowMultiple == 'true') {
				this.multiCheck.setAttribute('checked', 'checked');
			}
			this.multiCheck.addEventListener('change', (event) => {
				if (this.multiCheck.checked == true) {
					this.multiCheck.setAttribute('checked', 'checked');
					localStorage.swmpAllowMultiple = 'true';
          swmpConfig.allowMultiple = 'true';
				} else {
					this.multiCheck.removeAttribute('checked');
					localStorage.swmpAllowMultiple = 'false';
          swmpConfig.allowMultiple = 'false';
				}
			});
			this.multiLabel.appendChild(this.multiCheck);
			this.settingsContainer.appendChild(this.multiLabel);
			

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
 		this.fileExt = url.split(/[#?&]/)[0].split('.').pop().trim();
    this.fileExt = url.split(/[#?&]/).slice(-2)[0].split('.').pop().trim();
    
    
    console.log(this.fileExt);
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
        console.log(this.fileExt);
 				return false;
 		}
 		return true; //If valid
	}

  makeDraggable (element){
   var elm = this.windowTitlebar;

       element.style.position = 'fixed';
       element.style.top = swmpConfig.positionTop + 'px';
       
       if (swmpConfig.positionSide == 'right') {
         element.style.right = swmpConfig.positionOffset + 'px';
       } else {
         element.style.left = swmpConfig.positionOffset + 'px';
       }

    var isMouseDown = false,
        mouseX,
        mouseY,
        elmTop,
        elmLeft,
        diffX,
        newElmTop,
        newElmLeft,
        diffY,
        rightBarrier,
        bottomBarrier;

    var containerWidth = window.innerWidth;
    var containerHeight = window.innerHeight;
    if (swmpConfig.positionSide == 'right') {
      var elmWidth = 0;
    } else {
      var elmWidth = element.offsetWidth;
    }
    var elmHeight = element.offsetHeight;


    function mouseDown(e) {

      if (e.which == '3') {
        return false; // Right click
      }

      isMouseDown = true;

      mouseX = e.clientX;
      mouseY = e.clientY;

      elmTop = element.offsetTop;
      elmLeft = element.offsetLeft;

      diffX = mouseX - elmLeft;
      diffY = mouseY - elmTop;

    }

    function mouseUp() {
      isMouseDown = false;
    }

    function mouseMove(e) {

      if (!isMouseDown) return;

      if (e.which != '1') {
        isMouseDown = false;
      }
			
      if (swmpConfig.positionSide == 'right') {
        var newMouseX = window.innerWidth - e.clientX;
      } else {
        var newMouseX = e.clientX;
      }
      var newMouseY = e.clientY;

      newElmTop = newMouseY - diffY;
      newElmLeft = newMouseX - diffX;

      rightBarrier = window.innerWidth - element.offsetWidth;
      bottomBarrier = window.innerHeight - element.offsetHeight;

      if( ( newElmLeft < 0 ) || ( newElmTop < 0) || ( newElmLeft > rightBarrier  ) || (newElmTop > bottomBarrier) ) {
        if ( newElmLeft < 0 ) {
          newElmLeft = 0;

        }

        if ( newElmTop < 0) {
          newElmTop = 0;

        }
        if ( newElmLeft > rightBarrier  ) {
          newElmLeft = rightBarrier;

        } 
        if (newElmTop > bottomBarrier) {
          newElmTop = bottomBarrier;
        } 
      }

      element.style.top = newElmTop + "px";
      if (swmpConfig.positionSide == 'right') {
        element.style.right = newElmLeft + "px";
      } else {
        element.style.left = newElmLeft + "px";
      }

    }

    document.addEventListener('mousemove', mouseMove);
    elm.addEventListener('mouseup', mouseUp);
    elm.addEventListener('mousedown', mouseDown);
  }

}

	// Above this is SWMP class.


	// Below this is the event listener that checks if what you are clicking on is a video or audio that should be put into SWMP.
	// If you want to make site specific changes, either expand on it or just make a completely separate event listener below it.

document.querySelector('body').addEventListener('click', (event) => {
  	//console.log(event.target.tagName);

  	// If there are no links in sight, do nothing.
  if (event.target.tagName != 'A' && event.target.parentNode.tagName != 'A') {
    return; 
  }
  	// Lets figure out which one is the link. Wont normally chain As inside As so... Sometimes image may be inside span inside A so lets do 3x.
  if (event.target.tagName == 'A') {
   	var clicked = event.target;
  } else if (event.target.parentNode.tagName == 'A') {
  	var clicked = event.target.parentNode;
  } else if (event.target.parentNode.parentNode.tagName == 'A') {
  	var clicked = event.target.parentNode.parentNode;
  }
  
  function getVideo() {
    if (backendScript == '' || backendScript == null || backendScript == undefined || backendScript == 'fourchan') {
    	return clicked.getAttribute('href');
    } else if (backendScript == 'vichan') {
      //console.log(clicked.parentNode.querySelectorAll('p.fileinfo a') );
      
      var allthelinks = clicked.parentNode.querySelectorAll('p.fileinfo a'); // Prevent capturing the (Hide) link on some installs
      var matchinglink = '';
      let regex = new RegExp("\.("+swmpConfig.files+")+$", 'i');
      for (var i = 0; i < allthelinks.length ; i++) {
        if (allthelinks[i].getAttribute('href').match(regex) ) {
          matchinglink = allthelinks[i];
        }
      }
      
      if (matchinglink == '') { // Kissu New UI (no thanks, but here it is anyways)
        matchinglink = clicked;
      }
      
      //console.log(matchinglink);
      return matchinglink.getAttribute('href');
      
    } else {
      return clicked.getAttribute('href');
    }
    
  }
 
  function getFileNameFromUrl(link) { 
   	if (backendScript == '' || backendScript == null || backendScript == undefined || backendScript == 'fourchan') {
    	return link;
    } else if (backendScript == 'vichan') {
      return link;
    } else {
     	return link; 
    }
 
  }
  
  function getTitle(link) {
    	if (backendScript == 'fourchan') {
       	if (link.parentNode.querySelector('div.fileText a').getAttribute('title') ) {
          return link.parentNode.querySelector('div.fileText a').getAttribute('title');
        } else {
        	return link.parentNode.querySelector('div.fileText a').innerText;
        }

      }
    
 			if (backendScript == 'vichan') { // https://regex101.com/r/HivDYB/2
        let regex = new RegExp(`([^\/|^\=|^\n|^\&])+\.(${swmpConfig.files})([^\w]|$)`, 'gi'); // Tests for www.webmaster.com/test.webm domain too.
        var newlink = link.match(regex); // Remove query behind *final filename* &title for old filename on vichan will stay.
        newlink.forEach(string => function(string) {
          string = string.replace('/[\?|\&]+/i', '');
          return string;
        } ); //remove remnants of queries that i couldnt catch with a good regex
        return newlink.slice(-1)[0]; // return last in array, grabs t= title for vichan player.php links.
      }
  }
  
  var clickedHref = getVideo();
  var clickedFileName = getFileNameFromUrl(clicked.getAttribute('href') );
  
  if (backendScript == '' || backendScript == null || backendScript == undefined) {
  	var clickedTitle = decodeURI(clickedFileName); //Change with other scripts later if it doesn't already contain the title.
  } else if (backendScript == 'fourchan') {
		var clickedTitle = decodeURI(getTitle(clicked) );
  } else if (backendScript == 'vichan') {
   	var clickedTitle = decodeURI(getTitle(clicked.getAttribute('href') ) );
  } else {
    var clickedTitle = decodeURI(clickedFileName); //Change with other scripts later if it doesn't already contain the title.
  }
 
  console.log("URL: " + clicked.getAttribute('href') );
  console.log("Filename: " + clickedFileName );

  
  // Established what the Filename is, let's check if it matches files regex
  
  let regex = new RegExp(`\.(${swmpConfig.files})+$`, 'gi');
  
  if (!clickedHref.match(regex) ) {
    //console.log("not a video or audio");
  	return false;
  }
  
  console.log(clickedHref+": matched video or audio");

  // Established the link is a video/audio file, let's prevent other events from happening.
  event.preventDefault();
  event.stopPropagation();
  
  // Add shift click check to open in new tab? Maybe playlists or whatever.


  // Okay, time to load the player.
		if (swmpConfig.allowMultiple != 'false')  {
    	var playerid = `play-swmp-${clicked.getAttribute('href')}`;
    } else {
      var playerid = 'play-swmp';
    }
    if (typeof(document.getElementById(playerid)) != 'undefined' && document.getElementById(playerid) != null) {
      if (swmpConfig.allowMultiple != 'false')  {
      	return false; //already exists, lets do nothing.
      } else {
        document.getElementById(playerid).remove();
        //already exists, lets get rid of it. 
      }
      
    }
  
  	console.log(playerid+clickedHref+clickedTitle);
      
      let newembed = new swmp({
        id: playerid,
        url: clickedHref,
        title: clickedTitle
      });
  
  console.log(backendScript);
  		
  		if (backendScript == 'jschan') { // To preserve tab to select player and enable player keybinds like close/fullscreen/pause/mute.
        clicked.parentNode.parentNode.appendChild(newembed.container);
      } else {
      	clicked.parentNode.appendChild(newembed.container);
      }
  

}, true); // Fuck other scripts.
