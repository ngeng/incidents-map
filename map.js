
var map;
var markers = [];
var infowindow;
var bounds;
var countMarkers = 0;

function clickListHandler(id, lat, long) {
    // shift map to center
    if($('.row-offcanvas-left').hasClass('active')) {
        $('.row-offcanvas-left').removeClass('active');
    }

    // center map to this marker
    var latLng = new google.maps.LatLng(lat, long);
    map.setCenter(latLng);
    map.setZoom(12);

    // add animation + change marker color
    markers.forEach(function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        }
        if (marker.id == id) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    })

}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: new google.maps.LatLng(-36.686043, 143.580322)
    });
    generateMarkers(map);

    map.addListener('zoom_changed', function() {
        resetList(function() {generateList(map)});
    });
}

function generateInfoWinText(item) {
    var html =  '<div>'+
                    '<h5>'+item.title+'</h5>'+
                    '<p><b>Alert type: '+item.alert_type+'</b></p>'+
                    '<p>'+item.description+'</p>'+
                '</div>';
    return html;
}

function generateMarkers(map) {
	data.incidents.forEach(function(item) {
		var latLng = new google.maps.LatLng(item.lat,item.long);
		var marker = new google.maps.Marker({
            id: item.id,
			position: latLng,
			map: map
		});
        markers.push(marker);

		// init info window of this marker
        infowindow = new google.maps.InfoWindow();
		var contentString = generateInfoWinText(item);
		marker.addListener('click', (function(marker) {
			return function() {
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
			}
		})(marker));

		// init list items
        countMarkers++;
        $('#sideList').append(generateListItemText(item));
        $('#listBtnBadge').html(countMarkers);

    });

}

function generateList(map) {
    data.incidents.forEach(function(item) {
        var latLng = new google.maps.LatLng(item.lat,item.long);
        // init list items
        if(map.getBounds().contains(latLng)) {
            countMarkers++;
            $('#sideList').append(generateListItemText(item));
        }
        $('#listBtnBadge').html(countMarkers);
    });
}

function generateListItemText(item) {
    var html = 	'<a href="javascript:clickListHandler('+item.id+','+item.lat+','+item.long+')" ' +
                'class="list-group-item" id="'+item.id+'">'+
                    '<b>'+item.title+'</b>'+
                    '<p>Alert type: '+item.alert_type+'</p>'+
                '</a>';
    return html;
}

function resetList(callback) {
    countMarkers = 0;
    $('#sideList').empty();
    $('#sideList').append('<li class="list-group-item list-group-item-success"><b>List</b></li>');
    callback();
}
