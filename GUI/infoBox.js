(function() {

  d3.infoBox = function(){
       
      //global scope variables
        parent =  overviewContainer;
        var width = 360,
        height = 500,
        duration = 300,
        τ = 2 * Math.PI; // http://tauday.com/tau-manifesto


    var svgg = d3.select(parent).selectAll("svg").append("g")
      .attr("transform", "translate(" + 265 + "," + 30 + ")")
      .attr("class","info");

    //HASH with accessor functions, load function, and animate function
    return {

        gsWidth : function(x) {  //gets or set width. Passing no arguments will get width, otherwise sets width.
          if (!arguments.length) return width;
        width = x;
        return this;
        },

        loadBoxInfo : function(x){
           // Add the background arc, from 0 to 100% (τ).
      svgg.append("rect")
                  .attr("class", "genInfo")
                  .attr("y", 0)
                  .attr("x", 0)
                  .attr("rx",10)
                  .attr("ry",10)
                  .attr("width", 110)
                  .attr("height", 110)
                  .attr("opacity",.8)
                  .style("fill", "#E8E8E8")
                  .style("stroke","black")
                  .style("stroke-width",1);

          return this.animateBoxInfo;
        },
        animateBoxInfo : function(x){
            generalInfo = ["Mode: "+ modeInfo[currentMode].text,
             "Pressure: " +(Math.random()*25).toFixed(0)+" PSI",
             "Power: "+ (amps*totalVolts).toFixed(0)+" W",
             "Status: Normal"];

          txtSvgg = svgg.selectAll("text.generalInfo").data(generalInfo);


          txtSvgg.enter().append("text")
                  .attr("y", function(d,i) { return 30 +15*i })
                  .attr("x", 10)
                  .attr("class","generalInfo")
                  .style("fill", "black")
                  .text(function(d) { return d; })
                  .style("font-size","12px");

             //UPDATE STATES
        txtSvgg.transition()
            .duration(duration)
                   .text(function(d) { return d; }); 
        //EXIT STATES
        txtSvgg.exit().transition()
            .duration(50)
            .style("opacity", 1e-6)
            .remove();

        }
    }//end of return
  }//end of d3.boxInfo
}()); //end of IIFE


   

   

  

    



