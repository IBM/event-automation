var request;
var loadedContent;
var filterStorage;
var sinkSourceArrowAnimationLoaded = false;

let FILTER_TYPES = {
  SUPPORT: 'supportLevelFilter',
  TYPE: 'typeLevelFilter'
};

function makeRequest(url, callback) {
  if (request) {
    request.abort()
  }

  request = new XMLHttpRequest();
  request.open('GET', url, true);

  let timeOfStartingRequest;

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      request = null
      let responseTime = Date.now() - timeOfStartingRequest;
      if (this.status >= 200 && this.status < 400) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(this.responseText, 'text/html');
        loadedContent = doc.getElementById('contentLoadContainer').innerHTML;

        callback(doc, null, responseTime)
      } else {
        callback(null, new Error('Request failed'), responseTime);
      }
    }
  };

  timeOfStartingRequest = Date.now();
  request.send();
}

function removeClassFrom(item, className) {
  item.classList.remove(className);
}

function removeClassFromCollection(collection, className) {
  [...collection].map(item => removeClassFrom(item, className));
}

function addClassTo(element, className) {
  element.classList.add(className);
}

function addClassToCollection(collection, className) {
  [...collection].map(item => addClassTo(item, className));
}

function isActive(element) {
  return element.classList.contains('active');
}

function getById(id) {
  return document.getElementById(id);
}

function getByClassName(className) {
  return document.getElementsByClassName(className);
}

function connectorCategory() {
  getById('connectorsContent').classList.remove('show');
}

function loadConnector(url) {
  makeRequest(url, (response, err) => {
    if(err) { throw err }

    let connectorContent = response.getElementById('initial-content').innerHTML;
    getById('connectorsPage').innerHTML = connectorContent
    getById('connectorsContent').classList.remove('hide');
  });
}

function connectorCard(card, url) {
  let selectedCard = card.parentElement;
  let isAlreadyActive = isActive(selectedCard);
  let allConnectorCards = getByClassName('buttonContainer');

  removeClassFromCollection(allConnectorCards, 'active');
  addClassTo(selectedCard, 'active');

  if(!isAlreadyActive) {
    setTimeout(() => {
      addClassTo(getById('connectorsAll'), 'connectorOpen');
    }, 10)

    sinkSourceArrowAnimationLoaded = false;

    makeRequest(url, (response, err, responseTime) => {
      if(err) { throw err }

      let loadedContent = response.getElementById('contentLoadContainer').innerHTML;

      if (responseTime < 400) {
        setTimeout(() => {
          getById('contentLoadContainer').innerHTML = loadedContent;
          addHandlersForButtons();
          copyCode();
        }, 400)
      } else {
        getById('contentLoadContainer').innerHTML = loadedContent;
        addHandlersForButtons();
      }

      setTimeout(() => {
        removeClassFrom(getById('connectorsPage'), 'loading');
      }, 450)

      setActiveCategory(sessionStorage.connectorCategory);
    });

    getById('connectorsPage').classList.add('loading');

    history.pushState(null, null, url);
    addClassTo(getById('connectorsContent'), 'show');
    testFixHeight();
  }

  setActiveCategory(sessionStorage.connectorCategory);
}

// Function to filter cards based on main filters and search input
function filterCards() {
  const cardsContainer = document.getElementById("cardsContainer");
  const searchInput = document.getElementById("catalog-search-input");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchedConnectorsExistInfo = document.getElementById("searchedConnectorsExistInfo");
  const connectorsEmptyState = document.getElementById("connectorsEmptyState");
  const connectorsExistInfo = document.getElementById("connectorsExistInfo");
  let visibleMatchCount = 0;
  const allCards = cardsContainer.querySelectorAll(".connector-card");
  addClassToCollection(allCards, 'hide');
  //Reset error messages
  addClassTo(noResultsMessage, 'hide');
  addClassTo(searchedConnectorsExistInfo, 'hide');
  addClassTo(connectorsExistInfo, 'hide');
  addClassTo(connectorsEmptyState, 'hide');
  
  const isFilterActive = document.querySelector(".connectorsCards .filterContent.filterActive")
  let filteredCards = isFilterActive ? getFilteredCards() : Array.from(allCards)
  removeClassFromCollection(filteredCards, 'hide');
  const query = searchInput.value.trim().toLowerCase();

  // If search is active
  if(query!==""){
      addClassTo(cardsContainer, 'search-active');
      filterCardsByText(filteredCards)
  } else { 
    // If search is inactive
    removeClassFrom(cardsContainer, 'search-active');
    filteredCards.forEach(card => {
      const isInCurrentTab = card.offsetParent !== null;
      if (isInCurrentTab) {
        visibleMatchCount++;
      } else  {
        addClassTo(card, 'hide');
      }
    });
    // If available is some tab and filter is active
    if(filteredCards?.length===0 && isFilterActive){
      removeClassFrom(connectorsEmptyState, 'hide');
    }
    // If available is some tab and card not in active tab
    else if(filteredCards?.length>0 && visibleMatchCount === 0){
      removeClassFrom(connectorsExistInfo, 'hide');
    } 
    // If NOT available in any of the tabs
    else if(filteredCards?.length===0 && !isFilterActive) {
      removeClassFrom(noResultsMessage, 'hide');
    }
  }
}

