
(function() {
            
  // Inspired by http://informationandvisualization.de/blog/box-plot
  d3.barPlot = function() {
    var width = 400,
        height = 150,
        duration = 0,
        domain = null,
        value = Number,
        tickFormat = null,
        moduleBgndColor = "rgb(255,255,255)",
        duration = 500,
        moduleCount = 32, //should be at least 2
        barsPerModule = 3, //should be at least 1
        parent = "";
  var margin = {top: 10, right: 0, bottom: 10, left: 0};

  var scalingXFunc = d3.scale.linear()
            .domain( [0, moduleCount] )
            .range( [margin.left, width-margin.right] );

  var moduleWidth = (scalingXFunc(1)-scalingXFunc(0));

  var barScalingXFunc = d3.scale.linear()
            .domain([0, barsPerModule*2+1])
            .range([0, moduleWidth]);

  var barWidth =  (barScalingXFunc(1)-barScalingXFunc(0));

  var moduleClr =[];
      for (i = 0; i < moduleCount; i++) { 
          moduleClr.push(i%2);
      }

  //Return Hash with get set functions gsVarxXX() to set the global variables with resepect to this scope.
  // Use like the following
  // var animationFunction = d3.customGraphic.gsVariable1("somevalue").gsVar2(Number(xx)).loadCustomGraphic();
  // animationFunction(); //to update graphic
  return {

    gsWidth : function(x) {  //gets or set width. Passing no arguments will get width, otherwise sets width.
      if (!arguments.length) return width;
      width = x;
      scalingXFunc = d3.scale.linear()
            .domain( [0, moduleCount] )
            .range( [margin.left, width-margin.right] );

      moduleWidth = (scalingXFunc(1)-scalingXFunc(0));

      barScalingXFunc = d3.scale.linear()
            .domain([0, barsPerModule*2+1])
            .range([0, moduleWidth]);

      barWidth =  (barScalingXFunc(1)-barScalingXFunc(0));

      return this;
    },

    gsHeight : function(x) {
      if (!arguments.length) return height;
      height = x;
      return this;
    },

    gsParent: function(x) {
      if (!arguments.length) return parent;
      parent = x;
      return this;
    },

    gsDuration : function(x) {
      if (!arguments.length) return duration;
      duration = x;
      return this;
    },

    gsDomain : function(x) {
      if (!arguments.length) return domain;
      domain = x == null ? x : d3.functor(x);
      return this;
    },

    gsValue : function(x) {
      if (!arguments.length) return value;
      value = x;
      return this;
    },

    gsWhiskers : function(x) {
      if (!arguments.length) return whiskers;
      whiskers = x;
      return this;
    },

    gsQuartiles : function(x) {
      if (!arguments.length) return quartiles;
      quartiles = x;
      return this;
    },

    loadBarPlot : function(){

      //LOAD BACKGROUND RECTANGLE
    d3.select(parent).append("svg")
        .attr("width", width + 100)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate( 2 , 2 )") //translate origin coordinate of SVG
            .append("rect")
              .attr("class", "background")
              .attr("y", 0)
              .attr("x", 0)
              .attr("rx",10)
              .attr("ry",10)
              .attr("width", width-margin.left-margin.right)
              .attr("height", height-4)
              .attr("opacity",1)
              .style("fill", moduleBgndColor)
              .style("stroke","rgb(220,220,200)")
              .style("stroke-width",1);

      //LOAD COLORED SECTIONS
      d3.select(parent).select("svg").select("g")
        .selectAll("rect.module").data(moduleClr)
        .enter().append("rect")
            .attr("class", "module")
            .attr("y", margin.top)
            .attr("x", function(d,i) { return scalingXFunc(i); })
            .attr("rx",2)
            .attr("ry",2)
            .attr("width", moduleWidth)
            .attr("height", height-margin.top-margin.bottom-4)
            .attr("opacity",.1)
            .style("fill", function(d,i) { if (d) return "blue"; else return "#FF9933"; });

      //LOAD COLORED SECTION NUMBERS
      d3.select(parent).select("svg").select("g").selectAll("text.module").data(moduleClr)
      .enter().append("text")
            .attr("class","module")
            .attr("y", height-margin.bottom)
            .attr("x", function(d,i) {  return scalingXFunc(i); })
            .text(function(d,i) {  return i; })
            .style("opacity",.1)
            .style("font-size",Math.floor(moduleWidth*.5).toString()+"px");

      return this.animatePlot;},

    animatePlot: function(g)  { //for every <g> (containers used to group objects in SVGs). 
      var d =[];
      for (i = 0; i < moduleCount*barsPerModule; i++) { 
          d.push(Math.random()*5);
      }

      var  mm = d3.extent(d);
      var min = mm[0],
        max = mm[1],
        med = d3.mean(d);
/*
      scalingXFunc = d3.scale.linear()
            .domain([0, d.length-1])
            .range([margin.left+4, width-margin.right-margin.left]);*/

      scalingYFunc = d3.scale.linear()
            .domain([max,min])
            .range([margin.bottom, height-margin.top]); //

        var scatterSVG = d3.select(parent).select("svg").select("g");

        //ENTER, UPDATE, AND EXIT STATES FOR SCATTER BARS
        var scatterBars = scatterSVG.selectAll("line.bar")
            .data(d);

        //ENTER STATES
        scatterBars.enter().append("line")
            .attr("class","bar")
            .attr("x1", function(d,i) { return scalingXFunc(Math.floor(i/barsPerModule))+ barWidth*1.5+ barScalingXFunc((i%barsPerModule)*2); })
            .attr("y1", Math.floor(scalingYFunc(med)))
            .attr("x2", function(d,i) { return scalingXFunc(Math.floor(i/barsPerModule))+ barWidth*1.5+ barScalingXFunc((i%barsPerModule)*2); })
            .attr("y2", function(d,i) { return Math.floor(scalingYFunc(d)); })
            .style("stroke", "black")
            .style("stroke-width", barWidth)
            .style("opacity", 1);
        //UPDATE STATES
        scatterBars.transition()
            .duration(duration)
            .attr("y1", Math.floor(scalingYFunc(med)))
            .attr("y2", function(d) {  return Math.floor(scalingYFunc(d)); })
            .style("opacity", 1); 
        //EXIT STATES
        scatterBars.exit().transition()
            .duration(50)
            .style("opacity", 1e-6)
            .remove();

        //ENTER, UPDATE, AND EXIT STATES FOR MEDIAN LINE
        var scatterLine = scatterSVG.selectAll("line.mean")
            .data([med]);
        //ENTER
        scatterLine.enter().append("line")
            .attr("class", "mean")
            .attr("x1", margin.left+4)
            .attr("y1", function(d) {  return Math.floor(scalingYFunc(d)); })
            .attr("x2", width-margin.right-4)
            .attr("y2", function(d) {  return Math.floor(scalingYFunc(d)); })
            .style("stroke-dasharray", ("3, 3"))
            .style("stroke", "black")
            .style("stroke-width",1)
            .style("opacity", 1);
        // UPDATE
        scatterLine.transition()
            .duration(duration)
              .attr("y1", function(d) {  return Math.floor(scalingYFunc(d)); })
              .attr("y2", function(d) {  return Math.floor(scalingYFunc(d)); });
        //EXIT
        scatterLine.exit().transition()
            .duration(50)
            .style("opacity", 1e-6)
            .remove();

        //ENTER, UPDATE, AND EXIT STATES FOR TEXT
        texty = [" (min)"," (avg)"," (max)"];
        var scatterText = scatterSVG.selectAll("text.spread")
            .data([min, med, max]);

        scatterText.enter().append("text")
            .attr("class","spread")
            .attr("dy", 0)
            .attr("dx", function(d, i) { return 0})
            .attr("x", width)
            .attr("y", function(d) {  return scalingYFunc(d); })
            .text(function(d) {  return d.toFixed(3); })
            .style("font-size","12px");


        scatterText.transition()
            .duration(duration)
                .attr("y", function(d) {  return scalingYFunc(d); })
                .text( function(d,i) {  return d.toFixed(3) + texty[i]; });

        scatterLine.exit().transition()
            .duration(50)
            .style("opacity", 1e-6)
            .remove();
    }
      
  } //end of return

  }; // end of d3.scatterPlot = function(){...};

}());  // end of IIFE (immediately invoked function expression)