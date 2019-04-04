/**
 * 
 * @author Cho, Hyeon-il , hicho@cyber-i.com
 * @modify 2010-05-17 For ajax/grid TableCell calulator Example
 */

	// CALULATOR PROCESS
	function processRow(transport, calulator ) {
		var jsonObj = transport.responseText.evalJSON();
	    var content = '';
	   
	    var key = new Array();
	    for (var i in jsonObj) {
	    	key.push(i);
		}

	    var tbody = document.getElementById(grid.tbl.id).tBodies[0];
	
		for(var i=0; i < jsonObj[key[0]].length; i++){	
			for(var k=0; k <calulator.length; k++){
				if(calulator[k][1] == 'checkbox'){
					if(jsonObj[key[0]][i][calulator[k][0]] == 1){
						jsonObj[key[0]][i][calulator[k][2]] = calulator[k][3];
						jsonObj[key[0]][i][calulator[k][0]] = '001';
					}
					else{
						jsonObj[key[0]][i][calulator[k][2]] = '0';
						jsonObj[key[0]][i][calulator[k][0]] = '000';
					}
				}
				else{
					var op1, op2;
	
					if(!isNaN(calulator[k][0])){ //숫자
						op1 = calulator[k][0];
					}	
					else{ //문자
						op1 = jsonObj[key[0]][i][calulator[k][0]];
					}
									
					if(!isNaN(calulator[k][2])){
						op2 = calulator[k][2];
					}
					else{
						op2 = jsonObj[key[0]][i][calulator[k][2]];
					}

					var result = eval(op1+ calulator[k][1] +op2);
					jsonObj[key[0]][i][calulator[k][3]] = result;
				}
			}
		}
		return jsonObj;
	}		
	// ROW INSERT
	function insertRows(jsonObj, cellOrder){
	    var key = new Array();
	    for (var i in jsonObj) {
	    	key.push(i);
		}
	
	    var tbody = document.getElementById(grid.tbl.id).tBodies[0];
		for(var i=0; i < jsonObj[key[0]].length; i++){	
			var newRow   = tbody.insertRow(i);
			for(var j=0; j< cellOrder.length; j++){
				var newCell = newRow.insertCell(j);
				if(jsonObj[key[0]][i][cellOrder[j]] == '000' && jsonObj[key[0]][i][cellOrder[j]]!= ' '){
					newCell.innerHTML = "<input type='checkbox' />";
				}
				else if(jsonObj[key[0]][i][cellOrder[j]] == '001' && jsonObj[key[0]][i][cellOrder[j]]!= ' '){
					newCell.innerHTML = "<input type='checkbox' checked='checked' />";
				}
				else{
					if(!isNaN(jsonObj[key[0]][i][cellOrder[j]])){
						newCell.innerHTML = comma(jsonObj[key[0]][i][cellOrder[j]]);
					}
					else{
						newCell.innerHTML = jsonObj[key[0]][i][cellOrder[j]];
					}
				}
			}
		}
	}
	// TOTAL ROW INSERT
	function cellTotal(jsonObj, cellOrder, totalArg, arg) {
		this.arg = arg;
	    if (!arg) this.arg = '';
	    
	    var position = this.arg.position;
	    if(position==null) position = 'top';

	    var tableId = this.arg.tableId;
	   	if(tableId==null) tableId = grid.tbl.id;

	   	var key = new Array();
	    for (var i in jsonObj) {
	    	key.push(i);
		}

		var obj = new Object();
		
		for(var x=0; x<totalArg.length; x++){
			obj[totalArg[x]] = 0;
		}
		
		for(var j=0; j<totalArg.length; j++){
			for(var i=0; i < jsonObj[key[0]].length; i++){
				obj[totalArg[j]] = eval( obj[totalArg[j]] + "+" + jsonObj[key[0]][i][totalArg[j]]);
			}
		}
		if(position)
		{
			var tbody = document.getElementById(tableId).tBodies[0];
			var newRow;
			
			if(position == 'bottom'){
				newRow = tbody.insertRow(jsonObj[key[0]].length);
			}
			else if(position == 'top'){
				newRow = tbody.insertRow(0);
			}

			for(var i=0; i<cellOrder.length; i++){
				var newCell = newRow.insertCell(i);
				for(var j=0; j<totalArg.length; j++){
					if(totalArg[j] == cellOrder[i]){
						newCell.innerHTML = comma(obj[totalArg[j]]);
					}
					else if(i == 1) {newCell.innerHTML = "합계";}
				}
			}			
		}
		
	}
	
	function comma(srcNumber)
	{
	    var txtNumber = srcNumber.toString();
	    if (!isNaN(txtNumber) && txtNumber != "")
	    {
	        var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
	        var arrNumber = txtNumber.split('.');
	        arrNumber[0] += '.';
	        do{
	            arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
	        }
	        while (rxSplit.test(arrNumber[0]));
	        if (arrNumber.length > 1)
	            return arrNumber.join('');
	        else
	            return arrNumber[0].split('.')[0];
	       }
	}