function filterCardsByText(filteredCards) {
  const searchInput = document.getElementById("catalog-search-input");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchedConnectorsExistInfo = document.getElementById("searchedConnectorsExistInfo");
  const connectorsEmptyState = document.getElementById("connectorsEmptyState");
  let visibleMatchCount = 0;
  let textExistsInSomeCard = false
  const query = searchInput.value.trim().toLowerCase();
  const isFilterActive = document.querySelector(".connectorsCards .filterContent.filterActive")
  filteredCards.forEach(card => {
    const isInCurrentTab = card.offsetParent !== null;
    const cardTitle = card.querySelector('.content .cardconnectorTitle').textContent.toLowerCase();
    const cardDescription = card.querySelector('.content .cardConnectorDescription').textContent.toLowerCase();
    const cardText = cardTitle+cardDescription;
    if(cardText.includes(query)){
      textExistsInSomeCard = true
    }
    if (isInCurrentTab && cardText.includes(query)) {
      visibleMatchCount++;
    } else  {
      addClassTo(card, 'hide');
    }
  });
  // If available is some tab and filter is active
  if(!textExistsInSomeCard && isFilterActive){
    removeClassFrom(connectorsEmptyState, 'hide');
  }
  // If available is some tab and card not in active tab
  else if(textExistsInSomeCard && visibleMatchCount === 0 && query!==""){
    removeClassFrom(searchedConnectorsExistInfo, 'hide');
    document.getElementById("search-term").innerHTML = `"${query}"`
    const slug = sessionStorage.getItem('connectorCategory')
    //to get the tab name, query all tabs and find the one that includes the slug stored in session storage
    const tabElements = document.querySelectorAll('.connectorsCategories .visible-links .menuItem')
    const currentTabIndex = Array.from(tabElements).findIndex(el => el.classList.contains(slug))
    const tabTitle = tabElements[currentTabIndex].querySelector('p').textContent
    //sliced to remove the count of cards and "s" from tab heading
    document.getElementById("tab-name").textContent = tabTitle.slice(0,tabTitle.lastIndexOf(' ')-1).toLowerCase();
  } 
  // If NOT available in any of the tabs
  else if(!textExistsInSomeCard && query!=="") {
    removeClassFrom(noResultsMessage, 'hide');
  }
}

function testFixHeight() {
  if (getWidth() <= 1024) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setTimeout(() => {
      addClassTo(getById('connectorsAll'), 'connectorOpen');
    }, 10)
  }
}

function subPageChange(selectedTab, url) {
  // set clicked card to active
  let allSubTabs = getByClassName('tab');
  removeClassFromCollection(allSubTabs, 'active');
  addClassTo(selectedTab, 'active');

  sinkSourceArrowAnimationLoaded = false;

  addClassTo(getById('subPageContent'), 'loading');

  makeRequest(url, (response, err, responseTime) => {
    if(err) { throw err }

    loadedContent = response.getElementById('thePageContent').innerHTML;

    if (responseTime < 400) {
      addClassTo(getById('subPageContent'), 'loading');
      setTimeout(() => {
        getById('thePageContent').innerHTML = loadedContent
      }, 400 - responseTime)
      setTimeout(() => {
        removeClassFrom(getById('subPageContent'), 'loading');
      }, 410)

    } else {
      getById('thePageContent').innerHTML = loadedContent
      setTimeout(() => {
        removeClassFrom(getById('subPageContent'), 'loading');
      }, 400)
    }

    setActiveCategory(sessionStorage.connectorCategory);
  })

  history.pushState(null, null, url);
  addClassTo(getById('connectorsContent'), 'show');
}

function fixSplashHeight(set) {
  if (set) {
    // get splashPanel height
    let splashPanelHeight = getById('splashPanel').clientHeight;
    // provide it's height
    getById('splashPanel').setAttribute('style', 'height:' + splashPanelHeight + 'px');

    let splashPanelWidth = getById('connectorsCardsContainer').clientWidth;
    // provide it's height
    getById('mobileSplashPanel').setAttribute('style', 'width:' + splashPanelWidth + 'px');
    getById('connectorsCards').setAttribute('style', 'width:' + splashPanelWidth + 'px');

    setTimeout(() => {
      getById('connectorsAll').classList.add('connectorOpen');
    }, 10)
  } else {
    getById('splashPanel').removeAttribute('style');
  }
}

  function updatePlaceholder() {
  const slug = sessionStorage.connectorCategory;

    const inputField = document.getElementById('catalog-search-input');
    if (slug == "sink" || slug == "source") {
    inputField.placeholder = `Search for ${slug} connectors`;
    }  
    else if (slug == "converters" ){
      inputField.placeholder = `Search for converters`;
    }
    else if (slug == "transformations"  ){
      inputField.placeholder = `Search for transformations`;
    }
    else {
      inputField.placeholder = `Search Connect catalog`;
    }
}

