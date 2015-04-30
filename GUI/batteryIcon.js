(function() {


    battery = {DIV: batteryContainer, Width: 48, xPos: 30} 

     d3.batteryIcon = function(){
       
        var batteryWidth = 48,
        batteryHeight = batteryWidth*2,
        battXPos = battery.xPos,
        battYPos = 30 + Math.floor(batteryHeight/10),
        width = batteryWidth + 300 + 31*2,
        height = Math.floor(batteryHeight*1.1)+31*2; // Height and width should be even

        moduleBgndColor = "rgb(255,255,255)";

    return {

        gsWidth : function(x) {  //gets or set width. Passing no arguments will get width, otherwise sets width.
          if (!arguments.length) return batteryWidth;
        batteryWidth = x,
        batteryHeight = batteryWidth*2,
        battXPos = battery.xPos,
        battYPos = 30 + Math.floor(batteryHeight/10),
        width = batteryWidth + 300 + 31*2,
        height = Math.floor(batteryHeight*1.1)+31*2; // Height and width should be even

          return this;
        },

        loadBatteryIcon: function(x){
            batterySVG = d3.select(battery.DIV)
            .append("svg")
                .attr("width", width)
                .attr("height", height);

            batterySVG.selectAll("rect.background")
                .data([moduleBgndColor], function(d) { return d; })
                .enter().append("rect")
                    .attr("class", "background")
                    .attr("y", 1)
                    .attr("x", 1)
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("width", width-3)
                    .attr("height", height-3)
                    .attr("opacity",1)
                    .style("fill", function(d,i) { return d; })
                    .style("stroke","rgb(220,220,220)")
                    .style("stroke-width",1);
            batterySVGg = batterySVG.append("g")
            .attr("transform", "translate( 0 , 0 )")
            .attr("class","battery"); //translate origin coordinate of SVG

            batterySVGg.selectAll("rect.nub")
                .data(["#E8E8E8"], function(d) { return d; })
                .enter().append("rect")
                    .attr("class", "nub")
                    .attr("y", battYPos - Math.floor(batteryHeight/10)+3)
                    .attr("x", battXPos + Math.floor(batteryWidth/4))
                    .attr("rx",5)
                    .attr("ry",5)
                    .attr("width", Math.floor(batteryWidth/2))
                    .attr("height", Math.floor(batteryHeight/10))
                    .attr("opacity",1)
                    .style("fill", function(d,i) { return d; })
                    .style("stroke","black")
                    .style("stroke-width",1);

            batterySVGg.selectAll("rect.cannister")
                .data(["#E8E8E8"], function(d) { return d; })
                .enter().append("rect")
                    .attr("class", "cannister")
                    .attr("y", battYPos)
                    .attr("x", battXPos)
                    .attr("rx",2)
                    .attr("ry",3)
                    .attr("width", batteryWidth)
                    .attr("height", batteryHeight)
                    .attr("opacity",1)
                    .style("fill", function(d,i) { return d; })
                    .style("stroke","black")
                    .style("stroke-width",1);

        
            return this.animateBatteryIcon;
        },

        animateBatteryIcon: function(x){

            var battPercent = Math.random();
            data = [battPercent];
            var juiceHeight = Math.floor((batteryHeight-1)*battPercent);

            batterySVG = d3.select(battery.DIV).select("svg").select("g").selectAll("rect.juice").data(data);

            //ENTER
            batterySVG.enter().append("rect")
                .attr("class", "juice")
                .attr("y", Number(battYPos) + Number(batteryHeight)-Number(juiceHeight)-1)
                .attr("x", battXPos+1)
                .attr("width", batteryWidth-2)
                .attr("height", juiceHeight)
                .attr("opacity",1)
                .style("fill", function(d,i) { return statusColor[0]; });

            //UPDATE
            batterySVG.transition()
                .duration(300)
                .attr("y", Number(battYPos) + Number(batteryHeight)-Number(juiceHeight)-1)
                .attr("x", battXPos+1)
                .attr("width", battery.Width-2)
                .attr("height", juiceHeight);

            //EXIT
            batterySVG.exit()
            .transition()
                .duration(50)
                .style("opacity", 1e-6)
                .remove();

            data = [(battPercent*100).toFixed(0) + "%"];
            batterySVG = d3.select(battery.DIV).select("svg").select("g").selectAll("text.juice")
            .data(data);


            //ENTER
            batterySVG.enter().append("text")
                .attr("class","juice")
                .attr("y", Number(battYPos) + batteryHeight/2)
                .attr("x", battXPos + Math.floor(batteryWidth/5))
                .style("fill", "black")
                .text(function(d) { return (d).toString(); })
                .style("font-size", (Math.floor(batteryWidth/3)).toString()+"px");

            //UPDATE
            batterySVG.transition()
                .duration(0)
                .delay(0)
                .text(function(d) { return d; });

            //EXIT
            batterySVG.exit().transition()
                .duration(50)
                .style("opacity", 1e-6)
                .remove();
        } //end of animateBatteryIcon
    } //end of return
    } //end of d3.batteryIcon
}());// end of IIFE


          