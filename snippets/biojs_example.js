

var app = require("biocider");

var divSearch = document.createElement('div');
divSearch.innerHTML = 'Bioinformatics';
document.body.appendChild(divSearch);

var bioCiderInstance = new app.biocider('snippetDiv',{},{},{});

bioCiderInstance.draw();

