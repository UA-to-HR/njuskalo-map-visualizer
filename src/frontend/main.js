// initialize the map on the "map" div with a given center and zoom
var map = L.map("map-block", { zoomControl: false }).setView(
  [43.51261696083696, 16.458226032690288],
  13
);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("popupopen", function (e) {
  new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

const markersLayer = new L.FeatureGroup();

const searchForm = document.getElementById("search-form");

const spinnerEl = document.getElementById("search-form-spinner");
const buttonEl = document.getElementById("search-form-button");
const inputEl = document.getElementById("search-form-input");
const overlay = document.getElementById("map-overlay");
const searchFormProgress = document.getElementById("search-form-progress");

function displaySpinner(page = 1, total = "?") {
  spinnerEl.style.display = "block";
  buttonEl.style.display = "none";
  searchFormProgress.innerText = `${page} / ${total} pages`;
}

function hideSpinner() {
  spinnerEl.style.display = "none";
  buttonEl.style.display = "block";
}

function buildContentFromPost(post) {
  let slider = '<div class="swiper"><div class="swiper-wrapper">';
  slider += post.images
    ? post.images.map(
        (imageUrl) =>
          '<div class="swiper-slide"><img src="' + imageUrl + '"></div>'
      )
    : "";
  slider +=
    '</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div><div class="swiper-pagination"></div></div>';

  return (
    slider +
    '<a target="_blank" class="map-modal-link" href="' +
    post.url +
    '">' +
    "<p><b>" +
    post.title +
    "</b><br>" +
    post.description +
    "</p></a>"
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTaskStatus(taskId) {
  const response = await fetch("/api/tasks/" + taskId, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });

  return response.json();
}

async function pollTask(taskId, onReady, onPending) {
  // 1 iteration == ~ 2 seconds, so that we will wait for max 5 minutes, 60 * 5 / 2
  const allowedIterations = (60 * 5) / 1;
  let iteration = 0;
  do {
    const taskStatus = await getTaskStatus(taskId);

    if (taskStatus.isReady) {
      onReady(taskStatus.data);
      return;
    } else {
      onPending(taskStatus);
      // 2 second
      await sleep(1000);
    }
  } while (iteration <= allowedIterations);
}

function displayNewMarkers(responseParsed) {
  markersLayer.clearLayers();

  hideSpinner();

  map.panTo(
    new L.LatLng(
      responseParsed.centerAmongCoords.latitude,
      responseParsed.centerAmongCoords.longitude
    )
  );

  responseParsed.njuskaloDataByUrl.forEach((post) => {
    const defaultMarker = post?.map?.mapData?.defaultMarker;
    if (defaultMarker) {
      const coords = [defaultMarker.lat, defaultMarker.lng];
      const marker = L.marker(coords, {
        icon: new L.DivIcon({
          className: defaultMarker.approximate
            ? "map-marker-approximate"
            : "map-marker-exact",
          html: "<span>" + post.price.eur + "&nbsp;€</span>",
        }),
      });
      if (defaultMarker.approximate) {
        const circle = L.circle(coords, defaultMarker?.circle?.radius);
        marker.on("mouseover", function (ev) {
          circle.addTo(map);
        });

        marker.on("mouseout", function (ev) {
          circle.remove(map);
        });
      }

      marker.bindPopup(buildContentFromPost(post), { maxWidth: 560, minWidth: 360 });
      markersLayer.addLayer(marker);
    }
  });

  map.addLayer(markersLayer);

  map.fitBounds(markersLayer.getBounds());

  overlay.style.display = "none";
}

async function doSearch () {
  
    displaySpinner();
  
    const urlToSearch = inputEl.value;
    pushNewUrlIntoQueryParams(urlToSearch);
  
    const url = new URL("/api/map-markers", document.location.origin);
    url.search = new URLSearchParams({ url: urlToSearch }).toString();
  
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
  
    const responseParsed = await response.json();
  
    pollTask(responseParsed.taskId, displayNewMarkers, ({ page, totalPages }) =>
      displaySpinner(page, totalPages ? totalPages : "?")
    );
  }


searchForm.addEventListener("submit",  async (event) => {

  event.preventDefault();

  await doSearch();
  
});


// Work with URLs

const searchUrlQueryParamName =  'search_url';
function pushNewUrlIntoQueryParams(urlToSearch) {
  const url = new URL(window.location);
  url.searchParams.set(searchUrlQueryParamName, urlToSearch);
  window.history.pushState({}, "", url);
}


const currentUrl = new URL(window.location);
if (currentUrl.searchParams.has(searchUrlQueryParamName)) {
  inputEl.value = currentUrl.searchParams.get(searchUrlQueryParamName);
  doSearch();
}