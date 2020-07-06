  // const svg = d3.select(DOM.svg(width, height));


  
//   let title = svg.append('text')
//     .attrs({
//       class: 'title',
//       y: 24
//     })
//     .html('The most populous cities in the world from 1500 to 2018');
  
//   haloHighlight(title, 250, 2, 1, '#000000');
  
//   let subTitle = svg.append('text')
//     .attrs({
//       class: 'subTitle',
//       y: 55
//     })
//     .html('Population (thousands)');
  
//   haloHighlight(subTitle, 1750, 1, 1, '#777777');

//   let year = startYear;
  
//   dataset.forEach(d => {
//     d.value = +d.value,
//     d.lastValue = +d.lastValue,
//     d.value = isNaN(d.value) ? 0 : d.value,
//     d.year = +d.year,
//     // d.colour = d3.hsl(Math.random()*360,0.75,0.75)
//     d.colour = "#C8BDFF"
//   });
  
//   let yearSlice = dataset.filter(d => d.year == year && !isNaN(d.value))
//     .sort((a,b) => b.value - a.value)
//     .slice(0,top_n);
  
//   yearSlice.forEach((d,i) => d.rank = i);
  
//   let x = d3.scaleLinear()
//     .domain([0, d3.max(yearSlice, d => d.value)])
//     .range([margin.left, width-margin.right-65]);
  
//   let y = d3.scaleLinear()
//     .domain([top_n, 0])
//     .range([height-margin.bottom, margin.top]);
  
//   let groups = dataset.map(d => d.group);
//   groups = [...new Set(groups)];
  
//   let colourScale = d3.scaleOrdinal()
//     .range(["#adb0ff", "#ffb3ff", "#90d595", "#e48381", "#aafbff", "#f7bb5f", "#eafb50"])
//     .domain(["India","Europe","Asia","Latin America","Middle East","North America","Africa"]);
//     // .domain(groups);
  
//   let xAxis = d3.axisTop()
//     .scale(x)
//     .ticks(width > 500 ? 5:2)
//     .tickSize(-(height-margin.top-margin.bottom))
//     .tickFormat(d => d3.format(',')(d));
  
//   svg.append('g')
//     .attrs({
//       class: 'axis xAxis',
//       transform: `translate(0, ${margin.top})`
//     })
//     .call(xAxis)
//       .selectAll('.tick line')
//       .classed('origin', d => d == 0);
  
//   svg.selectAll('rect.bar')
//     .data(yearSlice, d => d.name)
//     .enter()
//     .append('rect')
//     .attrs({
//       class: 'bar',
//       x: x(0)+1,
//       width: d => x(d.value)-x(0)-1,
//       y: d => y(d.rank)+5,
//       height: y(1)-y(0)-barPadding
//     })
//     .styles({
//       fill: d => colourScale(d.group)
//       // fill: d => d.colour
//     });
  
//   svg.selectAll('text.label')
//     .data(yearSlice, d => d.name)
//     .enter()
//     .append('text')
//     .attrs({
//       class: 'label',
//       transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`,
//       'text-anchor': 'end'
//     })
//     .selectAll('tspan')
//     .data(d => [{text: d.name, opacity: 1, weight:600}, {text: d.subGroup, opacity: 1, weight:400}])
//     .enter()
//     .append('tspan')
//     .attrs({
//       x: 0,
//       dy: (d,i) => i*16
//     })
//     .styles({
//       // opacity: d => d.opacity,
//       fill: d => d.weight == 400 ? '#444444':'',
//       'font-weight': d => d.weight,
//       'font-size': d => d.weight == 400 ? '12px':''
//     })
//     .html(d => d.text);
  
//   svg.selectAll('text.valueLabel')
//     .data(yearSlice, d => d.name)
//     .enter()
//     .append('text')
//     .attrs({
//       class: 'valueLabel',
//       x: d => x(d.value)+5,
//       y: d => y(d.rank)+5+((y(1)-y(0))/2)+1,
//     })
//     .text(d => d3.format(',')(d.lastValue));
  
//   let credit = svg.append('text')
//     .attrs({
//       class: 'caption',
//       x: width,
//       y: height-28
//     })
//     .styles({
//       'text-anchor': 'end'
//     })
//     .html('Graphic: @jburnmurdoch')
//     .call(halo, 10);
  
//   let sources = svg.append('text')
//     .attrs({
//       class: 'caption',
//       x: width,
//       y: height-6
//     })
//     .styles({
//       'text-anchor': 'end'
//     })
//     .html('Sources: Reba, M. L., F. Reitsma, and K. C. Seto. 2018; Demographia')
//     .call(halo, 10);
  
