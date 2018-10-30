var allExpenses = [];
var expTableName = "";
var allDetailValues = "";
var tableID = "";
(!!baseCurrency) ? baseCurrency : "";
function getApplicantSectionDetails() {
    var applicantDetails = "";
    var lbl = "";
    var val = "";
    var Txt = "";
    var Valu = "";
    applicantDetails = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldApplicantDetails"] + "</td></tr></tbody></table>";
    applicantDetails += "<table border='0' width='50%' style='border-collapse:collapse;float:left;margin-bottom:20px;' class='tabledisplay'><tbody>";


    $("#generalDtls").find(".app_table").find(".header_section1").find("li").each(function () {
        lbl = $(this).find("label").text();
        val = $(this).find("span>*").is("span") ? $(this).find("span>*").text() : $(this).find("span>*").val();
        applicantDetails += "<tr style='width:100%;'><td colspan='1'>" + lbl + "</td><td colspan='2'>" + val + "</td></tr>";
    })
    applicantDetails += "</tbody></table><table border='0' width='50%' style='border-collapse:collapse;float:left;' class='tabledisplay tblbdr'><tbody>";
    $("#generalDtls").find(".app_table").find(".header_section2").find("li").each(function () {
        lbl = $(this).find("label").text();
        Txt = !!$(this).find("span>*").text() ? $(this).find("span>*").text() : "";
        Valu = !!$(this).find("span>*").val() ? $(this).find("span>*").val() : "";
        val = $(this).find("span>*").is("span") ? Txt : Valu;
        applicantDetails += "<tr style='width:100%;'><td colspan='1'>" + lbl + "</td><td colspan='2'>" + val + "</td></tr>";
    })

    return applicantDetails + "</tbody></table>"
}
function getApplicantSectionLessDetails() {
    var applicantDetails = "";
    var lbl = "";
    var val = "";
    //var headerString = framePanel("Applicant Details");
    applicantDetails = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody>";
    applicantDetails += "<tr height='30'><td colspan='4' class='LabelText'>Applicant Details</td></tr>";
    applicantDetails += "<tr;'><td colspan='1'>Name in Passport</td><td colspan='3'>" + $.trim($("#idlblPassportName").text()) + "</td></tr>";
    applicantDetails += "<tr><td colspan='1'> Name of the Applicant</td><td colspan='3'>" + $.trim($("#idlblApplicantName").text()) + "</td></tr>";
    //var staffStatus = $("input[fldTitle='hdnddlStaffStatus']").val();
    //staffStatus = ((staffStatus) == undefined || (staffStatus) == "" ? "" : staffStatus);
    var staffGrade = $("input[fldTitle='hdnStaffGrade']").val();
    staffGrade = ((staffGrade) == undefined || (staffGrade) == "" ? "" : staffGrade);
    var ChrgToPC = $("input[fldTitle='hdnChargeToPC']").val() == undefined || $("input[fldTitle='hdnChargeToPC']").val() == "Select" || $("input[fldTitle='hdnChargeToPC']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPC']").val();
    var ChrgToPCDisp = $("input[fldTitle='hdnChargeToPCDisplay']").val() == undefined || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "Select" || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPCDisplay']").val();
    applicantDetails += "<tr><td style='width:25%'> Division </td><td style='width:25%'>" + $.trim($("#idlblDivName").text()) + "</td><td style='width:25%' >Department / Section</td><td style='width:25%'>" + $.trim($("#idlblDeptName").text()) + " / " + ChrgToPC + "</td></tr>"; //combined division & dept.
    applicantDetails += "<tr><td>Staff Grade</td><td>" + staffGrade + "</td><td>Charge To PC</td><td>" + ChrgToPCDisp + "</td></tr>"; //combined both staff grade & charge to display
    if ($("input[fldTitle='hdnNonAPACRegionReq']").val() == "Yes") {
        var NonAPACReg = $("*[fldtitle=NonAPACRegion]").find("input[type=radio]:checked").val();
        NonAPACReg = ((NonAPACReg) == undefined || (NonAPACReg) == "" ? "" : NonAPACReg);
        applicantDetails += "<tr><td colspan='2'>Non-APAC Region<small>(Europe, China, Hong Kong,Taiwan, Korea, USA, Japan & Latin America.)</small></td><td colspan='2'>" + NonAPACReg + "</td></tr>";
    }
    applicantDetails += "</tbody></table>"
    return applicantDetails;
    //return headerString + applicantDetails + "</div></div></div>";
}

function getBasicTravelInfo() {
    if ($("input[fldTitle='hdnUrgentTripAllowed']").val() == "Yes") {
        var urgTrip = $("*[fldtitle=UrgentTrip]").find("input[type=radio]:checked");
        urgTrip = urgTrip.val()
        if (urgTrip == undefined || urgTrip == "")
            urgTrip = " - ";
        else
            urgTrip;
    }
    var BasicInfo = "";
    BasicInfo += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldTravelDetails"] + "</td></tr></tbody></table>"
    BasicInfo += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:0px;' class='tabledisplay'>";
    BasicInfo += "<thead><tr><<HEADER>></tr></thead>"
    BasicInfo += "<tr><tbody>";
    var tblHeader = "";
    if ($("input[fldTitle='hdnUrgentTripAllowed']").val() == "Yes") {
        //tblHeader += "<th>Urgent Trip</th>";
        tblHeader += "<th>" + langArray["fldDayTrip"] + "</th>";
        BasicInfo += "<td>" + urgTrip + "</td>";
    }
    var ClsOfTrvel = $("input[fldTitle='hdnClassOfTravel']").val() == undefined || $("input[fldTitle='hdnClassOfTravel']").val() == "Select" || $("input[fldTitle='hdnClassOfTravel']").val() == "" ? "" : $("input[fldTitle='hdnClassOfTravel']").val();
    //tblHeader += "<th>Class Of Travel</th>";
    tblHeader += "<th>" + langArray["fldClassOfTravel"] + "</th>";
    BasicInfo += "<td>" + ClsOfTrvel + "</td>";
    var TrvType = $("input[fldTitle='hdnTravelType']").val() == undefined || $("input[fldTitle='hdnTravelType']").val() == "Select" || $("input[fldTitle='hdnTravelType']").val() == "" ? "" : $("input[fldTitle='hdnTravelType']").val();
    //tblHeader += "<th>Travel Type</th>";
    tblHeader += "<th>" + langArray["fldTravelType"] + "</th>";
    BasicInfo += "<td>" + TrvType + "</td>";
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        var BudType = $("input[fldTitle='hdnBudgetType']").val() == undefined || $("input[fldTitle='hdnBudgetType']").val() == "Select" || $("input[fldTitle='hdnBudgetType']").val() == "" ? "" : $("input[fldTitle='hdnBudgetType']").val();
        //tblHeader += "<th>Budget Type</th>";
        tblHeader += "<th>" + langArray["fldBudgetType"] + "</th>";
        BasicInfo += "<td>" + BudType + "</td>";
    }
    tblHeader += "<th>" + langArray["fldTravellingTo"] + "</th>";
    BasicInfo += "<td>" + TravellingTo + "</td>";
    if ($("input[fldTitle='hdnTravelNationsReq']").val() == "Yes") {
        var TravelArea = $("input[fldTitle='hdnTravelNations']").val() == undefined || $("input[fldTitle='hdnTravelNations']").val() == "Select" || $("input[fldTitle='hdnTravelNations']").val() == "" ? "" : $("input[fldTitle='hdnTravelNations']").val();
        // tblHeader += "<th>Travel Area</th>";
        tblHeader += "<th>" + langArray["fldTravelArea"] + "</th>";
        BasicInfo += "<td>" + TravelArea + "</td>";
    }
    var ChrgToPC = $("input[fldTitle='hdnChargeToPCDisplay']").val() == undefined || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "Select" || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPCDisplay']").val();
    //tblHeader += "<th>Charge To PC</th>";
    tblHeader += "<th>" + langArray["fldChargetoPC"] + "</th>";
    BasicInfo += "<td>" + ChrgToPC + "</td>";
    //if (hdnProjectCodeProductCode == "Yes") {
    //    var ProdCode = $("input[fldTitle='hdnProductCodeDisplay']").val() == undefined || $("input[fldTitle='hdnProductCodeDisplay']").val() == "Select" || $("input[fldTitle='hdnProductCodeDisplay']").val() == "" ? "" : $("input[fldTitle='hdnProductCodeDisplay']").val();
    //    tblHeader += "<th>Product Code</th>";
    //    BasicInfo += "<td>" + ProdCode + "</td>";
    //    var ProjCode = $("input[fldTitle='hdnProjectCodeDisplay']").val() == undefined || $("input[fldTitle='hdnProjectCodeDisplay']").val() == "Select" || $("input[fldTitle='hdnProjectCodeDisplay']").val() == "" ? "" : $("input[fldTitle='hdnProjectCodeDisplay']").val();
    //    tblHeader += "<th>Project Code</th>";
    //    BasicInfo += "<td>" + ProjCode + "</td>";
    //}
    if ($("input[fldTitle='hdnGLCodeReq']").val() == "Yes") {
        var GLCode = ($("input[fldTitle='txtGLCode']").val()) == undefined || ($("input[fldTitle='txtGLCode']").val()) == "" ? "" : $("input[fldTitle='txtGLCode']").val();
        //tblHeader += "<th>GL Code</th>";
        tblHeader += "<th>" + langArray["fldGLCode"] + "</th>";
        BasicInfo += "<td>" + GLCode + "</td>";
    }
    BasicInfo += "</tbody></tr>";
    BasicInfo = BasicInfo.replace("<<HEADER>>", tblHeader);
    BasicInfo += "</table>";
    if ($("input[fldTitle='hdnNonAPACRegionReq']").val() == "Yes") {
        var NonAPACReg = $("*[fldtitle=NonAPACRegion]").find("input[type=radio]:checked").val();
        NonAPACReg = ((NonAPACReg) == undefined || (NonAPACReg) == "" ? "" : NonAPACReg);
        BasicInfo += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:0px; border-top: 0px #000 solid;' class='tabledisplay'>";
        BasicInfo += "<tr><th style='width:50%;text-align:left'>" + langArray["fldNonApacRegion"] + "<small>(Europe, China, Hong Kong,Taiwan, Korea, USA, Japan & Latin America.)</small></th><td  style='width:50%;'>" + NonAPACReg + "</td></tr>";
        BasicInfo += "</table>";
    }
    return BasicInfo;
}
function getBasicTravelLessInfo() {
    var BasicInfo = "";
    var preDetails = "";
    BasicInfo += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><thead>";
    //var tblHeader = "";
    BasicInfo += "<tr height='30'><td colspan='4' class='LabelText'>Application Details</td></tr>";
    BasicInfo += "<tr><td class='LabelText'>" + langArray["fldClassOfTravel"] + "</td><td class='LabelText'>" + langArray["fldTravelType"] + "</td><td class='LabelText'>Travelling To</td><td class='LabelText'>Travel Area</td></thead>"
    var ClsOfTrvel = $("input[fldTitle='hdnClassOfTravel']").val() == undefined || $("input[fldTitle='hdnClassOfTravel']").val() == "Select" || $("input[fldTitle='hdnClassOfTravel']").val() == "" ? "" : $("input[fldTitle='hdnClassOfTravel']").val();
    var TrvType = $("input[fldTitle='hdnTravelType']").val() == undefined || $("input[fldTitle='hdnTravelType']").val() == "Select" || $("input[fldTitle='hdnTravelType']").val() == "" ? "" : $("input[fldTitle='hdnTravelType']").val();
    if ($("input[fldTitle='hdnTravelNationsReq']").val() == "Yes") {
        var TravelArea = $("input[fldTitle='hdnTravelNations']").val() == undefined || $("input[fldTitle='hdnTravelNations']").val() == "Select" || $("input[fldTitle='hdnTravelNations']").val() == "" ? "" : $("input[fldTitle='hdnTravelNations']").val();
    }
    BasicInfo += "<tbody><tr><td>" + ClsOfTrvel + "</td><td>" + TrvType + "</td><td>" + TravellingTo + "</td><td>" + TravelArea + "</td></tr>";
    var preDeptDate = $("input[fldTitle='hdnpreDeptDate']").val();
    preDeptDate = !!preDeptDate ? preDeptDate : "";
    var preArrDate = $("input[fldTitle='hdnpreArrDate']").val();
    preArrDate = !!preArrDate ? preArrDate : "";
    var PreActNoDays = $("input[fldTitle='hdnPreActNoDays']").val();
    PreActNoDays = !!PreActNoDays ? PreActNoDays : "";
    var preDetails = preDeptDate + " to " + preArrDate + " (" + PreActNoDays + " days)"
    BasicInfo += "<tr><td>Date Of Pre-Travel</td><td colspan='3'>" + preDetails + "</td></tr>";

    //BasicInfo = BasicInfo.replace("<<HEADER>>", tblHeader);
    BasicInfo += "</tbody></table>";
    return BasicInfo;
}
function getBudgetInfo() {
    var budTable = "";
    budTable = "<label class='print-pad-top' style='margin-top: 15px;  width: 100%; display: block;'>" + langArray["fldBudgetHistory"] + ":</label>  <table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><thead>"
    //budTable += "<tr><td>Budget Key</td><td>langArray["fldBudgetAmt]</td><td>Available Budget</td><td>Amount Applied</td><td>Surplus/Deficit</td></tr></thead>"
    budTable += "<tr><td>" + langArray["fldBudgetKey"] + "</td><td>" + langArray["fldBudgetAmt"] + "</td><td>" + langArray["fldAvailableBudget"] + "</td><td>" + langArray["fldAmtApplied"] + "</td><td>" + langArray["fldSurplusDeficit"] + "</td></tr></thead>"
    budTable += "<tbody><tr>";

    $("#idTblBUD").find("tbody").find("tr").find("td").each(function () {
        lbl = $(this).text();
        if (lbl == "No data available in table") {
            budTable += "<td colspan='5' style='text-align: center;'>" + lbl + "</td>";
        }
        else if (lbl != "") {
            budTable += "<td style='text-align: right;'>" + lbl + "</td>";
        }
    });
    budTable += "</tr></tbody></table>";
    return budTable;
}
function getExpBudgetInfo() {
    var budTable = "";
    budTable = "<label class='print-pad-top' style='margin-top: 15px;  width: 100%; display: block;'>" + langArray["fldBudgetHistory"] + ":</label><table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><thead>"
    // budTable += "<tr><td>langArray["fldBudgetKey]</td><td>langArray["fldBudgetAmt]</td><td>Available Budget </td><td>Amount Applied</td><td>Surplus/Deficit</td></tr></thead>"
    budTable += "<tr><td>" + langArray["fldBudgetKey"] + "</td><td>" + langArray["fldBudgetAmt"] + "</td><td>" + langArray["fldAvailableBudget"] + "</td><td>" + langArray["fldAmtApplied"] + "</td><td>" + langArray["fldSurplusDeficit"] + "</td></tr></thead>"
    budTable += "<tbody>";

    $("#idTblBUDPS").find("tbody").find("tr").each(function () {
        budTable += "<tr>";
        $(this).find("td").each(function () {
            lbl = $(this).text();
            if (lbl == "No data available in table") {
                budTable += "<td colspan='5' style='text-align: center;'>" + lbl + "</td>";
            }
            else if (lbl != "") {
                budTable += "<td style='text-align: right;'>" + lbl + "</td>";
            }
        });
        budTable += "</tr>";
    });
    budTable += "</tbody></table>";
    return budTable;
}
function getExpRemarks() {
    var remarkTable = "";
    remarkTable = "<label class='print-pad-top' style='    padding: 15px;  width: 100%;    display: block;   float: left; '>Expense Remarks:</label> <br>"
    remarkTable = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay trvlsmry'>"
    //remarkTable += "<tr><td class='col-md-3'>Expense Type</td><td class='col-md-9'>Remarks</td></tr></thead>"
    remarkTable += "<tr><td class='col-md-3'>" + langArray["fldExpenseType"] + "</td><td class='col-md-9'>" + langArray["fldRemarks"] + "</td></tr></thead>"
    remarkTable += "<tbody>";

    $("#tblExpenseRemark").find("tbody").find("tr").each(function () {
        remarkTable += "<tr>";
        $(this).find("td").each(function () {
            lbl = $(this).text();
            !!lbl ? lbl : "";
            remarkTable += "<td>" + lbl + "</td>";
        });
        remarkTable += "</tr>";
    });
    remarkTable += "</tbody></table>";
    return remarkTable;

}
function getFramedTitle(title) {
    var frameTitle = "";
    var frameTitle = "<div class='panel panel-primary width100per'>"
    frameTitle += "<div class='panel-heading   general-heading' style='padding:0px 10px'>"
    frameTitle += "<div class='panel-title'><h4 style='color:white'>" + title + "</h4></div></div>"
    return frameTitle;

}
function clearData() {
    $("#dispRefNoForPrint, .printMainSpan").empty();
}

