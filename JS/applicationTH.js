var NewRow = false;
var NewRowsCnt = 0;
var LastRow = false;
var objSelectedRow = null;
var rowData = "";
var selectedTblID = "";
var flgExRateAvailable = false;
var flgManualExRateAvailable = false;
var expenseTypeObj = {}; // For Payment Summery
var expenseTypeDisplay = {};
var HRIQExpenses = []; //Defined with getConfigHRIQExp()
var strReadOnly = 'readOnly';
var OnlyPostExpTypes = ["Medical", "Mileage", "Others", "Miscellaneous", "Accommodation", "Communication", "Passport", "Transportation", "Compensation", "AirportTax"];
var GSTCodes = null;
var TravellingTo = "";
var activeTravelType = "";
var gblPreNoDays = 0;
var gblPostNoDays = 0;
var clickedModalBtn = null; //Required for confirm modal in Post LC Amount zero Submission
var gblPreActNoDays = 0;
var gblPostActNoDays = 0;
var BudgetCurrencyRate = 1;
var FinCurrencyRate = 0;
var IAFBudgetCurrencyRate = 1;
var BudgetNotAvailable = "";
var budgetSumColl = [];
var PreviousBudgetAmtColl = [];
var isIAFExist = false;
var TicketArrangedByExp = ["AirTicketCost", "Visa", "AirportTax", "Accommodation"];
var NoCollapseExpand = ["idTblADV", "idTblRef", "idTblWIN", "idTblENTD", "idTblGIFTD", "idTblACCENT", "idTblPAD", "idTblMYEXCH"];
var printFlg = false;
var printFlgLessDetails = false;
var ExpenseDetails = { // Initializes onload Applicant and Accounts level
    "expHRIQ": [],
    "expensesToList": [],
    init: false
};
var displayDateFormat = 'DD/MM/YYYY';
var allTravelTypes = [];
var flgRecalcDA = false;
var fldToFocus = null;
var CalendarDetails = { // Initializes in Applicant and Accounts level
    holidays: {
        all: [], // All Holidays
        ch: [],  // Company Holiday
        ph: []   // Public Holiday
    },
    wd: [],	  // Week Day
    we: [],		  // Week End
    init: false,
    travelSumInit: false
};
var expArranged = {
    expCompany: [], byCompany: function (exp) { return this.expCompany.indexOf(exp) != -1; },
    expEmployee: [], byEmployee: function (exp) { return this.expEmployee.indexOf(exp) != -1; },
    byAnyOne: function (exp) { return (this.byCompany(exp) || this.byEmployee(exp)); }
};
var loadRef = {
    master: {
        currency: false,
        gstcode: false,
        country: false,
        tktcoord: false,
        DATypes: false
    },
    js: {
        print: {
            loaded: false, libLoaded: function () { this.loaded = true; if (!!this.onLoadFn) { this.onLoadFn() }; this.onLoadFn = null; },
            url: '_layouts/15/eTravel/js/PrintTravel.js', rootSite: true, onLoadFn: null
        }
    }
};
var arrExpCodes = [{
    "idTblMED": "Medical",
    "idTblMIL": "Mileage",
    "idTblMIS": "Miscellaneous",
    "idTblVSA": "Visa",
    "idTblACC": "Accommodation",
    "idTblATC": "AirTicketCost",
    "idTblCOM": "Communication",
    "idTblDA": "DailyAllowance",
    "idTblENT": "Entertainment",
    "idTblPAS": "Passport",
    "idTblPRP": "Preparation",
    "idTblTSP": "Transportation",
    "idTblTRNC": "TrainersCost",
    "idTblCA": "Compensation",
    "idTblEXB": "ExcessBaggage",
    "idTblLAU": "Laundry",
    "idTblGIFT": "Gift",
    "idTblAPT": "AirportTax",
    "idTblADV": "AdvanceDetails",
    "idTblRef": "RefundDetails",
    "idTblWIN": "WinterAllowance"
}];
function showPreCols(tblID, flgShow, flgUpdateAction) {
    var objArrPreDisplay = $("#" + tblID).find('.predisplay');
    if (flgShow) {
        $("#" + tblID + "_wrapper div:nth-child(2)").css({ "overflow": "auto" });
        objArrPreDisplay.show();
        $("#" + tblID).find('.colhead').attr("colspan", "2");
    }
    else {
        objArrPreDisplay.hide();
        $("#" + tblID).find('.colhead').attr("colspan", "1");
        $("#" + tblID + "_wrapper div:nth-child(2)").css({ "overflow": "hidden" });
    }
    if (flgUpdateAction)
        return false;
    var PrePostExp = $("#" + tblID + " tfoot tr:first td.predisplay").length;
    PrePostExp = (!PrePostExp) ? 0 : PrePostExp;
    PrePostExp = (flgShow) ? parseInt(PrePostExp) * -1 : PrePostExp;
    $("#" + tblID + " tfoot tr:first td.mergedcell").each(function () {
        var preColCnt = $(this).attr("precols");
        var footerColSpan = $(this).attr("colspan");
        preColCnt = (!flgShow) ? parseInt(preColCnt) * -1 : preColCnt;
        $(this).attr("colspan", (parseInt(footerColSpan) + parseInt(preColCnt) + parseInt(PrePostExp)));
        PrePostExp = 0;
    });
}
function updateColHead() { //For future use if required
    if (travelStage == "post") {
        $('.colhead').append(' [Post]');
    }
    else {
        $('.colhead').append(' [Pre]');
    }
}
function setMandatoryFields() {
    $(".mandatory").prev().append(" <font color=red>*</font>");
}
function setDefaultValues(modalID, tblID) {
    $('#' + modalID).find('.gstcode').val(defaultGSTCode);
    if (!!$("#" + modalID).find("select.costcenter")[0]) {
        $("#" + modalID).find("select.costcenter").html($("#ddlhdnPC").html());
        $("#" + modalID).find("select.costcenter")[0].selectedIndex = $("select[fldtitle=ChargeToPC]")[0].selectedIndex;
    }
    var val = arrExpCodes[0][tblID];
    if (tblID == "idTblOTH") {
        val = "Mileage";
    }
    var expRow = $("tr[expcode='" + val + "']");
    if (expRow.length > 0) {
        var defaultGLCode = $.trim(expRow.find("#idExpGLCode").text());
        var defaultGSTCode = $.trim(expRow.find("#idExpTaxCode").text());
        $('#' + modalID).find('.glcode').val(defaultGLCode);
        $('#' + modalID).find('.gstcode').val(defaultGSTCode);
        if ([null, undefined, ""].indexOf($("#" + modalID).find(".gstcode").val()) != -1) {
            $("#" + modalID).find(".gstcode").val("Select");
        }
        $('#' + modalID).find('select.currency').val(baseCurrency);
        $('#' + modalID).find('select.currency').trigger("onchange");
    }
    $('#' + modalID).find('select.chargToFact').val("No");
    if (modalID == "MILModal") { // For Mileage
        var mileageTypeConfig = $('input[fldtitle="hdnMileageType"]').val().replace(/^(;#)+|(;#)+$/g, "").split(";#");
        if (mileageTypeConfig.length == 1) {
            $("#idMILTypeEdit").val(mileageTypeConfig[0]);
            $("#idMILTypeEdit").prop("disabled", true);
        }
        $("#idMILTypeEdit").change();
    }
    if (tblID == "idTblWIN") {
        getWinValues(modalID);
    }
    if (tblID == "idTblPRP") {
        getPrepValues(modalID);
    }
    if (tblID == "idTblCA") {
        getCompensationValues();
    }
    if (tblID == "idTblACC") { // For Accomodation
        setDefaultCountryValues(tblID);
        setExpArrangedBy(tblID);
    }
    if (tblID == "idTblVSA") {
        setDefaultCountryValues(tblID);
        //$('#' + modalID).find('select.chargToFact').val("No").prop("disabled", true);
        setExpArrangedBy(tblID);
    }
    if (tblID == "idTblATC" || tblID == "idTblAPT") {
        setExpArrangedBy(tblID);
    }
    //if (tblID == "idTblMIL" || tblID == "idTblOTH") {
    //    $('#' + modalID).find('select.chargToFact').val("No").prop("disabled", true);
    //}
    if (tblID == "idTblDA") { // For DA
        refreshDA();
    }
    if (tblID == "idTblADV") {
        $('#' + modalID).find('select.currency').val(baseCurrency);
        $('#' + modalID).find('select.currency').trigger("onchange");
        $('#' + modalID).find('#idADVModeEdit').trigger("onchange");
    }
    if (tblID == "idTblTSH") { // For Travel Schedule
        $('#' + modalID).find("select,input,textarea").prop("disabled", false);
        var objSched = objSchedCountryCity(true);
        var pickerObj = {
            locale: { format: displayDateFormat },
            autoApply: true,
            twoInputRange: true,
            fromElement: '#idTSHDepDateEdit',
            toElement: '#idTSHArrDateEdit'
        };
        if (objSched.destTime.length > 0) {
            updateDateRange($('#idTSHDepDateEdit,#idTSHArrDateEdit'), objSched.destTime[objSched.destTime.length - 1], null, pickerObj, null);
        } else {
            updateDateRange($('#idTSHDepDateEdit,#idTSHArrDateEdit'), null, null, pickerObj, null);
        }
        $('#idTSHDepDateEdit,#idTSHArrDateEdit').val("");
        //To Default isTransit and isTravelled
        $('#' + modalID).find('#idTSHisTransiDepEdit').val("No");
        $('#' + modalID).find('#idTSHisTravelledEdit').val("No").prop("disabled", true).closest("li").hide();
        // To default Previous destination in as departure in schedule
        $("#idTSHDestCntryEdit, #idTSHDepCntryEdit").prop("disabled", false);
        $("#idTSHDepCityEdit").prop("disabled", false);
        if (TravellingTo == "Domestic") {
            $("#idTSHDestCntryEdit, #idTSHDepCntryEdit").each(function () {
                $(this).find("option").each(function () {
                    if ($.trim($(this).text()) == defaultCountry) {
                        $(this).closest("select").find("option:selected").prop("selected", false);
                        $(this).prop("selected", true);
                    }
                });
            });
            $("#idTSHDestCntryEdit, #idTSHDepCntryEdit").prop("disabled", true);
            $("#idTSHDestCntryEdit, #idTSHDepCntryEdit").trigger("onchange");
        } else if (!!objSched.prevDestCountry) {
            $("#idTSHDepCntryEdit option").each(function () {
                if ($(this).text() == objSched.prevDestCountry) {
                    $("#idTSHDepCntryEdit option:selected").prop("selected", false);
                    $(this).prop("selected", true);
                    $("#idTSHDestCntryEdit,#idTSHDepCntryEdit").trigger("onchange");
                    $("#idTSHDepCntryEdit").prop("disabled", true);
                }
            });
        }
        if (!!objSched.prevDestCity) {
            $("#idTSHDepCityEdit option").each(function () {
                if ($(this).text() == objSched.prevDestCity) {
                    $("#idTSHDepCityEdit option:selected").prop("selected", false);
                    $(this).prop("selected", true);
                    $("#idTSHDepCityEdit").prop("disabled", true);
                }
            });
        }
        // Disable Additional One day field
        ADAllowedConfig = $("input[fldTitle='hdnADAllowedConfig']").val(); //"Yes";
        $('#idTSHAdditionalDayEdit').prev().css("color", "black");
        if (ADAllowedConfig != "Yes") {
            $('#idTSHAdditionalDayEdit').val("NA");
            $('#idTSHAdditionalDayEdit').attr("disabled", true);
            $('#idTSHAdditionalDayEdit').prev().css("color", "#e4e4e4");
        }
    }
}
function setExpArrangedBy(tblID) {
    var arrangedByOne = expArranged.byAnyOne(arrExpCodes[0][tblID]);
    var toSetVal = expArranged.byCompany(arrExpCodes[0][tblID]) ? "Company" : "Employee";
    if (tblID == "idTblACC") {
        if (arrangedByOne) {
            $('#ACCModal').find('#idACCArgByEdit').val(toSetVal).prop("disabled", true);
        }
    }
    if (tblID == "idTblVSA") {
        if (arrangedByOne) {
            $('#VSAModal').find('#idVSAArrgByEdit').val(toSetVal).prop("disabled", true);
        }
    }
    if (tblID == "idTblATC") {
        if (arrangedByOne) {
            $('#ATCModal').find('#idATCTktArgByEdit').val(toSetVal).prop("disabled", true);
        }
    }
    if (tblID == "idTblAPT") {
        if (arrangedByOne) {
            $('#APTModal').find('#idAPTTaxArgByEdit').val(toSetVal).prop("disabled", true);
        }
    }
}
function setDefaultCountryValues(tblID) {
    var destCountries = [];
    var lsCountry = "";
    if (tblID == "idTblACC")
        lsCountry = $("#idACCCountryEdit");
    else {
        lsCountry = $("#idVSACountryEdit");
        $("#idVSAVsaEdit").val("-NA-");
    }

    if (TravellingTo == "Overseas")
        destCountries = objSchedCountryCity(false).destCountries;
    else
        destCountries = objSchedCountryCity(false).destCities;
    lsCountry.find("option").remove();
    lsCountry.append('<option value="Select">Select</option>');
    destCountries.forEach(function (country) {
        lsCountry.append('<option value="' + country + '">' + country + '</option>');
    });
}
function calcAccomodationAmount() {
    $("#ACCModal").find('.modalInfo').text("");
    var NoOfDays = outputNumber($("#idACCNoDaysEdit").val());
    var ActNoOfDays = outputNumber($("#idPostActNoDays").text());
    var fcAmt = $("#idACCFCAmtEdit").val();
    var AccEntryValues = 0;
    var table = $('#idTblACC').DataTable();
    var slNo = $("#idACCSNoEdit").val();
    if (parseInt(table.data().length) > 0) {
        $(tableRowSelector("idTblACC")).each(function () {
            if (!!$(this).find('span[postkey="PostDays"]').text() && $(this).find('span[postkey="SNo"]').text() != slNo) {
                AccEntryValues += outputNumber($(this).find('span[postkey="PostDays"]').text());
            }
        });
    }
    if ((NoOfDays + AccEntryValues) > ActNoOfDays) {
        $("#ACCModal").find('.modalInfo').text("Total No Of Days entered exceeds the Actual No Of Days(" + ActNoOfDays + ") entered in travel Schedule.");
        $("#idACCNoDaysEdit").focus();
        showError();
        return false;
    }
    //var perNight = $("#idACCPNShareEdit").val();
    //var er = $("#idACCExRateEdit").val();
    if (!!fcAmt && !!NoOfDays) {
        $("#idACCPNShareEdit").val(outputMoney(outputNumber(fcAmt) / NoOfDays));
        $("input[fldTitle='hdnAccPerNightShare']").val(outputMoney(outputNumber(fcAmt) / NoOfDays))
        //if (!!er) {
        //    $("#idACCLCAmtEdit").val(outputMoney(outputNumber(perNight) * NoOfDays * er));
        //}
    }
}
function calculateNoOfPersons() {
    lcAmt = $("#idENTLCAmtEdit").val();
    NoOfPerson = $("#idENTPersonCountEdit").val();
    FCAmt = $("#idENTFCAmtEdit").val();
    if (outputNumber(lcAmt) > 0 && NoOfPerson > 0 && outputNumber(FCAmt) > 0) {
        $("#idENTPerHeadAmtEdit").val(outputMoney(outputNumber(lcAmt) / NoOfPerson));
    }
}
function getUserProfileDetails() {
    var detailsToGet = [
        "AdvanceEligible",
        "HomeTelephoneNo",
        "MobilePhoneNo",
        "EmergencyContactNo",
        "NameinPassport",
        "WAFirstClaim", "WAYearlyClaim", "WAFirstClaimDate", "WALastClaimDate", "WALastClaimAmt",
        "PAFirstClaim", "PASecondClaim", "PAFirstClaimDate", "PALastClaimDate", "PALastClaimAmt", "BaggageCount"
    ];
    var detailsToExpand = [
        "JobClassification/JobClassification"
    ];
    detailsToGet = "$select=" + detailsToGet.concat(detailsToExpand).join(",");
    detailsToExpand = detailsToExpand.length > 0 ? "&$expand=" + detailsToExpand.join(",") : "";
    var listData = getData(rootSiteUrl + "/_api/web/lists/getByTitle('TempUserProfile')/Items?" + detailsToGet + detailsToExpand + "&$filter=EmployeeID eq '" + empID + "'&$top=1");
    listData = JSON.parse(listData);
    if (listData.length == 0) {
        alertModal("Unable to get details from User Profile. Please contact Administrator.");
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        // Default when no user profile found
        $("input[fldtitle=hdnWinterAllowanceDetails]").val(["Yes", "Yes", dateString(tomorrow), dateString(dayAfterTomorrow), "0"].join("#"));
        $("input[fldtitle=hdnPADetails]").val(["Yes", "Yes", dateString(tomorrow), dateString(dayAfterTomorrow), "0", "0"].join("#"));
        $("input[fldtitle=hdnAdvanceEligible]").val("No");
        $("input[fldtitle=hdnJobClassification]").val("");
        $("input[fldtitle=MobileNo]").val("");
        $("input[fldtitle=EmergencyContact]").val("");
        $("input[fldtitle=HomeTeleNo]").val("");
        $("input[fldtitle=hdnNameinPassport]").val("");
        $("#idlblPassportName>span:first-child").text("");
        return;
    }
    var user = listData[0];
    // Winter Allowance
    var FirstClaimDate = (!!user.WAFirstClaimDate) ? dateString(dateObjOffset(user.WAFirstClaimDate)) : "";
    var FirstClaim = user.WAFirstClaim;
    var LastClaimAmount = (!!user.WALastClaimAmt) ? user.WALastClaimAmt : 0;
    var LastDateOfClaim = (!!user.WALastClaimDate) ? dateString(dateObjOffset(user.WALastClaimDate)) : "";
    var YearlyAllowed = user.WAYearlyClaim;
    $("input[fldtitle=hdnWinterAllowanceDetails]").val([FirstClaim, YearlyAllowed, FirstClaimDate, LastDateOfClaim, LastClaimAmount].join("#"));
    // Preperation Allowance
    var PAFirstClaim = user.PAFirstClaim;
    var PASecondClaim = user.PASecondClaim;
    var PALastClaimAmount = (!!user.PALastClaimAmt) ? user.PALastClaimAmt : 0;
    var PAFirstClaimDate = (!!user.PAFirstClaimDate) ? dateString(dateObjOffset(user.PAFirstClaimDate)) : "";
    var PALastClaimDate = (!!user.PALastClaimDate) ? dateString(dateObjOffset(user.PALastClaimDate)) : "";
    var Trips = (!!user.BaggageCount) ? user.BaggageCount : 0;
    $("input[fldTitle=hdnPADetails]").val([PAFirstClaim, PASecondClaim, PAFirstClaimDate, PALastClaimDate, PALastClaimAmount, Trips].join("#") + "$" + getPrepAllowanceDetails());
    // Advance Eligible
    $("input[fldTitle=hdnAdvanceEligible]").val(user.AdvanceEligible);
    // Job Classification
    $("input[fldTitle=hdnJobClassification]").val(user.JobClassification.Code);
    //Mobile No
    var MobileNo = (!!user.MobilePhoneNo) ? user.MobilePhoneNo : "";
    !!$("input[fldTitle=MobileNo]").val() ? $("input[fldTitle=MobileNo]").val() : $("input[fldTitle=MobileNo]").val(MobileNo);
    //Emergency Contact No
    var EmergencyContact = (!!user.EmergencyContactNo) ? user.EmergencyContactNo : "";
    !!$("input[fldTitle=EmergencyContact]").val() ? $("input[fldTitle=EmergencyContact]").val() : $("input[fldTitle=EmergencyContact]").val(EmergencyContact);
    //Home Telephone No
    var HomeTeleNo = (!!user.HomeTelephoneNo) ? user.HomeTelephoneNo : "";
    !!$("input[fldTitle=HomeTeleNo]").val() ? $("input[fldTitle=HomeTeleNo]").val() : $("input[fldTitle=HomeTeleNo]").val(HomeTeleNo);
    // Name in Passport
    var passportName = (!!user.NameinPassport) ? user.NameinPassport : user.DisplayName;
    $("input[fldTitle=hdnNameinPassport]").val(passportName);
    $("#idlblPassportName>span:first-child").text(passportName);
}
function getCompensationValues() {
    var jobClassification = $("input[fldTitle=hdnJobClassification]").val();
    var listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('CompensationAllowanceMaster')/Items?$select=Allowance&$filter=hdnJobClassification eq '" + jobClassification + "'");
    listData = JSON.parse(listData);
    if (listData.length > 0) {
        $("#CAModal").find("#idCAMaxAllEdit").val(outputMoney(listData[0].Allowance));
    }
    else {
        $("#CAModal").find('.modalInfo').text("Allowance not maintained for " + jobClassification + ".Kindly contact the system administrator.");
        $("#CAModal").find("#idCAMaxAllEdit").val(outputMoney(0));
        showError();
        return false;
    }
}
function calcCompensationAmount() {
    var TimeMargin = 12.01;
    var MidNightStartMargin = 0.00;
    var MidNightEndMargin = 0.00;

    ADDateString = $("#idCAFDateEdit").val();
    ADTimeString = $("#idCAFTmeEdit").val();
    AADateString = $("#idCAToDteEdit").val();
    AATimeString = $("#idCAToTmeEdit").val();
    if (ADDateString == "" || ADTimeString == "" || AADateString == "" || AATimeString == "")
        return;
    ADJavaDate = dateObj(ADDateString);
    AAJavaDate = dateObj(AADateString);
    ADTimeFloat = parseFloat(ADTimeString.replace(":", "."));
    AATimeFloat = parseFloat(AATimeString.replace(":", "."));
    //calculate startdate
    ADDiffDay = 0;
    ADAdjustDiff = 0;
    if (ADTimeFloat >= TimeMargin) {
        ADDiffDay = 0.5;
    } else {
        ADDiffDay = 1;
    }
    ADAdjustDiff = 1 - ADDiffDay;

    //calculate enddate
    AADiffDay = 0;
    AAAdjustDiff = 0;
    if (AATimeFloat < TimeMargin) {
        AADiffDay = 0.5;
    } else {
        AADiffDay = 1;
    }
    AAAdjustDiff = 1 - AADiffDay;
    DaysDiff = (AAJavaDate.getTime() - ADJavaDate.getTime()) / (24 * 60 * 60 * 1000) + 1;
    ActualDaysDiff = DaysDiff - (ADAdjustDiff + AAAdjustDiff);

    //Check for overnight travel
    if ((ADTimeFloat >= MidNightStartMargin) && (ADTimeFloat <= MidNightEndMargin)) {
        ActualDaysDiff = ActualDaysDiff + 1;
    }
    var allowance = outputNumber($("#idCAMaxAllEdit").val());
    var fcAmt = outputMoney(ActualDaysDiff * allowance);
    $("#idCADysEdit").val(parseFloat(ActualDaysDiff));
    $("#idCAFCAmtEdit").val(fcAmt);

    var exRate = $("#idCAExchEdit").val();
    if ($("#idCAExchEdit").val() != '' && $("#idCAExchEdit").val() > 0) {
        var lcAmt = outputMoney(outputNumber(fcAmt) * outputNumber(exRate));
        $("#idCALCAmtEdit").val(lcAmt);
    }
}
function checkPerNightShare(perNightShare) {
    return;
    if ($("#idACCPNShareMaxValueEdit").val() != "$" && (outputNumber(perNightShare.val()) > outputNumber($("#idACCPNShareMaxValueEdit").val()))) {
        $("#ACCModal").find('.modalInfo').text("Per Night Share exceeds maximum allowed amount");
        $("#idACCPNShareEdit").focus();
        showError();
        return false;
    }
    else
        $("#ACCModal").find('.modalInfo').text("");
}
function getAccommodationRate() {
    return;
    $("#ACCModal").find('.modalInfo').text("");
    countryCityValue = $("#idACCCountryEdit").val();
    var daDate = $.trim($("#" + (travelStage == "pre" ? "idPreDeptDate" : "idPostDeptDate")).text());
    daDate = moment(dateString(daDate), displayDateFormat).format("YYYY-MM-D");
    if (!TravellingTo) {
        $("#" + modalId).find('.modalInfo').text("Kindly select the Travelling To value from the Travel Info Tab. Please Contact Administrator.");
        showError();
        return false;
    }
    else {
        var staffGrade = $("input[fldTitle='hdnStaffGrade']").val();
        if (TravellingTo == "Domestic")
            urlForAccomRate = currentSiteUrl + "/_api/web/lists/getByTitle('DailyAllowanceType')/Items?$select=HotelAllowance&$filter=TravellingTo eq '" + TravellingTo + "' and StaffGrade/StaffGrade eq '" + staffGrade + "' and CityName/Description eq '" + countryCityValue + "' and Division/Title eq'" + division + "' and EffectiveStartDate le'" + daDate + "' and EffectiveEndDate ge'" + daDate + "'";
        else
            urlForAccomRate = currentSiteUrl + "/_api/web/lists/getByTitle('DailyAllowanceType')/Items?$select=HotelAllowance&$filter=TravellingTo eq '" + TravellingTo + "' and StaffGrade/StaffGrade eq '" + staffGrade + "' and Country/Description eq '" + countryCityValue + "' and Division/Title eq'" + division + "' and EffectiveStartDate le'" + daDate + "' and EffectiveEndDate ge'" + daDate + "'";
        $("#idACCPNShareEdit").val(outputMoney(0));
        $("#idACCPNShareMaxValueEdit").val(outputMoney(0));
        $("input[fldTitle='hdnAccPerNightShare']").val(outputMoney(0));
        $.ajax({
            url: urlForAccomRate,
            type: "GET",
            async: false,
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                var items = data.d.results;
                if (items.length > 0) {
                    if (items[0].HotelAllowance == "$") {
                        $("#idACCPNShareEdit").val();
                        $("#idACCPNShareMaxValueEdit").val(items[0].HotelAllowance);
                        $("input[fldTitle='hdnAccPerNightShare']").val(items[0].HotelAllowance);
                    }
                    else {
                        $("#idACCPNShareEdit").val(outputMoney(items[0].HotelAllowance));
                        $("#idACCPNShareMaxValueEdit").val(outputMoney(items[0].HotelAllowance));
                        $("input[fldTitle='hdnAccPerNightShare']").val(outputMoney(items[0].HotelAllowance));
                    }
                }
                else {
                    $("#idACCCountryEdit").val("Select");
                    $("#ACCModal").find('.modalInfo').text("Accommodation Rate is not maintained for the selected Country/City. Please Contact Administrator.");
                    showError();
                    return false;
                }
            },
            error: function (error) {
                console.log(JSON.stringify(error));
            }
        });
    }
}
//To Get Accommodation Rate End
function getWinValues(modalID) {
    var WADetails = $("input[fldTitle=hdnWinterAllowanceDetails]").val().split("#");
    var FirstClaimDate = (!!WADetails[2]) ? WADetails[2] : "";
    var LastDateOfClaim = (!!WADetails[3]) ? WADetails[3] : "";
    var LastClaimAmount = (!!WADetails[4]) ? outputMoney(WADetails[4]) : outputMoney(0);
    var dtToUpdate = (!!LastDateOfClaim ? (
                        dateObj(FirstClaimDate) > dateObj(LastDateOfClaim) ? FirstClaimDate : LastDateOfClaim
                    ) : FirstClaimDate);
    if (modalID == "onload") {
        var tblRow = $("#" + getTableID("WinterAllowance") + ">tbody>tr:first-child");
        var objSpan = tblRow.find("span[postkey='LastClaimDate']");
        var strHTML = "";
        if (!!objSpan && objSpan.length > 0) {
            objSpan.text(dtToUpdate);
            strHTML = objSpan[0].outerHTML;
            objSpan.parent().html(strHTML + dtToUpdate);
        }
        objSpan = tblRow.find("span[postkey='LastClaimAmt']");
        strHTML = "";
        if (!!objSpan && objSpan.length > 0) {
            objSpan.text(LastClaimAmount);
            strHTML = objSpan[0].outerHTML;
            objSpan.parent().html(strHTML + LastClaimAmount);
        }
    } else {
        $("#" + modalID).find("#idWINLastClaimAmountEdit").val(LastClaimAmount);
        $("#" + modalID).find("#idWINLastClaimDateEdit").val(dtToUpdate);
        $("#" + modalID).find("#idWINExpTypEdit").val("Winter Allowance");
    }
}
function drawDataTbl(tblID, argFlag) {
    if ($.fn.DataTable.isDataTable('#' + tblID)) {
        if (argFlag) {
            $("#" + tblID).DataTable().page.len(-1).draw();
        }
        else {
            $("#" + tblID).DataTable().page.len(10).draw();
        }
    }
}
function addNewItem(modalID, tblID) {
    drawDataTbl(tblID, true);
    loadRemValues(tblID);

    $("#" + modalID).find("input").each(function () {
        $(this).val("");
    });

    $("#" + modalID).find("textarea").each(function () {
        $(this).val("");
    });
    $("#" + modalID).find("select").each(function () {
        if ($(this).find('option').length == 1) {
            $(this).prop('selectedIndex', 0);
        }
        else {
            $(this).val("Select");
        }
    });
    $("#" + modalID).find("input,select,textarea").each(function () {
        if (!!$(this).attr("prevalue")) {
            $(this).attr("prevalue", "");
        }
    });

    setDefaultValues(modalID, tblID);
    var table = $('#' + tblID).DataTable();
    var rowCnt = parseInt(table.data().length) + 1;
    NewRow = true;
    LastRow = true;
    NewRowsCnt = 0;
    updateRow(tblID, modalID);
    objSelectedRow = $('#' + tblID + ' > tbody > tr').last();
    $('#' + modalID).find('.btncopy').show();
    var argExpenCode = arrExpCodes[0][tblID];
    if (tblID == "idTblOTH") {
        $('#' + modalID).find(".ModalExpDisp").text("Others");
    }
    else if (tblID == "idTblENTD") {
        $('#' + modalID).find(".ModalExpDisp").text("Entertainment Details");
    }
    else if (tblID == "idTblGIFTD") {
        $('#' + modalID).find(".ModalExpDisp").text("Gift Details");
    }
    else if (!!expenseTypeDisplay[argExpenCode]) {
        $('#' + modalID).find(".ModalExpDisp").text(expenseTypeDisplay[argExpenCode].expenseTypeDisplay);
    }
    $('#' + modalID).find('.modalEntryType').text(" - New " + travelStage + " entry");
    $('#' + modalID).find('.modalRowNo').text("Row - " + rowCnt);
    $('#' + modalID).find('.modalInfo').text("");
    var objSqNoSpan = $('#' + modalID).find('.SqNoTxt');
    var SqNoTxt = objSqNoSpan.text();
    var SqNoFld = objSqNoSpan.attr("SqNoFld");
    $('#' + modalID).find('#' + SqNoFld).val(SqNoTxt + rowCnt);
}
function processUpdateRow(tblID) {
    tableid = tblID;
    var table = $('#' + tblID).DataTable();
    if (NewRow && NewRowsCnt == 0) {
        rowData = "<tr class='temprow'>" + rowData + "</tr>";
        table.row.add($(rowData)).draw();
        NewRowsCnt++;
    } else {
        $(objSelectedRow).html($(rowData));
        $(objSelectedRow).removeClass("temprow");
    }
    if (tblID == "idTblWIN") {
        var tableWin = $('#' + tblID).DataTable();
        var rowCntWin = parseInt(tableWin.data().length);
        if (rowCntWin > 0) {
            $("#" + tblID).find(".btnWinAdd").hide();

        } else {
            $("#" + tblID).find(".btnWinAdd").show();
        }
    }
    if (tblID == "idTblPRP") {
        var tablePRP = $('#' + tblID).DataTable();
        var rowCntPRP = parseInt(tablePRP.data().length);
        if (rowCntPRP > 0) {
            $("#" + tblID).find(".btnPRPAdd").hide();

        } else {
            $("#" + tblID).find(".btnPRPAdd").show();
        }
    }
}
$(document).on('click', 'td.details-control', function (e) {
    e.preventDefault();
    var tr = $(this).closest('tr');
    var tblID = $(this).closest('table').attr('id');
    var table = $('#' + tblID).DataTable();
    tr.find('i:first').toggleClass('fa-plus fa-minus');
    var row = table.row(tr);
    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
    } else {
        row.child(formatDisplay(tblID, tr)).show();
        tr.addClass('shown');
    }
    return false;
});
function deleteExpChildEntries(expCode) {
    var tblID = getTableID(expCode);
    drawDataTbl(tblID, true);
    getExpRowIDs(tblID);
    drawDataTbl(tblID, false);
    var tblExp = $('#' + tblID).DataTable();
    tblExp.clear();
    tblExp.draw();
    if (expCode == arrExpCodes[0].idTblMIL) {
        drawDataTbl("idTblOTH", true);
        getExpRowIDs("idTblOTH");
        drawDataTbl("idTblOTH", false);
        tblExp = $('#idTblOTH').DataTable();
        tblExp.clear();
        tblExp.draw();
    }
    if (expCode == arrExpCodes[0].idTblGIFT || expCode == arrExpCodes[0].idTblENT) {
        drawDataTbl(tblID + "D", true);
        getExpRowIDs(tblID + "D");
        tblExp = $('#' + tblID + "D").DataTable();
        tblExp.clear();
        tblExp.draw();
        drawDataTbl(tblID + "D", false);
    }
}
$(document).on('click', '.deleterow', function (e) {
    e.preventDefault();
    var ExpKeyType = $(this).find('.expenseTypeKey').val();
    var tr = $(this).parents('tr:first');
    var rowID = tr.find('span[prekey="ID"]').text();
    var tblID = $(this).closest('table').attr('id');
    drawDataTbl(tblID, true);
    var listName = $('#' + tblID).attr("listName");
    var objDelRows = $("input[fldTitle='hdn" + listName + "DelRows']");
    if (!!rowID) {
        if (tblID == "idTblEXP") {
            argExpenseCode = $(this).closest(tr).find('span[prekey="ExpType"]').text();
        }
        else if (tblID == "idTblTSH") {
            argExpenseCode = "TravelSchedule";
        } else {
            argExpenseCode = arrExpCodes[0][tblID];
            if (tblID == "idTblOTH") {
                argExpenseCode = arrExpCodes[0].idTblMIL;
            }
        }
        if (canDeleteRow(argExpenseCode, rowID, tblID)) {
            objDelRows.val(objDelRows.val() + rowID + ",");
            deleteObjKey(ExpKeyType);
            if (tblID == "idTblEXP") {
                deleteExpChildEntries(argExpenseCode);
            }
        }
        else {
            if (tblID == "idTblEXP") {
                objDelRows.val(objDelRows.val() + rowID + ",");
                deleteObjKey(ExpKeyType);
                deleteExpChildEntries(argExpenseCode);
            }
            else {
                alertModal("Pre entries cannot be deleted...");
                drawDataTbl(tblID, false);
                return false;
            }
        }
    }
    if (rowID == "" && tblID == "idTblEXP") {
        deleteObjKey(ExpKeyType);
        deleteExpChildEntries(ExpKeyType);
    }
    if ($.fn.DataTable.isDataTable('#' + tblID)) {
        var table = $('#' + tblID).DataTable();
        if (NoCollapseExpand.indexOf(tblID) == -1) {
            collapseAll(tblID);
        }
        rowIndex = tr.index();
        table.rows(rowIndex).remove().draw();
    }
    else {
        if (tblID == "idTblEXP") {
            $("#ac" + $(this).closest(tr).find('span[prekey="ExpType"]').text()).hide();
            $(this).closest(tr).remove();
        }
        else {
            $(this).closest(tr).remove();
        }
    }
    var modalID = $(this).attr('modalid');
    if (modalID != undefined) {
        var SqNoTxt = $('#' + modalID).find('.SqNoTxt').text();
        var rowCnt = 1;
        var strHTML = "";
        $(tableRowSelector(tblID)).each(function () {
            objSpan = $(this).find('span[postkey="SNo"]');
            if (objSpan != undefined && objSpan.length > 0) {
                objSpan.text(SqNoTxt + rowCnt);
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + SqNoTxt + rowCnt);
                rowCnt++;
            }
        });
    }
    if (tblID == "idTblTSH") {
        generateTSHSummary();
    }
    if (tblID == "idTblMYEXCH") {
        getManualExRate();
    }
    else {
        calculateTotalAmt(tblID);
    }
    var tableWin;
    var rowCntWin;
    if (tblID == "idTblWIN") {
        tableWin = $('#' + tblID).DataTable();
        rowCntWin = parseInt(tableWin.data().length);
        if (rowCntWin > 0) {
            $("#" + tblID).find(".btnWinAdd").hide();
        } else {
            $("#" + tblID).find(".btnWinAdd").show();
        }
    }
    if (tblID == "idTblPRP") {
        tableWin = $('#' + tblID).DataTable();
        rowCntWin = parseInt(tableWin.data().length);
        if (rowCntWin > 0) {
            $("#" + tblID).find(".btnPRPAdd").hide();
        } else {
            $("#" + tblID).find(".btnPRPAdd").show();
        }
    }
    enableDisableRadioLinked(tblID);
    if (tblID == "idTblTSH") {
        lastRowOnlyDelete(tblID);
    }
    drawDataTbl(tblID, false);
});
$(document).on('click', '.editrow', function (e) {
    e.preventDefault();
    var tr = $(this).parents('tr:first');
    var tblID = $(this).closest('table').attr('id');
    var modalID = $(this).attr('modalid');
    if (tblID == "idTblTSH" && !activeTravelType) {
        alertModal("Please select Travel Type and then retry editing trip.");
        $("#idTravelType").find("input[type=checkbox]").focus();
        fldToFocus = $("#idTravelType").find("input[type=checkbox]");
        return false;
    }
    loadRemValues(tblID);
    drawDataTbl(tblID, true);
    if (NoCollapseExpand.indexOf(tblID) == -1) {
        collapseAll(tblID);
    }
    $('#' + modalID).find('.btncopy').hide();
    var argExpenCode = arrExpCodes[0][tblID];
    if (tblID == "idTblOTH") {
        $('#' + modalID).find(".ModalExpDisp").text("Others");
    }
    else if (tblID == "idTblENTD") {
        $('#' + modalID).find(".ModalExpDisp").text("Entertainment Details");
    }
    else if (tblID == "idTblGIFTD") {
        $('#' + modalID).find(".ModalExpDisp").text("Gift Details");
    }
    else if (!!expenseTypeDisplay[argExpenCode]) {
        $('#' + modalID).find(".ModalExpDisp").text(expenseTypeDisplay[argExpenCode].expenseTypeDisplay);
    }
    $('#' + modalID).find('.modalEntryType').text(" - Edit " + travelStage + " entry");
    $('#' + modalID).find('.modalInfo').text("");
    $("#" + modalID).find("input,select,textarea").each(function () {
        if ($(this).attr("prevalue") != undefined) {
            $(this).attr("prevalue", "");
        }
    });
    NewRow = false;
    objSelectedRow = tr;
    rowNo = tr.index() + 1;
    $('#' + modalID).find('.modalRowNo').text("Row - " + rowNo);
    if (!!$("#" + modalID).find("select.costcenter")[0]) {
        $("#" + modalID).find("select.costcenter").html($("#ddlhdnPC").html());
        $("#" + modalID).find("select.costcenter")[0].selectedIndex = $("[fldtitle=ChargeToPC]")[0].selectedIndex;
    }
    setDataEditModal(tblID, modalID);
    $("#" + modalID).modal('show');
    return false;
});
function collapseAll(tblID) {
    var table = $('#' + tblID).DataTable();
    $(tableRowSelector(tblID)).each(function () {
        var currRow = $(this);
        row = table.row($(this));
        currRow.find('i:first').removeClass('fa-plus fa-minus');
        row.child.hide();
        currRow.removeClass('shown');
        currRow.find('i:first').addClass('fa-plus');
    });
}
function bindStaticControls() {
    $('.predisplay').hide();
    $('.btnupdate').on('click', function () {
        clickedModalBtn = $(this);
        var modalID = $(this).attr('modalid');
        var tblID = $(this).attr('expensetbl');
        if (updateRow(tblID, modalID))
            $("#" + modalID).modal('hide');
        enableDisableRadioLinked(tblID);
    });
    $('th.details-control').on('click', function () {
        var isShown = false;
        var tr = $(this).closest('tr');
        var tblID = $(this).closest('table').attr('id');
        var dataTbl = $('#' + tblID).DataTable();
        if (tr.find('i:first').hasClass('fa-minus')) {
            isShown = true;
        }
        tr.find('i').toggleClass('fa-plus fa-minus');
        $('#' + tblID + ' > tbody  > tr').each(function () {
            tr = $(this);
            row = dataTbl.row($(this));
            tr.find('i:first').removeClass('fa-plus fa-minus');
            if (isShown) {
                row.child.hide();
                tr.removeClass('shown');
                tr.find('i:first').addClass('fa-plus');
            } else {
                row.child(formatDisplay(tblID, tr)).show();
                tr.addClass('shown');
                tr.find('i:first').addClass('fa-minus');
            }
        });
    });
    $('.popupmodal').on('hidden.bs.modal', function () {
        var currModal = $(this).closest(".popupmodal");
        var tblID = currModal.find(".btnupdate").attr("expensetbl");
        if (NewRow) {
            var table = $('#' + tblID).DataTable();
            table.rows('.temprow').remove().draw();
        }
        if (tblID == "idTblTSH") {
            if (flgRecalcDA) {
                var objSched = objSchedCountryCity(true);
                if (objSched.validTrips == objSched.travelledTrips) {
                    generateTSHSummary();
                }
            }
        }
        NewRow = false;
        NewRowsCnt = 0;
        LastRow = false;
        if (tblID != "idTblTSH") {
            calculateTotalAmt(tblID);
        }
        if (tblID == "idTblDA") {
            generateSQNo('DAModal', 'idTblDA');
        }
        if (tblID == "idTblMYEXCH") {
            getManualExRate();
        }
        var tableWin;
        var rowCntWin;
        if (tblID == "idTblWIN") {
            tableWin = $('#' + tblID).DataTable();
            rowCntWin = parseInt(tableWin.data().length);
            if (rowCntWin > 0) {
                $("#" + tblID).find(".btnWinAdd").hide();
            } else {
                $("#" + tblID).find(".btnWinAdd").show();
            }
        }
        if (tblID == "idTblPRP") {
            tableWin = $('#' + tblID).DataTable();
            rowCntWin = parseInt(tableWin.data().length);
            if (rowCntWin > 0) {
                $("#" + tblID).find(".btnPRPAdd").hide();
            } else {
                $("#" + tblID).find(".btnPRPAdd").show();
            }
        }
        currModal.find("*[confirm=Yes]").attr("confirm", "No");
        enableDisableRadioLinked(tblID);
        if (tblID == "idTblTSH") {
            lastRowOnlyDelete(tblID);
            flgRecalcDA = false;
        }
        drawDataTbl(tblID, false);
    });
    $("form").keydown(function (e) {
        e = e || window.event;
        var key = e.which || e.charCode || e.keyCode || 0;
        if (key == 13 && !$(e.target).is("textarea")) { // Prevent Submission on Enter click
            e.preventDefault();
        }
    });
    $("form").keydown(function (e) {
        e = e || window.event;
        var key = e.which || e.charCode || e.keyCode || 0;
        var actTag = e.target.tagName.toLowerCase();
        if (key == 8 && (["input", "select", "textarea"].indexOf(actTag) != -1 ? (e.target.disabled || e.target.readOnly) : true)) { // Prevent Submission on Enter click
            e.preventDefault();
        }
    });
    $('.amount').focus(function (e) {
        if ($(this).is('[readonly]')) {
            return;
        }
        var fldVal = $(this).val();
        if (fldVal == "0.00") {
            $(this).val("");
        }
    });
    $('.amount').keypress(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            e.preventDefault();
        }
        else {
            var keyCode = e.keyCode;
            if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 46 || keyCode == 45)) {
                e.preventDefault();
            }
        }
    });
    $('.amount').attr("MaxLength", 13);
    $('.amount').css("text-align", "right");
    $('.unum').attr("MaxLength", 13);
    $('.unum').css("text-align", "right");
    $('.unum').keypress(function (e) {
        if (e.shiftKey || e.ctrlKey || e.altKey) {
            e.preventDefault();
        }
        else {
            var keyCode = e.keyCode;
            if (!((keyCode >= 48 && keyCode <= 57))) {
                e.preventDefault();
            }
        }
    });
    $('.unum').focus(function (e) {
        var fldVal = $(this).val();
        if (fldVal == "0") {
            $(this).val("");
        }
    });
    $('.mobileno').keypress(function (e) {
        if (e.ctrlKey || e.altKey) {
            e.preventDefault();
        }
        else {
            var keyCode = e.keyCode;
            if (!((keyCode >= 48 && keyCode <= 57) || keyCode == 40 || keyCode == 41 || keyCode == 43 || keyCode == 45)) {
                e.preventDefault();
            }
        }
    });
    //PMT Changes Start
    $("select[fldtitle='ddlBranchCode']").change(function () {
        var gblBranchCode = $("select[fldtitle='ddlBranchCode'] option:selected").val();
        if (gblBranchCode == "Select") {
            $("input[fldtitle='txtBranchDesc']").val("");
        }
        var gblBranchCodeDisplay = $("select[fldtitle='ddlBranchCode'] option:selected").text();
        setDisplayValues("hdnBranchCode", gblBranchCode);
        setDisplayValues("hdnBranchCodeDisplay", gblBranchCodeDisplay);
        var branchCodeColl = getData(rootSiteUrl + "/_api/web/lists/getByTitle('eWorkMaintenanceMaster')/Items?$filter=Code eq'" + gblBranchCode + "'");
        branchCodeColl = JSON.parse(branchCodeColl);
        if (branchCodeColl.length != 0) {
            $("input[fldtitle='txtBranchDesc']").val(branchCodeColl[0].Description);
        }
        //setDisplayValues("txtBranchDesc", gblBranchCodeDisplay); //for onchange of  
    });
    $("select[fldtitle='ddlBranchArea']").change(function () {
        var gblBranchArea = $("select[fldtitle='ddlBranchArea'] option:selected").val();
        if (gblBranchArea == "Select") {
            $("input[fldtitle='txtBusinessDesc']").val("");
            $("input[fldtitle='txtBusinessPC']").val("");
        }
        var gblBranchAreaDisplay = $("select[fldtitle='ddlBranchArea'] option:selected").text();
        setDisplayValues("hdnBranchArea", gblBranchArea);
        setDisplayValues("hdnBranchAreaDisplay", gblBranchAreaDisplay);
        var BranchAreaColl = getData(rootSiteUrl + "/_api/web/lists/getByTitle('BusinessArea')/Items?$select=Description,BusinessProfitCenter&$filter=BusinessArea eq'" + gblBranchArea + "'");
        BranchAreaColl = JSON.parse(BranchAreaColl);
        if (BranchAreaColl.length != 0) {
            $("input[fldtitle='txtBusinessDesc']").val(BranchAreaColl[0].Description);
            $("input[fldtitle='txtBusinessPC']").val(BranchAreaColl[0].BusinessProfitCenter);
            $("input[fldtitle='dynVals']").val(JSON.stringify(
                [BranchAreaColl[0].Description, BranchAreaColl[0].BusinessProfitCenter]
            ));
        }
    });
    //PMT Changes End
}
function setAccountFields() {
    //To Set Default value to BusinessArea Dropdown
    var busArea = $("input[fldtitle='hdnBranchArea']").val();
    if (busArea == "Select" || busArea=="") {
        var listData = getData(rootSiteUrl + "/_api/web/lists/getByTitle('TempUserProfile')/Items?$select=BusinessArea/BusinessArea&$expand=BusinessArea/BusinessArea&$filter=EmployeeID eq '" + empID + "'&$top=1");
        listData = JSON.parse(listData);
        if (listData.length > 0) {
            busArea = listData[0].BusinessArea.BusinessArea
        }
    }
    loadDropDownList('RootSite', 'BusinessArea', 'BusinessArea', 'BusinessArea', 'ddlhdnBusinessArea', busArea, false); // Business Area
    $(".ddlBranchArea").html($("#ddlhdnBusinessArea").html());
    $("select[fldtitle='ddlBranchArea']").change();
}
function traverseRow() {
    $('.btnnxt, .btnprv').on('click', function () {
        clickedModalBtn = $(this);
        var deleteLastRow = false;
        var modalID = $(this).attr('modalid');
        var tblID = $(this).attr('expensetbl');
        if ($(this).hasClass('btnprv')) {
            if ($(objSelectedRow).prev().length == 0) {
                $('#' + modalID).find('.modalInfo').text("This is the first row....");
                showError();
                return false;
            }
        }
        if (updateRow(tblID, modalID) == false) {
            if (LastRow && $(this).hasClass('btnprv')) {
                deleteLastRow = true;
            }
            else {
                return false;
            }
        }
        enableDisableRadioLinked(tblID);
        $('#' + modalID).find('.modalInfo').text("");
        if ($(this).hasClass('btnnxt')) {
            if ($(objSelectedRow).next().length == 0) {
                if (NewRow == true) {
                    addNewItem(modalID, tblID);
                    LastRow = true;
                } else {
                    $('#' + modalID).find('.modalInfo').text("This is the last row....");
                    showError();
                }
                return false;
            } else
                tr = $(objSelectedRow).next();
        } else if ($(this).hasClass('btnprv')) {
            if ($(objSelectedRow).prev().length == 0) {
                $('#' + modalID).find('.modalInfo').text("This is the first row....");
                showError();
                return;
            } else {
                tr = $(objSelectedRow).prev();
                if (LastRow == true) {
                    if (deleteLastRow) {
                        var table = $('#' + tblID).DataTable();
                        table.rows('.temprow').remove().draw();
                        LastRow = true;
                    }
                }
                else {
                    LastRow = false;
                }
            }
        }
        var rowNo = tr.index() + 1;
        if (tr.hasClass("temprow")) {
            $('#' + modalID).find('.modalEntryType').text(" - New Entry");
        }
        else {
            $('#' + modalID).find('.modalEntryType').text(" - Edit Entry");
        }
        $('#' + modalID).find('.modalRowNo').text("Row - " + rowNo);
        objSelectedRow = tr;
        setDataEditModal(tblID);
        //$("#" + modalID).find("select.costcenter").multiselect("refresh");
        $('#' + modalID).find("*[confirm=Yes]").attr("confirm", "No");
    });
    $('.btncopy').on('click', function () {
        clickedModalBtn = $(this);
        var modalID = $(this).attr('modalid');
        var tblID = $(this).attr('expensetbl');
        if (updateRow(tblID, modalID) == false) {
            return false;
        }
        var table = $('#' + tblID).DataTable();
        var rowDataHTML = "<tr class='temprow'>" + $(objSelectedRow).html() + "</tr>";
        table.row.add($(rowDataHTML)).draw();
        var rowCnt = parseInt(table.data().length);
        NewRowsCnt++;
        objSelectedRow = $('#' + tblID + ' > tbody > tr').last();
        var objSpan = $(objSelectedRow).find('span[prekey="ID"]');
        objSpan.text("");
        if (travelStage == "post") {
            $(objSelectedRow).find('.predisplay').text("");
            $(objSelectedRow).find('span[prevalue]').attr("prevalue", "");
        }
        setDataEditModal(tblID);
        var objSqNoSpan = $('#' + modalID).find('.SqNoTxt');
        var SqNoTxt = objSqNoSpan.text();
        objSpan = $(objSelectedRow).find('span[prekey="SNo"]');
        objSpan.text(SqNoTxt + rowCnt);
        objSpan.parent().text(SqNoTxt + rowCnt);
        var SqNoFld = objSqNoSpan.attr("SqNoFld");
        $('#' + modalID).find('.modalEntryType').text(" - New Entry");
        $('#' + modalID).find('#' + SqNoFld).val(SqNoTxt + rowCnt);
        $('#' + modalID).find('.modalRowNo').text("Row - " + rowCnt);
        $('#' + modalID).find("*[confirm=Yes]").attr("confirm", "No");
    });
}
//Field Validation Start
function validateTravelFields(fldIDArr, fldNameArr, fldTypeArr, fldModal) {
    $("#" + fldModal).find('.modalInfo').text("");
    for (var i = 0; i < fldIDArr.length; i++) {
        var fldID = fldIDArr[i];
        var fldType = fldTypeArr[i];
        var fldName = fldNameArr[i];

        if (fldType == "text") {
            if ($("#" + fldID).val().trim() == "") {
                $("#" + fldModal).find('.modalInfo').text(fldName + " cannot be blank");
                $("#" + fldID).focus();
                showError();
                return false;
            }
        }
        else if (fldType.toLowerCase() == "select") {
            if (($("#" + fldID + ' option:selected').index() == -1) || $("#" + fldID).val().toLowerCase() == "select") {
                $("#" + fldModal).find('.modalInfo').text("Please select the value for " + fldName);
                $("#" + fldModal).val("Select");
                $("#" + fldID).focus();
                showError();
                return false;
            }
        }
        else if (fldType.toLowerCase() == "number") {
            if ($("#" + fldID).val().trim() == "") {
                $("#" + fldModal).find('.modalInfo').text(fldName + " cannot be blank");
                $("#" + fldID).focus();
                showError();
                return false;
            }
            if (isNaN(outputNumber($("#" + fldID).val().trim()))) {
                $("#" + fldModal).find('.modalInfo').text(fldName + " should be a number");
                $("#" + fldID).focus();
                showError();
                return false;
            }
            if (outputNumber($("#" + fldID).val().trim()) <= 0) {
                $("#" + fldModal).find('.modalInfo').text(fldName + " should be greater than 0");
                $("#" + fldID).focus();
                showError();
                return false;
            }
        }
        else if (fldType.toLowerCase() == "zeronumber") {
            if ($("#" + fldID).val().trim() == "") {
                $("#" + fldModal).find('.modalInfo').text(fldName + " cannot be blank");
                $("#" + fldID).focus();
                showError();
                return false;
            }
            if (isNaN(outputNumber($("#" + fldID).val().trim()))) {
                $("#" + fldModal).find('.modalInfo').text(fldName + " should be a number");
                $("#" + fldID).focus();
                showError();
                return false;
            }
            if (outputNumber($("#" + fldID).val().trim()) < 0) {
                $("#" + fldModal).find('.modalInfo').text(fldName + " should be greater than or equal to 0");
                $("#" + fldID).focus();
                showError();
                return false;
            }
        }
    }
    return true;
}
//Field Validation End
function trimArray(arr) {
    var trimVals = ["", "NA"];
    var tempArr = arr.join("•").toUpperCase().split("•");
    trimVals.forEach(function (item) {
        while (tempArr.indexOf(item) != -1) {
            var idxToRemove = tempArr.indexOf(item);
            tempArr.splice(idxToRemove, 1);
            arr.splice(idxToRemove, 1);
        }
    });
    return arr;
}
//Format Table Start
function formatTravelFields(tr, fldLabel, fldID, fldClass, prePost) {
    if (printFlg) {
        return formatTravelFields_Print(tr, fldLabel, fldID, fldClass, prePost); // moved to PrintTravel JS
    }
    if (printFlgLessDetails) {
        return formatTravelFields_PrintLessDetails(tr, fldLabel, fldID, fldClass, prePost); // moved to PrintTravel JS
    }
    var colspan = "";
    var closeRow = "";
    var cls = "";
    var formatText = '<table cellpadding="5" cellspacing="0" border="1" style="width:100%; padding-left:50px; border: 1px solid lightgray !important;"><tr>';
    var fldWidth = "width=15%";
    var preTD = "", postTD = "";
    var postDetails = travelStage == "post" && prePost == true;
    if (postDetails) {
        formatText += '<th></th><th>Pre</th><th>Post</th><th></th><th>Pre</th><th>Post</th><th></th><th>Pre</th><th>Post</th></tr><tr>';
        fldWidth = "width=10%";
    }
    for (var i = 0; i < fldLabel.length; i++) {
        colspan = fldLabel[i] == "Description" ? (postDetails ? "colspan=8" : "colspan=5") : "";
        cls = fldClass[i] == "" ? "" : "class=" + fldClass[i];
        closeRow = (fldLabel[i] == "") || (((i + 1) % 3 == 0 && i < fldLabel.length)) ? "</tr><tr>" : "";
        preTD = "";
        postTD = "";
        if ((fldLabel[i] == "") || (fldLabel[i] == "NA")) {
            cls = "";
            fldWidth = "";
            preTD = "<td " + [fldWidth, cls, colspan].join(" ") + "></td>";
            postTD = (postDetails) ? "<td></td>" : "";
            formatText += "<th nowrap " + fldWidth + "></th>" + preTD + postTD + closeRow;
            continue;
        }
        if (postDetails) {
            if (i == 0) {
                postTD = "<td  colspan=2>" + tr.find("#" + fldID[i]).text() + "</td>";
            }
            else {
                preTD = "<td " + [fldWidth, cls, colspan].join(" ") + ">" + (tr.find('#' + fldID[i]).attr("prevalue") ? tr.find('#' + fldID[i]).attr("prevalue") : "") + "</td>";
                postTD = "<td " + [fldWidth, cls, colspan].join(" ") + ">" + tr.find("#" + fldID[i]).text() + "</td>";
            }
        }
        else {
            preTD = "<td " + [fldWidth, cls, colspan].join(" ") + ">" + tr.find("#" + fldID[i]).text() + "</td>";
        }
        if (fldLabel[i] == "Description") {
            //formatText += "<tr>";
            if (postDetails) {
                var lsDesc = "<u>Pre Travel:</u> " + (tr.find('#' + fldID[i]).attr("prevalue") ? tr.find('#' + fldID[i]).attr("prevalue") : "") + "<br><br><u> Post Travel:</u> " + tr.find("#" + fldID[i]).text();
                formatText += "<th nowrap " + fldWidth + ">" + fldLabel[i] + "</th><td " + [fldWidth, cls, colspan].join(" ") + ">" + lsDesc + "</td>" + closeRow;
            }
            else {
                formatText += "<th nowrap " + fldWidth + ">" + fldLabel[i] + "</th>" + preTD + postTD + closeRow;
            }
        }
        else {
            formatText += "<th nowrap " + fldWidth + ">" + fldLabel[i] + "</th>" + preTD + postTD + closeRow;
        }
    }
    formatText += "</tr></table><br>";
    return formatText;
}
//Format Table End
function formatAmt(obj) {
    $("#" + obj.id).val(outputMoney(obj.value));
}
function formatAmtEX(obj) {
    if (obj.value <= 0) {
        $("#" + obj.id).val(outputMoneyEx(0));
    }
    $("#" + obj.id).val(outputMoneyEx(obj.value));
}
//Calculate LC Amount Start
function calculateLCAmt(FCAmt, xRate, LCAmt) {
    var LC = 0;
    var FC = outputNumber(FCAmt.val());
    var xr = outputNumber(xRate.val());
    FC = isNaN(FC) || FC == "" ? "0" : FC;
    xr = isNaN(xr) || xr == "" ? "0" : xr;
    LC = parseFloat(FC) * parseFloat(xr);
    FCAmt.val(outputMoney(FC));
    xRate.val(outputMoneyEx(xr));
    LCAmt.val(outputMoney(LC));
}
//Calculate LC Amount End
//Calculate FC Amount - Compensation Allowance Starts
function calculateFCAmt(Days, MaxAll, FCAmt) {
    var FC = 0;
    var MaxAllAmt = outputNumber(MaxAll.val());
    var NoDays = Days.val();
    if (NoDays <= 0) {
        FCAmt.val(outputMoney(FC));
        return false;
    }
    FC = parseFloat(MaxAllAmt) / parseFloat(NoDays);
    FCAmt.val(outputMoney(FC));
}
//Calculate FC Amount - Compensation Allowance Ends
//Set All Claim Data Start
function setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable) {

    for (var i = 0; i < fldEditID.length; i++) {

        $('#' + fldEditID[i]).val(tr.find("#" + fldID[i]).text());
        if (isAccountsLevel == "Yes" && fldAccEditable[i] != "") {
            $('#' + fldEditID[i]).attr(fldAccEditable[i], true);
        }
        if (travelStage == "post") {
            $('#' + fldEditID[i]).attr("prevalue", tr.find("#" + fldID[i]).attr("prevalue"));
        }
    }
}
//Set All Claim Data End
//Get JSON from Table
function getJSONFromTbl(tblID) {
    drawDataTbl(tblID, true);
    var tblJSON = [];
    var keyName = "prekey";
    if (travelStage == "post") {
        keyName = "postkey";
    }
    $(tableRowSelector(tblID)).each(function () {
        var rowJSON = {
        };
        $('td span.datacol', this).each(function () {
            var value = $(this).html();
            key = $(this).attr(keyName);
            rowJSON[key] = value;
        });
        tblJSON.push(rowJSON);
    });
    drawDataTbl(tblID, false);
    return tblJSON;
}
function getAllJSONFromTbl(tblID, flgDAGen) {
    drawDataTbl(tblID, true);
    var tblJSON = [];
    var keyName = "prekey"
    if (travelStage == "post") {
        keyName = "postkey"
    }
    $(tableRowSelector(tblID)).each(function () {
        var rowJSON = {
        };
        $('td span.datacol', this).each(function () {
            var value = $(this).html();
            key = $(this).attr(keyName);
            if (key == "ID" && flgDAGen) {
                value = "";
            }
            rowJSON[key] = value;
            if (travelStage == "post") {
                key = $(this).attr("prekey");
                value = $(this).attr("prevalue");
                if (flgDAGen ? true : (!!value && value != "NA")) {
                    if (value != undefined) {
                        rowJSON[key] = value;
                    }
                }
            }
        });
        tblJSON.push(rowJSON);
    });
    drawDataTbl(tblID, false);
    return tblJSON;
}
//Calculate Total Summary Amount Start
function calculateTotalSummaryAmt() {
    var LCAmt = 0;
    var TotLCAmt = 0;
    if (travelStage == "pre") {
        $("#idTblEXP  >tbody >tr").each(function () {
            LCAmt = parseFloat(outputNumber($(this).find('span[prekey="PreLCAmt"]').text()));
            if (!isNaN(LCAmt) && LCAmt.length != 0) {
                TotLCAmt += LCAmt;
            }
        });
        $("#idTblEXP >tfoot >tr>td.pretotalamt").html("<b>" + outputMoney(TotLCAmt) + "</b>");
        $("input[fldTitle='hdnPreTravelTotalCost']").val(outputMoney(TotLCAmt));
    }
    else {
        $("#idTblEXP  >tbody >tr").each(function () {
            LCAmt = parseFloat(outputNumber($(this).find('span[postkey="PostLCAmt"]').text()));
            if (!isNaN(LCAmt) && LCAmt.length != 0) {
                TotLCAmt += LCAmt;
            }
        });
        $("#idTblEXP >tfoot >tr>td.totalamt").html("<b>" + outputMoney(TotLCAmt) + "</b>");
        $("input[fldTitle='hdnPostTravelTotalCost']").val(outputMoney(TotLCAmt));
        $("#idTblEXP >tfoot >tr>td.pretotalamt").html("<b>" + outputMoney($("input[fldTitle='hdnPreTravelTotalCost']").val()) + "</b>");  //Pre Total Amount
    }
    calculateExclPrePostTotalAmt();
}
//Calculate Total Summary Amount End
//Calculate Pre Total Amount(Excluded Entertainment,Gift,Medical) Start
function calculateExclPrePostTotalAmt() {
    var keyArray = Object.keys(expenseTypeObj);
    var tempObj = {
    };
    var condObj = {
        "Entertainment": "Entertainment", "Gift": "Gift", "Medical": "Medical"
    };
    var preTotalAmt = 0.0;
    var postTotalAmt = 0.0;
    for (var i = 0; i < keyArray.length; i++) {
        tempObj = expenseTypeObj[keyArray[i]];
        if (condObj[tempObj.expType] == undefined) {
            if (tempObj.expType != "AdvanceDetails" && tempObj.expType != "RefundDetails") {
                if (travelStage == "pre")
                    preTotalAmt += parseFloat(outputNumber(tempObj.preLCAmt));
                else
                    postTotalAmt += parseFloat(outputNumber(tempObj.postLCAmt));
            }
        }
    }
    if (travelStage == "pre")
        $("input[fldTitle='ExclPreTrvlTotCost']").val(outputMoney(preTotalAmt));
    else
        $("input[fldTitle='ExclPostTrvlTotCost']").val(outputMoney(postTotalAmt));
}
//Calculate Pre Total Amount(Excluded Entertainment,Gift,Medical) End
//Save Payment Summary Details Start
function savePaymentSummaryDetails() {
    var keyArray = Object.keys(expenseTypeObj);
    var tempObj = {
    };
    var PreTravelSubTotal = 0;
    var PreTravelGrandTotal = 0;
    var PostTravelSubTotal = 0;
    var PostTravelGrandTotal = 0;
    var PostTravelNetPayableAmt = 0;
    var TotaladvanceAmount = 0;
    var TotalrefundAmount = 0;
    var PostTravelPayrollAmt = 0;
    var PostTravelFinanceAmt = 0;
    for (var i = 0; i < keyArray.length; i++) {
        tempObj = expenseTypeObj[keyArray[i]];
        if (tempObj.expType != "AdvanceDetails" && tempObj.expType != "RefundDetails") {
            PreTravelGrandTotal += parseFloat(outputNumber(tempObj.preLCAmt));
            PostTravelGrandTotal += parseFloat(outputNumber(tempObj.postLCAmt));
            if (!tempObj.isPaidByCompany) {
                PreTravelSubTotal += parseFloat(outputNumber(tempObj.preLCAmt));
                PostTravelSubTotal += parseFloat(outputNumber(tempObj.postLCAmt));
            }
            if (tempObj.isHRIQExp) {
                PostTravelPayrollAmt += parseFloat(outputNumber(tempObj.postLCAmt));
            }
        }
    }
    TotaladvanceAmount = parseFloat(outputNumber(expenseTypeObj.AdvanceDetails.advanceAmt));
    TotalrefundAmount = parseFloat(outputNumber(expenseTypeObj.RefundDetails.RefundAmt));
    PostTravelNetPayableAmt = PostTravelSubTotal - TotaladvanceAmount + TotalrefundAmount;
    PostTravelFinanceAmt = PostTravelSubTotal - PostTravelPayrollAmt;

    $("input[fldTitle='hdnPreTravelSubTotal']").val(outputMoney(PreTravelSubTotal));
    $("input[fldTitle='hdnPreTravelGrandTotal']").val(outputMoney(PreTravelGrandTotal));
    $("input[fldTitle='hdnPostTravelSubTotal']").val(outputMoney(PostTravelSubTotal));
    $("input[fldTitle='hdnPostTravelGrandTotal']").val(outputMoney(PostTravelGrandTotal));
    $("input[fldTitle='hdnTotaladvanceAmount']").val(outputMoney(TotaladvanceAmount));
    $("input[fldTitle='hdnTotalrefundAmount']").val(outputMoney(TotalrefundAmount));
    $("input[fldTitle='hdnPostTravelNetPayableAmt']").val(outputMoney(PostTravelNetPayableAmt));
    $("input[fldTitle='hdnPostTravelPayrollAmt']").val(outputMoney(PostTravelPayrollAmt));
    $("input[fldTitle='hdnPostTravelFinanceAmt']").val(outputMoney(PostTravelFinanceAmt));
}
//Save Payment Summary Details End
//Total Calculate Amount Start
function calculateTotalAmt(tblID) {
    var LCAmt = 0;
    var TotLCAmt = 0;
    var CompanyTotal = 0;
    var EmployeeTotal = 0;
    var MilTotal = 0;
    var OtherTotal = 0;
    var TotMilLCAmt = 0;
    var ExpCode = arrExpCodes[0][tblID];
    if (tblID == "idTblOTH") {
        ExpCode = "Mileage";
        drawDataTbl("idTblMIL", true);
        drawDataTbl("idTblOTH", true);
    } else {
        drawDataTbl(tblID, true);
    }
    if (tblID == "idTblOTH" || tblID == "idTblMIL") {
        $(tableRowSelector("idTblOTH")).each(function () {
            LCAmt = parseFloat(outputNumber($(this).find("td span.lcamt").text()));
            if (LCAmt == "") {
                return;
            }
            if (!isNaN(LCAmt) && LCAmt.length != 0) {
                OtherTotal += LCAmt;
            }
        });
        $(tableRowSelector("idTblMIL")).each(function () {
            LCAmt = parseFloat(outputNumber($(this).find("td span.lcamt").text()));
            if (LCAmt == "") {
                return;
            }
            if (!isNaN(LCAmt) && LCAmt.length != 0) {
                MilTotal += LCAmt;
            }
        });
        $("#idTblOTH >tfoot >tr>td.totalamt").html("<b>" + outputMoney(OtherTotal) + "</b>");
        $("#idTblMIL >tfoot >tr>td.totalamt").html("<b>" + outputMoney(MilTotal) + "</b>");
        TotMilLCAmt = OtherTotal + MilTotal;
    }
    else {
        $(tableRowSelector(tblID)).each(function () {
            LCAmt = parseFloat(outputNumber($(this).find("td span.lcamt").text()));
            if (LCAmt == "") {
                return;
            }
            if (!isNaN(LCAmt) && LCAmt.length != 0) {
                TotLCAmt += LCAmt;
                if ($(this).find(".ticketArrBy").length > 0) {
                    if ($(this).find(".ticketArrBy").text().toLowerCase() == "employee") {
                        EmployeeTotal += LCAmt;
                    } else if ($(this).find(".ticketArrBy").text().toLowerCase() == "company") {
                        CompanyTotal += LCAmt;
                    }
                }
            }
        });
    }
    if (tblID != "idTblEXP" && tblID != "idTblOTH" && tblID != "idTblMIL")
        $("#" + tblID + " >tfoot >tr>td.totalamt").html("<b>" + outputMoney(TotLCAmt) + "</b>");
    if (tblID == "idTblADV") {
        expenseTypeObj["AdvanceDetails"]["advanceAmt"] = outputMoney(TotLCAmt);
    }
    if (tblID == "idTblRef") {
        expenseTypeObj["RefundDetails"]["RefundAmt"] = outputMoney(TotLCAmt);
    }
    if (travelStage != "pre") {
        var expRow = $("tr[expcode='" + ExpCode + "']");
        if ($("input[fldtitle='hdnSubmitForCancel']").val() == "Yes"){
            TotLCAmt = 0;
            TotMilLCAmt=0;
            CompanyTotal = 0;
            EmployeeTotal=0;
            }
        if (expRow.length > 0 && (ExpCode != "Mileage")) {
            expRow.find('span[prekey="PostLCAmt"]').html(outputMoney(TotLCAmt));
            expRow.find('span[prekey="PostLCAmt"]').next().val(outputMoney(TotLCAmt));
        }
        if (ExpCode == "Mileage") {
            expRow.find('span[prekey="PostLCAmt"]').html(outputMoney(TotMilLCAmt));
            expRow.find('span[prekey="PostLCAmt"]').next().val(outputMoney(TotMilLCAmt));
        }
        if (expenseTypeObj[ExpCode + "Company"]) {
            expenseTypeObj[ExpCode + "Company"]["postLCAmt"] = outputMoney(CompanyTotal);
            expenseTypeObj[ExpCode + "Employee"]["postLCAmt"] = outputMoney(EmployeeTotal);
        }
        else if (ExpCode == "Mileage") {
            expenseTypeObj[ExpCode]["postLCAmt"] = outputMoney(TotMilLCAmt)
        }
        else if (ExpCode != undefined) {
            expenseTypeObj[ExpCode]["postLCAmt"] = outputMoney(TotLCAmt);
        }
    }
    LCAmt = 0;
    TotLCAmt = 0;
    CompanyTotal = 0;
    EmployeeTotal = 0;
    var flgPrePostExp = false;
    if ($("#" + tblID + " >tbody >tr >td.prelcamt").length == 0 && OnlyPostExpTypes.indexOf(ExpCode) == -1) {
        flgPrePostExp = true;
    }
    $(tableRowSelector(tblID)).each(function () {
        LCAmt = parseFloat(outputNumber($(this).find("td.prelcamt").text()));
        if (!isNaN(LCAmt) && LCAmt.length != 0) {
            TotLCAmt += LCAmt;
            if ($(this).find(".ticketArrBy").length > 0) {
                if ($(this).find(".ticketArrBy").attr("prevalue").toLowerCase() == "employee") {
                    EmployeeTotal += LCAmt;
                } else if ($(this).find(".ticketArrBy").attr("prevalue").toLowerCase() == "company") {
                    CompanyTotal += LCAmt;
                }
            }
            flgPrePostExp = true;
        }
    });
    if (flgPrePostExp) {
        $("#" + tblID + " >tfoot >tr>td.pretotalamt").html("<b>" + outputMoney(TotLCAmt) + "</b>");
        var expRow = $("tr[expcode='" + ExpCode + "']");
        if (expRow.length > 0) {
            expRow.find('span[prekey="PreLCAmt"]').html(outputMoney(TotLCAmt));
            expRow.find('span[prekey="PreLCAmt"]').next().val(outputMoney(TotLCAmt));
        }
        if (expenseTypeObj[ExpCode + "Company"]) {
            expenseTypeObj[ExpCode + "Company"]["preLCAmt"] = outputMoney(CompanyTotal);
            expenseTypeObj[ExpCode + "Employee"]["preLCAmt"] = outputMoney(EmployeeTotal);
        } else if (ExpCode != undefined) {
            expenseTypeObj[ExpCode]["preLCAmt"] = outputMoney(TotLCAmt);
        }
    } else {
        if (OnlyPostExpTypes.indexOf(ExpCode) != -1 && TicketArrangedByExp.indexOf(ExpCode) != -1) {
            CompanyTotal = 0;
            var expRow = $("tr[expcode='" + ExpCode + "']");
            if (expRow.length > 0) {
                CompanyTotal = outputMoney(expRow.find('span[prekey="PreLCAmt"]').html());
            }
            if (expenseTypeObj[ExpCode + "Company"]) {
                if (expArranged.byCompany(ExpCode)) {
                    expenseTypeObj[ExpCode + "Company"]["preLCAmt"] = outputMoney(CompanyTotal);
                    expenseTypeObj[ExpCode + "Employee"]["preLCAmt"] = outputMoney(0);
                } else {
                    expenseTypeObj[ExpCode + "Company"]["preLCAmt"] = outputMoney(0);
                    expenseTypeObj[ExpCode + "Employee"]["preLCAmt"] = outputMoney(CompanyTotal);
                }
            } else if (ExpCode != undefined) {
                expenseTypeObj[ExpCode]["preLCAmt"] = outputMoney(CompanyTotal);
            }
        }
        else {
            var expRow = $("tr[expcode='" + ExpCode + "']");
            if (expRow.length > 0) {
                expenseTypeObj[ExpCode]["preLCAmt"] = outputMoney(expRow.find('span[prekey="PreLCAmt"]').html());
            } else {
                expenseTypeObj[ExpCode]["preLCAmt"] = outputMoney(0);
            }
        }
    }
    calculateTotalSummaryAmt();
    if (tblID == "idTblOTH") {
        drawDataTbl("idTblMIL", false);
        drawDataTbl("idTblOTH", false);
    } else {
        drawDataTbl(tblID, false);
    }
}
//Total Calculate Amount End
function setDataEditModal(tblID, modalID) {
    switch (tblID) {
        case 'idTblMIL':    //Mileage Expense
            setMILDataEditModal();
            break;
        case 'idTblOTH':    //Other Expense	
            setOTHDataEditModal();
            break;
        case 'idTblMED':  //Medical Expense
            setMEDDataEditModal();
             break;
        case 'idTblVSA':   //VISA Claim
            setVSADataEditModal();
            break;
        case 'idTblMIS':  //Miscellaneous
            setMISDataEditModal();
            break;
        case 'idTblACC':   //Accommodation Travel
            setACCDataEditModal();
            break;
        case 'idTblATC':   //Air Ticket Cost
            setATCDataEditModal();
            break;
        case 'idTblCOM':   //Communication Travel
            setCOMDataEditModal();
            break;
        case 'idTblDA':   //DailyAllowance Travel
            setDADataEditModal();
            break;
        case 'idTblENT': //Entertainment Expense
            setENTDataEditModal();
            break;
        case 'idTblENTD': //Entertainment Details
            setENTDDataEditModal();
            break;
        case 'idTblPAS': //Passport Claim
            setPASDataEditModal();
            break;
        case 'idTblPRP': //Preparation Claim
            setPRPDataEditModal();
            break;
        case 'idTblTSP': // Transportation
            setTSPDataEditModal();
            break;
        case 'idTblCA':   //Compensation Allownace 
            setCADataEditModal();
            break;
        case 'idTblTRNC':  //Trainers Cost  
            setTRNCDataEditModal()
            break;
        case 'idTblEXB':   //Excess Baggage Claim
            setEXBDataEditModal();
            break;
        case 'idTblLAU':  //Laundry            
            setLANDataEditModal();
            break;
        case 'idTblAPT':    //Mileage Expense
            setAPTDataEditModal();
            break;
        case 'idTblGIFT': //Gift Expense
            setGIFTDataEditModal();
            break;
        case 'idTblGIFTD': //Gift Details
            setGIFTDDataEditModal();
            break;
        case 'idTblTSH': //Travel Schedule 
            setTSHDataEditModal();
            break;
        case 'idTblACCENT':   //Accounting Enteries
            setACCENTDataEditModal();
            break;
        case 'idTblADV':   //Advance Enteries
            setADVDataEditModal();
            break;
        case 'idTblRef':   //Refund Enteries
            setRefDataEditModal();
            break;
        case 'idTblMYEXCH':   //My Exchange Rate
            setMYEXCHDataEditModal();
            break;
        case 'idTblWIN':   //My Exchange Rate
            setWINDataEditModal();
            break;
        default:
            return false;
    }
}
function updateRow(tblID, modalID) {

    rowData = "";
    switch (tblID) {
        case 'idTblMIL':   //Mileage Expense 
            rowData = getMILDataEditModal();
            break;
        case 'idTblOTH':   //OTHER Expense 
            rowData = getOTHDataEditModal();
            break;
        case 'idTblMED':  //Medical Expense
            rowData = getMEDDataEditModal();
            break;
        case 'idTblVSA':   //VISA Claim            
            rowData = getVSADataEditModal();
            break;
        case 'idTblMIS':  //Miscellaneous
            rowData = getMISDataEditModal();
            break;
        case 'idTblACC':  //Accommodation Travel
            rowData = getACCDataEditModal();
            break;
        case 'idTblATC':  //Air Ticket Cost
            rowData = getATCDataEditModal();
            break;
        case 'idTblCOM':  //Communication Travel
            rowData = getCOMDataEditModal();
            break;
        case 'idTblDA':  //DailyAllowance Travel
            rowData = getDADataEditModal();
            break;
        case 'idTblENT': //Entertainment Expense
            rowData = getENTDataEditModal();
            break;
        case 'idTblENTD': //Entertainment Details
            rowData = getENTDDataEditModal();
            break;
        case 'idTblPAS': //Passport Claim
            rowData = getPASDataEditModal();
            break;
        case 'idTblPRP': //Preparation Claim
            rowData = getPRPDataEditModal();
            break;
        case 'idTblTSP':  // Transportation Expense
            rowData = getTSPDataEditModal();
            break;
        case 'idTblCA':  //Compensation Allownace 
            rowData = getCADataEditModal();
            break;
        case 'idTblTRNC':  //Trainers Cost  
            rowData = getTRNCDataEditModal();
            break;
        case 'idTblEXB':   //Excess Baggage Claim
            rowData = getEXBDataEditModal();
            break;
        case 'idTblLAU':  //Laundry
            rowData = getLANDataEditModal();
            break;
        case 'idTblAPT':   //Airport Tax Expense
            rowData = getAPTDataEditModal();
            break;
        case 'idTblGIFT': //Gift Expense
            rowData = getGIFTDataEditModal();
            break;
        case 'idTblGIFTD': //Gift Details
            rowData = getGIFTDDataEditModal();
            break;
        case 'idTblTSH': //Travel Schedule
            rowData = getTSHDataEditModal();
            break;
        case 'idTblACCENT':  //Accounting Enteries
            rowData = getACCENTDataEditModal();
            break;
        case 'idTblADV':  //Advance Enteries
            rowData = getADVDataEditModal();
            break;
        case 'idTblRef':  //Refund Enteries
            rowData = getRefDataEditModal();
            break;
        case 'idTblMYEXCH':   //My Exchange Rate
            rowData = getMYEXCHDataEditModal();
            break;
        case 'idTblWIN':   //WINTER allowance
            rowData = getWINDataEditModal();
            break;
        default:
            return false;
    }

    if (!(rowData != false && rowData.length > 4))
        return false;
    processUpdateRow(tblID, modalID);
    var chkID = tblID.substr(5, tblID.length);
    showPreCols(tblID, $("#idChk" + chkID).prop('checked'), true);
    return true;
}
function daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}
function calculateNoOfDays(argFromDate, argToDate) {
    return (daydiff(formatDate(argFromDate), formatDate(argToDate))) + 1;
}
//Generate Travel Schedule Summary Start
function generateTSHSummary() {
    var dataTbl = $('#idTblTSH').DataTable();
    if (dataTbl.data().length == 0) {
        $('#idTblTSHSummary tbody tr').remove();
        $('#idTblTSHSummary tbody').append('<tr><td colspan=12 class="center">No data available in table</td></tr>');
        return;
    }
    var preDeptDate = "";
    var postDeptDate = "";
    var preArrDate = "";
    var postArrDate = "";
    var preDeptTime = "";
    var postDeptTime = "";
    var preArrTime = "";
    var postArrTime = "";
    collapseAll("idTblTSH");
    generateDAVals();
    var objSchd = objSchedCountryCity($("#idTblTSH").DataTable().page.len() == -1);
    if ($('#idTblTSH tbody tr').length >= 0) {

        var tmpDep = objSchd.depTime.filter(function (dt) { return !!dt });
        tmpDep = tmpDep.length > 0 ? tmpDep[0] : "";
        var tmpArr = objSchd.destTime.filter(function (dt) { return !!dt });
        tmpArr = tmpArr.length > 0 ? tmpArr[tmpArr.length - 1] : "";
        var objDepDate = !!tmpDep ? dateString(tmpDep) : "";
        var objDepTime = !!tmpDep ? moment(tmpDep).format("H:mm") : "";
        var objArrDate = !!tmpArr ? dateString(tmpArr) : "";
        var objArrTime = !!tmpArr ? moment(tmpArr).format("H:mm") : "";
        if (travelStage == "pre") {
            preDeptDate = objDepDate;
            preArrDate = objArrDate;
            preDeptTime = objDepTime;
            preArrTime = objArrTime;
        }
        else {
            var UrgTrip = $("[fldtitle=UrgentTrip]").find("input[type=radio]:checked").val();
            preDeptDate = $("input[fldTitle='hdnpreDeptDate']").val() == undefined || $("input[fldTitle='hdnpreDeptDate']").val() == "" || UrgTrip == "Yes" ? "NA" : $("input[fldTitle='hdnpreDeptDate']").val();
            preArrDate = $("input[fldTitle='hdnpreArrDate']").val() == undefined || $("input[fldTitle='hdnpreArrDate']").val() == "" || UrgTrip == "Yes" ? "NA" : $("input[fldTitle='hdnpreArrDate']").val();
            preDeptTime = $("input[fldTitle='hdnpreDeptTime']").val() == undefined || $("input[fldTitle='hdnpreDeptTime']").val() == "" || UrgTrip == "Yes" ? "NA" : $("input[fldTitle='hdnpreDeptTime']").val();
            preArrTime = $("input[fldTitle='hdnpreArrTime']").val() == undefined || $("input[fldTitle='hdnpreArrTime']").val() == "" || UrgTrip == "Yes" ? "NA" : $("input[fldTitle='hdnpreArrTime']").val();
            postDeptDate = objDepDate;
            postArrDate = objArrDate;
            postDeptTime = objDepTime;
            postArrTime = objArrTime;
        }
        generateTSHSummRow(preDeptDate, postDeptDate, preArrDate, postArrDate, preDeptTime, postDeptTime, preArrTime, postArrTime);
        getExchangeRateFromMaster();
    }
}
function generateTSHSummRow(preDeptDate, postDeptDate, preArrDate, postArrDate, preDeptTime, postDeptTime, preArrTime, postArrTime) {
    var strRow = "";
    if (travelStage == "post") {
        preDeptDate = $("input[fldTitle='hdnpreDeptDate']").val();
        preArrDate = $("input[fldTitle='hdnpreArrDate']").val();
        preDeptTime = $("input[fldTitle='hdnpreDeptTime']").val();
        preArrTime = $("input[fldTitle='hdnpreArrTime']").val();
        gblPreNoDays = $("input[fldTitle='hdnpreNoDays']").val();
        gblPreActNoDays = $("input[fldTitle='hdnPreActNoDays']").val();
    }
    strRow += '<tr><td class="center" id="idPreDeptDate">' + preDeptDate + '</td>';
    strRow += '<td class="center postdisplay" id="idPostDeptDate">' + postDeptDate + '</td>';
    strRow += '<td class="center" id="idPreArrDate">' + preArrDate + '</td>';
    strRow += '<td class="center postdisplay" id="idPostArrDate">' + postArrDate + '</td>';
    strRow += '<td class="center" id="idPreDeptTime">' + preDeptTime + '</td>';
    strRow += '<td class="center postdisplay" id="idPostDeptTime">' + postDeptTime + '</td>';
    strRow += '<td class="center" id="idPreArrTime">' + preArrTime + '</td>';
    strRow += '<td class="center postdisplay" id="idPostArrTime">' + postArrTime + '</td>';
    strRow += '<td class="center" id="idPreNoDays">' + gblPreNoDays + '</td>';
    strRow += '<td class="center postdisplay" id="idPostNoDays">' + gblPostNoDays + '</td>';
    strRow += '<td class="center" id="idPreActNoDays">' + gblPreActNoDays + '</td>';
    strRow += '<td class="center postdisplay" id="idPostActNoDays">' + gblPostActNoDays + '</td></tr>';
    $('#idTblTSHSummary tbody tr').remove();
    if (travelStage == "pre") {
        $("input[fldTitle='hdnpreDeptDate']").val(preDeptDate);
        $("input[fldTitle='hdnpreArrDate']").val(preArrDate);
        $("input[fldTitle='hdnpreDeptTime']").val(preDeptTime);
        $("input[fldTitle='hdnpreArrTime']").val(preArrTime);
        $("input[fldTitle='hdnpreNoDays']").val(gblPreNoDays);
        $("input[fldTitle='hdnPreActNoDays']").val(gblPreActNoDays);
    }

    $("input[fldTitle='hdnpostDeptDate']").val(postDeptDate);
    $("input[fldTitle='hdnpostArrDate']").val(postArrDate);
    $("input[fldTitle='hdnpostDeptTime']").val(postDeptTime);
    $("input[fldTitle='hdnpostArrTime']").val(postArrTime);
    $("input[fldTitle='hdnpostNoDays']").val(gblPostNoDays);
    $("input[fldTitle='hdnPostActNoDays']").val(gblPostActNoDays);
    $('#idTblTSHSummary tbody').append(strRow);
    if (travelStage == "pre") {
        $(".postdisplay").hide();
        $('#idTblTSHSummary tr:first th').each(function () {
            $(this).attr("colspan", 1);
        });
    }
}
//Generate Travel Schedule Summary End
//Format-Collapse/Expand Start
function formatDisplay(tblID, tr) {
    switch (tblID) {
        case 'idTblMIL':   //Mileage Expense
            return formatMIL(tr);
            break;
        case 'idTblOTH':   //Mileage Expense
            return formatOTH(tr);
            break;
        case 'idTblMED':  //Medical Expense
            return formatMED(tr);
            break
        case 'idTblVSA':   //VISA Claim
            return formatVSA(tr);
            break;
        case 'idTblMIS':   //Miscellaneous
            return formatMIS(tr);
            break;
        case 'idTblACC':  //Accommodation Travel
            return formatACC(tr);
            break;
        case 'idTblATC':  //Air Ticket Cost
            return formatATC(tr);
            break;
        case 'idTblCOM':  //Communication Travel
            return formatCOM(tr);
            break;
        case 'idTblDA':  //DailyAllowance Travel
            return formatDA(tr);
            break;
        case 'idTblENT': //Entertainment Expense
            return formatENT(tr);
            break;
        case 'idTblENTD': //Entertainment Details
            return formatENTD(tr);
            break;
        case 'idTblPAS': //Passport Claim
            return formatPAS(tr);
            break;
        case 'idTblPRP': //Preparation Claim
            return formatPRP(tr);
            break;
        case 'idTblTSP':  //Transportation Expense
            return formatTSP(tr);
            break;
        case 'idTblCA':   //Compensation Allowance
            return formatCA(tr);
            break;
        case 'idTblTRNC':   // Trainers Cost Expense
            return formatTRNC(tr);
            break;
        case 'idTblEXB':   //Excess Baggage Claim
            return formatEXB(tr);
            break;
        case 'idTblLAU':   //Laundry
            return formatLAN(tr);
            break;
        case 'idTblAPT':   //Airport Tax Expense
            return formatAPT(tr);
            break;
        case 'idTblGIFT': //Gift Expense
            return formatGIFT(tr);
            break;
        case 'idTblGIFTD': //Gift Details
            return formatGIFTD(tr);
            break;
        case 'idTblTSH': //Travel Schedule
            return formatTSH(tr);
            break;
        case 'idTblACCENT':  //Accounting Enteries
            return formatACCENT(tr);
            break;
        case 'idTblWIN': //Winter Allowance
            return formatWIN(tr);
            break;
        default:
            return "";
    }
}
//Format-Collapse/Expand End
function getActionBtns(modalID) {
    var strActBtns = "";
    if (isAccountsLevel == "Yes" && travelStage == "post") {
        strActBtns += '<td class="center padding0" nowrap>';
        strActBtns += '<div class="center-btn">';
        strActBtns += '<button class="editrow" modalid="' + modalID + '"><i class="fa fa-pencil text-blue"></i></button>';
        strActBtns += '<button class="undodel" style="display:none;" modalid="' + modalID + '"><i class="fa fa-undo text-orange"></i></button>';
        strActBtns += '</div></td>';
    }
    else if (IsApplicantLevel == "true") {
        strActBtns += '<td class="center padding0" nowrap>';
        strActBtns += '<div class="center-btn">';
        strActBtns += '<button class="editrow" modalid="' + modalID + '"><i class="fa fa-pencil text-blue"></i></button>';
        if (modalID != "DAModal") {
            strActBtns += '<button class="deleterow" modalid="' + modalID + '"><i class="fa fa-trash text-red"></i></button>';
        }
        strActBtns += '<button class="undodel" style="display:none;" modalid="' + modalID + '"><i class="fa fa-undo text-orange"></i></button>';
        strActBtns += '</div></td>';
    }
    return strActBtns;
}
//MEDICAL EXPENSE Start
function setMEDDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idMEDIDEdit", "idMEDSNoEdit", "idMEDTypeEdit", "idMEDClaimCurrEdit", "idMEDClaimAmtEdit", "idMEDExRateEdit", "idMEDLCAmtEdit", "idMEDCostCenterEdit", "idMEDGSTCodeEdit", "idMEDTaxableAmtEdit", "idMEDGSTAmtEdit", "idMEDGLCodeEdit", "idMEDReceiptNoEdit", "idMEDChargeToFactoryEdit", "idMEDExpDescEdit", "idMEDCostCenterDisplayEdit", "idMEDGSTCodeDisplayEdit"]
    var fldID = ["idMEDID", "idMEDSNo", "idMEDType", "idMEDClaimCurr", "idMEDClaimAmt", "idMEDExRate", "idMEDLCAmt", "idMEDCostCenter", "idMEDGSTCode", "idMEDTaxableAmt", "idMEDGSTAmt", "idMEDGLCode", "idMEDReceiptNo", "idMEDChargeToFactory", "idMEDExpDesc", "idMEDCostCenterDisplay", "idMEDGSTCodeDisplay"]
    var fldAccEditable = ["", "", "disabled", "disabled", "readonly", "readonly", "", "", "", "", "", "", "", "disabled", "readonly", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idMEDClaimCurrEdit").change();
}
function generateMEDRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblMED = null;
    if (flgIntialLoading) {
        tblMED = $('#idTblMED').DataTable();
        tblMED.clear()
        tblMED.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("MEDModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Medical</span><span class="datacol" id="idMEDID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idMEDSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="PostExpTypes" postkey="PostExpTypes" id="idMEDType">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PostFCAmt" postkey="PostFCAmt"   id="idMEDClaimAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCurrency" postkey="PostCurrency"  id="idMEDClaimCurr">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PostExRate" postkey="PostExRate"  id="idMEDExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt"  id="idMEDLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PostCostCenter" postkey="PostCostCenter"  id="idMEDCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay"  id="idMEDCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostDesc" postkey="PostDesc"  id="idMEDExpDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode"  id="idMEDGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode"  id="idMEDGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay"  id="idMEDGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory"  id="idMEDChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt"  id="idMEDTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo"  id="idMEDReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt"  id="idMEDGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblMED.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getMEDDataEditModal() {
    if (!validateMED()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idMEDIDEdit").val();
    rowJSON["SNo"] = $("#idMEDSNoEdit").val();
    rowJSON["PostExpTypes"] = $("#idMEDTypeEdit").val();
    rowJSON["PostCurrency"] = $("#idMEDClaimCurrEdit").val();
    rowJSON["PostFCAmt"] = $("#idMEDClaimAmtEdit").val();
    rowJSON["PostExRate"] = $("#idMEDExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idMEDLCAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idMEDCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idMEDCostCenterDisplayEdit").val();
    rowJSON["GSTCode"] = $("#idMEDGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idMEDGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idMEDTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idMEDGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idMEDGLCodeEdit").val();
    rowJSON["PostDesc"] = $("#idMEDExpDescEdit").val();
    rowJSON["ChargeToFactory"] = $("#idMEDChargeToFactoryEdit").val();
    rowJSON["ReceiptNo"] = $("#idMEDReceiptNoEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateMEDRow(strJSON, false);
}
function validateMED() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idMEDTypeEdit", "idMEDClaimAmtEdit", "idMEDClaimCurrEdit", "idMEDGSTCodeEdit", "idMEDTaxableAmtEdit", "idMEDCostCenterEdit", "idMEDGLCodeEdit", "idMEDChargeToFactoryEdit"];
    var fldName = ["Expense Type", "FC Amount", "Curr.", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge to Fact."];
    var fldType = ["select", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "MEDModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idMEDCostCenterDisplayEdit").val($("#idMEDCostCenterEdit").children("option").filter(":selected").text());
    $("#idMEDGSTCodeDisplayEdit").val($("#idMEDGSTCodeDisplay").children("option").filter(":selected").text());
    return true;
}
function formatMED(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Expense Type", "VAT Code", "Charge to Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Ex. Rate", "Cost Center", "", "Description"];
    var fldID = ["idMEDSNo", "idMEDLCAmt", "idMEDGLCode", "idMEDType", "idMEDGSTCodeDisplay", "idMEDChargeToFactory", "idMEDClaimAmt", "idMEDTaxableAmt", "idMEDReceiptNo", "idMEDClaimCurr", "idMEDGSTAmt", "", "idMEDExRate", "idMEDCostCenterDisplay", "", "idMEDExpDesc"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "amount", "amount", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//MEDICAL EXPENSE ENDS
//MILEAGE EXPENSE STARTS
function setMILDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idMILIDEdit", "idMILSNoEdit", "idMILTypeEdit", "idMILTransportationEdit", "idMILDateEdit", "idMILFromEdit", "idMILToEdit", "idMILMileageStartEdit", "idMILMileageEndEdit", "idMILDistanceTravelledEdit", "idMILZoneEdit", "idMILCustomerZoneEdit", "idMILProvinceEdit", "idMILVisitingRouteEdit", "idMILKmsMasterEdit", "idMILKmsActualEdit", "idMILKmsMileageRateEdit", "idMILClaimCurrEdit", "idMILClaimAmtEdit", "idMILExRateEdit", "idMILLCAmtEdit", "idMILCostCenterEdit", "idMILGSTCodeEdit", "idMILTaxableAmtEdit", "idMILGSTAmtEdit", "idMILGLCodeEdit", "idMILExpDescEdit", "idMILChargeToFactoryEdit", "idMILReceiptNoEdit", "idMILCostCenterDisplayEdit", "idMILGSTCodeDisplayEdit"]
    var fldID = ["idMILID", "idMILSNo", "idMILType", "idMILTransportation", "idMILDate", "idMILFrom", "idMILTo", "idMILMileageStart", "idMILMileageEnd", "idMILDistanceTravelled", "idMILZone", "idMILCustomerZone", "idMILProvince", "idMILVisitingRoute", "idMILKmsMaster", "idMILKmsActual", "idMILKmsMileageRate", "idMILClaimCurr", "idMILClaimAmt", "idMILExRate", "idMILLCAmt", "idMILCostCenter", "idMILGSTCode", "idMILTaxableAmt", "idMILGSTAmt", "idMILGLCode", "idMILExpDesc", "idMILChargeToFactory", "idMILReceiptNo", "idMILCostCenterDisplay", "idMILGSTCodeDisplay"]
    var fldAccEditable = ["", "", "disabled", "disabled", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "disabled", "disabled", "disabled", "disabled", "readonly", "readonly", "readonly", "disabled", "readonly", "readonly", "", "", "", "", "", "", "readonly", "disabled", "", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idMILClaimCurrEdit").change();
    // To update Cust Ind Zone drop down
    if (["NA", "", "Select"].indexOf($("#idMILZoneEdit").val()) == -1) {
        updateCustIndZone();
        setAllTravelDataEditModal(tr, ["idMILCustomerZoneEdit"], ["idMILCustomerZone"], ["disabled"]);
    }
    var mileageTypeConfig = $('input[fldTitle="hdnMileageType"]').val().replace(/^(;#)+|(;#)+$/g, "").split(";#");
    if (mileageTypeConfig.length == 1) {
        $("#idMILTypeEdit").prop("disabled", true);
    }
    refreshMileageType(false);
}
function generateMILRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblMIL = null;
    if (flgIntialLoading) {
        tblMIL = $('#idTblMIL').DataTable();
        tblMIL.clear()
        tblMIL.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("MILModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Mileage</span><span class="datacol" id="idMILID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idMILSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="PostExpTypes" postkey="PostExpTypes" id="idMILType">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="Mode" postkey="Mode" id="idMILTransportation">' + item.Mode + '</span>' + item.Mode + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol"   prekey="PostFCAmt" postkey="PostFCAmt"  id="idMILClaimAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"   prekey="PostCurrency" postkey="PostCurrency"  id="idMILClaimCurr">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol"   prekey="PostExRate" postkey="PostExRate"  id="idMILExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt"   prekey="PostLCAmt" postkey="PostLCAmt"  id="idMILLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol"   prekey="PostCostCenter" postkey="PostCostCenter"  id="idMILCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"   prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay"  id="idMILCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"   prekey="PostDesc" postkey="PostDesc" " id="idMILExpDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="PostExpDate" postkey="PostExpDate"  id="idMILDate">' + item.PostExpDate + '</span>' + item.PostExpDate + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="From" postkey="From"  id="idMILFrom">' + item.From + '</span>' + item.From + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="To" postkey="To"  id="idMILTo">' + item.To + '</span>' + item.To + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="MileageStart" postkey="MileageStart"  id="idMILMileageStart">' + item.MileageStart + '</span>' + item.MileageStart + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="MileageEnd" postkey="MileageEnd"  id="idMILMileageEnd">' + item.MileageEnd + '</span>' + item.MileageEnd + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="DistanceTravelled" postkey="DistanceTravelled" 	id="idMILDistanceTravelled">' + item.DistanceTravelled + '</span>' + item.DistanceTravelled + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="Zone" postkey="Zone"  id="idMILZone">' + item.Zone + '</span>' + item.Zone + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="CustomerIndustrialZone" postkey="CustomerIndustrialZone"  id="idMILCustomerZone">' + item.CustomerIndustrialZone + '</span>' + item.CustomerIndustrialZone + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="Province" postkey="Province"  id="idMILProvince">' + item.Province + '</span>' + item.Province + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="VisitingRoute" postkey="VisitingRoute"  id="idMILVisitingRoute">' + item.VisitingRoute + '</span>' + item.VisitingRoute + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="KMMaster" postkey="KMMaster"  id="idMILKmsMaster">' + item.KMMaster + '</span>' + item.KMMaster + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="KMActual" postkey="KMActual"  id="idMILKmsActual">' + item.KMActual + '</span>' + item.KMActual + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="MileageRate" postkey="MileageRate"  id="idMILKmsMileageRate">' + item.MileageRate + '</span>' + item.MileageRate + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="GSTCode" postkey="GSTCode"  id="idMILGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="GSTCodeDisplay" postkey="GSTCodeDisplay"  id="idMILGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="TaxableAmt" postkey="TaxableAmt"  id="idMILTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="GLCode" postkey="GLCode"  id="idMILGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"   prekey="GSTAmt" postkey="GSTAmt"  id="idMILGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="ChargeToFactory" postkey="ChargeToFactory"  id="idMILChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="ReceiptNo" postkey="ReceiptNo"  id="idMILReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblMIL.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getMILDataEditModal() {
    if (!validateMIL()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idMILIDEdit").val();
    rowJSON["SNo"] = $("#idMILSNoEdit").val();
    rowJSON["PostExpTypes"] = $("#idMILTypeEdit").val();
    rowJSON["Mode"] = $("#idMILTransportationEdit").val();
    rowJSON["PostExpDate"] = $("#idMILDateEdit").val();
    rowJSON["From"] = $("#idMILFromEdit").val();
    rowJSON["To"] = $("#idMILToEdit").val();
    rowJSON["MileageStart"] = $("#idMILMileageStartEdit").val();
    rowJSON["MileageEnd"] = $("#idMILMileageEndEdit").val();
    rowJSON["DistanceTravelled"] = $("#idMILDistanceTravelledEdit").val();
    rowJSON["Zone"] = $("#idMILZoneEdit").val();
    rowJSON["CustomerIndustrialZone"] = $("#idMILCustomerZoneEdit").val();
    rowJSON["Province"] = $("#idMILProvinceEdit").val();
    rowJSON["VisitingRoute"] = $("#idMILVisitingRouteEdit").val();
    rowJSON["KMMaster"] = $("#idMILKmsMasterEdit").val();
    rowJSON["KMActual"] = $("#idMILKmsActualEdit").val();
    rowJSON["MileageRate"] = $("#idMILKmsMileageRateEdit").val();
    rowJSON["PostCurrency"] = $("#idMILClaimCurrEdit").val();
    rowJSON["PostFCAmt"] = $("#idMILClaimAmtEdit").val();
    rowJSON["PostExRate"] = $("#idMILExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idMILLCAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idMILCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idMILCostCenterDisplayEdit").val();
    rowJSON["GSTCode"] = $("#idMILGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idMILGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idMILTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idMILGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idMILGLCodeEdit").val();
    rowJSON["PostDesc"] = $("#idMILExpDescEdit").val();
    rowJSON["ChargeToFactory"] = $("#idMILChargeToFactoryEdit").val();
    rowJSON["ReceiptNo"] = $("#idMILReceiptNoEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateMILRow(strJSON, false);
}
function validateMIL() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var MILType = $("#idMILTypeEdit").val();
    var fldID = [];
    var fldName = [];
    var fldType = [];
    if (MILType == "By Zone") {
        var fldID = ["idMILTypeEdit", "idMILTransportationEdit", "idMILDateEdit", "idMILFromEdit", "idMILToEdit", "idMILMileageStartEdit", "idMILZoneEdit", "idMILCustomerZoneEdit", "idMILProvinceEdit", "idMILVisitingRouteEdit", "idMILKmsActualEdit", "idMILClaimAmtEdit", "idMILClaimCurrEdit", "idMILGSTCodeEdit", "idMILTaxableAmtEdit", "idMILCostCenterEdit", "idMILGLCodeEdit", "idMILChargeToFactoryEdit"];
        var fldName = ["Expense Type", "Trans. Mode", "Date", "Place From", "Place To", "Mileage Start", "Zone", "Cust./Ind. Zone", "Province", "Visiting Route", "KMs(Actual)", "FC Amount", "Currency", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge to Fact."];
        var fldType = ["select", "select", "text", "text", "text", "zeronumber", "select", "select", "select", "select", "number", "number", "select", "select", "number", "select", "text", "select"];
    } else {
        var fldID = ["idMILTypeEdit", "idMILTransportationEdit", "idMILDateEdit", "idMILFromEdit", "idMILToEdit", "idMILMileageStartEdit", "idMILMileageEndEdit", "idMILZoneEdit", "idMILCustomerZoneEdit", "idMILProvinceEdit", "idMILVisitingRouteEdit", "idMILClaimAmtEdit", "idMILClaimCurrEdit", "idMILGSTCodeEdit", "idMILTaxableAmtEdit", "idMILCostCenterEdit", "idMILGLCodeEdit", "idMILChargeToFactoryEdit"];
        var fldName = ["Expense Type", "Trans. Mode", "Date", "Place From", "Place To", "Mileage Start", "Mileage End", "Zone", "Cust./Ind. Zone", "Province", "Visiting Route", "FC Amount", "Currency", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge to Fact."];
        var fldType = ["select", "select", "text", "text", "text", "zeronumber", "number", "select", "select", "select", "select", "number", "select", "select", "number", "select", "text", "select"];
    }
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "MILModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idMILCostCenterDisplay").val($("#idMILCostCenterEdit ").children("option").filter(":selected").text());
    $("#idMILGSTCodeDisplayEdit").val($("#idMILGSTCodeEdit ").children("option").filter(":selected").text());

    return true;
}
function formatMIL(tr) {
    var fldID = ["idMILSNo", "idMILZone", "idMILExRate", "idMILType", "idMILCustomerZone", "idMILLCAmt", "idMILTransportation", "idMILProvince", "idMILGSTCodeDisplay", "idMILDate", "idMILVisitingRoute", "idMILTaxableAmt", "idMILFrom", "idMILKmsMaster", "idMILGSTAmt", "idMILTo", "idMILKmsActual", "idMILCostCenterDisplay", "idMILMileageStart", "idMILKmsMileageRate", "idMILGLCode", "idMILMileageEnd", "idMILClaimAmt", "idMILChargeToFactory", "idMILDistanceTravelled", "idMILClaimCurr", "idMILReceiptNo", "idMILExpDesc"]
    var fldLabel = ["S.#", "Zone", "Ex. Rate", "Expense Type", "Cust./Ind. Zone", "LC Amt", "Trans. Mode", "Province", "VAT Code", "Date", "Visiting Route", "Taxable Amt", "Place From", "Kms(Master)", "VAT Amt", "Place To", "KMs(Actual)", "Cost Center", "Mileage Start", "Mileage Rate", "GL Code", "Mileage End", "FC Amt", "Charge to Fact.", "Dist. Travelled", "Curr.", "Receipt #", "Description"]
    var fldClass = ["", "", "amount", "", "", "amount", "", "", "", "", "", "amount", "", "amount", "amount", "", "amount", "", "amount", "amount", "", "amount", "amount", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//MILEAGE Expense Ends
//MILEAGE Expense Ends
//OTHER EXPENSE STARTS
function setOTHDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idOTHIDEdit", "idOTHSNoEdit", "idOTHTypeEdit", "idOTHDateEdit", "idOTHFromEdit", "idOTHToEdit", "idOTHClaimCurrEdit", "idOTHClaimAmtEdit", "idOTHExRateEdit", "idOTHLCAmtEdit", "idOTHCostCenterEdit", "idOTHGSTCodeEdit", "idOTHTaxableAmtEdit", "idOTHGSTAmtEdit", "idOTHGLCodeEdit", "idOTHExpDescEdit", "idOTHChargeToFactoryEdit", "idOTHReceiptNoEdit", "idOTHCostCenterDisplayEdit", "idOTHGSTCodeDisplayEdit", "idOTHTranModeEdit"]
    var fldID = ["idOTHID", "idOTHSNo", "idOTHType", "idOTHDate", "idOTHFrom", "idOTHTo", "idOTHClaimCurr", "idOTHClaimAmt", "idOTHExRate", "idOTHLCAmt", "idOTHCostCenter", "idOTHGSTCode", "idOTHTaxableAmt", "idOTHGSTAmt", "idOTHGLCode", "idOTHExpDesc", "idOTHChargeToFactory", "idOTHReceiptNo", "idOTHCostCenterDisplay", "idOTHGSTCodeDisplay", "idOTHTranMode"]
    var fldAccEditable = ["", "", "disabled", "readonly", "readonly", "readonly", "disabled", "readonly", "readonly", "", "", "", "", "", "", "readonly", "disabled", "", "", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idOTHClaimCurrEdit").change();
}
function generateOTHRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblOTH = null;
    if (flgIntialLoading) {
        tblOTH = $('#idTblOTH').DataTable();
        tblOTH.clear()
        tblOTH.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("OTHModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Others</span><span class="datacol" id="idOTHID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idOTHSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostExpTypes" postkey="PostExpTypes" id="idOTHType">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol"  prekey="PostFCAmt" postkey="PostFCAmt" id="idOTHClaimAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="PostCurrency" postkey="PostCurrency" id="idOTHClaimCurr">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol"  prekey="PostExRate" postkey="PostExRate" id="idOTHExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt"  prekey="PostLCAmt" postkey="PostLCAmt" id="idOTHLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol"  prekey="PostCostCenter" postkey="PostCostCenter" id="idOTHCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"   prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay"  id="idOTHCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="PostDesc" postkey="PostDesc" id="idOTHExpDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="From" postkey="From" id="idOTHFrom">' + item.From + '</span>' + item.From + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="To" postkey="To" id="idOTHTo">' + item.To + '</span>' + item.To + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="PostExpDate" postkey="PostExpDate" id="idOTHDate">' + item.PostExpDate + '</span>' + item.PostExpDate + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="GSTCode" postkey="GSTCode" id="idOTHGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idOTHGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="TaxableAmt" postkey="TaxableAmt" id="idOTHTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="GLCode" postkey="GLCode" id="idOTHGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol"  prekey="GSTAmt" postkey="GSTAmt" id="idOTHGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idOTHChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idOTHReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="Mode" postkey="Mode" id="idOTHTranMode">' + item.Mode + '</span>' + item.Mode + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblOTH.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getOTHDataEditModal() {
    if (!validateOTH()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idOTHIDEdit").val();
    rowJSON["SNo"] = $("#idOTHSNoEdit").val();
    rowJSON["PostExpTypes"] = $("#idOTHTypeEdit").val();
    rowJSON["PostExpDate"] = $("#idOTHDateEdit").val();
    rowJSON["From"] = $("#idOTHFromEdit").val();
    rowJSON["To"] = $("#idOTHToEdit").val();
    rowJSON["PostCurrency"] = $("#idOTHClaimCurrEdit").val();
    rowJSON["PostFCAmt"] = $("#idOTHClaimAmtEdit").val();
    rowJSON["PostExRate"] = $("#idOTHExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idOTHLCAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idOTHCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idOTHCostCenterDisplayEdit").val();
    rowJSON["GSTCode"] = $("#idOTHGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idOTHGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idOTHTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idOTHGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idOTHGLCodeEdit").val();
    rowJSON["PostDesc"] = $("#idOTHExpDescEdit").val();
    rowJSON["ChargeToFactory"] = $("#idOTHChargeToFactoryEdit").val();
    rowJSON["ReceiptNo"] = $("#idOTHReceiptNoEdit").val();
    rowJSON["Mode"] = $("#idOTHTranModeEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateOTHRow(strJSON, false);
}
function validateOTH() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idOTHTypeEdit", "idOTHTranModeEdit", "idOTHDateEdit", "idOTHFromEdit", "idOTHToEdit", "idOTHClaimAmtEdit", "idOTHClaimCurrEdit", "idOTHGSTCodeEdit", "idOTHTaxableAmtEdit", "idOTHCostCenterEdit", "idOTHGLCodeEdit", "idOTHChargeToFactoryEdit"];
    var fldName = ["Expense Type","Trans. Mode", "Date", "Place From", "Place To", "FC Amount", "Curr.", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge to Fact."];
    var fldType = ["select", "text", "text", "text", "text", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "OTHModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idOTHCostCenterDisplayEdit").val($("#idOTHCostCenterEdit").children("option").filter(":selected").text());
    $("#idOTHGSTCodeDisplayEdit").val($("#idOTHGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatOTH(tr) {
    var fldID = ["idOTHSNo", "idOTHClaimAmt", "idOTHGSTAmt", "idOTHType", "idOTHClaimCurr", "idOTHCostCenterDisplay", "idOTHTranMode", "idOTHExRate", "idOTHGLCode", "idOTHDate", "idOTHLCAmt", "idOTHChargeToFactory", "idOTHFrom", "idOTHGSTCodeDisplay", "idOTHReceiptNo", "idOTHTo", "idOTHTaxableAmt", "", "idOTHExpDesc"]
    var fldLabel = ["S.#", "FC Amt", "VAT Amt", "Expense Type", "Curr.", "Cost Center", "Trans. Mode", "Ex. Rate", "GL Code", "Date", "LC Amt", "Charge to Fact.", "Place From", "VAT Code", "Receipt #", "Place To", "Taxable Amt", "", "Description"]
    var fldClass =["","amount","amount","","","","","amount","","","amount","","","","","","amount","",""]										
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//OTHER Expense Ends
//Winter Allowance Start
function setWINDataEditModal() {
    //Set Row for editing    
    var tr = objSelectedRow;
    var fldEditID = ["idWINIDEdit", "idWINSNoEdit", "idWINLastClaimDateEdit", "idWINLastClaimAmountEdit", "idWINExpTypEdit", "idWINPCEdit", "idWINLCAmtEdit", "idWINPCDisplayEdit", "idWINGSTCodeEdit", "idWINGSTCodeDisplayEdit", "idWINTaxableAmtEdit", "idWINGSTAmtEdit", "idWINGLCodeEdit", "idWINChargeToFactoryEdit"]
    var fldID = ["idWINID", "idWINSNo", "idWINLastClaimDate", "idWINLastClaimAmount", "idWINExpTyp", "idWINPC", "idWINLCAmt", "idWINPCDisplay", "idWINGSTCode", "idWINGSTCodeDisplay", "idWINTaxableAmt", "idWINGSTAmt", "idWINGLCode", "idWINChargeToFactory"]
    var fldAccEditable = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
}
function getWINDataEditModal() {
    if (!validateWIN()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idWINIDEdit").val();
    rowJSON["SNo"] = $("#idWINSNoEdit").val();
    rowJSON["LastClaimAmt"] = $("#idWINLastClaimAmountEdit").val();
    rowJSON["LastClaimDate"] = $("#idWINLastClaimDateEdit").val();
    rowJSON["GSTCode"] = $("#idWINGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idWINGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idWINTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idWINGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idWINGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idWINChargeToFactoryEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreLCAmt"] = $("#idWINLCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idWINPCEdit").val();
        rowJSON["PreExpTypes"] = $("#idWINExpTypEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idWINPCDisplayEdit").val();
    }
    else {
        rowJSON["PreLCAmt"] = ($("#idWINLCAmtEdit").attr("prevalue")) == undefined || ($("#idWINLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idWINLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idWINLCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idWINPCEdit").attr("prevalue")) == undefined || ($("#idWINPCEdit").attr("prevalue")) == "" ? "NA" : $("#idWINPCEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idWINPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idWINPCDisplayEdit").attr("prevalue")) == undefined || ($("#idWINPCDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idWINPCDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idWINPCDisplayEdit").val();
        rowJSON["PreExpTypes"] = ($("#idWINExpTypEdit").attr("prevalue")) == undefined || ($("#idWINExpTypEdit").attr("prevalue")) == "" ? "NA" : $("#idWINExpTypEdit").attr("prevalue");
        rowJSON["PostExpTypes"] = $("#idWINExpTypEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateWINRow(strJSON, false);
}
function generateWINRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblWIN = null;
    if (flgIntialLoading) {
        tblWIN = $('#idTblWIN').DataTable();
        tblWIN.clear()
        tblWIN.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("WINModal");
    $.each(objJSON, function (i, item) {
        var LCAmt, CostCenter, ExpType;
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        LCAmt = CostCenter = ExpType = "";
        if (travelStage == "pre") {
            LCAmt = outputMoney(item.PreLCAmt);
            LastClaimAmount = outputMoney(item.LastClaimAmt)
            LastClaimDate = item.LastClaimDate;
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            ExpType = item.PreExpTypes;
        }
        else {
            LCAmt = outputMoney(item.PostLCAmt);
            LastClaimAmount = outputMoney(item.LastClaimAmt)
            LastClaimDate = item.LastClaimDate;
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            ExpType = item.PostExpTypes;
        }
        //   strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">WinterAllowance</span><span class="datacol" id="idWINID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idWINSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol " prekey="PreExpTypes" postkey="PostExpTypes" id="idWINExpTyp" prevalue="' + item.PreExpTypes + '">' + ExpType + '</span>';
        strNewRow += ExpType + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.LastClaimDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol " prekey="LastClaimDate" postkey="LastClaimDate" id="idWINLastClaimDate" prevalue="' + item.LastClaimDate + '">' + LastClaimDate + '</span>';
        strNewRow += LastClaimDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + outputMoney(item.LastClaimAmt) + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol " prekey="LastClaimAmt" postkey="LastClaimAmt" id="idWINLastClaimAmount" prevalue="' + outputMoney(item.LastClaimAmt) + '">' + LastClaimAmount + '</span>';
        strNewRow += LastClaimAmount + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idWINLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idWINPC" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idWINPCDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idWINGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idWINGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idWINTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idWINGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idWINGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idWINChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblWIN.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateWIN() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idWINLCAmtEdit", "idWINGSTCodeEdit", "idWINTaxableAmtEdit", "idWINPCEdit", "idWINGLCodeEdit", "idWINChargeToFactoryEdit"];
    var fldName = ["LC Amount", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge to Fact."];
    var fldType = ["number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "WINModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (!winterAllowance("modal")) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idWINPCDisplayEdit").val($("#idWINPCEdit").children("option").filter(":selected").text());
    return true;
}
function formatWIN(tr) {
    var fldLabel = ["S.#", "LC Amt", "Cost Center", "Expense Type", "VAT Code", "GL Code", "Last Claim Date", "Taxable Amt", "Charge To Fact.", "Last Claim Amount", "VAT Amt", ""];
    var fldID = ["idWINSNo", "idWINLCAmt", "idWINPC", "idWINExpTyp", "idWINGSTCode", "idWINGLCode", "idWINLastClaimDate", "idWINTaxableAmt", "idWINChargeToFactory", "idWINLastClaimAmount", "idWINGSTAmt", ""];
    var fldClass = ["", "amount", "", "", "", "", "", "amount", "", "amount", "amount", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Winter Allowance Ends
//VISA Claim Start
function setVSADataEditModal() {
    //Set Row for editing    
    var tr = objSelectedRow;
    setDefaultCountryValues("idTblVSA");
    var fldEditID = ["idVSAIDEdit", "idVSASNoEdit", "idVSAExpTypEdit", "idVSACountryEdit", "idVSAVsaEdit", "idVSAFCAmtEdit", "idVSAExRateEdit", "idVSAPCEdit", "idVSATaxAmtEdit", "idVSAGSTAmtEdit", "idVSAGLCodeEdit", "idVSAGSTCodeEdit", "idSVSAChrgToFactEdit", "idVSARcptNoEdit", "idVSADescEdit", "idVSACurrencyEdit", "idVSALCAmtEdit", "idVSAArrgByEdit", "idVSAPCDisplayEdit", "idVSAGSTCodeDisplayEdit"]
    var fldID = ["idVSAID", "idVSASNo", "idVSAExpTyp", "idVSACountry", "idVSAVsa", "idVSAFCAmt", "idVSAExRate", "idVSAPC", "idVSATaxAmt", "idVSAGSTAmt", "idVSAGLCode", "idVSAGSTCode", "idSVSAChrgToFact", "idVSARcptNo", "idVSADesc", "idVSACurrency", "idVSALCAmt", "idVSAArrgBy", "idVSAPCDisplay", "idVSAGSTCodeDisplay"]
    var fldAccEditable = ["", "", "disabled", "disabled", "disabled", "readonly", "readonly", "disabled", "", "", "", "", "disabled", "readonly", "readonly", "disabled", "", "disabled", "", ""]

    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idVSACountryEdit").change();
    $("#idVSACurrencyEdit").change();
    setExpArrangedBy("idTblVSA");
}
function getVSADataEditModal() {
    if (!validateVSA()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idVSAIDEdit").val();
    rowJSON["SNo"] = $("#idVSASNoEdit").val();
    rowJSON["TaxableAmt"] = $("#idVSATaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idVSAGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idVSAGLCodeEdit").val();
    rowJSON["GSTCode"] = $("#idVSAGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idVSAGSTCodeDisplayEdit").val();

    rowJSON["ChargeToFactory"] = $("#idSVSAChrgToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idVSARcptNoEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreCountry"] = $("#idVSACountryEdit").val();
        rowJSON["PreVISANo"] = $("#idVSAVsaEdit").val();
        rowJSON["PreFCAmt"] = $("#idVSAFCAmtEdit").val();
        rowJSON["PreExRate"] = $("#idVSAExRateEdit").val();
        rowJSON["PreCostCenter"] = $("#idVSAPCEdit").val();
        rowJSON["PreCurrency"] = $("#idVSACurrencyEdit").val();
        rowJSON["PreLCAmt"] = $("#idVSALCAmtEdit").val();
        rowJSON["PreDesc"] = $("#idVSADescEdit").val();
        rowJSON["PreTktArrangedBy"] = $("#idVSAArrgByEdit").val();
        rowJSON["PreExpTypes"] = $("#idVSAExpTypEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idVSAPCEdit ").children("option").filter(":selected").text();
    }
    else {
        rowJSON["PreCountry"] = ($("#idVSACountryEdit").attr("prevalue")) == undefined || ($("#idVSACountryEdit").attr("prevalue")) == "" ? "NA" : $("#idVSACountryEdit").attr("prevalue");
        rowJSON["PostCountry"] = $("#idVSACountryEdit").val();
        rowJSON["PreVISANo"] = ($("#idVSAVsaEdit").attr("prevalue")) == undefined || ($("#idVSAVsaEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAVsaEdit").attr("prevalue");
        rowJSON["PostVISANo"] = $("#idVSAVsaEdit").val();
        rowJSON["PreFCAmt"] = ($("#idVSAFCAmtEdit").attr("prevalue")) == undefined || ($("#idVSAFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idVSAFCAmtEdit").val();
        rowJSON["PreTktArrangedBy"] = ($("#idVSAArrgByEdit").attr("prevalue")) == undefined || ($("#idVSAArrgByEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAArrgByEdit").attr("prevalue");
        rowJSON["PostTktArrangedBy"] = $("#idVSAArrgByEdit").val();
        rowJSON["PreExRate"] = ($("#idVSAExRateEdit").attr("prevalue")) == undefined || ($("#idVSAExRateEdit").attr("prevalue")) == "" ? "0" : $("#idVSAExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idVSAExRateEdit").val();
        rowJSON["PreCostCenter"] = ($("#idVSAPCEdit").attr("prevalue")) == undefined || ($("#idVSAPCEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAPCEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idVSAPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idVSAPCDisplayEdit").attr("prevalue")) == undefined || ($("#idVSAPCDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAPCDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idVSAPCDisplayEdit").val();
        rowJSON["PreCurrency"] = ($("#idVSACurrencyEdit").attr("prevalue")) == undefined || ($("#idVSACurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idVSACurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idVSACurrencyEdit").val();
        rowJSON["PreLCAmt"] = ($("#idVSALCAmtEdit").attr("prevalue")) == undefined || ($("#idVSALCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idVSALCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idVSALCAmtEdit").val();
        rowJSON["PreDesc"] = ($("#idVSADescEdit").attr("prevalue")) == undefined || ($("#idVSADescEdit").attr("prevalue")) == "" ? "NA" : $("#idVSADescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idVSADescEdit").val();
        rowJSON["PreExpTypes"] = ($("#idVSAExpTypEdit").attr("prevalue")) == undefined || ($("#idVSAExpTypEdit").attr("prevalue")) == "" ? "NA" : $("#idVSAExpTypEdit").attr("prevalue");
        rowJSON["PostExpTypes"] = $("#idVSAExpTypEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateVSARow(strJSON, false);
}
function generateVSARow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblVSA = null;
    if (flgIntialLoading) {
        tblVSA = $('#idTblVSA').DataTable();
        tblVSA.clear()
        tblVSA.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("VSAModal");
    $.each(objJSON, function (i, item) {
        var Country, FCAmt, Currency, ExRate, LCAmt, CostCenter, CostCenter, VISANo, Desc, PreVisa, ExpType, DescDisp, PreDesc;
        Country = FCAmt = Currency = ExRate = LCAmt = CostCenter = VISANo = Desc = PreVisa = ExpType, CostCenter = DescDisp = PreDesc = "";
        var GSTAmt = outputMoney(item.GSTAmt);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        if (travelStage == "pre") {
            Country = item.PreCountry;
            FCAmt = outputMoney(item.PreFCAmt);
            TktArrangedBy = item.PreTktArrangedBy;
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            VISANo = item.PreVISANo;
            Desc = item.PreDesc;
            ExpType = item.PreExpTypes;
        }
        else {
            Country = item.PostCountry;
            FCAmt = outputMoney(item.PostFCAmt);
            TktArrangedBy = item.PostTktArrangedBy;
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;

            VISANo = item.PostVISANo;
            Desc = item.PostDesc;
            ExpType = item.PostExpTypes;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Visa</span><span class="datacol" id="idVSAID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idVSASNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol " prekey="PreExpTypes" postkey="PostExpTypes" id="idVSAExpTyp" prevalue="' + item.PreExpTypes + '">' + ExpType + '</span>';
        strNewRow += ExpType + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCountry + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCountry" postkey="PostCountry" id="idVSACountry" prevalue="' + item.PreCountry + '">' + Country + '</span>';
        strNewRow += Country + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreTktArrangedBy + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol ticketArrBy" prekey="PreTktArrangedBy" postkey="PostTktArrangedBy" id="idVSAArrgBy" prevalue="' + item.PreTktArrangedBy + '">' + TktArrangedBy + '</span>';
        strNewRow += TktArrangedBy + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idVSAFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idVSACurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idVSAExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idVSALCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idVSAPCDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="displaynone">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idVSAPC" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idVSADesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="PreVISANo" postkey="PostVISANo" id="idVSAVsa" prevalue="' + item.PreVISANo + '">' + VISANo + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreVISANo + '</span>' + VISANo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idVSATaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idVSAGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idVSAGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idVSAGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idVSAGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idSVSAChrgToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idVSARcptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblVSA.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateVSA() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idVSAExpTypEdit", "idVSACountryEdit", "idVSAVsaEdit", "idVSAFCAmtEdit", "idVSAArrgByEdit", "idVSACurrencyEdit", "idVSAExRateEdit", "idVSALCAmtEdit", "idVSAGSTCodeEdit", "idVSATaxAmtEdit", "idVSAPCEdit", "idVSAGLCodeEdit", "idSVSAChrgToFactEdit"];
    var fldName = ["Expense Types", "Country", "VISA", "FC Amount", "Visa Arranged By", "Currency", "Expense Rate", "LC Amount", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "select", "text", "number", "select", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "VSAModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idVSAPCDisplayEdit").val($("#idVSAPCEdit ").children("option").filter(":selected").text());
    $("#idVSAGSTCodeDisplayEdit").val($("#idVSAGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatVSA(tr) {
    var fldLabel = ["S.#", "Curr.", "VAT Amt", "Expense Type", "Ex. Rate", "Cost Center", "Country/City", "LC Amt", "GL Code", "VISA #", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Visa Arr. By", "NA", "NA", "Description"];
    var fldID = ["idVSASNo", "idVSACurrency", "idVSAGSTAmt", "idVSAExpTyp", "idVSAExRate", "idVSAPCDisplay", "idVSACountry", "idVSALCAmt", "idVSAGLCode", "idVSAVsa", "idVSAGSTCodeDisplay", "idSVSAChrgToFact", "idVSAFCAmt", "idVSATaxAmt", "idVSARcptNo", "idVSAArrgBy", "NA", "NA", "idVSADesc"];
    var fldClass = ["", "", "amount", "", "amount", "", "", "amount", "", "", "", "", "amount", "amount", "amount", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//VISA Claim End
//ETravel Miscellaneous Start
function setMISDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idMISIDEdit", "idMISSNoEdit", "idMISFCAmtEdit", "idMISExRateEdit", "idMISPCEdit", "idMISTaxAmtEdit", "idMISGSTAmtEdit", "idMISGLCodeEdit", "idMISGSTCodeEdit", "idSMISChargFacryEdit", "idMISRcptAmtEdit", "idMISDescEdit", "idMISCurncyEdit", "idMISLCAmtEdit", "idMISExpTypEdit", "idMISPCDisplayEdit", "idMISGSTCodeDisplayEdit", "idMISReceiptDateEdit"]
    var fldID = ["idMISID", "idMISSNo", "idMISFCAmt", "idMISExRate", "idMISPC", "idMISTaxAmt", "idMISGSTAmt", "idMISGLCode", "idMISGSTCode", "idSMISChargFacry", "idMISRcptAmt", "idMISDesc", "idMISCurncy", "idMISLCAmt", "idMISExpTyp", "idMISPCEdit", "idMISGSTCodeDisplay", "idMISReceiptDate"]
    var fldAccEditable = ["", "", "readonly", "readonly", "disabled", "", "", "", "", "disabled", "", "readonly", "disabled", "", "", "", "readonly"]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
}
function getMISDataEditModal() {
    if (!validateMIS()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idMISIDEdit").val();
    rowJSON["SNo"] = $("#idMISSNoEdit").val();
    rowJSON["PostFCAmt"] = $("#idMISFCAmtEdit").val();
    rowJSON["PostCurrency"] = $("#idMISCurncyEdit").val();
    rowJSON["PostExRate"] = $("#idMISExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idMISLCAmtEdit").val();
    rowJSON["GSTCode"] = $("#idMISGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idMISGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idMISTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idMISGSTAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idMISPCEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idMISPCDisplayEdit").val();
    rowJSON["GLCode"] = $("#idMISGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idSMISChargFacryEdit").val();
    rowJSON["ReceiptNo"] = $("#idMISRcptAmtEdit").val();
    rowJSON["PostReceiptDate"] = $("#idMISReceiptDateEdit").val();
    rowJSON["PostDesc"] = $("#idMISDescEdit").val();
    rowJSON["PostExpTypes"] = $("#idMISExpTypEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateMISRow(strJSON, false);
}
function generateMISRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblMIS = null;
    if (flgIntialLoading) {
        tblMIS = $('#idTblMIS').DataTable();
        tblMIS.clear()
        tblMIS.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("MISModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Miscellaneous</span><span class="datacol" id="idMISID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idMISSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostExpTypes" postkey="PostExpTypes" id="idMISExpTyp">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PostFCAmt" postkey="PostFCAmt" id="idMISFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCurrency" postkey="PostCurrency" id="idMISCurncy">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PostExRate" postkey="PostExRate" id="idMISExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt" id="idMISLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PostCostCenter" postkey="PostCostCenter" id="idMISPC">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay" id="idMISPCDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostDesc" postkey="PostDesc" id="idMISDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idMISTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idMISGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idMISGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idMISGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idMISGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idSMISChargFacry">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idMISRcptAmt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idMISReceiptDate" prekey="PostReceiptDate" postkey="PostReceiptDate">' + item.PostReceiptDate + '</span>' + item.PostReceiptDate + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblMIS.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateMIS() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idMISExpTypEdit", "idMISFCAmtEdit", "idMISCurncyEdit", "idMISExRateEdit", "idMISLCAmtEdit", "idMISGSTCodeEdit", "idMISTaxAmtEdit", "idMISPCEdit", "idMISGLCodeEdit", "idSMISChargFacryEdit"];
    var fldName = ["Expense Type", "FC Amount", "Currency", "Expense Rate", "LC Amount", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "number", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "MISModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idMISPCDisplayEdit").val($("#idMISPCEdit").children("option").filter(":selected").text());
    $("#idMISGSTCodeDisplayEdit").val($("#idMISGSTCodeEdit").children("option").filter(":selected").text());

    return true;
}
function formatMIS(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Expense Type", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "Receipt Date", "Ex. Rate", "Cost Center", "", "Description"];
    var fldID = ["idMISSNo", "idMISLCAmt", "idMISGLCode", "idMISExpTyp", "idMISGSTCodeDisplay", "idSMISChargFacry", "idMISFCAmt", "idMISTaxAmt", "idMISRcptAmt", "idMISCurncy", "idMISGSTAmt", "idMISReceiptDate", "idMISExRate", "idMISPCDisplay", "", "idMISDesc"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "amount", "", "amount", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//ETravel Miscellaneous End
//Accommodation Travel Start
function setACCDataEditModal() {
    //Set Row for editing    
    var tr = objSelectedRow;
    setDefaultCountryValues("idTblACC");
    var fldEditID = ["idACCIDEdit", "idACCSNoEdit", "idACCLCAmtEdit", "idACCReceiptEdit", "idACCCountryEdit", "idACCGSTCodeEdit", "idACCHotelNameEdit", "idACCTaxAmtEdit", "idACCPNShareEdit", "idACCGSTAmtEdit", "idACCNoDaysEdit", "idACCCostCenterEdit", "idACCFCAmtEdit", "idACCGLCodeEdit", "idACCExRateEdit", "idACCChrgtoFactEdit", "idACCCurrencyEdit", "idACCDescEdit", "idACCCostCenterDisplayEdit", "idACCArgByEdit", "idACCReceiptDateEdit"];
    var fldID = ["idACCID", "idACCSNo", "idACCLCAmt", "idACCReceipt", "idACCCountry", "idACCGSTCode", "idACCHotelName", "idACCTaxAmt", "idACCPNShare", "idACCGSTAmt", "idACCNoDays", "idACCCostCenter", "idACCFCAmt", "idACCGLCode", "idACCExRate", "idACCChrgtoFact", "idACCCurrency", "idACCDesc", "idACCCostCenterDisplay", "idACCArgBy", "idACCReceiptDate"];
    var fldAccEditable = ["", "", "", "", "disabled", "", "readonly", "", "readonly", "", "readonly", "", "readonly", "", "readonly", "disabled", "disabled", "readonly", "", "disabled", "readonly"];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idACCCountryEdit").change();
    $("#idACCCurrencyEdit").change();
    setExpArrangedBy("idTblACC");
}
function generateACCRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblACC = null;
    if (flgIntialLoading) {
        tblACC = $('#idTblACC').DataTable();
        tblACC.clear()
        tblACC.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("ACCModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var PerNightShare = outputMoney(item.PerNightShare);
        //if ($("input[fldTitle='hdnAccPerNightShare']").val() == "$")
        //    var MaxPerNightShare = "$";
        //else
        //    var MaxPerNightShare = outputMoney($("input[fldTitle='hdnAccPerNightShare']").val());
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Accommodation</span><span class="datacol" id="idACCID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="SNo" postkey="SNo" id="idACCSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCountry" postkey="PostCountry" id="idACCCountry">' + item.PostCountry + '</span>' + item.PostCountry + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="HotelName" postkey="HotelName" id="idACCHotelName">' + item.HotelName + '</span>' + item.HotelName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone ticketArrBy" prekey="PostTktArrangedBy" postkey="PostTktArrangedBy" id="idACCArgBy">' + item.PostTktArrangedBy + '</span>' + item.PostTktArrangedBy + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone" prekey="PostFCAmt" postkey="PostFCAmt" id="idACCFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCurrency" postkey="PostCurrency" id="idACCCurrency">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone" prekey="PostExRate" postkey="PostExRate" id="idACCExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone lcamt" prekey="PostLCAmt" postkey="PostLCAmt" id="idACCLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="datacol displaynone" prekey="PostCostCenter" postkey="PostCostCenter" id="idACCCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay" id="idACCCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostDesc" postkey="PostDesc" id="idACCDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="PostDays" postkey="PostDays" id="idACCNoDays">' + item.PostDays + '</span>' + item.PostDays + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="PerNightShare" postkey="PerNightShare" id="idACCPNShare">' + PerNightShare + '</span>' + PerNightShare + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idACCChrgtoFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="ReceiptNo" postkey="ReceiptNo" id="idACCReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="GSTCode" postkey="GSTCode" id="idACCGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idACCGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="TaxableAmt" postkey="TaxableAmt" id="idACCTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GSTAmt" postkey="GSTAmt" id="idACCGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GLCode" postkey="GLCode" id="idACCGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idACCReceiptDate" prekey="PostReceiptDate" postkey="PostReceiptDate">' + item.PostReceiptDate + '</span>' + item.PostReceiptDate + '</td>';

        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblACC.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getACCDataEditModal() {
    if (!validateACC()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idACCIDEdit").val();
    rowJSON["SNo"] = $("#idACCSNoEdit").val();
    rowJSON["PostLCAmt"] = $("#idACCLCAmtEdit").val();
    rowJSON["ReceiptNo"] = $("#idACCReceiptEdit").val();
    rowJSON["PostReceiptDate"] = $("#idACCReceiptDateEdit").val();
    rowJSON["PostCountry"] = $("#idACCCountryEdit").val();
    rowJSON["GSTCode"] = $("#idACCGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idACCGSTCodeDisplayEdit").val();
    rowJSON["HotelName"] = $("#idACCHotelNameEdit").val();
    rowJSON["TaxableAmt"] = $("#idACCTaxAmtEdit").val();
    rowJSON["PerNightShare"] = $("#idACCPNShareEdit").val();
    rowJSON["GSTAmt"] = $("#idACCGSTAmtEdit").val();
    rowJSON["PostDays"] = $("#idACCNoDaysEdit").val();
    rowJSON["PostCostCenter"] = $("#idACCCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idACCCostCenterDisplayEdit").val();
    rowJSON["PostFCAmt"] = $("#idACCFCAmtEdit").val();
    rowJSON["GLCode"] = $("#idACCGLCodeEdit").val();
    rowJSON["PostExRate"] = $("#idACCExRateEdit").val();
    rowJSON["ChargeToFactory"] = $("#idACCChrgtoFactEdit").val();
    rowJSON["PostCurrency"] = $("#idACCCurrencyEdit").val();
    rowJSON["PostDesc"] = $("#idACCDescEdit").val();
    rowJSON["PostTktArrangedBy"] = $("#idACCArgByEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateACCRow(strJSON, false);
}
function validateACC() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idACCCountryEdit", "idACCHotelNameEdit", "idACCArgByEdit", "idACCNoDaysEdit", "idACCFCAmtEdit", "idACCPNShareEdit", "idACCCurrencyEdit", "idACCGSTCodeEdit", "idACCTaxAmtEdit", "idACCCostCenterEdit", "idACCGLCodeEdit", "idACCChrgtoFactEdit"];
    var fldName = ["Country", "Hotel Name", "Acc Arranged By", "No of Days", "FC Amount", "Per Night Share", "Currency", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "text", "select", "number", "number", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "ACCModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idACCCostCenterDisplayEdit").val($("#idACCCostCenterEdit").children("option").filter(":selected").text());
    $("#idACCGSTCodeDisplayEdit").val($("#idACCGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatACC(tr) {
    var fldLabel = ["S.#", "Curr.", "GL Code", "Country/City", "Ex. Rate", "Charge To Fact.", "Hotel Name", "LC Amt", "Receipt #", "Accom By", "VAT Code", "Receipt Date", "FC Amt", "Taxable Amt", "", "No. of Days", "VAT Amt", "", "Per Night Share", "Cost Center", "", "Description"];
    var fldID = ["idACCSNo", "idACCCurrency", "idACCGLCode", "idACCCountry", "idACCExRate", "idACCChrgtoFact", "idACCHotelName", "idACCLCAmt", "idACCReceipt", "idACCArgBy", "idACCGSTCodeDisplay", "idACCReceiptDate", "idACCFCAmt", "idACCTaxAmt", "", "idACCNoDays", "idACCGSTAmt", "", "idACCPNShare", "idACCCostCenterDisplay", "", "idACCDesc"];
    var fldClass = ["", "", "", "", "amount", "", "", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", "amount", "", "", ""];
    var strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Accommodation Travel Ends
//Air Ticket Cost Start
function setATCDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idATCIDEdit", "idATCSNoEdit", "idATCGSTCodeEdit", "idATCInvoiceNoEdit", "idATCTaxAmtEdit", "idATCTktArgByEdit", "idATCGSTAmtEdit", "idATCCurrencyEdit", "idATCCostCenterEdit", "idATCDescEdit", "idATCFCAmtEdit", "idATCGLCodeEdit", "idATCExRateEdit", "idATCChrgToFactEdit", "idATCLCAmtEdit", "idATCReceiptEdit", "idATCCostCenterDisplayEdit", "idATCGSTCodeDisplayEdit"];
    var fldID = ["idATCID", "idATCSNo", "idATCGSTCode", "idATCInvoiceNo", "idATCTaxAmt", "idATCTktArgBy", "idATCGSTAmt", "idATCCurrency", "idATCCostCenter", "idATCDesc", "idATCFCAmt", "idATCGLCode", "idATCExRate", "idATCChrgToFact", "idATCLCAmt", "idATCReceipt", "idATCCostCenterDisplay", "idATCGSTCodeDisplay"];
    var fldAccEditable = ["", "", "", "", "", "disabled", "", "disabled", "", "readonly", "readonly", "", "readonly", "disabled", "", "", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    setExpArrangedBy("idTblATC");
}
function generateATCRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblATC = null;
    if (flgIntialLoading) {
        tblATC = $('#idTblATC').DataTable();
        tblATC.clear()
        tblATC.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("ATCModal");
    $.each(objJSON, function (i, item) {
        var AirInvoiceNo, TktArrangedBy, FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, DescDisp, PreDesc;
        AirInvoiceNo = TktArrangedBy = FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = DescDisp = PreDesc = "";
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        if (travelStage == "pre") {
            AirInvoiceNo = item.PreAirInvoiceNo;
            TktArrangedBy = item.PreTktArrangedBy;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
        }
        else {
            AirInvoiceNo = item.PostAirInvoiceNo;
            TktArrangedBy = item.PostTktArrangedBy;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">AirTicketCost</span><span class="datacol" id="idATCID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="SNo" postkey="SNo" id="idATCSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreAirInvoiceNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreAirInvoiceNo" postkey="PostAirInvoiceNo" id="idATCInvoiceNo" prevalue="' + item.PreAirInvoiceNo + '">' + AirInvoiceNo + '</span>';
        strNewRow += AirInvoiceNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreTktArrangedBy + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol ticketArrBy" prekey="PreTktArrangedBy" postkey="PostTktArrangedBy" id="idATCTktArgBy" prevalue="' + item.PreTktArrangedBy + '">' + TktArrangedBy + '</span>';
        strNewRow += TktArrangedBy + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idATCFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idATCCurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idATCExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idATCLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idATCCostCenter" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idATCCostCenterDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idATCDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idATCChrgToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="ReceiptNo" postkey="ReceiptNo" id="idATCReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GSTCode" postkey="GSTCode" id="idATCGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idATCGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="TaxableAmt" postkey="TaxableAmt" id="idATCTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="GSTAmt" postkey="GSTAmt" id="idATCGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GLCode" postkey="GLCode" id="idATCGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblATC.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getATCDataEditModal() {
    if (!validateATC()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idATCIDEdit").val();
    rowJSON["SNo"] = $("#idATCSNoEdit").val();
    rowJSON["GSTCode"] = $("#idATCGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idATCGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idATCTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idATCGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idATCGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idATCChrgToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idATCReceiptEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreAirInvoiceNo"] = $("#idATCInvoiceNoEdit").val();
        rowJSON["PreTktArrangedBy"] = $("#idATCTktArgByEdit").val();
        rowJSON["PreCurrency"] = $("#idATCCurrencyEdit").val();
        rowJSON["PreCostCenter"] = $("#idATCCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idATCCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idATCDescEdit").val();
        rowJSON["PreFCAmt"] = $("#idATCFCAmtEdit").val();
        rowJSON["PreExRate"] = $("#idATCExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idATCLCAmtEdit").val();
    }
    else {
        rowJSON["PreAirInvoiceNo"] = ($("#idATCInvoiceNoEdit").attr("prevalue")) == undefined || ($("#idATCInvoiceNoEdit").attr("prevalue")) == "" ? "NA" : $("#idATCInvoiceNoEdit").attr("prevalue");
        rowJSON["PostAirInvoiceNo"] = $("#idATCInvoiceNoEdit").val();
        rowJSON["PreTktArrangedBy"] = ($("#idATCTktArgByEdit").attr("prevalue")) == undefined || ($("#idATCTktArgByEdit").attr("prevalue")) == "" ? "NA" : $("#idATCTktArgByEdit").attr("prevalue");
        rowJSON["PostTktArrangedBy"] = $("#idATCTktArgByEdit").val();
        rowJSON["PreCurrency"] = ($("#idATCCurrencyEdit").attr("prevalue")) == undefined || ($("#idATCCurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idATCCurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idATCCurrencyEdit").val();
        rowJSON["PreCostCenter"] = ($("#idATCCostCenterEdit").attr("prevalue")) == undefined || ($("#idATCCostCenterEdit").attr("prevalue")) == "" ? "NA" : $("#idATCCostCenterEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idATCCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idATCCostCenterDisplayEdit").attr("prevalue")) == undefined || ($("#idATCCostCenterDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idATCCostCenterDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idATCCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idATCDescEdit").attr("prevalue")) == undefined || ($("#idATCDescEdit").attr("prevalue")) == "" ? "NA" : $("#idATCDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idATCDescEdit").val();
        rowJSON["PreFCAmt"] = ($("#idATCFCAmtEdit").attr("prevalue")) == undefined || ($("#idATCFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idATCFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idATCFCAmtEdit").val();
        rowJSON["PreExRate"] = ($("#idATCExRateEdit").attr("prevalue")) == undefined || ($("#idATCExRateEdit").attr("prevalue")) == "" ? "0" : $("#idATCExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idATCExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idATCLCAmtEdit").attr("prevalue")) == undefined || ($("#idATCLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idATCLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idATCLCAmtEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateATCRow(strJSON, false);
}
function validateATC() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idATCTktArgByEdit", "idATCFCAmtEdit", "idATCCurrencyEdit", "idATCGSTCodeEdit", "idATCTaxAmtEdit", "idATCCostCenterEdit", "idATCGLCodeEdit", "idATCChrgToFactEdit"];
    var fldName = ["Ticket Arr.By", "FC Amount", "Currency", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "ATCModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idATCCostCenterDisplayEdit").val($("#idATCCostCenterEdit").children("option").filter(":selected").text());
    $("#idATCGSTCodeDisplayEdit").val($("#idATCGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatATC(tr) {
    var fldLabel = ["S.#", "LC Amt", "Charge To Fact.", "Invoice Number", "VAT Code", "Receipt #", "Tkt Arranged By", "Taxable Amt", "", "FC Amt", "VAT Amt", "", "Curr.", "Cost Center", "", "Ex. Rate", "GL Code", "", "Description"];
    var fldID = ["idATCSNo", "idATCLCAmt", "idATCChrgToFact", "idATCInvoiceNo", "idATCGSTCodeDisplay", "idATCReceipt", "idATCTktArgBy", "idATCTaxAmt", "", "idATCFCAmt", "idATCGSTAmt", "", "idATCCurrency", "idATCCostCenterDisplay", "", "idATCExRate", "idATCGLCode", "", "idATCDesc"];
    var fldClass = ["", "amount", "", "", "", "", "", "amount", "", "amount", "amount", "", "", "", "", "amount", "", "", ""];
    var strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Air Ticket Cost End
//Communication TravelStarts
function setCOMDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idCOMIDEdit", "idCOMSNoEdit", "idCOMExpTypeEdit", "idCOMTaxAmtEdit", "idCOMGSTAmtEdit", "idCOMCurrencyEdit", "idCOMCostCenterEdit", "idCOMFCAmtEdit", "idCOMGLCodeEdit", "idCOMExRateEdit", "idCOMChrgToFactEdit", "idCOMLCAmtEdit", "idCOMReceiptEdit", "idCOMGSTCodeEdit", "idCOMDescEdit", "idCOMCostCenterDisplayEdit", "idCOMGSTCodeDisplayEdit"];
    var fldID = ["idCOMID", "idCOMSNo", "idCOMExpType", "idCOMTaxAmt", "idCOMGSTAmt", "idCOMCurrency", "idCOMCostCenter", "idCOMFCAmt", "idCOMGLCode", "idCOMExRate", "idCOMChrgToFact", "idCOMLCAmt", "idCOMReceipt", "idCOMGSTCode", "idCOMDesc", "idCOMCostCenterDisplay", "idCOMGSTCodeDisplay"];
    var fldAccEditable = ["", "", "disabled", "", "", "disabled", "", "readonly", "", "readonly", "disabled", "", "", "", "readonly", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idCOMCurrencyEdit").change();
}
function generateCOMRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblCOM = null;
    if (flgIntialLoading) {
        tblCOM = $('#idTblCOM').DataTable();
        tblCOM.clear()
        tblCOM.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("COMModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Communication</span><span class="datacol" id="idCOMID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="SNo" postkey="SNo" id="idCOMSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostExpTypes" postkey="PostExpTypes" id="idCOMExpType">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone" prekey="PostFCAmt" postkey="PostFCAmt" id="idCOMFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCurrency" postkey="PostCurrency" id="idCOMCurrency">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone" prekey="PostExRate" postkey="PostExRate" id="idCOMExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone lcamt" prekey="PostLCAmt" postkey="PostLCAmt" id="idCOMLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="datacol displaynone" prekey="PostCostCenter" postkey="PostCostCenter" id="idCOMCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay" id="idCOMCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostDesc" postkey="PostDesc" id="idCOMDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="TaxableAmt" postkey="TaxableAmt" id="idCOMTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="datacol displaynone" prekey="GSTAmt" postkey="GSTAmt" id="idCOMGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GLCode" postkey="GLCode" id="idCOMGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idCOMChrgToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="ReceiptNo" postkey="ReceiptNo" id="idCOMReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GSTCode" postkey="GSTCode" id="idCOMGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idCOMGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblCOM.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getCOMDataEditModal() {
    if (!validateCOM()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idCOMIDEdit").val();
    rowJSON["SNo"] = $("#idCOMSNoEdit").val();
    rowJSON["PostExpTypes"] = $("#idCOMExpTypeEdit").val();
    rowJSON["TaxableAmt"] = $("#idCOMTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idCOMGSTAmtEdit").val();
    rowJSON["PostCurrency"] = $("#idCOMCurrencyEdit").val();
    rowJSON["PostCostCenter"] = $("#idCOMCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idCOMCostCenterDisplayEdit").val();
    rowJSON["PostFCAmt"] = $("#idCOMFCAmtEdit").val();
    rowJSON["GLCode"] = $("#idCOMGLCodeEdit").val();
    rowJSON["PostExRate"] = $("#idCOMExRateEdit").val();
    rowJSON["ChargeToFactory"] = $("#idCOMChrgToFactEdit").val();
    rowJSON["PostLCAmt"] = $("#idCOMLCAmtEdit").val();
    rowJSON["ReceiptNo"] = $("#idCOMReceiptEdit").val();
    rowJSON["GSTCode"] = $("#idCOMGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idCOMGSTCodeDisplayEdit").val();
    rowJSON["PostDesc"] = $("#idCOMDescEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateCOMRow(strJSON, false);
}
function validateCOM() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idCOMExpTypeEdit", "idCOMFCAmtEdit", "idCOMCurrencyEdit", "idCOMGSTCodeEdit", "idCOMTaxAmtEdit", "idCOMCostCenterEdit", "idCOMGLCodeEdit", "idCOMChrgToFactEdit"];
    var fldName = ["Expense Type", "FC Amount", "Currency", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "COMModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idCOMCostCenterDisplayEdit").val($("#idCOMCostCenterEdit").children("option").filter(":selected").text());
    $("#idCOMGSTCodeDisplayEdit").val($("#idCOMGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatCOM(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Expense Type", "VAT Code", "Charge to Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Ex. Rate", "Cost Center", "", "Description"];
    var fldID = ["idCOMSNo", "idCOMLCAmt", "idCOMGLCode", "idCOMExpType", "idCOMGSTCodeDisplay", "idCOMChrgToFact", "idCOMFCAmt", "idCOMTaxAmt", "idCOMReceipt", "idCOMCurrency", "idCOMGSTAmt", "", "idCOMExRate", "idCOMCostCenterDisplay", "", "idCOMDesc"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", "amount", "", "", ""];
    var strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Communication Travel Ends
//Daily Allownace Travel Starts     
function setDADataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idDAIDEdit", "idDASNoEdit", "idDACountryEdit", "idDACityEdit", "idDAAllowTypeEdit", "idDADailyRateEdit", "idDANoofDaysEdit", "idDAActualNoofDaysEdit", "idDACBrkFastEdit", "idDACLnchEdit", "idDACDinnerEdit", "idDAFCAmtEdit", "idDACurrencyEdit", "idDAExrateEdit", "idDALCAmtEdit", "idDAGSTCodeEdit", "idDATaxAmtEdit", "idDAGSTAmtEdit", "idDACostCenterEdit", "idDAGLCodeEdit", "idDAChrgToFactEdit", "idDAReceiptNoEdit", "idDADescriptionEdit", "idDAStartDateEdit", "idDAEndDateEdit", "idDACostCenterDisplayEdit", "idDAGSTCodeDisplayEdit", "idDACountriesCitiesEdit"];
    var fldID = ["idDAID", "idDASNo", "idDACountry", "idDACity", "idDAAllowType", "idDADailyRate", "idDANoofDays", "idDAActualNoofDays", "idDACBrkFast", "idDACLnch", "idDACDinner", "idDAFCAmt", "idDACurrency", "idDAExrate", "idDALCAmt", "idDAGSTCode", "idDATaxAmt", "idDAGSTAmt", "idDACostCenter", "idDAGLCode", "idDAChrgToFact", "idDAReceiptNo", "idDADescription", "idDAStartDate", "idDAEndDate", "idDACostCenterDisplay", "idDAGSTCodeDisplay", "idDACountriesCities"];
    var fldAccEditable = ["", "", "disabled", "disabled", "disabled", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "disabled", "", "", "", "", "", "", "", "disabled", "", "readonly", "readonly", "readonly", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idDACurrencyEdit").change();
    $('#idDACountryEdit option').map(function () {
        if ($(this).text() == tr.find("#idDACountry").text()) {
            return this;
        }
    }).map(function () {
        this.selected = true
    });
    $('#idDACountryEdit').trigger("onchange");
    $('#idDACityEdit option').map(function () {
        if ($(this).text() == tr.find("#idDACity").text()) {
            return this;
        }
    }).attr('selected', 'selected');
    $('#idDACountryEdit,#idDACityEdit').attr("disabled", true);
    refreshDA();
}
function getDADataEditModal() {
    if (!validateDA()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idDAIDEdit").val();
    rowJSON["SNo"] = $("#idDASNoEdit").val();
    rowJSON["GSTAmt"] = $("#idDAGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idDAGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idDAChrgToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idDAReceiptNoEdit").val();
    rowJSON["GSTCode"] = $("#idDAGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idDAGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idDATaxAmtEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreAllowType"] = $("#idDAAllowTypeEdit").val();
        rowJSON["PreDARate"] = $("#idDADailyRateEdit").val();
        rowJSON["PreDinner"] = $("#idDACDinnerEdit").val();
        rowJSON["PreFCAmt"] = $("#idDAFCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idDACostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idDACostCenterDisplayEdit").val();
        rowJSON["PreCountry"] = $("#idDACountryEdit option:selected").text();
        rowJSON["PreCity"] = $("#idDACityEdit option:selected").text();
        rowJSON["PreCurrency"] = $("#idDACurrencyEdit").val();
        rowJSON["PreExRate"] = $("#idDAExrateEdit").val();
        rowJSON["PreDays"] = $("#idDANoofDaysEdit").val();
        rowJSON["PreActualDays"] = $("#idDAActualNoofDaysEdit").val();
        rowJSON["PreLCAmt"] = $("#idDALCAmtEdit").val();
        rowJSON["PreBfast"] = $("#idDACBrkFastEdit").val();
        rowJSON["PreLunch"] = $("#idDACLnchEdit").val();
        rowJSON["PreDesc"] = $("#idDADescriptionEdit").val();
        rowJSON["PreStartDate"] = $("#idDAStartDateEdit").val();
        rowJSON["PreEndDate"] = $("#idDAEndDateEdit").val();
        rowJSON["PreDACountriesCities"] = $("#idDACountriesCitiesEdit").val();
    }
    else {
        rowJSON["PreAllowType"] = ($("#idDAAllowTypeEdit").attr("prevalue")) == undefined || ($("#idDAAllowTypeEdit").attr("prevalue")) == "" ? "NA" : $("#idDAAllowTypeEdit").attr("prevalue");
        rowJSON["PostAllowType"] = $("#idDAAllowTypeEdit").val();
        rowJSON["PreDARate"] = ($("#idDADailyRateEdit").attr("prevalue")) == undefined || ($("#idDADailyRateEdit").attr("prevalue")) == "" ? "NA" : $("#idDADailyRateEdit").attr("prevalue");
        rowJSON["PostDARate"] = $("#idDADailyRateEdit").val();
        rowJSON["PreActualDays"] = ($("#idDAActualNoofDaysEdit").attr("prevalue")) == undefined || ($("#idDAActualNoofDaysEdit").attr("prevalue")) == "" ? "NA" : $("#idDAActualNoofDaysEdit").attr("prevalue");
        rowJSON["PostActualDays"] = $("#idDAActualNoofDaysEdit").val();
        rowJSON["PreDinner"] = ($("#idDACDinnerEdit").attr("prevalue")) == undefined || ($("#idDACDinnerEdit").attr("prevalue")) == "" ? "NA" : $("#idDACDinnerEdit").attr("prevalue");
        rowJSON["PostDinner"] = $("#idDACDinnerEdit").val();
        rowJSON["PreFCAmt"] = ($("#idDAFCAmtEdit").attr("prevalue")) == undefined || ($("#idDAFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idDAFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idDAFCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idDACostCenterEdit").attr("prevalue")) == undefined || ($("#idDACostCenterEdit").attr("prevalue")) == "" ? "NA" : $("#idDACostCenterEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idDACostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idDACostCenterDisplayEdit").attr("prevalue")) == undefined || ($("#idDACostCenterDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idDACostCenterDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idDACostCenterDisplayEdit").val();
        rowJSON["PreCountry"] = ($("#idDACountryEdit").attr("prevalue")) == undefined || ($("#idDACountryEdit").attr("prevalue")) == "" ? "NA" : $("#idDACountryEdit").attr("prevalue");
        rowJSON["PostCountry"] = $("#idDACountryEdit option:selected").text();
        rowJSON["PreCity"] = ($("#idDACityEdit").attr("prevalue")) == undefined || ($("#idDACityEdit").attr("prevalue")) == "" ? "NA" : $("#idDACityEdit").attr("prevalue");
        rowJSON["PostCity"] = $("#idDACityEdit option:selected").text();
        rowJSON["PreCurrency"] = ($("#idDACurrencyEdit").attr("prevalue")) == undefined || ($("#idDACurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idDACurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idDACurrencyEdit").val();
        rowJSON["PreExRate"] = ($("#idDAExrateEdit").attr("prevalue")) == undefined || ($("#idDAExrateEdit").attr("prevalue")) == "" ? "0" : $("#idDAExrateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idDAExrateEdit").val();
        rowJSON["PreDays"] = ($("#idDANoofDaysEdit").attr("prevalue")) == undefined || ($("#idDANoofDaysEdit").attr("prevalue")) == "" ? "NA" : $("#idDANoofDaysEdit").attr("prevalue");
        rowJSON["PostDays"] = $("#idDANoofDaysEdit").val();
        rowJSON["PreLCAmt"] = ($("#idDALCAmtEdit").attr("prevalue")) == undefined || ($("#idDALCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idDALCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idDALCAmtEdit").val();
        rowJSON["PreBfast"] = ($("#idDACBrkFastEdit").attr("prevalue")) == undefined || ($("#idDACBrkFastEdit").attr("prevalue")) == "" ? "NA" : $("#idDACBrkFastEdit").attr("prevalue");
        rowJSON["PostBfast"] = $("#idDACBrkFastEdit").val();
        rowJSON["PreLunch"] = ($("#idDACLnchEdit").attr("prevalue")) == undefined || ($("#idDACLnchEdit").attr("prevalue")) == "" ? "NA" : $("#idDACLnchEdit").attr("prevalue");
        rowJSON["PostLunch"] = $("#idDACLnchEdit").val();
        rowJSON["PreDesc"] = ($("#idDADescriptionEdit").attr("prevalue")) == undefined || ($("#idDADescriptionEdit").attr("prevalue")) == "" ? "NA" : $("#idDADescriptionEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idDADescriptionEdit").val();
        rowJSON["PreStartDate"] = ($("#idDAStartDateEdit").attr("prevalue")) == undefined || ($("#idDAStartDateEdit").attr("prevalue")) == "" ? "" : $("#idDAStartDateEdit").attr("prevalue");
        rowJSON["PostStartDate"] = $("#idDAStartDateEdit").val();
        rowJSON["PreEndDate"] = ($("#idDAEndDateEdit").attr("prevalue")) == undefined || ($("#idDAEndDateEdit").attr("prevalue")) == "" ? "" : $("#idDAEndDateEdit").attr("prevalue");
        rowJSON["PostEndDate"] = $("#idDAEndDateEdit").val();
        rowJSON["PreDACountriesCities"] = ($("#idDACountriesCitiesEdit").attr("prevalue")) == undefined || ($("#idDACountriesCitiesEdit").attr("prevalue")) == "" ? "" : $("#idDACountriesCitiesEdit").attr("prevalue");
        rowJSON["PostDACountriesCities"] = $("#idDACountriesCitiesEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateDARow(strJSON, false);
}
function generateDARow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblDA = null;
    if (flgIntialLoading) {
        tblDA = $('#idTblDA').DataTable();
        tblDA.clear()
        tblDA.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("DAModal");
    $.each(objJSON, function (i, item) {
        var Bfast, Lunch, Dinner, FCAmt, Currency, ExRate, LCAmt, CostCenter, CostCenterDisplay, Desc, Country, City, Days, AllowType, DARate, ActualDays, StartDate, EndDate, DescDisp, PreDesc, CountriesCities;
        Bfast = Lunch = FCAmt = Dinner = Currency = ExRate = LCAmt = CostCenter = CostCenterDisplay = Desc = City = Days = Country = AllowType = DARate = ActualDays = StartDate = EndDate = DescDisp = PreDesc = CountriesCities = "";
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        if (travelStage == "pre") {
            Bfast = item.PreBfast;
            Lunch = item.PreLunch;
            Dinner = item.PreDinner;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
            Country = item.PreCountry;
            City = item.PreCity;
            Days = item.PreDays;
            AllowType = item.PreAllowType;
            DARate = item.PreDARate;
            ActualDays = item.PreActualDays;
            StartDate = item.PreStartDate;
            EndDate = item.PreEndDate;
            CountriesCities = item.PreDACountriesCities; //Multi City DA 
        }
        else {
            Bfast = item.PostBfast;
            Lunch = item.PostLunch;
            Dinner = item.PostDinner;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
            Country = item.PostCountry;
            City = item.PostCity;
            Days = item.PostDays;
            AllowType = item.PostAllowType;
            DARate = item.PostDARate;
            ActualDays = item.PostActualDays;
            StartDate = item.PostStartDate;
            EndDate = item.PostEndDate;
            CountriesCities = item.PostDACountriesCities; //Multi City DA 
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">DailyAllowance</span><span class="datacol" id="idDAID" prekey="ID" postkey="ID">' + item.ID + '</span>';
        strNewRow += '<span class="datacol" id="idDAStartDate" prekey="PreStartDate" postkey="PostStartDate" prevalue="' + item.PreStartDate + '">' + StartDate + '</span>';
        strNewRow += '<span class="datacol" id="idDAEndDate" prekey="PreEndDate" postkey="PostEndDate" prevalue="' + item.PreEndDate + '">' + EndDate + '</span></td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idDASNo" prekey="SNo" postkey="SNo" >' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCountry + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCountry" postkey="PostCountry" id="idDACountry" prevalue="' + item.PreCountry + '">' + Country + '</span>';
        strNewRow += Country + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreAllowType + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreAllowType" postkey="PostAllowType" id="idDAAllowType" prevalue="' + item.PreAllowType + '">' + AllowType + '</span>';
        strNewRow += AllowType + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idDAFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idDACurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idDAExrate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idDALCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idDACostCenterDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="displaynone">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idDACostCenter" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idDADescription" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreDays" postkey="PostDays" id="idDANoofDays" prevalue="' + item.PreDays + '">' + Days + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreDays + '</span>' + Days + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreActualDays" postkey="PostActualDays" id="idDAActualNoofDays" prevalue="' + item.PreActualDays + '">' + ActualDays + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreActualDays + '</span>' + ActualDays + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreDARate" postkey="PostDARate" id="idDADailyRate" prevalue="' + outputMoney(item.PreDARate) + '">' + DARate + '</span>';
        strNewRow += '<span class="predisplay">' + outputMoney(item.PreDARate) + '</span>' + DARate + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idDAGSTCode" prekey="GSTCode" postkey="GSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idDAGSTCodeDisplay" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idDAGSTAmt" prekey="GSTAmt" postkey="GSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreLunch" postkey="PostLunch" id="idDACLnch" prevalue="' + item.PreLunch + '">' + Lunch + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreLunch + '</span>' + Lunch + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idDATaxAmt" prekey="TaxableAmt" postkey="TaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idDAGLCode" prekey="GLCode" postkey="GLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreCity" postkey="PostCity" id="idDACity" prevalue="' + item.PreCity + '">' + City + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreCity + '</span>' + City + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreBfast" postkey="PostBfast" id="idDACBrkFast" prevalue="' + item.PreBfast + '">' + Bfast + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreBfast + '</span>' + Bfast + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreDinner" postkey="PostDinner" id="idDACDinner" prevalue="' + item.PreDinner + '">' + Dinner + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreDinner + '</span>' + Dinner + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idDAChrgToFact" prekey="ChargeToFactory" postkey="ChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idDAReceiptNo" prekey="ReceiptNo" postkey="ReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreDACountriesCities" postkey="PostDACountriesCities" id="idDACountriesCities" prevalue="' + item.PreDACountriesCities + '">' + CountriesCities + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreDACountriesCities + '</span>' + CountriesCities + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblDA.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateDA() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    $("#idDACostCenterDisplayEdit").val($("#idDACostCenterEdit").children("option").filter(":selected").text());
    $("#idDAGSTCodeDisplayEdit").val($("#idDAGSTCodeEdit").children("option").filter(":selected").text());
    if (travelStage == "pre" && submitWithZeroExpenseEntries != "No") {
        return true;
    }
    var fldID = ["idDACountryEdit", "idDACityEdit", "idDAAllowTypeEdit", "idDACBrkFastEdit", "idDACLnchEdit", "idDACDinnerEdit", "idDANoofDaysEdit", "idDAActualNoofDaysEdit", "idDADailyRateEdit", "idDAFCAmtEdit", "idDACurrencyEdit", "idDAGSTCodeEdit", "idDATaxAmtEdit", "idDACostCenterEdit", "idDAGLCodeEdit", "idDAChrgToFactEdit"];
    var fldName = ["Country", "City", "Allowance Type", "Comp. B'Fast", "Comp. Lunch", "Comp. Dinner", "No. of Days", "Actual No. Of Days", "DA Rate", "FC Amt", "Currency", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Fact"];
    var fldType = ["select", "select", "select", "text", "text", "text", "number", "number", "number", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    var noOfDays = $("#idDAActualNoofDaysEdit").val();
    noOfDays = (!!noOfDays) ? outputNumber(noOfDays) : 0;
    if ((isPreRow && travelStage == "post") || noOfDays == 0) { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
        ["idDACountryEdit", "idDACityEdit", "idDAAllowTypeEdit"].forEach(function (type) { // Fields can hole select for Pre entries in Post Travel
            var fldIdx = fldID.indexOf(type);
            if (fldIdx != -1) {
                fldID.splice(fldIdx, 1);
                fldName.splice(fldIdx, 1);
                fldType.splice(fldIdx, 1);
            }
        });
    }
    var fldModal = "DAModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    return true;
}
function formatDA(tr) {
    var fldLabel = ["S.#", "No.of Days", "VAT Code", "Country", "Actual No. Of Days", "Taxable Amt", "City", "DA Rate", "VAT Amt", "Allowance Type", "FC Amt", "Cost Center", "Comp. B'Fast", "Curr.", "GL Code", "Comp. Lunch", "Ex. Rate", "Charge To Fact.", "Comp. Dinner", "LC Amt", "Receipt #", "Description"];
    var fldID = ["idDASNo", "idDANoofDays", "idDAGSTCodeDisplay", "idDACountry", "idDAActualNoofDays", "idDATaxAmt", "idDACity", "idDADailyRate", "idDAGSTAmt", "idDAAllowType", "idDAFCAmt", "idDACostCenterDisplay", "idDACBrkFast", "idDACurrency", "idDAGLCode", "idDACLnch", "idDAExrate", "idDAChrgToFact", "idDACDinner", "idDALCAmt", "idDAReceiptNo", "idDADescription"];
    var fldClass = ["", "amount", "", "", "amount", "amount", "", "amount", "amount", "", "amount", "", "amount", "", "", "amount", "amount", "", "amount", "amount", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Daily Allownance Travel Ends
//Entertainment Expense Start
function generateENTRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblENT = null;
    if (flgIntialLoading) {
        tblENT = $('#idTblENT').DataTable();
        tblENT.clear()
        tblENT.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("ENTModal");
    $.each(objJSON, function (i, item) {
        var Category, ExpDate, FCAmt, Currency, ExRate, LCAmt, CostCenter, PersonCount, PerHeadAmt, Desc;
        Category = ExpDate = FCAmt = Currency = ExRate = LCAmt = CostCenter = PersonCount = PerHeadAmt = Desc = "";
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        if (travelStage == "pre") {
            Category = item.PreCategory;
            ExpDate = item.PreExpDate;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            PersonCount = item.PrePersonCount;
            PerHeadAmt = outputMoney(item.PrePerHeadAmt);
            Desc = item.PreDesc;
        }
        else {
            Category = item.PostCategory;
            ExpDate = item.PostExpDate;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            PersonCount = item.PostPersonCount;
            PerHeadAmt = outputMoney(item.PostPerHeadAmt);
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Entertainment</span><span class="datacol" prekey="ID" postkey="ID" id="idENTID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idENTSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCategory + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCategory" postkey="PostCategory" id="idENTCategory" prevalue="' + item.PreCategory + '">' + Category + '</span>';
        strNewRow += Category + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreExpDate" postkey="PostExpDate" id="idENTDate" prevalue="' + item.PreExpDate + '">' + ExpDate + '</span>';
        strNewRow += ExpDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idENTFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idENTCurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idENTExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idENTLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idENTCostCenterDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="displaynone">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idENTCostCenter" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idENTDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PrePersonCount" postkey="PostPersonCount" id="idENTPersonCount" prevalue="' + item.PrePersonCount + '">' + PersonCount + '</span>';
        strNewRow += '<span class="predisplay">' + item.PrePersonCount + '</span>' + PersonCount + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="Place" postkey="Place" id="idENTPlace">' + item.Place + '</span>' + item.Place + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idENTGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idENTGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idENTTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PrePerHeadAmt" postkey="PostPerHeadAmt" id="idENTPerHeadAmt" prevalue="' + outputMoney(item.PrePerHeadAmt) + '">' + PerHeadAmt + '</span>';
        strNewRow += '<span class="predisplay">' + outputMoney(item.PrePerHeadAmt) + '</span>' + PerHeadAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idENTGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idENTGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idENTChargeToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idENTReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblENT.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function setENTDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idENTIDEdit", "idENTSNoEdit", "idENTCategoryEdit", "idENTPersonCountEdit", "idENTDateEdit", "idENTPlaceEdit", "idENTFCAmtEdit", "idENTCurrencyEdit", "idENTExRateEdit", "idENTLCAmtEdit", "idENTGSTCodeEdit", "idENTTaxableAmtEdit", "idENTPerHeadAmtEdit", "idENTGSTAmtEdit", "idENTCostCenterEdit", "idENTGLCodeEdit", "idENTChargeToFactEdit", "idENTReceiptEdit", "idENTDescEdit", "idENTCostCenterDisplayEdit", "idENTGSTCodeDisplayEdit"];
    var fldID = ["idENTID", "idENTSNo", "idENTCategory", "idENTPersonCount", "idENTDate", "idENTPlace", "idENTFCAmt", "idENTCurrency", "idENTExRate", "idENTLCAmt", "idENTGSTCode", "idENTTaxableAmt", "idENTPerHeadAmt", "idENTGSTAmt", "idENTCostCenter", "idENTGLCode", "idENTChargeToFact", "idENTReceipt", "idENTDesc", "idENTCostCenterDisplay", "idENTGSTCodeDisplay"];
    var fldAccEditable = ["", "", "disabled", "readonly", "readonly", "readonly", "readonly", "disabled", "readonly", "", "", "", "readonly", "", "", "", "disabled", "", "readonly", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idENTCurrencyEdit").change();
}
function getENTDataEditModal() {
    if (!validateENT()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idENTIDEdit").val();
    rowJSON["SNo"] = $("#idENTSNoEdit").val();
    rowJSON["Purpose"] = $("#idENTDescEdit").val();
    rowJSON["Place"] = $("#idENTPlaceEdit").val();
    rowJSON["GSTCode"] = $("#idENTGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idENTGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idENTTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idENTGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idENTGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idENTChargeToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idENTReceiptEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreCategory"] = $("#idENTCategoryEdit").val();
        rowJSON["PreExpDate"] = $("#idENTDateEdit").val();
        rowJSON["PreCurrency"] = $("#idENTCurrencyEdit").val();
        rowJSON["PreFCAmt"] = $("#idENTFCAmtEdit").val();
        rowJSON["PrePersonCount"] = $("#idENTPersonCountEdit").val();
        rowJSON["PreExRate"] = $("#idENTExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idENTLCAmtEdit").val();
        rowJSON["PrePerHeadAmt"] = $("#idENTPerHeadAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idENTCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idENTCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idENTDescEdit").val();
    } else {
        rowJSON["PreCategory"] = ($("#idENTCategoryEdit").attr("prevalue")) == undefined || ($("#idENTCategoryEdit").attr("prevalue")) == "" ? "NA" : $("#idENTCategoryEdit").attr("prevalue");
        rowJSON["PostCategory"] = $("#idENTCategoryEdit").val();
        rowJSON["PreExpDate"] = ($("#idENTDateEdit").attr("prevalue")) == undefined || ($("#idENTDateEdit").attr("prevalue")) == "" ? "NA" : $("#idENTDateEdit").attr("prevalue");
        rowJSON["PostExpDate"] = $("#idENTDateEdit").val();
        rowJSON["PreCurrency"] = ($("#idENTCurrencyEdit").attr("prevalue")) == undefined || ($("#idENTCurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idENTCurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idENTCurrencyEdit").val();
        rowJSON["PreFCAmt"] = ($("#idENTFCAmtEdit").attr("prevalue")) == undefined || ($("#idENTFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idENTFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idENTFCAmtEdit").val();
        rowJSON["PrePersonCount"] = ($("#idENTPersonCountEdit").attr("prevalue")) == undefined || ($("#idENTPersonCountEdit").attr("prevalue")) == "" ? "NA" : $("#idENTPersonCountEdit").attr("prevalue");
        rowJSON["PostPersonCount"] = $("#idENTPersonCountEdit").val();
        rowJSON["PreExRate"] = ($("#idENTExRateEdit").attr("prevalue")) == undefined || ($("#idENTExRateEdit").attr("prevalue")) == "" ? "0" : $("#idENTExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idENTExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idENTLCAmtEdit").attr("prevalue")) == undefined || ($("#idENTLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idENTLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idENTLCAmtEdit").val();
        rowJSON["PrePerHeadAmt"] = ($("#idENTPerHeadAmtEdit").attr("prevalue")) == undefined || ($("#idENTPerHeadAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idENTPerHeadAmtEdit").attr("prevalue");
        rowJSON["PostPerHeadAmt"] = $("#idENTPerHeadAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idENTCostCenterEdit").attr("prevalue")) == undefined || ($("#idENTCostCenterEdit").attr("prevalue")) == "" ? "NA" : $("#idENTCostCenterEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idENTCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idENTCostCenterDisplayEdit").attr("prevalue")) == undefined || ($("#idENTCostCenterDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idENTCostCenterDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idENTCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idENTDescEdit").attr("prevalue")) == undefined || ($("#idENTDescEdit").attr("prevalue")) == "" ? "NA" : $("#idENTDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idENTDescEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateENTRow(strJSON, false);
}
function validateENT() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idENTCategoryEdit", "idENTPersonCountEdit", "idENTDateEdit", "idENTPlaceEdit", "idENTFCAmtEdit", "idENTCurrencyEdit", "idENTGSTCodeEdit", "idENTTaxableAmtEdit", "idENTPerHeadAmtEdit", "idENTCostCenterEdit", "idENTGLCodeEdit", "idENTChargeToFactEdit"];
    var fldName = ["Category", "Person Count", "Date", "Place", "FC Amt", "Currency", "VAT Code", "Taxable Amount", "Per Head Amt", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["select", "text", "text", "text", "number", "select", "select", "number", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "ENTModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idENTCostCenterDisplayEdit").val($("#idENTCostCenterEdit ").children("option").filter(":selected").text());
    $("#idENTGSTCodeDisplayEdit").val($("#idENTGSTCodeEdit ").children("option").filter(":selected").text());
    return true;
}
function formatENT(tr) {
    var fldLabel = ["S.#", "Ex. Rate", "GL Code", "Category", "LC Amt", "Charge To Fact.", "Person Count", "VAT Code", "Receipt #", "Date", "Taxable Amt", "", "Place", "Per Head Amt", "", "FC Amt", "VAT Amt", "", "Curr.", "Cost Center", "", "Description"];
    var fldID = ["idENTSNo", "idENTExRate", "idENTGLCode", "idENTCategory", "idENTLCAmt", "idENTChargeToFact", "idENTPersonCount", "idENTGSTCodeDisplay", "idENTReceipt", "idENTDate", "idENTTaxableAmt", "", "idENTPlace", "idENTPerHeadAmt", "", "idENTFCAmt", "idENTGSTAmt", "", "idENTCurrency", "idENTCostCenterDisplay", "", "idENTDesc"];
    var fldClass = ["", "amount", "", "", "amount", "", "", "", "", "", "amount", "", "", "amount", "", "amount", "amount", "", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Entertainment Expense End
//Entertainment Details Start
function generateENTDRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblENTD = null;
    if (flgIntialLoading) {
        tblENTD = $('#idTblENTD').DataTable();
        tblENTD.clear()
        tblENTD.draw();
    }
    var strNewRow = "";
    var strActBtns = "";
    $.each(objJSON, function (i, item) {
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">EntertainmentDetails</span><span class="datacol" id="idENTDID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idENTDSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Attendant" postkey="Attendant" id="idENTDAttendant">' + item.Attendant + '</span>' + item.Attendant + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="CompName" postkey="CompName" id="idENTDCompName">' + item.CompName + '</span>' + item.CompName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Title" postkey="Title" id="idENTDTitle">' + item.Title + '</span>' + item.Title + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="CustName" postkey="CustName" id="idENTDCustName">' + item.CustName + '</span>' + item.CustName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Desc" postkey="Desc" id="idENTDDesc">' + item.Desc + '</span>' + item.Desc + '</td>';
        if (IsApplicantLevel == "true") {
            strActBtns = '<td class="center padding0" nowrap>';
            strActBtns += '<div class="center-btn">';
            strActBtns += '<button class="editrow" modalid="ENTDModal"><i class="fa fa-pencil text-blue"></i></button>';
            strActBtns += '<button class="deleterow" modalid="ENTDModal"><i class="fa fa-trash text-red"></i></button>';
            strActBtns += '<button class="undodel" style="display:none;" modalid="ENTDModal"><i class="fa fa-undo text-orange"></i></button>';
            strActBtns += '</div></td>';
        }
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblENTD.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getENTDDataEditModal() {
    if (!validateENTD()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idENTDIDEdit").val();
    rowJSON["SNo"] = $("#idENTDSNoEdit").val();
    rowJSON["Attendant"] = $("#idENTDAttendantEdit").val();
    rowJSON["CompName"] = $("#idENTDCompNameEdit").val();
    rowJSON["Title"] = $("#idENTDTitleEdit").val();
    rowJSON["CustName"] = $("#idENTDCustNameEdit").val();
    rowJSON["Desc"] = $("#idENTDDescEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateENTDRow(strJSON, false);
}
function setENTDDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idENTDIDEdit", "idENTDSNoEdit", "idENTDAttendantEdit", "idENTDCompNameEdit", "idENTDTitleEdit", "idENTDCustNameEdit", "idENTDDescEdit"]
    var fldID = ["idENTDID", "idENTDSNo", "idENTDAttendant", "idENTDCompName", "idENTDTitle", "idENTDCustName", "idENTDDesc"]
    var fldAccEditable = ["", "", "readonly", "readonly", "readonly", "readonly", "readonly"]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
}
function formatENTD(tr) {
    var fldLabel = ["S.#", "Company Name", "Customer Name", "Attendant", "Title", "", "Description"];
    var fldID = ["idENTDSNo", "idENTDCompName", "idENTDCustName", "idENTDAttendant", "idENTDTitle", "", "idENTDDesc"];
    var fldClass = ["", "", "", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
function validateENTD() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idENTDAttendantEdit", "idENTDCompNameEdit", "idENTDTitleEdit", "idENTDCustNameEdit"];
    var fldName = ["Attendant", "Company Name", "Title", "Customer Name"];
    var fldType = ["text", "text", "text", "text"];
    var fldModal = "ENTDModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    return true;
}
//Entertainment Details End
//Passport Claim Start
function generatePASRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblPAS = null;
    if (flgIntialLoading) {
        tblPAS = $('#idTblPAS').DataTable();
        tblPAS.clear()
        tblPAS.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("PASModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Passport</span><span class="datacol" id="idPASID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idPASSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostExpTypes" postkey="PostExpTypes" id="idPASExpTypes">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PostFCAmt" postkey="PostFCAmt" id="idPASFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCurrency" postkey="PostCurrency" id="idPASCurrency">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PostExRate" postkey="PostExRate" id="idPASExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt" id="idPASLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PostCostCenter" postkey="PostCostCenter" id="idPASCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay" id="idPASCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostDesc" postkey="PostDesc" id="idPASDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idPASGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idPASTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idPASGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idPASGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idPASChargeToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idPASReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblPAS.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getPASDataEditModal() {
    if (!validatePAS()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idPASIDEdit").val();
    rowJSON["SNo"] = $("#idPASSNoEdit").val();
    rowJSON["PostExpTypes"] = $("#idPASExpTypesEdit").val();
    rowJSON["PostFCAmt"] = $("#idPASFCAmtEdit").val();
    rowJSON["PostCurrency"] = $("#idPASCurrencyEdit").val();
    rowJSON["PostExRate"] = $("#idPASExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idPASLCAmtEdit").val();
    rowJSON["GSTCode"] = $("#idPASGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idPASGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idPASTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idPASGSTAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idPASCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idPASCostCenterDisplayEdit").val();
    rowJSON["GLCode"] = $("#idPASGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idPASChargeToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idPASReceiptEdit").val();
    rowJSON["PostDesc"] = $("#idPASDescEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generatePASRow(strJSON, false);
}
function validatePAS() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idPASExpTypesEdit", "idPASFCAmtEdit", "idPASCurrencyEdit", "idPASGSTCodeEdit", "idPASTaxableAmtEdit", "idPASCostCenterEdit", "idPASGLCodeEdit", "idPASChargeToFactEdit"];
    var fldName = ["Expense Types", "FC Amt", "Currency", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Fact"];
    var fldType = ["select", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "PASModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idPASCostCenterDisplayEdit").val($("#idPASCostCenterEdit").children("option").filter(":selected").text());
    $("#idPASGSTCodeDisplayEdit").val($("#idPASGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function setPASDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idPASIDEdit", "idPASSNoEdit", "idPASExpTypesEdit", "idPASFCAmtEdit", "idPASCurrencyEdit", "idPASExRateEdit", "idPASLCAmtEdit", "idPASGSTCodeEdit", "idPASTaxableAmtEdit", "idPASGSTAmtEdit", "idPASCostCenterEdit", "idPASGLCodeEdit", "idPASChargeToFactEdit", "idPASReceiptEdit", "idPASDescEdit", "idPASCostCenterDisplayEdit", "idPASGSTCodeDisplayEdit"]
    var fldID = ["idPASID", "idPASSNo", "idPASExpTypes", "idPASFCAmt", "idPASCurrency", "idPASExRate", "idPASLCAmt", "idPASGSTCode", "idPASTaxableAmt", "idPASGSTAmt", "idPASCostCenter", "idPASGLCode", "idPASChargeToFact", "idPASReceipt", "idPASDesc", "idPASCostCenterDisplay", "idPASGSTCodeDisplay"]
    var fldAccEditable = ["", "", "disabled", "readonly", "disabled", "readonly", "", "", "", "", "", "", "disabled", "", "readonly", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idPASCurrencyEdit").change();
}
function formatPAS(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Expense Type", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Ex. Rate", "Cost Center", "", "Description"];
    var fldID = ["idPASSNo", "idPASLCAmt", "idPASGLCode", "idPASExpTypes", "idPASGSTCodeDisplay", "idPASChargeToFact", "idPASFCAmt", "idPASTaxableAmt", "idPASReceipt", "idPASCurrency", "idPASGSTAmt", "", "idPASExRate", "idPASCostCenterDisplay", "", "idPASDesc"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Passport Claim End
//Preparation Claim Start
function generatePRPRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblPRP = null;
    if (flgIntialLoading) {
        tblPRP = $('#idTblPRP').DataTable();
        tblPRP.clear()
        tblPRP.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("PRPModal");
    $.each(objJSON, function (i, item) {
        var ExpTypes, FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, DescDisp, PreDesc;
        ExpTypes = FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = DescDisp = PreDesc = "";
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var LastClaimAmt = outputMoney(item.LastClaimAmt);
        if (travelStage == "pre") {
            ExpTypes = item.PreExpTypes;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
        }
        else {
            ExpTypes = item.PostExpTypes;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Preparation</span><span class="datacol" id="idPRPID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idPRPSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreExpTypes" postkey="PostExpTypes" id="idPRPExpTypes" prevalue="' + item.PreExpTypes + '">' + ExpTypes + '</span>';
        strNewRow += ExpTypes + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idPRPFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idPRPCurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idPRPExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idPRPLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idPRPCostCenter" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idPRPCostCenterDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>' + Desc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idPRPDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="LastClaimDate" postkey="LastClaimDate" id="idPRPLastClaimDt">' + item.LastClaimDate + '</span>' + item.LastClaimDate + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="LastClaimAmt" postkey="LastClaimAmt" id="idPRPLastClaimAmt">' + LastClaimAmt + '</span>' + LastClaimAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idPRPGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idPRPGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idPRPTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idPRPGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idPRPGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idPRPChargeToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idPRPReceipt">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblPRP.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getPRPDataEditModal() {
    if (!validatePRP()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idPRPIDEdit").val();
    rowJSON["SNo"] = $("#idPRPSNoEdit").val();
    rowJSON["LastClaimDate"] = $("#idPRPLastClaimDtEdit").val();
    rowJSON["LastClaimAmt"] = $("#idPRPLastClaimAmtEdit").val();
    rowJSON["GSTCode"] = $("#idPRPGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idPRPGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idPRPTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idPRPGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idPRPGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idPRPChargeToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idPRPReceiptEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreExpTypes"] = $("#idPRPExpTypesEdit").val();
        rowJSON["PreFCAmt"] = $("#idPRPFCAmtEdit").val();
        rowJSON["PreCurrency"] = $("#idPRPCurrencyEdit").val();
        rowJSON["PreExRate"] = $("#idPRPExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idPRPLCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idPRPCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idPRPCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idPRPDescEdit").val();
    }
    else {
        rowJSON["PreExpTypes"] = ($("#idPRPExpTypesEdit").attr("prevalue")) == undefined || ($("#idPRPExpTypesEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPExpTypesEdit").attr("prevalue");
        rowJSON["PostExpTypes"] = $("#idPRPExpTypesEdit").val();
        rowJSON["PreFCAmt"] = ($("#idPRPFCAmtEdit").attr("prevalue")) == undefined || ($("#idPRPFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idPRPFCAmtEdit").val();
        rowJSON["PreCurrency"] = ($("#idPRPCurrencyEdit").attr("prevalue")) == undefined || ($("#idPRPCurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPCurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idPRPCurrencyEdit").val();
        rowJSON["PreExRate"] = ($("#idPRPExRateEdit").attr("prevalue")) == undefined || ($("#idPRPExRateEdit").attr("prevalue")) == "" ? "0" : $("#idPRPExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idPRPExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idPRPLCAmtEdit").attr("prevalue")) == undefined || ($("#idPRPLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idPRPLCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idPRPCostCenterEdit").attr("prevalue")) == undefined || ($("#idPRPCostCenterEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPCostCenterEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idPRPCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idPRPCostCenterDisplayEdit").attr("prevalue")) == undefined || ($("#idPRPCostCenterDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPCostCenterDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idPRPCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idPRPDescEdit").attr("prevalue")) == undefined || ($("#idPRPDescEdit").attr("prevalue")) == "" ? "NA" : $("#idPRPDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idPRPDescEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generatePRPRow(strJSON, false);
}
function validatePRP() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idPRPExpTypesEdit", "idPRPFCAmtEdit", "idPRPCurrencyEdit", "idPRPGSTCodeEdit", "idPRPTaxableAmtEdit", "idPRPCostCenterEdit", "idPRPGLCodeEdit", "idPRPChargeToFactEdit"];
    var fldName = ["Expense Types", "FC Amt", "Currency", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Fact"];
    var fldType = ["select", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "PRPModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (!prepAllowance("modal")) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idPRPCostCenterDisplayEdit").val($("#idPRPCostCenterEdit").children("option").filter(":selected").text());
    $("#idPRPGSTCodeDisplayEdit").val($("#idPRPGSTCodeEdit").children("option").filter(":selected").text());

    return true;
}
function setPRPDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idPRPIDEdit", "idPRPSNoEdit", "idPRPExpTypesEdit", "idPRPLastClaimDtEdit", "idPRPLastClaimAmtEdit", "idPRPFCAmtEdit", "idPRPCurrencyEdit", "idPRPExRateEdit", "idPRPLCAmtEdit", "idPRPGSTCodeEdit", "idPRPTaxableAmtEdit", "idPRPGSTAmtEdit", "idPRPCostCenterEdit", "idPRPGLCodeEdit", "idPRPChargeToFactEdit", "idPRPReceiptEdit", "idPRPDescEdit", "idPRPCostCenterDisplayEdit", "idPRPGSTCodeDisplayEdit"]
    var fldID = ["idPRPID", "idPRPSNo", "idPRPExpTypes", "idPRPLastClaimDt", "idPRPLastClaimAmt", "idPRPFCAmt", "idPRPCurrency", "idPRPExRate", "idPRPLCAmt", "idPRPGSTCode", "idPRPTaxableAmt", "idPRPGSTAmt", "idPRPCostCenter", "idPRPGLCode", "idPRPChargeToFact", "idPRPReceipt", "idPRPDesc", "idPRPCostCenterDisplay", "idPRPGSTCodeDisplay"]
    var fldAccEditable = ["", "", "disabled", "readonly", "", "readonly", "disabled", "readonly", "", "", "", "", "", "", "readonly", "", "readonly", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idPRPCurrencyEdit").change();
}
function formatPRP(tr) {
    var fldLabel = ["S.#", "Curr.", "VAT Amt", "Expense Type", "Ex. Rate", "Cost Center", "Last Claim Date", "LC Amt", "GL Code", "Last Claim Amt", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Description"];
    var fldID = ["idPRPSNo", "idPRPCurrency", "idPRPGSTAmt", "idPRPExpTypes", "idPRPExRate", "idPRPCostCenterDisplay", "idPRPLastClaimDt", "idPRPLCAmt", "idPRPGLCode", "idPRPLastClaimAmt", "idPRPGSTCodeDisplay", "idPRPChargeToFact", "idPRPFCAmt", "idPRPTaxableAmt", "idPRPReceipt", "idPRPDesc"];
    var fldClass = ["", "", "amount", "", "amount", "", "", "amount", "", "amount", "", "", "amount", "amount", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Preparation Claim End
//Transportation Start
function setTSPDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idTSPIDEdit", "idTSPSnoEdit", "idTSPExpTypesEdit", "idTSPDateEdit", "idTSPModeEdit", "idTSPFromEdit", "idTSPToEdit", "idTSPFCAmtEdit", "idTSPCurrencyEdit", "idTSPExchRateEdit", "idTSPLCAmtEdit", "idTSPGSTCodeEdit", "idTSPTaxableAmtEdit", "idTSPGSTAmtEdit", "idTSPCostCenterEdit", "idTSPGlCodeEdit", "idTSPChargeToFactEdit", "idTSPReceiptcheckEdit", "idTSPReceiptDateEdit", "idTSPDescriptionEdit", "idTSPCostCenterDisplayEdit", "idTSPGSTCodeDisplayEdit"];
    var fldID = ["idTSPID", "idTSPSno", "idTSPExpenseTypes", "idTSPDate", "idTSPMode", "idTSPFrom", "idTSPTo", "idTSPFCAmt", "idTSPCurrency", "idTSPExchRate", "idTSPLCAmt", "idTSPGSTCode", "idTSPTaxableAmt", "idTSPGSTAmt", "idTSPCostCenter", "idTSPGlCode", "idTSPChargeToFactory", "idTSPReceiptcheck", "idTSPReceiptDate", "idTSPDescription", "idTSPCostCenterDisplay", "idTSPGSTCodeDisplay"];
    var fldAccEditable = ["", "", "disabled", "readonly", "disabled", "readonly", "readonly", "readonly", "disabled", "readonly", "", "", "", "", "", "", "disabled", "", , "readonly", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idTSPCurrencyEdit").change();
}
function getTSPDataEditModal() {
    if (!validateTSP()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idTSPIDEdit").val();
    rowJSON["SNo"] = $("#idTSPSnoEdit").val();
    rowJSON["PostExRate"] = $("#idTSPExchRateEdit").val();
    rowJSON["PostReceipt"] = $("#idTSPReceiptcheckEdit").val();
    rowJSON["PostReceiptDate"] = $("#idTSPReceiptDateEdit").val();
    rowJSON["PostExpTypes"] = $("#idTSPExpTypesEdit").val();
    rowJSON["PostLCAmt"] = $("#idTSPLCAmtEdit").val();
    rowJSON["ReceiptNo"] = $("#idTSPReceiptEdit").val();
    rowJSON["PostExpDate"] = $("#idTSPDateEdit").val();
    rowJSON["GSTCode"] = $("#idTSPGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idTSPGSTCodeDisplayEdit").val();
    rowJSON["Mode"] = $("#idTSPModeEdit").val();
    rowJSON["TaxableAmt"] = $("#idTSPTaxableAmtEdit").val();
    rowJSON["From"] = $("#idTSPFromEdit").val();
    rowJSON["GSTAmt"] = $("#idTSPGSTAmtEdit").val();
    rowJSON["To"] = $("#idTSPToEdit").val();
    rowJSON["PostCostCenter"] = $("#idTSPCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idTSPCostCenterDisplayEdit").val();
    rowJSON["PostFCAmt"] = $("#idTSPFCAmtEdit").val();
    rowJSON["GLCode"] = $("#idTSPGlCodeEdit").val();
    rowJSON["PostCurrency"] = $("#idTSPCurrencyEdit").val();
    rowJSON["ChargeToFactory"] = $("#idTSPChargeToFactEdit").val();
    rowJSON["PostDesc"] = $("#idTSPDescriptionEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateTSPRow(strJSON, false);
}
function generateTSPRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblTSP = null;
    if (flgIntialLoading) {
        tblTSP = $('#idTblTSP').DataTable();
        tblTSP.clear()
        tblTSP.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("TSPModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Transportation</span><span class="datacol" id="idTSPID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPSno" prekey="SNo" postkey="SNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPExpenseTypes" prekey="PostExpTypes" postkey="PostExpTypes">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPDate" prekey="PostExpDate" postkey="PostExpDate">' + item.PostExpDate + '</span>' + item.PostExpDate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" id="idTSPFCAmt" prekey="PostFCAmt" postkey="PostFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPCurrency" prekey="PostCurrency" postkey="PostCurrency">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" id="idTSPExchRate" prekey="PostExRate" postkey="PostExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" id="idTSPLCAmt" prekey="PostLCAmt" postkey="PostLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" id="idTSPCostCenter" prekey="PostCostCenter" postkey="PostCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPCostCenterDisplay" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTSPDescription" prekey="PostDesc" postkey="PostDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPMode" prekey="Mode" postkey="Mode">' + item.Mode + '</span>' + item.Mode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPFrom" prekey="From" postkey="From">' + item.From + '</span>' + item.From + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPTo" prekey="To" postkey="To">' + item.To + '</span>' + item.To + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPGSTCode" prekey="GSTCode" postkey="GSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPGSTCodeDisplay" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idTSPTaxableAmt" prekey="TaxableAmt" postkey="TaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idTSPGSTAmt" prekey="GSTAmt" postkey="GSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPGlCode" prekey="GLCode" postkey="GLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPChargeToFactory" prekey="ChargeToFactory" postkey="ChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPReceiptcheck" prekey="PostReceipt" postkey="PostReceipt">' + item.PostReceipt + '</span>' + item.PostReceipt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPReceiptDate" prekey="PostReceiptDate" postkey="PostReceiptDate">' + item.PostReceiptDate + '</span>' + item.PostReceiptDate + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTSPReceipt" prekey="ReceiptNo" postkey="ReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblTSP.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateTSP() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idTSPExpTypesEdit", "idTSPDateEdit", "idTSPModeEdit", "idTSPFromEdit", "idTSPToEdit", "idTSPFCAmtEdit", "idTSPCurrencyEdit", "idTSPExchRateEdit", "idTSPLCAmtEdit", "idTSPGSTCodeEdit", "idTSPTaxableAmtEdit", "idTSPCostCenterEdit", "idTSPGlCodeEdit", "idTSPChargeToFactEdit", "idTSPReceiptcheckEdit"];
    var fldName = ["Expense Type", "Date", "Mode", "From", "To", "FC Amt", "Currency", "Exch. Rate", "LC Amt", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Factory", "Receipt"];
    var fldType = ["select", "text", "select", "text", "text", "number", "select", "number", "number", "select", "number", "select", "text", "select", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "TSPModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idTSPCostCenterDisplayEdit").val($("#idTSPCostCenterEdit").children("option").filter(":selected").text());
    $("#idTSPGSTCodeDisplayEdit").val($("#idTSPGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatTSP(tr) {
    var fldLabel = ["S.#", "Exch. Rate", "Receipt Check?", "Expense Type", "LC Amt", "Receipt Date", "Date", "VAT Code", "Receipt #", "Mode", "Taxable Amt", "", "From", "VAT Amt", "", "To", "Cost Center", "", "FC Amt", "GL Code", "", "Curr.", "Charge To Fact.", "", "Description"];
    var fldID = ["idTSPSno", "idTSPExchRate", "idTSPReceiptcheck", "idTSPExpenseTypes", "idTSPLCAmt", "idTSPReceiptDate", "idTSPDate", "idTSPGSTCodeDisplay", "idTSPReceipt", "idTSPMode", "idTSPTaxableAmt", "", "idTSPFrom", "idTSPGSTAmt", "", "idTSPTo", "idTSPCostCenterDisplay", "", "idTSPFCAmt", "idTSPGlCode", "", "idTSPCurrency", "idTSPChargeToFactory", "", "idTSPDescription"];
    var fldClass = ["", "amount", "", "", "amount", "", "", "", "amount", "", "amount", "", "", "amount", "", "", "", "", "amount", "", "", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Transportation End		  
//Compensation Allownace starts    
function setCADataEditModal() {
    var tr = objSelectedRow;
    var fldEditID = ["idCAIDEdit", "idCASnoEdit", "idCADltsEdit", "idCAFDateEdit", "idCAFTmeEdit", "idCAToDteEdit", "idCAToTmeEdit", "idCADysEdit", "idCAMaxAllEdit", "idCAFCAmtEdit", "idCACrrEdit", "idCAExchEdit", "idCALCAmtEdit", "idCAGSTCodeEdit", "idCATaxableEdit", "idCAGSTAmtEdit", "idCACstCEdit", "idCAGLCdeEdit", "idCACToFactEdit", "idCAReceiptEdit", "idCADescriptionEdit", "idCACstCDisplayEdit", "idCAGSTCodeDisplayEdit"]
    var fldID = ["idCAID", "idCASno", "idCADlts", "idCAFDate", "idCAFTme", "idCAToDte", "idCAToTme", "idCADys", "idCAMaxAll", "idCAFCAmt", "idCACrr", "idCAExch", "idCALCAmt", "idCAGSTCode", "idCATaxable", "idCAGSTAmt", "idCACstC", "idCAGLCde", "idCACToFact", "idCAReceipt", "idCADescription", "idCACstCDisplay", "idCAGSTCodeDisplay"]
    var fldAccEditable = ["", "", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "readonly", "disabled", "readonly", "", "", "", "", "", "", "disabled", "", "readonly", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idCACrrEdit").change();
}
function getCADataEditModal() {
    if (!validateCA()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idCAIDEdit").val();
    rowJSON["SNo"] = $("#idCASnoEdit").val();
    rowJSON["PostDetails"] = $("#idCADltsEdit").val();
    rowJSON["FromDate"] = $("#idCAFDateEdit").val();
    rowJSON["FromTime"] = $("#idCAFTmeEdit").val();
    rowJSON["ToDate"] = $("#idCAToDteEdit").val();
    rowJSON["ToTime"] = $("#idCAToTmeEdit").val();
    rowJSON["PostDays"] = $("#idCADysEdit").val();
    rowJSON["MaxAllowAll"] = $("#idCAMaxAllEdit").val();
    rowJSON["PostFCAmt"] = $("#idCAFCAmtEdit").val();
    rowJSON["PostCurrency"] = $("#idCACrrEdit").val();
    rowJSON["PostExRate"] = $("#idCAExchEdit").val();
    rowJSON["PostLCAmt"] = $("#idCALCAmtEdit").val();
    rowJSON["GSTCode"] = $("#idCAGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idCAGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idCATaxableEdit").val();
    rowJSON["GSTAmt"] = $("#idCAGSTAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idCACstCEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idCACstCDisplayEdit").val();
    rowJSON["GLCode"] = $("#idCAGLCdeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idCACToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idCAReceiptEdit").val();
    rowJSON["PostDesc"] = $("#idCADescriptionEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateCARow(strJSON, false);
}
function generateCARow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblCA = null;
    if (flgIntialLoading) {
        tblCA = $('#idTblCA').DataTable();
        tblCA.clear()
        tblCA.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("CAModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Compensation</span><span class="datacol" id="idCAID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCASno" prekey="SNo" postkey="SNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCAFDate" prekey="FromDate" postkey="FromDate">' + item.FromDate + '</span>' + item.FromDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCAToDte" prekey="ToDate" postkey="ToDate">' + item.ToDate + '</span>' + item.ToDate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" id="idCAFCAmt" prekey="PostFCAmt" postkey="PostFCAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCACrr" prekey="PostCurrency" postkey="PostCurrency">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" id="idCAExch" prekey="PostExRate" postkey="PostExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" id="idCALCAmt" prekey="PostLCAmt" postkey="PostLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" id="idCACstC" prekey="PostCostCenter" postkey="PostCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCACstCDisplay" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idCADescription" prekey="PostDesc" postkey="PostDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCADlts" prekey="PostDetails" postkey="PostDetails">' + item.PostDetails + '</span>' + item.PostDetails + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAFTme" prekey="FromTime" postkey="FromTime">' + item.FromTime + '</span>' + item.FromTime + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAToTme" prekey="ToTime" postkey="ToTime">' + item.ToTime + '</span>' + item.ToTime + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCADys" prekey="PostDays" postkey="PostDays">' + item.PostDays + '</span>' + item.PostDays + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAMaxAll" prekey="MaxAllowAll" postkey="MaxAllowAll">' + item.MaxAllowAll + '</span>' + item.MaxAllowAll + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAGSTCode" prekey="GSTCode" postkey="GSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAGSTCodeDisplay" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idCATaxable" prekey="TaxableAmt" postkey="TaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idCAGSTAmt" prekey="GSTAmt" postkey="GSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAGLCde" prekey="GLCode" postkey="GLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCACToFact" prekey="ChargeToFactory" postkey="ChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idCAReceipt" prekey="ReceiptNo" postkey="ReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblCA.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateCA() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idCADltsEdit", "idCAFDateEdit", "idCAFTmeEdit", "idCAToDteEdit", "idCAToTmeEdit", "idCADysEdit", "idCAMaxAllEdit", "idCAFCAmtEdit", "idCACrrEdit", "idCAExchEdit", "idCALCAmtEdit", "idCAGSTCodeEdit", "idCATaxableEdit", "idCACstCEdit", "idCAGLCdeEdit", "idCACToFactEdit"];
    var fldName = ["Details", "From Date", "From Time", "To Date", "To Time", "Days", "Max. Allowable Allowance", "FC Amt", "Currency", "Exchange. Rate", "LC Amt", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["text", "text", "text", "text", "text", "number", "number", "number", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "CAModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idCACstCDisplayEdit").val($("#idCACstCEdit ").children("option").filter(":selected").text());
    $("#idCAGSTCodeDisplayEdit").val($("#idCAGSTCodeEdit ").children("option").filter(":selected").text());
    return true;
}
function formatCA(tr) {
    var fldLabel = ["S.#", "Max. Allowable Allowance", "VAT Amt", "Details", "FC Amt", "Cost Center", "From Date", "Curr.", "GL Code", "From Time", "Exch. Rate", "Charge To Fact.", "To Date", "LC Amt", "Receipt #", "To Time", "VAT Code", "", "Days", "Taxable Amt", "", "Description"];
    var fldID = ["idCASno", "idCAMaxAll", "idCAGSTAmt", "idCADlts", "idCAFCAmt", "idCACstCDisplay", "idCAFDate", "idCACrr", "idCAGLCde", "idCAFTme", "idCAExch", "idCACToFact", "idCAToDte", "idCALCAmt", "idCAReceipt", "idCAToTme", "idCAGSTCodeDisplay", "", "idCADys", "idCATaxable", "", "idCADescription"];
    var fldWidth = ["15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15", "15"];
    var fldClass = ["", "", "amount", "", "amount", "", "", "", "", "", "amount", "", "", "amount", "", "", "", "", "", "amount", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Compensation Allownace  Ends
//Trainers Cost  starts
function setTRNCDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idTRNCIDEdit", "idTRNCSNoEdit", "idTRNCDltsEdit", "idTRNCFCAmtEdit", "idTRNCCurcyEdit", "idTRNCExrteEdit", "idTRNCLCAmtEdit", "idTRNCGSTCodeEdit", "idTRNCTxblAmtEdit", "idTRNCGSTAmtEdit", "idTRNCCstCEdit", "idTRNCGlCodeEdit", "idTRNCCtFctyEdit", "idTRNCReceiptEdit", "idTRNCDescEdit", "idTRNCCstCDisplayEdit", "idTRNCGSTCodeDisplayEdit"]
    var fldID = ["idTRNCID", "idTRNCSNo", "idTRNCDlts", "idTRNCFCAmt", "idTRNCCurcy", "idTRNCExrte", "idTRNCLCAmt", "idTRNCGSTCode", "idTRNCTxblAmt", "idTRNCGSTAmt", "idTRNCCstC", "idTRNCGlCode", "idTRNCCtFcty", "idTRNCReceipt", "idTRNCDesc", "idTRNCCstCDisplay", "idTRNCGSTCodeDisplay"]
    var fldAccEditable = ["", "", "readonly", "readonly", "disabled", "readonly", "", "", "", "", "", "", "disabled", "", "readonly", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idTRNCCurcyEdit").change();
}
function getTRNCDataEditModal() {
    if (!validateTRNC()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idTRNCIDEdit").val();
    rowJSON["SNo"] = $("#idTRNCSNoEdit").val();
    rowJSON["GSTAmt"] = $("#idTRNCGSTAmtEdit").val();
    rowJSON["ReceiptNo"] = $("#idTRNCReceiptEdit").val();
    rowJSON["TaxableAmt"] = $("#idTRNCTxblAmtEdit").val();
    rowJSON["GSTCode"] = $("#idTRNCGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idTRNCGSTCodeDisplayEdit").val();
    rowJSON["ChargeToFactory"] = $("#idTRNCCtFctyEdit").val();
    rowJSON["GLCode"] = $("#idTRNCGlCodeEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreFCAmt"] = $("#idTRNCFCAmtEdit").val();
        rowJSON["PreCurrency"] = $("#idTRNCCurcyEdit").val();
        rowJSON["PreExRate"] = $("#idTRNCExrteEdit").val();
        rowJSON["PreLCAmt"] = $("#idTRNCLCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idTRNCCstCEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idTRNCCstCDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idTRNCDescEdit").val();
        rowJSON["PreDetails"] = $("#idTRNCDltsEdit").val();
    }
    else {
        rowJSON["PreFCAmt"] = ($("#idTRNCFCAmtEdit").attr("prevalue")) == undefined || ($("#idTRNCFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idTRNCFCAmtEdit").val();
        rowJSON["PreCurrency"] = ($("#idTRNCCurcyEdit").attr("prevalue")) == undefined || ($("#idTRNCCurcyEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCCurcyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idTRNCCurcyEdit").val();
        rowJSON["PreExRate"] = ($("#idTRNCExrteEdit").attr("prevalue")) == undefined || ($("#idTRNCExrteEdit").attr("prevalue")) == "" ? "0" : $("#idTRNCExrteEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idTRNCExrteEdit").val();
        rowJSON["PreLCAmt"] = ($("#idTRNCLCAmtEdit").attr("prevalue")) == undefined || ($("#idTRNCLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idTRNCLCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idTRNCCstCEdit").attr("prevalue")) == undefined || ($("#idTRNCCstCEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCCstCEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idTRNCCstCEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idTRNCCstCDisplayEdit").attr("prevalue")) == undefined || ($("#idTRNCCstCDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCCstCDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idTRNCCstCDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idTRNCDescEdit").attr("prevalue")) == undefined || ($("#idTRNCDescEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idTRNCDescEdit").val();
        rowJSON["PreDetails"] = ($("#idTRNCDltsEdit").attr("prevalue")) == undefined || ($("#idTRNCDltsEdit").attr("prevalue")) == "" ? "NA" : $("#idTRNCDltsEdit").attr("prevalue");
        rowJSON["PostDetails"] = $("#idTRNCDltsEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateTRNCRow(strJSON, false);
}
function generateTRNCRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblTRNC = null;
    if (flgIntialLoading) {
        tblTRNC = $('#idTblTRNC').DataTable();
        tblTRNC.clear()
        tblTRNC.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("TRNCModal");
    $.each(objJSON, function (i, item) {
        var FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, DescDisp, PreDesc;
        FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = DescDisp = PreDesc = "";
        if (travelStage == "pre") {
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
            Details = item.PreDetails;
        }
        else {
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
            Details = item.PostDetails;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">TrainersCost</span><span class="datacol" id="idTRNCID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" id="idTRNCSNo" prekey="SNo" postkey="SNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDetails + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDetails" postkey="PostDetails" id="idTRNCDlts" prevalue="' + item.PreDetails + '">' + Details + '</span>';
        strNewRow += Details + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idTRNCFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idTRNCCurcy" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idTRNCExrte" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idTRNCLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idTRNCCstC" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idTRNCCstCDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idTRNCDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTRNCGSTCode" prekey="GSTCode" postkey="GSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTRNCGSTCodeDisplay" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idTRNCTxblAmt" prekey="TaxableAmt" postkey="TaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone amount"><span class="displaynone datacol" id="idTRNCGSTAmt" prekey="GSTAmt" postkey="GSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTRNCGlCode" prekey="GLCode" postkey="GLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTRNCCtFcty" prekey="ChargeToFactory" postkey="ChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" id="idTRNCReceipt" prekey="ReceiptNo" postkey="ReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblTRNC.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateTRNC() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idTRNCDltsEdit", "idTRNCFCAmtEdit", "idTRNCCurcyEdit", "idTRNCExrteEdit", "idTRNCLCAmtEdit", "idTRNCGSTCodeEdit", "idTRNCTxblAmtEdit", "idTRNCCstCEdit", "idTRNCGlCodeEdit", "idTRNCCtFctyEdit"];
    var fldName = ["Details", "FC Amt", "Currency", "Exch. Rate", "LC Amt", "VAT Code", "Taxable Amt", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["text", "number", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "TRNCModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idTRNCCstCDisplayEdit").val($("#idTRNCCstCEdit").children("option").filter(":selected").text());
    $("#idTRNCGSTCodeDisplayEdit").val($("#idTRNCGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatTRNC(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Details", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Exch. Rate", "Cost Center", "", "Description"];
    var fldID = ["idTRNCSNo", "idTRNCLCAmt", "idTRNCGlCode", "idTRNCDlts", "idTRNCGSTCodeDisplay", "idTRNCCtFcty", "idTRNCFCAmt", "idTRNCTxblAmt", "idTRNCReceipt", "idTRNCCurcy", "idTRNCGSTAmt", "", "idTRNCExrte", "idTRNCCstCDisplay", "", "idTRNCDesc"];
    var fldWidth = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Trainers Cost  Ends
//Excess Baggage Claim Start
function setEXBDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idEXBIDEdit", "idEXBSNoEdit", "idEXBTaxAmtEdit", "idEXBFightNoEdit", "idEXBExWghtEdit", "idEXBFCAmtEdit", "idEXBExRateEdit", "idEXBPCEdit", "idEXBGSTAmtEdit", "idEXBGLCodeEdit", "idEXBGSTCodeEdit", "idEXBChargToFactEdit", "idEXBRcptNoEdit", "idEXBDescEdit", "idEXBCurncyEdit", "idEXBLCAmtEdit", "idEXBPCDisplayEdit", "idEXBGSTCodeDisplayEdit"]
    var fldID = ["idEXBID", "idEXBSNo", "idEXBTaxAmt", "idEXBFightNo", "idEXBExWght", "idEXBFCAmt", "idEXBExRate", "idEXBPC", "idEXBGSTAmt", "idEXBGLCode", "idEXBGSTCode", "idEXBChargToFact", "idEXBRcptNo", "idEXBDesc", "idEXBCurncy", "idEXBLCAmt", "idEXBPCDisplay", "idEXBGSTCodeDisplay"]
    var fldAccEditable = ["", "", "", "readonly", "readonly", "readonly", "readonly", "disabled", "", "", "", "disabled", "", "readonly", "disabled", "", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idEXBCurncyEdit").change();
}
function getEXBDataEditModal() {
    if (!validateEXB()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idEXBIDEdit").val();
    rowJSON["SNo"] = $("#idEXBSNoEdit").val();
    rowJSON["FlightNo"] = $("#idEXBFightNoEdit").val();
    rowJSON["ExcessWeight"] = $("#idEXBExWghtEdit").val();
    rowJSON["GSTCode"] = $("#idEXBGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idEXBGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idEXBTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idEXBGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idEXBGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idEXBChargToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idEXBRcptNoEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreFCAmt"] = $("#idEXBFCAmtEdit").val();
        rowJSON["PreCurrency"] = $("#idEXBCurncyEdit").val();
        rowJSON["PreExRate"] = $("#idEXBExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idEXBLCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idEXBPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idEXBPCDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idEXBDescEdit").val();
    }
    else {
        rowJSON["PreFCAmt"] = ($("#idEXBFCAmtEdit").attr("prevalue")) == undefined || ($("#idEXBFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idEXBFCAmtEdit").val();
        rowJSON["PreCurrency"] = ($("#idEXBCurncyEdit").attr("prevalue")) == undefined || ($("#idEXBCurncyEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBCurncyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idEXBCurncyEdit").val();
        rowJSON["PreExRate"] = ($("#idEXBExRateEdit").attr("prevalue")) == undefined || ($("#idEXBExRateEdit").attr("prevalue")) == "" ? "0" : $("#idEXBExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idEXBExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idEXBLCAmtEdit").attr("prevalue")) == undefined || ($("#idEXBLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idEXBLCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idEXBPCEdit").attr("prevalue")) == undefined || ($("#idEXBPCEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBPCEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idEXBPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idEXBPCDisplayEdit").attr("prevalue")) == undefined || ($("#idEXBPCDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBPCDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idEXBPCDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idEXBDescEdit").attr("prevalue")) == undefined || ($("#idEXBDescEdit").attr("prevalue")) == "" ? "NA" : $("#idEXBDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idEXBDescEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateEXBRow(strJSON, false);
}
function generateEXBRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblEXB = null;
    if (flgIntialLoading) {
        tblEXB = $('#idTblEXB').DataTable();
        tblEXB.clear()
        tblEXB.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("EXBModal");
    $.each(objJSON, function (i, item) {
        var FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, DescDisp, PreDesc;
        FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = DescDisp = PreDesc = "";
        if (travelStage == "pre") {
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
        }
        else {
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">ExcessBaggage</span><span class="datacol" id="idEXBID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idEXBSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="FlightNo" postkey="FlightNo" id="idEXBFightNo">' + item.FlightNo + '</span>' + item.FlightNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idEXBFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idEXBCurncy" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idEXBExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idEXBLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idEXBPC" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idEXBPCDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idEXBDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ExcessWeight" postkey="ExcessWeight" id="idEXBExWght">' + item.ExcessWeight + '</span>' + item.ExcessWeight + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idEXBGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idEXBGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idEXBTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idEXBGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idEXBGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idEXBChargToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idEXBRcptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblEXB.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateEXB() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idEXBFightNoEdit", "idEXBExWghtEdit", "idEXBFCAmtEdit", "idEXBCurncyEdit", "idEXBExRateEdit", "idEXBLCAmtEdit", "idEXBGSTCodeEdit", "idEXBTaxAmtEdit", "idEXBPCEdit", "idEXBGLCodeEdit", "idEXBChargToFactEdit"];
    var fldName = ["Flight No", "Excess Weight (Kg)", "FC Amount", "Currency", "Expense Rate", "LC Amount", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["text", "text", "number", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "EXBModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal, true)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idEXBPCDisplayEdit").val($("#idEXBPCEdit").children("option").filter(":selected").text());
    $("#idEXBGSTCodeDisplayEdit").val($("#idEXBGSTCodeEdit").children("option").filter(":selected").text());

    return true;
}
function formatEXB(tr) {
    var fldLabel = ["S.#", "Ex. Rate", "Cost Center", "Flight No", "LC Amt", "GL Code", "Excess Wt(Kg)", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Description"];
    var fldID = ["idEXBSNo", "idEXBExRate", "idEXBPCDisplay", "idEXBFightNo", "idEXBLCAmt", "idEXBGLCode", "idEXBExWght", "idEXBGSTCodeDisplay", "idEXBChargToFact", "idEXBFCAmt", "idEXBTaxAmt", "idEXBRcptNo", "idEXBCurncy", "idEXBGSTAmt", "", "idEXBDesc"];
    var fldClass = ["", "amount", "", "", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Excess Baggage Claim End
//ETravel Laundry Start
function setLANDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idLAUIDEdit", "idLAUSNoEdit", "idLAUDateEdit", "idLAUFCAmtEdit", "idLAUCurncyEdit", "idLAUExRateEdit", "idLAULCAmtEdit", "idLAUGSTCodeEdit", "idLAUTaxAmtEdit", "idLAUGSTAmtEdit", "idLAUPCEdit", "idLAUGLCodeEdit", "idLAUChargToFactEdit", "idLAURcptNoEdit", "idLAUDescEdit", "idLAUPCDisplayEdit", "idLAUGSTCodeDisplayEdit"];
    var fldID = ["idLAUID", "idLAUSNo", "idLAUDate", "idLAUFCAmt", "idLAUCurncy", "idLAUExRate", "idLAULCAmt", "idLAUGSTCode", "idLAUTaxAmt", "idLAUGSTAmt", "idLAUPC", "idLAUGLCode", "idLAUChargToFact", "idLAURcptNo", "idLAUDesc", "idLAUPCDisplay", "idLAUGSTCodeDisplay"];
    var fldAccEditable = ["", "", "readonly", "readonly", "disabled", "readonly", "", "", "", "", "disabled", "", "disabled", "", "readonly", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idLAUCurncyEdit").change();
}
function getLANDataEditModal() {
    if (!validateLAN()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idLAUIDEdit").val();
    rowJSON["SNo"] = $("#idLAUSNoEdit").val();
    rowJSON["GSTCode"] = $("#idLAUGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idLAUGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idLAUTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idLAUGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idLAUGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idLAUChargToFactEdit").val();
    rowJSON["ReceiptNo"] = $("#idLAURcptNoEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreExpDate"] = $("#idLAUDateEdit").val();
        rowJSON["PreFCAmt"] = $("#idLAUFCAmtEdit").val();
        rowJSON["PreCurrency"] = $("#idLAUCurncyEdit").val();
        rowJSON["PreExRate"] = $("#idLAUExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idLAULCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idLAUPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idLAUPCDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idLAUDescEdit").val();
    }
    else {
        rowJSON["PreExpDate"] = ($("#idLAUDateEdit").attr("prevalue")) == undefined || ($("#idLAUDateEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUDateEdit").attr("prevalue");
        rowJSON["PostExpDate"] = $("#idLAUDateEdit").val();
        rowJSON["PreFCAmt"] = ($("#idLAUFCAmtEdit").attr("prevalue")) == undefined || ($("#idLAUFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idLAUFCAmtEdit").val();
        rowJSON["PreCurrency"] = ($("#idLAUCurncyEdit").attr("prevalue")) == undefined || ($("#idLAUCurncyEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUCurncyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idLAUCurncyEdit").val();
        rowJSON["PreExRate"] = ($("#idLAUExRateEdit").attr("prevalue")) == undefined || ($("#idLAUExRateEdit").attr("prevalue")) == "" ? "0" : $("#idLAUExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idLAUExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idLAULCAmtEdit").attr("prevalue")) == undefined || ($("#idLAULCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idLAULCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idLAULCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idLAUPCEdit").attr("prevalue")) == undefined || ($("#idLAUPCEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUPCEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idLAUPCEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idLAUPCDisplayEdit").attr("prevalue")) == undefined || ($("#idLAUPCDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUPCDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idLAUPCDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idLAUDescEdit").attr("prevalue")) == undefined || ($("#idLAUDescEdit").attr("prevalue")) == "" ? "NA" : $("#idLAUDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idLAUDescEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateLANRow(strJSON, false);
}
function generateLANRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblLAN = null;
    if (flgIntialLoading) {
        tblLAN = $('#idTblLAU').DataTable();
        tblLAN.clear()
        tblLAN.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("LAUModal");
    $.each(objJSON, function (i, item) {
        var ExpDate, FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, DescDisp, PreDesc;
        ExpDate = Country = FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = DescDisp = PreDesc = "";
        if (travelStage == "pre") {
            ExpDate = item.PreExpDate;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
        }
        else {
            ExpDate = item.PostExpDate;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate)
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Laundry</span><span class="datacol" id="idLAUID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idLAUSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreExpDate" postkey="PostExpDate" id="idLAUDate" prevalue="' + item.PreExpDate + '">' + ExpDate + '</span>';
        strNewRow += ExpDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idLAUFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idLAUCurncy" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idLAUExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idLAULCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idLAUPC" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idLAUPCDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idLAUDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idLAUTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idLAUGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idLAUGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone amount vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idLAUGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idLAUGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idLAUChargToFact">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo" id="idLAURcptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblLAN.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function validateLAN() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idLAUDateEdit", "idLAUFCAmtEdit", "idLAUCurncyEdit", "idLAUExRateEdit", "idLAULCAmtEdit", "idLAUGSTCodeEdit", "idLAUTaxAmtEdit", "idLAUPCEdit", "idLAUGLCodeEdit", "idLAUChargToFactEdit"];
    var fldName = ["Date", "FC Amount", "Currency", "Expense Rate", "LC Amount", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["text", "number", "select", "number", "number", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "LAUModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idLAUPCDisplayEdit").val($("#idLAUPCEdit").children("option").filter(":selected").text());
    $("#idLAUGSTCodeDisplayEdit").val($("#idLAUGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatLAN(tr) {
    var fldLabel = ["S.#", "LC Amt", "GL Code", "Date", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "Receipt #", "Curr.", "VAT Amt", "", "Ex. Rate", "Cost Center", "", "Description"];
    var fldID = ["idLAUSNo", "idLAULCAmt", "idLAUGLCode", "idLAUDate", "idLAUGSTCodeDisplay", "idLAUChargToFact", "idLAUFCAmt", "idLAUTaxAmt", "idLAURcptNo", "idLAUCurncy", "idLAUGSTAmt", "", "idLAUExRate", "idLAUPCDisplay", "", "idLAUDesc"];
    var fldClass = ["", "amount", "", "", "", "", "amount", "amount", "", "", "amount", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//ETravel Laundry End
// Airport Tax EXPENSE Start
function setAPTDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idAPTIDEdit", "idAPTSNoEdit", "idAPTAirportNameEdit", "idAPTClaimCurrEdit", "idAPTClaimAmtEdit", "idAPTExRateEdit", "idAPTLCAmtEdit", "idAPTCostCenterEdit", "idAPTGSTCodeEdit", "idAPTTaxableAmtEdit", "idAPTGSTAmtEdit", "idAPTGLCodeEdit", "idAPTReceiptNoEdit", "idAPTChargeToFactoryEdit", "idAPTExpDescEdit", "idAPTTaxArgByEdit", "idAPTSubTypeEdit", "idAPTCostCenterDisplayEdit", "idAPTGSTCodeDisplayEdit"];
    var fldID = ["idAPTID", "idAPTSNo", "idAPTAirportName", "idAPTClaimCurr", "idAPTClaimAmt", "idAPTExRate", "idAPTLCAmt", "idAPTCostCenter", "idAPTGSTCode", "idAPTTaxableAmt", "idAPTGSTAmt", "idAPTGLCode", "idAPTReceiptNo", "idAPTChargeToFactory", "idAPTExpDesc", "idAPTTaxArgBy", "idAPTSubType", "idAPTCostCenterDisplay", "idAPTGSTCodeDisplay"];
    var fldAccEditable = ["", "", "readonly", "disabled", "readonly", "readonly", "", "", "", "", "", "", "", "disabled", "readonly", "disabled", "", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idAPTClaimCurrEdit").change();
    setExpArrangedBy("idTblAPT");
}
function generateAPTRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblAPT = null;
    if (flgIntialLoading) {
        tblAPT = $('#idTblAPT').DataTable();
        tblAPT.clear()
        tblAPT.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("APTModal");
    $.each(objJSON, function (i, item) {
        var PostFCAmt = outputMoney(item.PostFCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        var PostExRate = outputMoneyEx(item.PostExRate);
        var TaxableAmt = outputMoney(item.TaxableAmt);
        var GSTAmt = outputMoney(item.GSTAmt);
        var DescDisp = setDescDisplay(item.PostDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">AirportTax</span><span class="datacol" id="idAPTID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idAPTSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostExpTypes" postkey="PostExpTypes" id="idAPTSubType">' + item.PostExpTypes + '</span>' + item.PostExpTypes + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol"  prekey="AirportName" postkey="AirportName" id="idAPTAirportName">' + item.AirportName + '</span>' + item.AirportName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol ticketArrBy" prekey="PostTktArrangedBy" postkey="PostTktArrangedBy"   id="idAPTTaxArgBy">' + item.PostTktArrangedBy + '</span>' + item.PostTktArrangedBy + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PostFCAmt" postkey="PostFCAmt"   id="idAPTClaimAmt">' + PostFCAmt + '</span>' + PostFCAmt + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCurrency" postkey="PostCurrency"  id="idAPTClaimCurr">' + item.PostCurrency + '</span>' + item.PostCurrency + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol" prekey="PostExRate" postkey="PostExRate"  id="idAPTExRate">' + PostExRate + '</span>' + PostExRate + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt"  id="idAPTLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PostCostCenter" postkey="PostCostCenter"  id="idAPTCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostCostCenterDisplay" postkey="PostCostCenterDisplay"  id="idAPTCostCenterDisplay">' + item.PostCostCenterDisplay + '</span>' + item.PostCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PostDesc" postkey="PostDesc"  id="idAPTExpDesc">' + item.PostDesc + '</span>' + DescDisp + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode"  id="idAPTGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode"  id="idAPTGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay"  id="idAPTGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory"  id="idAPTChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt"  id="idAPTTaxableAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="ReceiptNo" postkey="ReceiptNo"  id="idAPTReceiptNo">' + item.ReceiptNo + '</span>' + item.ReceiptNo + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt"  id="idAPTGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblAPT.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getAPTDataEditModal() {
    if (!validateAPT()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idAPTIDEdit").val();
    rowJSON["SNo"] = $("#idAPTSNoEdit").val();
    rowJSON["AirportName"] = $("#idAPTAirportNameEdit").val();
    rowJSON["PostCurrency"] = $("#idAPTClaimCurrEdit").val();
    rowJSON["PostFCAmt"] = $("#idAPTClaimAmtEdit").val();
    rowJSON["PostExRate"] = $("#idAPTExRateEdit").val();
    rowJSON["PostLCAmt"] = $("#idAPTLCAmtEdit").val();
    rowJSON["PostCostCenter"] = $("#idAPTCostCenterEdit").val();
    rowJSON["PostCostCenterDisplay"] = $("#idAPTCostCenterDisplayEdit").val();
    rowJSON["GSTCode"] = $("#idAPTGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idAPTGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idAPTTaxableAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idAPTGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idAPTGLCodeEdit").val();
    rowJSON["PostDesc"] = $("#idAPTExpDescEdit").val();
    rowJSON["ChargeToFactory"] = $("#idAPTChargeToFactoryEdit").val();
    rowJSON["ReceiptNo"] = $("#idAPTReceiptNoEdit").val();
    rowJSON["PostTktArrangedBy"] = $("#idAPTTaxArgByEdit").val();
    rowJSON["PostExpTypes"] = $("#idAPTSubTypeEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateAPTRow(strJSON, false);
}
function validateAPT() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idAPTSubTypeEdit", "idAPTAirportNameEdit", "idAPTClaimAmtEdit", "idAPTClaimCurrEdit", "idAPTGSTCodeEdit", "idAPTTaxableAmtEdit", "idAPTCostCenterEdit", "idAPTGLCodeEdit", "idAPTChargeToFactoryEdit", "idAPTTaxArgByEdit"];
    var fldName = ["Expense Type", "Airport Name", "FC Amount", "Currency", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge to Fact.", "Arranged By"];
    var fldType = ["select", "text", "number", "select", "select", "number", "select", "text", "select", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "APTModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idAPTCostCenterDisplayEdit").val($("#idAPTCostCenterEdit").children("option").filter(":selected").text());
    $("#idAPTGSTCodeDisplayEdit").val($("#idAPTGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatAPT(tr) {
    var fldLabel = ["S.#", "LC Amt", "Charge to Fact.", "Sub Type", "VAT Code", "Arranged By", "Airport Name", "Taxable Amt", "Receipt #", "FC Amt", "VAT Amt", "", "Curr.", "Cost Center", "", "Ex. Rate", "GL Code", "", "Description"];
    var fldID = ["idAPTSNo", "idAPTLCAmt", "idAPTChargeToFactory", "idAPTSubType", "idAPTGSTCodeDisplay", "idAPTTaxArgBy", "idAPTAirportName", "idAPTTaxableAmt", "idAPTReceiptNo", "idAPTClaimAmt", "idAPTGSTAmt", "", "idAPTClaimCurr", "idAPTCostCenterDisplay", "", "idAPTExRate", "idAPTGLCode", "", "idAPTExpDesc"];
    var fldClass = ["", "amount", "", "", "", "", "", "amount", "", "amount", "amount", "", "", "", "", "amount", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Airport Tax EXPENSE ENDS
//GIFT EXPENSE Started
function setGIFTDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idGIFTIDEdit", "idGIFTSNoEdit", "idGIFTDetailsEdit", "idGIFTDateEdit", "idGIFTFCAmtEdit", "idGIFTCurrencyEdit", "idGIFTExRateEdit", "idGIFTLCAmtEdit", "idGIFTGSTCodeEdit", "idGIFTTaxAmtEdit", "idGIFTGSTAmtEdit", "idGIFTCostCenterEdit", "idGIFTGLCodeEdit", "idGIFTDescEdit", "idGIFTCostCenterDisplayEdit", "idGIFTGSTCodeDisplayEdit"]
    var fldID = ["idGIFTID", "idGIFTSNo", "idGIFTDetails", "idGIFTDate", "idGIFTFCAmt", "idGIFTCurrency", "idGIFTExRate", "idGIFTLCAmt", "idGIFTGSTCode", "idGIFTTaxAmt", "idGIFTGSTAmt", "idGIFTCostCenter", "idGIFTGLCode", "idGIFTDesc", "idGIFTCostCenterDisplay", "idGIFTGSTCodeDisplay"]
    var fldAccEditable = ["", "", "readonly", "readonly", "readonly", "disabled", "readonly", "", "", "", "", "", "", "readonly", "", ""]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idGIFTCurrencyEdit").change();
}
function generateGIFTRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblGIFT = null;
    if (flgIntialLoading) {
        tblGIFT = $('#idTblGIFT').DataTable();
        tblGIFT.clear()
        tblGIFT.draw();
    }
    var strNewRow = "";
    var strActBtns = getActionBtns("GIFTModal");
    $.each(objJSON, function (i, item) {
        var Details, ExpDate, FCAmt, Currency, ExRate, LCAmt, CostCenter, Desc, TaxableAmt, GSTAmt, DescDisp, PreDesc;
        Details = ExpDate = FCAmt = Currency = ExRate = LCAmt = CostCenter = Desc = TaxableAmt = GSTAmt = DescDisp = PreDesc = "";
        if (travelStage == "pre") {
            Details = item.PreDetails;
            ExpDate = item.PreExpDate;
            FCAmt = outputMoney(item.PreFCAmt);
            Currency = item.PreCurrency;
            ExRate = outputMoneyEx(item.PreExRate);
            LCAmt = outputMoney(item.PreLCAmt);
            CostCenter = item.PreCostCenter;
            CostCenterDisplay = item.PreCostCenterDisplay;
            Desc = item.PreDesc;
        }
        else {
            Details = item.PostDetails;
            ExpDate = item.PostExpDate;
            FCAmt = outputMoney(item.PostFCAmt);
            Currency = item.PostCurrency;
            ExRate = outputMoneyEx(item.PostExRate);
            LCAmt = outputMoney(item.PostLCAmt);
            CostCenter = item.PostCostCenter;
            CostCenterDisplay = item.PostCostCenterDisplay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        TaxableAmt = outputMoney(item.TaxableAmt);
        GSTAmt = outputMoney(item.GSTAmt);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">Gift</span><span class="datacol" prekey="ID" postkey="ID" id="idGIFTID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idGIFTSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDetails + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDetails" postkey="PostDetails" id="idGIFTDetails" prevalue="' + item.PreDetails + '">' + Details + '</span>';
        strNewRow += Details + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreExpDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreExpDate" postkey="PostExpDate" id="idGIFTDate" prevalue="' + item.PreExpDate + '">' + ExpDate + '</span>';
        strNewRow += ExpDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoney(item.PreFCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreFCAmt" postkey="PostFCAmt" id="idGIFTFCAmt" prevalue="' + outputMoney(item.PreFCAmt) + '">' + FCAmt + '</span>';
        strNewRow += FCAmt + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCurrency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCurrency" postkey="PostCurrency" id="idGIFTCurrency" prevalue="' + item.PreCurrency + '">' + Currency + '</span>';
        strNewRow += Currency + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount">' + outputMoneyEx(item.PreExRate) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="PreExRate" postkey="PostExRate" id="idGIFTExRate" prevalue="' + outputMoneyEx(item.PreExRate) + '">' + ExRate + '</span>';
        strNewRow += ExRate + '</td>';
        strNewRow += '<td class="predisplay vmiddle amount prelcamt">' + outputMoney(item.PreLCAmt) + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PostLCAmt" id="idGIFTLCAmt" prevalue="' + outputMoney(item.PreLCAmt) + '">' + LCAmt + '</span>';
        strNewRow += LCAmt + '</td>';
        strNewRow += '<td class="displaynone vmiddle">' + item.PreCostCenter + '</td>';
        strNewRow += '<td class="displaynone"><span class="displaynone datacol" prekey="PreCostCenter" postkey="PostCostCenter" id="idGIFTCostCenter" prevalue="' + item.PreCostCenter + '">' + CostCenter + '</span>';
        strNewRow += CostCenter + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreCostCenterDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreCostCenterDisplay" postkey="PostCostCenterDisplay" id="idGIFTCostCenterDisplay" prevalue="' + item.PreCostCenterDisplay + '">' + CostCenterDisplay + '</span>';
        strNewRow += CostCenterDisplay + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idGIFTDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCode" postkey="GSTCode" id="idGIFTGSTCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTCodeDisplay" postkey="GSTCodeDisplay" id="idGIFTGSTCodeDisplay">' + item.GSTCodeDisplay + '</span>' + item.GSTCodeDisplay + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="TaxableAmt" postkey="TaxableAmt" id="idGIFTTaxAmt">' + TaxableAmt + '</span>' + TaxableAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GSTAmt" postkey="GSTAmt" id="idGIFTGSTAmt">' + GSTAmt + '</span>' + GSTAmt + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode" id="idGIFTGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="ChargeToFactory" postkey="ChargeToFactory" id="idGIFTChargeToFactory">' + item.ChargeToFactory + '</span>' + item.ChargeToFactory + '</td>';
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblGIFT.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getGIFTDataEditModal() {
    if (!validateGIFT()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idGIFTIDEdit").val();
    rowJSON["SNo"] = $("#idGIFTSNoEdit").val();
    rowJSON["Company"] = $("#idGIFTCompanyEdit").val();
    rowJSON["GSTCode"] = $("#idGIFTGSTCodeEdit").val();
    rowJSON["GSTCodeDisplay"] = $("#idGIFTGSTCodeDisplayEdit").val();
    rowJSON["TaxableAmt"] = $("#idGIFTTaxAmtEdit").val();
    rowJSON["GSTAmt"] = $("#idGIFTGSTAmtEdit").val();
    rowJSON["GLCode"] = $("#idGIFTGLCodeEdit").val();
    rowJSON["ChargeToFactory"] = $("#idGIFTChargeToFactoryEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreDetails"] = $("#idGIFTDetailsEdit").val();
        rowJSON["PreExpDate"] = $("#idGIFTDateEdit").val();
        rowJSON["PreCurrency"] = $("#idGIFTCurrencyEdit").val();
        rowJSON["PreFCAmt"] = $("#idGIFTFCAmtEdit").val();
        rowJSON["PreExRate"] = $("#idGIFTExRateEdit").val();
        rowJSON["PreLCAmt"] = $("#idGIFTLCAmtEdit").val();
        rowJSON["PreCostCenter"] = $("#idGIFTCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = $("#idGIFTCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = $("#idGIFTDescEdit").val();
    } else {
        rowJSON["PreDetails"] = ($("#idGIFTDetailsEdit").attr("prevalue")) == undefined || ($("#idGIFTDetailsEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTDetailsEdit").attr("prevalue");
        rowJSON["PostDetails"] = $("#idGIFTDetailsEdit").val();
        rowJSON["PreExpDate"] = ($("#idGIFTDateEdit").attr("prevalue")) == undefined || ($("#idGIFTDateEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTDateEdit").attr("prevalue");
        rowJSON["PostExpDate"] = $("#idGIFTDateEdit").val();
        rowJSON["PreCurrency"] = ($("#idGIFTCurrencyEdit").attr("prevalue")) == undefined || ($("#idGIFTCurrencyEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTCurrencyEdit").attr("prevalue");
        rowJSON["PostCurrency"] = $("#idGIFTCurrencyEdit").val();
        rowJSON["PreFCAmt"] = ($("#idGIFTFCAmtEdit").attr("prevalue")) == undefined || ($("#idGIFTFCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTFCAmtEdit").attr("prevalue");
        rowJSON["PostFCAmt"] = $("#idGIFTFCAmtEdit").val();
        rowJSON["PreExRate"] = ($("#idGIFTExRateEdit").attr("prevalue")) == undefined || ($("#idGIFTExRateEdit").attr("prevalue")) == "" ? "0" : $("#idGIFTExRateEdit").attr("prevalue");
        rowJSON["PostExRate"] = $("#idGIFTExRateEdit").val();
        rowJSON["PreLCAmt"] = ($("#idGIFTLCAmtEdit").attr("prevalue")) == undefined || ($("#idGIFTLCAmtEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTLCAmtEdit").attr("prevalue");
        rowJSON["PostLCAmt"] = $("#idGIFTLCAmtEdit").val();
        rowJSON["PreCostCenter"] = ($("#idGIFTCostCenterEdit").attr("prevalue")) == undefined || ($("#idGIFTCostCenterEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTCostCenterEdit").attr("prevalue");
        rowJSON["PostCostCenter"] = $("#idGIFTCostCenterEdit").val();
        rowJSON["PreCostCenterDisplay"] = ($("#idGIFTCostCenterDisplayEdit").attr("prevalue")) == undefined || ($("#idGIFTCostCenterDisplayEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTCostCenterDisplayEdit").attr("prevalue");
        rowJSON["PostCostCenterDisplay"] = $("#idGIFTCostCenterDisplayEdit").val();
        rowJSON["PreDesc"] = ($("#idGIFTDescEdit").attr("prevalue")) == undefined || ($("#idGIFTDescEdit").attr("prevalue")) == "" ? "NA" : $("#idGIFTDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idGIFTDescEdit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateGIFTRow(strJSON, false);
}
function validateGIFT() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idGIFTDetailsEdit", "idGIFTDateEdit", "idGIFTFCAmtEdit", "idGIFTCurrencyEdit", "idGIFTGSTCodeEdit", "idGIFTTaxAmtEdit", "idGIFTCostCenterEdit", "idGIFTGLCodeEdit", "idGIFTChargeToFactoryEdit"];
    var fldName = ["Details", "Date", "FC Amt", "Currency", "VAT Code", "Taxable Amount", "Cost Center", "GL Code", "Charge To Factory"];
    var fldType = ["text", "text", "number", "select", "select", "number", "select", "text", "select"];
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") { // To Allow user to submit with 0 LC Amount for Pre Detail Row
        fldType.forEach(function (type, idx, arr) {
            if (type == "number") {
                arr[idx] = "zeronumber";
            }
        });
    }
    var fldModal = "GIFTModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (isPreRow) { // For Pre Rows confirmation to update 0.00 LC Amount
        if (!postTravelZeroLCConfirm(fldModal)) {
            return false;
        }
    }
    $("#idGIFTCostCenterDisplayEdit").val($("#idGIFTCostCenterEdit").children("option").filter(":selected").text());
    $("#idGIFTGSTCodeDisplayEdit").val($("#idGIFTGSTCodeEdit").children("option").filter(":selected").text());
    return true;
}
function formatGIFT(tr) {
    var fldLabel = ["S.#", "Ex. Rate", "Cost Center", "Details", "LC Amt", "GL Code", "Date", "VAT Code", "Charge To Fact.", "FC Amt", "Taxable Amt", "", "Curr.", "VAT Amt", "", "Description"];
    var fldID = ["idGIFTSNo", "idGIFTExRate", "idGIFTCostCenterDisplay", "idGIFTDetails", "idGIFTLCAmt", "idGIFTGLCode", "idGIFTDate", "idGIFTGSTCodeDisplay", "idGIFTChargeToFactory", "idGIFTFCAmt", "idGIFTTaxAmt", "", "idGIFTCurrency", "idGIFTGSTAmt", "", "idGIFTDesc"];
    var fldClass = ["", "amount", "", "", "amount", "", "", "", "", "amount", "amount", "amount", "", "amount", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//GIFT EXPENSE EndS
//GIFT DETAILS STARTED
function setGIFTDDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idGIFTDIDEdit", "idGIFTDSNoEdit", "idGIFTDCompAttendantEdit", "idGIFTDCompNameEdit", "idGIFTDTitleEdit", "idGIFTDCustNameEdit", "idGIFTDDescEdit"]
    var fldID = ["idGIFTDID", "idGIFTDSNo", "idGIFTDCompAttendant", "idGIFTDCompName", "idGIFTDTitle", "idGIFTDCustName", "idGIFTDDesc"]
    var fldAccEditable = ["", "", "readonly", "readonly", "readonly", "readonly", "readonly"]
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable)
}
function generateGIFTDRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblGIFTD = null;
    if (flgIntialLoading) {
        tblGIFTD = $('#idTblGIFTD').DataTable();
        tblGIFTD.clear()
        tblGIFTD.draw();
    }
    var strNewRow = "";
    var strActBtns = "";
    $.each(objJSON, function (i, item) {
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">GiftDetails</span><span class="datacol" id="idGIFTDID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idGIFTDSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Attendant" postkey="Attendant" id="idGIFTDCompAttendant">' + item.Attendant + '</span>' + item.Attendant + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="CompName" postkey="CompName" id="idGIFTDCompName">' + item.CompName + '</span>' + item.CompName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Title" postkey="Title" id="idGIFTDTitle">' + item.Title + '</span>' + item.Title + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="CustName" postkey="CustName" id="idGIFTDCustName">' + item.CustName + '</span>' + item.CustName + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Desc" postkey="Desc" id="idGIFTDDesc">' + item.Desc + '</span>' + item.Desc + '</td>';
        if (IsApplicantLevel == "true") {
            strActBtns = '<td class="center padding0" nowrap>';
            strActBtns += '<div class="center-btn">';
            strActBtns += '<button class="editrow" modalid="GIFTDModal"><i class="fa fa-pencil text-blue"></i></button>';
            strActBtns += '<button class="deleterow" modalid="GIFTDModal"><i class="fa fa-trash text-red"></i></button>';
            strActBtns += '<button class="undodel" style="display:none;" modalid="GIFTDModal"><i class="fa fa-undo text-orange"></i></button>';
            strActBtns += '</div></td>';
        }
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblGIFTD.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getGIFTDDataEditModal() {
    if (!validateGIFTD()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idGIFTDIDEdit").val();
    rowJSON["SNo"] = $("#idGIFTDSNoEdit").val();
    rowJSON["Attendant"] = $("#idGIFTDCompAttendantEdit").val();
    rowJSON["CompName"] = $("#idGIFTDCompNameEdit").val();
    rowJSON["Title"] = $("#idGIFTDTitleEdit").val();
    rowJSON["CustName"] = $("#idGIFTDCustNameEdit").val();
    rowJSON["Desc"] = $("#idGIFTDDescEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateGIFTDRow(strJSON, false);
}
function validateGIFTD() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idGIFTDTitleEdit", "idGIFTDCompAttendantEdit", "idGIFTDCompNameEdit", "idGIFTDCustNameEdit"];
    var fldName = ["Title", "Company Attendant", "Company Name", "Customer Name"];
    var fldType = ["text", "text", "text", "text"];
    var fldModal = "GIFTDModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    return true;
}
// GIFT DETAILS ENDED
function setDescDisplay(Desc) {
    if (Desc.length > 25) {
        Desc = Desc.substr(0, 25) + "...";
    }
    return Desc;
}
//Travel Schedule Start
function generateTSHRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblTSH = null;
    if (flgIntialLoading) {
        tblTSH = $('#idTblTSH').DataTable();
        tblTSH.clear()
        tblTSH.draw();
    }
    var strNewRow = "";
    $.each(objJSON, function (i, item) {
        var DepCountry, DestCountry, DepCity, DestCity, DepDate, ArrDate, DepTime, ArrTime, TransMode, FlightNo, IsTransitDep, AddOneDay, Desc, DescDisp, PreDesc;
        DepCountry = DestCountry = DepCity = DestCity = DepDate = ArrDate = DepTime = ArrTime = TransMode = FlightNo = IsTransitDep = AddOneDay = Desc = DescDisp = PreDesc = "";
        if (travelStage == "pre") {
            DepCountry = item.PreDepCountry;
            DestCountry = item.PreDestCountry;
            DepCity = item.PreDepCity;
            DestCity = item.PreDestCity;
            DepDate = item.PreDepDate;
            ArrDate = item.PreArrDate;
            DepTime = item.PreDepTime;
            ArrTime = item.PreArrTime;
            TransMode = item.PreTransMode;
            FlightNo = item.PreFlightNo;
            IsTransitDep = item.PreIsTransitDep;
            AddOneDay = item.PreAddOneDay;
            Desc = item.PreDesc;
        }
        else {
            DepCountry = item.PostDepCountry;
            DestCountry = item.PostDestCountry;
            DepCity = item.PostDepCity;
            DestCity = item.PostDestCity;
            DepDate = item.PostDepDate;
            ArrDate = item.PostArrDate;
            DepTime = item.PostDepTime;
            ArrTime = item.PostArrTime;
            TransMode = item.PostTransMode;
            FlightNo = item.PostFlightNo;
            IsTransitDep = item.PostIsTransitDep;
            AddOneDay = item.PostAddOneDay;
            Desc = item.PostDesc;
        }
        DescDisp = setDescDisplay(Desc);
        PreDesc = setDescDisplay(item.PreDesc);
        strNewRow = '<td class="details-control center vmiddle"><i class="fa fa-plus"></td>';
        strNewRow += '<td class="displaynone"><span class="datacol" id="idTSHID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle" nowrap><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idTSHSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDepCountry + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDepCountry" postkey="PostDepCountry" id="idTSHDepCntry" prevalue="' + item.PreDepCountry + '">' + DepCountry + '</span>';
        strNewRow += DepCountry + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDepCity + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDepCity" postkey="PostDepCity" id="idTSHDepCity" prevalue="' + item.PreDepCity + '">' + DepCity + '</span>';
        strNewRow += DepCity + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDestCountry + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDestCountry" postkey="PostDestCountry" id="idTSHDestCntry" prevalue="' + item.PreDestCountry + '">' + DestCountry + '</span>';
        strNewRow += DestCountry + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDestCity + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDestCity" postkey="PostDestCity" id="idTSHDestCity" prevalue="' + item.PreDestCity + '">' + DestCity + '</span>';
        strNewRow += DestCity + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreDepDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDepDate" postkey="PostDepDate" id="idTSHDepDate" prevalue="' + item.PreDepDate + '">' + DepDate + '</span>';
        strNewRow += DepDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + item.PreArrDate + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreArrDate" postkey="PostArrDate" id="idTSHArrDate" prevalue="' + item.PreArrDate + '">' + ArrDate + '</span>';
        strNewRow += ArrDate + '</td>';
        strNewRow += '<td class="predisplay vmiddle">' + PreDesc + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PreDesc" postkey="PostDesc" id="idTSHDesc" prevalue="' + item.PreDesc + '">' + Desc + '</span>';
        strNewRow += DescDisp + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreDepTime" postkey="PostDepTime" id="idTSHDepTime" prevalue="' + item.PreDepTime + '">' + DepTime + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreDepTime + '</span>' + DepTime + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreArrTime" postkey="PostArrTime" id="idTSHArrTime" prevalue="' + item.PreArrTime + '">' + ArrTime + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreArrTime + '</span>' + ArrTime + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreTransMode" postkey="PostTransMode" id="idTSHTransMode" prevalue="' + item.PreTransMode + '">' + TransMode + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreTransMode + '</span>' + TransMode + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreFlightNo" postkey="PostFlightNo" id="idTSHFlightNo" prevalue="' + item.PreFlightNo + '">' + FlightNo + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreFlightNo + '</span>' + FlightNo + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreIsTransitDep" postkey="PostIsTransitDep" id="idTSHisTransiDep" prevalue="' + item.PreIsTransitDep + '">' + IsTransitDep + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreIsTransitDep + '</span>' + IsTransitDep + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="PreAddOneDay" postkey="PostAddOneDay" id="idTSHAdditionalDay" prevalue="' + item.PreAddOneDay + '">' + AddOneDay + '</span>';
        strNewRow += '<span class="predisplay">' + item.PreAddOneDay + '</span>' + AddOneDay + '</td>';
        strNewRow += '<td class="displaynone vmiddle"><span class="datacol displaynone" prekey="isTravelled" postkey="isTravelled" isTravelled="' + item.isTravelled + '" id="idTSHisTravelled">' + item.isTravelled + '</span>' + item.isTravelled + '</td>';
        if (IsApplicantLevel == "true") {
            strNewRow += '<td class="center padding0" nowrap>';
            strNewRow += '<div class="center-btn vmiddle">';
            strNewRow += '<button class="editrow" modalid="TSHModal"><i class="fa fa-pencil text-blue"></i></button>';
            btncolor = "red";
            btndisable = "";
            var noDelete = false;
            if (!item.PreCreated) {
                item.PreCreated = canDeleteRow("TravelSchedule", item.ID, "idTblTSH") ? "0" : "1";
            }
            if ((flgIntialLoading && (objJSON.length - 1) != i) || (travelStage == "post" && item.PreCreated == "1")) {
                noDelete = true;
            }
            if (noDelete) {
                btncolor = "grey";
                btndisable = "disabled";
            }
            strNewRow += '<button class="deleterow" ' + btndisable + ' modalid="TSHModal"><i class="fa fa-trash text-' + btncolor + '"></i></button>';
            strNewRow += '<button class="undodel" style="display:none;" modalid="TSHModal"><i class="fa fa-undo text-orange"></i></button>';
            strNewRow += '</div></td>';
        }
        if (flgIntialLoading) {
            if (item.isTravelled.toLowerCase() == "yes") {
                strNewRow = "<tr style='text-decoration:line-through;'>" + strNewRow + "</tr>";
            } else {
                strNewRow = "<tr>" + strNewRow + "</tr>";
            }
            tblTSH.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getTSHDataEditModal() {
    if (!validateTSH()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idTSHIDEdit").val();
    rowJSON["SNo"] = $("#idTSHSNoEdit").val();
    rowJSON["isTravelled"] = $("#idTSHisTravelledEdit").val();
    if (travelStage == "pre") {
        rowJSON["PreDepCountry"] = $("#idTSHDepCntryEdit option:selected").text();
        rowJSON["PreDestCountry"] = $("#idTSHDestCntryEdit option:selected").text();
        rowJSON["PreDepCity"] = $("#idTSHDepCityEdit option:selected").text();
        rowJSON["PreDestCity"] = $("#idTSHDestCityEdit option:selected").text();
        rowJSON["PreDepDate"] = $("#idTSHDepDateEdit").val();
        rowJSON["PreArrDate"] = $("#idTSHArrDateEdit").val();
        rowJSON["PreDepTime"] = $("#idTSHDepTimeEdit").val();
        rowJSON["PreArrTime"] = $("#idTSHArrTimeEdit").val();
        rowJSON["PreTransMode"] = $("#idTSHTransModeEdit").val();
        rowJSON["PreFlightNo"] = $("#idTSHFlightNoEdit").val();
        rowJSON["PreIsTransitDep"] = $("#idTSHisTransiDepEdit").val();
        rowJSON["PreAddOneDay"] = $("#idTSHAdditionalDayEdit").val();
        rowJSON["PreDesc"] = $("#idTSHDescEdit").val();
    } else {
        rowJSON["PreDepCountry"] = ($("#idTSHDepCntryEdit").attr("prevalue")) == undefined || ($("#idTSHDepCntryEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDepCntryEdit").attr("prevalue");
        rowJSON["PostDepCountry"] = $("#idTSHDepCntryEdit option:selected").text();
        rowJSON["PreDestCountry"] = ($("#idTSHDestCntryEdit").attr("prevalue")) == undefined || ($("#idTSHDestCntryEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDestCntryEdit").attr("prevalue");
        rowJSON["PostDestCountry"] = $("#idTSHDestCntryEdit option:selected").text();
        rowJSON["PreDepCity"] = ($("#idTSHDepCityEdit").attr("prevalue")) == undefined || ($("#idTSHDepCityEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDepCityEdit").attr("prevalue");
        rowJSON["PostDepCity"] = $("#idTSHDepCityEdit").val();
        rowJSON["PreDestCity"] = ($("#idTSHDestCityEdit").attr("prevalue")) == undefined || ($("#idTSHDestCityEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDestCityEdit").attr("prevalue");
        rowJSON["PostDestCity"] = $("#idTSHDestCityEdit").val();
        rowJSON["PreDepDate"] = ($("#idTSHDepDateEdit").attr("prevalue")) == undefined || ($("#idTSHDepDateEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDepDateEdit").attr("prevalue");
        rowJSON["PreArrDate"] = ($("#idTSHArrDateEdit").attr("prevalue")) == undefined || ($("#idTSHArrDateEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHArrDateEdit").attr("prevalue");
        rowJSON["PostDepDate"] = $("#idTSHDepDateEdit").val();
        rowJSON["PostArrDate"] = $("#idTSHArrDateEdit").val();
        rowJSON["PreArrDate"] = ($("#idTSHArrDateEdit").attr("prevalue")) == undefined || ($("#idTSHArrDateEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHArrDateEdit").attr("prevalue");
        rowJSON["PreDepTime"] = ($("#idTSHDepTimeEdit").attr("prevalue")) == undefined || ($("#idTSHDepTimeEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDepTimeEdit").attr("prevalue");
        rowJSON["PostDepTime"] = $("#idTSHDepTimeEdit").val();
        rowJSON["PreArrTime"] = ($("#idTSHArrTimeEdit").attr("prevalue")) == undefined || ($("#idTSHArrTimeEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHArrTimeEdit").attr("prevalue");
        rowJSON["PostArrTime"] = $("#idTSHArrTimeEdit").val();
        rowJSON["PreTransMode"] = ($("#idTSHTransModeEdit").attr("prevalue")) == undefined || ($("#idTSHTransModeEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHTransModeEdit").attr("prevalue");
        rowJSON["PostTransMode"] = $("#idTSHTransModeEdit").val();
        rowJSON["PreFlightNo"] = ($("#idTSHFlightNoEdit").attr("prevalue")) == undefined || ($("#idTSHFlightNoEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHFlightNoEdit").attr("prevalue");
        rowJSON["PostFlightNo"] = $("#idTSHFlightNoEdit").val();
        rowJSON["PreIsTransitDep"] = ($("#idTSHisTransiDepEdit").attr("prevalue")) == undefined || ($("#idTSHisTransiDepEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHisTransiDepEdit").attr("prevalue");
        rowJSON["PostIsTransitDep"] = $("#idTSHisTransiDepEdit").val();
        rowJSON["PreAddOneDay"] = ($("#idTSHAdditionalDayEdit").attr("prevalue")) == undefined || ($("#idTSHAdditionalDayEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHAdditionalDayEdit").attr("prevalue");
        rowJSON["PostAddOneDay"] = $("#idTSHAdditionalDayEdit").val();
        rowJSON["PreDesc"] = ($("#idTSHDescEdit").attr("prevalue")) == undefined || ($("#idTSHDescEdit").attr("prevalue")) == "" ? "NA" : $("#idTSHDescEdit").attr("prevalue");
        rowJSON["PostDesc"] = $("#idTSHDescEdit").val();
    }
    objJSON.push(rowJSON);
    if (!!objSelectedRow & !NewRow) {
        var nextTravelled = objSelectedRow.nextAll("tr").find("*[istravelled=No]");
        if (nextTravelled.length > 0) {
            var nextRow = [];
            if (nextTravelled.length > 0) {
                nextRow = $(nextTravelled[0]).closest("tr");
            };
            if (nextRow.length > 0) {
                var keysToUpdate = ["PostDepCountry", "PostDepCity"];
                var valsToUpdate = [$("#idTSHDestCntryEdit option:selected").text(), $("#idTSHDestCityEdit option:selected").text()];
                keysToUpdate.forEach(function (key, idx) {
                    var objSpan = nextRow.find("*[postkey='" + key + "']");
                    objSpan.text(valsToUpdate[idx]);
                    if (travelStage == "pre") {
                        objSpan.attr("prevalue", valsToUpdate[idx]);
                    }
                    var strHTML = objSpan[0].outerHTML;
                    objSpan.parent().html(strHTML + valsToUpdate[idx]);
                });
            }
        }
    }
    var strJSON = JSON.stringify(objJSON);
    return generateTSHRow(strJSON, false);
}

function validateTSH() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idTSHDepCntryEdit", "idTSHDepCityEdit", "idTSHDestCntryEdit", "idTSHDestCityEdit", "idTSHDepDateEdit", "idTSHDepTimeEdit", "idTSHArrTimeEdit", "idTSHTransModeEdit", "idTSHisTransiDepEdit"];
    var fldName = ["Dep. Country", "Dep. City", "Dest. Country", "Dest. City", "Dep. Date", "Dep. Time", "Arr. Time", "Transport Mode", "Is Transit Departure"];
    var fldType = ["select", "select", "select", "select", "text", "text", "text", "select", "select"];
    var fldModal = "TSHModal";
    var objSched = objSchedCountryCity(true);
    if (NewRow) {
        // Round Trip check
        if (objSched.destCountries.length > 0) {
            if (TravellingTo == "Domestic" && objSched.depCities[0] == objSched.destCities[objSched.destCities.length - 1]) {
                $("#" + fldModal).find('.modalInfo').text("Cannot add new schedule entries. Document is already holding one round trip schedule from '" + objSched.depCities[0] + "' to '" + objSched.depCities[0] + "'");
                showError();
                return false;
            } else if (TravellingTo == "Overseas" && objSched.depCountries[0] == objSched.destCountries[objSched.destCountries.length - 1]) {
                $("#" + fldModal).find('.modalInfo').text("Cannot add new schedule entries. Document is already holding one round trip schedule from '" + objSched.depCountries[0] + "' to '" + objSched.depCountries[0] + "'");
                showError();
                return false;
            }
        }
    }
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    if (CustomTravelValidation(fldModal) == false) {
        return false;
    }
    if (!flgRecalcDA && (NewRow ? ($("#idTSHDestCityEdit").val() != "Select") : isScheduleChanged())) {
        flgRecalcDA = true;
    }
    return true;
}
function setTSHDataEditModal() {
    //Set Row for editing    
    var tr = objSelectedRow;
    var fldEditID = ["idTSHIDEdit", "idTSHSNoEdit", "idTSHDepCntryEdit", "idTSHDestCntryEdit", "idTSHDepCityEdit", "idTSHDestCityEdit", "idTSHDepDateEdit", "idTSHDepTimeEdit", "idTSHArrTimeEdit", "idTSHTransModeEdit", "idTSHFlightNoEdit", "idTSHAdditionalDayEdit", "idTSHDescEdit", "idTSHArrDateEdit", "idTSHisTransiDepEdit", "idTSHisTravelledEdit"];
    var fldID = ["idTSHID", "idTSHSNo", "idTSHDepCntry", "idTSHDestCntry", "idTSHDepCity", "idTSHDestCity", "idTSHDepDate", "idTSHDepTime", "idTSHArrTime", "idTSHTransMode", "idTSHFlightNo", "idTSHAdditionalDay", "idTSHDesc", "idTSHArrDate", "idTSHisTransiDep", "idTSHisTravelled"];
    var fldAccEditable = ["", "", "disabled", "disabled", "disabled", "disabled", "readonly", "readonly", "readonly", "disabled", "readonly", "readonly", "readonly", "readonly", "disabled", "disabled"];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $('#TSHModal').find("select,input,textarea").prop("disabled", false);
    $('#idTSHDepCntryEdit option:selected').prop("selected", false);
    $('#idTSHDestCntryEdit option:selected').prop("selected", false);
    $('#idTSHDestCityEdit option:selected').prop("selected", false);
    $('#idTSHDepCityEdit option:selected').prop("selected", false);
    $('#idTSHDepCntryEdit option').map(function () {
        if ($(this).text() == tr.find("#idTSHDepCntry").text()) {
            return this;
        }
    }).map(function () {
        this.selected = true
    });
    $('#idTSHDepCntryEdit').trigger("onchange");
    $('#idTSHDestCntryEdit option').map(function () {
        if ($(this).text() == tr.find("#idTSHDestCntry").text()) {
            return this;
        }
    }).map(function () {
        this.selected = true
    });
    $('#idTSHDestCntryEdit').trigger("onchange");
    $('#idTSHDestCityEdit option').map(function () {
        if ($(this).text() == tr.find("#idTSHDestCity").text()) {
            return this;
        }
    }).attr('selected', 'selected');
    $('#idTSHDepCityEdit option').map(function () {
        if ($(this).text() == tr.find("#idTSHDepCity").text()) {
            return this;
        }
    }).attr('selected', 'selected');
    if ($(objSelectedRow).prev().length == 0) {
        $("#idTSHDepCntryEdit, #idTSHDestCntryEdit, #idTSHDepCityEdit, #idTSHDestCityEdit").prop("disabled", false);
    } else {
        $("#idTSHDepCntryEdit, #idTSHDepCityEdit").prop("disabled", true);
        $("#idTSHDestCntryEdit, #idTSHDestCityEdit").prop("disabled", false);
    }
    if (TravellingTo == "Domestic") {
        $("#idTSHDestCntryEdit, #idTSHDepCntryEdit").prop("disabled", true);
    }
    //$("#idTSHDestCntryEdit, #idTSHDepCntryEdit").multiselect({
    //    includeSelectAllOption: false,
    //    enableFiltering: true,
    //    enableCaseInsensitiveFiltering: true,
    //    maxHeight: 200,
    //    numberDisplayed: 5,
    //    onDropdownShown: function (even) {
    //        this.$filter.find('.multiselect-clear-filter').click();
    //        this.$filter.find('.multiselect-search').focus();
    //    }
    //});
    //$('#idTSHDepCntryEdit,#idTSHDestCntryEdit').multiselect("refresh");
    // Update Date Picker
    var isTravelled = $("#idTSHisTravelledEdit").val().toLowerCase() == "no";
    if (isTravelled) {
        var objSched = objSchedCountryCity(true);
        var curRowIdx = objSched.trips.indexOf($("#idTSHSNoEdit").val());
        var frmDt = null;
        var toDt = null;
        if ((curRowIdx == 0) && (objSched.depTime.length > 1)) { // editing first row, more than one rows exists
            toDt = objSched.depTime[1];
        } else if ((curRowIdx + 1) == objSched.depTime.length) { // editing last row
            frmDt = objSched.destTime[curRowIdx - 1];
        } else { // In between row
            frmDt = objSched.destTime[curRowIdx - 1];
            toDt = objSched.depTime[curRowIdx + 1];
        }
        var pickerObj = {
            locale: { format: displayDateFormat },
            autoApply: true,
            twoInputRange: true,
            fromElement: '#idTSHDepDateEdit',
            toElement: '#idTSHArrDateEdit',
            startDate: $.trim(tr.find("#idTSHDepDate").text()),
            endDate: $.trim(tr.find("#idTSHArrDate").text())
        }
        if (!pickerObj.startDate || !pickerObj.endDate) {
            delete pickerObj.startDate;
            delete pickerObj.endDate;
        }
        updateDateRange($('#idTSHDepDateEdit,#idTSHArrDateEdit'), frmDt, toDt, pickerObj, null);
    } else {
        $("#idTSHDepDateEdit").val(tr.find("#idTSHDepDate").text());
        $("#idTSHArrDateEdit").val(tr.find("#idTSHArrDate").text());
    }
    $("#idTSHDepDateEdit").attr("prevalue", tr.find("#idTSHDepDate").attr("prevalue"));
    $("#idTSHArrDateEdit").attr("prevalue", tr.find("#idTSHArrDate").attr("prevalue"));
    // Disable Additional One day field
    ADAllowedConfig = $("input[fldTitle='hdnADAllowedConfig']").val(); //"Yes";
    $('#idTSHAdditionalDayEdit').prev().css("color", "black");
    if (ADAllowedConfig != "Yes") {
        $('#idTSHAdditionalDayEdit').val("NA");
        $('#idTSHAdditionalDayEdit').attr("disabled", true);
        $('#idTSHAdditionalDayEdit').prev().css("color", "#e4e4e4");
    }
    var isPreRow = isPreExpenseRow(objSelectedRow);
    if (isPreRow && travelStage == "post") {
        $("#idTSHisTravelledEdit").prop("disabled", false).closest("li").show();
    }
    else {
        $("#idTSHisTravelledEdit").val("No").prop("disabled", true).closest("li").hide();
    }
    // Update for No Travel Schedule
    if (!isTravelled) {
        $("#" + fldEditID.join(",#")).prop("disabled", true);
    }
    //$("#idTSHDepCntryEdit").multiselect($("#idTSHDepCntryEdit")[0].disabled ? 'disable' : 'enable');
    //$("#idTSHDestCntryEdit").multiselect($("#idTSHDestCntryEdit")[0].disabled ? 'disable' : 'enable');
}
function formatTSH(tr) {
    var fldLabel = ["S.#", "Dep. Date", "Transport Mode", "Dep. Country", "Dep. Time", "Flight Number", "Dep. City", "Arr. Date", "Additional One Day", "Arr. Country", "Arr. Time", "Cancel Trip?", "Arr. City", "NA", "NA", "Description"];
    var fldID = ["idTSHSNo", "idTSHDepDate", "idTSHTransMode", "idTSHDepCntry", "idTSHDepTime", "idTSHFlightNo", "idTSHDepCity", "idTSHArrDate", "idTSHAdditionalDay", "idTSHDestCntry", "idTSHArrTime", "idTSHisTravelled", "idTSHDestCity", "NA", "NA", "idTSHDesc"];
    var fldClass = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, true);
    return strRowData;
}
//Travel Schedule End
//My Exchange Rate Start
function generateMYEXCHRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblMYEXCH = null;
    if (flgIntialLoading) {
        tblMYEXCH = $('#idTblMYEXCH').DataTable();
        tblMYEXCH.clear()
        tblMYEXCH.draw();
    }
    var strNewRow = "";
    var strActBtns = "";
    var Rate1, Rate2, Rate3, Rate4, Rate5, Rate6, Rate7, Rate8;
    Rate1 = Rate2 = Rate3 = Rate4 = Rate5 = Rate6 = Rate7 = Rate8 = "";
    $.each(objJSON, function (i, item) {
        Rate1 = item.Rate1; Rate1 = (Rate1 != undefined && Rate1 != "") ? outputMoneyEx(Rate1) : "";
        Rate2 = item.Rate2; Rate2 = (Rate2 != undefined && Rate2 != "") ? outputMoneyEx(Rate2) : "";
        Rate3 = item.Rate3; Rate3 = (Rate3 != undefined && Rate3 != "") ? outputMoneyEx(Rate3) : "";
        Rate4 = item.Rate4; Rate4 = (Rate4 != undefined && Rate4 != "") ? outputMoneyEx(Rate4) : "";
        Rate5 = item.Rate5; Rate5 = (Rate5 != undefined && Rate5 != "") ? outputMoneyEx(Rate5) : "";
        Rate6 = item.Rate6; Rate6 = (Rate6 != undefined && Rate6 != "") ? outputMoneyEx(Rate6) : "";
        Rate7 = item.Rate7; Rate7 = (Rate7 != undefined && Rate7 != "") ? outputMoneyEx(Rate7) : "";
        Rate8 = item.Rate8; Rate8 = (Rate8 != undefined && Rate8 != "") ? outputMoneyEx(Rate8) : "";
        strNewRow = '<td class="displaynone"><span class="datacol" id="idMYEXCHID" prekey="ID" postkey="ID"></span></td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idMYEXCHSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency1" postkey="Currency1" id="idMYEXCHCurrency1">' + item.Currency1 + '</span>' + item.Currency1 + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="Rate1" postkey="Rate1" id="idMYEXCHRate1">' + Rate1 + '</span>' + Rate1 + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency2" postkey="Currency2" id="idMYEXCHCurrency2">' + item.Currency2 + '</span>' + item.Currency2 + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="Rate2" postkey="Rate2" id="idMYEXCHRate2">' + Rate2 + '</span>' + Rate2 + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency3" postkey="Currency3" id="idMYEXCHCurrency3">' + item.Currency3 + '</span>' + item.Currency3 + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="Rate3" postkey="Rate3" id="idMYEXCHRate3">' + Rate3 + '</span>' + Rate3 + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency4" postkey="Currency4" id="idMYEXCHCurrency4">' + item.Currency4 + '</span>' + item.Currency4 + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="Rate4" postkey="Rate4" id="idMYEXCHRate4">' + Rate4 + '</span>' + Rate4 + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency5" postkey="Currency5" id="idMYEXCHCurrency5">' + item.Currency5 + '</span>' + item.Currency5 + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="Rate5" postkey="Rate5" id="idMYEXCHRate5">' + Rate5 + '</span>' + Rate5 + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="Currency6" postkey="Currency6" id="idMYEXCHCurrency6">' + item.Currency6 + '</span>' + item.Currency6 + '</td>';
        strNewRow += '<td class="vmiddle amount displaynone"><span class="displaynone datacol" prekey="Rate6" postkey="Rate6" id="idMYEXCHRate6">' + Rate6 + '</span>' + Rate6 + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="Currency7" postkey="Currency7" id="idMYEXCHCurrency7">' + item.Currency7 + '</span>' + item.Currency7 + '</td>';
        strNewRow += '<td class="vmiddle amount displaynone"><span class="displaynone datacol" prekey="Rate7" postkey="Rate7" id="idMYEXCHRate7">' + Rate7 + '</span>' + Rate7 + '</td>';
        strNewRow += '<td class="vmiddle displaynone"><span class="displaynone datacol" prekey="Currency8" postkey="Currency8" id="idMYEXCHCurrency8">' + item.Currency8 + '</span>' + item.Currency8 + '</td>';
        strNewRow += '<td class="vmiddle amount displaynone"><span class="displaynone datacol" prekey="Rate8" postkey="Rate8" id="idMYEXCHRate8">' + Rate8 + '</span>' + Rate8 + '</td>';
        if (IsApplicantLevel == "true") {
            strActBtns = '<td class="center padding0" nowrap>';
            strActBtns += '<div class="center-btn">';
            strActBtns += '<button class="editrow" modalid="MYEXCHModal"><i class="fa fa-pencil text-blue"></i></button>';
            strActBtns += '<button class="deleterow" modalid="MYEXCHModal"><i class="fa fa-trash text-red"></i></button>';
            strActBtns += '<button class="undodel" style="display:none;" modalid="MYEXCHModal"><i class="fa fa-undo text-orange"></i></button>';
            strActBtns += '</div></td>';
        }
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblMYEXCH.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getMYEXCHDataEditModal() {
    if (!validateMYEXCH()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    //rowJSON["ID"] = $("#idMYEXCHIDEdit").val();
    rowJSON["SNo"] = $("#idMYEXCHSNoEdit").val();
    for (var i = 1; i <= 8; i++) {
        var fldVal = $("#idMYEXCHCurrency" + i + "Edit").val();
        if (fldVal == "Select") {
            rowJSON["Currency" + i] = "";
        }
        else {
            rowJSON["Currency" + i] = fldVal;
        }
    }
    for (var i = 1; i <= 8; i++) {
        rowJSON["Rate" + i] = $("#idMYEXCHRate" + i + "Edit").val();
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateMYEXCHRow(strJSON, false);
}
function setMYEXCHDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    //$('#idMYEXCHIDEdit').val(tr.find("#idMYEXCHID").text());
    $('#idMYEXCHSNoEdit').val(tr.find("#idMYEXCHSNo").text());
    for (var i = 1; i <= 8; i++) {
        var fldVal = tr.find("#idMYEXCHCurrency" + i).text();
        if (fldVal == "") {
            $('#idMYEXCHCurrency' + i + 'Edit').val("Select");
        }
        else {
            $('#idMYEXCHCurrency' + i + 'Edit').val(fldVal);
        }
    }
    for (var i = 1; i <= 8; i++) {
        $('#idMYEXCHRate' + i + 'Edit').val(tr.find("#idMYEXCHRate" + i).text());
    }
}
function validateMYEXCH() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var CurrVal = $("#idMYEXCHCurrency1Edit").val();
    var flgCurrPresent = false;
    $('#idTblMYEXCH > tbody  > tr').each(function () {
        var CurrCode = $(this).find("#idMYEXCHCurrency1").text();
        if (NewRow) {
            if (CurrVal == CurrCode) {
                flgCurrPresent = true;
                return;
            }
        }
        else {
            var SNo = $(this).find("#idMYEXCHSNo").text();
            var CurrRowSNo = $("#idMYEXCHSNoEdit").val();
            if (SNo != CurrRowSNo && CurrVal == CurrCode) {
                flgCurrPresent = true;
                return;
            }
        }
    });
    if (flgCurrPresent) {
        $("#MYEXCHModal").find('.modalInfo').text(CurrVal + " is already selected as the first currency in any of the previous row. Please select another currency.");
        $(fldIDCurr).focus();
        showError();
        return false;
    }
    var prvCurr = "";
    var manualCurrency = "";
    var manualExRate = 1;
    for (var i = 1; i <= 8; i++) {
        var fldIDCurr = "#idMYEXCHCurrency" + i + "Edit";
        var fldValCurr = $(fldIDCurr).val();
        if (fldValCurr == "Select" && i == 1) {
            if (($(fldIDCurr + ' option:selected').index() == -1) || $(fldIDCurr).val().toLowerCase() == "select") {
                $("#MYEXCHModal").find('.modalInfo').text("Please select the value for currency.");
                $(fldIDCurr).focus();
                showError();
                return false;
            }
        }
        fldIDRate = "#idMYEXCHRate" + i + "Edit";
        fldValRate = outputNumber($(fldIDRate).val());
        if (fldValRate == "" && i == 1) {
            $("#MYEXCHModal").find('.modalInfo').text("Please enter the value for rate.");
            $(fldIDRate).focus();
            showError();
            return false;
        }
        if (parseFloat(fldValRate) <= 0 && i == 1) {
            $("#MYEXCHModal").find('.modalInfo').text("Rate should be greater than zero.");
            $(fldIDRate).focus();
            showError();
            return false;
        }
        if (parseFloat(fldValRate) == 0) {
            $(fldIDRate).val("");
            fldValRate = "";
        }
        if (fldValRate != "" && parseFloat(fldValRate) > 0 && fldValCurr == "Select") {
            $("#MYEXCHModal").find('.modalInfo').text("Please select the value for currency.");
            $(fldIDCurr).focus();
            showError();
            return false;
        }
        if (fldValCurr != "Select" && fldValRate == "") {
            $("#MYEXCHModal").find('.modalInfo').text("Please enter the value for rate.");
            $(fldIDRate).focus();
            return false;
        }
        if (prvCurr != "Select" && prvCurr == fldValCurr) {
            $("#MYEXCHModal").find('.modalInfo').text("Adjacent currency name cannot be same.");
            $(fldIDCurr).focus();
            showError();
            return false;
        }
        prvCurr = fldValCurr;
        if (i == 1) {
            manualCurrency = fldValCurr;
        }
        manualExRate = manualExRate * parseFloat(fldValRate);
    }
    var msgStr = checkManualExRateTolerance(manualCurrency, manualExRate);
    var result = msgStr.substring(0, msgStr.indexOf(":"));
    if (result == "0") {
        var msg = msgStr.substring(msgStr.indexOf(":") + 1);
        $("#MYEXCHModal").find('.modalInfo').text(msg);
        showError();
        return false;
    }
    return true;
}
//My Exchange Rate End
//Accounting Enteries Start
function setACCENTDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idACCENTIDEdit", "idACCENTSNoEdit", "idACCENTPostkeyEdit", "idACCENTCostCenterEdit", "idACCENTGLCodeEdit", "idACCENTTaxCodeEdit", "idACCENTAmountEdit"];
    var fldID = ["idACCENTID", "idACCENTSNo", "idACCENTPostkey", "idACCENTCostCenter", "idACCENTGLCode", "idACCENTTaxCode", "idACCENTAmount"];
    var fldAccEditable = ["", "", "", "", "", "", ""];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable)
}
function generateACCENTRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblACCENT = null;
    if (flgIntialLoading) {
        tblACCENT = $('#idTblACCENT').DataTable();
        tblACCENT.clear()
        tblACCENT.draw();
    }
    var strNewRow = "";
    $.each(objJSON, function (i, item) {
        var PostLCAmt = outputMoney(item.PostLCAmt);
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="ExpCode" postkey="ExpCode">AccountingEntry</span><span class="datacol" id="idACCENTID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="SNo" postkey="SNo" id="idACCENTSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostingKey" postkey="PostingKey" id="idACCENTPostkey">' + item.PostingKey + '</span>' + item.PostingKey + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="PostCostCenter" postkey="PostCostCenter" id="idACCENTCostCenter">' + item.PostCostCenter + '</span>' + item.PostCostCenter + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="GLCode" postkey="GLCode" id="idACCENTGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle"><span class="datacol displaynone" prekey="GSTCode" postkey="GSTCode" id="idACCENTTaxCode">' + item.GSTCode + '</span>' + item.GSTCode + '</td>';
        strNewRow += '<td class="amount vmiddle"><span class="datacol displaynone" prekey="PostLCAmt" postkey="PostLCAmt" id="idACCENTAmount">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        var isAccountsLevel = $("input[fldTitle='hdnIsAccountsLevel']").val();
        if (docStatus == "Approved" && travelStage == "post") {
            strNewRow += '<td class="center padding0">';
            strNewRow += '<div class="center-btn">';
            strNewRow += '<button class="editrow" modalid="ACCENTModal"><i class="fa fa-pencil text-blue"></i></button>';
            strNewRow += '<button class="deleterow" modalid="ACCENTModal"><i class="fa fa-trash text-red"></i></button>';
            strNewRow += '<button class="undodel" style="display:none;" modalid="ACCENTModal"><i class="fa fa-undo text-orange"></i></button>';
            strNewRow += '</div></td>';
        }
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblACCENT.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getACCENTDataEditModal() {
    if (!validateACCENT()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idACCENTIDEdit").val();
    rowJSON["SNo"] = $("#idACCENTSNoEdit").val();
    rowJSON["PostingKey"] = $("#idACCENTPostkeyEdit").val();
    rowJSON["PostCostCenter"] = $("#idACCENTCostCenterEdit").val();
    rowJSON["GLCode"] = $("#idACCENTGLCodeEdit").val();
    rowJSON["GSTCode"] = $("#idACCENTTaxCodeEdit").val();
    rowJSON["PostLCAmt"] = $("#idACCENTAmountEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateACCENTRow(strJSON, false);
}
function validateACCENT() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idACCENTPostkeyEdit", "idACCENTCostCenterEdit", "idACCENTGLCodeEdit", "idACCENTTaxCodeEdit", "idACCENTAmountEdit"];
    var fldName = ["Posting Key", "Cost Center", "GL Code", "Tax Code", "Amount"];
    var fldType = ["text", "text", "text", "text", "number"];
    var fldModal = "ACCENTModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    return true;
}
function formatACCENT(tr) {
    var fldLabel = ["S.#", "Posting Key", "Cost Center", "GL Code", "Tax Code", "Amount"];
    var fldID = ["idACCENTSNo", "idACCENTPostkey", "idACCENTCostCenter", "idACCENTGLCode", "idACCENTTaxCode", "idACCENTAmount"];
    var fldClass = ["-", "-", "-", "-", "-", "amount"];
    var strRowData = formatTravelFields(tr, fldLabel, fldID, fldClass, false);
    return strRowData;
}
//Accounting Enteries Ends
// Advance Starts
function generateADVRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblAdv = null;
    if (flgIntialLoading) {
        tblAdv = $('#idTblADV').DataTable();
        tblAdv.clear()
        tblAdv.draw();
    }
    var strNewRow = "";
    var strActBtns = "";
    $.each(objJSON, function (i, item) {
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="AdvCode" postkey="AdvCode">AdvanceDetails</span><span class="datacol" id="idADVID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idADVSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency" postkey="Currency" id="idADVCurr">' + item.Currency + '</span>' + item.Currency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Mode" postkey="Mode" id="idADVMode">' + item.Mode + '</span>' + item.Mode + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="PC" postkey="PC" id="idADVPC">' + item.PC + '</span>' + item.PC + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Denomination" postkey="Denomination" id="idADVDenomination">' + item.Denomination + '</span>' + item.Denomination + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="ExpPayDate" postkey="ExpPayDate" id="idADVExpPayDate">' + item.ExpPayDate + '</span>' + item.ExpPayDate + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="FCAmount" postkey="FCAmount" id="idADVFCAmt">' + item.FCAmount + '</span>' + item.FCAmount + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="BaseCurrencyAmount" postkey="BaseCurrencyAmount" id="idADVBaseCurrAmt">' + item.BaseCurrencyAmount + '</span>' + item.BaseCurrencyAmount + '</td>';
        if (IsApplicantLevel == "true" && travelStage != "post") {
            strActBtns = '<td class="center padding0" nowrap>';
            strActBtns += '<div class="center-btn">';
            strActBtns += '<button class="editrow" modalid="AdvanceModal"><i class="fa fa-pencil text-blue"></i></button>';
            strActBtns += '<button class="deleterow" modalid="AdvanceModal"><i class="fa fa-trash text-red"></i></button>';
            strActBtns += '<button class="undodel" style="display:none;" modalid="AdvanceModal"><i class="fa fa-undo text-orange"></i></button>';
            strActBtns += '</div></td>';
        }
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblAdv.row.add($(strNewRow)).draw();
            $("input[fldTitle='hdnAdvanceApplied']").val("Yes");
        }
    });

    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getADVDataEditModal() {
    if (!validateADV()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idADVIDEdit").val();
    rowJSON["SNo"] = $("#idADVSNoEdit").val();
    rowJSON["Currency"] = $("#idADVCurrEdit").val();
    rowJSON["Mode"] = $("#idADVModeEdit").val();
    rowJSON["PC"] = $("#idADVPCEdit").val();
    rowJSON["Denomination"] = $("#idADVDenominationEdit").val();
    rowJSON["ExpPayDate"] = $("#idADVExpPayDateEdit").val();
    rowJSON["FCAmount"] = $("#idADVFCAmtEdit").val();
    rowJSON["BaseCurrencyAmount"] = $("#idADVBaseCurrAmtEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateADVRow(strJSON, false);
}
function setADVDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idADVIDEdit", "idADVSNoEdit", "idADVCurrEdit", "idADVModeEdit", "idADVPCEdit", "idADVDenominationEdit","idADVExpPayDateEdit", "idADVFCAmtEdit", "idADVBaseCurrAmtEdit"];
    var fldID = ["idADVID", "idADVSNo", "idADVCurr", "idADVMode", "idADVPC", "idADVDenomination","idADVExpPayDate", "idADVFCAmt", "idADVBaseCurrAmt"];
    var fldAccEditable = ["readonly", "readonly", "disabled", "disabled", "readonly", "readonly","readonly", "readonly", "readonly"];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idADVCurrEdit").change();
    $("#idADVModeEdit").change();
}
function validateADV() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idADVCurrEdit", "idADVModeEdit", "idADVPCEdit", "idADVDenominationEdit","idADVExpPayDateEdit", "idADVFCAmtEdit"];
    var fldName = ["Currency", "Mode", "PC", "Denomination","Expected Payment Date", "FC Amt"];
    var fldType = ["select", "select", "text", "text","text", "number"];
    var fldModal = "AdvanceModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    return true;
}
// Advance Ends
// Refund Starts
function generateRefRow(strJSON, flgIntialLoading) {
    var objJSON = JSON.parse(strJSON);
    var tblRef = null;
    if (flgIntialLoading) {
        tblRef = $('#idTblRef').DataTable();
        tblRef.clear()
        tblRef.draw();
    }
    var strNewRow = "";
    var strActBtns = "";
    $.each(objJSON, function (i, item) {
        strNewRow = '<td class="displaynone"><span class="datacol" prekey="AdvCode" postkey="RefCode">RefundDetails</span><span class="datacol" id="idRefID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="SNo" postkey="SNo" id="idRefSNo">' + item.SNo + '</span>' + item.SNo + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Currency" postkey="Currency" id="idRefCurr">' + item.Currency + '</span>' + item.Currency + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="Mode" postkey="Mode" id="idRefMode">' + item.Mode + '</span>' + item.Mode + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol" prekey="FCAmount" postkey="FCAmount" id="idRefFCAmt">' + item.FCAmount + '</span>' + item.FCAmount + '</td>';
        strNewRow += '<td class="vmiddle amount"><span class="displaynone datacol lcamt" prekey="BaseCurrencyAmount" postkey="BaseCurrencyAmount" id="idRefBaseCurrAmt">' + item.BaseCurrencyAmount + '</span>' + item.BaseCurrencyAmount + '</td>';
        if (IsApplicantLevel == "true") {
            strActBtns = '<td class="center padding0" nowrap>';
            strActBtns += '<div class="center-btn">';
            strActBtns += '<button class="editrow" modalid="RefundModal"><i class="fa fa-pencil text-blue"></i></button>';
            strActBtns += '<button class="deleterow" modalid="RefundModal"><i class="fa fa-trash text-red"></i></button>';
            strActBtns += '<button class="undodel" style="display:none;" modalid="RefundModal"><i class="fa fa-undo text-orange"></i></button>';
            strActBtns += '</div></td>';
        }
        strNewRow += strActBtns;
        if (flgIntialLoading) {
            strNewRow = "<tr>" + strNewRow + "</tr>";
            tblRef.row.add($(strNewRow)).draw();
        }
    });
    if (!flgIntialLoading) {
        return strNewRow;
    }
}
function getRefDataEditModal() {
    if (!validateRef()) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = $("#idRefIDEdit").val();
    rowJSON["SNo"] = $("#idRefSNoEdit").val();
    rowJSON["Currency"] = $("#idRefCurrEdit").val();
    rowJSON["Mode"] = $("#idRefModeEdit").val();
    rowJSON["FCAmount"] = $("#idRefFCAmtEdit").val();
    rowJSON["BaseCurrencyAmount"] = $("#idRefBaseCurrAmtEdit").val();
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateRefRow(strJSON, false);
}
function setRefDataEditModal() {
    //Set Row for editing
    var tr = objSelectedRow;
    var fldEditID = ["idRefIDEdit", "idRefSNoEdit", "idRefCurrEdit", "idRefModeEdit", "idRefFCAmtEdit", "idRefBaseCurrAmtEdit"];
    var fldID = ["idRefID", "idRefSNo", "idRefCurr", "idRefMode", "idRefFCAmt", "idRefBaseCurrAmt"];
    var fldAccEditable = ["readonly", "readonly", "disabled", "disabled", "readonly", "readonly"];
    setAllTravelDataEditModal(tr, fldEditID, fldID, fldAccEditable);
    $("#idRefCurrEdit").change();
}
function validateRef() {
    if (NewRow && NewRowsCnt == 0) {
        return true;
    }
    var fldID = ["idRefCurrEdit", "idRefModeEdit", "idRefFCAmtEdit"];
    var fldName = ["Currency", "Mode", "FC Amt"];
    var fldType = ["select", "select", "text"];
    var fldModal = "RefundModal";
    if (!validateTravelFields(fldID, fldName, fldType, fldModal)) {
        return false;
    }
    return true;
}
// Refund Ends
function getExpTypeTblID(ExpType) {
    var AllExpType = ["Medical", "Mileage", "Miscellaneous", "Visa", "Accommodation", "AirTicketCost", "Communication", "DailyAllowance", "Entertainment", "Passport", "Preparation", "Transportation", "TrainersCost", "Compensation", "ExcessBaggage", "Laundry", "Gift", "AirportTax", "WinterAllowance"];
    var AllExpTblIDs = ["idTblMED", "idTblMIL", "idTblMIS", "idTblVSA", "idTblACC", "idTblATC", "idTblCOM", "idTblDA", "idTblENT", "idTblPAS", "idTblPRP", "idTblTSP", "idTblTRNC", "idTblCA", "idTblEXB", "idTblLAU", "idTblGIFT", "idTblAPT", "idTblWIN"];
    var index = jQuery.inArray(ExpType, AllExpType);
    if (index < 0) {
        return -1;
    }
    return AllExpTblIDs[index]
}
function showExpense(expType) {
    var AllExpID = ["acMedical", "acMileage", "acMiscellaneous", "acVisa", "acAccommodation", "acAirTicketCost", "acCommunication", "acDailyAllowance", "acEntertainment", "acPassport", "acPreparation", "acTransportation", "acTrainersCost", "acCompensation", "acExcessBaggage", "acLaundry", "acGift", "acAirportTax", "acWinterAllowance"];
    AllExpID.splice($.inArray("ac" + expType, AllExpID), 1);
    if (OnlyPostExpTypes.indexOf(expType) != -1 && travelStage == "pre" && IsApplicantLevel == "true") {
        alertModal("Please enter the Summary Amount. Actual claim available only during Post Travel");
        return false;
    }
    else {
        var expPanel = $('#ac' + expType);
        expPanel.find(".ExpenseTitle").text(expenseTypeDisplay[expType].expenseTypeDisplay)
        expPanel.show();
        if (expPanel.find(".panel-wrapper").attr("aria-expanded") == "false") {
            expPanel.find(".panel-heading").find("a[href=#]").click();
        }
        var tblID = getExpTypeTblID(expType);
        if (tblID == "idTblENT") {
            tblID = "idTblENTD";
        }
        if (tblID == "idTblGIFT") {
            tblID = "idTblGIFTD";
        }
        var exptblID = $('#' + tblID).DataTable();
        var rowCntexp = parseInt(exptblID.data().length)
        if (rowCntexp == 0 && IsApplicantLevel == "true") {
            if (tblID != "idTblWIN" && tblID != "idTblPRP") {
                if ($("input[fldtitle='hdnIsExcelUpload']").val() != "Yes") {
                    $('#' + tblID).find(".sum").click();
                }
            }
        }
        $('#' + AllExpID.join(",#")).hide();
    }

    if (expType == arrExpCodes[0].idTblWIN) {
        // Hide the add button if winter allowance data is available..  
        var tableWin = $('#idTblWIN').DataTable();
        var rowCntWin = parseInt(tableWin.data().length)
        if (rowCntWin > 0) {
            $("#idTblWIN").find(".btnWinAdd").hide()
        } else {
            $("#idTblWIN").find(".btnWinAdd").show()
        }
    }
    if (expType == arrExpCodes[0].idTblPRP) {
        // Hide the add button if preperation allowance data is available..  
        var tableWin = $('#idTblPRP').DataTable();
        var rowCntWin = parseInt(tableWin.data().length)
        if (rowCntWin > 0) {
            $("#idTblPRP").find(".btnPRPAdd").hide()
        } else {
            $("#idTblPRP").find(".btnPRPAdd").show()
        }
    }
    return true;
}
$(document).on('click', '#idExpAdd', function (e) {
    e.preventDefault();
    addExpenseType(false);
    var expType = $('#ddlExpType').val();
    return false;
});
$(document).on('click', '.viewrow', function (e) {
    e.preventDefault();
    return false;
});
function isHoliday(dt) {
    return (CalendarDetails.holidays.all.indexOf(dateString(dt)) != -1);
}
function isWeekEnd(dt) {
    return (CalendarDetails.we.indexOf(dateObj(dt).getDay()) != -1);
}
function isWeekDay(dt) {
    return (CalendarDetails.wd.indexOf(dateObj(dt).getDay()) != -1);
}
function isCompanyHoliday(dt) {
    return (CalendarDetails.holidays.ch.indexOf(dateString(dt)) != -1);
}
function isPublicHoliday(dt) {
    return (CalendarDetails.holidays.ph.indexOf(dateString(dt)) != -1);
}
function dateString(dt) {
    if (moment.isMoment(dt)) {
        dt = dt.format(displayDateFormat);
    } else if (dt.constructor) {
        dt = dt.constructor === Date ? moment(dt).format(displayDateFormat) :
        dt.constructor === String ? (moment(dt, displayDateFormat).isValid() ? dt : "Invalid date") :
        "Invalid date";
    } else {
        dt = "Invalid date";
    }
    return dt;
}
function dateObj(dt) {
    if (moment.isMoment(dt)) {
        dt = dt.toDate();
    } else if (dt.constructor) {
        dt = dt.constructor === String ? moment(dt, displayDateFormat).toDate() :
        dt.constructor === Date ? dt : new Date("");
    } else {
        dt = new Date("");
    }
    return dt;
}
function dateObjOffset(dtStr) {
    var offset = parseInt($("input[fldTitle='hdnOffSet']").val());
    return moment(moment.utc(dtStr).utcOffset(offset).format(displayDateFormat), displayDateFormat).toDate();
}
function calculateRefundAmt() {
    var exRate = outputNumber($("#idRefExRateEdit").val());
    var fcAmt = $("#idRefFCAmtEdit").val();
    if (exRate > 0 && fcAmt > 0) {
        $("#idRefBaseCurrAmtEdit").val(outputMoney(fcAmt * exRate));
    }
    else {
        $("#idRefBaseCurrAmtEdit").val(outputMoney(0));
    }
}
function calculateAdvanceAmt() {
    var PCVal = $("#idADVPCEdit").val();
    var DenoVal = $("#idADVDenominationEdit").val();
    var mode = $("#idADVModeEdit").val();
    var fcAmt = $("#idADVFCAmtEdit").val();
    //var exRate = getExchangeRate("#idADVCurrEdit",$("#idAdvExRateEdit"),"AdvanceModal");
    var exRate = outputNumber($("#idAdvExRateEdit").val());
    if (mode != "Cash") {
        if (!!fcAmt && fcAmt > 0) {
            $("#idADVBaseCurrAmtEdit").val(outputMoney(fcAmt * exRate));
        }
        else {
            $("#idADVFCAmtEdit").val(outputMoney(0));
            $("#idADVBaseCurrAmtEdit").val(outputMoney(0));
        }
    }
    else {
        if (PCVal != "" && DenoVal != "" && PCVal > 0 && DenoVal > 0 && exRate > 0) {
            $("#idADVFCAmtEdit").val(outputMoney(PCVal * DenoVal));
            $("#idADVBaseCurrAmtEdit").val(outputMoney(PCVal * DenoVal * exRate));
        }
        else {
            $("#idADVFCAmtEdit").val(outputMoney(0));
            $("#idADVBaseCurrAmtEdit").val(outputMoney(0));
        }
    }
}
function showHideAdvTable(flgShow) {
    if (flgShow) {
        $("#advanceDataTable").show();
        $("#lnkPrintAdvance").show();
        $("input[fldTitle='hdnAdvanceApplied']").val("Yes");
    }
    else {
        $("#advanceDataTable").hide();
        $("#lnkPrintAdvance").hide();
        $("#idChkAdvance").attr("checked", false);
        $('#idTblADV>tbody>tr').find('.deleterow').each(function () {
            $(this).click();
        });
        $("input[fldTitle='hdnAdvanceApplied']").val("No");
    }
}
function calculateSettlementDays() {
    finDate = $("#settlementDate").val();
    var lastRow = $('#idTblTSH tbody tr:last');
    var objArrDate = lastRow.find("#idTSHArrDate");
    postArrDate = objArrDate.text();
    var holidays = CalendarDetails.holidays.all;
    var dtFrom = formatDate(postArrDate);
    var dtTo = formatDate(finDate);
    dtFrom.setHours(12, 0, 0, 0);
    dtTo.setHours(12, 0, 0, 0);
    var days = 0;
    var tmpDtFrom = dtFrom;
    tmpDtFrom.setDate(tmpDtFrom.getDate() + 1);	//Caluculate from Next Day
    var daysDiff = (dtTo - tmpDtFrom) / 8.64e7;
    while (daysDiff >= 0) {
        if (!isWeekEnd(tmpDtFrom)) {
            if (!isHoliday(tmpDtFrom)) {
                days++;
            }
        }
        tmpDtFrom.setDate(tmpDtFrom.getDate() + 1);
        daysDiff = (dtTo - tmpDtFrom) / 8.64e7;
    }
    var SettleDays = parseInt($("input[fldTitle='hdnAdvanceSettlementDays']").val());
    if (days > SettleDays)
        $("input[fldTitle='hdnNoOfDelay']").val(days - SettleDays);
    else
        $("input[fldTitle='hdnNoOfDelay']").val(0);
    $("#settlementDays").text(days)
}
function getGLCodeTaxCode(expType) {
    var returnVal = "NA";
    if (activeTravelType == "") {
        alertModal("Please select Travel Type in TravelInfo Tab before adding expenses");
        if (!$('#menu-travelInfo').hasClass('active')) {
            validTab("menu-travelInfo", "travelInfo");
        }
        expandPanelInValidation("travelInfo");
        $("#idTravelType").find("input[type=checkbox]").focus();
        returnVal = "";
    } else {
        var exp = ExpenseDetails[expType];
        returnVal = exp.mainGLCode[activeTravelType] + "~" + exp.taxCode[activeTravelType];
    }
    return returnVal;
}
function addExpenseType(argForDA) {
    if (argForDA == undefined) {
        argForDA == false;
    }
    var expType = $('#ddlExpType').val();
    if (expType == "Select") {
        alertModal("Please choose the expense type.");
        return false;
    }
    if (expType == arrExpCodes[0].idTblWIN) {
        if (!winterAllowance("addExpense")) {
            return false;
        }
    }
    if (expType == arrExpCodes[0].idTblPRP) {
        if (!prepAllowance("addExpense")) {
            return false;
        }
    }
    var flgPresent = false;
    var expTypeDisplay = $('#ddlExpType option:selected').text();
    $('#idTblEXP tbody tr').each(function () {
        if ($(this).find("#idExpType").text() == expType) {
            flgPresent = true;
            return false;
        }
    });
    if (flgPresent) {
        if (!argForDA) {
            alertModal("Selected expense type is already added.");
        }
        return false;
    }
    var GLCode_TaxCode = getGLCodeTaxCode(expType)
    if (GLCode_TaxCode == "NA" || GLCode_TaxCode == "~") {
        alertModal("GLCode  not configured for " + expTypeDisplay + " . Please contact administrator");
        return false
    }
    if (GLCode_TaxCode == "" && !argForDA) {
        return false;
    }
    var objJSON = [];
    var rowJSON = {};
    rowJSON["ID"] = "";
    rowJSON["ExpType"] = expType;
    rowJSON["ExpTypeDisplay"] = expTypeDisplay;
    rowJSON["GLCode"] = GLCode_TaxCode.split("~")[0];
    rowJSON["TaxCode"] = GLCode_TaxCode.split("~")[1];
    rowJSON["PreLCAmt"] = $("#idExpPreLCAmt").val() == undefined || $("#idExpPreLCAmt").val() == "" ? "0.00" : $("#idExpPreLCAmt").val();
    rowJSON["PostLCAmt"] = $("#idExpPostLCAmt").val() == undefined || $("#idExpPostLCAmt").val() == "" ? "0.00" : $("#idExpPostLCAmt").val();
    rowJSON["Remarks"] = "";
    expenseTypeDisplay[expType] = {
        expenseType: expType,
        expenseTypeDisplay: expTypeDisplay
    }
    if (TicketArrangedByExp.indexOf(expType) != -1) {
        expenseTypeObj[expType + "Company"] = {
            expType: expType + "Company",
            expTypeDisplay: expTypeDisplay + " By Company",
            preLCAmt: $("#idExpPreLCAmt").val() == undefined || $("#idExpPreLCAmt").val() == "" ? "0.00" : $("#idExpPreLCAmt").val(),
            postLCAmt: $("#idExpPostLCAmt").val() == undefined || $("#idExpPostLCAmt").val() == "" ? "0.00" : $("#idExpPostLCAmt").val(),
            isPaidByCompany: true,
            isHRIQExp: false
        };
        expenseTypeObj[expType + "Employee"] = {
            expType: expType + "Employee",
            expTypeDisplay: expTypeDisplay + " By Employee",
            preLCAmt: $("#idExpPreLCAmt").val() == undefined || $("#idExpPreLCAmt").val() == "" ? "0.00" : $("#idExpPreLCAmt").val(),
            postLCAmt: $("#idExpPostLCAmt").val() == undefined || $("#idExpPostLCAmt").val() == "" ? "0.00" : $("#idExpPostLCAmt").val(),
            isPaidByCompany: false,
            isHRIQExp: (HRIQExpenses.indexOf(expType.toLowerCase()) != -1)
        };
    } else { //ERP section
        expenseTypeObj[expType] = {
            expType: expType,
            expTypeDisplay: expTypeDisplay,
            preLCAmt: $("#idExpPreLCAmt").val() == undefined || $("#idExpPreLCAmt").val() == "" ? "0.00" : $("#idExpPreLCAmt").val(),
            postLCAmt: $("#idExpPostLCAmt").val() == undefined || $("#idExpPostLCAmt").val() == "" ? "0.00" : $("#idExpPostLCAmt").val(),
            isPaidByCompany: false,
            isHRIQExp: (HRIQExpenses.indexOf(expType.toLowerCase()) != -1)
        };
    }
    objJSON.push(rowJSON);
    var strJSON = JSON.stringify(objJSON);
    return generateExpRow(strJSON, false);
}
function deleteObjKey(expType) {
    if (TicketArrangedByExp.indexOf(expType) != -1) {
        delete expenseTypeObj[expType + "Company"];
        delete expenseTypeObj[expType + "Employee"];
    } else {
        delete expenseTypeObj[expType];
    }
}
function updateLCAmt(event, key, valuekey) {
    if (travelStage == "post") {
        return;
    }
    if ($(event).val() < 0) {
        alertModal("Amount cannot be less than Zero.");
        $(event).val(outputMoney(0));
        $(event).focus();
        fldToFocus = $(event);
        return false;
    }
    $(event).val(outputMoney($(event).val()));
    event.previousSibling.innerHTML = $(event).val();
    calculateTotalSummaryAmt();
    if (OnlyPostExpTypes.indexOf(key) != -1 && TicketArrangedByExp.indexOf(key) != -1) {
        if (expArranged.byCompany(key)) {
            expenseTypeObj[key + "Employee"][valuekey] = outputMoney(0);
            expenseTypeObj[key + "Company"][valuekey] = $(event).val();
        } else {
            expenseTypeObj[key + "Employee"][valuekey] = $(event).val();
            expenseTypeObj[key + "Company"][valuekey] = outputMoney(0);
        }
    }
    else if (TicketArrangedByExp.indexOf(key) == -1) {
        expenseTypeObj[key][valuekey] = $(event).val();
    }
    calculateExclPrePostTotalAmt();
}
function setRemarksValue(fld) {
    fld.siblings("span").text(fld.val());
}
function generateExpRow(strJSON) {
    var objJSON = JSON.parse(strJSON);
    var strNewRow = "";
    var btndisable = "";
    $.each(objJSON, function (i, item) {
        btncolor = "blue";
        btndisable = "";
        if (OnlyPostExpTypes.indexOf(item.ExpType) != -1 && travelStage == "pre") {
            btndisable = "disabled";
            btncolor = "grey";
        }
        if (OnlyPostExpTypes.indexOf(item.ExpType) != -1 && travelStage == "pre" && IsApplicantLevel == "true") {
            postClassName = "";
        }
        else {
            postClassName = strReadOnly
        }
        var PreLCAmt = outputMoney(item.PreLCAmt);
        var PostLCAmt = outputMoney(item.PostLCAmt);
        strNewRow = '<td class="displaynone"><span class="datacol" id="idEXPID" prekey="ID" postkey="ID">' + item.ID + '</span>' + item.ID + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="ExpType" postkey="ExpType" id="idExpType">' + item.ExpType + '</span><span class="displaynone datacol"  prekey="ExpTypeDisplay" postkey="ExpTypeDisplay" id="idExpTypeDisplay">' + item.ExpTypeDisplay + '</span>' + item.ExpTypeDisplay + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="GLCode" postkey="GLCode"  id="idExpGLCode">' + item.GLCode + '</span>' + item.GLCode + '</td>';
        strNewRow += '<td class="vmiddle"><span class="displaynone datacol" prekey="TaxCode" postkey="TaxCode"  id="idExpTaxCode">' + item.TaxCode + '</span>' + item.TaxCode + '</td>';
        strNewRow += '<td class="amount vmiddle" style="width: 10%;background-color:white"><span class="displaynone datacol lcamt" prekey="PreLCAmt" postkey="PreLCAmt"  id="idExpPreLCAmt">' + PreLCAmt + '</span><input class="form-control text-right amount" ' + postClassName + ' type="text" onblur=updateLCAmt(this,"' + item.ExpType + '","preLCAmt"); style="width:100%" value="' + PreLCAmt + '" /></td>';
        strNewRow += '<td class="amount vmiddle" style="width: 10%;background-color:white"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt"  id="idExpPostLCAmt">' + PostLCAmt + '</span><input class="form-control text-right amount" readonly type="text" style="width:100%" value="' + PostLCAmt + '" /></td>';
        //strNewRow += '<td class="amount vmiddle" style="width: 10%;"><span class="displaynone datacol lcamt" prekey="PostLCAmt" postkey="PostLCAmt"  id="idExpPostLCAmt">' + PostLCAmt + '</span>' + PostLCAmt + '</td>';
        strNewRow += '<td class="vmiddle" style="background-color:white"><span class="displaynone datacol" prekey="Remarks" postkey="Remarks"  id="idExpRemarks">' + item.Remarks + '</span><input id="idExpRemarksText" class="form-control txtCtrl" type="text" style="width:98%" onChange="setRemarksValue($(this))"  value="' + item.Remarks + '" /></td>';
        strNewRow += '<td class="center padding0" nowrap>';
        strNewRow += '<div class="center-btn">';
        strNewRow += '<button class="viewrow" ' + btndisable + ' onclick=\'showExpense("' + item.ExpType + '")\' ><i class="fa fa-pencil text-' + btncolor + '"></i></button>';

        if (IsApplicantLevel == "true") {
            btncolor = "red";
            btndisable = "";
            if (item.ExpType == "DailyAllowance" || (travelStage == "post" && item.PreCreated == "1" && PreLCAmt != 0)) {
                btncolor = "grey";
                btndisable = "disabled";
            }
            strNewRow += '<button class="deleterow" ' + btndisable + '><i class="fa fa-trash text-' + btncolor + '"></i><input type="hidden" class="expenseTypeKey" value="' + item.ExpType + '"></button>';
        }
        strNewRow += '<button class="undodel" style="display:none;"><i class="fa fa-undo text-orange"></i></button>';
        strNewRow += '</div></td>';
        $('#idTblEXP tbody').append("<tr expCode='" + item.ExpType + "'>" + strNewRow + "</tr>");
    });
}
function createPaymentSummary() {
    var keyArray = Object.keys(expenseTypeObj);
    var tempObj = {
    };
    var strNewRow = "";
    var strNewRowGrand = "";
    var strNewRowHRIQ = "";
    var diffAmt = 0;
    var allPreAmt = 0;
    var allPostAmt = 0;
    var grandallPreAmt = 0;
    var grandallPostAmt = 0;
    var HRIQallPreAmt = 0;
    var HRIQallPostAmt = 0;
    var row_id = "";
    var strExp = "";
    var psGLCode = "";
    for (var i = 0; i < keyArray.length; i++) {
        tempObj = expenseTypeObj[keyArray[i]];
        row_id = "payment_" + keyArray[i];
        strExp = tempObj.expType;
        if (tempObj.expType != "AdvanceDetails" && tempObj.expType != "RefundDetails") {

            var expType = strExp.replace(/(Company)|(Employee)/ig, "");

            var expRow = $("tr[expcode='" + expType + "']");
            if (expRow.length > 0) {
                psGLCode = $.trim(expRow.find("#idExpGLCode").text());
            }
            diffAmt = parseFloat(outputNumber(tempObj.preLCAmt)) - parseFloat(outputNumber(tempObj.postLCAmt));

            grandallPreAmt += parseFloat(outputNumber(tempObj.preLCAmt));
            grandallPostAmt += parseFloat(outputNumber(tempObj.postLCAmt));

            if (!tempObj.isPaidByCompany) { // Paid By Employee Rows
                if (tempObj.isHRIQExp) {
                    HRIQallPreAmt += parseFloat(outputNumber(tempObj.preLCAmt));
                    HRIQallPostAmt += parseFloat(outputNumber(tempObj.postLCAmt));
                }
                allPreAmt += parseFloat(outputNumber(tempObj.preLCAmt));
                allPostAmt += parseFloat(outputNumber(tempObj.postLCAmt));
                strNewRow += '<tr id=' + row_id + '><td class="vmiddle">' + tempObj.expTypeDisplay + '</td>';
                strNewRow += '<td class="amount vmiddle" style="text-align: right;">' + outputMoney(tempObj.preLCAmt) + '</td>';
                strNewRow += '<td class="amount vmiddle" style="text-align: right;">' + outputMoney(tempObj.postLCAmt) + '</td>';
                strNewRow += '<td class="amount vmiddle" style="text-align: right;' + (diffAmt < 0 ? "color:red" : "") + '">' + outputMoney(diffAmt) + '</td>';
                strNewRow += '<td style="display: flex; justify-content: center;align-items: center;">' + psGLCode + '</td></tr>';
            } else { // Paid By Company Rows
                strNewRowGrand += '<tr id=' + row_id + '><td class="vmiddle">' + tempObj.expTypeDisplay + '</td>';
                strNewRowGrand += '<td class="amount vmiddle" style="text-align: right;">' + outputMoney(tempObj.preLCAmt) + '</td>';
                strNewRowGrand += '<td class="amount vmiddle" style="text-align: right;">' + outputMoney(tempObj.postLCAmt) + '</td>';
                strNewRowGrand += '<td class="amount vmiddle" style="text-align: right;' + (diffAmt < 0 ? "color:red" : "") + '">' + outputMoney(diffAmt) + '</td>';
                strNewRowGrand += '<td style="display: flex; justify-content: center;align-items: center;">' + psGLCode + '</td></tr>';
            }
        }
    }
    // Sub Total
    strNewRow += '<tr class="clssubhead" style="background-color: #edf1f9;"><td style="font-weight:bold;">Sub Total</td>';
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(allPreAmt) + '</td>';
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(allPostAmt) + '</td>';
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;' + (allPreAmt - allPostAmt < 0 ? "color:red" : "") + '">' + outputMoney(allPreAmt - allPostAmt) + '</td><td></td></tr>';
    // Paid By Company
    strNewRow += strNewRowGrand;
    // Grand Total
    strNewRow += '<tr class="clssubhead" style="background-color: #edf1f9;"><td style="font-weight:bold;">Grand Total</td>';
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(grandallPreAmt) + '</td>';
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(grandallPostAmt) + '</td>';
    var grandTotDiff = outputMoney(grandallPreAmt - grandallPostAmt);
    $("input[fldtitle='hdnPSGrandTotDiff']").val(grandTotDiff);
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;' + (grandallPreAmt - grandallPostAmt < 0 ? "color:red" : "") + '">' + grandTotDiff + '</td><td></td></tr>';
    // Advance Amount
    strNewRow += '<tr><td style="">Less Advance</td><td></td>';
    var tempAmt = travelStage == "pre" ? tempAmt = 0 : outputNumber(expenseTypeObj.AdvanceDetails.advanceAmt);
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(tempAmt) + '</td><td></td><td></td></tr>';
    // Refund Advance
    strNewRow += '<tr><td style="">Add Refund Advance Amt & Cheque</td><td></td>'
    tempAmt = travelStage == "pre" ? tempAmt = 0 : outputNumber(expenseTypeObj.RefundDetails.RefundAmt);
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(tempAmt) + '</td><td></td><td></td></tr>';
    // Net Payable to Staff = Sub Total - Advance Taken + Refund Amount
    strNewRow += '<tr class="clssubhead" style="background-color: #edf1f9;"><td style="font-weight:bold;">Net Payable to Staff / Company</td><td></td>';
    tempAmt = travelStage == "pre" ? tempAmt = 0 : outputNumber(allPostAmt) - outputNumber(expenseTypeObj.AdvanceDetails.advanceAmt) + outputNumber(expenseTypeObj.RefundDetails.RefundAmt);
    strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;' + (tempAmt < 0 ? "color:red" : "") + '">' + outputMoney(tempAmt) + '</td><td></td><td></td></tr>';
    // HRIQ section
    //strNewRow += '<tr class="clssubhead" style="background-color: #edf1f9;"><td style="font-weight:bold;">Pay through Payroll</td><td></td>';
    //tempAmt = travelStage == "pre" ? tempAmt = 0 : HRIQallPostAmt;
    //strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(tempAmt) + '</td><td></td><td></td></tr>';
    //strNewRow += '<tr class="clssubhead" style="background-color: #edf1f9;"><td style="font-weight:bold;">Pay through Finance</td><td></td>'
    //tempAmt = travelStage == "pre" ? tempAmt = 0 : allPostAmt - HRIQallPostAmt;
    //strNewRow += '<td class="amount vmiddle" style="text-align: right;font-weight:bold;">' + outputMoney(tempAmt) + '</td><td></td><td></td></tr>';

    $('#tblPaymentSummary tbody').html("");
    $('#tblPaymentSummary tbody').html(strNewRow);
    generateExpRemSection();
    if (isAccountsLevel == "Yes" || IsApplicantLevel == "true") {
        getTravelExpBudget();
    }
}
function generateExpRemSection() {
    var strNewRowExpRemark = "";
    var row_id = "";
    $("#idTblEXP  >tbody >tr").each(function () {
        strNewRowExpRemark += '<tr id=' + row_id + '><td class="vmiddle">' + $.trim($(this).find("#idExpType").text()) + '</td>';
        strNewRowExpRemark += '<td vmiddle">' + $.trim($(this).find("#idExpRemarksText").val()) + '</td>';
    });
    $('#tblExpenseRemark tbody').html("");
    $('#tblExpenseRemark tbody').html(strNewRowExpRemark);
}
function loadDataTables() {
    //Travel Schedule Start
    var tblTSH = $('#idTblTSH').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnTSHAdd').on('click', function (e) {
        if (!activeTravelType) {
            alertModal("Please select Travel Type before adding new trip.");
            $("#idTravelType").find("input[type=checkbox]").focus();
            fldToFocus = $("#idTravelType").find("input[type=checkbox]");
            return false;
        }
        var objSched = objSchedCountryCity(false);
        if (objSched.travelledTrips == objSched.validTrips) {
            addNewItem('TSHModal', 'idTblTSH');
        }
        else {
            alertModal("Please fill the details in existing trips before adding new trip.");
            return false;
        }
        e.preventDefault();
    });
    //Travel Schedule End    
    //MEDICAL EXPENSE Start
    var tblMED = $('#idTblMED').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnMEDAdd').on('click', function (e) {
        addNewItem('MEDModal', 'idTblMED');
        e.preventDefault();
    });
    //MEDICAL EXPENSE ENDS	
    //MILEAGE  & OTHER EXPENSE Start
    var tblMIL = $('#idTblMIL').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnMILAdd').on('click', function (e) {
        addNewItem('MILModal', 'idTblMIL');
        e.preventDefault();
    });
    var tblOTH = $('#idTblOTH').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnOTHAdd').on('click', function (e) {
        addNewItem('OTHModal', 'idTblOTH');
        e.preventDefault();
    });
    //OTHERS EXPENSE ENDS	
    //VISA Claim Start
    var tblVSA = $('#idTblVSA').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnVSAAdd').on('click', function (e) {
        addNewItem('VSAModal', 'idTblVSA');
        e.preventDefault();
    });
    //VISA Claim End
    //Miscellaneous Start
    var tblMIS = $('#idTblMIS').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnMISAdd').on('click', function (e) {
        addNewItem('MISModal', 'idTblMIS');
        e.preventDefault();
    });
    //Miscellaneous End
    //Accommodation Travel Start
    var tblACC = $('#idTblACC').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnACCAdd').on('click', function (e) {
        addNewItem('ACCModal', 'idTblACC');
        e.preventDefault();
    });
    //Accommodation Travel End
    //Air Ticket Cost Start
    var tblATC = $('#idTblATC').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnATCAdd').on('click', function (e) {
        addNewItem('ATCModal', 'idTblATC');
        e.preventDefault();
    });
    //Air Ticket Cost End
    //Communication Travel Start
    var tblCOM = $('#idTblCOM').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnCOMAdd').on('click', function (e) {
        addNewItem('COMModal', 'idTblCOM');
        e.preventDefault();
    });
    //Communication Travel End
    //DailyAllowance Travel Start
    var tblDA = $('#idTblDA').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnDAAdd').on('click', function (e) {
        addNewItem('DAModal', 'idTblDA');
        e.preventDefault();
    });
    //DailyAllowance Travel Ends 
    //Entertainment Expense Start
    var tblENT = $('#idTblENT').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnENTAdd').on('click', function (e) {
        addNewItem('ENTModal', 'idTblENT');
        e.preventDefault();
    });
    //Entertainment Expense End	
    //Entertainment Details Start
    var tblENTD = $('#idTblENTD').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnENTDAdd').on('click', function (e) {
        addNewItem('ENTDModal', 'idTblENTD');
        e.preventDefault();
    });
    //Entertainment Details End
    //Passport Claim Start
    var tblPAS = $('#idTblPAS').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnPASAdd').on('click', function (e) {
        addNewItem('PASModal', 'idTblPAS');
        e.preventDefault();
    });
    //Passport Claim End
    //Preparation Claim Start
    var tblPRP = $('#idTblPRP').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnPRPAdd').on('click', function (e) {
        addNewItem('PRPModal', 'idTblPRP');
        e.preventDefault();
    });
    //Preparation Claim End
    //Transportation Starts
    var tblTSP = $('#idTblTSP').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnTSPAdd').on('click', function (e) {
        addNewItem('TSPModal', 'idTblTSP');
        e.preventDefault();
    });
    //Transportation Ends
    //Compensation Allownace  Starts
    var tblCA = $('#idTblCA').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnCAAdd').on('click', function (e) {
        addNewItem('CAModal', 'idTblCA');
        e.preventDefault();
    });
    //Compensation Allownace  Ends      
    //Trainers Cost Starts                                                     
    var tblTRNC = $('#idTblTRNC').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnTRNCAdd').on('click', function (e) {
        addNewItem('TRNCModal', 'idTblTRNC');
        e.preventDefault();
    });
    //Trainers Cost Ends
    //Excess Baggage Claim Start
    var tblEXB = $('#idTblEXB').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnEXBAdd').on('click', function (e) {
        addNewItem('EXBModal', 'idTblEXB');
        e.preventDefault();
    });
    //Excess Baggage Claim End
    //ETravel Laundry Start
    var tblLAN = $('#idTblLAU').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnLANAdd').on('click', function (e) {
        addNewItem('LAUModal', 'idTblLAU');
        e.preventDefault();
    });
    //ETravel Laundry End
    //AIRPORT TAX EXPENSE Start
    var tblAPT = $('#idTblAPT').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnAPTAdd').on('click', function (e) {
        addNewItem('APTModal', 'idTblAPT');

        e.preventDefault();
    });
    //AIRPORT TAX EXPENSE ENDS	
    //GIFT Expense Start
    var tblGIFT = $('#idTblGIFT').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnGIFTAdd').on('click', function (e) {
        addNewItem('GIFTModal', 'idTblGIFT');
        e.preventDefault();
    });
    //GIFT Expense End	
    //GIFT Details Start
    var tblGIFTD = $('#idTblGIFTD').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnGIFTDAdd').on('click', function (e) {
        addNewItem('GIFTDModal', 'idTblGIFTD');
        e.preventDefault();
    });
    //GIFT Details End
    //Accounting Enteries Start
    var tblACCENT = $('#idTblACCENT').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnACCENTAdd').on('click', function (e) {
        addNewItem('ACCENTModal', 'idTblACCENT');
        e.preventDefault();
    });
    //Accounting Enteries Ends
    //My Exchange Rate Start
    var tblMYEXCH = $('#idTblMYEXCH').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnMYEXCHAdd').on('click', function (e) {
        addNewItem('MYEXCHModal', 'idTblMYEXCH');
        e.preventDefault();
    });
    //My Exchange Rate End
    //Advance Start
    var tblAdv = $('#idTblADV').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnAdvAdd').on('click', function (e) {
        addNewItem('AdvanceModal', 'idTblADV');
        e.preventDefault();
    });
    //Refund Start
    var tblRef = $('#idTblRef').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnRefAdd').on('click', function (e) {
        addNewItem('RefundModal', 'idTblRef');
        e.preventDefault();
    });
    //Winter Start
    var tblWin = $('#idTblWIN').DataTable({
        "lengthChange": false,
        "bFilter": false,
        "pageLength": 10,
        "ordering": false
    });
    $('.btnWinAdd').on('click', function (e) {
        addNewItem('WINModal', 'idTblWIN');
        e.preventDefault();
    });

    loadTravelEntries();
    traverseRow();
}
var strJSONExpDetails = "[]";
var strJSONExpEntries = "[]";
var objJSONExpDetails = [];
var objJSONExpEntries = [];
var objJSONTSHEntries = [];
var strJSONExpSummary = "[]";
var objJSONExpSummary = [];
var objJSONAdvEntries = [];
var objJSONRefEntries = [];
var expLoad = {
    expLoaded: false,
    advLoaded: false,
    refLoaded: false,
    hriqLoaded: false,
    expObjInit: false,
    loadExpObj: function () { return (this.expLoaded && this.advLoaded && this.refLoaded && this.hriqLoaded) && !this.expObjInit }
}
function loadTravelEntries() {
    if (linkKey == "") {
        return;
    }
    displayManualExRate();
    //TRAVEL SCHEDULE
    getTravelEntriesJSON("TravelSchedule", linkKey, function (resStrJSON) {
        var strJSON = resStrJSON;
        objJSONTSHEntries = JSON.parse(strJSON);
        generateTSHRow(strJSON, true);
        showPreCols('idTblTSH', false, true);
        enableDisableRadioLinked('idTblTSH');
    });
    getTravelEntriesJSON("ExpenseDetailEntries", linkKey, function (resStrJSON) {
        strJSONExpDetails = resStrJSON;
        objJSONExpDetails = JSON.parse(strJSONExpDetails);
        getTravelEntriesJSON("ExpenseEntries", linkKey, function (resStrJSON2) {
            strJSONExpEntries = resStrJSON2;
            objJSONExpEntries = JSON.parse(strJSONExpEntries)
            //MEDICAL EXPENSE
            var strJSON = queryExpEntries("Medical", false);
            generateMEDRow(strJSON, true);
            //MILEAGE
            strJSON = queryExpEntries("Mileage", false);
            generateMILRow(strJSON, true);
            //OTHER EXPENSE
            strJSON = queryExpEntries("Others", false);
            generateOTHRow(strJSON, true);
            //VISA Claim 
            strJSON = queryExpEntries("Visa", false);
            generateVSARow(strJSON, true);
            showPreCols('idTblVSA', false, true);
            //Miscellaneous
            strJSON = queryExpEntries("Miscellaneous", false);
            generateMISRow(strJSON, true);
            //Accommodation 
            strJSON = queryExpEntries("Accommodation", false);
            generateACCRow(strJSON, true);
            //Air Ticket Cost
            strJSON = queryExpEntries("AirTicketCost", false);
            generateATCRow(strJSON, true);
            showPreCols('idTblATC', false, true);
            //Communication
            strJSON = queryExpEntries("Communication", false);
            generateCOMRow(strJSON, true);
            //DailyAllowance
            strJSON = queryExpEntries("DailyAllowance", false);
            generateDARow(strJSON, true);
            showPreCols('idTblDA', false, true);
            //Entertainment Expense
            strJSON = queryExpEntries("Entertainment", false);
            generateENTRow(strJSON, true);
            showPreCols('idTblENT', false, true);
            //Entertainment Details
            strJSON = queryExpEntries("EntertainmentDetails", true);
            generateENTDRow(strJSON, true);
            //Passport Claim
            strJSON = queryExpEntries("Passport", false);
            generatePASRow(strJSON, true);
            //Preparation Claim 
            strJSON = queryExpEntries("Preparation", false);
            generatePRPRow(strJSON, true);
            showPreCols('idTblPRP', false, true);
            //Transportation 
            strJSON = queryExpEntries("Transportation", false);
            generateTSPRow(strJSON, true);
            //Compensation Allownace
            strJSON = queryExpEntries("Compensation", false);
            generateCARow(strJSON, true);
            //Trainers Cost
            strJSON = queryExpEntries("TrainersCost", false);
            generateTRNCRow(strJSON, true);
            showPreCols('idTblTRNC', false, true);
            //Excess Baggage Claim
            strJSON = queryExpEntries("ExcessBaggage", false);
            generateEXBRow(strJSON, true);
            showPreCols('idTblEXB', false, true);
            //ETravel Laundry
            strJSON = queryExpEntries("Laundry", false);
            generateLANRow(strJSON, true);
            showPreCols('idTblLAU', false, true);
            //AIRPORT TAX EXPENSE
            strJSON = queryExpEntries("AirportTax", false);
            generateAPTRow(strJSON, true);
            //GIFT Expense
            strJSON = queryExpEntries("Gift", false);
            generateGIFTRow(strJSON, true);
            showPreCols('idTblGIFT', false, true);
            //GIFT Details
            strJSON = queryExpEntries("GiftDetails", true);
            generateGIFTDRow(strJSON, true);
            //WINTER ALLOWANCE
            strJSON = queryExpEntries("WinterAllowance", false);
            generateWINRow(strJSON, true);
            showPreCols('idTblWIN', false, true);
            //Accounting Entry
            strJSON = queryExpEntries("AccountingEntry", false);
            generateACCENTRow(strJSON, true);
            expLoad.expLoaded = true;
            if (expLoad.loadExpObj()) {
                initExpObjOnLoad()
            }
        });
    });
    //EXPENSE SUMMARY
    getTravelEntriesJSON("ExpenseSummary", linkKey, function (resStrJSON) {
        var strJSON = resStrJSON;
        objJSONExpSummary = JSON.parse(strJSON);
        generateExpRow(strJSON, true);
        $("#idTblEXP").find("input[class*='txtCtrl']").prop("readonly", true);
        if ((docStatus.trim() == "" || docStatus == "New" || docStatus == "Draft" || docStatus == "RFI") && IsApplicantLevel == "true") {
            $("#idTblEXP").find("input[class*='txtCtrl']").prop("readonly", false);
        }
    });
    // Advance Entry
    getTravelEntriesJSON("AdvanceEntries", linkKey, function (resStrJSON) {
        var strJSON = resStrJSON;
        objJSONAdvEntries = JSON.parse(strJSON);
        generateADVRow(strJSON, true);
        expLoad.advLoaded = true;
        if (expLoad.loadExpObj()) {
            initExpObjOnLoad()
        }
    });
    // Refund Entry
    getTravelEntriesJSON("RefundEntries", linkKey, function (resStrJSON) {
        var strJSON = resStrJSON;
        objJSONRefEntries = JSON.parse(strJSON);
        generateRefRow(strJSON, true);
        expLoad.refLoaded = true;
        if (expLoad.loadExpObj()) {
            initExpObjOnLoad()
        }
    });
    generateBudgetTbl(true);
}
//Get the Travel Entries from Server - Starts
function getTravelEntriesJSON(listName, linkKey, fnCallBack) {
    var strResultJSON = "[]";
    var offset = 0;
    offset = parseInt($("input[fldTitle='hdnOffSet']").val()); //CET offset
    var DateCols = ["PreDepDate", "PreArrDate", "PostDepDate", "PostArrDate", "LastClaimDate", "InvoiceDate", "FromDate", "ToDate", "PreExpDate", "PostExpDate", "PostReceiptDate", "PreStartDate", "PostStartDate", "PreEndDate", "PostEndDate"];
    $.ajax
    ({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + listName + "')/Items?$filter=LinkKey/LinkKey eq '" + linkKey + "'",
        type: "GET",
        async: true,
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            $.each(data.d.results, function (key, value) {
                delete value.__metadata;
                delete value.FirstUniqueAncestorSecurableObject;
                delete value.RoleAssignments;
                delete value.AttachmentFiles;
                delete value.ContentType;
                delete value.GetDlpPolicyTip;
                delete value.FieldValuesAsHtml;
                delete value.FieldValuesAsText;
                delete value.FieldValuesForEdit;
                delete value.File;
                delete value.Folder;
                delete value.ParentList;
                delete value.FileSystemObjectType;
                delete value.ContentTypeId;
                delete value.GUID;
                delete value.Attachments;
                delete value.OData__UIVersionString;
                delete value.Modified;
                delete value.Created;
                delete value.AuthorId;
                delete value.EditorId;
                $.each(DateCols, function (index, colName) {
                    if (value.hasOwnProperty(colName)) {
                        if (value[colName] != null) {
                            var objDateCol = value[colName];
                            value[colName] = (objDateCol == "") ? objDateCol : moment.utc(objDateCol).utcOffset(offset).format("DD/MM/YYYY");
                        }
                    }
                });
            });
            strResultJSON = JSON.stringify(data.d.results);
            strResultJSON = strResultJSON.replace(/:null/g, ":\"\"");
            fnCallBack(strResultJSON);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
            return strResultJSON;
        }
    });
    return strResultJSON;
}
//Get the Travel Entries from Server - Ends
//Query Entries base on Expense Code - Starts
function queryExpEntries(argExpCode, argIsExpDetails) {
    var resultJSON = [];
    if (argIsExpDetails) {
        resultJSON = objJSONExpDetails.filter(function (item) { return (item.ExpCode == argExpCode); });
    }
    else {
        resultJSON = objJSONExpEntries.filter(function (item) {
            return (item.ExpCode == argExpCode);
        });
    }
    return JSON.stringify(resultJSON);
}
//Query Entries base on Expense Code - Ends
function canDeleteRow(argExpCode, argID, argTblID) {
    if (argTblID == "idTblENTD" || argTblID == "idTblGIFTD" || travelStage == "pre") {
        return true;
    }
    var resultJSON = [];
    if (argExpCode == "TravelSchedule") { //Travel Schedule
        resultJSON = objJSONTSHEntries.filter(function (item) {
            return (item.ID == argID && item.PreCreated == "1");
        });
    }
    else if (argTblID == "idTblEXP") {
        resultJSON = objJSONExpSummary.filter(function (item) { return (item.ExpType == argExpCode && item.ID == argID && item.PreCreated == "1"); });
    }
    else {
        resultJSON = objJSONExpEntries.filter(function (item) {
            return (item.ExpCode == argExpCode && item.ID == argID && item.PreCreated == "1");
        });
    }
    if (resultJSON != null && resultJSON.length > 0)
        return false;
    else
        return true;
}
//To get the Time Zone Ofset Value - starts
function getTimeZoneOffSet() {
    var offset = 0;
    $.ajax
       ({
           url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/RegionalSettings/TimeZone",
           type: "GET",
           async: false,
           headers: {
               "accept": "application/json;odata=verbose"
           },
           success: function (data) {
               offset = -(data.d.Information.Bias + data.d.Information.StandardBias + data.d.Information.DaylightBias) / 60.0;
           },
           error: function (error) {
               console.log(JSON.stringify(error));
           }
       });
    return offset;
}
//To get the Time Zone Ofset Value - ends
//Custom Validation function Starts
function CustomTravelValidation(argModal) {
    var isTravelled = $.trim(objSelectedRow.find("#idTSHisTravelled").text()).toLowerCase() == "no";
    if (TravellingTo == undefined || TravellingTo == "") {
        $("#" + modalId).find('.modalInfo').text("Kindly select the Travelling To value from the Travel Info Tab. Please Contact Administrator.");
        showError();
        return false;
    }
    if (!isTravelled) { // Not Travelled Row
        return true;
    }
    var objDepartTime = $("#" + argModal).find($("input[fldTitle='DepartTime']"));
    var objArrivalTime = $("#" + argModal).find($("input[fldTitle='ArrivalTime']"));
    // Validation to check Travel Arrival and Departure Country or City same or not
    if (TravellingTo == "Domestic") { // By City
        if ($("#idTSHDepCityEdit").val() == $("#idTSHDestCityEdit").val()) {
            $("#" + argModal).find('.modalInfo').text("Departure and Destination city cannot be same.");
            $("#idTSHDestCityEdit").focus();
            showError();
            return false;
        }
    } else { // By Country
        //if ($("#idTSHDepCntryEdit").val() == $("#idTSHDestCntryEdit").val()) {
        //    $("#" + argModal).find('.modalInfo').text("Departure and Destination country cannot be same.");
        //    $("#idTSHDestCntryEdit").focus();
        //    showError();
        //    return false;
        //}
    }
    // Validation to check Schedule time overlapping
    var objSched = objSchedCountryCity(true);
    var dtFormat = displayDateFormat + " H:mm";
    var curRowIdx = objSched.trips.indexOf($("#idTSHSNoEdit").val());
    var frmDt = null;
    var toDt = null;
    if ((curRowIdx == -1) && objSched.depTime.length > 0) { // new row
        frmDt = objSched.destTime[objSched.destTime.length - 1];
    } else if ((curRowIdx == 0) && (objSched.depTime.length > 1)) { // editing first row, more than one rows exists
        toDt = objSched.depTime[1];
    } else if ((curRowIdx + 1) == objSched.depTime.length) { //editing last row
        frmDt = objSched.destTime[curRowIdx - 1];
    } else { // In between row
        frmDt = objSched.destTime[curRowIdx - 1];
        toDt = objSched.depTime[curRowIdx + 1];
    }
    var editFrom = moment([$("#idTSHDepDateEdit").val(), objDepartTime.val()].join(" "), dtFormat).toDate();
    var editTo = moment([$("#idTSHArrDateEdit").val(), objArrivalTime.val()].join(" "), dtFormat).toDate();
    if (editFrom >= editTo) {
        $("#" + argModal).find('.modalInfo').text("Arrival Time should be after Departure Time");
        showError();
        return false;
    }
    if (((!!frmDt) ? editFrom <= frmDt : false) || ((!!toDt) ? editTo >= toDt : false)) {
        $("#" + argModal).find('.modalInfo').text("Departure or arrival time is overlapping with existing schedule");
        showError();
        return false;
    }
    // Additional One day check
    //if ($("#idTSHAdditionalDayEdit").val() == "Yes") {
    //    if (!checkAddDayPermitted()) {
    //        $("#" + argModal).find('.modalInfo').text("Additional one day cannot be claimed for this trip. Please choose as 'NA'.");
    //        $("#idTSHAdditionalDayEdit").focus();
    //        showError();
    //        return false;
    //    }
    //}
    // Schedule update as not travelled - confirmation
    var isTravelledEdit = $("#idTSHisTravelledEdit").val().toLowerCase() == "no";
    if (!isTravelledEdit && isTravelled) {
        var fld = $("#idTSHisTravelledEdit");
        if (fld.attr("confirm") != "Yes") {
            confirmModal(
            "You have choosen to cancel this trip. All the subsequent trips would also be removed. Do you want to continue?",
            function () {
                fld.attr("confirm", "Yes");
                var nextRows = objSelectedRow.nextAll();
                nextRows.each(function () {
                    var nextRowRef = $(this);
                    if (isPreExpenseRow($(this))) {
                        var keysToUpdate = ["isTravelled"];
                        var valsToUpdate = ["Yes"];
                        nextRowRef.find("*[postkey='isTravelled']").attr("isTravelled", "Yes");
                        keysToUpdate.forEach(function (key, idx) {
                            var objSpan = nextRowRef.find("*[postkey='" + key + "']");
                            objSpan.text(valsToUpdate[idx]);
                            if (travelStage == "pre") {
                                objSpan.attr("prevalue", valsToUpdate[idx]);
                            }
                            var strHTML = objSpan[0].outerHTML;
                            objSpan.parent().html(strHTML + valsToUpdate[idx]);
                        });
                    } else {
                        var objDelRows = $("input[fldTitle='hdnTravelScheduleDelRows']");
                        var rowID = nextRowRef.find('span[prekey="ID"]').text();
                        if (rowID != "") {
                            objDelRows.val(objDelRows.val() + rowID + ",");
                        }
                        $("#idTblTSH").DataTable().rows(nextRowRef).remove();
                    }
                });
                $("#TSHModal").find(".btnupdate").click();
            },
            function () {
                fld.attr("confirm", "No");
            });
            return false;
        }
    }
    return true;
}
//Custom Validation function End
function getTravelType() {
    var travelTo = $("[fldtitle=TravellingTo]").find("input[type=radio]:checked");
    var objTravelType = $("[fldtitle=TravelType]");
    TravellingTo = travelTo.val();
    $("input[fldTitle='hdnTravellingTo']").val(TravellingTo);
    var listData = '';
    //listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('TravelType')/Items?$filter=TravelTo eq'" + TravellingTo + "'");
    listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('TravelType')/Items");
    listData = JSON.parse(listData);
    allTravelTypes = $(listData).map(function () { return this.TravelType }).toArray();
    allTravelTypes = $.unique(allTravelTypes);
    listData = listData.filter(function (item) { return (item.TravelTo == TravellingTo); })
    if (listData.length == 0) {
        $('#divTravelType').html("");
        alertModal("Travel Type not configured for " + TravellingTo + ". Please contact administrator");
        return false;
    }
    CreateCheckBoxList(listData);
    activeTravelType = "";
}
function getData(url) {
    var items;
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            items = data.d.results;
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    return JSON.stringify(items);
}
function getDataAsync(url, fnCallBack) {
    var items;
    $.ajax({
        url: url,
        type: "GET",
        async: true,
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            items = data.d.results;
            fnCallBack(JSON.stringify(items));
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}
function CreateCheckBoxList(checkboxlistItems) {
    $('#divTravelType').html("");
    var table = $('<table id="idTravelType"></table>');
    var counter = 0;
    $(checkboxlistItems).each(function () {
        //allTravelTypes.push(this.TravelType);
        table.append($('<tr></tr>').append($('<td></td>').append($('<input>').attr({
            type: 'checkbox', name: 'chklistitem', value: this.TravelType, id: 'chklistitem' + counter,
            onclick: 'setTravelType(true);getTType();'
        })).append(
        $('<label>').attr({
            for: 'chklistitem' + counter++
        }).text(this.TravelType))));
    });
    $('#divTravelType').append(table);
}
function setTravelType(flgClickAction) {
    var multipleTType = false;
    var argTravelType = "";
    activeTravelType = "";
    var tblTravelType = $("#idTravelType").find("input[type=checkbox]:checked");
    if (tblTravelType.length == 1) {
        argTravelType = tblTravelType[0].value;
    } else {
        var selectedTType = "";
        for (var i = 0; i < tblTravelType.length; i++) {
            argTravelType = tblTravelType[i].value;
            if (selectedTType == "") {
                selectedTType = argTravelType;
            }
            else {
                selectedTType = selectedTType + "," + argTravelType;
                multipleTType = true;
            }
        }
        if (multipleTType == true) {
            switch (selectedTType) {
                case "Business Trip,Home Leave":
                case "Home Leave,Business Trip":
                    argTravelType = "Business Trip";
                    break;
                case "Business Trip,OTC":
                case "OTC,Business Trip":
                    argTravelType = "OTC";
                    break;
                default:
                    alertModal("Wrong Combination");
                    clearTType();
                    argTravelType = "";
                    break;
            }
        }
    }
    if (argTravelType != "") {
        getGLCode(argTravelType, true);
        updateGLCodeForExpenseTable(argTravelType);
        getTravelExpBudget();
    }
    else {
        clearTType();
    }
    activeTravelType = argTravelType;

    if (!isEmptyTable("idTblDA") && flgClickAction) {
        nullifyDADetails("DA details has been reset due to change in Travel Type. Please update DA details before submit.");
    }
}
function updateGLCodeForExpenseTable(TravelType) {
    $("#idTblEXP").find("tbody>tr").each(function () {
        var expTypeDisp = $(this).find("#idExpTypeDisplay").text();
        var expType = $(this).find("#idExpType").text();
        if (expType != "") {
            var curExpense = ExpenseDetails[expType];
            var GLCode = curExpense.mainGLCode[TravelType];
            var TaxCode = curExpense.taxCode[TravelType];
            // Update Expense Row GL Code / Tax Code
            var objSpan = $(this).find('span[postkey="GLCode"]');
            if (objSpan != undefined && objSpan.length > 0) {
                objSpan.text(GLCode);
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + GLCode);
            }
            objSpan = $(this).find('span[postkey="TaxCode"]');
            if (objSpan != undefined && objSpan.length > 0) {
                objSpan.text(TaxCode);
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + TaxCode);
            }
            // Update in Detail Entries
            var tblId = getTableID(expType);
            if (tblId == "idTblMIL") {
                tblId = tblId + ",#idTblOTH";
                drawDataTbl("idTblMIL", true);
                drawDataTbl("idTblOTH", true);
            } else {
                drawDataTbl(tblId, true);
            }
            $(tableRowSelector(tblId)).each(function () {
                var tr = $(this);
                var subGLCode = "";
                if (curExpense.isSubTypeBased) {
                    var subExpType = tr.find('span[postkey="PostExpTypes"]').text();
                    if (subExpType != "") {
                        subGLCode = ExpenseDetails[expType].subGLCode[TravelType][subExpType];
                    }
                }
                subGLCode = (!!subGLCode) ? subGLCode : GLCode;
                var objSpan = $(this).find('span[postkey="GLCode"]');
                if (objSpan != undefined && objSpan.length > 0) {
                    objSpan.text(subGLCode);
                    strHTML = objSpan[0].outerHTML;
                    objSpan.parent().html(strHTML + subGLCode);
                }
            });
            if (getTableID(expType) == "idTblMIL") {
                drawDataTbl("idTblMIL", false);
                drawDataTbl("idTblOTH", false);
            } else {
                drawDataTbl(tblId, false);
            }
        }
    });
}
function getGLCode(argTravelType, argCheckedVal) {
    $("input[fldTitle='txtGLCode']").val("");
    var listData = '';
    if (TravellingTo != "" && argTravelType != "" && argCheckedVal == true) {
        var listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('TravelType')/Items?$filter=TravelTo eq'" + TravellingTo + "'and TravelType eq '" + argTravelType + "'");
        listData = JSON.parse(listData);
        if (listData.length == 0) {
            $("input[fldTitle='txtGLCode']").val("");
            alertModal("GLCode  not configured for " + TravellingTo + "and" + argTravelType + " . Please contact administrator");
            return false;
        }
        $("input[fldTitle='txtGLCode']").val(listData[0].GLCode);
    }
}
function clearTType() {
    var tblTravelType = $("#idTravelType").find("input[type=checkbox]");
    $("input[fldTitle='txtGLCode']").val("");
    for (var i = 0; i < tblTravelType.length; i++) {
        tblTravelType[i].checked = false;
    }
}
function getTType() {
    var tblTravelType = $("#idTravelType").find("input[type=checkbox]:checked");
    var selectedTType = "";
    for (var i = 0; i < tblTravelType.length; i++) {
        if (selectedTType == "") {
            selectedTType = tblTravelType[i].value;
        }
        else {
            selectedTType = selectedTType + "," + tblTravelType[i].value;
        }
    }
    $("input[fldTitle='hdnTravelType']").val(selectedTType);
}
function setTType() {
    var arrTType = $("input[fldTitle='hdnTravelType']").val().split(",");
    var tblTravelType = $("#idTravelType").find("input[type=checkbox]");
    for (var i = 0; i < arrTType.length; i++) {
        for (var j = 0; j < tblTravelType.length; j++) {
            if (arrTType[i] == tblTravelType[j].value) {
                tblTravelType[j].checked = true;
                break;
            }
        }
    }
}
function recalcLCAmt() {
    getManualExRate();
    var arrTblIDs = ["idTblMED", "idTblMIL", "idTblMIS", "idTblVSA", "idTblACC", "idTblATC", "idTblCOM", "idTblDA", "idTblENT", "idTblPAS", "idTblPRP", "idTblTSP", "idTblTRNC", "idTblCA", "idTblEXB", "idTblLAU", "idTblGIFT", "idTblAPT", "idTblOTH", "idTblWIN", "idTblADV", "idTblRef"];
    var expCurr = ""; var expFCAmt = 0; var expLCAmt = 0; var expExRate = 0; var exchRate = 0;
    if (!GSTCodes) {
        GSTCodes = getGSTCodes();
    }
    for (var i = 0; i < arrTblIDs.length; i++) {
        drawDataTbl(arrTblIDs[i], true);
        $(tableRowSelector(arrTblIDs[i])).each(function () {
            expCurr = $(this).find('span[postkey="PostCurrency"]').text();
            if (expCurr == "") {
                return;
            }
            exchRate = outputNumber(getExchRate(expCurr));
            var formattedExRate = outputMoneyEx(exchRate);
            expFCAmt = $(this).find('span[postkey="PostFCAmt"]').text();
            expLCAmt = outputMoney(outputNumber(expFCAmt) * exchRate);
            $(this).find('span[postkey="PostExRate"]').text(formattedExRate);
            $(this).find('span[postkey="PostLCAmt"]').text(expLCAmt);
            var objSpan = $(this).find('span[postkey="PostExRate"]');
            if (objSpan != undefined && objSpan.length > 0) {
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + formattedExRate);
            }
            objSpan = $(this).find('span[postkey="PostLCAmt"]');
            if (objSpan != undefined && objSpan.length > 0) {
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + expLCAmt);
            }
            // To refresh GST amounts
            var GSTCode = $.trim($(this).find('span[postkey="GSTCode"]').text());
            if (GSTCode != "") {
                var taxPercent = GSTCodes[GSTCode] ? GSTCodes[GSTCode] : 1;
                var taxAmtVal = outputMoney(outputNumber(expLCAmt) / outputNumber(taxPercent));
                var gstAmt = outputMoney(outputNumber(expLCAmt) - outputNumber(taxAmtVal));
                objSpan = $(this).find('span[postkey="TaxableAmt"]');
                if (objSpan != undefined && objSpan.length > 0) {
                    objSpan.text(taxAmtVal);
                    strHTML = objSpan[0].outerHTML;
                    objSpan.parent().html(strHTML + taxAmtVal);
                }
                objSpan = $(this).find('span[postkey="GSTAmt"]');
                if (objSpan != undefined && objSpan.length > 0) {
                    objSpan.text(gstAmt);
                    strHTML = objSpan[0].outerHTML;
                    objSpan.parent().html(strHTML + gstAmt);
                }
            }
        });
        if (!isEmptyTable(arrTblIDs[i])) {
            calculateTotalAmt(arrTblIDs[i]);
        }
        drawDataTbl(arrTblIDs[i], false);
    }
    return true;
}
function checkManualExRateTolerance(argCurrency, argExRate) {
    var ManualExRateAlert = "";
    var tolerance = $("input[fldTitle='hdnTolerance']").val();
    var result = "1:Success";
    if (tolerance == "NA" || tolerance == "") {
        return result;
    }
    if (tolerance == 0) {
        ManualExRateAlert = "Tolerance Limit is 0%. Cannot proceed with Maual exchange rate."
        result = "0:" + ManualExRateAlert;
        return result;
    }
    var strExRateColl = $("input[fldTitle='hdnPostExRateColl']").val();
    if (strExRateColl == "") {
        ManualExRateAlert = "Exchange Rate not available. Please contact administrator."
        result = "0:" + ManualExRateAlert;
        return result;
    }
    var myExRate = outputNumber(argExRate);
    var exRate = parseFloat(extractExRate(strExRateColl, argCurrency));
    var tollerenceVal = exRate * parseFloat(tolerance / 100);
    var exUpperLimit = exRate + tollerenceVal;
    var exLowerLimit = exRate - tollerenceVal;
    if (myExRate > exUpperLimit || myExRate < exLowerLimit) {
        ManualExRateAlert = "Tolerance Limit (" + tolerance + "%) exceeded for " + myExCurr;
        result = "0:" + ManualExRateAlert;
        return result;
    }
    return result;
}
function objSchedCountryCity(inModal) {
    /* 
    Gives Object of countries and cities visited along with previous destination country and city
    */
    var obj = {};
    obj.depCountries = [];
    obj.depCities = [];
    obj.destCountries = [];
    obj.destCities = [];
    obj.depTime = [];
    obj.destTime = [];
    obj.trips = [];
    obj.prevDestCountry = "";
    obj.prevDestCity = "";
    obj.travelledTrips = 0;
    obj.validTrips = 0;
    var dtFormat = displayDateFormat + " H:mm";
    if (!inModal) {
        drawDataTbl(true);
    }
    $(tableRowSelector("idTblTSH")).each(function () {
        if ($.trim($(this).find("*[postkey='isTravelled']").text()).toLowerCase() == "no" && !$(this).hasClass("temprow")) {
            obj.travelledTrips++;
            var tmpCountry = $(this).find("*[postkey='PostDestCountry']").text();
            var tmpCity = $(this).find("*[postkey='PostDestCity']").text();
            var tmpDate = $(this).find("*[postkey='PostArrDate']").text();
            var tmpTime = $(this).find("*[postkey='PostArrTime']").text();
            if (!(tmpCountry.toLowerCase() == "select" || tmpCity.toLowerCase() == "select")) {
                obj.trips.push($(this).find("*[postkey='SNo']").text());
                obj.prevDestCountry = tmpCountry;
                obj.prevDestCity = tmpCity;
                obj.destCountries.push(tmpCountry);
                obj.destCities.push(tmpCity);
                if (!!tmpDate) {
                    obj.destTime.push(moment([tmpDate, tmpTime].join(" "), dtFormat).toDate());
                } else {
                    obj.destTime.push(null);
                }
                tmpCountry = $(this).find("*[postkey='PostDepCountry']").text();
                tmpCity = $(this).find("*[postkey='PostDepCity']").text();
                tmpDate = $(this).find("*[postkey='PostDepDate']").text();
                tmpTime = $(this).find("*[postkey='PostDepTime']").text();
                if (!(!!"select".match(tmpCountry.toLowerCase()) || !!"select".match(tmpCity.toLowerCase()))) {
                    obj.depCountries.push(tmpCountry);
                    obj.depCities.push(tmpCity);
                    if (!!tmpDate) {
                        obj.validTrips++;
                        obj.depTime.push(moment([tmpDate, tmpTime].join(" "), dtFormat).toDate());
                    } else {
                        obj.depTime.push(null);
                    }
                }
            }
        }
    });
    if (!inModal) {
        drawDataTbl(false);
    }
    return obj;
}

function updateDateRange(fld, frmDt, toDt, datePickerObj, callBackFunction) {
    /*
    To update date range picker values based on values passed
    frmDt, toDt - are javascript Date objects
    fld - Jquery selection field
    */
    if (!!frmDt && !!toDt) {
        datePickerObj.minDate = dateString(frmDt);
        datePickerObj.maxDate = dateString(toDt);
    } else if (!!frmDt) {
        datePickerObj.minDate = dateString(frmDt);
    } else if (!!toDt) {
        datePickerObj.maxDate = dateString(toDt);
    }
    if (!!callBackFunction) {
        fld.daterangepicker(datePickerObj, callBackFunction);
    } else {
        fld.daterangepicker(datePickerObj);
    }
}
function enableDisableRadioLinked(tblID) {
    switch (tblID) {
        case "idTblTSH": // Travel Schedule
            $("[fldtitle=UrgentTrip],[fldtitle=TravellingTo]").find("input[type=radio]").prop("disabled", !isEmptyTable(tblID));
            break;
        case "idTblMYEXCH": // Post Exchange Rate Type
            if ($("[fldtitle=ExRateType]").find("input[type=radio]:checked").val() == "Manual")
                $("[fldtitle=ExRateType]").find("input[type=radio]").prop("disabled", !isEmptyTable(tblID));
            break;
    }
}
//DA Table generation and number of days calculation based on the configuration - Starts
var WDDepCuttOffTimeConfig;
var WDDepCuttOffTime;
var WDDepDaysConfig;
var WDArrCuttOffTimeConfig;
var WDArrCuttOffTime;
var WDArrDaysConfig;
var WDMidNightInclConfig;
var WEDepCuttOffTimeConfig;
var WEDepCuttOffTime;
var WEDepDaysConfig;
var WEArrCuttOffTimeConfig;
var WEArrCuttOffTime;
var WEArrDaysConfig;
var WEMidNightInclConfig;
var PHDepCuttOffTimeConfig;
var PHDepCuttOffTime;
var PHDepDaysConfig;
var PHArrCuttOffTimeConfig;
var PHArrCuttOffTime;
var PHArrDaysConfig;
var PHMidNightInclConfig;
var CHDepCuttOffTimeConfig;
var CHDepCuttOffTime;
var CHDepDaysConfig;
var CHArrCuttOffTimeConfig;
var CHArrCuttOffTime;
var CHArrDaysConfig;
var CHMidNightInclConfig;
var MidNightAllowedConfig;
var MidNightStartTimeConfig;
var MidNightStartTime;
var MidNightEndTimeConfig;
var MidNightEndTime;
var MidNightDaysConfig;
var ADAllowedConfig;
var ADCuttOffTimeConfig;
var ADCuttOffTime;
var ADCuttOffHrs;
var ADFlightHrs;
var ADDays;
var gblAdditionalDays = 0;
var gblMidNigtTrips = 0;
var DACountriesCities = ""; //Multi City DA
function generateDAVals() {
    setGlobalVarDAConfig();
    $('#idTblTSH tr').removeClass('processed');
    var DAJSON = [];
    $(tableRowSelector('idTblTSH')).each(function () {
        var isTravelled = $.trim($(this).find("#idTSHisTravelled").text()).toLowerCase() == "no";
        if (!isTravelled) {
            $(this).addClass("processed");
        }
        if ($(this).hasClass("processed")) {
            return true;
        }
        DACountriesCities = ""; //Multi City DA
        gblAdditionalDays = 0;
        gblMidNigtTrips = 0;
        var SCHStartRow = $(this);
        var SCHEndRow = findSCHEndRow(SCHStartRow);
        var TSHDepCntry = "";
        var TSHDepCity = "";
        var TSHDestCntry = "";
        var TSHDestCity = "";
        var TSHDepDate = "";
        var TSHArrDate = "";
        var TSHDepTime = "";
        var TSHArrTime = "";
        if (SCHEndRow == null) {
            //Consider only SCHStartRow 
            TSHDepCntry = $(SCHStartRow).find("#idTSHDepCntry").text();
            TSHDepCity = $(SCHStartRow).find("#idTSHDepCity").text();
            TSHDestCntry = $(SCHStartRow).find("#idTSHDestCntry").text();
            TSHDestCity = $(SCHStartRow).find("#idTSHDestCity").text();
            TSHDepDate = $(SCHStartRow).find("#idTSHDepDate").text();
            TSHArrDate = $(SCHStartRow).find("#idTSHArrDate").text();
            TSHDepTime = $(SCHStartRow).find("#idTSHDepTime").text();
            TSHArrTime = $(SCHStartRow).find("#idTSHArrTime").text();
        }
        else {
            //Consider SCHStartRow & SCHEndRow
            TSHDepCntry = $(SCHStartRow).find("#idTSHDepCntry").text();
            TSHDepCity = $(SCHStartRow).find("#idTSHDepCity").text();
            TSHDestCntry = $(SCHEndRow).find("#idTSHDestCntry").text();
            TSHDestCity = $(SCHEndRow).find("#idTSHDestCity").text();
            TSHDepDate = $(SCHStartRow).find("#idTSHDepDate").text();
            TSHArrDate = $(SCHEndRow).find("#idTSHArrDate").text();
            TSHDepTime = $(SCHStartRow).find("#idTSHDepTime").text();
            TSHArrTime = $(SCHEndRow).find("#idTSHArrTime").text();
        }
        if (TSHDepDate == "") {
            (travelStage == "pre") ? gblPreNoDays = 0 : gblPostNoDays = 0;
            return;
        }
        var rowJSON = {
        };
        rowJSON["TSHDepCntry"] = TSHDepCntry;
        rowJSON["TSHDepCity"] = TSHDepCity;
        rowJSON["TSHDestCntry"] = TSHDestCntry;
        rowJSON["TSHDestCity"] = TSHDestCity;
        rowJSON["StartDate"] = TSHDepDate;
        rowJSON["EndDate"] = TSHArrDate;
        rowJSON["StartTime"] = TSHDepTime;
        rowJSON["EndTime"] = TSHArrTime;
        rowJSON["TSHAdditionalDay"] = gblAdditionalDays;
        rowJSON["TSHMidNigtTrips"] = gblMidNigtTrips;
        rowJSON["DACountriesCities"] = DACountriesCities;  //Multi City DA    
        DAJSON.push(rowJSON);
    });
    processDAJSON(DAJSON);
}
function processDAJSON(DAJSON) {
    var len = DAJSON.length;
    for (var i = 0; i < len; i++) {
        var TSHDestCntry = DAJSON[i].TSHDestCntry;
        var TSHDestCity = DAJSON[i].TSHDestCity;
        if (i + 1 < len) {
            var TSHDepCntryNxt = DAJSON[i + 1].TSHDepCntry;
            var TSHDepCityNxt = DAJSON[i + 1].TSHDepCity;
            if (TSHDestCntry == TSHDepCntryNxt && TSHDestCity == TSHDepCityNxt) {
                DAJSON[i].EndDate = DAJSON[i + 1].EndDate;
                DAJSON[i].EndTime = DAJSON[i + 1].EndTime;
                DAJSON[i + 1].StartDate = DAJSON[i + 1].EndDate;
                DAJSON[i + 1].StartTime = DAJSON[i + 1].EndTime;
            }
        }
    }
    if (len > 1) {
        DAJSON[len - 2].TSHAdditionalDay += parseFloat(DAJSON[len - 1].TSHAdditionalDay);
        DAJSON[len - 2].TSHMidNigtTrips += parseFloat(DAJSON[len - 1].TSHMidNigtTrips);
        DAJSON.splice(len - 1, 1);
    }
    len = DAJSON.length;
    for (var i = 0; i < len - 1 && len > 1; i++) {
        var endDate = formatDate(DAJSON[i].EndDate);
        endDate.setDate(endDate.getDate() - 1);
        endDate = getDateString(endDate);
        DAJSON[i].EndDate = endDate;
    }
    DAJSON = calculateDANoOfDays(DAJSON);
    DAJSON = processMultiCityDA(DAJSON);
    updateDAEntries(DAJSON);
}
function processMultiCityDA(DAJSON) {
    var len = DAJSON.length;
    var removeItm = "";
    for (var i = 0; i < len; i++) {
        var TSHStartDate = DAJSON[i].StartDate;
        var TSHEndDate = DAJSON[i].EndDate;
        if (i + 1 < len) {
            var TSHStartDateNxt = DAJSON[i + 1].StartDate;
            var TSHEndDateNxt = DAJSON[i + 1].EndDate;
            if (TSHStartDate == TSHStartDateNxt && DAJSON[i].NoOfDays == 0) {
                DAJSON[i].DACountriesCities += DAJSON[i].TSHDepCntry + "#~#" + DAJSON[i].TSHDepCity + "#@#" + DAJSON[i].TSHDestCntry + "#~#" + DAJSON[i].TSHDestCity + "#@#";
                if (DAJSON[i + 1].NoOfDays > 1) {
                    DAJSON[i].NoOfDays = 1;
                    DAJSON[i + 1].NoOfDays = DAJSON[i + 1].NoOfDays - 1;
                }
                else {
                    removeItm += i + ";";
                    DAJSON[i + 1].DACountriesCities = DAJSON[i].DACountriesCities;
                }
            }
        }
    }
    if (removeItm != "") {
        var removeItmArr = removeItm.split(";");
        len = removeItmArr.length - 2;
        for (var i = len; i >= 0; i--) {
            DAJSON.splice(removeItmArr[i], 1);
        }
    }
    return DAJSON;
}
function findSCHEndRow(argSCHStartRow) {
    var TSHAdditionalDay = $(argSCHStartRow).find("#idTSHAdditionalDay").text();
    if (TSHAdditionalDay == "Yes") {
        gblAdditionalDays++;
    }
    updateMidNightTrips(argSCHStartRow);
    if ($(argSCHStartRow).next().length == 0) {
        return null;
    }
    var TSHDestCntry = $(argSCHStartRow).find("#idTSHDestCntry").text();
    var TSHDestCity = $(argSCHStartRow).find("#idTSHDestCity").text();
    var SCHEndRow = $(argSCHStartRow).next();
    var isTransiDep = $(argSCHStartRow).find("#idTSHisTransiDep").text();
    var TSHDepCntry = $(SCHEndRow).find("#idTSHDepCntry").text();
    var TSHDepCity = $(SCHEndRow).find("#idTSHDepCity").text();
    //DACountriesCities += TSHDepCntry + "#~#" + TSHDepCity + "#@#" + TSHDestCntry + "#~#" + TSHDestCity + "#@#"; //Multi City DA
    if (isTransiDep == "Yes" && TSHDestCntry == TSHDepCntry && TSHDestCity == TSHDepCity) {
        $(SCHEndRow).addClass("processed");
        if (findSCHEndRow(SCHEndRow) == null) {
            TSHAdditionalDay = $(SCHEndRow).find("#idTSHAdditionalDay").text();
            if (TSHAdditionalDay == "Yes") {
                gblAdditionalDays++;
            }
            updateMidNightTrips(SCHEndRow);
            return SCHEndRow;
        }
    }
    else {
        return null;
    }
}
function updateMidNightTrips(argTrip) {
    if (MidNightAllowedConfig != "Yes") {
        return;
    }
    var TSHDepDate = $(argTrip).find("#idTSHDepDate").text();
    var TSHArrDate = $(argTrip).find("#idTSHArrDate").text();
    var splitDate = TSHDepDate.split('/');
    var splitDateStr = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    var MNStartTime = Date.parse(splitDateStr + ' ' + MidNightStartTimeConfig + ':00');
    var TSHDepTime = Date.parse(splitDateStr + ' ' + $(argTrip).find("#idTSHDepTime").text() + ':00');
    splitDate = TSHArrDate.split('/');
    splitDateStr = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    var MNEndTime = Date.parse(splitDateStr + ' ' + MidNightEndTimeConfig + ':00');
    if (MNEndTime < MNStartTime) {
        var nxtDate = moment(splitDateStr, "YYYY/MM/DD").add(1, 'days');
        nxtDate = moment(nxtDate).format("YYYY/MM/DD");
        MNEndTime = Date.parse(nxtDate + ' ' + MidNightEndTimeConfig + ':00');
    }
    var TSHArrTime = Date.parse(splitDateStr + ' ' + $(argTrip).find("#idTSHArrTime").text() + ':00');
    if (TSHDepTime > MNStartTime && TSHDepTime < MNEndTime) {
        gblMidNigtTrips++;
    }
    else if (TSHArrTime > MNStartTime && TSHArrTime < MNEndTime) {
        gblMidNigtTrips++;
    }
    else if (TSHDepTime <= MNStartTime && TSHArrTime >= MNEndTime) {
        gblMidNigtTrips++;
    }
}
function setDADataJSON(argDAItem) {
    var expRow = $("tr[expcode='DailyAllowance']");
    var DAGLCode = "";
    var DAGSTCode = "";
    if (expRow.length > 0) {
        DAGLCode = expRow.find('span[postkey="GLCode"]').text();
        DAGSTCode = expRow.find('span[postkey="TaxCode"]').text();
    }
    var rowJSON = {};
    rowJSON["ID"] = "";
    rowJSON["SNo"] = "";
    rowJSON["GSTAmt"] = 0;
    rowJSON["GLCode"] = DAGLCode;
    rowJSON["ChargeToFactory"] = "No";
    rowJSON["ReceiptNo"] = "";
    rowJSON["GSTCode"] = DAGSTCode == undefined || DAGSTCode == "" || DAGSTCode == "Select" ? "Select" : DAGSTCode;
    rowJSON["GSTCodeDisplay"] = DAGSTCode == undefined || DAGSTCode == "" || DAGSTCode == "Select" ? "Select" : DAGSTCode;
    rowJSON["TaxableAmt"] = 0;
    if (travelStage == "pre") {
        rowJSON["PreAllowType"] = "Select";
        rowJSON["PreDARate"] = 0;
        rowJSON["PreDinner"] = 0;
        rowJSON["PreFCAmt"] = 0;
        rowJSON["PreCostCenter"] = profitCenterId;
        rowJSON["PreCostCenterDisplay"] = $("select[fldTitle='ChargeToPC'] option:selected").text();
        rowJSON["PreCountry"] = argDAItem.TSHDestCntry;
        rowJSON["PreCity"] = argDAItem.TSHDestCity;
        rowJSON["PreCurrency"] = baseCurrency;
        rowJSON["PreExRate"] = 1;
        rowJSON["PreDays"] = argDAItem.NoOfDays;
        rowJSON["PreActualDays"] = argDAItem.NoOfDays;
        rowJSON["PreLCAmt"] = 0;
        rowJSON["PreBfast"] = 0;
        rowJSON["PreLunch"] = 0;
        rowJSON["PreDesc"] = "";
        rowJSON["PreStartDate"] = argDAItem.StartDate;
        rowJSON["PreEndDate"] = argDAItem.EndDate;
        rowJSON["PreDACountriesCities"] = argDAItem.DACountriesCities; //Multi City DA
    }
    else {
        rowJSON["PreAllowType"] = "";
        rowJSON["PostAllowType"] = "Select";
        rowJSON["PreDARate"] = 0;
        rowJSON["PostDARate"] = 0;
        rowJSON["PreActualDays"] = 0;
        rowJSON["PostActualDays"] = argDAItem.NoOfDays;
        rowJSON["PreDinner"] = 0;
        rowJSON["PostDinner"] = 0;
        rowJSON["PreFCAmt"] = 0;
        rowJSON["PostFCAmt"] = 0;
        rowJSON["PreCostCenter"] = "";
        rowJSON["PostCostCenter"] = profitCenterId;
        rowJSON["PreCostCenterDisplay"] = "";
        rowJSON["PostCostCenterDisplay"] = $("select[fldTitle='ChargeToPC'] option:selected").text();
        rowJSON["PreCountry"] = "";
        rowJSON["PostCountry"] = argDAItem.TSHDestCntry;
        rowJSON["PreCity"] = "";
        rowJSON["PostCity"] = argDAItem.TSHDestCity;
        rowJSON["PreCurrency"] = "";
        rowJSON["PostCurrency"] = baseCurrency;
        rowJSON["PreExRate"] = 0;
        rowJSON["PostExRate"] = 1;
        rowJSON["PreDays"] = 0;
        rowJSON["PostDays"] = argDAItem.NoOfDays;
        rowJSON["PreLCAmt"] = 0;
        rowJSON["PostLCAmt"] = 0;
        rowJSON["PreBfast"] = 0;
        rowJSON["PostBfast"] = 0;
        rowJSON["PreLunch"] = 0;
        rowJSON["PostLunch"] = 0;
        rowJSON["PreDesc"] = "";
        rowJSON["PostDesc"] = "";
        rowJSON["PreStartDate"] = "";
        rowJSON["PreEndDate"] = "";
        rowJSON["PostStartDate"] = argDAItem.StartDate;
        rowJSON["PostEndDate"] = argDAItem.EndDate;
        rowJSON["PostDACountriesCities"] = argDAItem.DACountriesCities; //Multi City DA
    }
    return rowJSON;
}
function generateSQNo(modalID, tblID) {
    var SqNoTxt = $('#' + modalID).find('.SqNoTxt').text();
    var rowCnt = 1;
    var strHTML = "";
    gblPreNoDays = 0;
    gblPostNoDays = 0;
    gblPreActNoDays = 0;
    gblPostActNoDays = 0;
    var UrgTrip = $("[fldtitle=UrgentTrip]").find("input[type=radio]:checked").val();
    if (UrgTrip == "Yes") {
        gblPreNoDays = 0;
        gblPreActNoDays = 0;
    }
    $(tableRowSelector(tblID)).each(function () {
        objSpan = $(this).find('span[postkey="SNo"]');
        if (objSpan != undefined && objSpan.length > 0) {
            objSpan.text(SqNoTxt + rowCnt);
            strHTML = objSpan[0].outerHTML;
            objSpan.parent().html(strHTML + SqNoTxt + rowCnt);
            rowCnt++
        }
        if (tblID == "idTblDA") {
            var objNoDays = $(this).find('span[postkey="PostDays"]');
            var objActNoDays = $(this).find('span[postkey="PostActualDays"]');
            if (travelStage == "post") {
                gblPostNoDays += parseFloat(objNoDays.text());
                gblPostActNoDays += parseFloat(objActNoDays.text());
                if (UrgTrip != "Yes") {
                    if (!!objNoDays.attr("prevalue")) {
                        gblPreNoDays += parseFloat(objNoDays.attr("prevalue"));
                        gblPreActNoDays += parseFloat(objActNoDays.attr("prevalue"));
                    }
                }
            }
            else {
                gblPreNoDays += parseFloat(objNoDays.text());
                gblPreActNoDays += parseFloat(objActNoDays.text());
            }
        }
    });
    if (tblID == "idTblDA") {
        $("#idPreActNoDays").text(gblPreActNoDays);
        $("#idPostActNoDays").text(gblPostActNoDays);
        $("input[fldTitle='hdnPreActNoDays']").val(gblPreActNoDays);
        $("input[fldTitle='hdnPostActNoDays']").val(gblPostActNoDays);
    }
}
function getDateString(argDate) {
    var monthNo = argDate.getMonth() + 1;
    monthNo = (new String(monthNo).length == 1) ? "0" + monthNo : monthNo;
    var dateNo = argDate.getDate();
    dateNo = (new String(dateNo).length == 1) ? "0" + dateNo : dateNo;
    return dateNo + "/" + monthNo + "/" + argDate.getFullYear();
}
function getDayType(argDate) {
    var dayType = "WD";
    if (isWeekEnd(argDate)) {
        dayType = "WE";
    } else if (isCompanyHoliday(argDate)) {
        dayType = "CH";
    } else if (isPublicHoliday(argDate)) {
        dayType = "PH";
    }
    return dayType;
}
function setGlobalVarDAConfig() {
    //Weekday Cutoff/Mid Night Configuration Values
    WDDepCuttOffTimeConfig = $("input[fldTitle='hdnWDDepCuttOffTimeConfig']").val(); //"12:00"; 
    WDDepCuttOffTime = Date.parse('2018/01/01 ' + WDDepCuttOffTimeConfig + ':00'); //Date is just a place holder
    WDDepDaysConfig = $("input[fldTitle='hdnWDDepDaysConfig']").val(); //0.5;
    WDArrCuttOffTimeConfig = $("input[fldTitle='hdnWDArrCuttOffTimeConfig']").val(); //"12:00";
    WDArrCuttOffTime = Date.parse('2018/01/01 ' + WDArrCuttOffTimeConfig + ':00'); //Date is just a place holder
    WDArrDaysConfig = $("input[fldTitle='hdnWDArrDaysConfig']").val(); //0.5;
    WDMidNightInclConfig = $("input[fldTitle='hdnWDMidNightInclConfig']").val(); //"Yes";
    //Weekend Cutoff/Mid Night Configuration Values
    WEDepCuttOffTimeConfig = $("input[fldTitle='hdnWEDepCuttOffTimeConfig']").val(); //"12:00";
    WEDepCuttOffTime = Date.parse('2018/01/01 ' + WEDepCuttOffTimeConfig + ':00'); //Date is just a place holder
    WEDepDaysConfig = $("input[fldTitle='hdnWEDepDaysConfig']").val();  //0.5;
    WEArrCuttOffTimeConfig = $("input[fldTitle='hdnWEArrCuttOffTimeConfig']").val();  //"12:00";
    WEArrCuttOffTime = Date.parse('2018/01/01 ' + WEArrCuttOffTimeConfig + ':00'); //Date is just a place holder
    WEArrDaysConfig = $("input[fldTitle='hdnWEArrDaysConfig']").val(); //0.5;
    WEMidNightInclConfig = $("input[fldTitle='hdnWEMidNightInclConfig']").val();  //"Yes";
    //Public Holiday Cutoff/Mid Night Configuration Values
    PHDepCuttOffTimeConfig = $("input[fldTitle='hdnPHDepCuttOffTimeConfig']").val(); //"12:00";
    PHDepCuttOffTime = Date.parse('2018/01/01 ' + PHDepCuttOffTimeConfig + ':00'); //Date is just a place holder
    PHDepDaysConfig = $("input[fldTitle='hdnPHDepDaysConfig']").val(); //0.5;
    PHArrCuttOffTimeConfig = $("input[fldTitle='hdnPHArrCuttOffTimeConfig']").val(); //"12:00";
    PHArrCuttOffTime = Date.parse('2018/01/01 ' + PHArrCuttOffTimeConfig + ':00'); //Date is just a place holder
    PHArrDaysConfig = $("input[fldTitle='hdnPHArrDaysConfig']").val(); //0.5;
    PHMidNightInclConfig = $("input[fldTitle='hdnPHMidNightInclConfig']").val(); //"Yes";
    //Company Holiday Cutoff/Mid Night Configuration Values
    CHDepCuttOffTimeConfig = $("input[fldTitle='hdnCHDepCuttOffTimeConfig']").val(); //"12:00";
    CHDepCuttOffTime = Date.parse('2018/01/01 ' + CHDepCuttOffTimeConfig + ':00'); //Date is just a place holder
    CHDepDaysConfig = $("input[fldTitle='hdnCHDepDaysConfig']").val(); //0.5;
    CHArrCuttOffTimeConfig = $("input[fldTitle='hdnCHArrCuttOffTimeConfig']").val(); //"12:00";
    CHArrCuttOffTime = Date.parse('2018/01/01 ' + CHArrCuttOffTimeConfig + ':00'); //Date is just a place holder
    CHArrDaysConfig = $("input[fldTitle='hdnCHArrDaysConfig']").val(); //0.5;
    CHMidNightInclConfig = $("input[fldTitle='hdnCHMidNightInclConfig']").val(); //"Yes";
    //Mid Night Configuration Values
    MidNightAllowedConfig = $("input[fldTitle='hdnMidNightAllowedConfig']").val(); //"Yes";
    MidNightStartTimeConfig = $("input[fldTitle='hdnMidNightStartTimeConfig']").val(); //"23:00";
    MidNightStartTime = Date.parse('2018/01/01 ' + MidNightStartTimeConfig + ':00'); //Date is just a place holder
    MidNightEndTimeConfig = $("input[fldTitle='hdnMidNightEndTimeConfig']").val(); //"01:00";
    MidNightEndTime = Date.parse('2018/01/01 ' + MidNightEndTimeConfig + ':00'); //Date is just a place holder
    MidNightDaysConfig = $("input[fldTitle='hdnMidNightDaysConfig']").val(); //0.5;
    //Additinal Day Configuration Values
    ADAllowedConfig = $("input[fldTitle='hdnADAllowedConfig']").val(); //"Yes";
    ADCuttOffTimeConfig = $("input[fldTitle='hdnADCuttOffTimeConfig']").val(); //"21:00";
    ADCuttOffTime = Date.parse('2018/01/01 ' + ADCuttOffTimeConfig + ':00'); //Date is just a place holder
    ADCuttOffHrs = $("input[fldTitle='hdnADCuttOffHrs']").val(); //5;
    ADFlightHrs = $("input[fldTitle='hdnADFlightHrs']").val(); //12; //Date is just a place holder
    ADDays = $("input[fldTitle='hdnADDays']").val(); //1;
}
function calculateDANoOfDays(DAJSON) {
    var len = DAJSON.length;
    var flgADDaysAdded = false;
    //No of Days Calculation 
    var StartTime = "";
    var EndTime = "";
    var NoOfDays = 0;
    var StartDayType = "";
    var EndDayType = "";
    for (var i = 0; i < len; i++) {
        //Base No of Days Calculation
        NoOfDays = (daydiff(formatDate(DAJSON[i].StartDate), formatDate(DAJSON[i].EndDate))) + 1;
        //Additional Allowance
        if (ADAllowedConfig == "Yes") {
            NoOfDays += parseFloat(DAJSON[i].TSHAdditionalDay) * parseFloat(ADDays);
        }
        //Mid Night Allowance
        if (MidNightAllowedConfig == "Yes") {
            NoOfDays += parseFloat(DAJSON[i].TSHMidNigtTrips) * parseFloat(MidNightDaysConfig);
        }
        StartDayType = getDayType(DAJSON[i].StartDate);
        EndDayType = getDayType(DAJSON[i].EndDate);
        //No Days Adjustment based on Cuttoff time
        if (i == 0) { //Start time for the first trip
            StartTime = Date.parse('2018/01/01 ' + DAJSON[i].StartTime + ':00'); //Date is just a place holder
            switch (StartDayType) {
                case "WD":
                    if (StartTime > WDDepCuttOffTime) {
                        NoOfDays -= parseFloat(WDDepDaysConfig);
                    }
                    break;
                case "WE":
                    if (StartTime > WEDepCuttOffTime) {
                        NoOfDays -= parseFloat(WEDepDaysConfig);
                    }
                    break;
                case "PH":
                    if (StartTime > PHDepCuttOffTime) {
                        NoOfDays -= parseFloat(PHDepDaysConfig);
                    }
                    break;
                case "CH":
                    if (StartTime > CHDepCuttOffTime) {
                        NoOfDays -= parseFloat(CHDepDaysConfig);
                    }
                    break;
                default:;
            }
        }
        if (i == len - 1) { //End time for the last trip
            EndTime = Date.parse('2018/01/01 ' + DAJSON[i].EndTime + ':00'); //Date is just a place holder
            if (MidNightEndTime < MidNightStartTime) {
                MidNightEndTime = Date.parse('2018/01/02 ' + MidNightEndTimeConfig + ':00'); //Date is just a place holder
            }
            switch (EndDayType) {
                case "WD":
                    if (EndTime < WDArrCuttOffTime) {
                        NoOfDays -= parseFloat(WDArrDaysConfig);
                    }
                    if (MidNightAllowedConfig == "Yes" && EndTime > MidNightStartTime && EndTime < MidNightEndTime) {
                        if (WDMidNightInclConfig != "Yes") {
                            NoOfDays -= 0.5;
                        }
                    }
                    break;
                case "WE":
                    if (EndTime < WEArrCuttOffTime) {
                        NoOfDays -= parseFloat(WEArrDaysConfig);
                    }
                    if (MidNightAllowedConfig == "Yes" && EndTime > MidNightStartTime && EndTime < MidNightEndTime) {
                        if (WEMidNightInclConfig != "Yes") {
                            NoOfDays -= 0.5;
                        }
                    }
                    break;
                case "PH":
                    if (EndTime < PHArrCuttOffTime) {
                        NoOfDays -= parseFloat(PHArrDaysConfig);
                    }
                    if (MidNightAllowedConfig == "Yes" && EndTime > MidNightStartTime && EndTime < MidNightEndTime) {
                        if (PHMidNightInclConfig != "Yes") {
                            NoOfDays -= 0.5;
                        }
                    }
                    break;
                case "CH":
                    if (EndTime < CHArrCuttOffTime) {
                        NoOfDays -= parseFloat(CHArrDaysConfig);
                    }
                    if (MidNightAllowedConfig == "Yes" && EndTime > MidNightStartTime && EndTime < MidNightEndTime) {
                        if (CHMidNightInclConfig != "Yes") {
                            NoOfDays -= 0.5;
                        }
                    }
                    break;
                default:;
            }
        }
        DAJSON[i].NoOfDays = NoOfDays;
    }
    return DAJSON;
}
function setTblCols(objSpan, argVal) {
    var strHTML = "";
    if (objSpan != undefined && objSpan.length > 0) {
        objSpan.text(argVal);
        strHTML = objSpan[0].outerHTML;
        objSpan.parent().html(strHTML + argVal);
    }
}
function updateDAEntries(DAJSON) {
    drawDataTbl("idTblDA", true);
    var len = DAJSON.length;
    var flgUpdate = false;
    $('#ddlExpType').val("DailyAllowance");
    addExpenseType(true);
    var DANewPostEntriesJSON = [];
    $('#idTblDA tr').removeClass('processed');
    for (var i = 0; i < len; i++) {
        flgUpdate = false;
        var StartDate = DAJSON[i].StartDate;
        $(tableRowSelector('idTblDA')).each(function () {
            var tr = $(this);
            if (tr.hasClass("processed")) {
                return true;
            }
            setTblCols(tr.find("#idDACountry"), DAJSON[i].TSHDestCntry);
            setTblCols(tr.find("#idDACity"), DAJSON[i].TSHDestCity);
            setTblCols(tr.find("#idDANoofDays"), DAJSON[i].NoOfDays);
            setTblCols(tr.find("#idDAActualNoofDays"), DAJSON[i].NoOfDays);
            tr.find("#idDAStartDate").text(DAJSON[i].StartDate);
            tr.find("#idDAEndDate").text(DAJSON[i].EndDate);
            tr.find("#idDACountriesCities").text(DAJSON[i].DACountriesCities);
            tr.addClass("processed");
            flgUpdate = true;
            return false;
        });
        if (!flgUpdate) {
            //For creating New Post Entry
            DANewPostEntriesJSON.push(setDADataJSON(DAJSON[i]));
        }
    }
    $(tableRowSelector('idTblDA')).each(function () {
        var tr = $(this);
        if (!tr.hasClass("processed")) {
            if (travelStage == "pre") {
                tr.addClass("candelete");
            }
            else {
                var DAPreCntry = "";
                if (!!tr.find("#idDACountry").attr("prevalue")) {
                    DAPreCntry = tr.find("#idDACountry").attr("prevalue");
                }
                if (DAPreCntry == "") {
                    tr.addClass("candelete");
                }
                else {
                    tr.find("#idDANoofDays").text("0");
                    tr.find("#idDAActualNoofDays").text("0");
                    tr.addClass("processed");
                }
            }
        }
    });
    var table = $('#idTblDA').DataTable();
    table.rows('.candelete').nodes().to$().each(function () {
        var rowID = $(this).find('span[prekey="ID"]').text();
        var objDelRows = $("input[fldTitle='hdnExpenseEntriesDelRows']");
        if (rowID != "") {
            objDelRows.val(objDelRows.val() + rowID + ",");
        }
    });
    var rows = table.rows('.candelete').remove().draw();
    if (DANewPostEntriesJSON.length > 0) {
        var DAFinalJSON;
        var objDAJSON = getAllJSONFromTbl("idTblDA", true);
        var strJSON = JSON.stringify(objDAJSON);
        if ((strJSON == "[{}]" || strJSON == "[]")) {
            DAFinalJSON = DANewPostEntriesJSON;
        }
        else {
            DAFinalJSON = objDAJSON.concat(DANewPostEntriesJSON);
        }
        strDAJSON = JSON.stringify(DAFinalJSON);
        getExpRowIDs('idTblDA');
        generateDARow(strDAJSON, true);
        $('#idTblDA').find('.predisplay').hide();
    }
    generateSQNo('DAModal', 'idTblDA');
    collapseAll('idTblDA');
    if (!isEmptyTable("idTblDA")) {
        if (isDATableFilled()) {
            nullifyDADetails("DA details has been reset due to change in Travel Schedule. Please update DA details before submit.");
        }
    }
    drawDataTbl("idTblDA", false);
}
function getExpRowIDs(tblID) {
    var listName = $('#' + tblID).attr("listName");
    var objDelRows = $("input[fldTitle='hdn" + listName + "DelRows']");
    $(tableRowSelector(tblID)).each(function () {
        var tr = $(this);
        var rowID = tr.find('span[prekey="ID"]').text();
        if (rowID != "") {
            objDelRows.val(objDelRows.val() + rowID + ",");
        }
    });
}
//hdnExpenseDetailEntriesDelRows
function getSingleRowID(rowRef) {
    var objDelRows = $("input[fldTitle='hdnExpenseEntriesDelRows']");
    var rowID = rowRef.find('span[prekey="ID"]').text();
    if (rowID != "") {
        objDelRows.val(objDelRows.val() + rowID + ",");
    }
}
function checkAddDayPermitted() {
    //Additinal Day Configuration Values
    ADAllowedConfig = $("input[fldTitle='hdnADAllowedConfig']").val(); //"Yes";
    $('#idTSHAdditionalDayEdit').prev().css("color", "black");
    if (ADAllowedConfig != "Yes") {
        $('#idTSHAdditionalDayEdit').val("NA");
        $('#idTSHAdditionalDayEdit').attr("disabled", true);
        $('#idTSHAdditionalDayEdit').prev().css("color", "#e4e4e4");
        return true;
    }
    ADCuttOffTimeConfig = $("input[fldTitle='hdnADCuttOffTimeConfig']").val(); //"21:00";
    ADCuttOffHrs = $("input[fldTitle='hdnADCuttOffHrs']").val(); //5;
    ADFlightHrs = $("input[fldTitle='hdnADFlightHrs']").val(); //12; //Date is just a place holder
    var dtFormat = displayDateFormat + " H:mm";
    var DepDate = $.trim($("#idTSHDepDateEdit").val());
    var ArrDate = $.trim($("#idTSHArrDateEdit").val());
    var DepTime = $.trim($("#idTSHDepTimeEdit").val());
    var ArrTime = $.trim($("#idTSHArrTimeEdit").val());
    ADCuttOffTime = moment([DepDate, ADCuttOffTimeConfig].join(" "), dtFormat).toDate();
    var TripDep = moment([DepDate, DepTime].join(" "), dtFormat).toDate();
    var TripArr = moment([ArrDate, ArrTime].join(" "), dtFormat).toDate();
    var TripHrs = Math.abs(TripArr - TripDep) / 36e5;
    if ((TripDep > ADCuttOffTime && TripHrs > Number(ADCuttOffHrs)) || (TripHrs > Number(ADFlightHrs))) {
        return true;
    }
    return false;
}
//DA Table generation and number of days calculation based on the configuration - Ends
function winterAllowance(callingFrom) {
    var winExp = $.trim($("#ddlExpType option[value='" + arrExpCodes[0].idTblWIN + "']").text());
    var WADetails = $("input[fldTitle=hdnWinterAllowanceDetails]").val().split("#");
    var FirstClaim = WADetails[0] != "Yes";
    var NextClaim = WADetails[1] != "Yes";
    var FirstClaimDate = (!!WADetails[2]) ? dateObj(WADetails[2]) : null;
    var LastDateOfClaim = (!!WADetails[3]) ? dateObj(WADetails[3]) : null;
    var dateToAlert = (!!LastDateOfClaim ? (
                        FirstClaimDate > LastDateOfClaim ? FirstClaimDate : LastDateOfClaim
                    ) : FirstClaimDate);
    FirstClaim = (!FirstClaim && !FirstClaimDate) ? true : FirstClaim;
    var LastClaimAmount = WADetails[4];
    var duration = $("[fldtitle=hdnWinterAllowanceReclaimDuration]").val().trim();
    duration = (!!duration) ? outputNumber(duration) : 0;
    var today = null;
    if (travelStage == "pre")
        today = dateObj($("#idPreDeptDate").text());
    else
        today = dateObj($("#idPostDeptDate").text());
    var allowAmount = 0;
    if (duration < 0) {
        alertModal(winExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    if (!FirstClaim && duration > 0 && duration != 999) { // To check Full amount for next duration
        if (!!FirstClaimDate) {
            var nextFAllow = new Date(FirstClaimDate);
            nextFAllow.setDate(nextFAllow.getDate() + (Math.round(365 * duration)));
            if (today >= nextFAllow) { // Second time Full Amount after configured duration
                FirstClaim = true;
            }
        } else { // Second time Full Amount after configured duration
            FirstClaim = true;
        }
    }
    if (FirstClaim ? false : !NextClaim) {
        if (!LastDateOfClaim) { // Next Claim date is not available
            NextClaim = true;
        }
        else if (FirstClaimDate > LastDateOfClaim) {
            NextClaim = true;
        }
    }
    if (FirstClaim) {
        allowAmount = $("input[fldTitle=hdnWinterAllowanceAmtFirst]").val().trim();
        allowAmount = (!!allowAmount) ? outputNumber(allowAmount) : 0;
    } else if (NextClaim) {
        allowAmount = $("input[fldTitle=hdnWinterAllowanceAmtNext]").val().trim();
        allowAmount = (!!allowAmount) ? outputNumber(allowAmount) : 0;
    }
    var msgStr = "";
    if (!(FirstClaim || NextClaim)) { // Already applied First and Next claim
        if (duration == 999) { // Can claim First and Second only Once
            msgStr = "Already claimed. First Claimed on Date " + dateString(FirstClaimDate) + ". Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ".";
        } else {
            msgStr = "First Claimed on Date " + dateString(FirstClaimDate) + ". Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ". Cannot claim till " + duration + " year(s) from previous First claim.";
        }
    } else if (!FirstClaim && NextClaim && allowAmount <= 0) { // Only First claim
        if (duration == 999) { // Can claim First only Once
            msgStr = "Already claimed. Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ".";
        } else {
            msgStr = "Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ". Cannot claim till " + duration + " year(s) from previous claim.";
        }
    }
    if (msgStr != "") {
        switch (callingFrom) {
            case "modal":
                alertModal(msgStr);
                $("#idWINLCAmtEdit").val("");
                break;
            case "addExpense":
                alertModal(winExp + " cannot be added due to below reason(s).\n" + msgStr);
                break;
            case "submit":
                alertModal(winExp + " cannot be submitted due to below reason(s).\n" + msgStr);
                break;
            default:
                alertModal(msgStr);
        }
        return false;
    }
    if (allowAmount <= 0) {
        alertModal(winExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    if (callingFrom == "modal") {
        var curAmount = $("#idWINLCAmtEdit").val();
        curAmount = (!!curAmount) ? outputNumber(curAmount) : 0;
        $("#WINModal").find('.modalInfo').text("");
        if (allowAmount > curAmount) {
            var fld = $("#idWINLCAmtEdit");
            var gstFlds = $("#idWINTaxableAmtEdit,#idWINGSTAmtEdit");
            if (fld.attr("confirm") == "No") {
                confirmModal(
                "The applied " + winExp + " is less than available amount " + outputMoney(allowAmount) + ".<br/>Do you want to continue?",
                function () {
                    fld.attr("confirm", "Yes");
                    $("#WINModal").find(".btnupdate").click();
                },
                function () {
                    fld.val("");
                    gstFlds.val("0.00");
                    fld.attr("confirm", "No");

                });
                return false;
            }
        } else if (allowAmount < curAmount) {
            $("#WINModal").find('.modalInfo').text("Allowed Amount is " + outputMoney(allowAmount));
            $("#idWINLCAmtEdit").val("");
            showError();
            return false;
        }
    }
    if (callingFrom == "submit") {
        var curAmount = travelStage == "pre" ? outputNumber(expenseTypeObj.WinterAllowance.preLCAmt) : outputNumber(expenseTypeObj.WinterAllowance.postLCAmt);
        if (allowAmount < curAmount) {
            alertModal(winExp + " amount cannot be more than allowed amount " + outputMoney(allowAmount));
            return false;
        } else if (allowAmount > curAmount) {
            var flgConfirm = confirm("Applied " + winExp + " " + outputMoney(curAmount) + " is less than eligible amount " + outputMoney(allowAmount) + "\nDo you want to proceed with submission?");
            if (!flgConfirm) {
                return false;
            }
        }
        if (travelStage == "post" && $("tr[expcode='" + arrExpCodes[0].idTblWIN + "']").length > 0) { // Shoud update only when validated before post submit
            $("input[fldTitle=hdnWinterAllowanceType]").val(FirstClaim ? "first" : NextClaim ? "next" : "");
            $("input[fldTitle=hdnWinterAllowanceAmt]").val(curAmount);
        }
    }
    return true;
}
function confirmModal(captionTxt, yesFunction, noFunction) {
    $("#idConfirmPopup").find("#idConfirmCaption").html(captionTxt);
    $("#idConfirmPopup").find("#idCloseYes")[0].onclick = function () {
        yesFunction();
        $("#idConfirmPopup").modal("hide");
    }
    $("#idConfirmPopup").find("#idCloseNo")[0].onclick = function () {
        noFunction();
        $("#idConfirmPopup").modal("hide");
    }
    $("#idConfirmPopup").modal("show");
}
function alertModal(captionTxt) {
    $("#idTravelAlertModal").find("#idInfoCaption").html(captionTxt.replace(/\n/g, '<br/>'));
    $("#idTravelAlertModal").modal("show").one('hidden.bs.modal', function (e) {
        if (!!fldToFocus) {
            $(fldToFocus).focus();
            fldToFocus = null;
        }
    });
}
function getTableID(expCode) {
    var keys = Object.keys(arrExpCodes[0]);
    var tblID = "";
    for (var i = 0; i < keys.length; i++) {
        if (expCode == arrExpCodes[0][keys[i]]) {
            tblID = keys[i];
            break;
        }
    }
    return tblID;
}
function getGSTCodes() {
    var GSTCode = {
    };
    var urlForGSTCal = rootSiteUrl + "/_api/web/lists/getByTitle('GSTCodeMaster')/Items?$select=TaxPercentage,GSTCode";
    $.ajax({
        url: urlForGSTCal,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            var items = data.d.results;
            items.forEach(function (item) {
                GSTCode[item.GSTCode] = outputNumber(item.TaxPercentage);
            });
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    return GSTCode;
}
//Mileage Calc Functions starts
function refreshMileageType(flgDefaultValues) {
    var MileageType = $("#idMILTypeEdit").val();
    var distanceFields = $("#idMILMileageStartEdit,#idMILMileageEndEdit");
    var zoneFields = $("#idMILZoneEdit,#idMILCustomerZoneEdit,#idMILProvinceEdit,#idMILVisitingRouteEdit");
    var KMsFields = $("#idMILKmsMasterEdit,#idMILKmsActualEdit");
    var MLFromTo = $("#idMILFromEdit,#idMILToEdit");
    // Disable distance, zone and Kilometer fields
    distanceFields.prop("disabled", true);
    zoneFields.prop("disabled", true);
    KMsFields.prop("disabled", true);
    MLFromTo.prop("disabled", true);
    // Set default values
    zoneFields.each(function () {
        $(this).find("option[value=NA]").remove();
        if (flgDefaultValues) {
            $(this).val("Select");
        }
    });
    if (flgDefaultValues) {
        KMsFields.val(0);
        distanceFields.val(0);
        MLFromTo.val("");
    }
    switch (MileageType) {
        case "By Distance": // Enable Distance fields
            distanceFields.prop("disabled", false);
            MLFromTo.prop("disabled", false);
            zoneFields.each(function () {
                $(this).append('<option value="NA">NA</option>');
                $(this).val("NA");
            });
            break;
        case "By Zone": // Enable Zone fields
            zoneFields.prop("disabled", false);
            KMsFields.prop("disabled", false);
            if (flgDefaultValues) {
                MLFromTo.val("NA");
            }
            break;
        default:
            distanceFields.prop("disabled", false);
            zoneFields.prop("disabled", false);
            KMsFields.prop("disabled", false);
            MLFromTo.prop("disabled", false);
    }
}
function refreshKMsActuals() {
    var VR = $("#idMILVisitingRouteEdit").val();
    var KMActual = $("#idMILKmsActualEdit");
    var KMMaster = $("#idMILKmsMasterEdit");
    var MLStart = $("#idMILMileageStartEdit");
    var MLEnd = $("#idMILMileageEndEdit");
    if (VR == "Multiple" || VR == "Others") {
        KMActual.val(0);
        KMActual.prop("readonly", false);
    } else if (VR == "Round Trip") {
        var nVal = KMMaster.val();
        nVal = 2 * (!!nVal ? outputNumber(nVal) : 0);
        KMActual.val(nVal);
        KMActual.prop("readonly", true);
    } else {
        KMActual.val(0);
        KMActual.prop("readonly", true);
        return;
    }
    MLStart.val(0);
    MLEnd.val(KMActual.val());
    MLEnd.change();
}
function updateCustIndZone() {
    var zoneType = $("#idMILZoneEdit").val();
    var fldCIZ = $("#idMILCustomerZoneEdit");
    fldCIZ.find("option").remove();
    switch (zoneType) {
        case "Customer":
            fldCIZ.html($("#ddlhdnCustZone").html());
            break;
        case "Industry":
            fldCIZ.html($("#ddlhdnIndZone").html());
            break;
        default:
            fldCIZ.append('<option value="Select">Select</option>');
    }
}
function getKMsData() {
    var zone = $("#idMILZoneEdit").val();
    var CIZ = $("#idMILCustomerZoneEdit").val();
    var province = $("#idMILProvinceEdit").val();
    var fldKMsMaster = $("#idMILKmsMasterEdit");
    if (zone == "Select" || CIZ == "Select" || province == "Select") {
        return;
    } else {
        var urlForKMs = currentSiteUrl + "/_api/web/lists/getByTitle('MileageMaintenanceMaster')/Items?$select=Kilometers&$filter=ZoneType/Code eq'" + zone + "' and Zone/Code eq'" + CIZ + "' and Province/Code eq'" + province + "'&$top=1";
        var listData = getData(urlForKMs);
        listData = JSON.parse(listData);
        if (listData.length == 0) {
            fldKMsMaster.val(0);
            return;
        } else {
            var KMsVal = listData[0].Kilometers;
            fldKMsMaster.val(outputNumber(KMsVal));
        }
    }
    refreshKMsActuals();
}
//Mileage  Calc Functions Ends
function refreshDAAppx() {
    //To calculate DA Rate when multiple cities travelled on same day
    var DACountriesCities = $.unique(($("#idDACountriesCitiesEdit").val().replace(/(#@#)$/, "")).split("#@#"));
    var daDepDate = $.trim($("#" + (travelStage == "pre" ? "idPreDeptDate" : "idPostDeptDate")).text());
    var daArrDate = $.trim($("#" + (travelStage == "pre" ? "idPreArrDate" : "idPostArrDate")).text());
    var aType = $("#idDAAllowTypeEdit").val();
    daDepDate = daDepDate == "NA" ? "" : daDepDate;
    daArrDate = daArrDate == "NA" ? "" : daArrDate;
    aType = aType == "Select" ? "" : aType;
    if (daDepDate == "" || aType == "") {
        calculateWithDARate();
        return false;
    }
    daDepDate = moment(daDepDate, displayDateFormat).format("YYYY-MM-D");
    daArrDate = moment(daArrDate, displayDateFormat).format("YYYY-MM-D");
    var regularAllowance = ["OvernightDailyAllowanceperday", "OvernightBFast", "OvernightLunch", "OvernightDinner"];
    var oneDayAir = ["OnedayAirDailyAllowanceperday", "OnedayAirBFast", "OnedayAirLunch", "OnedayAirDinner"];
    var additionalDetails = ["HDNCurrency", "MealAllowanceType"];

    if (DACountriesCities.length > 0) {
        var objDA = [];
        $.each(DACountriesCities, function (i, item) {
            var countrycity = item.split("#~#");
            var Country = countrycity[0];
            var CityName = countrycity[1];
            if (!!Country && !!CityName) {
                var urlForDA = currentSiteUrl + "/_api/web/lists/getByTitle('DailyAllowanceType')/Items?$select=" + regularAllowance.concat(oneDayAir, additionalDetails).join(",") + "&"
                var filterURL = "";
                filterURL = "$filter=Country/Description eq'" + Country + "' and CityName/Description eq'" + CityName + "'";
                if (filterURL == "") {
                    return false;
                }
                var Alldivision = "All";
                filterURL += " and (Division/Title eq'" + division + "' or Division/Title eq'" + Alldivision + "') and TravellingTo eq'" + TravellingTo + "' and AllowanceType/DAType eq'" + aType + "' and StaffGrade/StaffGrade eq'" + staffGrade + "' and EffectiveStartDate le'" + daDepDate + "' and EffectiveEndDate ge'" + daDepDate + "'&$top=1";
                urlForDA = urlForDA + filterURL;
                $.ajax({
                    url: urlForDA,
                    type: "GET",
                    async: false,
                    headers: { "accept": "application/json;odata=verbose" },
                    success: function (data) {
                        var items = data.d.results;
                        if (items.length == 0) {
                            $("#DAModal").find('.modalInfo').text("DA not available. Please Contact Administrator.");
                            showError();
                            return;
                        }
                        else {
                            objDA.push({});
                            regularAllowance.forEach(function (type) { objDA[objDA.length - 1][type] = items[0][type]; });
                            oneDayAir.forEach(function (type) { objDA[objDA.length - 1][type] = items[0][type]; });
                            objDA[objDA.length - 1].currency = items[0]["HDNCurrency"];
                            objDA[objDA.length - 1].maType = items[0]["MealAllowanceType"];
                        }
                    },
                    error: function (error) {
                        console.log(JSON.stringify(error));
                    }
                });
            }
        });
        if (objDA.length > 0) {
            var curDAType = ((daDepDate != daArrDate) ? regularAllowance : oneDayAir);
            if (!!curDAType) {
                var setDA = ["$", baseCurrency, 0, 0, 0, 0];
                objDA.forEach(function (oDA) {
                    var bfast = lunch = dinner = daRateTot = 0;
                    daRateTot = outputNumber(oDA[curDAType[0]]);
                    bfast = outputNumber(oDA[curDAType[1]]);
                    lunch = outputNumber(oDA[curDAType[2]]);
                    dinner = outputNumber(oDA[curDAType[3]]);
                    if (oDA.currency.toLowerCase() != baseCurrency.toLowerCase()) {
                        daRateTot = daRateTot * getExchRate(oDA.currency);
                    }
                    if (objDA.maType == "Percentage") {
                        bfast = daRateTot * bfast * 0.01;
                        lunch = daRateTot * lunch * 0.01;
                        dinner = daRateTot * dinner * 0.01;
                    }
                    setDA[2] += daRateTot;
                    setDA[3] += bfast;
                    setDA[4] += lunch;
                    setDA[5] += dinner;
                });
                setDA[2] = setDA[2] / objDA.length;
                setDA[3] = setDA[3] / objDA.length;
                setDA[4] = setDA[4] / objDA.length;
                setDA[5] = setDA[5] / objDA.length;
                setDA = setDA.join("#");
                $('input[fldTitle="hdnDADetails"]').val(setDA);
            } else {
                return false;
            }
        } else {
            calculateWithDARate();
            $("#DAModal").find('.modalInfo').text("DA Rate is not available");
            showError();
            return false;
        }
        calculateWithDARate();
        return true;
    }
}
//DA Calc Functions starts
function refreshDA() {
    $('input[fldTitle="hdnDADetails"]').val("$#" + baseCurrency + "#0#0#0#0");
    if ($("#idDACountriesCitiesEdit").val() != "") {
        return refreshDAAppx();
    }
    var Country = $.trim($("#idDACountryEdit").find("option:selected").text());
    var CityName = $.trim($("#idDACityEdit").find("option:selected").text());
    var daDepDate = $.trim($("#" + (travelStage == "pre" ? "idPreDeptDate" : "idPostDeptDate")).text());
    var daArrDate = $.trim($("#" + (travelStage == "pre" ? "idPreArrDate" : "idPostArrDate")).text());
    var aType = $("#idDAAllowTypeEdit").val();
    Country = Country == "Select" ? "" : Country;
    CityName = CityName == "Select" ? "" : CityName;
    daDepDate = daDepDate == "NA" ? "" : daDepDate;
    daArrDate = daArrDate == "NA" ? "" : daArrDate;
    aType = aType == "Select" ? "" : aType;
    if (Country == "" || CityName == "" || daDepDate == "" || aType == "") {
        calculateWithDARate();
        return false;
    }
    daDepDate = moment(daDepDate, displayDateFormat).format("YYYY-MM-D");
    daArrDate = moment(daArrDate, displayDateFormat).format("YYYY-MM-D");
    var regularAllowance = ["OvernightDailyAllowanceperday", "OvernightBFast", "OvernightLunch", "OvernightDinner"];
    var oneDayAir = ["OnedayAirDailyAllowanceperday", "OnedayAirBFast", "OnedayAirLunch", "OnedayAirDinner"];
    var additionalDetails = ["HDNCurrency", "MealAllowanceType"];
    var urlForDA = currentSiteUrl + "/_api/web/lists/getByTitle('DailyAllowanceType')/Items?$select=" + regularAllowance.concat(oneDayAir, additionalDetails).join(",") + "&"
    var filterURL = "";
    if (TravellingTo == "Domestic") {
        //filterURL = "$filter=CityName/Description eq'" + CityName + "'";
        filterURL = "$filter=Country/Description eq'" + CityName + "' or CityName/Description eq'" + CityName + "'";
    } else {
        filterURL = "$filter=Country/Description eq'" + Country + "'";
        if (Country.toLowerCase() != CityName.toLowerCase()) {
            filterURL += " and CityName/Description eq'" + CityName + "'";
        }
    }
    if (filterURL == "") {
        return false;
    }
    var Alldivision = "All";
    filterURL += " and (Division/Title eq'" + division + "' or Division/Title eq'" + Alldivision + "') and TravellingTo eq'" + TravellingTo + "' and AllowanceType/DAType eq'" + aType + "' and StaffGrade/StaffGrade eq'" + staffGrade + "' and EffectiveStartDate le'" + daDepDate + "' and EffectiveEndDate ge'" + daDepDate + "'&$top=1";
    urlForDA = urlForDA + filterURL;
    var objDA = null;
    $.ajax({
        url: urlForDA,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            if (items.length == 0) {
                $("#DAModal").find('.modalInfo').text("DA not available. Please Contact Administrator.");
                showError();
                return;
            }
            else {
                objDA = {};
                regularAllowance.forEach(function (type) { objDA[type] = items[0][type]; });
                oneDayAir.forEach(function (type) { objDA[type] = items[0][type]; });
                objDA.currency = items[0]["HDNCurrency"];
                objDA.maType = items[0]["MealAllowanceType"];
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    if (!!objDA) {
        var curDAType = ((daDepDate != daArrDate) ? regularAllowance : oneDayAir);
        if (!!curDAType) {
            var setDA = [
                objDA.maType == "Percentage" ? "%" : "$",
                objDA.currency,
                objDA[curDAType[0]],
                objDA[curDAType[1]],
                objDA[curDAType[2]],
                objDA[curDAType[3]]
            ].join("#");
            $('input[fldTitle="hdnDADetails"]').val(setDA);
        } else {
            return false;
        }
    } else {
        calculateWithDARate();
        $("#DAModal").find('.modalInfo').text("DA Rate is not available");
        showError();
        return false;
    }
    calculateWithDARate();
    return true;
}
function calculateWithDARate() {
    var DARate = $.trim($('input[fldTitle="hdnDADetails"]').val());
    if (DARate == "") {
        return false;
    }
    DARate = DARate.split("#");
    var bfast = lunch = dinner = daRateTot = 0;
    var daCurrency = DARate[1];
    daRateTot = outputNumber(DARate[2]);
    bfast = outputNumber(DARate[3]);
    lunch = outputNumber(DARate[4]);
    dinner = outputNumber(DARate[5]);
    if (DARate[0] == "%") { // Percentage Calculation
        bfast = daRateTot * bfast * 0.01;
        lunch = daRateTot * lunch * 0.01;
        dinner = daRateTot * dinner * 0.01;
    }
    $("#idDADailyRateEdit").val(outputMoney(daRateTot));
    $("#idDACBrkFastEdit,#idDACLnchEdit,#idDACDinnerEdit,#idDAActualNoofDaysEdit,#idDANoofDaysEdit").each(function () {
        $(this).val(
            $.trim($(this).val()).replace(/[^0-9\.]/g, "").replace(/\.+/g, ".")
        );
        $(this).val(
            ["", "."].indexOf($.trim($(this).val())) != -1 ? 0 : outputNumber($(this).val())
        );
    });
    var bfastCnt = outputNumber($("#idDACBrkFastEdit").val());
    var lunchCnt = outputNumber($("#idDACLnchEdit").val());
    var dinnerCnt = outputNumber($("#idDACDinnerEdit").val());
    var daDays = outputNumber($("#idDAActualNoofDaysEdit").val());
    var sysdaDays = outputNumber($("#idDANoofDaysEdit").val());
    if (sysdaDays < daDays) {
        $("#DAModal").find('.modalInfo').text("Actual Number of Days cannot be more than " + outputMoney(sysdaDays));
        $("#idDAActualNoofDaysEdit").val(0);
        $("#idDAFCAmtEdit,#idDALCAmtEdit,#idDATaxAmtEdit,#idDAGSTAmtEdit").val(outputMoney(0));
        showError();
        return false;
    }
    if (daDays == 0) {
        bfast = lunch = dinner = 0;
    }
    $("#idDAFCAmtEdit").val(outputMoney((daDays * daRateTot) - (bfastCnt * bfast) - (lunchCnt * lunch) - (dinnerCnt * dinner)));
    $("#idDACurrencyEdit").val(daCurrency).change();
    return true;
}
function nullifyDADetails(alrtStr) {
    if (!isEmptyTable("idTblDA")) {
        drawDataTbl("idTblDA", true);
        var postKeys = ["PostAllowType", "PostFCAmt", "PostLCAmt", "PostDARate", "GSTAmt", "TaxableAmt"];
        var valsToUpdate = ["Select", "0.00", "0.00", "0.00", "0.00", "0.00"];
        var changedAny = false;
        $(tableRowSelector("idTblDA")).each(function () {
            var daRow = $(this);
            var preCountry = $.trim(daRow.find("*[prekey='PreCountry']").attr('prevalue'));
            var postDays = $.trim(daRow.find("*[postkey='PostDays']").text());
            postDays = (!!postDays) ? outputNumber(postDays) : 0;
            if ((preCountry == "" || preCountry == "NA") && postDays == 0) {
                getSingleRowID(daRow);
                $("#idTblDA").DataTable().rows(daRow).remove();
            } else {
                postKeys.forEach(function (key, idx) {
                    var objSpan = daRow.find("span[postkey='" + key + "']");
                    var strHTML = "";
                    if (objSpan != undefined && objSpan.length > 0) {
                        if (idx == 0 && $.trim(objSpan.text()) != "Select") {
                            changedAny = true;
                        }
                        objSpan.text(valsToUpdate[idx]);
                        if (travelStage == "pre") {
                            objSpan.attr("prevalue", valsToUpdate[idx]);
                            if (key == "PostLCAmt") {
                                daRow.find(".prelcamt").text(valsToUpdate[idx]);
                            }
                        }
                        strHTML = objSpan[0].outerHTML;
                        objSpan.parent().html(strHTML + valsToUpdate[idx]);
                    }
                });
            }
        });
        drawDataTbl("idTblDA", false);
        if (changedAny && !!alrtStr) {
            alertModal(alrtStr);
        }
    }
}
//DA Calc Functions Ends
//Post Travel Zero LC Amount Submission
function postTravelZeroLCConfirm(modalId) {
    var LCAmtFld = $("#" + modalId).find("#" + [
        "idACCLCAmtEdit", "idATCLCAmtEdit", "idAPTLCAmtEdit", "idCOMLCAmtEdit", "idCALCAmtEdit", "idDALCAmtEdit", "idENTLCAmtEdit",
        "idEXBLCAmtEdit", "idGIFTLCAmtEdit", "idLAULCAmtEdit", "idMEDLCAmtEdit", "idOTHLCAmtEdit", "idMILLCAmtEdit", "idMISLCAmtEdit",
        "idPASLCAmtEdit", "idPRPLCAmtEdit", "idTRNCLCAmtEdit", "idTSPLCAmtEdit", "idVSALCAmtEdit", "idWINLCAmtEdit"
    ].join(",#"));
    var FCAmtFld = $("#" + modalId).find("#" + [
        "idACCFCAmtEdit", "idATCFCAmtEdit", "idAPTFCAmtEdit", "idCOMFCAmtEdit", "idCAFCAmtEdit", "idDAFCAmtEdit", "idENTFCAmtEdit",
        "idEXBFCAmtEdit", "idGIFTFCAmtEdit", "idLAUFCAmtEdit", "idMEDFCAmtEdit", "idOTHFCAmtEdit", "idMILFCAmtEdit", "idMISFCAmtEdit",
        "idPASFCAmtEdit", "idPRPFCAmtEdit", "idTRNCFCAmtEdit", "idTSPFCAmtEdit", "idVSAFCAmtEdit", "idWINFCAmtEdit"
    ].join(",#"));
    if (LCAmtFld.length > 0) {
        var confirmVal = LCAmtFld.attr("confirm");
        var LCAmount = outputNumber(LCAmtFld.val());
        if (confirmVal != "Yes" && LCAmount == 0) {
            LCAmtFld.attr("confirm", "No");
            confirmModal(
            "LC Amount is 0.00. Do you like to continue?",
            function () {
                LCAmtFld.attr("confirm", "Yes");
                clickedModalBtn.click();
            },
            function () {
                LCAmtFld.attr("confirm", "No");
                if (FCAmtFld.length > 0) {
                    FCAmtFld.focus();
                }
            });
            return false;
        }
    }
    return true;
}
function isPreExpenseRow(expenseDetailRow) {
    var rowID = expenseDetailRow.find('span[prekey="ID"]').text();
    var tblID = expenseDetailRow.closest('table').attr('id');
    var expCode = arrExpCodes[0][tblID];
    if (tblID == "idTblTSH") {
        expCode = "TravelSchedule";
    }
    return !canDeleteRow(expCode, rowID, tblID);
}
function setExpDetails() {
    // This will fetch Expense and GLCode information with difference against post and sets in global variable ExpenseDetails
    if (ExpenseDetails.init) {
        return;
    }
    ExpenseDetails.init = true;
    var items = getData(currentSiteUrl + "/_api/web/lists/getByTitle('ExpenseType')/Items?$select=ExpenseType,GLCodeRefersTo,PostToHRIQ");
    items = JSON.parse(items);
    items.forEach(function (item) {
        ExpenseDetails[item.ExpenseType] = {
            "isSubTypeBased": (!!item.GLCodeRefersTo) ? item.GLCodeRefersTo.toLowerCase() == "sub type" : false,
            "isHRIQ": (!!item.PostToHRIQ) ? item.PostToHRIQ.toLowerCase() == "yes" : false,
            "mainGLCode": {},
            "subGLCode": {},
            "diffPost": {},
            "taxCode": {},
            "expSubTypes": []
        };
        allTravelTypes.forEach(function (type) {
            ExpenseDetails[item.ExpenseType].mainGLCode[type] = "";
            ExpenseDetails[item.ExpenseType].subGLCode[type] = {};
            ExpenseDetails[item.ExpenseType].taxCode[type] = "";
            ExpenseDetails[item.ExpenseType].diffPost[type] = 0; // Check whether default is 0 or Infinity
        });
        if (ExpenseDetails[item.ExpenseType].isHRIQ) {
            ExpenseDetails.expHRIQ.push(item.ExpenseType);
        }
    });
    items = getData(currentSiteUrl + "/_api/web/lists/getByTitle('ExpenseSubType')/Items?$select=ExpenseType,ExpenseSubType");
    items = JSON.parse(items);
    items.forEach(function (item) {
        ExpenseDetails[item.ExpenseType].expSubTypes.push(item.ExpenseSubType);
        allTravelTypes.forEach(function (type) {
            ExpenseDetails[item.ExpenseType].subGLCode[type][item.ExpenseSubType] = "";
        });
    });
    items = getData(currentSiteUrl + "/_api/web/lists/getByTitle('ExpenseTypeMapping')/Items?$select=ExpenseType,ExpenseSubType/ExpenseSubType,TravelType/TravelType,WageTypeGLCode,SubTypeGLCode,TaxCode,DiffAgainstPost&$expand=ExpenseSubType/ExpenseSubType,TravelType/TravelType");
    items = JSON.parse(items);
    items.forEach(function (item) {
        var objU = ExpenseDetails[item.ExpenseType];
        if (!!item.WageTypeGLCode)
            objU.mainGLCode[item.TravelType.TravelType] = item.WageTypeGLCode;
        if (!!item.ExpenseSubType.ExpenseSubType) {
            objU.subGLCode[item.TravelType.TravelType][item.ExpenseSubType.ExpenseSubType] = (!!item.SubTypeGLCode) ? item.SubTypeGLCode : item.WageTypeGLCode;
        }
        if ((!!item.DiffAgainstPost)) {
            objU.diffPost[item.TravelType.TravelType] = item.DiffAgainstPost;
        }
        if ((!!item.TaxCode)) {
            objU.taxCode[item.TravelType.TravelType] = item.TaxCode;
        }
    });
}
function refreshExpenseGLCode(curfld) {
    // To refresh GL Code on change of Expense Type
    var tblID = curfld.closest(".popupmodal").find(".btnupdate").attr("expensetbl");
    if (tblID == "idTblOTH")
        tblID = "idTblMIL"
    var fldGLCode = curfld.closest(".popupmodal").find(".glcode");
    var expType = arrExpCodes[0][tblID];
    var curExpense = ExpenseDetails[expType];
    fldGLCode.val("");
    var GLCode = curExpense.mainGLCode[activeTravelType];
    var subGLCode = "";
    if (curExpense.isSubTypeBased) {
        subGLCode = curExpense.subGLCode[activeTravelType][curfld.val()];
    }
    GLCode = (!!subGLCode) ? subGLCode : GLCode;
    fldGLCode.val(GLCode);
    return true;
}
//Budget Implementation Starts
function getTravelInfoBudget() {
    var budgetType = $("select[fldTitle='BudgetType']").val().toLowerCase();
    var CostCenter = $("select[fldTitle='ChargeToPC']").val();
    var GLCode = $("input[fldTitle='txtGLCode']").val();
    if (!(budgetType == "iaf budget" || budgetType == "bp budget") || (CostCenter == "Select" || GLCode == "" || GLCode == "NA")) {
        generateBudgetTbl(false);
        return;
    }
    var currRate = budgetType == "bp budget" ? BudgetCurrencyRate : IAFBudgetCurrencyRate;
    var budgetKey = CostCenter + "/" + GLCode;
    var BudgetAmount = 0;
    var BudgetUtilized = 0;
    var PendingApproval = 0;
    var AvailableBudget = 0;
    var AppliedAmount = 0;
    var SurplusDeficit = 0;
    var getBudgetData = [];
    var IAFNo = "";
    if (budgetType.toLowerCase() == "iaf budget") {
        IAFNo = $("select[fldTitle='IAFRef']").val();
        if (IAFNo == "Select" || IAFNo == "") {
            generateBudgetTbl(false);
            return;
        }
        budgetKey = IAFNo + "/" + budgetKey;
        getBudgetData = getData(rootSiteUrl + "/eIAF/_api/web/lists/getByTitle('eIAFApplication')/Items?$select=HDNTotalAmount,HDNTotalExpenseAmount&$filter=DocRefNo eq '" + IAFNo + " '")
    }
    else {
        getBudgetData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('BudgetMaster')/Items?$filter=ProfitCenterID/ProfitCenterId eq'" + CostCenter + "' and GLCode eq'" + GLCode + "' and FinancialYear eq'" + finYear + "'");
    }
    if (travelStage == "pre") {
        AppliedAmount = outputNumber($("input[fldTitle='ExclPreTrvlTotCost']").val());
    }
    else {
        AppliedAmount = outputNumber($("input[fldTitle='ExclPostTrvlTotCost']").val());
    }
    AppliedAmount = outputNumber(AppliedAmount) * outputNumber(currRate);
    var budgetInfoColl = JSON.parse(getBudgetData);
    if (budgetInfoColl.length == 0) {
        BudgetNotAvailable = budgetKey;
    }
    else {
        var prevBudgetAmount = 0;
        if (budgetType == "bp budget") {
            BudgetAmount = outputNumber(budgetInfoColl[0].BudgetAmount);
            BudgetUtilized = outputNumber(budgetInfoColl[0].BudgetUtilized);
            PendingApproval = outputNumber(budgetInfoColl[0].PendingApproval);
            prevBudgetAmount = getPreviousBudgetAmt(CostCenter + "/" + GLCode);
        }
        else {
            BudgetAmount = budgetInfoColl[0].HDNTotalAmount;
            BudgetUtilized = budgetInfoColl[0].HDNTotalExpenseAmount;
            pendingApproval = 0;
        }
        AvailableBudget = outputNumber(BudgetAmount) - (BudgetUtilized + PendingApproval) + outputNumber(prevBudgetAmount);
        SurplusDeficit = AvailableBudget - AppliedAmount;
    }
    budgetSumColl.push({
        "BudgetKey": budgetKey,
        "BudgetAmount": BudgetAmount,
        "AvailableBudget": AvailableBudget,
        "AppliedAmount": AppliedAmount,
        "SurplusDeficit": SurplusDeficit,
        "BudgetType": "TravelInfo"
    });
}
function getTravelExpBudget() {
    if ($("input[fldTitle='hdnBudgetRequired']").val() == "No" || $("input[fldTitle='hdnBudgetRequired']").val() == "") {
        return;
    }
    if ($("select[fldTitle='BudgetType']").val() == null || $("select[fldTitle='BudgetType']").val() == undefined || $("select[fldTitle='BudgetType']").val() == "") {
        return;
    }
    var budgetType = $("select[fldTitle='BudgetType']").val().toLowerCase();
    BudgetNotAvailable = "";
    budgetSumColl = [];
    if (budgetType == "iaf budget") {
        getTravelInfoBudget();
        generateBudgetTbl(false);
        return;
    }
    if (budgetType != "bp budget") {
        generateBudgetTbl(false);
        return;
    }
    var keyName = "prekey";
    var CostCenterKey = "PreCostCenter";
    var LCAmtKey = "PreLCAmt";
    var budgetSummaryArray = [];
    var tempbudgetSumColl = [];
    if (travelStage == "post") {
        keyName = "postkey";
        CostCenterKey = "PostCostCenter";
        LCAmtKey = "PostLCAmt";
    }
    var ChargeToPC = $("select[fldTitle='ChargeToPC']").val();
    var expJson = getJSONFromTbl("idTblEXP");
    $.each(expJson, function (key, value) {
        var ExpType = value.ExpType;
        if (OnlyPostExpTypes.indexOf(ExpType) != -1 && travelStage == "pre") {
            var GLCode = value.GLCode;
            var AppliedAmount = outputNumber(value.PreLCAmt);
            AppliedAmount = outputNumber(AppliedAmount) * outputNumber(BudgetCurrencyRate);
            budgetSummaryArray.push({
                "BudgetKey": ChargeToPC + "/" + GLCode,
                "AppliedAmount": AppliedAmount,
            });
            return;
        }
        var tblID = getExpTypeTblID(value.ExpType);
        drawDataTbl(tblID, true);
        $(tableRowSelector(tblID)).each(function () {
            var tr = $(this);
            var CostCenter = "";
            CostCenter = tr.find("span[" + keyName + "='" + CostCenterKey + "']").text();
            if (CostCenter == undefined || CostCenter == "") {
                return;
            }
            var GLCode = "";
            var AppliedAmount = 0;
            GLCode = tr.find("span[" + keyName + "='GLCode']").text();
            AppliedAmount = tr.find("span[" + keyName + "='" + LCAmtKey + "']").text();
            AppliedAmount = outputNumber(AppliedAmount) * outputNumber(BudgetCurrencyRate);
            budgetSummaryArray.push({
                "BudgetKey": CostCenter + "/" + GLCode,
                "AppliedAmount": AppliedAmount,
            });
        });
        drawDataTbl(tblID, false);
    });
    tempbudgetSumColl = reduceBudgetSummaryArray(budgetSummaryArray);
    budgetSumColl = [];
    $.each(tempbudgetSumColl, function (i, item) {
        var BudgetAmount = 0;
        var BudgetUtilized = 0;
        var PendingApproval = 0;
        var AvailableBudget = 0;
        var AppliedAmount = item.AppliedAmount;
        var SurplusDeficit = 0;
        var prevBudgetAmount = 0;
        var BudgetKey = item.BudgetKey;
        var BudgetKeyArr = BudgetKey.split("/");
        var CostCenter = BudgetKeyArr[0];
        var GLCode = BudgetKeyArr[1];
        var getBudgetData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('BudgetMaster')/Items?$filter=ProfitCenterID/ProfitCenterId eq'" + CostCenter + "' and GLCode eq'" + GLCode + "' and FinancialYear eq'" + finYear + "'");
        budgetInfoColl = JSON.parse(getBudgetData);
        if (budgetInfoColl.length == 0) {
            SurplusDeficit = outputNumber(AppliedAmount) * -1;
        }
        else {
            BudgetAmount = outputNumber(budgetInfoColl[0].BudgetAmount);
            BudgetUtilized = outputNumber(budgetInfoColl[0].BudgetUtilized);
            PendingApproval = outputNumber(budgetInfoColl[0].PendingApproval);
            prevBudgetAmount = getPreviousBudgetAmt(BudgetKey);
            AvailableBudget = outputNumber(BudgetAmount) - (BudgetUtilized + PendingApproval) + outputNumber(prevBudgetAmount);
            SurplusDeficit = AvailableBudget - AppliedAmount;
        }
        budgetSumColl.push({
            "BudgetKey": BudgetKey,
            "BudgetAmount": BudgetAmount,
            "AvailableBudget": AvailableBudget,
            "AppliedAmount": AppliedAmount,
            "SurplusDeficit": SurplusDeficit,
            "BudgetType": "Expense"
        });
    });
    getTravelInfoBudget();
    generateBudgetTbl(false);
}
function generateBudgetTbl(argFlgIntialLoading) {
    $("#idTblBUD").find("tr:not(:first)").remove();
    $("#idTblBUDPS").find("tr:not(:first)").remove();
    if (argFlgIntialLoading) {
        budgetSumColl = getData(currentSiteUrl + "/_api/web/lists/getByTitle('BudgetDetails')/Items?$filter=LinkKey/LinkKey eq'" + linkKey + "'");
        budgetSumColl = JSON.parse(budgetSumColl);
        PreviousBudgetAmtColl = budgetSumColl;
    }
    $("input[fldTitle='hdnBudgetSummaryRows']").val(JSON.stringify(budgetSumColl));
    var TravelInfoBudgetData = budgetSumColl.filter(function (item) { return (item.BudgetType == "TravelInfo"); });
    if (TravelInfoBudgetData.length > 0) {
        var clsRed = "";
        if (outputNumber(TravelInfoBudgetData[0].SurplusDeficit) < 0) {
            clsRed = "colorRed"
        }
        var strRow = '<tr><td>' + TravelInfoBudgetData[0].BudgetKey + '</td><td class="amount">' + outputMoney(TravelInfoBudgetData[0].BudgetAmount) + '</td>';
        strRow += '<td class="amount">' + outputMoney(TravelInfoBudgetData[0].AvailableBudget) + '</td><td class="amount">' + outputMoney(TravelInfoBudgetData[0].AppliedAmount) + '</td>';
        strRow += '<td class="amount ' + clsRed + '">' + outputMoney(TravelInfoBudgetData[0].SurplusDeficit) + '</td></tr>';
        $("#idTblBUD").append(strRow);
    }
    else {
        $("#idTblBUD").append('<tr><td class="center" colspan="5">No data available in table</td></tr>');
    }
    var TravelExpBudgetData = budgetSumColl.filter(function (item) { return (item.BudgetType != "TravelInfo"); });
    if (TravelExpBudgetData.length > 0) {
        $.each(TravelExpBudgetData, function (i, item) {
            var clsRed = "";
            if (outputNumber(item.SurplusDeficit) < 0) {
                clsRed = "colorRed"
            }
            var strRow = '<tr><td>' + item.BudgetKey + '</td><td class="amount">' + outputMoney(item.BudgetAmount) + '</td>';
            strRow += '<td class="amount">' + outputMoney(item.AvailableBudget) + '</td><td class="amount">' + outputMoney(item.AppliedAmount) + '</td>';
            strRow += '<td class="amount ' + clsRed + '">' + outputMoney(item.SurplusDeficit) + '</td></tr>';
            $('#idTblBUDPS').append(strRow);
        });
    }
    else {
        $("#idTblBUDPS").append('<tr><td class="center" colspan="5">No data available in table</td></tr>');
    }
}
function getPreviousBudgetAmt(argKey) {
    var previousAppliedAmt = 0;
    var resultJSON = [];
    resultJSON = PreviousBudgetAmtColl.filter(function (data) {
        return (data["BudgetKey"] == argKey);
    });
    if (resultJSON.length == 0)
        return previousAppliedAmt;
    previousAppliedAmt = resultJSON[0].AppliedAmount
    return (previousAppliedAmt == "") ? 0 : outputNumber(previousAppliedAmt);
}
function reduceBudgetSummaryArray(budgetSummaryArray) {
    var result = [];
    if (budgetSummaryArray.length > 0) {
        budgetSummaryArray.reduce(function (res, value) {
            if (!res[value.BudgetKey]) {
                res[value.BudgetKey] = {
                    BudgetKey: value.BudgetKey,
                    AppliedAmount: outputNumber(0)
                };
                result.push(res[value.BudgetKey]);
            }
            res[value.BudgetKey].AppliedAmount += outputNumber(value.AppliedAmount)
            return res;
        }, {});
    }
    return result;
}
function getFinancialCurrencyRate() {
    var getFinCurrencyRate = getData(rootSiteUrl + "/_api/web/lists/getByTitle('FinancialYearRateMaster')/Items?$select=LCtoUSDRate&$filter=FinancialYear eq'" + finYear + "'");
    FinCurrencyRate = JSON.parse(getFinCurrencyRate);
    if (FinCurrencyRate.length == 0) {
        alertModal("Financial Year Rate Master for(" + finYear + ") not found for USD.Please contact administrator");
        return;
    }
    FinCurrencyRate = outputNumber(FinCurrencyRate[0].LCtoUSDRate);
}
function getIAFRefNo() {
    var eIAFRefNoColl = [];
    try {
        eIAFRefNoColl = getData(rootSiteUrl + "/eIAF/_api/web/lists/getByTitle('eIAFApplication')/Items?$select=DocRefNo&$filter=DocumentStatus eq 'Approved '");
    }
    catch (e) {
        $('#IAFRef').find('option').remove();
        var option = '<option value="Select">Select</option>';
        $("#IAFRef").html(option);
        console.log("IAF Application not configured. Please contact administrator.");
        return;
    }
    if (eIAFRefNoColl != undefined) {
        if (eIAFRefNoColl.length == 0) {
            $('#IAFRef').find('option').remove();
            var option = '<option value="Select">Select</option>';
            $("#IAFRef").html(option);
            return;
        }
        eIAFRefNoColl = JSON.parse(eIAFRefNoColl);
        var option = '<option value="Select">Select</option>';
        for (var i = 0; i < eIAFRefNoColl.length; i++) {
            option += '<option value="' + eIAFRefNoColl[i].DocRefNo + '">' + eIAFRefNoColl[i].DocRefNo + '</option>';
        }
        $('#IAFRef').find('option').remove();
        $("#IAFRef").html(option);
    }
    else {
        $('#IAFRef').find('option').remove();
        var option = '<option value="Select">Select</option>';
        $("#IAFRef").html(option);
        console.log("IAF Application not configured. Please contact administrator.");
        return;
    }
}
//Budget Implementation Ends
function getCalendarDetails() {
    var curYear = new Date().getFullYear();
    var fromDt = [new String(curYear - 1), "01", "01"].join("-");
    var toDt = [new String(curYear + 1), "12", "31"].join("-");
    var holidayURL = rootSiteUrl + "/_api/web/lists/getByTitle('CalendarProfileMaster')/Items?$select=HolidayDates,HolidayType&$filter=CompanyName/Title eq'" + companyName + "' and HolidayDates ge'" + fromDt + "' and HolidayDates le'" + toDt + "'";
    getDataAsync(holidayURL, function (listData) {
        listData = JSON.parse(listData);
        CalendarDetails.holidays.ch = [];
        CalendarDetails.holidays.ph = [];
        CalendarDetails.holidays.all = [];
        listData.forEach(function (item) {
            if ($.trim(item.HolidayType).toLowerCase() == "company declared holiday") {
                CalendarDetails.holidays.ch.push(dateString(dateObjOffset(item.HolidayDates)));
            } else {
                CalendarDetails.holidays.ph.push(dateString(dateObjOffset(item.HolidayDates)));
            }
            CalendarDetails.holidays.all.push(dateString(dateObjOffset(item.HolidayDates)));
        });
        var wwURL = rootSiteUrl + "/_api/web/lists/getByTitle('CompanyMaster')/Items?$select=WorkWeek,ExchRateSiteURL&$filter=Title eq'" + companyName + "'&$top=1";
        getDataAsync(wwURL, function (listData) {
            listData = JSON.parse(listData);
            var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var configdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            if (listData.length > 0) {
                configdays = listData[0].WorkWeek.results;
                if (!!listData[0].ExchRateSiteURL && (listData[0].ExchRateSiteURL.toUpperCase() != "NA")) {
                    exchRateSiteUrl = listData[0].ExchRateSiteURL;
                }
            }
            CalendarDetails.we = [];
            CalendarDetails.wd = [];
            weekdays.forEach(function (day, idx) {
                if (configdays.indexOf(day) == -1) {
                    CalendarDetails.we.push(idx);
                } else {
                    CalendarDetails.wd.push(idx);
                }
            });
            CalendarDetails.init = true;
            if (!CalendarDetails.travelSumInit) {
                setTravelSummary();
            }
        });
    });
}
function getPrepAllowanceDetails() {
    var PAType = $.trim($("input[fldTitle='hdnPAConfigType']").val()).replace(/ +/g, "").toLowerCase();
    var byBaggage = (PAType == "BaggageTrips");
    var byPeriod = (PAType == "Choice Period");
    var listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('PreparatoryFeeMaster')/Items?$select=PreparatoryFeeAmtFirst,PreparatoryFeeAmtSecond,Amt3to14Days,Amtlessthan2Months,Amtgreaterthan2Months,HDNCurrency&$filter=StaffGrade/StaffGrade eq'" + staffGrade + "'&$top=1");
    listData = JSON.parse(listData);
    if (listData.length == 0) {
        return ["NA", "0", "0", "0", "0", "0", baseCurrency].join("#");
    }
    var prep = listData[0];
    var PAFirstClaimAmt = (!!prep.PreparatoryFeeAmtFirst) ? prep.PreparatoryFeeAmtFirst : 0;
    var PASecondClaimAmt = (!!prep.PreparatoryFeeAmtSecond) ? prep.PreparatoryFeeAmtSecond : 0;
    var PAPeriod3to14 = (!!prep.Amt3to14Days) ? prep.Amt3to14Days : 0;
    var PAPeriodLessThan60 = (!!prep.Amtlessthan2Months) ? prep.Amtlessthan2Months : 0;
    var PAPeriodGreaterThan60 = (!!prep.Amtgreaterthan2Months) ? prep.Amtgreaterthan2Months : 0;
    var PACurrency = (!!prep.HDNCurrency) ? prep.HDNCurrency : baseCurrency;
    return ["AV", PAFirstClaimAmt, PASecondClaimAmt, PAPeriod3to14, PAPeriodLessThan60, PAPeriodGreaterThan60, PACurrency].join("#");
}
function prepAllowance(callingFrom) {
    var prepExp = $.trim($("#ddlExpType option[value='" + arrExpCodes[0].idTblPRP + "']").text());
    var PAType = $.trim($("input[fldTitle='hdnPAConfigType']").val()).replace(/ +/g, "").toLowerCase();
    switch (PAType) {
        case "baggagetrips":
            return prepByBaggage(callingFrom);
            break;
        case "period":
            return prepByPeriod(callingFrom);
            break;
        case "tripduration":
            return prepByTripDuration(callingFrom);
            break;
        default:
            alertModal(prepExp + " cannot be claimed. Please contact Admininstrator.");
    }
    return false;
}
function getPrepValues(modalID) {
    var userPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[0].split("#");
    var configPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[1].split("#");
    var FirstClaimDate = (!!userPADetails[2]) ? userPADetails[2] : "";
    var LastDateOfClaim = (!!userPADetails[3]) ? userPADetails[3] : "";
    var LastClaimAmount = (!!userPADetails[4]) ? outputMoney(userPADetails[4]) : outputMoney(0);
    var dtToUpdate = (!!LastDateOfClaim ? (
                        dateObj(FirstClaimDate) > dateObj(LastDateOfClaim) ? FirstClaimDate : LastDateOfClaim
                    ) : FirstClaimDate);
    var PACurrency = configPADetails[6];
    if (modalID == "onload") {
        var tblRow = $("#" + getTableID("Preparation") + ">tbody>tr:first-child");
        var valsToUpdate = [dtToUpdate, LastClaimAmount, PACurrency];
        var keysToUpdate = ['LastClaimDate', 'LastClaimAmt', 'PostCurrency'];
        keysToUpdate.forEach(function (key, idx) {
            var objSpan = tblRow.find("span[postkey='" + key + "']");
            var strHTML = "";
            if (objSpan != undefined && objSpan.length > 0) {
                objSpan.text(valsToUpdate[idx]);
                strHTML = objSpan[0].outerHTML;
                objSpan.parent().html(strHTML + valsToUpdate[idx]);
            }
        });
    } else {
        $("#" + modalID).find("#idPRPLastClaimAmtEdit").val(LastClaimAmount);
        $("#" + modalID).find("#idPRPLastClaimDtEdit").val(dtToUpdate);
        $("#" + modalID).find("#idPRPCurrencyEdit").val(PACurrency).trigger("onchange");
    }
}
function prepByBaggage(callingFrom) {
    var prepExp = $.trim($("#ddlExpType option[value='" + arrExpCodes[0].idTblPRP + "']").text());
    var userPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[0].split("#");
    var configPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[1].split("#");
    var FirstClaim = userPADetails[0] != "Yes";
    var NextClaim = false;
    var FirstClaimDate = (!!userPADetails[2]) ? dateObj(userPADetails[2]) : null;
    var LastDateOfClaim = (!!userPADetails[3]) ? dateObj(userPADetails[3]) : null;
    var dateToAlert = (!!LastDateOfClaim ? (
                        FirstClaimDate > LastDateOfClaim ? FirstClaimDate : LastDateOfClaim
                    ) : FirstClaimDate);
    FirstClaim = (!FirstClaim && !FirstClaimDate) ? true : FirstClaim;
    var LastClaimAmount = (!!userPADetails[4]) ? outputNumber(userPADetails[4]) : 0;
    var TripsCount = (!!userPADetails[5]) ? outputNumber(userPADetails[5]) : 0;
    var SecondClaimForTrips = $("input[fldTitle=hdnPABaggageCount]").val().trim();
    SecondClaimForTrips = (!!SecondClaimForTrips) ? outputNumber(SecondClaimForTrips) : 0;
    var duration = $("input[fldTitle=hdnPAReclaimDuration]").val().trim();
    duration = (!!duration) ? outputNumber(duration) : 0;
    var PACurrency = configPADetails[6];
    var today = null;
    if (travelStage == "pre")
        today = dateObj($("#idPreDeptDate").text());
    else
        today = dateObj($("#idPostDeptDate").text());
    var allowAmount = 0;
    if (duration < 0) {
        alertModal(prepExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    if (!FirstClaim && duration >= 0 && duration != 999) { // To check Full amount for next duration
        if (!!FirstClaimDate) {
            var nextFAllow = new Date(FirstClaimDate);
            nextFAllow.setDate(nextFAllow.getDate() + (Math.round(365 * duration)));
            if (today >= nextFAllow) { // Second time Full Amount after configured duration
                FirstClaim = true;
            }
        } else { // Second time Full Amount after configured duration
            FirstClaim = true;
        }
    }
    if (FirstClaim ? false : !NextClaim) {
        if (TripsCount >= SecondClaimForTrips && SecondClaimForTrips != 999 && SecondClaimForTrips >= 0) { // Trips for Second Claim after every Prep Claim
            NextClaim = true;
        }
    }
    var msgArr = [];
    if (configPADetails[0] == "NA") {
        msgArr.push(prepExp + " allowance is not maintained for Staff Grade " + staffGrade + ". Please contact administrator.");
        return false;
    }
    if (msgArr.length == 0) {
        if (FirstClaim) {
            allowAmount = (!!configPADetails[1]) ? outputNumber(configPADetails[1]) : 0;
        } else {
            allowAmount = (!!configPADetails[2]) ? outputNumber(configPADetails[2]) : 0;
        }
        if (!(FirstClaim || NextClaim)) { // Already applied First and Next claim is not allowed
            if (duration == 999) { // Can claim First only Once
                if (SecondClaimForTrips != 999 && allowAmount > 0 && SecondClaimForTrips >= 0) { // Second Claim is allowed after configured trips
                    msgArr.push("Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ". Cannot claim till completion of " + SecondClaimForTrips + " trips from Last claim date.");
                } else { // Second claim is not allowed
                    msgArr.push("Already claimed. Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert));
                }
            } else {
                if (SecondClaimForTrips != 999 && allowAmount > 0 && SecondClaimForTrips >= 0) { // Second Claim is allowed after configured trips
                    msgArr.push("First claimed on Date " + dateString(FirstClaimDate) + ". Cannot claim till " + duration + " Year(s) from first claim.");
                    msgArr.push("Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ". Cannot claim till completion of " + SecondClaimForTrips + " trips from Last claim date.");
                } else { // Second claim is not allowed
                    msgArr.push("Last claimed on Date " + dateString(FirstClaimDate) + ". Cannot claim till " + duration + " Year(s) from first claim.");
                }
            }
        } else if (!FirstClaim && NextClaim && allowAmount <= 0) { // Only First claim
            if (duration == 999) { // Can claim First only Once
                msgArr.push("Already claimed. Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ".");
            } else {
                msgArr.push("Last Claimed - " + outputMoney(LastClaimAmount) + " on Date - " + dateString(dateToAlert) + ". Cannot claim till " + duration + " Year(s) from first claim.");
            }
        }
    }
    if (msgArr.length > 0) {
        switch (callingFrom) {
            case "modal":
                alertModal(msgArr.join("\n"));
                $("#idPRPFCAmtEdit").val("");
                break;
            case "addExpense":
                alertModal(prepExp + " cannot be added due to below reason(s).\n" + msgArr.join("\n"));
                break;
            case "submit":
                alertModal(prepExp + " cannot be submitted due to below reason(s).\n" + msgArr.join("\n"));
                break;
            default:
                alertModal(msgArr.join("\n"));
        }
        return false;
    }
    if (allowAmount <= 0) {
        alertModal(prepExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    if (callingFrom == "modal") {
        var curAmount = $("#idPRPFCAmtEdit").val();
        curAmount = (!!curAmount) ? outputNumber(curAmount) : 0;
        $("#PRPModal").find('.modalInfo').text("");
        if (allowAmount > curAmount) {
            var fld = $("#idPRPFCAmtEdit");
            if (fld.attr("confirm") == "No") {
                confirmModal(
                "The applied " + prepExp + " is less than available amount " + outputMoney(allowAmount) + ".<br/>Do you want to continue?",
                function () {
                    fld.attr("confirm", "Yes");
                    $("#PRPModal").find(".btnupdate").click();
                },
                function () {
                    fld.val("");
                    fld.attr("confirm", "No");
                });
                return false;
            }
        } else if (allowAmount < curAmount) {
            $("#PRPModal").find('.modalInfo').text("Allowed Amount is " + outputMoney(allowAmount));
            $("#idPRPFCAmtEdit").val("");
            showError();
            return false;
        }
    }
    if (callingFrom == "submit") {
        var curAmount = outputNumber($.trim($("#idTblPRP>tbody>tr:first-child").find("span[postkey='PostFCAmt']").text()))
        if (allowAmount < curAmount) {
            alertModal(prepExp + " amount cannot be more than allowed amount " + outputMoney(allowAmount));
            return false;
        } else if (allowAmount > curAmount) {
            var flgConfirm = confirm("Applied " + prepExp + " " + outputMoney(curAmount) + " is less than eligible FC amount " + outputMoney(allowAmount) + "\nDo you want to proceed with submission?");
            if (!flgConfirm) {
                return false;
            }
        }
        if (travelStage == "post" && $("tr[expcode='" + arrExpCodes[0].idTblPRP + "']").length > 0) { // Shoud update only when validated before post submit
            $("input[fldTitle=hdnPAType]").val(FirstClaim ? "first" : NextClaim ? "next" : "");
            $("input[fldTitle=hdnPAAmount]").val(curAmount);
        }
    }
    return true;
}
function prepByPeriod(callingFrom) {
    var prepExp = $.trim($("#ddlExpType option[value='" + arrExpCodes[0].idTblPRP + "']").text());
    var userPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[0].split("#");
    var configPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[1].split("#");
    var FirstClaim = userPADetails[0] != "Yes";
    var NextClaim = false;
    var FirstClaimDate = (!!userPADetails[2]) ? dateObj(userPADetails[2]) : null;
    FirstClaim = (!FirstClaim && !FirstClaimDate) ? true : FirstClaim;
    var LastDateOfClaim = (!!userPADetails[3]) ? dateObj(userPADetails[3]) : null;
    var LastClaimAmount = (!!userPADetails[4]) ? outputNumber(userPADetails[4]) : 0;
    var beforeHalfPercentage = $("input[fldTitle='hdnPABeforeHalfDurationPercent']").val();
    var afterHalfPercentage = $("input[fldTitle='hdnPAAfterHalfDurationPercent']").val();
    beforeHalfPercentage = (!!beforeHalfPercentage) ? outputNumber(beforeHalfPercentage) : 0;
    afterHalfPercentage = (!!afterHalfPercentage) ? outputNumber(afterHalfPercentage) : 0;
    afterHalfPercentage = afterHalfPercentage <= 0 ? beforeHalfPercentage : afterHalfPercentage;
    var today = null;
    if (travelStage == "pre")
        today = dateObj($("#idPreDeptDate").text());
    else
        today = dateObj($("#idPostDeptDate").text());
    var duration = $("[fldtitle=hdnPAReclaimDuration]").val().trim();
    var actDays = $.trim($(travelStage == "pre" ? "#idPreActNoDays" : "#idPostActNoDays").text());
    duration = (!!duration) ? outputNumber(duration) : 0;
    actDays = (!!actDays) ? outputNumber(actDays) : 0;
    if (duration < 0) {
        alertModal(prepExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    if (actDays < 3) {
        alertModal("The No.of Actual Days should be more than 3 to avail " + prepExp);
        return false;
    }
    var allowAmount = 0;
    allowAmount = (actDays >= 3 && actDays <= 14) ? configPADetails[3] : (actDays > 14 && actDays <= 60) ? configPADetails[4] : (actDays > 60) ? configPADetails[5] : 0;
    allowAmount = (!!allowAmount) ? outputNumber(allowAmount) : 0;
    if (configPADetails[0] == "NA") {
        alertModal(prepExp + " allowance is not maintained for Staff Grade " + staffGrade + ". Please contact administrator.");
        return false;
    }
    if (allowAmount <= 0) {
        alertModal(prepExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    var msgStr = "";
    if (!FirstClaim) {
        var nextFullDuration = new Date(FirstClaimDate);
        nextFullDuration.setDate(nextFullDuration.getDate() + (Math.round(365 * duration)));
        if (today < nextFullDuration) {
            var halfDuration = new Date(FirstClaimDate);
            halfDuration.setDate(halfDuration.getDate() + (Math.round(365 * duration * 0.5)));
            var beforeHalfAllowed = beforeHalfPercentage > 0;
            var afterHalfAllowed = afterHalfPercentage > 0;
            if ((today >= halfDuration && !afterHalfAllowed) ||
                (today < halfDuration && !beforeHalfAllowed && !afterHalfAllowed)) {
                msgStr = "Last claimed on Date " + dateString(FirstClaimDate) + ". Cannot claim till " + duration + " Year(s) from last claim.";
            } else if (today < halfDuration && !beforeHalfAllowed) {
                msgStr = "Last claimed on Date " + dateString(FirstClaimDate) + ". Cannot claim till " + (duration * 0.5) + " Year(s) from last claim."
            }
            allowAmount = allowAmount * ((today >= halfDuration) ? afterHalfPercentage : beforeHalfPercentage) * 0.01;
            allowAmount = outputNumber(allowAmount.toFixed(2));
        }
        NextClaim = true;
    }
    if (msgStr != "") {
        switch (callingFrom) {
            case "modal":
                alertModal(msgStr);
                $("#idPRPFCAmtEdit").val("");
                break;
            case "addExpense":
                alertModal(prepExp + " cannot be added due to below reason(s).\n" + msgStr);
                break;
            case "submit":
                alertModal(prepExp + " cannot be submitted due to below reason(s).\n" + msgStr);
                break;
            default:
                alertModal(msgStr);
        }
        return false;
    }
    if (callingFrom == "modal") {
        var curAmount = $("#idPRPFCAmtEdit").val();
        curAmount = (!!curAmount) ? outputNumber(curAmount) : 0;
        $("#PRPModal").find('.modalInfo').text("");
        if (allowAmount > curAmount) {
            var fld = $("#idPRPFCAmtEdit");
            if (fld.attr("confirm") == "No") {
                confirmModal(
                "The applied " + prepExp + " is less than available amount " + outputMoney(allowAmount) + ".<br/>Do you want to continue?",
                function () {
                    fld.attr("confirm", "Yes");
                    $("#PRPModal").find(".btnupdate").click();
                },
                function () {
                    fld.val("");
                    fld.attr("confirm", "No");
                });
                return false;
            }
        } else if (allowAmount < curAmount) {
            $("#PRPModal").find('.modalInfo').text("Allowed Amount is " + outputMoney(allowAmount));
            $("#idPRPFCAmtEdit").val("");
            showError();
            return false;
        }
    }
    if (callingFrom == "submit") {
        var curAmount = outputNumber($.trim($("#idTblPRP>tbody>tr:first-child").find("span[postkey='PostFCAmt']").text()))
        if (allowAmount < curAmount) {
            alertModal(prepExp + " amount cannot be more than allowed amount " + outputMoney(allowAmount));
            return false;
        } else if (allowAmount > curAmount) {
            var flgConfirm = confirm("Applied " + prepExp + " " + outputMoney(curAmount) + " is less than eligible FC amount " + outputMoney(allowAmount) + "\nDo you want to proceed with submission?");
            if (!flgConfirm) {
                return false;
            }
        }
        if (travelStage == "post" && $("tr[expcode='" + arrExpCodes[0].idTblPRP + "']").length > 0) { // Shoud update only when validated before post submit
            $("[fldtitle=hdnPAType]").val(FirstClaim ? "first" : NextClaim ? "next" : "");
            $("[fldtitle=hdnPAAmount]").val(curAmount);
        }
    }
    return true;
}
function prepByTripDuration(callingFrom) {
    var prepExp = $.trim($("#ddlExpType option[value='" + arrExpCodes[0].idTblPRP + "']").text());
    var userPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[0].split("#");
    var configPADetails = $("input[fldTitle=hdnPADetails]").val().split("$")[1].split("#");
    var FirstClaim = userPADetails[0] != "Yes";
    var NextClaim = false;
    var FirstClaimDate = (!!userPADetails[2]) ? dateObj(userPADetails[2]) : null;
    FirstClaim = (!FirstClaim && !FirstClaimDate) ? true : FirstClaim;
    var LastDateOfClaim = (!!userPADetails[3]) ? dateObj(userPADetails[3]) : null;
    var LastClaimAmount = (!!userPADetails[4]) ? outputNumber(userPADetails[4]) : 0;

    var allowAmount = 0;
    if (FirstClaim) {
        allowAmount = (!!configPADetails[1]) ? outputNumber(configPADetails[1]) : 0;
    } else {
        allowAmount = (!!configPADetails[2]) ? outputNumber(configPADetails[2]) : 0;
    }
    if (configPADetails[0] == "NA") {
        alertModal(prepExp + " allowance is not maintained for Staff Grade " + staffGrade + ". Please contact administrator.");
        return false;
    }
    if (allowAmount <= 0) {
        alertModal(prepExp + " cannot be claimed. Please contact administrator.");
        return false;
    }
    var msgStr = "";
    if (!FirstClaim) {
        var cfgTripDuration = $("[fldtitle=hdnPATripDuration]").val().trim();
        cfgTripDuration = (!!cfgTripDuration) ? outputNumber(cfgTripDuration) : 0;
        var actDays = $.trim($(travelStage == "pre" ? "#idPreActNoDays" : "#idPostActNoDays").text());
        actDays = (!!actDays) ? outputNumber(actDays) : 0;
        if (actDays < cfgTripDuration) {
            msgStr = "Already claimed on date " + dateString((!!LastDateOfClaim) ? LastDateOfClaim : FirstClaimDate) + ". Next claim is allowed when trip duration is " + cfgTripDuration + " or more days.";
        } else {
            NextClaim = true;
        }
    }
    if (msgStr != "") {
        switch (callingFrom) {
            case "modal":
                alertModal(msgStr);
                $("#idPRPFCAmtEdit").val("");
                break;
            case "addExpense":
                alertModal(prepExp + " cannot be added due to below reason(s).\n" + msgStr);
                break;
            case "submit":
                alertModal(prepExp + " cannot be submitted due to below reason(s).\n" + msgStr);
                break;
            default:
                alertModal(msgStr);
        }
        return false;
    }
    if (callingFrom == "modal") {
        var curAmount = $("#idPRPFCAmtEdit").val();
        curAmount = (!!curAmount) ? outputNumber(curAmount) : 0;
        $("#PRPModal").find('.modalInfo').text("");
        if (allowAmount > curAmount) {
            var fld = $("#idPRPFCAmtEdit");
            if (fld.attr("confirm") == "No") {
                confirmModal(
                    "The applied " + prepExp + " is less than available amount " + outputMoney(allowAmount) + ".<br/>Do you want to continue?",
                    function () {
                        fld.attr("confirm", "Yes");
                        $("#PRPModal").find(".btnupdate").click();
                    },
                    function () {
                        fld.val("");
                        fld.attr("confirm", "No");
                    });
                return false;
            }
        } else if (allowAmount < curAmount) {
            $("#PRPModal").find('.modalInfo').text("Allowed Amount is " + outputMoney(allowAmount));
            $("#idPRPFCAmtEdit").val("");
            showError();
            return false;
        }
    }
    if (callingFrom == "submit") {
        var curAmount = outputNumber($.trim($("#idTblPRP>tbody>tr:first-child").find("span[postkey='PostFCAmt']").text()))
        if (allowAmount < curAmount) {
            alertModal(prepExp + " amount cannot be more than allowed amount " + outputMoney(allowAmount));
            return false;
        } else if (allowAmount > curAmount) {
            var flgConfirm = confirm("Applied " + prepExp + " " + outputMoney(curAmount) + " is less than eligible FC amount " + outputMoney(allowAmount) + "\nDo you want to proceed with submission?");
            if (!flgConfirm) {
                return false;
            }
        }
        if (travelStage == "post" && $("tr[expcode='" + arrExpCodes[0].idTblPRP + "']").length > 0) { // Shoud update only when validated before post submit
            $("[fldtitle=hdnPAType]").val(FirstClaim ? "first" : NextClaim ? "next" : "");
            $("[fldtitle=hdnPAAmount]").val(curAmount);
        }
    }
    return true;
}
function showError() {
    $('.modalInfo')
    .show({ duration: 0, queue: true })
    .delay(10000)
    .hide({ duration: 0, queue: true });
}
function isEmptyTable(tblID) {
    return $("#" + tblID).DataTable().rows().data().length == 0;
}
function setConditionalFlds() {
    if (!(IsApplicantLevel == "true" || isAccountsLevel == "Yes")) {
        return;
    }
    //Entertainment Claim - Per Head Amount/Total Amount
    var tblID = "idTblENT"
    drawDataTbl(tblID, true);
    var keyName = "prekey";
    var perHeadAmtKey = "PrePerHeadAmt";
    var LCAmtKey = "PreLCAmt";
    var countryKey = "PreCountry";
    var cityKey = "PostCity";
    if (travelStage == "post") {
        keyName = "postkey";
        perHeadAmtKey = "PostPerHeadAmt";
        LCAmtKey = "PostLCAmt";
        countryKey = "PostCountry";
        cityKey = "PostCity";
    }
    var PerHeadAmtColl = "";
    var TotAmt = 0;
    $(tableRowSelector(tblID)).each(function () {
        var objSpan = $(this).find('span[' + keyName + '="' + perHeadAmtKey + '"]');
        var tmpAmt = objSpan.text();
        if (tmpAmt != "") {
            PerHeadAmtColl += outputNumber(objSpan.text()) + ";";
        }
        objSpan = $(this).find('span[' + keyName + '="' + LCAmtKey + '"]');
        tmpAmt = objSpan.text();
        if (tmpAmt != "") {
            TotAmt += outputNumber(objSpan.text());
        }
    });
    if (PerHeadAmtColl != "") {
        PerHeadAmtColl = PerHeadAmtColl.substr(0, PerHeadAmtColl.length - 1);
    }
    $("input[fldTitle='hdnEEPerHeadAmt']").val(PerHeadAmtColl);
    $("input[fldTitle='hdnEETotAmt']").val(TotAmt);
    drawDataTbl(tblID, false);
    //Gift Claim - Per Head Amount/Total Amount
    tblID = "idTblGIFT"
    drawDataTbl(tblID, true);
    var PerHeadAmtColl = "";
    TotAmt = 0;
    $(tableRowSelector(tblID)).each(function () {
        objSpan = $(this).find('span[' + keyName + '="' + LCAmtKey + '"]');
        tmpAmt = objSpan.text();
        if (tmpAmt != "") {
            TotAmt += outputNumber(objSpan.text());
        }
    });
    $("input[fldTitle='hdnGETotAmt']").val(TotAmt);
    drawDataTbl(tblID, false);
    //DA Country
    tblID = "idTblDA"
    drawDataTbl(tblID, true);
    var countryColl = "";
    var cityColl = "";
    TotAmt = 0;
    $(tableRowSelector(tblID)).each(function () {
        var objSpan = $(this).find('span[' + keyName + '="' + countryKey + '"]');
        var tmpCtry = objSpan.text();
        if (tmpCtry != "") {
            countryColl += tmpCtry + ";";
        }
        var objSpan = $(this).find('span[' + keyName + '="' + cityKey + '"]');
        var tmpCty = objSpan.text();
        if (tmpCty != "") {
            cityColl += tmpCty + ";";
        }
    });
    if (countryColl != "") {
        countryColl = countryColl.substr(0, countryColl.length - 1);
        cityColl = cityColl.substr(0, cityColl.length - 1);
    }
    $("input[fldTitle='hdnDACountry']").val(countryColl);
    $("input[fldTitle='hdnDACity']").val(cityColl);
    drawDataTbl(tblID, false);
    //Medical Total Amount
    if (travelStage == "pre") {
        //Incase of any only post expesnse intialize the hidden field
        var keyArray = Object.keys(expenseTypeObj);
        var tempObj = {
        };
        var preMedTotal = "";
        for (var i = 0; i < keyArray.length; i++) {
            tempObj = expenseTypeObj[keyArray[i]];
            if (tempObj.expType == "Medical") {
                preMedTotal += parseFloat(outputNumber(tempObj.preLCAmt));
            }
        }
        $("input[fldTitle='hdnMEDTotAmt']").val(preMedTotal);
        return;
    }
    //Only Post Expensese needs to be handled below
    tblID = "idTblMED"
    drawDataTbl(tblID, true);
    TotAmt = 0;
    $(tableRowSelector(tblID)).each(function () {
        objSpan = $(this).find('span[' + keyName + '="' + LCAmtKey + '"]');
        tmpAmt = objSpan.text();
        if (tmpAmt != "") {
            TotAmt += outputNumber(objSpan.text());
        }
    });
    $("input[fldTitle='hdnMEDTotAmt']").val(TotAmt);
    drawDataTbl(tblID, false);
}
function lastRowOnlyDelete(tblID) {
    $("#" + tblID).DataTable().one('draw', function () {
        if (!isEmptyTable(tblID)) {
            $("#" + tblID).find(".deleterow")
                .prop("disabled", true)
            .find(".text-red")
                .removeClass("text-red").addClass("text-grey");
            var lastRow = $(this).find('tbody>tr:last-child');
            if (travelStage == "post" ? !isPreExpenseRow(lastRow) : true) {
                lastRow.find(".deleterow")
                    .prop("disabled", false)
                .find(".text-grey")
                    .removeClass("text-grey").addClass("text-red");
            }
            if (tblID == "idTblTSH") {
                $("#idTblTSH").find("*[isTravelled='Yes']").closest("tr").css({ "textDecoration": "line-through" })
            }
        }
    });
}
function isDATableFilled() {
    var returnFlg = false;
    drawDataTbl("idTblDA", true);
    $(tableRowSelector("idTblDA")).each(function () {
        var aType = $.trim($(this).find("*[postkey='PostAllowType']").text().toLowerCase());
        aType = (aType == "select") ? "" : aType;
        if (!!aType) {
            returnFlg = true;
            return false;
        }
    });
    drawDataTbl("idTblDA", false);
    return returnFlg;
}
function isScheduleChanged() {
    var fldIDsEdit = ["idTSHDepCntryEdit", "idTSHDepCityEdit", "idTSHDestCntryEdit", "idTSHDestCityEdit", "idTSHDepDateEdit", "idTSHDepTimeEdit", "idTSHArrDateEdit", "idTSHArrTimeEdit", "idTSHisTransiDepEdit", "idTSHAdditionalDayEdit", "idTSHisTravelledEdit"];
    var valType = ["desc", "desc", "desc", "desc", "", "", "", "", "", "", ""]
    var flgChanged = false;
    for (var idx = 0; idx < fldIDsEdit.length; idx++) {
        var fld = $("#" + fldIDsEdit[idx]);
        var fldVal = valType[idx] == "desc" ? $.trim(fld.find("option:selected").text()) : fld.val();
        var rowVal = $.trim(objSelectedRow.find("#" + (fldIDsEdit[idx]).substring(0, fldIDsEdit[idx].indexOf("Edit"))).text());
        if (fldVal != rowVal) {
            flgChanged = true;
            break;
        }
    }
    return flgChanged;
}
function tableRowSelector(tblID) {
    var tblRowsSelector = "#" + tblID + ">tbody>tr";
    if ($.fn.DataTable.isDataTable('#' + tblID)) {
        tblRowsSelector += "[role=row]";
    }
    return tblRowsSelector;
}
function getAllSubsites() {
    subsitecoll = getData(rootSiteUrl + "/_api/Web/webs");
    subsitecoll = (!!subsitecoll) ? subsitecoll : [];
    subsitecoll = JSON.parse(subsitecoll);
    $.each(subsitecoll, function (i, item) {
        if (item.Title.toLowerCase() == "eiaf") {
            isIAFExist = true;
            return;
        }
    });
}
function isProperSchedule() {
    var objSched = objSchedCountryCity();
    var dep = [];
    var dest = [];
    var trips = objSched.trips;
    var checktype = "";
    if (TravellingTo == "Domestic") {
        dep = objSched.depCities;
        dest = objSched.destCities;
        checktype = "city";
    } else {
        dep = objSched.depCountries;
        dest = objSched.destCountries;
        checktype = "country";
    }
    if (dep.length == 0) {
        return false;
    }
    var startedFrom = dep[0];
    var roundTrip = false;
    for (var i = 0; i < dep.length; i++) {
        if (roundTrip) {
            alertModal("Only one Round Trip is allowed per document. Additional trips entered after '" + startedFrom + "' to '" + startedFrom + "' (from " + trips[i] + ") cannot be submitted. Kindly correct schedule and re-submit.");
            return false;
        } else {
            if (dest[i] == startedFrom) {
                roundTrip = true;
            }
            if (dep[i] == dest[i]) {
                alertModal((TravellingTo == "Domestic" ? "Local" : "Domestic") + " trips made at '" + dep[i] + "' (" + trips[i] + ") is not allowed in " + TravellingTo + " trip. Please correct the schedule before submission.");
                return false;
            }
        }
    }
    if (!roundTrip) {
        alertModal("Please add round trip made starting departure from '" + startedFrom + "' to arrival at '" + startedFrom + "' before submission.");
        return false;
    }
    return true;
}
//Travel Copy functionality - Starts
function showMyTrips(flgShow) {
    if (!gblTripLoaded) {
        getPreviousTrips();
    }
    if (flgShow) {
        $("#mySidenav").show();
    }
    else {
        $("#mySidenav").hide();
        $("#idChkPTrip").attr("checked", false);
    }
}
var gblTripLoaded = false;
function getPreviousTrips() {
    var appLstName = $("input[fldTitle='hdnApplicationList']").val();
    var listData = getData(currentSiteUrl + "/_api/web/lists/getByTitle('" + appLstName + "')/Items?$select=ID,DocRefNo,TravellingTo,DACountry,DACity,PostDeptDate,PostArrDate&$filter=TravelStage eq 'post' and DocumentStatus eq 'Approved' and ApplicationStatus ne 'Cancel Approved' and ApplicantID eq '" + empID + "'&$OrderBy=Created desc&$top=10");
    listData = JSON.parse(listData);
    var strTripsHTML = '<a href="javascript:void(0)" class="closebtn" onclick="showMyTrips(false);">&times;</a>';
    strTripsHTML += '<span class="mytripheader">My Previous Trips (' + listData.length + ')</span>';
    if (listData.length == 0) {
        strTripsHTML += '<div style="top: 15px; text-align: center; position: relative;">No Trips available</div>';
        $("#mySidenav").html(strTripsHTML);
        return;
    }
    var linkIDStr = "collapse";
    var cnt = 1;
    listData.forEach(function (item) {
        var linkID = linkIDStr + cnt++;
        var DACntry = item.DACountry.split(",");
        DACntry = $.unique(DACntry).join(" - ");
        var DACity = item.DACity.split(",");
        DACity = $.unique(DACity).join(" - ");
        strTripsHTML += '<a data-toggle="collapse" data-parent="#acMyTrips" href="#' + linkID + '"><i class="fa fa-plane" aria-hidden="true"></i>&nbsp;';
        strTripsHTML += item.DocRefNo + ' (' + moment(item.PostDeptDate, displayDateFormat).format("DD-MMM-YY") + ' to ';
        strTripsHTML += moment(item.PostArrDate, displayDateFormat).format("DD-MMM-YY") + ')<br/><span>' + DACntry + '</span></a>';
        strTripsHTML += '<div class="panel"><div id="' + linkID + '" class="panel-collapse collapse "><div><h5 align="left">Trip Details</h5>';
        strTripsHTML += '<table style="background-color: white; width: 100%" class="center"><tr style="height: 10px; padding: 10px;">';
        strTripsHTML += '<td colspan="2"><hr></td></tr>';
        strTripsHTML += '<tr><td style="text-align: left">Departure Date</td><td style="text-align: left">' + item.PostDeptDate + '</td></tr>';
        strTripsHTML += '<tr><td style="text-align: left">Arrival Date</td><td style="text-align: left">' + item.PostArrDate + '</td></tr>';
        strTripsHTML += '<tr><td style="text-align: left">Country(ies)</td><td style="text-align: left">' + DACntry + '</td></tr>';
        strTripsHTML += '<tr><td style="text-align: left">City(ies)</td><td style="text-align: left">' + DACity + '</td></tr>';
        strTripsHTML += '<tr style="height: 10px; padding: 10px;"><td colspan="2"><hr></td></tr>';
        strTripsHTML += '<tr><td colspan="2" style="text-align: right;">';
        var funName = "";
        var btnLbl = "Pre Copy"
        if (travelStage == "pre") {
            funName = "copyBtnClick('precopy:" + item.ID + "')";
        }
        else {
            funName = "copyBtnClick('postcopy:" + item.ID + "')";
            btnLbl = "Post Copy"
        }
        strTripsHTML += '<button onclick="' + funName + '" class="btn-info travelcopy"><i class="fa fa-copy text-white"></i>' + btnLbl + '</button>';
        strTripsHTML += '</td></tr><tr style="height: 10px; padding: 10px;"><td colspan="2"><hr></td></tr>';
        strTripsHTML += '</table></div></div></div>';
        gblTripLoaded = true;
    });
    strTripsHTML += '<script>$(".panel-collapse").on("show.bs.collapse", function (e) { $(e.target).closest(".panel").siblings().find(".panel-collapse").collapse("hide"); });</script>';
    $("#mySidenav").html(strTripsHTML);
}
function copyBtnClick(argStr) {

    var strCnfirmMsg = "";
    if (travelStage == "pre") {
        strCnfirmMsg = "Travel Type and all the expense entries will be cleared. Do you want to proceed? "
    }
    else {
        strCnfirmMsg = "All the expense entries created during post travel will be cleared. Do you want to proceed? "
    }
    confirmModal(
        strCnfirmMsg,
        function () {
            $("input[fldTitle='hdnCopyAction']").val(argStr);
            var objLnkBtn = $("a[fldTitle='lnkTravelCopy']");
            document.getElementById(objLnkBtn[0].id).click();
        },
        function () {
        });
}
$(document).on('click', '.travelcopy', function (e) {
    e.preventDefault();
    return false;
});
//Travel Copy functionality - Ends
function enableDisableExRateTab() {
    var table = $('#idTblADV').DataTable();
    var rowCnt = parseInt(table.data().length)
    var advEligible = $("input[fldtitle='hdnAdvanceEligible']").val();
    var advApplied = $("input[fldtitle='hdnAdvanceApplied']").val();

    var UrgTrip = $("[fldtitle=UrgentTrip]").find("input[type=radio]:checked").val();
    $("#settlementDaysSection").hide();
    $("#refundDataTable").hide();
    $("#advanceDataTable").hide();
    $("#idChkAdvance").prop("checked", false);
    $("#idChkAdvance").prop("disabled", true);

    var preDraft = travelStage == "pre" && (docStatus == "Draft" || docStatus == "New" || docStatus == "RFI");
    var urgentTripDraft = travelStage == "post" && UrgTrip == "Yes" && (docStatus == "Draft" || docStatus == "New" || docStatus == "RFI");
    var advanceEnableApplicant = (IsApplicantLevel == "true" && advEligible == "Yes") && (preDraft || urgentTripDraft);
    if (advanceEnableApplicant) {
        $("#idChkAdvance").prop("disabled", false);
    } else {
        $("#idTblADV").find(".btnAdvAdd").hide();
        $("#idTblADV").find(".editrow").hide();
        $("#idTblADV").find(".deleterow").hide();
    }
    if (!advanceEnableApplicant && IsApplicantLevel == "true" && (preDraft || urgentTripDraft) && rowCnt > 0) {
        drawDataTbl("idTblADV", true);
        $('#idTblADV>tbody>tr').find('.deleterow').each(function () { $(this).click(); });
        drawDataTbl("idTblADV", false);
    }
    if (advApplied == "Yes") {
        $("#idChkAdvance").prop("checked", true);
        $("#advanceDataTable").show();
        $("#lnkPrintAdvance").show();
        if (travelStage == "post") {
            $("#settlementDaysSection").show();
            $("#refundDataTable").show();
            if (isAccountsLevel == "Yes") {
                $("#settlementDate").attr("disabled", false);
                $("#idSettlementRecvBy").attr("disabled", false);
                $("input[fldtitle='CheckedBy']").attr("readonly", false);
                $("input[fldtitle='VerifiedBy']").attr("readonly", false);
                $("input[fldtitle='ApprovedBy']").attr("readonly", false);
            }
            else {
                $("#settlementDate").attr("disabled", true);
                $("#idSettlementRecvBy").attr("disabled", true);
                $("input[fldtitle='CheckedBy']").attr("readonly", true);
                $("input[fldtitle='VerifiedBy']").attr("readonly", true);
                $("input[fldtitle='ApprovedBy']").attr("readonly", true);
            }
        }
    }
    if (IsApplicantLevel == "false") {
        $("#idTblRef").find(".btnRefAdd").hide();
        $("#idTblRef").find(".editrow").hide();
        $("#idTblRef").find(".deleterow").hide();
    }
}
function enableDisableTxtBox(bEnable, textBoxID) {
    document.getElementById(textBoxID).disabled = !bEnable;
}
function getLatestExchRateDate(exchangeRateType) {
    if (exchangeRateType == "House Rate" || exchangeRateType == "House") {
        exchangeRateType = "House";
    } else {
        exchangeRateType = "Spot";
    }
    var urlForExchange = "";
    var exDate = "";
    urlForExchange = exchRateSiteUrl + "/_api/web/lists/getByTitle('ExchangeRateMaster')/Items?$select=Date&$filter=RateType eq '" + exchangeRateType + "' and Date le '" + moment(new Date()).format("YYYY-MM-D") + "'&$top=1&$orderby=Date desc";

    $.ajax({
        url: urlForExchange,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            if (items.length == 0) {
                alertModal("Exchange Rate not available. Please Contact Administrator.");
                return;
            }
            else {
                var offset = 0;
                exDate = items[0].Date;
                offset = parseInt($("input[fldTitle='hdnOffSet']").val()); //CET offset
                exDate = (exDate == "") ? exDate : moment.utc(exDate).utcOffset(offset).format("DD/MM/YYYY");
            }
        },
        error: function (error) {
            exDate = "";
            console.log(JSON.stringify(error));
        }
    });
    return exDate;
}
function checkExRate() {
    if (IsApplicantLevel == "false" || docStatus == "RFI") {
        return;
    }
    if (flgExRateAvailable == false) {
        if (travelStage == "post" && (flgManualExRateAvailable == false && $("[fldtitle=ExRateType]").find("input[type=radio]:checked").val() == "Manual")) {
            alertModal("Exchange Rate not available. Please Contact Administrator or enter the Manual exchange rate.");
            return;
        }
        if (travelStage == "pre") {
            alertModal("Exchange Rate not available. Please Contact Administrator.");
            return;
        }
    }
    recalcLCAmt();
}
//Key: ListName + Exchange Rate Type + Exchange Rate Date + CompanyName
function getExchangeRateFromMaster() {
    if (IsApplicantLevel == "false" || docStatus == "RFI") {
        displayExRateTable();
        return;
    }
    var compName = companyName;
    var isExRateAvailable = false;
    var StartDate = "";
    var EndDate = "";
    var urlForExchange = "";
    var day = "";
    var month = "";
    var year = "";
    var ExRateDate = "";
    var exchangeRateType = "";
    if (travelStage == "pre") {
        ExRateDate = getLatestExchRateDate(ConfigPreExRateType);
        exchangeRateType = ConfigPreExRateType;
        if (ExRateDate == "") {
            flgExRateAvailable = false;
            //alertModal("Exchange Rate not available. Please Contact Administrator.");
            return;
        }
    }
    else {
        ExRateDate = $("#idPostDeptDate").text();
        exchangeRateType = ConfigPostExRateType;
    }
    if (exchangeRateType == "House Rate" || exchangeRateType == "House") {
        exchangeRateType = "House";
        
        StartDate = dateObj(ExRateDate);
        EndDate = new Date(StartDate.getTime());
        //Start Date to Month Begin
        StartDate.setDate(1);
        StartDate = moment(StartDate).format("YYYY-MM-D");
        //End Date to Month End
        EndDate.setMonth(EndDate.getMonth() + 1);
        EndDate.setDate(0);
        EndDate = moment(EndDate).format("YYYY-MM-D");
        urlForExchange = exchRateSiteUrl + "/_api/web/lists/getByTitle('ExchangeRateMaster')/Items?$select=Code/CurrencyCode,BaseCurrency/CurrencyCode,BaseCurrencyRate,Date,RateType,CurrencyDescription&$expand=Code/CurrencyCode,BaseCurrency/CurrencyCode&$filter=BaseCurrency/CurrencyCode eq '" + baseCurrency + "' and Date ge'" + StartDate + "' and Date le '" + EndDate + "' and RateType eq '" + exchangeRateType + "'&$orderby=Date desc";
    }
    else {
        exchangeRateType = "Spot";
        if (ExRateDate == "") {
            flgExRateAvailable = false;
            //alertModal("Exchange Rate not available. Please Contact Administrator.");
            return;
        }
        StartDate = new Date(formatDate(ExRateDate));
        var daysToAdjust = $("input[fldTitle='hdnSpotRateDateAdjust']").val();
        daysToAdjust = !!daysToAdjust ? outputNumber(daysToAdjust) : 0;
        StartDate.setDate(StartDate.getDate() + (daysToAdjust));
        while (isWeekEnd(StartDate) || isHoliday(StartDate)) {
            StartDate.setDate(StartDate.getDate() - 1);
        }
        ExRateDate = dateString(StartDate);
        StartDate = moment(StartDate).format("YYYY-MM-D");
        urlForExchange = exchRateSiteUrl + "/_api/web/lists/getByTitle('ExchangeRateMaster')/Items?$select=Code/CurrencyCode,BaseCurrency/CurrencyCode,BaseCurrencyRate,Date,RateType,CurrencyDescription&$expand=Code/CurrencyCode,BaseCurrency/CurrencyCode&$filter=Date eq '" + StartDate + "' and RateType eq '" + exchangeRateType + "'";
    }
    var strExRateData = "";
    var strExRateColl = "";
    $.ajax({
        url: urlForExchange,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            if (items.length == 0) {
                if (travelStage == "pre") {
                    getLatestExchRateDate(exchangeRateType);
                    return;
                }
                flgExRateAvailable = false;
                //alertModal("Exchange Rate not available. Please Contact Administrator.");
                sgdVal = 0;
                return;
            }
            else {
                flgExRateAvailable = true;
                for (var i = 0; i < items.length; i++) {
                    var baseCurrRate = outputMoneyEx(outputNumber(items[i].BaseCurrencyRate));
                    var curCode = items[i].Code.CurrencyCode;
                    var curDesc = items[i].CurrencyDescription;
                    strExRateData += curDesc + "#~#" + curCode + "#~#" + baseCurrRate + "#$#";
                    strExRateColl += curCode + baseCurrRate + curCode;
                }
            }
        },
        error: function (error) {
            strExRateDetails = "";
            strExRateColl = "";
            console.log(JSON.stringify(error));
        }
    });
    if (travelStage == "pre") {
        $("input[fldTitle='hdnPreExRateData']").val(strExRateData);
        $("input[fldTitle='hdnPreExRateColl']").val(strExRateColl);
        $("input[fldTitle='hdnPreExDate']").val(ExRateDate);
    }
    else {
        $("input[fldTitle='hdnPostExRateData']").val(strExRateData);
        $("input[fldTitle='hdnPostExRateColl']").val(strExRateColl);
        $("input[fldTitle='hdnPostExDate']").val(ExRateDate);
    }
    displayExRateTable();
}
function displayExRateTable() {
    var strPreExRateData = $("input[fldTitle='hdnPreExRateData']").val();
    var arrPreExRateData = strPreExRateData.split("#$#");
    var strPreExDate = $("input[fldTitle='hdnPreExDate']").val();
    var strPostExDate = $("input[fldTitle='hdnPostExDate']").val();
    var strRow = "";
    if (travelStage == "pre") {
        strRow = "<tr><td>Exchange Rate On</td><td class='center'>" + strPreExDate + "</td></tr>";
        for (var i = 0; i < arrPreExRateData.length - 1; i++) {
            arrPreExItem = arrPreExRateData[i].split("#~#");
            strRow += "<tr><td>" + arrPreExItem[0] + " (" + arrPreExItem[1] + ")</td><td class='amount'>" + arrPreExItem[2] + "</td></tr>"
        }
        $('#idTblEXRATE tbody').find("tr").remove();
        $('#idTblEXRATE tbody').append(strRow);
        return;
    }
    //In case of Post Travel
    strRow = "<tr><td>Exchange Rate On</td><td class='center'>" + strPreExDate + "</td><td class='center'>" + strPostExDate + "</td></tr>";
    var strPostExRateData = $("input[fldTitle='hdnPostExRateData']").val();
    var arrPostExRateData = strPostExRateData.split("#$#");
    for (var i = 0; i < arrPreExRateData.length - 1; i++) {
        arrPreExItem = arrPreExRateData[i].split("#~#");
        var preCurr = arrPreExItem[1];
        var flgPresent = false;
        for (var j = 0; j < arrPostExRateData.length - 1; j++) {
            arrPostExItem = arrPostExRateData[j].split("#~#");
            if (arrPostExItem[1] == preCurr) {
                strRow += "<tr><td>" + arrPreExItem[0] + " (" + arrPreExItem[1] + ")</td><td class='amount'>" + arrPreExItem[2] + "</td><td class='amount'>" + arrPostExItem[2] + "</td></tr>"
                flgPresent = true;
                arrPostExRateData.splice(j, 1);
                break;
            }
        }
        if (!flgPresent) {
            strRow += "<tr><td>" + arrPreExItem[0] + " (" + arrPreExItem[1] + ")</td><td class='amount'>" + arrPreExItem[2] + "</td><td class='amount'>" + outputMoneyEx(0) + "</td></tr>"
        }
    }
    for (var i = 0; i < arrPostExRateData.length - 1; i++) {
        arrPostExItem = arrPostExRateData[i].split("#~#");
        strRow += "<tr><td>" + arrPostExItem[0] + " (" + arrPostExItem[1] + ")</td><td class='amount'>" + outputMoneyEx(0) + "</td><td class='amount'>" + arrPostExItem[2] + "</td></tr>"
    }
    $('#idTblEXRATE tbody').find("tr").remove();
    $('#idTblEXRATE tbody').append(strRow);
}
//Return the exchange rate based on Currency Object Change and set the exchange rate to the respective field. Used for modal popups
function getExchangeRate(objCurr, opExRate, modalId) {
    $("#" + modalId).find('.modalInfo').text("");
    var inCurr = objCurr.value;
    var exRate = 0;
    var strExRateColl = "";
    var strManualExRateColl = "";
    if (inCurr == baseCurrency) {
        exRate = outputMoneyEx(1);
    } else if (travelStage == "pre") {
        strExRateColl = $("input[fldTitle='hdnPreExRateColl']").val();
        exRate = extractExRate(strExRateColl, inCurr);
    }
    else {
        var PostExRateType = $("[fldtitle=ExRateType]").find("input[type=radio]:checked").val()
        if (PostExRateType == "Manual") {
            strManualExRateColl = $("input[fldTitle='hdnManualExRateColl']").val();
            exRate = extractExRate(strManualExRateColl, inCurr);
            if (exRate == false) {
                strExRateColl = $("input[fldTitle='hdnPostExRateColl']").val();
                exRate = extractExRate(strExRateColl, inCurr);
            }
        }
        else {
            strExRateColl = $("input[fldTitle='hdnPostExRateColl']").val();
            exRate = extractExRate(strExRateColl, inCurr);
        }
    }
    if (exRate != false) {
        opExRate.val(exRate);
    }
    else {
        $("#" + modalId).find('.modalInfo').text("Exchange Rate not available. Please Contact Administrator.");
        opExRate.val(outputMoneyEx(0));
        showError();
    }
}
//Return the exchange rate based on Currency. Used for recalculating the LC Amt
function getExchRate(argCurr) {
    if (argCurr == baseCurrency) {
        return outputMoneyEx(1);
    }
    var exRate = 0;
    var strExRateColl = "";
    var strManualExRateColl = "";
    if (travelStage == "pre") {
        strExRateColl = $("input[fldTitle='hdnPreExRateColl']").val();
        exRate = extractExRate(strExRateColl, argCurr);
    }
    else {
        var PostExRateType = $("[fldtitle=ExRateType]").find("input[type=radio]:checked").val();
        if (PostExRateType == "Manual") {
            strManualExRateColl = $("input[fldTitle='hdnManualExRateColl']").val();
            exRate = extractExRate(strManualExRateColl, argCurr);
            if (exRate == false) {
                strExRateColl = $("input[fldTitle='hdnPostExRateColl']").val();
                exRate = extractExRate(strExRateColl, argCurr);
            }
        }
        else {
            strExRateColl = $("input[fldTitle='hdnPostExRateColl']").val();
            exRate = extractExRate(strExRateColl, argCurr);
        }
    }
    if (exRate == false) {
        exRate = 0;
    }
    return exRate;
}
function extractExRate(argExColl, argCurr) {
    var firstIndx = argExColl.indexOf(argCurr);
    if (firstIndx >= 0) {
        var seconIndx = argExColl.indexOf(argCurr, firstIndx + 1);
        return (argExColl.substring(firstIndx + argCurr.length, seconIndx));
    }
    return false;
}
function getTravelAgencyDetails(TravelAgencyName) {
    var strDetails = "";
    $.ajax({
        url: currentSiteUrl + "/_api/web/lists/getByTitle('TravelAgency')/Items?$select=ID,TravelAgencyName,TravelAgencyName,ContactPerson,TravelAgencyAddress,ContactNumber,EmailID&$filter=TravelAgencyName eq '" + TravelAgencyName + "'&$orderby=TravelAgencyName asc",
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            if (items.length == 0) {
                $('[data-toggle="popover"]').attr("data-content", "Please select Ticket Co-Ordinator");
                return false;
            }
            else {
                var TravelAgencyName = !!(items[0].TravelAgencyName) ? items[0].TravelAgencyName : "NA";
                var ContactPerson = !!(items[0].ContactPerson) ? items[0].ContactPerson : "NA";
                var TravelAgencyAddress = !!(items[0].TravelAgencyAddress) ? items[0].TravelAgencyAddress : "NA";
                var ContactNumber = !!(items[0].ContactNumber) ? items[0].ContactNumber : "NA";
                var EmailID = !!(items[0].EmailID) ? items[0].EmailID : "NA";
                strDetails = "Travel Agency Name :-" + TravelAgencyName + ", Contact Person :-" + ContactPerson + ", Agency Address :-" + TravelAgencyAddress + ", Contact No :-" + ContactNumber + ", Email ID :-" + EmailID;
            }
            $('[data-toggle="popover"]').attr("data-content", strDetails);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}
function loadDropDownList(siteLevel, listName, fieldNameValue, fieldNameDisplay, ddlId, defaultValue, formatrqd, filterCol, filterVal, Key) {
    var siteUrl = "";
    var filterCond = "";
    var urlToCall = "";
    if (siteLevel == "RootSite")
        siteUrl = rootSiteUrl;
    else
        siteUrl = currentSiteUrl;
    if (formatrqd != true && formatrqd != false) {
        formatrqd = false; //Eg: Profit Center - Profit Centet 1 (PC1)
    }

    if (filterCol != undefined && filterCol != "") {
        filterCond = "$filter=" + filterCol + " eq '" + filterVal + "'&";
    }
    if (Key != undefined && Key != "") {
        urlToCall = siteUrl + "/_api/web/lists/getByTitle('" + listName + "')/Items?$select=ID," + fieldNameValue + "," + fieldNameDisplay + Key + "&$top=2000&$orderby=" + fieldNameDisplay + " asc$top=2000";

    }
    else {
        urlToCall = siteUrl + "/_api/web/lists/getByTitle('" + listName + "')/Items?$select=ID," + fieldNameValue + "," + fieldNameDisplay + "&" + filterCond + "$orderby=" + fieldNameDisplay + " asc&$top=2000";
    }

    $.ajax({
        url: urlToCall,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            getSelectOptions(items, fieldNameValue, fieldNameDisplay, ddlId, defaultValue, formatrqd);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}
function getSelectOptions(items, fieldNameValue, fieldNameDisplay, ddlId, defaultValue, formatrqd) {
    if (defaultValue == undefined || defaultValue == "") {
        defaultValue = "Select"
    }
    var option = '<option value="Select">Select</option>';
    var strSelected = "";
    for (var i = 0; i < items.length; i++) {
        if (items[i][fieldNameValue] == defaultValue) {
            strSelected = "selected";
        }
        else {
            strSelected = "";
        }
        if (formatrqd) {
            option += '<option value="' + items[i][fieldNameValue] + '" ' + strSelected + '>' + items[i][fieldNameDisplay] + ' (' + items[i][fieldNameValue] + ')</option>';
        }
        else {

            option += '<option value="' + items[i][fieldNameValue] + '" ' + strSelected + '>' + items[i][fieldNameDisplay] + '</option>';
        }
    }
    $("select[fldTitle='" + ddlId + "']").html(option);
}
function validateForm() {
    try {
        if (validateApplicationData()) {
            setConditionalFlds();
            var isEwork = eWorkSubmit();
            //start:Email Approval
            if (isEwork) {
                $.when(eTravelPrint('PrintAll', true)).done(function (x) {
                    return isEwork;
                });
            }
            else {
                return false;
            }
            //end:Email Approval
        }
        else
            return false;
    } catch (ex) {
        console.log(ex);
        return false;
    }
}
function validateApplicationData() {
    //Do the submit validation here
    if (IsApplicantLevel) {
        if (!validateTravelInfoTab())
            return false;
        if ($("tr[expcode='" + arrExpCodes[0].idTblWIN + "']").length > 0) {
            if ((travelStage == "pre" && outputNumber(expenseTypeObj.WinterAllowance.preLCAmt) > 0) ||
                (travelStage == "post" && outputNumber(expenseTypeObj.WinterAllowance.postLCAmt) > 0)) {
                if (!winterAllowance("submit")) {
                    return false;
                }
            }
        }
        if ($("tr[expcode='" + arrExpCodes[0].idTblPRP + "']").length > 0) {
            if ((travelStage == "pre" && outputNumber(expenseTypeObj.Preparation.preLCAmt) > 0) ||
                (travelStage == "post" && outputNumber(expenseTypeObj.Preparation.postLCAmt) > 0)) {
                if (!prepAllowance("submit")) {
                    return false;
                }
            }
        }
    }
    if (!getDropDownVal()) {
        return false;
    }
    if (!getAllJSONData()) {
        return false;
    }
    if (IsApplicantLevel) {
        createPaymentSummary();
        savePaymentSummaryDetails();
    }
    return true;
}
function validTab(addMenuID, addTabID) {
    var removeMenuID = "menu-travelInfo";
    var removeTabID = "travelInfo";

    if ($('#menu-travelInfo').hasClass('active')) {
        removeMenuID = "menu-travelInfo";
        removeTabID = "travelInfo";
    }
    else if ($('#menu-exchangeRate').hasClass('active')) {
        removeMenuID = "menu-exchangeRate";
        removeTabID = "exchangeRate";
    }
    else if ($('#menu-expDetails').hasClass('active')) {
        removeMenuID = "menu-expDetails";
        removeTabID = "expDetails";
    }
    else if ($('#menu-paymentSummary').hasClass('active')) {
        removeMenuID = "menu-paymentSummary";
        removeTabID = "paymentSummary";
    }
    else if ($('#menu-paymentAdvice').hasClass('active')) {
        removeMenuID = "menu-paymentAdvice";
        removeTabID = "paymentAdvice";
    }
    else if ($('#menu-routing').hasClass('active')) {
        removeMenuID = "menu-routing";
        removeTabID = "routing";
    }
    else if ($('#menu-approvalSum').hasClass('active')) {
        removeMenuID = "menu-approvalSum";
        removeTabID = "approvalSum";
    }
    $("#" + removeMenuID).removeClass("active");
    $("#" + removeTabID).removeClass("active");
    $("#" + removeTabID).attr("aria-expanded", "false");
    $("#" + addMenuID).addClass("active");
    $("#" + addTabID).addClass("active");
    $("#" + addTabID).attr("aria-expanded", "true");
}
function deleteAlert() {
    var delDraft = confirm("Do you want to delete this draft document permanently?");
    return delDraft;
}
function openModelDialogPopup(popupTitle, strPageURL, popupWidth, popupHeight) {
    var dialogOptions = {
        title: popupTitle, //Popup title.
        url: strPageURL,
        width: popupWidth, // Width of the dialog.
        height: popupHeight
    };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', dialogOptions);
    return false;
}
function expandPanelInValidation(expandDivID) { //expand the panel while triggering  validation
    $("#" + expandDivID).addClass("in");
    $("#" + expandDivID).attr("aria-expanded", "true");
    $("#" + expandDivID).css("height", "auto");
}
function collapsePanel(collapseDivID, collapsePlusId) { //collapse the panel during onload (not for new or draft doc)
    $("#" + collapseDivID).removeClass("in");
    $("#" + collapseDivID).attr("aria-expanded", "false");
    $("#" + collapsePlusId).removeClass("fa-minus");
    $("#" + collapsePlusId).addClass("fa-plus");
    $("#" + collapseDivID).css("height", "auto");
}
//To Get Accommodation Rate Start
function getCountryCity(countryField, cityField, source, modalId) {
    $("#" + modalId).find('.modalInfo').text("");
    var country = $("#" + countryField).val();
    var option = "<option value='Select'>Select</option>";
    if (country == "Select") {
        $("#" + cityField + " option").remove();
        $("#" + cityField).append(option);
        return;
    }
    urlForAccomRate = rootSiteUrl + "/_api/web/lists/getByTitle('CountryCityMaster')/Items?$select=Code,Description&$filter=Country/Code eq '" + country + "'";
    $.ajax({
        url: urlForAccomRate,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var items = data.d.results;
            if (items.length == 0) {
                var countryName = $("#" + countryField + ">option:selected").text();
                option = "<option value='" + countryName + "'>" + countryName + "</option>";
                //$("#" + modalId).find('.modalInfo').text("City is not maintained for the " + source + " Country. Please Contact Administrator.");
                //showError();
                //return;
            }
            else {
                option = "";
                for (var i = 0; i < items.length; i++) {
                    option += "<option value='" + items[i].Description + "'>" + items[i].Description + "</option>";
                }
            }
            $("#" + cityField + " option").remove();
            $("#" + cityField).append(option);
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    $("#" + cityField).prop("selectedIndex", 0);
}
function setTravelSummary() {
    var preDeptDate = $("input[fldTitle='hdnpreDeptDate']").val();
    var postDeptDate = $("input[fldTitle='hdnpostDeptDate']").val();
    if (travelStage == "pre" && preDeptDate == "") {
        $('#idTblTSHSummary tbody tr').remove();
        $('#idTblTSHSummary tbody').append('<tr><td colspan=12 class="center">No data available in table</td></tr>');
        return;
    }
    if (travelStage == "post" && postDeptDate == "") {
        $('#idTblTSHSummary tbody tr').remove();
        $('#idTblTSHSummary tbody').append('<tr><td colspan=12 class="center">No data available in table</td></tr>');
        return;
    }
    var preArrDate = $("input[fldTitle='hdnpreArrDate']").val();
    var postArrDate = $("input[fldTitle='hdnpostArrDate']").val();
    var preDeptTime = $("input[fldTitle='hdnpreDeptTime']").val();
    var postDeptTime = $("input[fldTitle='hdnpostDeptTime']").val();
    var preArrTime = $("input[fldTitle='hdnpreArrTime']").val();
    var postArrTime = $("input[fldTitle='hdnpostArrTime']").val();
    var preNoDays = $("input[fldTitle='hdnpreNoDays']").val();
    var postNoDays = $("input[fldTitle='hdnpostNoDays']").val();
    var PreActNoDays = $("input[fldTitle='hdnPreActNoDays']").val();
    var PostActNoDays = $("input[fldTitle='hdnPostActNoDays']").val();
    var strRow = "";
    strRow += '<tr><td class="center" id="idPreDeptDate">' + preDeptDate + '</td>';
    strRow += '<td class="center postdisplay" id="idPostDeptDate">' + postDeptDate + '</td>';
    strRow += '<td class="center" id="idPreArrDate">' + preArrDate + '</td>';
    strRow += '<td class="center postdisplay" id="idPostArrDate">' + postArrDate + '</td>';
    strRow += '<td class="center" id="idPreDeptTime">' + preDeptTime + '</td>';
    strRow += '<td class="center postdisplay" id="idPostDeptTime">' + postDeptTime + '</td>';
    strRow += '<td class="center" id="idPreArrTime">' + preArrTime + '</td>';
    strRow += '<td class="center postdisplay" id="idPostArrTime">' + postArrTime + '</td>';
    strRow += '<td class="center" id="idPreNoDays">' + preNoDays + '</td>';
    strRow += '<td class="center postdisplay" id="idPostNoDays">' + postNoDays + '</td>';
    strRow += '<td class="center" id="idPreActNoDays">' + PreActNoDays + '</td>';
    strRow += '<td class="center postdisplay" id="idPostActNoDays">' + PostActNoDays + '</td></tr>';
    $('#idTblTSHSummary tbody tr').remove();
    $('#idTblTSHSummary tbody').append(strRow);
    if (travelStage == "pre") {
        $(".postdisplay").hide();
        $('#idTblTSHSummary tr:first th').each(function () {
            $(this).attr("colspan", 1);
        });
    }
    getExchangeRateFromMaster();
}
function setDropDownVal() {
    var chargToPC = $("input[fldTitle='hdnChargeToPC']").val();
    var productCode = $("input[fldTitle='hdnProductCode']").val();
    var projectCode = $("input[fldTitle='hdnProjectCode']").val();
    var tktCoord = $("input[fldTitle='hdnTicketCoordinator']").val();
    var ClassofTrv = $("input[fldTitle='hdnClassOfTravel']").val();
    var BudType = $("input[fldTitle='hdnBudgetType']").val();
    var iafRefNo = $("input[fldTitle='hdnIAFRef']").val();
    var stStatus = $("input[fldTitle='hdnddlStaffStatus']").val();
    var TravNations = $("input[fldTitle='hdnTravelNations']").val();
    var BranchNo = $("input[fldTitle='hdnBranchNo']").val();
    if (chargToPC != "") {
        setSelectValue($('#ChargeToPC'), chargToPC);
    }
    if (productCode != "") {
        setSelectValue($('#ProductCode'), productCode);
    }
    if (projectCode != "") {
        setSelectValue($('#ProjectCode'), projectCode);
    }
    if (tktCoord != "") {
        setSelectValue($('#TicketCoordinator'), tktCoord);
    }
    if (ClassofTrv != "") {
        setSelectValue($('#ClassOfTravel'), ClassofTrv);
    }
    if (BudType != "") {
        setSelectValue($('#BudgetType'), BudType);
    }
    if (iafRefNo != "") {
        setSelectValue($('#IAFRef'), iafRefNo);
    }
    if (stStatus != "") {
        setSelectValue($('#StaffStatus'), stStatus);
    }
    if (TravNations != "") {
        setSelectValue($('#TravelNations'), TravNations);
    }
    if (BranchNo != "") {
        setSelectValue($('#BranchNo'), BranchNo);
    }
}
function setSelectValue(fld, val) {
    if (fld.length > 0) {
        if (fld.find("option[value='" + val + "']").length == 0) {
            fld.append("<option value='" + val + "'>" + val + "</option>");
        }
    }
    fld.val(val);
}
function getDropDownVal() {
    $("input[fldTitle='hdnChargeToPC']").val($('#ChargeToPC option:selected').val());
    $("input[fldTitle='hdnChargeToPCDisplay']").val($('#ChargeToPC option:selected').text());
    $("input[fldTitle='hdnProductCode']").val($('#ProductCode option:selected').val());
    $("input[fldTitle='hdnProductCodeDisplay']").val($('#ProductCode option:selected').text());
    $("input[fldTitle='hdnProjectCode']").val($('#ProjectCode option:selected').val());
    $("input[fldTitle='hdnProjectCodeDisplay']").val($('#ProjectCode option:selected').text());
    $("input[fldTitle='hdnTicketCoordinator']").val($('#TicketCoordinator option:selected').val());
    $("input[fldTitle='hdnClassOfTravel']").val($('#ClassOfTravel option:selected').val());
    $("input[fldTitle='hdnBudgetType']").val($('#BudgetType option:selected').val());
    $("input[fldTitle='hdnIAFRef']").val($('#IAFRef option:selected').val());
    $("input[fldTitle='hdnddlStaffStatus']").val($('#StaffStatus option:selected').val());
    $("input[fldTitle='hdnTravelNations']").val($('#TravelNations option:selected').val());
    $("input[fldTitle='hdnBranchNo']").val($('#hdnBranchNo option:selected').val());
    getTType();
    return true;
}
function calculateGSTAmt(objGST, idLcAmt, idTaxAmt, idGSTAmt, modelId) {
    var GSTCode = objGST.value;
    var amtID = idLcAmt;
    lcAmt = $("#" + amtID).val();
    $("#" + idTaxAmt).val(outputMoney(0));
    $("#" + idGSTAmt).val(outputMoney(0));
    if (!GSTCodes) {
        GSTCodes = getGSTCodes();
    }
    if (GSTCodes[GSTCode]) {
        var taxPercent = GSTCodes[GSTCode];
        var taxAmtVal = outputNumber(lcAmt) / outputNumber(taxPercent);
        var gstAmt = outputNumber(lcAmt) - outputNumber(taxAmtVal);
        $("#" + idTaxAmt).val(outputMoney(taxAmtVal));
        $("#" + idGSTAmt).val(outputMoney(gstAmt));
        $("#" + idTaxAmt).blur();
    } else if (GSTCode != "Select") {
        $("#" + modelId).find('.modalInfo').text("VAT Rate not found. Please Contact Administrator");
        showError();
        return;
    }
}
function reCalcGST(idLCAmt, idGetAmt, idSetAmt, modelId) {
    $("#" + modelId).find('.modalInfo').text("");
    var objLCAmt = $("#" + idLCAmt);
    var LCAmt = (!!objLCAmt.val()) ? outputNumber(objLCAmt.val()) : 0;
    var objGetAmt = $("#" + idGetAmt);
    var getAmt = (!!objGetAmt.val()) ? outputNumber(objGetAmt.val()) : 0;
    var objSetAmt = $("#" + idSetAmt);
    if (getAmt > LCAmt) {
        objLCAmt.change();
        $("#" + modelId).find('.modalInfo').text("Taxable Amount / VAT Amount should be within LC Amount.Taxable Amount & VAT Amount has been recalculated");
        showError();
        return;
    }
    objSetAmt.val(outputMoney(LCAmt - getAmt));
    objGetAmt.val(outputMoney(getAmt));
}
function getMilRate(listName, objMilRateDate, objTransMode, objMilRate, modalId) {
    $("#" + modalId).find('.modalInfo').text("");
    var newDate = new Date();
    var startDate = "";
    var urlForExchange = "";
    var day = "";
    var month = "";
    var year = "";
    var isMilRateAvl = false;
    var milRateDate = objMilRateDate.val();
    var transMode = objTransMode.val();
    var FCAmt = $("#idMILClaimAmtEdit");
    if (milRateDate != "" && transMode != "Select" && transMode != null && transMode != undefined) {
        StartDate = moment(milRateDate, displayDateFormat).format("YYYY-MM-D");
        var listData = getData(rootSiteUrl + "/_api/web/lists/getByTitle('" + listName + "')/Items?$select=RateMYR&$filter=TransportationMode/Code eq'" + transMode + "'and StartDate le'" + StartDate + "' and EndDate ge'" + StartDate + "'&$top=1&$orderby=StartDate desc");
        listData = JSON.parse(listData);
        if (listData.length == 0) {
            objMilRate.val(outputMoney(0));
            FCAmt.val(outputMoney(0));
            FCAmt.blur();
            $("#" + modalId).find('.modalInfo').text("Mileage Rate not available. Please Contact Administrator.");
            showError();
            return;
        } else {
            MilRate = outputMoney(listData[0].RateMYR);
            objMilRate.val(MilRate);
            objMilRate.prop("readonly", true);
            var DistTravl = $("#idMILDistanceTravelledEdit").val();
            DistTravl = (!!DistTravl) ? outputNumber(DistTravl) : 0;
            if (DistTravl > 0) {
                $("#idMILMileageStartEdit").change();
            }
        }
    }
}
function calcDistance(objMilStart, objMilEnd, objDistTravl, modalId) {
    $("#" + modalId).find('.modalInfo').text("");
    var milStart = objMilStart.val();
    var milEnd = objMilEnd.val();
    var FCAmt = $("#idMILClaimAmtEdit");
    var DistTravl = "";
    if (milEnd != "") {
        milStart == "" || milStart == undefined ? milStart = 0 : milStart;
        milEnd == "" || milEnd == undefined ? milEnd = 0 : milEnd;
        milStart = parseFloat(milStart);
        milEnd = parseFloat(milEnd);
        objMilStart.val(milStart);
        objMilEnd.val(milEnd);
        if (milEnd < milStart) {
            objDistTravl.val(outputMoney(0));
            FCAmt.val(outputMoney(0));
            FCAmt.blur();
            $("#" + modalId).find('.modalInfo').text("Mileage End can not be less than Mileage Start.");
            showError();
            return;
        }
        DistTravl = parseFloat(milEnd) - parseFloat(milStart);
        if (DistTravl <= 0) {
            objDistTravl.val(outputMoney(0));
            FCAmt.val(outputMoney(0));
            FCAmt.blur();
            $("#" + modalId).find('.modalInfo').text("Distance travelled / KMs(Actual) can not be zero.");
            showError();
            return;
        }
        else {
            objDistTravl.val(outputMoney(DistTravl));
            var mRate = $("#idMILKmsMileageRateEdit").val();
            mRate = (!!mRate) ? outputNumber(mRate) : 0;
            FCAmt.val(outputMoney(mRate * DistTravl));
            FCAmt.blur();
        }
    }
}
function getManualExRate() {
    if ($("[fldtitle=ExRateType]").find("input[type=radio]:checked").val() == "Manual") {
        var myExRateJSON = getJSONFromTbl("idTblMYEXCH");
        var strFinalJson = JSON.stringify(myExRateJSON);
        strFinalJson = strFinalJson.replace(/(\{\})/g, "").replace(/,+/g, ",").replace(/^\[,+/g, "[").replace(/,+\]$/g, "]");
        var strMyExRateData = "";
        var strMyExRateColl = "";
        if (strFinalJson == "[]") {
            $("input[fldTitle='hdnManualExRateColl']").val(strMyExRateColl);
            $("input[fldTitle='hdnManualExRateData']").val(strMyExRateData);
            flgManualExRateAvailable = false;
            return;
        }
        flgManualExRateAvailable = true;
        for (var i = 0; i < myExRateJSON.length; i++) {
            var firstCurCode = myExRateJSON[i]["Currency1"];
            var myExRate = 1;
            for (var j = 1; j <= 8; j++) {
                var curCode = myExRateJSON[i]["Currency" + j];
                if (curCode != "") {
                    var exRate = outputMoneyEx(outputNumber(myExRateJSON[i]["Rate" + j]));
                    myExRate = outputMoneyEx(myExRate * parseFloat(outputNumber(exRate)));
                    strMyExRateData += curCode + "#@#" + exRate + "#~#";
                }
            }
            strMyExRateColl += firstCurCode + myExRate + firstCurCode;
            strMyExRateData += "#$#";
        }
        $("input[fldTitle='hdnManualExRateColl']").val(strMyExRateColl);
        $("input[fldTitle='hdnManualExRateData']").val(strMyExRateData);
    }
}
function displayManualExRate() {
    var objJSON = [];
    var rowJSON = {};
    var strMyExRateData = $("input[fldTitle='hdnManualExRateData']").val();
    var arrMyExRateData = strMyExRateData.split("#$#");
    var Cnt = 0;
    for (var i = 0; i < arrMyExRateData.length - 1; i++) {
        arrMyExItemColl = arrMyExRateData[i].split("#~#");
        for (var j = 0; j < arrMyExItemColl.length; j++) {
            var arrMyExItem = arrMyExItemColl[j].split("#@#");
            rowJSON["Currency" + (j + 1)] = arrMyExItem[0];
            rowJSON["Rate" + (j + 1)] = arrMyExItem[1];
            Cnt++;
        }
        for (var j = Cnt; j <= 8 && Cnt != 8; j++) {
            rowJSON["Currency" + j] = "";
            rowJSON["Rate" + j] = "";
        }
        Cnt = 0;
        rowJSON["SNo"] = (i + 1);
        objJSON.push(rowJSON);
        rowJSON = {};
    }
    if (arrMyExRateData.length > 0) {
        flgManualExRateAvailable = true;
    }
    var strJSON = JSON.stringify(objJSON);
    return generateMYEXCHRow(strJSON, true);
}
function getConfigHRIQExp() {
    if (IsApplicantLevel == "true") {
        $("input[fldTitle='hdnHRIQExpConfig']").val(ExpenseDetails.expHRIQ.join("~"));
    }
    HRIQExpenses = $("input[fldTitle='hdnHRIQExpConfig']").val().toLowerCase().split("~");
    expLoad.hriqLoaded = true;
    if (expLoad.loadExpObj()) {
        initExpObjOnLoad()
    }
}
function getExpArrBy() {
    if (IsApplicantLevel == "true") {
        var expComp = [];
        var expEmp = [];
        TicketArrangedByExp.forEach(function (exp) {
            var arrBy = eval(exp + "PaidBy");
            if (arrBy == "Company") {
                expComp.push(exp);
            } else if (arrBy == "Employee") {
                expEmp.push(exp);
            }
        });
        $("input[fldTitle='hdnExpArrByComp']").val(expComp.join("~"));
        $("input[fldTitle='hdnExpArrByEmp']").val(expEmp.join("~"));
    }
    if ($("input[fldTitle='hdnExpArrByComp']").val() != "")
        expArranged.expCompany = $("input[fldTitle='hdnExpArrByComp']").val().split("~");
    if ($("input[fldTitle='hdnExpArrByEmp']").val() != "")
        expArranged.expEmployee = $("input[fldTitle='hdnExpArrByEmp']").val().split("~");
}
function getData(url) {
    var items;
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            items = data.d.results;
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
    return JSON.stringify(items);
}
function loadRemValues(tblID) {
    var countryTables = ["idTblTSH", "idTblDA"];
    if (countryTables.indexOf(tblID) != -1) {
        if (!loadRef.master.country) {
            loadDropDownList('RootSite', 'CountryCityMaster', 'Code', 'Description', 'ddlhdnCountry', 'Select', false, "MasterSelection", "Country");
            $(".country").html($("#ddlhdnCountry").html());
            loadRef.master.country = true;
        }
    }
    var gstTables = Object.keys(arrExpCodes[0]).concat('idTblOTH');
    if (gstTables.indexOf(tblID) != -1) {
        if (!loadRef.master.gstcode) {
            loadDropDownList('RootSite', 'GSTCodeMaster', 'GSTCode', 'Description', 'ddlhdnGSTCode', "Fvalue", true);
            $(".gstcode").html($("#ddlhdnGSTCode").html());
            defaultGSTCode = $(".gstcode").val();
            loadRef.master.gstcode = true;
        }
    }
    var currencyTables = Object.keys(arrExpCodes[0]).concat(['idTblMYEXCH','idTblOTH']);
    if (currencyTables.indexOf(tblID) != -1) {
        if (!loadRef.master.currency) {
            loadDropDownList('RootSite', 'CurrencyMaster', 'CurrencyCode', 'CurrencyCode', 'ddlhdnCurrency', baseCurrency, false);
            $(".currency").html($("#ddlhdnCurrency").html());
            loadRef.master.currency = true;
        }
    }
    if (tblID == "idTblDA") {
        if (!loadRef.master.DATypes) {
            loadDropDownList('CurrentSite', 'DATypes', 'DAType', 'DAType', 'ddlhdnDATypes', 'Select', false);
            $("#idDAAllowTypeEdit").html($("#ddlhdnDATypes").html());
            loadRef.master.DATypes = true;
        }
    }
    if (tblID == "tktcoord") { //dummy Val
        if (!loadRef.master.tktcoord) {
            loadDropDownList('CurrentSite', 'TravelAgency', 'TravelAgencyName', 'TravelAgencyName', 'ddlhdnTktCoordinator', 'Select', false);
            $(".tktcoord").html($("#ddlhdnTktCoordinator").html());
            loadRef.master.tktcoord = true;
        }
    }
}
function setAdvFields(objMode, idPC, idDenom, idFCAmt) {
    var Mode = objMode.value;
    if ([null, undefined, "Select"].indexOf(Mode) != -1) {
        return;
    }
    if (Mode != "Cash") {
        $("#" + idPC).val(0);
        $("#" + idDenom).val(0);
        $("#" + idPC).prop("disabled", true);
        $("#" + idDenom).prop("disabled", true);
        $("#" + idFCAmt).prop("readonly", false);
        $("#" + idPC).prev().css("color", "#e4e4e4");
        $("#" + idDenom).prev().css("color", "#e4e4e4");
    }
    else {
        $("#" + idPC).prop("disabled", false);
        $("#" + idDenom).prop("disabled", false);
        $("#" + idFCAmt).prop("readonly", true);
        $("#" + idPC).prev().css("color", "black");
        $("#" + idDenom).prev().css("color", "black");
    }
    calculateAdvanceAmt();
}
function loadRemJS(fileObjRef, fnToExecute) {
    try {
        var fileRef = loadRef.js.print;
        if (!fileRef.loaded) {
            fileRef.onLoadFn = fnToExecute;
            var scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", (fileRef.rootSite ? rootSiteUrl : currentSiteUrl) + "/" + fileRef.url + "?dep=" + hdnDeploySeq);
            document.body.appendChild(scriptTag);
        } else {
            fnToExecute();
        }
    } catch (e) { console.log(e.toString()) }
}