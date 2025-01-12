const regionData = {
    "Москва": [
      { name: "СЗАО", latitude: 55.8010 , longitude: 37.4257, attractions: ["Строгинский затон", "Monterosso", "Серебрянный бор", "Пляж №2", "Пляж №6","Пляж №8"] },
      { name: "САО", latitude: 55.8352, longitude: 37.4783, attractions: ["Динамо", "Лебедь", "Речной", "Левобережный"]},
      { name: "СВАО", latitude: 55.8111, longitude: 37.6629, attractions: ["Путяевский пляж"]},
      { name: "ВАО", latitude: 55.7656, longitude: 37.8188, attractions: ["Терлецкий пляж"] },
      { name: "ЮВАО", latitude: 55.6874, longitude: 37.7934, attractions: ["Пляж 'Кузьминки'"] },
      { name: "ЮАО", latitude: 55.6296, longitude: 37.7109, attractions: ["Пляж 'Борисовский'"] },
      { name: "ЮЗАО", latitude: 55.6361, longitude: 37.4933, attractions: ["Теплостанский пляж" ] },
      { name: "ЗАО", latitude: 55.7468, longitude: 37.4382, attractions: ["Пляж в Крылатском"] }
    ],
    "Новая Москва": [
      { name: "Новомосковский", latitude: 55.6162, longitude: 37.3049, attractions: ["Пыхтинский пляж"] },
      { name: "Троицкий", latitude: 55.5281, longitude: 37.3815, attractions: ["Таежный пляж"] }
      
    ],
    "Московская область до 5 км от МКАД": [
      { name: "Химки", latitude: 55.8892, longitude: 37.4614, attractions: ["Химкинский пляж"] },
      { name: "Мытищи", latitude: 55.9079, longitude: 37.7456, attractions: ["пляж Мираклуб"] },
      { name: "Дзержинский", latitude: 55.6358,  longitude: 37.8579, attractions: ["Дзержинский карьер"] },
      { name: "Булатниково", latitude: 55.5537, longitude: 37.6628, attractions: ["Булатниковский пруд"] },
      { name: "Красногорск", latitude: 55.7993, longitude: 37.3648, attractions: ["Пляж 'Рублево'"] }
    ],
  };
  let selectedRegions = [];
  let selectedCities = [];
  let selectedAttractions = [];
  function updateRegionOptions() {
    const regionList = document.querySelector(".constructor__region-list");
    regionList.innerHTML = "";
    for (const region in regionData) {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = region;
      checkbox.addEventListener("change", () => {
        updateCityOptions();
        updateAttractionOptions();
      });
      const label = document.createElement("label");
      label.textContent = region;
      li.appendChild(checkbox);
      li.appendChild(label);
      regionList.appendChild(li);
    }
  }
  function updateCityOptions() {
    const cityList = document.querySelector(".constructor__city-list");
    cityList.innerHTML = "";
    selectedRegions = Array.from(document.querySelectorAll(".constructor__region-list input[type='checkbox']:checked"))
      .map(checkbox => checkbox.value);
    selectedRegions.forEach(region => {
      const cities = regionData[region];
      cities.forEach(city => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = city.name;
        checkbox.addEventListener("change", updateAttractionOptions);
        const label = document.createElement("label");
        label.textContent = city.name;
        li.appendChild(checkbox);
        li.appendChild(label);
        cityList.appendChild(li);
      });
    });
  }
  function updateAttractionOptions() {
    const attractionsList = document.querySelector(".constructor__attractions-list");
    attractionsList.innerHTML = "";
    selectedCities = Array.from(document.querySelectorAll(".constructor__city-list input[type='checkbox']:checked"))
      .map(checkbox => checkbox.value);
    selectedCities.forEach(cityName => {
      const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
      city.attractions.forEach(attraction => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = attraction;
        const label = document.createElement("label");
        label.textContent = attraction;
        li.appendChild(checkbox);
        li.appendChild(label);
        attractionsList.appendChild(li);
      });
    });
  }
  function updateResult() {
    const resultRegions = document.querySelector(".constructor__result-regions");
    const resultCities = document.querySelector(".constructor__result-cities");
    const resultAttractions = document.querySelector(".constructor__result-attractions");
    const resultTransport = document.querySelector(".constructor__result-transport");
    resultRegions.innerHTML = "";
    resultCities.innerHTML = "";
    resultAttractions.innerHTML = "";
    resultTransport.innerHTML = "";
    selectedRegions.forEach(region => {
      const regionElement = document.createElement("div");
      regionElement.textContent = region;
      resultRegions.appendChild(regionElement);
    });
    selectedCities.forEach(cityName => {
      const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
      const cityElement = document.createElement("div");
      cityElement.textContent = city.name;
      resultCities.appendChild(cityElement);
      const attractionsElement = document.createElement("div");
      selectedAttractions = Array.from(document.querySelectorAll(".constructor__attractions-list input[type='checkbox']:checked"))
        .map(checkbox => checkbox.value);
      selectedAttractions.forEach(attraction => {
        const attractionElement = document.createElement("div");
        attractionElement.textContent = attraction;
        attractionsElement.appendChild(attractionElement);
      });
      resultAttractions.appendChild(attractionsElement);
    });
    const selectedTransport = document.querySelector("input[name='transport']:checked").value;
    const selectedTransportOther = document.querySelector("#transport-other-select").value;
    const transportElement = document.createElement("div");
    if (selectedTransport === "car") {
      transportElement.textContent = "Автомобиль";
    } else {
      transportElement.textContent = selectedTransportOther;
    }
    resultTransport.appendChild(transportElement);
    // Render the map
    renderMap(selectedCities, selectedAttractions);
  }
  function renderMap(cities, attractions) {
    const mapElement = document.querySelector(".constructor__result-map");
    mapElement.innerHTML = "";
    if (cities.length === 0 && attractions.length === 0) {
      return;
    }
    ymaps.ready(function () {
      const myMap = new ymaps.Map(mapElement, {
        center: [55.76, 37.64], // Начальные координаты карты (Москва)
        zoom: 8
      });
      const routePoints = [];
      cities.forEach(cityName => {
        const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.name === cityName))].find(c => c.name === cityName);
        const cityCoords = [city.latitude, city.longitude];
        routePoints.push(cityCoords);
        const cityPlacemark = new ymaps.Placemark(cityCoords, {
          balloonContent: city.name
        });
        myMap.geoObjects.add(cityPlacemark);
      });
      attractions.forEach(attraction => {
        const city = regionData[selectedRegions.find(region => regionData[region].some(c => c.attractions.includes(attraction)))].find(c => c.attractions.includes(attraction));
        const attractionCoords = [city.latitude, city.longitude];
        routePoints.push(attractionCoords);
        const attractionPlacemark = new ymaps.Placemark(attractionCoords, {
          balloonContent: attraction
        });
        myMap.geoObjects.add(attractionPlacemark);
      });
      if (routePoints.length > 0) {
        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: routePoints,
          params: {
            routingMode: 'auto'
          }
        }, {
          boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);
      }
    });
  }
  updateRegionOptions();
  updateCityOptions();
  updateAttractionOptions();
  document.querySelector(".constructor__form").addEventListener("submit", (event) => {
    event.preventDefault();
    updateResult();
  });