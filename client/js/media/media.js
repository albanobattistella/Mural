const $ = require('jquery');
const FADE_DURATION = 200;

function fadeout(media) {
  $(media).animate({volume: 0}, FADE_DURATION, function() {
    media.pause();
  });
}

function fadein(id, media) {
  media.volume = 0;
  const playPromise = media.play();

  playPromise.then(function() {
    $(media).animate({volume: 1}, FADE_DURATION);
  }).catch(function(e) {
    // mute video & audio for mobile platform autoplay.
    media.muted = true;

    // insert an unmute button for mobile.
    const mobileUnmute = $('<span/>', {
      class: 'mobile-mute muted'
    }).click(function() {
      media.muted = false;
      $(this).remove();
    });
    $(`#story0-${id}`).append(mobileUnmute);

    return media.play();
  });

  return playPromise;
}

function canPlayThroughPromise(media, srcs) {
  return new Promise(function(resolve, reject) {
    function canPlayThrough() {
      media.removeEventListener('canplaythrough', canPlayThrough);
      media.removeEventListener('loadeddata', loadedMetaData);
      resolve();
    }

    function loadedMetaData() {
      // media is in browser cache
      if (media.readyState > 3) {
        media.removeEventListener('canplaythrough', canPlayThrough);
        media.removeEventListener('loadeddata', loadedMetaData);
        resolve();
      }
    }

    media.addEventListener('canplaythrough', canPlayThrough);
    media.addEventListener('loadeddata', loadedMetaData);

    media.onerror = function(e) {
      media.onerror = null;
      resolve();
    }

    srcs.forEach((src, i) => {
      const source = document.createElement('source'); 
      source.type = src.type;
      source.src = src.src;
      media.appendChild(source);

      // resolve if error on sources (404)
      if (i === srcs.length - 1) {
        source.addEventListener('error', function(e) {
          resolve();
        });
      }
    });

    // resolve incase of invalid sources.
    if (!srcs.length) {
      resolve();
    }
  });
}


module.exports = {
  canPlayThroughPromise,
  fadeout,
  fadein
};
