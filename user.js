
document.getElementById('missingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('age', document.getElementById('age').value);
  formData.append('district', document.getElementById('district').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('lastSeenLocation', document.getElementById('location').value);

  const photo = document.getElementById('photo').files[0];
  if (photo) {
    formData.append('file', photo);
  }

  try {
    const res = await fetch('http://localhost:5000/submit-case', {
      method: 'POST',
      body: formData,
    });

    const result = await res.text();
    alert(result);
  } catch (err) {
    console.error(err);
    alert('❌ Submission failed');
  }
}); 

showLocationOnMap(document.getElementById('location').value);


function uploadDocs() {
  const files = document.getElementById('documents').files;
  if (files.length === 0) {
    alert("No files selected.");
  } else {
    alert(`${files.length} file(s) uploaded.`);
  }
}

function updateStatus() {
  document.getElementById('status').textContent = "Under Investigation";
}

function showLocationOnMap(location) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 13.0827, lng: 80.2707 },
  });

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: location }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });
    } else {
      alert("Location not found: " + status);
    }
  });
}
