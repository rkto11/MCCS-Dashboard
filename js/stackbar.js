var currentLevel = "";
var conditionIndex = "";
let delayed;
function stackInit(stackdata, stackctx, stackChart) {
    //labelset for x-axis labels, eventually the FCIs/ICIs
    
    //this will be the grouped data, label is region/installation name
    //data will be number of corresponding FCI/ICI ratings in labelset in order
    //can add backgroundColor if needed
    inputdata  = [];
    stackdata[0].forEach((e) => {
        inputdata.push({"label": e.Region, "data": e.ScoreSorted, "Installation": e.Installation});
    });
    
    conditionIndex = stackdata[2];

    var stackoptions = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: "Condition Index"
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: "Count"
                }
            }
        },
        interaction: {
            intersect: true,
            mode: 'index'
        },
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }, 
        animations: {
            duration: 1000,
            easing: 'linear'
        },
        plugins: {
            title: {
                display: true,
                text: "MCCS"
            }
        }
    };

    stackChart.config.data.labels  = stackdata[1];
    stackChart.config.data.datasets = inputdata;
    stackChart.config.options = stackoptions;
    stackChart.update();

    function mousemoveHandler(ctx, mousemove) {
        const x = mousemove.offsetX;
        const y = mousemove.offsetY;
        //console.log(mousemove);
    }

    stackctx.addEventListener('mousemove', (e) => {
        mousemoveHandler(stackChart, e);
    });

    function clickHandler(click) {
        const bar = stackChart.getElementsAtEventForMode(click, 'nearest', { intersect: true }, true);
        if (bar.length && currentLevel === "Region") {
            const bardatasetindex = bar[0].datasetIndex;
            clickthroughL1(stackChart.config.data.datasets[bardatasetindex], stackdata[1], stackChart, conditionIndex);
        }

        else if (bar.length && currentLevel === "Installation" && conditionIndex === "fci") {
            const bardatasetindex = bar[0].datasetIndex;
            clickthroughL2(stackChart.config.data.datasets[bardatasetindex], stackdata[1], stackChart, conditionIndex);
        }
    }    
    stackctx.onclick = clickHandler;

    populateBarTable(stackdata[3], stackdata[2]);

    currentLevel = "Region";
}


//==========================================================================================================//


function stackdataprocess(data, dataset) {
    //desired output
    //region, installation, FCI/ICI

    //ci meaning condition index, pulling score label from object
    var ci = "";
    var processdata = [];
    if(dataset === 1) {
        ci = "fci";
        processdata = (data[dataset]).filter(function (e) { return e.naf_cat === "C"; })
    }
    if(dataset ===  3) {
        ci = "ICI_score";
        processdata = data[dataset];
    }
    
    //organization, find bottom limit of fci/ici score, then increment by 1 up to 100. 
    var Scores= [];
    Scores.push(...new Set((processdata).map(a => a[ci])));
    Scores.sort(function(a, b) {return a - b;});
    //groupby region, then loop foreach Scores, ++ count on each score, push to output

    var Region = [];
    Region.push(...new Set((processdata.map(a => a.region))));

    var sortedData = processdata.sort(function(a, b) {return parseInt(a[ci]) - parseInt(b[ci]);})

    const regiongroup = Object.groupBy(sortedData, ({region}) => region);
    //output is Region: [Array],

    var RegInst = [];
    Region.forEach((e) => {
        var inst = Object.groupBy(regiongroup[e], ({installation}) => installation);
        
        var scorecounts = regiongroup[e].reduce((p, c) =>  {
            var score = c[ci];
            if (!p.hasOwnProperty(score)) {
                p[score] = 0;
            }
            p[score]++;
            return p;
        },{});

        var keys = Object.keys(scorecounts);
        keys.sort(function(a, b) {return a - b;});
        var scorecountssorted =[];
        
        for (i=0; i<keys.length; i++) {
            const k = keys[i];
            scorecountssorted.push({[k] : scorecounts[k]});
        }

        var scoreCountsObj = Object.keys(scorecounts).map(k => {
            return {label: k, data: scorecounts[k]};
        });

        var scoreoutput = [];
        
        Scores.forEach((k) => {        
            var checker = false;
            scoreCountsObj.forEach((i) => {    
                if(parseInt(k) === parseInt(i.label)) {
                    scoreoutput.push(i.data);
                    checker = true;
                }
                
            });
            if(checker === false) {
                scoreoutput.push(0);
            }
        });
        RegInst.push({"Region": e, "Installation": inst, "ScoreSorted": scoreoutput});
    });

    currentLevel = "Region";

    return [RegInst, Scores, ci, processdata];
}

//==========================================================================================================//

