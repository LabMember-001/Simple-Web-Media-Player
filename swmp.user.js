// ==UserScript==
// @name          4chan \ IB Simple Web Media Player
// @description   Simple Web Media Player for 4chan and other imageboards.
// @namespace     LabMember-001
// @author        https://github.com/LabMember-001
// @license       GPLv3
// @version       1.2.2

// @grant         none
// @run-at        document-end

// @match https://*.4chan.org/*
// @match https://*.4channel.org/*
// @match https://*.smuglo.li/*
// @match https://*.smugloli.net/*
// @match https://*.kissu.moe/*
// @match https://*.2kind.moe/*
// @match https://*.1chan.net/*
// @match https://*.otterchat.net/*
// @match https://*.fatchan.org/*
// @match https://*.7chan.org/*
// @match https://*.420chan.org/*
// @match https://*.anon.cafe/*
// @match https://*.4-ch.net/*

// @match https://*.archived.moe/*
// @match https://*.desuarchive.org/*
// @match https://*.4plebs.org/*
// @match https://*.warosu.org/*

// ==/UserScript==

// Most of the sites above are to test scripts.

console.log('Loading IB Media Player.');

/* Repository:                                              */
/* https://github.com/LabMember-001/Simple-Web-Media-Player */
/* https://okabe.moe/projects/simplewebmediaplayer          */
/*                                                          */
/*                                                          */
/*                                                          */

/*    == BOARD SUPPORT == 
// Script will alter behavior on different imageboard backends
// When adding custom board scripts, alter board behavior on bottom of the script. You'll need some knowledge on JS.
// In most cases, simply adding an @match to the top of this script to turn it on for that domain will work 
// as it captures all link presses and checks for webm.
// If you want more compatability, check the issue tracker for existing requests and if there are none, you may request help.
*/

/*    == SCRIPT CONFIGURATION ==
// To define a board as a precoded backend type (vichan, tinyib, lynxchan, etc) simply
// add a regex for that domain in the swmpBoards category below these comments.
*/

/*    == TO DO ==
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
// - Fix titles on some backends. (Mostly just vichan+4chan taking original filename right now).
*/

/*    == Current Script Support ==
// Yotsuba (4chan)
// Tinyboard/Vichan/Infinity
// Fuuka
// TinyIB
// Wakaba
// FoolFuuka (Not archived.moe's redirects, but 4plebs is fine).
// Kusaba
*/

/*  == Script Specific Bugs == 
// - Vichan shows original title when clicked on video thumb, but not link.
// - Doesnt grab titles on Fuuka, TinyIB, Wakaba, FoolFuuka
//
*/

