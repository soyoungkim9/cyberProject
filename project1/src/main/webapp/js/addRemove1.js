var tbody = document.getElementById('content');

function add() {
	var time = document.getElementById('time').value;
	var price = document.getElementById('price').value;
	var netChange = document.getElementById('netChange').value;
	var sign = document.getElementById('sign').value;
	var accumulate = document.getElementById('accumulate').value;

	var tr, td, text;
	tr = document.createElement("tr");
	for (var i = 0; i < 5; i++) {
		td = document.createElement("td");
		switch (i) {
		case 0:
			text = document.createTextNode(time);
			break;
		case 1:
			text = document.createTextNode(price);
			break;
		case 2:
			text = document.createTextNode(netChange);
			break;
		case 3:
			text = document.createTextNode(sign);
			break;
		case 4:
			text = document.createTextNode(accumulate);
			break;
		}
		td.appendChild(text);
		tr.appendChild(td);

		if (tbody.children.length <= 7) {
			if (tbody.children.length == 0) {
				tbody.appendChild(tr);
			} else {
				tbody.insertBefore(tr, tbody.childNodes[0]);
			}
		} else {
			tbody.removeChild(tbody.lastElementChild);
			tbody.insertBefore(tr, tbody.childNodes[0]);
		}
	}
}

function remove() {
	if (tbody.children.length != 0)
		tbody.removeChild(tbody.lastElementChild);
}

document.getElementById('addBtn1').addEventListener('click', add);
document.getElementById('removeBtn1').addEventListener('click', remove);