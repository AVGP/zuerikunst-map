function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.3673, lng: 8.55},
    zoom: 13
  })

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('Got position', position)
      var latLng =new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        title: 'You'
      })
      map.setCenter(latLng)
      map.setZoom(16)

      fetch('https://zuerikunst.herokuapp.com/nearby/' + position.coords.latitude + '/' + position.coords.longitude).then(function(response) {
        return response.json()
      }).then(function(artObjects) {
        console.log(artObjects)
        for(var i=0; i<artObjects.length;i++) {
          (function(index) {
            var obj = artObjects[index]
            var latLng =new google.maps.LatLng(obj.lat, obj.lng)

            var infoWnd = new google.maps.InfoWindow({
                content: `
                  <div>
                    <h1>${obj.name}</h1>
                    <p>Hierbei handelt es sich um eine ${obj.type} von ${obj.date} durch ${obj.artist}.</p>
                    <p>Entfernung: ${parseFloat(obj.distance).toFixed(2)} Meter</p>
                  </div>
                `
              });


            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: obj.name
            })
            marker.addListener('click', function() {
              infoWnd.open(map, marker)
            })
          }(i))
        }
      })

    })
  }

}