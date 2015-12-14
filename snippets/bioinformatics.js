

var biocider = require("biocider");


var divTableContainer = document.createElement('div');
divTableContainer.style.display = "table";

var divTableRowContainer1 = document.createElement('div');
divTableRowContainer1.style.display = "table-row";


var divTable1 = document.createElement('div');
divTable1.style.display = "table";

var divTableRow1 = document.createElement('div');
divTableRow1.style.display = "table-row";
divTableRow1.style.width = "100px";

var divTableCell11 = document.createElement('div');
divTableCell11.style.display = "table-cell";
divTableCell11.innerHTML = "Title: ";

var divSearch = document.createElement('div');
divSearch.style.display = "table-cell";
divSearch.classList.add('userTextContainer');
divSearch.innerHTML = 'Bioinformatics';

divTableRow1.appendChild(divTableCell11);
divTableRow1.appendChild(divSearch);
divTable1.appendChild(divTableRow1);
divTableRowContainer1.appendChild(divTable1);



var divTableRowContainer2 = document.createElement('div');
divTableRowContainer2.style.display = "table-row";


var divTable2 = document.createElement('div');
divTable2.style.display = "table";

var divTableRow2 = document.createElement('div');
divTableRow2.style.display = "table-row";
divTableRow2.id = "snippetDiv";

divTable2.appendChild(divTableRow2);
divTableRowContainer2.appendChild(divTable2);
divTableContainer.appendChild(divTableRowContainer1);
divTableContainer.appendChild(divTableRowContainer2);


document.body.appendChild(divTableContainer);


var bioCiderInstance = new biocider('snippetDiv',{'userTextClassContainer':'userTextContainer'},{},{});

bioCiderInstance.draw();

