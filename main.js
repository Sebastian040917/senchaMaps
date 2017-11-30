Ext.onReady(function() {


    /*
     === tree panel data
    */

    var data = {
        children: [
            { text: "AAAA", leaf: true },
            { text: "BBBB", leaf: true },
            { text: "CCCC", leaf: true },
            { text: "DDDD", leaf: true }
        ]
    }

    Ext.create('Ext.data.TreeStore', {
        storeId: 'storeTree',
        root: data
    });

    /*
     === grid data
    */
    var sampleStore = Ext.create('Ext.data.Store', {
        storeId: 'sampleStore',
        fields: [
            { name: 'symbol', type: 'string' },
            { name: 'pump', type: 'string' }
        ],
        data: [
            { symbol: "msft", pump: "AAAA" },
            { symbol: "goog", pump: "BBBB" },
            { symbol: "apple", pump: "CCCC" },
            { symbol: "sencha", pump: "DDDD" }
        ]
    });





    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'center',
            title: 'List pump',
            collapsible: false,
            //html: 'Information goes here',
            split: true,
            height: 100,
            minHeight: 100,
            items: [{
                xtype: 'gridpanel',
                // title: 'Number Column Demo',
                store: 'sampleStore',
                columns: [
                    { text: 'Symbol', dataIndex: 'symbol', flex: 1 },
                    { text: 'Pump', dataIndex: 'pump', },
                    {
                        xtype: 'actioncolumn',
                        width: "10%",
                        align: 'center',
                        sortable: false,
                        items: [{
                            icon: 'http://www.iconarchive.com/download/i27087/ph03nyx/super-mario/Flower-Ice.ico',
                            handler: function(grid, rowIndex, colIndex, item, event, record, row) {
                                showRoute(record.data.pump);
                            },
                            width: '10%'
                        }],
                    },
                ],
                height: 200,
                width: 500,
            }]
        }]
    });
});

var map = null;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer({

    markerOptions: { icon: "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=truck|2e4b64" }

});

var locationsArr = [{
        pump: "AAAA",
        origin: { lat: 25.683421, lng: -100.308871 },
        destination: { lat: 25.683421, lng: -100.308871 },
        route: [
            { lat: 25.649654, lng: -100.727157 },
            { lat: 25.541305, lng: -100.945926 },
            { lat: 25.429964, lng: -100.994776 },

        ]
    },
    {
        pump: "BBBB",
        origin: { lat: 25.649654, lng: -100.727157 },
        destination: { lat: 25.649654, lng: -100.727157 },
        route: [
            { lat: 25.269833, lng: -100.577096 }
        ]
    },
    {
        pump: "CCCC",
        origin: { lat: 25.739687, lng: -100.243657 },
        destination: { lat: 25.739687, lng: -100.243657 },
        route: [
            { lat: 25.192946, lng: -99.831860 },
            { lat: 24.907664, lng: -99.683059 },
            { lat: 24.502716, lng: -99.498266 },
            { lat: 23.759113, lng: -99.136126 },
        ]
    },
    {
        pump: "DDDD",
        origin: { lat: 22.175379, lng: -100.983862 },
        destination: { lat: 22.175379, lng: -100.983862 },
        route: [
            { lat: 22.453293, lng: -100.300735 },
            { lat: 21.939837, lng: -99.983961 },
            { lat: 22.016987, lng: -99.670755 },
            { lat: 22.057813, lng: -99.078598 },
        ]
    }

];

function showRoute(pumpSelected) {
    var w = Ext.create('Ext.window.Window', {
        title: 'Pump routes',
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
                store: "storeTree",
                rootVisible: false,
                listeners: {
                    itemclick: function(s, r) {
                        getPumpMatkers(r.data.text);

                    }
                },
                tbar: [{
                    text: 'Show All',
                    scope: this,
                    width: '100%',
                    handler: showAllRoutes
                }]

            }]
        }, {
            xtype: 'gmappanel',
            region: 'center',
            cls: 'reset-box-sizing',
            center: new google.maps.LatLng(41.85, -87.65),
            mapOptions: {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },

        }]
    });

    map = w.down('gmappanel');

    function getPumpMatkers(pump) {
        // set markers to show the routes.      
        calculateAndDisplayRoute(directionsService, directionsDisplay, pump);
    }

    setTimeout(getPumpMatkers, 1, pumpSelected);

    w.show();
    //});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pumpSelected) {

    var waypts = [];
    var origin = { lat: 0, lng: 0 };
    var destination = { lat: 0, lng: 0 };


    for (var i = 0; i < locationsArr.length; i++) {
        if (locationsArr[i].pump == pumpSelected) {
            if (origin.lat === 0) {

                origin = locationsArr[i].origin;
                destination = locationsArr[i].destination;
            }

            for (var k = 0; k < locationsArr[i].route.length; k++) {
                waypts.push({
                    location: { lat: locationsArr[i].route[k].lat, lng: locationsArr[i].route[k].lng },
                    stopover: true
                });
            }

        }
    }

    directionsService.route({
        origin: new google.maps.LatLng(origin),
        destination: new google.maps.LatLng(destination),
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            //directionsDisplay.setDirections(null);
            directionsDisplay.setDirections(response);
            // var route = response.routes[0];
            //var summaryPanel = document.getElementById('directions-panel');
            //summaryPanel.innerHTML = '';
            // For each route, display summary information.
            // for (var i = 0; i < route.legs.length; i++) {

            //console.log(route.legs[i].start_address);
            //console.log(route.legs[i].end_address);
            // console.log(route.legs[i].distance.text);

            //var routeSegment = i + 1;
            //summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            //    '</b><br>';
            //  summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            // summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            // summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            // }
        } else {
            Ext.Msg.alert('Directions request failed due to ' + status);
        }
    });

    clearMarks();

    directionsDisplay.setMap(map.gmap);
}


function clearMarks() {

    for (var k = 0; k < 10; k++) {

        if (typeof window["directionsDisplay" + k] !== 'undefined') {
            window["directionsDisplay" + k].setMap(null);
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function showAllRoutes() {
    directionsDisplay.setMap(null);

    var counter = 0;
    for (var l = 0; l < locationsArr.length; l++) {

        var loc = locationsArr[l];
        window['waypts' + l] = [];

        for (var k = 0; k < loc.route.length; k++) {
            window['waypts' + l].push({
                location: { lat: loc.route[k].lat, lng: loc.route[k].lng },
                stopover: false
            });
        }

        window['request' + l] = {
            origin: loc.origin,
            destination: loc.destination,
            waypoints: window['waypts' + l],
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            optimizeWaypoints: true,
        };

        setTimeout(da(counter, window['request' + l]), 40000);
        counter = counter + 1;

        //var directionsS = new google.maps.DirectionsService();    
        //  directionsS.route(request, function(response, status) {
        //   if (status == google.maps.DirectionsStatus.OK) {               
        //   da(counter,response);


        //   }
        // });

    }

} //end show all routes


function da(position, request) {

    window['directionsService' + position] = new google.maps.DirectionsService();

    window['directionsService' + position].route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            var colorrandom = getRandomColor();
            var colorRandomnohash = colorrandom.substr(1, colorrandom.length);

            window['directionsDisplay' + position] = new google.maps.DirectionsRenderer({
                markerOptions: {
                    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=truck|" + colorRandomnohash
                },
                polylineOptions: { strokeColor: colorrandom }
            });

            window['directionsDisplay' + position].setMap(map.gmap);
            window['directionsDisplay' + position].setDirections(response);

        }
    });

}