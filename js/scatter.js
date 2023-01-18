function updatechart(inputstring, filter, group){
    //remove old canvas, add new canvas
    $("canvas#myChart").remove();
    $("div.chart-container").append('<canvas id="myChart" class="animated fadeIn" width="100vh" height="50vh"></canvas>');
    $("table#myTable").remove();
    $("div#tableappenddiv").remove();
    $("div.tablediv").append('<div id="tableappenddiv"><table id="myTable" class="table-responsive"></table></div>');
    var ctx = document.getElementById("myChart").getContext("2d");

    var FY24 = [39223,22306,20979,24899,69806,19746,26331,26184,25157,21927,26728,547876,36338,26424,30529,27072];


    //impliment new filter on button click
    $(document).ready(function () {
        $.get('https://raw.githubusercontent.com/rkto11/mccs/main/data/chartdata.csv', function (theData) {
            var id = $.csv.toObjects(theData);
            var inputdata = [];
            var filtereddata = [];
            for(i=0;i<FY24.length;i++){
                for(j=0;j<id.length;j++){
                    if(id[j].RPUID == FY24[i]){
                        filtereddata.push(id[j]);
                    }
                }
            }
            if(filter === 'y'){
                inputdata = filtereddata;
            }
            else {
                inputdata = id;
            }
            var input =[];
            var grouping = [];
            grouping.push(...new Set(inputdata.map(item => item[group])));

            for(j=0; j<grouping.length; j++) {
                var subinput = [];
                for(i=0; i<inputdata.length; i++) {
                    if(grouping[j] === inputdata[i][group]){
                        subinput.push({'x': inputdata[i].Net_Profit, 'y':inputdata[i][inputstring], 'Installation': inputdata[i].Installation, 'RPUID': inputdata[i].RPUID, 'Asset_Name': inputdata[i].Asset_Name, 'Net_Profit': inputdata[i].Net_Profit, 'Condition': inputdata[i].ConditionCombo, 'ICI': inputdata[i].ICI_Exist});
                    }
                }
                var r = grouping[j];
                var color1 = Math.floor(Math.random()*255); 
                var color2 = Math.floor(Math.random()*255); 
                var color3 = Math.floor(Math.random()*255);
                console.log(color1, color2, color3);
                var backgroundColor  = "rgba(" + color1 + ", " + color2 + ", " +  color3 + ", 0.7)";
                var borderColor = "rgb(" + color1 + ", " + color2 + ", " +  color3 + ")";
                input.push({"label": r, "data": subinput, "borderColor": borderColor, "backgroundColor": backgroundColor})
            }
        
            const data = {datasets: input};

            const quadrants = {
                id: 'quadrants',
                beforeDraw(chart, args, options) {
                    const {ctx, chartArea: {left, top, right, bottom}, scales: {x, y}} = chart;
                    const midX = x.getPixelForValue(0);
                    var midY = y.getPixelForValue(0);
                    if(inputstring === 'ConditionCombo') {
                        midY = y.getPixelForValue(70);
                    }
                    ctx.save();
                    ctx.fillStyle = options.topLeft;
                    ctx.fillRect(left, top, midX - left, midY - top);
                    ctx.fillStyle = options.topRight;
                    ctx.fillRect(midX, top, right - midX, midY - top);
                    ctx.fillStyle = options.bottomRight;
                    ctx.fillRect(midX, midY, right - midX, bottom - midY);
                    ctx.fillStyle = options.bottomLeft;
                    ctx.fillRect(left, midY, midX - left, bottom - midY);
                    ctx.restore();
                }
            };

            const config = {
                type: 'scatter',
                data: data,
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(tooltipitem){
                                    var Inst = "Installation: " + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].Installation;
                                    var RP =  "RPUID: " + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].RPUID;
                                    var AN = "Asset Name: " + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].Asset_Name;
                                    var NP = "Net Profit: $" + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].Net_Profit;
                                    var Con = "Condition: " + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].Condition;
                                    var ICI = "ICI: " + config.data.datasets[tooltipitem.datasetIndex].data[tooltipitem.dataIndex].ICI;
                                    return [Inst, RP, AN, NP, Con, ICI];
                                }
    
                            }
                        },
                        quadrants: {
                            topLeft: 'rgba(255,242,122,0.5)',
                            topRight: 'rgba(122,147,255,0.5)',
                            bottomRight: 'rgba(122,255,131,0.5)',
                            bottomLeft: 'rgba(252,136,119,0.5)',
                        }
                    }
                },
                plugins: [quadrants]
            };
        
            var thisChart = new Chart(ctx, config);

            //associated table
            var subtablehtml = createTableNF(inputdata);
            $('#myTable').html(subtablehtml);
            $(document).ready(function () {
                $('#myTable').dataTable({
                    
                    data: inputdata,
                    paging: true,
                    "bLengthChange": false,
                    "bFilter": true,
                    "bInfo": false,
                    columns: [
                        {data: 'Region'},
                        {data: 'Installation'},
                        {data: 'RPUID'},
                        {data: 'Asset_Name'},
                        {data: 'build_dt'},
                        {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                        {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                        {data: 'FCI'},
                        {data: 'ICI'},
                        {data: 'Visit Date'},
                        {data: 'Net_Profit',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                        {data: 'Population'},
                        {data: 'Profit_per_pop',render: $.fn.dataTable.render.number(',', '.', 2, '$' )},
                        {data: 'ConditionCombo'},
                        {data: 'ICI_Exist'},
                        {data: 'Q-Rating'} 
                    ],
                    dom: 'Brftip',
                    buttons: [{extend: 'excelHtml5'}],
                    
                });
            });
            
            function createTableNF(data) {
                var html = '';

                if (data[0].constructor === Object) {
                    html += '<thead>\r\n';
                    html += '<tr>\r\n';
                    for (var item in data[0]) {
                        html += '<th>' + item + '</th>\r\n';
                    }
                    html += '</tr>\r\n';
                    html += '</thead>\r\n';
                }
                return html;
            }
        });
    });
}