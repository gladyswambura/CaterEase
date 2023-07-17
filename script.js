document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();
  });
  
  document.getElementById('addItemBtn').addEventListener('click', function () {
    const name = document.getElementById('nameInput').value;
    const description = document.getElementById('descriptionInput').value;
    const price = document.getElementById('priceInput').value;
  
    fetch('/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        window.location.href = 'admin.html';
      })
      .catch(error => console.error('Error:', error));
  });
  