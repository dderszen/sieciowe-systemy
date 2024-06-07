document.getElementById('rentalForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Resetowanie błędów
    document.querySelectorAll('.error').forEach(function(error) {
      error.textContent = '';
    });
  
    // Pobranie wartości pól
    const propertyName = document.getElementById('propertyName').value.trim();
    const description = document.getElementById('description').value.trim();
    const address = document.getElementById('address').value.trim();
    const pricePerDay = document.getElementById('pricePerDay').value.trim();
    const image = document.getElementById('image').files[0];
  
    let isValid = true;
  
    // Walidacja pól
    if (!propertyName) {
      document.getElementById('propertyNameError').textContent = 'Nazwa obiektu jest wymagana';
      isValid = false;
    }
  
    if (!description) {
      document.getElementById('descriptionError').textContent = 'Opis jest wymagany';
      isValid = false;
    }
  
    if (!address) {
      document.getElementById('addressError').textContent = 'Adres jest wymagany';
      isValid = false;
    }
  
    if (!pricePerDay || pricePerDay <= 0) {
      document.getElementById('pricePerDayError').textContent = 'Cena za dzień jest wymagana i musi być dodatnia';
      isValid = false;
    }
  
    if (!image) {
      document.getElementById('imageError').textContent = 'Zdjęcie jest wymagane';
      isValid = false;
    }
  
    if (isValid) {
      // Tworzenie obiektu FormData
      const formData = new FormData();
      formData.append('propertyName', propertyName);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('pricePerDay', pricePerDay);
      formData.append('image', image);
  
      // Wysłanie danych do backendu
      fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Odpowiedź z serwera:', data);
        alert('Obiekt dodany pomyślnie!');
        // Resetowanie formularza
        document.getElementById('rentalForm').reset();
      })
      .catch(error => {
        console.error('Błąd:', error);
      });
    }
  });