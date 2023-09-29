//create datatables called via ID
function createCostTables(input){
    //MCCS Data Processing
    var data = input[0];
    var data2 = input[1];
    var data3 = input[2];
    var CatC = filter(data2, {naf_cat: 'C'});
    var Category = ['Category', 'naf_cat']; 
    var Region = ['Region', 'region'];
    var RegionC = ['Region', 'region'];
    var Installation = ['Installation', 'installation'];
    var InstallationC = ['Installation', 'installation'];
    var Program = ['Program', 'op_activity'];
    var CCNDesc = ['Use Category', 'use_desc'];
    var Asset = groupSumCount(data, ['op_activity','fac_use','facility_desc', 'asset_name']);

    Category.push([...new Set(data2.map(item => item.naf_cat))]);
    Region.push([...new Set(data2.map(item => item.region))]);
    RegionC.push([...new Set(data2.map(item => item.region))]);
    Installation.push([...new Set(data2.map(item => item.installation))]);
    InstallationC.push([...new Set(data2.map(item => item.installation))]);
    Program.push([...new Set(data2.map(item => item.op_activity))]);
    CCNDesc.push([...new Set(data2.map(item => item.use_desc))]);
    
    
    var CategoryData = createFSRM(data2, Category);
    var RegionData =  createFSRM(data2, Region);
    var RegionCData =  createFSRM(CatC, RegionC);
    var InstallationData = createFSRM2(data2, Installation);
    var InstallationCData = createFSRM2(CatC, Installation);
    var ProgramData = createFSRM(data2, Program);
    var CCNDescData = createFSRM(data2, CCNDesc);

    createChart (CategoryData, "CategoryChart", "Category");
    createChart (RegionData, "RegionChart", "Region");
    createChart (RegionCData, "RegionCChart", "Region");
    createChart (InstallationData, "InstallationChart", "Installation");
    createChart (InstallationCData, "InstallationCChart", "Installation");
    createChart (ProgramData, "ProgramChart", "Program");

    var CategoryTable = createTable(CategoryData);
    var RegionTable = createTable(RegionData);
    var RegionCTable = createTable(RegionCData);
    var InstallationTable = createTable(InstallationData);
    var ProgramTable = createTable(ProgramData);
    var CCNDescTable = createTable(CCNDescData);

    var numFormat = $.fn.dataTable.render.number('\,', '.', 0, '$' ).display;
    var numFormat2 = $.fn.dataTable.render.number('\,', '.', 0).display;
    var numFormat3 = $.fn.dataTable.render.number('\,', '.', 2, '$' ).display;

    //MCHS Data Processing
    var CategoryH = ['Category', 'naf_cat'];
    var RegionH = ['Region', 'region'];
    var InstallationH = ['Installation', 'installation'];
    CategoryH.push([...new Set(data3.map(item => item.naf_cat))]);
    RegionH.push([...new Set(data3.map(item => item.region))]);
    InstallationH.push([...new Set(data3.map(item => item.installation))]);
    var CategoryHData = createFSRM(data3, CategoryH);
    var RegionHData =  createFSRM(data3, RegionH);
    var InstallationHData = createFSRM2(data3, InstallationH);
    createChart (CategoryHData, "CategoryChartH", "Category");
    createChart (RegionHData, "RegionChartH", "Region");
    createChart (InstallationHData, "InstallationChartH", "Installation");
    var CategoryHTable = createTable(CategoryHData);
    var RegionHTable = createTable(RegionHData);
    var InstallationHTable = createTable(InstallationHData);


    $('#tabCat').html(CategoryTable);
    $(document).ready(function () {
        $('#tabCat').dataTable({
            data: CategoryData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
                
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                

                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabRegion').html(RegionTable);
    $(document).ready(function () {
        $('#tabRegion').dataTable({
            data: RegionData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabRegionC').html(RegionTable);
    $(document).ready(function () {
        $('#tabRegionC').dataTable({
            data: RegionCData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});

                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabInstallation').html(InstallationTable);
    $(document).ready(function () {
        $('#tabInstallation').dataTable({
            dom: "Bfrtip",
            buttons: [ 'copy', 'csv', 'excel'],
            data: InstallationData,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[4, 'desc']],
            columns: [
                {data: 'Installation'},
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                // var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                // var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                var sus = api.column(2, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(3, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(4, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(5, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM (Current Page)');
                $(api.column(2).footer()).html(numFormat(sus));
                $(api.column(3).footer()).html(numFormat(RM));
                $(api.column(4).footer()).html(numFormat(total));
                $(api.column(5).footer()).html(numFormat2(tsf));
                $(api.column(6).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabInstallationC').html(InstallationTable);
    $(document).ready(function () {
        $('#tabInstallationC').dataTable({
            dom: "Bfrtip",
            buttons: [ 'copy', 'csv', 'excel'],
            data: InstallationCData,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[4, 'desc']],
            columns: [
                {data: 'Installation'},
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                // var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                // var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                var sus = api.column(2, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(3, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(4, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(5, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM (Current Page)');
                $(api.column(2).footer()).html(numFormat(sus));
                $(api.column(3).footer()).html(numFormat(RM));
                $(api.column(4).footer()).html(numFormat(total));
                $(api.column(5).footer()).html(numFormat2(tsf));
                $(api.column(6).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabProgram').html(ProgramTable);
    $(document).ready(function () {
        $('#tabProgram').dataTable({
            data: ProgramData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Program'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabCCN').html(CCNDescTable);
    $(document).ready(function () {
        $('#tabCCN').dataTable({
            data: CCNDescData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Use Category'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                var numFormat = $.fn.dataTable.render.number('\,', '.', 0, '$' ).display;
                var numFormat2 = $.fn.dataTable.render.number('\,', '.', 0).display;

                
                $(api.column(0).footer()).html('Total FSRM (Current Page)');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
            
        
        });
    });


    //MCHS Table Create
    $('#tabCatH').html(CategoryHTable);
    $(document).ready(function () {
        $('#tabCatH').dataTable({
            data: CategoryHData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
                
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                

                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabRegionH').html(RegionHTable);
    $(document).ready(function () {
        $('#tabRegionH').dataTable({
            data: RegionHData,
            dom: "Bfrtip",
            buttons: ['copy', 'csv', 'excel'],
            paging: false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[3, 'desc']],
            columns: [
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM');
                $(api.column(1).footer()).html(numFormat(sus));
                $(api.column(2).footer()).html(numFormat(RM));
                $(api.column(3).footer()).html(numFormat(total));
                $(api.column(4).footer()).html(numFormat2(tsf));
                $(api.column(5).footer()).html(numFormat3(total/tsf));
            }
        });
    });

    $('#tabInstallationH').html(InstallationHTable);
    $(document).ready(function () {
        $('#tabInstallationH').dataTable({
            dom: "Bfrtip",
            buttons: [ 'copy', 'csv', 'excel'],
            data: InstallationHData,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            order: [[4, 'desc']],
            columns: [
                {data: 'Installation'},
                {data: 'Region'},
                {data: 'Sustainment',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'RM',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'Total',render: $.fn.dataTable.render.number(',', '.', 0, '$' )},
                {data: 'SqFt',render: $.fn.dataTable.render.number(',', '.', 0)},
                {data: 'Price per SqFt',render: $.fn.dataTable.render.number(',', '.', 2, '$' )}
            ],
            
        
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api();

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                // var sus = api.column(1).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var RM = api.column(2).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                // var total = api.column(3).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                // var tsf = api.column(4).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                var sus = api.column(2, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var RM = api.column(3, {page: 'current'}).data().reduce(function(a,b){return intVal(a) +intVal(b);});
                var total = api.column(4, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                var tsf = api.column(5, {page: 'current'}).data().reduce( function (a, b) {return intVal(a) + intVal(b);});
                
                $(api.column(0).footer()).html('Total FSRM (Current Page)');
                $(api.column(2).footer()).html(numFormat(sus));
                $(api.column(3).footer()).html(numFormat(RM));
                $(api.column(4).footer()).html(numFormat(total));
                $(api.column(5).footer()).html(numFormat2(tsf));
                $(api.column(6).footer()).html(numFormat3(total/tsf));
            }
        });
    });


}
function createQratingTables(input){
    var data = input;
    var totalQ = totalQcalc(data);
    function totalQcalc(dataset){    
    var counter1=0, counter2=0, counter3=0, counter4=0;
        var QRating=[];
            for(var i=0; i<dataset.length; i++){
                if(dataset[i].fci >= 90){
                        counter1++;
                    }
                if(dataset[i].fci < 90 && dataset[i].fci >= 80){
                        counter2++;
                    }
                if(dataset[i].fci < 80 && dataset[i].fci >= 60){
                        counter3++;
                    }
                if(dataset[i].fci < 60){
                        counter4++;
                    }
            }
            QRating = [counter1, counter2, counter3, counter4];
            return QRating;
    }
    document.getElementById('pq1').innerHTML = "<ul> <li>Q1: " + totalQ[0] + "</li><li> Q2: " + totalQ[1] + "</li><li>Q3: " + totalQ[2]+ "</li><li>Q4: " + totalQ[3] + "</li><ul>";

    var Category = ['Category', 'naf_cat'];
    var Region = ['Region', 'region'];
    var Program = ['Program', 'op_activity']; //Seperate by Category
    var Installation = ['Installation', 'installation'];

    Category.push([...new Set(data.map(item => item.naf_cat))]);
    Region.push([...new Set(data.map(item => item.region))]);
    Program.push([...new Set(data.map(item => item.op_activity))]);
    Installation.push([...new Set(data.map(item => item.installation))]);

    var CatQ = qfromfci(data,Category);
    var RegQ = qfromfci(data,Region);
    var ProQ = qfromfci(data,Program);
    var InsQ = qfromfci(data,Installation);

    var tableCatQ = createTablenf(CatQ);
    var tableRegQ = createTablenf(RegQ);
    var tableProQ = createTablenf(ProQ);
    var tableInsQ = createTablenf(InsQ);

    $('#tabCatQ').html(tableCatQ);
    $(document).ready(function () {
        $('#tabCatQ').dataTable({
            data: CatQ,
            paging: false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });

    $('#tabRegQ').html(tableRegQ);
    $(document).ready(function () {
        $('#tabRegQ').dataTable({
            data: RegQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Region'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });


    //Have to seperate by Category
    $('#tabProQ').html(tableProQ);   
    $(document).ready(function () {
        $('#tabProQ').dataTable({
            data: ProQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Program'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });

    $('#tabInsQ').html(tableInsQ);
    $(document).ready(function () {
        $('#tabInsQ').dataTable({
            data: InsQ,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Installation'},
                {data: 'QRating'},
                {data: 'Count'},
                {data: 'Percentage',render: $.fn.dataTable.render.number(',', '.', 2,'', '%')}
            ]
        });
    });
}
function createAgeTables(input){
    var data = input;
    var CleanData = qratingfromfci(data);
    function qratingfromfci(dataset){
        var arr = [];
        for(var i=0; i<dataset.length; i++){
            var qr = '';
            if(dataset[i].fci >= 90){
                qr = 'Q1';
            }
            if(dataset[i].fci < 90 && data[i].fci >= 80){
                qr = 'Q2';
            }
            if(dataset[i].fci < 80 && data[i].fci >= 60){
                qr = 'Q3';
            }
            if(dataset[i].fci < 60){
                qr = 'Q4';
            }
            arr.push({"Region": dataset[i].region, "Installation": dataset[i].installation, "Program": dataset[i].op_activity, "Use_Category": dataset[i].use_desc, "Category": dataset[i].naf_cat, "QRating": qr, "Age": getAge(dataset[i].build_dt)})
        }
        return arr;
    }
    var qFilter = ['QRating'];
    var catFilter = ['Category'];
    var regFilter = ['Region'];
    var proFilter = ['Program']; //Seperate by Category
    var insFilter = ['Installation'];
    var CCNFilter = ['Use_Category'];
    
    qFilter.push([...new Set(CleanData.map(item => item.QRating))])
    catFilter.push([...new Set(CleanData.map(item => item.Category))]);
    regFilter.push([...new Set(CleanData.map(item => item.Region))]);
    proFilter.push([...new Set(CleanData.map(item => item.Program))]);
    insFilter.push([...new Set(CleanData.map(item => item.Installation))]);
    CCNFilter.push([...new Set(CleanData.map(item => item.Use_Category))]);

    var qStats = calcStats(CleanData, qFilter);
    var catStats = calcStats(CleanData, catFilter);
    var regStats = calcStats(CleanData, regFilter);
    var proStats = calcStats(CleanData, proFilter);
    var insStats = calcStats(CleanData, insFilter);
    var CCNStats = calcStats(CleanData, CCNFilter);

    var tableQStats = createTablenf(qStats);
    var tableCatStats = createTablenf(catStats);
    var tableRegStats = createTablenf(regStats);
    var tableProStats = createTablenf(proStats);
    var tableInsStats = createTablenf(insStats);
    var tableCCNStats = createTablenf(CCNStats);

    $('#tabQStats').html(tableQStats);
    $(document).ready(function () {
        $('#tabQStats').dataTable({
            data: qStats,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'QRating'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });

    $('#tabCatStats').html(tableCatStats);
    $(document).ready(function () {
        $('#tabCatStats').dataTable({
            data: catStats,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Category'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });

    $('#tabRegStats').html(tableRegStats);
    $(document).ready(function () {
        $('#tabRegStats').dataTable({
            data: regStats,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Region'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });

    $('#tabInsStats').html(tableInsStats);
    $(document).ready(function () {
        $('#tabInsStats').dataTable({
            data: insStats,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Installation'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });

    $('#tabProStats').html(tableProStats);
    $(document).ready(function () {
        $('#tabProStats').dataTable({
            data: proStats,
            paging: false,
            "bLengthChange": false,
            "bFilter": false,
            "bInfo": false,
            columns: [
                {data: 'Program'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });

    $('#tabCCNStats').html(tableCCNStats);
    $(document).ready(function () {
        $('#tabCCNStats').dataTable({
            data: CCNStats,
            paging: true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            columns: [
                {data: 'Use_Category'},
                {data: 'Mean'},
                {data: 'Median'},
                {data: 'StandardDev'},
                {data: 'Minimum'},
                {data: 'Maximum'},
                {data: 'Range'}
            ]
        });
    });
}


//functions called by create___tables functions
function createFSRM(input, groupdata){	
    var data = input;
    var HN = groupdata[0];
    var k = groupdata[1];
    var arr = groupdata[2];
    function calcTotals (dataset, headerName, key, value){ //e.g. data, "Category", "naf_cat", {"A", "B", "C"}
        var result = [];
        for (var  j =0; j<value.length; j++){
            var SusTotal = 0;
            var RMTotal = 0;
            var TotalCost = 0;
            var FacSqFt =  0;
            var counter = 0;
            for (var i=0; i < dataset.length ; i++){
                if(dataset[i][key]=== value[j]){
                    SusTotal += parseFloat(dataset[i].sus);
                    RMTotal += parseFloat(dataset[i].RM_corrected);
                    FacSqFt += parseFloat(dataset[i].total_measure);
                    counter++;
                }
            }
            var Sus = Math.round(SusTotal);
            var RMT = Math.round(RMTotal);
            var TSF = Math.round(FacSqFt);
            TotalCost = Sus + RMT;
            var PPSF = 0;
            if (TSF>0){
                PPSF = TotalCost/TSF;
            }
            result.push({[headerName]: value[j], Sustainment: Sus, RM: RMT, Total: TotalCost,SqFt: TSF, 'Price per SqFt': PPSF});
        }
        return result;
    }
    var Output = calcTotals(data,HN,k,arr);
    
    return Output;
}

function createFSRM2(input, groupdata){	
    var data = input;
    var HN = groupdata[0];
    var k = groupdata[1];
    var arr = groupdata[2];
    function calcTotals (dataset, headerName, key, value){ //e.g. data, "Category", "naf_cat", {"A", "B", "C"}
        var result = [];
        for (var  j =0; j<value.length; j++){
            var reg = '';
            var SusTotal = 0;
            var RMTotal = 0;
            var TotalCost = 0;
            var FacSqFt =  0;
            var counter = 0;
            for (var i=0; i < dataset.length ; i++){
                if(dataset[i][key]=== value[j]){
                    SusTotal += parseFloat(dataset[i].sus);
                    RMTotal += parseFloat(dataset[i].RM_corrected);
                    FacSqFt += parseFloat(dataset[i].total_measure);
                    counter++;
                    reg = dataset[i].region;
                }
            }
            var Sus = Math.round(SusTotal);
            var RMT = Math.round(RMTotal);
            var TSF = Math.round(FacSqFt);
            TotalCost = Sus + RMT;
            var PPSF = 0;
            if (TSF>0){
                PPSF = TotalCost/TSF;
            }
            result.push({[headerName]: value[j], Region: reg, Sustainment: Sus, RM: RMT, Total: TotalCost,SqFt: TSF, 'Price per SqFt': PPSF});
        }
        return result;
    }
    var Output = calcTotals(data,HN,k,arr);
    
    return Output;
}



function filter(arr, criteria) { //e.g. data,{ "naf_cat", "C"}
    return arr.filter(function(obj) {
        return Object.keys(criteria).every(function(c) {
            return obj[c] == criteria[c];
        });
    });
}
function groupSumCount(input, filters) { //include summation of utilization and monetary values
    var data = input;
    const result = [...data.reduce((r,o)   =>{
        var key = o[filters[0]];
        for(var i=1; i<filters.length; i++) {
        key += '-' + o[filters[i]];
        }

        const item = r.get(key) || Object.assign ({},o,{});

        return r.set(key,item);
    }, new Map).values()];





    /*var k1 = filters[0];
    var k2 = filters[1];
    var k3 = filters[2];
    var k4 = filters[3];

    const result = [...data.reduce((r,o) =>{
        const key = o[k1] + '-' +o[k2]+ '-' +o[k3]+'-' +o[k4];

        const item = r.get(key) ||  Object.assign ({},o,{
        });


    return r.set(key,item);
    }, new Map).values()];
    console.log(result);*/
}
function qfromfci(data, filters){
    var output = [];
    var HN = filters[0];
    var k = filters[1];
    var arr =  filters[2];
   for(var j=0; j<arr.length; j++){
    var counter=0, counter1=0, counter2=0, counter3=0, counter4=0;
    var per1 = 0, per2=0, per3=0, per4=0;
        for(var i=0; i<data.length; i++){
            if(data[i][k] === arr[j]){
                if(data[i].fci >= 90){
                    counter1++;
                }
                if(data[i].fci < 90 && data[i].fci >= 80){
                    counter2++;
                }
                if(data[i].fci < 80 && data[i].fci >= 60){
                    counter3++;
                }
                if(data[i].fci < 60){
                    counter4++;
                }
                counter++;
            }
        }
        per1 = counter1/counter*100;
        per2 = counter2/counter*100;
        per3 = counter3/counter*100;
        per4 = counter4/counter*100;

        output.push({[HN]: arr[j], "QRating": "Q1", Count: counter1, Percentage: per1});
        output.push({[HN]: arr[j], "QRating": "Q2", Count: counter2, Percentage: per2});
        output.push({[HN]: arr[j], "QRating": "Q3", Count: counter3, Percentage: per3});
        output.push({[HN]: arr[j], "QRating": "Q4", Count: counter4, Percentage: per4});
    }
    return output;
}
function getAge(input){
    var today = new Date();
    var builddate = new Date(input);
    var age = today.getFullYear() - builddate.getFullYear();
    var  m = today.getMonth() - builddate.getMonth();
    if(m<0 || (m === 0 && today.getDate() < builddate.getDate())){
        age--;
    }
    return age;
}
function calcStats(input, arr) {
    var output  = [];
    var HN = arr[0];
    var k = arr[1];
    for(i=0; i<k.length; i++){
        var temp = [];
        for(j=0; j<input.length; j++){
            if(input[j][HN] === k[i] && input[j].Age > 0){
                temp.push(input[j].Age);
            }
        }
        function median(values){
            if(values.length ===0) throw new Error("No inputs");
          
            values.sort(function(a,b){
              return a-b;
            });
          
            var half = Math.floor(values.length / 2);
            
            if (values.length % 2)
              return values[half];
            
            return (values[half - 1] + values[half]) / 2.0;
        }
        function getStandardDeviation (array) {
            const n = array.length
            const mean = array.reduce((a, b) => a + b) / n
            return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        }
        var avg = Math.round(temp.reduce((a, b) => a + b, 0)/temp.length);
        var med = median(temp);
        var std = Math.round(getStandardDeviation(temp));
        var Min = Math.min(...temp);
        var Max = Math.max(...temp);
        var Rng = Max - Min;
        output.push({[HN]: k[i], Mean: avg, Median: med, StandardDev: std, Minimum: Min, Maximum: Max, Range: Rng});
    }
    return output;
}

//Table generators
function createTable(data) {
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
        html += '<th></th>\r\n'
        for (var i=1; i<t; i++) {
            html += '<th></th>\r\n';
        }
        html += '</tr>\r\n';
        html += '</tfoot>\r\n';
    }
    return html;
}
function createTablenf(data) {
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

function createChart (data, pointer, filter) {
    data.sort((a,b) => b.Total - a.Total );
    const ctx = document.getElementById(pointer);
    var label =[];
    var dataset = [];

    data.forEach(e => {
        label.push(e[filter]);
        dataset.push(e.Total);
    })

    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: label,
          datasets: [{
            label: filter,
            data: dataset,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}