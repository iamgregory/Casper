function loadTallGaugues(){
  var margin = {top: 40, right: 40, bottom: 20, left: 20},
            width = 120 - margin.left - margin.right,  // width of boxplot
            height = 200 - margin.top - margin.bottom; // height of boxplot
            
            var min = Infinity,
            max = -Infinity;
            
            var chart = d3.box() //chart is a function
            .whiskers(iqr(1.5)) //1.5 for standard interquartile range and outliers
            .width(width)
            .height(height); 
            
            makeAGauge = function(gaugeName){
              d3.csv("morley.csv", function(error, csv) {
                     var data = []; //array of experiments
                     
                     csv.forEach(function(x) { //x is a row array of the csv
                                 var e = Math.floor(x.Expt - 1),
                                 r = Math.floor(x.Run - 1),
                                 s = Number(x.Speed),//Math.floor(x.Speed),
                                 d = data[e]; // array of experiment 'e' data
                                 if (!d) d = data[e] = [s];
                                 else d.push(s);
                                 if (s > max) max = s;
                                 if (s < min) min = s;
                                 });
                     
                     chart.domain([2.5, 4.5]); //updates min max value for the chart
                     
                     //scalable vector graphic (SVG)
                     var svg = d3.select(boxPlotContainer).selectAll("svg."+gaugeName)
                      .data(data) // data bind to SVG
                      .enter().append("svg") // constructs an svg for each dataset
                        .attr("class", "box") //
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.bottom + margin.top)
                          .append("g")
                          .attr("class",gaugeName)
                          .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //translate origin coordinate of SVG
                    //console.log(svg);
                    svg.call(chart);
              });
          }
          makeAGauge("voltage");
          makeAGauge("apples");

          function iqr(k) {
            return function(d) {
                var q1 = d.quartiles[0],
                q3 = d.quartiles[2],
                iqr = (q3 - q1) * k, // k is nominally chosen to be 1.5 but is assignable
                i = -1,
                j = d.length;
                while (d[++i] < q1 - iqr);
                while (d[--j] > q3 + iqr);
                return [i, j];
            };
          } 
        return chart;
}





