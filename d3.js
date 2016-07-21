
$('#title').hide();
$(function() {
	$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(j) {

		const margin = { top: 50, bottom: 50, left: 70, right: 70 };

		const width = 1000;
		const height = 500;

		function render(j) {

			const svg = d3.select("body").append("svg") // adds an svg element to document.body. this will the boudning box of our chart
			  .attr("width",  width)
			  .attr("height", height);

			const g = svg.append("g")
				.attr('transform', 'translate(' + margin.left + ' ' + margin.top + ')')

			const xScale = d3.scaleLinear() // creates a scale function to map our data
				.domain(d3.extent(j, function(d) { return d.Seconds}))
				.range([width - margin.left - margin.right, 0]); // want 0 to be on the right side

			const yScale = d3.scaleLinear()
				.domain(d3.extent(j, function(d) { return d.Place; }))
				.range([0, height - margin.top - margin.bottom]); // 0 counts as the top of the graph (Y-DOWN) already, no need to swap

			// AXES
			const xAxis = d3.axisBottom(xScale).tickFormat(function(d) {
				let k = d - 2210;
				const minutes = Math.floor(k/60);
				let seconds = k%60;
				if (seconds.toString().length < 2) {
					seconds = '0' + seconds;
				}
				return (minutes + ':' + seconds);
			});

			const yAxis = d3.axisLeft(yScale);

			svg.append('g') // add +5 so it doesn't cut into the circle at 0,0
				.attr('transform', 'translate(' + margin.left + ' ' + (height - margin.bottom + 5) + ')')
				.call(xAxis)
				.append('text') // x-axis label
				.style("text-anchor", "middle")
		        .attr("x", width / 2)
				.attr('dx', -60)
		        .attr("y", 40)
		        .attr("class", "label")
				.text('Time Behind Rank 1');

			svg.append('g')
				.attr('transform', 'translate(' + (margin.left - 5) + ' ' + margin.top + ')')
				.call(yAxis)
				.append('text')
				.style('text-anchor', 'middle')
				.attr('x', -height/2)
				.attr('dx', 60)
				.attr('y', -35)
				.attr('transform', 'rotate(270)')
				.attr('class','label')
				.text('Ranking');


			const circles = g.selectAll('circle').data(j); // data binding to the svg we appended to body earlier
			var timeout = '';

			//*** create
			const grp = circles.enter().append('g') // if (data.length > circles.children), add new circles for ONLY those extra points
				.attr('transform', function(d) { return 'translate(' + xScale(d.Seconds) + ' ' + yScale(d.Place) + ')'; });
				// *** update
				grp.append('circle')
				.attr('r', 5) // updates ALL circles, old and new
				// note that circles use 'cx' instead of 'x' like rects
				// maps the x displacement based on scale defined earlier. domain = dataset, range = pixel range
				.attr('class', function(d) { // add a class to change the color of the circle
					if (d.Doping) {
						return 'dope';
					} else {
						return '';
					}
				})
				.on('mouseover', function(d) {
					$('#info').fadeIn(200);
					clearTimeout(timeout);

					$('#info h1').text(d.Doping.trim() + '.');
				})
				.on('mouseout', () => {
					timeout = setTimeout(() => {
						$('#info').fadeOut(500);
					}, 600);
				});
				// add biker name
				grp.append('text')
				.attr('class', 'label')
				.attr('transform', 'translate(10 3)')
				.text(function(d) { return d.Name; });


			// *** destroy
			circles.exit().remove(); // if (data.length < circles.children), remove the extra circles.
			// Not really needed in this case since we're only using one dataset/calling the function once.
		}
		render(j);
		$('#title').show();
	});
});
