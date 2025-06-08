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
    $('#regionCard').html(`<h3>Region</h3><p>${country.region}</p>`);

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
      const funFact = {
        "Afghanistan": "Afghanistan is home to one of the world's oldest oil paintings, found in the Bamiyan Caves.",
        "Algeria": "Algeria is the largest country in Africa by land area.",
        "Argentina": "Argentina is the birthplace of the tango dance.",
        "Australia": "Australia is home to more kangaroos than people.",
        "Bangladesh": "Bangladesh has the world's largest river delta: the Sundarbans, also home to Bengal tigers.",
        "Belgium": "Belgium is known for inventing fries (yes, 'French' fries!).",
        "Brazil": "Brazil is the only country in South America that speaks Portuguese.",
        "Canada": "Canada has more lakes than the rest of the world combined.",
        "Chile": "Chile is home to the world's driest desert, the Atacama.",
        "China": "China invented paper, printing, gunpowder, and the compass—called the Four Great Inventions.",
        "Colombia": "Colombia is one of the most biodiverse countries in the world.",
        "Czechia": "Czechia (Czech Republic) has the most castles per square mile in Europe.",
        "Denmark": "Denmark is consistently ranked one of the happiest countries in the world.",
        "Dominican Republic": "The Dominican Republic was the site of the first European settlement in the Americas.",
        "Egypt": "Ancient Egypt was among the first civilizations to use writing—hieroglyphics.",
        "Ethiopia": "Ethiopia is the only African country never to be colonized.",
        "Finland": "Finland has more saunas than cars!",
        "France": "France is the most visited country in the world.",
        "Germany": "Germany is home to over 1,500 varieties of sausages.",
        "Ghana": "Ghana was the first African country to gain independence from colonial rule in 1957.",
        "Greece": "Greece is considered the cradle of Western civilization and democracy.",
        "Hungary": "Hungary has a spa culture, with over 1,000 hot springs across the country.",
        "India": "India is the world's largest producer of films—Bollywood makes over 1,000 movies a year.",
        "Indonesia": "Indonesia has over 17,000 islands—only about 6,000 are inhabited.",
        "Iran": "Iran is home to one of the world's oldest civilizations, with cities dating back thousands of years.",
        "Iraq": "Iraq is the site of ancient Mesopotamia, known as the cradle of civilization.",
        "Ireland": "Ireland has no native snakes—thanks to legend, St. Patrick chased them away.",
        "Israel": "Israel has the most startups per capita in the world.",
        "Italy": "Italy has more UNESCO World Heritage Sites than any other country.",
        "Japan": "Japan has a 'crying sumo' contest where wrestlers try to make babies cry for good luck.",
        "Kenya": "Kenya is famous for its long-distance runners, many of whom come from the Rift Valley.",
        "Malaysia": "Malaysia has the world's largest cave chamber—Sarawak Chamber in Borneo.",
        "Mexico": "Mexico introduced chocolate, chilies, and corn to the world.",
        "Morocco": "Morocco is home to the world's oldest university—University of al-Qarawiyyin in Fez.",
        "Netherlands": "About a quarter of the Netherlands lies below sea level.",
        "New Zealand": "New Zealand has more sheep than people—about 5 to 1.",
        "Nigeria": "Nigeria is the most populous country in Africa and has a booming film industry called Nollywood.",
        "Norway": "Norway introduced the world to the paperclip!",
        "Pakistan": "Pakistan is home to the world's second-highest mountain—K2.",
        "Peru": "Peru is home to Machu Picchu, an ancient Incan city hidden in the Andes.",
        "Philippines": "The Philippines is made up of over 7,000 islands.",
        "Poland": "Poland is home to the world's biggest castle—Malbork Castle.",
        "Portugal": "Portugal is the oldest country in Europe with the same defined borders since 1139.",
        "Russia": "Russia is the largest country in the world by land area.",
        "Saudi Arabia": "Saudi Arabia has no rivers—none at all!",
        "South Africa": "South Africa has three capital cities: Pretoria, Cape Town, and Bloemfontein.",
        "South Korea": "South Korea is a global leader in internet speed and tech innovation.",
        "Spain": "Spain produces over 40% of the world's olive oil.",
        "Sweden": "Sweden gives each citizen access to a public 'right to roam' in nature—called 'Allemansrätten'.",
        "Thailand": "Thailand is home to the world's smallest mammal: the bumblebee bat.",
        "United States": "The U.S. has no official language at the federal level—even though English is the most spoken."
      };

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
        "United States": "Burgers",
        "Armenia": "Khorovats",
        "Austria": "Wiener Schnitzel",
        "Belarus": "Draniki",
        "Bhutan": "Ema Datshi",
        "Bolivia": "Salteñas",
        "Botswana": "Seswaa",
        "Cambodia": "Amok Trey",
        "Cameroon": "Ndolé",
        "Costa Rica": "Gallo Pinto",
        "Croatia": "Peka",
        "Cuba": "Ropa Vieja",
        "Dominica": "Callaloo Soup",
        "Ecuador": "Hornado",
        "El Salvador": "Pupusas",
        "Estonia": "Verivorst",
        "Fiji": "Kokoda",
        "Gabon": "Poulet Nyembwe",
        "Georgia": "Khachapuri",
        "Guatemala": "Kak'ik",
        "Honduras": "Baleadas",
        "Iceland": "Hákarl",
        "Jamaica": "Ackee and Saltfish",
        "Jordan": "Mansaf",
        "Kazakhstan": "Beshbarmak",
        "Laos": "Larb",
        "Latvia": "Grey Peas with Bacon",
        "Lebanon": "Kibbeh",
        "Lithuania": "Cepelinai",
        "Luxembourg": "Judd mat Gaardebounen",
        "Madagascar": "Romazava",
        "Malta": "Stuffat tal-Fenek",
        "Moldova": "Mămăligă",
        "Mongolia": "Buuz",
        "Mozambique": "Piri Piri Chicken",
        "Nepal": "Momo",
        "Nicaragua": "Gallo Pinto",
        "North Macedonia": "Tavče Gravče",
        "Oman": "Shuwa",
        "Panama": "Sancocho",
        "Paraguay": "Sopa Paraguaya",
        "Romania": "Sarmale",
        "Senegal": "Thieboudienne",
        "Serbia": "Ćevapi",
        "Singapore": "Hainanese Chicken Rice",
        "Slovakia": "Bryndzové Halušky",
        "Slovenia": "Potica",
        "Sri Lanka": "Kottu Roti",
        "Sudan": "Ful Medames",
        "Suriname": "Pom",
        "Tanzania": "Ugali",
        "Tunisia": "Couscous with Lamb",
        "Turkey": "Kebabs",
        "Uganda": "Matoke",
        "Ukraine": "Varenyky",
        "United Arab Emirates": "Harees",
        "Uruguay": "Chivito",
        "Uzbekistan": "Plov",
        "Venezuela": "Arepas",
        "Vietnam": "Pho",
        "Zambia": "Nshima",
        "Zimbabwe": "Sadza"
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
          region: `${c.region}`,
          fact: funFact[name] || '',
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
