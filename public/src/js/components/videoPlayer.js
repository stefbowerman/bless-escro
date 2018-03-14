function VideoPlayer(container) {
  if( typeof container == "undefined") return false;;

  this.name        = 'VideoPlayer';
  this.container   = container;
  this.playerEl    = container.querySelectorAll('.video-container__player')[0];
  this.playButton  = container.querySelectorAll('.video-container__play-btn')[0];
  this.player      = null;
  this.playerState = null;

  this.playButton.addEventListener('click', this.onPlayButtonClick.bind(this));
}

VideoPlayer.prototype = {
  bindYTPlayer: function() {
    var self = this;
    var uniqID = this.container.getAttribute('id') + '-player';

    this.playerEl.setAttribute('id', uniqID);
    this.player = new YT.Player(uniqID, {
        width: self.container.clientWidth,
        height: self.container.clientHeight,
        videoId: self.container.getAttribute('data-video-id'),
        playerVars: {
          rel: 0,
          autohide: 1,
          controls: 2,
          // showinfo: this.isMobile,
          modestbranding: 1,
          wmode: "transparent",
          // origin: t.origin
        },
        events: {
          onReady: function(e) {
            // if !mobile
            e.target.playVideo();
          },
          onStateChange: function(e) {
            switch (e.data) {
            case YT.PlayerState.PLAYING:
                self.onPlaying();
                break;
            case YT.PlayerState.PAUSED:
                self.onPaused();
                break;
            case YT.PlayerState.ENDED:
                self.onFinished();
            }                
          }
        }
      });
  },
  switchToState: function(state) {
    
    var prefix = 'video-container--';

    if(this.state) {
      this.container.classList.remove(prefix + this.state);
    }

    this.state = state;
    this.container.classList.add(prefix + this.state);
  },
  onPlaying: function() {
    this.switchToState('playing');
  },
  onFinished: function() {
    this.switchToState('finished');
  },
  onPaused: function() {
    this.switchToState('paused');
  },
  onPlayButtonClick: function(e) {
    e.preventDefault();

    if(this.player) {
      this.player.playVideo();
    }
    else {
      if(typeof window.YT == "undefined") {
        
        window.onYouTubeIframeAPIReady = this.bindYTPlayer.bind(this);

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      else {
        this.bindYTPlayer();
      }
    }     
  }
};

module.exports = VideoPlayer;