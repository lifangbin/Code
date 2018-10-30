//Declare Global Variables required
var optionData = {};
var baseCurrency;
var docStatus;
var applicantName;
var currentUser;
var strDocRefNo;
var nextApprover;
var isApplicantLevel = "false";
var rootSiteUrl = "";
var currentSiteUrl = "";
function eWorkOnload() {
    //Initialize the Global Variables

    /******************************** 
    * Collapse Panels
    * [data-perform="panel-collapse"]
    ********************************/
    (function ($, window, document) {
        var panelSelector = '[data-perform="panel-collapse"]';
        $(panelSelector).each(function () {
            var $this = $(this),
            parent = $this.closest('.panel'),
            wrapper = parent.find('.panel-wrapper'),
            collapseOpts = { toggle: false };
            if (!wrapper.length) {
                wrapper =
                parent.children('.panel-heading').nextAll()
                    .wrapAll('<div/>')
                    .parent()
                    .addClass('panel-wrapper');
                collapseOpts = {};
            }
            wrapper
            .collapse(collapseOpts)
            .on('hide.bs.collapse', function () {
                $this.children('i').removeClass('fa-minus').addClass('fa-plus');
            })
            .on('show.bs.collapse', function () {
                $this.children('i').removeClass('fa-plus').addClass('fa-minus');
            });
        });
        $(document).on('click', panelSelector, function (e) {
            e.preventDefault();
            var parent = $(this).closest('.panel');
            var wrapper = parent.find('.panel-wrapper');
            wrapper.collapse('toggle');
        });
    }(jQuery, window, document));
    /** ******************************
    * Remove Panels
    * [data-perform="panel-dismiss"]
    ****************************** **/
    (function ($, window, document) {
        var panelSelector = '[data-perform="panel-dismiss"]';
        $(document).on('click', panelSelector, function (e) {
            e.preventDefault();
            var parent = $(this).closest('.panel');
            removeElement();
            function removeElement() {
                var col = parent.parent();
                parent.remove();
                col.filter(function () {
                    var el = $(this);
                    return (el.is('[class*="col-"]') && el.children('*').length === 0);
                }).remove();
            }
        });
    }(jQuery, window, document));
    //Trigger OnConditional field change only if the document is New/Draft/RFI
    if (docStatus == "New" || docStatus == "Draft" || docStatus == "RFI") {
        onConditionalFieldChange();
    }
    objCCUserFld = $("input[fldTitle*='hdnSelectedCCUsers']");
    var strCCUser = document.getElementById(objCCUserFld[0].id).value;
    document.getElementById(objCCUserFld[0].id).value = "";
    arrCCUser = strCCUser.split(",");
    $('#lstPicker').val(arrCCUser);
    $("#lstPicker").multiselect("refresh");
    return true;
}
function eWorkDraft() {
    $("input:disabled").each(function () { this.disabled = false; });
    $("select:disabled").each(function () { this.disabled = false; });
    $("textarea:disabled").each(function () { this.disabled = false; });
    objTxtbox = $("input[fldTitle*='hdnSelectedCCUsers']");
    document.getElementById(objTxtbox[0].id).value = $('#lstPicker').val();
    return true;
}
function eWorkSubmit() {
    onConditionalFieldChange();
    //Changed by Manas on 26th April
    //$("input:disabled").each(function () { this.disabled = false; });
    //$("select:disabled").each(function () { this.disabled = false; });
    //$("textarea:disabled").each(function () { this.disabled = false; });
    var routingDtlsData = getRoutingJSON("routingTable");
    var routingJSON = JSON.stringify(routingDtlsData);
    if (routingJSON == "" || routingJSON == "[]") {
        alert("There is No Next Level to Get Approved. Please check with your Administrator.");
        validTab("menu-routing", "routing");
        return false;
    }
    var objTxtbox = $("input[fldTitle*='hdnJsonRoutingData']");
    document.getElementById(objTxtbox[0].id).value = routingJSON;
    routingDtlsData = getRoutingJSON("routingHRTable");
    routingJSON = JSON.stringify(routingDtlsData);
    objTxtbox = $("input[fldTitle*='hdnHRJsonRoutingData']");
    document.getElementById(objTxtbox[0].id).value = routingJSON;
    objTxtbox = $("input[fldTitle*='hdnSelectedCCUsers']");
    document.getElementById(objTxtbox[0].id).value = $('#lstPicker').val();

    //Changed by Manas on 26th April
    $("input:disabled").each(function () { this.disabled = false; });
    $("select:disabled").each(function () { this.disabled = false; });
    $("textarea:disabled").each(function () { this.disabled = false; });

    return true;
}
function eWorkApprove() {
    onConditionalFieldChange();
    var routingDtlsData = getRoutingJSON();
    var routingJSON = JSON.stringify(routingDtlsData);
    $("input[fldTitle*='hdnJsonRoutingData']").val(routingJSON);
    objTxtbox = $("input[fldTitle*='hdnSelectedCCUsers']");
    document.getElementById(objTxtbox[0].id).value = $('#lstPicker').val();
    eTravelPrint('PrintAll', true);//get print preview
    return true;
}
function eWorkReject() {
    objTxtbox = $("input[fldTitle*='hdnSelectedCCUsers']");
    document.getElementById(objTxtbox[0].id).value = $('#lstPicker').val();
    return true;
}
function eWorkGetBack() {
    return true;
}
function eWorkRFI() {
    var rfiOption = $("input[name='rfiOption']:checked").val();
    var rfiLevel = $("#idDrpRFILvlRevSel").val();

    if (rfiOption == 0) {
        $("input[name='drpRFILvlRevSel']").hide();
        var objLnkBtn = $("a[fldTitle*='lnkRFIAction']");
        document.getElementById(objLnkBtn[0].id).click();
        return true;
    }
    if (rfiLevel != 0 && rfiOption == 1) {
        var rfiSelectedValue = rfiOption + "," + rfiLevel;
        var objHdnRFIOpt = $("input[fldTitle*='hdnRFIOption']");
        document.getElementById(objHdnRFIOpt[0].id).value = rfiSelectedValue;
        var objLnkBtn = $("a[fldTitle*='lnkRFIAction']");
        document.getElementById(objLnkBtn[0].id).click();
        return true;
    }
    else {
        alert("Please select the Level/Reviewer to send");
        return false;
    }
}
function eWorkReassign() {
    var reviewerVal = $("#idDrpReassign").val();
    if (reviewerVal != 0) {
        var selectedReviewer = $("#idDrpReassign").val();
        var objHdnReviewer = $("input[fldTitle*='hdnReassignRev']");
        document.getElementById(objHdnReviewer[0].id).value = selectedReviewer;
        var objLnkBtn = $("a[fldTitle*='lnkReassignAction']");
        document.getElementById(objLnkBtn[0].id).click();
        return true;
    }
    else if (reviewerVal == 0) {
        alert("Please select the Reviewer");
        return false;
    }
}
///Added by Manas for Apply secretary
function eWorkApplySec() {
    var secretaryOption = $("input[name='secretaryOption']:checked").val();
    if (secretaryOption == 1) {
        $('#secretaryModal').modal('hide');

        //$(".btn-warning").click();
        //return true;        
    }
    if (secretaryOption == 2) {
        var selectedReviewer = $("#idDrpAppSec").val();
        if (selectedReviewer != 0) {
            var objHdnUser = $("input[fldTitle*='hdnApplySec']");
            document.getElementById(objHdnUser[0].id).value = selectedReviewer;
            var url = $("input[fldTitle*='hdnApplicationFormName']").val() + ".aspx?applySec=" + selectedReviewer;
            window.location.href = url;
        }
        else {
            alert("Please select on behalf of!!");
            return false;
        }
    }
}
function eWorkDeleteAttachment(fileID) {
    if (confirm("Are you sure you want to delete?")) {
        var fileIdToDelete = fileID;
        var objTxtbox = $("input[fldTitle*='hdnDeleteFileID']");
        document.getElementById(objTxtbox[0].id).value = fileID;
        var objLnkDelAttachment = $("a[fldTitle*='lnkDeleteAttachment']");
        document.getElementById(objLnkDelAttachment[0].id).click();
    }
    else {
        return false;
    }
    return true;
}
//function eWorkAttachment() {
//    if ($("#files").val() == "") {
//        alert("Please attach files");
//        return false;
//    }
//    var objFile = $("input[fldTitle*='hdnFiles']");
//    objFile.MultiFile = $("#files").val();
//    var objTxtbox = $("a[fldTitle*='lnkAttachAction']");
//    document.getElementById(objTxtbox[0].id).click();
//    //RFI issue start
//    var revir = getRoutingJSON("routingTable");
//    var jsonReviwer = [];
//    if (revir.length > 0) {
//        for (var i = 0; i < revir.length; i++) {
//            var routingObj =
//            {
//                "ID": "",
//                "Role": revir[i].Role,
//                "SelectedReviewer": revir[i].Reviewer.split(','),
//            }
//            jsonReviwer.push(routingObj);
//        }
//    }
//    if (typeof (Storage) !== "undefined") {
//        sessionStorage.reviewer = JSON.stringify(jsonReviwer);
//        sessionStorage.isAttachment = true;
//    } else {
//        console.log("Sorry, your browser does not support Web Storage...");
//    }
//    //RFI issue end
//    return true;
//}
function eWorkAttachment() {
    if ($("#files").val() == "") {
        alert("Please attach files");
        return false;
    }
    //should not allow file name with special characters
    var specialChars = "<>@!#$%^&*()+[]{}?:;|'\"\\,./~`="
    var fileName = $($('#files')[0].files).map(function () { return this.name.replace(/(\.{1}.[^\.]{1,})$/gi, function (mstr) { return mstr.substring(1) }) }).toArray().join("-");
    var check = function (string) {
        for (i = 0; i < specialChars.length; i++) {
            if (string.indexOf(specialChars[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    if (check(fileName) == true) {
        alert('Your File name contains special characters. Please remove the special characters and upload again');
        return false;
    }

    var objFile = $("input[fldTitle*='hdnFiles']");
    objFile.MultiFile = $("#files").val();
    var objTxtbox = $("a[fldTitle*='lnkAttachAction']");
    document.getElementById(objTxtbox[0].id).click();

    //RFI issue start
    var revir = getRoutingJSON("routingTable");
    var jsonReviwer = [];
    if (revir.length > 0) {
        for (var i = 0; i < revir.length; i++) {
            var routingObj =
            {
                "ID": "",
                "Role": revir[i].Role,
                "SelectedReviewer": revir[i].Reviewer.split(','),
                "SelectedCC": revir[i].CCRouting.split(','),
            }
            jsonReviwer.push(routingObj);
        }
    }
    if (typeof (Storage) !== "undefined") {
        sessionStorage.reviewer = JSON.stringify(jsonReviwer);
        sessionStorage.cc = JSON.stringify(jsonReviwer);
        sessionStorage.isAttachment = true;
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
    //RFI issue end

    return true;
}

//RFI issue start
function getSesionReviewerData() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        //var g = JSON.parse(localStorage.getItem("reviewer"));
        var sesionReviewer = "";
        if (sessionStorage.reviewer)
            sesionReviewer = JSON.parse(sessionStorage.reviewer);
        if (sesionReviewer != undefined && sesionReviewer.length > 0)
            bindSelectedApproval(sesionReviewer)
        console.log(sesionReviewer);
        var cc = "";
        if (sessionStorage.cc)
            cc = JSON.parse(sessionStorage.cc);
        if (cc != undefined && cc.length > 0)
            bindSelectedCC(cc)
        console.log(cc);
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}
function bindSelectedApproval(approvalData) {
    if (approvalData == undefined && $('#hdnSelectedApproval').val() != "")
        approvalData = JSON.parse($('#hdnSelectedApproval').val());
    if (approvalData == undefined) return;

    var table = $("#routingTable tbody");
    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
        $tr = $(this),
        role = $tr.find($("span[fldTitle*='lblRole']")).text(),
        approvalMode = $tr.find($("span[fldTitle*='lblApproverType']")).text();
        if (approvalMode != 'Auto') {
            for (var j = 0; j < approvalData.length; j++) {
                if (role == approvalData[j].Role) {
                    $tr.find('td:first-child input[type=checkbox]').prop('checked', true)
                    $tr.find("#lstReviewer").multiselect('enable');
                    //$tr.find("#lstReviewer option[value='" + approvalData[j].SelectedReviewer + "']").prop("selected", "selected");
                    $tr.find("#lstReviewer").val(approvalData[j].SelectedReviewer);
                    $tr.find("#lstReviewer").multiselect("refresh");
                    //$tds.find("input[type=checkbox]").attr("checked", true);
                }
            }
        }
    });
}
//RFI issue end

//CC Functionality
function bindSelectedCC(approvalData) {
    if (approvalData == undefined && $('#hdnSelectedCC').val() != "")
        approvalData = JSON.parse($('#hdnSelectedCC').val());
    if (approvalData == undefined) return;

    var table = $("#routingTable tbody");
    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
        $tr = $(this),
        role = $tr.find($("span[fldTitle*='lblRole']")).text(),
        approvalMode = $tr.find($("span[fldTitle*='lblApproverType']")).text();
        for (var j = 0; j < approvalData.length; j++) {
            if (role == approvalData[j].Role) {
                $tr.find('td:first-child input[type=checkbox]').prop('checked', true)
                $tr.find("#lstCC").multiselect('enable');
                $tr.find("#lstCC").val(approvalData[j].SelectedCC);
                $tr.find("#lstCC").multiselect("refresh");
            }
        }
    });
}
//CC Functionality


function eWorkCancel() {
    return true;
}
function eWorkDelete() {
    return true;
}
function eWorkClose(argYesNo) {
    if (true) { //This line need to redefine if providing for Approver also
        if (argYesNo == "YesNo") {
            blnConfirm = "Do you want to save this document ?";
            eWorkCloseYesNoCancel((blnConfirm) ? "Yes" : "No")
        }
        else {
            document.all("idCloseCaption").innerHTML = "Do you want to save this document ?";
            document.all("idBtnClosePopup").click();
        }
    }
    else
        eWorkCloseYesNoCancel("No");
}
function eWorkCloseYesNoCancel(strQuestion) {
    if (strQuestion == "Cancel")
        return false;

    if (strQuestion == "Yes") {
        clickDraftButton();
        return true;
    }
    closeButtonClick("Yes");
    return false;
}
//For Framework Code Control
function addorremoveLevel(levelNo, action) {
    var tr = $('#idLevel' + levelNo);
    if (action == 1) {
        tr.show();
    }
    else {
        tr.hide();
    }
    $(tr).find("input[fldTitle='txtLevelReq']").val(action);
}

function getRoutingJSON(argTblID) {
    var routingJSON = [];
    var Reviewer = null;
    //Added for CC functionality
    var CCRouting = null;
    var objTbl = $("#" + argTblID);
    if (objTbl.length == 0 || objTbl == undefined || objTbl == null) {
        return routingJSON;
    }
    var strNoEntriesFound = [];
    strNoEntriesFound = "No Entries Found...";
    var isNoEntries = strNoEntriesFound.indexOf(objTbl[0].children[1].textContent);
    if (isNoEntries != -1) {
        return routingJSON;
    }
    $("#" + argTblID + " >tbody >tr").each(function () {
        var tr = $(this);
        var LevelType = tr.find($("span[fldTitle*='lblLevelType']")).text();
        var Role = tr.find($("span[fldTitle*='lblRole']")).text();
        //Added for Multi approver by Manas on 13th March
        var ApprovalMode = tr.find($("span[fldTitle*='lblApproverType']")).text();
        var type = tr.find($("span[fldTitle*='lblReviewer']")).text(); //.css('display');
        if (ApprovalMode == "Manual" && type == "") {
            //var multipleValues = tr.find($('#lstReviewer')).val() || [];
            //Reviewer = multipleValues.join(";");
            //Reviewer = $(this).find("td").eq(1).find("select option:selected").text();
            var array = [];
            //var selectedValue = tr.find("option:selected").map(function () { return this.value }).get();
            var selectedValue = tr.find("#lstReviewer>option:selected").map(function () { return this.value }).get();
            if (!selectedValue.length > 0) return true;

            if (selectedValue.length > 0)
                array.push(selectedValue);
            if (array.length > 0)
                Reviewer = array.join(';');
        }
        else {
            Reviewer = tr.find($("span[fldTitle*='lblReviewer']")).text();
        }

        //Added for CC functionality
        var arrayCC = [];
        var selectedCC = tr.find("#lstCC>option:selected").map(function () { return this.value }).get();
        //if (!selectedCC.length > 0) return true;
        if (selectedCC.length > 0)
            arrayCC.push(selectedCC);
        //if (arrayCC.length > 0)
        CCRouting = arrayCC.join(';');
        //Added for CC functionality


        var LevelRequired = tr.find($("input[fldTitle*='txtLevelReq']")).val();
        var ConfigurationField = tr.find($("span[fldTitle*='lblConfigfield']")).text();
        var RuleNumber = tr.find($("span[fldTitle*='lblRuleNumber']")).text();
        var RuleDescription = tr.find($("span[fldTitle*='lblRuleDescription']")).text();
        var SequenceNo = tr.find($("span[fldTitle*='lblSeqNo']")).text();
        var DStamp = tr.find($("span[fldTitle*='lblDecision']")).text();
        var AdhocMail = tr.find($("span[fldTitle*='lblAdhoc']")).text();
        var DailyMail = tr.find($("span[fldTitle*='lblDaily']")).text();
        var routingObj =
        {
            "Title": Role,
            "Role": Role,
            "Reviewer": Reviewer,
            "ApprovalMode": ApprovalMode,
            "LevelType": LevelType,
            "CCRouting": CCRouting,
            "LevelRequired": LevelRequired,
            "ConfigurationField": ConfigurationField,
            "RuleNumber": RuleNumber,
            "RuleDescription": RuleDescription,
            "SequenceNo": SequenceNo,
            "DStamp_X003a_DSPastTense": DStamp,
            "AdhocMail": AdhocMail,
            "DailyMail": DailyMail,
        }
        //}



        routingJSON.push(routingObj);
    });
    return routingJSON;
}



function validateRFIReassign(strRFIResassign) {
    var isRemarksEntered = false;
    if (strRFIResassign == "RFI") {
        isRemarksEntered = validateRemarks('Please mention the reason on remarks textbox before RFI this document.');
    }
    else {
        isRemarksEntered = true;
    }
    if (isRemarksEntered == true) {
        if (strRFIResassign == "RFI") {
            $('#rfiModal').modal('toggle');
        }
        else if (strRFIResassign == "Secretary") {
            $('#secretaryModal').modal('toggle');
        }
        else {
            $('#reassignModal').modal('toggle');
        }
    }
    //priyan
    eTravelPrint('PrintAll', true);//get print preview
}
function validateRemarks(str) {
    var txtRemarks = $("textarea[fldTitle*='txtRemarks']").val();
    if (txtRemarks.trim() == "") {
        alert(str);
        $("textarea[fldTitle*='txtRemarks']").focus();
        return false;
    }
    return true;
}
function validateUser(applicationName, curruser) //To check if Current Logged in user is avaialble in User Profile and can apply.
{
    var appListName = "TempUserProfile";
    $.ajax({
        url: rootSiteUrl + "/_api/Web/Lists/GetByTitle('" + appListName + "')/Items?$Select=Applications/ApplicationName,UserName/Title&$expand=Applications/ApplicationName,UserName/Id&$filter=UserName/Title eq '" + encodeURIComponent(curruser) + "'",
        type: "GET",
        async: false,
        headers: { "accept": "application/json;odata=verbose" },
        success: function (data) {
            var res = data.d.results;
            var flgApplyUser = false;
            for (var i = 0; i < res.length; res++) {
                var applicationNamColl = res[i].Applications.results;
                for (var x = 0; x < applicationNamColl.length; x++) {
                    var appName = applicationNamColl[x].ApplicationName;
                    if (appName.toLowerCase() == applicationName.toLowerCase()) {
                        flgApplyUser = true;
                        break;
                    }
                }
            }
            if (flgApplyUser == false) {
                alert("You are not authorized to create application. Please check with your Administrator.");
                window.location.href = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/AccessDenied.aspx";
            }
        },
        error: function (error) {
        }
    });
}
$(function () {
    $('[id*=lstPicker]').multiselect({
        includeSelectAllOption: false,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 200,
        nonSelectedText: 'Select CC',
        numberDisplayed: 5,
        actionsBox: true
    });
});

//Changed by Manas on 26th April
$(function () {
    $('[id*=lstReviewer]').multiselect({
        includeSelectAllOption: false,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 200,
        nonSelectedText: 'Select Reviewer',
        numberDisplayed: 4,
        actionsBox: true
    });
});
$(function () {
    $('[id*=lstCC]').multiselect({
        includeSelectAllOption: false,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 200,
        nonSelectedText: 'Select CC',
        numberDisplayed: 3,
        actionsBox: true
    });
});



//For conditional Routing - To evaluate each line of condition - By Sreevas
function evalWFCondition(condName, fldVal, fldCondVal, fldCond, fldType) {
    var fldValArr = fldVal == undefined ? [] : fldVal.split(";");
    fldCondValArr = fldCondVal == undefined ? [] : fldCondVal.split(";");
    var strCon = "";
    var flgPresent = false;
    if (fldType.toLowerCase() == "string") {
        for (var i = 0; i < fldValArr.length; i++) {
            if (fldCondValArr.indexOf(fldValArr[i]) != -1) {
                flgPresent = true;
                break;
            }
        }
        if (fldCond == "!=") {
            strCon = (flgPresent) ? false : true;
        } else {
            strCon = (flgPresent) ? true : false;
        }
    } else {
        for (var i = 0; i < fldValArr.length; i++) {
            for (var j = 0; j < fldCondValArr.length; j++) {
                switch (fldCond) {
                    case '>':
                        if (outputNumber(fldValArr[i]) > outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    case '<':
                        if (outputNumber(fldValArr[i]) < outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    case '>=':
                        if (outputNumber(fldValArr[i]) >= outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    case '<=':
                        if (outputNumber(fldValArr[i]) <= outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    case '==':
                        if (outputNumber(fldValArr[i]) == outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    case '!=':
                        if (outputNumber(fldValArr[i]) != outputNumber(fldCondValArr[j])) {
                            flgPresent = true;
                            break;
                        }
                        break;
                    default:
                        return false;
                }
            }
        }
        strCon = (flgPresent) ? true : false;
    }
    return (condName + ":" + strCon);
}

//Added By Manas on 29th Oct
function getUserList(toBindSelectFld) {
    siteURL = _spPageContextInfo.siteAbsoluteUrl;
    var apiPath = siteURL + "/_api/lists/getbytitle('TempUserProfile')/Items?$select=UserName/Title&$expand=UserName/Id&$top=500";
    $.ajax({
        url: apiPath,
        method: "GET",
        contentType: "application/json",
        headers: {
            accept: "application/json;odata=verbose"
        },
        success: function (data) {
            var items = data.d;
            var results;
            var userList = [];
            results = items.results;
            for (var i = 0; i < results.length; i++) {
                userList.push({
                    "lable": results[i].UserName.Title,
                    "value": results[i].UserName.Title
                });
            }
            toBindSelectFld.multiselect('dataprovider', userList);
        },
        eror: function (data) {
            console.log("An error occurred. Please try again.");
        }
    });
}