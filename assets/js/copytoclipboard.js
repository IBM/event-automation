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

function createWordWrapIcon() {
  // Create word wrap icon - IBM "text-wrap" icon
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.style.width = "16px";
  svg.style.height = "16px";

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M24,9H4V7H24ZM4,13H20a4,4,0,0,1,4,4v2.17l1.59-1.58L31,19l-4,4-4-4,1.41-1.41L26,19.17V17a2,2,0,0,0-2-2H4Zm0,6H14v2H4Zm0,6H24v2H4Z");
  path.setAttribute("fill", "#ffffff");

  svg.appendChild(path);
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

// Function to check and update wrap button visibility
function checkAndUpdateWrapButton(codeBlock, buttonContainer, copyButton) {
  var needsScrolling = codeBlock.scrollWidth > codeBlock.clientWidth ||
                       codeBlock.scrollHeight > codeBlock.clientHeight;
  
  var existingWrapButton = buttonContainer.querySelector('.toggle-word-wrap');
  var isWrapped = codeBlock.classList.contains("wrap-enabled");
  
  // Keep button if wrapped OR if there's overflow
  var shouldShowButton = needsScrolling || isWrapped;
  
  if (shouldShowButton && !existingWrapButton) {
    // Add wrap button if needed and doesn't exist
    var wrapButton = document.createElement("button");
    wrapButton.className = "toggle-word-wrap";
    wrapButton.title = isWrapped ? "Unwrap text" : "Wrap text";
    wrapButton.setAttribute("aria-label", isWrapped ? "Unwrap text" : "Wrap text");
    var wrapIcon = createWordWrapIcon();
    wrapButton.appendChild(wrapIcon);

    // Insert wrap button before copy button
    buttonContainer.insertBefore(wrapButton, copyButton);
    
    // Add wrap button event listener
    wrapButton.addEventListener("click", function () {
      if (codeBlock.classList.contains("wrap-enabled")) {
        codeBlock.classList.remove("wrap-enabled");
        wrapButton.title = "Wrap text";
        wrapButton.setAttribute("aria-label", "Wrap text");
        // Re-check after unwrapping to see if button should stay
        setTimeout(function() {
          checkAndUpdateWrapButton(codeBlock, buttonContainer, copyButton);
        }, 100);
      } else {
        codeBlock.classList.add("wrap-enabled");
        wrapButton.title = "Unwrap text";
        wrapButton.setAttribute("aria-label", "Unwrap text");
      }
    });
  } else if (!shouldShowButton && existingWrapButton) {
    // Remove wrap button if not needed and not wrapped
    existingWrapButton.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {



document.querySelectorAll("p").forEach(function (p) {

  const text = p.textContent.trim();
  const isNoteOrTip = (text.startsWith("Note:") || text.startsWith("Tip:")) && !p.querySelector(".cds--inline-notification__icon") && !p.closest(".heroArea");

  if (isNoteOrTip) {
    const svgIcon = `
      <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="cds--inline-notification__icon" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" fill="#0043CB">
        <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z"></path>
      </svg>`;

    const noteBlock = document.createElement("div");
    noteBlock.classList.add("note-block");

    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content");

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("note-icon");
    iconSpan.innerHTML = svgIcon;

    const textSpan = document.createElement("span");
    textSpan.classList.add("note-text");
    textSpan.innerHTML = p.innerHTML;

    noteContent.appendChild(iconSpan);
    noteContent.appendChild(textSpan);
    noteBlock.appendChild(noteContent);

    p.parentNode.replaceChild(noteBlock, p);

    // Check for code block or list immediately after
    let next = noteBlock.nextElementSibling;
    while (next) {
      if (
        next.tagName === "UL" ||
        next.tagName === "CODE" ||
        (next.tagName === "DIV" && next.className.startsWith("language-"))
      ) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("note-code");
        wrapper.appendChild(next.cloneNode(true));
        noteBlock.appendChild(wrapper);
        next.remove(); // Remove original node
        next = noteBlock.nextElementSibling;
      } else {
        break;
      }
    }
  }
  
  
  if ((p.textContent.trim().startsWith("Important:") || p.textContent.trim().startsWith("Warning:")) &&  !p.querySelector(".cds--inline-notification__icon") && !p.closest(".heroArea")) {
    const svgIcon = `<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="cds--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="#f1c21b"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1	s1,0.4,1,1S10.6,16,10,16z"></path><path d="M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z" data-icon-path="inner-path" opacity="0"></path></svg>`;

    const importantBlock = document.createElement("div");
    importantBlock.classList.add("important-block");

    const importantContent = document.createElement("div");
    importantContent.classList.add("important-content");

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("important-icon");
    iconSpan.innerHTML = svgIcon;

    const textSpan = document.createElement("span");
    textSpan.classList.add("important-text");
    textSpan.innerHTML = p.innerHTML;

    importantContent.appendChild(iconSpan);
    importantContent.appendChild(textSpan);
    importantBlock.appendChild(importantContent);

    p.parentNode.replaceChild(importantBlock, p);



    if (importantBlock.textContent.trim().endsWith(":")) {
        let next = importantBlock.nextElementSibling;
    while (next) {
      if (
        next.tagName === "UL" ||
        next.tagName === "CODE" ||
        (next.tagName === "DIV" && next.className.startsWith("language-"))
      ) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("important-code");
        wrapper.appendChild(next.cloneNode(true));
        importantBlock.appendChild(wrapper);
        next.remove(); // Remove original node
        next = importantBlock.nextElementSibling;
      } else {
        break;
      }
    }
    }
  }
});



  if (!document.body) throw new ReferenceError();
  copyCode();
});

