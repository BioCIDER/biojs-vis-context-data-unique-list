

var biocider = require("biocider");

var divSearch = document.createElement('div');
divSearch.innerHTML = 'Bioinformatics';
document.body.appendChild(divSearch);

var bioCiderInstance = new biocider('snippetDiv',{},{},{});

bioCiderInstance.draw();

