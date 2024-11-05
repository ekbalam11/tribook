const { getApartments } = require('./controllers/index')

// Replace with your actual map container ID
  const map = L.map('map').setView([41.40338, 2.17403], 13); // Initial view coordinates (adjust if needed)

  // Add a base layer (e.g., OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  getApartments()
  .then(apartments => {
    createMarkers(apartments);
    console.log("🚀 ~ apartments:", apartments)
  })
  
  .catch(error => {
    console.error('Error fetching apartments: ', error)
  });

  // Function to create markers from apartment data (modify as needed)
  function createMarkers(apartments) {
    for (const ap of apartments) {
      const marker = L.marker([ap.coordinates.latitude, ap.coordinates.longitude]);
      // Optionally, add a popup with apartment details
      marker.bindPopup(`
        <h3>${ap.title}</h3>
        <p>${ap.country}, ${ap.city}</p>
      `);
      marker.addTo(map);
    }
  }

  // Call the function to create markers using your apartment data createMarkers(<%= JSON.stringify(apartments) %>); // Assuming apartments is your data variable
