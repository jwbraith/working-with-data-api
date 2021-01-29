
$(document).ready(function () {
  $('#submit').on('click', () => {
    // e.preventDefault();
    if ('geolocation' in navigator) {
      console.log('geolocation available');
      navigator.geolocation.getCurrentPosition(async position => {
        let lat = position.coords.latitude;
        lat = lat.toFixed(4);
        let latString = "Latitude: " + lat + "\u00B0";
        let lngi = position.coords.longitude;
        lngi = lngi.toFixed(4);
        let lngiString = "Longitude: " + lngi + "\u00B0";
        let moodString = "Mood: " + $("#moodInputBox").val();
        $("#latVal").text(latString);
        $("#lngiVal").text(lngiString);
        $("#mood").text(moodString);


        const posData = { lat, lngi };
        $.ajax({
          url: "/api",
          dataType: "json",
          type: "POST",
          data: posData,
          success: function (data) {
            const dateString = new Date(data.timestamp).toLocaleDateString();
            $('#date').text(dateString);
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

  $('#displayHistory').on('click', (voorval) => {
    voorval.preventDefault();
    $.ajax({
      url: "/get-hist",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        for (item of data) {
          $('body').append("<div class='gridItem' id='mood'></div>");
          $('body').append("<div class='gridItem' id='latVal'></div>");
          $('body').append("<div class='gridItem' id='lngiVal'></div>");
          $('body').append("<div class='gridItem' id='date'></div>");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("ERORO", jqXHR, textStatus, errorthrown);
      }
    })
  });

  $('#emptyDB').on('click', (voorval) => {
    let cmd = 'flush';
    $.ajax({
      url: '/emptyDB',
      dataType: 'json',
      type: 'POST',
      data: cmd,
      success: function (data) {
        console.log("Database flushed!");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("ERROR: ", jqXHR, textStatus, errorThrown);
      }
    });
  });
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