(function(window, undefined){

    // var getClosest = require('./components/dom/getClosest');
    var Flickity  = require('flickity');
    var Marquee3k = require('./components/marquee3000.babel');
    var VideoPlayer = require('./components/videoPlayer');

    // Videos
    var videoPlayers = [];
    var videoContainers  = document.querySelectorAll('[data-video-id]');

    [].forEach.call(videoContainers, function(el) {
      videoPlayers.push( new VideoPlayer(el) );
    });    

    // Slider
    var slider = document.getElementById('slider');
    var captions = document.getElementsByClassName('caption');

    var options = {
      wrapAround: true,
      pageDots: false,
      prevNextButtons: false,
      autoPlay: 3000,
      selectedAttraction: 0.02
    };

    slider.classList.add('is-loading');

    var flickitySlider = new Flickity(slider, options);

    flickitySlider.on('select', function(index) {
      for (var i = captions.length - 1; i >= 0; i--) {
        var c = captions[i];

        if(c.classList.contains('is-active')) {
          c.classList.remove('is-active');
        }
      }

      if(captions.length > flickitySlider.selectedIndex) {
        captions[flickitySlider.selectedIndex].classList.add('is-active');
      }

      // Pause any players that aren't part of the current slide
      flickitySlider.slides.forEach(function(slide, i) {
        if (i !== flickitySlider.selectedIndex) {
          slide.cells.forEach(function(cell) {
            videoPlayers.forEach(function(player, i) {
              if (cell.element.contains(player.container)) {
                player.pause()
              }
            })
          })
        }
      })
    });

    flickitySlider.stopPlayer();

    window.addEventListener('load', function() {
      flickitySlider.resize();
      slider.classList.remove('is-loading');
      flickitySlider.playPlayer();
    });

    Marquee3k.init({
      selector: 'ticker'
    });

})(window);
