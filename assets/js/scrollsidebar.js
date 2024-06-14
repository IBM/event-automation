document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementsByClassName("nav__list")[0]
  
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