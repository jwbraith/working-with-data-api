
$(document).ready(function () {
  $('#submit').on('click', () => {
    // e.preventDefault();
    if ('geolocation' in navigator) {
      console.log('geolocation available');
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const latString = "Latitude: " + lat + "\u00B0";
        const lngi = position.coords.longitude;
        const lngiString = "Longitude: " + lngi + "\u00B0";
        $("#latVal").text(latString);
        $("#lngiVal").text(lngiString);


        const posData = { lat, lngi };
        $.ajax({
          url: "/api",
          dataType: "json",
          type: "POST",
          data: posData,
          success: function (data) {
            console.log("SUCCESS:", data);

          },
          error: function (jqXHR, textStatus, errorThrown) {

            console.log("ERROR:", jqXHR, textStatus, errorThrown);
          }

        });
      });
    } else {
      console.log('geolocation ont available');
    }

  })
});


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