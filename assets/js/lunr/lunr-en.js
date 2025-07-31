---
layout: null
---

var idx = lunr(function () {
  this.field('title')
  this.field('excerpt')
  this.field('categories')
  this.field('tags')
  this.field('collection')
  this.ref('id')

  this.pipeline.remove(lunr.trimmer)

  for (var item in store) {
    this.add({
      title: store[item].title,
      excerpt: store[item].excerpt,
      categories: store[item].categories,
      tags: store[item].tags,
      collection: store[item].collection,
      id: item
    })
  }
});

$(document).ready(function () {
  const filterButton = document.querySelector('.filter-button');
  const filterDropdown = document.querySelector('.filter-dropdown');
  const filterIcon = document.querySelector('.filter-icon');
  const filterIconHidden = document.querySelector('.filter-icon-hidden');
  const checkboxes = document.querySelectorAll('.filter-dropdown input[type="checkbox"]');

  // Store original button content
  const originalText = 'Filter by';

  // Toggle dropdown
  filterButton.addEventListener('click', (e) => {
    if (e.target.classList.contains('clear-icon')) return;

    filterDropdown.classList.toggle('show');
    const isOpen = filterDropdown.classList.contains('show');
    filterIcon.style.display = isOpen ? 'none' : 'inline-block';
    filterIconHidden.style.display = isOpen ? 'inline-block' : 'none';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.classList.remove('show');
      filterIcon.style.display = 'inline-block';
      filterIconHidden.style.display = 'none';
    }
  });

  // Update filter button UI
  function updateFilterUI() {
    const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    if (selectedCount > 0) {
      filterButton.classList.add('selected');

      // Clear existing content
      filterButton.innerHTML = '';

      // Create filter-count span
      const countSpan = document.createElement('span');
      countSpan.className = 'filter-count';
      countSpan.textContent = `${selectedCount} `;

      // Create clear icon
      const clearIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      clearIcon.setAttribute('class', 'clear-icon');
      clearIcon.setAttribute('focusable', 'true');
      clearIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clearIcon.setAttribute('fill', 'white');
      clearIcon.setAttribute('aria-hidden', 'true');
      clearIcon.setAttribute('width', '20');
      clearIcon.setAttribute('height', '20');
      clearIcon.setAttribute('viewBox', '0 0 32 32');
      clearIcon.setAttribute('style', 'position: absolute; cursor: pointer;');
      clearIcon.innerHTML = `<path d="M17.4141 16L24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z"></path>`;
      clearIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach(cb => cb.checked = false);
        updateFilterUI();
        searchResults(document.getElementById('search'));
      });

      countSpan.appendChild(clearIcon);
      filterButton.appendChild(countSpan);

      // Add "filters selected" text
      filterButton.appendChild(document.createTextNode(' filters selected'));

      // Add icons
      filterButton.appendChild(filterIcon);
      filterButton.appendChild(filterIconHidden);

      filterIcon.style.display = 'none';
      filterIconHidden.style.display = 'inline-block';
    } else {
      filterButton.classList.remove('selected');
      filterButton.innerHTML = originalText;
      filterButton.appendChild(filterIcon);
      filterButton.appendChild(filterIconHidden);

      filterIcon.style.display = 'inline-block';
      filterIconHidden.style.display = 'none';
    }
  }

  // Checkbox change handler
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateFilterUI();
      searchResults(document.getElementById('search'));
    });
  });

  // Search input
  $('input#search').on('keyup', function (event) {
    searchResults(event.target);
  });
});



