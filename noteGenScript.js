console.clear();
try {
    var callTypeArray = Array.from(window.opener.callTypeArray);
} catch (e) {
    var callTypeArray = [0];
    console.log(e);
}
changeHeight();

// pauses operation for set number of ms 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sends HTML from page to new window
function openNewWindow(){
    var divText = document.getElementById('tDiv').innerHTML;
    var myWindow = window.open('', '', 'width=425,height=600');
    var doc = myWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html>\
        <head>\
        <title>Note Generator</title>\
        <link rel="stylesheet" href="./tDivStyle.css" type="text/css">\
        </head>\
        <div id="tDiv">');
    doc.write(divText);
    doc.write('</div>\
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>\
    <script src="noteGenScript.js"></script>');
    doc.close();
}

// creates clones of the callType div and changes the names of the clones children
function cloneCallType() {
    // copies first call type in the array, adds the new clone into end of array
    var parent = document.getElementById('callTypeDiv' + callTypeArray[0]);
    var clone = parent.cloneNode(true);
    callTypeArray.push(callTypeArray[callTypeArray.length-1]+1);

    //set id and clear key values from new clone 
    clone.id = 'callTypeDiv' + callTypeArray[callTypeArray.length-1];
    clone.getElementsByTagName('select')[0].id = 'callTypeSelect' + callTypeArray[callTypeArray.length-1];
    clone.getElementsByTagName('select')[0].value = '';
    clone.getElementsByClassName('ceCalledBlock')[0].id = 'ceCalledBlock' + callTypeArray[callTypeArray.length - 1];
    clone.getElementsByTagName('button')[1].id = "removeCallTypeDivButton" + callTypeArray[callTypeArray.length - 1];

    // renames all new fields in calltype to match naming scheme and increment
    var blocks = clone.getElementsByClassName('callTypeHidden');
    for(i = 0; i < blocks.length; i++) {
        if (blocks.item(i) === null) {
            alert('Error Occured, Reloading page. Please save information');
            location.reload();
        } else {
            blocks.item(i).id = 'callTypeBlock' + callTypeArray[callTypeArray.length - 1] + '-' + i;
            var inputs = blocks.item(i).getElementsByTagName('input');
            for(y = 0; y < inputs.length; y++) {
                inputs.item(y).id = 'callTypeInput' + callTypeArray[callTypeArray.length - 1] + '-' + i + '-' + y;
                inputs.item(y).value = "";
            }
            var selects = blocks.item(i).getElementsByTagName('select');
            for (y = 0; y < selects.length; y++) {
                selects.item(y).id = 'callTypeSelect' + callTypeArray[callTypeArray.length - 1] + '-' + i + '-' + y;
                selects.item(y).value = "";
            }
        }
    }
    // insert the calltype in the DOM and reset fields 
    document.getElementById('callTypeDiv' + (callTypeArray[callTypeArray.length - 1] - 1)).after(clone);
    callTypeSel();
}

// removes current call type div matching the number of the button that called function
function removeCallType(button) {
    var callerNum = button.id.slice(23,button.id.length);
    if (callTypeArray.length > 1) {
        document.getElementById('callTypeDiv' + callerNum).remove();
        var index = callTypeArray.indexOf(parseInt(callerNum));
        callTypeArray.splice(index, 1);
    }
    callTypeSel();
}

// Looks at all created call types, in each identifies the ceCalled checkbox and toggles opening and closing the div
function ceUpdate() {
    var divs = document.getElementsByClassName('callTypeDivs');
    for (i = 0; i < divs.length; i++) {
        var block = divs.item(i).getElementsByClassName('ceCalledBlock');
        for (y = 0; y < block.length; y++) {
            var num = block.item(y).id.slice(block.item(y).id.length - 1, block.item(y).id.length);
            if (document.getElementById('callTypeInput' + num + '-2-19').checked === true) {
                document.getElementById(block.item(y).id).className = 'displayBlock ceCalledBlock';
            } else {
                document.getElementById(block.item(y).id).className = 'displayNone ceCalledBlock';
            }
        }
    }
    changeHeight();
}

// Looks at all created call types, in each identifies the paidUpdate dropdown and toggles opening and closing the div 
function paidUpdate() {
    var divs = document.getElementsByClassName('callTypeDivs');
    for (i = 0; i < divs.length; i++) {
        var block = divs.item(i).getElementsByClassName('paidClaimInfo');
        for (y = 0; y < block.length; y++) {
            var num = block.item(y).id.slice(block.item(y).id.length - 1, block.item(y).id.length);
            if (document.getElementById('callTypeSelect' + num + '-2-0').value !== '') {
                document.getElementById(block.item(y).id).className = 'displayBlock paidClaimInfo';
            } else {
                document.getElementById(block.item(y).id).className = 'displayNone paidClaimInfo';
            }
        }
    }
    changeHeight();
}

