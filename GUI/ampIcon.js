(function() {

  d3.ampIcon = function(){
       
      //global scope variables
        parent =  overviewContainer;
        var width = 360,
        height = 500,
        τ = 2 * Math.PI; // http://tauday.com/tau-manifesto

    // An arc function with all values bound except the endAngle. So, to compute an
    // SVG path string for a given angle, we pass an object with an endAngle
    // property to the `arc` function, and it will return the corresponding string.
    var arc = d3.svg.arc()
        .innerRadius(40)
        .outerRadius(53)
        .startAngle(Math.PI);
    var arcInner = d3.svg.arc()
        .innerRadius(41)
        .outerRadius(52)
        .startAngle(Math.PI);
    var svgg = d3.select(parent).selectAll("svg").append("g")
      .attr("transform", "translate(" + 180 + "," + 85 + ")")
      .attr("class","ampIcon");

    //HASH with accessor functions, load function, and animate function
    return {

        gsWidth : function(x) {  //gets or set width. Passing no arguments will get width, otherwise sets width.
          if (!arguments.length) return width;
        width = x;
        return this;
        },

        loadAmpIcon : function(x){
           // Add the background arc, from 0 to 100% (τ).
          var background = svgg.append("path")
            .datum({endAngle: Math.PI*3})
            .style("fill", "#E8E8E8" )
            .style("opacity",1)
            //.style("stroke-width",2)
            .style("stroke","black")
            .attr("d", arc);

          foreground = svgg.append("path")
            .datum({endAngle: Math.PI})
            .style("fill", statusColor[0])
            .attr("d", arcInner)
            .attr("class","inner");  

          return this.animateAmpIcon;
        },
        animateAmpIcon : function(x){
          amps = ((Math.random()+.5) * τ).toFixed(1);
          totalVolts = (110 + 10*Math.random()).toFixed(0);

          // Add the foreground arc in orange, currently showing 12.7%.
          svgg.selectAll("path.inner").transition()
            .duration(750).call(arcTween, (4+ 2.5*Math.random()));
          
          textSVG = svgg.selectAll("text.current")
                      .data([amps + "A "]);

          //Enter
          textSVG.enter().append("text")
                      .attr("class","current")
                      .attr("y", 0)
                      .attr("x", -36)
                      .style("fill", "black")
                      .text(function(d) { return d + "@ "+totalVolts +"V"; })
                      .style("font-size","12px");
          //UPDATE
          textSVG.transition()
              .duration(500)
              .delay(0)
              .text(function(d) { return d + "@ "+totalVolts +"V" });
          }
      }//end of return

      // Creates a tween on the specified transition's "d" attribute, transitioning
    // any selected arcs from their current angle to the specified new angle.
    function arcTween(transition, newAngle) {

      // The function passed to attrTween is invoked for each selected element when
      // the transition starts, and for each element returns the interpolator to use
      // over the course of transition. This function is thus responsible for
      // determining the starting angle of the transition (which is pulled from the
      // element's bound datum, d.endAngle), and the ending angle (simply the
      // newAngle argument to the enclosing function).
      transition.attrTween("d", function(d) {

        // To interpolate between the two angles, we use the default d3.interpolate.
        // (Internally, this maps to d3.interpolateNumber, since both of the
        // arguments to d3.interpolate are numbers.) The returned function takes a
        // single argument t and returns a number between the starting angle and the
        // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
        // newAngle; and for 0 < t < 1 it returns an angle in-between.
        var interpolate = d3.interpolate(d.endAngle, newAngle);

     // The return value of the attrTween is also a function: the function that
        // we want to run for each tick of the transition. Because we used
        // attrTween("d"), the return value of this last function will be set to the
        // "d" attribute at every tick. (It's also possible to use transition.tween
        // to run arbitrary code for every tick, say if you want to set multiple
        // attributes from a single function.) The argument t ranges from 0, at the
        // start of the transition, to 1, at the end.
        return function(t) {

          // Calculate the current arc angle based on the transition time, t. Since
          // the t for the transition and the t for the interpolate both range from
          // 0 to 1, we can pass t directly to the interpolator.
          //
          // Note that the interpolated angle is written into the element's bound
          // data object! This is important: it means that if the transition were
          // interrupted, the data bound to the element would still be consistent
          // with its appearance. Whenever we start a new arc transition, the
          // correct starting angle can be inferred from the data.
          d.endAngle = interpolate(t);

          // Lastly, compute the arc path given the updated data! In effect, this
          // transition uses data-space interpolation: the data is interpolated
          // (that is, the end angle) rather than the path string itself.
          // Interpolating the angles in polar coordinates, rather than the raw path
          // string, produces valid intermediate arcs during the transition.
          return arcInner(d);
        };
      });
    }
  }//end of d3.ampIcon
}()); //end of IIFE

