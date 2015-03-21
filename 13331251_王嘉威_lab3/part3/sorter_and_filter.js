function makeAllTablesFilterableAndSortable() {
	var tables = document.getElementsByTagName("table");
	for (var i = 0; i < tables.length; ++i) {
		makeSortable(makeFilterable(tables[i]));
	}
}

function makeFilterable(table) {
	insertFilter(table);
    return table;
}

//添加过滤器元素
function insertFilter(table) {
	var filter = document.createElement('div'),
	    input = document.createElement('input'),
	    label = document.createElement('label');
	input.type = "text";
    input.oninput = function(table) {
    	return function(e) {
            var key = e.srcElement.value;
            filt(table, key);
    	};
    }(table);
    input.placeholder = "请输入过滤关键词";
	label.innerHTML = "文本过滤器: ";
	filter.appendChild(label);
	filter.appendChild(input);
	table.insertBefore(filter, table.childNodes[0]);
}

//匹配关键字并高亮
function filt(table, key) {
    var toDelete = [];
    recover(table);
    if (key != "") {
        for (var j = 0; j < table.rows.length; ++j) {
        	var cells = table.rows[j].cells;
        	if (cells[0].tagName == "TH") continue;
        	var isToDelete = 1;
            for (var i = 0; i < cells.length; ++i) {
            	var value = cells[i].innerHTML;
            	var pattern = new RegExp(key, "g");
            	if (pattern.test(value)) {
            		isToDelete = 0;
            		value = value.replace(pattern, "<span class='highLights'>" + key + "</span>");
            		cells[i].innerHTML = value;
            	}
            	var highLights = cells[i].getElementsByClassName("highLights");
            	for (var k = 0; k < highLights.length; ++k) {
            		highLights[k].style.fontSize = "150%";
            		highLights[k].style.color = "red";
            	}
            }
            if (isToDelete) toDelete.push(j);
        }
    }
    for (var i = 0; i < table.rows.length; ++i) {
    	if (toDelete.indexOf(i) >= 0) table.rows[i].style.display = "none";
    	else table.rows[i].style.display = "table-row";
    }
}

//下次匹配前把原先存在的高亮恢复
function recover(table) {
	for (var i = 0; i < table.rows.length; ++i) {
		var cells = table.rows[i].cells;
		for (var j = 0; j < cells.length; ++j) {
			value = cells[j].innerHTML;
            var reform = new RegExp("<span.+?>(.+?)<\/span>", "g");
            console.log(reform.test(value));
            cells[j].innerHTML = value.replace(reform, "$1");
		}
	}
}

function makeSortable(table) {
    var ths = table.tHead.rows[0].cells;
    for (var i = 0; i < ths.length; ++i) {
        ths[i].addEventListener("click", sortColumn);
        ths[i].addEventListener("click", changeClass);
    }
    return table;
}

function changeClass(e) {
    var tr = e.srcElement.parentNode,
        index = e.srcElement.cellIndex;
    for (var i = 0; i < tr.cells.length; ++i) {
        if (i != index) {
            tr.cells[i].className = "normal";
        }
    }
    if (e.srcElement.className == "normal" || e.srcElement.className == "down") e.srcElement.className = "up";
    else e.srcElement.className = "down";
}

function sortColumn(e) {
    var th = e.srcElement;
    var table = e.srcElement.parentNode.parentNode;
    if (table.tagName != "table") table = table.parentNode;
    var colNum = th.cellIndex;
    if (e.srcElement.className == "normal" || e.srcElement.className == "down")
        tableSort(table, colNum, 1);
    else tableSort(table, colNum, 0);
}

function tableSort(table, colNum, mode) {
    var rows = getRows(table);
    var compare = getFunc(colNum, mode);
    rows.sort(compare);
    var index = 0;
    for (var i = 0; i < table.rows.length; ++i) {
        if (table.rows[i].cells[0].tagName == "TH") continue;
        for (var j = 0; j < table.rows[i].cells.length; ++j) {
            table.rows[i].cells[j].innerHTML = rows[index][j];
        }
        ++index;
    }
}

function getFunc(colNum, mode) {
    if (mode) {
        return function(a, b) {
            return (a[colNum] < b[colNum]);
        }
    } else {
        return function(a, b) {
            return (a[colNum] > b[colNum]);
        }       
    }
}

function getRows(table) {
    var rows = [], obj = table.rows, index = 0;
    for (var i = 0; i < obj.length; ++i) {
        if (obj[i].cells[0].tagName == "TH") continue;
        rows[index] = [];
        for (var j = 0; j < obj[i].cells.length; ++j) {
            rows[index].push(obj[i].cells[j].innerHTML);
        }
        ++index;
    }
    return rows;
}

window.onload = makeAllTablesFilterableAndSortable;