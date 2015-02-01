;(function () {
    var modalCount = 0;

    var mmm = function (message, options) {
      if(!options) {
        options = {};
      }

      if(!options.closeText) {
        options.closeText = 'OK';
      }

      if(!options.raw) {
        options.raw = false;
      }

      if(!options.transitionDuration) {
        options.transitionDuration = 0.5;
      }

      modalCount++;

      var modal = document.createElement('div');
      var close = document.createElement('button');
      var overlay = document.createElement('div');
      var content = document.createElement('p');

      modal.id = 'miniMiniModal' + modalCount;
      modal.className = 'miniMiniModal miniMiniHidden';
      overlay.id = 'miniMiniOverlay' + modalCount;
      overlay.className = 'miniMiniOverlay miniMiniHidden';
      close.id = 'miniMiniClose' + modalCount;
      close.className = 'miniMiniClose';

      close.addEventListener('click', function() {
        removeModal(modal, overlay, options.transitionDuration);
      });
      overlay.addEventListener('click', function() {
        removeModal(modal, overlay, options.transitionDuration);
      });

      close.textContent = options.closeText;

      if(options.raw) {
        modal.textContent = message;
      } else {
        content.innerHTML = message;
        modal.appendChild(content);
      }

      modal.appendChild(close);

      document.body.appendChild(modal);
      document.body.appendChild(overlay);

      close.focus();

      //trigger reflow
      //getComputedStyle(modal).cssText;
      modal.offsetHeight;

      //start animation
      modal.className = modal.className.replace(/miniMiniHidden/g, '');
      overlay.className = overlay.className.replace(/miniMiniHidden/g, '');
    };

    function removeModal(modal, overlay, transitionDuration) {
      modal.className += ' miniMiniHidden';
      overlay.className += ' miniMiniHidden';

      setTimeout(function() {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
      }, 1000 * transitionDuration);
    }

    //don't override in case of a collision
    if(!window.mmm) {
        window.mmm = mmm;
    }
})();