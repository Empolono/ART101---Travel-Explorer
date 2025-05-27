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

  let countryData = [];

  function displayCountry(country) {
    $('#passportCard').html(`<h3>${country.name}</h3><p>Capital: ${country.capital}</p><img src="${country.flag}" alt="Flag of ${country.name}" style="width: 100px; margin-top: 10px;">`);
    $('#populationCard').html(`<h3>Population</h3><p>${country.population}</p>`);
    $('#foodCard').html(`<h3>Famous Food</h3><p>${country.food}</p>`);
    $('#landmarkCard').html(`<h3>Landmark</h3><p>${country.landmark}</p>`);
    $('#funFactCard').html(`<h3>Fun Fact</h3><p>${country.fact}</p>`);

    // Destroy any existing mini map before creating a new one
    if (window.miniMapInstance) window.miniMapInstance.remove();
    window.miniMapInstance = L.map('miniMap').setView(country.latlng, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.miniMapInstance);
  }

  function setupEventHandlers() {
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

    map.on('click', function () {
      const randomIndex = Math.floor(Math.random() * countryData.length);
      $('#homePage').hide();
      $('#countryPage').show();
      displayCountry(countryData[randomIndex]);
    });
  }

  // Fetch countries from REST Countries API
  async function loadCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const foodMap = {
        "Afghanistan": "Kabuli Pulao",
        "Algeria": "Couscous",
        "Argentina": "Asado",
        "Australia": "Meat Pie",
        "Bangladesh": "Hilsa Fish Curry",
        "Belgium": "Waffles",
        "Brazil": "Feijoada",
        "Canada": "Poutine",
        "Chile": "Empanadas",
        "China": "Dumplings",
        "Colombia": "Arepas",
        "Czechia": "Svíčková",
        "Denmark": "Smørrebrød",
        "Dominican Republic": "Mangu",
        "Egypt": "Koshari",
        "Ethiopia": "Injera",
        "Finland": "Karjalanpiirakka",
        "France": "Croissant",
        "Germany": "Bratwurst",
        "Ghana": "Jollof Rice",
        "Greece": "Moussaka",
        "Hungary": "Goulash",
        "India": "Curry",
        "Indonesia": "Nasi Goreng",
        "Iran": "Fesenjan",
        "Iraq": "Masgouf",
        "Ireland": "Irish Stew",
        "Israel": "Shakshuka",
        "Italy": "Pizza",
        "Japan": "Sushi",
        "Kenya": "Nyama Choma",
        "Malaysia": "Nasi Lemak",
        "Mexico": "Tacos",
        "Morocco": "Tagine",
        "Netherlands": "Stroopwafel",
        "New Zealand": "Pavlova",
        "Nigeria": "Egusi Soup",
        "Norway": "Rakfisk",
        "Pakistan": "Biryani",
        "Peru": "Ceviche",
        "Philippines": "Adobo",
        "Poland": "Pierogi",
        "Portugal": "Bacalhau",
        "Russia": "Borscht",
        "Saudi Arabia": "Kabsa",
        "South Africa": "Bobotie",
        "South Korea": "Kimchi",
        "Spain": "Paella",
        "Sweden": "Meatballs",
        "Thailand": "Pad Thai",
        "United States": "Burgers"
      };

      const landmarkMap = {
        "Afghanistan": "Blue Mosque of Mazar-i-Sharif",
        "Algeria": "Casbah of Algiers",
        "Argentina": "Iguazu Falls",
        "Australia": "Sydney Opera House",
        "Bangladesh": "Sundarbans Mangrove Forest",
        "Belgium": "Atomium",
        "Brazil": "Christ the Redeemer",
        "Canada": "CN Tower",
        "Chile": "Easter Island Moai",
        "China": "Great Wall",
        "Colombia": "Salt Cathedral of Zipaquira",
        "Czechia": "Prague Castle",
        "Denmark": "The Little Mermaid",
        "Dominican Republic": "Alcázar de Colón",
        "Egypt": "Pyramids of Giza",
        "Ethiopia": "Lalibela Churches",
        "Finland": "Helsinki Cathedral",
        "France": "Eiffel Tower",
        "Germany": "Brandenburg Gate",
        "Ghana": "Cape Coast Castle",
        "Greece": "Parthenon",
        "Hungary": "Buda Castle",
        "India": "Taj Mahal",
        "Indonesia": "Borobudur",
        "Iran": "Persepolis",
        "Iraq": "Ziggurat of Ur",
        "Ireland": "Cliffs of Moher",
        "Israel": "Western Wall",
        "Italy": "Colosseum",
        "Japan": "Mount Fuji",
        "Kenya": "Maasai Mara",
        "Malaysia": "Petronas Towers",
        "Mexico": "Chichen Itza",
        "Morocco": "Hassan II Mosque",
        "Netherlands": "Kinderdijk Windmills",
        "New Zealand": "Milford Sound",
        "Nigeria": "Zuma Rock",
        "Norway": "Geirangerfjord",
        "Pakistan": "Badshahi Mosque",
        "Peru": "Machu Picchu",
        "Philippines": "Chocolate Hills",
        "Poland": "Wawel Castle",
        "Portugal": "Belem Tower",
        "Russia": "Saint Basil's Cathedral",
        "Saudi Arabia": "Masjid al-Haram",
        "South Africa": "Table Mountain",
        "South Korea": "Gyeongbokgung Palace",
        "Spain": "La Sagrada Familia",
        "Sweden": "Vasa Museum",
        "Thailand": "Grand Palace",
        "United States": "Statue of Liberty"
      };

      // map to custom structure
      countryData = data.map(c => {
        const name = c.name.common; // define name first
        return {
          name,
          capital: c.capital ? c.capital[0] : 'N/A',
          population: (c.population / 1_000_000).toFixed(1) + 'M',
          food: foodMap[name] || 'Unknown Cuisine',
          landmark: landmarkMap[name] || 'Famous Landmark',
          fact: `Region: ${c.region}`,
          latlng: c.latlng || [0, 0],
          flag: c.flags?.png || ''
        };
      });
      
      setupEventHandlers(); // set up buttons/ search after data loads
    } catch (err) {
      console.error('Error fetching country data:', err);
    }
  }

  loadCountries(); // start loading countries on page load
});