function getTravelReason() {
    var ReasonForTravel = $("textarea[fldTitle='ReasonForTravel']").val();
    ReasonForTravel = ReasonForTravel.replace(/\r?\n/g, '. ');
    var returnStr = "<table style='margin-top: 20px;'><tbody><tr><td class='LabelText'>" + langArray["fldReasonForTravel"] + ": </td></tr><tr><td>" + ReasonForTravel + "</td></tr>";
    var ReasonForLateTravel = $("textarea[fldTitle='ReasonForLate']").val();
    ReasonForLateTravel = ReasonForLateTravel.replace(/\r?\n/g, '. ');
    if (!!ReasonForLateTravel) {
        returnStr += "<tr style='float:left;margin-top:15px;'><td class='LabelText'>" + langArray["fldReasonForTravel"] + " : </td></tr><tr><td>" + ReasonForLateTravel + "</td></tr>"
    }
    returnStr += "</tbody></table>"
    return returnStr;
}

function getTravelSchedule() {
    var TravelSchedule = "";

    TravelSchedule += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;float:left;margin-bottom:20px;' class='tabledisplay'><tbody>";

    //var staffStatus = $("input[fldTitle='hdnddlStaffStatus']").val();
    // staffStatus = ((staffStatus) == undefined || (staffStatus) == "" ? "" : staffStatus);
    // TravelSchedule += "<tr style='width:100%;'><td style='width:50%'> Staff Status </td><td style='width:50%'>" + staffStatus + "</td></tr>"

    var TickCordReq = $("*[fldtitle=TktCoordinatorReq]").find("input[type=radio]:checked").val();
    TickCordReq = ((TickCordReq) == undefined || (TickCordReq) == "" ? "" : TickCordReq);
    TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldTktCoordinatorReq"] + " </td><td style='width:50%'>" + TickCordReq + "</td></tr>";

    var tickCord = $("input[fldTitle='hdnTicketCoordinator']").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "" || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "Select" ? "" : $("select[fldTitle='TicketCoordinator'] option:selected").val();
    TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldTicketCoOrdinator"] + "</td><td style='width:50%'>" + tickCord + "</td></tr>"

    //var brachcde = $("input[fldTitle='hdnBranchCodeDisplay']").val();
    //brachcde = ((brachcde) == undefined || (brachcde) == "" ? "" : brachcde);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+ langArray["fldBranchCode] +" </td><td style='width:50%'>" + brachcde + "</td></tr>"

    //var brncdesc = $("input[fldTitle='txtBranchDesc']").val();
    //brncdesc = ((brncdesc) == undefined || (brncdesc) == "" ? "" : brncdesc);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+ langArray["fldBranchDescription]+" </td><td style='width:50%'>" + brncdesc + "</td></tr>"

    if ($("input[fldTitle='hdnDataPlanReqd']").val() == "Yes") {
        var roamingPlan = $("*[fldtitle=ApplyRoamingData]").find("input[type=radio]:checked");
        roamingPlan = roamingPlan.val()
        if (roamingPlan == undefined || roamingPlan == "")
            roamingPlan = " - ";
        else
            roamingPlan;
        TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldApplyDataRoamingPlan"] + "</td><td style='width:50%'>" + roamingPlan + "</td></tr>"
    }

    //var glindcater = $("input[fldTitle='SpecialGLCode']").val();
    //glindcater = ((glindcater) == undefined || (glindcater) == "" ? "" : glindcater);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+langArray["fldSpecialGL Indicator +"</td><td style='width:50%'>" + glindcater + "</td></tr>"

    //var busarea = $(".bussarea").html();
    //busarea = ((busarea) == undefined || (busarea) == "" ? "" : busarea);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+ Business Area +"</td><td style='width:50%'>" + busarea + "</td></tr>"

    //var busareadecp = $(".bussareadesc").html();
    //busareadecp = ((busareadecp) == undefined || (busareadecp) == "" ? "" : busareadecp);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+ langArray["Business Area Desc]+" </td><td style='width:50%'>" + busareadecp + "</td></tr>"

    //var busprofit = $(".busspftctr").html();
    //busprofit = ((busprofit) == undefined || (busprofit) == "" ? "" : busprofit);
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>"+langArray["fldBusinessProfitCenter]+" </td><td style='width:50%'>" + busprofit + "</td></tr>"

    if ($("input[fldTitle='hdnPCCarryReq']").val() == "Yes") {
        var PCCarryOut = $("*[fldtitle=PCCarryOut]").find("input[type=radio]:checked").val();
        PCCarryOut = ((PCCarryOut) == undefined || (PCCarryOut) == "" ? "" : PCCarryOut);
        TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldPCCarryOut"] + " </td><td style='width:50%'>" + PCCarryOut + "</td></tr>";
    }
    if ($("input[fldTitle='hdnTaxLocRequired']").val() == "Yes") {
        var TaxLocation = $("input[fldTitle='TaxLocation']").val();
        TaxLocation = ((TaxLocation) == undefined || (TaxLocation) == "" ? "" : TaxLocation);
        TravelSchedule += "<tr style='width:100%;'><td colspan='1'>" + langArray["fldTaxLocation"] + " </td><td colspan='2'>" + TaxLocation + "</td></tr>"
    }

    if ($("input[fldTitle='hdnPCCarryReq']").val() == "Yes") {
        var eISMRef = $("textarea[fldTitle='eISMRef']").val();
        TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldeLaptopRef"] + "</td><td style='width:50%'>" + eISMRef + "</td></tr>"
    }

    var paymtd = $("input[fldTitle='PaymentMethod']").val();
    paymtd = ((paymtd) == undefined || (paymtd) == "" ? "" : paymtd);
    TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>" + langArray["fldPaymentMethod"] + "</td><td style='width:50%'>" + paymtd + "</td></tr>"

    TravelSchedule += "</tbody></table>";


    //TravelSchedule += "<table border='0' width='45%' style='border-collapse:collapse;margin-top:20px;margin-left:10px;;float:right;margin-bottom:20px;' class='tabledisplay'><tbody>";
    ////var expat = $("input[fldTitle='Expatriate']").val();
    ////TravelSchedule += "<tr style='width:100%;'><td colspan='1'> Expatriate </td><td colspan='2'>" + expat + "</td></tr>"
    //var tickCord = $("input[fldTitle='hdnTicketCoordinator']").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "" || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "Select" ? "" : $("select[fldTitle='TicketCoordinator'] option:selected").val();
    //TravelSchedule += "<tr style='width:100%;'><td style='width:50%'>  Ticket Co-Ordinator  </td><td style='width:50%'>" + tickCord + "</td></tr>"
    ////if ($("input[fldTitle='hdnBusinessPlaceReq']").val() == "Yes") {
    ////    var BusinessPlace = $("input[fldTitle='BusinessPlace']").val();
    ////    TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  Business Place  </td><td colspan='2'>" + BusinessPlace + "</td></tr>"
    ////}

    ////if ($("input[fldTitle='hdnWBSReq']").val() == "Yes") {
    ////    var WBS = $("input[fldTitle='WBS']").val();
    ////    TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  WBS#  </td><td colspan='2'>" + WBS + "</td></tr>"
    ////}
    //TravelSchedule += "</tbody></table>";


    TravelSchedule += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;float:left' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldTravelSchedule"] + "</td></tr></tbody></table>"
    // Travel Schedule Summery
    //TravelSchedule += "<label class='print-pad-top'>Travel Schedule Summary :</label>"
    TravelSchedule += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay trvlsmry'><thead>"
    TravelSchedule += document.getElementById("idTblTSHSummary").innerHTML;

    TravelSchedule += "</table>";
    // Travel details
    TravelSchedule += "<label class='print-pad-top' style='float:left;margin-top:20px;'>Travel Details :</label>";
    if (printFlg) {
        TravelSchedule += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'>";
    }
    drawDataTbl("idTblTSH", true);
    $(tableRowSelector("idTblTSH")).each(function () {
        TravelSchedule += formatPrintDisplay("idTblTSH", $(this));//formatDisplay("idTblTSH", $(this));
    });
    drawDataTbl("idTblTSH", false);
    if (printFlg) {
        TravelSchedule += "<tbody></table>";
    }
    return TravelSchedule;
}
function getTravelScheduleLessDetails() {
    var TravelSchedule = "";
    //TravelSchedule += framePanel("Travel Schedule");
    TravelSchedule += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody><tr height='30'><td width='20%' style='border-bottom: 0px;' class='LabelText'>Travel Details</td></tr></tbody></table>"

    if (printFlgLessDetails) {
        TravelSchedule += "<table>";
    }
    drawDataTbl("idTblTSH", true);
    TravelSchedule += formatPrintDisplay("idTblTSH");
    drawDataTbl("idTblTSH", false);
    if (printFlgLessDetails) {
        TravelSchedule += "<tbody></table>";
    }
    return TravelSchedule;
}
function getContactInformation() {
    var contactInfo = "";
    var lbl = "";
    var val = "";
    contactInfo += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><thead><tr height='30'><td width='20%' colspan='6' class='LabelText'>" + langArray["fldContactInfo"] + "</td></tr>";


    //contactInfo += "<thead><tr><th>Home Telephone No</th><th>Mobile Phone No</th><th>Emergency Contact</th><th>Hotel Name</th><th>Hotel Address</th><th>Overseas Contact No</th></tr></thead>"
    contactInfo += "<thead><tr><th>" + langArray["fldHomeTelNo"] + "</th><th>" + langArray["fldMobileNo"] + "</th><th>" + langArray["fldHotelName"] + "</th><th>" + langArray["fldHotelAddress"] + "</th><th>" + langArray["fldOverseasContactNo"] + "</th></tr></thead>"
    contactInfo += "<tr><tbody>";
    var HomeTelNo = !!$("input[fldTitle='HomeTeleNo']").val() ? $("input[fldTitle='HomeTeleNo']").val() : "";
    var MobileNo = !!$("input[fldTitle='MobileNo']").val() ? $("input[fldTitle='MobileNo']").val() : "";
    //var EmergencyContact = !!$("input[fldTitle='EmergencyContact']").val() ? $("input[fldTitle='EmergencyContact']").val() : "";
    var HotelName = !!$("input[fldTitle='HotelName']").val() ? $("input[fldTitle='HotelName']").val() : "";
    var HotelAddress = !!$("input[fldTitle='HotelAddress']").val() ? $("input[fldTitle='HotelAddress']").val() : "";
    var OversContNo = !!$("input[fldTitle='OverseasContactNo']").val() ? $("input[fldTitle='OverseasContactNo']").val() : "";
    //contactInfo += "<td>" + HomeTelNo + "</td><td>" + MobileNo + "</td><td>" + EmergencyContact + "</td><td>" + HotelName + "</td><td>" + HotelAddress + "</td><td>" + OversContNo + "</td>";
    contactInfo += "<td>" + HomeTelNo + "</td><td>" + MobileNo + "</td><td>" + HotelName + "</td><td>" + HotelAddress + "</td><td>" + OversContNo + "</td>";
    contactInfo += "</tr></tbody>";
    contactInfo += "</table>";
    return contactInfo;
}
function getTravelInfo() {
    var travelInfo = "";
    //travelInfo += framePanel("Application Details")
    travelInfo += getBasicTravelInfo();
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        travelInfo += getBudgetInfo();
    }
    travelInfo += getTravelReason();
    travelInfo += getTravelSchedule();
    travelInfo += getContactInformation();
    //travelInfo += "</div></div>";
    return travelInfo;
}
function getTravelLessInfo() {
    var travelInfo = "";
    //travelInfo += framePanel("Application Details")
    travelInfo += getBasicTravelLessInfo();
    travelInfo += getTravelReason();
    travelInfo += getTravelScheduleLessDetails();
    travelInfo += getContactInformation();
    //travelInfo += getExportControlDetails();
    //travelInfo += "</div></div>";
    return travelInfo;
}
function getExportControlDetails() {
    var expSecValues = "";
    var ExportControl = $("*[fldtitle=ExportControl]").find("input[type=radio]:checked").val();
    ExportControl = ((ExportControl) == undefined || (ExportControl) == "" ? "" : ExportControl);
    ExportControl = "<table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'><tr style='width:100%;'><td style='padding-left: 20px;'>" + langArray["fldExportControl"] + " </td><td colspan='2'>" + ExportControl + "</td></tr><table>";

    var detTable = $('#idTblEXCO').DataTable();
    var detTableCount = parseInt(detTable.data().length)
    if (detTableCount > 0) {

        ExportControl += "<table width=100%><tr><td><h4>" + langArray["fldExportCtrlChklst"] + "</h4></td></tr>";
        ExportControl += "<tr><td>" + langArray["fldhandCarry"] + "</td></tr>";
        ExportControl += "</table>";
        var expSecValues = framePanel(langArray["fldgoodslist"]);
        expSecValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
        expSecValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldSNo"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>" + langArray["fldNameOfgoods"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldlawoflocalcountry"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldHasJapanbeennotified"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldQty"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>" + langArray["fldAmount"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldBringingback"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>" + langArray["fldDescription"] + "</th>";
        expSecValues += "</tr>";
        expSecValues += "</thead><tbody>";
        $("#idTblEXCO>tbody>tr").each(function () {
            expSecValues += "<tr>"
            var idx = 0;
            var colspanArr = [1, 2, 1, 1, 1, 2, 1, 2];
            $(this).find("td.vmiddle").each(function () {
                expSecValues += "<td style='font-size:13px' colspan='" + colspanArr[idx++] + "'>" + $(this).find("*").text(); +"</td>";
            });
            expSecValues += "</tr>"
        });
        expSecValues += "</tbody></table></div>";
    }


    var detTable = $('#idTblEXCOTECH').DataTable();
    var detTableCount = parseInt(detTable.data().length)
    if (detTableCount > 0) {

        expSecValues += framePanel(langArray["fld2CtrlTechInfo"]);
        expSecValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
        expSecValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldSNo"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='3' style='font-size:13px'>" + langArray["fldNameofTechnicalInfo"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldlawoflocalcountry"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldHasJapanbeennotified"] + "</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='3' style='font-size:13px'>" + langArray["fldDescription"] + "</th>";
        expSecValues += "</tr>";
        expSecValues += "</thead><tbody>";
        $("#idTblEXCOTECH>tbody>tr").each(function () {
            expSecValues += "<tr>"
            var idx = 0;
            var colspanArr = [1, 3, 1, 1, 3];
            $(this).find("td.vmiddle").each(function () {
                expSecValues += "<td style='font-size:13px' colspan='" + colspanArr[idx++] + "'>" + $(this).find("*").text(); +"</td>";
            });
            expSecValues += "</tr>"
        });
        expSecValues += "</tbody></table></div>";
    }
    return ExportControl + expSecValues;
}

function printReviewComments() {

    var RwSection = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldReviewerssum"] + "</td></tr></tbody></table>"
    RwSection += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'>";
    RwSection += "<thead>";
    RwSection += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>" + langArray["fldID"] + "</th>";
    RwSection += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='width: 127.01px;'>" + langArray["fldAction"] + "</th>";
    RwSection += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='width: 275.01px;'>" + langArray["fldComments"] + "</th>";
    RwSection += "</tr>";
    RwSection += "</thead><tbody>";

    $("#divRevSummary>div>div>div>table>tbody>tr").each(function () {
        //    $("#divRevSummary>tbody>tr").each(function () {
        RwSection += "<tr>"
        $(this).find("td").each(function () {
            lbl = $(this).text();
            RwSection += "<td>" + $(this).text(); +"</td>";
        });
        RwSection += "</tr>"
    });
    RwSection += "</tbody></table>";
    return RwSection;
}
function printAttachmentDetailsSection() {
    var attSection = framePanel(langArray["fldAttachments"]);
    $("#tblSupportingDoc>tbody>tr").each(function () {
        attSection += "<tr>"
        $(this).find("td").each(function () {

            lbl = $(this).text();
            if (lbl.trim() != "Delete") {
                attSection += "<td>" + $(this).text(); +"</td>";
            }
        });
        attSection += "</tr>"
    });
    attSection += "</tbody></table></div><div>";
    return attSection;
}

function printAccountingEntries(tblID, ExpenseTitle) {
    //var accEntryValues = framePanel(ExpenseTitle + " Details");
    //    accEntryValues += "<table class='table table-bordered pad-10'>"
    var accEntryValues = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;float:left' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + ExpenseTitle + " " + langArray["fldDetails"] + "</td></tr></tbody></table>"
    accEntryValues += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'>";
    accEntryValues += "<thead>";
    accEntryValues += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>" + langArray["fldID"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldSNo"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldPostingKey"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldCostCenter"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldGLCode"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldTaxCode"] + "</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldAmt"] + "</th>";
    accEntryValues += "</tr>";
    accEntryValues += "</thead><tbody>";
    $("#" + tblID + ">tbody>tr").each(function () {
        accEntryValues += "<tr>"
        $(this).find("td.vmiddle").each(function () {
            accEntryValues += "<td style='font-size:13px'>" + $(this).find("*").text(); +"</td>";
        });
        accEntryValues += "</tr>"
    });
    accEntryValues += "</tbody></table></div></div>";
    return accEntryValues;
}
function framePanel(title) {
    if (title == langArray["fldContactInfo"]) {
        var panelData = "<div class='print print-primary width100per' style=' display: table;border: 0px solid #000; border-radius: 0px; margin: 1px 0px !important; padding: 2px !important;'>";
    }
    else if (title == langArray["fldTravelSchedule"]) {
        var panelData = "<div class='print print-primary width100per' style=' display: table;border: 0px solid #000; border-radius: 0px; margin: 1px 0px !important; padding: 2px !important;'>";
    }
    else {
        var panelData = "<div class='print print-primary width100per' style=' display: table;border: 1px solid #000; border-radius: 0px; margin: 1px 0px !important; padding: 2px !important;'>";
    }
    panelData += "<div class='print-heading  general-heading' style='padding:0px 10px;background:rgb(51, 122, 183);    float: left; width: 100%;'>";
    panelData += "<div class='print-title'><h4 style='color:white; margin: 0px auto;font-weight: bold;'>" + title + "</h4></div></div>";
    panelData += "<div class='print-wrapper' aria-expanded='false'>"
    if (title == "Contact Information") {
        panelData += "<div class='box-body' style='padding: 0 0px;float: left;display: table;width: 100%;'>";
    }
    else {
        //panelData += "<div class='box-body' style='padding: 0 0px;float: left;display: inline-block;width: 100%;min-height: 200px;height: 100%;'>";
        panelData += "<div class='box-body' style='padding: 0 0px;float: left;display: table;width: 100%;height: 100%;'>";

    }
    return panelData;
}
function printDetailSection(tblID, ExpenseTitle) {
    var detailSectionValues = "";
    var detTable = $('#' + tableID + "D").DataTable();
    var detTableCount = parseInt(detTable.data().length)
    if (detTableCount > 0) {
        //detailSectionValues = framePanel(ExpenseTitle + " Details");
        detailSectionValues += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;margin-bottom:20px;float:left' class='tabledisplay'>";
        detailSectionValues += "<thead><tr><th class='LabelText' style='text-align:left;' colspan='6'>" + ExpenseTitle + langArray["fldDetails"] + "</th></tr><tr>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldSNo"] + "</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldAttendant"] + "</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldCompName"] + "</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldTitle"] + "</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldCustomerName"] + "</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldPurpose"] + "</th>";
        detailSectionValues += "</tr>";
        detailSectionValues += "</thead><tbody>";
        $("#" + tblID + "D>tbody>tr").each(function () {
            detailSectionValues += "<tr>"
            $(this).find("td.vmiddle").each(function () {
                detailSectionValues += "<td style='font-size:13px'>" + $(this).find("*").text() + "</td>";
            });
            detailSectionValues += "</tr>"
        });
        detailSectionValues += "</tbody></table>";
    }
    return detailSectionValues;
}
function eTravelPrint(PrintTill, isPopup) {
    printFlg = true; // For Single Row Print
    clearData();
    var TravelExpense = "";
    var TravelTitle = ""
    var docRefNo = "";
    var StartDate = "";
    var internalUse = "";
    var AccountUse = "";
    //start:Email Approval
    var _applicantSection,
       _travelInfo,
       _exRate,
       _accountUse,
       _expenseSection,
       _allExpenseDetails,
	   _paymentSummary,
	   _accountsAndPaymentSummary,
	   _approvalSummary,
	   _attachmentDetails,
	   _reviewerDetails;
    //end:Email Approval


    $(".app_detail").find(".header_section2").find("li").each(function () {
        lbl = $(this).find("label").text();
        if (lbl == "Reference#") {
            docRefNo = $(this).find("span>*").text();
        }
    })
    // Print Remarks 
    var tmpRemarks = $("#divRemarks").clone();
    tmpRemarks.find("textarea").after("<div>" + tmpRemarks.find("textarea").val().trim().replace(/\n/g, "<br/>") + "</div>");
    tmpRemarks.find("textarea").remove();
    var lsRemarks = "<div class='panel print-primary'>" + tmpRemarks.html() + "</div>";
    tmpRemarks = null;
    //For Internal Use    
    internalUse += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'><tbody>";
    internalUse += "<tr><th colspan='2'>FOR INTERNAL USE</th></tr>";
    internalUse += "<tr><td>Travel Ref No</td><td>" + docRefNo + "</td></tr>";
    internalUse += "<tr><td>Date</td><td>" + $.trim($("#idlblSubmitDate").text()) + "</td></tr>";
    internalUse += "</tbody></table>";

    //document.getElementById("dispRefNoForPrint").innerHTML = internalUse;
    // Print the applicant section
    var applicantSection = getApplicantSectionDetails();
    _applicantSection = applicantSection;//
    document.getElementById("printApplicantSection").innerHTML = applicantSection;
    // Print All the Travel Information Section
    var travelInfo = getTravelInfo();
    _travelInfo = travelInfo;
    document.getElementById("printTravelInfo").innerHTML = travelInfo;
    // Print Exchange Rate Details and Information... 
    var exRate = ExchangeRateDetails();
    _exRate = exRate;
    document.getElementById("printExchangeRateDetails").innerHTML = exRate;
    var NetPayToStaff = "";
    var PayFinance = "";
    var PayPayroll = "";
    NetPayToStaff = outputMoney($("input[fldTitle='hdnPostTravelNetPayableAmt']").val());
    !!NetPayToStaff ? NetPayToStaff : 0;
    PayFinance = outputMoney($("input[fldTitle='hdnPostTravelFinanceAmt']").val());
    !!PayFinance ? PayFinance : 0;
    PayPayroll = outputMoney($("input[fldTitle='hdnPostTravelPayrollAmt']").val());
    !!PayPayroll ? PayPayroll : 0;
    var PreTravelFinalApprover = "";
    PreTravelFinalApprover = $("input[fldTitle='hdnPreDeptLastReviewer']").val();
    !!PreTravelFinalApprover ? PreTravelFinalApprover : "";
    var PreTravelFinalApprovalDate = "";
    PreTravelFinalApprovalDate = $("input[fldTitle='hdnPreDeptFinalApprovedDate']").val();
    !!PreTravelFinalApprovalDate ? PreTravelFinalApprovalDate : "";
    var PostTravelFinalApprover = "";
    PostTravelFinalApprover = $("input[fldTitle='hdnPostDeptLastReviewer']").val();
    !!PostTravelFinalApprover ? PostTravelFinalApprover : "";
    var PostTravelFinalApprovalDate = "";
    PostTravelFinalApprovalDate = $("input[fldTitle='hdnPostDeptFinalApprovedDate']").val();
    !!PostTravelFinalApprovalDate ? PostTravelFinalApprovalDate : "";

    AccountUse += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody><tr>";
    AccountUse += "<td class='LabelText'>" + langArray["fldPreTravelAuthorisedby"] + "</td><td class='LabelText'>" + langArray["fldPostTravelAuthorisedby"] + "</td>";
    AccountUse += "<td class='LabelText' colspan='2'>" + langArray["fldAccountsUse"] + "</td></tr>";
    AccountUse += "<tr><td>" + PreTravelFinalApprover + "</td><td>" + PostTravelFinalApprover + "</td>";
    AccountUse += "<td><b>" + langArray["fldNetPayabletoStaffCompany"] + "(" + baseCurrency + " $)</b></td><td style='text-align:right'>" + NetPayToStaff + "</td>";
    AccountUse += "<tr><td><b>" + langArray["fldDate"] + ":</b>" + PreTravelFinalApprovalDate + "</td><td><b>" + langArray["fldDate"] + ":</b>" + PostTravelFinalApprovalDate + "</td>";
    AccountUse += "<td><b>" + langArray["fldPaythroughPayroll"] + "</b></td><td style='text-align:right'>" + PayPayroll + "</td></tr>";
    AccountUse += "<tr><td colspan='2' rowspan='3'><b>" + langArray["fldRemarks"] + ":</b>" + lsRemarks + "</td><td><b>" + langArray["fldPaythroughFinance"] + "</b></td><td style='text-align:right'>" + PayFinance + "</td></tr>";
    AccountUse += "<tr><td class='LabelText'>" + langArray["fldApprovedBy"] + "</td><td class='LabelText'>" + langArray["fldCheckedBy"] + "</td></tr><tr><td style='height:100px;width:25%'></td><td style='width:25%'></td></tr></tbody></table>";


    _accountUse = AccountUse
    document.getElementById("printAccountUseSection").innerHTML = AccountUse;
    if (PrintTill == "PrintAll") {
        var rowCnt = $("#idTblEXP tbody").children().length
        var expDetailFullValue = "";
        var expTableDetails = "";
        //document.getElementById("printExpenseSection").innerHTML = "";
        document.getElementById("printAllExpenseDetails").innerHTML = "";
        document.getElementById("printPaymentSummary").innerHTML = "";
        if (rowCnt > 0) {
            expTableDetails = getExpenseTable();
            _expenseSection = expTableDetails;
            document.getElementById("printExpenseSection").innerHTML = expTableDetails;
            for (var i = 0; i < allExpenses.length; i++) {
                expTableName = allExpenses[i].split("~")[1]
                tableID = getExpTypeTblID(allExpenses[i].split("~")[0]);

                if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                    // Print the Detail section
                    // expDetailFullValue += "<div class='print print-primary width100per' style='display: inline-block;border: 1px solid #337ab7; border-radius: 5px; margin: 1px 0px !important; padding: 2px !important;'>";
                    expDetailFullValue += printDetailSection(tableID, expTableName);
                }
                // Print the expenses section       
                var expenseTable = $('#' + tableID).DataTable();
                var expenseTableCount = parseInt(expenseTable.data().length)
                if (expenseTableCount > 0) {
                    //expDetailFullValue += framePanel(expTableName + " Expenses");
                    expDetailFullValue += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + expTableName + " Expenses</td></tr></tbody></table>"
                    drawDataTbl(tableID, true);
                    expDetailFullValue += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay trvlsmry'><tbody>";
                    $(tableRowSelector(tableID)).each(function () {
                        // expDetailFullValue += formatDisplay(tableID, $(this));
                        expDetailFullValue += formatPrintDisplay(tableID, $(this));
                    })
                    expDetailFullValue += "</tbody></table>";
                    drawDataTbl(tableID, false);
                }
                if (tableID == "idTblMIL") {
                    var expenseTable = $('#idTblOTH').DataTable();
                    var expenseTableCount = parseInt(expenseTable.data().length)
                    if (expenseTableCount > 0) {
                        //expDetailFullValue += framePanel(expTableName + " Expenses");
                        expDetailFullValue += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldOtherFeeExpenses"] + "</td></tr></tbody></table>"
                        drawDataTbl("idTblOTH", true);
                        expDetailFullValue += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay trvlsmry'><tbody>";
                        $(tableRowSelector("idTblOTH")).each(function () {
                            // expDetailFullValue += formatDisplay(tableID, $(this));
                            expDetailFullValue += formatPrintDisplay("idTblOTH", $(this));
                        })
                        expDetailFullValue += "</tbody></table>";
                        drawDataTbl("idTblOTH", false);
                    }
                }
                //expDetailFullValue += "</div></div></div>";
                // if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                //expDetailFullValue += "</div>";
                // }
            }
            _allExpenseDetails = expDetailFullValue;
            document.getElementById("printAllExpenseDetails").innerHTML = expDetailFullValue;
            var paymentSummary = "";
            paymentSummary = printPaymentSummary();
            var paySum = "";
            paySum = getExpRemarks();
            _paymentSummary = paymentSummary + paySum;
            document.getElementById("printPaymentSummary").innerHTML = paymentSummary + paySum;
        }
        // Print Acc Entries & Payment Advice....
        var accEntry = "";
        var paySumm = "";
        var valFound = "";
        //if ($('#idTblACCENT').DataTable().rows('.selected').any()) {
        if (parseInt($('#idTblACCENT').DataTable().data().length)) {
            valFound = "Yes";
            accEntry = printAccountingEntries("idTblACCENT", langArray["fldAccountingEntries"])
        }
        //if ($('#idTblPAD').DataTable().rows('.selected').any()) {
        if (parseInt($('#idTblPAD').DataTable().data().length)) {
            paySumm = printPaymentAdvice("idTblPAD", langArray["fldPaymentAdvice"])
            valFound = "Yes";
        }
        if (valFound == "Yes") {
            _accountsAndPaymentSummary = accEntry + "<br>" + paySumm;
            document.getElementById("printAccountsAndPaymentSummary").innerHTML = accEntry + "<br>" + paySumm;
        }
        // Print Approval Summary
        //var approvalSummary = framePanel("Approval Summary");
        var approvalSummary = "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;clear:left;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldApprovalSummary"] + "</td></tr></tbody></table>"
        approvalSummary += document.getElementById("approvalSum").innerHTML;
        _approvalSummary = approvalSummary;
        document.getElementById("printApprovalSummary").innerHTML = approvalSummary;
        $('#printApprovalSummary').find('table').addClass('tabledisplay');
        $('#printApprovalSummary').find('table').css({ 'border-collapse': 'collapse', 'width': '100%', 'clear': 'left' });
        // Print Remarks 
        var tmpRemarks = $("#divRemarks").clone();
        tmpRemarks.find("textarea").after("<div>" + tmpRemarks.find("textarea").val().trim().replace(/\n/g, "<br/>") + "</div>");
        tmpRemarks.find("textarea").remove();
        var lsRemarks = "<div class='panel panel-primary'>" + tmpRemarks.html() + "</div>";
        tmpRemarks = null;
        //Print Attachment Details        
        var lsAttach = printAttachmentDetailsSection();
        _attachmentDetails = lsAttach + "</div>";
        document.getElementById("printAttachmentDetails").innerHTML = lsAttach + "</div>";
        // Print Reviewer Details
        ReviewComments = printReviewComments();
        _reviewerDetails = ReviewComments;
        document.getElementById("printReviewerDetails").innerHTML = ReviewComments;
    } // PrintTill condition ends here....
    $("#printTravelData").find("*").each(function () {
        $(this).addClass("printRules");
    });
    $("#printTravelData>.modal-body")[0].scrollTop = 0
    //document.all("idBtnPrintPopup").click(); Email Approval command the line 
    printFlg = false;

    //stat:Email Approval
    $('#hdnprintApplicantSection').val(_applicantSection);
    $('#hdnprintTravelInfo').val(_travelInfo);
    $('#hdnprintExchangeRateDetails').val(_exRate);
    $('#hdnprintAccountUseSection').val(_accountUse);
    //  $('#hdnprintExpenseSection').val(_expenseSection);
    $('#hdnprintAllExpenseDetails').val(_allExpenseDetails);
    $('#hdnprintPaymentSummary').val(_paymentSummary);
    $('#hdnprintAccountsAndPaymentSummary').val(_accountsAndPaymentSummary);
    $('#hdnprintApprovalSummary').val(_approvalSummary);
    $('#hdnprintAttachmentDetails').val(_attachmentDetails);
    $('#hdnprintReviewerDetails').val(_reviewerDetails);

    if (isPopup != true)
        document.all("idBtnPrintPopup").click();
    //end:Email Approval
}
function ExchangeRateDetails() {
    var ExRate = "";
    var lbl = "";
    var val = "";
    //var ExRate = framePanel("Exchange Rate")
    ExRate += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody><tr height='30'><td colspan='4' style='border-bottom:0px;' class='LabelText'>" + langArray["fldExchangeRate"] + "</td></tr></tbody></table>"
    ExRate += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'><tbody>";
    ExRate += "<tr style='width:100%;'><td>" + langArray["fldPreExchRate"] + ": </td><td>" + $("#acEXRATE").find(".app_table:first").find(".header_section1").find("li:first>span").text() + "</td></tr>"
    var exPostVal = $("*[fldtitle=ExRateType]").find("input[type=radio]:checked");
    exPostVal = exPostVal.val();
    if (exPostVal == undefined || exPostVal == "")
        exPostVal = " - ";
    else
        exPostVal;
    ExRate += "<tr style='width:100%;'><td>" + langArray["fldPostExchRate"] + ": </td><td>" + exPostVal + "</td></tr>"
    ExRate += "</tbody></table>";
    ExRate += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay trvlsmry exrt'>";
    ExRate += document.getElementById("idTblEXRATE").innerHTML;

    ExRate += "</table>";


    // Print Advance Details
    var AdvRefDetails = "";
    var accUse = "";
    var table = $('#idTblADV').DataTable();
    var AdvrowCnt = parseInt(table.data().length)
    if (AdvrowCnt > 0) {
        AdvRefDetails = getAdvanceRefundDetails();
        accUse = getAccountUse();

    }
    $('.exrt').find('thead > tr >th').css({ 'display': 'none' });
    return AdvRefDetails + ExRate + accUse;
}
function getAdvanceRefundDetails() {
    var ARDetails = "";
    ARDetails += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody class='printRules'><tr height='30' class='printRules'><td colspan='4' style='border-bottom:0px;border-right:0px;' class='LabelText printRules'>" + langArray["fldAdvanceRefundDetails"] + "</td></tr></tbody></table>"
    ARDetails += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'>";
    ARDetails += "<thead>";
    ARDetails += "<tr style='width:100%;'>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldSNo"] + "</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldCurrency"] + "</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldMode"] + "</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldPC"] + "</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldDenomination"] + "</th>";
    ARDetails += "<th colspan='2' class='vmiddle center' nowrap=''>" + langArray["fldBaseCurrAmt"] + "</th>";
    ARDetails += "</tr>";
    ARDetails += "</thead>";
    $("#idTblADV>tbody>tr").each(function () {
        ARDetails += "<tbody><tr>"
        $(this).find("td").each(function () {
            lbl = $(this).text();
            if (lbl.trim() != "" && lbl.trim() != langArray["fldDelete"] && !$(this).hasClass("displaynone")) {
                ARDetails += "<td>" + $(this).find("span:last").text() + "</td>";
            }
        });
        ARDetails += "</tr>"
    });
    ARDetails += "</tbody></table>"
    var table = $('#idTblRef').DataTable();
    var RefrowCnt = parseInt(table.data().length)
    if (RefrowCnt > 0) {
        ARDetails += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'>";
        ARDetails += "<thead>";
        ARDetails += "<tr style='width:100%;'>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldSNo"] + "</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldCurrency"] + "</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldMode"] + "</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldFCAmt"] + "</th>";
        ARDetails += "<th colspan='2' class='vmiddle center' nowrap=''>" + langArray["fldBaseCurrAmt"] + "</th>";
        ARDetails += "</tr>";
        ARDetails += "</thead>";
        $("#idTblRef>tbody>tr").each(function () {
            ARDetails += "<tbody><tr>"
            $(this).find("td").each(function () {
                lbl = $(this).text();
                if (lbl.trim() != "" && lbl.trim() != "Delete" && !$(this).hasClass("displaynone")) {
                    ARDetails += "<td>" + $(this).find("span:last").text() + "</td>";
                }
            });
            ARDetails += "</tr>"
        });
        ARDetails += "</tbody></table>"
    }
    return ARDetails;
}
function getAccountUse() {
    var accUse = "";
    var tempVar = "";
    accUse += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody>";
    tempVar = !!($('#settlementDate').val()) ? $('#settlementDate').val() : "";
    accUse += "<tr style='width:100%;'><td>" + langArray["fldSettlementDate"] + ": </td><td> " + tempVar + "</td></tr>";
    tempVar = !!($('#settlementDays').val()) ? $('#settlementDays').val() : "";
    accUse += "<tr style='width:100%;'><td> " + langArray["fldSettlementDays"] + ": </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($('#idSettlementRecvBy').val()) ? $('#idSettlementRecvBy').val() : "";
    accUse += "<tr style='width:100%;'><td> " + langArray["fldReceivedBy"] + ": </td><td>" + tempVar + "</td></tr>";
    accUse += "<tr style='width:100%;'><td>" + langArray["fldForAccUse"] + " </td><td></td></tr>";
    tempVar = !!($("input[fldtitle='CheckedBy']").val()) ? $("input[fldtitle='CheckedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td> " + langArray["fldCheckedBy"] + " </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($("input[fldtitle='VerifiedBy']").val()) ? $("input[fldtitle='VerifiedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td>" + langArray["fldVerifiedBy"] + " : </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($("input[fldtitle='ApprovedBy']").val()) ? $("input[fldtitle='ApprovedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td> " + langArray["fldApprovedBy"] + ": </td><td>" + tempVar + "</td></tr>";
    accUse += "</tbody></table>";
    return accUse;

}
function getExpenseTable() {
    var expDet = "";
    expDet += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'><tbody class='printRules'><tr height='30' class='printRules'><td colspan='4' style='border-bottom:0px;' class='LabelText printRules'>" + langArray["fldExpenseDetails"] + "</td></tr></tbody></table>"
    expDet += "<table border='0' width='100%' style='border-collapse:collapse;' class='tabledisplay'>";
    expDet += "<thead>";
    expDet += "<tr style='width:100%;'>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldExpenseType"] + "</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldGLCode"] + "</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldTaxCode"] + "</th>";
    expDet += "<th colspan='2' class='vmiddle center' nowrap=''>" + baseCurrency + langArray["fldAmt"] + "</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>" + langArray["fldRemarks"] + "</th>";
    expDet += "</tr>";
    expDet += "<tr style='width:100%;'><th class='center'>" + langArray["fldPre"] + "</th><th class='center'>" + langArray["fldPost"] + "</th></tr>";
    expDet += "</thead>";
    allExpenses = [];
    $("#idTblEXP>tbody>tr").each(function () {
        expDet += "<tbody><tr>";
        var alignRight = "";
        allExpenses.push($(this).find("#idExpType").text() + "~" + $(this).find("#idExpTypeDisplay").text());
        var tdcount = 0;
        $(this).find("td").each(function () {
            if ($(this).hasClass("amount")) {
                alignRight = 'style="text-align:right;"'
            }
            else {
                alignRight = 'style="text-align:left;"'
            }
            lbl = $(this).text();
            if (lbl.trim() != "" && lbl.trim() != "Delete" && !$(this).hasClass("displaynone")) {
                tdcount++;
                expDet += "<td " + alignRight + ">" + $(this).find("span:last").text() + "</td>";
            }
        });
        if (tdcount < 6) {
            expDet += "<td></td>";
        }
        expDet += "</tr>";
    });
    expDet += "</tbody></table>";
    return expDet;
}
function printPaymentAdvice(tblID, ExpenseTitle) {
    var payAdv = framePanel(ExpenseTitle + " Details");
    payAdv += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px;' class='tabledisplay'>"
    payAdv += "<thead>"
    payAdv += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>" + langArray["fldID"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldSNo"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldPaymnentDoc"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldPaymentDocDate"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldAdviceDesc"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldInvoiceAmt"] + "</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>" + langArray["fldCurrency"] + "</th>";
    payAdv += "</tr>"
    payAdv += "</thead><tbody>"
    $("#" + tblID + ">tbody>tr").each(function () {
        payAdv += "<tr>"
        $(this).find("td.vmiddle").each(function () {
            payAdv += "<td style='font-size:13px'>" + $(this).find("*").text(); +"</td>";
        });
        payAdv += "</tr>"
    });
    payAdv += "</tbody></table>";
    return payAdv;
}
function printPaymentSummary() {
    createPaymentSummary();
    var paySum = "";
    //paySum += framePanel("Payment Summary");
    paySum += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><thead><tr height='30'><td colspan='5' class='LabelText'>" + langArray["fldPaymentSummary"] + "</td></tr>";
    //paySum += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    paySum += "<tr>";
    paySum += "<th class='LabelText'>" + langArray["fldItems"] + "</th>";
    paySum += "<th class='LabelText' style='text-align:center;display:none' nowrap=''>" + langArray["fldPreAmountSGD"] + "</th>";
    paySum += "<th class='LabelText'>" + langArray["fldPostAmountSGD"] + "</th>";
    paySum += "<th class='LabelText' style='text-align:center;display:none' nowrap=''>" + langArray["fldDiffAgtPost"] + "</th>";
    paySum += "<th class='LabelText'>" + langArray["fldGLCode"] + "</th>";
    paySum += "</tr>";
    paySum += "</thead>";
    var alignRight = "";
    var dispBold = "";
    var flgGTPrinted = false;
    $("#tblPaymentSummary").find("tbody>tr").each(function () {
        alignRight = "";
        dispBold = "";
        var lblVal = $(this).find("td")[0].innerText;
        var PostAmt = outputMoney(outputNumber($(this).find("td")[2].innerText));
        var GlCode = $(this).find("td")[4].innerText;

        if (lblVal == "Grand Total") {
            flgGTPrinted = true;
        }
        if (lblVal == "Air Ticket Cost By Company" || lblVal == "Accommodation By Company" || lblVal == "Airport Tax By Company" || lblVal == "Visa By Company") {
            dispBold = 'style="font-weight:bold;"'
        }
        if (!flgGTPrinted && PostAmt == 0) {
            return;
        }
        if ($(this).hasClass("clssubhead")) {
            dispBold = 'style="font-weight:bold;"'
        }
        paySum += "<tr " + dispBold + ">";
        paySum += "<td>" + lblVal + "</td><td style='text-align:right;'>" + PostAmt + "</td><td>" + GlCode + "</td></tr>";
    });
    paySum = "<tbody>" + paySum
    paySum += "</tbody></table>"
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        paySum += getExpBudgetInfo();
    }
    return paySum;
}
function printAttachmentDetailsSection() {
    var attSection = "";
    attSection += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'>";
    attSection += "<thead>";
    attSection += "<tr height='30'><td colspan='4' class='LabelText'>" + langArray["fldSupportingDocuments"] + "</td></tr>";
    attSection += "<tr role='row'><th nowrap='' class='sorting_disabled LabelText' rowspan='1' colspan='1' style='width: 127.01px;text-align:left;'>" + langArray["fldAttachFileName"] + "</th>";
    attSection += "<th nowrap='' class='sorting_disabled LabelText' rowspan='1' colspan='1' style='width: 127.01px;text-align:left;'>" + langArray["fldCreatedBy"] + "</th>";
    attSection += "<th nowrap='' class='sorting_disabled LabelText' rowspan='1' colspan='1' style='width: 137.5px;text-align:left;'>" + langArray["fldDate"] + "</th>";
    attSection += "</tr>";
    attSection += "</thead><tbody>";

    var cols = 1;
    var strNoEntriesFound = langArray["fldNoEntriesFound"];
    if (strNoEntriesFound.indexOf($("#tblSupportingDoc").find("tbody>tr>td")[0].innerText) != -1) {
        cols = 3;
    }
    $("#tblSupportingDoc>tbody>tr").each(function () {
        attSection += "<tr>"
        $(this).find("td").each(function () {
            lbl = $(this).text();
            if (lbl.trim() != langArray["fldDelete"]) {
                attSection += "<td colspan=" + cols + ">" + $(this).text(); +"</td>";
            }
        });
        attSection += "</tr>"
    });
    attSection += "</tbody></table>";
    return attSection;

}
function PrintPage() {
    document.getElementById("idTravelMainFormPrint").style.display = "block";
    document.getElementById("idTravelMainForm").style.display = "none";
    document.getElementById("foot").style.display = "none";
    eTravelPrint('PrintAll')
    //eTravelPrint(PrintTill, isPopup);
    document.getElementById("idTravelMainFormPrint").innerHTML = document.getElementById("printTravelData").innerHTML;
    $("#idTravelMainFormPrint").find(".modal-body").removeClass("modal-body");
    $("#idTravelMainFormPrint").find(".printMainSpan").each(function () {
        if ($.trim($(this).html()) == "") {
            $(this).remove();
        }
    });

    var popup = window.open('', 'popup', ''); //'toolbar=no,menubar=no,width=1000,height=1000'
    var PopDoc = popup.document
    PopDoc.open();
    PopDoc.writeln("<html><head>");
    PopDoc.writeln("<style type='text/css'>html, td, TH, span, div, h2, pre{font-family:Verdana, Helvetica, sans-serif;font-size:11px;font-weight:normal}.button1 {	PADDING: 1px 15px; FONT:  11px arial, serif; border: 1px #003c74 solid;CURSOR: pointer; COLOR: #000000; BACKGROUND: #e3e5e8; width:75px;}.tabledisplay{border-top: 1px #000 solid; border-left: 1px #000 solid} .tabledisplay td, .tabledisplay th{border-bottom: 1px #000 solid; border-right: 1px #000 solid} .viewcontents{border-top: 1px #000 solid; border-left: 1px #000 solid} .viewcontents td, .viewcontents th{border-bottom: 1px #000 solid; border-right: 1px #000 solid} .LabelText{FONT-WEIGHT: Bold} table { page-break-inside: avoid } tr { page-break-inside: avoid; page-break-after: avoid } .amount{text-align:right;}.trvlsmry thead{background-color:#ffffff !important;color:#000000 !important;}.displaynone{display:none;}.tblbdr{border-left:0px !important}</style>");
    PopDoc.writeln("</head>");
    PopDoc.writeln("<body>");
    PopDoc.writeln("<table border='0;' width='100%' id='idPrintButtons'><tbody><tr><td><input value='Print' type='button' class='button1' onclick='document.all(&quot;idPrintButtons&quot;).style.display=&quot;none&quot;; window.print();window.close();'></td><td><input value='Close' type='button' class='button1' onclick='window.close()'></td><td width='85%'>&nbsp;</td></tr></tbody></table>");
    PopDoc.writeln(document.getElementById("idTravelMainFormPrint").innerHTML);
    PopDoc.writeln("</body>");
    PopDoc.writeln("</html>");
    PopDoc.close();

    //window.print();
    document.getElementById("idTravelMainFormPrint").style.display = "none";
    document.getElementById("idPrintPopup").style.display = "none";
    document.getElementById("idTravelMainForm").style.display = "block";
    document.getElementById("foot").style.display = "block";
}
///////////////////////PA Print

