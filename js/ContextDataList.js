

/** 
 * Resource contextualisation viewer (http://www.europepmc.org).
 * 
 * @class ContextDataList
 *
 * @param {Object} options An object with the options for ContextDataList component.
 * 
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 * @option {string} [displayStyle= ContextDataList.FULL_STYLE, ContextDataList.COMMON_STYLE]
 *    Type of rows visualisation.
 * @option {string} [userTextClassContainer=Your own class name ]
 *    Class name that contains user's text to search.
 * @option {string} [userTextTagContainer=One stablished tag name, for example h1. It's not used if userTextClassContainer is defined ]
 *    Tag name that contains user's text to search.
 * @option {int} [numberResults=number ]
 *    Integer that restricts the results number that should be shown.
 */
function ContextDataList (options) {
	var consts = {
		//List of possible context data sources 
		SOURCE_ELIXIR_REGISTRY:"ESR",
		SOURCE_ELIXIR_TESS:"TSS",
		SOURCE_ELIXIR_EVENTS:"EEV",
		//style of visualization
		FULL_STYLE:"FULL_STYLE",
		COMMON_STYLE:"COMMON_STYLE",
		//max number of rows to retrieve from the server, whatever 'numberResults' can be
		MAX_ROWS:100,
		//Events 
		EVT_ON_RESULTS_LOADED: "onResultsLoaded",
		EVT_ON_REQUEST_ERROR: "onRequestError",
		//Different widget status
		LOADING: "LOADING",
		LOADED: "LOADED",
		ERROR: "ERROR"
		
	};
	
	
	var default_options_values = {        
	     displayStyle: ContextDataList.COMMON_STYLE
	};
	for(var key in options){
	     this[key] = options[key];
	}
	for(var key in default_options_values){
	     this[key] = default_options_values[key];
	}
	
	for(var key in consts){
	     this[key] = consts[key];
	}
	
	this.contextDataServer = "http://176.58.119.235:8983/solr/contextData";
	this.dataManager = new DataManager();
}


