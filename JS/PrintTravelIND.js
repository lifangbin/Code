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
    var headerString = framePanel("Applicant Details")
    applicantDetails = "<div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 290px;'><table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'>";
    $("#generalDtls").find(".app_table").find(".header_section1").find("li").each(function () {
        lbl = $(this).find("label").text();
        val = $(this).find("span>*").is("span") ? $(this).find("span>*").text() : $(this).find("span>*").val();
        applicantDetails += "<tr style='width:100%;'><td colspan='1'>" + lbl + "</td><td colspan='2'>" + val + "</td></tr>";
    })
    applicantDetails += "</table></div><div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 290px;'><table class='table table-bordered pad-10' style='table-layout: fixed;'>";
    $("#generalDtls").find(".app_table").find(".header_section2").find("li").each(function () {
        lbl = $(this).find("label").text();
        Txt = !!$(this).find("span>*").text() ? $(this).find("span>*").text() : "";
        Valu = !!$(this).find("span>*").val() ? $(this).find("span>*").val() : "";
        val = $(this).find("span>*").is("span") ? Txt : Valu;
        applicantDetails += "<tr style='width:100%;'><td colspan='1'>" + lbl + "</td><td colspan='2'>" + val + "</td></tr>";
    })

    return headerString + applicantDetails + "</div></div></div>";
}
function getApplicantSectionLessDetails() {
    var applicantDetails = "";
    var lbl = "";
    var val = "";
    var headerString = framePanel("Applicant Details");
    applicantDetails = "<div class='half-width' style='width: 100%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 290px;'><table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'>";
    applicantDetails += "<tr style='width:100%;'><td colspan='1'>Name in Passport</td><td colspan='5'>" + $.trim($("#idlblPassportName").text()) + "</td></tr>";
    applicantDetails += "<tr style='width:100%;'><td colspan='1'> Name of the Applicant</td><td colspan='5'>" + $.trim($("#idlblApplicantName").text()) + "</td></tr>";
    //var staffStatus = $("input[fldTitle='hdnddlStaffStatus']").val();
    //staffStatus = ((staffStatus) == undefined || (staffStatus) == "" ? "" : staffStatus);
    var staffGrade = $("input[fldTitle='hdnStaffGrade']").val();
    staffGrade = ((staffGrade) == undefined || (staffGrade) == "" ? "" : staffGrade);
    var ChrgToPC = $("input[fldTitle='hdnChargeToPC']").val() == undefined || $("input[fldTitle='hdnChargeToPC']").val() == "Select" || $("input[fldTitle='hdnChargeToPC']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPC']").val();
    var ChrgToPCDisp = $("input[fldTitle='hdnChargeToPCDisplay']").val() == undefined || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "Select" || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPCDisplay']").val();
    //applicantDetails += "<tr style='width:100%;'><td colspan='1'> Division </td><td colspan='2'>" + $.trim($("#idlblDivName").text()) + "</td><td colspan='1'>Staff Status</td><td colspan='2'>" + staffStatus + "</td></tr>";
    applicantDetails += "<tr style='width:100%;'><td colspan='1'> Division </td><td colspan='2'>" + $.trim($("#idlblDivName").text()) + "</td></tr>";
    applicantDetails += "<tr style='width:100%;'><td colspan='1'>Department / Section</td><td colspan='2'>" + $.trim($("#idlblDeptName").text()) + " / " + ChrgToPC + "</td><td colspan='1'>Staff Grade</td><td colspan='2'>" + staffGrade + "</td></tr>";
    //var expat = $("input[fldTitle='Expatriate']").val();
    //applicantDetails += "<tr style='width:100%;'><td colspan='1'>Charge To PC</td><td colspan='2'>" + ChrgToPCDisp + "</td><td colspan='1'>Expatriate</td><td colspan='2'>" + expat + "</td></tr>";
    applicantDetails += "<tr style='width:100%;'><td colspan='1'>Charge To PC</td><td colspan='2'>" + ChrgToPCDisp + "</td></tr>";
    if ($("input[fldTitle='hdnNonAPACRegionReq']").val() == "Yes") {
        var NonAPACReg = $("*[fldtitle=NonAPACRegion]").find("input[type=radio]:checked").val();
        NonAPACReg = ((NonAPACReg) == undefined || (NonAPACReg) == "" ? "" : NonAPACReg);
        applicantDetails += "<tr><td  style='width: 50%;'colspan='3'>Non-APAC Region<small>(Europe, China, Hong Kong,Taiwan, Korea, USA, Japan & Latin America.)</small></td><td colspan='3'>" + NonAPACReg + "</td></tr>";
    }
    applicantDetails += "</table></div>";
    return headerString + applicantDetails + "</div></div></div>";
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
    BasicInfo += "<table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'>";
    BasicInfo += "<thead><tr><<HEADER>></tr></thead>"
    BasicInfo += "<tr><tbody>";
    var tblHeader = "";
    if ($("input[fldTitle='hdnUrgentTripAllowed']").val() == "Yes") {
        tblHeader += "<th>Urgent Trip</th>";
        BasicInfo += "<td>" + urgTrip + "</td>";
    }
    var ClsOfTrvel = $("input[fldTitle='hdnClassOfTravel']").val() == undefined || $("input[fldTitle='hdnClassOfTravel']").val() == "Select" || $("input[fldTitle='hdnClassOfTravel']").val() == "" ? "" : $("input[fldTitle='hdnClassOfTravel']").val();
    tblHeader += "<th>Class Of Travel</th>";
    BasicInfo += "<td>" + ClsOfTrvel + "</td>";
    var TrvType = $("input[fldTitle='hdnTravelType']").val() == undefined || $("input[fldTitle='hdnTravelType']").val() == "Select" || $("input[fldTitle='hdnTravelType']").val() == "" ? "" : $("input[fldTitle='hdnTravelType']").val();
    tblHeader += "<th>Travel Type</th>";
    BasicInfo += "<td>" + TrvType + "</td>";
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        var BudType = $("input[fldTitle='hdnBudgetType']").val() == undefined || $("input[fldTitle='hdnBudgetType']").val() == "Select" || $("input[fldTitle='hdnBudgetType']").val() == "" ? "" : $("input[fldTitle='hdnBudgetType']").val();
        tblHeader += "<th>Budget Type</th>";
        BasicInfo += "<td>" + BudType + "</td>";
    }
    tblHeader += "<th>Travelling To</th>";
    BasicInfo += "<td>" + TravellingTo + "</td>";
    if ($("input[fldTitle='hdnTravelNationsReq']").val() == "Yes") {
        var TravelArea = $("input[fldTitle='hdnTravelNations']").val() == undefined || $("input[fldTitle='hdnTravelNations']").val() == "Select" || $("input[fldTitle='hdnTravelNations']").val() == "" ? "" : $("input[fldTitle='hdnTravelNations']").val();
        tblHeader += "<th>Travel Area</th>";
        BasicInfo += "<td>" + TravelArea + "</td>";
    }
    var ChrgToPC = $("input[fldTitle='hdnChargeToPCDisplay']").val() == undefined || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "Select" || $("input[fldTitle='hdnChargeToPCDisplay']").val() == "" ? "" : $("input[fldTitle='hdnChargeToPCDisplay']").val();
    tblHeader += "<th>Charge To PC</th>";
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
        tblHeader += "<th>GL Code</th>";
        BasicInfo += "<td>" + GLCode + "</td>";
    }
    BasicInfo += "</tbody></tr>";
    BasicInfo = BasicInfo.replace("<<HEADER>>", tblHeader);
    BasicInfo += "</table>";
    if ($("input[fldTitle='hdnNonAPACRegionReq']").val() == "Yes") {
        var NonAPACReg = $("*[fldtitle=NonAPACRegion]").find("input[type=radio]:checked").val();
        NonAPACReg = ((NonAPACReg) == undefined || (NonAPACReg) == "" ? "" : NonAPACReg);
        BasicInfo += "<table  class='table table-bordered' style='margin: 0 auto; table-layout: fixed;'>";
        BasicInfo += "<tr><th  style='width: 60%;'>Non-APAC Region<small>(Europe, China, Hong Kong,Taiwan, Korea, USA, Japan & Latin America.)</small></th><td>" + NonAPACReg + "</td></tr>";
        BasicInfo += "</table>";
    }
    return BasicInfo;
}
function getBasicTravelLessInfo() {
    var BasicInfo = "";
    var preDetails = "";
    BasicInfo += "<table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'>";
    BasicInfo += "<thead><tr><<HEADER>></tr></thead>"
    BasicInfo += "<tr><tbody>";
    var tblHeader = "";
    var ClsOfTrvel = $("input[fldTitle='hdnClassOfTravel']").val() == undefined || $("input[fldTitle='hdnClassOfTravel']").val() == "Select" || $("input[fldTitle='hdnClassOfTravel']").val() == "" ? "" : $("input[fldTitle='hdnClassOfTravel']").val();
    tblHeader += "<th>Class Of Travel</th>";
    BasicInfo += "<td>" + ClsOfTrvel + "</td>";
    var TrvType = $("input[fldTitle='hdnTravelType']").val() == undefined || $("input[fldTitle='hdnTravelType']").val() == "Select" || $("input[fldTitle='hdnTravelType']").val() == "" ? "" : $("input[fldTitle='hdnTravelType']").val();
    tblHeader += "<th>Travel Type</th>";
    BasicInfo += "<td>" + TrvType + "</td>";
    tblHeader += "<th>Travelling To</th>";
    BasicInfo += "<td>" + TravellingTo + "</td>";
    if ($("input[fldTitle='hdnTravelNationsReq']").val() == "Yes") {
        var TravelArea = $("input[fldTitle='hdnTravelNations']").val() == undefined || $("input[fldTitle='hdnTravelNations']").val() == "Select" || $("input[fldTitle='hdnTravelNations']").val() == "" ? "" : $("input[fldTitle='hdnTravelNations']").val();
        tblHeader += "<th>Travel Area</th>";
        BasicInfo += "<td>" + TravelArea + "</td>";
    }
    BasicInfo += "</tr>";
    var preDeptDate = $("input[fldTitle='hdnpreDeptDate']").val();
    preDeptDate = !!preDeptDate ? preDeptDate : "";
    var preArrDate = $("input[fldTitle='hdnpreArrDate']").val();
    preArrDate = !!preArrDate ? preArrDate : "";
    var PreActNoDays = $("input[fldTitle='hdnPreActNoDays']").val();
    PreActNoDays = !!PreActNoDays ? PreActNoDays : "";
    var preDetails = preDeptDate + " to " + preArrDate + " (" + PreActNoDays + " days)"
    BasicInfo += "<tr><td>Date Of Pre-Travel</td><td colspan='3'>" + preDetails + "</td></tr>";

    BasicInfo = BasicInfo.replace("<<HEADER>>", tblHeader);
    BasicInfo += "</tbody></table>";
    return BasicInfo;
}
function getBudgetInfo() {
    var budTable = "";
    budTable = "<label class='print-pad-top' style='    padding: 15px;  width: 100%;    display: block;   float: left; '>Budget History:</label> <br><div class='add-div' style='    padding: 15px;  max-width: 100%;  width: 100%;'> <table class='table table-bordered'><thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>"
    budTable += "<tr><td>Budget Key</td><td>Budget Amount</td><td>Available Budget</td><td>Amount Applied</td><td>Surplus/Deficit</td></tr></thead>"
    budTable += "<tbody><tr>";

    $("#idTblBUD").find("tbody").find("tr").find("td").each(function () {
        lbl = $(this).text();
        if (lbl != "")
            budTable += "<td style='text-align: right;'>" + lbl + "</td>";
    });
    budTable += "</tr></tbody></table>";
    return budTable;
}
function getExpBudgetInfo() {
    var budTable = "";
    budTable = "<label class='print-pad-top' style='    padding: 15px;  width: 100%;    display: block;   float: left; '>Budget History:</label> <br><div class='add-div' style='    padding: 15px;  max-width: 100%;  width: 100%;'> <table class='table table-bordered'><thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>"
    budTable += "<tr><td>Budget Key</td><td>Budget Amount</td><td>Available Budget </td><td>Amount Applied</td><td>Surplus/Deficit</td></tr></thead>"
    budTable += "<tbody>";

    $("#idTblBUDPS").find("tbody").find("tr").each(function () {
        budTable += "<tr>";
        $(this).find("td").each(function () {
            lbl = $(this).text();
            if (lbl != "")
                budTable += "<td style='text-align: right;'>" + lbl + "</td>";
        });
        budTable += "</tr>";
    });
    budTable += "</tbody></table>";
    return budTable;
}
function getExpRemarks() {
    var remarkTable = "";
    remarkTable = "<label class='print-pad-top' style='    padding: 15px;  width: 100%;    display: block;   float: left; '>Expense Remarks:</label> <br><div class='add-div' style='    padding: 15px;  max-width: 100%;  width: 100%;'> <table class='table table-bordered'><thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>"
    remarkTable += "<tr><td class='col-md-3'>Expense Type</td><td class='col-md-9'>Remarks</td></tr></thead>"
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
    var returnStr = "<div class='form-group' style='height: auto; margin: 15px auto 0px auto;  float: left;  width: 100%;'><label style='padding:15px 0 5px 0;'>Reason For Travel (Host Company/Person/Purpose of Visit) : </label><span class='col-sm-12 txtCtrl mandatory'>" + ReasonForTravel + "</span></div>";
    var ReasonForLateTravel = $("textarea[fldTitle='ReasonForLate']").val();
    ReasonForLateTravel = ReasonForLateTravel.replace(/\r?\n/g, '. ');
    if (!!ReasonForLateTravel) {
        returnStr += "<div class='form-group' style='height: auto;margin: 0px auto 0px auto;  float: left;  width: 100%;'><label style='padding:15px 0px 5px 0px;'>Reason For Late Submission : </label><span class='col-sm-12 txtCtrl mandatory'>" + ReasonForLateTravel + "</span></div>";
    }
    returnStr += "<br>"
    return returnStr;
}

