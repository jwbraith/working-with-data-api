function submit() {
  if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const latString = "Latitude: " + lat + "\u00B0";
      document.getElementById('latVal').textContent = latString;
      const lngi = position.coords.longitude;
      const lngiString = "Longitude: " + lngi + "\u00B0";
      document.getElementById('longVal').textContent = lngiString;

      const data = { lat, lngi };
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)

      }
      const response = await fetch('/api', options);
      const jsondata = await response.json();
      console.log(jsondata);
    });
  } else {
    console.log('geolocation ont available');
  }
}

function emptyDB() {
  console.log("Clear got to client");
  const cmd = { cmd: 'flush' };
  console.log(cmd);
  const options = {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(cmd)
  }
  fetch('/clear', options).then(response => response.json()).then(data => {
    console.log('Success:', data);
  });
}

async () => {
  fetch('/check-ins').then(response => response.json()).then(data => {
    console.log('Success:', data);
    for (item of data) {
      const root = document.createElement('div');
      root.textContent = `location: ${item.lat}, ${item.lngi}`;
      const date = document.createElement('div');
      const dateString = new Date(item.timestamp).toLocaleDateString();
      date.textContent = `Time: ${dateString}`;
      document.body.append(root, date);
    }
  });
}