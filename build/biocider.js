require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var constants = require("./constants.js");

/** 
 * Buttons' filtering constructor.
 * 
 * @class ButtonsManager
 *
 * @param {ContextDataList Object} Reference to ContextDataList object in order to manage its filters.
 * @param {Array} options An object with the options for ButtonsManager component.
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 * @option {boolean} [helpText]
 *    True if you want to show a help text over the buttons.
 * @option {string} [buttonsStyle='SQUARED_3D' , 'ROUND_FLAT' or 'ICONS_ONLY'. ICONS_ONLY by default.]
 *    Identifier of the buttons visualisation type.
 * @option {boolean} [pressedUnderlines]
 *    True if you want to show underlines when you press a button.
 */
var ButtonsManager = function(contextDataList, options) {
	var default_options_values = {
		helpText: true,
		buttonsStyle: constants.ButtonsManager_SQUARED_3D,
		pressedUnderlines: false
	};
	for(var key in default_options_values){
		this[key] = default_options_values[key];	
	}
	for(var key in options){
		this[key] = options[key];
	}
        this.contextDataList = contextDataList;
	this.buttonsBasicData = [];
	// BASIC BUTTON'S DATA: LABEL, INTERNAL CLASS NAME, INTERNAL NAME AND HELP TEXT
	this.buttonsBasicData.push(['Database','database','database','Databases'],
				   ['Events','events','Event','Events'],
				   ['Tools','tools','Tool','Tools'],
				   ['Training materials','training_material','Training Material','Training materials']
	);
	this.contextDataList.registerOnLoadedFunction(this, this.updateButtonsStatus);
}

/**
 *      ButtonsManager class. Represents a set of filters selectable via buttons by users.
 * 
 *      @class ButtonsManager
 *      
 */
ButtonsManager.prototype = {
	constructor: ButtonsManager,
        buttons : [],
	

        /**
         * Update buttons status having into account ContextDataList status
         */        
	updateButtonsStatus : function (){
		
		// We draw slightly softer buttons of resource types without any results
		if (this.contextDataList.numInitialResultsByResourceType != null) {
			for(var property in this.contextDataList.numInitialResultsByResourceType){
				if (this.contextDataList.numInitialResultsByResourceType.hasOwnProperty(property)) {
					var propertyCount = this.contextDataList.numInitialResultsByResourceType[property];
					var myButton = document.getElementById(property);
					this.setButtonAspectAsResults(myButton,propertyCount );
				}
			}
				
		}
	},
        
      
        /**
         * Creates buttons and draw them into the element with id 'targetId'
         */        
	buildButtons : function (){
		var target = document.getElementById(this.targetId);
		if (target == undefined || target == null){
			return;	
		}
		
		if (this.helpText){
			var helpTextContainer = this.createButtonsHelpText();
			target.appendChild(helpTextContainer);
		}
		var rowContainer = document.createElement('div');
		rowContainer.classList.add('buttons_row_container');
		
		if (this.buttonsBasicData.length>0) {
			this.contextDataList.totalFilters = [];
		}
		
		for(var i=0;i<this.buttonsBasicData.length;i++){
			var buttonData = this.buttonsBasicData[i];
			var myButton = null;
			if (constants.ButtonsManager_ROUND_FLAT == this.buttonsStyle) {
				myButton = this.createRoundFlatButton(buttonData[0],buttonData[1],buttonData[2]);
			}else if (constants.ButtonsManager_ICONS_ONLY == this.buttonsStyle){
				myButton = this.createIconOnlyButton(buttonData[0],buttonData[1],buttonData[2]);
			}else{
				myButton = this.createSquared3DdButton(buttonData[0],buttonData[1],buttonData[2]);
			}
			var myButtonContainer = document.createElement('div');
			myButtonContainer.classList.add('buttons_cell_container');
			myButtonContainer.appendChild(myButton);
			rowContainer.appendChild(myButtonContainer);

			this.buttons.push(myButton);
			this.contextDataList.totalFilters.push(buttonData[2]);
		}
		
                target.appendChild(rowContainer);
		
		if (this.pressedUnderlines){
			var underlinesContainer = this.createButtonsUnderlineContainer();
			target.appendChild(underlinesContainer);
		}
		
                this.contextDataList.currentFilters = this.getPresentFiltersByButtons();
	},
        
        /**
        * Creates pressed buttons and draw them into the element with id 'targetId'
        */  
        buildPressedButtons : function (){
            this.buildButtons();
            for(var i=0;i<this.buttons.length;i++){
                if (!this.isButtonPressed(this.buttons[i])){
                    this.showButtonClick(this.buttons[i]);
                }
            }
            this.contextDataList.currentFilters = this.getPresentFiltersByButtons();

        },
	
	
        /**
        * Function that creates one button with 'ROUND_FLAT' aspect.
        * @param label {String} - Title to be used into the ANCHOR element.
        * @param internalClass {String} - Specific className to be used into the ANCHOR element.
        * @param internalName {String} - Name to be used into the ANCHOR element. It should be a filter name.
        */  
        createRoundFlatButton : function(label, internalClass, internalName){
            var button = document.createElement('a');
            var linkText = document.createTextNode(label);
            button.appendChild(linkText);
            button.title = label;
            button.name = internalName;
	    button.id = internalName;
            button.href = "#";
            var myButtonsManager = this;
            button.onclick = function (){
                myButtonsManager.filter(this);
                return false;
            }
            button.classList.add('button');
	    button.classList.add('round_flat');
            button.classList.add('unpressed');
            button.classList.add(internalClass);
            return button;    
        },
        
        /**
        * Function that creates one button with 'SQUARED_3D' aspect.
        * @param label {String} - Title to be used into the ANCHOR element.
        * @param internalClass {String} - Specific className to be used into the ANCHOR element.
        * @param internalName {String} - Name to be used into the ANCHOR element. It should be a filter name.
        */  
        createSquared3DdButton : function(label, internalClass, internalName){
            var button = document.createElement('a');
            var linkText = document.createTextNode(label);
            button.appendChild(linkText);
            button.title = label;
            button.name = internalName;
	    button.id = internalName;
            button.href = "#";
            var myButtonsManager = this;
            button.onclick = function (){
                myButtonsManager.filter(this);
                return false;
            }
            button.classList.add('button');
	    button.classList.add('squared_3d');
            button.classList.add('unpressed');
            button.classList.add(internalClass);
            return button;    
        },
	
	/**
        * Function that creates one button with 'ICON_ONLY' aspect.
        * @param label {String} - Title to be used into the ANCHOR element.
        * @param internalClass {String} - Specific className to be used into the ANCHOR element.
        * @param internalName {String} - Name to be used into the ANCHOR element. It should be a filter name.
        */  
        createIconOnlyButton : function(label, internalClass, internalName){
		var button = document.createElement('a');
		var linkText = document.createTextNode(label);
		button.appendChild(linkText);
		button.title = label;
		button.name = internalName;
		button.id = internalName;
		button.href = "#";
		var myButtonsManager = this;
		button.onclick = function (){
		    myButtonsManager.filter(this);
		    return false;
		}
		button.classList.add('button');
		button.classList.add('icons_only');
		button.classList.add('unpressed');
		button.classList.add(internalClass);
		return button;    
        },
        
        /**
        * Function that changes the status of the button and executes the redrawn of the ContextDataList
        * object having into account chosen filters.
        * @param myButton {Button} - Button to be pressed/unpressed.
        */  
        filter: function (myButton){
            this.showButtonClick(myButton);
            this.contextDataList.currentFilters = this.getPresentFiltersByButtons();
            this.contextDataList.totalDrawContextDataList();
        },
	
	/**
        * Function that changes the aspect of one button depending on if it has any associated result or not.
        * @param myButton {Button} - Button to be modified.
        * @param numberResults {Integer} - Number of occurrences associated to the button.
        */ 
        setButtonAspectAsResults: function (myButton, numberResults){
		if (myButton == undefined || myButton == null) {
			return;	    
		}
		var emptyTitleSuffix = ' (no results)';
		if (numberResults == 0) {
			myButton.classList.add('empty');
			if (myButton.title.indexOf(emptyTitleSuffix)==-1) {
				myButton.title = myButton.title + emptyTitleSuffix;
			}
			
		}else{
			myButton.classList.remove('empty');
			if (myButton.title.indexOf(emptyTitleSuffix)>-1) {
				myButton.title.replace(emptyTitleSuffix,'');
			}
		}
        },
        
        /**
        * Function that changes the aspect of one button from pressed to unpressed, or vice versa.
        * @param myButton {Button} - Button to be pressed/unpressed.
        */ 
        showButtonClick: function (myButton){
		myButton.classList.toggle("unpressed");
		myButton.classList.toggle("pressed");
		if (this.pressedUnderlines) {
			var underline = document.getElementById(myButton.id+"_underline");
			if (this.isButtonPressed(myButton)) {
				underline.style.display = 'block';
			}else{
				underline.style.display = 'none';
			}
		}
		
		
        },
        
        /**
        * Function that returns if the button passed as argument is pressed or not.
        * @param myButton {Button} - Button to check its status.
        * {Boolean} - Returns if myButton is pressed or not.
        */
        isButtonPressed: function (myButton){
            if (!myButton.classList.contains("pressed")) {
                return false;
            }else return true;
        },
        
        /**
        * Function that returns active filters related with pressed buttons.
        * {Array} - Current applicable filters.
        */
        getPresentFiltersByButtons : function(){
            var pressedButtons = this.getPressedButtons();
            var filters = [];
            for(var i=0;i<pressedButtons.length;i++){
                filters.push(pressedButtons[i].name);
            }
            return filters;       
        },
        
        /**
        * Function that returns all pressed buttons.
        * {Array} - Current pressed buttons.
        */
        getPressedButtons : function(){
            var pressedButtons = [];
            for(var i=0;i<this.buttons.length;i++){
                if (this.isButtonPressed(this.buttons[i])){
                    pressedButtons.push(this.buttons[i]);
                }
            }
            return pressedButtons;
        },
	
	/**
        * Function that returns a paragraph element with specific text about each resource type button
	*   {HTML Object} - div element with help related to each resource type buttons.
        */
	createButtonsHelpText : function(){
		var help_container = document.createElement('div');
		help_container.classList.add('buttons_row_container');
		
		for(var i=0;i<this.buttonsBasicData.length;i++){
			var buttonData = this.buttonsBasicData[i];
			
			var myText = document.createElement('span');
			myText.innerHTML = buttonData[3];
			myText.classList.add('button_help');
			help_container.appendChild(myText);	
		}
		
		return help_container;
	},
	
	
	/**
        * Function that returns a paragraph element with specific text about each resource type button
	*   {HTML Object} - div element with help related to each resource type buttons.
        */
	createButtonsUnderlineContainer : function(){
		var underlines_container = document.createElement('div');
		underlines_container.classList.add('buttons_row_container');
		
		for(var i=0;i<this.buttonsBasicData.length;i++){
			var buttonData = this.buttonsBasicData[i];
			var myText = document.createElement('span');
			myText.id = buttonData[2]+"_underline";
			myText.classList.add('button_underline');
			
			var myUnderlineContainer = document.createElement('div');
			myUnderlineContainer.classList.add('buttons_underline_cell_container');
			myUnderlineContainer.appendChild(myText);
			underlines_container.appendChild(myUnderlineContainer);
		}
		
		return underlines_container;
	}
}

// STATIC ATTRIBUTES
/*
var CONSTS = {
	//style of visualization
	SQUARED_3D:"SQUARED_3D",
	ROUND_FLAT:"ROUND_FLAT",
	ICONS_ONLY:"ICONS_ONLY"
};

for(var key in CONSTS){
     ButtonsManager[key] = CONSTS[key];
}
*/    
      
