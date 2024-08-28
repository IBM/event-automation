// Assisted by WCA for GP
// Latest GenAI contribution: granite-20B-code-instruct-v2 model

const trustedLinks = ['ibm.com','ibm.biz','docs.openshift.com']

function isTrustedDomain(link){
  var trusted = false;

  trustedLinks.forEach(x=>{
    if(link.href.includes(x)){
      trusted = true;
    }
  });

  return trusted;
}

function addHandlersForButtons(){
  const links = document.getElementsByTagName('a');
  const buttonLinks = document.getElementsByClassName('button primary large');
  console.log(buttonLinks);
  const blankLinks = [];

  // Convert HTMLCollection to array
  Array.from(links).forEach(function(link) {
    if (link.getAttribute("target") === "_blank") {
      // Check if href attribute exists

      if (link.hasAttribute("href") && !isTrustedDomain(link))  {
        blankLinks.push(link); // Push the link element itself
      }
      
    }
  });


    // Convert HTMLCollection to array
    Array.from(buttonLinks).forEach(function(link) {
      if (link.hasAttribute("url")) {
      blankLinks.push(link);
      }
    });




  blankLinks.forEach(function(link) {
    link.addEventListener('click', handleLinkClick);
    // Attach event listener directly to the link element
  });

  const params = new URLSearchParams(window.location.search);
  const param = params.get("URL");
  const hash = location.hash;
  let param_value = param+hash;
  try{
    document.getElementById("linkContainter").innerHTML = `<a href="${param_value}">${param_value}</a>`;
    document.getElementById("ibm-ind-link").innerHTML = `<a href="${param_value}" class="ibm-forward-link" target="_self" rel="nofollow external">Continue </a>`;
  } catch(e){
  }
}
  

document.addEventListener('DOMContentLoaded', addHandlersForButtons , false);

function handleLinkClick(event) {
  // Check if the target of the click event is a link with the "target" attribute set to "_blank

  if (
    event.currentTarget.tagName === "A" &&
    event.currentTarget.getAttribute("target") === "_blank"
  ) {
    // Prevent the default behavior of following the link
    event.preventDefault();
    console.log(window.location.pathname);

    // Extract the href attribute from the link
    const href1 = event.target.getAttribute("href");
    // Get the current URL pathname
  var pathname = window.location.pathname;

  // Check for the presence of certain segments
  if (pathname.includes("/es/") || pathname.includes("/eem/") || pathname.includes("/ep/")) {
    // Redirect to the longer URL
    window.open(`../../../redirecting?URL=${href1}`);
  } else {
    // Redirect to the shorter URL
    window.open(`../../redirecting?URL=${href1}`);
  }
   
    return href1;
    // Open a new window with the href as the URL
    // window.open(href, "_blank");
  }
  
  else if (
    event.currentTarget.className === "button primary large" &&
    event.currentTarget.hasAttribute("url")
  ) {
    let url = event.currentTarget.getAttribute("url");
    window.open(`../../redirecting?URL=${url}`);
    return url;
    // Open a new window with the href as the URL
    // window.open(href, "_blank");
  }

}