// Parses data input from the pasteboxes, puts the relevant information in the correct input fields
function parsePasteData() {
    var divs = document.getElementsByClassName('callTypeDivs');
    for (i = 0; i < divs.length; i++) {
        var blocks = divs.item(i).getElementsByClassName('callTypeHidden');
        var divNum = divs.item(i).id.charAt(divs.item(i).id.length-1);
        for (y = 0; y < blocks.length; y++) {
            var currBlock = blocks.item(y);
            var blockNum = currBlock.id.charAt(currBlock.id.length-1);
            if (currBlock.getElementsByClassName('pasteBox').value !== "") {
                try { 
                    var pasteDataARR = currBlock.getElementsByClassName('pasteBox')[0].value.split(/\r?\n/);
                }
                catch(err) { 
                    break;
                }
            }
            // Authorization Check 
            if (y === 0 && pasteDataARR[1] === 'Authorizations') {
                var legend = pasteDataARR[2];
                var authPaste = pasteDataARR[3];
                authPaste = authPaste.split('\t');
                legend = legend.split('\t');
                for (x = 0; x < authPaste.length; x++) {
                    switch (x){
                    case 0:
                        // provider id 
                        break;
                    case 1:
                        // facility name 
                        break;
                    case 2:
                        //approved proc 
                        document.getElementById('callTypeInput'+ divNum+'-0-0').value = authPaste[x];
                        break;
                    case 3:
                        // # approved units 
                        document.getElementById('callTypeInput' + divNum + '-0-3').value = authPaste[x];
                        break;
                    case 4:
                        // Approved start date  
                        document.getElementById('callTypeInput' + divNum + '-0-1').value = authPaste[x].split(' ')[0];
                        break;
                    case 5:
                        // Approved end date
                        document.getElementById('callTypeInput' + divNum + '-0-1').value += ' - ' + authPaste[x].split(' ')[0];
                        break;
                    case 6:
                        // decision 
                        if (authPaste[x].search('Denial') === -1){
                        document.getElementById('callTypeSelect' + divNum + '-0-0').value = authPaste[x];
                        } else {
                        document.getElementById('callTypeSelect' + divNum + '-0-0').value = 'Denied';
                        }
                        break;
                    case 7:
                        // used units 
                        document.getElementById('callTypeInput' + divNum + '-0-5').value = authPaste[x];
                        break;
                    case 8:
                        // o Units ?
                        break;
                    case 9:
                        // o to date 
                        break;
                    case 10:
                        // requested proc code 
                        break;
                    case 11:
                        // requested units 
                        document.getElementById('callTypeInput' + divNum + '-0-4').value = authPaste[x];
                        break;
                    case 12:
                        // requested from date 
                        document.getElementById('callTypeInput' + divNum + '-0-2').value = authPaste[x].split(' ')[0];
                        break;
                    case 13:
                        // requested to date  
                        document.getElementById('callTypeInput' + divNum + '-0-2').value += ' - ' + authPaste[x].split(' ')[0];
                        break;
                    case 14:
                        // auth number 
                        document.getElementById('callTypeInput' + divNum + '-0-6').value = authPaste[x];
                        break;
                    case 15:
                        // created date  
                        document.getElementById('callTypeInput' + divNum + '-0-7').value = authPaste[x].split(' ')[0];
                        break;
                    case 16:
                        // User Created Auth 
                        break;
                    case 17:
                        // Latest Auth Update date 
                        document.getElementById('callTypeInput' + divNum + '-0-8').value = authPaste[x].split(' ')[0];
                        break;
                    case 18:
                        // Review Id ?
                        break;
                    case 19:
                        // # provider letters printed 
                        break;
                    case 20:
                        // # member letters printed 
                        break;
                    case 21:
                        // To Be Printed ?
                        break;
                    case 22:
                        // Send to address for auth letter 
                        break;
                    default: 
                        break;
                    }
                }    
            }

            // Eligibility Check 
            if (y === 1 && pasteDataARR[1] === 'Eligibility Segment') {
                for (x = 0; x < pasteDataARR.length; x++) {
                    switch(pasteDataARR[x].split('\t')[0]) {
                    case 'DateBegin':
                        document.getElementById('callTypeInput' + divNum + '-1-0').value += pasteDataARR[x].split('\t')[1].split(' ')[0];
                        break;
                    case 'DateEnd':
                        document.getElementById('callTypeInput' + divNum + '-1-0').value += ' - ' + pasteDataARR[x].split('\t')[1].split(' ')[0];
                        break;
                    default:
                        break;
                    }
                }
            }

            // Co-Pay Check
            if (y === 1 && pasteDataARR[1] === 'Co-Pays') {
                for (x = pasteDataARR.length; x >= 0 ; x--) {
                    if (pasteDataARR[x] === '') {
                        pasteDataARR.pop();
                    }
                }
            
                var legend = pasteDataARR[2];
                var coPayPaste = pasteDataARR;
                for (x = 0; x < 3; x++){
                    coPayPaste.shift();
                }
                var rows = coPayPaste.length;
                var tempArr = [];
                for (x = 0; x < coPayPaste.length; x++) {
                    var tempArr2 = coPayPaste[x].split('\t');
                    for (z = 0; z < tempArr2.length; z++) {
                        tempArr.push(tempArr2[z]);
                    }
                }
                coPayPaste = tempArr;
                legend = legend.split('\t');
                var currRow = 0;
                for (z = 0; z < coPayPaste.length; z++){
                    if (z % (coPayPaste.length/rows) === 0) {
                        document.getElementById('callTypeInput' + divNum + '-1-2').value += 'adv ';
                        currRow += 1;
                    }
                    switch (z % (coPayPaste.length/rows)) {
                        case 0:
                            //copay type 
                            document.getElementById('callTypeInput' + divNum + '-1-2').value += coPayPaste[z] + ' co-pays are ';
                            break;
                        case 1:
                            // copay range
                            document.getElementById('callTypeInput' + divNum + '-1-2').value += 'a ' + coPayPaste[z] + ' copay/deductible of ';
                            break;
                        case 2:
                            //copay value
                            document.getElementById('callTypeInput' + divNum + '-1-2').value += coPayPaste[z] + ' / ';
                            break;
                        case 3:
                            //network
                            break;
                        case 4:
                            //exclude from oop
                            break;
                        case 5:
                            //post deductible
                            break;
                        case 6:
                            //datefrom
                            break;
                        case 7:
                            //dateto
                            break;
                        case 8:
                            //username
                            break;
                        case 9:
                            //dateupdated
                            break;
                        case 10:
                            //description
                            break;
                        default: 
                            break;
                    }
                }
            }
            
            // Benefits page Check
            if (y === 1 && pasteDataARR[1] === 'Benefits') {
                for (x = pasteDataARR.length-1; x >= 0; x--) {
                    if (pasteDataARR[x] === '' || 
                    pasteDataARR[x].split('\t')[0] === 'Funding' || 
                    pasteDataARR[x].split('\t')[0] === 'UserName' || 
                    pasteDataARR[x].split('\t')[0] === 'Update Date') {
                        pasteDataARR.pop();
                    }
                }
                for (x = 0; x < 3; x++) {
                    pasteDataARR.shift();
                }
                var prev = '';
                for (x = 0; x < pasteDataARR.length; x++) {
                    switch (pasteDataARR[x].split('\t')[0]) {
                        case 'MH IP':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' benefits are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'MH IP';
                            break;
                        case 'MH OP':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' benefits are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'MH OP';
                            break;
                        case 'SA IP':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' benefits are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'SA IP';
                            break;
                        case 'SA OP':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' benefits are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'SA OP';
                            break;
                        case 'Other':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' benefits are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'Other';
                            break;
                        case 'Benefit Level':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x] + ' / ';
                            prev = 'Benefit Level';
                            break;
                        default:
                            if (prev !== ''){
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += pasteDataARR[x] + ' / ';
                            }
                            prev = '';
                            break;
                    }
                }
            }

            // Demographics page Check
            if (y === 1 && pasteDataARR[1] === 'Demographics') {
            
                var prev = '';
                for (x = 0; x < pasteDataARR.length; x++) {
                    switch (pasteDataARR[x].split('\t')[0]) {
                        case 'Member ID':
                            break;
                        case 'Name':
                            break;
                        case 'Preferred Name':
                            break;
                        case 'Preferred Pronoun':
                            break;
                        case 'Age':
                            break;
                        case 'Gender':
                            break;
                        case 'Gender Identity':
                            break;
                        case 'Transgender':
                            break;
                        case 'Additional Information':
                            break;
                        case 'Alternative IDs':
                            break; 
                        case 'Latest Eligibility. Seg.':
                            document.getElementById('callTypeInput' + divNum + '-2-0').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'RespParty':
                            break;
                        case 'Self Pay':
                            break;
                        case 'Group':
                            break;
                        case 'SubGroup':
                            break;
                        case 'PCP Name':
                            break;
                        case 'PCP Fax':
                            break;
                        case 'PCP Phone':
                            break;
                        case 'PCP Email':
                            break;
                        case 'PCPAddress':
                            break;
                        case 'PCPCity State Zip':
                            break;
                        case 'PCP Location':
                            break;
                        case 'Health Home':
                            break;
                        case 'Residence Address':
                            break;
                        case 'Private Mailing Address':
                            break;
                        case 'Phones':
                            break;
                        case 'Benefit Name':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x] + ' / ';
                            prev = 'Benefit Name';
                            break;
                        case 'MHIP Benefits':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'MH IP';
                            break;
                        case 'MHOP Benefits':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'MH OP';
                            break;
                        case 'SAIP Benefits':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'SA IP';
                            break;
                        case 'SAOP Benefits':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'SA OP';
                            break;
                        case 'Other Benefits':
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += 'adv ' + pasteDataARR[x].split('\t')[0];
                            document.getElementById('callTypeInput' + divNum + '-1-1').value += ' are: ' + pasteDataARR[x].split('\t')[1] + ' / ';
                            prev = 'Other';
                            break;
                        case 'BHCP Status':
                            break;
                        case 'COB':
                            break;
                        case 'Language':
                            break;
                        case 'Race':
                            break;
                        case 'Ethnicity':
                            break;
                        case 'Plan Name':
                            break;
                        case 'ExcludeCode':
                            break;
                        case 'FeeCategory':
                            break;
                        case 'Fax':
                            break;
                        case 'Email':
                            break;
                        case 'Update Reason':
                            break;
                        case 'Updated By':
                            break;
                        case 'Updated Date':
                            break;
                        case 'Source Date':
                            break;
                        case 'CaseContact1':
                            break;
                        case 'CaseContact2':
                            break;
                        case 'CaseContact3':
                            break;
                        case 'MemRecID':
                            break;
                        default:
                            if (prev !== '') {
                                document.getElementById('callTypeInput' + divNum + '-1-1').value += pasteDataARR[x] + ' / ';
                            }
                            prev = '';
                            break;
                    }
                }
            }

            // Utilization Page Check
            if (y === 1 && pasteDataARR[1] === 'Utilization of services') {
                for (x = pasteDataARR.length; x >= 0; x--) {
                    if (pasteDataARR[x] === '') {
                        pasteDataARR.pop();
                    }
                }
                var legend = pasteDataARR[2];
                var utilPaste = pasteDataARR;
                for (x = 0; x < 3; x++) {
                    utilPaste.shift();
                }
                var rows = utilPaste.length;
                var tempArr = [];
                for (x = 0; x < utilPaste.length; x++) {
                    var tempArr2 = utilPaste[x].split('\t');
                    for (z = 0; z < tempArr2.length; z++) {
                        tempArr.push(tempArr2[z]);
                    }
                }
                utilPaste = tempArr;
                legend = legend.split('\t');
                var currRow = 0;
                for (z = 0; z < utilPaste.length; z++) {
                    if (z % (utilPaste.length / rows) === 0) {
                        document.getElementById('callTypeInput' + divNum + '-1-2').value += 'adv ';
                        currRow += 1;
                    }
                    switch (z % (utilPaste.length / rows)) {
                        case 0:
                            // service period 
                            break;
                        case 1:
                            // op visits 
                            document.getElementById('callTypeInput' + divNum + '-1-3').value += ' adv used ' + utilPaste[z] + ' OP Visits /';
                            break;
                        case 2:
                            // copayed visits 
                            document.getElementById('callTypeInput' + divNum + '-1-3').value += 'adv ' + utilPaste[z] + ' visits had a copay / ';
                            break;
                        case 3:
                            // ie visits 
                            document.getElementById('callTypeInput' + divNum + '-1-3').value += 'adv used ' + utilPaste[z] + ' initial encounters / ';
                            break;
                        case 4:
                            // op allowed 
                            break;
                        case 5:
                            // ie allowed 
                            break;
                        case 6:
                            // ip days
                            break;
                        case 7:
                            // ip allowed 
                            break;
                        case 8:
                            // other allowed 
                            break;
                        case 9:
                            // oop expenses 
                            break;
                        case 10:
                            // deductibles
                            break;
                        case 11:
                            // copays
                            break;
                        case 12:
                            // Coinsurance
                            break;
                        default:
                            break;
                    }
                }
            }

            // Claims Check
            if ((y === 2 && pasteDataARR[1] === 'Specific Claim Line') || (y === 2 && pasteDataARR[1] === 'Claim Line Details')) {
                for (x = 0; x < pasteDataARR.length; x++) {
                    switch (pasteDataARR[x].split('\t')[0]) {
                        case 'TCN':
                            break;
                        case 'DCN':
                            break;
                        case 'Resubmission':
                            break;
                        case 'Status ':
                            document.getElementById('callTypeInput' + divNum + '-2-0').value = pasteDataARR[x].split('\t')[1].split(' ')[0];
                            break;
                        case 'Member':
                            break;
                        case 'SubmissionSource':
                            break;
                        case 'Provider':
                            break;
                        case 'Network':
                            break;
                        case 'Site':
                            break;
                        case 'Billing NPI':
                            break;
                        case 'Payee':
                            break;
                        case 'ICD Indicator':
                            break;
                        case 'Diagnosis 1':
                            break;
                        case 'Diagnosis 2':
                            break;
                        case 'Line Dx Codes':
                            break;
                        case 'All Claim Dx Codes':
                            break;
                        case 'Date Received':
                            document.getElementById('callTypeInput' + divNum + '-2-3').value = pasteDataARR[x].split('\t')[1].split(' ')[0];
                            break;
                        case 'Date Entered':
                            break;
                        case 'Date Paid':
                            document.getElementById('callTypeInput' + divNum + '-2-4').value = pasteDataARR[x].split('\t')[1].split(' ')[0];
                            break;
                        case 'Claim Notes':
                            break;
                        case 'Dates Of Service':
                            document.getElementById('callTypeInput' + divNum + '-2-1').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Procedure ':
                            document.getElementById('callTypeInput' + divNum + '-2-2').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Units Claimed':
                            document.getElementById('callTypeInput' + divNum + '-2-5').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Amount Charged':
                            document.getElementById('callTypeInput' + divNum + '-2-7').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Allowed Units':
                            document.getElementById('callTypeInput' + divNum + '-2-6').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Allowed Amount':
                            document.getElementById('callTypeInput' + divNum + '-2-8').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Paid Amount':
                            break;
                        case 'DecisionCodes':
                            document.getElementById('callTypeInput' + divNum + '-2-9').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'External Outreach':
                            break;
                        case 'Clean Claim':
                            break;
                        case 'Other Insurance':
                            break;
                        case 'Good Cause Available':
                            break;
                        case 'OI EOB Date':
                            break;
                        case 'OI Allowed':
                            break;
                        case 'OI Copay':
                            break;
                        case 'OI Deductible':
                            break;
                        case 'OI CoInsurance':
                            break;
                        case 'OI Paid':
                            break;
                        case 'PR Other':
                            break;
                        case 'COB Allowed Amount':
                            break;
                        case 'Priced Amount':
                            break;
                        case 'Copay':
                            break;
                        case 'Coinsurance':
                            break;
                        case 'Deductible':
                            break;
                        case 'Interest Payment':
                            break;
                        case 'Late Payment Indicator':
                            break;
                        case 'Reopening Disposition':
                            break;
                        case 'Reason For Reopening':
                            break;
                        case 'Discount':
                            break;
                        case 'Initial Encounter':
                            break;
                        case 'OP Select':
                            break;
                        case 'Allow Timely':
                            break;
                        case 'Allow Duplicate':
                            break;
                        case 'Allow as IE':
                            break;
                        case 'Miscellaneous Override':
                            break;
                        case 'Override NewPlan':
                            break;
                        case 'Missing Eligibility Override':
                            break;
                        case 'Exclude Interest':
                            break;
                        case 'CAP PAY Provider Override':
                            break;
                        case 'Contracted Rate Override':
                            break;
                        case 'Procedure Override':
                            break;
                        case 'Eligibility (Grp/Subgrp) Override':
                            break;
                        case 'Override Units':
                            break;
                        case 'ClLine Notes':
                            break;
                        case 'Clinician':
                            document.getElementById('callTypeInput' + divNum + '-2-11').value += pasteDataARR[x].split('\t')[1];
                            break;
                        case 'Rendering NPI':
                            if (document.getElementById('callTypeInput' + divNum + '-2-11').value !== ''){
                                document.getElementById('callTypeInput' + divNum + '-2-11').value += ' - NPI:' + pasteDataARR[x].split('\t')[1];
                            }
                            break;
                        case 'BatchID':
                            break;
                        case 'Company ':
                            break;
                        case 'ClaimID':
                            break;
                        case 'EncounterID':
                            break;
                        case 'ClLineID':
                            document.getElementById('callTypeInput' + divNum + '-2-10').value = pasteDataARR[x].split('\t')[1];
                            break;
                        case 'RelatedID':
                            break;
                        case 'EDI RefNo':
                            break;
                        case 'WebClaim RefNo':
                            break;
                        case 'Username Entered':
                            break;
                        case 'UserName Edited':
                            break;
                        case 'Updated':
                            break;
                        case 'UserName Verified':
                            break;
                        case 'Verification Status':
                            break;
                        case 'Verification Date':
                            break;
                        case 'TOB':
                            break;
                        case 'DRGValue':
                            break;
                        case 'VendorDRG':
                            break;
                        case 'DRG Apllied':
                            break;
                        case 'Revenue Code':
                            break;
                        case 'LOC':
                            break;
                        case 'AdmissionType':
                            break;
                        case 'AdmissionSource':
                            break;
                        case 'DischargeStatus':
                            break;
                        case 'Place Of Service':
                            break;
                        case 'Prv Category':
                            break;
                        case 'Service Benefit Type':
                            break;
                        case 'Copay Benefit Type':
                            break;
                        case 'Group SubGroup':
                            break;
                        case 'Benefit Level':
                            break;
                        case 'Subcontract':
                            break;
                        case 'Benefit Count':
                            break;
                        case 'Proc Restrictions':
                            break;
                        case 'Other Properties':
                            break;
                        case 'ValueCode1a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount1a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode2a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount2a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode3a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount3a':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode1b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount1b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode2b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount2b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode3b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount3b':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode1c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount1c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', '; 
                            }
                            break;
                        case 'ValueCode2c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount2c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode3c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount3c':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode1d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount1d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            } 
                            break;
                        case 'ValueCode2d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount2d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueCode3d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'ValueAmount3d':
                            if (pasteDataARR[x].split('\t')[1] !== '') {
                                document.getElementById('callTypeInput' + divNum + '-2-12').value += pasteDataARR[x].split('\t')[1] + ', ';
                            }
                            break;
                        case 'AllowFix':
                            break;
                        default:
                            break;
                    }
                }
            }

            // Payments Check - non working remove if releasing this version 
            /* if (y === 2 && pasteDataARR[1] === 'Payments') {
            for (x = pasteDataARR.length; x >= 0; x--) {
                if (pasteDataARR[x] === '') {
                pasteDataARR.pop();
                }
            }
            var legend = pasteDataARR[2];
            var paymentPaste = pasteDataARR;
            for (x = 0; x < 3; x++) {
                paymentPaste.shift();
            }
            var rows = paymentPaste.length;
            var tempArr = [];
            for (x = 0; x < paymentPaste.length; x++) {
                var tempArr2 = paymentPaste[x].split('\t');
                for (z = 0; z < tempArr2.length; z++) {
                tempArr.push(tempArr2[z]);
                }
            }
            paymentPaste = tempArr;
            legend = legend.split('\t');
            var currRow = 0;
            
            for (z = 0; z < paymentPaste.length; z++) {
                console.log(legend[z], paymentPaste[z]);
                if (z % (paymentPaste.length / rows) === 0) {
                document.getElementById('callTypeInput' + divNum + '-1-2').value += 'adv ';
                currRow += 1;
                }
                switch (z % (paymentPaste.length / rows)) {
                
                }
            }
            }*/

            // Cleanup
            currBlock.getElementsByClassName('pasteBox')[0].value = '';
        
        }
    }
}