module.exports = ButtonsManager;
      
  
},{"./constants.js":9}],2:[function(require,module,exports){
var ContextDataList = require("./ContextDataList.js");
var constants = require("./constants.js");

/**
 *          CommonData constructor
 *          jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *          @param {Object} options An object with the options for this structure.
 *                      @option {string} [currentDomain='url']
 *                      URL with the user's page domain.
 */
var CommonData = function(jsonData, options) {
            
            var default_options_values = {
                        currentDomain: null
            };
            for(var key in default_options_values){
                        this[key] = default_options_values[key];
            }
            for(var key in options){
                        this[key] = options[key];
            }
            
            this.jsonData = jsonData;
};

/**
 *          Common parent class that should be inherited by all specific classes to be managed on this component.
 */
CommonData.prototype = {
            constructor: CommonData,
            SOURCE_FIELD                : "source",
            RESOURCE_TYPE_FIELD         : "resource_type",
            TITLE_FIELD                 : "title",
            TOPIC_FIELD                 : "field",
            DESCRIPTION_FIELD           : "description",
            LINK_FIELD                  : "link",
            
            // retrieves the proper class name based on the real resource type
            mappingResourceTypeClasses : {
                        'Tool'                  :'tools',
                        'Workflow'              :'workflow',
                        'Database'              :'database',
                        'Training Material'     :'training_material',
                        'Event'                 :'events'
            },
     
            /**         UTILITY FUNCTIONS TO GET FIELD'S VALUE                    */
     
            /**
             *          Auxiliar function to get easily any kind of data present in the internal
             *          data structure of this entity.
             *          @param fieldName {String} - Name of the field to be returned.
             */
            getParameterisedValue : function(fieldName){
                        if (this.jsonData !== undefined && this.jsonData !== null){
                            return this.jsonData[fieldName];   
                        }else return null;
            },
            
            // mandatory fields
            /**
             *          Returns source field value of this entity.
             *          {String} - String literal with the source value of this entity.
             */
            getSourceValue : function(){
                        return this.getParameterisedValue(this.SOURCE_FIELD);      
            },
            /**
             *          Returns all resource types present in this entity.
             *          {Array} - Array of strings with resource typers related with this entity.
             */
            getResourceTypeValues : function(){
                        return this.getParameterisedValue(this.RESOURCE_TYPE_FIELD);      
            },
            /**
             *          Sometimes can be duplicate resource types.
             *          This function only returns unique resource types.
             *          {Array} - Array of strings with unique resource typers related with this entity.
             */
            getUniqueResourceTypeValues : function(){
                        var resourceTypes = this.getResourceTypeValues();
                        var uniqueResourceTypes = [];
                        for(var i=0;i<resourceTypes.length;i++){
                                    if (! (uniqueResourceTypes.indexOf(resourceTypes[i]) > -1)){
                                                uniqueResourceTypes.push(resourceTypes[i]);   
                                    }
                        }
                        return uniqueResourceTypes;
            },
            /**
             *          Returns the title of this entity.
             *          {String} - Title of this entity.
             */
            getTitleValue : function(){
                        return this.getParameterisedValue(this.TITLE_FIELD);      
            },
            /**
             *          Returns all topic of this entity.
             *          {Array} - Topics related with this entity.
             */
            getTopicValue : function(){
                        return this.getParameterisedValue(this.TOPIC_FIELD);      
            },
            
            // optional fields
            /**
             *          Returns the description associated with this entity (if exists).
             *          {String} - Textual description.
             */
            getDescriptionValue : function(){
                        return this.getParameterisedValue(this.DESCRIPTION_FIELD);      
            },
            
            /**
             *          Returns the URL to access to the original source of this entity (if exists).
             *          {String} - Source's URL.
             */
            getLinkValue : function(){
                        return this.getParameterisedValue(this.LINK_FIELD);      
            },
      
      
            /**         STANDARD FUNCTIONS TO MANAGE HTML BEHAVIOUR OF THIS ENTITY     */
      
            /**
             *          Returns one kind of CommonData transformed into a HTML component in a way that
             *          depends on what kind of style you want it will be drawn.
             *          @param displayStyle {String} - One drawing style. Currently ContextDataList.COMMON_STYLE or ContextDataList.FULL_STYLE.
             *          {Object} - Array with HTML structured converted from this entity's original JSON status.
             */
            getDrawableObjectByStyle : function(displayStyle){
                        if (displayStyle == constants.ContextDataList_COMMON_STYLE){
                                    return this.getCommonDrawableObject();
                        }else if (displayStyle == constants.ContextDataList_FULL_STYLE){
                                    return this.getFullDrawableObject();
                        }else return null;
            },
            
            /**
             *          Returns one improved way of representing any CommonData transformed into a HTML component.
             *          It has to be extended by each children object; the default implementation calls to
             *          getCommonDrawableObject.
             *          {Object} - Array with HTML structured converted from this entity's original JSON status.
             */
            getFullDrawableObject : function(){
                        return this.getCommonDrawableObject();
            },
            
            /**
             *          Returns one standard way of representing any CommonData transformed into a HTML component.
             *          {Object} - Array with HTML structured converted from this entity's original JSON status.
             */
            getCommonDrawableObject : function(){
                        var title = this.getLabelTitle();
                        var topics = this.getLabelTopics();
                        var resourceTypes = this.getImageResourceTypes();
                        
                        var mainContainer = document.createElement('div');
                        mainContainer.classList.add("context_data_container");
                        var trContainer = document.createElement('div');
                        trContainer.classList.add("context_data_container_row");
                        var leftContainer = document.createElement('div');
                        leftContainer.classList.add("context_data_container_col_left");
                        var rightContainer = document.createElement('div');
                        rightContainer.classList.add("context_data_container_col_right");
                        
                        leftContainer.appendChild(title);
                        leftContainer.appendChild(topics);
                        rightContainer.appendChild(resourceTypes);
                        
                        trContainer.appendChild(leftContainer);
                        trContainer.appendChild(rightContainer);
                        mainContainer.appendChild(trContainer);
                        //listElement.appendChild(mainContainer);
                        //return listElement;
                        return mainContainer;
            },
      
            /**
             *          Returns one standard way of representing 'title' data transformed into a HTML component.
             *          {HTML Object} - ANCHOR element with 'title' information linking to the original source.
             */
            getLabelTitle: function(){
                        var element = document.createElement('a');
                        element.classList.add("context_data_title");
                        if (!this.isLocalUrl(this.getLinkValue())) {
                               element.classList.add("external_link");
                               element.title = 'External link';     
                        }
                        element.setAttribute('href',this.getLinkValue());
                        element.innerHTML = this.getTitleValue();
                        // Sometimes description have long values and it seems more like errors!
                        /*var description = this.getDescriptionValue();
                        if (description != undefined && description != null) {
                                    element.title = description;
                        }*/
                        element.setAttribute('target','_blank');
                        return element;
            },
            
            /**
             *          Returns one standard way of representing 'topics' data transformed into a HTML component.
             *          {HTML Object} - DIV element with all 'topics' information related to this entity.
             */
            getLabelTopics: function(){
                        var element = document.createElement('div');
                        element.classList.add("context_data_topics");
                        var rawTopicValue = this.getTopicValue();
                        var finalString = '';
                        for(var i=0;i<rawTopicValue.length;i++){
                                    finalString = finalString + rawTopicValue[i];
                                    if ((i+1) < rawTopicValue.length) {
					finalString += ', ';
                                    }
                        }           
                        element.innerHTML = finalString; 
                        return element;
            },
            
            /**
             *          Returns a standard textual way of representing 'resource type' data transformed into a HTML component.
             *          {HTML Object} - SPAN element with all 'resource type' information related to this entity.
             */
            getLabelResourceTypes: function(){
                        var element = document.createElement('span');
                        element.innerHTML = this.getUniqueResourceTypeValues();
                        return element;
            },
            
            /**
             *          Returns a standard way (as a set of images) of representing 'resource type'
             *          data transformed into a HTML component.
             *          {HTML Object} - SPAN element with all 'resource type' information related to this entity
             *          represented as set of images.
             */
            getImageResourceTypes: function(){
                        var container = document.createElement('span');
                        
                        var resourceTypes = this.getUniqueResourceTypeValues();
                        for(var i=0;i<resourceTypes.length;i++){
                                    var resource_type = resourceTypes[i];
                                    var element = document.createElement('span');
                                    element.title = resource_type;
                                    // flat gray style
                                    element.classList.add('flat_resource_type');
                                    element.classList.add('gray');
                                    // round style
                                    //element.classList.add('resource_type');
                                    //element.classList.add('circle');
                                    element.classList.add(this.mappingResourceTypeClasses[resource_type]);
                                    container.appendChild(element);
                        }
                        return container;
            },
            
            
            /**
             *          Returns a div object with a short description that can be expanded to show a longer description.
             *          @param shortText {String} - Text link to hide or expand the long text.
             *          @param longText {String, HTML ELEMENT or Array of both} - Long description or HTML field with a long description of the record.
             *          @param longTextClasses {Array} - Classes to modify the aspect of the expandable text.
             *          {HTML Object} - DIV element with both short and field descriptions.
             */
            getExpandableText: function(shortText, longText, longTextClasses){
                        var container = document.createElement('div');
                        container.classList.add('expandable_div');
                        var randomIntNumber = Math.floor(Math.random() * (100000 - 0)) + 0;
                        
                        // Creates the link to hide and show the description
                        var link = document.createElement("a");
                        link.classList.add("expandable_div_title");
                        link.setAttribute('href',"#");
                        link.setAttribute('id',"expandable_div_title_"+randomIntNumber);
                        var toexpandsignal = "[+]";
                        var tohidesignal = "[-]";
                        link.innerHTML = shortText+" "+toexpandsignal;
                        link.title = "Click here to see more information";
                        
                        link.onclick = function (){
                            var expandableTitle = document.getElementById('expandable_div_title_'+randomIntNumber);
                            var expandableDiv = document.getElementById('expandable_div_internaldiv_'+randomIntNumber);
                            if (expandableDiv.style.display == 'none') {
                                    expandableDiv.style.display = 'block';
                                    expandableTitle.innerHTML =expandableTitle.innerHTML.replace(toexpandsignal,tohidesignal);
                                    expandableTitle.title = "Click here to hide the information";
                            }else{
                                    expandableDiv.style.display = 'none';
                                    expandableTitle.innerHTML = expandableTitle.innerHTML.replace(tohidesignal,toexpandsignal);
                                    expandableTitle.title = "Click here to see more information";
                            }
                            return false;
                        }
                        
                        // Creates the internal div with the full description
                        var internalDiv = document.createElement("div");
                        internalDiv.style.display = 'none';
                        internalDiv.classList.add('expandable_div_internaldiv');
                        internalDiv.setAttribute('id','expandable_div_internaldiv_'+randomIntNumber);
                        
                        if (typeof longText === 'string') {
                                    var newSpanElement = document.createElement('span');
                                    newSpanElement.innerHTML = longText;
                                    if (longTextClasses != undefined && longTextClasses != null ) {
                                                for(var i=0;i<longTextClasses.length;i++){
                                                            newSpanElement.classList.add(longTextClasses[i]);
                                                }
                                                
                                    }
                                    internalDiv.appendChild(newSpanElement);
                        }else{
                                    // Array of HTML objects or strings
                                    if (Array.isArray(longText)){
                                                for(var i=0;i<longText.length;i++){
                                                            if (typeof longText[i] === 'string') {
                                                                        var newSpanElement = document.createElement('span');
                                                                        newSpanElement.innerHTML = longText[i];
                                                                        if (longTextClasses != undefined && longTextClasses != null ) {
                                                                                    for(var iC=0;iC<longTextClasses.length;iC++){
                                                                                                newSpanElement.classList.add(longTextClasses[iC]);
                                                                                    }
                                                                        }
                                                                        internalDiv.appendChild(newSpanElement);   
                                                            }else{
                                                                        var newSpanElement = longText[i];
                                                                        if (longTextClasses != undefined && longTextClasses != null ) {
                                                                                    for(var iC=0;iC<longTextClasses.length;iC++){
                                                                                                newSpanElement.classList.add(longTextClasses[iC]);
                                                                                    }
                                                                        }
                                                                        internalDiv.appendChild(newSpanElement);   
                                                            }
                                                }
                                    // HTML object            
                                    }else{
                                                var newSpanElement = longText;
                                                if (longTextClasses != undefined && longTextClasses != null ) {
                                                            for(var iC=0;iC<longTextClasses.length;iC++){
                                                                        newSpanElement.classList.add(longTextClasses[iC]);
                                                            }
                                                }
                                                internalDiv.appendChild(newSpanElement);      
                                    }
                                    
                        }
                        
                        container.appendChild(link);
                        container.appendChild(internalDiv);
                        return container;
            },
            
            /**
             *          Returns a div container with a link to an alert to show a long description.
             *          @param shortText {String} - Text link to show the long text.
             *          @param longText {String, HTML ELEMENT or Array of both} - Long description or HTML field with a long description of the record.
             *          {HTML Object} - DIV element with both short and field descriptions.
             */
            getLongFloatingText: function(shortText, longText){
                        var container = document.createElement('div');
                        container.classList.add('expandable_div');
                        var randomIntNumber = Math.floor(Math.random() * (100000 - 0)) + 0;

                        // Creates the link to hide and show the description
                        var link = document.createElement("a");
                        link.classList.add("expandable_div_title");
                        link.setAttribute('href',"#");
                        link.setAttribute('id',"expandable_div_title_"+randomIntNumber);
                        var toexpandsignal = " ";
                        link.innerHTML = shortText+" "+toexpandsignal;
                        link.title = "Click here to see the long text into a new little window";
                        
                        link.onclick = function (){
                            var expandableTitle = document.getElementById('expandable_div_title_'+randomIntNumber);
                            var expandableDiv = document.getElementById('expandable_div_internaldiv_'+randomIntNumber);
                            alert(longText);
                            return false;
                        }
                        
                        container.appendChild(link);
                        return container;
            },
            /**
             *          Auxiliary function that returns if one URL belong to the current user's page domain.
             *          @param url {String} - link to analyse.
             *          {Boolean} - True if the URL belongs to the main user's page domain.
             */
            isLocalUrl: function(url){
                        var result = false;
                        if (this.currentDomain != null && this.currentDomain.length > 0){
                                    if (url != null){
                                                var pos = url.indexOf(this.currentDomain);
                                                if (pos >= 0) {
                                                            result = true;
                                                }
                                    }
                        }
                        return result;
            }
         
};


// STATIC ATTRIBUTES
/*
var CONSTS = {
	MIN_LENGTH_LONG_DESCRIPTION: 1000
};

for(var key in CONSTS){
     CommonData[key] = CONSTS[key];
}*/



module.exports = CommonData;
},{"./ContextDataList.js":3,"./constants.js":9}],3:[function(require,module,exports){
var constants = require("./constants.js");
var DataManager = require("./DataManager.js");
var CommonData = require("./CommonData.js");
var reqwest = require("reqwest");

/** 
 * ContextDataList Constructor.
 * 
 * @param {Object} options An object with the options for ContextDataList component.
 * @option {string} [targetId='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 * @option {string} [displayStyle= ContextDataList.FULL_STYLE, ContextDataList.COMMON_STYLE]
 *    Type of rows visualisation.
 * @option {string} [userTextIdContainer=Your own tag id ]
 *    Tag id that contains user's text to search.
 * @option {string} [userTextClassContainer=Your own class name ]
 *    Class name that contains user's text to search.
 *    It's not used if userTextIdContainer is defined.
 * @option {string} [userTextTagContainer=One stablished tag name, for example h1. ]
 *    It's not used if userTextIdContainer or userTextClassContainer is defined.
 *    Tag name that contains user's text to search.
 * @option {string} [userKeywordsIdContainer=Your own tag id ]
 *    Tag id that contains user's keywords to improve search results.
 * @option {string} [userKeywordsClassContainer=Your own class name ]
 *    Class name that contains user's keywords to improve search results.
 *    It's not used if userKeywordsIdContainer is defined.
 * @option {string} [userKeywordsTagContainer=One stablished tag name, for example h1. ]
 *    Tag name that contains user's keywords to improve search results.
 *    It's not used if userKeywordsIdContainer or userKeywordsClassContainer is defined.
 * @option {HTML object} [userKeywordsContainer=The html keywords container itself. ]
 *    HTML object that contains user's keywords to improve search results.
 *    It's not used if userKeywordsIdContainer, userKeywordsClassContainer or userKeywordsIdContainer is defined.
 * @option {string} [userDescriptionClassContainer=Your own class name ]
 *    Class name that contains user's description to help filter same results that user is seeing.
 * @option {string} [userHelpClassContainer=Your own class name ]
 *    Class name that will contains help icon.
 * @option {int} [numberResults=number ]
 *    Integer that restricts the results number that should be shown.
 * @option {boolean} [includeSameSiteResults=If you want to see records of your present site. Temporary disabled. ]
 *    Boolean that avoids or not results from the same site you are seeing. */
//function ContextDataList (options) {
var ContextDataList = function(options) {

	var default_options_values = {        
	     displayStyle: constants.ContextDataList_FULL_STYLE,
	     includeSameSiteResults : true
	};
	for(var key in default_options_values){
	     this[key] = default_options_values[key];
	}
	for(var key in options){
	     this[key] = options[key];
	}
	this.contextDataServer = "http://www.biocider.org:8983/solr/contextData";
	
	
	// global current status
	this.currentTotalResults= null;
	this.currentStartResult= null;
	this.currentNumberLoadedResults= null;
	this.currentStatus= constants.ContextDataList_LOADING;
	this.currentFilters= null;
	this.totalFilters=null;
	this.numInitialResultsByResourceType= null;
	this.numResultsByResourceType= null;
	
	this.currentURL = window.location.href;
	this.currentDomain = window.location.hostname;
	
	this._onLoadedFunctions= [];
        
        this.dataManager = new DataManager({'currentDomain':this.currentDomain});
	
	//this.drawHelpImage();
	
      
}



/** 
 * Resource contextualisation widget.
 * 
 * 
 * @class ContextDataList
 *
 */
ContextDataList.prototype = {
	constructor: ContextDataList,
	
	/**
	 * Shows the contextualised data into the widget.
	 */
	drawContextDataList : function (){
		//console.log('ContextDataList.LOADING,'+constants.ContextDataList_LOADING);
		//console.log('ContextDataList.COMMON_STYLE,'+constants.ContextDataList_COMMON_STYLE);
		this.currentStatus = constants.ContextDataList_LOADING;
		//this.updateGlobalStatus(this.LOADING);
		var userText = this.getUserSearch();
                var userKeywords = this.getUserKeywords();
                // if we have keywords, we can join them to the userText.
                if (userKeywords!=null && userKeywords.length > 0) {
                    for(var i=0;i<userKeywords.length;i++){
                         userText = userText +" "+userKeywords[i];
                    }
                }
		var userDescription = this.getUserContentDescription();
		var maxRows = this.getMaxRows();
		var newUrl = this._getNewUrl(userText, userDescription, this.currentFilters, this.currentStartResult, maxRows);
		this.processDataFromUrl(newUrl);
	},
	
	/**
	 * Shows the contextualised data into the widget, updating the whole internal status of the widget.
	 */
	totalDrawContextDataList : function (){
		this.updateGlobalStatus(constants.ContextDataList_LOADING);
		this.drawContextDataList();
	},
	
	/**
	 * Returns User's text to contextualise, if it exists.
         * {String} - Text found into the client document that contains Contextualisation widget.
	 */
	getUserSearch : function() {
		var userText = '';
		var elementsContainer = null;
                
                if (this.userTextIdContainer != undefined && this.userTextIdContainer != null) {
                    elementsContainer = [];
		    elementsContainer[0] = document.getElementById(this.userTextIdContainer);
		}else if (this.userTextClassContainer != undefined && this.userTextClassContainer != null) {
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
	 * Returns User's keywords in order to improve search results, if they exist.
         * {Array} - List of keywords found into the client document that can help to improve search results.
	 */
	getUserKeywords : function() {
		var userKeywords = [];
		var elementsContainer = null;
                
                if (this.userKeywordsIdContainer != undefined && this.userKeywordsIdContainer != null) {
                    elementsContainer = [];
		    elementsContainer[0] = document.getElementById(this.userKeywordsIdContainer);
		}else if (this.userKeywordsClassContainer != undefined && this.userKeywordsClassContainer != null) {
		    elementsContainer = document.getElementsByClassName(this.userKeywordsClassContainer);
		}else if (this.userKeywordsTagContainer != undefined && this.userKeywordsTagContainer != null){
		    elementsContainer = document.getElementsByTagName(this.userKeywordsTagContainer);
		}else if (this.userKeywordsContainer != undefined && this.userKeywordsContainer != null){
                    elementsContainer = [];
		    elementsContainer[0] = this.userKeywordsContainer;
		}
		
		if (elementsContainer != null && elementsContainer.length > 0) {
			var myFirstElement = elementsContainer[0];
                        var content = myFirstElement.innerText || myFirstElement.textContent;
			userKeywords = content.split(" ");
		}
		return userKeywords;
	},
        
        
	/**
	 * Returns User's description to help filter same results than user is seeing.
         * {String} - Text found into the client document.
	 */
	getUserContentDescription : function() {
		var description = '';
		var elementsContainer = null;
		if (this.userDescriptionClassContainer != undefined && this.userDescriptionClassContainer != null) {
			elementsContainer = document.getElementsByClassName(this.userDescriptionClassContainer);
		}/*else{
			elementsContainer = document.getElementsByTagName(this.userDescriptionTagContainer);
		}*/
		
		if (elementsContainer != null && elementsContainer.length > 0) {
			var myFirstElement = elementsContainer[0];
			description = myFirstElement.innerText;
			if (description == undefined || description == null) {
				description = myFirstElement.innerHTML;
			}
		}
		return description;
	},
	
	/**
	 * Retrieves the maximum number of results that can be shown into the widget.
         * {Integer} - Maximum amount of results that can be shown at the same time.
	 */
	getMaxRows : function(){
		var maxRows = constants.ContextDataList_MAX_ROWS;
		if (this.numberResults != "undefined" && !isNaN(this.numberResults) && typeof this.numberResults === 'number' && (this.numberResults % 1 === 0) ) {
			if (this.numberResults < constants.ContextDataList_MAX_ROWS) {
				maxRows = this.numberResults;
			}
		}
		return maxRows;
	},


	/**
	 * Create a url to the SolR database with all dynamic parameters generated from these arguments.
	 * @param fieldText {string} Text to search.
	 * @param descriptionText {string} Associated description of the content.
	 * @param filters {Array} Array of filters - Only results with one of these resource types will be get.
	 * @param start {integer} Position of the first result to retrieve.
	 * @param rowsNumber {integer} Indicates the maximum number of results that will be shown on the screen;
	 */
	_getNewUrl : function(fieldText, descriptionText, filters, start, rowsNumber){
		//console.log('_getNewUrl, fieldText: '+fieldText+', descriptionText: '+descriptionText+', filters: '+filters+', start: '+start+', rowsNumber: '+rowsNumber);
		var count = 0;
		var url = "";
		
		var words = fieldText.split(" ");
		var searchPhrase = "";
		while (count < words.length) {
			searchPhrase += words[count];
			count++;
			if(count < words.length){searchPhrase += '+'}
		}
		// we exclude all results from this domain: disabled until reindexing
		/*if (!this.includeSameSiteResults) {
			var excludingPhrase = "";
			//excludingPhrase = " NOT("+this.currentDomain+")";
			excludingPhrase = "-\"*tgac.ac.uk*\"";
			searchPhrase = "("+searchPhrase+excludingPhrase+")";
		// we exclude only the same record than user is
		}else{*/
		/*	
		if (this.currentURL !== "undefined" && this.currentURL != null) {
			var excludingPhrase = "";
			// There are some characters that can break the full URL; we remove them.
			var curatedURL = this.currentURL.replace('#','');
			excludingPhrase = " NOT(\""+curatedURL+"\")";
			searchPhrase = "("+searchPhrase+") AND "+excludingPhrase;
		}*/
		searchPhrase = "("+searchPhrase+")";	
		
		//}	
		
		url = this.contextDataServer+"/select?defType=edismax&q="+searchPhrase;
		
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
		
		
		if (this.currentURL !== "undefined" && this.currentURL != null) {
			if (fq==null) {
				fq = "*:*";
			}
			// There are some characters that can break the full URL; we remove them.
			var curatedURL = this.currentURL.replace('#','');
			var linkField = new CommonData(null).LINK_FIELD;
			fq = fq+" AND -"+linkField+":\""+curatedURL+"\"";	
		}
	        
		// If we have description, we can try to filter undesired results (i.e., results that are the same than user's current page)
		if (descriptionText != null) {
			if (fq==null) {
				fq = "*:*";
			}
			
			var descUsed = descriptionText;
			if (descUsed.length>constants.ContextDataList_NUM_WORDS_FILTERING_DESCRIPTION) {
				descUsed = descUsed.split(" ").slice(0,constants.ContextDataList_NUM_WORDS_FILTERING_DESCRIPTION).join(" ");
			}
			// we remove weird characters and "
			descUsed = descUsed.replace(/\"/g,'');
			descUsed = encodeURIComponent(descUsed);
			
			var descriptionField = new CommonData(null).DESCRIPTION_FIELD;
			fq = fq+" AND -"+descriptionField+":\""+descUsed+"\"";
			
			var titleField = new CommonData(null).TITLE_FIELD;
			fq = fq+" AND -"+titleField+":\""+fieldText+"\"";
			
		}
		
		
		if (fq!=null) {
			url = url+"&fq="+fq;
		}
		
		// qf
		url = url+"&qf=title^2.0+field^2.0+description^1.0";
		
		// start row
		if (start !== "undefined" && start!=null && !isNaN(start) && typeof start === 'number' && (start % 1 === 0) ) {
			url = url+"&start="+start;
			this.currentStartResult = start;
		}else{
			this.currentStartResult = 0;
		}
		
		// num rows
		if (rowsNumber !== "undefined" && rowsNumber!=null && rowsNumber!=null && !isNaN(rowsNumber) && typeof rowsNumber === 'number' && (rowsNumber % 1 === 0) ) {
			url = url+"&rows="+rowsNumber;
		}
			
			
		// Stats. We count all the different results by resource type
		url = url+"&facet=true&facet.method=enum&facet.limit=-1&facet.field=resource_type"
		
				
		// wt
		url = url+"&wt=json";
		
		// maybe we could also filter fields that we return
		// &fl=start,title,notes,link
		
		
		return url;
	},
	
	
	
	/**
	 * Makes an asynchronous request to the Contextualisation data server and process its reply.
	 * @param url {string} - Uniform Resource Locator
	 */
	processDataFromUrl: function(url){
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
				myContextDataList.updateGlobalStatus(constants.ContextDataList_ERROR);
			} ,
			success: function (resp) {
				var contextualisedData = myContextDataList.processContextualisedData(resp);
				myContextDataList.drawContextualisedData(contextualisedData);
			}
		});
	},
	

	/**
	 * Manages some errors and process each result to be get in a proper way.
	 * @param data {Object} - The full data list to be processed and shown
	 * {Array} - Array with objects converted from their original JSON status
	 */
	processContextualisedData : function(data) {
		var myContextDataList = this;
		var contextualisedData = [];
		if(data.response != undefined){
			if(data.response.docs != undefined){
				
				this.currentTotalResults = data.response.numFound;
				
				this.numResultsByResourceType = this.getNumResultsByResourceType(data);
				if (this.numInitialResultsByResourceType == null) {
					this.numInitialResultsByResourceType = this.numResultsByResourceType;
				}
				
				data.response.docs.forEach(function(entry) {
					var typedData = myContextDataList.dataManager.getDataEntity(entry);
					contextualisedData.push(typedData);
				});
			}
			else {
				myContextDataList.processError("data.response.docs undefined");
				myContextDataList.changeCurrentStatus(constants.ContextDataList_ERROR);
			}
		} else {
			myContextDataList.processError("data.response undefined");
			myContextDataList.changeCurrentStatus(constants.ContextDataList_ERROR);
		}
			
		return contextualisedData;
	},
	/*
	filterSameDataResults : function(data, mainText, contentDescription){
		var filtered_data = data;
		
		data.response.docs.forEach(function(entry) {
			var typedData = myContextDataList.dataManager.getDataEntity(entry);
			contextualisedData.push(typedData);
		});
		
		CommonData.TITLE_FIELD
		CommonData.DESCRIPTION_FIELD
		
		return filtered_data;
	},*/
	
	/**
	 * Returns the number of data of each resource type.
	 * @param  data {Object} - The full data list to be processed
	 * data {Object} - Object with one property by each resource type and value of its ocurrences.
	 */
	getNumResultsByResourceType : function(data) {
		var facet_counts = data.facet_counts;
		var resource_types_count = null;
		if (facet_counts != undefined || facet_counts != null ) {
			var facet_fields = facet_counts.facet_fields;
			if (facet_fields != undefined || facet_fields != null ) {
				resource_types_count = facet_fields.resource_type;	
			}	
		}
		if (resource_types_count == null) {
			return null;
		}
		
		var numResultsByResourceType = {};
		if (this.totalFilters != null) {
			var currentFilter = null;
			for (var i=0;i<this.totalFilters.length;i++) {
				currentFilter = this.totalFilters[i];
				var current_count = null;
				for (var j=0;j<resource_types_count.length;j++) {
					current_count = resource_types_count[j];
					if ( (typeof current_count === 'string' || current_count instanceof String)
					    && currentFilter.toLowerCase().indexOf(current_count) > -1 ) {
						numResultsByResourceType[currentFilter] = resource_types_count[j+1];
						break;
					}
				}
			}
		}
		return numResultsByResourceType;
	},
	
         
	/**
	 * Draw a entire list of contextualised resources
	 * @param contextualisedData {object Object} - All the data to be drawn into the widget.
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
			drawableObject = dataObject.getDrawableObjectByStyle(this.displayStyle);
			drawableObject.classList.add('views-row');
			if(oddRow == true){
				drawableObject.classList.add("views-row-odd");
			}else{
				drawableObject.classList.add("views-row-even");
			}
			target.appendChild(drawableObject);
			index++;
		}
		if (contextualisedData.length == 0) {
			target.appendChild(this.getEmptyRecord());
		}
		
		this.currentNumberLoadedResults = contextualisedData.length;
		this.updateGlobalStatus(constants.ContextDataList_LOADED);
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
	 * 	Returns one row explaining the absence of real results.
	 * 	{HTML Object} - Empty result.
	 */
	getEmptyRecord : function(){
		var mainContainer = document.createElement('div');
		mainContainer.classList.add("context_data_container");
		var trContainer = document.createElement('div');
		trContainer.classList.add("context_data_container_row");
		
		var spanText = document.createElement('span');
		var text = 'No results found';
		spanText.innerHTML = text;
		trContainer.appendChild(spanText);
		mainContainer.appendChild(trContainer);
		return mainContainer;
	},
	
	/**
	 * Updates, depending on the new status, internal variables of the component and, if
	 * new status is 'LOADED', executes the 'onLoaded' functions registered. 
	 * @param newStatus {string} - ContextDataList.LOADING or ContextDataList.ERROR or ContextDataList.LOADED 
	 */
	updateGlobalStatus : function(newStatus){
		// new status must be one of the posible status
		if (newStatus != constants.ContextDataList_LOADING &&
		    newStatus != constants.ContextDataList_ERROR &&
		    newStatus != constants.ContextDataList_LOADED ){
			return;
		}
		this.currentStatus = newStatus;
		
		if (this.currentStatus == constants.ContextDataList_LOADING){
			this.currentTotalResults = null;
			this.currentStartResult = null;
			this.currentNumberLoadedResults = null;
		}else if (this.currentStatus == constants.ContextDataList_ERROR){
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
		if (this.currentStatus == constants.ContextDataList_LOADED ||
		    this.currentStatus == constants.ContextDataList_ERROR ){
			this.executeOnLoadedFunctions();
		}
	},
	
	/**
	*          Returns one standard way of representing 'title' data transformed into a HTML component.
	*          {HTML Object} - ANCHOR element with 'title' information linking to the original source.
	*/
	/*drawHelpImage: function(){
		var helpContainer = null;
		if (this.userHelpClassContainer != undefined && this.userHelpClassContainer != null) {
			var helpContainers = document.getElementsByClassName(this.userHelpClassContainer);
			if (helpContainers != null && helpContainers.length>0) helpContainer = helpContainers[0];
		}else if (this.userHelpTagContainer != undefined && this.userHelpTagContainer != null){
			var helpContainers = document.getElementsByTagName(this.userHelpTagContainer);
			if (helpContainers != null && helpContainers.length>0) helpContainer = helpContainers[0];
		}
		console.log(helpContainer);
		if (helpContainer != null) {
			var helpImage = this.getHelpImage();
			if (helpImage != null) {
				helpContainer.classList.add("tooltip");
				helpContainer.appendChild(this.getHelpImage());
				//helpContainer.appendChild(this.getHelpText());
				//helpContainer.appendChild(helpImage);
			}
		}
	},*/
	
	/**
	*          Returns one standard way of representing 'title' data transformed into a HTML component.
	*          {HTML Object} - ANCHOR element with 'title' information linking to the original source.
	*/
        /*getHelpImage: function(){
		var imgElement = document.createElement('img');
		imgElement.classList.add("context_help_img");

		return imgElement;
        },*/
	
	
	
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


// STATIC ATTRIBUTES
/*
var CONSTS = {
	//List of possible context data sources 
	SOURCE_ELIXIR_REGISTRY:"ESR",
	SOURCE_ELIXIR_TESS:"TSS",
	SOURCE_ELIXIR_EVENTS:"EEV",
	//style of visualization
	FULL_STYLE:"FULL_STYLE",
	COMMON_STYLE:"COMMON_STYLE",
	//max number of rows to retrieve from the server, whatever 'numberResults' can be
	MAX_ROWS:100,
	//maximum length to be used from the description to filter same results
	NUM_WORDS_FILTERING_DESCRIPTION:50,
	//Events 
	EVT_ON_RESULTS_LOADED: "onResultsLoaded",
	EVT_ON_REQUEST_ERROR: "onRequestError",
	//Different widget status
	LOADING: "LOADING",
	LOADED: "LOADED",
	ERROR: "ERROR"
};

for(var key in CONSTS){
     ContextDataList[key] = CONSTS[key];
}*/


module.exports = ContextDataList;

},{"./CommonData.js":2,"./DataManager.js":4,"./constants.js":9,"reqwest":11}],4:[function(require,module,exports){

var CommonData = require("./CommonData.js");
var ElixirTrainingData = require("./ElixirTrainingData.js");
var ElixirEventData = require("./ElixirEventData.js");
var ElixirRegistryData = require("./ElixirRegistryData.js");

/** 
 * Data managment constructor.
 * @param {Array} options An object with the options for DataManager component.
 *      @option {string} [currentDomain='YourOwnDomain'].
 *      URL that identifies user's page domain.
 */
var DataManager = function(options) {
 
    var default_options_values = {
        currentDomain: null
    };
    for(var key in default_options_values){
        this[key] = default_options_values[key];
    }
    for(var key in options){
        this[key] = options[key];
    }
    
}

/** 
 * Data managment functionality.
 * Builds one kind of CommonData depending on its 'source' value.
 * 
 * @class DataManager
 *
 */
DataManager.prototype = {
    constructor: DataManager,
    sourceField: 'source',
    
    /**
    *   Returns source field value of the JSON structure passed as argument.
    *   @param jsonEntry {Object} - JSON data structure with one entity's data.
    *   {String} - String literal with the source value of the JSON structure.
    */
    getSourceField : function(jsonEntry){
        if (jsonEntry !== null && jsonEntry !== undefined) {
            return jsonEntry[this.sourceField];
        }else return null;
    },
        
    /**
    *   Returns one CommonData object representing one data registry.
    *   @param jsonEntry {Object} - JSON data structure with one entity's data.
    *   {CommonData Object} - CommonData child that represents objetified json data.
    */
    getDataEntity : function (jsonEntry){
        var sourceFieldValue = this.getSourceField(jsonEntry);
        var commonData = null;
        var options = {};
        options['currentDomain'] = this.currentDomain;
        switch(sourceFieldValue){
            case new ElixirRegistryData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirRegistryData(jsonEntry, options);
                break;
            case new ElixirTrainingData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirTrainingData(jsonEntry, options);
                break;
            case new ElixirEventData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirEventData(jsonEntry, options);
                break;
            default:
                console.log("ERROR: Unknown source field value: " + sourceFieldValue);
        }
        return commonData;
    }

}

module.exports = DataManager;
},{"./CommonData.js":2,"./ElixirEventData.js":5,"./ElixirRegistryData.js":6,"./ElixirTrainingData.js":7}],5:[function(require,module,exports){
var CommonData = require("./CommonData.js");

/**
 * ElixirEventData constructor
 * @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 * @param {Object} options An object with the options for this structure.
 *          @option {string} [currentDomain='url']
 *          URL with the user's page domain.
 */
var ElixirEventData = function(jsonData, options) {
            
            var default_options_values = {
                        currentDomain: null
            };
            for(var key in default_options_values){
                        this[key] = default_options_values[key];
            }
            for(var key in options){
                        this[key] = options[key];
            }
           
            var CONSTS = {
                        CATEGORY                    : "category",
                        CITY                        : "city",
                        COUNTRY                     : "country",
                        START_DATE                  : "start",
                        END_DATE                    : "end",
                        VENUE                       : "venue",
                        PROVIDER                    : "provider"
            };

            for(var key in CONSTS){
                 this[key] = CONSTS[key];
            }
            
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "iann";
   
};


/**
 *          ElixirEventData child class with specific information of this kind of registries.
 */         
ElixirEventData.prototype = Object.create(CommonData.prototype);
ElixirEventData.constructor= ElixirEventData;
       
            
/**
 *          Returns all categories present in this entity.
 *          {Array} - Array of strings with categories related with this entity.
 */
ElixirEventData.prototype.getCategoryValues= function(){
            return this.getParameterisedValue(this.CATEGORY);      
},

/**
 *          Returns city field value of this entity.
 *          {String} - String literal with the city value of this entity.
 */
ElixirEventData.prototype.getCityValue = function(){
            return this.getParameterisedValue(this.CITY);      
};

/**
 *          Returns country field value of this entity.
 *          {String} - String literal with the country value of this entity.
 */
ElixirEventData.prototype.getCountryValue = function(){
            return this.getParameterisedValue(this.COUNTRY);      
};


/**
 *          Auxiliar function that returns one date adapted to user's locale.
 *          @param sourceDate {String} - String date in UTF format to be converted into a locale format.
 *          {String} - String literal with the curated date.
 */
ElixirEventData.prototype.getCuratedDate = function(sourceDate){
            var dateValue = new Date(sourceDate);
            if ( Object.prototype.toString.call(dateValue) === "[object Date]" ) {
                        // it is a date
                        if ( isNaN( dateValue.getTime() ) ) { 
                                    // date is not valid
                                    return sourceDate;  
                        }
                        else {
                                    // date is valid
                                    return dateValue.toLocaleDateString();
                        }
            }
            else {
                        // not a date
                        return sourceDate;
            }
            
};

/**
 *          Returns starting date field value of this entity.
 *          {String} - String literal with the starting date value of this entity.
 */
ElixirEventData.prototype.getStartDateValue = function(){
            var value= this.getParameterisedValue(this.START_DATE);
            return this.getCuratedDate(value);
};

/**
 *          Returns ending date field value of this entity.
 *          {String} - String literal with the ending date value of this entity.
 */
ElixirEventData.prototype.getEndDateValue = function(){
            var value = this.getParameterisedValue(this.END_DATE);
            return this.getCuratedDate(value);
};

/**
 *          Returns venue field value of this entity.
 *          {String} - String literal with the venue value of this entity.
 */
ElixirEventData.prototype.getVenueValue = function(){
            return this.getParameterisedValue(this.VENUE);  
};

/**
 *          Returns provider field value of this entity.
 *          {String} - String literal with the provider value of this entity.
 */
ElixirEventData.prototype.getProviderValue = function(){
            return this.getParameterisedValue(this.PROVIDER);  
};


/**
 *          Returns one improved way of representing ElixirEventData transformed into a HTML component.
 *          {Object} - Array with HTML structured converted from this entity's original JSON status.
 */
ElixirEventData.prototype.getFullDrawableObject = function(){
            //CommonData.prototype.getFullDrawableObject.call(this);
            var title = this.getLabelTitle();
            var topics = this.getLabelTopics();
            var resourceTypes = this.getImageResourceTypes();
            var getExpandableDetails = this.getExpandableDetails();
            
            var mainContainer = document.createElement('div');
            mainContainer.classList.add("context_data_container");
            var trContainer = document.createElement('div');
            trContainer.classList.add("context_data_container_row");
            var leftContainer = document.createElement('div');
            leftContainer.classList.add("context_data_container_col_left");
            var rightContainer = document.createElement('div');
            rightContainer.classList.add("context_data_container_col_right");
            
            leftContainer.appendChild(title);
            leftContainer.appendChild(topics);
            leftContainer.appendChild(getExpandableDetails);
            rightContainer.appendChild(resourceTypes);
            
            trContainer.appendChild(leftContainer);
            trContainer.appendChild(rightContainer);
            mainContainer.appendChild(trContainer);

            return mainContainer;
};


/**
 *          Returns one expandable object with many details related with this ElixirEventData record.
 *          {HTML Object} - Drawable object with details related with this record.
 */
ElixirEventData.prototype.getExpandableDetails = function(){
            var detailsArray = [];
            
            var spanProvider = document.createElement("p");
            spanProvider.classList.add("expandable_detail");
            spanProvider.classList.add("provider");
            
            var spanProviderText = "";
            var provider = this.getProviderValue();
            
            if (provider !== undefined ) {    
                    spanProviderText = "Provider: "+provider;
                    spanProvider.innerHTML = spanProviderText;
                    detailsArray.push(spanProvider);
            }else{
                        var spanVenue = document.createElement("p");
                        spanVenue.classList.add("expandable_detail");
                        spanVenue.classList.add("venue");
                        
                        var spanVenueText = "";
                        var venue = this.getVenueValue();
                        
                        if (venue !== undefined ) {    
                                spanVenueText = venue;
                                detailsArray.push(spanVenueText);
                        }
            }
            
            var spanLocation = document.createElement("p");
            spanLocation.classList.add("expandable_detail");
            spanLocation.classList.add("location");
            var spanLocationText = "";
            var country = this.getCountryValue();
            var city = this.getCityValue();
            if (country !== undefined ) {
                    spanLocationText = spanLocationText + country;  
            }
            if (city !== undefined ) {
                    if (spanLocationText.length > 0) {
                        spanLocationText = spanLocationText +", "+ city;  
                    }else
                        spanLocationText = spanLocationText + city;  
            }
            if (spanLocationText.length > 0) {
                        spanLocation.innerHTML = spanLocationText;
                        detailsArray.push(spanLocation);
            }
            
            var spanDates = document.createElement("p");
            spanDates.classList.add("expandable_detail");
            spanDates.classList.add("dates");
            var spanDatesText = "";
            var startDate = this.getStartDateValue();
            var endDate = this.getEndDateValue();
            
            if (startDate !== undefined ) {
                        if (endDate !== undefined ) {
                                    spanDatesText = "From "+startDate;
                        }else{
                                    spanDatesText = startDate;
                        }
            }
            if (endDate !== undefined ) {
                        if (spanDatesText.length > 0) {
                                    spanDatesText = spanDatesText + " to "+endDate;
                        }else{
                                    spanDatesText = endDate;
                        }
            }
            if (spanDatesText.length > 0) {
                        spanDates.innerHTML = spanDatesText;
                        detailsArray.push(spanDates);
            }
            // maybe we can add later 'category' or 'keywords'
            var expandableDetails = this.getExpandableText("More ",detailsArray);
            return expandableDetails;
};



module.exports = ElixirEventData;
      
},{"./CommonData.js":2}],6:[function(require,module,exports){
var CommonData = require("./CommonData.js");

/**
 *          ElixirRegistryData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *          @param {Object} options An object with the options for this structure.
 *                      @option {string} [currentDomain='url']
 *                      URL with the user's page domain.
 *
 */
var ElixirRegistryData = function(jsonData, options) {
            
            var default_options_values = {
                        currentDomain: null
            };
            for(var key in default_options_values){
                        this[key] = default_options_values[key];
            }
            for(var key in options){
                        this[key] = options[key];
            }
            
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "elixir_registry" ;   
};

/**
 *          ElixirRegistryData child class with specific information of this kind of records.
 */
ElixirRegistryData.prototype = Object.create(CommonData.prototype);
ElixirRegistryData.constructor= ElixirRegistryData;

            

/**
 *          Returns one more detailed way of representing a ElixirRegistryData record transformed
 *          into a HTML component.
 *          {Object} - Array with HTML structured converted from this entity's original JSON status.
 */
ElixirRegistryData.prototype.getFullDrawableObject = function(){
            var title = this.getLabelTitle();
            var topics = this.getLabelTopics();
            var resourceTypes = this.getImageResourceTypes();
            var description = this.getDescriptionValue();
            
            var mainContainer = document.createElement('div');
            mainContainer.classList.add("context_data_container");
            var trContainer = document.createElement('div');
            trContainer.classList.add("context_data_container_row");
            var leftContainer = document.createElement('div');
            leftContainer.classList.add("context_data_container_col_left");
            var rightContainer = document.createElement('div');
            rightContainer.classList.add("context_data_container_col_right");
            
            leftContainer.appendChild(title);
            leftContainer.appendChild(topics);
            if (description != undefined && description != null) {
                        var expandableDescription = "";
                        if (description.length>CommonData.MIN_LENGTH_LONG_DESCRIPTION) {
                                    expandableDescription = this.getExpandableText("More ",description.substring(0, CommonData.MIN_LENGTH_LONG_DESCRIPTION)+" [...]",['elixir_registry']);
                        }else{
                                    expandableDescription = this.getExpandableText("More ",description,['elixir_registry']);
                        }
                        leftContainer.appendChild(expandableDescription);
            }
            
            rightContainer.appendChild(resourceTypes);
            
            trContainer.appendChild(leftContainer);
            trContainer.appendChild(rightContainer);
            mainContainer.appendChild(trContainer);

            return mainContainer;
};


module.exports = ElixirRegistryData;
},{"./CommonData.js":2}],7:[function(require,module,exports){

var CommonData = require("./CommonData.js");

/**
 *          ElixirTrainingData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *          @param {Object} options An object with the options for this structure.
 *                      @option {string} [currentDomain='url']
 *                      URL with the user's page domain.
 *
 */
var ElixirTrainingData = function(jsonData, options) {
            
            var default_options_values = {
                        currentDomain: null
            };
            for(var key in default_options_values){
                        this[key] = default_options_values[key];
            }
            for(var key in options){
                        this[key] = options[key];
            }
            
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "ckan"; 
};

/**
 *          ElixirTrainingData child class with specific information of this kind of registries.
 */
ElixirTrainingData.prototype = Object.create(CommonData.prototype); 
ElixirTrainingData.constructor= ElixirTrainingData;
                                           

/**
 *          Returns one more detailed way of representing a ElixirTrainingData record transformed into a HTML component.
 *          {Object} - Array with HTML structured converted from this entity's original JSON status.
 */
ElixirTrainingData.prototype.getFullDrawableObject = function(){
            var title = this.getLabelTitle();
            var topics = this.getLabelTopics();
            var resourceTypes = this.getImageResourceTypes();
            var description = this.getDescriptionValue();
            
            var mainContainer = document.createElement('div');
            mainContainer.classList.add("context_data_container");
            var trContainer = document.createElement('div');
            trContainer.classList.add("context_data_container_row");
            var leftContainer = document.createElement('div');
            leftContainer.classList.add("context_data_container_col_left");
            var rightContainer = document.createElement('div');
            rightContainer.classList.add("context_data_container_col_right");
            
            leftContainer.appendChild(title);
            leftContainer.appendChild(topics);
            if (description != undefined && description != null) {
                        var expandableDescription = "";
                        if (description.length>CommonData.MIN_LENGTH_LONG_DESCRIPTION) {
                                    expandableDescription = this.getExpandableText("More ",description.substring(0, CommonData.MIN_LENGTH_LONG_DESCRIPTION)+" [...]",['training_material']);
                        }else{
                                    expandableDescription = this.getExpandableText("More ",description,['training_material']);           
                        }
                        leftContainer.appendChild(expandableDescription);
            }
            
            rightContainer.appendChild(resourceTypes);
            
            trContainer.appendChild(leftContainer);
            trContainer.appendChild(rightContainer);
            mainContainer.appendChild(trContainer);

            return mainContainer;
};
      

module.exports = ElixirTrainingData;
},{"./CommonData.js":2}],8:[function(require,module,exports){
var ContextDataList = require("./ContextDataList.js");
var constants = require("./constants.js");

/** 
 * PageManager constructor.
 *
 * @param {ContextDataList Object} Reference to ContextDataList object in order to manage its filters.
 * @param {Object} options An object with the options for PageManager component.
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 */
var PageManager = function(contextDataList, options) {
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

/** 
 * PageManager functionality.
 * 
 * @class PageManager
 * 
 */
PageManager.prototype = {
	constructor: PageManager,
        
        
	/**
	 * Creates the buttons and draw them into the element with id 'targetId'
	 */        
	build : function (){
		var target = document.getElementById(this.targetId);
		if (target == undefined || target == null){
			return;	
		}
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		
		if (this.contextDataList.currentStatus == constants.ContextDataList_LOADING){
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
		}else if (this.contextDataList.currentStatus == constants.ContextDataList_ERROR){
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
		}else if (this.contextDataList.currentStatus == constants.ContextDataList_LOADED){
			var statusText = this.getCurrentStatus();
			target.appendChild(statusText);
			
			var navDiv = document.createElement('div');
			navDiv.classList.add('page_manager_nav');
			
			var previousButton = this.createPreviousButton();
			navDiv.appendChild(previousButton);
			
			var textSeparator = this.createTextSeparator();
			navDiv.appendChild(textSeparator);
			
			var nextButton = this.createNextButton();
			navDiv.appendChild(nextButton);
			
			target.appendChild(navDiv);
		}else{
			console.log("ERROR: Unknown status: "+this.contextDataList.currentStatus);
		}
		
	},
        
	/**
        * Function that creates a text separator.
        */  
	createTextSeparator : function(){
		var element = document.createElement('span');
		var text = document.createTextNode('-');
		element.appendChild(text);
		element.classList.add('page_manager_component');
		return element;
	},
	
	/**
        * Function that evaluates if it's possible to retrieve previous results.
        */  
        existPreviousResults : function(){
		var startResult = this.contextDataList.currentStartResult;
		if (startResult == 0) {
			return false;
		}else
			return true;
        },
	
	/**
        * Function that evaluates if it's possible to retrieve next results.
        */  
        existNextResults : function(){
		var startResult = this.contextDataList.currentStartResult;
		var maxRows = this.contextDataList.getMaxRows();
		var totalResults = this.contextDataList.currentTotalResults;

		if (startResult+maxRows<totalResults) {
			return true;
		}else
			return false;
        },
        
        /**
        * Function that creates one button to get previous results.Only text if there aren't previous results.
        */  
        createPreviousButton : function(){
		if (this.existPreviousResults()) {
			var button = document.createElement('a');
			button.classList.add('page_manager_component');
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
		}else{
			var previousSpan = document.createElement('span');
			var previousText = document.createTextNode('Previous');
			previousSpan.appendChild(previousText);
			previousSpan.classList.add('page_manager_component');
			return previousSpan;
		}
              
        },
	
	/**
        * Function that creates one button to get previous results.Only text if there aren't more results.
        */  
        createNextButton : function(){
		if (this.existNextResults()) {
			var button = document.createElement('a');
			button.classList.add('page_manager_component');
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
		}else{
			var nextSpan = document.createElement('span');
			var nextText = document.createTextNode('Next');
			nextSpan.appendChild(nextText);
			nextSpan.classList.add('page_manager_component');
			return nextSpan;
		}
              
        },
        
        /**
        * Internal function that executes the redrawn of the ContextDataList object having into account
        * previously chosen filters.
        * @param startResult {Integer} - number of the first result to be shown
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
		var element = document.createElement('div');
		element.classList.add('page_manager_status');
		var startingResult = null;
		var endingResult = null;
		var totalResults = null;
		var resultText = "";
		
		if (this.contextDataList.currentStatus == constants.ContextDataList_LOADING){
			resultText = "Loading resources...";
		}else if (this.contextDataList.currentStatus == constants.ContextDataList_ERROR){
			resultText = "";
		}else{
			startingResult = this.contextDataList.currentStartResult;
			var currentTotalResults = this.contextDataList.currentTotalResults;
			var numRowsLoaded = this.contextDataList.currentNumberLoadedResults;
			
			endingResult = startingResult + numRowsLoaded;
			if (currentTotalResults>0) {
				// only to show it to the user
				startingResult = startingResult+1;
			}
			resultText = "Records "+startingResult+" to "+endingResult+" of "+currentTotalResults
			
		}
		element.innerHTML = resultText;
		
		return element;
	}
        
        
}
      
module.exports = PageManager;
      
  
},{"./ContextDataList.js":3,"./constants.js":9}],9:[function(require,module,exports){


function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// ContextDataList constants
define("ContextDataList_SOURCE_ELIXIR_REGISTRY", "ESR");
define("ContextDataList_SOURCE_ELIXIR_TESS", "TSS");
define("ContextDataList_SOURCE_ELIXIR_EVENTS", "EEV");
define("ContextDataList_FULL_STYLE", "FULL_STYLE");
define("ContextDataList_COMMON_STYLE", "COMMON_STYLE");
define("ContextDataList_MAX_ROWS", 100);
define("ContextDataList_NUM_WORDS_FILTERING_DESCRIPTION", 50);
define("ContextDataList_EVT_ON_RESULTS_LOADED", "onResultsLoaded");
define("ContextDataList_EVT_ON_REQUEST_ERROR", "onRequestError");
define("ContextDataList_LOADING", "LOADING");
define("ContextDataList_LOADED", "LOADED");
define("ContextDataList_ERROR", "ERROR");

// CommonData constants
define("CommonData_MIN_LENGTH_LONG_DESCRIPTION", 1000);

// ButtonsManager constants
define("ButtonsManager_SQUARED_3D", "SQUARED_3D");
define("ButtonsManager_ROUND_FLAT", "ROUND_FLAT");
define("ButtonsManager_ICONS_ONLY", "ICONS_ONLY");


},{}],10:[function(require,module,exports){

},{}],11:[function(require,module,exports){
/*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2015
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var context = this

  if ('window' in context) {
    var doc = document
      , byTag = 'getElementsByTagName'
      , head = doc[byTag]('head')[0]
  } else {
    var XHR2
    try {
      XHR2 = require('xhr2')
    } catch (ex) {
      throw new Error('Peer dependency `xhr2` required! Please npm install xhr2')
    }
  }


  var httpsRe = /^http/
    , protocolRe = /(^\w+):\/\//
    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = context[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (context[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (context[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else if (XHR2) {
          return new XHR2()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function succeed(r) {
    var protocol = protocolRe.exec(r.url)
    protocol = (protocol && protocol[1]) || context.location.protocol
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response
  }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (succeed(r)) success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    var isAFormData = typeof FormData !== 'undefined' && (o['data'] instanceof FormData);
    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    context[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    // get the xhr from the factory if passed
    // if the factory returns null, fall-back to ours
    http = (o.xhr && o.xhr(o)) || xhr(o)

    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (context[xDomainRequest] && http instanceof context[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(header) {
    // json, javascript, text/plain, text/html, xml
    if (header === null) return undefined; //In case of no content-type.
    if (header.match('json')) return 'json'
    if (header.match('javascript')) return 'js'
    if (header.match('text')) return 'html'
    if (header.match('xml')) return 'xml'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        timedOut()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = context.JSON ? context.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function timedOut() {
      self._timedOut = true
      self.request.abort()
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  , 'catch': function (fn) {
      return this.fail(fn)
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{"xhr2":10}],"biocider":[function(require,module,exports){
var constants = require("./constants.js");
var ContextDataList = require("./ContextDataList.js");
var ButtonsManager = require("./ButtonsManager.js");
var PageManager = require("./PageManager.js");

/** 
 * BioCIDER Component.
 *
 * Purpose of this widget is showing to the user, without any direct action by himself,
 * information of his interest related with the content that is being shown currently to him .
 * To achieve this, we collect in a Solr system information of different repositories
 * (Elixir Service Registry, Elixir Training Portal, and Elixir Events Portal, until now), so
 * we can search into this information which is related with content accesed by user.
 * 
 *
 * @param {String} targetId  Id of the main container to put this component.
 * @param {Object} contextDataListOptions An object with the main options for ContextDataList subcomponent.
 * 	@option {string} [targetId='YourOwnDivId']
 *    		Identifier of the DIV tag where the ContextDataList object should be displayed.
 * 	@option {string} [targetClass='YourOwnClass']
 *    		Class name of the DIV where the ContextDataList object should be displayed.  
 * 	@option {string} [displayStyle= ContextDataList.FULL_STYLE, ContextDataList.COMMON_STYLE]
 *    		Type of rows visualisation.
 * 	@option {string} [userTextIdContainer=Your own tag id ]
 *    		Tag id that contains user's text to search.
 * 	@option {string} [userTextClassContainer=Your own class name ]
 *    		Class name that contains user's text to search. It's not used if userTextIdContainer is defined.
 * 	@option {string} [userTextTagContainer=One stablished tag name, for example h1. ]
 *    		Tag name that contains user's text to search. It's not used if userTextIdContainer or userTextClassContainer is defined
 * 	@option {string} [userKeywordsIdContainer=Your own tag id ]
 *    		Tag id that contains user's keywords to improve search results.
 * 	@option {string} [userKeywordsClassContainer=Your own class name ]
 *    		Class name that contains user's keywords to improve search results.
 *    		It's not used if userKeywordsIdContainer is defined.
 * 	@option {string} [userKeywordsTagContainer=One stablished tag name, for example h1. ]
 *    		Tag name that contains user's keywords to improve search results.
 *    		It's not used if userKeywordsIdContainer or userKeywordsClassContainer is defined.
 * 	@option {HTML object} [userKeywordsContainer=The html keywords container itself. ]
 *    		HTML object that contains user's keywords to improve search results.
 *    		It's not used if userKeywordsIdContainer, userKeywordsClassContainer or userKeywordsIdContainer is defined.
 * 	@option {string} [userDescriptionClassContainer=Your own class name ]
 *    		Class name that contains user's description to help filter same results that user is seeing.
 * 	@option {string} [userHelpClassContainer=Your own class name ]
 *    		Class name that will contains help icon.
 * 	@option {int} [numberResults=number ]
 *    		Integer that restricts the results number that should be shown.
 *
 * @param {Object} buttonsManagerOptions  An object with the main options for ButtonsManager subcomponent.
 * 	@option {string} [targetId='YourOwnDivId']
 *    		Identifier of the DIV tag where the component should be displayed.
 * 	@option {string} [targetClass='YourOwnClass']
 *    		Class name of the DIV where the ButtonsManager object should be displayed.  
 * 	@option {boolean} [helpText]
 *    		True if you want to show a help text over the buttons.
 * 	@option {string} [buttonsStyle='SQUARED_3D' , 'ROUND_FLAT' or 'ICONS_ONLY'. ICONS_ONLY by default.]
 *    		Identifier of the buttons visualisation type.
 * 	@option {boolean} [pressedUnderlines]
 *    		True if you want to show underlines when you press a button.
 *
 * @param {Object} pageManagerOptions  An object with the main options for PageManager subcomponent.
 *	@option {string} [targetId='YourOwnDivId']
 *    		Identifier of the DIV tag where the component should be displayed.
 * 	@option {string} [targetClass='YourOwnClass']
 *    		Class name of the DIV where the PageManager object should be displayed.  
 */
//function BioCider (targetId, contextDataListOptions, buttonsManagerOptions,pageManagerOptions) {
var biocider = function (targetId, contextDataListOptions, buttonsManagerOptions,pageManagerOptions) {
	
	this.targetId = targetId;
	this.contextDataListOptions = {};
	this.buttonsManagerOptions = {};
	this.pageManagerOptions = {};
	
	var defaultContextDataListOptions = {
		targetId: 'context_data_list',
		targetClass: 'context_data_list',
		userTextTagContainer: 'h1',
		numberResults: 5,
		displayStyle: constants.ContextDataList_FULL_STYLE,
		userDescriptionClassContainer: 'context_description_container'
	};
	
	var defaultButtonsManagerOptions = {
		targetId: 'buttons_manager_container',
		targetClass: 'button_container',
		helpText: true,
		buttonsStyle:constants.ButtonsManager_ICONS_ONLY,
		pressedUnderlines:true
	};
	
	var defaultPageManagerOptions = {
		targetClass: 'page_manager_container',
		targetId: 'page_manager_container'
	}
	
	
	for(var key in defaultContextDataListOptions){
	     this.contextDataListOptions[key] = defaultContextDataListOptions[key];
	}
	for(var key in contextDataListOptions){
	     this.contextDataListOptions[key] = contextDataListOptions[key];
	}
	for(var key in defaultButtonsManagerOptions){
	     this.buttonsManagerOptions[key] = defaultButtonsManagerOptions[key];
	}
	for(var key in buttonsManagerOptions){
	     this.buttonsManagerOptions[key] = buttonsManagerOptions[key];
	}
	
	for(var key in defaultPageManagerOptions){
	     this.pageManagerOptions[key] = defaultPageManagerOptions[key];
	}
	for(var key in pageManagerOptions){
	     this.pageManagerOptions[key] = pageManagerOptions[key];
	}
	
	
        
}


/** 
 * BioCider functionality.
 * 
 * @class BioCider
 * 
 */
biocider.prototype = {
	constructor: biocider,

	      
        
	/**
	 * Creates the different objects and draw them.
	 */        
	draw : function (){
			
		this.initContainers();
						
		var contextDataListInstance = new ContextDataList(this.contextDataListOptions);
		
		// before initialising the main component, we should initialise its 'plugins'.
		var buttonsInstance = new ButtonsManager(contextDataListInstance,this.buttonsManagerOptions);
		buttonsInstance.buildPressedButtons();
		
		var pageManagerInstance = new PageManager(contextDataListInstance,this.pageManagerOptions);
		pageManagerInstance.build();
		
		
		//triggers the contextualised data loading process
		contextDataListInstance.drawContextDataList();
	},
	
	/**
	 * Function to create or reuse internal containers of each subcomponent.
	 */
	initContainers: function(){
		
		this.initContainer(this.targetId,
				this.buttonsManagerOptions['targetId'],
				this.buttonsManagerOptions['targetClass']);
		
		this.initContainer(this.targetId,
				this.pageManagerOptions['targetId'],
				this.pageManagerOptions['targetClass']);
		
		this.initContainer(this.targetId,
				this.contextDataListOptions['targetId'],
				this.contextDataListOptions['targetClass']);
		
		
		
	},
	
	/**
	 * Auxiliary function to create or reuse internal containers of one subcomponent.
	 * @param globalContainerId {string} Id of the BioCider div container.
	 * @param containerId {string} Id of the local subcomponent div container.
	 * @param containerClass {string} Class name to apply to the subcomponent container.
	 */
	initContainer : function(globalContainerId, containerId, containerClass){
		var globalContainerExists = false;
		var localContainerExists = false;
		var globalContainer = document.getElementById(globalContainerId);
		if (globalContainer != undefined || globalContainer != null){
			globalContainerExists = true;
		}
		if (containerId != undefined && containerId != null) {
			var container = document.getElementById(containerId);
			if (container != undefined && container != null) {
				container.classList.add(containerClass);
			}else{	// need to create the subcontainer
				container = document.createElement('div');
				container.id = containerId;
				container.classList.add(containerClass);
				if (globalContainerExists) {
					globalContainer.appendChild(container);
				}else{
					document.body.appendChild(container);
				}
			}
		}else{	// if we don't have a containerId, we can try to do the same with the className
			var possibleContainers = document.getElementsByClassName(containerClass);
			var container = null;
			if (possibleContainers != null && possibleContainers.length > 0) {
				container = possibleContainers[0];
			}
			
			if (container != undefined && container != null) {
				// nothing to do
			}else{	// need to create the subcontainer
				container = document.createElement('div');
				container.id = containerId;
				if (globalContainerExists) {
					globalContainer.appendChild(container);
				}else{
					document.body.appendChild(container);
				}
			}
		}
		
	}
        
        
}
          
module.exports = biocider;
  
},{"./ButtonsManager.js":1,"./ContextDataList.js":3,"./PageManager.js":8,"./constants.js":9}]},{},["biocider"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0J1dHRvbnNNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db21tb25EYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db250ZXh0RGF0YUxpc3QuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0RhdGFNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9FbGl4aXJFdmVudERhdGEuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0VsaXhpclJlZ2lzdHJ5RGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvRWxpeGlyVHJhaW5pbmdEYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9QYWdlTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiLi9qcy9CaW9DaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG5cbi8qKiBcbiAqIEJ1dHRvbnMnIGZpbHRlcmluZyBjb25zdHJ1Y3Rvci5cbiAqIFxuICogQGNsYXNzIEJ1dHRvbnNNYW5hZ2VyXG4gKlxuICogQHBhcmFtIHtDb250ZXh0RGF0YUxpc3QgT2JqZWN0fSBSZWZlcmVuY2UgdG8gQ29udGV4dERhdGFMaXN0IG9iamVjdCBpbiBvcmRlciB0byBtYW5hZ2UgaXRzIGZpbHRlcnMuXG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBCdXR0b25zTWFuYWdlciBjb21wb25lbnQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtoZWxwVGV4dF1cbiAqICAgIFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyBhIGhlbHAgdGV4dCBvdmVyIHRoZSBidXR0b25zLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbYnV0dG9uc1N0eWxlPSdTUVVBUkVEXzNEJyAsICdST1VORF9GTEFUJyBvciAnSUNPTlNfT05MWScuIElDT05TX09OTFkgYnkgZGVmYXVsdC5dXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBidXR0b25zIHZpc3VhbGlzYXRpb24gdHlwZS5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtwcmVzc2VkVW5kZXJsaW5lc11cbiAqICAgIFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyB1bmRlcmxpbmVzIHdoZW4geW91IHByZXNzIGEgYnV0dG9uLlxuICovXG52YXIgQnV0dG9uc01hbmFnZXIgPSBmdW5jdGlvbihjb250ZXh0RGF0YUxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG5cdFx0aGVscFRleHQ6IHRydWUsXG5cdFx0YnV0dG9uc1N0eWxlOiBjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfU1FVQVJFRF8zRCxcblx0XHRwcmVzc2VkVW5kZXJsaW5lczogZmFsc2Vcblx0fTtcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdFx0dGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1x0XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG5cdFx0dGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuXHR9XG4gICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0ID0gY29udGV4dERhdGFMaXN0O1xuXHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEgPSBbXTtcblx0Ly8gQkFTSUMgQlVUVE9OJ1MgREFUQTogTEFCRUwsIElOVEVSTkFMIENMQVNTIE5BTUUsIElOVEVSTkFMIE5BTUUgQU5EIEhFTFAgVEVYVFxuXHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEucHVzaChbJ0RhdGFiYXNlJywnZGF0YWJhc2UnLCdkYXRhYmFzZScsJ0RhdGFiYXNlcyddLFxuXHRcdFx0XHQgICBbJ0V2ZW50cycsJ2V2ZW50cycsJ0V2ZW50JywnRXZlbnRzJ10sXG5cdFx0XHRcdCAgIFsnVG9vbHMnLCd0b29scycsJ1Rvb2wnLCdUb29scyddLFxuXHRcdFx0XHQgICBbJ1RyYWluaW5nIG1hdGVyaWFscycsJ3RyYWluaW5nX21hdGVyaWFsJywnVHJhaW5pbmcgTWF0ZXJpYWwnLCdUcmFpbmluZyBtYXRlcmlhbHMnXVxuXHQpO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5yZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24odGhpcywgdGhpcy51cGRhdGVCdXR0b25zU3RhdHVzKTtcbn1cblxuLyoqXG4gKiAgICAgIEJ1dHRvbnNNYW5hZ2VyIGNsYXNzLiBSZXByZXNlbnRzIGEgc2V0IG9mIGZpbHRlcnMgc2VsZWN0YWJsZSB2aWEgYnV0dG9ucyBieSB1c2Vycy5cbiAqIFxuICogICAgICBAY2xhc3MgQnV0dG9uc01hbmFnZXJcbiAqICAgICAgXG4gKi9cbkJ1dHRvbnNNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IEJ1dHRvbnNNYW5hZ2VyLFxuICAgICAgICBidXR0b25zIDogW10sXG5cdFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgYnV0dG9ucyBzdGF0dXMgaGF2aW5nIGludG8gYWNjb3VudCBDb250ZXh0RGF0YUxpc3Qgc3RhdHVzXG4gICAgICAgICAqLyAgICAgICAgXG5cdHVwZGF0ZUJ1dHRvbnNTdGF0dXMgOiBmdW5jdGlvbiAoKXtcblx0XHRcblx0XHQvLyBXZSBkcmF3IHNsaWdodGx5IHNvZnRlciBidXR0b25zIG9mIHJlc291cmNlIHR5cGVzIHdpdGhvdXQgYW55IHJlc3VsdHNcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRmb3IodmFyIHByb3BlcnR5IGluIHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUpe1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHR2YXIgcHJvcGVydHlDb3VudCA9IHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGVbcHJvcGVydHldO1xuXHRcdFx0XHRcdHZhciBteUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BlcnR5KTtcblx0XHRcdFx0XHR0aGlzLnNldEJ1dHRvbkFzcGVjdEFzUmVzdWx0cyhteUJ1dHRvbixwcm9wZXJ0eUNvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XG5cdFx0fVxuXHR9LFxuICAgICAgICBcbiAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcbiAgICAgICAgICovICAgICAgICBcblx0YnVpbGRCdXR0b25zIDogZnVuY3Rpb24gKCl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5oZWxwVGV4dCl7XG5cdFx0XHR2YXIgaGVscFRleHRDb250YWluZXIgPSB0aGlzLmNyZWF0ZUJ1dHRvbnNIZWxwVGV4dCgpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKGhlbHBUZXh0Q29udGFpbmVyKTtcblx0XHR9XG5cdFx0dmFyIHJvd0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHJvd0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3Jvd19jb250YWluZXInKTtcblx0XHRcblx0XHRpZiAodGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aD4wKSB7XG5cdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbEZpbHRlcnMgPSBbXTtcblx0XHR9XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteUJ1dHRvbiA9IG51bGw7XG5cdFx0XHRpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX1JPVU5EX0ZMQVQgPT0gdGhpcy5idXR0b25zU3R5bGUpIHtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZVJvdW5kRmxhdEJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9ZWxzZSBpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFkgPT0gdGhpcy5idXR0b25zU3R5bGUpe1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlSWNvbk9ubHlCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG15QnV0dG9uID0gdGhpcy5jcmVhdGVTcXVhcmVkM0RkQnV0dG9uKGJ1dHRvbkRhdGFbMF0sYnV0dG9uRGF0YVsxXSxidXR0b25EYXRhWzJdKTtcblx0XHRcdH1cblx0XHRcdHZhciBteUJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bXlCdXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19jZWxsX2NvbnRhaW5lcicpO1xuXHRcdFx0bXlCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQobXlCdXR0b24pO1xuXHRcdFx0cm93Q29udGFpbmVyLmFwcGVuZENoaWxkKG15QnV0dG9uQ29udGFpbmVyKTtcblxuXHRcdFx0dGhpcy5idXR0b25zLnB1c2gobXlCdXR0b24pO1xuXHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3QudG90YWxGaWx0ZXJzLnB1c2goYnV0dG9uRGF0YVsyXSk7XG5cdFx0fVxuXHRcdFxuICAgICAgICAgICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChyb3dDb250YWluZXIpO1xuXHRcdFxuXHRcdGlmICh0aGlzLnByZXNzZWRVbmRlcmxpbmVzKXtcblx0XHRcdHZhciB1bmRlcmxpbmVzQ29udGFpbmVyID0gdGhpcy5jcmVhdGVCdXR0b25zVW5kZXJsaW5lQ29udGFpbmVyKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQodW5kZXJsaW5lc0NvbnRhaW5lcik7XG5cdFx0fVxuXHRcdFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRGaWx0ZXJzID0gdGhpcy5nZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucygpO1xuXHR9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogQ3JlYXRlcyBwcmVzc2VkIGJ1dHRvbnMgYW5kIGRyYXcgdGhlbSBpbnRvIHRoZSBlbGVtZW50IHdpdGggaWQgJ3RhcmdldElkJ1xuICAgICAgICAqLyAgXG4gICAgICAgIGJ1aWxkUHJlc3NlZEJ1dHRvbnMgOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRCdXR0b25zKCk7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNCdXR0b25QcmVzc2VkKHRoaXMuYnV0dG9uc1tpXSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dCdXR0b25DbGljayh0aGlzLmJ1dHRvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRGaWx0ZXJzID0gdGhpcy5nZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucygpO1xuXG4gICAgICAgIH0sXG5cdFxuXHRcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnUk9VTkRfRkxBVCcgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVSb3VuZEZsYXRCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYnV0dG9uLnRpdGxlID0gbGFiZWw7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0ICAgIGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbi5ocmVmID0gXCIjXCI7XG4gICAgICAgICAgICB2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0ICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdyb3VuZF9mbGF0Jyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgndW5wcmVzc2VkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcbiAgICAgICAgICAgIHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnU1FVQVJFRF8zRCcgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVTcXVhcmVkM0RkQnV0dG9uIDogZnVuY3Rpb24obGFiZWwsIGludGVybmFsQ2xhc3MsIGludGVybmFsTmFtZSl7XG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgdmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcbiAgICAgICAgICAgIGJ1dHRvbi50aXRsZSA9IGxhYmVsO1xuICAgICAgICAgICAgYnV0dG9uLm5hbWUgPSBpbnRlcm5hbE5hbWU7XG5cdCAgICBidXR0b24uaWQgPSBpbnRlcm5hbE5hbWU7XG4gICAgICAgICAgICBidXR0b24uaHJlZiA9IFwiI1wiO1xuICAgICAgICAgICAgdmFyIG15QnV0dG9uc01hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBteUJ1dHRvbnNNYW5hZ2VyLmZpbHRlcih0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uJyk7XG5cdCAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc3F1YXJlZF8zZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoaW50ZXJuYWxDbGFzcyk7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHdpdGggJ0lDT05fT05MWScgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVJY29uT25seUJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuXHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0dmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG5cdFx0YnV0dG9uLnRpdGxlID0gbGFiZWw7XG5cdFx0YnV0dG9uLm5hbWUgPSBpbnRlcm5hbE5hbWU7XG5cdFx0YnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuXHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0dmFyIG15QnV0dG9uc01hbmFnZXIgPSB0aGlzO1xuXHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0ICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuXHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbnNfb25seScpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcblx0XHRyZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgc3RhdHVzIG9mIHRoZSBidXR0b24gYW5kIGV4ZWN1dGVzIHRoZSByZWRyYXduIG9mIHRoZSBDb250ZXh0RGF0YUxpc3RcbiAgICAgICAgKiBvYmplY3QgaGF2aW5nIGludG8gYWNjb3VudCBjaG9zZW4gZmlsdGVycy5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gYmUgcHJlc3NlZC91bnByZXNzZWQuXG4gICAgICAgICovICBcbiAgICAgICAgZmlsdGVyOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgdGhpcy5zaG93QnV0dG9uQ2xpY2sobXlCdXR0b24pO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbERyYXdDb250ZXh0RGF0YUxpc3QoKTtcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgYXNwZWN0IG9mIG9uZSBidXR0b24gZGVwZW5kaW5nIG9uIGlmIGl0IGhhcyBhbnkgYXNzb2NpYXRlZCByZXN1bHQgb3Igbm90LlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBiZSBtb2RpZmllZC5cbiAgICAgICAgKiBAcGFyYW0gbnVtYmVyUmVzdWx0cyB7SW50ZWdlcn0gLSBOdW1iZXIgb2Ygb2NjdXJyZW5jZXMgYXNzb2NpYXRlZCB0byB0aGUgYnV0dG9uLlxuICAgICAgICAqLyBcbiAgICAgICAgc2V0QnV0dG9uQXNwZWN0QXNSZXN1bHRzOiBmdW5jdGlvbiAobXlCdXR0b24sIG51bWJlclJlc3VsdHMpe1xuXHRcdGlmIChteUJ1dHRvbiA9PSB1bmRlZmluZWQgfHwgbXlCdXR0b24gPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1x0ICAgIFxuXHRcdH1cblx0XHR2YXIgZW1wdHlUaXRsZVN1ZmZpeCA9ICcgKG5vIHJlc3VsdHMpJztcblx0XHRpZiAobnVtYmVyUmVzdWx0cyA9PSAwKSB7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk9PS0xKSB7XG5cdFx0XHRcdG15QnV0dG9uLnRpdGxlID0gbXlCdXR0b24udGl0bGUgKyBlbXB0eVRpdGxlU3VmZml4O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fWVsc2V7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk+LTEpIHtcblx0XHRcdFx0bXlCdXR0b24udGl0bGUucmVwbGFjZShlbXB0eVRpdGxlU3VmZml4LCcnKTtcblx0XHRcdH1cblx0XHR9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNoYW5nZXMgdGhlIGFzcGVjdCBvZiBvbmUgYnV0dG9uIGZyb20gcHJlc3NlZCB0byB1bnByZXNzZWQsIG9yIHZpY2UgdmVyc2EuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGJlIHByZXNzZWQvdW5wcmVzc2VkLlxuICAgICAgICAqLyBcbiAgICAgICAgc2hvd0J1dHRvbkNsaWNrOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuXHRcdG15QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJ1bnByZXNzZWRcIik7XG5cdFx0bXlCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcInByZXNzZWRcIik7XG5cdFx0aWYgKHRoaXMucHJlc3NlZFVuZGVybGluZXMpIHtcblx0XHRcdHZhciB1bmRlcmxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChteUJ1dHRvbi5pZCtcIl91bmRlcmxpbmVcIik7XG5cdFx0XHRpZiAodGhpcy5pc0J1dHRvblByZXNzZWQobXlCdXR0b24pKSB7XG5cdFx0XHRcdHVuZGVybGluZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR1bmRlcmxpbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgaWYgdGhlIGJ1dHRvbiBwYXNzZWQgYXMgYXJndW1lbnQgaXMgcHJlc3NlZCBvciBub3QuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGNoZWNrIGl0cyBzdGF0dXMuXG4gICAgICAgICoge0Jvb2xlYW59IC0gUmV0dXJucyBpZiBteUJ1dHRvbiBpcyBwcmVzc2VkIG9yIG5vdC5cbiAgICAgICAgKi9cbiAgICAgICAgaXNCdXR0b25QcmVzc2VkOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgaWYgKCFteUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJwcmVzc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfWVsc2UgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYWN0aXZlIGZpbHRlcnMgcmVsYXRlZCB3aXRoIHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKiB7QXJyYXl9IC0gQ3VycmVudCBhcHBsaWNhYmxlIGZpbHRlcnMuXG4gICAgICAgICovXG4gICAgICAgIGdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwcmVzc2VkQnV0dG9ucyA9IHRoaXMuZ2V0UHJlc3NlZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHByZXNzZWRCdXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaChwcmVzc2VkQnV0dG9uc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJzOyAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbGwgcHJlc3NlZCBidXR0b25zLlxuICAgICAgICAqIHtBcnJheX0gLSBDdXJyZW50IHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKi9cbiAgICAgICAgZ2V0UHJlc3NlZEJ1dHRvbnMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHByZXNzZWRCdXR0b25zID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0J1dHRvblByZXNzZWQodGhpcy5idXR0b25zW2ldKSl7XG4gICAgICAgICAgICAgICAgICAgIHByZXNzZWRCdXR0b25zLnB1c2godGhpcy5idXR0b25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJlc3NlZEJ1dHRvbnM7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXJhZ3JhcGggZWxlbWVudCB3aXRoIHNwZWNpZmljIHRleHQgYWJvdXQgZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvblxuXHQqICAge0hUTUwgT2JqZWN0fSAtIGRpdiBlbGVtZW50IHdpdGggaGVscCByZWxhdGVkIHRvIGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25zLlxuICAgICAgICAqL1xuXHRjcmVhdGVCdXR0b25zSGVscFRleHQgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBoZWxwX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGhlbHBfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfcm93X2NvbnRhaW5lcicpO1xuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbnNCYXNpY0RhdGFbaV07XG5cdFx0XHRcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaW5uZXJIVE1MID0gYnV0dG9uRGF0YVszXTtcblx0XHRcdG15VGV4dC5jbGFzc0xpc3QuYWRkKCdidXR0b25faGVscCcpO1xuXHRcdFx0aGVscF9jb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcdFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gaGVscF9jb250YWluZXI7XG5cdH0sXG5cdFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGFyYWdyYXBoIGVsZW1lbnQgd2l0aCBzcGVjaWZpYyB0ZXh0IGFib3V0IGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25cblx0KiAgIHtIVE1MIE9iamVjdH0gLSBkaXYgZWxlbWVudCB3aXRoIGhlbHAgcmVsYXRlZCB0byBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9ucy5cbiAgICAgICAgKi9cblx0Y3JlYXRlQnV0dG9uc1VuZGVybGluZUNvbnRhaW5lciA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHVuZGVybGluZXNfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dW5kZXJsaW5lc19jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19yb3dfY29udGFpbmVyJyk7XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaWQgPSBidXR0b25EYXRhWzJdK1wiX3VuZGVybGluZVwiO1xuXHRcdFx0bXlUZXh0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl91bmRlcmxpbmUnKTtcblx0XHRcdFxuXHRcdFx0dmFyIG15VW5kZXJsaW5lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRteVVuZGVybGluZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3VuZGVybGluZV9jZWxsX2NvbnRhaW5lcicpO1xuXHRcdFx0bXlVbmRlcmxpbmVDb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcblx0XHRcdHVuZGVybGluZXNfY29udGFpbmVyLmFwcGVuZENoaWxkKG15VW5kZXJsaW5lQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHVuZGVybGluZXNfY29udGFpbmVyO1xuXHR9XG59XG5cbi8vIFNUQVRJQyBBVFRSSUJVVEVTXG4vKlxudmFyIENPTlNUUyA9IHtcblx0Ly9zdHlsZSBvZiB2aXN1YWxpemF0aW9uXG5cdFNRVUFSRURfM0Q6XCJTUVVBUkVEXzNEXCIsXG5cdFJPVU5EX0ZMQVQ6XCJST1VORF9GTEFUXCIsXG5cdElDT05TX09OTFk6XCJJQ09OU19PTkxZXCJcbn07XG5cbmZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgIEJ1dHRvbnNNYW5hZ2VyW2tleV0gPSBDT05TVFNba2V5XTtcbn1cbiovICAgIFxuICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbnNNYW5hZ2VyO1xuICAgICAgXG4gICIsInZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIENvbW1vbkRhdGEgY29uc3RydWN0b3JcbiAqICAgICAgICAgIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogICAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgICAgICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgICAgICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKi9cbnZhciBDb21tb25EYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xufTtcblxuLyoqXG4gKiAgICAgICAgICBDb21tb24gcGFyZW50IGNsYXNzIHRoYXQgc2hvdWxkIGJlIGluaGVyaXRlZCBieSBhbGwgc3BlY2lmaWMgY2xhc3NlcyB0byBiZSBtYW5hZ2VkIG9uIHRoaXMgY29tcG9uZW50LlxuICovXG5Db21tb25EYXRhLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBDb21tb25EYXRhLFxuICAgICAgICAgICAgU09VUkNFX0ZJRUxEICAgICAgICAgICAgICAgIDogXCJzb3VyY2VcIixcbiAgICAgICAgICAgIFJFU09VUkNFX1RZUEVfRklFTEQgICAgICAgICA6IFwicmVzb3VyY2VfdHlwZVwiLFxuICAgICAgICAgICAgVElUTEVfRklFTEQgICAgICAgICAgICAgICAgIDogXCJ0aXRsZVwiLFxuICAgICAgICAgICAgVE9QSUNfRklFTEQgICAgICAgICAgICAgICAgIDogXCJmaWVsZFwiLFxuICAgICAgICAgICAgREVTQ1JJUFRJT05fRklFTEQgICAgICAgICAgIDogXCJkZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgTElOS19GSUVMRCAgICAgICAgICAgICAgICAgIDogXCJsaW5rXCIsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHJldHJpZXZlcyB0aGUgcHJvcGVyIGNsYXNzIG5hbWUgYmFzZWQgb24gdGhlIHJlYWwgcmVzb3VyY2UgdHlwZVxuICAgICAgICAgICAgbWFwcGluZ1Jlc291cmNlVHlwZUNsYXNzZXMgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnVG9vbCcgICAgICAgICAgICAgICAgICA6J3Rvb2xzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdXb3JrZmxvdycgICAgICAgICAgICAgIDond29ya2Zsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0RhdGFiYXNlJyAgICAgICAgICAgICAgOidkYXRhYmFzZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnVHJhaW5pbmcgTWF0ZXJpYWwnICAgICA6J3RyYWluaW5nX21hdGVyaWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdFdmVudCcgICAgICAgICAgICAgICAgIDonZXZlbnRzJ1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICAvKiogICAgICAgICBVVElMSVRZIEZVTkNUSU9OUyBUTyBHRVQgRklFTEQnUyBWQUxVRSAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIEF1eGlsaWFyIGZ1bmN0aW9uIHRvIGdldCBlYXNpbHkgYW55IGtpbmQgb2YgZGF0YSBwcmVzZW50IGluIHRoZSBpbnRlcm5hbFxuICAgICAgICAgICAgICogICAgICAgICAgZGF0YSBzdHJ1Y3R1cmUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gZmllbGROYW1lIHtTdHJpbmd9IC0gTmFtZSBvZiB0aGUgZmllbGQgdG8gYmUgcmV0dXJuZWQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFBhcmFtZXRlcmlzZWRWYWx1ZSA6IGZ1bmN0aW9uKGZpZWxkTmFtZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5qc29uRGF0YSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuanNvbkRhdGEgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25EYXRhW2ZpZWxkTmFtZV07ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIG1hbmRhdG9yeSBmaWVsZHNcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBzb3VyY2UgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHNvdXJjZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0U291cmNlVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuU09VUkNFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYWxsIHJlc291cmNlIHR5cGVzIHByZXNlbnQgaW4gdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIHJlc291cmNlIHR5cGVycyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFJlc291cmNlVHlwZVZhbHVlcyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5SRVNPVVJDRV9UWVBFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFNvbWV0aW1lcyBjYW4gYmUgZHVwbGljYXRlIHJlc291cmNlIHR5cGVzLlxuICAgICAgICAgICAgICogICAgICAgICAgVGhpcyBmdW5jdGlvbiBvbmx5IHJldHVybnMgdW5pcXVlIHJlc291cmNlIHR5cGVzLlxuICAgICAgICAgICAgICogICAgICAgICAge0FycmF5fSAtIEFycmF5IG9mIHN0cmluZ3Mgd2l0aCB1bmlxdWUgcmVzb3VyY2UgdHlwZXJzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRSZXNvdXJjZVR5cGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmlxdWVSZXNvdXJjZVR5cGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHJlc291cmNlVHlwZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISAodW5pcXVlUmVzb3VyY2VUeXBlcy5pbmRleE9mKHJlc291cmNlVHlwZXNbaV0pID4gLTEpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZVJlc291cmNlVHlwZXMucHVzaChyZXNvdXJjZVR5cGVzW2ldKTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmlxdWVSZXNvdXJjZVR5cGVzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgdGl0bGUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFRpdGxlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRUaXRsZVZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlRJVExFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYWxsIHRvcGljIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAge0FycmF5fSAtIFRvcGljcyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFRvcGljVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuVE9QSUNfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gb3B0aW9uYWwgZmllbGRzXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgdGhlIGRlc2NyaXB0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudGl0eSAoaWYgZXhpc3RzKS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gVGV4dHVhbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RGVzY3JpcHRpb25WYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5ERVNDUklQVElPTl9GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgdGhlIFVSTCB0byBhY2Nlc3MgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBvZiB0aGlzIGVudGl0eSAoaWYgZXhpc3RzKS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gU291cmNlJ3MgVVJMLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMaW5rVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuTElOS19GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgXG4gICAgICBcbiAgICAgICAgICAgIC8qKiAgICAgICAgIFNUQU5EQVJEIEZVTkNUSU9OUyBUTyBNQU5BR0UgSFRNTCBCRUhBVklPVVIgT0YgVEhJUyBFTlRJVFkgICAgICovXG4gICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUga2luZCBvZiBDb21tb25EYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudCBpbiBhIHdheSB0aGF0XG4gICAgICAgICAgICAgKiAgICAgICAgICBkZXBlbmRzIG9uIHdoYXQga2luZCBvZiBzdHlsZSB5b3Ugd2FudCBpdCB3aWxsIGJlIGRyYXduLlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGRpc3BsYXlTdHlsZSB7U3RyaW5nfSAtIE9uZSBkcmF3aW5nIHN0eWxlLiBDdXJyZW50bHkgQ29udGV4dERhdGFMaXN0LkNPTU1PTl9TVFlMRSBvciBDb250ZXh0RGF0YUxpc3QuRlVMTF9TVFlMRS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RHJhd2FibGVPYmplY3RCeVN0eWxlIDogZnVuY3Rpb24oZGlzcGxheVN0eWxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChkaXNwbGF5U3R5bGUgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxEcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIGltcHJvdmVkIHdheSBvZiByZXByZXNlbnRpbmcgYW55IENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAgSXQgaGFzIHRvIGJlIGV4dGVuZGVkIGJ5IGVhY2ggY2hpbGRyZW4gb2JqZWN0OyB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjYWxscyB0b1xuICAgICAgICAgICAgICogICAgICAgICAgZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEZ1bGxEcmF3YWJsZU9iamVjdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21tb25EcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nIGFueSBDb21tb25EYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGlzdEVsZW1lbnQuYXBwZW5kQ2hpbGQobWFpbkNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBsaXN0RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gQU5DSE9SIGVsZW1lbnQgd2l0aCAndGl0bGUnIGluZm9ybWF0aW9uIGxpbmtpbmcgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxUaXRsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX3RpdGxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzTG9jYWxVcmwodGhpcy5nZXRMaW5rVmFsdWUoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJleHRlcm5hbF9saW5rXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGl0bGUgPSAnRXh0ZXJuYWwgbGluayc7ICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJyx0aGlzLmdldExpbmtWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5nZXRUaXRsZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTb21ldGltZXMgZGVzY3JpcHRpb24gaGF2ZSBsb25nIHZhbHVlcyBhbmQgaXQgc2VlbXMgbW9yZSBsaWtlIGVycm9ycyFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGl0bGUgPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RvcGljcycgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBhbGwgJ3RvcGljcycgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxUb3BpY3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX3RvcGljc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYXdUb3BpY1ZhbHVlID0gdGhpcy5nZXRUb3BpY1ZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxTdHJpbmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmF3VG9waWNWYWx1ZS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsU3RyaW5nID0gZmluYWxTdHJpbmcgKyByYXdUb3BpY1ZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChpKzEpIDwgcmF3VG9waWNWYWx1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRmaW5hbFN0cmluZyArPSAnLCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGZpbmFsU3RyaW5nOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgc3RhbmRhcmQgdGV4dHVhbCB3YXkgb2YgcmVwcmVzZW50aW5nICdyZXNvdXJjZSB0eXBlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBTUEFOIGVsZW1lbnQgd2l0aCBhbGwgJ3Jlc291cmNlIHR5cGUnIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExhYmVsUmVzb3VyY2VUeXBlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFVuaXF1ZVJlc291cmNlVHlwZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBzdGFuZGFyZCB3YXkgKGFzIGEgc2V0IG9mIGltYWdlcykgb2YgcmVwcmVzZW50aW5nICdyZXNvdXJjZSB0eXBlJ1xuICAgICAgICAgICAgICogICAgICAgICAgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gU1BBTiBlbGVtZW50IHdpdGggYWxsICdyZXNvdXJjZSB0eXBlJyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoaXMgZW50aXR5XG4gICAgICAgICAgICAgKiAgICAgICAgICByZXByZXNlbnRlZCBhcyBzZXQgb2YgaW1hZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRJbWFnZVJlc291cmNlVHlwZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHJlc291cmNlVHlwZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VfdHlwZSA9IHJlc291cmNlVHlwZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGl0bGUgPSByZXNvdXJjZV90eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmxhdCBncmF5IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZsYXRfcmVzb3VyY2VfdHlwZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdncmF5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3VuZCBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Jlc291cmNlX3R5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjaXJjbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLm1hcHBpbmdSZXNvdXJjZVR5cGVDbGFzc2VzW3Jlc291cmNlX3R5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIGRpdiBvYmplY3Qgd2l0aCBhIHNob3J0IGRlc2NyaXB0aW9uIHRoYXQgY2FuIGJlIGV4cGFuZGVkIHRvIHNob3cgYSBsb25nZXIgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gc2hvcnRUZXh0IHtTdHJpbmd9IC0gVGV4dCBsaW5rIHRvIGhpZGUgb3IgZXhwYW5kIHRoZSBsb25nIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHQge1N0cmluZywgSFRNTCBFTEVNRU5UIG9yIEFycmF5IG9mIGJvdGh9IC0gTG9uZyBkZXNjcmlwdGlvbiBvciBIVE1MIGZpZWxkIHdpdGggYSBsb25nIGRlc2NyaXB0aW9uIG9mIHRoZSByZWNvcmQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHRDbGFzc2VzIHtBcnJheX0gLSBDbGFzc2VzIHRvIG1vZGlmeSB0aGUgYXNwZWN0IG9mIHRoZSBleHBhbmRhYmxlIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBib3RoIHNob3J0IGFuZCBmaWVsZCBkZXNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEV4cGFuZGFibGVUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0LCBsb25nVGV4dENsYXNzZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGFibGVfZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW50TnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMCAtIDApKSArIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZXMgdGhlIGxpbmsgdG8gaGlkZSBhbmQgc2hvdyB0aGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2Rpdl90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVfXCIrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2V4cGFuZHNpZ25hbCA9IFwiWytdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9oaWRlc2lnbmFsID0gXCJbLV1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgbW9yZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZVRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X3RpdGxlXycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MID1leHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MLnJlcGxhY2UodG9leHBhbmRzaWduYWwsdG9oaWRlc2lnbmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVUaXRsZS50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBoaWRlIHRoZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLmlubmVySFRNTCA9IGV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwucmVwbGFjZSh0b2hpZGVzaWduYWwsdG9leHBhbmRzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSBtb3JlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlcyB0aGUgaW50ZXJuYWwgZGl2IHdpdGggdGhlIGZ1bGwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRlcm5hbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbG9uZ1RleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5pbm5lckhUTUwgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb2YgSFRNTCBvYmplY3RzIG9yIHN0cmluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxvbmdUZXh0KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGxvbmdUZXh0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb25nVGV4dFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmlubmVySFRNTCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVE1MIG9iamVjdCAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpQz0wO2lDPGxvbmdUZXh0Q2xhc3Nlcy5sZW5ndGg7aUMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpQ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuYXBwZW5kQ2hpbGQobmV3U3BhbkVsZW1lbnQpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnRlcm5hbERpdik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgZGl2IGNvbnRhaW5lciB3aXRoIGEgbGluayB0byBhbiBhbGVydCB0byBzaG93IGEgbG9uZyBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBzaG9ydFRleHQge1N0cmluZ30gLSBUZXh0IGxpbmsgdG8gc2hvdyB0aGUgbG9uZyB0ZXh0LlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGxvbmdUZXh0IHtTdHJpbmcsIEhUTUwgRUxFTUVOVCBvciBBcnJheSBvZiBib3RofSAtIExvbmcgZGVzY3JpcHRpb24gb3IgSFRNTCBmaWVsZCB3aXRoIGEgbG9uZyBkZXNjcmlwdGlvbiBvZiB0aGUgcmVjb3JkLlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIERJViBlbGVtZW50IHdpdGggYm90aCBzaG9ydCBhbmQgZmllbGQgZGVzY3JpcHRpb25zLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMb25nRmxvYXRpbmdUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdleHBhbmRhYmxlX2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbUludE51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAgLSAwKSkgKyAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVzIHRoZSBsaW5rIHRvIGhpZGUgYW5kIHNob3cgdGhlIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2lkJyxcImV4cGFuZGFibGVfZGl2X3RpdGxlX1wiK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9leHBhbmRzaWduYWwgPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgdGhlIGxvbmcgdGV4dCBpbnRvIGEgbmV3IGxpdHRsZSB3aW5kb3dcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl90aXRsZV8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXZfJytyYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGxvbmdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBBdXhpbGlhcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGlmIG9uZSBVUkwgYmVsb25nIHRvIHRoZSBjdXJyZW50IHVzZXIncyBwYWdlIGRvbWFpbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSB1cmwge1N0cmluZ30gLSBsaW5rIHRvIGFuYWx5c2UuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7Qm9vbGVhbn0gLSBUcnVlIGlmIHRoZSBVUkwgYmVsb25ncyB0byB0aGUgbWFpbiB1c2VyJ3MgcGFnZSBkb21haW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlzTG9jYWxVcmw6IGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RG9tYWluICE9IG51bGwgJiYgdGhpcy5jdXJyZW50RG9tYWluLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSB1cmwuaW5kZXhPZih0aGlzLmN1cnJlbnREb21haW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIFxufTtcblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdE1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTjogMTAwMFxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQ29tbW9uRGF0YVtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uRGF0YTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXIuanNcIik7XG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG52YXIgcmVxd2VzdCA9IHJlcXVpcmUoXCJyZXF3ZXN0XCIpO1xuXG4vKiogXG4gKiBDb250ZXh0RGF0YUxpc3QgQ29uc3RydWN0b3IuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3QgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBUeXBlIG9mIHJvd3MgdmlzdWFsaXNhdGlvbi5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0SWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dFRhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlclRleHRJZENvbnRhaW5lciBvciB1c2VyVGV4dENsYXNzQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiAgICBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0lkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzVGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgVGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgb3IgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIEBvcHRpb24ge0hUTUwgb2JqZWN0fSBbdXNlcktleXdvcmRzQ29udGFpbmVyPVRoZSBodG1sIGtleXdvcmRzIGNvbnRhaW5lciBpdHNlbGYuIF1cbiAqICAgIEhUTUwgb2JqZWN0IHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyLCB1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciBvciB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGRlc2NyaXB0aW9uIHRvIGhlbHAgZmlsdGVyIHNhbWUgcmVzdWx0cyB0aGF0IHVzZXIgaXMgc2VlaW5nLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlckhlbHBDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIENsYXNzIG5hbWUgdGhhdCB3aWxsIGNvbnRhaW5zIGhlbHAgaWNvbi5cbiAqIEBvcHRpb24ge2ludH0gW251bWJlclJlc3VsdHM9bnVtYmVyIF1cbiAqICAgIEludGVnZXIgdGhhdCByZXN0cmljdHMgdGhlIHJlc3VsdHMgbnVtYmVyIHRoYXQgc2hvdWxkIGJlIHNob3duLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW2luY2x1ZGVTYW1lU2l0ZVJlc3VsdHM9SWYgeW91IHdhbnQgdG8gc2VlIHJlY29yZHMgb2YgeW91ciBwcmVzZW50IHNpdGUuIFRlbXBvcmFyeSBkaXNhYmxlZC4gXVxuICogICAgQm9vbGVhbiB0aGF0IGF2b2lkcyBvciBub3QgcmVzdWx0cyBmcm9tIHRoZSBzYW1lIHNpdGUgeW91IGFyZSBzZWVpbmcuICovXG4vL2Z1bmN0aW9uIENvbnRleHREYXRhTGlzdCAob3B0aW9ucykge1xudmFyIENvbnRleHREYXRhTGlzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHsgICAgICAgIFxuXHQgICAgIGRpc3BsYXlTdHlsZTogY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFLFxuXHQgICAgIGluY2x1ZGVTYW1lU2l0ZVJlc3VsdHMgOiB0cnVlXG5cdH07XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0ICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cblx0dGhpcy5jb250ZXh0RGF0YVNlcnZlciA9IFwiaHR0cDovL3d3dy5iaW9jaWRlci5vcmc6ODk4My9zb2xyL2NvbnRleHREYXRhXCI7XG5cdFxuXHRcblx0Ly8gZ2xvYmFsIGN1cnJlbnQgc3RhdHVzXG5cdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cz0gbnVsbDtcblx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQ9IG51bGw7XG5cdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHM9IG51bGw7XG5cdHRoaXMuY3VycmVudFN0YXR1cz0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HO1xuXHR0aGlzLmN1cnJlbnRGaWx0ZXJzPSBudWxsO1xuXHR0aGlzLnRvdGFsRmlsdGVycz1udWxsO1xuXHR0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGU9IG51bGw7XG5cdHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlPSBudWxsO1xuXHRcblx0dGhpcy5jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdHRoaXMuY3VycmVudERvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcblx0XG5cdHRoaXMuX29uTG9hZGVkRnVuY3Rpb25zPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0YU1hbmFnZXIgPSBuZXcgRGF0YU1hbmFnZXIoeydjdXJyZW50RG9tYWluJzp0aGlzLmN1cnJlbnREb21haW59KTtcblx0XG5cdC8vdGhpcy5kcmF3SGVscEltYWdlKCk7XG5cdFxuICAgICAgXG59XG5cblxuXG4vKiogXG4gKiBSZXNvdXJjZSBjb250ZXh0dWFsaXNhdGlvbiB3aWRnZXQuXG4gKiBcbiAqIFxuICogQGNsYXNzIENvbnRleHREYXRhTGlzdFxuICpcbiAqL1xuQ29udGV4dERhdGFMaXN0LnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IENvbnRleHREYXRhTGlzdCxcblx0XG5cdC8qKlxuXHQgKiBTaG93cyB0aGUgY29udGV4dHVhbGlzZWQgZGF0YSBpbnRvIHRoZSB3aWRnZXQuXG5cdCAqL1xuXHRkcmF3Q29udGV4dERhdGFMaXN0IDogZnVuY3Rpb24gKCl7XG5cdFx0Ly9jb25zb2xlLmxvZygnQ29udGV4dERhdGFMaXN0LkxPQURJTkcsJytjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpO1xuXHRcdC8vY29uc29sZS5sb2coJ0NvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEUsJytjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRSk7XG5cdFx0dGhpcy5jdXJyZW50U3RhdHVzID0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HO1xuXHRcdC8vdGhpcy51cGRhdGVHbG9iYWxTdGF0dXModGhpcy5MT0FESU5HKTtcblx0XHR2YXIgdXNlclRleHQgPSB0aGlzLmdldFVzZXJTZWFyY2goKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcktleXdvcmRzID0gdGhpcy5nZXRVc2VyS2V5d29yZHMoKTtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGtleXdvcmRzLCB3ZSBjYW4gam9pbiB0aGVtIHRvIHRoZSB1c2VyVGV4dC5cbiAgICAgICAgICAgICAgICBpZiAodXNlcktleXdvcmRzIT1udWxsICYmIHVzZXJLZXl3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dXNlcktleXdvcmRzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJUZXh0ID0gdXNlclRleHQgK1wiIFwiK3VzZXJLZXl3b3Jkc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblx0XHR2YXIgdXNlckRlc2NyaXB0aW9uID0gdGhpcy5nZXRVc2VyQ29udGVudERlc2NyaXB0aW9uKCk7XG5cdFx0dmFyIG1heFJvd3MgPSB0aGlzLmdldE1heFJvd3MoKTtcblx0XHR2YXIgbmV3VXJsID0gdGhpcy5fZ2V0TmV3VXJsKHVzZXJUZXh0LCB1c2VyRGVzY3JpcHRpb24sIHRoaXMuY3VycmVudEZpbHRlcnMsIHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0LCBtYXhSb3dzKTtcblx0XHR0aGlzLnByb2Nlc3NEYXRhRnJvbVVybChuZXdVcmwpO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFNob3dzIHRoZSBjb250ZXh0dWFsaXNlZCBkYXRhIGludG8gdGhlIHdpZGdldCwgdXBkYXRpbmcgdGhlIHdob2xlIGludGVybmFsIHN0YXR1cyBvZiB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0dG90YWxEcmF3Q29udGV4dERhdGFMaXN0IDogZnVuY3Rpb24gKCl7XG5cdFx0dGhpcy51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKTtcblx0XHR0aGlzLmRyYXdDb250ZXh0RGF0YUxpc3QoKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIFVzZXIncyB0ZXh0IHRvIGNvbnRleHR1YWxpc2UsIGlmIGl0IGV4aXN0cy5cbiAgICAgICAgICoge1N0cmluZ30gLSBUZXh0IGZvdW5kIGludG8gdGhlIGNsaWVudCBkb2N1bWVudCB0aGF0IGNvbnRhaW5zIENvbnRleHR1YWxpc2F0aW9uIHdpZGdldC5cblx0ICovXG5cdGdldFVzZXJTZWFyY2ggOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdXNlclRleHQgPSAnJztcblx0XHR2YXIgZWxlbWVudHNDb250YWluZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJUZXh0SWRDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlclRleHRJZENvbnRhaW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzQ29udGFpbmVyID0gW107XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyWzBdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy51c2VyVGV4dElkQ29udGFpbmVyKTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VyVGV4dENsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJUZXh0Q2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlclRleHRDbGFzc0NvbnRhaW5lcik7XG5cdFx0fWVsc2V7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlclRleHRUYWdDb250YWluZXIpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcblx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0O1xuXHRcdFx0aWYgKHVzZXJUZXh0ID09IHVuZGVmaW5lZCB8fCB1c2VyVGV4dCA9PSBudWxsKSB7XG5cdFx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdXNlclRleHQ7XG5cdH0sXG5cdFxuICAgICAgICBcblx0LyoqXG5cdCAqIFJldHVybnMgVXNlcidzIGtleXdvcmRzIGluIG9yZGVyIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMsIGlmIHRoZXkgZXhpc3QuXG4gICAgICAgICAqIHtBcnJheX0gLSBMaXN0IG9mIGtleXdvcmRzIGZvdW5kIGludG8gdGhlIGNsaWVudCBkb2N1bWVudCB0aGF0IGNhbiBoZWxwIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG5cdCAqL1xuXHRnZXRVc2VyS2V5d29yZHMgOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdXNlcktleXdvcmRzID0gW107XG5cdFx0dmFyIGVsZW1lbnRzQ29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyS2V5d29yZHNJZENvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyS2V5d29yZHNJZENvbnRhaW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzQ29udGFpbmVyID0gW107XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyWzBdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy51c2VyS2V5d29yZHNJZENvbnRhaW5lcik7XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lcik7XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlcktleXdvcmRzVGFnQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJLZXl3b3Jkc1RhZ0NvbnRhaW5lciAhPSBudWxsKXtcblx0XHQgICAgZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0aGlzLnVzZXJLZXl3b3Jkc1RhZ0NvbnRhaW5lcik7XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlcktleXdvcmRzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJLZXl3b3Jkc0NvbnRhaW5lciAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNDb250YWluZXIgPSBbXTtcblx0XHQgICAgZWxlbWVudHNDb250YWluZXJbMF0gPSB0aGlzLnVzZXJLZXl3b3Jkc0NvbnRhaW5lcjtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKGVsZW1lbnRzQ29udGFpbmVyICE9IG51bGwgJiYgZWxlbWVudHNDb250YWluZXIubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIG15Rmlyc3RFbGVtZW50ID0gZWxlbWVudHNDb250YWluZXJbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IG15Rmlyc3RFbGVtZW50LmlubmVyVGV4dCB8fCBteUZpcnN0RWxlbWVudC50ZXh0Q29udGVudDtcblx0XHRcdHVzZXJLZXl3b3JkcyA9IGNvbnRlbnQuc3BsaXQoXCIgXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gdXNlcktleXdvcmRzO1xuXHR9LFxuICAgICAgICBcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBSZXR1cm5zIFVzZXIncyBkZXNjcmlwdGlvbiB0byBoZWxwIGZpbHRlciBzYW1lIHJlc3VsdHMgdGhhbiB1c2VyIGlzIHNlZWluZy5cbiAgICAgICAgICoge1N0cmluZ30gLSBUZXh0IGZvdW5kIGludG8gdGhlIGNsaWVudCBkb2N1bWVudC5cblx0ICovXG5cdGdldFVzZXJDb250ZW50RGVzY3JpcHRpb24gOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZGVzY3JpcHRpb24gPSAnJztcblx0XHR2YXIgZWxlbWVudHNDb250YWluZXIgPSBudWxsO1xuXHRcdGlmICh0aGlzLnVzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnVzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyKTtcblx0XHR9LyplbHNle1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0aGlzLnVzZXJEZXNjcmlwdGlvblRhZ0NvbnRhaW5lcik7XG5cdFx0fSovXG5cdFx0XG5cdFx0aWYgKGVsZW1lbnRzQ29udGFpbmVyICE9IG51bGwgJiYgZWxlbWVudHNDb250YWluZXIubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIG15Rmlyc3RFbGVtZW50ID0gZWxlbWVudHNDb250YWluZXJbMF07XG5cdFx0XHRkZXNjcmlwdGlvbiA9IG15Rmlyc3RFbGVtZW50LmlubmVyVGV4dDtcblx0XHRcdGlmIChkZXNjcmlwdGlvbiA9PSB1bmRlZmluZWQgfHwgZGVzY3JpcHRpb24gPT0gbnVsbCkge1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IG15Rmlyc3RFbGVtZW50LmlubmVySFRNTDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGRlc2NyaXB0aW9uO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0aGF0IGNhbiBiZSBzaG93biBpbnRvIHRoZSB3aWRnZXQuXG4gICAgICAgICAqIHtJbnRlZ2VyfSAtIE1heGltdW0gYW1vdW50IG9mIHJlc3VsdHMgdGhhdCBjYW4gYmUgc2hvd24gYXQgdGhlIHNhbWUgdGltZS5cblx0ICovXG5cdGdldE1heFJvd3MgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtYXhSb3dzID0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9NQVhfUk9XUztcblx0XHRpZiAodGhpcy5udW1iZXJSZXN1bHRzICE9IFwidW5kZWZpbmVkXCIgJiYgIWlzTmFOKHRoaXMubnVtYmVyUmVzdWx0cykgJiYgdHlwZW9mIHRoaXMubnVtYmVyUmVzdWx0cyA9PT0gJ251bWJlcicgJiYgKHRoaXMubnVtYmVyUmVzdWx0cyAlIDEgPT09IDApICkge1xuXHRcdFx0aWYgKHRoaXMubnVtYmVyUmVzdWx0cyA8IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTUFYX1JPV1MpIHtcblx0XHRcdFx0bWF4Um93cyA9IHRoaXMubnVtYmVyUmVzdWx0cztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1heFJvd3M7XG5cdH0sXG5cblxuXHQvKipcblx0ICogQ3JlYXRlIGEgdXJsIHRvIHRoZSBTb2xSIGRhdGFiYXNlIHdpdGggYWxsIGR5bmFtaWMgcGFyYW1ldGVycyBnZW5lcmF0ZWQgZnJvbSB0aGVzZSBhcmd1bWVudHMuXG5cdCAqIEBwYXJhbSBmaWVsZFRleHQge3N0cmluZ30gVGV4dCB0byBzZWFyY2guXG5cdCAqIEBwYXJhbSBkZXNjcmlwdGlvblRleHQge3N0cmluZ30gQXNzb2NpYXRlZCBkZXNjcmlwdGlvbiBvZiB0aGUgY29udGVudC5cblx0ICogQHBhcmFtIGZpbHRlcnMge0FycmF5fSBBcnJheSBvZiBmaWx0ZXJzIC0gT25seSByZXN1bHRzIHdpdGggb25lIG9mIHRoZXNlIHJlc291cmNlIHR5cGVzIHdpbGwgYmUgZ2V0LlxuXHQgKiBAcGFyYW0gc3RhcnQge2ludGVnZXJ9IFBvc2l0aW9uIG9mIHRoZSBmaXJzdCByZXN1bHQgdG8gcmV0cmlldmUuXG5cdCAqIEBwYXJhbSByb3dzTnVtYmVyIHtpbnRlZ2VyfSBJbmRpY2F0ZXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdGhhdCB3aWxsIGJlIHNob3duIG9uIHRoZSBzY3JlZW47XG5cdCAqL1xuXHRfZ2V0TmV3VXJsIDogZnVuY3Rpb24oZmllbGRUZXh0LCBkZXNjcmlwdGlvblRleHQsIGZpbHRlcnMsIHN0YXJ0LCByb3dzTnVtYmVyKXtcblx0XHQvL2NvbnNvbGUubG9nKCdfZ2V0TmV3VXJsLCBmaWVsZFRleHQ6ICcrZmllbGRUZXh0KycsIGRlc2NyaXB0aW9uVGV4dDogJytkZXNjcmlwdGlvblRleHQrJywgZmlsdGVyczogJytmaWx0ZXJzKycsIHN0YXJ0OiAnK3N0YXJ0KycsIHJvd3NOdW1iZXI6ICcrcm93c051bWJlcik7XG5cdFx0dmFyIGNvdW50ID0gMDtcblx0XHR2YXIgdXJsID0gXCJcIjtcblx0XHRcblx0XHR2YXIgd29yZHMgPSBmaWVsZFRleHQuc3BsaXQoXCIgXCIpO1xuXHRcdHZhciBzZWFyY2hQaHJhc2UgPSBcIlwiO1xuXHRcdHdoaWxlIChjb3VudCA8IHdvcmRzLmxlbmd0aCkge1xuXHRcdFx0c2VhcmNoUGhyYXNlICs9IHdvcmRzW2NvdW50XTtcblx0XHRcdGNvdW50Kys7XG5cdFx0XHRpZihjb3VudCA8IHdvcmRzLmxlbmd0aCl7c2VhcmNoUGhyYXNlICs9ICcrJ31cblx0XHR9XG5cdFx0Ly8gd2UgZXhjbHVkZSBhbGwgcmVzdWx0cyBmcm9tIHRoaXMgZG9tYWluOiBkaXNhYmxlZCB1bnRpbCByZWluZGV4aW5nXG5cdFx0LyppZiAoIXRoaXMuaW5jbHVkZVNhbWVTaXRlUmVzdWx0cykge1xuXHRcdFx0dmFyIGV4Y2x1ZGluZ1BocmFzZSA9IFwiXCI7XG5cdFx0XHQvL2V4Y2x1ZGluZ1BocmFzZSA9IFwiIE5PVChcIit0aGlzLmN1cnJlbnREb21haW4rXCIpXCI7XG5cdFx0XHRleGNsdWRpbmdQaHJhc2UgPSBcIi1cXFwiKnRnYWMuYWMudWsqXFxcIlwiO1xuXHRcdFx0c2VhcmNoUGhyYXNlID0gXCIoXCIrc2VhcmNoUGhyYXNlK2V4Y2x1ZGluZ1BocmFzZStcIilcIjtcblx0XHQvLyB3ZSBleGNsdWRlIG9ubHkgdGhlIHNhbWUgcmVjb3JkIHRoYW4gdXNlciBpc1xuXHRcdH1lbHNleyovXG5cdFx0LypcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRVUkwgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5jdXJyZW50VVJMICE9IG51bGwpIHtcblx0XHRcdHZhciBleGNsdWRpbmdQaHJhc2UgPSBcIlwiO1xuXHRcdFx0Ly8gVGhlcmUgYXJlIHNvbWUgY2hhcmFjdGVycyB0aGF0IGNhbiBicmVhayB0aGUgZnVsbCBVUkw7IHdlIHJlbW92ZSB0aGVtLlxuXHRcdFx0dmFyIGN1cmF0ZWRVUkwgPSB0aGlzLmN1cnJlbnRVUkwucmVwbGFjZSgnIycsJycpO1xuXHRcdFx0ZXhjbHVkaW5nUGhyYXNlID0gXCIgTk9UKFxcXCJcIitjdXJhdGVkVVJMK1wiXFxcIilcIjtcblx0XHRcdHNlYXJjaFBocmFzZSA9IFwiKFwiK3NlYXJjaFBocmFzZStcIikgQU5EIFwiK2V4Y2x1ZGluZ1BocmFzZTtcblx0XHR9Ki9cblx0XHRzZWFyY2hQaHJhc2UgPSBcIihcIitzZWFyY2hQaHJhc2UrXCIpXCI7XHRcblx0XHRcblx0XHQvL31cdFxuXHRcdFxuXHRcdHVybCA9IHRoaXMuY29udGV4dERhdGFTZXJ2ZXIrXCIvc2VsZWN0P2RlZlR5cGU9ZWRpc21heCZxPVwiK3NlYXJjaFBocmFzZTtcblx0XHRcblx0XHR2YXIgZnEgPSBudWxsO1xuXHRcdGlmIChmaWx0ZXJzICE9PSBcInVuZGVmaW5lZFwiICYmIGZpbHRlcnMhPW51bGwgKSB7XG5cdFx0XHRpZiAoZmlsdGVycyBpbnN0YW5jZW9mIEFycmF5ICYmIGZpbHRlcnMubGVuZ3RoPjApIHtcblx0XHRcdFx0ZnEgPSBcIlwiO1xuXHRcdFx0XHR2YXIgZmlsdGVyQ291bnQgPSAwO1xuXHRcdFx0XHR2YXIgZmlsdGVyQ2hhaW4gPSBcIlwiO1xuXHRcdFx0XHR3aGlsZSAoZmlsdGVyQ291bnQgPCBmaWx0ZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZpbHRlckNoYWluICs9IFwiJ1wiK2ZpbHRlcnNbZmlsdGVyQ291bnRdK1wiJ1wiO1xuXHRcdFx0XHRcdGZpbHRlckNvdW50Kys7XG5cdFx0XHRcdFx0aWYoZmlsdGVyQ291bnQgPCBmaWx0ZXJzLmxlbmd0aCl7ZmlsdGVyQ2hhaW4gKz0gJyBPUiAnfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZxPVwicmVzb3VyY2VfdHlwZTooXCIrZmlsdGVyQ2hhaW4rXCIpXCI7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZnEgPSBcInJlc291cmNlX3R5cGU6dW5kZWZpbmVkXCI7XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmN1cnJlbnRVUkwgIT0gbnVsbCkge1xuXHRcdFx0aWYgKGZxPT1udWxsKSB7XG5cdFx0XHRcdGZxID0gXCIqOipcIjtcblx0XHRcdH1cblx0XHRcdC8vIFRoZXJlIGFyZSBzb21lIGNoYXJhY3RlcnMgdGhhdCBjYW4gYnJlYWsgdGhlIGZ1bGwgVVJMOyB3ZSByZW1vdmUgdGhlbS5cblx0XHRcdHZhciBjdXJhdGVkVVJMID0gdGhpcy5jdXJyZW50VVJMLnJlcGxhY2UoJyMnLCcnKTtcblx0XHRcdHZhciBsaW5rRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5MSU5LX0ZJRUxEO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK2xpbmtGaWVsZCtcIjpcXFwiXCIrY3VyYXRlZFVSTCtcIlxcXCJcIjtcdFxuXHRcdH1cblx0ICAgICAgICBcblx0XHQvLyBJZiB3ZSBoYXZlIGRlc2NyaXB0aW9uLCB3ZSBjYW4gdHJ5IHRvIGZpbHRlciB1bmRlc2lyZWQgcmVzdWx0cyAoaS5lLiwgcmVzdWx0cyB0aGF0IGFyZSB0aGUgc2FtZSB0aGFuIHVzZXIncyBjdXJyZW50IHBhZ2UpXG5cdFx0aWYgKGRlc2NyaXB0aW9uVGV4dCAhPSBudWxsKSB7XG5cdFx0XHRpZiAoZnE9PW51bGwpIHtcblx0XHRcdFx0ZnEgPSBcIio6KlwiO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR2YXIgZGVzY1VzZWQgPSBkZXNjcmlwdGlvblRleHQ7XG5cdFx0XHRpZiAoZGVzY1VzZWQubGVuZ3RoPmNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTikge1xuXHRcdFx0XHRkZXNjVXNlZCA9IGRlc2NVc2VkLnNwbGl0KFwiIFwiKS5zbGljZSgwLGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTikuam9pbihcIiBcIik7XG5cdFx0XHR9XG5cdFx0XHQvLyB3ZSByZW1vdmUgd2VpcmQgY2hhcmFjdGVycyBhbmQgXCJcblx0XHRcdGRlc2NVc2VkID0gZGVzY1VzZWQucmVwbGFjZSgvXFxcIi9nLCcnKTtcblx0XHRcdGRlc2NVc2VkID0gZW5jb2RlVVJJQ29tcG9uZW50KGRlc2NVc2VkKTtcblx0XHRcdFxuXHRcdFx0dmFyIGRlc2NyaXB0aW9uRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5ERVNDUklQVElPTl9GSUVMRDtcblx0XHRcdGZxID0gZnErXCIgQU5EIC1cIitkZXNjcmlwdGlvbkZpZWxkK1wiOlxcXCJcIitkZXNjVXNlZCtcIlxcXCJcIjtcblx0XHRcdFxuXHRcdFx0dmFyIHRpdGxlRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5USVRMRV9GSUVMRDtcblx0XHRcdGZxID0gZnErXCIgQU5EIC1cIit0aXRsZUZpZWxkK1wiOlxcXCJcIitmaWVsZFRleHQrXCJcXFwiXCI7XG5cdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKGZxIT1udWxsKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCImZnE9XCIrZnE7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIHFmXG5cdFx0dXJsID0gdXJsK1wiJnFmPXRpdGxlXjIuMCtmaWVsZF4yLjArZGVzY3JpcHRpb25eMS4wXCI7XG5cdFx0XG5cdFx0Ly8gc3RhcnQgcm93XG5cdFx0aWYgKHN0YXJ0ICE9PSBcInVuZGVmaW5lZFwiICYmIHN0YXJ0IT1udWxsICYmICFpc05hTihzdGFydCkgJiYgdHlwZW9mIHN0YXJ0ID09PSAnbnVtYmVyJyAmJiAoc3RhcnQgJSAxID09PSAwKSApIHtcblx0XHRcdHVybCA9IHVybCtcIiZzdGFydD1cIitzdGFydDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gc3RhcnQ7XG5cdFx0fWVsc2V7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IDA7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIG51bSByb3dzXG5cdFx0aWYgKHJvd3NOdW1iZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgcm93c051bWJlciE9bnVsbCAmJiByb3dzTnVtYmVyIT1udWxsICYmICFpc05hTihyb3dzTnVtYmVyKSAmJiB0eXBlb2Ygcm93c051bWJlciA9PT0gJ251bWJlcicgJiYgKHJvd3NOdW1iZXIgJSAxID09PSAwKSApIHtcblx0XHRcdHVybCA9IHVybCtcIiZyb3dzPVwiK3Jvd3NOdW1iZXI7XG5cdFx0fVxuXHRcdFx0XG5cdFx0XHRcblx0XHQvLyBTdGF0cy4gV2UgY291bnQgYWxsIHRoZSBkaWZmZXJlbnQgcmVzdWx0cyBieSByZXNvdXJjZSB0eXBlXG5cdFx0dXJsID0gdXJsK1wiJmZhY2V0PXRydWUmZmFjZXQubWV0aG9kPWVudW0mZmFjZXQubGltaXQ9LTEmZmFjZXQuZmllbGQ9cmVzb3VyY2VfdHlwZVwiXG5cdFx0XG5cdFx0XHRcdFxuXHRcdC8vIHd0XG5cdFx0dXJsID0gdXJsK1wiJnd0PWpzb25cIjtcblx0XHRcblx0XHQvLyBtYXliZSB3ZSBjb3VsZCBhbHNvIGZpbHRlciBmaWVsZHMgdGhhdCB3ZSByZXR1cm5cblx0XHQvLyAmZmw9c3RhcnQsdGl0bGUsbm90ZXMsbGlua1xuXHRcdFxuXHRcdFxuXHRcdHJldHVybiB1cmw7XG5cdH0sXG5cdFxuXHRcblx0XG5cdC8qKlxuXHQgKiBNYWtlcyBhbiBhc3luY2hyb25vdXMgcmVxdWVzdCB0byB0aGUgQ29udGV4dHVhbGlzYXRpb24gZGF0YSBzZXJ2ZXIgYW5kIHByb2Nlc3MgaXRzIHJlcGx5LlxuXHQgKiBAcGFyYW0gdXJsIHtzdHJpbmd9IC0gVW5pZm9ybSBSZXNvdXJjZSBMb2NhdG9yXG5cdCAqL1xuXHRwcm9jZXNzRGF0YUZyb21Vcmw6IGZ1bmN0aW9uKHVybCl7XG5cdFx0dmFyIG15Q29udGV4dERhdGFMaXN0ID0gdGhpcztcblx0XHRyZXF3ZXN0KHtcblx0XHRcdHVybDogdXJsICxcblx0XHRcdHR5cGU6ICdqc29uJyAsXG5cdFx0XHRtZXRob2Q6ICdwb3N0JyAsXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nICxcblx0XHRcdGNyb3NzT3JpZ2luOiB0cnVlLFxuXHRcdFx0dGltZW91dDogMTAwMCAqIDUsXG5cdFx0XHR3aXRoQ3JlZGVudGlhbHM6IHRydWUsICAvLyBXZSB3aWxsIGhhdmUgdG8gaW5jbHVkZSBtb3JlIHNlY3VyaXR5IGluIG91ciBTb2xyIHNlcnZlclxuXHRcdFx0XG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzRXJyb3IoZXJyKTtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QudXBkYXRlR2xvYmFsU3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IpO1xuXHRcdFx0fSAsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiAocmVzcCkge1xuXHRcdFx0XHR2YXIgY29udGV4dHVhbGlzZWREYXRhID0gbXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0NvbnRleHR1YWxpc2VkRGF0YShyZXNwKTtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QuZHJhd0NvbnRleHR1YWxpc2VkRGF0YShjb250ZXh0dWFsaXNlZERhdGEpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHRcblxuXHQvKipcblx0ICogTWFuYWdlcyBzb21lIGVycm9ycyBhbmQgcHJvY2VzcyBlYWNoIHJlc3VsdCB0byBiZSBnZXQgaW4gYSBwcm9wZXIgd2F5LlxuXHQgKiBAcGFyYW0gZGF0YSB7T2JqZWN0fSAtIFRoZSBmdWxsIGRhdGEgbGlzdCB0byBiZSBwcm9jZXNzZWQgYW5kIHNob3duXG5cdCAqIHtBcnJheX0gLSBBcnJheSB3aXRoIG9iamVjdHMgY29udmVydGVkIGZyb20gdGhlaXIgb3JpZ2luYWwgSlNPTiBzdGF0dXNcblx0ICovXG5cdHByb2Nlc3NDb250ZXh0dWFsaXNlZERhdGEgOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dmFyIG15Q29udGV4dERhdGFMaXN0ID0gdGhpcztcblx0XHR2YXIgY29udGV4dHVhbGlzZWREYXRhID0gW107XG5cdFx0aWYoZGF0YS5yZXNwb25zZSAhPSB1bmRlZmluZWQpe1xuXHRcdFx0aWYoZGF0YS5yZXNwb25zZS5kb2NzICE9IHVuZGVmaW5lZCl7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMgPSBkYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5udW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUgPSB0aGlzLmdldE51bVJlc3VsdHNCeVJlc291cmNlVHlwZShkYXRhKTtcblx0XHRcdFx0aWYgKHRoaXMubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlID0gdGhpcy5udW1SZXN1bHRzQnlSZXNvdXJjZVR5cGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGRhdGEucmVzcG9uc2UuZG9jcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHRcdFx0dmFyIHR5cGVkRGF0YSA9IG15Q29udGV4dERhdGFMaXN0LmRhdGFNYW5hZ2VyLmdldERhdGFFbnRpdHkoZW50cnkpO1xuXHRcdFx0XHRcdGNvbnRleHR1YWxpc2VkRGF0YS5wdXNoKHR5cGVkRGF0YSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NFcnJvcihcImRhdGEucmVzcG9uc2UuZG9jcyB1bmRlZmluZWRcIik7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LmNoYW5nZUN1cnJlbnRTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NFcnJvcihcImRhdGEucmVzcG9uc2UgdW5kZWZpbmVkXCIpO1xuXHRcdFx0bXlDb250ZXh0RGF0YUxpc3QuY2hhbmdlQ3VycmVudFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKTtcblx0XHR9XG5cdFx0XHRcblx0XHRyZXR1cm4gY29udGV4dHVhbGlzZWREYXRhO1xuXHR9LFxuXHQvKlxuXHRmaWx0ZXJTYW1lRGF0YVJlc3VsdHMgOiBmdW5jdGlvbihkYXRhLCBtYWluVGV4dCwgY29udGVudERlc2NyaXB0aW9uKXtcblx0XHR2YXIgZmlsdGVyZWRfZGF0YSA9IGRhdGE7XG5cdFx0XG5cdFx0ZGF0YS5yZXNwb25zZS5kb2NzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdHZhciB0eXBlZERhdGEgPSBteUNvbnRleHREYXRhTGlzdC5kYXRhTWFuYWdlci5nZXREYXRhRW50aXR5KGVudHJ5KTtcblx0XHRcdGNvbnRleHR1YWxpc2VkRGF0YS5wdXNoKHR5cGVkRGF0YSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Q29tbW9uRGF0YS5USVRMRV9GSUVMRFxuXHRcdENvbW1vbkRhdGEuREVTQ1JJUFRJT05fRklFTERcblx0XHRcblx0XHRyZXR1cm4gZmlsdGVyZWRfZGF0YTtcblx0fSwqL1xuXHRcblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBkYXRhIG9mIGVhY2ggcmVzb3VyY2UgdHlwZS5cblx0ICogQHBhcmFtICBkYXRhIHtPYmplY3R9IC0gVGhlIGZ1bGwgZGF0YSBsaXN0IHRvIGJlIHByb2Nlc3NlZFxuXHQgKiBkYXRhIHtPYmplY3R9IC0gT2JqZWN0IHdpdGggb25lIHByb3BlcnR5IGJ5IGVhY2ggcmVzb3VyY2UgdHlwZSBhbmQgdmFsdWUgb2YgaXRzIG9jdXJyZW5jZXMuXG5cdCAqL1xuXHRnZXROdW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUgOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0dmFyIGZhY2V0X2NvdW50cyA9IGRhdGEuZmFjZXRfY291bnRzO1xuXHRcdHZhciByZXNvdXJjZV90eXBlc19jb3VudCA9IG51bGw7XG5cdFx0aWYgKGZhY2V0X2NvdW50cyAhPSB1bmRlZmluZWQgfHwgZmFjZXRfY291bnRzICE9IG51bGwgKSB7XG5cdFx0XHR2YXIgZmFjZXRfZmllbGRzID0gZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcblx0XHRcdGlmIChmYWNldF9maWVsZHMgIT0gdW5kZWZpbmVkIHx8IGZhY2V0X2ZpZWxkcyAhPSBudWxsICkge1xuXHRcdFx0XHRyZXNvdXJjZV90eXBlc19jb3VudCA9IGZhY2V0X2ZpZWxkcy5yZXNvdXJjZV90eXBlO1x0XG5cdFx0XHR9XHRcblx0XHR9XG5cdFx0aWYgKHJlc291cmNlX3R5cGVzX2NvdW50ID09IG51bGwpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRcblx0XHR2YXIgbnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlID0ge307XG5cdFx0aWYgKHRoaXMudG90YWxGaWx0ZXJzICE9IG51bGwpIHtcblx0XHRcdHZhciBjdXJyZW50RmlsdGVyID0gbnVsbDtcblx0XHRcdGZvciAodmFyIGk9MDtpPHRoaXMudG90YWxGaWx0ZXJzLmxlbmd0aDtpKyspIHtcblx0XHRcdFx0Y3VycmVudEZpbHRlciA9IHRoaXMudG90YWxGaWx0ZXJzW2ldO1xuXHRcdFx0XHR2YXIgY3VycmVudF9jb3VudCA9IG51bGw7XG5cdFx0XHRcdGZvciAodmFyIGo9MDtqPHJlc291cmNlX3R5cGVzX2NvdW50Lmxlbmd0aDtqKyspIHtcblx0XHRcdFx0XHRjdXJyZW50X2NvdW50ID0gcmVzb3VyY2VfdHlwZXNfY291bnRbal07XG5cdFx0XHRcdFx0aWYgKCAodHlwZW9mIGN1cnJlbnRfY291bnQgPT09ICdzdHJpbmcnIHx8IGN1cnJlbnRfY291bnQgaW5zdGFuY2VvZiBTdHJpbmcpXG5cdFx0XHRcdFx0ICAgICYmIGN1cnJlbnRGaWx0ZXIudG9Mb3dlckNhc2UoKS5pbmRleE9mKGN1cnJlbnRfY291bnQpID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRudW1SZXN1bHRzQnlSZXNvdXJjZVR5cGVbY3VycmVudEZpbHRlcl0gPSByZXNvdXJjZV90eXBlc19jb3VudFtqKzFdO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudW1SZXN1bHRzQnlSZXNvdXJjZVR5cGU7XG5cdH0sXG5cdFxuICAgICAgICAgXG5cdC8qKlxuXHQgKiBEcmF3IGEgZW50aXJlIGxpc3Qgb2YgY29udGV4dHVhbGlzZWQgcmVzb3VyY2VzXG5cdCAqIEBwYXJhbSBjb250ZXh0dWFsaXNlZERhdGEge29iamVjdCBPYmplY3R9IC0gQWxsIHRoZSBkYXRhIHRvIGJlIGRyYXduIGludG8gdGhlIHdpZGdldC5cblx0ICovXG5cdGRyYXdDb250ZXh0dWFsaXNlZERhdGEgOiBmdW5jdGlvbihjb250ZXh0dWFsaXNlZERhdGEpe1xuXHRcdHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldElkKTtcblx0XHRpZiAodGFyZ2V0ID09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT0gbnVsbCl7XG5cdFx0XHRyZXR1cm47XHRcblx0XHR9XG5cdFx0d2hpbGUgKHRhcmdldC5maXJzdENoaWxkKSB7XG5cdFx0XHR0YXJnZXQucmVtb3ZlQ2hpbGQodGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRcblx0XHR2YXIgaW5kZXggPSAwO1xuXHRcdHZhciBkYXRhT2JqZWN0O1xuXHRcdHZhciBkcmF3YWJsZU9iamVjdDtcblx0XHR2YXIgb2RkUm93ID0gdHJ1ZTtcblx0XHR3aGlsZShpbmRleCA8IGNvbnRleHR1YWxpc2VkRGF0YS5sZW5ndGgpe1xuXHRcdFx0aWYgKGluZGV4JTI9PTApIHtcblx0XHRcdFx0b2RkUm93ID0gZmFsc2U7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0b2RkUm93ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGRhdGFPYmplY3QgPSBjb250ZXh0dWFsaXNlZERhdGFbaW5kZXhdO1xuXHRcdFx0ZHJhd2FibGVPYmplY3QgPSBkYXRhT2JqZWN0LmdldERyYXdhYmxlT2JqZWN0QnlTdHlsZSh0aGlzLmRpc3BsYXlTdHlsZSk7XG5cdFx0XHRkcmF3YWJsZU9iamVjdC5jbGFzc0xpc3QuYWRkKCd2aWV3cy1yb3cnKTtcblx0XHRcdGlmKG9kZFJvdyA9PSB0cnVlKXtcblx0XHRcdFx0ZHJhd2FibGVPYmplY3QuY2xhc3NMaXN0LmFkZChcInZpZXdzLXJvdy1vZGRcIik7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZHJhd2FibGVPYmplY3QuY2xhc3NMaXN0LmFkZChcInZpZXdzLXJvdy1ldmVuXCIpO1xuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKGRyYXdhYmxlT2JqZWN0KTtcblx0XHRcdGluZGV4Kys7XG5cdFx0fVxuXHRcdGlmIChjb250ZXh0dWFsaXNlZERhdGEubGVuZ3RoID09IDApIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLmdldEVtcHR5UmVjb3JkKCkpO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gY29udGV4dHVhbGlzZWREYXRhLmxlbmd0aDtcblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURFRCk7XG5cdFx0Lypcblx0XHRjb25zb2xlLmxvZygnY3VycmVudFRvdGFsUmVzdWx0cycpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyk7XG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnRTdGFydFJlc3VsdCcpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0KTtcblx0XHRjb25zb2xlLmxvZygnY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzKTtcblx0XHRjb25zb2xlLmxvZygnY3VycmVudEZpbHRlcnMnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRGaWx0ZXJzKTtcblx0XHQqL1xuXHRcdFxuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFx0UmV0dXJucyBvbmUgcm93IGV4cGxhaW5pbmcgdGhlIGFic2VuY2Ugb2YgcmVhbCByZXN1bHRzLlxuXHQgKiBcdHtIVE1MIE9iamVjdH0gLSBFbXB0eSByZXN1bHQuXG5cdCAqL1xuXHRnZXRFbXB0eVJlY29yZCA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuXHRcdHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcblx0XHRcblx0XHR2YXIgc3BhblRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0dmFyIHRleHQgPSAnTm8gcmVzdWx0cyBmb3VuZCc7XG5cdFx0c3BhblRleHQuaW5uZXJIVE1MID0gdGV4dDtcblx0XHR0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChzcGFuVGV4dCk7XG5cdFx0bWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cdFx0cmV0dXJuIG1haW5Db250YWluZXI7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogVXBkYXRlcywgZGVwZW5kaW5nIG9uIHRoZSBuZXcgc3RhdHVzLCBpbnRlcm5hbCB2YXJpYWJsZXMgb2YgdGhlIGNvbXBvbmVudCBhbmQsIGlmXG5cdCAqIG5ldyBzdGF0dXMgaXMgJ0xPQURFRCcsIGV4ZWN1dGVzIHRoZSAnb25Mb2FkZWQnIGZ1bmN0aW9ucyByZWdpc3RlcmVkLiBcblx0ICogQHBhcmFtIG5ld1N0YXR1cyB7c3RyaW5nfSAtIENvbnRleHREYXRhTGlzdC5MT0FESU5HIG9yIENvbnRleHREYXRhTGlzdC5FUlJPUiBvciBDb250ZXh0RGF0YUxpc3QuTE9BREVEIFxuXHQgKi9cblx0dXBkYXRlR2xvYmFsU3RhdHVzIDogZnVuY3Rpb24obmV3U3RhdHVzKXtcblx0XHQvLyBuZXcgc3RhdHVzIG11c3QgYmUgb25lIG9mIHRoZSBwb3NpYmxlIHN0YXR1c1xuXHRcdGlmIChuZXdTdGF0dXMgIT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HICYmXG5cdFx0ICAgIG5ld1N0YXR1cyAhPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SICYmXG5cdFx0ICAgIG5ld1N0YXR1cyAhPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURFRCApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLmN1cnJlbnRTdGF0dXMgPSBuZXdTdGF0dXM7XG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpe1xuXHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBudWxsO1xuXHRcdH1lbHNlIGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUil7XG5cdFx0XHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IG51bGw7XG5cdFx0XHQvLyBpZiBuZXcgc3RhdHVzIGlzIExPQURFRCwgaGVyZSB3ZSBjYW5ub3Qga25vdyBhbnl0aGluZyBhYm91dCBhbGwgdGhlc2UgaW50ZXJuYWwgdmFyaWFibGVzLlxuXHRcdH0vKmVsc2UgaWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSB0aGlzLkxPQURFRCl7XG5cdFx0XHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IG51bGw7XG5cdFx0fSovXG5cdFx0XG5cdFx0Ly8gRmluYWxseSB3ZSBleGVjdXRlIHJlZ2lzdGVyZWQgJ29uTG9hZGVkJyBmdW5jdGlvbnNcblx0XHRpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEIHx8XG5cdFx0ICAgIHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SICl7XG5cdFx0XHR0aGlzLmV4ZWN1dGVPbkxvYWRlZEZ1bmN0aW9ucygpO1xuXHRcdH1cblx0fSxcblx0XG5cdC8qKlxuXHQqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RpdGxlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cblx0KiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gQU5DSE9SIGVsZW1lbnQgd2l0aCAndGl0bGUnIGluZm9ybWF0aW9uIGxpbmtpbmcgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZS5cblx0Ki9cblx0LypkcmF3SGVscEltYWdlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBoZWxwQ29udGFpbmVyID0gbnVsbDtcblx0XHRpZiAodGhpcy51c2VySGVscENsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJIZWxwQ2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGhlbHBDb250YWluZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnVzZXJIZWxwQ2xhc3NDb250YWluZXIpO1xuXHRcdFx0aWYgKGhlbHBDb250YWluZXJzICE9IG51bGwgJiYgaGVscENvbnRhaW5lcnMubGVuZ3RoPjApIGhlbHBDb250YWluZXIgPSBoZWxwQ29udGFpbmVyc1swXTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VySGVscFRhZ0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VySGVscFRhZ0NvbnRhaW5lciAhPSBudWxsKXtcblx0XHRcdHZhciBoZWxwQ29udGFpbmVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlckhlbHBUYWdDb250YWluZXIpO1xuXHRcdFx0aWYgKGhlbHBDb250YWluZXJzICE9IG51bGwgJiYgaGVscENvbnRhaW5lcnMubGVuZ3RoPjApIGhlbHBDb250YWluZXIgPSBoZWxwQ29udGFpbmVyc1swXTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coaGVscENvbnRhaW5lcik7XG5cdFx0aWYgKGhlbHBDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGhlbHBJbWFnZSA9IHRoaXMuZ2V0SGVscEltYWdlKCk7XG5cdFx0XHRpZiAoaGVscEltYWdlICE9IG51bGwpIHtcblx0XHRcdFx0aGVscENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcFwiKTtcblx0XHRcdFx0aGVscENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmdldEhlbHBJbWFnZSgpKTtcblx0XHRcdFx0Ly9oZWxwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZ2V0SGVscFRleHQoKSk7XG5cdFx0XHRcdC8vaGVscENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWxwSW1hZ2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwqL1xuXHRcblx0LyoqXG5cdCogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndGl0bGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuXHQqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBBTkNIT1IgZWxlbWVudCB3aXRoICd0aXRsZScgaW5mb3JtYXRpb24gbGlua2luZyB0byB0aGUgb3JpZ2luYWwgc291cmNlLlxuXHQqL1xuICAgICAgICAvKmdldEhlbHBJbWFnZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgaW1nRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXHRcdGltZ0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfaGVscF9pbWdcIik7XG5cblx0XHRyZXR1cm4gaW1nRWxlbWVudDtcbiAgICAgICAgfSwqL1xuXHRcblx0XG5cdFxuXHQvKipcblx0ICogUmVnaXN0ZXIgbmV3IGZ1bmN0aW9ucyB0byBiZSBleGVjdXRlZCB3aGVuIHN0YXR1cyBjb21wb25lbnQgaXMgdXBkYXRlZCB0byAnTE9BREVEJ1xuXHQgKiBteUNvbnRleHQge09iamVjdH0gbXlDb250ZXh0IC0gQ29udGV4dCBpbiB3aGljaCBteUZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlLiBVc3VhbGx5IGl0cyBvd24gb2JqZWN0IGNvbnRhaW5lci5cblx0ICogbXlDb250ZXh0IHtPYmplY3R9IG15RnVuY3Rpb24gLSBGdW5jdGlvbiB0byBiZSBleGVjdXRlZC5cblx0ICovXG5cdHJlZ2lzdGVyT25Mb2FkZWRGdW5jdGlvbiA6IGZ1bmN0aW9uKG15Q29udGV4dCwgbXlGdW5jdGlvbil7XG5cdFx0dmFyIG9uTG9hZGVkT2JqZWN0ID0ge1xuXHRcdFx0J215Q29udGV4dCdcdDogbXlDb250ZXh0LFxuXHRcdFx0J215RnVuY3Rpb24nXHQ6IG15RnVuY3Rpb25cblx0XHR9O1xuXHRcdHRoaXMuX29uTG9hZGVkRnVuY3Rpb25zLnB1c2gob25Mb2FkZWRPYmplY3QpO1xuXHR9LFxuXHRcblx0XG5cdC8qKlxuXHQgKiBFeGVjdXRlIGFsbCByZWdpc3RlcmVkICdvbkxvYWRlZCcgZnVuY3Rpb25zXG5cdCAqL1xuXHRleGVjdXRlT25Mb2FkZWRGdW5jdGlvbnMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBvbkxvYWRlZEZ1bmN0aW9uT2JqZWN0ID0gbnVsbDtcblx0XHR2YXIgb25Mb2FkZWRGdW5jdGlvbkNvbnRleHQgPSBudWxsO1xuXHRcdHZhciBvbkxvYWRlZEZ1bmN0aW9uID0gbnVsbDtcblx0XHRmb3IodmFyIGk9MDtpPHRoaXMuX29uTG9hZGVkRnVuY3Rpb25zLmxlbmd0aDtpKyspe1xuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbk9iamVjdCA9IHRoaXMuX29uTG9hZGVkRnVuY3Rpb25zW2ldO1xuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbkNvbnRleHQgPSBvbkxvYWRlZEZ1bmN0aW9uT2JqZWN0Lm15Q29udGV4dDtcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb24gPSBvbkxvYWRlZEZ1bmN0aW9uT2JqZWN0Lm15RnVuY3Rpb247XG5cdFx0XHQvLyB3ZSBleGVjdXRlIHRoZSBvbkxvYWRlZEZ1bmN0aW9uIHdpdGggaXRzIG93biBjb250ZXh0XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uLmNhbGwob25Mb2FkZWRGdW5jdGlvbkNvbnRleHQpO1xuXHRcdH1cblx0fSxcblx0XHRcbiAgICAgIFxuXHQvKipcblx0ICogUHJpbnRzIGFzIGFuIGVycm9yIHRvIHRoZSBjb25zb2xlIHRoZSBtZXNzYWdlIHJlY2VpdmVkLiBcblx0ICogZXJyb3Ige3N0cmluZ30gZXJyb3IgLSBTdHJpbmcgdG8gYmUgcHJpbnRlZFxuXHQgKi9cblx0cHJvY2Vzc0Vycm9yIDogZnVuY3Rpb24oZXJyb3IpIHtcblx0ICAgIGNvbnNvbGUubG9nKFwiRVJST1I6XCIgKyBlcnJvcik7XG5cdH1cblxufVxuXG5cbi8vIFNUQVRJQyBBVFRSSUJVVEVTXG4vKlxudmFyIENPTlNUUyA9IHtcblx0Ly9MaXN0IG9mIHBvc3NpYmxlIGNvbnRleHQgZGF0YSBzb3VyY2VzIFxuXHRTT1VSQ0VfRUxJWElSX1JFR0lTVFJZOlwiRVNSXCIsXG5cdFNPVVJDRV9FTElYSVJfVEVTUzpcIlRTU1wiLFxuXHRTT1VSQ0VfRUxJWElSX0VWRU5UUzpcIkVFVlwiLFxuXHQvL3N0eWxlIG9mIHZpc3VhbGl6YXRpb25cblx0RlVMTF9TVFlMRTpcIkZVTExfU1RZTEVcIixcblx0Q09NTU9OX1NUWUxFOlwiQ09NTU9OX1NUWUxFXCIsXG5cdC8vbWF4IG51bWJlciBvZiByb3dzIHRvIHJldHJpZXZlIGZyb20gdGhlIHNlcnZlciwgd2hhdGV2ZXIgJ251bWJlclJlc3VsdHMnIGNhbiBiZVxuXHRNQVhfUk9XUzoxMDAsXG5cdC8vbWF4aW11bSBsZW5ndGggdG8gYmUgdXNlZCBmcm9tIHRoZSBkZXNjcmlwdGlvbiB0byBmaWx0ZXIgc2FtZSByZXN1bHRzXG5cdE5VTV9XT1JEU19GSUxURVJJTkdfREVTQ1JJUFRJT046NTAsXG5cdC8vRXZlbnRzIFxuXHRFVlRfT05fUkVTVUxUU19MT0FERUQ6IFwib25SZXN1bHRzTG9hZGVkXCIsXG5cdEVWVF9PTl9SRVFVRVNUX0VSUk9SOiBcIm9uUmVxdWVzdEVycm9yXCIsXG5cdC8vRGlmZmVyZW50IHdpZGdldCBzdGF0dXNcblx0TE9BRElORzogXCJMT0FESU5HXCIsXG5cdExPQURFRDogXCJMT0FERURcIixcblx0RVJST1I6IFwiRVJST1JcIlxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQ29udGV4dERhdGFMaXN0W2tleV0gPSBDT05TVFNba2V5XTtcbn0qL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dERhdGFMaXN0O1xuIiwiXG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG52YXIgRWxpeGlyVHJhaW5pbmdEYXRhID0gcmVxdWlyZShcIi4vRWxpeGlyVHJhaW5pbmdEYXRhLmpzXCIpO1xudmFyIEVsaXhpckV2ZW50RGF0YSA9IHJlcXVpcmUoXCIuL0VsaXhpckV2ZW50RGF0YS5qc1wiKTtcbnZhciBFbGl4aXJSZWdpc3RyeURhdGEgPSByZXF1aXJlKFwiLi9FbGl4aXJSZWdpc3RyeURhdGEuanNcIik7XG5cbi8qKiBcbiAqIERhdGEgbWFuYWdtZW50IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtBcnJheX0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgRGF0YU1hbmFnZXIgY29tcG9uZW50LlxuICogICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSdZb3VyT3duRG9tYWluJ10uXG4gKiAgICAgIFVSTCB0aGF0IGlkZW50aWZpZXMgdXNlcidzIHBhZ2UgZG9tYWluLlxuICovXG52YXIgRGF0YU1hbmFnZXIgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gXG4gICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICB9O1xuICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgfVxuICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICAgIFxufVxuXG4vKiogXG4gKiBEYXRhIG1hbmFnbWVudCBmdW5jdGlvbmFsaXR5LlxuICogQnVpbGRzIG9uZSBraW5kIG9mIENvbW1vbkRhdGEgZGVwZW5kaW5nIG9uIGl0cyAnc291cmNlJyB2YWx1ZS5cbiAqIFxuICogQGNsYXNzIERhdGFNYW5hZ2VyXG4gKlxuICovXG5EYXRhTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IERhdGFNYW5hZ2VyLFxuICAgIHNvdXJjZUZpZWxkOiAnc291cmNlJyxcbiAgICBcbiAgICAvKipcbiAgICAqICAgUmV0dXJucyBzb3VyY2UgZmllbGQgdmFsdWUgb2YgdGhlIEpTT04gc3RydWN0dXJlIHBhc3NlZCBhcyBhcmd1bWVudC5cbiAgICAqICAgQHBhcmFtIGpzb25FbnRyeSB7T2JqZWN0fSAtIEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCBvbmUgZW50aXR5J3MgZGF0YS5cbiAgICAqICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBzb3VyY2UgdmFsdWUgb2YgdGhlIEpTT04gc3RydWN0dXJlLlxuICAgICovXG4gICAgZ2V0U291cmNlRmllbGQgOiBmdW5jdGlvbihqc29uRW50cnkpe1xuICAgICAgICBpZiAoanNvbkVudHJ5ICE9PSBudWxsICYmIGpzb25FbnRyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4ganNvbkVudHJ5W3RoaXMuc291cmNlRmllbGRdO1xuICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgICAgICBcbiAgICAvKipcbiAgICAqICAgUmV0dXJucyBvbmUgQ29tbW9uRGF0YSBvYmplY3QgcmVwcmVzZW50aW5nIG9uZSBkYXRhIHJlZ2lzdHJ5LlxuICAgICogICBAcGFyYW0ganNvbkVudHJ5IHtPYmplY3R9IC0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIG9uZSBlbnRpdHkncyBkYXRhLlxuICAgICogICB7Q29tbW9uRGF0YSBPYmplY3R9IC0gQ29tbW9uRGF0YSBjaGlsZCB0aGF0IHJlcHJlc2VudHMgb2JqZXRpZmllZCBqc29uIGRhdGEuXG4gICAgKi9cbiAgICBnZXREYXRhRW50aXR5IDogZnVuY3Rpb24gKGpzb25FbnRyeSl7XG4gICAgICAgIHZhciBzb3VyY2VGaWVsZFZhbHVlID0gdGhpcy5nZXRTb3VyY2VGaWVsZChqc29uRW50cnkpO1xuICAgICAgICB2YXIgY29tbW9uRGF0YSA9IG51bGw7XG4gICAgICAgIHZhciBvcHRpb25zID0ge307XG4gICAgICAgIG9wdGlvbnNbJ2N1cnJlbnREb21haW4nXSA9IHRoaXMuY3VycmVudERvbWFpbjtcbiAgICAgICAgc3dpdGNoKHNvdXJjZUZpZWxkVmFsdWUpe1xuICAgICAgICAgICAgY2FzZSBuZXcgRWxpeGlyUmVnaXN0cnlEYXRhKG51bGwpLlNPVVJDRV9GSUVMRF9WQUxVRTpcbiAgICAgICAgICAgICAgICBjb21tb25EYXRhID0gbmV3IEVsaXhpclJlZ2lzdHJ5RGF0YShqc29uRW50cnksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBuZXcgRWxpeGlyVHJhaW5pbmdEYXRhKG51bGwpLlNPVVJDRV9GSUVMRF9WQUxVRTpcbiAgICAgICAgICAgICAgICBjb21tb25EYXRhID0gbmV3IEVsaXhpclRyYWluaW5nRGF0YShqc29uRW50cnksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBuZXcgRWxpeGlyRXZlbnREYXRhKG51bGwpLlNPVVJDRV9GSUVMRF9WQUxVRTpcbiAgICAgICAgICAgICAgICBjb21tb25EYXRhID0gbmV3IEVsaXhpckV2ZW50RGF0YShqc29uRW50cnksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIHNvdXJjZSBmaWVsZCB2YWx1ZTogXCIgKyBzb3VyY2VGaWVsZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tbW9uRGF0YTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhTWFuYWdlcjsiLCJ2YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG5cbi8qKlxuICogRWxpeGlyRXZlbnREYXRhIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ganNvbkRhdGEge09iamVjdH0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIHRoZSBvcmlnaW5hbCBkYXRhIHJldHJpZXZlZCBieSBvdXIgZGF0YSBzZXJ2ZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgdGhpcyBzdHJ1Y3R1cmUuXG4gKiAgICAgICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSd1cmwnXVxuICogICAgICAgICAgVVJMIHdpdGggdGhlIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqL1xudmFyIEVsaXhpckV2ZW50RGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudERvbWFpbjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIENPTlNUUyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENBVEVHT1JZICAgICAgICAgICAgICAgICAgICA6IFwiY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIENJVFkgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ09VTlRSWSAgICAgICAgICAgICAgICAgICAgIDogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFSVF9EQVRFICAgICAgICAgICAgICAgICAgOiBcInN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBFTkRfREFURSAgICAgICAgICAgICAgICAgICAgOiBcImVuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgVkVOVUUgICAgICAgICAgICAgICAgICAgICAgIDogXCJ2ZW51ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgUFJPVklERVIgICAgICAgICAgICAgICAgICAgIDogXCJwcm92aWRlclwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBDT05TVFNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xuICAgICAgICAgICAgdGhpcy5TT1VSQ0VfRklFTERfVkFMVUUgPSBcImlhbm5cIjtcbiAgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIEVsaXhpckV2ZW50RGF0YSBjaGlsZCBjbGFzcyB3aXRoIHNwZWNpZmljIGluZm9ybWF0aW9uIG9mIHRoaXMga2luZCBvZiByZWdpc3RyaWVzLlxuICovICAgICAgICAgXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tb25EYXRhLnByb3RvdHlwZSk7XG5FbGl4aXJFdmVudERhdGEuY29uc3RydWN0b3I9IEVsaXhpckV2ZW50RGF0YTtcbiAgICAgICBcbiAgICAgICAgICAgIFxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGFsbCBjYXRlZ29yaWVzIHByZXNlbnQgaW4gdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIGNhdGVnb3JpZXMgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldENhdGVnb3J5VmFsdWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ0FURUdPUlkpOyAgICAgIFxufSxcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGNpdHkgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGNpdHkgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q2l0eVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkNJVFkpOyAgICAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGNvdW50cnkgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGNvdW50cnkgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q291bnRyeVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkNPVU5UUlkpOyAgICAgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIEF1eGlsaWFyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvbmUgZGF0ZSBhZGFwdGVkIHRvIHVzZXIncyBsb2NhbGUuXG4gKiAgICAgICAgICBAcGFyYW0gc291cmNlRGF0ZSB7U3RyaW5nfSAtIFN0cmluZyBkYXRlIGluIFVURiBmb3JtYXQgdG8gYmUgY29udmVydGVkIGludG8gYSBsb2NhbGUgZm9ybWF0LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBjdXJhdGVkIGRhdGUuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q3VyYXRlZERhdGUgPSBmdW5jdGlvbihzb3VyY2VEYXRlKXtcbiAgICAgICAgICAgIHZhciBkYXRlVmFsdWUgPSBuZXcgRGF0ZShzb3VyY2VEYXRlKTtcbiAgICAgICAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGVWYWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgaXMgYSBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGlzTmFOKCBkYXRlVmFsdWUuZ2V0VGltZSgpICkgKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0ZSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VEYXRlOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlVmFsdWUudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgc3RhcnRpbmcgZGF0ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgc3RhcnRpbmcgZGF0ZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRTdGFydERhdGVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdmFsdWU9IHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuU1RBUlRfREFURSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJhdGVkRGF0ZSh2YWx1ZSk7XG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgZW5kaW5nIGRhdGUgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGVuZGluZyBkYXRlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldEVuZERhdGVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkVORF9EQVRFKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cmF0ZWREYXRlKHZhbHVlKTtcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyB2ZW51ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgdmVudWUgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0VmVudWVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5WRU5VRSk7ICBcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBwcm92aWRlciBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgcHJvdmlkZXIgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0UHJvdmlkZXJWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5QUk9WSURFUik7ICBcbn07XG5cblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBpbXByb3ZlZCB3YXkgb2YgcmVwcmVzZW50aW5nIEVsaXhpckV2ZW50RGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vQ29tbW9uRGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0LmNhbGwodGhpcyk7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICB2YXIgZ2V0RXhwYW5kYWJsZURldGFpbHMgPSB0aGlzLmdldEV4cGFuZGFibGVEZXRhaWxzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2V0RXhwYW5kYWJsZURldGFpbHMpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xufTtcblxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIGV4cGFuZGFibGUgb2JqZWN0IHdpdGggbWFueSBkZXRhaWxzIHJlbGF0ZWQgd2l0aCB0aGlzIEVsaXhpckV2ZW50RGF0YSByZWNvcmQuXG4gKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRHJhd2FibGUgb2JqZWN0IHdpdGggZGV0YWlscyByZWxhdGVkIHdpdGggdGhpcyByZWNvcmQuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RXhwYW5kYWJsZURldGFpbHMgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGRldGFpbHNBcnJheSA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhblByb3ZpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBzcGFuUHJvdmlkZXIuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgc3BhblByb3ZpZGVyLmNsYXNzTGlzdC5hZGQoXCJwcm92aWRlclwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5Qcm92aWRlclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlclZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwcm92aWRlciAhPT0gdW5kZWZpbmVkICkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgc3BhblByb3ZpZGVyVGV4dCA9IFwiUHJvdmlkZXI6IFwiK3Byb3ZpZGVyO1xuICAgICAgICAgICAgICAgICAgICBzcGFuUHJvdmlkZXIuaW5uZXJIVE1MID0gc3BhblByb3ZpZGVyVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhblByb3ZpZGVyKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW5WZW51ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5WZW51ZS5jbGFzc0xpc3QuYWRkKFwidmVudWVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcGFuVmVudWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZW51ZSA9IHRoaXMuZ2V0VmVudWVWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVudWUgIT09IHVuZGVmaW5lZCApIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5WZW51ZVRleHQgPSB2ZW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhblZlbnVlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuTG9jYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICBzcGFuTG9jYXRpb24uY2xhc3NMaXN0LmFkZChcImxvY2F0aW9uXCIpO1xuICAgICAgICAgICAgdmFyIHNwYW5Mb2NhdGlvblRleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGNvdW50cnkgPSB0aGlzLmdldENvdW50cnlWYWx1ZSgpO1xuICAgICAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmdldENpdHlWYWx1ZSgpO1xuICAgICAgICAgICAgaWYgKGNvdW50cnkgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uVGV4dCA9IHNwYW5Mb2NhdGlvblRleHQgKyBjb3VudHJ5OyAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2l0eSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3BhbkxvY2F0aW9uVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArXCIsIFwiKyBjaXR5OyAgXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArIGNpdHk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFuTG9jYXRpb25UZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5pbm5lckhUTUwgPSBzcGFuTG9jYXRpb25UZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhbkxvY2F0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5EYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgc3BhbkRhdGVzLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgIHNwYW5EYXRlcy5jbGFzc0xpc3QuYWRkKFwiZGF0ZXNcIik7XG4gICAgICAgICAgICB2YXIgc3BhbkRhdGVzVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gdGhpcy5nZXRTdGFydERhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSB0aGlzLmdldEVuZERhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoc3RhcnREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kRGF0ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IFwiRnJvbSBcIitzdGFydERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBzdGFydERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwYW5EYXRlc1RleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IHNwYW5EYXRlc1RleHQgKyBcIiB0byBcIitlbmREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gZW5kRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFuRGF0ZXNUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlcy5pbm5lckhUTUwgPSBzcGFuRGF0ZXNUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhbkRhdGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1heWJlIHdlIGNhbiBhZGQgbGF0ZXIgJ2NhdGVnb3J5JyBvciAna2V5d29yZHMnXG4gICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURldGFpbHMgPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXRhaWxzQXJyYXkpO1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZGFibGVEZXRhaWxzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyRXZlbnREYXRhO1xuICAgICAgIiwidmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclJlZ2lzdHJ5RGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogICAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgICAgICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgICAgICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKlxuICovXG52YXIgRWxpeGlyUmVnaXN0cnlEYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xuICAgICAgICAgICAgdGhpcy5TT1VSQ0VfRklFTERfVkFMVUUgPSBcImVsaXhpcl9yZWdpc3RyeVwiIDsgICBcbn07XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyUmVnaXN0cnlEYXRhIGNoaWxkIGNsYXNzIHdpdGggc3BlY2lmaWMgaW5mb3JtYXRpb24gb2YgdGhpcyBraW5kIG9mIHJlY29yZHMuXG4gKi9cbkVsaXhpclJlZ2lzdHJ5RGF0YS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1vbkRhdGEucHJvdG90eXBlKTtcbkVsaXhpclJlZ2lzdHJ5RGF0YS5jb25zdHJ1Y3Rvcj0gRWxpeGlyUmVnaXN0cnlEYXRhO1xuXG4gICAgICAgICAgICBcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBtb3JlIGRldGFpbGVkIHdheSBvZiByZXByZXNlbnRpbmcgYSBFbGl4aXJSZWdpc3RyeURhdGEgcmVjb3JkIHRyYW5zZm9ybWVkXG4gKiAgICAgICAgICBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gKi9cbkVsaXhpclJlZ2lzdHJ5RGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RGVzY3JpcHRpb25WYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aD5Db21tb25EYXRhLk1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIENvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKStcIiBbLi4uXVwiLFsnZWxpeGlyX3JlZ2lzdHJ5J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbixbJ2VsaXhpcl9yZWdpc3RyeSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZXhwYW5kYWJsZURlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsaXhpclJlZ2lzdHJ5RGF0YTsiLCJcbnZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJUcmFpbmluZ0RhdGEgY29uc3RydWN0b3JcbiAqICAgICAgICAgIEBwYXJhbSBqc29uRGF0YSB7T2JqZWN0fSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggdGhlIG9yaWdpbmFsIGRhdGEgcmV0cmlldmVkIGJ5IG91ciBkYXRhIHNlcnZlci5cbiAqICAgICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciB0aGlzIHN0cnVjdHVyZS5cbiAqICAgICAgICAgICAgICAgICAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J3VybCddXG4gKiAgICAgICAgICAgICAgICAgICAgICBVUkwgd2l0aCB0aGUgdXNlcidzIHBhZ2UgZG9tYWluLlxuICpcbiAqL1xudmFyIEVsaXhpclRyYWluaW5nRGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudERvbWFpbjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuanNvbkRhdGEgPSBqc29uRGF0YTtcbiAgICAgICAgICAgIHRoaXMuU09VUkNFX0ZJRUxEX1ZBTFVFID0gXCJja2FuXCI7IFxufTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJUcmFpbmluZ0RhdGEgY2hpbGQgY2xhc3Mgd2l0aCBzcGVjaWZpYyBpbmZvcm1hdGlvbiBvZiB0aGlzIGtpbmQgb2YgcmVnaXN0cmllcy5cbiAqL1xuRWxpeGlyVHJhaW5pbmdEYXRhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbW9uRGF0YS5wcm90b3R5cGUpOyBcbkVsaXhpclRyYWluaW5nRGF0YS5jb25zdHJ1Y3Rvcj0gRWxpeGlyVHJhaW5pbmdEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIG1vcmUgZGV0YWlsZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhIEVsaXhpclRyYWluaW5nRGF0YSByZWNvcmQgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICovXG5FbGl4aXJUcmFpbmluZ0RhdGEucHJvdG90eXBlLmdldEZ1bGxEcmF3YWJsZU9iamVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmdldERlc2NyaXB0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcbiAgICAgICAgICAgIHZhciBsZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9sZWZ0XCIpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfcmlnaHRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BpY3MpO1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCAmJiBkZXNjcmlwdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGg+Q29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCBDb21tb25EYXRhLk1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTikrXCIgWy4uLl1cIixbJ3RyYWluaW5nX21hdGVyaWFsJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbixbJ3RyYWluaW5nX21hdGVyaWFsJ10pOyAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGV4cGFuZGFibGVEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc291cmNlVHlwZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gbWFpbkNvbnRhaW5lcjtcbn07XG4gICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBFbGl4aXJUcmFpbmluZ0RhdGE7IiwidmFyIENvbnRleHREYXRhTGlzdCA9IHJlcXVpcmUoXCIuL0NvbnRleHREYXRhTGlzdC5qc1wiKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG5cbi8qKiBcbiAqIFBhZ2VNYW5hZ2VyIGNvbnN0cnVjdG9yLlxuICpcbiAqIEBwYXJhbSB7Q29udGV4dERhdGFMaXN0IE9iamVjdH0gUmVmZXJlbmNlIHRvIENvbnRleHREYXRhTGlzdCBvYmplY3QgaW4gb3JkZXIgdG8gbWFuYWdlIGl0cyBmaWx0ZXJzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIFBhZ2VNYW5hZ2VyIGNvbXBvbmVudC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3RhcmdldD0nWW91ck93bkRpdklkJ11cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICovXG52YXIgUGFnZU1hbmFnZXIgPSBmdW5jdGlvbihjb250ZXh0RGF0YUxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIGNvbnN0cyA9IHtcblx0fTtcblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7ICAgICAgICBcblx0fTtcblx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG5cdCAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcblx0fVxuXHRcblx0Zm9yKHZhciBrZXkgaW4gY29uc3RzKXtcblx0ICAgICB0aGlzW2tleV0gPSBjb25zdHNba2V5XTtcblx0fVxuICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdCA9IGNvbnRleHREYXRhTGlzdDtcblx0dGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0ID0gMDtcblx0dGhpcy5jb250ZXh0RGF0YUxpc3QucmVnaXN0ZXJPbkxvYWRlZEZ1bmN0aW9uKHRoaXMsIHRoaXMuYnVpbGQpO1xufVxuXG4vKiogXG4gKiBQYWdlTWFuYWdlciBmdW5jdGlvbmFsaXR5LlxuICogXG4gKiBAY2xhc3MgUGFnZU1hbmFnZXJcbiAqIFxuICovXG5QYWdlTWFuYWdlci5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBQYWdlTWFuYWdlcixcbiAgICAgICAgXG4gICAgICAgIFxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgYnV0dG9ucyBhbmQgZHJhdyB0aGVtIGludG8gdGhlIGVsZW1lbnQgd2l0aCBpZCAndGFyZ2V0SWQnXG5cdCAqLyAgICAgICAgXG5cdGJ1aWxkIDogZnVuY3Rpb24gKCl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHR3aGlsZSAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHRhcmdldC5yZW1vdmVDaGlsZCh0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdFxuXHRcdGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyl7XG5cdFx0XHR2YXIgc3RhdHVzVGV4dCA9IHRoaXMuZ2V0Q3VycmVudFN0YXR1cygpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0YXR1c1RleHQpO1xuXHRcdH1lbHNlIGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1Ipe1xuXHRcdFx0dmFyIHN0YXR1c1RleHQgPSB0aGlzLmdldEN1cnJlbnRTdGF0dXMoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdGF0dXNUZXh0KTtcblx0XHR9ZWxzZSBpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURFRCl7XG5cdFx0XHR2YXIgc3RhdHVzVGV4dCA9IHRoaXMuZ2V0Q3VycmVudFN0YXR1cygpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0YXR1c1RleHQpO1xuXHRcdFx0XG5cdFx0XHR2YXIgbmF2RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRuYXZEaXYuY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX25hdicpO1xuXHRcdFx0XG5cdFx0XHR2YXIgcHJldmlvdXNCdXR0b24gPSB0aGlzLmNyZWF0ZVByZXZpb3VzQnV0dG9uKCk7XG5cdFx0XHRuYXZEaXYuYXBwZW5kQ2hpbGQocHJldmlvdXNCdXR0b24pO1xuXHRcdFx0XG5cdFx0XHR2YXIgdGV4dFNlcGFyYXRvciA9IHRoaXMuY3JlYXRlVGV4dFNlcGFyYXRvcigpO1xuXHRcdFx0bmF2RGl2LmFwcGVuZENoaWxkKHRleHRTZXBhcmF0b3IpO1xuXHRcdFx0XG5cdFx0XHR2YXIgbmV4dEJ1dHRvbiA9IHRoaXMuY3JlYXRlTmV4dEJ1dHRvbigpO1xuXHRcdFx0bmF2RGl2LmFwcGVuZENoaWxkKG5leHRCdXR0b24pO1xuXHRcdFx0XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQobmF2RGl2KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnNvbGUubG9nKFwiRVJST1I6IFVua25vd24gc3RhdHVzOiBcIit0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzKTtcblx0XHR9XG5cdFx0XG5cdH0sXG4gICAgICAgIFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSB0ZXh0IHNlcGFyYXRvci5cbiAgICAgICAgKi8gIFxuXHRjcmVhdGVUZXh0U2VwYXJhdG9yIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHR2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCctJyk7XG5cdFx0ZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRyZXR1cm4gZWxlbWVudDtcblx0fSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIGlmIGl0J3MgcG9zc2libGUgdG8gcmV0cmlldmUgcHJldmlvdXMgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBleGlzdFByZXZpb3VzUmVzdWx0cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHN0YXJ0UmVzdWx0ID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdGlmIChzdGFydFJlc3VsdCA9PSAwKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fWVsc2Vcblx0XHRcdHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgaWYgaXQncyBwb3NzaWJsZSB0byByZXRyaWV2ZSBuZXh0IHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgZXhpc3ROZXh0UmVzdWx0cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHN0YXJ0UmVzdWx0ID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdHZhciBtYXhSb3dzID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuZ2V0TWF4Um93cygpO1xuXHRcdHZhciB0b3RhbFJlc3VsdHMgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXG5cdFx0aWYgKHN0YXJ0UmVzdWx0K21heFJvd3M8dG90YWxSZXN1bHRzKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gdG8gZ2V0IHByZXZpb3VzIHJlc3VsdHMuT25seSB0ZXh0IGlmIHRoZXJlIGFyZW4ndCBwcmV2aW91cyByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZVByZXZpb3VzQnV0dG9uIDogZnVuY3Rpb24oKXtcblx0XHRpZiAodGhpcy5leGlzdFByZXZpb3VzUmVzdWx0cygpKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQcmV2aW91cycpO1xuXHRcdFx0YnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcblx0XHRcdGJ1dHRvbi50aXRsZSA9ICdQcmV2aW91cyc7XG5cdFx0XHRidXR0b24uaHJlZiA9IFwiI1wiO1xuXHRcdFx0dmFyIG15UGFnZU1hbmFnZXIgPSB0aGlzO1xuXHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcblx0XHRcdCAgICB2YXIgbWF4Um93cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmdldE1heFJvd3MoKTtcblx0XHRcdCAgICB2YXIgdG90YWxSZXN1bHRzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFRvdGFsUmVzdWx0cztcblx0XHRcdCAgICB2YXIgc3RhcnRSZXN1bHQgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0XHQgICAgdmFyIG5ld1N0YXJ0UmVzdWx0ID0gMDtcblx0XHRcdCAgICBpZiAoc3RhcnRSZXN1bHQtbWF4Um93czw9MCkge1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSAwO1x0XG5cdFx0XHQgICAgfWVsc2V7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0LW1heFJvd3M7XG5cdFx0XHQgICAgfVxuXHRcdFx0ICAgIG15UGFnZU1hbmFnZXIuX2NoYW5nZVBhZ2UobmV3U3RhcnRSZXN1bHQpO1xuXHRcdFx0ICAgIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBidXR0b247ICBcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBwcmV2aW91c1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHR2YXIgcHJldmlvdXNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1ByZXZpb3VzJyk7XG5cdFx0XHRwcmV2aW91c1NwYW4uYXBwZW5kQ2hpbGQocHJldmlvdXNUZXh0KTtcblx0XHRcdHByZXZpb3VzU3Bhbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHRyZXR1cm4gcHJldmlvdXNTcGFuO1xuXHRcdH1cbiAgICAgICAgICAgICAgXG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB0byBnZXQgcHJldmlvdXMgcmVzdWx0cy5Pbmx5IHRleHQgaWYgdGhlcmUgYXJlbid0IG1vcmUgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVOZXh0QnV0dG9uIDogZnVuY3Rpb24oKXtcblx0XHRpZiAodGhpcy5leGlzdE5leHRSZXN1bHRzKCkpIHtcblx0XHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0dmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05leHQnKTtcblx0XHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG5cdFx0XHRidXR0b24udGl0bGUgPSAnTmV4dCc7XG5cdFx0XHRidXR0b24uaHJlZiA9IFwiI1wiO1xuXHRcdFx0dmFyIG15UGFnZU1hbmFnZXIgPSB0aGlzO1xuXHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcblx0XHRcdCAgICB2YXIgbWF4Um93cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmdldE1heFJvd3MoKTtcblx0XHRcdCAgICB2YXIgdG90YWxSZXN1bHRzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFRvdGFsUmVzdWx0cztcblx0XHRcdCAgICB2YXIgc3RhcnRSZXN1bHQgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0XHQgICAgdmFyIG5ld1N0YXJ0UmVzdWx0ID0gMDtcblx0XHRcdCAgICBpZiAoc3RhcnRSZXN1bHQrbWF4Um93czx0b3RhbFJlc3VsdHMpIHtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQrbWF4Um93cztcdFxuXHRcdFx0ICAgIH1lbHNle1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdDtcblx0XHRcdCAgICB9XG5cdFx0XHQgICAgbXlQYWdlTWFuYWdlci5fY2hhbmdlUGFnZShuZXdTdGFydFJlc3VsdCk7XG5cdFx0XHQgICAgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJ1dHRvbjtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciBuZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdHZhciBuZXh0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOZXh0Jyk7XG5cdFx0XHRuZXh0U3Bhbi5hcHBlbmRDaGlsZChuZXh0VGV4dCk7XG5cdFx0XHRuZXh0U3Bhbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHRyZXR1cm4gbmV4dFNwYW47XG5cdFx0fVxuICAgICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgdGhlIHJlZHJhd24gb2YgdGhlIENvbnRleHREYXRhTGlzdCBvYmplY3QgaGF2aW5nIGludG8gYWNjb3VudFxuICAgICAgICAqIHByZXZpb3VzbHkgY2hvc2VuIGZpbHRlcnMuXG4gICAgICAgICogQHBhcmFtIHN0YXJ0UmVzdWx0IHtJbnRlZ2VyfSAtIG51bWJlciBvZiB0aGUgZmlyc3QgcmVzdWx0IHRvIGJlIHNob3duXG4gICAgICAgICovICBcbiAgICAgICAgX2NoYW5nZVBhZ2U6IGZ1bmN0aW9uIChzdGFydFJlc3VsdCl7XG5cdCAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdDtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmRyYXdDb250ZXh0RGF0YUxpc3QoKTtcbiAgICAgICAgfSxcblx0IFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSB0ZXh0dWFsIGRlc2NyaXB0aW9uIG9mOiBmaXJzdCByZXN1bHQgc2hvd24sIGxhc3QgcmVzdWx0cyBzaG93biBhbmRcbiAgICAgICAgKiB0b3RhbCBudW1iZXIgb2YgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuXHRnZXRDdXJyZW50U3RhdHVzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX3N0YXR1cycpO1xuXHRcdHZhciBzdGFydGluZ1Jlc3VsdCA9IG51bGw7XG5cdFx0dmFyIGVuZGluZ1Jlc3VsdCA9IG51bGw7XG5cdFx0dmFyIHRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0dmFyIHJlc3VsdFRleHQgPSBcIlwiO1xuXHRcdFxuXHRcdGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyl7XG5cdFx0XHRyZXN1bHRUZXh0ID0gXCJMb2FkaW5nIHJlc291cmNlcy4uLlwiO1xuXHRcdH1lbHNlIGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1Ipe1xuXHRcdFx0cmVzdWx0VGV4dCA9IFwiXCI7XG5cdFx0fWVsc2V7XG5cdFx0XHRzdGFydGluZ1Jlc3VsdCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRcdHZhciBjdXJyZW50VG90YWxSZXN1bHRzID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFRvdGFsUmVzdWx0cztcblx0XHRcdHZhciBudW1Sb3dzTG9hZGVkID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHM7XG5cdFx0XHRcblx0XHRcdGVuZGluZ1Jlc3VsdCA9IHN0YXJ0aW5nUmVzdWx0ICsgbnVtUm93c0xvYWRlZDtcblx0XHRcdGlmIChjdXJyZW50VG90YWxSZXN1bHRzPjApIHtcblx0XHRcdFx0Ly8gb25seSB0byBzaG93IGl0IHRvIHRoZSB1c2VyXG5cdFx0XHRcdHN0YXJ0aW5nUmVzdWx0ID0gc3RhcnRpbmdSZXN1bHQrMTtcblx0XHRcdH1cblx0XHRcdHJlc3VsdFRleHQgPSBcIlJlY29yZHMgXCIrc3RhcnRpbmdSZXN1bHQrXCIgdG8gXCIrZW5kaW5nUmVzdWx0K1wiIG9mIFwiK2N1cnJlbnRUb3RhbFJlc3VsdHNcblx0XHRcdFxuXHRcdH1cblx0XHRlbGVtZW50LmlubmVySFRNTCA9IHJlc3VsdFRleHQ7XG5cdFx0XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH1cbiAgICAgICAgXG4gICAgICAgIFxufVxuICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2VNYW5hZ2VyO1xuICAgICAgXG4gICIsIlxuXG5mdW5jdGlvbiBkZWZpbmUobmFtZSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuICAgICAgICB2YWx1ZTogICAgICB2YWx1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xufVxuXG4vLyBDb250ZXh0RGF0YUxpc3QgY29uc3RhbnRzXG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfU09VUkNFX0VMSVhJUl9SRUdJU1RSWVwiLCBcIkVTUlwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9TT1VSQ0VfRUxJWElSX1RFU1NcIiwgXCJUU1NcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfU09VUkNFX0VMSVhJUl9FVkVOVFNcIiwgXCJFRVZcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRlVMTF9TVFlMRVwiLCBcIkZVTExfU1RZTEVcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfQ09NTU9OX1NUWUxFXCIsIFwiQ09NTU9OX1NUWUxFXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X01BWF9ST1dTXCIsIDEwMCk7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfTlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTlwiLCA1MCk7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRVZUX09OX1JFU1VMVFNfTE9BREVEXCIsIFwib25SZXN1bHRzTG9hZGVkXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0VWVF9PTl9SRVFVRVNUX0VSUk9SXCIsIFwib25SZXF1ZXN0RXJyb3JcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfTE9BRElOR1wiLCBcIkxPQURJTkdcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfTE9BREVEXCIsIFwiTE9BREVEXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0VSUk9SXCIsIFwiRVJST1JcIik7XG5cbi8vIENvbW1vbkRhdGEgY29uc3RhbnRzXG5kZWZpbmUoXCJDb21tb25EYXRhX01JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTlwiLCAxMDAwKTtcblxuLy8gQnV0dG9uc01hbmFnZXIgY29uc3RhbnRzXG5kZWZpbmUoXCJCdXR0b25zTWFuYWdlcl9TUVVBUkVEXzNEXCIsIFwiU1FVQVJFRF8zRFwiKTtcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX1JPVU5EX0ZMQVRcIiwgXCJST1VORF9GTEFUXCIpO1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfSUNPTlNfT05MWVwiLCBcIklDT05TX09OTFlcIik7XG5cbiIsbnVsbCwiLyohXG4gICogUmVxd2VzdCEgQSBnZW5lcmFsIHB1cnBvc2UgWEhSIGNvbm5lY3Rpb24gbWFuYWdlclxuICAqIGxpY2Vuc2UgTUlUIChjKSBEdXN0aW4gRGlheiAyMDE1XG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9yZXF3ZXN0XG4gICovXG5cbiFmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0oJ3JlcXdlc3QnLCB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGNvbnRleHQgPSB0aGlzXG5cbiAgaWYgKCd3aW5kb3cnIGluIGNvbnRleHQpIHtcbiAgICB2YXIgZG9jID0gZG9jdW1lbnRcbiAgICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgICAsIGhlYWQgPSBkb2NbYnlUYWddKCdoZWFkJylbMF1cbiAgfSBlbHNlIHtcbiAgICB2YXIgWEhSMlxuICAgIHRyeSB7XG4gICAgICBYSFIyID0gcmVxdWlyZSgneGhyMicpXG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGVlciBkZXBlbmRlbmN5IGB4aHIyYCByZXF1aXJlZCEgUGxlYXNlIG5wbSBpbnN0YWxsIHhocjInKVxuICAgIH1cbiAgfVxuXG5cbiAgdmFyIGh0dHBzUmUgPSAvXmh0dHAvXG4gICAgLCBwcm90b2NvbFJlID0gLyheXFx3Kyk6XFwvXFwvL1xuICAgICwgdHdvSHVuZG8gPSAvXigyMFxcZHwxMjIzKSQvIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gICAgLCByZWFkeVN0YXRlID0gJ3JlYWR5U3RhdGUnXG4gICAgLCBjb250ZW50VHlwZSA9ICdDb250ZW50LVR5cGUnXG4gICAgLCByZXF1ZXN0ZWRXaXRoID0gJ1gtUmVxdWVzdGVkLVdpdGgnXG4gICAgLCB1bmlxaWQgPSAwXG4gICAgLCBjYWxsYmFja1ByZWZpeCA9ICdyZXF3ZXN0XycgKyAoK25ldyBEYXRlKCkpXG4gICAgLCBsYXN0VmFsdWUgLy8gZGF0YSBzdG9yZWQgYnkgdGhlIG1vc3QgcmVjZW50IEpTT05QIGNhbGxiYWNrXG4gICAgLCB4bWxIdHRwUmVxdWVzdCA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAsIHhEb21haW5SZXF1ZXN0ID0gJ1hEb21haW5SZXF1ZXN0J1xuICAgICwgbm9vcCA9IGZ1bmN0aW9uICgpIHt9XG5cbiAgICAsIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PSAnZnVuY3Rpb24nXG4gICAgICAgID8gQXJyYXkuaXNBcnJheVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgfVxuXG4gICAgLCBkZWZhdWx0SGVhZGVycyA9IHtcbiAgICAgICAgICAnY29udGVudFR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAsICdyZXF1ZXN0ZWRXaXRoJzogeG1sSHR0cFJlcXVlc3RcbiAgICAgICAgLCAnYWNjZXB0Jzoge1xuICAgICAgICAgICAgICAnKic6ICAndGV4dC9qYXZhc2NyaXB0LCB0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwsICovKidcbiAgICAgICAgICAgICwgJ3htbCc6ICAnYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCdcbiAgICAgICAgICAgICwgJ2h0bWwnOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgLCAndGV4dCc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgLCAnanNvbic6ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgICAsICdqcyc6ICAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQsIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAsIHhociA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgLy8gaXMgaXQgeC1kb21haW5cbiAgICAgICAgaWYgKG9bJ2Nyb3NzT3JpZ2luJ10gPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgeGhyID0gY29udGV4dFt4bWxIdHRwUmVxdWVzdF0gPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG51bGxcbiAgICAgICAgICBpZiAoeGhyICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgICAgICAgcmV0dXJuIHhoclxuICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dFt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1vcmlnaW4gcmVxdWVzdHMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0W3htbEh0dHBSZXF1ZXN0XSkge1xuICAgICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICB9IGVsc2UgaWYgKFhIUjIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhIUjIoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgLCBnbG9iYWxTZXR1cE9wdGlvbnMgPSB7XG4gICAgICAgIGRhdGFGaWx0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gIGZ1bmN0aW9uIHN1Y2NlZWQocikge1xuICAgIHZhciBwcm90b2NvbCA9IHByb3RvY29sUmUuZXhlYyhyLnVybClcbiAgICBwcm90b2NvbCA9IChwcm90b2NvbCAmJiBwcm90b2NvbFsxXSkgfHwgY29udGV4dC5sb2NhdGlvbi5wcm90b2NvbFxuICAgIHJldHVybiBodHRwc1JlLnRlc3QocHJvdG9jb2wpID8gdHdvSHVuZG8udGVzdChyLnJlcXVlc3Quc3RhdHVzKSA6ICEhci5yZXF1ZXN0LnJlc3BvbnNlXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVSZWFkeVN0YXRlKHIsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHVzZSBfYWJvcnRlZCB0byBtaXRpZ2F0ZSBhZ2FpbnN0IElFIGVyciBjMDBjMDIzZlxuICAgICAgLy8gKGNhbid0IHJlYWQgcHJvcHMgb24gYWJvcnRlZCByZXF1ZXN0IG9iamVjdHMpXG4gICAgICBpZiAoci5fYWJvcnRlZCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdClcbiAgICAgIGlmIChyLl90aW1lZE91dCkgcmV0dXJuIGVycm9yKHIucmVxdWVzdCwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcpXG4gICAgICBpZiAoci5yZXF1ZXN0ICYmIHIucmVxdWVzdFtyZWFkeVN0YXRlXSA9PSA0KSB7XG4gICAgICAgIHIucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wXG4gICAgICAgIGlmIChzdWNjZWVkKHIpKSBzdWNjZXNzKHIucmVxdWVzdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVycm9yKHIucmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRIZWFkZXJzKGh0dHAsIG8pIHtcbiAgICB2YXIgaGVhZGVycyA9IG9bJ2hlYWRlcnMnXSB8fCB7fVxuICAgICAgLCBoXG5cbiAgICBoZWFkZXJzWydBY2NlcHQnXSA9IGhlYWRlcnNbJ0FjY2VwdCddXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bb1sndHlwZSddXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddWycqJ11cblxuICAgIHZhciBpc0FGb3JtRGF0YSA9IHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgKG9bJ2RhdGEnXSBpbnN0YW5jZW9mIEZvcm1EYXRhKTtcbiAgICAvLyBicmVha3MgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzIHdpdGggbGVnYWN5IGJyb3dzZXJzXG4gICAgaWYgKCFvWydjcm9zc09yaWdpbiddICYmICFoZWFkZXJzW3JlcXVlc3RlZFdpdGhdKSBoZWFkZXJzW3JlcXVlc3RlZFdpdGhdID0gZGVmYXVsdEhlYWRlcnNbJ3JlcXVlc3RlZFdpdGgnXVxuICAgIGlmICghaGVhZGVyc1tjb250ZW50VHlwZV0gJiYgIWlzQUZvcm1EYXRhKSBoZWFkZXJzW2NvbnRlbnRUeXBlXSA9IG9bJ2NvbnRlbnRUeXBlJ10gfHwgZGVmYXVsdEhlYWRlcnNbJ2NvbnRlbnRUeXBlJ11cbiAgICBmb3IgKGggaW4gaGVhZGVycylcbiAgICAgIGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaCkgJiYgJ3NldFJlcXVlc3RIZWFkZXInIGluIGh0dHAgJiYgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGgsIGhlYWRlcnNbaF0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXRDcmVkZW50aWFscyhodHRwLCBvKSB7XG4gICAgaWYgKHR5cGVvZiBvWyd3aXRoQ3JlZGVudGlhbHMnXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGh0dHAud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSAhIW9bJ3dpdGhDcmVkZW50aWFscyddXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhbENhbGxiYWNrKGRhdGEpIHtcbiAgICBsYXN0VmFsdWUgPSBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiB1cmxhcHBlbmQgKHVybCwgcykge1xuICAgIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gJyYnIDogJz8nKSArIHNcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybCkge1xuICAgIHZhciByZXFJZCA9IHVuaXFpZCsrXG4gICAgICAsIGNia2V5ID0gb1snanNvbnBDYWxsYmFjayddIHx8ICdjYWxsYmFjaycgLy8gdGhlICdjYWxsYmFjaycga2V5XG4gICAgICAsIGNidmFsID0gb1snanNvbnBDYWxsYmFja05hbWUnXSB8fCByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4KHJlcUlkKVxuICAgICAgLCBjYnJlZyA9IG5ldyBSZWdFeHAoJygoXnxcXFxcP3wmKScgKyBjYmtleSArICcpPShbXiZdKyknKVxuICAgICAgLCBtYXRjaCA9IHVybC5tYXRjaChjYnJlZylcbiAgICAgICwgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIGxvYWRlZCA9IDBcbiAgICAgICwgaXNJRTEwID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDEwLjAnKSAhPT0gLTFcblxuICAgIGlmIChtYXRjaCkge1xuICAgICAgaWYgKG1hdGNoWzNdID09PSAnPycpIHtcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoY2JyZWcsICckMT0nICsgY2J2YWwpIC8vIHdpbGRjYXJkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2J2YWwgPSBtYXRjaFszXSAvLyBwcm92aWRlZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgY2JrZXkgKyAnPScgKyBjYnZhbCkgLy8gbm8gY2FsbGJhY2sgZGV0YWlscywgYWRkICdlbVxuICAgIH1cblxuICAgIGNvbnRleHRbY2J2YWxdID0gZ2VuZXJhbENhbGxiYWNrXG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgc2NyaXB0LnNyYyA9IHVybFxuICAgIHNjcmlwdC5hc3luYyA9IHRydWVcbiAgICBpZiAodHlwZW9mIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgIT09ICd1bmRlZmluZWQnICYmICFpc0lFMTApIHtcbiAgICAgIC8vIG5lZWQgdGhpcyBmb3IgSUUgZHVlIHRvIG91dC1vZi1vcmRlciBvbnJlYWR5c3RhdGVjaGFuZ2UoKSwgYmluZGluZyBzY3JpcHRcbiAgICAgIC8vIGV4ZWN1dGlvbiB0byBhbiBldmVudCBsaXN0ZW5lciBnaXZlcyB1cyBjb250cm9sIG92ZXIgd2hlbiB0aGUgc2NyaXB0XG4gICAgICAvLyBpcyBleGVjdXRlZC4gU2VlIGh0dHA6Ly9qYXVib3VyZy5uZXQvMjAxMC8wNy9sb2FkaW5nLXNjcmlwdC1hcy1vbmNsaWNrLWhhbmRsZXItb2YuaHRtbFxuICAgICAgc2NyaXB0Lmh0bWxGb3IgPSBzY3JpcHQuaWQgPSAnX3JlcXdlc3RfJyArIHJlcUlkXG4gICAgfVxuXG4gICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoKHNjcmlwdFtyZWFkeVN0YXRlXSAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdjb21wbGV0ZScgJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnbG9hZGVkJykgfHwgbG9hZGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICBzY3JpcHQub25jbGljayAmJiBzY3JpcHQub25jbGljaygpXG4gICAgICAvLyBDYWxsIHRoZSB1c2VyIGNhbGxiYWNrIHdpdGggdGhlIGxhc3QgdmFsdWUgc3RvcmVkIGFuZCBjbGVhbiB1cCB2YWx1ZXMgYW5kIHNjcmlwdHMuXG4gICAgICBmbihsYXN0VmFsdWUpXG4gICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgbG9hZGVkID0gMVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgc2NyaXB0IHRvIHRoZSBET00gaGVhZFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXG4gICAgLy8gRW5hYmxlIEpTT05QIHRpbWVvdXRcbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsXG4gICAgICAgIGVycih7fSwgJ1JlcXVlc3QgaXMgYWJvcnRlZDogdGltZW91dCcsIHt9KVxuICAgICAgICBsYXN0VmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICAgIGxvYWRlZCA9IDFcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXF1ZXN0KGZuLCBlcnIpIHtcbiAgICB2YXIgbyA9IHRoaXMub1xuICAgICAgLCBtZXRob2QgPSAob1snbWV0aG9kJ10gfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKClcbiAgICAgICwgdXJsID0gdHlwZW9mIG8gPT09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgICAvLyBjb252ZXJ0IG5vbi1zdHJpbmcgb2JqZWN0cyB0byBxdWVyeS1zdHJpbmcgZm9ybSB1bmxlc3Mgb1sncHJvY2Vzc0RhdGEnXSBpcyBmYWxzZVxuICAgICAgLCBkYXRhID0gKG9bJ3Byb2Nlc3NEYXRhJ10gIT09IGZhbHNlICYmIG9bJ2RhdGEnXSAmJiB0eXBlb2Ygb1snZGF0YSddICE9PSAnc3RyaW5nJylcbiAgICAgICAgPyByZXF3ZXN0LnRvUXVlcnlTdHJpbmcob1snZGF0YSddKVxuICAgICAgICA6IChvWydkYXRhJ10gfHwgbnVsbClcbiAgICAgICwgaHR0cFxuICAgICAgLCBzZW5kV2FpdCA9IGZhbHNlXG5cbiAgICAvLyBpZiB3ZSdyZSB3b3JraW5nIG9uIGEgR0VUIHJlcXVlc3QgYW5kIHdlIGhhdmUgZGF0YSB0aGVuIHdlIHNob3VsZCBhcHBlbmRcbiAgICAvLyBxdWVyeSBzdHJpbmcgdG8gZW5kIG9mIFVSTCBhbmQgbm90IHBvc3QgZGF0YVxuICAgIGlmICgob1sndHlwZSddID09ICdqc29ucCcgfHwgbWV0aG9kID09ICdHRVQnKSAmJiBkYXRhKSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBkYXRhKVxuICAgICAgZGF0YSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAob1sndHlwZSddID09ICdqc29ucCcpIHJldHVybiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpXG5cbiAgICAvLyBnZXQgdGhlIHhociBmcm9tIHRoZSBmYWN0b3J5IGlmIHBhc3NlZFxuICAgIC8vIGlmIHRoZSBmYWN0b3J5IHJldHVybnMgbnVsbCwgZmFsbC1iYWNrIHRvIG91cnNcbiAgICBodHRwID0gKG8ueGhyICYmIG8ueGhyKG8pKSB8fCB4aHIobylcblxuICAgIGh0dHAub3BlbihtZXRob2QsIHVybCwgb1snYXN5bmMnXSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgc2V0SGVhZGVycyhodHRwLCBvKVxuICAgIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pXG4gICAgaWYgKGNvbnRleHRbeERvbWFpblJlcXVlc3RdICYmIGh0dHAgaW5zdGFuY2VvZiBjb250ZXh0W3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICBodHRwLm9ubG9hZCA9IGZuXG4gICAgICAgIGh0dHAub25lcnJvciA9IGVyclxuICAgICAgICAvLyBOT1RFOiBzZWVcbiAgICAgICAgLy8gaHR0cDovL3NvY2lhbC5tc2RuLm1pY3Jvc29mdC5jb20vRm9ydW1zL2VuLVVTL2lld2ViZGV2ZWxvcG1lbnQvdGhyZWFkLzMwZWYzYWRkLTc2N2MtNDQzNi1iOGE5LWYxY2ExOWI0ODEyZVxuICAgICAgICBodHRwLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHt9XG4gICAgICAgIHNlbmRXYWl0ID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZVJlYWR5U3RhdGUodGhpcywgZm4sIGVycilcbiAgICB9XG4gICAgb1snYmVmb3JlJ10gJiYgb1snYmVmb3JlJ10oaHR0cClcbiAgICBpZiAoc2VuZFdhaXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICAgIH0sIDIwMClcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgfVxuICAgIHJldHVybiBodHRwXG4gIH1cblxuICBmdW5jdGlvbiBSZXF3ZXN0KG8sIGZuKSB7XG4gICAgdGhpcy5vID0gb1xuICAgIHRoaXMuZm4gPSBmblxuXG4gICAgaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRUeXBlKGhlYWRlcikge1xuICAgIC8vIGpzb24sIGphdmFzY3JpcHQsIHRleHQvcGxhaW4sIHRleHQvaHRtbCwgeG1sXG4gICAgaWYgKGhlYWRlciA9PT0gbnVsbCkgcmV0dXJuIHVuZGVmaW5lZDsgLy9JbiBjYXNlIG9mIG5vIGNvbnRlbnQtdHlwZS5cbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqc29uJykpIHJldHVybiAnanNvbidcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCdqYXZhc2NyaXB0JykpIHJldHVybiAnanMnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgndGV4dCcpKSByZXR1cm4gJ2h0bWwnXG4gICAgaWYgKGhlYWRlci5tYXRjaCgneG1sJykpIHJldHVybiAneG1sJ1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdChvLCBmbikge1xuXG4gICAgdGhpcy51cmwgPSB0eXBlb2YgbyA9PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgIHRoaXMudGltZW91dCA9IG51bGxcblxuICAgIC8vIHdoZXRoZXIgcmVxdWVzdCBoYXMgYmVlbiBmdWxmaWxsZWQgZm9yIHB1cnBvc2VcbiAgICAvLyBvZiB0cmFja2luZyB0aGUgUHJvbWlzZXNcbiAgICB0aGlzLl9mdWxmaWxsZWQgPSBmYWxzZVxuICAgIC8vIHN1Y2Nlc3MgaGFuZGxlcnNcbiAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uKCl7fVxuICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMgPSBbXVxuICAgIC8vIGVycm9yIGhhbmRsZXJzXG4gICAgdGhpcy5fZXJyb3JIYW5kbGVycyA9IFtdXG4gICAgLy8gY29tcGxldGUgKGJvdGggc3VjY2VzcyBhbmQgZmFpbCkgaGFuZGxlcnNcbiAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzID0gW11cbiAgICB0aGlzLl9lcnJlZCA9IGZhbHNlXG4gICAgdGhpcy5fcmVzcG9uc2VBcmdzID0ge31cblxuICAgIHZhciBzZWxmID0gdGhpc1xuXG4gICAgZm4gPSBmbiB8fCBmdW5jdGlvbiAoKSB7fVxuXG4gICAgaWYgKG9bJ3RpbWVvdXQnXSkge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRpbWVkT3V0KClcbiAgICAgIH0sIG9bJ3RpbWVvdXQnXSlcbiAgICB9XG5cbiAgICBpZiAob1snc3VjY2VzcyddKSB7XG4gICAgICB0aGlzLl9zdWNjZXNzSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snc3VjY2VzcyddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob1snZXJyb3InXSkge1xuICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snZXJyb3InXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChvWydjb21wbGV0ZSddKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydjb21wbGV0ZSddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUgKHJlc3ApIHtcbiAgICAgIG9bJ3RpbWVvdXQnXSAmJiBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuICAgICAgc2VsZi50aW1lb3V0ID0gbnVsbFxuICAgICAgd2hpbGUgKHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzIChyZXNwKSB7XG4gICAgICB2YXIgdHlwZSA9IG9bJ3R5cGUnXSB8fCByZXNwICYmIHNldFR5cGUocmVzcC5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJykpIC8vIHJlc3AgY2FuIGJlIHVuZGVmaW5lZCBpbiBJRVxuICAgICAgcmVzcCA9ICh0eXBlICE9PSAnanNvbnAnKSA/IHNlbGYucmVxdWVzdCA6IHJlc3BcbiAgICAgIC8vIHVzZSBnbG9iYWwgZGF0YSBmaWx0ZXIgb24gcmVzcG9uc2UgdGV4dFxuICAgICAgdmFyIGZpbHRlcmVkUmVzcG9uc2UgPSBnbG9iYWxTZXR1cE9wdGlvbnMuZGF0YUZpbHRlcihyZXNwLnJlc3BvbnNlVGV4dCwgdHlwZSlcbiAgICAgICAgLCByID0gZmlsdGVyZWRSZXNwb25zZVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQgPSByXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGNhbid0IGFzc2lnbiB0aGlzIGluIElFPD04LCBqdXN0IGlnbm9yZVxuICAgICAgfVxuICAgICAgaWYgKHIpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXNwID0gY29udGV4dC5KU09OID8gY29udGV4dC5KU09OLnBhcnNlKHIpIDogZXZhbCgnKCcgKyByICsgJyknKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlc3AsICdDb3VsZCBub3QgcGFyc2UgSlNPTiBpbiByZXNwb25zZScsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnanMnOlxuICAgICAgICAgIHJlc3AgPSBldmFsKHIpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgcmVzcCA9IHJcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd4bWwnOlxuICAgICAgICAgIHJlc3AgPSByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvciAvLyBJRSB0cm9sb2xvXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5lcnJvckNvZGVcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLnJlYXNvblxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fZnVsZmlsbGVkID0gdHJ1ZVxuICAgICAgZm4ocmVzcClcbiAgICAgIHNlbGYuX3N1Y2Nlc3NIYW5kbGVyKHJlc3ApXG4gICAgICB3aGlsZSAoc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3AgPSBzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLnNoaWZ0KCkocmVzcClcbiAgICAgIH1cblxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aW1lZE91dCgpIHtcbiAgICAgIHNlbGYuX3RpbWVkT3V0ID0gdHJ1ZVxuICAgICAgc2VsZi5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcnJvcihyZXNwLCBtc2csIHQpIHtcbiAgICAgIHJlc3AgPSBzZWxmLnJlcXVlc3RcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5yZXNwID0gcmVzcFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLm1zZyA9IG1zZ1xuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnQgPSB0XG4gICAgICBzZWxmLl9lcnJlZCA9IHRydWVcbiAgICAgIHdoaWxlIChzZWxmLl9lcnJvckhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fZXJyb3JIYW5kbGVycy5zaGlmdCgpKHJlc3AsIG1zZywgdClcbiAgICAgIH1cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ID0gZ2V0UmVxdWVzdC5jYWxsKHRoaXMsIHN1Y2Nlc3MsIGVycm9yKVxuICB9XG5cbiAgUmVxd2VzdC5wcm90b3R5cGUgPSB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2Fib3J0ZWQgPSB0cnVlXG4gICAgICB0aGlzLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAsIHJldHJ5OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0LmNhbGwodGhpcywgdGhpcy5vLCB0aGlzLmZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNtYWxsIGRldmlhdGlvbiBmcm9tIHRoZSBQcm9taXNlcyBBIENvbW1vbkpzIHNwZWNpZmljYXRpb25cbiAgICAgKiBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Qcm9taXNlcy9BXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBgdGhlbmAgd2lsbCBleGVjdXRlIHVwb24gc3VjY2Vzc2Z1bCByZXF1ZXN0c1xuICAgICAqL1xuICAsIHRoZW46IGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBzdWNjZXNzID0gc3VjY2VzcyB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgZmFpbCA9IGZhaWwgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AgPSBzdWNjZXNzKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmYWlsKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Z1bGZpbGxtZW50SGFuZGxlcnMucHVzaChzdWNjZXNzKVxuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZmFpbClcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGFsd2F5c2Agd2lsbCBleGVjdXRlIHdoZXRoZXIgdGhlIHJlcXVlc3Qgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICAgKi9cbiAgLCBhbHdheXM6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCB8fCB0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYGZhaWxgIHdpbGwgZXhlY3V0ZSB3aGVuIHRoZSByZXF1ZXN0IGZhaWxzXG4gICAgICovXG4gICwgZmFpbDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICwgJ2NhdGNoJzogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWlsKGZuKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW9bJ2Rpc2FibGVkJ10pXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUob1snYXR0cmlidXRlcyddWyd2YWx1ZSddICYmIG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXVsnc3BlY2lmaWVkJ10gPyBvWyd2YWx1ZSddIDogb1sndGV4dCddKSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV1bJ25hbWUnXSwgb1tpXVsndmFsdWUnXSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpKSBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvWyd0eXBlJ10gJiYgKG9bJ21ldGhvZCddID0gb1sndHlwZSddKSAmJiBkZWxldGUgb1sndHlwZSddXG4gICAgICBvWydkYXRhVHlwZSddICYmIChvWyd0eXBlJ10gPSBvWydkYXRhVHlwZSddKVxuICAgICAgb1snanNvbnBDYWxsYmFjayddICYmIChvWydqc29ucENhbGxiYWNrTmFtZSddID0gb1snanNvbnBDYWxsYmFjayddKSAmJiBkZWxldGUgb1snanNvbnBDYWxsYmFjayddXG4gICAgICBvWydqc29ucCddICYmIChvWydqc29ucENhbGxiYWNrJ10gPSBvWydqc29ucCddKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIENvbnRleHREYXRhTGlzdCA9IHJlcXVpcmUoXCIuL0NvbnRleHREYXRhTGlzdC5qc1wiKTtcbnZhciBCdXR0b25zTWFuYWdlciA9IHJlcXVpcmUoXCIuL0J1dHRvbnNNYW5hZ2VyLmpzXCIpO1xudmFyIFBhZ2VNYW5hZ2VyID0gcmVxdWlyZShcIi4vUGFnZU1hbmFnZXIuanNcIik7XG5cbi8qKiBcbiAqIEJpb0NJREVSIENvbXBvbmVudC5cbiAqXG4gKiBQdXJwb3NlIG9mIHRoaXMgd2lkZ2V0IGlzIHNob3dpbmcgdG8gdGhlIHVzZXIsIHdpdGhvdXQgYW55IGRpcmVjdCBhY3Rpb24gYnkgaGltc2VsZixcbiAqIGluZm9ybWF0aW9uIG9mIGhpcyBpbnRlcmVzdCByZWxhdGVkIHdpdGggdGhlIGNvbnRlbnQgdGhhdCBpcyBiZWluZyBzaG93biBjdXJyZW50bHkgdG8gaGltIC5cbiAqIFRvIGFjaGlldmUgdGhpcywgd2UgY29sbGVjdCBpbiBhIFNvbHIgc3lzdGVtIGluZm9ybWF0aW9uIG9mIGRpZmZlcmVudCByZXBvc2l0b3JpZXNcbiAqIChFbGl4aXIgU2VydmljZSBSZWdpc3RyeSwgRWxpeGlyIFRyYWluaW5nIFBvcnRhbCwgYW5kIEVsaXhpciBFdmVudHMgUG9ydGFsLCB1bnRpbCBub3cpLCBzb1xuICogd2UgY2FuIHNlYXJjaCBpbnRvIHRoaXMgaW5mb3JtYXRpb24gd2hpY2ggaXMgcmVsYXRlZCB3aXRoIGNvbnRlbnQgYWNjZXNlZCBieSB1c2VyLlxuICogXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldElkICBJZCBvZiB0aGUgbWFpbiBjb250YWluZXIgdG8gcHV0IHRoaXMgY29tcG9uZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHREYXRhTGlzdE9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG1haW4gb3B0aW9ucyBmb3IgQ29udGV4dERhdGFMaXN0IHN1YmNvbXBvbmVudC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRDbGFzcz0nWW91ck93bkNsYXNzJ11cbiAqICAgIFx0XHRDbGFzcyBuYW1lIG9mIHRoZSBESVYgd2hlcmUgdGhlIENvbnRleHREYXRhTGlzdCBvYmplY3Qgc2hvdWxkIGJlIGRpc3BsYXllZC4gIFxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFtkaXNwbGF5U3R5bGU9IENvbnRleHREYXRhTGlzdC5GVUxMX1NUWUxFLCBDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFXVxuICogICAgXHRcdFR5cGUgb2Ygcm93cyB2aXN1YWxpc2F0aW9uLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dElkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBcdFx0VGFnIGlkIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dENsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guIEl0J3Mgbm90IHVzZWQgaWYgdXNlclRleHRJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dFRhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIFx0XHRUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC4gSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIG9yIHVzZXJUZXh0Q2xhc3NDb250YWluZXIgaXMgZGVmaW5lZFxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyS2V5d29yZHNJZENvbnRhaW5lcj1Zb3VyIG93biB0YWcgaWQgXVxuICogICAgXHRcdFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIFx0XHRDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBcdFx0SXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyS2V5d29yZHNUYWdDb250YWluZXI9T25lIHN0YWJsaXNoZWQgdGFnIG5hbWUsIGZvciBleGFtcGxlIGgxLiBdXG4gKiAgICBcdFx0VGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIFx0XHRJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIG9yIHVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge0hUTUwgb2JqZWN0fSBbdXNlcktleXdvcmRzQ29udGFpbmVyPVRoZSBodG1sIGtleXdvcmRzIGNvbnRhaW5lciBpdHNlbGYuIF1cbiAqICAgIFx0XHRIVE1MIG9iamVjdCB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgXHRcdEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIsIHVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyIG9yIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgZGVzY3JpcHRpb24gdG8gaGVscCBmaWx0ZXIgc2FtZSByZXN1bHRzIHRoYXQgdXNlciBpcyBzZWVpbmcuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJIZWxwQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IHdpbGwgY29udGFpbnMgaGVscCBpY29uLlxuICogXHRAb3B0aW9uIHtpbnR9IFtudW1iZXJSZXN1bHRzPW51bWJlciBdXG4gKiAgICBcdFx0SW50ZWdlciB0aGF0IHJlc3RyaWN0cyB0aGUgcmVzdWx0cyBudW1iZXIgdGhhdCBzaG91bGQgYmUgc2hvd24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyAgQW4gb2JqZWN0IHdpdGggdGhlIG1haW4gb3B0aW9ucyBmb3IgQnV0dG9uc01hbmFnZXIgc3ViY29tcG9uZW50LlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0Q2xhc3M9J1lvdXJPd25DbGFzcyddXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSBvZiB0aGUgRElWIHdoZXJlIHRoZSBCdXR0b25zTWFuYWdlciBvYmplY3Qgc2hvdWxkIGJlIGRpc3BsYXllZC4gIFxuICogXHRAb3B0aW9uIHtib29sZWFufSBbaGVscFRleHRdXG4gKiAgICBcdFx0VHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IGEgaGVscCB0ZXh0IG92ZXIgdGhlIGJ1dHRvbnMuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW2J1dHRvbnNTdHlsZT0nU1FVQVJFRF8zRCcgLCAnUk9VTkRfRkxBVCcgb3IgJ0lDT05TX09OTFknLiBJQ09OU19PTkxZIGJ5IGRlZmF1bHQuXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIGJ1dHRvbnMgdmlzdWFsaXNhdGlvbiB0eXBlLlxuICogXHRAb3B0aW9uIHtib29sZWFufSBbcHJlc3NlZFVuZGVybGluZXNdXG4gKiAgICBcdFx0VHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IHVuZGVybGluZXMgd2hlbiB5b3UgcHJlc3MgYSBidXR0b24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhZ2VNYW5hZ2VyT3B0aW9ucyAgQW4gb2JqZWN0IHdpdGggdGhlIG1haW4gb3B0aW9ucyBmb3IgUGFnZU1hbmFnZXIgc3ViY29tcG9uZW50LlxuICpcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldElkPSdZb3VyT3duRGl2SWQnXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRDbGFzcz0nWW91ck93bkNsYXNzJ11cbiAqICAgIFx0XHRDbGFzcyBuYW1lIG9mIHRoZSBESVYgd2hlcmUgdGhlIFBhZ2VNYW5hZ2VyIG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKi9cbi8vZnVuY3Rpb24gQmlvQ2lkZXIgKHRhcmdldElkLCBjb250ZXh0RGF0YUxpc3RPcHRpb25zLCBidXR0b25zTWFuYWdlck9wdGlvbnMscGFnZU1hbmFnZXJPcHRpb25zKSB7XG52YXIgYmlvY2lkZXIgPSBmdW5jdGlvbiAodGFyZ2V0SWQsIGNvbnRleHREYXRhTGlzdE9wdGlvbnMsIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyxwYWdlTWFuYWdlck9wdGlvbnMpIHtcblx0XG5cdHRoaXMudGFyZ2V0SWQgPSB0YXJnZXRJZDtcblx0dGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zID0ge307XG5cdHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zID0ge307XG5cdHRoaXMucGFnZU1hbmFnZXJPcHRpb25zID0ge307XG5cdFxuXHR2YXIgZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnMgPSB7XG5cdFx0dGFyZ2V0SWQ6ICdjb250ZXh0X2RhdGFfbGlzdCcsXG5cdFx0dGFyZ2V0Q2xhc3M6ICdjb250ZXh0X2RhdGFfbGlzdCcsXG5cdFx0dXNlclRleHRUYWdDb250YWluZXI6ICdoMScsXG5cdFx0bnVtYmVyUmVzdWx0czogNSxcblx0XHRkaXNwbGF5U3R5bGU6IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRlVMTF9TVFlMRSxcblx0XHR1c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcjogJ2NvbnRleHRfZGVzY3JpcHRpb25fY29udGFpbmVyJ1xuXHR9O1xuXHRcblx0dmFyIGRlZmF1bHRCdXR0b25zTWFuYWdlck9wdGlvbnMgPSB7XG5cdFx0dGFyZ2V0SWQ6ICdidXR0b25zX21hbmFnZXJfY29udGFpbmVyJyxcblx0XHR0YXJnZXRDbGFzczogJ2J1dHRvbl9jb250YWluZXInLFxuXHRcdGhlbHBUZXh0OiB0cnVlLFxuXHRcdGJ1dHRvbnNTdHlsZTpjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfSUNPTlNfT05MWSxcblx0XHRwcmVzc2VkVW5kZXJsaW5lczp0cnVlXG5cdH07XG5cdFxuXHR2YXIgZGVmYXVsdFBhZ2VNYW5hZ2VyT3B0aW9ucyA9IHtcblx0XHR0YXJnZXRDbGFzczogJ3BhZ2VfbWFuYWdlcl9jb250YWluZXInLFxuXHRcdHRhcmdldElkOiAncGFnZV9tYW5hZ2VyX2NvbnRhaW5lcidcblx0fVxuXHRcblx0XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRDb250ZXh0RGF0YUxpc3RPcHRpb25zKXtcblx0ICAgICB0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XSA9IGRlZmF1bHRDb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gY29udGV4dERhdGFMaXN0T3B0aW9ucyl7XG5cdCAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV0gPSBjb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdEJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNba2V5XSA9IGRlZmF1bHRCdXR0b25zTWFuYWdlck9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBidXR0b25zTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV0gPSBidXR0b25zTWFuYWdlck9wdGlvbnNba2V5XTtcblx0fVxuXHRcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdFBhZ2VNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5wYWdlTWFuYWdlck9wdGlvbnNba2V5XSA9IGRlZmF1bHRQYWdlTWFuYWdlck9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBwYWdlTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMucGFnZU1hbmFnZXJPcHRpb25zW2tleV0gPSBwYWdlTWFuYWdlck9wdGlvbnNba2V5XTtcblx0fVxuXHRcblx0XG4gICAgICAgIFxufVxuXG5cbi8qKiBcbiAqIEJpb0NpZGVyIGZ1bmN0aW9uYWxpdHkuXG4gKiBcbiAqIEBjbGFzcyBCaW9DaWRlclxuICogXG4gKi9cbmJpb2NpZGVyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IGJpb2NpZGVyLFxuXG5cdCAgICAgIFxuICAgICAgICBcblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGRpZmZlcmVudCBvYmplY3RzIGFuZCBkcmF3IHRoZW0uXG5cdCAqLyAgICAgICAgXG5cdGRyYXcgOiBmdW5jdGlvbiAoKXtcblx0XHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcnMoKTtcblx0XHRcdFx0XHRcdFxuXHRcdHZhciBjb250ZXh0RGF0YUxpc3RJbnN0YW5jZSA9IG5ldyBDb250ZXh0RGF0YUxpc3QodGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zKTtcblx0XHRcblx0XHQvLyBiZWZvcmUgaW5pdGlhbGlzaW5nIHRoZSBtYWluIGNvbXBvbmVudCwgd2Ugc2hvdWxkIGluaXRpYWxpc2UgaXRzICdwbHVnaW5zJy5cblx0XHR2YXIgYnV0dG9uc0luc3RhbmNlID0gbmV3IEJ1dHRvbnNNYW5hZ2VyKGNvbnRleHREYXRhTGlzdEluc3RhbmNlLHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zKTtcblx0XHRidXR0b25zSW5zdGFuY2UuYnVpbGRQcmVzc2VkQnV0dG9ucygpO1xuXHRcdFxuXHRcdHZhciBwYWdlTWFuYWdlckluc3RhbmNlID0gbmV3IFBhZ2VNYW5hZ2VyKGNvbnRleHREYXRhTGlzdEluc3RhbmNlLHRoaXMucGFnZU1hbmFnZXJPcHRpb25zKTtcblx0XHRwYWdlTWFuYWdlckluc3RhbmNlLmJ1aWxkKCk7XG5cdFx0XG5cdFx0XG5cdFx0Ly90cmlnZ2VycyB0aGUgY29udGV4dHVhbGlzZWQgZGF0YSBsb2FkaW5nIHByb2Nlc3Ncblx0XHRjb250ZXh0RGF0YUxpc3RJbnN0YW5jZS5kcmF3Q29udGV4dERhdGFMaXN0KCk7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogRnVuY3Rpb24gdG8gY3JlYXRlIG9yIHJldXNlIGludGVybmFsIGNvbnRhaW5lcnMgb2YgZWFjaCBzdWJjb21wb25lbnQuXG5cdCAqL1xuXHRpbml0Q29udGFpbmVyczogZnVuY3Rpb24oKXtcblx0XHRcblx0XHR0aGlzLmluaXRDb250YWluZXIodGhpcy50YXJnZXRJZCxcblx0XHRcdFx0dGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNbJ3RhcmdldElkJ10sXG5cdFx0XHRcdHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zWyd0YXJnZXRDbGFzcyddKTtcblx0XHRcblx0XHR0aGlzLmluaXRDb250YWluZXIodGhpcy50YXJnZXRJZCxcblx0XHRcdFx0dGhpcy5wYWdlTWFuYWdlck9wdGlvbnNbJ3RhcmdldElkJ10sXG5cdFx0XHRcdHRoaXMucGFnZU1hbmFnZXJPcHRpb25zWyd0YXJnZXRDbGFzcyddKTtcblx0XHRcblx0XHR0aGlzLmluaXRDb250YWluZXIodGhpcy50YXJnZXRJZCxcblx0XHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zWyd0YXJnZXRJZCddLFxuXHRcdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNbJ3RhcmdldENsYXNzJ10pO1xuXHRcdFxuXHRcdFxuXHRcdFxuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEF1eGlsaWFyeSBmdW5jdGlvbiB0byBjcmVhdGUgb3IgcmV1c2UgaW50ZXJuYWwgY29udGFpbmVycyBvZiBvbmUgc3ViY29tcG9uZW50LlxuXHQgKiBAcGFyYW0gZ2xvYmFsQ29udGFpbmVySWQge3N0cmluZ30gSWQgb2YgdGhlIEJpb0NpZGVyIGRpdiBjb250YWluZXIuXG5cdCAqIEBwYXJhbSBjb250YWluZXJJZCB7c3RyaW5nfSBJZCBvZiB0aGUgbG9jYWwgc3ViY29tcG9uZW50IGRpdiBjb250YWluZXIuXG5cdCAqIEBwYXJhbSBjb250YWluZXJDbGFzcyB7c3RyaW5nfSBDbGFzcyBuYW1lIHRvIGFwcGx5IHRvIHRoZSBzdWJjb21wb25lbnQgY29udGFpbmVyLlxuXHQgKi9cblx0aW5pdENvbnRhaW5lciA6IGZ1bmN0aW9uKGdsb2JhbENvbnRhaW5lcklkLCBjb250YWluZXJJZCwgY29udGFpbmVyQ2xhc3Mpe1xuXHRcdHZhciBnbG9iYWxDb250YWluZXJFeGlzdHMgPSBmYWxzZTtcblx0XHR2YXIgbG9jYWxDb250YWluZXJFeGlzdHMgPSBmYWxzZTtcblx0XHR2YXIgZ2xvYmFsQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZ2xvYmFsQ29udGFpbmVySWQpO1xuXHRcdGlmIChnbG9iYWxDb250YWluZXIgIT0gdW5kZWZpbmVkIHx8IGdsb2JhbENvbnRhaW5lciAhPSBudWxsKXtcblx0XHRcdGdsb2JhbENvbnRhaW5lckV4aXN0cyA9IHRydWU7XG5cdFx0fVxuXHRcdGlmIChjb250YWluZXJJZCAhPSB1bmRlZmluZWQgJiYgY29udGFpbmVySWQgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklkKTtcblx0XHRcdGlmIChjb250YWluZXIgIT0gdW5kZWZpbmVkICYmIGNvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNvbnRhaW5lckNsYXNzKTtcblx0XHRcdH1lbHNle1x0Ly8gbmVlZCB0byBjcmVhdGUgdGhlIHN1YmNvbnRhaW5lclxuXHRcdFx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0Y29udGFpbmVyLmlkID0gY29udGFpbmVySWQ7XG5cdFx0XHRcdGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNvbnRhaW5lckNsYXNzKTtcblx0XHRcdFx0aWYgKGdsb2JhbENvbnRhaW5lckV4aXN0cykge1xuXHRcdFx0XHRcdGdsb2JhbENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ZWxzZXtcdC8vIGlmIHdlIGRvbid0IGhhdmUgYSBjb250YWluZXJJZCwgd2UgY2FuIHRyeSB0byBkbyB0aGUgc2FtZSB3aXRoIHRoZSBjbGFzc05hbWVcblx0XHRcdHZhciBwb3NzaWJsZUNvbnRhaW5lcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbnRhaW5lckNsYXNzKTtcblx0XHRcdHZhciBjb250YWluZXIgPSBudWxsO1xuXHRcdFx0aWYgKHBvc3NpYmxlQ29udGFpbmVycyAhPSBudWxsICYmIHBvc3NpYmxlQ29udGFpbmVycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHBvc3NpYmxlQ29udGFpbmVyc1swXTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGNvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgY29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdFx0Ly8gbm90aGluZyB0byBkb1xuXHRcdFx0fWVsc2V7XHQvLyBuZWVkIHRvIGNyZWF0ZSB0aGUgc3ViY29udGFpbmVyXG5cdFx0XHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRjb250YWluZXIuaWQgPSBjb250YWluZXJJZDtcblx0XHRcdFx0aWYgKGdsb2JhbENvbnRhaW5lckV4aXN0cykge1xuXHRcdFx0XHRcdGdsb2JhbENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdH1cbiAgICAgICAgXG4gICAgICAgIFxufVxuICAgICAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBiaW9jaWRlcjtcbiAgIl19