//   let yearIntro = svg.append('text')
//     .attrs({
//       class: 'yearIntro',
//       x: width-225,
//       y: height-195
//     })
//     .styles({
//       'text-anchor': 'end'
//     })
//     .html('Year: ');
  
//   haloHighlight(yearIntro, 3000, 3, 1, '#cccccc');
  
//   let yearText = svg.append('text')
//     .attrs({
//       class: 'yearText',
//       x: width-225,
//       y: height-195
//     })
//     // .styles({
//     //   'text-anchor': 'end'
//     // })
//     .html(~~year);
  
//   yearText.call(halo, 10);
  
//   haloHighlight(yearText, 3000, 8, 1, '#cccccc');
  
//   let regions = world_simplified.objects.ne_10m_admin_0_countries.geometries.map(d => d.properties.REGION_WB);
//   regions = [...new Set(regions)];
  
//   const path = d3.geoPath()
//     .projection(projection);
 
//   let mapLegend = svg.append('g')
//     .attrs({
//       class: 'map-legend',
//       transform: `translate(${width-225}, ${height-160})`
//     });
  
//   mapLegend
//     .append('rect')
//     .attrs({
//       x: 0,
//       y: -20,
//       width: 224,
//       height: 130
//     })
//     .styles({
//       fill: '#ffffff',
//       stroke: '#dddddd'
//     });
  
//   let mapSubtitle = mapLegend
//     .append('text')
//     .attrs({
//       x: 5,
//       y: -5
//     })
//     .html('Bar colours represent regions');

//   mapSubtitle.call(halo, 5);
  
//   haloHighlight(mapSubtitle, 4500, 1, 1, '#777777');
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'South Asia')))
//     .attrs({
//       d: path,
//       fill: colourScale('India')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'East Asia & Pacific')))
//     .attrs({
//       d: path,
//       fill: colourScale('Asia')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Europe & Central Asia' && d.properties.ADMIN != 'Greenland')))
//     .attrs({
//       d: path,
//       fill: colourScale('Europe')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'North America')))
//     .attrs({
//       d: path,
//       fill: colourScale('North America')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Middle East & North Africa')))
//     .attrs({
//       d: path,
//       fill: colourScale('Middle East')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Sub-Saharan Africa')))
//     .attrs({
//       d: path,
//       fill: colourScale('Africa')
//     });
  
//   mapLegend
//     .append('path')
//     .datum(topojson.merge(world_simplified, world_simplified.objects.ne_10m_admin_0_countries.geometries.filter(d => d.properties.REGION_WB == 'Latin America & Caribbean')))
//     .attrs({
//       d: path,
//       fill: colourScale('Latin America')
//     });
  
