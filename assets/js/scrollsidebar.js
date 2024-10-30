document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementsByClassName("nav__list")[0]
    // if (window.location.pathname !== '/event-integration/event-automation-docs/' || window.location.pathname !== '/event-automation/' ) {
      const headings = document.querySelectorAll("h2:not(.titlepreview):not(.archive__item-title), h3:not(.cardconnectorTitle), h4");
  
      headings.forEach((heading) => {
        const icon = document.createElement("span");
        const anchor = document.createElement("a");
        if(heading.id){
          anchor.href = `#${heading.id}`;
          anchor.className = "heading-anchor";
          anchor.title = "Copy to clipboard";
          anchor.innerHTML = `<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.25,6.76a6,6,0,0,0-8.5,0l1.42,1.42a4,4,0,1,1,5.67,5.67l-8,8a4,4,0,1,1-5.67-5.66l1.41-1.42-1.41-1.42-1.42,1.42a6,6,0,0,0,0,8.5A6,6,0,0,0,17,25a6,6,0,0,0,4.27-1.76l8-8A6,6,0,0,0,29.25,6.76Z"></path>
          <path d="M4.19,24.82a4,4,0,0,1,0-5.67l8-8a4,4,0,0,1,5.67,0A3.94,3.94,0,0,1,19,14a4,4,0,0,1-1.17,2.85L15.71,19l1.42,1.42,2.12-2.12a6,6,0,0,0-8.51-8.51l-8,8a6,6,0,0,0,0,8.51A6,6,0,0,0,7,28a6.07,6.07,0,0,0,4.28-1.76L9.86,24.82A4,4,0,0,1,4.19,24.82Z"></path>
          </svg>`;
    
          icon.appendChild(anchor);
          heading.appendChild(icon);
    
          anchor.addEventListener("click", (event) => {
            event.preventDefault();
            const url = new URL(window.location.href);
            url.hash = `#${heading.id}`;
            if (window.location.href.includes(`#${heading.id}`)) return;
            window.history.pushState({}, "", url.href);
            navigator.clipboard.writeText(url);
           });
          }
      });
    // }

  

  if(container) {
    const element = container.getElementsByClassName("active")[0]

    if (element && !isInViewport(element)) {
    container.scrollTop = element.offsetTop - container.offsetTop - window.innerHeight/2.2;
      //element.scrollIntoView({ block: "center" });    
    }
  }
}, false);

function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
}


