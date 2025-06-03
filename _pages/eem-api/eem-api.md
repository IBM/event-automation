---
title: "Event Endpoint Management Admin API"
permalink: /eem-api/
layout: apiFrame
mastheadNavItem: APIs
---

<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
h2.ex1 {
  margin-left: 32px;
}

.dropbtn {
  background-color: #0f62fe;
  justify-content: space-between;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn svg {
  margin-left: 12px;
}

.dropbtn:hover, .dropbtn:focus {
  background-color: #2980B9;
}

.dropdown {
  position: relative;
  display: inline-block;
  margin-left: 32px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}
</style>
</head>

<body>

<h2 class="ex1">Select your Event Endpoint Management version to view the compatible Admin API documentation:</h2>

<div class="dropdown">
<button onclick="myFunction()" class="dropbtn">
  Select Event Endpoint Management version  
  <svg version="1.1" id="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve" width="16" height="16">
    <style type="text/css">
      .st0{fill:none;}
    </style>
    <polygon style="fill: white;" points="16,22 6,12 7.4,10.6 16,19.2 24.6,10.6 26,12 "/>
    <rect id="_x3C_Transparent_Rectangle_x3E_" class="st0" width="32" height="32"/>
  </svg>
</button>
  <div id="myDropdown" class="dropdown-content">
    <a href="../eem-api-116/">11.6.x</a>
    <a href="../eem-api-115/">11.5.x</a>
    <a href="../eem-api-114/">11.4.x</a>
    <a href="../eem-api-113/">11.3.x</a>
  </div>
</div>

<script>
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
</script>

</body>
</html>