// Function to add copy code buttons to code blocks
function copyCode() {
  var codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach(function (codeBlock) {
    var parent = codeBlock.parentNode;
    
    // Create button container
    var buttonContainer = document.createElement("div");
    buttonContainer.className = "code-block-buttons";
    
    // Create copy button
    var copyButton = document.createElement("button");
    copyButton.className = "copy-to-clipboard";
    copyButton.title = "Copy to clipboard";
    copyButton.setAttribute("aria-label", "Copy to clipboard");

    // Create the SVG icon using the separate function
    var svg = createSVGIcon();

    // Append only the SVG icon to the button (no text)
    copyButton.appendChild(svg);

    // Add copy button to container first
    buttonContainer.appendChild(copyButton);

    // Add the button container to the parent
    parent.insertBefore(buttonContainer, codeBlock);
    
    // Check if code block needs scrolling after rendering
    // Use setTimeout to ensure layout is complete
    setTimeout(function() {
      checkAndUpdateWrapButton(codeBlock, buttonContainer, copyButton);
    }, 100);
    
    // Re-check on window resize
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        checkAndUpdateWrapButton(codeBlock, buttonContainer, copyButton);
      }, 250);
    });

    // Copy button event listener
    copyButton.addEventListener("click", function () {
      copyCodeToClipboard(codeBlock.textContent);
      copyButton.className = "copied-to-clipboard";
      copyButton.title = "Copied!";
      copyButton.setAttribute("aria-label", "Copied!");
      var checkmarkSVG = createCheckmarkSVG();
      copyButton.innerHTML = ""; // Clear the button's content
      copyButton.appendChild(checkmarkSVG);
      copyButton.disabled = true;

      setTimeout(function () {
        copyButton.className = "copy-to-clipboard";
        copyButton.title = "Copy to clipboard";
        copyButton.setAttribute("aria-label", "Copy to clipboard");
        var svg = createSVGIcon();
        copyButton.innerHTML = ""; // Clear the button's content
        copyButton.appendChild(svg);
        copyButton.disabled = false;
      }, 5000);
    });

  });
}

function copyCodeToClipboard(code) {
  var textarea = document.createElement("textarea");
  textarea.value = code;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}