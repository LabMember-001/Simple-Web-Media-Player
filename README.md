# Simple Web Media Player

## About

The default HTML5 media player is obnoxiously ugly on legacy imageboards so this was written to be an easily modifiable script to run media files in browser while keeping a more oldschool look to fit with the rest of the site.

There is a basic media player class that can be installed on any website, but I've also written a userscript so that this can be easily implemented on any site running Wakaba/TinyIB/Vichan/LynxChan/jschan to inject the script and replace the default media player. It will also work on pretty much any site that has direct links to video or audio files though some sites for various design/event reasons may need custom implementations.


#### Browser Support

- Webkit (Chrome, Opera, Vivaldi, Safari, Brave)
- Gecko (Firefox, Tor, LibreWolf)

It is likely there will be CSS bugs with other engines.
Only tested with Firefox, Tor(?), Vivaldi and Safari, bug reports welcome.

## Features

#### Settings Menu

To open the settings menu right click on the window titlebar or the controls. Video right click functionality is preserved.

#### Themes

Comes preinstalled with 4 styles of the default MPC inspired theme. MPC Light, MPC Dark, Kurisumasu, and Blue Moon.
Also included a more modern-like theme, Modernity.

Many sites have different vibes they want to give off so are on a per-domain basis so you can best pick the theme that suits each site.

#### Player Behavior

You can also override some defaults such as disabling autoplay, disabling loop, or even allowing to run multiple players at once. By default if you open a media file while one is playing the old player will be replaced.

#### Keybinds

Keybinds while media is focused: [Space] = Play/Pause, [F] = Fullscreen Toggle, [X] = Close Window, [M] = Toggle Mute, [Esc] = Exit Fullscreen (Browser Default).
In general on most sites you will be able to press Tab after opening the link to open the player to select the player and enable keybinds specifically for that player without interfering with other keybind shortcuts you may have.

## Installation

#### Userscript install:

If you have a userscript manager like greasemonkey/tampermonkey/violentmonkey you may [install](https://github.com/LabMember-001/Simple-Web-Media-Player/raw/main/swmp.user.js) script. If you would like to read the full code there is a non-minified version here. 

Note that the Youtube player does not load in Greasemonkey 4, use Violentmonkey.

#### Website installation

Repository: [Github](https://github.com/LabMember-001/Simple-Web-Media-Player)

Full Download: -

Add swmp.js to your page.

Create and place a video anywhere on any site by doing minor modifications to:

```
// Create a new element and define type (audio/video) and url (internal or external)
var newembed = new swmp({
	url: "example.mp3",
});
// Put new element inside defined element.
document.getElementById("example").appendChild(newembed.container); // Define where to place video with id, class, or whatever method you prefer.
```				

If you want to make videos manually instead of using the built in link filename detection make sure to assign the manually created player an ID if you want to make the multi configuration work. The built in link click scanner will assign any video created with an ID of the href from that file.

The script automatically checks if the file extension supplied is audio/video and gives appropriate MIME type.

By setting 'windowed' to false on player creation the constructor will create an inline player. Otherwise you can drag and move the window wherever you want or close the player. You may also override some defaults.

## Configuration

Some sites may need additional changes done to the script. The script is configured to only activate on certain sites, but you may open the file and replace the existing site regex with a catch all regex found right below the script's website configuration.

## Demo

[Demo](https://okabe.moe/projects/simplewebmediaplayer/#demo) - Try before installing.
