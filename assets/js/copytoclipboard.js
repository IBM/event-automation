function createSVGIcon() {
  // Create an SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "icon";
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.style.width = "14px"; // Adjust the width of the SVG icon
  svg.style.height = "14px"; // Adjust the height of the SVG icon

  // Create a rectangle element for transparent background
  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", "32");
  rect.setAttribute("height", "32");
  rect.setAttribute("fill", "none");

  // Create SVG path elements
  var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"
  );
  path1.setAttribute("transform", "translate(0)");
  path1.setAttribute("fill", "#ffffff"); // Set icon color to white

  var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z");
  path2.setAttribute("transform", "translate(0)");
  path2.setAttribute("fill", "#ffffff"); // Set icon color to white

  // Append the elements to the SVG
  svg.appendChild(rect);
  svg.appendChild(path1);
  svg.appendChild(path2);

  return svg;
}

function createCheckmarkSVG() {
  // Create the SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-label", "2 / 2 checks OK");
  svg.setAttribute("role", "img");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("width", "16");
  svg.setAttribute("data-view-component", "true");
  svg.setAttribute("class", "octicon octicon-check");

  // Create the path element
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z");

  // Set the style attributes
  path.style.fill = "white";

  // Append the path to the SVG
  svg.appendChild(path);

  return svg;
}


document.addEventListener("DOMContentLoaded", function () {
  if (!document.body) throw new ReferenceError();

  var codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach(function (codeBlock) {
    var parent = codeBlock.parentNode;
    var button = document.createElement("button");
    button.className = "copy-to-clipboard";
    button.title = "Copy to clipboard";

    // Create the SVG icon using the separate function
    var svg = createSVGIcon();

    // Create a span for the "Copy" text
    var copyText = document.createElement("span");
    copyText.innerText = " Copy";

    // Append the SVG and copyText elements to the button
    button.appendChild(svg);
    button.appendChild(copyText);

    // Add the button to the parent container
    parent.insertBefore(button, codeBlock);

    button.addEventListener("click", function () {
      copyCodeToClipboard(codeBlock.textContent);
      button.className = "copied-to-clipboard";
      button.title = "Copied to clipboard";
      var checkmarkSVG = createCheckmarkSVG();
      button.innerHTML = ""; // Clear the button's content
      copyText.innerText = " Copied!";
      button.appendChild(checkmarkSVG);
      button.appendChild(copyText);
      button.disabled = true;

      setTimeout(function () {
        button.className = "copy-to-clipboard";
        button.title = "Copy to clipboard";
        var svg = createSVGIcon();
        button.innerHTML = ""; // Clear the button's content
        // Create a span for the "Copy" text
        copyText.innerText = " Copy";
        button.appendChild(svg);
        button.appendChild(copyText);
        button.disabled = false;
      }, 5000);
    });
  });
});

function copyCodeToClipboard(code) {
  var textarea = document.createElement("textarea");
  textarea.value = code;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
