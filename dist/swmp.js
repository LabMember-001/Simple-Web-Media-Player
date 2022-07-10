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

var fileregex = new RegExp(`\.(${swmpConfig.files})+$`, 'gmi');
var ytregex = new RegExp("^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be|yewtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)", "gmi");

class swmp {

	/**
	 * @param {Object} obj 
	 * @param {string} obj.url File url
	 * @param {string} [obj.id] Id 
	 * @param {string} [obj.type] "video" or "audio" player. Youtube too.
	 * @param {string} [obj.myme] MIME type for source, Example: "video/webm". Feed to enable checking for file support (webm not supported by iOS)
	 * @param {string} [obj.poster] Optional Video Preview for when autoplay is off.
	 * @param {string} [obj.autoplay] Optional Autoplay
	 * @param {string} [obj.loop] Optional Loop
	 * @param {string} [obj.windowed] Optional set false to disable windowed mode and place inline
	 * @returns 
	 */
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
    
    this.volumeScroll = (event) => {
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
    };

    this.container.addEventListener('wheel', event => {
      this.volumeScroll(event);
    });

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
          window.scrollTo({
            top: this._scroll['y'],
            left: this._scroll['x'],
            behavior: 'auto'
          });
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
          this._scroll = {'x' : window.scrollX, 'y' : window.scrollY};
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

