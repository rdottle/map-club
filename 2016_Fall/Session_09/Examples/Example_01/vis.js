/* ------------------------------------------------------------------
 EXAMPLE 01
 -------------------------------------------------------------------- */

var w = window.innerWidth,
		h = window.innerHeight;

var data_map,
		data_galleries;

//set svg width and height
var svg = d3.select('#container').append('svg')
	.attr('width',w)
	.attr('height',h);

function generate(){

	//define projection
	var projection = d3.geo.mercator()
		.center([-74.25,40.69])
		.scale(70000)
		.translate([w/4,h/2]);

	//define path function
	var path = d3.geo.path()
		.projection(projection);

	//create map group
	var map_g = svg.append('g');

	//grab features from the GeoJSON dataset (5 boroughs)
	var features = data_map.features;

	//draw map
	var map;
	map = map_g.selectAll('path.boroughs')
		.data(features);
	map.enter()
		.append('path')
		.classed('boroughs',true)
		;
	map.attr('d',path);
	map.exit().remove();

	//use projection to plot galleries
	var galleries;
	galleries = map_g.selectAll('circle.pin')
		.data(data_galleries);
	galleries.enter().append('circle')
		.classed('pin',true);
	galleries
		.attr('cx',function(d){
			var coords = projection([+d.lon,+d.lat]);
			return coords[0];
		})
		.attr('cy',function(d){
			var coords = projection([+d.lon,+d.lat]);
			return coords[1];
		})
		.attr('r',2);
	galleries.exit().remove();
}

function get_data(_callback){
	var loading = [1,2];

	d3.json('data/NYC_Boroughs.geojson',function(e,d){
		if(!e){ 
			data_map = d;
			loading = loading.filter(function(d){ return d !==1; }); 
			if(loading.length === 0){ _callback(); }
		}
	});
	d3.csv('data/NYC_Art_Galleries.csv',function(e,d){
		if(!e){ 
			data_galleries = d;
			loading = loading.filter(function(d){ return d !==2; }); 
			if(loading.length === 0){ _callback(); }
		}
	});
}
get_data(generate);