// toggles member satasfied field open and closed 
function msCheck() {
    if (document.getElementById('mbrSatisfied').checked === true) {
        document.getElementById('mbrNSatisfied').className = 'displayNone';
    } else {
        document.getElementById('mbrNSatisfied').className = 'displayBlock';
    }
    changeHeight();
}

// toggles between member and provider fields
function mpRadio() {
    if (document.getElementById('Member').checked === false) {
        document.getElementById('mbrLine0').className = 'displayNone';
        document.getElementById('mbrEnd').className = 'displayNone';
        document.getElementById('provInfoBlock').className = 'displayBlock';
    } else {
        document.getElementById('mbrLine0').className = 'tableRow';
        document.getElementById('mbrEnd').className = 'displayBlock';
        document.getElementById('provInfoBlock').className = 'displayNone';
    }
    changeHeight();
}

// goes through each selectBox and if it has a value changes the classname of the correct div to displayBlock setting all other children of selectbox classes as displayNone and callTypeHidden
function callTypeSel() {
    var divs = document.getElementsByClassName('callTypeDivs');
    for (i = 0; i < divs.length; i++) {
        var blocks = divs.item(i).getElementsByClassName('callTypeHidden');
        for(y = 0; y < blocks.length; y++) {
            blocks.item(y).className = 'displayNone callTypeHidden';
        }
        switch (divs.item(i).getElementsByTagName('select')[0].value) {
            case 'Authorization Status':
                divs.item(i).getElementsByClassName('callTypeHidden').item(0).className = 'displayBlock callTypeHidden';
                break;
            case 'Benefit/Eligibility Information':
                divs.item(i).getElementsByClassName('callTypeHidden').item(1).className = 'displayBlock callTypeHidden';
                break;
            case 'Claim Information':
                divs.item(i).getElementsByClassName('callTypeHidden').item(2).className = 'displayBlock callTypeHidden';
                break;
            case 'Crisis Call':
                divs.item(i).getElementsByClassName('callTypeHidden').item(3).className = 'displayBlock callTypeHidden';
                break;
            case 'Pre-Cert':
                divs.item(i).getElementsByClassName('callTypeHidden').item(4).className = 'displayBlock callTypeHidden';
                break;
            case 'Referral Request':
                divs.item(i).getElementsByClassName('callTypeHidden').item(5).className = 'displayBlock callTypeHidden';
                break;
            default:
                break;
        }
    }
    changeHeight();
}