function PrintPageAdvance() {
    document.getElementById("idTravelMainFormPrint").style.display = "block";
    document.getElementById("idTravelMainForm").style.display = "none";
    document.getElementById("foot").style.display = "none";
    eTravelPrint('PrintAll')
    //eTravelPrint(PrintTill, isPopup);
    document.getElementById("idTravelMainFormPrint").innerHTML = document.getElementById("printTravelData").innerHTML;
    $("#idTravelMainFormPrint").find(".modal-body").removeClass("modal-body");
    $("#idTravelMainFormPrint").find('.notadv').css({ 'display': 'none' });
    $("#idTravelMainFormPrint").find(".printMainSpan").each(function () {
        if ($.trim($(this).html()) == "") {
            $(this).remove();
        }
    });

    var popup = window.open('', 'popup', ''); //'toolbar=no,menubar=no,width=1000,height=1000'
    var PopDoc = popup.document
    PopDoc.open();
    PopDoc.writeln("<html><head>");
    PopDoc.writeln("<style type='text/css'>html, td, TH, span, div, h2, pre{font-family:Verdana, Helvetica, sans-serif;font-size:11px;font-weight:normal}.button1 {	PADDING: 1px 15px; FONT:  11px arial, serif; border: 1px #003c74 solid;CURSOR: pointer; COLOR: #000000; BACKGROUND: #e3e5e8; width:75px;}.tabledisplay{border-top: 1px #000 solid; border-left: 1px #000 solid} .tabledisplay td, .tabledisplay th{border-bottom: 1px #000 solid; border-right: 1px #000 solid} .viewcontents{border-top: 1px #000 solid; border-left: 1px #000 solid} .viewcontents td, .viewcontents th{border-bottom: 1px #000 solid; border-right: 1px #000 solid} .LabelText{FONT-WEIGHT: Bold} table { page-break-inside: avoid } tr { page-break-inside: avoid; page-break-after: avoid } .amount{text-align:right;}.trvlsmry thead{background-color:#ffffff !important;color:#000000 !important;}.displaynone{display:none;}.tblbdr{border-left:0px !important}</style>");
    PopDoc.writeln("</head>");
    PopDoc.writeln("<body>");
    PopDoc.writeln("<table border='0;' width='100%' id='idPrintButtons'><tbody><tr><td><input value='Print' type='button' class='button1' onclick='document.all(&quot;idPrintButtons&quot;).style.display=&quot;none&quot;; window.print();window.close();'></td><td><input value='Close' type='button' class='button1' onclick='window.close()'></td><td width='85%'>&nbsp;</td></tr></tbody></table>");
    PopDoc.writeln(document.getElementById("idTravelMainFormPrint").innerHTML);
    PopDoc.writeln("</body>");
    PopDoc.writeln("</html>");
    PopDoc.close();

    //window.print();
    document.getElementById("idTravelMainFormPrint").style.display = "none";
    document.getElementById("idPrintPopup").style.display = "none";
    document.getElementById("idTravelMainForm").style.display = "block";
    document.getElementById("foot").style.display = "block";


}
///////////////////////PA Print