//   mapLegend
//     .selectAll('circle')
//     .data(yearSlice, d => d.name)
//     .enter()
//     .append('circle')
//     .attrs({
//       class: 'cityMarker',
//       cx: d => projection([d.lon, d.lat])[0],
//       cy: d => projection([d.lon, d.lat])[1],
//       r: 3
//     })
//     .styles({
//       stroke: '#666666',
//       fill: '#000000',
//       'fill-opacity': 0.3
//     });
  



  // d3.timeout(_ => {
    
  //   svg.selectAll('.yearIntro')
  //     .transition()
  //     .duration(1000)
  //     .ease(d3.easeLinear)
  //     .styles({
  //       opacity: 0
  //     });
  
  //   let ticker = d3.interval(e => {

  //     yearSlice = dataset.filter(d => d.year == year && !isNaN(d.value))
  //       .sort((a,b) => b.value - a.value)
  //       .slice(0,top_n);

  //     yearSlice.forEach((d,i) => d.rank = i);

  //     x.domain([0, d3.max(yearSlice, d => d.value)]);

  //     svg.select('.xAxis')
  //       .transition()
  //       .duration(tickDuration)
  //       .ease(d3.easeLinear)
  //       .call(xAxis);

  //     let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);

  //     bars
  //       .enter()
  //       .append('rect')
  //       .attrs({
  //         class: d => `bar ${d.name.replace(/\s/g,'_')}`,
  //         x: x(0)+1,
  //         width: d => x(d.value)-x(0)-1,
  //         y: d => y(top_n+1)+5,
  //         height: y(1)-y(0)-barPadding
  //       })
  //       .styles({
  //         fill: d => colourScale(d.group)
  //         // fill: d => d.colour
  //       })
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           y: d => y(d.rank)+5
  //         });

  //     bars
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           width: d => x(d.value)-x(0)-1,
  //           y: d => y(d.rank)+5
  //         });

  //     bars
  //       .exit()
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           width: d => x(d.value)-x(0)-1,
  //           y: d => y(top_n+1)+5
  //         })
  //         .remove();

  //     let labels = svg.selectAll('.label').data(yearSlice, d => d.name);

  //     labels
  //       .enter()
  //       .append('text')
  //       .attrs({
  //         class: 'label',
  //         transform: d => `translate(${x(d.value)-5}, ${y(top_n+1)+5+((y(1)-y(0))/2)-8})`,
  //         'text-anchor': 'end'
  //       })
  //       .html('')    
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`
  //         });

  //     let tspans = labels
  //       .selectAll('tspan')
  //       .data(d => [{text: d.name, opacity: 1, weight:600}, {text: d.subGroup, opacity: 1, weight:400}]);

  //     tspans.enter()
  //       .append('tspan')
  //       .html(d => d.text)
  //       .attrs({
  //         x: 0,
  //         dy: (d,i) => i*16
  //       })
  //       .styles({
  //         // opacity: d => d.opacity,
  //         fill: d => d.weight == 400 ? '#444444':'',
  //         'font-weight': d => d.weight,
  //         'font-size': d => d.weight == 400 ? '12px':''
  //       });

  //     tspans
  //       .html(d => d.text)
  //       .attrs({
  //         x: 0,
  //         dy: (d,i) => i*16
  //       })
  //       .styles({
  //         // opacity: d => d.opacity,
  //         fill: d => d.weight == 400 ? '#444444':'',
  //         'font-weight': d => d.weight,
  //         'font-size': d => d.weight == 400 ? '12px':''
  //       });

  //     tspans.exit()
  //       .remove();

  //     labels
  //       .transition()
  //       .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           transform: d => `translate(${x(d.value)-5}, ${y(d.rank)+5+((y(1)-y(0))/2)-8})`
  //         });

  //     labels
  //       .exit()
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           transform: d => `translate(${x(d.value)-8}, ${y(top_n+1)+5})`
  //         })
  //         .remove();

  //     let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

  //     valueLabels
  //       .enter()
  //       .append('text')
  //       .attrs({
  //         class: 'valueLabel',
  //         x: d => x(d.value)+5,
  //         y: d => y(top_n+1)+5,
  //       })
  //       .text(d => d3.format(',.0f')(d.lastValue))
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           y: d => y(d.rank)+5+((y(1)-y(0))/2)+1
  //         });

  //     valueLabels
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           x: d => x(d.value)+5,
  //           y: d => y(d.rank)+5+((y(1)-y(0))/2)+1
  //         })
  //         .tween("text", function(d) {
  //           let i = d3.interpolateRound(d.lastValue, d.value);
  //           return function(t) {
  //             this.textContent = d3.format(',')(i(t));
  //           };
  //         });

  //     valueLabels
  //       .exit()
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           x: d => x(d.value)+5,
  //           y: d => y(top_n+1)+5
  //         })
  //         .remove();

  //     let cityMarkers = svg.select('.map-legend').selectAll('.cityMarker').data(yearSlice, d => d.name);

  //     cityMarkers
  //       .enter()
  //       .append('circle')
  //       .attrs({
  //         class: 'cityMarker',
  //         cx: d => projection([d.lon, d.lat])[0],
  //         cy: d => projection([d.lon, d.lat])[1],
  //         r: 0
  //       })
  //       .styles({
  //         stroke: '#000000',
  //         fill: 'none'
  //       })
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           r: 10
  //         });

  //     cityMarkers
  //       .attrs({
  //         class: 'cityMarker',
  //         cx: d => projection([d.lon, d.lat])[0],
  //         cy: d => projection([d.lon, d.lat])[1],
  //         r: 3
  //       })
  //       .styles({
  //         stroke: '#666666',
  //         fill: '#000000',
  //         'fill-opacity': 0.3
  //       })
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           r: 3
  //         });

  //     cityMarkers
  //       .exit()
  //       .transition()
  //         .duration(tickDuration)
  //         .ease(d3.easeLinear)
  //         .attrs({
  //           r: 0
  //         })
  //         .remove();

  //     yearText.html(~~year);

  //     if(year == endYear) ticker.stop();
  //     year = year + 1;
  //   },tickDuration);
  
  // }, 6000);

//   return svg.node();
// }