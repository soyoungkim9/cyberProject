function add() {
	var output = nodeInput.value;
	if(output != "") {
		tb.innerHTML += output; 
	}
}

function remove() {
	if(tb.childElementCount == 0) {
		tb.innerHTML = "더 이상 삭제할 노드가 없습니다.";
	} else {
		tb.removeChild(tb.lastElementChild);
	}
}

document.getElementById('addBtn').addEventListener('click', add);
document.getElementById('removeBtn').addEventListener('click', remove);

