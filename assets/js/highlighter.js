window.addEventListener('DOMContentLoaded', function() {
  var tocLinks = Array.from(document.querySelectorAll('.toc__menu a'));
  var headings = Array.from(document.querySelectorAll('h1, h2, h3'));
  var activeTocItem = null;
  var isClickEvent = false;
  var isScrollEnabled = true;

  function removeActiveClass() {
    tocLinks.forEach(function(link) {
      link.classList.remove('active-link');
    });
    headings.forEach(function(heading) {
      heading.classList.remove('active-heading');
    });
  }

  function highlightActiveTOC() {
    if (!isScrollEnabled) return;

    var winY = window.pageYOffset;
    var windowHeight = window.innerHeight;
    var activeHeading = null;
    var nextHeading = null;

    for (var i = 0; i < headings.length; i++) {
      var rect = headings[i].getBoundingClientRect();
      var headingTop = rect.top + winY;

      if (headingTop <= winY + windowHeight * 0.1) {
        activeHeading = headings[i];
        nextHeading = headings[i + 1];
      } else {
        break;
      }
    }

    if (activeHeading) {
      var anchor = '#' + activeHeading.id;
      activeTocItem = tocLinks.find(function(link) {
        return link.getAttribute('href') === anchor;
      });
    } else {
      activeTocItem = null;
    }

    removeActiveClass();

    if (activeTocItem && !isClickEvent) {
      activeTocItem.classList.add('active-link');
    }
    if (activeHeading) {
      activeHeading.classList.add('active-heading');
    }

    isClickEvent = false;
  }

  function handleClick(event) {
    var clickedLink = event.target;
    var anchor = clickedLink.getAttribute('href');
    var clickedHeading = document.querySelector(anchor);

    removeActiveClass();

    clickedLink.classList.add('active-link');
    clickedHeading.classList.add('active-heading');

    isClickEvent = true;
    isScrollEnabled = false;

    setTimeout(function() {
      isScrollEnabled = true;
    }, 2000);
  }

  function scrollHandler() {
    highlightActiveTOC();
  }

  window.addEventListener('scroll', scrollHandler);

  // Initial highlight on page load
  highlightActiveTOC();

  // Add click event listener to each TOC link
  tocLinks.forEach(function(link) {
    link.addEventListener('click', handleClick);
  });
});