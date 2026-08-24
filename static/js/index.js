document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('.navbar-burger');
  var menu = document.getElementById('project-navbar-menu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = burger.classList.toggle('is-active');
      menu.classList.toggle('is-active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var videos = document.querySelectorAll('.sim-task-video');

  function loadVideo(video) {
    if (video.dataset.loaded === 'true') {
      return;
    }

    video.querySelectorAll('source[data-src]').forEach(function (source) {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
    video.dataset.loaded = 'true';
  }

  if ('IntersectionObserver' in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          loadVideo(video);
          if (!reduceMotion) {
            video.play().catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '240px 0px', threshold: 0.05 });

    videos.forEach(function (video) {
      videoObserver.observe(video);
    });
  } else {
    videos.forEach(loadVideo);
  }

  var copyButton = document.querySelector('.citation-copy');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var target = document.getElementById(copyButton.dataset.copyTarget);
      if (!target || !navigator.clipboard) {
        return;
      }

      navigator.clipboard.writeText(target.innerText).then(function () {
        var originalLabel = copyButton.textContent;
        copyButton.textContent = 'Copied';
        window.setTimeout(function () {
          copyButton.textContent = originalLabel;
        }, 1600);
      });
    });
  }
});
