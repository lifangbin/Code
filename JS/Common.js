function outputNumber(moneyValue) {
    var reg1 = new RegExp("[',']", "g");
    if (!isNaN(moneyValue)){
        moneyValue = moneyValue.toString();
    }else {
        moneyValue = moneyValue.toString();
        if (moneyValue.indexOf('--') == 0) {
            moneyValue = moneyValue.replace(/\-/g, '');
            moneyValue = "-" + moneyValue;
        }
    }
    moneyValue = moneyValue.toString();
    return parseFloat(moneyValue.replace(reg1, ""));
}
function outputMoney(number) {
    if (number == '')
        number = 0;
    var DecimalSep = ".";
    var Sep = ",";
    var num = outputNumber(number);
    if (isNaN(num)) {        
        num = 0;
    }
    num = (num - 0).toFixed(3);
    num = (num - 0).toFixed(2); 
    if (num < 0) {
        num *= -1;
        return '-' + outputDollars(Math.floor(num - 0) + '', Sep) + DecimalSep + outputCents((num - 0).toFixed(2));
    }
    return outputDollars(String(num).substring(0, InStr(num, ".")) + '', Sep) + DecimalSep + outputCents((num - 0).toFixed(2));
}
function outputMoneyEx(number)
{  
	if(number=='')
		number=0; 
	var DecimalSep=".";
	var Sep=",";
	var num=outputNumber(number,true);
	num = (num-0).toFixed(6);
	num = (num-0).toFixed(5);
	if(num<0)
	{
		num*=-1;
		return '-'+outputDollars(Math.floor(num-0) + '',Sep) +DecimalSep+ outputCentsEx((num-0).toFixed(5));
	}
	return outputDollars(String(num).substring(0,InStr(num,".")) + '',Sep) +DecimalSep+ outputCentsEx((num-0).toFixed(5));
}

function outputDollars(number, Sep) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (var i = 0 ; i < Math.floor(number.length / 3) ; i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += Sep + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}

function outputCents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '0' + amount : amount);
}

function outputCentsEx(amount)
{    
      amount = Math.round( ( (amount) - Math.floor(amount) ) *1000000);
      if(amount<10)
            amount='00000'+amount;
      else if(amount<100)
            amount='0000'+amount;
      else if(amount<1000)
            amount='000'+amount;              
      else if(amount<10000)
            amount='00'+amount;
      else if(amount<100000)
            amount='0'+amount;            
      return amount;
}


function InStr(strSearch, strSearchFor) //Returns the first location a substring (SearchForStr)
{
    for (var i = 0; i < Len(strSearch) ; i++) {
        if (strSearchFor == Mid(strSearch, i, Len(strSearchFor))) {
            return i;
        }
    }
    return -1;
}

function Mid(str, start, len)
    /***
            IN: str - the string we are LEFTing
            start - our string's starting position (0 based!!)
            len - how many characters from start we want to get
           RETVAL: The substring from start to start+len
    ***/ {
    // Make sure start and len are within proper bounds
    if (start < 0 || len < 0) return "";
    var iEnd, iLen = String(str).length;
    if (start + len > iLen)
        iEnd = iLen;
    else
        iEnd = start + len;
    return String(str).substring(start, iEnd);
}

function Len(str) //The number of characters in the string
{
    return String(str).length;
}

function getDate(tempDate) //Argument – MM/DD/YYYY
{
    var splitDate = tempDate.split('/');
    var dtDate = new Date(splitDate[0] + "/" + splitDate[1] + "/" + splitDate[2]);
    dtDate.setHours(0); dtDate.setMinutes(0); dtDate.setSeconds(0); dtDate.setMilliseconds(0);
    return dtDate;
}

function convertDate(tempDate) { // -dd/mm/yyyy
    var splitDate = tempDate.split('/');
    var dtDate = (splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2]);
    return dtDate;
}

function formatDate(tempDate) { // -dd/mm/yyyy (date object)
    var splitDate = convertDate(tempDate).split('/');
    var dtDate = new Date(splitDate[0] + "/" + splitDate[1] + "/" + splitDate[2]);
    dtDate.setHours(0); dtDate.setMinutes(0); dtDate.setSeconds(0); dtDate.setMilliseconds(0);
    return dtDate;
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
function setCombo(argSource, argDest, selectedVal) {
    var $options = $("#" + argSource + " > option").clone();
    $('#' + argDest).append($options);
    $('#' + argDest).val(selectedVal);
}