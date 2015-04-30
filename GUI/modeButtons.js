function loadModeButtons(){
   
    var buttonMargin = 30;
    var buttonWidth = 70;
    var buttonSpacing = (buttonMargin+buttonWidth);
    
    var width = 5*buttonMargin + 4*buttonWidth,
    height = 167; // Height and width should be even
    moduleBgndColor = "rgb(255,255,255)";

    maintenanceSVG = d3.select(buttonContainer)
        .append("svg")
            .attr("width", width)
            .attr("height", height);

    maintenanceSVG.selectAll("rect.background")
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
    
    maintenanceSVG.selectAll("text.button")
            .data(modeInfo, function(d) { return d.text; })
        .enter().append("text")
            .attr("class","button")
            .attr("y", 60)
            .attr("x", function(d, i) { return i * buttonSpacing + 30; })
            .style("fill", "black")
            .text(function(d) { return d.text; })
            .style("font-size","15px");
    
    maintenanceSVG.selectAll("rect.buttons")
        .data(modeInfo)
        .enter().append("rect")
            .attr("class", "button")
            .attr("y", 40)
            .attr("x", function(d, i) { return i * buttonSpacing + buttonMargin; })
            .attr("rx",10)
            .attr("ry",5)
            .attr("width", buttonWidth)
            .attr("height", 30)
            .attr("opacity",.5)
            .style("stroke","black")
            .style("fill", function(d,i) { return d.color; })
            .on("mousedown", animateFirstStep)
            .on("mouseenter", function(){d3.select(this).style("stroke-width", 3);})
            .on("mouseleave", function(){d3.select(this).style("stroke-width", 1);} );


    maintenanceSVG.selectAll("circle")
            .data([statusColor[2]], function(d) { return d; })
        .enter().append("circle")
            .attr("cy", 130)
            .attr("cx", Math.floor(width/2))
            .attr("r", 25)
            .attr("opacity",.5)
            .style("fill", function(d,i) { return d; });
/*
    maintenanceSVG.selectAll("text.circle")
            .data(["#F00000"])
        .enter().append("text")
            .attr("class","circle")
            .attr("y", 135)
            .attr("x", Math.floor(width/2)-22)
            .style("fill", "black")
            .text("MODE")
            .style("font-size","15px");*/

    

    function animateFirstStep(){

        var button = d3.select(this);
        color = button.style("fill");
        console.log(color);
        var x1 = Number(button.attr("x")) + Number(button.attr("width"))*.5;
        var y1 = Number(button.attr("y"))+Number(button.attr("height"));
        svgContainer =d3.select(buttonContainer).selectAll("svg") ;
        thecircle = svgContainer.selectAll("circle");
        var lineData = [ { "x": x1,  "y": y1}, 
                         { "x": x1,  "y": Number(y1) + Number(25)},
                         { "x": thecircle.attr("cx"), "y": Number(thecircle.attr("cy")) - Number(thecircle.attr("r"))-Number(29)},
                         { "x": thecircle.attr("cx"), "y": Number(thecircle.attr("cy")) - Number(thecircle.attr("r"))-Number(4)}];

        var lineFunction = d3.svg.line()
                               .x(function(d) { return d.x; })
                               .y(function(d) { return d.y; })
                               .interpolate("basis");

        svgContainer.selectAll("path").remove();
        var lineGraph = svgContainer.append("path")
                               .attr("d", lineFunction(lineData))
                               .attr("stroke", "black")
                               .style("stroke-dasharray", ("3, 3"))
                               .attr("stroke-width", 2)
                               .attr("fill", "none");

        thecircle.transition()            
            .delay(0)            
            .duration(250)
            .style("stroke-width", 0)
            .each("end", animateSecondStep);
    };

    function animateSecondStep(){
        d3.select(this)
          .transition()            
            .delay(0)            
            .duration(0)
            .style("stroke", color )
            .each("end", animateThirdStep);
    };

    function animateThirdStep(){
        d3.select(this)
          .transition()
            .duration(200)

            .style("stroke-width", 7);
    };
}

function modeSwitch(x){
    currentMode = x;
    svgContainer = d3.select(buttonContainer).selectAll("svg");
    theCircle = svgContainer.selectAll("circle");
    animateFirstStep();

    function animateFirstStep(){
    svgContainer.selectAll("path").remove();
    color  = modeInfo[x].color;
    d3.select(buttonContainer).selectAll("svg")
    .selectAll("circle")
        .style("stroke-width",0)
      .transition()            
        .delay(0)            
        .duration(300)
        .attr("r", 0 )
        .each("end", animateSecondStep);
    };

    function animateSecondStep(){
    d3.select(this)
      .transition()
        .duration(0)
        .style("fill", color)
        .each("end", animateThirdStep);
    };

    function animateThirdStep(){
    d3.select(this)
      .transition()
        .duration(300)
        .attr("r", 25)
    };
}