function filterCategories(slug, connectorsHomeURL) {
  setActiveCategory(slug);

  sessionStorage.connectorCategory = slug;
  sessionStorage.categoryURL = connectorsHomeURL;
  updatePlaceholder();
}

function setActiveCategory(slug) {
  getById('connectorsCards').removeAttribute('class');
  addClassTo(getById('connectorsCards'), 'connectorsCards');
  addClassTo(getById('connectorsCards'), slug);

  getById('connectorsCategories').removeAttribute('class');
  addClassTo(getById('connectorsCategories'), 'connectorsCategories');
  addClassTo(getById('connectorsCategories'), slug);

  // countVisibleCards();
}

function toggleTag(object, group, tagID) {
  clearTagActiveStates(group);

  getTagStorage(group);
  if (filterStorage === tagID) {
    clearTagStorage(group);
  } else {
    setTag(object, group, tagID)
  }

  calculateFilters();
}

function calculateFilters() {
  calculateFilterTags();
  // calculateFilterCards();
  filterCards();
  // countVisibleCards();
}

function filterPageLoadCheck() {
  if (sessionStorage.typeFilter || sessionStorage.supportLevelFilter) {
    toggleFilterArea('open');
  }
}

function calculateFilterTags() {
  let supportFilter = sessionStorage.supportLevelFilter
  let typeFilter = sessionStorage.typeFilter

  if (supportFilter) {
    addClassTo(getById(supportFilter), 'active');
  }

  if (typeFilter) {
    addClassTo(getById(typeFilter), 'active');
  }

  if (typeFilter || supportFilter) {
    getById('cardsContainer').classList.add('filterActive')
    addClassTo(getById('filterArea'), 'visible');
    addClassTo(getById('filterToggle'), 'visible');
    setFilterTabIndex(0);

    addClassTo(getById('filterToggle'), 'filterActive');
    addClassTo(getById('filterArea'), 'filterActive');
  } else {
    removeClassFrom(getById('cardsContainer'), 'filterActive');
    removeClassFrom(getById('filterArea'), 'filterActive');
    removeClassFrom(getById('filterToggle'), 'filterActive');
  }
}

function calculateFilterCards() {
  let supportFilter = sessionStorage.supportLevelFilter
  let typeFilter = sessionStorage.typeFilter
  let supportFilterQuery = ''
  let typeFilterQuery = '';

  if (supportFilter) {
    supportFilterQuery = '.' + sessionStorage.supportLevelFilter
  }

  if (typeFilter) {
    typeFilterQuery = '.' + sessionStorage.typeFilter
  }

  addClassToCollection(getByClassName('buttonContainer'), 'hide');
  let query = supportFilterQuery + typeFilterQuery;
  if (query) {
    let queriedCards = document.querySelectorAll(query);

    if (queriedCards) {
      removeClassFromCollection(queriedCards, 'hide');
    }

    // countVisibleCards();
  }
}

//Get cards filtered by active filters
function getFilteredCards() {
  let supportFilter = sessionStorage.supportLevelFilter
  let typeFilter = sessionStorage.typeFilter
  let supportFilterQuery = ''
  let typeFilterQuery = '';

  if (supportFilter) {
    supportFilterQuery = '.' + sessionStorage.supportLevelFilter
  }

  if (typeFilter) {
    typeFilterQuery = '.' + sessionStorage.typeFilter
  }

  let query = supportFilterQuery + typeFilterQuery;
  if (query) {
    const queriedCards = document.querySelectorAll(query);
    return queriedCards
  } 
  const cardsContainer = document.getElementById("cardsContainer");
  return cardsContainer.querySelectorAll(".connector-card")
}

function countVisibleCards() {
  addClassTo(getById('connectorsEmptyState'), 'hide');
  let visibleCards = 0;
  let allCards = [...getById('cardsContainer').children];

  allCards.map(card => {
    if (window.getComputedStyle(card).display !== 'none') {
      visibleCards++;
    }
  });

  if (!visibleCards) {
    getById('connectorsEmptyState').classList.remove('hide');
  }
}

function resetAllTags() {
  sessionStorage.removeItem(FILTER_TYPES.SUPPORT);
  sessionStorage.removeItem(FILTER_TYPES.TYPE);
}

