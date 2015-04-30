modeInfo = [{color:"rgb(190, 219, 57)", text: "ON", limits:{voltageAlarm:[3,4.205],voltageWarn:[3.2,4.201]}},
{color:"rgb(0, 67, 88)", text:"OFF", limits:{voltageAlarm:[1,14],voltageWarn:[2,13]}},
{color:"rgb(253, 116, 0)", text:"CHARGE",limits:{voltageAlarm:[1,14],voltageWarn:[2,11]}},
{color:"#9900FF", text:"BALANCE",limits:{voltageAlarm:[1,14],voltageWarn:[3,9]}}];

//<path class="box" d="M293.51,-16.79H351.86M293.51,103.75H351.86V-77.44H293.51ZM322.69,103.75V114.11M322.69,-77.44V-203.66M308.1,114.11H337.27M308.1,-203.66H337.27" style="stroke-width: 1px; stroke: rgb(0, 67, 88); stroke-opacity: 1; fill: rgb(0, 67, 88); fill-opacity: 0.5;"></path>
//<path class="box" d="M53.46,24.21H114.19M53.46,103.12H114.19V-16.62H53.46ZM83.83,103.12V321.5M83.83,-16.62V-110.57M68.65,321.5H99.01M68.65,-110.57H99.01" style="stroke-width: 1px; stroke: rgb(253, 116, 0); stroke-opacity: 1; fill: rgb(253, 116, 0); fill-opacity: 0.5;"></path>
//<path class="box" d="M488.88,10.93H547.23M488.88,124.09H547.23V-27.1H488.88ZM518.06,124.09V251.89M518.06,-27.1V-72.45M503.47,251.89H532.64M503.47,-72.45H532.64" style="stroke-width: 1px; stroke: rgb(190, 219, 57); stroke-opacity: 1; fill: rgb(190, 219, 57); fill-opacity: 0.5;"></path>
currentMode = 0;
var amps = 0, totalVolts = Number;

//modeInfo[currentMode].text

statusColor = ["rgb(31, 138, 112)", "orange", "rgb(166,28,0)"];

buttonContainer = "#modeButtons"; 
boxPlotContainer = "#viz";
batteryContainer = "#overview";
overviewContainer = "#overview";