/*
//    == Missing Script Support ==
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
};

  // regex to check the backend script of current domain
var backendScript = [];
Object.keys(swmpBoards).forEach(script => {
  swmpBoards[script].forEach(regex => {
    if (currentUrl.match(regex)) {
      backendScript = script;
    }
  });
});

console.log(backendScript);


  // This configuration variable can be overwritten wherever you want later 
  // on as you wish or add your own site variables for user configuration.
var swmpConfig = {
  autoplay: 'true', // Autoplay media when launched by SWMP.
  loop: 'true', // Loop media when launched by SWMP.
  windowed: 'true',
  positionTop: '100',
  positionOffset: '100',
  positionSide: 'right',
  volume: 60,
  volumeScroll: 'true',
  muted: 'false', //Not implemented
  theme: 'default', //Default theme
  themes: //All themes
    [
      ['default', 'MPC Light'],
      ['dark', 'MPC Dark'],
      ['kurisu', 'Kurisumasu'],
      ['bluemoon', 'Blue Moon'],
      ['modernity', 'Modernity']
    ],
  files: 'avi|mpeg|mpg|ogv|mp4|webm|flv|wav|mp3|m4a|mp2|ogg|flac',
  allowMultiple: 'false'
};

  // Initialize site configuration. As of now it's on a per site basis and not using GM values, I like different designs.
if (localStorage.swmpVolume == undefined) {
  localStorage.swmpVolume = swmpConfig.volume;
} else {
  swmpConfig.volume = localStorage.swmpVolume;
}

if (localStorage.swmpTheme == undefined) {
  localStorage.swmpTheme = swmpConfig.theme;
} else {
  swmpConfig.theme = localStorage.swmpTheme;
}

if (localStorage.swmpAutoplay == undefined) {
  localStorage.swmpAutoplay = swmpConfig.autoplay;
} else {
  swmpConfig.autoplay = localStorage.swmpAutoplay;
}

if (localStorage.swmpLoop == undefined) {
  localStorage.swmpLoop = swmpConfig.loop;
} else {
  swmpConfig.loop = localStorage.swmpLoop;
}

if (localStorage.swmpAllowMultiple == undefined) {
  localStorage.swmpAllowMultiple = swmpConfig.allowMultiple;
} else {
  swmpConfig.allowMultiple = localStorage.swmpAllowMultiple;
}

if (localStorage.swmpWindowed == undefined) {
  localStorage.swmpWindowed = swmpConfig.windowed;
} else {
  swmpConfig.windowed = localStorage.swmpWindowed;
}

if (localStorage.swmpMuted == undefined) {
  localStorage.swmpMuted = swmpConfig.muted;
} else {
  swmpConfig.muted = localStorage.swmpMuted;
}

if (localStorage.swmpVolumeScroll == undefined) {
  localStorage.swmpVolumeScroll = swmpConfig.volumeScroll;
} else {
  swmpConfig.volumeScroll = localStorage.swmpVolumeScroll;
}


// Add style to head when DOM is loaded.

if (!document.getElementById('swmp-stylesheet')) { // Don't bother injecting style on demo page.
var swmpStyle = document.createElement('style');
swmpStyle.setAttribute('id', 'swmp-stylesheet');
swmpStyle.innerHTML = `.swmp *{background:0 0;border:0;outline:0;margin:0;padding:0;line-height:1;height:unset;width:unset;font-family:-apple-system,BlinkMacSystemFont,URW Gothic,MS PGothic,Helvetica,sans-serif;font-size:11pt;text-indent:4px;letter-spacing:1px;color:var(--swmp-text-color)}div.swmp{--swmp-background:#e6e6e6;--swmp-container-border:#000;--swmp-container-box-shadow:none;--swmp-player-container-background:#000;--swmp-controls-background:var(--swmp-background);--swmp-text-color:#000;--swmp-button-background:var(--swmp-background);--swmp-button-mask-color:#000;--swmp-seek-height:30px;--swmp-seek-offset:10px;--swmp-seek-background:var(--swmp-controls-background);--swmp-seek-progress-color:lightgrey;--swmp-seek-border-left:darkgray;--swmp-seek-border-top:darkgray;--swmp-seek-border-right:#fff;--swmp-seek-border-bottom:#fff;--swmp-range-thumb-color:var(--swmp-controls-background);--swmp-range-thumb-border-left:#fff;--swmp-range-thumb-border-top:#fff;--swmp-range-thumb-border-right:#000;--swmp-range-thumb-border-bottom:#000;--swmp-btn-border-left:#fff;--swmp-btn-border-top:#fff;--swmp-btn-border-right:#000;--swmp-btn-border-bottom:#000;--swmp-btn-border-left-active:#000;--swmp-btn-border-top-active:#000;--swmp-btn-border-right-active:#fff;--swmp-btn-border-bottom-active:#fff}div.swmp.swmp-theme-dark,div.swmp.swmp-theme-dark *{--swmp-background:#333;--swmp-container-border:#000;--swmp-controls-background:var(--swmp-background);--swmp-text-color:#888;--swmp-button-background:var(--swmp-background);--swmp-button-mask-color:#888;--swmp-seek-height:30px;--swmp-seek-offset:10px;--swmp-seek-progress-color:#555;--swmp-seek-border-left:#1a1a1a;--swmp-seek-border-top:#1a1a1a;--swmp-seek-border-right:#464646;--swmp-seek-border-bottom:#464646;--swmp-range-thumb-color:var(--swmp-background);--swmp-range-thumb-border-left:#777;--swmp-range-thumb-border-top:#777;--swmp-range-thumb-border-right:#000;--swmp-range-thumb-border-bottom:#000;--swmp-btn-border-left:#777;--swmp-btn-border-top:#777;--swmp-btn-border-right:#000;--swmp-btn-border-bottom:#000;--swmp-btn-border-left-active:#000;--swmp-btn-border-top-active:#000;--swmp-btn-border-right-active:#777;--swmp-btn-border-bottom-active:#777}div.swmp.swmp-theme-kurisu,div.swmp.swmp-theme-kurisu *{--swmp-background:#a44242;--swmp-text-color:#fff;--swmp-button-mask-color:#fff}div.swmp.swmp-theme-bluemoon,div.swmp.swmp-theme-bluemoon *{--swmp-background:#272d37;--swmp-text-color:#eee;--swmp-button-mask-color:#d3d3d3;--swmp-controls-background:#49525D;--swmp-btn-border-left:#DDDDDD;--swmp-btn-border-top:#DDDDDD;--swmp-range-thumb-border-top:#ddd;--swmp-range-thumb-color:#272d37}div.swmp.swmp-container{position:relative;display:inline-flex;flex-direction:column;padding:2px;background:var(--swmp-background);font-family:-apple-system,BlinkMacSystemFont,URW Gothic,MS PGothic,Helvetica,sans-serif;font-size:11pt;text-indent:4px;letter-spacing:1px;color:var(--swmp-text-color);border:1px solid var(--swmp-container-border);line-height:1;z-index:1;overflow:hidden;min-width:320px;width:auto;outline:0;box-shadow:var(--swmp-container-box-shadow)}div.swmp.swmp-window.swmp-window-container{display:flex;justify-content:space-between;padding-bottom:2px}div.swmp.swmp-fullscreen div.swmp-settings.swmp-settings-container,div.swmp.swmp-fullscreen div.swmp-window.swmp-window-container{display:none}div.swmp.swmp-minimized div.swmp-player-container{display:none}div.swmp.swmp-fullscreen div.swmp-player-container{display:block}span.swmp.swmp-window.swmp-window-titlebar{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;position:relative;margin:auto;cursor:move;width:100%;text-align:center;display:block}span.swmp.swmp-window.swmp-window-title{display:block;max-width:260px;text-overflow:ellipsis;overflow:hidden;margin:auto;line-height:1.5;margin-bottom:-2px}span.swmp.swmp-window.swmp-window-buttons-contain{display:flex;flex:0 1 auto}div.swmp .swmp-player-container{display:flex;height:100%;background:var(--swmp-player-container-background)}div.swmp.swmp-container.swmp-audio{display:block}div.swmp.swmp-container.swmp-fullscreen{background:#000;position:unset!important;width:100%;height:auto}div.swmp.swmp-container.swmp-fullscreen iframe,div.swmp.swmp-container.swmp-fullscreen video{width:100%;height:100%;max-width:100%;max-height:100%}div.swmp video{background:#000;max-width:500px;max-height:500px;width:auto;height:auto;margin:auto}div.swmp iframe{background:#000;min-width:420px;min-height:236px;max-width:500px;max-height:500px;width:auto;height:auto;margin:auto;pointer-events:none}div.swmp audio{min-width:320px;min-height:40px}div.swmp.swmp-controls{bottom:0;left:0;background:var(--swmp-controls-background);width:100%;display:flex;flex-direction:column}div.swmp.swmp-fullscreen div.swmp.swmp-controls{position:absolute;opacity:0;transition:opacity .5s 1s ease-out}div.swmp.swmp-fullscreen div.swmp.swmp-controls:hover{opacity:1;position:absolute;transition:none}div.swmp.swmp-controls span.swmp-seek-container{display:flex;width:calc(100% - 6px);height:var(--swmp-seek-height);margin:auto}div.swmp.swmp-controls span.swmp-seek-container input.swmp.swmp-seeker{width:calc(100% - var(--swmp-seek-offset));left:calc(var(--swmp-seek-offset)/ 2);-webkit-appearance:none;background:#0000;padding:0;margin:0;height:var(--swmp-seek-height);position:absolute;z-index:1;cursor:pointer;-webkit-margin-top:-14px}input[type=range].swmp{background:0 0!important;border:0!important;outline:0!important}span.swmp input[type=range]::-webkit-slider-runnable-track{width:100%;height:6px;cursor:pointer;background:#0000;border-radius:0;border:1px solid #000;border-left-color:var(--swmp-seek-border-left);border-top-color:var(--swmp-seek-border-top);border-right-color:var(--swmp-seek-border-right);border-bottom-color:var(--swmp-seek-border-bottom)}span.swmp input[type=range]::-moz-range-track{width:100%;height:6px;cursor:pointer;background:#0000;border-radius:0;border:1px solid #000;border-left-color:var(--swmp-seek-border-left);border-top-color:var(--swmp-seek-border-top);border-right-color:var(--swmp-seek-border-right);border-bottom-color:var(--swmp-seek-border-bottom)}span.swmp progress::-webkit-progress-bar{background:#0000}span.swmp progress::-webkit-progress-value{background:var(--swmp-seek-progress-color)}span.swmp progress::-moz-progress-bar{background:var(--swmp-seek-progress-color)}span.swmp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;border:4px solid var(--swmp-range-thumb-color);height:8px;width:2px;border-radius:0;padding:4px 3px;background:#0000;background:linear-gradient(180deg,var(--swmp-seek-border-top) 10%,var(--swmp-seek-background) 10%,var(--swmp-seek-background) 90%,var(--swmp-seek-border-bottom) 90%);cursor:pointer;margin-top:-6px;box-shadow:1px 1px 0 0 var(--swmp-range-thumb-border-bottom),-1px -1px 0 0 var(--swmp-range-thumb-border-top)}span.swmp input[type=range]::-moz-range-thumb{appearance:none;border:4px solid var(--swmp-range-thumb-color);height:8px;width:6px;border-radius:0;background:linear-gradient(180deg,var(--swmp-seek-border-top) 10%,var(--swmp-seek-background) 10%,var(--swmp-seek-background) 90%,var(--swmp-seek-border-bottom) 90%);cursor:pointer;box-shadow:1px 1px 0 0 var(--swmp-range-thumb-border-bottom),-1px -1px 0 0 var(--swmp-range-thumb-border-top)}span.swmp input[type=range]::-webkit-range-progress{height:6px;background-color:#0000}span.swmp input[type=range]::-moz-range-progress{height:6px;background-color:#0000}span.swmp progress.swmp-volume{width:50px;position:absolute;height:6px;right:8px;border:none;bottom:7px;z-index:0;background:var(--swmp-seek-background)}span.swmp input.swmp-volume[type=range]{-webkit-appearance:none;background:#0000;padding:0;margin-left:2px;cursor:pointer;position:relative}span.swmp input.swmp-volume[type=range]::-webkit-slider-thumb{padding:4px 2px;width:2px}span.swmp input.swmp-volume[type=range]::-moz-range-thumb{padding:0 1px;width:1px}div.swmp.swmp-controls span.swmp-seek-container progress.swmp-progress{width:100%;height:6px;z-index:0;position:relative;background:var(--swmp-seek-background);bottom:-12px;border:none}span.swmp.swmp-row-bottom{display:flex;flex-direction:row;height:20px;margin-bottom:2px}div.swmp.swmp-fullscreen span.swmp.swmp-row-bottom{padding-bottom:5px}span.swmp.swmp-buttons-container{height:100%}select.swmp.swmp-selector{-webkit-appearance:none;appearance:none;background:var(--swmp-button-background);border:1px solid var(--swmp-text-color);color:var(--swmp-text-color);outline:0;border-radius:0;width:85px;overflow:hidden;text-overflow:ellipsis;letter-spacing:0;text-indent:0}label.swmp.swmp-settings{display:inline-flex;flex-direction:row-reverse}input.swmp.swmp-settings{margin:-2px 0 0 4px;border:1px solid var(--swmp-text-color);appearance:none;-webkit-appearance:none;outline:0;width:14px;height:14px;background:var(--swmp-controls-background)}input.swmp.swmp-settings:checked{outline:5px inset var(--swmp-text-color);outline-offset:-8px}button.swmp.swmp-button{min-width:26px;height:100%;padding:0 4px;display:inline-block;cursor:pointer;margin-left:2px;margin-right:2px;color:var(--swmp-button-mask-color);background:var(--swmp-button-background);border:1px solid;border-bottom-color:var(--swmp-btn-border-bottom);border-right-color:var(--swmp-btn-border-right);border-top-color:var(--swmp-btn-border-top);border-left-color:var(--swmp-btn-border-left);filter:unset}button.swmp.swmp-button span{display:block;width:16px;height:16px;image-rendering:pixelated;background-repeat:no-repeat;background-color:var(--swmp-button-mask-color);-webkit-mask-image:var(--image);mask-image:var(--image);-webkit-mask-size:16px;mask-size:16px;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}span.swmp.swmp-window button{height:20px;min-width:22px;width:22px}button.swmp.swmp-button.swmp-window-minimize span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAARElEQVRYR+3V0Q0AMAQFQPYfuv7apAPg4yzguQQZw5XD/UMAAgQIECCwTuA0fcc7+C8gAIFxgaYleG3W3QECBAgQaBcokVQGIRA6KiEAAAAASUVORK5CYII=');margin-top:2px;-webkit-mask-size:12px;mask-size:12px}button.swmp.swmp-button.swmp-window-close span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9UlEQVRoge2Y2woCMRBD5699dB79a7ViQfDWaZNMFybQR5NzVndhNatUKpUjxe/nctT+Vn59HsYItf+1nDFC7f9Ujhyh9v8qR4xQ+0fKV0bY/XYKDERHIvDtnGcEWBIyeIaEHB4pkQaPkEiHnwXxyc9QE/0mtrjyCgkZfA9SQg7fg5BIg+9ZkUiH75mR2Aa+xS0uwHyzC8Vt/ieULuG2fhOnSfgA3LYSDoBOk2DAyySi8O1RyXyzo8P3pEuswKdLIODTJJDwcgkGvFQiMhKBV/UPj0yXC/r/jiyXC/q/jsDKBf1vI/ByQf8jbtz/bdj9lUqlAs4N+1iFrUSwCpcAAAAASUVORK5CYII=');margin-top:2px;-webkit-mask-size:12px;mask-size:12px}button.swmp.swmp-button.swmp-playbutton span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8klEQVRoQ+3aMQ6DMAyF4XDycjCGVmrPBRmapVLkJLafn1GRMiHB/+EpEVtJfm3J+8vtAO86kb2uI8tkfidwfsM/WSA9QBsAPUQC0ENGAbSQWQAdZBVAA9ECwiFWgDCINQAO8QLAIN4AdwgK4AZBA8whUQAzSDRADWEBLEPYANMQVsAwhB0gQrIAupA/AHR60d2bs09APFRgBYjhbfJsgOFwNsB0OAtgOTwaoA6PApiFowHm4SiAW7g3wD3cCwALtwbAw60AYeFaQHj4KoAmfBZAFz4KoA2XAPThPcCz3njU9QJtFdWvud2vBuovgn5A+glcJSF8MQrukbIAAAAASUVORK5CYII=')}button.swmp.swmp-button.swmp-playbutton.swmp-playing span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAtUlEQVRoQ+2Y2w6AIAxD5f8/2kuCRgiJbdjDMMfnxUE5o9WyLf6Uxde//W4D+8SJuGKE9OqbhrxUFCGkFxt4qQ1CInpX2SMWCIGQwc1ILBACIRBqFQixd1HUkF4MMUMs8taVESVGupFGDZpACIROBTCy5tOsMhGiijiMIb2IEkQJkTeihCAUUUIQ6S4hShAliBKVAZwYJzbuTn7ufoiFExs04cRpndg4xRyl7uDlWPWE+aTbwAFy3FQxPpmarQAAAABJRU5ErkJggg==')}button.swmp.swmp-button.swmp-stopbutton span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAUUlEQVRYR+3Xuw0AIAwD0WQC2H9LJuDXICFqm+KywEWvc4b50tyP7x7oIpE6O221bgEeQAABBBBAAAEEEEAAAQTsAkW0jPYqei0jUf9k7ON0AGFsNSFlb3+JAAAAAElFTkSuQmCC')}.swmp.swmp-timer-container,button.swmp.swmp-button.swmp-fullscreen{margin-left:auto}button.swmp.swmp-button.swmp-fullscreen span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4T2NkoBAwQvX/x2EOQXmCCghZgG4AjE/IYzAXMw4jAwj5Gac8sYFG0AB4qBLplOEYCwOfF4gMfExlADQ3GBE+X9RsAAAAAElFTkSuQmCC')}button.swmp.swmp-button.swmp-volume span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAG1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABp4cHsAAAACHRSTlMA1WZ/JZz0Rme5O54AAACGSURBVDjL5ZIxCoAwDEWjVXDs6OjUWXDxRl6hqyL2H9uqKKL5oKtmzIOXNvkiP6qc9LOSAAciAoiIAAcdRNEGmrtoBQb1TbSCFt3eK3CUSAr0KliUlQbEA1YFCTCqID47qMAAwztAVXS4x2RfffC8kusSw7O100Px0/Iw0PjwwPGI0lB/s2bRbW7duVgj2wAAAABJRU5ErkJggg==')}button.swmp.swmp-button.swmp-volume.swmp-min span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAd0lEQVR42u2Xuw2AMAwFr41YhKmyVyp2YhZ6pwEJqJDgmRTv3PukV/gDxpjBKDRl+5mV0LWvbIRKUGjEXrJoZIIjGongHI1AcI3mc8E9mpeCeFwWWGCBBTqBfNj9MK4TFk7CykxZ+glnS8LhlXI6Akws/gCMGZAO8wpmVouK9vcAAAAASUVORK5CYII=')}button.swmp.swmp-button.swmp-volume.swmp-max span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAD1BMVEVHcEwAAAAAAAAAAAAAAADTrAj/AAAABXRSTlMA/4hD1KmiQHMAAACwSURBVDjL1ZPBDYMwDEV/nQzAIwwAVQdoNoD9l+qhgAyKW/VGfbHkp/wk9rf0//EI6sZ8Kqx5oj/U07IdgKcHlXfOcNAyVpCA4oU2oAqDF9pB9pcYK7hLAkYnBJKMUZqgc0IgaaJIFYp0Yw/JYJAy9CegBUZZA1SYlWA4gwxdExgUCWiA/mfQlgovj56bog/6loRN/Nz2w6CSG1Q82tgMoX1iw8UWDU0dr8HXxblwvAAGdxy1HX87LAAAAABJRU5ErkJggg==')}button.swmp.swmp-button.swmp-volume.swmp-mute span{--image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACnRSTlMACZko0v9e9AufnFf4OQAAAJdJREFUeJzlkrsNgDAMRCMhL8BO6WluBmZha2LZDvmdRA1uUHi+S/xJ6Uexk/9bJuAEMcIabBmQQNLknFBw2KERFyMFcEEFalROMAlCaUYFWKoLBDU81wUdkCobgGbHDT0Q/06gSOJJA3hqeKmgd7BX0TpY5V2v2ibO3bW2L+YRg5on6KOtRT9AzdIy2PrwheMrmi4GPhk3sCZY/9usUnQAAAAASUVORK5CYII=')}span.swmp.swmp-volume-container{display:flex;width:60px;height:100%;position:relative}span.swmp.swmp-volume-container input.swmp.swmp-volume.swmp-range{width:50px;vertical-align:top;position:relative}button.swmp.swmp-button:active{border-bottom-color:var(--swmp-btn-border-bottom-active);border-right-color:var(--swmp-btn-border-right-active);border-top-color:var(--swmp-btn-border-top-active);border-left-color:var(--swmp-btn-border-left-active)}span.swmp.swmp-timer-container{display:inline-table;margin-right:5px;cursor:default}span.swmp.swmp-timer-container span.swmp.swmp-time{display:table-cell;vertical-align:bottom}#quote-preview{z-index:1}div.swmp.swmp-theme-modernity,div.swmp.swmp-theme-modernity *{--swmp-background:#222;--swmp-container-border:#222;--swmp-text-color:#eee;--swmp-button-mask-color:#eee;--swmp-controls-background:#222;--swmp-btn-border-left:#0000;--swmp-btn-border-top:#0000;--swmp-btn-border-right:#0000;--swmp-btn-border-bottom:#0000;--swmp-btn-border-left-active:#0000;--swmp-btn-border-top-active:#0000;--swmp-btn-border-right-active:#0000;--swmp-btn-border-bottom-active:#0000;--swmp-seek-background:#444;--swmp-seek-progress-color:#bbb;--swmp-seek-border-left:#444;--swmp-seek-border-top:#444;--swmp-seek-border-right:#444;--swmp-seek-border-bottom:#444;--swmp-container-box-shadow:0px 0px 10px #000;font-family:Arial;font-weight:700}div.swmp.swmp-theme-modernity input[type=range]::-moz-range-thumb{border:none;height:8px;width:8px;background:#eee;box-shadow:none;border-radius:100%;padding:4px}div.swmp.swmp-theme-modernity input[type=range]::-webkit-slider-thumb{border:none;height:8px;width:8px;background:#eee;box-shadow:none;border-radius:100%;padding:4px}`;
document.head.appendChild(swmpStyle);
}

var youtubeIsLoaded = false;
var gmwindow;
if (typeof GM_info != 'undefined') {
  gmwindow = unsafeWindow;
} else {
  gmwindow = window;
}

var fileregex = new RegExp(`\.(${swmpConfig.files})+$`, 'gmi');
var ytregex = new RegExp("^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be|yewtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)(t=([0-9]))?", "gmi");

// SWMP Code

class swmp {

  constructor(obj) {
    this.name = 'Simple Web Media Player';
    
    if (obj.id == undefined) {
    this.id = this.uuid();
    } else {
      this.id = obj.id;
    }

    this.type = obj.type; // "video" or "audio" player. Youtube too.
    this.mime = obj.mime; // MIME type for source, Example: "video/webm". Feed to enable checking for file support (webm not supported by iOS)
    this.url = obj.url; // File Location
    this.poster = obj.poster; // Optional Video Preview for when autoplay is off.
    this.autoplay = obj.autoplay; // Optional Autoplay
    this.loop = obj.loop; // Optional Loop
    this.windowed = obj.windowed; // Optional set false to disable windowed mode and place inline
    
    this.defaultVolume = parseInt(swmpConfig.volume);

    if (obj.url == undefined) {
      console.log('No media given');
      return false;
    }

    if (obj.windowed == undefined) {
      this.windowed = swmpConfig.windowed;
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


    // Create Window Container
    if (this.windowed != 'false') {
      this.prepareWindow();
    }

    // Prepare the media that's gonna play.

    if (this.type == 'video' || this.type == 'audio') {
      // Check if browser can play formats, create audio or video tag and fill with source. 
      this.preparePlayer();
    } else if (this.type == 'youtube') {
      // Load Youtube iframe.
      if (this.prepareYoutube() == false) {
        console.log("Error: YouTube");
        return false;
      }
    }

    // Add Theme
    if (swmpConfig.theme != undefined) {
      this.container.classList.add(`swmp-theme-${swmpConfig.theme}`);
    }

    if (this.type == 'video' || this.type == 'audio') {
    // Create buttons
      this.prepareSharedEvents();
      this.prepareControls();
      this.preparePlayerEvents();
      this.prepareSettings();
    } else if (this.type == 'youtube') {
      //this.prepareSharedEvents();
      //this.prepareYoutubeEvents();
    }

  }

  prepareWindow() {
    this.windowContainer = document.createElement('div');
    this.windowContainer.setAttribute('class', 'swmp swmp-window swmp-window-container');
    this.container.appendChild(this.windowContainer);

    // Create Title/WindowDragbar and put inside Window Container
    this.windowTitlebar = document.createElement('span');
    this.windowTitlebar.setAttribute('class', 'swmp swmp-window swmp-window-titlebar');

    this.windowTitle = document.createElement('span');
    this.windowTitle.setAttribute('class', 'swmp swmp-window swmp-window-title');
    if (this.title != undefined) {
    this.windowTitle.textContent = this.title;
    } else {
    this.windowTitle.textContent = this.url;
    }

    this.windowTitlebar.appendChild(this.windowTitle);
    this.windowContainer.appendChild(this.windowTitlebar);

    // Create Window Buttons Container
    this.windowButtonsContain = document.createElement('span');
    this.windowButtonsContain.setAttribute('class', 'swmp swmp-window swmp-window-buttons-contain');
    this.windowContainer.appendChild(this.windowButtonsContain);

    // Create Minimize Button (Video only)
    if (this.type == 'video' || this.type == 'youtube') {
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

  prepareControls() {
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
    this.playbutton.innerHTML = "<span></span>"; // ◀
    this.playbutton.addEventListener("click", event => {
      event.preventDefault();

        if (this.type == 'video' || this.type == 'audio') {
          if (this.player.paused ) {
            this.player.play();
          } else {
            this.player.pause();
          }
        } else if (this.type == 'youtube') {
          this.togglePlay();
        }
    });
    this.buttonsContain.appendChild(this.playbutton);

    // Create a Stop/Reload Button and put inside Controls
    this.stopbutton = document.createElement('button');
    this.stopbutton.setAttribute('class', 'swmp swmp-button swmp-stopbutton');
    this.stopbutton.innerHTML = "<span></span>"; // ■
    this.stopbutton.addEventListener("click", event => {
      event.preventDefault();

      if (this.type == 'video' || this.type == 'audio') {
        this.player.pause();
        this.seeker.value = 0;
        this.seeker.setAttribute("value", 0);
        this.progress.value = 0;
        this.progress.setAttribute("value", 0);
        this.player.currentTime = 0;
        this.currentTimer.textContent = '00:00';
      } else if (this.type == 'youtube') {
        this.seeker.value = 0;
        this.seeker.setAttribute("value", 0);
        this.progress.value = 0;
        this.progress.setAttribute("value", 0);
        this.ytplayer.stopVideo();
        this.currentTimer.textContent = '00:00';
      }
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
    if (this.type == 'video' || this.type == 'youtube') {
      this.fullscreenbutton = document.createElement('button');
      this.fullscreenbutton.setAttribute('class', 'swmp swmp-button swmp-fullscreen');
      this.fullscreenbutton.innerHTML = "<span></span>"; // ▣
      this.fullscreenbutton.addEventListener("click", event => {
        event.preventDefault();
        this.fullscreen(this.container);
      });
      this.bottomRow.appendChild(this.fullscreenbutton);
    }
  }

  prepareSettings() {

    this.openSettings = () => {
      // Settings Menu

      if (this.container.querySelector('.swmp-settings-container') != null) {
        this.settingsContainer.remove();
        return false; //Already open
      }

      this.settingsContainer = document.createElement('div');
      this.settingsContainer.setAttribute('class', 'swmp swmp-settings swmp-settings-container');
      this.settingsContainer.innerHTML = 'Settings:';


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
          this.removeClassByPrefix(this.container, 'swmp-theme-'); //regex remove [theme-*]
          this.container.classList.add(`swmp-theme-${this.themeSelector.value}`);
          swmpConfig.theme = this.themeSelector.value;
          localStorage.swmpTheme = this.themeSelector.value;
        }
      };

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
          if (this.type == 'video' || this.type == 'audio') {
            this.player.setAttribute('loop', 'true');
          } else if (this.type == 'youtube') {
            // Youtube Loop
          }
          localStorage.swmpLoop = 'true';
          swmpConfig.loop = 'true';
        } else {
          this.loopCheck.removeAttribute('checked');
          if (this.type == 'video' || this.type == 'audio') {
            this.player.removeAttribute('loop');
          } else if (this.type == 'youtube') {
            // Youtube Loop
          }
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
      
      this.br = document.createElement('br');
      this.settingsContainer.appendChild(this.br);
      
        // Volume Scroll Settings
      this.volumeScrollLabel = document.createElement('label');
      this.volumeScrollLabel.setAttribute('class', 'swmp swmp-settings swmp-label swmp-volumescroll-label');
      this.volumeScrollLabel.textContent = 'Volume Scroll';
      this.volumeScrollCheck = document.createElement('input');
      this.volumeScrollCheck.setAttribute('class', 'swmp swmp-settings swmp-input swmp-volumescroll-input');
      this.volumeScrollCheck.setAttribute('type', 'checkbox');
      if (localStorage.swmpVolumeScroll == 'true') {
        this.volumeScrollCheck.setAttribute('checked', 'checked');
      }
      this.volumeScrollCheck.addEventListener('change', (event) => {
        if (this.volumeScrollCheck.checked == true) {
          this.volumeScrollCheck.setAttribute('checked', 'checked');
          localStorage.swmpVolumeScroll = 'true';
          swmpConfig.volumeScroll = 'true';
        } else {
          this.volumeScrollCheck.removeAttribute('checked');
          localStorage.swmpVolumeScroll = 'false';
          swmpConfig.volumeScroll = 'false';
        }
      });
      this.volumeScrollLabel.appendChild(this.volumeScrollCheck);
      this.settingsContainer.appendChild(this.volumeScrollLabel);


      this.container.appendChild(this.settingsContainer);

    };
  }

  preparePlayer() {
    // Create Player HTML5 Video or Audio format.
    if (this.type == 'video') {
      this.container.classList.add('swmp-video');
      this.player = document.createElement('video');
      this.player.setAttribute('class', 'swmp swmp-video swmp-player');
      if (this.poster != false && this.poster != undefined) {
        this.player.setAttribute('poster', this.poster);
      }
    } else if (this.type == 'audio') {
      this.container.classList.add('swmp-audio');
      this.player = document.createElement('audio');
      this.player.setAttribute('class', 'swmp swmp-audio swmp-player');
    } else {
      console.log(`SWMP Error: invalid type of ${this.type}.`);
      return false;
    }

    // Check Format Support
    if (this.mime != undefined) {
      if (this.player.canPlayType(this.mime) == '') {
        this.closeError = document.createElement('span');
        this.closeError.innerHTML = `Your browser can't play this format: ${this.mime}`;
        this.container.addEventListener('click', (event) => {
          this.container.remove();
        });
        this.container.appendChild(this.closeError);
        return false;
      }
    }

    // Preload metadata
    this.player.setAttribute('preload', 'metadata');

    
    // Create Player Container and Put inside Container
    this.playerContainer = document.createElement('div');
    this.playerContainer.setAttribute('class', 'swmp swmp-player-container');
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
  }

  prepareYoutube() {

    console.log('SWMP: prepareYoutube() ');

    if (youtubeIsLoaded == false) {
      // Include YouTube iframe API if not already added:
      if (!document.getElementById('swmp-youtube-api')) {
        console.log("SWMP: Loading YouTube API");
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.setAttribute('id', 'swmp-youtube-api');
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      
      gmwindow.onYouTubeIframeAPIReady = (event) => {
        youtubeIsLoaded = true;
        console.log('SWMP: Firing YouTube Ready Event from inside PrepareYouTube()');
        this.makeYoutube();
      };
      
      
    } else {
      // API Already loaded, just make video.
      console.log('SWMP: YT API Already loaded, make vid');
      this.makeYoutube();
    }
  }

  makeYoutube() {
    // Make new player
    console.log('SWMP: makeYoutube()');
    this.playerfirstrun = true;
    var self = this;
    this.onPlayerReady = (event) => {
      console.log('SWMP Youtube: onPlayerReady()');
      if (this.playerfirstrun == true) {
        this.playerfirstrun = false;
        this.playerContainer.appendChild(this.ytplayer.getIframe() );
        this.windowTitle.textContent = this.ytplayer.getVideoData().title;
        this.totalTimer.textContent = this.formatSeconds(this.ytplayer.getDuration() );
        this.ytplayer.getIframe().style.display = 'inherit';

        this.ytplayer.setVolume(this.defaultVolume);
        this._volume = this.defaultVolume;
        /*if (swmpConfig.muted == 'true') {
          this.ytplayer.mute();
          this.volumeButton.classList.add('swmp-mute');
        } else {
          this.ytplayer.unMute();
        }*/
        this.ytplayer.unMute();

        if (this.autoplay == 'true') {
          this.ytplayer.playVideo();
          this.playbutton.classList.add('swmp-playing');
        }


      }

      window.addEventListener('message', function(event) {
        if (event.source === self.ytplayer.getIframe().contentWindow) {
            var data = JSON.parse(event.data);
            //console.log(data);

              // Dispatch Volume and Mute Event -- These are sent together by iframe.
            if (data.event === "infoDelivery" && data.info && data.info.volume) {
              //console.log(data.info.volume);
              //console.log(data.info.muted);
              if (data.info.volume != self._volume) {
                //console.log(data.info.volume);
                self.updateVolume();
              }
            }

              // Dispatch on Time Event
            if (data.event === "infoDelivery" && data.info && data.info.currentTime) {
              //console.log(data.info.currentTime);
              self.currentTimer.textContent = self.formatSeconds(data.info.currentTime);
            }

              // Dispatch on Player state event
            if (data.event === "infoDelivery" && data.info && data.info.playerState) {
              //console.log(data.info.playerState);
              self.updatePlay();
              self.updateVolume();
            }
        }
      });

    }

    this.videogenerate = document.createElement('div');
    this.videogenerate.style.display = 'none';
    this.videogenerate.setAttribute('id', `ytplayer-${this.id}`);
    document.body.appendChild(this.videogenerate);
    
    this.ytplayer = new gmwindow.YT.Player(`ytplayer-${this.id}`, {
      height: '1080',
      width: '1920', // Allows quality to increase to 1080p. Can't be forced by API, need fast internet.
      videoId: this.videoid,
      playerVars: {
        'playsinline': 1,
        'autoplay': 1,
        'loop': 1,
        //'origin': window.location.href,
        'rel': 0,
        'modestbranding': 1,
        'controls': 0
      },
      events: {
        'onReady': this.onPlayerReady
      }
    });
    
    console.log(this.ytplayer);

    this.playerContainer = document.createElement('div');
    this.playerContainer.setAttribute('class', 'swmp-player-container');

    this.container.appendChild(this.playerContainer);

    this.prepareSettings();
    this.prepareControls();
    this.prepareSharedEvents();
    this.prepareYoutubeEvents();

  }


  prepareYoutubeEvents() {

    this.togglePlay = function() {
      if (this.ytplayer.getPlayerState() == 1) { // Playing
        this.ytplayer.pauseVideo();
      } else { // -1 unstarted, 0 ended, 1 playing, 2 Pause, 3 buffering, 5 video cued 
        this.ytplayer.playVideo();
      }
    };

    var timeInterval;
    this.updatePlay = () => {

      this._playerState = this.ytplayer.getPlayerState();

      if (this._playerState == 1) { // Playing
        this.playbutton.classList.add('swmp-playing');
        this.updateTime();

        var self = this;
        var timeInterval = setInterval(function() {
          self._playerState = self.ytplayer.getPlayerState();
          if (self._playerState == 1) {
            self.updateTime();
          }
          if (self._playerState == 0)  { //Ended
            self.updatePlay();
          }
          //console.log('time'); //still bugged on close unlike the other interval 
          if (self._playerState != 1 || self.container == null || self.container == undefined || self.container == false) {
            clearInterval(timeInterval);
            timeInterval = null;
          }
        }, 80);

      } else if (this._playerState == 0 || this._playerState == -1 || this._playerState == 2 )  { // -1 unstarted, 0 ended, 1 playing, 2 Pause, 3 buffering, 5 video cued 
        this.playbutton.classList.remove('swmp-playing');
      }

      if (this._playerState == 0 || this._playerState == -1 ) {
        this.progress.value = 0;
        this.progress.setAttribute('value', 0);
        this.seeker.value = 0;
        this.seeker.setAttribute('value', 0);
      }

      if (this._playerState == 0) {
        console.log('uwah video loop');
        if (swmpConfig.loop == 'true') {
          this.ytplayer.seekTo(0);
          this.ytplayer.playVideo();
        }
      }

    };

    this.seeker.oninput = (event) => {
      //on mousedown temporary add a mute to avoid annoying seeking sounds?
      this.ytplayer.seekTo(Math.floor(this.ytplayer.getDuration() * this.seeker.value / this.seeker.max) );
      this.progress.value = this.seeker.value;
      this.progress.setAttribute('value', this.seeker.value);
      this.updatePlay();
    };

    this.updateTime = () => {
      this.seeker.value = Math.floor(this.ytplayer.getCurrentTime() / this.ytplayer.getDuration() * this.seeker.max);
      this.seeker.setAttribute('value', this.seeker.value);
      this.progress.value = this.seeker.value;
      this.progress.setAttribute('value', this.seeker.value);
    };


    this.toggleMute = () => {

      if (this.ytplayer.isMuted() == true ) {
        this.volumeButton.classList.remove('swmp-mute');
        this._volume = this.ytplayer.getVolume() ;
        this.ytplayer.unMute();
        this.ytplayer.setVolume(this._volume);
        this.volumeRange.setAttribute('value', this._volume );
        this.volumeRange.value = this._volume;
        this.volumeProgress.setAttribute('value', this._volume );
        this.volumeProgress.value = this._volume;
        swmpConfig.muted = 'false';
        localStorage.swmpMuted = 'false';
      } else {
        this.volumeButton.classList.add('swmp-mute');
        this.ytplayer.mute();
        this.volumeRange.setAttribute('value', 0 );
        this.volumeRange.value = 0;
        this.volumeProgress.setAttribute('value', 0 );
        this.volumeProgress.value = 0;
        swmpConfig.muted = 'true';
        localStorage.swmpMuted = 'true';
      }
    };

    this.updateVolume = (firstrun = false) => {
      this.volumeButton.classList.remove('swmp-mute');

      if (firstrun == true) {
        this.volumeRange.setAttribute('value', this.defaultVolume);
        this.volumeProgress.setAttribute('value', this.defaultVolume);
        this._volume = this.defaultVolume;
        this.volumeButton.classList.add('swmp-min');
      }

      this._volume = this.ytplayer.getVolume();

      this.volumeRange.setAttribute('value', this.volumeRange.value );
      this.volumeProgress.setAttribute('value', this.volumeRange.value );
      this.ytplayer.setVolume(this.volumeRange.value);

      if (this._volume > 50) {
        this.volumeButton.classList.add('swmp-max');
        this.volumeButton.classList.remove('swmp-med');
        this.volumeButton.classList.remove('swmp-min');
      } else if (this._volume > 10) {
        this.volumeButton.classList.add('swmp-med');
        this.volumeButton.classList.remove('swmp-max');
        this.volumeButton.classList.remove('swmp-min');
      } else if (this._volume > 5) {
        this.volumeButton.classList.add('swmp-min');
        this.volumeButton.classList.remove('swmp-max');
        this.volumeButton.classList.remove('swmp-med');
      }

      localStorage.swmpVolume = this.volumeRange.value;
      swmpConfig.volume = this.volumeRange.value;
    };

    this.volumeRange.oninput = (event) => {
      this.updateVolume();
    };
   

  }



  prepareSharedEvents() {

    this.playerContainer.addEventListener('click', event => {
      this.togglePlay();
    });

    this.playerContainer.addEventListener('dblclick', event => {
      this.fullscreen(this.container);
    });

    this.playerContainer.addEventListener('wheel', event => {
      if (swmpConfig.volumeScroll != 'true') {
        return false;
      }
      event.preventDefault();
        if (this.type == 'video' || this.type == 'audio') {
          if (event.wheelDelta > 0) {
            var vol = this.player.volume + 0.04;
            if (vol > 1.0) {
              vol = 1.0;
            }
            
          } else {
            var vol = this.player.volume - 0.04;
            if (vol < 0.0) {
              vol = 0.0;
            }
          }
          var newvolume = Math.floor(vol * 100);
          
        } else if (this.type == 'youtube') {
          if (event.wheelDelta > 0) {
            var vol = this.ytplayer.getVolume() + 4;
            if (vol > 100) {
              vol = 100;
            }
            
          } else {
            var vol = this.ytplayer.getVolume() - 4;
            if (vol < 0) {
              vol = 0;
            }
          }
          var newvolume = vol;
        }
      
        this.volumeProgress.setAttribute('value', newvolume);
        this.volumeProgress.value = newvolume;
        this.volumeRange.setAttribute('value', newvolume);
        this.volumeRange.value = newvolume;
        this.updateVolume(); // Change icon blah blah
      
    }, false);

    this.container.addEventListener('keydown', event => {
      if (event.repeat) { return; } // Don't spam

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
    };
  }

  preparePlayerEvents() {


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
        self.player.timeupdate();
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
    };

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

    this.updateTimer = () => {
      this.currentTimer.textContent = this.formatSeconds(this.player.currentTime);
      //this.totalTimer.textContent = this.formatSeconds(this.player.duration);
    };

    this.togglePlay = () => {
      if (this.player.paused ) {
        this.player.play();
      } else {
        this.player.pause();
      }     
    };

    this.toggleMute = () => {
      if (this.player.muted) {
        this.volumeButton.classList.remove('swmp-mute');
        this.player.muted = false;
        this._volume = this.player.volume;
        this.volumeRange.setAttribute('value', this._volume * 100 );
        this.volumeRange.value = this._volume * 100;
        this.volumeProgress.setAttribute('value', this._volume * 100 );
        this.volumeProgress.value = this._volume * 100;
        swmpConfig.muted = 'false';
        localStorage.swmpMuted = 'false';
      } else {
        this.volumeButton.classList.add('swmp-mute');
        this.player.muted = true;
        this.volumeRange.setAttribute('value', 0 );
        this.volumeRange.value = 0;
        this.volumeProgress.setAttribute('value', 0 );
        this.volumeProgress.value = 0;
        swmpConfig.muted = 'true';
        localStorage.swmpMuted = 'true';
      }
      //console.log(this._volume);
    };

    this.updateVolume = (firstrun = false) => {

      this.volumeButton.classList.remove('swmp-mute');

      if (firstrun == true) {
        this.volumeRange.setAttribute('value', this.defaultVolume);
        this.volumeProgress.setAttribute('value', this.defaultVolume);
        this.volumeButton.classList.add('swmp-min');
        this._volume = this.defaultVolume;

      }

      if (this.player.muted) {
        this.player.muted = false;
      }

      this.volumeRange.setAttribute('value', this.volumeRange.value );
      this.volumeProgress.setAttribute('value', this.volumeRange.value );
      this.player.volume = parseFloat(this.volumeRange.value / 100);
      this._volume = this.player.volume;

      if (this._volume > 0.50) {
        this.volumeButton.classList.add('swmp-max');
        this.volumeButton.classList.remove('swmp-med');
        this.volumeButton.classList.remove('swmp-min');
      } else if (this._volume > 0.10) {
        this.volumeButton.classList.add('swmp-med');
        this.volumeButton.classList.remove('swmp-max');
        this.volumeButton.classList.remove('swmp-min');
      } else if (this._volume > 0.05) {
        this.volumeButton.classList.add('swmp-min');
        this.volumeButton.classList.remove('swmp-max');
        this.volumeButton.classList.remove('swmp-med');
      }

      //console.log(this._volume);

      localStorage.swmpVolume = this.volumeRange.value;
      swmpConfig.volume = this.volumeRange.value;
    };

    this.volumeRange.oninput = (event) => {
      this.updateVolume();
    };

    this.player.addEventListener('volumechange', this.updateVolume() );
    this.updateVolume(true); // First time Run
  }

  formatSeconds = (seconds) => {
    this._sec_num = parseInt(seconds, 10);
    this._hours   = Math.floor(this._sec_num / 3600);
    this._minutes = Math.floor(this._sec_num / 60) % 60;
    this._seconds = this._sec_num % 60;

      return [this._hours,this._minutes,this._seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":");
  }

  removeClassByPrefix(el, prefix) {
    let pattern = '(' + prefix + '(\\s|(-)?(\\w*)(\\s)?)).*?';
    var regEx = new RegExp(pattern, 'g');
    el.className = el.className.replace(regEx, '');
  }

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

  getFileName(url) {
    return url.split('/').pop().split('#')[0].split('?')[0];
  }

  checkURL(url) {

    // if match youtube regex then do this and return
    var result = ytregex.exec(url);
    //console.log(ytregex);
    //console.log(url);
    //console.log(result);
    if (url.match(ytregex) ) {
      console.log('SWMP: YouTube');
      this.type = 'youtube';
      this.videoid = result[1];
      console.log('SWMP: Youtube ID: '+ this.videoid);
      return true;
    }

    console.log("SWMP: Video or Audio");
    // Check filename in URL for Type / MIME.
    this.fileExt = url.split(/[#?&]/)[0].split('.').pop().trim();
    this.fileExt = url.split(/[#?&]/).slice(-2)[0].split('.').pop().trim();
    
    
    console.log(this.fileExt);
    this.fileExt = this.fileExt.toLowerCase();

    switch (this.fileExt) {
        //VIDEO
      case 'avi':
        this.type = 'video';
        this.mime = 'video/x-msvideo';
        break;
      case 'mpeg':
        this.type = 'video';
        this.mime = 'video/mpeg';
        break;
      case 'mpg':
        this.type = 'video';
        this.mime = 'video/mpeg';
        break;
      case 'ogv':
        this.type = 'video';
        this.mime = 'video/ogg';
        break;
      case 'mp4':
        this.type = 'video';
        this.mime = 'video/mp4';
        break;
      case 'webm':
        this.type = 'video';
        this.mime = 'video/webm';
        break;
      case 'flv':
        this.type = 'video';
        this.mime = 'video/x-flv';
        break;
        //AUDIO
      case 'wav':
        this.type = 'audio';
        this.mime = 'audio/x-wav';
        break;
      case 'mp3':
        this.type = 'audio';
        this.mime = 'audio/mpeg';
        break;
      case 'm4a':
        this.type = 'audio';
        this.mime = 'audio/mp4';
        break;
      case 'mp2':
        this.type = 'audio';
        this.mime = 'audio/mpeg';
        break;
      case 'ogg':
        this.type = 'audio';
        this.mime = 'audio/ogg';
        break;
      case 'flac':
        this.type = 'audio';
        this.mime = 'audio/flac';
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
      
      
      if (swmpConfig.positionSide == 'right') {
        var currentleft = parseInt(element.style.left, 10);
        element.style.left = "unset";
        element.style.right = document.documentElement.clientWidth - currentleft - element.offsetWidth + "px";
      }
      
    }

    function mouseMove(e) {
      

      if (!isMouseDown) return;

      if (e.which != '1') {
        isMouseDown = false;
      }
      
      var newMouseX = e.clientX;
      var newMouseY = e.clientY;

      newElmTop = newMouseY - diffY;
      newElmLeft = newMouseX - diffX;

      rightBarrier = document.documentElement.clientWidth - element.offsetWidth;
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
        element.style.left = newElmLeft + "px";
        element.style.right = "unset";
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
  //console.log("Userscript - "+event.target.tagName);

    // If there are no links in sight, do nothing.
  if (event.target.tagName != 'A' && event.target.parentNode.tagName != 'A') {
    return; 
  }
    // Lets figure out which one is the link. Wont normally chain As inside As so... Sometimes image may be inside span inside A so lets do 3x.
  var clicked = false;
  if (event.target.tagName == 'A') {
    clicked = event.target;
  } else if (event.target.parentNode.tagName == 'A') {
    clicked = event.target.parentNode;
  } else if (event.target.parentNode.parentNode.tagName == 'A') {
    clicked = event.target.parentNode.parentNode;
  }
  
  function getVideo() {
    if (backendScript == '' || backendScript == null || backendScript == undefined || backendScript == 'fourchan') {
      return clicked.getAttribute('href');
    } else if (backendScript == 'vichan') {
      //console.log("Userscript - "+clicked.parentNode.querySelectorAll('p.fileinfo a') );
      
      var allthelinks = clicked.parentNode.querySelectorAll('p.fileinfo a'); // Prevent capturing the (Hide) link on some installs
      var matchinglink = '';
      for (var i = 0; i < allthelinks.length ; i++) {
        if (allthelinks[i].getAttribute('href').match(fileregex) ) {
          matchinglink = allthelinks[i];
        }
      }
      
      if (matchinglink == '') { // Kissu New UI (no thanks, but here it is anyways) <- This should also return normal href if not video?
        matchinglink = clicked;
      }
      
      //console.log("Userscript - "+matchinglink);
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
        if (link.parentNode.querySelector('div.fileText a') != null) {
          if (link.parentNode.querySelector('div.fileText a').getAttribute('title') ) {
            return link.parentNode.querySelector('div.fileText a').getAttribute('title');
          } else {
            return link.parentNode.querySelector('div.fileText a').innerText;
          }
        } else {
          return link.getAttribute('href');
        }
      }
    
      if (backendScript == 'vichan') { // https://regex101.com/r/HivDYB/3
        let regex = new RegExp(`((?:[^\.|^\/|^\=|^\n|^\&])+(?:\.)(?:${swmpConfig.files}))(?:[^(\w)]|$)`, 'gmi'); // Tests for www.webmaster.com/test.webm domain too.
        var newlink = [...link.matchAll(regex)]; // Remove query behind *final filename* &title for old filename on vichan will stay.
        return newlink.slice(-1)[0][1]; // return last in array, grabs t= title for vichan player.php links.
      }
  }

  var clickedHref;
  var clickedFileName;
  var clickedTitle;
  var anythingmatch;

  function isYoutube(link) {
    var result = ytregex.exec(link);

    if (link.match(ytregex) != null ) {
      anythingmatch = true;
      console.log('Userscript - YouTube: '+result[1]); // Video ID
      clickedTitle = 'YouTube: ' + result[1];
      return true;
    } else {
      console.log('Userscript - Not YouTube');
      return false;
    }
  }

  // If youtube

  if (isYoutube(clicked.getAttribute('href') ) ) {
    console.log('Userscript - YouTube link clicked');
    clickedHref = clicked.getAttribute('href');
    //clickedTitle = 'Loading YouTube';
  }

  function isVideo(link) {
    var result = fileregex.exec(link);

    if (link.match(fileregex) != null) {
      anythingmatch = true;
      console.log('Userscript - Video/Audio match:' + result);
      return true;
    } else {
      console.log('Userscript - Not Video/Audio');
      return false;
    }
  }

  //get video links
  clickedHref = getVideo();

  if (isVideo(clickedHref) )  {
    //clickedHref = getVideo();
    clickedFileName = getFileNameFromUrl(clicked.getAttribute('href') );
    clickedTitle = false;
    if (backendScript == '' || backendScript == null || backendScript == undefined) {
      clickedTitle = decodeURI(clickedFileName); //Change with other scripts later if it doesn't already contain the title.
    } else if (backendScript == 'fourchan') {
      clickedTitle = decodeURI(getTitle(clicked) );
    } else if (backendScript == 'vichan') {
      clickedTitle = getTitle(decodeURI(clicked.getAttribute('href') ) );
    } else {
      clickedTitle = decodeURI(clickedFileName); //Change with other scripts later if it doesn't already contain the title.
    }
   
    console.log("Userscript - URL: " + clicked.getAttribute('href') );
    console.log("Userscript - Filename: " + clickedFileName );
    console.log("Userscript - Title: " + clickedTitle);
  }

  if (anythingmatch != true) {
    return false;
  } else {
    // If video audio or youtube matched, prevent other events.
    event.preventDefault();
    event.stopPropagation();
  }
  



  // Okay, time to load the player.
  var playerid = false;

  if (swmpConfig.allowMultiple != 'false')  {
    playerid = `play-swmp-${clicked.getAttribute('href')}`;
  } else {
    playerid = 'play-swmp';
  }

  if (typeof(document.getElementById(playerid)) != 'undefined' && document.getElementById(playerid) != null) {
    if (swmpConfig.allowMultiple != 'false')  {
      return false; //already exists, lets do nothing.
    } else {
      document.getElementById(playerid).remove();
      //already exists, lets get rid of it. 
    }
  }
  
  //console.log(playerid+clickedHref+clickedTitle);
  let newembed = new swmp({
    id: playerid,
    url: clickedHref,
    title: clickedTitle
  });
  
  //console.log(backendScript);
  if (backendScript == 'jschan') { // To preserve tab to select player and enable player keybinds like close/fullscreen/pause/mute.
    clicked.parentNode.parentNode.appendChild(newembed.container);
  } else {
    clicked.parentNode.appendChild(newembed.container);
  }


}, true); // Fuck other scripts.
