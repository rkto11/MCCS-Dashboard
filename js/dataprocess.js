function goRPMProcess(Fac, Util, ICI) {
  var bar = document.getElementById("PB");
  var inflationinput = document.getElementById("inflationinput").value;
  var SelectedFY = document.getElementById("FYSelect").value;
  //init output arrays
  var FacOutput = [];
  var UtilOutput = [];
  var MCHSOutput = [];
  var MCHSFacOutput = [];
  var ICIOutput = [];
  var susTag = "FSM FY" + SelectedFY + " Sustainment Cost";
  let currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var inflation  = Math.pow(inflationinput,(2000 + parseInt(SelectedFY) - parseInt(currentYear))); 
  var barInterval = 1/Fac.length;
  var barWidth = 0;


  //Process Facilities Sheet, rename headers
  for (i=0; i<Fac.length; i++) {
    //convert to workable installation/region names
    var Region, Installation;
    for(j = 0; j<InstNameConversionTable.length; j++) {
        if(InstNameConversionTable[j]["MCCS Installation Name"] == Fac[i]["MCCS Installation Name"]) {
            Region = InstNameConversionTable[j].Region;
            Installation = InstNameConversionTable[j].Installation;
        }
    }

    //Calc FCI Q-Ratings
    var fci_q
    if(Fac[i]["iNFADS Facility Condition Index"]>=90) {
        fci_q = "Q1";
    }
    else if(Fac[i]["iNFADS Facility Condition Index"]>=80) {
        fci_q = "Q2";
    }
    else if(Fac[i]["iNFADS Facility Condition Index"]>=60) {
        fci_q = "Q3";
    }
    else {
        fci_q = "Q4";
    }

    //predominant facility use category for NAF CAT of Facility
    var pre = String(Fac[i]["iNFADS Preponderant User"]);
    var mccs_main_user;
    if (pre.includes("MCCS")) {
        mccs_main_user = "Y";
    }
    else {
        mccs_main_user = "N";
    }

    FacOutput.push({
        "region": Region, 
        "installation": Installation, 
        "RPUID": Fac[i]["iNFADS Real Property Unique ID"], 
        "fac_id": Fac[i]["iNFADS Facility ID"],
        "fac_num": Fac[i]["iNFADS Facility #"] + " " + Fac[i]["iNFADS Real Property Asset Name"], 
        "asset_name": Fac[i]["iNFADS Real Property Asset Name"],
        "mainCCN": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(0,5),
        "use_desc": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(6),
        "mainMCCSuse": mccs_main_user,
        "prv": parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0),
        "total_restoration": Math.round((100 - Fac[i]["iNFADS Facility Condition Index"])*parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0)/100),
        "fac_area_measure": Fac[i]["iNFADS Area"],
        "fac_area_unit_measure": Fac[i]["iNFADS Area Unit Measure Code"],
        "fci": Fac[i]["iNFADS Facility Condition Index"],
        "fci_q_rating": fci_q,
        "fci_dt": ExcelDateToJSDate(Fac[i]["iNFADS FCI Date"]),
        "build_dt": ExcelDateToJSDate(Fac[i]["iNFADS Facility Built Date"])
    });

    if (Fac[i]["iNFADS Predominant Design Use Catcode"].slice(0,5) === "74094") {
      MCHSFacOutput.push({
        "region": Region, 
        "installation": Installation, 
        "RPUID": Fac[i]["iNFADS Real Property Unique ID"], 
        "fac_id": Fac[i]["iNFADS Facility ID"],
        "fac_num": Fac[i]["iNFADS Facility #"] + " " + Fac[i]["iNFADS Real Property Asset Name"], 
        "asset_name": Fac[i]["iNFADS Real Property Asset Name"],
        "mainCCN": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(0,5),
        "use_desc": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(6),
        "naf_cat": "L(TDY)",
        "mainMCCSuse": mccs_main_user,
        "prv": parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0),
        "total_restoration": Math.round((100 - Fac[i]["iNFADS Facility Condition Index"])*parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0)/100),
        "fac_area_measure": Fac[i]["iNFADS Area"],
        "fac_area_unit_measure": Fac[i]["iNFADS Area Unit Measure Code"],
        "fci": Fac[i]["iNFADS Facility Condition Index"],
        "fci_q_rating": fci_q,
        "fci_dt": ExcelDateToJSDate(Fac[i]["iNFADS FCI Date"]),
        "build_dt": ExcelDateToJSDate(Fac[i]["iNFADS Facility Built Date"])
      })
    };

    if (Fac[i]["iNFADS Predominant Design Use Catcode"].slice(0,5) === "74020") {
      MCHSFacOutput.push({
        "region": Region, 
        "installation": Installation, 
        "RPUID": Fac[i]["iNFADS Real Property Unique ID"], 
        "fac_id": Fac[i]["iNFADS Facility ID"],
        "fac_num": Fac[i]["iNFADS Facility #"] + " " + Fac[i]["iNFADS Real Property Asset Name"], 
        "asset_name": Fac[i]["iNFADS Real Property Asset Name"],
        "mainCCN": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(0,5),
        "use_desc": Fac[i]["iNFADS Predominant Design Use Catcode"].slice(6),
        "naf_cat": "L(PCS)",
        "mainMCCSuse": mccs_main_user,
        "prv": parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0),
        "total_restoration": Math.round((100 - Fac[i]["iNFADS Facility Condition Index"])*parseFloat(Fac[i]["iNFADS Current PRV"] ?? 0)/100),
        "fac_area_measure": Fac[i]["iNFADS Area"],
        "fac_area_unit_measure": Fac[i]["iNFADS Area Unit Measure Code"],
        "fci": Fac[i]["iNFADS Facility Condition Index"],
        "fci_q_rating": fci_q,
        "fci_dt": ExcelDateToJSDate(Fac[i]["iNFADS FCI Date"]),
        "build_dt": ExcelDateToJSDate(Fac[i]["iNFADS Facility Built Date"])
      })
    }
    

    barWidth += (barInterval * 30);
    bar.style.width = barWidth + "%";

  }
    

  //Process Util, match Facility ID, have overall total number as well as sub arrays for multi utilizations for facilities for future use
  for (i=0; i<Util.length; i++) {
    if(Util[i]["iNFADS NAF Category"] === "" || Util[i]["iNFADS NAF Category"] === "N") continue;
    var other_um= Util[i]["iNFADS Alt Unit Meas"];
    if(!Util[i]["iNFADS Alt Unit Meas"]) {
        other_um = Util[i]["iNFADS Other Unit Meas"];
    }

    //pull op activity from use code
    var ccn, op_activity, nafcat;
    ccn = Util[i]["iNFADS Use Category Code"].slice(0,5);
    nafcat = Util[i]["iNFADS NAF Category"];
    op_activity = Util[i]["MCCS Business Program"] ?? "Misc";

    

    if(ccn == 74094) {
        nafcat = "L(TDY)";
    }
    if(ccn == 74020) {
        nafcat = "L(PCS)";
    }

    //Match to Facilities and pull Region/Installation/FCI?/PRV
    var Region, Installation, FCI, PRV, FacArea, FacAreaUM, FacNum, AssetName, FCIQ, FacCCN;
    var Fac_naf_cat = "";
    for (j=0; j<FacOutput.length; j++) {
      if(Util[i]["iNFADS Facility ID"] == FacOutput[j].fac_id) {
        Region = FacOutput[j].region;
        Installation = FacOutput[j].installation;
        FacNum = FacOutput[j].fac_num;
        AssetName = FacOutput[j].asset_name;
        FCI = FacOutput[j].fci;
        FCIQ = FacOutput[j].fci_q_rating;
        FacCCN = FacOutput[j].mainCCN;
        if(Util[i]["iNFADS Use Category Code"].slice(0,5) === FacCCN) {
            Fac_naf_cat = naf_cat;
        }
        PRV = parseFloat(FacOutput[j].prv);
        FacArea = parseFloat(FacOutput[j].fac_area_measure);
        FacAreaUM = FacOutput[j].fac_area_unit_measure;
      }
    }

    var total_measure = parseFloat(Util[i]["iNFADS Adq Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Area Measure"] ?? 0);
    var alt_total_measure = parseFloat(Util[i]["iNFADS Adq Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Alternate Measure"] ?? 0);
    var other_total_measure = parseFloat(Util[i]["iNFADS Adq Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Other Measure"] ?? 0);

    var rm = 0;
    if (FacArea > 0 && FacAreaUM == "SF") {
        rm = total_measure/FacArea*PRV*.025*inflation;
    }
    else {
        rm = PRV*.025*inflation;
    }

    var FSRM = Math.round(parseFloat(Util[i][susTag] ?? 0) + Math.round(rm));
    var calc_prv = Math.round(rm/inflation/0.025);
    var total_restoration = Math.round((100-FCI)*calc_prv/100);

    //Checks following coloumns to ensure that these are MCCS utilizations, GoRPM does not accurately narrow down to MCCS acitivities
    var UAUIC = String(Util[i]["iNFADS User Activity UIC"]);
    var FacUse = String(Util[i]["iNFADS Facility Use"]);
    var iNFADSNafCat = String(Util[i]["iNFADS NAF Category"]);
    var CCNcombined = String(Util[i]["iNFADS Use Category Code"]);

    if(nafcat === "A" || nafcat === "B" || nafcat === "C") {
        UtilOutput.push({
            "region": Region,
            "installation": Installation,
            "RPUID": Util[i]["iNFADS Real Property Unique ID"], 
            "fac_id": Util[i]["iNFADS Facility ID"],
            "fac_num": FacNum,
            "asset_name": AssetName,
            "use_code": Util[i]["iNFADS Use Category Code"].slice(0,5),
            "use_desc": Util[i]["iNFADS Use Category Code"].slice(6),
            "fac_use": Util[i]["iNFADS Facility Use"],
            "op_activity": op_activity,
            "facility_desc": Util[i]["iNFADS DoD FAC Code"].slice(5),
            "naf_cat": nafcat,
            "fci": FCI ?? 0,
            "fci_q_rating": FCIQ,
            "total_measure": parseFloat(Util[i]["iNFADS Adq Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Area Measure"] ?? 0),
            "alt_total_measure": parseFloat(Util[i]["iNFADS Adq Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Alternate Measure"] ?? 0),
            "other_total_measure": parseFloat(Util[i]["iNFADS Adq Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Other Measure"] ?? 0),
            "other_unit_measure": other_um,
            "sus": Math.round(parseFloat(Util[i][susTag] ?? 0)),
            "RM_corrected": Math.round(rm),
            "total_restoration": parseFloat(total_restoration ?? 0),
            "FSRM": FSRM,
            "prv": calc_prv,
            "count": 1
        });
    }
    if(UAUIC.includes("MCHS") && (ccn == 74020 || ccn == 74094)) {
      MCHSOutput.push({
        "region": Region,
        "installation": Installation,
        "RPUID": Util[i]["iNFADS Real Property Unique ID"], 
        "fac_id": Util[i]["iNFADS Facility ID"],
        "use_code": Util[i]["iNFADS Use Category Code"].slice(0,5),
        "use_desc": Util[i]["iNFADS Use Category Code"].slice(6),
        "fac_use": Util[i]["iNFADS Facility Use"],
        "op_activity": op_activity,
        "facility_desc": Util[i]["iNFADS DoD FAC Code"].slice(5),
        "naf_cat": nafcat,
        "fci": FCI,
        "total_measure": parseFloat(Util[i]["iNFADS Adq Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Area Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Area Measure"] ?? 0),
        "alt_total_measure": parseFloat(Util[i]["iNFADS Adq Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Alternate Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Alternate Measure"] ?? 0),
        "other_total_measure": parseFloat(Util[i]["iNFADS Adq Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Sub Other Measure"] ?? 0) + parseFloat(Util[i]["iNFADS Iadq Other Measure"] ?? 0),
        "other_unit_measure": other_um,
        "sus": parseFloat(Util[i][susTag] ?? 0),
        "RM_corrected": rm
      });
    }
  }

  //Array joins
  var df_final = [];
  var total_utils = 0;
  for (i=0; i<FacOutput.length; i++) {
    var FacilityID = FacOutput[i].fac_id;
    var naf_cat_array = [];
    var total_measure_sum = 0;
    var alt_total_measure_sum = 0;
    var other_total_measure_sum = 0;
    var sus_sum = 0;
    var rm_sum = 0;
    var total_restoration_sum = 0;
    var FSRM = 0;
    var facility_utilizations = [];
    var facility_utilizations_count = 0;
    var naf_cat, op_activity;

    for (j = 0; j<UtilOutput.length; j++) {
      if (UtilOutput[j].fac_id == FacilityID) {
        naf_cat_array.push(UtilOutput[j].naf_cat);
        total_measure_sum += parseFloat(UtilOutput[j].total_measure ?? 0);
        alt_total_measure_sum += UtilOutput[j].alt_total_measure;
        other_total_measure_sum += UtilOutput[j].other_total_measure;
        sus_sum += UtilOutput[j].sus;
        rm_sum += UtilOutput[j].RM_corrected;
        total_restoration_sum += UtilOutput[j].total_restoration;
        FSRM += UtilOutput[j].FSRM;

        //Checker for overall Facility NAF_Category, check for Predominant user is MCCS, if not, then take Util naf_cat
        if(FacOutput[i].mainMCCSuse === "Y"  &&  FacOutput[i].mainCCN === UtilOutput[j].use_code){
            naf_cat = UtilOutput[j].naf_cat;
        }
        else if(FacOutput[i].mainMCCSuse === "N")  {
            naf_cat = UtilOutput[j].naf_cat;
        }
        
        facility_utilizations.push(UtilOutput[j]);
        facility_utilizations_count++;
        total_utils++;
      }
    }

      

      if(facility_utilizations_count>0) {
      df_final.push({...FacOutput[i], 
        "total_measure":total_measure_sum, 
        "alt_total_measure":alt_total_measure_sum, 
        "other_total_measure":other_total_measure_sum, 
        "naf_cat": naf_cat,
        "sus": sus_sum, 
        "RM_corrected": rm_sum,
        "total_restoration": total_restoration_sum ?? 0,
        "FSRM": FSRM,
        "count": facility_utilizations_count, 
        "Utilizations": facility_utilizations});
      }
  }

  //Filter Facilities w/ MCHS Utils
  var MCHSFacID = [];
  MCHSFacID.push([...new Set(MCHSOutput.map(item => item.fac_id))]);  
 
  //ICIs
  for(i=0; i<ICI.length; i++) {
      var ICIScore, ICIQ;
      if (ICI[i]["Interior Condition Index for the facility"] === "INCOMPLETE" || ICI[i]["Interior Condition Index for the facility"] === "NA" || ICI[i]["Interior Condition Index for the facility"] === "#DIV/0!") {
          ICIScore = 0;
          ICIQ = "Invalid"
      }
      else {
          ICIScore = parseInt(ICI[i]["Interior Condition Index for the facility"]);
          if(ICIScore>=90) {
              ICIQ = "Q1";
          }
          else if(ICIScore>=80) {
              ICIQ = "Q2";
          }
          else if(ICIScore>=60) {
              ICIQ = "Q3";
          }
          else if(ICIScore<0) {
              ICIQ = "Q4";
          }
          else {
              ICIQ = "Invalid"
          }
      }

      var Region, Installation, PRV, FacArea, FacAreaUM, FacNum, AssetName, FCIQ, naf_cat, visit_date;
      for (j=0; j<df_final.length; j++) {
          if(ICI[i]["iNFADS Facility ID"] == df_final[j].fac_id) {
              Region = df_final[j].region;
              Installation = df_final[j].installation;
              FacNum = df_final[j].fac_num;
              AssetName = df_final[j].asset_name;
              FCIQ = parseInt(df_final[j].fci_q_rating);
              PRV = parseFloat(df_final[j].prv);
              FacArea = parseFloat(df_final[j].fac_area_measure);
              FacAreaUM = df_final[j].fac_area_unit_measure;
              naf_cat = df_final[j].naf_cat;
              visit_date = ExcelDateToJSDate(ICI[i]["Visit Date"]).getFullYear();
          }
      }
      ICIOutput.push({
          "region": Region,
          "installation": Installation,
          "fac_num": FacNum,
          "asset_name": AssetName,
          "ICI_score": ICIScore,
          "ICI_Q_Rating": ICIQ,
          "naf_cat": naf_cat,
          "visit_date": visit_date
      });
  }

  return [df_final, UtilOutput, MCHSOutput, ICIOutput, MCHSFacOutput];
}
//=========================================== Utilization vs Profitability ==========================================

