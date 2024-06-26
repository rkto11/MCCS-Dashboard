const group = [
    ["Category", "naf_cat"],
    ["Region", "region"],
    ["Installation", "installation"],
    ["Program", "op_activity"],
    ["CCN", "use_desc"]
];

//MCHS requires only Cat, Region, Installation
const MCHSgroup = group.slice(0,3);

//initial html elements, called when submit button is pressed
function CreateMCCSFSRMReport(data) {
    initHTML('#mccs-report', '#mchs-report');
    group.forEach((e) => dataGroup(e, data));
    
    //add filtering to Cat C, then run dataGroup, re-lable e[0] to e[0] + "C"
    const CatCData = filterToCat(data, 0, 1, "C");

    group.forEach((e) => {
        var labelC = e[0] + "C";
        dataGroup([labelC, e[1]], CatCData);
    });

    //remove Category filtered to Cat C. Would be a singlular data point
     document.getElementById("CategoryC").remove();


     //MCHS grouping, data process
     
     const MCHSData = filterToCat(data, 4, 2, "L");

     MCHSgroup.forEach((e) => {
        var labelC = e[0] + "H";
        dataGroup([labelC, e[1]], MCHSData);
    });
}

//html generator
function initHTML(mccsID, mchsID) {
    //MCCS Tab HTML
    var mccshtml = "<h1>MCCS Facilities Exploratory Analysis</h1><hr>";
    group.forEach((e) => mccshtml += "<div id='" + e[0] + "'>\r\n" + "<h3>" + e[0] + "</h3>\r\n <table id='table" + e[0] + "'></table>\r\n" + "<canvas id='chart" + e[0] + "'></canvas></div>\r\n"
        + "<div id='" + e[0] + "C'>\r\n" + "<h3>" + e[0] + " (Category C)</h3>\r\n <table id='table" + e[0] + "C'></table>\r\n" + "<canvas id='chart" + e[0] + "C'></canvas></div><hr>\r\n");
    $(mccsID).html(mccshtml);

    //MCHS Tab HTML
    var mchshtml = "<h1>MCHS</h1><hr>"
    MCHSgroup.forEach((e) => mchshtml += "<div id='" + e[0] + "H'>\r\n" + "<h3>" + e[0] + "</h3>\r\n <table id='table" + e[0] + "H'></table>\r\n" + "<canvas id='chart" + e[0] + "H'></canvas></div><hr>\r\n");
    $(mchsID).html(mchshtml);
}

//data grouping
function dataGroup(grouping, data) {
    var label = grouping[0];
    var dataElement = grouping[1];
    var groupedData = [];
    var element = [];
    element.push(...new Set(data[1].map(item => item[dataElement])));

    const UtilData = data[1];
    const FacData = data[0];

    for(i=0; i<element.length; i++) {
        //UtilData
        var S = 0;
        var RM = 0;
        var FSRM = 0;
        var PRV = 0;
        var UtilCount = 0;
        for(j=0; j<UtilData.length; j++) {
            if(UtilData[j][dataElement] === element[i]) {
                S += UtilData[j].sus;
                RM += UtilData[j].RM_corrected;
                PRV += UtilData[j].prv;
                UtilCount++;
            }
        }
        FSRM = S + RM;
        
        //FacData
        var Q1 = 0; 
        var Q2 = 0; 
        var Q3 = 0; 
        var Q4 = 0;
        var FacCount = 0;
        for(j=0; j<FacData.length; j++) {
            if(FacData[j][dataElement] === element[i]) {
                if(FacData[j].fci_q_rating === "Q1"){ Q1++; }
                if(FacData[j].fci_q_rating === "Q2"){ Q2++; }
                if(FacData[j].fci_q_rating === "Q3"){ Q3++; }
                if(FacData[j].fci_q_rating === "Q4"){ Q4++; }
                FacCount++;
            }
        }

        const el = element[i];
        const obj = {[label]: el};
        groupedData.push(...[{...obj, "Sustainment": round2dec(S), "R&M": round2dec(RM), "FSRM": round2dec(FSRM), "Utilizations": UtilCount, "Facilities": FacCount, "Q1": Q1, "Q2": Q2, "Q3": Q3, "Q4": Q4}]);
    }

    createTableHTML(groupedData, label);
    populateTable(groupedData, label);
    initChart(groupedData, label);
}

