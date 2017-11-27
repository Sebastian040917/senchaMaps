Ext.onReady(function() {

    var store = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true,
            children: [
                { text: "detention", leaf: true },
                // { text: "homework", leaf: true}, 
                // { text: "book", leaf: true },
            ]
        }
    });


    var w = Ext.create('Ext.window.Window', {
        title: 'Gmap',
        height: 400,
        width: 600,
        layout: 'border',
        items: [{
            region: 'west',
            //title: 'Tree',
            collapsible: false,

            width: 100,
            items: [{
                xtype: 'tree',
                store: store,
                rootVisible: false,
                listeners: {
                    click: {
                        element: 'el', //bind to the underlying el property on the panel
                        fn: getPumpMatkers
                    }
                }

            }]
        }, {
            xtype: 'gmappanel',
            region: 'center',
            cls: 'reset-box-sizing',
            center: new google.maps.LatLng(41.85, -87.65),
            mapOptions: {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        }]
    });

    /**
     * Just example, do not write code like this!
     * GMApPanel source code 
     * http://docs.sencha.com/extjs/4.2.0/extjs-build/examples/ux/GMapPanel.js
     */


    var map = w.down('gmappanel');

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    function getPumpMatkers() {
        //console.log(map.gmap);
        directionsDisplay.setMap(map.gmap);
        // set markers to show the routes.      
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    }


    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var waypts = [];
        //var checkboxArray = document.getElementById('waypoints');
        //for (var i = 0; i < checkboxArray.length; i++) {
        //  if (checkboxArray.options[i].selected) {
        waypts.push({
            location: { lat: 25.649654, lng: -100.727157 },
            stopover: true
        });
        // }
        // }


        directionsService.route({
            origin: { lat: 25.701066, lng: -100.298323 },
            destination: { lat: 25.427903, lng: -100.996028 },
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                //var summaryPanel = document.getElementById('directions-panel');
                //summaryPanel.innerHTML = '';
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {

                    console.log(route.legs[i].start_address);
                    console.log(route.legs[i].end_address);
                    console.log(route.legs[i].distance.text);

                    //var routeSegment = i + 1;
                    //summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                    //    '</b><br>';
                    //  summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    // summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    // summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }

        });
    }
    w.show();
});