function processUtilProf (data) {
  //Separate by Cost Center Code
  //map CC
  var CostCenterDesc = [];
  CostCenterDesc.push(...new Set(data.map(item => item["Cost Center Description"])));

  var output = [];
  for(i=0; i<CostCenterDesc.length; i++) {
    var subarray = [];
    var Cost_Center = "";
    for(j=0; j<data.length; j++) {
      if(data[j]["Cost Center Description"] === CostCenterDesc[i]) {
        Cost_Center = data[j].Cost_Center;
        subarray.push({"Company": data[j].Company, "ADUtilPercent": data[j].ADUtilPercent, "ProfPercentage": data[j].ProfPercentage});
      }
    }
    output.push({"Cost_Center": Cost_Center, "CCDesc": CostCenterDesc[i], "UtilProfData": subarray});
  }

  let ct = document.getElementById("UtilProfContainer");

  let html = "<h1 style='padding-top: 20px; text-align:center;'>MCCS Profit vs Utilization</h1>"
  output.forEach(e => {
    html += "<div class='" + e.Cost_Center + "' style='padding-top:10px'><h3>" + e.Cost_Center + " " + e.CCDesc + "</h3>" 
    + "<canvas id='" + e.Cost_Center + "'></canvas>"
    + "<table id='" + e.Cost_Center + "table'>"
    +"<thead><tr><th>Company</th><th>Percent Use by Active Duty</th><th>Percent Net Profit</th></tr></thead></table>"
    + "<hr></div>";
  });
  ct.innerHTML = html;

  

  output.forEach(e => {
    //create Chart
    const ctx = document.getElementById(e.Cost_Center);
    var data = e.UtilProfData;

    var input = [];

    data.forEach(element => {
      input.push({'label': element.Company, 'data': [{"x": parseFloat(element.ADUtilPercent), "y": parseFloat(element.ProfPercentage)}]})
    })

    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: input
      },
      options: {
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });

    //create Table
    var reference = '#' + e.Cost_Center + 'table';
    $(document).ready(function () {
      $(reference).dataTable({
          data: data,
          dom: "Bfrtip",
          buttons: ['copy', 'csv', 'excel'],
          paging: false,
          order: [[2, 'desc']],
          "bLengthChange": false,
          "bFilter": false,
          "bInfo": false,
          columns: [
              {data: 'Company'},
              {data: 'ADUtilPercent',render: $.fn.dataTable.render.number(',', '.', 2, '', '%' )},
              {data: 'ProfPercentage',render: $.fn.dataTable.render.number(',', '.', 2, '', '%' )}
          ]
        });
      });
  });
}

