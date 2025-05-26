$(document).ready(function () {
  // Animated title
  anime({
    targets: '#animatedTitle',
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 1500,
    easing: 'easeOutExpo'
  });

  // Initialize Leaflet map
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Sample data for 10 countries
  const countryData = [
    {
      name: 'Japan',
      capital: 'Tokyo',
      population: '126.3M',
      food: 'Sushi',
      landmark: 'Mount Fuji',
      fact: 'Japan has more pets than children.',
      latlng: [36.2048, 138.2529]
    },
    {
      name: 'France',
      capital: 'Paris',
      population: '67.4M',
      food: 'Croissant',
      landmark: 'Eiffel Tower',
      fact: 'France has the most time zones of any country.',
      latlng: [46.6034, 1.8883]
    }
    // Add more countries here
  ];

  function displayCountry(country) {
    $('#passportCard').html(`<h3>${country.name}</h3><p>Capital: ${country.capital}</p>`);
    $('#populationCard').html(`<h3>Population</h3><p>${country.population}</p>`);
    $('#foodCard').html(`<h3>Famous Food</h3><p>${country.food}</p>`);
    $('#landmarkCard').html(`<h3>Landmark</h3><p>${country.landmark}</p>`);
    $('#funFactCard').html(`<h3>Fun Fact</h3><p>${country.fact}</p>`);

    const miniMap = L.map('miniMap').setView(country.latlng, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap);
  }

  // Randomly pick a country to show
  $('#nextCountry').on('click', function () {
    const randomIndex = Math.floor(Math.random() * countryData.length);
    displayCountry(countryData[randomIndex]);
  });

  $('#searchInput').on('keypress', function (e) {
    if (e.which === 13) {
      const input = $(this).val().toLowerCase();
      const match = countryData.find(c => c.name.toLowerCase() === input);
      if (match) {
        $('#homePage').hide();
        $('#countryPage').show();
        displayCountry(match);
      }
    }
  });

  $('#backToMap').on('click', function () {
    $('#countryPage').hide();
    $('#homePage').show();
  });

  // Example: Click on map to show countryPage (simulate functionality)
  map.on('click', function () {
    const randomIndex = Math.floor(Math.random() * countryData.length);
    $('#homePage').hide();
    $('#countryPage').show();
    displayCountry(countryData[randomIndex]);
  });
});
