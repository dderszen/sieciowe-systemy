document.addEventListener('DOMContentLoaded', function() {
    fetchProperties();
  
    function fetchProperties() {
      fetch('http://localhost:5000/api/properties')
        .then(response => response.json())
        .then(data => {
          const propertiesList = document.getElementById('propertiesList');
          propertiesList.innerHTML = '';
  
          data.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.className = 'col-md-4 mb-4';
            propertyCard.innerHTML = `
              <div class="card">
                <img src="${property.imagePath}" class="card-img-top" alt="${property.propertyName}">
                <div class="card-body">
                  <h5 class="card-title">${property.propertyName}</h5>
                  <p class="card-text">${property.description}</p>
                  <p class="card-text"><strong>Adres:</strong> ${property.address}</p>
                  <p class="card-text"><strong>Cena za dzień:</strong> ${property.pricePerDay} zł</p>
                  <button class="btn btn-danger" onclick="deleteProperty(${property.id})">Usuń</button>
                </div>
              </div>
            `;
            propertiesList.appendChild(propertyCard);
          });
        })
        .catch(error => {
          console.error('Błąd:', error);
        });
    }
  
    window.deleteProperty = function(id) {
      fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        fetchProperties();
      })
      .catch(error => {
        console.error('Błąd:', error);
      });
    };
  });