// sets height of tDiv to standard height for the number of visible rows 
function changeHeight() {
    var currentHeightInt = 25.5 * ($('.tableRow:visible').length);
    var currentHeightStr = currentHeightInt.toString();
    currentHeightStr = currentHeightStr.concat('px');
    document.getElementById('tDiv').style.height = currentHeightStr;
}

// Clears all but first calltype and wipes clean 
function clearCallTypes() {
    while (callTypeArray.length !== 1) {
        document.getElementById("callTypeDiv" + callTypeArray[callTypeArray.length - 1]).remove();
        callTypeArray.pop();
    }
    document.getElementById("callTypeSelect" + callTypeArray[0]).value = '';
    var divs = document.getElementsByClassName('callTypeDivs');
    for (i = 0; i < divs.length; i++) {
        var blocks = divs.item(i).getElementsByClassName('callTypeHidden');
        for (y = 0; y < blocks.length; y++) {
            var inputs = blocks.item(y).getElementsByTagName('input');
            var selects = blocks.item(y).getElementsByTagName('select');
            for (x = 0; x < inputs.length; x++) {
                inputs.item(x).value = '';
                inputs.item(x).checked = false;
            }
            for (x = 0; x < selects.length; x++) {
                selects.item(x).value = '';
            }
        }
    }
    callTypeSel();
}

    //Sets vaules of all fields to empty or false
