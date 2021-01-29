
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
        let mood = $("#moodInputBox").val();
        let moodString = "Mood: " + $("#moodInputBox").val();
        $("#latVal").text(latString);
        $("#lngiVal").text(lngiString);
        $("#mood").text(moodString);

        // get time in milliseconds since 1970
        const timestamp = Date.now();
        // make a date object from those milliseconds

        let dateString = new Date(timestamp).toLocaleDateString();
        $('#date').text(dateString);

        const posData = {
          moodGiven: mood,
          latitude: lat,
          longitude: lngi,
          dateGiven: timestamp
        };
        let strungData = JSON.stringify(posData);
        console.log(strungData);
        $.ajax({
          url: "/api",
          headers: {
            'Content-Type': 'application/json'
          },
          dataType: "json",
          type: "POST",
          data: strungData,
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

  $('#displayHistory').on('click', (voorval) => {
    voorval.preventDefault();
    $.ajax({
      url: "/get-hist",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        for (item of data) {
          let itemMood = item.moodGiven;
          $('body').append(`<div class='gridItem mood'>Mood: ${itemMood}</div>`);
          let itemLat = item.latitude;
          let latString = "Latitude: " + itemLat + "\u00B0";
          $('body').append(`<div class='gridItem latVal'>${latString}</div>`);
          let itemLngi = item.longitude;
          let lngiString = "Longitude: " + itemLngi + "\u00B0";
          $('body').append(`<div class='gridItem lngiVal'>${lngiString}</div>`);
          let itemDate = item.dateGiven;
          let dateString = new Date(itemDate).toLocaleDateString();
          $('body').append(`<div class='gridItem date'>${dateString}</div>`);
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