//Table generators
function createTableHTML(data, label) {
    var html = '';
    
    if (data[0].constructor === Object) {
        var t = 0;
        html += '<thead>\r\n';
        html += '<tr>\r\n';
        for (var item in data[0]) {
            html += '<th>' + item + '</th>\r\n';
            t++;	
        }
        html += '</tr>\r\n';
        html += '</thead>\r\n';
        html += '<tfoot>\r\n';
        html += '<tr>\r\n';
        html += '<th></th>\r\n';
        for (var i=1; i<t; i++) {
            html += '<th></th>\r\n';
        }
        html += '</tr>\r\n';
        html += '</tfoot>\r\n';
    }

    const tableID = '#table' + label;

    $(tableID).html(html);
}

//DataTables.js
function populateTable(tableData, label) {
    const tableID = '#table' + label;

    var pagingStatus = true;
    if(tableData.length <= 10) { pagingStatus = false; }

    var numFormat = $.fn.dataTable.render.number('\,', '.', 0, '$' );
    var numFormat2 = $.fn.dataTable.render.number('\,', '.', 0);

    $(document).ready(function () {
        $(tableID).dataTable({
            data: tableData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: pagingStatus,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: label},
                {data: 'Sustainment', render: numFormat},
                {data: 'R&M', render: numFormat},
                {data: 'FSRM', render: numFormat},
                {data: 'Utilizations', render: numFormat2},
                {data: 'Facilities', render: numFormat2},
                {data: 'Q1', render: numFormat2},
                {data: 'Q2', render: numFormat2},
                {data: 'Q3', render: numFormat2},
                {data: 'Q4', render: numFormat2}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                if(pagingStatus){$(api.column(0).footer()).html('Total (Current Page)');}
                else{$(api.column(0).footer()).html('Total');}
                

                for(i=1; i<10; i++) {
                    if(pagingStatus) {var e = api.column(i, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});}
                    else { var e = api.column(i).data().reduce(function(a,b){return intVal(a) +intVal(b);});}

                    if(i < 4) {$(api.column(i).footer()).html(numFormat.display(e));}
                    else {$(api.column(i).footer()).html(numFormat2.display(e));}
                }
            }
        });
    });
}

//Creates bar charts (chart.js)
function initChart (data, id) {
    var canvasID = "chart" + id;
    
    data.sort((a,b) => b.FSRM - a.FSRM );
    
    const ctx = document.getElementById(canvasID);
    var label =[];
    var dataset = [];
    var susData = [];
    var rmData = [];

    data.forEach(e => {
        label.push(e[id]);
        dataset.push(e.FSRM);
        susData.push(e.Sustainment);
        rmData.push(e['R&M']);
    })

    const footer = (tooltipItems) => {
        let sum = 0;
      
        tooltipItems.forEach(function(tooltipItem) {
          sum += tooltipItem.parsed.y;
        });
        return 'FSRM: $' + numberWithCommas(sum);
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: label,
          datasets: [
            {
                label: 'Sustainment',
                data: susData,
                borderWidth: 1,
                backgroundColor: "rgb(11,132,165)"
            },
            {
                label: 'R&M',
                data: rmData,
                borderWidth: 1,
                backgroundColor: "rgb(246,200,95)"
            }
        ]
        },
        options: {
            interaction: {
                intersect: true,
                mode: 'index',
              },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                  callbacks: {
                    footer: footer,
                  }
                }
            }
        }
      });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function filterToCat(data, facdatasetnum, utildatasetnum, cat) {
    
    const FacData = data[facdatasetnum];
    const UtilData = data[utildatasetnum];
    var OutputFac = [];
    var OutputUtil = [];

    FacData.forEach((e)  => {
        if ((e.naf_cat).includes(cat)) {OutputFac.push(e);}
    })

    UtilData.forEach((e)  => {
        if ((e.naf_cat).includes(cat)) {OutputUtil.push(e);}
    })

    return [OutputFac, OutputUtil];
}

function round2dec(num) {
    return Math.round(parseFloat(num) * 100)/100;
}