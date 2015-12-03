

var biocider = require("biocider");

var divSearch = document.createElement('div');
divSearch.classList.add('userTextContainer');
divSearch.innerHTML = 'Bioinformatics';
document.body.appendChild(divSearch);

var bioCiderInstance = new biocider('snippetDiv',{'userTextClassContainer':'userTextContainer'},{},{});

bioCiderInstance.draw();

