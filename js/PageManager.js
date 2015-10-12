

/** 
 * PageManager functionality.
 * 
 * @class PageManager
 *
 * @param {Object} options An object with the options for PageManager component.
 * 
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 */

function PageManager (contextDataList, options) {
	var consts = {
	};
	var default_options_values = {        
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
        this.contextDataList = contextDataList;
	this.contextDataList.currentStartResult = 0;
	this.contextDataList.registerOnLoadedFunction(this, this.build);
}


PageManager.prototype = {
	constructor: PageManager,
        
        
	/**
	 * Creates the buttons and draw them into the element with id 'targetId'
	 */        
	build : function (){
		var target = document.getElementById(this.targetId);
		if (target == undefined || target == null){
			console.log('target null!');
			return;	
		}
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		
		
		if (this.contextDataList.currentStatus == this.contextDataList.LOADING){
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
		}else if (this.contextDataList.currentStatus == this.contextDataList.ERROR){
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
		}else if (this.contextDataList.currentStatus == this.contextDataList.LOADED){
			var previousButton = this.createPreviousButton();
			target.appendChild(previousButton);
			
			var textSeparator = this.createTextSeparator();
			target.appendChild(textSeparator);
			
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
			
			var textSeparator = this.createTextSeparator();
			target.appendChild(textSeparator);
			
			var nextButton = this.createNextButton();
			target.appendChild(nextButton);
		}
		
	},
        
	/**
        * Function that creates a text separator.
        */  
	createTextSeparator : function(){
		var element = document.createElement('span');
		var text = document.createTextNode('|');
		element.appendChild(text);
		element.classList.add('pageManagerComponent');
		return element;
	},
        
        /**
        * Function that creates one button to get previous results
        */  
        createPreviousButton : function(){
            var button = document.createElement('a');
            var linkText = document.createTextNode('Previous');
            button.appendChild(linkText);
            button.title = 'Previous';
            button.href = "#";
            var myPageManager = this;
            button.onclick = function (){
		var maxRows = myPageManager.contextDataList.getMaxRows();
		var totalResults = myPageManager.contextDataList.currentTotalResults;
		var startResult = myPageManager.contextDataList.currentStartResult;
		var newStartResult = 0;
		if (startResult-maxRows<=0) {
			newStartResult = 0;	
		}else{
			newStartResult = startResult-maxRows;
		}
		myPageManager._changePage(newStartResult);
                return false;
            }
            return button;    
        },
	
	/**
        * Function that creates one button to get previous results
        */  
        createNextButton : function(){
            var button = document.createElement('a');
            var linkText = document.createTextNode('Next');
            button.appendChild(linkText);
            button.title = 'Next';
            button.href = "#";
            var myPageManager = this;
            button.onclick = function (){
		var maxRows = myPageManager.contextDataList.getMaxRows();
		var totalResults = myPageManager.contextDataList.currentTotalResults;
		var startResult = myPageManager.contextDataList.currentStartResult;
		var newStartResult = 0;
		if (startResult+maxRows<totalResults) {
			newStartResult = startResult+maxRows;	
		}else{
			newStartResult = startResult;
		}
		myPageManager._changePage(newStartResult);
                return false;
            }
            return button;    
        },
        
        /**
        * Internal function that executes the redrawn of the ContextDataList object having into account
        * previously chosen filters.
        * PageManager {Integer} startResult - number of the first result to be shown
        */  
        _changePage: function (startResult){
	    this.contextDataList.currentStartResult = startResult;
            this.contextDataList.drawContextDataList();
        },
	 
	/**
        * Function that returns a textual description of: first result shown, last results shown and
        * total number of results.
        */  
	getCurrentStatus : function(){
		var element = document.createElement('span');
		
		var startingResult = null;
		var endingResult = null;
		var totalResults = null;
		var resultText = "";
		
		if (this.contextDataList.currentStatus == this.contextDataList.LOADING){
			resultText = "Loading resources...";
		}else if (this.contextDataList.currentStatus == this.contextDataList.ERROR){
			resultText = "";
		}else{
			startingResult = this.contextDataList.currentStartResult;
			var currentTotalResults = this.contextDataList.currentTotalResults;
			var numRowsLoaded = this.contextDataList.currentNumberLoadedResults;
			
			endingResult = startingResult + numRowsLoaded;
			resultText = "Showing records "+startingResult+" to "+endingResult+" of a total of "+currentTotalResults
			
		}
		element.innerHTML = resultText;
		
		return element;
	}
        
        
}
      
      
  