var cnt, name;
var idValue, nodeInput, attrInput, attrValInput;
var standard; // 기준노드

function searchNode() {
	event.preventDefault();
	cnt = 0;
	name = "";
	idValue = $('#idValue').val();
	nodeInput = $('#nodeInput').val();
	attrInput = $('#attrInput').val();
	attrValInput = $('#attrValInput').val();
	if (idValue != "") name += "id ";
	if (nodeInput != "") name += "노드명 ";
	if (attrInput != "") name += "속성명 ";
	if (attrValInput != "") name += "속성값 ";
	
	standard = (idValue != "" && $('#' + idValue).length != 0) ? $('#' + idValue) : $('#wrap');
	cnt = counting(standard);
	result.innerHTML = name + " = " + cnt;
}

function checkNode(standard) {
	if (attrInput != "" || attrValInput != "") { /* 속성명 or 속성값 입력한 경우 */
		if (attrValInput != "" && standard.classList.length > 1) { /* class 속성값을 가지는 경우 */
			for (var j = 0; j < standard.classList.length; j++) {
				if (standard.classList[j] == attrValInput) {
					if (nodeInput == "" && attrInput == "") {
						++cnt;
					} else if (nodeInput == "" && attrInput == "class") {
						++cnt;
					} else if (attrInput == "" && standard.localName == nodeInput) {
						++cnt;
					} else if (attrInput == "class" && standard.localName == nodeInput) {
						++cnt;
					}
				}
			}
		}
		for (var i = 0; i < standard.attributes.length; i++) {
			if ((standard.attributes[i].nodeName == attrInput && standard.attributes[i].nodeValue == attrValInput)
					|| (standard.attributes[i].nodeName == attrInput && attrValInput == "")
					|| (standard.attributes[i].nodeValue == attrValInput && attrInput == "")) {
				if (idValue == "" && nodeInput == "") {
					++cnt;
				} else if (idValue == "" && standard.localName == nodeInput) {
					++cnt;
				} else if (nodeInput == "" && idValue == $('#' + idValue).attr('id')) {
					++cnt;
				} else if (standard.localName == nodeInput && idValue == $('#' + idValue).attr('id')) {
					++cnt;
				}
			}
		}
	} else { /* 속성명 or 속성값 입력하지 않은 경우 */
			if (nodeInput != "" && standard.localName == nodeInput) {
				if (idValue != "" && idValue == $('#' + idValue).attr('id')) { // id(o), 노드(o)
					++cnt;
				} else if(idValue == "") { // 노드(o)
					++cnt;
				}
			} else if (nodeInput == "" && idValue != "" && idValue == $(standard).attr('id')) { 
				++cnt; // id(o)
				}
		}
}	

function counting(standard) {
	checkNode(standard[0]);
	for(var i = 0; i < standard.find('*').length; i++) {
		checkNode(standard.find('*')[i]); // 함수호출(cnt증가조건 찾기)
	}
	return cnt;
}
	
$("#searchBtn2").on("click", function() {
	searchNode();
});