//============================================================================================//
function lowQRating (data) {
    var fac = data[0];
    var Utildata = data[1];
    var ICIdata  = data[3];


    //Facilities FCI
    var cat = {};
    var naf_cat_totals = fac.reduce(function(r,o) {
        var key = o.naf_cat;
        if(!(key in cat)) {
            cat[key] = 1;
        }
        else {
            cat[key]++;
        }
        return cat;
    }, []);

    var totalQ3Q4 = naf_cat_totals.A + naf_cat_totals.B + naf_cat_totals.C;
    var overallHTML = "<h3>Total Facilities by NAF Category</h3><p>A: " + naf_cat_totals.A + "</p><p>B: " + naf_cat_totals.B + "</p><p>C: " + naf_cat_totals.C + "</p><p>Total Facilities: " + fac.length + "</p>";

    let outdiv = document.getElementById("qroverall");

    var helper = {};
    var result = fac.reduce(function(r, o) {
        var key = o.naf_cat + '-' + o.fci_q_rating;
        
        if(!helper[key]) {
            helper[key] = Object.assign({}, {"naf_cat": o.naf_cat, "Q_Rating": o.fci_q_rating, "total": 1}); // create a copy of o
            r.push(helper[key]);
        } else {
            helper[key].total++;
        }

        return r;
    }, []);

    result.sort(function(a, b) {
        var textA = a.naf_cat + a.Q_Rating;
        var textB = b.naf_cat + b.Q_Rating;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    

    overallHTML += "<h3>FCI Categories by Q-Rating</h3>"

    result.forEach(e => {
        overallHTML += "<p>" + e.naf_cat + " / " + e.Q_Rating + ": " + e.total + "</p>";
    });


    //Utilization FCI
    var helper2 = {};
    var Utilresult = Utildata.reduce(function(r, o) {
        var key = o.naf_cat + '-' + o.fci_q_rating;
        
        if(!helper2[key]) {
            helper2[key] = Object.assign({}, {"naf_cat": o.naf_cat, "Q_Rating": o.fci_q_rating, "total": 1}); // create a copy of o
            r.push(helper2[key]);
        } else {
            helper2[key].total++;
        }

        return r;
    }, []);

    Utilresult.sort(function(a, b) {
        var textA = a.naf_cat + a.Q_Rating;
        var textB = b.naf_cat + b.Q_Rating;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });


    //ICI Processing
    var ICIQ1 = 0;
    var ICIQ2 = 0;
    var ICIQ3 = 0;
    var ICIQ4 = 0;
    var ICIQInvalid = 0;

    for(i=0; i<ICIdata.length; i++) {
        if(ICIdata[i].ICI_Q_Rating === "Q1") {
            ICIQ1++;
        }
        else if(ICIdata[i].ICI_Q_Rating === "Q2") {
            ICIQ2++;
        }
        else if(ICIdata[i].ICI_Q_Rating === "Q3") {
            ICIQ3++;
        }
        else if(ICIdata[i].ICI_Q_Rating === "Q4") {
            ICIQ4++;
        }
        else {
            ICIQInvalid++;
        }
    }

    overallHTML += "<h3>ICI Q-Ratings</h3><p>Q1: " + ICIQ1 +"</p><p>Q2: " + ICIQ2 + "</p><p>Q3: " + ICIQ3 + "</p><p>Q4: " + ICIQ4 + "</p><p>Incomplete/Invalid: " + ICIQInvalid + "</p><p>Total ICIs in GoRPM: " + ICIdata.length + "</p>";

    outdiv.innerHTML  = overallHTML;



    var helper3 = {};
    var ICIPlanning = ICIdata.reduce(function(r, o) {
        var key =+ o.naf_cat + '-' + o.ICI_Q_Rating;
        
        if(!helper3[key]) {
            helper3[key] = Object.assign({}, {"naf_cat": o.naf_cat, "Q_Rating": o.ICI_Q_Rating, "total": 1}); // create a copy of o
            r.push(helper3[key]);
        } else {
            helper3[key].total++;
        }
        return r;
    }, []);

    ICIPlanning.sort(function(a, b) {
        var textA = a.naf_cat + a.Q_Rating;
        var textB = b.naf_cat + b.Q_Rating;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}

function ExcelDateToJSDate(serial) {
  var utc_days  = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;                                        
  var date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

const InstNameConversionTable = [
  {
    "MCCS Installation Name": "M00146 MCAS CHERRY POINT NC",
    "Installation": "MCAS Cherry Point",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M00243 MARCORPRCUITDEP SAN DIEGO CA",
    "Installation": "MCRD San Diego",
    "Region": "SLTI"
  },
  {
    "MCCS Installation Name": "M00263 MCRD BEAUFORT PI SC",
    "Installation": "MCRD PI",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M00264 MARINE CORPS BASE QUANTICO VA",
    "Installation": "MCB Quantico",
    "Region": "MCINCR"
  },
  {
    "MCCS Installation Name": "M00318 MCB HAWAII KANEOHE",
    "Installation": "MCB Hawaii",
    "Region": "MCIPAC"
  },
  {
    "MCCS Installation Name": "M00681 MCB CAMP PENDLETON CA",
    "Installation": "MCB Pendleton",
    "Region": "MCIWEST"
  },
  {
    "MCCS Installation Name": "M09036 CAMP ALLEN",
    "Installation": "Camp Allen",
    "Region": "MCINCR"
  },
  {
    "MCCS Installation Name": "M20810 CAMP MUJUK REPUBLIC OF KOREA",
    "Installation": "Camp Mujuk",
    "Region": "MCIPAC"
  },
  {
    "MCCS Installation Name": "M60169 MCAS BEAUFORT SC",
    "Installation": "MCAS Beaufort",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M62204 MCLB BARSTOW CA",
    "Installation": "MCLB Barstow",
    "Region": "MCIWEST"
  },
  {
    "MCCS Installation Name": "M62573 MCAS NEW RIVER JAX NC",
    "Installation": "MCAS New River",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M62613 MCAS IWAKUNI JA",
    "Installation": "MCAS Iwakuni",
    "Region": "MCIPAC"
  },
  {
    "MCCS Installation Name": "M62974 MCAS YUMA AZ",
    "Installation": "MCAS Yuma",
    "Region": "MCIWEST"
  },
  {
    "MCCS Installation Name": "M64495 MARCORPSMWTC BRIDGEPORT CA",
    "Installation": "MWTC Bridgeport",
    "Region": "SLTI"
  },
  {
    "MCCS Installation Name": "M67001 MCB CAMP LEJEUNE NC",
    "Installation": "MCB Lejeune",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M67004 MCLB ALBANY GA",
    "Installation": "MCLB Albany",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M67011 MARCORPS DIST 1 GARDEN CITY NY",
    "Installation": "Garden City",
    "Region": "NONE"
  },
  {
    "MCCS Installation Name": "M67029 MARBKS WASHINGTON DC",
    "Installation": "MBW (8th & I)",
    "Region": "MCINCR"
  },
  {
    "MCCS Installation Name": "M67386 MCSPTACT KANSAS CITY MO",
    "Installation": "Kansas City",
    "Region": "NONE"
  },
  {
    "MCCS Installation Name": "M67399 MCAGCC TWENTYNINE PALMS CA",
    "Installation": "MCAGCC 29 Palms",
    "Region": "SLTI"
  },
  {
    "MCCS Installation Name": "M67400 MCB CAMP S D BUTLER OKINAWA JA",
    "Installation": "MCB Butler",
    "Region": "MCIPAC"
  },
  {
    "MCCS Installation Name": "M67695 MCSF BLOUNT ISLAND",
    "Installation": "MCSF Blount Island",
    "Region": "MCIEAST"
  },
  {
    "MCCS Installation Name": "M67861 MARCORRESFOR NEW ORLEANS LA",
    "Installation": "MARFORRES",
    "Region": "NONE"
  },
  {
    "MCCS Installation Name": "M67604 MCAS CAMP PENDLETON CA",
    "Installation": "MCAS Pendleton",
    "Region": "MCIWEST"
  },
  {
    "MCCS Installation Name": "M68479 HDQTRS 4TH MARDIV NEW ORLEANS",
    "Installation": "4th MARDIV",
    "Region": "NONE"
  },
  {
    "MCCS Installation Name": "M67865 MCAS MIRAMAR",
    "Installation": "MCAS Miramar",
    "Region": "MCIWEST"
  }
];