function searchResults(theSearchInput) {
  var resultdiv = $('#results');
  var query = $(theSearchInput).val().toLowerCase();

  // Get selected versions
  const checkboxes = document.querySelectorAll('.filter-dropdown input[type="checkbox"]');
  let selectedVersions = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // Perform Lunr search
  var result = idx.query(function (q) {
    query.split(lunr.tokenizer.separator).forEach(function (term) {
      q.term(term, { boost: 100 });
      if (query.lastIndexOf(" ") !== query.length - 1) {
        q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
      }
      if (term !== "") {
        q.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
      }
    });
  });

  resultdiv.empty();

  let searchJson = {};
  let uniqueTitles = [];

  result.forEach((searchResult) => {
    let documentItem = store[searchResult.ref];
    let documentTitle = documentItem.title;
    let documentID = documentTitle ? documentTitle.replace(/ /g, '_') : '';
    let documentationVersion = documentItem.collection;
    let documentIsTutorial = documentationVersion === 'tutorials';
    let documentIsSupport = documentationVersion === 'support';

    // Filter by selected versions
    if (selectedVersions.length > 0) {
      let match = selectedVersions.some(version => documentationVersion.startsWith(version));
      if (!match) return;
    }
  // Get the selected collections



     // Ignore old collections
     if (['es_2018.3.1', 'es_2019.4', 'es_2019.2.1', 'es_2019.1.1', 'es_10.0', 'es_10.1', 'es_10.2', 'es_10.3'].includes(documentationVersion)) {
      return;
    }

    let obj = {
      id: documentID,
      title: documentTitle,
      url: documentItem.url,
      version: documentItem.collection,
      documentIsTutorial,
      documentIsSupport,
      versionYear: 0,
      versionQuarter: 0,
      versionNumber: 0
    };

    let fullText = documentItem.content || documentItem.excerpt || "";
    let contentWords = fullText.split(/\s+/);
    let queryTerms = query.split(/\s+/);

    // Find the first index where any query term appears
    let matchIndex = contentWords.findIndex(word =>
      queryTerms.some(term => word.toLowerCase().includes(term))
    );

    // If no match found, fallback to start
    if (matchIndex === -1) matchIndex = 0;

    let start = Math.max(0, matchIndex - 10);
    let end = Math.min(contentWords.length, matchIndex + 10);

    // Highlight all query terms
    let snippet = contentWords.slice(start, end).map(word => {
      let lowerWord = word.toLowerCase();
      let isMatch = queryTerms.some(term => lowerWord.includes(term));
      return isMatch ? `<b>${word}</b>` : word;
    }).join(" ");

    obj.excerpt = snippet;

    
    if (!documentIsSupport && !documentIsTutorial) {
      let versionParts = documentationVersion.split('.');
      obj.versionYear = versionParts[0];
      obj.versionQuarter = versionParts[1];
      obj.versionNumber = versionParts[2];
    }

    if (!searchJson[documentID]) {
      searchJson[documentID] = [];
      uniqueTitles.push(documentID);
    }
    searchJson[documentID].push(obj);
  });

  // Show filtered result count
  let totalFilteredResults = Object.keys(searchJson).reduce((acc, key) => acc + searchJson[key].length, 0);
  resultdiv.prepend('<div class="numberOfResults"><p class="results__found secondary">' + totalFilteredResults + ' {{ site.data.ui-text[site.locale].results_found | default: "Result(s) found" }}</p></div>');

  // Build result cards
  var structure = "";


  let result_keys = Object.keys(searchJson);

  result_keys.forEach((documentTopic) => {
    let sortedTopicsByVersion = searchJson[documentTopic].sort((objA, objB) => {
      let result = 0;

      if(objA.versionYear > objB.versionYear) {
        result = -1;
      } else if(objA.versionYear < objB.versionYear) {
        result = 1;
      } else if(objA.versionQuarter > objB.versionQuarter) {
        result = -1;
      } else if(objA.versionQuarter < objB.versionQuarter) {
        result = 1;
      } else if(objA.versionNumber > objB.versionNumber) {
        result = -1;
      } else if(objA.versionNumber < objB.versionNumber) {
        result = 1;
      }

      return result;
    });

    let title = sortedTopicsByVersion[0].title;
    let excerpt = sortedTopicsByVersion[0].excerpt;

    structure += `<h2>${title}</h2>`;
    sortedTopicsByVersion.forEach((topic, index) => {
      if (index === 0 || excerpt !== topic.excerpt) {
        let currentVersion = topic.excerpt;
        let url = topic.url.includes('/connectors/') && topic.url.includes('/index')
          ? topic.url.replace('/index', '/installation')
          : topic.url;

          url = url.includes('/transforms-xml/installation') ? url.replace('/installation', '/Configuration'): url;
        structure += `<div class="card" onclick="pushHistoryState(this);window.open('${url}','_self')">`;
        structure += `<p>${topic.excerpt}...</p>`;
        structure += `<div class="versionContainer">`;
        structure += `<p class="foundIn heading-five">Found in:</p><br>`;

        sortedTopicsByVersion.forEach((ver) => {
          if (ver.excerpt === currentVersion) {
            let label = ver.version.startsWith("ep") ? "Event Processing - " + ver.version.slice(3)
              : ver.version.startsWith("eem") ? "Event Endpoint Management - " + ver.version.slice(4)
              : ver.version.startsWith("es") ? "Event Streams - " + ver.version.slice(3)
              : ver.version.startsWith("connectors") ? "Connectors - " + ver.title
              : ver.version;

            let verUrl = ver.url.includes('/connectors/') && ver.url.includes('/index')
              ? ver.url.replace('/index', '/installation')
              : ver.url;
            verUrl = ver.url.includes('/transforms-xml/installation') ? ver.url.replace('/installation', '/Configuration'): ver.url;

            structure += `<div class="versionPillContainer" onMouseOver="pillHover(this);" onMouseOut="pillBlur(this);" href="${verUrl}">`;
            structure += `<a class="versionPill" href="${verUrl}">${label}</a>`;
            structure += `</div>`;
          }
        });

        structure += `<div class="ctaArea"><img alt="" role="presentation" src="{{site.url}}{{ site.baseurl }}/assets/images/icons/next.svg" /></div>`;
        structure += `</div></div>`;
      }
    });
  });

  resultdiv.append(structure);
}

function pillHover(currentPill) {
  let parent = currentPill.parentElement;
  let versionContainer = parent.parentElement;
  let children = parent.childNodes;
  let cta = versionContainer.querySelectorAll('.ctaArea');
  children.forEach(child => {
    if (child !== currentPill) child.classList.add("inactive");
  });
  if (cta[0]) cta[0].classList.add("hide");
}

function pillBlur(currentPill) {
  let parent = currentPill.parentElement;
  let versionContainer = parent.parentElement;
  let children = parent.childNodes;
  let cta = versionContainer.querySelectorAll('.ctaArea');
  children.forEach(child => child.classList.remove("inactive"));
  if (cta[0]) cta[0].classList.remove("hide");
}

function pushHistoryState() {
  var query = document.getElementById('search').value.toLowerCase();
  var stateObj = { foo: "bar" };
  history.pushState(stateObj, "Search Documentation", "?q=" + query);
}