function clickthroughL1(dataset, scorelabels, stackChart, ci) {
    var InstOutput =  [];
    var tabledata = [];

    var InstallationData = Object.keys(dataset.Installation).map(k => {
        return {Installation: k, data: dataset.Installation[k]};
    });

    InstallationData.forEach((e) => {
        var scoreoutput = [];

        var scorecounts = e.data.reduce((p, c) =>  {
            var score = c[ci];
            if (!p.hasOwnProperty(score)) {
                p[score] = 0;
            }
            p[score]++;
            return p;
        },{});

        var scoreCountsObj = Object.keys(scorecounts).map(k => {
            return {label: k, "data": scorecounts[k]};
        });

        scorelabels.forEach((k) => {        
            var checker = false;
            scoreCountsObj.forEach((i) => {    
                if(parseInt(k) === parseInt(i.label)) {
                    scoreoutput.push(i.data);
                    checker = true;
                }
                
            });
            if(checker === false) {
                scoreoutput.push(0);
            }
        });

        tabledata.push(... e.data);
        InstOutput.push({"label": e.Installation, "data": scoreoutput, "rawdata": e.data});
    });
    currentLevel = "Installation";

    populateBarTable(tabledata, ci)

    stackChart.config.options.plugins.title.text += " / " + dataset.label;
    stackChart.config.data.datasets = InstOutput;
    stackChart.update();
}

//==========================================================================================================//
//create level 2/3 for drill down, look at assets
function clickthroughL2(dataset, scorelabels, stackChart, ci) {
    //group by op_activity, store asset names in label, change interact
    var output = [];
    var tabledata = [];
    var business_ops = [];
    business_ops.push(... new Set((dataset.rawdata).map(a => a.op_activity)));

    var processdata = Object.groupBy(dataset.rawdata, ({op_activity}) => op_activity);    

    business_ops.forEach((e) => {
        //console.log(processdata[e]);

        var scoreoutput = [];
        var assetData = [];
        var scorecounts = (processdata[e]).reduce((p, c) =>  {
            var score = c[ci];
            if (!p.hasOwnProperty(score)) {
                p[score] = 0;
            }
            p[score]++;
            return p;
        },{});

        var scoreCountsObj = Object.keys(scorecounts).map(k => {
            return {label: k, "data": scorecounts[k]};
        });

        scorelabels.forEach((k) => {        
            var checker = false;
            scoreCountsObj.forEach((i) => {    
                if(parseInt(k) === parseInt(i.label)) {
                    scoreoutput.push(i.data);
                    checker = true;

                    var filterdata =  (processdata[e]).filter( function (v) {return v[ci] == parseInt(i.label)})
                    var assets = [];

                    filterdata.forEach((q) => assets.push(q.asset_name));
                    assetData.push({"score": i.label, "assets": assets})
                }
                
            });
            if(checker === false) {
                scoreoutput.push(0);
            }
        });
        tabledata.push(...processdata[e]);
        output.push({"label": e, "data": scoreoutput, "rawdata": processdata[e], "assetdata": assetData});
    });

    populateBarTable(tabledata, ci);

    currentLevel = "Business Ops";

    stackChart.config.options.plugins.title.text += " / " + dataset.label;
    stackChart.config.data.datasets = output;
    stackChart.config.options.interaction = {intersect: true, mode: "nearest"}
    stackChart.update();
}
//need to filter FCI to CAT C, rename FCI to BCI on displays

//==========================================================================================================//
function populateBarTable (selectedData, ci) {
    //have pointer to div that contains table, destroy then repopulate
    document.getElementById("barTabContainer").remove();   
    var newDiv = document.createElement('div');
    newDiv.id = "barTabContainer";

    var newTable = document.createElement("table");
    newTable.id = "tableBarData";
    newTable.className = "";
    newDiv.appendChild(newTable);

    document.getElementById("barTableDiv").appendChild(newDiv);

    //create table and headers
    //region, installation, asset name, current score, q-rating
    var html = "";
    html += '<thead>\r\n';
        html += '<tr>\r\n';
            html+= '<th>Region</th>\r\n';
            html+= '<th>Installation</th>\r\n';
            html+= '<th>Fac #</th>\r\n';
            html+= '<th>Condition</th>\r\n';
            html+= '<th>Q-Rating</th>\r\n';
        html += '</tr>\r\n';
    html += '</thead>\r\n';
        
    $("#tableBarData").html(html);

    //pull via current condition index
    var qrlabel = "";
    if (ci === "fci") {
        qrlabel = "fci_q_rating";
    }
    if (ci === "ICI_score") {
        qrlabel = "ICI_Q_Rating";
    }


    $(document).ready(function () {
        $('#tableBarData').dataTable({
            data: selectedData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: "region"},
                {data: 'installation'},
                {data: 'fac_num'},
                {data: ci},
                {data: qrlabel}
            ],
        });
    });
}