(function() {
            
  // Inspired by http://informationandvisualization.de/blog/box-plot
  d3.box = function() {
    var width = 1,
        height = 1,
        duration = 0,
        domain = null,
        value = Number,
        whiskers = boxWhiskers, //value at first and last element
        quartiles = boxQuartiles, //values of .25 ,.5 , and .75 quantile
        tickFormat = null;

    // For each small multiple…
    function box(g) { //g is the set of all SVGS
      g.each(function(d,i) {
        d = d.map(value).sort(d3.ascending);
        var g = d3.select(this),
            n = d.length,
            min = d[0],
            max = d[n - 1];

        // Compute quartiles. Must return exactly 3 elements.
        var quartileData = d.quartiles = quartiles(d);

        // Compute whiskers. Must return exactly 2 elements, or null.
        var whiskerIndices = whiskers && whiskers.call(this, d, i),
            whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });

        // Compute outliers. If no whiskers are specified, all data are "outliers".
        // We compute the outliers as indices, so that we can join across transitions!
        var outlierIndices = whiskerIndices
            ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
            : d3.range(n);

        // Compute the new x-scale.
        var x1 = d3.scale.linear()
            .domain(domain && domain.call(this, d, i) || [min, max])
            .range([height, 0]);

        // Retrieve the old x-scale, if this is an update.
        var x0 = this.__chart__ || d3.scale.linear()
            .domain([0, Infinity])
            .range(x1.range());

        var alertColor = function (){var color = statusColor[0];
          if ((min < modeInfo[currentMode].limits.voltageWarn[0]) ||
          (max > modeInfo[currentMode].limits.voltageWarn[1])){ 
            color = statusColor[1];
            if ((min < modeInfo[currentMode].limits.voltageAlarm[0]) ||
            (max > modeInfo[currentMode].limits.voltageAlarm[1]))
              color = statusColor[2];
          } 
          return color;
        };

        // Stash the new scale.
        this.__chart__ = x1;

        // Note: the box, median, and box tick elements are fixed in number,
        // so we only have to handle enter and update. In contrast, the outliers
        // and other elements are variable, so we need to exit them! Variable
        // elements also fade in and out.


        // Update gaugeBody: the background of the boxplot.
        var gaugeBody = g.selectAll("rect.gaugeBody")
            .data(["GhostWhite"]);

        gaugeBody.enter().append("rect")
            .attr("class", "gaugeBody")
            .style("fill", function(d) { return d; })
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("opacity", 1e-6)
          .transition()
            .duration(duration)
            .style("opacity", 1);
/*
        center.transition()
            .duration(duration)
            .style("opacity", 1)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); });

        center.exit().transition()
            .duration(duration)
            .style("opacity", 1e-6)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); })
            .remove();*/

        // Update center line: the vertical line spanning the whiskers.
        var center = g.selectAll("line.center")
            .data(whiskerData ? [whiskerData] : []);

        center.enter().append("line")
            .attr("class", "center")
            .attr("x1", width / 2)
            .attr("y1", function(d) { return x0(d[0]); })
            .attr("x2", width / 2)
            .attr("y2", function(d) { return x0(d[1]); })
            .style("opacity", 1e-6)
          .transition()
            .duration(duration)
            .style("opacity", 1)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); });

        center.transition()
            .duration(duration)
            .style("opacity", 1)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); });

        center.exit().transition()
            .duration(duration)
            .style("opacity", 1e-6)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); })
            .remove();

        // Update innerquartile box.
        var box = g.selectAll("rect.box")
            .data([quartileData]);

        box.enter().append("rect")
            .attr("class", "box")
            .style("fill", "#73C56B")
            .attr("x", 0)
            .attr("y", function(d) { return x0(d[2]); })
            .attr("width", width)
            .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
            .style("opacity",.3)
          .transition()
            .duration(duration)
            .attr("y", function(d) { return x1(d[2]); })
            .style("fill", alertColor)
            .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

        box.transition()
            .duration(duration)
            .attr("y", function(d) { return x1(d[2]); })
            .style("fill", alertColor)
            .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

        // Update warning lines
        var warning = g.selectAll("line.warning")
            .data(modeInfo[currentMode].limits.voltageWarn);

        warning.enter().append("line")
            .attr("class", "warning")
            .attr("x1", 0)
            .attr("y1", x1)
            .attr("x2",width)
            .attr("y2", x1);

        // Update alarm lines
        var warning = g.selectAll("line.alarm")
            .data(modeInfo[currentMode].limits.voltageAlarm);

        warning.enter().append("line")
            .attr("class", "alarm")
            .attr("x1", 0)
            .attr("y1", x1)
            .attr("x2",width)
            .attr("y2", x1);

        // Update median line.
        var medianLine = g.selectAll("line.median")
            .data([quartileData[1]]);

        medianLine.enter().append("line")
            .attr("class", "median")
            .attr("x1", 0)
            .attr("y1", x0)
            .attr("x2", width)
            .attr("y2", x0)
          .transition()
            .duration(duration)
            .attr("y1", x1)
            .attr("y2", x1);

        medianLine.transition()
            .duration(duration)
            .attr("y1", x1)
            .attr("y2", x1);

        // Update whiskers.
        var whisker = g.selectAll("line.whisker")
            .data(whiskerData || []);

        whisker.enter().append("line")
            .attr("class", "whisker")
            .attr("x1", 0)
            .attr("y1", x0)
            .attr("x2", width)
            .attr("y2", x0)
            .style("opacity", 1e-6)
          .transition()
            .duration(duration)
            .attr("y1", x1)
            .attr("y2", x1)
            .style("opacity", 1);

        whisker.transition()
            .duration(duration)
            .attr("y1", x1)
            .attr("y2", x1)
            .style("opacity", 1);

        whisker.exit().transition()
            .duration(duration)
            .attr("y1", x1)
            .attr("y2", x1)
            .style("opacity", 1e-6)
            .remove();

        // Update outliers.
        var outlier = g.selectAll("circle.outlier")
            .data(outlierIndices, Number);

        outlier.enter().append("circle")
            .attr("class", "outlier")
            .attr("r", 5)
            .attr("cx", width / 2)
            .attr("cy", function(i) { return x0(d[i]); })
            .style("opacity", 1e-6)
          .transition()
            .duration(duration)
            .attr("cy", function(i) { return x1(d[i]); })
            .style("opacity", 1);

        outlier.transition()
            .duration(duration)
            .attr("cy", function(i) { return x1(d[i]); })
            .style("opacity", 1);

        outlier.exit().transition()
            .duration(duration)
            .attr("cy", function(i) { return x1(d[i]); })
            .style("opacity", 1e-6)
            .remove();

        // Compute the tick format.
        var format = tickFormat || x1.tickFormat(8);

        // Update box ticks.
        var boxTick = g.selectAll("text.box")
            .data(quartileData);

        boxTick.enter().append("text")
            .attr("class", "box")
            .attr("dy", ".3em")
            .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
            .attr("x", function(d, i) { return i & 1 ? width : 0 })
            .attr("y", x0)
            .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
            .text(format)
          .transition()
            .duration(duration)
            .attr("y", x1);

        boxTick.transition()
            .duration(duration)
            .text(format)
            .attr("y", x1);

        // Update whisker ticks. These are handled separately from the box
        // ticks because they may or may not exist, and we want don't want
        // to join box ticks pre-transition with whisker ticks post-.
        var whiskerTick = g.selectAll("text.whisker")
            .data(whiskerData || []);

        whiskerTick.enter().append("text")
            .attr("class", "whisker")
            .attr("dy", ".3em")
            .attr("dx", 6)
            .attr("x", width)
            .attr("y", x0)
            .text(format)
            .style("opacity", 1e-6)
          .transition()
            .duration(duration)
            .attr("y", x1)
            .style("opacity", 1);

        whiskerTick.transition()
            .duration(duration)
            .text(format)
            .attr("y", x1)
            .style("opacity", 1);

        whiskerTick.exit().transition()
            .duration(duration)
            .attr("y", x1)
            .style("opacity", 1e-6)
            .remove();
      });
      d3.timer.flush();
    } //end of function box(g)

    box.width = function(x) {
      if (!arguments.length) return width;
      width = x;
      return box;
    };

    box.height = function(x) {
      if (!arguments.length) return height;
      height = x;
      return box;
    };

    box.tickFormat = function(x) {
      if (!arguments.length) return tickFormat;
      tickFormat = x;
      return box;
    };

    box.duration = function(x) {
      if (!arguments.length) return duration;
      duration = x;
      return box;
    };

    box.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x == null ? x : d3.functor(x);
      return box;
    };

    box.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return box;
    };

    box.whiskers = function(x) {
      if (!arguments.length) return whiskers;
      whiskers = x;
      return box;
    };

    box.quartiles = function(x) {
      if (!arguments.length) return quartiles;
      quartiles = x;
      return box;
    };

    return box;
  }; // end of d3.box

  function boxWhiskers(d) {
    return [0, d.length - 1];
  }

  function boxQuartiles(d) {
    return [
      d3.quantile(d, .25),
      d3.quantile(d, .5),
      d3.quantile(d, .75)
    ];
  }


}());