function eTravelPrintLessDetails(PrintTill) {
    printFlgLessDetails = true; // For Single Row Print
    clearData();
    var TravelExpense = "";
    var TravelTitle = ""
    var docRefNo = "";
    var internalUse = "";
    var AccountUse = "";
    var PostTrvDet = "";
    var POSTDetails = "";
    // Print Remarks 
    var tmpRemarks = $("#divRemarks").clone();
    tmpRemarks.find("textarea").after("<div>" + tmpRemarks.find("textarea").val().trim().replace(/\n/g, "<br/>") + "</div>");
    tmpRemarks.find("textarea").remove();
    var lsRemarks = "<div class='panel print-primary'>" + tmpRemarks.html() + "</div>";
    tmpRemarks = null;
    //For Internal Use    
    internalUse += "<table border='0' width='100%' style='border-collapse:collapse' class='tabledisplay'>";
    internalUse += "<tbody><tr align='center'><td colspan='2' class='LabelText'>" + langArray["fldFORINTERNALUSE"] + "</td></tr>";
    internalUse += "<tr><td class='LabelText'>Travel Ref No</td><td style='font-weight: bold;'>" + $.trim($("#idlblReferenceNo").text()) + "</td></tr>";
    internalUse += "<tr><td class='LabelText'>Date</td><td style='font-weight: bold;'>" + $.trim($("#idlblSubmitDate").text()) + "</td></tr>";
    internalUse += "</table>";
    document.getElementById("dispRefNoForPrint").innerHTML = internalUse;
    // Print the applicant section
    var applicantSection = getApplicantSectionLessDetails();
    document.getElementById("printApplicantSection").innerHTML = applicantSection;
    // Print All the Travel Information Section
    var travelInfo = getTravelLessInfo();
    document.getElementById("printTravelInfo").innerHTML = travelInfo;
    var NetPayToStaff = "";
    var PayFinance = "";
    var PayPayroll = "";
    NetPayToStaff = outputMoney($("input[fldTitle='hdnPostTravelNetPayableAmt']").val());
    !!NetPayToStaff ? NetPayToStaff : 0;
    PayFinance = outputMoney($("input[fldTitle='hdnPostTravelFinanceAmt']").val());
    !!PayFinance ? PayFinance : 0;
    PayPayroll = outputMoney($("input[fldTitle='hdnPostTravelPayrollAmt']").val());
    !!PayPayroll ? PayPayroll : 0;
    var PreTravelFinalApprover = "";
    PreTravelFinalApprover = $("input[fldTitle='hdnPreDeptLastReviewer']").val();
    !!PreTravelFinalApprover ? PreTravelFinalApprover : "";
    var PreTravelFinalApprovalDate = "";
    PreTravelFinalApprovalDate = $("input[fldTitle='hdnPreDeptFinalApprovedDate']").val();
    !!PreTravelFinalApprovalDate ? PreTravelFinalApprovalDate : "";
    var PostTravelFinalApprover = "";
    PostTravelFinalApprover = $("input[fldTitle='hdnPostDeptLastReviewer']").val();
    !!PostTravelFinalApprover ? PostTravelFinalApprover : "";
    var PostTravelFinalApprovalDate = "";
    PostTravelFinalApprovalDate = $("input[fldTitle='hdnPostDeptFinalApprovedDate']").val();
    !!PostTravelFinalApprovalDate ? PostTravelFinalApprovalDate : "";

    AccountUse += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody><tr>";
    AccountUse += "<td class='LabelText'>Pre-Travel Authorised by</td><td class='LabelText'>Post-Travel Authorised by</td>";
    AccountUse += "<td class='LabelText' colspan='2'>Accounts Use</td></tr>";
    AccountUse += "<tr><td>" + PreTravelFinalApprover + "</td><td>" + PostTravelFinalApprover + "</td>";
    AccountUse += "<td><b>Net Payable to Staff/Company (" + baseCurrency + " $)</b></td><td style='text-align:right'>" + NetPayToStaff + "</td>";
    AccountUse += "<tr><td><b>Date:</b>" + PreTravelFinalApprovalDate + "</td><td><b>Date:</b>" + PostTravelFinalApprovalDate + "</td>";
    AccountUse += "<td><b>Pay through Payroll</b></td><td style='text-align:right'>" + PayPayroll + "</td></tr>";
    AccountUse += "<tr><td colspan='2' rowspan='3'><b>Remarks : </b>" + lsRemarks + "</td><td><b>" + langArray["fldPaythroughFinance"] + "</b></td><td style='text-align:right'>" + PayFinance + "</td></tr>";
    AccountUse += "<tr><td class='LabelText'>Approved By</td><td class='LabelText'>Checked By</td></tr><tr><td style='height:100px;width:25%'></td><td style='width:25%'></td></tr></tbody></table>";



    var postDeptDate = $("input[fldTitle='hdnpostDeptDate']").val();
    postDeptDate = !!postDeptDate ? postDeptDate : "";
    var postArrDate = $("input[fldTitle='hdnpostArrDate']").val();
    postArrDate = !!postArrDate ? postArrDate : "";
    var postDeptTime = $("input[fldTitle='hdnpostDeptTime']").val();
    postDeptTime = !!postDeptTime ? postDeptTime : "";
    var postArrTime = $("input[fldTitle='hdnpostArrTime']").val();
    postArrTime = !!postArrTime ? postArrTime : "";
    var PostActNoDays = $("input[fldTitle='hdnPostActNoDays']").val();
    PostActNoDays = !!PostActNoDays ? PostActNoDays : "";
    POSTDetails = postDeptDate + " " + postDeptTime + " to " + postArrDate + " " + postArrTime + " (" + PostActNoDays + " days)";

    PostTrvDet += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'>";
    PostTrvDet += "<tr><td colspan='2' class='LabelText'>Post-Travel Details</td></tr>";
    PostTrvDet += "<tr><td>Actual Departure & Arrival Date/Time</td><td>" + POSTDetails + "</td></tr>";
    PostTrvDet += "</table>";

    document.getElementById("printAccountUseSection").innerHTML = AccountUse;
    document.getElementById("printAccountUseSection2").innerHTML = PostTrvDet;
    if (PrintTill == "PrintAll") {
        var rowCnt = $("#idTblEXP tbody").children().length
        var expDetailFullValue = "";
        var expTableDetails = "";
        // document.getElementById("printExpenseSection").innerHTML = "";
        document.getElementById("printAllExpenseDetails").innerHTML = "";
        document.getElementById("printPaymentSummary").innerHTML = "";
        if (rowCnt > 0) {
            expTableDetails = getExpenseTable();
            for (var i = 0; i < allExpenses.length; i++) {
                var flagcount = false;
                expTableName = allExpenses[i].split("~")[1]
                tableID = getExpTypeTblID(allExpenses[i].split("~")[0]);
                if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                    // Print the Detail section
                    expDetailFullValue += "<div class='print print-primary width100per' style='display: inline-block;border: 0px solid #337ab7; border-radius: 5px; margin: 1px 0px !important; padding: 2px !important;'>";
                    //expDetailFullValue += printDetailSection(tableID, expTableName);
                    expDetailFullValue += formatPrintDisplay(tableID + "D");
                }
                if (tableID != "idTblATC") {
                    if (tableID == "idTblAPT" || tableID == "idTblACC" || tableID == "idTblVSA") {
                        $(tableRowSelector(tableID)).each(function () {
                            if (flagcount == false) {
                                if ($(this).find(".ticketArrBy").length > 0) {
                                    if ($(this).find(".ticketArrBy").text().toLowerCase() == "employee") {
                                        expDetailFullValue += formatPrintDisplay(tableID);
                                        flagcount = true;

                                    }
                                }
                            }
                        });
                    }
                    else {
                        expDetailFullValue += formatPrintDisplay(tableID);
                    }

                }
                if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                    expDetailFullValue += "</div>";
                }
            }
            document.getElementById("printAllExpenseDetails").innerHTML = expDetailFullValue;
            var paymentSummary = "";
            paymentSummary = printPaymentSummary();
            document.getElementById("printPaymentSummary").innerHTML = paymentSummary;
            //document.getElementById("printExpenseSection").innerHTML = expTableDetails;
        }
    } // PrintTill condition ends here....
    $("#printTravelData").find("*").each(function () {
        $(this).addClass("printRules");
    });
    $("#printTravelData>.modal-body")[0].scrollTop = 0
    document.all("idBtnPrintPopup").click();
    document.getElementById("printExchangeRateDetails").style.display = "none";
    document.getElementById("printApprovalSummary").style.display = "none";
    document.getElementById("printAttachmentDetails").style.display = "none";
    document.getElementById("printReviewerDetails").style.display = "none";
    document.getElementById("printAccountsAndPaymentSummary").style.display = "none";
    printFlgLessDetails = false;
}
function formatTravelFields_Print(tr, fldLabel, fldID, fldClass, prePost) {
    var formatText = "";
    var headStr = "";
    var valStr = "";
    var cls = "";
    var excludeinPrint = ["NA", "", "Dep. City", "Arr. City", "Flight Number", "Additional One Day", "Cancel Trip?", "Transport Mode", "Max. Allowable Allowance", "Sub Type", "Airport Name", "Zone", "Flight No", "Receipt Date", "Receipt", "Cust./Ind. Zone", "Category", "Person Count", "Last Claim Date", "Mode", "Last Claim Amt", "Trans. Mode", "Province", "Visiting Route", "Days", "Invoice Date", "VISA #", "Place", "Per Head Amt", "Invoice Number", "Max Value for Per Night Share", "Vendor #", "Per Night Share", "Invoice #", "No. of Days", "BRN #", "Cost Center", "Comp. B'Fast", "Comp. Lunch", "Charge To Fact", "Charge to Fact.", "Charge To Fact.", "Comp. Dinner", "Receipt #", "Kms(Master)", "KMs(Actual)", "Place To", "Place From", "Description"];
    excludeinPrint.forEach(function (label, idx) {
        while (fldLabel.indexOf(label) != -1) { // Remove Description
            var tmpIdx = fldLabel.indexOf(label);
            fldLabel[tmpIdx] = "NOTREQUIRED";
            fldID[tmpIdx] = "NOTREQUIRED";
        }
    });
    if (tr.index() == 0) {
        headStr = "<thead><tr>";
        for (var i = 0; i < 3; i++) {
            for (var j = i; j < fldLabel.length; j += 3) {
                if (fldLabel[j] != "NOTREQUIRED")
                    headStr += "<th>" + fldLabel[j] + "</th>";
            }
        }
        headStr += "</tr></thead>";
        valStr += "<tbody>";
    }
    if (tr.closest("table").attr("id") == "idTblTSH" && $.trim(tr.find("#idTSHisTravelled").text()) == "Yes") {
        valStr += "<tr style='text-decoration:line-through'>";
    }
    else {
        valStr += "<tr>";
    }
    for (var i = 0; i < 3; i++) {
        for (var j = i; j < fldID.length; j += 3) {
            cls = fldClass[j] == "" ? "" : "class=" + fldClass[j];
            if (fldID[j] != "NOTREQUIRED") {
                valStr += "<td " + cls + ">" + tr.find("#" + fldID[j]).text() + "</td>";
            }
        }
    }
    valStr += "</tr>";
    formatText = headStr + valStr;
    return formatText;
}