ContextDataList.prototype = {
	constructor: ContextDataList,
	// global current status
	currentTotalResults : null,
	currentStartResult : null,
	currentNumberLoadedResults : null,
	currentStatus : ContextDataList.LOADING,
	currentFilters : null,
	
	_onLoadedFunctions : [],
      
      
	/**
	 * Shows the contextualised data into the widget, updating the whole internal status of the widget.
	 */
	totalDrawContextDataList : function (){
		this.updateGlobalStatus(this.LOADING);
		this.drawContextDataList();
	},
	
	/**
	 * Retrieves the text to contextualise.
	 */
	getUserSearch : function() {
		var userText = '';
		var elementsContainer = null;
		if (this.userTextClassContainer != undefined && this.userTextClassContainer != null) {
			elementsContainer = document.getElementsByClassName(this.userTextClassContainer);
		}else{
			elementsContainer = document.getElementsByTagName(this.userTextTagContainer);
		}
		
		if (elementsContainer != null && elementsContainer.length > 0) {
			var myFirstElement = elementsContainer[0];
			userText = myFirstElement.innerText;
			if (userText == undefined || userText == null) {
				userText = myFirstElement.innerHTML;
			}
		}
		return userText;
	},
	
	/**
	 * Shows the contextualised data into the widget.
	 */
	drawContextDataList : function (){
		this.currentStatus = ContextDataList.LOADING;
		//this.updateGlobalStatus(this.LOADING);
		var userText = this.getUserSearch();
		var maxRows = this.getMaxRows();
		var newUrl = this._getNewUrl(userText, this.currentFilters, this.currentStartResult, maxRows);
		this.processDataFromUrl(newUrl);	
	},
	
	/**
	 * Retrieves the maximum number of results that can be shown into the widget.
	 */
	getMaxRows : function(){
		var maxRows = this.MAX_ROWS;
		if (this.numberResults != "undefined" && Number.isInteger(this.numberResults) ) {
			if (this.numberResults < this.MAX_ROWS) {
				maxRows = this.numberResults;
			}
		}
		return maxRows;
	},


	/**
	 * Create a url to the SolR database with all parameters generated from these arguments.
	 * fieldText {string} Text to search.
	 * filters {Array} Array of filters - Only results with one of these resource types will be get.
	 * start {integer} Position of the first result to retrieve.
	 * rowsNumber {integer} Indicates the maximum number of results that will be shown on the screen;
	 */
	_getNewUrl : function(fieldText, filters, start, rowsNumber){
		//console.log('_getNewUrl, fieldText: '+fieldText+', filters: '+filters+', start: '+start+', rowsNumber: '+rowsNumber);
		var count = 0;
		var url = "";
		
		var words = fieldText.split(" ");
		var searchPhrase = "";
		while (count < words.length) {
			searchPhrase += words[count];
			count++;
			if(count < words.length){searchPhrase += '+'}
		}
		var fq = null;
		if (filters !== "undefined" && filters!=null ) {
			if (filters instanceof Array && filters.length>0) {
				fq = "";
				var filterCount = 0;
				var filterChain = "";
				while (filterCount < filters.length) {
					filterChain += "'"+filters[filterCount]+"'";
					filterCount++;
					if(filterCount < filters.length){filterChain += ' OR '}
				}
				fq="resource_type:("+filterChain+")";
			}else{
				fq = "resource_type:undefined";
			}

		}
	      //  url = this.contextDataServer+"/select/?q="+urlText+"&rows="+rowsNumber+"&fl=start,title,notes,link&wt=json&json.wrf=?&sort=start%20asc";     
	       // url = this.contextDataServer+"/select?q=_text_:"+fieldText+"&rows="+rowsNumber+"&fl=start,title,notes,link&wt=json&json.wrf=?&sort=start%20asc";     
		
		//url = this.contextDataServer+"/select?q=title:"+fieldText+"&wt=json&indent=true&rows="+rowsNumber+"&fl=start,title,notes,link&sort=start%20asc";     

		//url = this.contextDataServer+"/select?defType=edismax&q="+searchPhrase+"&qf=title^20.0+field^10.0+notes^1.0&wt=json&rows="+rowsNumber+"&fl=start,title,notes,link&sort=start%20asc";
		url = this.contextDataServer+"/select?defType=edismax&q="+searchPhrase;
		if (fq!=null) {
			url = url+"&fq="+fq;
		}
		
		// qf
		url = url+"&qf=title^10.0+field^10.0+description^1.0";
		
		// start row
		if (start !== "undefined" && start!=null && Number.isInteger(start)) {
			url = url+"&start="+start;
			this.currentStartResult = start;
		}else{
			this.currentStartResult = 0;
		}
		
		// num rows
		if (rowsNumber !== "undefined" && rowsNumber!=null && Number.isInteger(rowsNumber)) {
			url = url+"&rows="+rowsNumber;
		}
				
		// wt
		url = url+"&wt=json";

		return url;
	},
	
	
	/**
	 * Makes an asynchronous request to the Contextualisation data server and process its reply.
	 * url {string} url - Uniform Resource Locator
	 */
	processDataFromUrl: function(url){
		//console.log('processDataFromUrl: '+url);
		var myContextDataList = this;
		reqwest({
			url: url ,
			type: 'json' ,
			method: 'post' ,
			contentType: 'application/json' ,
			crossOrigin: true,
			timeout: 1000 * 5,
			withCredentials: true,  // We will have to include more security in our Solr server
			error: function (err) {
				myContextDataList.processError(err);
				myContextDataList.updateGlobalStatus(myContextDataList.ERROR);
			} ,
			success: function (resp) {
				var contextualisedData = myContextDataList.processContextualisedData(resp);
				myContextDataList.drawContextualisedData(contextualisedData);
			}
		});
	},


	/**
	 * Manages some errors and process each result to be get in a proper way.
	 * data {Object} - The full data list to be processed and shown
	 * {Array} - Array with objects converted from their original JSON status
	 */
	processContextualisedData : function(data) {
		var myContextDataList = this;
		var contextualisedData = [];
		if(data.response != undefined){
			if(data.response.docs != undefined){
				this.currentTotalResults = data.response.numFound;
				data.response.docs.forEach(function(entry) {
					var typedData = myContextDataList.dataManager.getDataEntity(entry);
					contextualisedData.push(typedData);
				});
			}
			else {
				myContextDataList.processError("data.response.docs undefined");
				myContextDataList.changeCurrentStatus(myContextDataList.ERROR);
			}
		} else {
			myContextDataList.processError("data.response undefined");
			myContextDataList.changeCurrentStatus(myContextDataList.ERROR);
		}
			
		return contextualisedData;
	},
	
	
         
	/**
	 * Draw a entire list of contextualised resources
	 * contextualisedData {object Object} - All the data to be drawn into the widget.
	 */
	drawContextualisedData : function(contextualisedData){
		var target = document.getElementById(this.targetId);
		if (target == undefined || target == null){
			return;	
		}
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		
		var index = 0;
		var dataObject;
		var drawableObject;
		var oddRow = true;
		while(index < contextualisedData.length){
			if (index%2==0) {
				oddRow = false;
			}else{
				oddRow = true;
			}
			dataObject = contextualisedData[index];
			drawableObject = dataObject.getDrawableObject(this.displayStyle);
			drawableObject.classList.add('views-row');
			if(oddRow == true){
				drawableObject.classList.add("views-row-odd");
			}else{
				drawableObject.classList.add("views-row-even");
			}
			target.appendChild(drawableObject);
			index++;
		}
		
		this.currentNumberLoadedResults = contextualisedData.length;
		this.updateGlobalStatus(this.LOADED);
		/*
		console.log('currentTotalResults');
		console.log(this.currentTotalResults);
		console.log('currentStartResult');
		console.log(this.currentStartResult);
		console.log('currentNumberLoadedResults');
		console.log(this.currentNumberLoadedResults);
		console.log('currentFilters');
		console.log(this.currentFilters);
		*/
		
	},
	
	/**
	 * Updates, depending on the new status, internal variables of the component and, if
	 * new status is 'LOADED', executes the 'onLoaded' functions registered. 
	 * newStatus {string} newStatus - ContextDataList.LOADING or ContextDataList.ERROR or ContextDataList.LOADED 
	 */
	updateGlobalStatus : function(newStatus){
		// new status must be one of the posible status
		if (newStatus != this.LOADING && newStatus != this.ERROR && newStatus != this.LOADED ){
			return;
		}
		this.currentStatus = newStatus;
		
		if (this.currentStatus == this.LOADING){
			this.currentTotalResults = null;
			this.currentStartResult = null;
			this.currentNumberLoadedResults = null;
		}else if (this.currentStatus == this.ERROR){
			this.currentTotalResults = null;
			this.currentStartResult = null;
			this.currentNumberLoadedResults = null;
			// if new status is LOADED, here we cannot know anything about all these internal variables.
		}/*else if (this.currentStatus == this.LOADED){
			this.currentTotalResults = null;
			this.currentStartResult = null;
			this.currentNumberLoadedResults = null;
		}*/
		
		// Finally we execute registered 'onLoaded' functions
		if (this.currentStatus == this.LOADED || this.currentStatus == this.ERROR ){
			this.executeOnLoadedFunctions();
		}
	},
	
	/**
	 * Register new functions to be executed when status component is updated to 'LOADED'
	 * myContext {Object} myContext - Context in which myFunction should be execute. Usually its own object container.
	 * myContext {Object} myFunction - Function to be executed.
	 */
	registerOnLoadedFunction : function(myContext, myFunction){
		var onLoadedObject = {
			'myContext'	: myContext,
			'myFunction'	: myFunction
		};
		this._onLoadedFunctions.push(onLoadedObject);
	},
	
	
	/**
	 * Execute all registered 'onLoaded' functions
	 */
	executeOnLoadedFunctions : function(){
		var onLoadedFunctionObject = null;
		var onLoadedFunctionContext = null;
		var onLoadedFunction = null;
		for(var i=0;i<this._onLoadedFunctions.length;i++){
			onLoadedFunctionObject = this._onLoadedFunctions[i];
			onLoadedFunctionContext = onLoadedFunctionObject.myContext;
			onLoadedFunction = onLoadedFunctionObject.myFunction;
			// we execute the onLoadedFunction with its own context
			onLoadedFunction.call(onLoadedFunctionContext);
		}
	},
		
      
	/**
	 * Prints as an error to the console the message received. 
	 * error {string} error - String to be printed
	 */
	processError : function(error) {
	    console.log("ERROR:" + error);
	}
      

}



  