function getTagStorage(key) {
  switch(key) {
    case FILTER_TYPES.SUPPORT:
      filterStorage = sessionStorage.supportLevelFilter; break;
    case FILTER_TYPES.TYPE:
      filterStorage = sessionStorage.typeFilter; break;
  }
}

function clearTagStorage(group) {
  switch(group) {
    case FILTER_TYPES.SUPPORT:
      sessionStorage.removeItem(FILTER_TYPES.SUPPORT);
      clearTagActiveStates(group);
      break;
    case FILTER_TYPES.TYPE:
      sessionStorage.removeItem(FILTER_TYPES.TYPE);
      clearTagActiveStates(group);
      break;
    default:
      sessionStorage.removeItem(FILTER_TYPES.SUPPORT);
      sessionStorage.removeItem(FILTER_TYPES.TYPE);
      clearTagActiveStates();
      break;
  }
}

function clearTagActiveStates(group) {
  let allToggles;

  if (group) {
    let groupID = document.getElementById(group);
    allToggles = groupID.getElementsByClassName('tagToggle');
  } else {
    allToggles = getByClassName('tagToggle');
  }

  removeClassFromCollection(allToggles, 'active');
}

function setTag(object, key, value) {
  switch(key) {
    case FILTER_TYPES.SUPPORT:
      sessionStorage.supportLevelFilter = value; break;
    case FILTER_TYPES.TYPE:
      sessionStorage.typeFilter = value; break;
  }

  addClassTo(object, 'active');
}

function changeSubpage(index, url) {
  window.open(url, '_self');
}

function toggleSplash(defaultURL) {
  removeClassFrom(getById('connectorsAll'), 'connectorOpen');
  let categoryBaseURL = sessionStorage.categoryURL || defaultURL;
  let allConnectorCards = getByClassName('buttonContainer');
  removeClassFromCollection(allConnectorCards, 'active');

  history.pushState(null, null, categoryBaseURL);
}

function loadSinkSourceAnimation() {
  if (!sinkSourceArrowAnimationLoaded) {
    let svgContainer = getById('sinkSourceArrow');
    if (svgContainer) {
      sinkSourceArrowAnimation = bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'svg',
        loop: true,
        autoplay: true,
        path: '../../assets/animation/sinkSourceArrow.json'
      });
      sinkSourceArrowAnimation.setSpeed(1.5);
      svgContainer.innerHTML = '';
      sinkSourceArrowAnimationLoaded = true;
    }
  }
}

window.addEventListener('popstate', (event) => {
  window.location.href = window.location.href;
});

function clearFilterArea() {
  getById('filterIcon').focus();
  removeClassFrom(getById('filterArea'), 'filterActive');
  removeClassFrom(getById('filterToggle'), 'filterActive');

  clearTagStorage();
  calculateFilters();
}

function toggleFilterArea(override) {
  let isFilterOpen;

  addClassTo(getById('filterArea'), 'animate');
  addClassTo(getById('filterToggle'), 'visible');

  switch(override) {
    case 'open':
      isFilterOpen = false; break;
    case 'close':
      isFilterOpen = true; break;
    default: 
      isFilterOpen = getById('filterArea').classList.contains('visible'); break;
  }

  if (isFilterOpen) {
    // if a filter is not active, then close the panel
    removeClassFrom(getById('filterArea'), 'visible');
    removeClassFrom(getById('filterToggle'), 'visible');
    setFilterTabIndex(-1);
    getById('filterIcon').focus();
  } else {
    getById('filterArea').classList.add('visible');
    setFilterTabIndex(0);
  }
}

function setFilterTabIndex(tabIndexNumber = 0) {
  let allFiltersTabs = [...document.getElementsByClassName('tagToggle')];
  allFiltersTabs.map(tab => tab.tabIndex = tabIndexNumber);

  let triggerArea = [...document.getElementsByClassName('filterTriggerArea')];
  triggerArea.map(area => area.tabIndex = tabIndexNumber);
}

function mobileBackButton(defaultURL) {
  let categoryHomeURL = sessionStorage.categoryURL || defaultURL;

  removeClassFrom(getById('connectorsAll'), 'connectorOpen');

  getById('mainConnectorContent').remove();

  let allConnectorCards = getByClassName('buttonContainer');
  removeClassFromCollection(allConnectorCards, 'active');
  
  history.pushState(null, null, categoryHomeURL);

  setTimeout(() => {
    fixSplashHeight(false);
  }, 400)
}

(function () {
  // ======== SCROLL FUNCTION ======== //
  const scrollTo = (element, to, duration) => {
    if (duration <= 0) {
      return;
    }
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      scrollTo(element, to, duration - 10);
    }, 10);
  }
});