function clearAll() {
    document.getElementById('callerName').value = '';
    document.getElementById('callbackNumber').value = '';
    document.getElementById('callerRel').value = '';
    document.getElementById('provIDText').value = '';
    document.getElementById('provNamesText').value = '';
    document.getElementById('siteAddress').value = '';
    document.getElementById('mbrSatisfied').checked = false;
    document.getElementById('mbrNSatisfied').checked = false;
    document.getElementById('grievanceOffered').checked = false;
    document.getElementById('grievanceFiled').checked = false;
    document.getElementById('confirmedAddress').checked = false;
    document.getElementById('NPI').checked = false;
    document.getElementById('TIN').checked = false;
    document.getElementById('Member').checked = false;
    document.getElementById('Provider').checked = false;
    document.getElementById('provInfoBlock').className = 'displayNone';
    document.getElementById('mbrLine0').className = 'displayNone';
    document.getElementById('mbrEnd').className = 'displayNone';
    document.getElementById('mbrNSatisfied').className = 'displayBlock';
    clearCallTypes();
}

// shows copied successfully message for 3 sec and then hides it again 
async function copiedSuccessMessage(){
    document.getElementsByClassName('popup')[0].style.display = 'block';
    document.getElementsByClassName('popupText')[0].style.opacity = 1;
    document.getElementsByClassName('popupText')[0].style.visibility = 'visible';
    await sleep(3000);
    document.getElementsByClassName('popup')[0].style.display = 'none';
    document.getElementsByClassName('popupText')[0].style.opacity = 0;
    document.getElementsByClassName('popupText')[0].style.visibility = 'visible';
}

