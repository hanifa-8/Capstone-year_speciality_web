document.addEventListener('DOMContentLoaded', function() {
    const yearInput = document.getElementById('yearInput');
    const fetchButton = document.getElementById('fetchButton');
    const specialityElement = document.getElementById('speciality');
  
    fetchButton.addEventListener('click', function() {
      const year = yearInput.value;
      if (year) {
        const apiUrl = `http://numbersapi.com/${year}/year?json`;
  
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            specialityElement.textContent = data.text;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } else {
        specialityElement.textContent = 'Please enter a valid year.';
      }
    });
  });