function formatPrintDisplay(tblID, tr) {
    switch (tblID) {
        case 'idTblMIL':   //Mileage Expense
            return formatPrintMIL(tr);
            break;
        case 'idTblOTH':   //Mileage Expense
            return formatPrintOTH(tr);
            break;
        case 'idTblMED':  //Medical Expense
            return formatPrintMED(tr);
            break
        case 'idTblVSA':   //VISA Claim
            return formatPrintVSA(tr);
            break;
        case 'idTblMIS':   //Miscellaneous
            return formatPrintMIS(tr);
            break;
        case 'idTblACC':  //Accommodation Travel
            return formatPrintACC(tr);
            break;
        case 'idTblATC':  //Air Ticket Cost
            return formatPrintATC(tr);
            break;
        case 'idTblCOM':  //Communication Travel
            return formatPrintCOM(tr);
            break;
        case 'idTblDA':  //DailyAllowance Travel
            return formatPrintDA(tr);
            break;
        case 'idTblENT': //Entertainment Expense
            return formatPrintENT(tr);
            break;
        case 'idTblENTD': //Entertainment Details
            return formatPrintENTD(tr);
            break;
        case 'idTblPAS': //Passport Claim
            return formatPrintPAS(tr);
            break;
        case 'idTblPRP': //Preparation Claim
            return formatPrintPRP(tr);
            break;
        case 'idTblTSP':  //Transportation Expense
            return formatPrintTSP(tr);
            break;
        case 'idTblCA':   //Compensation Allowance
            return formatPrintCA(tr);
            break;
        case 'idTblTRNC':   // Trainers Cost Expense
            return formatPrintTRNC(tr);
            break;
        case 'idTblEXB':   //Excess Baggage Claim
            return formatPrintEXB(tr);
            break;
        case 'idTblLAU':   //Laundry
            return formatPrintLAN(tr);
            break;
        case 'idTblAPT':   //Airport Tax Expense
            return formatPrintAPT(tr);
            break;
        case 'idTblGIFT': //Gift Expense
            return formatPrintGIFT(tr);
            break;
        case 'idTblGIFTD': //Gift Details
            return formatPrintGIFTD(tr);
            break;
        case 'idTblTSH': //Travel Schedule
            return formatPrintTSH(tr);
            break;
        case 'idTblACCENT':  //Accounting Enteries
            return formatPrintACCENT(tr);
            break;
        case 'idTblWIN': //Winter Allowance
            return formatPrintWIN(tr);
            break;
        default:
            return "";
    }
}
function printTravelDetails(tr, fldLabel, fldPrintLanguageLabel, fldID, fldClass, flgTot, totColSpan) {
    var formatText = "";
    var cls = "";
    var EmployeeTotal = 0;
    var flagarranageby = false;
    // var expenseTable = $('#' + tblID).DataTable();
    //var expenseTableCount = parseInt(expenseTable.data().length)
    //if (expenseTableCount > 0) {
    //PIDSKR
    //    if (tblID == "idTblTSH") {
    //        formatText += "";
    //    }
    //    else if (tblID == "idTblENTD" || tblID == "idTblGIFTD") {
    //        formatText += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody><tr height='30'><td width='20%' class='LabelText' style='border-bottom:0px !important'>" + expTableName + " Details </td></tr></tbody></table>"
    //    }
    //    else {
    //        formatText += "<table border='0' width='100%' style='border-collapse:collapse;margin-top:20px' class='tabledisplay'><tbody><tr height='30'><td width='20%' class='LabelText' style='border-bottom:0px !important'>" + expTableName + " Expenses </td></tr></tbody></table>"
    //    }
    //    drawDataTbl(tblID, true);
    //    formatText += "<table  border='0' width='100%' style='border-collapse:collapse' class='tabledisplay'>";
    // $(tableRowSelector(tblID)).each(function () {
    // var LCAmt = 0;
    var val = "";
    //tr = $(this);
    if (tr.index() == 0) {
        formatText += "<thead><tr>";
        for (var j = 0; j < fldLabel.length; j++) {
            fldPrintLblName = langArray[fldPrintLanguageLabel[j]];
            if (fldLabel[j] == "S.#")
                //formatText += "<th style='width:37px !important;font-weight: bold;'>" + fldLabel[j"] + "</th>";
                formatText += "<th style='width:37px !important;font-weight: bold;'>" + fldPrintLblName + "</th>";
            else
                //formatText += "<th style='font-weight: bold;'>" + fldLabel[j"] + "</th>";
                formatText += "<th style='font-weight: bold;'>" + fldPrintLblName + "</th>";
        }
        formatText += "</tr></thead>";
        formatText += "<tbody>";
    }

    if (tr.closest("table").attr("id") == "idTblTSH" && $.trim(tr.find("#idTSHisTravelled").text()) == "Yes") {
        formatText += "<tr style='text-decoration:line-through'>";
    }
    else {
        formatText += "<tr>";
    }
    //if (tblID == "idTblAPT" || tableID == "idTblACC" || tblID == "idTblVSA") {
    //    if ($(this).find(".ticketArrBy").length > 0) {
    //        if ($(this).find(".ticketArrBy").text().toLowerCase() != "company") {
    //            LCAmt = parseFloat(outputNumber($(this).find("td span.lcamt").text()));
    //            if (LCAmt == "") {
    //                return;
    //            }
    //            if (!isNaN(LCAmt) && LCAmt.length != 0) {
    //                EmployeeTotal += LCAmt;
    //            }
    //            for (var i = 0; i < fldID.length; i++) {
    //                cls = fldClass[i] == "" ? "" : "class=" + fldClass[i];
    //                formatText += "<td style='word-wrap:break-word' " + cls + ">" + tr.find("#" + fldID[i]).text() + "</td>";
    //            }
    //        }
    //    }
    //    flagarranageby = true;
    //}
    // else {
    for (var i = 0; i < fldID.length; i++) {
        cls = fldClass[i] == "" ? "" : "class=" + fldClass[i];
        formatText += "<td style='word-wrap:break-word' " + cls + ">" + tr.find("#" + fldID[i]).text() + "</td>";
    }
    //}
    formatText += "</tr>";
    // });
    //Removed for PIDSKR
    //if (flgTot) {
    //    if (flagarranageby)
    //        formatText += "<tfoot><tr><td style='text-align:right;font-weight: bold;' colspan='" + totColSpan + "'>" + expTableName + " Sub Total (SGD)</td><td style='text-align:right'>" + outputMoney(EmployeeTotal) + "</td>";
    //    else
    //        formatText += "<tfoot><tr><td style='text-align:right;font-weight: bold;' colspan='" + totColSpan + "'>" + expTableName + " Sub Total (SGD)</td><td style='text-align:right'>" + $("#" + tblID + ">tfoot>tr").find(".totalamt").text() + "</td>";
    //    if (fldID.length > (totColSpan + 1)) {
    //        formatText += "<td colspan='" + (fldID.length - totColSpan - 1) + "'></td></tr>";
    //    }
    //    else {
    //        formatText += "</tr>";
    //    }
    //    val = arrExpCodes[0][tblID];
    //    var expRow = $("tr[expcode='" + val + "']");
    //    var remark = $.trim(expRow.find("#idExpRemarksText").val());
    //    formatText += "<tr><td>Remarks : </td><td colspan='" + (fldID.length - 1) + "'>" + remark + "</td></tr>";

    //}
    //formatText += "</tfoot></tbody></table>";
    // formatText += "</tbody></table>";
    // drawDataTbl(tblID, false);
    // }
    // formatText += "</div></div></div>";
    return formatText;
}
function formatPrintTSH(tblID) {
    var fldLabel = ["Dep. Country", "Arr. Country", "Dep. Date", "Arr. Date", "Dep. Time", "Arr. Time", "Description"];
    var fldPrintLanguageLabel = ["fldDepCountry", "fldArrCountry", "fldDepDate", "fldArrDate", "fldDepTime", "fldArrTime", "fldDescription"];
    var fldID = ["idTSHDepCntry", "idTSHDestCntry", "idTSHDepDate", "idTSHArrDate", "idTSHDepTime", "idTSHArrTime", "idTSHDesc"];
    var fldClass = ["", "", "", "", "", "", ""];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, false, 0);
    return strPrintData;
}
function formatPrintDA(tblID) {
    var fldLabel = ["S.#", "Country", "Allowance Type", "Currency", "DA Rate", "Actual No. Of Days", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idDASNo", "idDACountry", "idDAAllowType", "idDACurrency", "idDADailyRate", "idDAActualNoofDays", "idDAFCAmt", "idDAExrate", "idDALCAmt"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCountry", "fldAllowanceType", "fldCurr", "fldDARate", "fldActualNoOfDays", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 8);
    return strPrintData;
}
function formatPrintMIL(tblID) {
    var fldID = ["idMILSNo", "idMILCardType", "idMILCardNo", "idMILTransID", "idMILTransDetails", "idMILCardAmount", "idMILDate", "idMILType", "idMILClaimCurr", "idMILClaimAmt", "idMILExRate", "idMILLCAmt"]
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Date", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"]
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldDate", "fldExpenseType", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"]
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldPrintLanguageLabel, fldClass, true, 6);
    return strPrintData;
}
function formatPrintOTH(tblID) {
    var fldID = ["idOTHSNo", "idOTHCardType", "idOTHCardNo", "idOTHTransID", "idOTHTransDetails", "idOTHCardAmount", "idOTHDate", "idOTHType", "idOTHClaimCurr", "idOTHClaimAmt", "idOTHExRate", "idOTHLCAmt"];
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Date", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldDate", "fldExpenseType", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintMED(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idMEDSNo", "idMEDCardType", "idMEDCardNo", "idMEDTransID", "idMEDTransDetails", "idMEDCardAmount", "idMEDType", "idMEDClaimCurr", "idMEDClaimAmt", "idMEDExRate", "idMEDLCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintVSA(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Country/City", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idVSASNo", "idVSACardType", "idVSACardNo", "idVSATransID", "idVSATransDetails", "idVSACardAmount", "idVSACountry", "idVSAExpTyp", "idVSACurrency", "idVSAFCAmt", "idVSAExRate", "idVSALCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintMIS(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idMISSNo", "idMISCardType", "idMISCardNo", "idMISTransID", "idMISTransDetails", "idMISCardAmount", "idMISExpTyp", "idMISCurncy", "idMISFCAmt", "idMISExRate", "idMISLCAmt"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldExpenseType", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintACC(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Hotel Name", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD", ];
    var fldID = ["idACCSNo", "idACCCardType", "idACCCardNo", "idACCTransID", "idACCTransDetails", "idACCCardAmount", "idACCHotelName", "idACCCurrency", "idACCFCAmt", "idACCExRate", "idACCLCAmt"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldHotelName", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"]
    var fldClass = ["", "", "", "", "", "amount", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldPrintLanguageLabel, fldClass, true, 5);
    return strPrintData;
}
function formatPrintATC(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idATCSNo", "idATCCardType", "idATCCardNo", "idATCTransID", "idATCTransDetails", "idATCCardAmount", "idATCCurrency", "idATCFCAmt", "idATCExRate", "idATCLCAmt"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"]
    var fldClass = ["", "", "", "", "", "amount", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 4);
    return strPrintData;
}
function formatPrintCOM(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Details", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idCOMSNo", "idCOMCardType", "idCOMCardNo", "idCOMTransID", "idCOMTransDetails", "idCOMCardAmount", "idCOMDesc", "idCOMExpType", "idCOMCurrency", "idCOMFCAmt", "idCOMExRate", "idCOMLCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintENT(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Date", "Place", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idENTSNo", "idENTCardType", "idENTCardNo", "idENTTransID", "idENTTransDetails", "idENTCardAmount", "idENTDate", "idENTPlace", "idENTCurrency", "idENTFCAmt", "idENTExRate", "idENTLCAmt"];
    var fldClass = ["", "", "", "", "amount", "", "", "", "", "amount", "amount", "amount"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldDate", "fldPlace", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"]
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintENTD(tblID) {
    var fldLabel = ["S.#", "PA Attendant", "Customer Name", "Title", "Company Name", "Description", ];
    var fldPrintLanguageLabel = ["fldSNo", "fldPAAttendant", "fldCustomerName", "fldTitle", "fldCompName", "fldDescription", ];
    var fldID = ["idENTDSNo", "idENTDAttendant", "idENTDCustName", "idENTDTitle", "idENTDCompName", "idENTDDesc"];
    var fldClass = ["", "", "", "", "", ""];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, false, 0);
    return strPrintData;
}
function formatPrintPAS(tblID) {
    var fldLabel = ["S.#", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idPASSNo", "idPASExpTypes", "idPASCurrency", "idPASFCAmt", "idPASExRate", "idPASLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintPRP(tblID) {
    var fldLabel = ["S.#", "Expense Type", "Last Claim Date", "Last Claim Amt", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idPRPSNo", "idPRPExpTypes", "idPRPLastClaimDt", "idPRPLastClaimAmt", "idPRPCurrency", "idPRPFCAmt", "idPRPExRate", "idPRPLCAmt"];
    var fldClass = ["", "", "", "amount", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 7);
    return strPrintData;
}
function formatPrintTSP(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Expense Type", "Date", "From", "To", "Currency", "FC Amt", "Exch. Rate", "Receipt Check?", "Amount in SGD"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldExpenseType", "fldDate", "fldFrom", "fldTo", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"];
    var fldID = ["idTSPSno", "idTSPCardType", "idTSPCardNo", "idTSPTransID", "idTSPTransDetails", "idTSPCardAmount", "idTSPExpenseTypes", "idTSPDate", "idTSPFrom", "idTSPTo", "idTSPCurrency", "idTSPFCAmt", "idTSPExchRate", "idTSPReceiptcheck", "idTSPLCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "", "", "amount", "amount", "", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 9);
    return strPrintData;
}
function formatPrintCA(tblID) {
    var fldLabel = ["S.#", "Max. Allowable Allowance", "Details", "Currency", "FC Amt", "From Date", "To Date", "From Time", "To Time", "Days", "Exch. Rate", "Amount in SGD"];
    var fldID = ["idCASno", "idCAMaxAll", "idCADlts", "idCACrr", "idCAFCAmt", "idCAFDate", "idCAToDte", "idCAFTme", "idCAToTme", "idCADys", "idCAExch", "idCALCAmt"];
    var fldClass = ["", "", "", "", "amount", "", "", "", "", "", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 11);
    return strPrintData;
}
function formatPrintTRNC(tblID) {
    var fldLabel = ["S.#", "Details", "Currency", "FC Amt", "Exch. Rate", "Amount in SGD"];
    var fldID = ["idTRNCSNo", "idTRNCDlts", "idTRNCCurcy", "idTRNCFCAmt", "idTRNCExrte", "idTRNCLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintEXB(tblID) {
    var fldLabel = ["S.#", "Excess Wt(Kg)", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idEXBSNo", "idEXBExWght", "idEXBCurncy", "idEXBFCAmt", "idEXBExRate", "idEXBLCAmt"];
    var fldClass = ["", "amount", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintLAN(tblID) {
    var fldLabel = ["S.#", "Date", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idLAUSNo", "idLAUDate", "idLAUCurncy", "idLAUFCAmt", "idLAUExRate", "idLAULCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintAPT(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Country-Name of the Airport", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldCountryNameoftheAirport", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"]
    var fldID = ["idAPTSNo", "idAPTCardType", "idAPTCardNo", "idAPTTransID", "idAPTTransDetails", "idAPTCardAmount", "idAPTAirportName", "idAPTClaimCurr", "idAPTClaimAmt", "idAPTExRate", "idAPTLCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintGIFT(tblID) {
    var fldLabel = ["S.#", "Card Type", "Card No", "Transaction ID", "Transaction", "Card Amount", "Date", "Details", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldPrintLanguageLabel = ["fldSNo", "fldCardType", "fldCardNo", "fldTransactionID", "fldTransaction", "fldCardAmount", "fldDate", "fldDetails", "fldCurr", "fldFCAmt", "fldExchangeRate", "fldAmountinSGD"];
    var fldID = ["idGIFTSNo", "idGIFTCardType", "idGIFTCardNo", "idGIFTTransID", "idGIFTTransDetails", "idGIFTCardAmount", "idGIFTDate", "idGIFTDetails", "idGIFTCurrency", "idGIFTFCAmt", "fldExchangeRate", "idGIFTLCAmt"];
    var fldClass = ["", "", "", "", "", "amount", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldPrintLanguageLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
/*For Lazy Loading need to be at the end of library*/
loadRef.js.print.libLoaded();
/***************************************************/