// Collects the information from the fields, combines them into an output string, and sends to the clipboard
function copyClipboard() {
    // collecting information from all the fields & generating output and error texts
    var CALLERNAME = document.getElementById('callerName').value;
    var CBNUM = document.getElementById('callbackNumber').value;
    var CALLERREL = document.getElementById('callerRel').value;
    var PROVID = document.getElementById('provIDText').value;
    var PROVNAME = document.getElementById('provNamesText').value;
    var SITEADD = document.getElementById('siteAddress').value;
    var CNFADD = document.getElementById('confirmedAddress').checked;
    var NPICHK = document.getElementById('NPI').checked;
    var TINCHK = document.getElementById('TIN').checked;
    var MBRCHK = document.getElementById('Member').checked;
    var PROVCHK = document.getElementById('Provider').checked;
    var MBRSAT = document.getElementById('mbrSatisfied').checked;
    var GOFF = document.getElementById('grievanceOffered').checked;
    var GFILED = document.getElementById('grievanceFiled').checked;
    var outputText = '';

    // combining all the data into a single string, any empty required fields are added to error text
    if (CALLERNAME !== '') { outputText = outputText.concat(CALLERNAME, ' / '); }
    if (CALLERREL !== '' && MBRCHK === true) { outputText = outputText.concat(CALLERREL, ' / '); }
    if (CBNUM !== '') { outputText = outputText.concat('CB# ', CBNUM, ' / '); }
    if (NPICHK === true && PROVCHK === true) { outputText = outputText.concat('NPI: ', PROVID); }
    if (TINCHK === true && PROVCHK === true) { outputText = outputText.concat('TIN: ', PROVID); }
    if (SITEADD !== '' && PROVCHK === true) { outputText = outputText.concat(' - ', SITEADD, ' / '); }
    if (CNFADD === true) { outputText = outputText.concat('Confirmed Address on file / '); }
    else if (outputText !== '') { outputText = outputText.concat('Unable to confirm address on file / '); }

    if (document.getElementById('callTypeSelect' + callTypeArray[0]).value !== '') {
        for (i = 0; i <= callTypeArray.length-1; i++) {
            outputText = outputText.concat(document.getElementById('callTypeSelect' + callTypeArray[i]).value + ' / ');
            switch (document.getElementById('callTypeSelect' + callTypeArray[i]).value) {
                default: 
                    break;
                case 'Authorization Status':
                    var y = 0;
                    // auth status
                    if (document.getElementById('callTypeSelect' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Advised authorization was ' + document.getElementById('callTypeSelect' + i + '-' + y + '-' + 0).value + ' / ';
                    }

                    // approved code 
                    if(document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Advised auth is for rev/proc code ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value + ' / ';
                    } 

                    // dates approved
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += 'Advised auth is for DOS ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }

                    // dates requested
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value !== '') {
                        outputText += 'Advised original request was for dates ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value + ' / ';
                    }

                    // units approved 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value !== '') {
                        outputText += 'Advised auth approved for ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value + ' units / ';
                    }

                    // units requested 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value !== '') {
                        outputText += 'Advised ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value + ' units were requested / ';
                    }

                    // units used 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value !== '') {
                        outputText += 'Advised ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value + ' units have been used / ';
                    }

                    // pa number 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 6).value !== '') {
                        outputText += 'Advised auth number is ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 6).value + ' / ';
                    }

                    // date approved 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 7).value !== '') {
                        outputText += 'Advised auth created on ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 7).value + ' / ';
                    }

                    // date modified 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 8).value !== '') {
                        outputText += 'Advised auth modified on ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 8).value + ' / ';
                    }

                    // other info 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 9).value !== '') {
                        outputText += 'Other information advised: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 9).value + ' / ';
                    }
                    break;

                case 'Benefit/Eligibility Information':
                    var y = 1;
                    // Member Eligible Dates
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Advised Member eligible for dates ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value + ' / ';
                    }

                    // Benefit information quoted
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }

                    // Copay information quoted
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value !== '') {
                        outputText += document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value + ' / ';
                    }

                    // utilization quoted
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value !== '') {
                        outputText += document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value + ' / ';
                    }

                    // other info
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value !== '') {
                        outputText += document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value + ' / ';
                    }
                    break;

                case 'Claim Information':
                    var y = 2;
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Claim Type: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value + ' / ';
                    }

                    // dos 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += 'DOS: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }

                    // proc code billed 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value !== '') {
                        outputText += 'Procedure code billed: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value + ' / ';
                    }

                    // recieved date 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value !== '') {
                        outputText += 'Advised claim recieved on ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value + ' / ';
                    }

                    // processed date 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value !== '') {
                        outputText += 'Advised claim processed on ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).value + ' / ';
                    }

                    // charged units 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value !== '') {
                        outputText += 'Advised charged for ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value + ' units / ';
                    }

                    // allowed units 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 6).value !== '') {
                        outputText += 'Advised allowed ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 6).value + ' units / ';
                    }

                    // charged amount 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 7).value !== '') {
                        outputText += 'Advised charged ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 7).value + ' / ';
                    }

                    // allowed units 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 8).value !== '') {
                        outputText += 'Advised allowed ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 8).value + ' / ';
                    }

                    // decision codes 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 9).value !== '') {
                        outputText += 'Advised decision codes: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 9).value + ' / ';
                    }

                    // claim number 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 10).value !== '') {
                        outputText += 'Advised claim number: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 10).value + ' / ';
                    }

                    // rendering provider 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 11).value !== '') {
                        outputText += 'Advised rendering provider: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 11).value + ' / ';
                    }

                    // value codes
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 12).value !== '') {
                        outputText += 'Advised value codes: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 12).value + ' / ';
                    }

                    // paid via 
                    if (document.getElementById('callTypeSelect' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Advised paid via: ' + document.getElementById('callTypeSelect' + i + '-' + y + '-' + 0).value + ' / ';
                        
                        // check number 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 13).value !== '') {
                        outputText += 'Advised check/transaction number is: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 13).value + ' / ';
                        }

                        // bulk amount 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 14).value !== '') {
                        outputText += 'Advised bulk amount: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 14).value + ' / ';
                        }

                        // payment clear date 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 15).value !== '') {
                        outputText += 'Advised payment cleared on: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 15).value + ' / ';
                        }

                        // member responsibility 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 16).value !== '') {
                        outputText += 'Advised member responsibility: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 16).value + ' / ';
                        }

                        // cob amount 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 17).value !== '') {
                        outputText += 'Advised COB payment: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 17).value + ' / ';
                        }
                    }

                    // processed correctly 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 18).checked === false) {
                        outputText += 'Claim was not processed correctly / ';
                    } else {
                        outputText += 'Claim was processed correctly / ';
                    }
                    
                    // CE called 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 19).checked === true) {
                        outputText += 'Claims Expert was called / ';

                        // CE spoken with
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 20).value !== '') {
                        outputText += 'Writer spoke with ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 20).value + ' / ';
                        }

                        // CE Advised 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 21).value !== '') {
                        outputText += 'Claims Expert advised: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 21).value + ' / ';
                        }

                        // Ticket Number 
                        if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 22).value !== '') {
                        outputText += 'Ticket Number: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 22).value + ' / ';
                        }
                    } else {
                        outputText += 'Claims Expert was not called / ';
                    }
                    
                    // other information advised 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 23).value !== '') {
                        outputText += 'Other information Advised: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 23).value + ' / ';
                    }
                    break;

                case 'Crisis Call':
                    var y = 3;
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).checked === true) {
                        outputText += 'Member states in crisis, warm transferred to clinician / ';
                    }
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += 'Other information given: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }
                    break;

                case 'Pre-Cert':
                    var y = 4;
                    // loc 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Level of care: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value + ' / ';
                    }

                    // start date 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += 'Start date requested: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }

                    // referred to 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value !== '') {
                        outputText += 'Referred to: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value + ' / ';
                    }

                    // other information given 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value !== '') {
                        outputText += 'Other information given: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value + ' / ';
                    }
                    break;

                case 'Referral Request':
                    y = 5;
                    // type of refs 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== '') {
                        outputText += 'Type of referrals requested: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value + ' / ';
                    }

                    // method of refs 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value !== '') {
                        outputText += 'Method of referrals requested: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 1).value + ' / ';
                    }

                    // addresss 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value !== '') {
                        outputText += 'Email/phyisical address: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 2).value + ' / ';
                    }

                    // refs given 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value !== '') {
                        outputText += 'Referrals given: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 3).value + ' / ';
                    }

                    // sent to ms 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 4).checked === true) {
                        outputText += 'Sent to Member Service / ';
                    } else if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 0).value !== ''){
                        outputText += 'Was not sent to Member Service / ';
                    }

                    // other info 
                    if (document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value !== '') {
                        outputText += 'Other information given: ' + document.getElementById('callTypeInput' + i + '-' + y + '-' + 5).value + ' / ';
                    }
                    break;
            }
        }
    }


    if (MBRCHK === true) {
        if (MBRSAT === true) { outputText = outputText.concat('Member satisfied'); }
        else if (outputText !== '') {
            outputText = outputText.concat('Member unsatisfied / ');
            if (GOFF === true) { outputText = outputText.concat('Grievance was offered / '); }
            else if (outputText !== '') { outputText = outputText.concat('Grievance was not offered / '); }
            if (GFILED === true) { outputText = outputText.concat('Grievance was filed'); }
            else if (outputText !== '') { outputText = outputText.concat('Grievance was not filed'); }
        }
    }

    if (outputText !== ''){
        // displays the output text box momentarily and fills it with the output text
        document.getElementById('oText').style.display = 'block';
        document.getElementById('oText').value = outputText;

        // select and copy the information in the output text box, then hides the information again
        var copyTextarea = document.getElementById('oText');
        copyTextarea.focus();
        copyTextarea.select();
        try { 
            document.execCommand('copy'); 
            copiedSuccessMessage();
        }
        catch (err) { 
            alert('Oops, unable to copy'); 
        }
        document.getElementById('oText').style.display = 'none';
        console.log(outputText)
    } else {
        alert('No data in form to copy. Please enter data and try again.');
    }   
}