function getTravelSchedule() {
    var TravelSchedule = "";
    TravelSchedule += "<div class='box-body' style = 'padding: 0 0px; float: left;  display: inline-block;    width: 100%;    min-height: 200px;    height: 100%;   margin: 0 auto 20px auto;'>"
    TravelSchedule += "<div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block;margin: 0 auto;min-height: 200px;'>";
    TravelSchedule += " <table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'>";
    //var staffStatus = $("input[fldTitle='hdnddlStaffStatus']").val();
    //staffStatus = ((staffStatus) == undefined || (staffStatus) == "" ? "" : staffStatus);
    //TravelSchedule += "<tr style='width:100%;'><td colspan='1'> Staff Status </td><td colspan='2'>" + staffStatus + "</td></tr>"
    var TickCordReq = $("*[fldtitle=TktCoordinatorReq]").find("input[type=radio]:checked").val();
    TickCordReq = ((TickCordReq) == undefined || (TickCordReq) == "" ? "" : TickCordReq);
    TravelSchedule += "<tr style='width:100%;'><td colspan='1'> Tkt. Coordinator Req </td><td colspan='2'>" + TickCordReq + "</td></tr>";
    //if ($("input[fldTitle='hdnTaxLocRequired']").val() == "Yes") {
    //    var TaxLocation = $("input[fldTitle='TaxLocation']").val();
    //    TaxLocation = ((TaxLocation) == undefined || (TaxLocation) == "" ? "" : TaxLocation);
    //    TravelSchedule += "<tr style='width:100%;'><td colspan='1'> Tax Location </td><td colspan='2'>" + TaxLocation + "</td></tr>"
    //}
    if ($("input[fldTitle='hdnPCCarryReq']").val() == "Yes") {
        var PCCarryOut = $("*[fldtitle=PCCarryOut]").find("input[type=radio]:checked").val();
        PCCarryOut = ((PCCarryOut) == undefined || (PCCarryOut) == "" ? "" : PCCarryOut);
        TravelSchedule += "<tr style='width:100%;'><td colspan='1'> PC Carry Out </td><td colspan='2'>" + PCCarryOut + "</td></tr>";
    }
    if ($("input[fldTitle='hdnDataPlanReqd']").val() == "Yes") {
        var roamingPlan = $("*[fldtitle=ApplyRoamingData]").find("input[type=radio]:checked");
        roamingPlan = roamingPlan.val()
        if (roamingPlan == undefined || roamingPlan == "")
            roamingPlan = " - ";
        else
            roamingPlan;
        TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  Apply Roaming Data Plan  </td><td colspan='2'>" + roamingPlan + "</td></tr>"
    }
    TravelSchedule += "</table></div>";
    TravelSchedule += "<div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block;margin: 0 auto;min-height: 200px;'><table style='margin: 0 auto; table-layout: fixed;' class='table table-bordered pad-10'>";
    //var expat = $("input[fldTitle='Expatriate']").val();
    //TravelSchedule += "<tr style='width:100%;'><td colspan='1'> Expatriate </td><td colspan='2'>" + expat + "</td></tr>"
    var tickCord = $("input[fldTitle='hdnTicketCoordinator']").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == undefined || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "" || $("select[fldTitle='TicketCoordinator'] option:selected").val() == "Select" ? "" : $("select[fldTitle='TicketCoordinator'] option:selected").val();
    TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  Ticket Co-Ordinator  </td><td colspan='2'>" + tickCord + "</td></tr>"
    //if ($("input[fldTitle='hdnBusinessPlaceReq']").val() == "Yes") {
    //    var BusinessPlace = $("input[fldTitle='BusinessPlace']").val();
    //    TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  Business Place  </td><td colspan='2'>" + BusinessPlace + "</td></tr>"
    //}
    if ($("input[fldTitle='hdnPCCarryReq']").val() == "Yes") {
        var eISMRef = $("textarea[fldTitle='eISMRef']").val();
        TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  eLaptop Ref#  </td><td colspan='2'>" + eISMRef + "</td></tr>"
    }
    //if ($("input[fldTitle='hdnWBSReq']").val() == "Yes") {
    //    var WBS = $("input[fldTitle='WBS']").val();
    //    TravelSchedule += "<tr style='width:100%;'><td colspan='1'>  WBS#  </td><td colspan='2'>" + WBS + "</td></tr>"
    //}
    TravelSchedule += "</table></div></div>";
    TravelSchedule += framePanel("Travel Schedule");
    // Travel Schedule Summery
    TravelSchedule += "<label class='print-pad-top'>Travel Schedule Summary :</label>"
    TravelSchedule += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>"
    TravelSchedule += document.getElementById("idTblTSHSummary").innerHTML;
    TravelSchedule += "</table>";
    // Travel details
    TravelSchedule += "<label class='print-pad-top'>Travel Details :</label>";
    if (printFlg) {
        TravelSchedule += "<table class='table table-bordered justified'>";
    }
    drawDataTbl("idTblTSH", true);
    $(tableRowSelector("idTblTSH")).each(function () {
        TravelSchedule += formatDisplay("idTblTSH", $(this));
    });
    drawDataTbl("idTblTSH", false);
    if (printFlg) {
        TravelSchedule += "<tbody></table>";
    }
    TravelSchedule += "</div>"
    return TravelSchedule;
}
function getTravelScheduleLessDetails() {
    var TravelSchedule = "";
    TravelSchedule += framePanel("Travel Schedule");
    TravelSchedule += "<label class='print-pad-top'>Travel Details :</label>";
    if (printFlgLessDetails) {
        TravelSchedule += "<table class='table table-bordered justified' style='table-layout: fixed;'>";
    }
    drawDataTbl("idTblTSH", true);
    TravelSchedule += formatPrintDisplay("idTblTSH");
    drawDataTbl("idTblTSH", false);
    if (printFlgLessDetails) {
        TravelSchedule += "<tbody></table>";
    }
    return TravelSchedule + "</div></div>";
}
function getContactInformation() {
    var contactInfo = "";
    var lbl = "";
    var val = "";
    var contactInfo = framePanel("Contact Information");
    contactInfo += "<table  class='table table-bordered' style='margin: 0px auto; table-layout: fixed;'>";
    //contactInfo += "<thead><tr><th>Home Telephone No</th><th>Mobile Phone No</th><th>Emergency Contact</th><th>Hotel Name</th><th>Hotel Address</th><th>Overseas Contact No</th></tr></thead>"
    contactInfo += "<thead><tr><th>Home Telephone No</th><th>Mobile Phone No</th><th>Hotel Name</th><th>Hotel Address</th><th>Overseas Contact No</th></tr></thead>"
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
    return contactInfo + "</div></div></div></div>";
}
function getTravelInfo() {
    var travelInfo = "";
    travelInfo += framePanel("Application Details")
    travelInfo += getBasicTravelInfo();
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        travelInfo += getBudgetInfo();
    }
    travelInfo += getTravelReason();
    travelInfo += getTravelSchedule();
    travelInfo += getContactInformation();
    travelInfo += "</div></div>";
    return travelInfo;
}
function getTravelLessInfo() {
    var travelInfo = "";
    travelInfo += framePanel("Application Details")
    travelInfo += getBasicTravelLessInfo();
    travelInfo += getTravelReason();
    travelInfo += getTravelScheduleLessDetails();
    travelInfo += getContactInformation();
    //travelInfo += getExportControlDetails();
    travelInfo += "</div></div>";
    return travelInfo;
}
function getExportControlDetails() {
    var expSecValues = "";
    var ExportControl = $("*[fldtitle=ExportControl]").find("input[type=radio]:checked").val();
    ExportControl = ((ExportControl) == undefined || (ExportControl) == "" ? "" : ExportControl);
    ExportControl = "<table  class='table table-bordered pad-10' style='margin: 0 auto; table-layout: fixed;'><tr style='width:100%;'><td style='padding-left: 20px;'> Export Control </td><td colspan='2'>" + ExportControl + "</td></tr><table>";

    var detTable = $('#idTblEXCO').DataTable();
    var detTableCount = parseInt(detTable.data().length)
    if (detTableCount > 0) {

        ExportControl += "<table width=100%><tr><td><h4>Export Control Checklist</h4></td></tr>";
        ExportControl += "<tr><td>When there are, for business purpose, hand carry baggage or controlled technical information on the occasion of an overseas travel, fill in this check sheet and present it to the export committee member.</td></tr>";
        ExportControl += "</table>";
        var expSecValues = framePanel("1. Hand-Carried goods list (All hand carried parts,samples,machines,include those item bringing back)");
        expSecValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
        expSecValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>S.#</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>Name Of Goods/Type No.</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Is it controlled by law of country?</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Has Japan  been notified</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Qty</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>Amount</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Bringing Back</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='2' style='font-size:13px'>Description</th>";
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

        expSecValues += framePanel("2. Controlled Technical Information");
        expSecValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
        expSecValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>S.#</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='3' style='font-size:13px'>Name Of Technical Information/data.</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Is it controlled by law of country?</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Has Japan  been notified</th>";
        expSecValues += "<th nowrap class='sorting_disabled' rowspan='1' colspan='3' style='font-size:13px'>Description</th>";
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
    var RwSection = framePanel("Reviewer's Summary");
    RwSection += "<table class='table table-bordered pad-10'>";
    RwSection += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    RwSection += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>ID</th>";
    RwSection += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='width: 127.01px;'>Actions(s)</th>";
    RwSection += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='width: 275.01px;'>Comments</th>";
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
    RwSection += "</tbody></table></div></div>";
    return RwSection;
}
function printAttachmentDetailsSection() {
    var attSection = framePanel("Attachments");
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
    var accEntryValues = framePanel(ExpenseTitle + " Details");
    //    accEntryValues += "<table class='table table-bordered pad-10'>"
    accEntryValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
    accEntryValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    accEntryValues += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>ID</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>S.#</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Posting Key</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Cost Center</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>GL Code</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Tax Code</th>";
    accEntryValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Amount</th>";
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
    if (title == "Contact Information") {
        var panelData = "<div class='print print-primary width100per' style=' display: table;border: 0px solid #000; border-radius: 0px; margin: 1px 0px !important; padding: 2px !important;'>";
    }
    else if (title == "Travel Schedule") {
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
        detailSectionValues = framePanel(ExpenseTitle + " Details");
        detailSectionValues += "<table class='table table-bordered pad-10 justified' style='table-layout: fixed;'>";
        detailSectionValues += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>S.#</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Attendant</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Company Name</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Title</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Customer Name</th>";
        detailSectionValues += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Purpose</th>";
        detailSectionValues += "</tr>";
        detailSectionValues += "</thead><tbody>";
        $("#" + tblID + "D>tbody>tr").each(function () {
            detailSectionValues += "<tr>"
            $(this).find("td.vmiddle").each(function () {
                detailSectionValues += "<td style='font-size:13px'>" + $(this).find("*").text() + "</td>";
            });
            detailSectionValues += "</tr>"
        });
        detailSectionValues += "</tbody></table></div></div></div>";
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
    internalUse += "<div class='half-width' style='width: 100%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 120px;'><div class='add-div' style=' padding: 15px; max-width: 100%;  width: 100%; height:65px !important'><table class='table table-bordered pad-10'>";
    internalUse += "<tr><th colspan='2'>FOR INTERNAL USE</th></tr>";
    internalUse += "<tr><td>Travel Ref No</td><td>" + docRefNo + "</td></tr>";
    internalUse += "<tr><td>Date</td><td>" + $.trim($("#idlblSubmitDate").text()) + "</td></tr>";
    internalUse += "</table>";
    internalUse += "</div>";
    internalUse += "</div>";
    document.getElementById("dispRefNoForPrint").innerHTML = internalUse;
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
    NetPayToStaff = outputMoney($("input[fldTitle='hdnPostTravelNetPayableAmt']").val());
    !!NetPayToStaff ? NetPayToStaff : 0;
    var PreTravelFinalApprover = "";
    PreTravelFinalApprover = $("input[fldTitle='hdnPreDeptLastReviewer']").val();
    !!PreTravelFinalApprover ? PreTravelFinalApprover : "";
    var PreTravelFinalApprovalDate = "";
    PreTravelFinalApprovalDate = $("input[fldTitle='hdnPreDeptFinalApprovedDate']").val();
    PreTravelFinalApprovalDate = PreTravelFinalApprovalDate.split("/");
    PreTravelFinalApprovalDate = PreTravelFinalApprovalDate[1] + "/" + PreTravelFinalApprovalDate[0] + PreTravelFinalApprovalDate[2];
    !!PreTravelFinalApprovalDate ? PreTravelFinalApprovalDate : "";
    var PostTravelFinalApprover = "";
    PostTravelFinalApprover = $("input[fldTitle='hdnPostDeptLastReviewer']").val();
    !!PostTravelFinalApprover ? PostTravelFinalApprover : "";
    var PostTravelFinalApprovalDate = "";
    PostTravelFinalApprovalDate = $("input[fldTitle='hdnPostDeptFinalApprovedDate']").val();
    !!PostTravelFinalApprovalDate ? PostTravelFinalApprovalDate : "";
    AccountUse += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10'>";
    AccountUse += "<tr><th>Pre-Travel Authorised by</th><th>Post-Travel Authorised by</th><th colspan='2'>Accounts Use</th></tr>";
    AccountUse += "<tr><td>" + PreTravelFinalApprover + "</td><td>" + PostTravelFinalApprover + "</td><td colspan='2'>Net Payable to Staff/Company (" + baseCurrency + " $) : " + NetPayToStaff + "</td></tr>";
    AccountUse += "<tr><td>Date :" + PreTravelFinalApprovalDate + "</td><td>Date :" + PostTravelFinalApprovalDate + "</td><td>Approved By</td><td>Checked By</td></tr>";
    AccountUse += "<tr><td colspan='2' style='padding:0px 0px !important;'>" + lsRemarks + "</td><td style='padding:0px 0px !important;'></td><td style='padding:0px 0px !important;'></td></tr>";
    AccountUse += "</table>";
    AccountUse += "</div>";
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
            //   document.getElementById("printExpenseSection").innerHTML = expTableDetails;
            for (var i = 0; i < allExpenses.length; i++) {
                expTableName = allExpenses[i].split("~")[1]
                tableID = getExpTypeTblID(allExpenses[i].split("~")[0]);

                if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                    // Print the Detail section
                    expDetailFullValue += "<div class='print print-primary width100per' style='display: inline-block;border: 1px solid #337ab7; border-radius: 5px; margin: 1px 0px !important; padding: 2px !important;'>";
                    expDetailFullValue += printDetailSection(tableID, expTableName);
                }
                // Print the expenses section       
                var expenseTable = $('#' + tableID).DataTable();
                var expenseTableCount = parseInt(expenseTable.data().length)
                if (expenseTableCount > 0) {
                    expDetailFullValue += framePanel(expTableName + " Expenses");
                    drawDataTbl(tableID, true);
                    expDetailFullValue += "<table class='table table-bordered justified' style='table-layout: fixed;'>";
                    $(tableRowSelector(tableID)).each(function () {
                        expDetailFullValue += formatDisplay(tableID, $(this));
                    })
                    expDetailFullValue += "</tbody></table>";
                    drawDataTbl(tableID, false);
                }
                expDetailFullValue += "</div></div></div>";
                if (tableID == "idTblENT" || tableID == "idTblGIFT") {
                    expDetailFullValue += "</div>";
                }
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
        if ($('#idTblACCENT').DataTable().rows('.selected').any()) {
            valFound = "Yes";
            accEntry = printAccountingEntries("idTblACCENT", "Accounting Entries")
        }
        if ($('#idTblPAD').DataTable().rows('.selected').any()) {
            paySumm = printPaymentAdvice("idTblPAD", "Payment Advice")
            valFound = "Yes";
        }
        if (valFound == "Yes") {
            _accountsAndPaymentSummary = accEntry + "<br>" + paySumm;
            document.getElementById("printAccountsAndPaymentSummary").innerHTML = accEntry + "<br>" + paySumm;
        }
        // Print Approval Summary
        var approvalSummary = framePanel("Approval Summary");
        approvalSummary += document.getElementById("approvalSum").innerHTML;
        _approvalSummary = approvalSummary;
        document.getElementById("printApprovalSummary").innerHTML = approvalSummary;
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
    var ExRate = framePanel("Exchange Rate")
    ExRate += "<div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 120px;'><div class='add-div' style=' padding: 15px; max-width: 100%;  width: 100%;'> <table class='table table-bordered pad-10'>";
    ExRate += "<tr style='width:100%;'><td> Exchange Rate (Pre): </td><td>" + $("#acEXRATE").find(".app_table:first").find(".header_section1").find("li:first>span").text() + "</td></tr>"
    var exPostVal = $("*[fldtitle=ExRateType]").find("input[type=radio]:checked");
    exPostVal = exPostVal.val();
    if (exPostVal == undefined || exPostVal == "")
        exPostVal = " - ";
    else
        exPostVal;
    ExRate += "<tr style='width:100%;'><td> Exchange Rate (Post): </td><td>" + exPostVal + "</td></tr>"
    ExRate += "</table></div></div>";
    ExRate += "<table class='table table-bordered pad-10'>";
    ExRate += document.getElementById("idTblEXRATE").innerHTML;
    ExRate += "</table>";
    ExRate += "</div></div></div>";

    // Print Advance Details
    var AdvRefDetails = "";
    var accUse = "";
    var table = $('#idTblADV').DataTable();
    var AdvrowCnt = parseInt(table.data().length)
    if (AdvrowCnt > 0) {
        AdvRefDetails = getAdvanceRefundDetails();
        accUse = getAccountUse();

    }
    return AdvRefDetails + ExRate + accUse;
}
function getAdvanceRefundDetails() {
    var ARDetails = "";
    ARDetails += framePanel("Advance / Refund Details")
    ARDetails += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10 justified style='table-layout: fixed;'>";
    ARDetails += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    ARDetails += "<tr style='width:100%;'>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>S.No</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>Currency</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>Mode</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>PC's</th>";
    ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>Denomination</th>";
    ARDetails += "<th colspan='2' class='vmiddle center' nowrap=''>Base Curr Amt</th>";
    ARDetails += "</tr>";
    ARDetails += "</thead>";
    $("#idTblADV>tbody>tr").each(function () {
        ARDetails += "<tbody><tr>"
        $(this).find("td").each(function () {
            lbl = $(this).text();
            if (lbl.trim() != "" && lbl.trim() != "Delete" && !$(this).hasClass("displaynone")) {
                ARDetails += "<td>" + $(this).find("span:last").text() + "</td>";
            }
        });
        ARDetails += "</tr>"
    });
    ARDetails += "</tbody></table></div>"
    var table = $('#idTblRef').DataTable();
    var RefrowCnt = parseInt(table.data().length)
    if (RefrowCnt > 0) {
        ARDetails += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10 justified style='table-layout: fixed;'>";
        ARDetails += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
        ARDetails += "<tr style='width:100%;'>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>S.No</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>Currency</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>Mode</th>";
        ARDetails += "<th rowspan='2' class='vmiddle' nowrap=''>FC Amount</th>";
        ARDetails += "<th colspan='2' class='vmiddle center' nowrap=''>Base Curr Amt</th>";
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
        ARDetails += "</tbody></table></div>"
    }
    return ARDetails;
}
function getAccountUse() {
    var accUse = "";
    var tempVar = "";
    accUse += "<div class='half-width' style='width: 50%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 120px;'><div class='add-div' style=' padding: 15px; max-width: 100%;  width: 100%;'> <table class='table table-bordered pad-10'>";
    tempVar = !!($('#settlementDate').val()) ? $('#settlementDate').val() : "";
    accUse += "<tr style='width:100%;'><td> Settlement Date : </td><td> " + tempVar + "</td></tr>";
    tempVar = !!($('#settlementDays').val()) ? $('#settlementDays').val() : "";
    accUse += "<tr style='width:100%;'><td> Settlement Days : </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($('#idSettlementRecvBy').val()) ? $('#idSettlementRecvBy').val() : "";
    accUse += "<tr style='width:100%;'><td> Received By      : </td><td>" + tempVar + "</td></tr>";
    accUse += "<tr style='width:100%;'><b><td>For Accounts Use </td></b></tr>";
    tempVar = !!($("input[fldtitle='CheckedBy']").val()) ? $("input[fldtitle='CheckedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td> Checked By : </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($("input[fldtitle='VerifiedBy']").val()) ? $("input[fldtitle='VerifiedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td> Verified By : </td><td>" + tempVar + "</td></tr>";
    tempVar = !!($("input[fldtitle='ApprovedBy']").val()) ? $("input[fldtitle='ApprovedBy']").val() : "";
    accUse += "<tr style='width:100%;'><td> Approved By : </td><td>" + tempVar + "</td></tr>";
    accUse += "</table></div>";
    return accUse;

}
function getExpenseTable() {
    var expDet = "";
    expDet += framePanel("Expense Details")
    expDet += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10'>";
    expDet += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    expDet += "<tr style='width:100%;'>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>Expense Type</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>GL Code</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>Tax Code</th>";
    expDet += "<th colspan='2' class='vmiddle center' nowrap=''>" + baseCurrency + " Amount</th>";
    expDet += "<th rowspan='2' class='vmiddle' nowrap=''>Remarks</th>";
    expDet += "</tr>";
    expDet += "<tr style='width:100%;'><th class='center'>Pre</th><th class='center'>Post</th></tr>";
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
    expDet += "</tbody></table></div>";
    return expDet;
}
function printPaymentAdvice(tblID, ExpenseTitle) {
    var payAdv = framePanel(ExpenseTitle + " Details");
    payAdv += "<table class='table table-bordered table-striped scrl-x-tbl dynatable dataTable' style='overflow: auto;min-width: 100% !important;max-width: 100% !important;width: 100% !important;' >"
    payAdv += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>"
    payAdv += "<tr role='row'><th class='displaynone sorting_disabled' rowspan='1' colspan='1' style='width: 12.0104px;'>ID</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>S.#</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Paymnent Doc</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Payment Doc Date</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Advice Description</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Invoice Amount</th>";
    payAdv += "<th nowrap='' class='sorting_disabled' rowspan='1' colspan='1' style='font-size:13px'>Currency</th>";
    payAdv += "</tr>"
    payAdv += "</thead><tbody>"
    $("#" + tblID + ">tbody>tr").each(function () {
        payAdv += "<tr>"
        $(this).find("td.vmiddle").each(function () {
            payAdv += "<td style='font-size:13px'>" + $(this).find("*").text(); +"</td>";
        });
        payAdv += "</tr>"
    });
    payAdv += "</tbody></table></div>";
    return payAdv;
}
function printPaymentSummary() {
    createPaymentSummary();
    var paySum = "";
    paySum += framePanel("Payment Summary");
    paySum += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10'>";
    paySum += "<thead style='color: rgb(255, 255, 255); background-color: rgb(66, 139, 202);'>";
    paySum += "<tr style='width:100%;'>";
    paySum += "<th rowspan='2' style='text-align:center;' nowrap=''>Items</th>";
    paySum += "<th rowspan='2' style='text-align:center;display:none' nowrap=''>Pre Amount (SGD)</th>";
    paySum += "<th rowspan='2' class='vmiddle' nowrap=''>Post Amount (SGD)</th>";
    paySum += "<th style='text-align:center;display:none' nowrap=''>Diff. Against Post</th>";
    paySum += "<th style='text-align:center;' nowrap=''>GL Code</th>";
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
    paySum += "</tbody></table></div>"
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "Yes") {
        paySum += getExpBudgetInfo();
    }
    return paySum;
}
function printAttachmentDetailsSection() {
    var attSection = getFramedTitle("Attachments");
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
    attSection += "</tbody></table></div></section>";
    return attSection;
}
function PrintPage() {
    document.getElementById("idTravelMainFormPrint").style.display = "block";
    document.getElementById("idTravelMainForm").style.display = "none";
    document.getElementById("foot").style.display = "none";
    document.getElementById("idTravelMainFormPrint").innerHTML = document.getElementById("printTravelData").innerHTML;
    $("#idTravelMainFormPrint").find(".modal-body").removeClass("modal-body");
    $("#idTravelMainFormPrint").find(".printMainSpan").each(function () {
        if ($.trim($(this).html()) == "") {
            $(this).remove();
        }
    });
    window.print();
    document.getElementById("idTravelMainFormPrint").style.display = "none";
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
    internalUse += "<div class='half-width' style='width: 100%;float: left;padding: 15px;display:inline-block; margin: 0 auto; min-height: 120px;'><div class='add-div' style=' padding: 15px; max-width: 100%;  width: 100%;height:65px !important'><table class='table table-bordered pad-10'>";
    internalUse += "<tr><th colspan='2'>FOR INTERNAL USE</th></tr>";
    internalUse += "<tr><td style='font-weight: bold;'>Travel Ref No</td><td style='font-weight: bold;'>" + $.trim($("#idlblReferenceNo").text()) + "</td></tr>";
    internalUse += "<tr><td style='font-weight: bold;'>Date</td><td style='font-weight: bold;'>" + $.trim($("#idlblSubmitDate").text()) + "</td></tr>";
    internalUse += "</table>";
    internalUse += "</div>";
    internalUse += "</div>";
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
    AccountUse += "<div class='full-width' style='width:100%;float:left;padding:10px;display:inline-block;'><table class='table table-bordered pad-10'>";
    AccountUse += "<tr><th>Pre-Travel Authorised by</th><th>Post-Travel Authorised by</th><th colspan='2'>Accounts Use</th></tr>";
    AccountUse += "<tr><td style='width:25%'>" + PreTravelFinalApprover + "</td><td style='width:25%'>" + PostTravelFinalApprover + "</td><td style='font-weight: bold;'>Net Payable to Staff/Company (" + baseCurrency + " $) </td><td style='width:25%'> " + NetPayToStaff + "</td></tr>";
    AccountUse += "<tr><td><span style='font-weight: bold;'>Date : </span>" + PreTravelFinalApprovalDate + "</td><td><span style='font-weight: bold;'>Date : </span>" + PostTravelFinalApprovalDate + "</td><td style='font-weight: bold;'>Pay through Payroll</td><td>" + PayPayroll + "</td></tr>";
    AccountUse += "<tr><td colspan='2' rowspan='3' style='padding:0px 0px !important;'>" + lsRemarks + "</td><td style='font-weight: bold;'>Pay through Finance</td><td>" + PayFinance + "</td></tr>";
    AccountUse += "<tr><td style='padding:0px 0px !important;font-weight: bold;'>Approved By</td><td style='padding:0px 0px !important;font-weight: bold;'>Checked By</td></tr>"
    AccountUse += "<tr class='printRules'><td class='printRules' style='padding:0px 0px !important;height: 56px;'></td><td class='printRules' style='padding:0px 0px !important;height:56px'></td></tr>";
    AccountUse += "</table>";
    AccountUse += "</div>";
    PostTrvDet += "<div class='full-width' style='width:100%;float:left;padding-top:0px !important;'><table class='table table-bordered pad-10'>";
    PostTrvDet += "<tr><th colspan='2'>Post-Travel Details</th></tr>";
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
    PostTrvDet += "<tr><td>Actual Departure & Arrival Date/Time</td><td>" + POSTDetails + "</td></tr>";
    PostTrvDet += "</table>";
    PostTrvDet += "</div>";
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


function formatPrintDisplay(tblID) {
    switch (tblID) {
        case 'idTblMIL':   //Mileage Expense
            return formatPrintMIL(tblID);
            break;
        case 'idTblOTH':   //Mileage Expense
            return formatPrintOTH(tblID);
            break;
        case 'idTblMED':  //Medical Expense
            return formatPrintMED(tblID);
            break
        case 'idTblVSA':   //VISA Claim
            return formatPrintVSA(tblID);
            break;
        case 'idTblMIS':   //Miscellaneous
            return formatPrintMIS(tblID);
            break;
        case 'idTblACC':  //Accommodation Travel
            return formatPrintACC(tblID);
            break;
        case 'idTblATC':  //Air Ticket Cost
            return formatPrintATC(tblID);
            break;
        case 'idTblCOM':  //Communication Travel
            return formatPrintCOM(tblID);
            break;
        case 'idTblDA':  //DailyAllowance Travel
            return formatPrintDA(tblID);
            break;
        case 'idTblENT': //Entertainment Expense
            return formatPrintENT(tblID);
            break;
        case 'idTblENTD': //Entertainment Details
            return formatPrintENTD(tblID);
            break;
        case 'idTblPAS': //Passport Claim
            return formatPrintPAS(tblID);
            break;
        case 'idTblPRP': //Preparation Claim
            return formatPrintPRP(tblID);
            break;
        case 'idTblTSP':  //Transportation Expense
            return formatPrintTSP(tblID);
            break;
        case 'idTblCA':   //Compensation Allowance
            return formatPrintCA(tblID);
            break;
        case 'idTblTRNC':   // Trainers Cost Expense
            return formatPrintTRNC(tblID);
            break;
        case 'idTblEXB':   //Excess Baggage Claim
            return formatPrintEXB(tblID);
            break;
        case 'idTblLAU':   //Laundry
            return formatPrintLAN(tblID);
            break;
        case 'idTblAPT':   //Airport Tax Expense
            return formatPrintAPT(tblID);
            break;
        case 'idTblGIFT': //Gift Expense
            return formatPrintGIFT(tblID);
            break;
        case 'idTblGIFTD': //Gift Details
            return formatPrintGIFTD(tblID);
            break;
        case 'idTblTSH': //Travel Schedule
            return formatPrintTSH(tblID);
            break;
        case 'idTblACCENT':  //Accounting Enteries
            return formatPrintACCENT(tblID);
            break;
        case 'idTblWIN': //Winter Allowance
            return formatPrintWIN(tblID);
            break;
        default:
            return "";
    }
}
function printTravelDetails(tblID, fldLabel, fldID, fldClass, flgTot, totColSpan) {
    var formatText = "";
    var cls = "";
    var EmployeeTotal = 0;
    var flagarranageby = false;
    var expenseTable = $('#' + tblID).DataTable();
    var expenseTableCount = parseInt(expenseTable.data().length)
    if (expenseTableCount > 0) {
        if (tblID == "idTblTSH") {
            formatText += "";
        }
        else if (tblID == "idTblENTD" || tblID == "idTblGIFTD") {
            formatText += framePanel(expTableName + " Details");
        }
        else {
            formatText += framePanel(expTableName + " Expenses");
        }
        drawDataTbl(tblID, true);
        formatText += "<table class='table table-bordered justified'>";
        $(tableRowSelector(tblID)).each(function () {
            var LCAmt = 0;
            var val = "";
            tr = $(this);
            if (tr.index() == 0) {
                formatText += "<thead><tr>";
                for (var j = 0; j < fldLabel.length; j++) {
                    if (fldLabel[j] == "S.#")
                        formatText += "<th style='width:60px !important'>" + fldLabel[j] + "</th>";
                    else
                        formatText += "<th>" + fldLabel[j] + "</th>";
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
            if (tblID == "idTblAPT" || tableID == "idTblACC" || tblID == "idTblVSA") {
                if ($(this).find(".ticketArrBy").length > 0) {
                    if ($(this).find(".ticketArrBy").text().toLowerCase() != "company") {
                        LCAmt = parseFloat(outputNumber($(this).find("td span.lcamt").text()));
                        if (LCAmt == "") {
                            return;
                        }
                        if (!isNaN(LCAmt) && LCAmt.length != 0) {
                            EmployeeTotal += LCAmt;
                        }
                        for (var i = 0; i < fldID.length; i++) {
                            cls = fldClass[i] == "" ? "" : "class=" + fldClass[i];
                            formatText += "<td style='word-wrap:break-word' " + cls + ">" + tr.find("#" + fldID[i]).text() + "</td>";
                        }
                    }
                }
                flagarranageby = true;
            }
            else {
                for (var i = 0; i < fldID.length; i++) {
                    cls = fldClass[i] == "" ? "" : "class=" + fldClass[i];
                    formatText += "<td style='word-wrap:break-word' " + cls + ">" + tr.find("#" + fldID[i]).text() + "</td>";
                }
            }
            formatText += "</tr>";
        });
        if (flgTot) {
            if (flagarranageby)
                formatText += "<tfoot><tr><td style='text-align:right;font-weight: bold;' colspan='" + totColSpan + "'>" + expTableName + " Sub Total (SGD)</td><td style='text-align:right'>" + outputMoney(EmployeeTotal) + "</td>";
            else
                formatText += "<tfoot><tr><td style='text-align:right;font-weight: bold;' colspan='" + totColSpan + "'>" + expTableName + " Sub Total (SGD)</td><td style='text-align:right'>" + $("#" + tblID + ">tfoot>tr").find(".totalamt").text() + "</td>";
            if (fldID.length > (totColSpan + 1)) {
                formatText += "<td colspan='" + (fldID.length - totColSpan - 1) + "'></td></tr>";
            }
            else {
                formatText += "</tr>";
            }
            val = arrExpCodes[0][tblID];
            var expRow = $("tr[expcode='" + val + "']");
            var remark = $.trim(expRow.find("#idExpRemarksText").val());
            formatText += "<tr><td>Remarks : </td><td colspan='" + (fldID.length - 1) + "'>" + remark + "</td></tr>";

        }
        formatText += "</tfoot></tbody></table>";
        drawDataTbl(tblID, false);
    }
    formatText += "</div></div></div>";
    return formatText;
}
function formatPrintTSH(tblID) {
    var fldLabel = ["Dep. Country", "Arr. Country", "Dep. Date", "Arr. Date", "Dep. Time", "Arr. Time", "Description"];
    var fldID = ["idTSHDepCntry", "idTSHDestCntry", "idTSHDepDate", "idTSHArrDate", "idTSHDepTime", "idTSHArrTime", "idTSHDesc"];
    var fldClass = ["", "", "", "", "", "", ""];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, false, 0);
    return strPrintData;
}
function formatPrintDA(tblID) {
    var fldLabel = ["S.#", "Country", "Allowance Type", "Currency", "DA Rate", "Actual No. Of Days", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idDASNo", "idDACountry", "idDAAllowType", "idDACurrency", "idDADailyRate", "idDAActualNoofDays", "idDAFCAmt", "idDAExrate", "idDALCAmt"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 8);
    return strPrintData;
}
function formatPrintMIL(tblID) {
    var fldID = ["idMILSNo", "idMILDate", "idMILType", "idMILClaimCurr", "idMILClaimAmt", "idMILExRate", "idMILLCAmt"]
    var fldLabel = ["S.#", "Date", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"]
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintOTH(tblID) {
    var fldID = ["idOTHSNo", "idOTHDate", "idOTHType", "idOTHClaimCurr", "idOTHClaimAmt", "idOTHExRate", "idOTHLCAmt"]
    var fldLabel = ["S.#", "Date", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"]
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintMED(tblID) {
    var fldLabel = ["S.#", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idMEDSNo", "idMEDType", "idMEDClaimCurr", "idMEDClaimAmt", "idMEDExRate", "idMEDLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintVSA(tblID) {
    var fldLabel = ["S.#", "Country/City", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idVSASNo", "idVSACountry", "idVSAExpTyp", "idVSACurrency", "idVSAFCAmt", "idVSAExRate", "idVSALCAmt"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintMIS(tblID) {
    var fldLabel = ["S.#", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idMISSNo", "idMISExpTyp", "idMISCurncy", "idMISFCAmt", "idMISExRate", "idMISLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintACC(tblID) {
    var fldLabel = ["S.#", "Hotel Name", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD", ];
    var fldID = ["idACCSNo", "idACCHotelName", "idACCCurrency", "idACCFCAmt", "idACCExRate", "idACCLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintATC(tblID) {
    var fldLabel = ["S.#", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idATCSNo", "idATCCurrency", "idATCFCAmt", "idATCExRate", "idATCLCAmt"];
    var fldClass = ["", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 4);
    return strPrintData;
}
function formatPrintCOM(tblID) {
    var fldLabel = ["S.#", "Details", "Expense Type", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idCOMSNo", "idCOMDesc", "idCOMExpType", "idCOMCurrency", "idCOMFCAmt", "idCOMExRate", "idCOMLCAmt"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintENT(tblID) {
    var fldLabel = ["S.#", "Date", "Place", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idENTSNo", "idENTDate", "idENTPlace", "idENTCurrency", "idENTFCAmt", "idENTExRate", "idENTLCAmt"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
function formatPrintENTD(tblID) {
    var fldLabel = ["S.#", "PA Attendant", "Customer Name", "Title", "Company Name", "Description", ];
    var fldID = ["idENTDSNo", "idENTDAttendant", "idENTDCustName", "idENTDTitle", "idENTDCompName", "idENTDDesc"];
    var fldClass = ["", "", "", "", "", ""];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, false, 0);
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
    var fldLabel = ["S.#", "Expense Type", "Date", "From", "To", "Currency", "FC Amt", "Exch. Rate", "Receipt Check?", "Amount in SGD"];
    var fldID = ["idTSPSno", "idTSPExpenseTypes", "idTSPDate", "idTSPFrom", "idTSPTo", "idTSPCurrency", "idTSPFCAmt", "idTSPExchRate", "idTSPReceiptcheck", "idTSPLCAmt"];
    var fldClass = ["", "", "", "", "", "", "amount", "amount", "", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 9);
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
    var fldLabel = ["S.#", "Country-Name of the Airport", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idAPTSNo", "idAPTAirportName", "idAPTClaimCurr", "idAPTClaimAmt", "idAPTExRate", "idAPTLCAmt"];
    var fldClass = ["", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 5);
    return strPrintData;
}
function formatPrintGIFT(tblID) {
    var fldLabel = ["S.#", "Date", "Details", "Currency", "FC Amt", "Ex. Rate", "Amount in SGD"];
    var fldID = ["idGIFTSNo", "idGIFTDate", "idGIFTDetails", "idGIFTCurrency", "idGIFTFCAmt", "idGIFTExRate", "idGIFTLCAmt"];
    var fldClass = ["", "", "", "", "amount", "amount", "amount"];
    var strPrintData = printTravelDetails(tblID, fldLabel, fldID, fldClass, true, 6);
    return strPrintData;
}
/*For Lazy Loading need to be at the end of library*/
loadRef.js.print.libLoaded();
/***************************************************/