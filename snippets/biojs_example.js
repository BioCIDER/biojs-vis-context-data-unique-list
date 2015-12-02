

var app = require("BioCider");

var divSearch = document.createElement('div');
divSearch.innerHTML = 'Bioinformatics';
document.body.appendChild(divSearch);

var bioCiderInstance = new app.BioCider('snippetDiv',{},{},{});

bioCiderInstance.draw();

