$(function() {
	$("#page").load("../html/detailPage.html #wrap");
	$("#page").hide();
});

var cnt, name;
var idValue, nodeInput, attrInput, attrValInput;
var idSearch; // 기준노드

function searchNode() {
	event.preventDefault();
	cnt = 0;
	name = "";
	idValue = document.getElementById('idValue').value;
	nodeInput = document.getElementById('nodeInput').value;
	attrInput = document.getElementById('attrInput').value;
	attrValInput = document.getElementById('attrValInput').value;
	idSearch = document.getElementById(idValue);
	if (idValue != "") name += "id ";
	if (nodeInput != "") name += "노드명 ";
	if (attrInput != "") name += "속성명 ";
	if (attrValInput != "") name += "속성값 ";

	var res = name + cnt;
	if (idValue != "" && idSearch == null) {
		res = name + cnt;
	} else if (idValue != "" && idSearch != null && nodeInput == "" && attrInput == "" && attrValInput == "") {
		res = name + " = " + (++cnt);
	} else if (idValue != "" || nodeInput != "" || attrInput != "" || attrValInput != "") {
		var node = (idValue != "") ? idSearch : document.getElementById('wrap');
		checkNode(node);
		res = counting(node);
	}
	result.innerHTML = res;
}

function checkNode(node) {
	if (attrInput != "" || attrValInput != "") { /* 속성명 or 속성값 입력한 경우 */
		if (attrValInput != "" && node.classList.length > 1) { /* class 속성값을 가지는 경우 */
			for (var j = 0; j < node.classList.length; j++) {
				if (node.classList[j] == attrValInput) {
					if (nodeInput == "" && attrInput == "") {
						++cnt;
					} else if (nodeInput == "" && attrInput == "class") {
						++cnt;
					} else if (attrInput == "" && node.localName == nodeInput) {
						++cnt;
					} else if (attrInput == "class" && node.localName == nodeInput) {
						++cnt;
					}
				}
			}
		}
		for (var i = 0; i < node.attributes.length; i++) {
			if ((node.attributes[i].nodeName == attrInput && node.attributes[i].nodeValue == attrValInput)
					|| (node.attributes[i].nodeName == attrInput && attrValInput == "")
					|| (node.attributes[i].nodeValue == attrValInput && attrInput == "")) {
				if (idValue == "" && nodeInput == "") {
					++cnt;
				} else if (idValue == "" && node.localName == nodeInput) {
					++cnt;
				} else if (nodeInput == "" && idValue == idSearch.id) {
					++cnt;
				} else if (node.localName == nodeInput && idValue == idSearch.id) {
					++cnt;
				}
			}
		}
	} else { /* 속성명 or 속성값 입력하지 않은 경우 */
		if (nodeInput != "" && node.localName == nodeInput) {
			if (idValue != "" && idValue == idSearch.id) { // id(o), 노드(o)
				++cnt;
			} else { // 노드(o)
				++cnt;
			}
		}
	}
}

function counting(node) {
	for (var i = 0; i < node.children.length; i++) {
		checkNode(node.children[i]); // 함수호출(cnt증가조건 찾기)
		counting(node.children[i]); // 재귀적으로 자식노드 탐색
	}
	return name + " = " + cnt;
}

document.getElementById('searchBtn1').addEventListener('click', searchNode);