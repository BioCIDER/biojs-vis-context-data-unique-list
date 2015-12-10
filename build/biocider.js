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
                                                if (pos == 0) {
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
		}else{
			elementsContainer = document.getElementsByTagName(this.userKeywordsTagContainer);
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
		var text = 'Cannot be found any related result';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0J1dHRvbnNNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db21tb25EYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db250ZXh0RGF0YUxpc3QuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0RhdGFNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9FbGl4aXJFdmVudERhdGEuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0VsaXhpclJlZ2lzdHJ5RGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvRWxpeGlyVHJhaW5pbmdEYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9QYWdlTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiLi9qcy9CaW9DaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcblxuLyoqIFxuICogQnV0dG9ucycgZmlsdGVyaW5nIGNvbnN0cnVjdG9yLlxuICogXG4gKiBAY2xhc3MgQnV0dG9uc01hbmFnZXJcbiAqXG4gKiBAcGFyYW0ge0NvbnRleHREYXRhTGlzdCBPYmplY3R9IFJlZmVyZW5jZSB0byBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGluIG9yZGVyIHRvIG1hbmFnZSBpdHMgZmlsdGVycy5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIEJ1dHRvbnNNYW5hZ2VyIGNvbXBvbmVudC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3RhcmdldD0nWW91ck93bkRpdklkJ11cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW2hlbHBUZXh0XVxuICogICAgVHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IGEgaGVscCB0ZXh0IG92ZXIgdGhlIGJ1dHRvbnMuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFtidXR0b25zU3R5bGU9J1NRVUFSRURfM0QnICwgJ1JPVU5EX0ZMQVQnIG9yICdJQ09OU19PTkxZJy4gSUNPTlNfT05MWSBieSBkZWZhdWx0Ll1cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIGJ1dHRvbnMgdmlzdWFsaXNhdGlvbiB0eXBlLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW3ByZXNzZWRVbmRlcmxpbmVzXVxuICogICAgVHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IHVuZGVybGluZXMgd2hlbiB5b3UgcHJlc3MgYSBidXR0b24uXG4gKi9cbnZhciBCdXR0b25zTWFuYWdlciA9IGZ1bmN0aW9uKGNvbnRleHREYXRhTGlzdCwgb3B0aW9ucykge1xuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcblx0XHRoZWxwVGV4dDogdHJ1ZSxcblx0XHRidXR0b25zU3R5bGU6IGNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9TUVVBUkVEXzNELFxuXHRcdHByZXNzZWRVbmRlcmxpbmVzOiBmYWxzZVxuXHR9O1xuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcblx0XHR0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XHRcblx0fVxuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0XHR0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cbiAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QgPSBjb250ZXh0RGF0YUxpc3Q7XG5cdHRoaXMuYnV0dG9uc0Jhc2ljRGF0YSA9IFtdO1xuXHQvLyBCQVNJQyBCVVRUT04nUyBEQVRBOiBMQUJFTCwgSU5URVJOQUwgQ0xBU1MgTkFNRSwgSU5URVJOQUwgTkFNRSBBTkQgSEVMUCBURVhUXG5cdHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5wdXNoKFsnRGF0YWJhc2UnLCdkYXRhYmFzZScsJ2RhdGFiYXNlJywnRGF0YWJhc2VzJ10sXG5cdFx0XHRcdCAgIFsnRXZlbnRzJywnZXZlbnRzJywnRXZlbnQnLCdFdmVudHMnXSxcblx0XHRcdFx0ICAgWydUb29scycsJ3Rvb2xzJywnVG9vbCcsJ1Rvb2xzJ10sXG5cdFx0XHRcdCAgIFsnVHJhaW5pbmcgbWF0ZXJpYWxzJywndHJhaW5pbmdfbWF0ZXJpYWwnLCdUcmFpbmluZyBNYXRlcmlhbCcsJ1RyYWluaW5nIG1hdGVyaWFscyddXG5cdCk7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0LnJlZ2lzdGVyT25Mb2FkZWRGdW5jdGlvbih0aGlzLCB0aGlzLnVwZGF0ZUJ1dHRvbnNTdGF0dXMpO1xufVxuXG4vKipcbiAqICAgICAgQnV0dG9uc01hbmFnZXIgY2xhc3MuIFJlcHJlc2VudHMgYSBzZXQgb2YgZmlsdGVycyBzZWxlY3RhYmxlIHZpYSBidXR0b25zIGJ5IHVzZXJzLlxuICogXG4gKiAgICAgIEBjbGFzcyBCdXR0b25zTWFuYWdlclxuICogICAgICBcbiAqL1xuQnV0dG9uc01hbmFnZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogQnV0dG9uc01hbmFnZXIsXG4gICAgICAgIGJ1dHRvbnMgOiBbXSxcblx0XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBidXR0b25zIHN0YXR1cyBoYXZpbmcgaW50byBhY2NvdW50IENvbnRleHREYXRhTGlzdCBzdGF0dXNcbiAgICAgICAgICovICAgICAgICBcblx0dXBkYXRlQnV0dG9uc1N0YXR1cyA6IGZ1bmN0aW9uICgpe1xuXHRcdFxuXHRcdC8vIFdlIGRyYXcgc2xpZ2h0bHkgc29mdGVyIGJ1dHRvbnMgb2YgcmVzb3VyY2UgdHlwZXMgd2l0aG91dCBhbnkgcmVzdWx0c1xuXHRcdGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlICE9IG51bGwpIHtcblx0XHRcdGZvcih2YXIgcHJvcGVydHkgaW4gdGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSl7XG5cdFx0XHRcdGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuXHRcdFx0XHRcdHZhciBwcm9wZXJ0eUNvdW50ID0gdGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZVtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0dmFyIG15QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcGVydHkpO1xuXHRcdFx0XHRcdHRoaXMuc2V0QnV0dG9uQXNwZWN0QXNSZXN1bHRzKG15QnV0dG9uLHByb3BlcnR5Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcblx0XHR9XG5cdH0sXG4gICAgICAgIFxuICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGJ1dHRvbnMgYW5kIGRyYXcgdGhlbSBpbnRvIHRoZSBlbGVtZW50IHdpdGggaWQgJ3RhcmdldElkJ1xuICAgICAgICAgKi8gICAgICAgIFxuXHRidWlsZEJ1dHRvbnMgOiBmdW5jdGlvbiAoKXtcblx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRJZCk7XG5cdFx0aWYgKHRhcmdldCA9PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09IG51bGwpe1xuXHRcdFx0cmV0dXJuO1x0XG5cdFx0fVxuXHRcdFxuXHRcdGlmICh0aGlzLmhlbHBUZXh0KXtcblx0XHRcdHZhciBoZWxwVGV4dENvbnRhaW5lciA9IHRoaXMuY3JlYXRlQnV0dG9uc0hlbHBUZXh0KCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoaGVscFRleHRDb250YWluZXIpO1xuXHRcdH1cblx0XHR2YXIgcm93Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfcm93X2NvbnRhaW5lcicpO1xuXHRcdFxuXHRcdGlmICh0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoPjApIHtcblx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0LnRvdGFsRmlsdGVycyA9IFtdO1xuXHRcdH1cblx0XHRcblx0XHRmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5sZW5ndGg7aSsrKXtcblx0XHRcdHZhciBidXR0b25EYXRhID0gdGhpcy5idXR0b25zQmFzaWNEYXRhW2ldO1xuXHRcdFx0dmFyIG15QnV0dG9uID0gbnVsbDtcblx0XHRcdGlmIChjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfUk9VTkRfRkxBVCA9PSB0aGlzLmJ1dHRvbnNTdHlsZSkge1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlUm91bmRGbGF0QnV0dG9uKGJ1dHRvbkRhdGFbMF0sYnV0dG9uRGF0YVsxXSxidXR0b25EYXRhWzJdKTtcblx0XHRcdH1lbHNlIGlmIChjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfSUNPTlNfT05MWSA9PSB0aGlzLmJ1dHRvbnNTdHlsZSl7XG5cdFx0XHRcdG15QnV0dG9uID0gdGhpcy5jcmVhdGVJY29uT25seUJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZVNxdWFyZWQzRGRCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG15QnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRteUJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX2NlbGxfY29udGFpbmVyJyk7XG5cdFx0XHRteUJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChteUJ1dHRvbik7XG5cdFx0XHRyb3dDb250YWluZXIuYXBwZW5kQ2hpbGQobXlCdXR0b25Db250YWluZXIpO1xuXG5cdFx0XHR0aGlzLmJ1dHRvbnMucHVzaChteUJ1dHRvbik7XG5cdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbEZpbHRlcnMucHVzaChidXR0b25EYXRhWzJdKTtcblx0XHR9XG5cdFx0XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHJvd0NvbnRhaW5lcik7XG5cdFx0XG5cdFx0aWYgKHRoaXMucHJlc3NlZFVuZGVybGluZXMpe1xuXHRcdFx0dmFyIHVuZGVybGluZXNDb250YWluZXIgPSB0aGlzLmNyZWF0ZUJ1dHRvbnNVbmRlcmxpbmVDb250YWluZXIoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZCh1bmRlcmxpbmVzQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG5cdH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBDcmVhdGVzIHByZXNzZWQgYnV0dG9ucyBhbmQgZHJhdyB0aGVtIGludG8gdGhlIGVsZW1lbnQgd2l0aCBpZCAndGFyZ2V0SWQnXG4gICAgICAgICovICBcbiAgICAgICAgYnVpbGRQcmVzc2VkQnV0dG9ucyA6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdGhpcy5idWlsZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0J1dHRvblByZXNzZWQodGhpcy5idXR0b25zW2ldKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0J1dHRvbkNsaWNrKHRoaXMuYnV0dG9uc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG5cbiAgICAgICAgfSxcblx0XG5cdFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB3aXRoICdST1VORF9GTEFUJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZVJvdW5kRmxhdEJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG4gICAgICAgICAgICBidXR0b24udGl0bGUgPSBsYWJlbDtcbiAgICAgICAgICAgIGJ1dHRvbi5uYW1lID0gaW50ZXJuYWxOYW1lO1xuXHQgICAgYnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuICAgICAgICAgICAgYnV0dG9uLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIHZhciBteUJ1dHRvbnNNYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHQgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3JvdW5kX2ZsYXQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB3aXRoICdTUVVBUkVEXzNEJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZVNxdWFyZWQzRGRCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYnV0dG9uLnRpdGxlID0gbGFiZWw7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0ICAgIGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbi5ocmVmID0gXCIjXCI7XG4gICAgICAgICAgICB2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0ICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzcXVhcmVkXzNkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgndW5wcmVzc2VkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcbiAgICAgICAgICAgIHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnSUNPTl9PTkxZJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZUljb25Pbmx5QnV0dG9uIDogZnVuY3Rpb24obGFiZWwsIGludGVybmFsQ2xhc3MsIGludGVybmFsTmFtZSl7XG5cdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG5cdFx0YnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcblx0XHRidXR0b24udGl0bGUgPSBsYWJlbDtcblx0XHRidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0XHRidXR0b24uaWQgPSBpbnRlcm5hbE5hbWU7XG5cdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHR2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG5cdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcblx0XHQgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG5cdFx0ICAgIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uc19vbmx5Jyk7XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuXHRcdHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjaGFuZ2VzIHRoZSBzdGF0dXMgb2YgdGhlIGJ1dHRvbiBhbmQgZXhlY3V0ZXMgdGhlIHJlZHJhd24gb2YgdGhlIENvbnRleHREYXRhTGlzdFxuICAgICAgICAqIG9iamVjdCBoYXZpbmcgaW50byBhY2NvdW50IGNob3NlbiBmaWx0ZXJzLlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBiZSBwcmVzc2VkL3VucHJlc3NlZC5cbiAgICAgICAgKi8gIFxuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uIChteUJ1dHRvbil7XG4gICAgICAgICAgICB0aGlzLnNob3dCdXR0b25DbGljayhteUJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50RmlsdGVycyA9IHRoaXMuZ2V0UHJlc2VudEZpbHRlcnNCeUJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LnRvdGFsRHJhd0NvbnRleHREYXRhTGlzdCgpO1xuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjaGFuZ2VzIHRoZSBhc3BlY3Qgb2Ygb25lIGJ1dHRvbiBkZXBlbmRpbmcgb24gaWYgaXQgaGFzIGFueSBhc3NvY2lhdGVkIHJlc3VsdCBvciBub3QuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGJlIG1vZGlmaWVkLlxuICAgICAgICAqIEBwYXJhbSBudW1iZXJSZXN1bHRzIHtJbnRlZ2VyfSAtIE51bWJlciBvZiBvY2N1cnJlbmNlcyBhc3NvY2lhdGVkIHRvIHRoZSBidXR0b24uXG4gICAgICAgICovIFxuICAgICAgICBzZXRCdXR0b25Bc3BlY3RBc1Jlc3VsdHM6IGZ1bmN0aW9uIChteUJ1dHRvbiwgbnVtYmVyUmVzdWx0cyl7XG5cdFx0aWYgKG15QnV0dG9uID09IHVuZGVmaW5lZCB8fCBteUJ1dHRvbiA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm47XHQgICAgXG5cdFx0fVxuXHRcdHZhciBlbXB0eVRpdGxlU3VmZml4ID0gJyAobm8gcmVzdWx0cyknO1xuXHRcdGlmIChudW1iZXJSZXN1bHRzID09IDApIHtcblx0XHRcdG15QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG5cdFx0XHRpZiAobXlCdXR0b24udGl0bGUuaW5kZXhPZihlbXB0eVRpdGxlU3VmZml4KT09LTEpIHtcblx0XHRcdFx0bXlCdXR0b24udGl0bGUgPSBteUJ1dHRvbi50aXRsZSArIGVtcHR5VGl0bGVTdWZmaXg7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9ZWxzZXtcblx0XHRcdG15QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2VtcHR5Jyk7XG5cdFx0XHRpZiAobXlCdXR0b24udGl0bGUuaW5kZXhPZihlbXB0eVRpdGxlU3VmZml4KT4tMSkge1xuXHRcdFx0XHRteUJ1dHRvbi50aXRsZS5yZXBsYWNlKGVtcHR5VGl0bGVTdWZmaXgsJycpO1xuXHRcdFx0fVxuXHRcdH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgYXNwZWN0IG9mIG9uZSBidXR0b24gZnJvbSBwcmVzc2VkIHRvIHVucHJlc3NlZCwgb3IgdmljZSB2ZXJzYS5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gYmUgcHJlc3NlZC91bnByZXNzZWQuXG4gICAgICAgICovIFxuICAgICAgICBzaG93QnV0dG9uQ2xpY2s6IGZ1bmN0aW9uIChteUJ1dHRvbil7XG5cdFx0bXlCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcInVucHJlc3NlZFwiKTtcblx0XHRteUJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwicHJlc3NlZFwiKTtcblx0XHRpZiAodGhpcy5wcmVzc2VkVW5kZXJsaW5lcykge1xuXHRcdFx0dmFyIHVuZGVybGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG15QnV0dG9uLmlkK1wiX3VuZGVybGluZVwiKTtcblx0XHRcdGlmICh0aGlzLmlzQnV0dG9uUHJlc3NlZChteUJ1dHRvbikpIHtcblx0XHRcdFx0dW5kZXJsaW5lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHVuZGVybGluZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBpZiB0aGUgYnV0dG9uIHBhc3NlZCBhcyBhcmd1bWVudCBpcyBwcmVzc2VkIG9yIG5vdC5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gY2hlY2sgaXRzIHN0YXR1cy5cbiAgICAgICAgKiB7Qm9vbGVhbn0gLSBSZXR1cm5zIGlmIG15QnV0dG9uIGlzIHByZXNzZWQgb3Igbm90LlxuICAgICAgICAqL1xuICAgICAgICBpc0J1dHRvblByZXNzZWQ6IGZ1bmN0aW9uIChteUJ1dHRvbil7XG4gICAgICAgICAgICBpZiAoIW15QnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcInByZXNzZWRcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9ZWxzZSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhY3RpdmUgZmlsdGVycyByZWxhdGVkIHdpdGggcHJlc3NlZCBidXR0b25zLlxuICAgICAgICAqIHtBcnJheX0gLSBDdXJyZW50IGFwcGxpY2FibGUgZmlsdGVycy5cbiAgICAgICAgKi9cbiAgICAgICAgZ2V0UHJlc2VudEZpbHRlcnNCeUJ1dHRvbnMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHByZXNzZWRCdXR0b25zID0gdGhpcy5nZXRQcmVzc2VkQnV0dG9ucygpO1xuICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cHJlc3NlZEJ1dHRvbnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgZmlsdGVycy5wdXNoKHByZXNzZWRCdXR0b25zW2ldLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcnM7ICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGFsbCBwcmVzc2VkIGJ1dHRvbnMuXG4gICAgICAgICoge0FycmF5fSAtIEN1cnJlbnQgcHJlc3NlZCBidXR0b25zLlxuICAgICAgICAqL1xuICAgICAgICBnZXRQcmVzc2VkQnV0dG9ucyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgcHJlc3NlZEJ1dHRvbnMgPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQnV0dG9uUHJlc3NlZCh0aGlzLmJ1dHRvbnNbaV0pKXtcbiAgICAgICAgICAgICAgICAgICAgcHJlc3NlZEJ1dHRvbnMucHVzaCh0aGlzLmJ1dHRvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmVzc2VkQnV0dG9ucztcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHBhcmFncmFwaCBlbGVtZW50IHdpdGggc3BlY2lmaWMgdGV4dCBhYm91dCBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9uXG5cdCogICB7SFRNTCBPYmplY3R9IC0gZGl2IGVsZW1lbnQgd2l0aCBoZWxwIHJlbGF0ZWQgdG8gZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvbnMuXG4gICAgICAgICovXG5cdGNyZWF0ZUJ1dHRvbnNIZWxwVGV4dCA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGhlbHBfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0aGVscF9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19yb3dfY29udGFpbmVyJyk7XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdFxuXHRcdFx0dmFyIG15VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdG15VGV4dC5pbm5lckhUTUwgPSBidXR0b25EYXRhWzNdO1xuXHRcdFx0bXlUZXh0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl9oZWxwJyk7XG5cdFx0XHRoZWxwX2NvbnRhaW5lci5hcHBlbmRDaGlsZChteVRleHQpO1x0XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBoZWxwX2NvbnRhaW5lcjtcblx0fSxcblx0XG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXJhZ3JhcGggZWxlbWVudCB3aXRoIHNwZWNpZmljIHRleHQgYWJvdXQgZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvblxuXHQqICAge0hUTUwgT2JqZWN0fSAtIGRpdiBlbGVtZW50IHdpdGggaGVscCByZWxhdGVkIHRvIGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25zLlxuICAgICAgICAqL1xuXHRjcmVhdGVCdXR0b25zVW5kZXJsaW5lQ29udGFpbmVyIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgdW5kZXJsaW5lc19jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR1bmRlcmxpbmVzX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3Jvd19jb250YWluZXInKTtcblx0XHRcblx0XHRmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5sZW5ndGg7aSsrKXtcblx0XHRcdHZhciBidXR0b25EYXRhID0gdGhpcy5idXR0b25zQmFzaWNEYXRhW2ldO1xuXHRcdFx0dmFyIG15VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdG15VGV4dC5pZCA9IGJ1dHRvbkRhdGFbMl0rXCJfdW5kZXJsaW5lXCI7XG5cdFx0XHRteVRleHQuY2xhc3NMaXN0LmFkZCgnYnV0dG9uX3VuZGVybGluZScpO1xuXHRcdFx0XG5cdFx0XHR2YXIgbXlVbmRlcmxpbmVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdG15VW5kZXJsaW5lQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfdW5kZXJsaW5lX2NlbGxfY29udGFpbmVyJyk7XG5cdFx0XHRteVVuZGVybGluZUNvbnRhaW5lci5hcHBlbmRDaGlsZChteVRleHQpO1xuXHRcdFx0dW5kZXJsaW5lc19jb250YWluZXIuYXBwZW5kQ2hpbGQobXlVbmRlcmxpbmVDb250YWluZXIpO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gdW5kZXJsaW5lc19jb250YWluZXI7XG5cdH1cbn1cblxuLy8gU1RBVElDIEFUVFJJQlVURVNcbi8qXG52YXIgQ09OU1RTID0ge1xuXHQvL3N0eWxlIG9mIHZpc3VhbGl6YXRpb25cblx0U1FVQVJFRF8zRDpcIlNRVUFSRURfM0RcIixcblx0Uk9VTkRfRkxBVDpcIlJPVU5EX0ZMQVRcIixcblx0SUNPTlNfT05MWTpcIklDT05TX09OTFlcIlxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQnV0dG9uc01hbmFnZXJba2V5XSA9IENPTlNUU1trZXldO1xufVxuKi8gICAgXG4gICAgICBcbm1vZHVsZS5leHBvcnRzID0gQnV0dG9uc01hbmFnZXI7XG4gICAgICBcbiAgIiwidmFyIENvbnRleHREYXRhTGlzdCA9IHJlcXVpcmUoXCIuL0NvbnRleHREYXRhTGlzdC5qc1wiKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG5cbi8qKlxuICogICAgICAgICAgQ29tbW9uRGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAganNvbkRhdGEge09iamVjdH0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIHRoZSBvcmlnaW5hbCBkYXRhIHJldHJpZXZlZCBieSBvdXIgZGF0YSBzZXJ2ZXIuXG4gKiAgICAgICAgICBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgdGhpcyBzdHJ1Y3R1cmUuXG4gKiAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSd1cmwnXVxuICogICAgICAgICAgICAgICAgICAgICAgVVJMIHdpdGggdGhlIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqL1xudmFyIENvbW1vbkRhdGEgPSBmdW5jdGlvbihqc29uRGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG59O1xuXG4vKipcbiAqICAgICAgICAgIENvbW1vbiBwYXJlbnQgY2xhc3MgdGhhdCBzaG91bGQgYmUgaW5oZXJpdGVkIGJ5IGFsbCBzcGVjaWZpYyBjbGFzc2VzIHRvIGJlIG1hbmFnZWQgb24gdGhpcyBjb21wb25lbnQuXG4gKi9cbkNvbW1vbkRhdGEucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgY29uc3RydWN0b3I6IENvbW1vbkRhdGEsXG4gICAgICAgICAgICBTT1VSQ0VfRklFTEQgICAgICAgICAgICAgICAgOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgUkVTT1VSQ0VfVFlQRV9GSUVMRCAgICAgICAgIDogXCJyZXNvdXJjZV90eXBlXCIsXG4gICAgICAgICAgICBUSVRMRV9GSUVMRCAgICAgICAgICAgICAgICAgOiBcInRpdGxlXCIsXG4gICAgICAgICAgICBUT1BJQ19GSUVMRCAgICAgICAgICAgICAgICAgOiBcImZpZWxkXCIsXG4gICAgICAgICAgICBERVNDUklQVElPTl9GSUVMRCAgICAgICAgICAgOiBcImRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICBMSU5LX0ZJRUxEICAgICAgICAgICAgICAgICAgOiBcImxpbmtcIixcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcmV0cmlldmVzIHRoZSBwcm9wZXIgY2xhc3MgbmFtZSBiYXNlZCBvbiB0aGUgcmVhbCByZXNvdXJjZSB0eXBlXG4gICAgICAgICAgICBtYXBwaW5nUmVzb3VyY2VUeXBlQ2xhc3NlcyA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdUb29sJyAgICAgICAgICAgICAgICAgIDondG9vbHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1dvcmtmbG93JyAgICAgICAgICAgICAgOid3b3JrZmxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnRGF0YWJhc2UnICAgICAgICAgICAgICA6J2RhdGFiYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdUcmFpbmluZyBNYXRlcmlhbCcgICAgIDondHJhaW5pbmdfbWF0ZXJpYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0V2ZW50JyAgICAgICAgICAgICAgICAgOidldmVudHMnXG4gICAgICAgICAgICB9LFxuICAgICBcbiAgICAgICAgICAgIC8qKiAgICAgICAgIFVUSUxJVFkgRlVOQ1RJT05TIFRPIEdFVCBGSUVMRCdTIFZBTFVFICAgICAgICAgICAgICAgICAgICAqL1xuICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgQXV4aWxpYXIgZnVuY3Rpb24gdG8gZ2V0IGVhc2lseSBhbnkga2luZCBvZiBkYXRhIHByZXNlbnQgaW4gdGhlIGludGVybmFsXG4gICAgICAgICAgICAgKiAgICAgICAgICBkYXRhIHN0cnVjdHVyZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBmaWVsZE5hbWUge1N0cmluZ30gLSBOYW1lIG9mIHRoZSBmaWVsZCB0byBiZSByZXR1cm5lZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyaXNlZFZhbHVlIDogZnVuY3Rpb24oZmllbGROYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmpzb25EYXRhICE9PSB1bmRlZmluZWQgJiYgdGhpcy5qc29uRGF0YSAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuanNvbkRhdGFbZmllbGROYW1lXTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gbWFuZGF0b3J5IGZpZWxkc1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHNvdXJjZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgc291cmNlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRTb3VyY2VWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5TT1VSQ0VfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhbGwgcmVzb3VyY2UgdHlwZXMgcHJlc2VudCBpbiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtBcnJheX0gLSBBcnJheSBvZiBzdHJpbmdzIHdpdGggcmVzb3VyY2UgdHlwZXJzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UmVzb3VyY2VUeXBlVmFsdWVzIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlJFU09VUkNFX1RZUEVfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgU29tZXRpbWVzIGNhbiBiZSBkdXBsaWNhdGUgcmVzb3VyY2UgdHlwZXMuXG4gICAgICAgICAgICAgKiAgICAgICAgICBUaGlzIGZ1bmN0aW9uIG9ubHkgcmV0dXJucyB1bmlxdWUgcmVzb3VyY2UgdHlwZXMuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIHVuaXF1ZSByZXNvdXJjZSB0eXBlcnMgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRVbmlxdWVSZXNvdXJjZVR5cGVWYWx1ZXMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldFJlc291cmNlVHlwZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXF1ZVJlc291cmNlVHlwZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmVzb3VyY2VUeXBlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghICh1bmlxdWVSZXNvdXJjZVR5cGVzLmluZGV4T2YocmVzb3VyY2VUeXBlc1tpXSkgPiAtMSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pcXVlUmVzb3VyY2VUeXBlcy5wdXNoKHJlc291cmNlVHlwZXNbaV0pOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuaXF1ZVJlc291cmNlVHlwZXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHRoZSB0aXRsZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gVGl0bGUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFRpdGxlVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuVElUTEVfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhbGwgdG9waWMgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gVG9waWNzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VG9waWNWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5UT1BJQ19GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBvcHRpb25hbCBmaWVsZHNcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgZGVzY3JpcHRpb24gYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50aXR5IChpZiBleGlzdHMpLlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBUZXh0dWFsIGRlc2NyaXB0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXREZXNjcmlwdGlvblZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkRFU0NSSVBUSU9OX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgVVJMIHRvIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgc291cmNlIG9mIHRoaXMgZW50aXR5IChpZiBleGlzdHMpLlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBTb3VyY2UncyBVUkwuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExpbmtWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5MSU5LX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICBcbiAgICAgIFxuICAgICAgICAgICAgLyoqICAgICAgICAgU1RBTkRBUkQgRlVOQ1RJT05TIFRPIE1BTkFHRSBIVE1MIEJFSEFWSU9VUiBPRiBUSElTIEVOVElUWSAgICAgKi9cbiAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBraW5kIG9mIENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50IGluIGEgd2F5IHRoYXRcbiAgICAgICAgICAgICAqICAgICAgICAgIGRlcGVuZHMgb24gd2hhdCBraW5kIG9mIHN0eWxlIHlvdSB3YW50IGl0IHdpbGwgYmUgZHJhd24uXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gZGlzcGxheVN0eWxlIHtTdHJpbmd9IC0gT25lIGRyYXdpbmcgc3R5bGUuIEN1cnJlbnRseSBDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFIG9yIENvbnRleHREYXRhTGlzdC5GVUxMX1NUWUxFLlxuICAgICAgICAgICAgICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXREcmF3YWJsZU9iamVjdEJ5U3R5bGUgOiBmdW5jdGlvbihkaXNwbGF5U3R5bGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXlTdHlsZSA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21tb25EcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKGRpc3BsYXlTdHlsZSA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVsbERyYXdhYmxlT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgaW1wcm92ZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhbnkgQ29tbW9uRGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBJdCBoYXMgdG8gYmUgZXh0ZW5kZWQgYnkgZWFjaCBjaGlsZHJlbiBvYmplY3Q7IHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGNhbGxzIHRvXG4gICAgICAgICAgICAgKiAgICAgICAgICBnZXRDb21tb25EcmF3YWJsZU9iamVjdC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RnVsbERyYXdhYmxlT2JqZWN0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbW1vbkRyYXdhYmxlT2JqZWN0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgYW55IENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRDb21tb25EcmF3YWJsZU9iamVjdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc291cmNlVHlwZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9saXN0RWxlbWVudC5hcHBlbmRDaGlsZChtYWluQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGxpc3RFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RpdGxlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBBTkNIT1IgZWxlbWVudCB3aXRoICd0aXRsZScgaW5mb3JtYXRpb24gbGlua2luZyB0byB0aGUgb3JpZ2luYWwgc291cmNlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMYWJlbFRpdGxlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNMb2NhbFVybCh0aGlzLmdldExpbmtWYWx1ZSgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImV4dGVybmFsX2xpbmtcIik7ICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJyx0aGlzLmdldExpbmtWYWx1ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5nZXRUaXRsZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTb21ldGltZXMgZGVzY3JpcHRpb24gaGF2ZSBsb25nIHZhbHVlcyBhbmQgaXQgc2VlbXMgbW9yZSBsaWtlIGVycm9ycyFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGl0bGUgPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhcmdldCcsJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RvcGljcycgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBhbGwgJ3RvcGljcycgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxUb3BpY3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX3RvcGljc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYXdUb3BpY1ZhbHVlID0gdGhpcy5nZXRUb3BpY1ZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxTdHJpbmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmF3VG9waWNWYWx1ZS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsU3RyaW5nID0gZmluYWxTdHJpbmcgKyByYXdUb3BpY1ZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChpKzEpIDwgcmF3VG9waWNWYWx1ZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRmaW5hbFN0cmluZyArPSAnLCAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGZpbmFsU3RyaW5nOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgc3RhbmRhcmQgdGV4dHVhbCB3YXkgb2YgcmVwcmVzZW50aW5nICdyZXNvdXJjZSB0eXBlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBTUEFOIGVsZW1lbnQgd2l0aCBhbGwgJ3Jlc291cmNlIHR5cGUnIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExhYmVsUmVzb3VyY2VUeXBlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFVuaXF1ZVJlc291cmNlVHlwZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBzdGFuZGFyZCB3YXkgKGFzIGEgc2V0IG9mIGltYWdlcykgb2YgcmVwcmVzZW50aW5nICdyZXNvdXJjZSB0eXBlJ1xuICAgICAgICAgICAgICogICAgICAgICAgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gU1BBTiBlbGVtZW50IHdpdGggYWxsICdyZXNvdXJjZSB0eXBlJyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoaXMgZW50aXR5XG4gICAgICAgICAgICAgKiAgICAgICAgICByZXByZXNlbnRlZCBhcyBzZXQgb2YgaW1hZ2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRJbWFnZVJlc291cmNlVHlwZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHJlc291cmNlVHlwZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VfdHlwZSA9IHJlc291cmNlVHlwZXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudGl0bGUgPSByZXNvdXJjZV90eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmxhdCBncmF5IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZsYXRfcmVzb3VyY2VfdHlwZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdncmF5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3VuZCBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Jlc291cmNlX3R5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjaXJjbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLm1hcHBpbmdSZXNvdXJjZVR5cGVDbGFzc2VzW3Jlc291cmNlX3R5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIGRpdiBvYmplY3Qgd2l0aCBhIHNob3J0IGRlc2NyaXB0aW9uIHRoYXQgY2FuIGJlIGV4cGFuZGVkIHRvIHNob3cgYSBsb25nZXIgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gc2hvcnRUZXh0IHtTdHJpbmd9IC0gVGV4dCBsaW5rIHRvIGhpZGUgb3IgZXhwYW5kIHRoZSBsb25nIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHQge1N0cmluZywgSFRNTCBFTEVNRU5UIG9yIEFycmF5IG9mIGJvdGh9IC0gTG9uZyBkZXNjcmlwdGlvbiBvciBIVE1MIGZpZWxkIHdpdGggYSBsb25nIGRlc2NyaXB0aW9uIG9mIHRoZSByZWNvcmQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHRDbGFzc2VzIHtBcnJheX0gLSBDbGFzc2VzIHRvIG1vZGlmeSB0aGUgYXNwZWN0IG9mIHRoZSBleHBhbmRhYmxlIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBib3RoIHNob3J0IGFuZCBmaWVsZCBkZXNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEV4cGFuZGFibGVUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0LCBsb25nVGV4dENsYXNzZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGFibGVfZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW50TnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMCAtIDApKSArIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZXMgdGhlIGxpbmsgdG8gaGlkZSBhbmQgc2hvdyB0aGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2Rpdl90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVfXCIrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2V4cGFuZHNpZ25hbCA9IFwiWytdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9oaWRlc2lnbmFsID0gXCJbLV1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgbW9yZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZVRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X3RpdGxlXycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MID1leHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MLnJlcGxhY2UodG9leHBhbmRzaWduYWwsdG9oaWRlc2lnbmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVUaXRsZS50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBoaWRlIHRoZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLmlubmVySFRNTCA9IGV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwucmVwbGFjZSh0b2hpZGVzaWduYWwsdG9leHBhbmRzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSBtb3JlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlcyB0aGUgaW50ZXJuYWwgZGl2IHdpdGggdGhlIGZ1bGwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRlcm5hbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbG9uZ1RleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5pbm5lckhUTUwgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb2YgSFRNTCBvYmplY3RzIG9yIHN0cmluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxvbmdUZXh0KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGxvbmdUZXh0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb25nVGV4dFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmlubmVySFRNTCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVE1MIG9iamVjdCAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpQz0wO2lDPGxvbmdUZXh0Q2xhc3Nlcy5sZW5ndGg7aUMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpQ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuYXBwZW5kQ2hpbGQobmV3U3BhbkVsZW1lbnQpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnRlcm5hbERpdik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgZGl2IGNvbnRhaW5lciB3aXRoIGEgbGluayB0byBhbiBhbGVydCB0byBzaG93IGEgbG9uZyBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBzaG9ydFRleHQge1N0cmluZ30gLSBUZXh0IGxpbmsgdG8gc2hvdyB0aGUgbG9uZyB0ZXh0LlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGxvbmdUZXh0IHtTdHJpbmcsIEhUTUwgRUxFTUVOVCBvciBBcnJheSBvZiBib3RofSAtIExvbmcgZGVzY3JpcHRpb24gb3IgSFRNTCBmaWVsZCB3aXRoIGEgbG9uZyBkZXNjcmlwdGlvbiBvZiB0aGUgcmVjb3JkLlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIERJViBlbGVtZW50IHdpdGggYm90aCBzaG9ydCBhbmQgZmllbGQgZGVzY3JpcHRpb25zLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMb25nRmxvYXRpbmdUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdleHBhbmRhYmxlX2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbUludE51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAgLSAwKSkgKyAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVzIHRoZSBsaW5rIHRvIGhpZGUgYW5kIHNob3cgdGhlIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2lkJyxcImV4cGFuZGFibGVfZGl2X3RpdGxlX1wiK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9leHBhbmRzaWduYWwgPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgdGhlIGxvbmcgdGV4dCBpbnRvIGEgbmV3IGxpdHRsZSB3aW5kb3dcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl90aXRsZV8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXZfJytyYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGxvbmdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBBdXhpbGlhcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGlmIG9uZSBVUkwgYmVsb25nIHRvIHRoZSBjdXJyZW50IHVzZXIncyBwYWdlIGRvbWFpbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSB1cmwge1N0cmluZ30gLSBsaW5rIHRvIGFuYWx5c2UuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7Qm9vbGVhbn0gLSBUcnVlIGlmIHRoZSBVUkwgYmVsb25ncyB0byB0aGUgbWFpbiB1c2VyJ3MgcGFnZSBkb21haW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlzTG9jYWxVcmw6IGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RG9tYWluICE9IG51bGwgJiYgdGhpcy5jdXJyZW50RG9tYWluLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSB1cmwuaW5kZXhPZih0aGlzLmN1cnJlbnREb21haW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIFxufTtcblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdE1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTjogMTAwMFxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQ29tbW9uRGF0YVtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uRGF0YTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXIuanNcIik7XG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG52YXIgcmVxd2VzdCA9IHJlcXVpcmUoXCJyZXF3ZXN0XCIpO1xuXG4vKiogXG4gKiBDb250ZXh0RGF0YUxpc3QgQ29uc3RydWN0b3IuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3QgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBUeXBlIG9mIHJvd3MgdmlzdWFsaXNhdGlvbi5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0SWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dFRhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlclRleHRJZENvbnRhaW5lciBvciB1c2VyVGV4dENsYXNzQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiAgICBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0lkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzVGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgVGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgb3IgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBkZXNjcmlwdGlvbiB0byBoZWxwIGZpbHRlciBzYW1lIHJlc3VsdHMgdGhhdCB1c2VyIGlzIHNlZWluZy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJIZWxwQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgd2lsbCBjb250YWlucyBoZWxwIGljb24uXG4gKiBAb3B0aW9uIHtpbnR9IFtudW1iZXJSZXN1bHRzPW51bWJlciBdXG4gKiAgICBJbnRlZ2VyIHRoYXQgcmVzdHJpY3RzIHRoZSByZXN1bHRzIG51bWJlciB0aGF0IHNob3VsZCBiZSBzaG93bi5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtpbmNsdWRlU2FtZVNpdGVSZXN1bHRzPUlmIHlvdSB3YW50IHRvIHNlZSByZWNvcmRzIG9mIHlvdXIgcHJlc2VudCBzaXRlLiBUZW1wb3JhcnkgZGlzYWJsZWQuIF1cbiAqICAgIEJvb2xlYW4gdGhhdCBhdm9pZHMgb3Igbm90IHJlc3VsdHMgZnJvbSB0aGUgc2FtZSBzaXRlIHlvdSBhcmUgc2VlaW5nLiAqL1xuLy9mdW5jdGlvbiBDb250ZXh0RGF0YUxpc3QgKG9wdGlvbnMpIHtcbnZhciBDb250ZXh0RGF0YUxpc3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7ICAgICAgICBcblx0ICAgICBkaXNwbGF5U3R5bGU6IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRlVMTF9TVFlMRSxcblx0ICAgICBpbmNsdWRlU2FtZVNpdGVSZXN1bHRzIDogdHJ1ZVxuXHR9O1xuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcblx0ICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG5cdCAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuXHR9XG5cdHRoaXMuY29udGV4dERhdGFTZXJ2ZXIgPSBcImh0dHA6Ly93d3cuYmlvY2lkZXIub3JnOjg5ODMvc29sci9jb250ZXh0RGF0YVwiO1xuXHRcblx0XG5cdC8vIGdsb2JhbCBjdXJyZW50IHN0YXR1c1xuXHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHM9IG51bGw7XG5cdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0PSBudWxsO1xuXHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzPSBudWxsO1xuXHR0aGlzLmN1cnJlbnRTdGF0dXM9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORztcblx0dGhpcy5jdXJyZW50RmlsdGVycz0gbnVsbDtcblx0dGhpcy50b3RhbEZpbHRlcnM9bnVsbDtcblx0dGhpcy5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlPSBudWxsO1xuXHR0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZT0gbnVsbDtcblx0XG5cdHRoaXMuY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHR0aGlzLmN1cnJlbnREb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG5cdFxuXHR0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucz0gW107XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGFNYW5hZ2VyID0gbmV3IERhdGFNYW5hZ2VyKHsnY3VycmVudERvbWFpbic6dGhpcy5jdXJyZW50RG9tYWlufSk7XG5cdFxuXHQvL3RoaXMuZHJhd0hlbHBJbWFnZSgpO1xuXHRcbiAgICAgIFxufVxuXG5cblxuLyoqIFxuICogUmVzb3VyY2UgY29udGV4dHVhbGlzYXRpb24gd2lkZ2V0LlxuICogXG4gKiBcbiAqIEBjbGFzcyBDb250ZXh0RGF0YUxpc3RcbiAqXG4gKi9cbkNvbnRleHREYXRhTGlzdC5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBDb250ZXh0RGF0YUxpc3QsXG5cdFxuXHQvKipcblx0ICogU2hvd3MgdGhlIGNvbnRleHR1YWxpc2VkIGRhdGEgaW50byB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0ZHJhd0NvbnRleHREYXRhTGlzdCA6IGZ1bmN0aW9uICgpe1xuXHRcdC8vY29uc29sZS5sb2coJ0NvbnRleHREYXRhTGlzdC5MT0FESU5HLCcrY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKTtcblx0XHQvL2NvbnNvbGUubG9nKCdDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFLCcrY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEUpO1xuXHRcdHRoaXMuY3VycmVudFN0YXR1cyA9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORztcblx0XHQvL3RoaXMudXBkYXRlR2xvYmFsU3RhdHVzKHRoaXMuTE9BRElORyk7XG5cdFx0dmFyIHVzZXJUZXh0ID0gdGhpcy5nZXRVc2VyU2VhcmNoKCk7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJLZXl3b3JkcyA9IHRoaXMuZ2V0VXNlcktleXdvcmRzKCk7XG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgaGF2ZSBrZXl3b3Jkcywgd2UgY2FuIGpvaW4gdGhlbSB0byB0aGUgdXNlclRleHQuXG4gICAgICAgICAgICAgICAgaWYgKHVzZXJLZXl3b3JkcyE9bnVsbCAmJiB1c2VyS2V5d29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHVzZXJLZXl3b3Jkcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyVGV4dCA9IHVzZXJUZXh0ICtcIiBcIit1c2VyS2V5d29yZHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cdFx0dmFyIHVzZXJEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0VXNlckNvbnRlbnREZXNjcmlwdGlvbigpO1xuXHRcdHZhciBtYXhSb3dzID0gdGhpcy5nZXRNYXhSb3dzKCk7XG5cdFx0dmFyIG5ld1VybCA9IHRoaXMuX2dldE5ld1VybCh1c2VyVGV4dCwgdXNlckRlc2NyaXB0aW9uLCB0aGlzLmN1cnJlbnRGaWx0ZXJzLCB0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCwgbWF4Um93cyk7XG5cdFx0dGhpcy5wcm9jZXNzRGF0YUZyb21VcmwobmV3VXJsKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBTaG93cyB0aGUgY29udGV4dHVhbGlzZWQgZGF0YSBpbnRvIHRoZSB3aWRnZXQsIHVwZGF0aW5nIHRoZSB3aG9sZSBpbnRlcm5hbCBzdGF0dXMgb2YgdGhlIHdpZGdldC5cblx0ICovXG5cdHRvdGFsRHJhd0NvbnRleHREYXRhTGlzdCA6IGZ1bmN0aW9uICgpe1xuXHRcdHRoaXMudXBkYXRlR2xvYmFsU3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyk7XG5cdFx0dGhpcy5kcmF3Q29udGV4dERhdGFMaXN0KCk7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBVc2VyJ3MgdGV4dCB0byBjb250ZXh0dWFsaXNlLCBpZiBpdCBleGlzdHMuXG4gICAgICAgICAqIHtTdHJpbmd9IC0gVGV4dCBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQgdGhhdCBjb250YWlucyBDb250ZXh0dWFsaXNhdGlvbiB3aWRnZXQuXG5cdCAqL1xuXHRnZXRVc2VyU2VhcmNoIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVzZXJUZXh0ID0gJyc7XG5cdFx0dmFyIGVsZW1lbnRzQ29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyVGV4dElkQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJUZXh0SWRDb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0NvbnRhaW5lciA9IFtdO1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lclswXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudXNlclRleHRJZENvbnRhaW5lcik7XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlclRleHRDbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyVGV4dENsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnVzZXJUZXh0Q2xhc3NDb250YWluZXIpO1xuXHRcdH1lbHNle1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0aGlzLnVzZXJUZXh0VGFnQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKGVsZW1lbnRzQ29udGFpbmVyICE9IG51bGwgJiYgZWxlbWVudHNDb250YWluZXIubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIG15Rmlyc3RFbGVtZW50ID0gZWxlbWVudHNDb250YWluZXJbMF07XG5cdFx0XHR1c2VyVGV4dCA9IG15Rmlyc3RFbGVtZW50LmlubmVyVGV4dDtcblx0XHRcdGlmICh1c2VyVGV4dCA9PSB1bmRlZmluZWQgfHwgdXNlclRleHQgPT0gbnVsbCkge1xuXHRcdFx0XHR1c2VyVGV4dCA9IG15Rmlyc3RFbGVtZW50LmlubmVySFRNTDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHVzZXJUZXh0O1xuXHR9LFxuXHRcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBSZXR1cm5zIFVzZXIncyBrZXl3b3JkcyBpbiBvcmRlciB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLCBpZiB0aGV5IGV4aXN0LlxuICAgICAgICAgKiB7QXJyYXl9IC0gTGlzdCBvZiBrZXl3b3JkcyBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQgdGhhdCBjYW4gaGVscCB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuXHQgKi9cblx0Z2V0VXNlcktleXdvcmRzIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVzZXJLZXl3b3JkcyA9IFtdO1xuXHRcdHZhciBlbGVtZW50c0NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0NvbnRhaW5lciA9IFtdO1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lclswXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIpO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyKTtcblx0XHR9ZWxzZXtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VyS2V5d29yZHNUYWdDb250YWluZXIpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0IHx8IG15Rmlyc3RFbGVtZW50LnRleHRDb250ZW50O1xuXHRcdFx0dXNlcktleXdvcmRzID0gY29udGVudC5zcGxpdChcIiBcIik7XG5cdFx0fVxuXHRcdHJldHVybiB1c2VyS2V5d29yZHM7XG5cdH0sXG4gICAgICAgIFxuICAgICAgICBcblx0LyoqXG5cdCAqIFJldHVybnMgVXNlcidzIGRlc2NyaXB0aW9uIHRvIGhlbHAgZmlsdGVyIHNhbWUgcmVzdWx0cyB0aGFuIHVzZXIgaXMgc2VlaW5nLlxuICAgICAgICAgKiB7U3RyaW5nfSAtIFRleHQgZm91bmQgaW50byB0aGUgY2xpZW50IGRvY3VtZW50LlxuXHQgKi9cblx0Z2V0VXNlckNvbnRlbnREZXNjcmlwdGlvbiA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZXNjcmlwdGlvbiA9ICcnO1xuXHRcdHZhciBlbGVtZW50c0NvbnRhaW5lciA9IG51bGw7XG5cdFx0aWYgKHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIpO1xuXHRcdH0vKmVsc2V7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlckRlc2NyaXB0aW9uVGFnQ29udGFpbmVyKTtcblx0XHR9Ki9cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcblx0XHRcdGRlc2NyaXB0aW9uID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0O1xuXHRcdFx0aWYgKGRlc2NyaXB0aW9uID09IHVuZGVmaW5lZCB8fCBkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdH0sXG5cdFxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBtYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRoYXQgY2FuIGJlIHNob3duIGludG8gdGhlIHdpZGdldC5cbiAgICAgICAgICoge0ludGVnZXJ9IC0gTWF4aW11bSBhbW91bnQgb2YgcmVzdWx0cyB0aGF0IGNhbiBiZSBzaG93biBhdCB0aGUgc2FtZSB0aW1lLlxuXHQgKi9cblx0Z2V0TWF4Um93cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1heFJvd3MgPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X01BWF9ST1dTO1xuXHRcdGlmICh0aGlzLm51bWJlclJlc3VsdHMgIT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNOYU4odGhpcy5udW1iZXJSZXN1bHRzKSAmJiB0eXBlb2YgdGhpcy5udW1iZXJSZXN1bHRzID09PSAnbnVtYmVyJyAmJiAodGhpcy5udW1iZXJSZXN1bHRzICUgMSA9PT0gMCkgKSB7XG5cdFx0XHRpZiAodGhpcy5udW1iZXJSZXN1bHRzIDwgY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9NQVhfUk9XUykge1xuXHRcdFx0XHRtYXhSb3dzID0gdGhpcy5udW1iZXJSZXN1bHRzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWF4Um93cztcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSB1cmwgdG8gdGhlIFNvbFIgZGF0YWJhc2Ugd2l0aCBhbGwgZHluYW1pYyBwYXJhbWV0ZXJzIGdlbmVyYXRlZCBmcm9tIHRoZXNlIGFyZ3VtZW50cy5cblx0ICogQHBhcmFtIGZpZWxkVGV4dCB7c3RyaW5nfSBUZXh0IHRvIHNlYXJjaC5cblx0ICogQHBhcmFtIGRlc2NyaXB0aW9uVGV4dCB7c3RyaW5nfSBBc3NvY2lhdGVkIGRlc2NyaXB0aW9uIG9mIHRoZSBjb250ZW50LlxuXHQgKiBAcGFyYW0gZmlsdGVycyB7QXJyYXl9IEFycmF5IG9mIGZpbHRlcnMgLSBPbmx5IHJlc3VsdHMgd2l0aCBvbmUgb2YgdGhlc2UgcmVzb3VyY2UgdHlwZXMgd2lsbCBiZSBnZXQuXG5cdCAqIEBwYXJhbSBzdGFydCB7aW50ZWdlcn0gUG9zaXRpb24gb2YgdGhlIGZpcnN0IHJlc3VsdCB0byByZXRyaWV2ZS5cblx0ICogQHBhcmFtIHJvd3NOdW1iZXIge2ludGVnZXJ9IEluZGljYXRlcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0aGF0IHdpbGwgYmUgc2hvd24gb24gdGhlIHNjcmVlbjtcblx0ICovXG5cdF9nZXROZXdVcmwgOiBmdW5jdGlvbihmaWVsZFRleHQsIGRlc2NyaXB0aW9uVGV4dCwgZmlsdGVycywgc3RhcnQsIHJvd3NOdW1iZXIpe1xuXHRcdC8vY29uc29sZS5sb2coJ19nZXROZXdVcmwsIGZpZWxkVGV4dDogJytmaWVsZFRleHQrJywgZGVzY3JpcHRpb25UZXh0OiAnK2Rlc2NyaXB0aW9uVGV4dCsnLCBmaWx0ZXJzOiAnK2ZpbHRlcnMrJywgc3RhcnQ6ICcrc3RhcnQrJywgcm93c051bWJlcjogJytyb3dzTnVtYmVyKTtcblx0XHR2YXIgY291bnQgPSAwO1xuXHRcdHZhciB1cmwgPSBcIlwiO1xuXHRcdFxuXHRcdHZhciB3b3JkcyA9IGZpZWxkVGV4dC5zcGxpdChcIiBcIik7XG5cdFx0dmFyIHNlYXJjaFBocmFzZSA9IFwiXCI7XG5cdFx0d2hpbGUgKGNvdW50IDwgd29yZHMubGVuZ3RoKSB7XG5cdFx0XHRzZWFyY2hQaHJhc2UgKz0gd29yZHNbY291bnRdO1xuXHRcdFx0Y291bnQrKztcblx0XHRcdGlmKGNvdW50IDwgd29yZHMubGVuZ3RoKXtzZWFyY2hQaHJhc2UgKz0gJysnfVxuXHRcdH1cblx0XHQvLyB3ZSBleGNsdWRlIGFsbCByZXN1bHRzIGZyb20gdGhpcyBkb21haW46IGRpc2FibGVkIHVudGlsIHJlaW5kZXhpbmdcblx0XHQvKmlmICghdGhpcy5pbmNsdWRlU2FtZVNpdGVSZXN1bHRzKSB7XG5cdFx0XHR2YXIgZXhjbHVkaW5nUGhyYXNlID0gXCJcIjtcblx0XHRcdC8vZXhjbHVkaW5nUGhyYXNlID0gXCIgTk9UKFwiK3RoaXMuY3VycmVudERvbWFpbitcIilcIjtcblx0XHRcdGV4Y2x1ZGluZ1BocmFzZSA9IFwiLVxcXCIqdGdhYy5hYy51aypcXFwiXCI7XG5cdFx0XHRzZWFyY2hQaHJhc2UgPSBcIihcIitzZWFyY2hQaHJhc2UrZXhjbHVkaW5nUGhyYXNlK1wiKVwiO1xuXHRcdC8vIHdlIGV4Y2x1ZGUgb25seSB0aGUgc2FtZSByZWNvcmQgdGhhbiB1c2VyIGlzXG5cdFx0fWVsc2V7Ki9cblx0XHQvKlx0XG5cdFx0aWYgKHRoaXMuY3VycmVudFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmN1cnJlbnRVUkwgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGV4Y2x1ZGluZ1BocmFzZSA9IFwiXCI7XG5cdFx0XHQvLyBUaGVyZSBhcmUgc29tZSBjaGFyYWN0ZXJzIHRoYXQgY2FuIGJyZWFrIHRoZSBmdWxsIFVSTDsgd2UgcmVtb3ZlIHRoZW0uXG5cdFx0XHR2YXIgY3VyYXRlZFVSTCA9IHRoaXMuY3VycmVudFVSTC5yZXBsYWNlKCcjJywnJyk7XG5cdFx0XHRleGNsdWRpbmdQaHJhc2UgPSBcIiBOT1QoXFxcIlwiK2N1cmF0ZWRVUkwrXCJcXFwiKVwiO1xuXHRcdFx0c2VhcmNoUGhyYXNlID0gXCIoXCIrc2VhcmNoUGhyYXNlK1wiKSBBTkQgXCIrZXhjbHVkaW5nUGhyYXNlO1xuXHRcdH0qL1xuXHRcdHNlYXJjaFBocmFzZSA9IFwiKFwiK3NlYXJjaFBocmFzZStcIilcIjtcdFxuXHRcdFxuXHRcdC8vfVx0XG5cdFx0XG5cdFx0dXJsID0gdGhpcy5jb250ZXh0RGF0YVNlcnZlcitcIi9zZWxlY3Q/ZGVmVHlwZT1lZGlzbWF4JnE9XCIrc2VhcmNoUGhyYXNlO1xuXHRcdFxuXHRcdHZhciBmcSA9IG51bGw7XG5cdFx0aWYgKGZpbHRlcnMgIT09IFwidW5kZWZpbmVkXCIgJiYgZmlsdGVycyE9bnVsbCApIHtcblx0XHRcdGlmIChmaWx0ZXJzIGluc3RhbmNlb2YgQXJyYXkgJiYgZmlsdGVycy5sZW5ndGg+MCkge1xuXHRcdFx0XHRmcSA9IFwiXCI7XG5cdFx0XHRcdHZhciBmaWx0ZXJDb3VudCA9IDA7XG5cdFx0XHRcdHZhciBmaWx0ZXJDaGFpbiA9IFwiXCI7XG5cdFx0XHRcdHdoaWxlIChmaWx0ZXJDb3VudCA8IGZpbHRlcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZmlsdGVyQ2hhaW4gKz0gXCInXCIrZmlsdGVyc1tmaWx0ZXJDb3VudF0rXCInXCI7XG5cdFx0XHRcdFx0ZmlsdGVyQ291bnQrKztcblx0XHRcdFx0XHRpZihmaWx0ZXJDb3VudCA8IGZpbHRlcnMubGVuZ3RoKXtmaWx0ZXJDaGFpbiArPSAnIE9SICd9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnE9XCJyZXNvdXJjZV90eXBlOihcIitmaWx0ZXJDaGFpbitcIilcIjtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRmcSA9IFwicmVzb3VyY2VfdHlwZTp1bmRlZmluZWRcIjtcblx0XHRcdH1cblxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50VVJMICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuY3VycmVudFVSTCAhPSBudWxsKSB7XG5cdFx0XHRpZiAoZnE9PW51bGwpIHtcblx0XHRcdFx0ZnEgPSBcIio6KlwiO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVGhlcmUgYXJlIHNvbWUgY2hhcmFjdGVycyB0aGF0IGNhbiBicmVhayB0aGUgZnVsbCBVUkw7IHdlIHJlbW92ZSB0aGVtLlxuXHRcdFx0dmFyIGN1cmF0ZWRVUkwgPSB0aGlzLmN1cnJlbnRVUkwucmVwbGFjZSgnIycsJycpO1xuXHRcdFx0dmFyIGxpbmtGaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLkxJTktfRklFTEQ7XG5cdFx0XHRmcSA9IGZxK1wiIEFORCAtXCIrbGlua0ZpZWxkK1wiOlxcXCJcIitjdXJhdGVkVVJMK1wiXFxcIlwiO1x0XG5cdFx0fVxuXHQgICAgICAgIFxuXHRcdC8vIElmIHdlIGhhdmUgZGVzY3JpcHRpb24sIHdlIGNhbiB0cnkgdG8gZmlsdGVyIHVuZGVzaXJlZCByZXN1bHRzIChpLmUuLCByZXN1bHRzIHRoYXQgYXJlIHRoZSBzYW1lIHRoYW4gdXNlcidzIGN1cnJlbnQgcGFnZSlcblx0XHRpZiAoZGVzY3JpcHRpb25UZXh0ICE9IG51bGwpIHtcblx0XHRcdGlmIChmcT09bnVsbCkge1xuXHRcdFx0XHRmcSA9IFwiKjoqXCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciBkZXNjVXNlZCA9IGRlc2NyaXB0aW9uVGV4dDtcblx0XHRcdGlmIChkZXNjVXNlZC5sZW5ndGg+Y29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OKSB7XG5cdFx0XHRcdGRlc2NVc2VkID0gZGVzY1VzZWQuc3BsaXQoXCIgXCIpLnNsaWNlKDAsY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OKS5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHRcdC8vIHdlIHJlbW92ZSB3ZWlyZCBjaGFyYWN0ZXJzIGFuZCBcIlxuXHRcdFx0ZGVzY1VzZWQgPSBkZXNjVXNlZC5yZXBsYWNlKC9cXFwiL2csJycpO1xuXHRcdFx0ZGVzY1VzZWQgPSBlbmNvZGVVUklDb21wb25lbnQoZGVzY1VzZWQpO1xuXHRcdFx0XG5cdFx0XHR2YXIgZGVzY3JpcHRpb25GaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLkRFU0NSSVBUSU9OX0ZJRUxEO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK2Rlc2NyaXB0aW9uRmllbGQrXCI6XFxcIlwiK2Rlc2NVc2VkK1wiXFxcIlwiO1xuXHRcdFx0XG5cdFx0XHR2YXIgdGl0bGVGaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLlRJVExFX0ZJRUxEO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK3RpdGxlRmllbGQrXCI6XFxcIlwiK2ZpZWxkVGV4dCtcIlxcXCJcIjtcblx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAoZnEhPW51bGwpIHtcblx0XHRcdHVybCA9IHVybCtcIiZmcT1cIitmcTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gcWZcblx0XHR1cmwgPSB1cmwrXCImcWY9dGl0bGVeMi4wK2ZpZWxkXjIuMCtkZXNjcmlwdGlvbl4xLjBcIjtcblx0XHRcblx0XHQvLyBzdGFydCByb3dcblx0XHRpZiAoc3RhcnQgIT09IFwidW5kZWZpbmVkXCIgJiYgc3RhcnQhPW51bGwgJiYgIWlzTmFOKHN0YXJ0KSAmJiB0eXBlb2Ygc3RhcnQgPT09ICdudW1iZXInICYmIChzdGFydCAlIDEgPT09IDApICkge1xuXHRcdFx0dXJsID0gdXJsK1wiJnN0YXJ0PVwiK3N0YXJ0O1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBzdGFydDtcblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gMDtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gbnVtIHJvd3Ncblx0XHRpZiAocm93c051bWJlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiByb3dzTnVtYmVyIT1udWxsICYmIHJvd3NOdW1iZXIhPW51bGwgJiYgIWlzTmFOKHJvd3NOdW1iZXIpICYmIHR5cGVvZiByb3dzTnVtYmVyID09PSAnbnVtYmVyJyAmJiAocm93c051bWJlciAlIDEgPT09IDApICkge1xuXHRcdFx0dXJsID0gdXJsK1wiJnJvd3M9XCIrcm93c051bWJlcjtcblx0XHR9XG5cdFx0XHRcblx0XHRcdFxuXHRcdC8vIFN0YXRzLiBXZSBjb3VudCBhbGwgdGhlIGRpZmZlcmVudCByZXN1bHRzIGJ5IHJlc291cmNlIHR5cGVcblx0XHR1cmwgPSB1cmwrXCImZmFjZXQ9dHJ1ZSZmYWNldC5tZXRob2Q9ZW51bSZmYWNldC5saW1pdD0tMSZmYWNldC5maWVsZD1yZXNvdXJjZV90eXBlXCJcblx0XHRcblx0XHRcdFx0XG5cdFx0Ly8gd3Rcblx0XHR1cmwgPSB1cmwrXCImd3Q9anNvblwiO1xuXHRcdFxuXHRcdC8vIG1heWJlIHdlIGNvdWxkIGFsc28gZmlsdGVyIGZpZWxkcyB0aGF0IHdlIHJldHVyblxuXHRcdC8vICZmbD1zdGFydCx0aXRsZSxub3RlcyxsaW5rXG5cdFx0XG5cdFx0XG5cdFx0cmV0dXJuIHVybDtcblx0fSxcblx0XG5cdFxuXHRcblx0LyoqXG5cdCAqIE1ha2VzIGFuIGFzeW5jaHJvbm91cyByZXF1ZXN0IHRvIHRoZSBDb250ZXh0dWFsaXNhdGlvbiBkYXRhIHNlcnZlciBhbmQgcHJvY2VzcyBpdHMgcmVwbHkuXG5cdCAqIEBwYXJhbSB1cmwge3N0cmluZ30gLSBVbmlmb3JtIFJlc291cmNlIExvY2F0b3Jcblx0ICovXG5cdHByb2Nlc3NEYXRhRnJvbVVybDogZnVuY3Rpb24odXJsKXtcblx0XHR2YXIgbXlDb250ZXh0RGF0YUxpc3QgPSB0aGlzO1xuXHRcdHJlcXdlc3Qoe1xuXHRcdFx0dXJsOiB1cmwgLFxuXHRcdFx0dHlwZTogJ2pzb24nICxcblx0XHRcdG1ldGhvZDogJ3Bvc3QnICxcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicgLFxuXHRcdFx0Y3Jvc3NPcmlnaW46IHRydWUsXG5cdFx0XHR0aW1lb3V0OiAxMDAwICogNSxcblx0XHRcdHdpdGhDcmVkZW50aWFsczogdHJ1ZSwgIC8vIFdlIHdpbGwgaGF2ZSB0byBpbmNsdWRlIG1vcmUgc2VjdXJpdHkgaW4gb3VyIFNvbHIgc2VydmVyXG5cdFx0XHRcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NFcnJvcihlcnIpO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUik7XG5cdFx0XHR9ICxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwKSB7XG5cdFx0XHRcdHZhciBjb250ZXh0dWFsaXNlZERhdGEgPSBteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzQ29udGV4dHVhbGlzZWREYXRhKHJlc3ApO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5kcmF3Q29udGV4dHVhbGlzZWREYXRhKGNvbnRleHR1YWxpc2VkRGF0YSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdFxuXG5cdC8qKlxuXHQgKiBNYW5hZ2VzIHNvbWUgZXJyb3JzIGFuZCBwcm9jZXNzIGVhY2ggcmVzdWx0IHRvIGJlIGdldCBpbiBhIHByb3BlciB3YXkuXG5cdCAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IC0gVGhlIGZ1bGwgZGF0YSBsaXN0IHRvIGJlIHByb2Nlc3NlZCBhbmQgc2hvd25cblx0ICoge0FycmF5fSAtIEFycmF5IHdpdGggb2JqZWN0cyBjb252ZXJ0ZWQgZnJvbSB0aGVpciBvcmlnaW5hbCBKU09OIHN0YXR1c1xuXHQgKi9cblx0cHJvY2Vzc0NvbnRleHR1YWxpc2VkRGF0YSA6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgbXlDb250ZXh0RGF0YUxpc3QgPSB0aGlzO1xuXHRcdHZhciBjb250ZXh0dWFsaXNlZERhdGEgPSBbXTtcblx0XHRpZihkYXRhLnJlc3BvbnNlICE9IHVuZGVmaW5lZCl7XG5cdFx0XHRpZihkYXRhLnJlc3BvbnNlLmRvY3MgIT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IGRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHRoaXMuZ2V0TnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlKGRhdGEpO1xuXHRcdFx0XHRpZiAodGhpcy5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlID09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUgPSB0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0ZGF0YS5yZXNwb25zZS5kb2NzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHR2YXIgdHlwZWREYXRhID0gbXlDb250ZXh0RGF0YUxpc3QuZGF0YU1hbmFnZXIuZ2V0RGF0YUVudGl0eShlbnRyeSk7XG5cdFx0XHRcdFx0Y29udGV4dHVhbGlzZWREYXRhLnB1c2godHlwZWREYXRhKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKFwiZGF0YS5yZXNwb25zZS5kb2NzIHVuZGVmaW5lZFwiKTtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QuY2hhbmdlQ3VycmVudFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKFwiZGF0YS5yZXNwb25zZSB1bmRlZmluZWRcIik7XG5cdFx0XHRteUNvbnRleHREYXRhTGlzdC5jaGFuZ2VDdXJyZW50U3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IpO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiBjb250ZXh0dWFsaXNlZERhdGE7XG5cdH0sXG5cdC8qXG5cdGZpbHRlclNhbWVEYXRhUmVzdWx0cyA6IGZ1bmN0aW9uKGRhdGEsIG1haW5UZXh0LCBjb250ZW50RGVzY3JpcHRpb24pe1xuXHRcdHZhciBmaWx0ZXJlZF9kYXRhID0gZGF0YTtcblx0XHRcblx0XHRkYXRhLnJlc3BvbnNlLmRvY3MuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0dmFyIHR5cGVkRGF0YSA9IG15Q29udGV4dERhdGFMaXN0LmRhdGFNYW5hZ2VyLmdldERhdGFFbnRpdHkoZW50cnkpO1xuXHRcdFx0Y29udGV4dHVhbGlzZWREYXRhLnB1c2godHlwZWREYXRhKTtcblx0XHR9KTtcblx0XHRcblx0XHRDb21tb25EYXRhLlRJVExFX0ZJRUxEXG5cdFx0Q29tbW9uRGF0YS5ERVNDUklQVElPTl9GSUVMRFxuXHRcdFxuXHRcdHJldHVybiBmaWx0ZXJlZF9kYXRhO1xuXHR9LCovXG5cdFxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRhdGEgb2YgZWFjaCByZXNvdXJjZSB0eXBlLlxuXHQgKiBAcGFyYW0gIGRhdGEge09iamVjdH0gLSBUaGUgZnVsbCBkYXRhIGxpc3QgdG8gYmUgcHJvY2Vzc2VkXG5cdCAqIGRhdGEge09iamVjdH0gLSBPYmplY3Qgd2l0aCBvbmUgcHJvcGVydHkgYnkgZWFjaCByZXNvdXJjZSB0eXBlIGFuZCB2YWx1ZSBvZiBpdHMgb2N1cnJlbmNlcy5cblx0ICovXG5cdGdldE51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgZmFjZXRfY291bnRzID0gZGF0YS5mYWNldF9jb3VudHM7XG5cdFx0dmFyIHJlc291cmNlX3R5cGVzX2NvdW50ID0gbnVsbDtcblx0XHRpZiAoZmFjZXRfY291bnRzICE9IHVuZGVmaW5lZCB8fCBmYWNldF9jb3VudHMgIT0gbnVsbCApIHtcblx0XHRcdHZhciBmYWNldF9maWVsZHMgPSBmYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuXHRcdFx0aWYgKGZhY2V0X2ZpZWxkcyAhPSB1bmRlZmluZWQgfHwgZmFjZXRfZmllbGRzICE9IG51bGwgKSB7XG5cdFx0XHRcdHJlc291cmNlX3R5cGVzX2NvdW50ID0gZmFjZXRfZmllbGRzLnJlc291cmNlX3R5cGU7XHRcblx0XHRcdH1cdFxuXHRcdH1cblx0XHRpZiAocmVzb3VyY2VfdHlwZXNfY291bnQgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdFxuXHRcdHZhciBudW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUgPSB7fTtcblx0XHRpZiAodGhpcy50b3RhbEZpbHRlcnMgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGN1cnJlbnRGaWx0ZXIgPSBudWxsO1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy50b3RhbEZpbHRlcnMubGVuZ3RoO2krKykge1xuXHRcdFx0XHRjdXJyZW50RmlsdGVyID0gdGhpcy50b3RhbEZpbHRlcnNbaV07XG5cdFx0XHRcdHZhciBjdXJyZW50X2NvdW50ID0gbnVsbDtcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8cmVzb3VyY2VfdHlwZXNfY291bnQubGVuZ3RoO2orKykge1xuXHRcdFx0XHRcdGN1cnJlbnRfY291bnQgPSByZXNvdXJjZV90eXBlc19jb3VudFtqXTtcblx0XHRcdFx0XHRpZiAoICh0eXBlb2YgY3VycmVudF9jb3VudCA9PT0gJ3N0cmluZycgfHwgY3VycmVudF9jb3VudCBpbnN0YW5jZW9mIFN0cmluZylcblx0XHRcdFx0XHQgICAgJiYgY3VycmVudEZpbHRlci50b0xvd2VyQ2FzZSgpLmluZGV4T2YoY3VycmVudF9jb3VudCkgPiAtMSApIHtcblx0XHRcdFx0XHRcdG51bVJlc3VsdHNCeVJlc291cmNlVHlwZVtjdXJyZW50RmlsdGVyXSA9IHJlc291cmNlX3R5cGVzX2NvdW50W2orMV07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bVJlc3VsdHNCeVJlc291cmNlVHlwZTtcblx0fSxcblx0XG4gICAgICAgICBcblx0LyoqXG5cdCAqIERyYXcgYSBlbnRpcmUgbGlzdCBvZiBjb250ZXh0dWFsaXNlZCByZXNvdXJjZXNcblx0ICogQHBhcmFtIGNvbnRleHR1YWxpc2VkRGF0YSB7b2JqZWN0IE9iamVjdH0gLSBBbGwgdGhlIGRhdGEgdG8gYmUgZHJhd24gaW50byB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0ZHJhd0NvbnRleHR1YWxpc2VkRGF0YSA6IGZ1bmN0aW9uKGNvbnRleHR1YWxpc2VkRGF0YSl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHR3aGlsZSAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHRhcmdldC5yZW1vdmVDaGlsZCh0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdFxuXHRcdHZhciBpbmRleCA9IDA7XG5cdFx0dmFyIGRhdGFPYmplY3Q7XG5cdFx0dmFyIGRyYXdhYmxlT2JqZWN0O1xuXHRcdHZhciBvZGRSb3cgPSB0cnVlO1xuXHRcdHdoaWxlKGluZGV4IDwgY29udGV4dHVhbGlzZWREYXRhLmxlbmd0aCl7XG5cdFx0XHRpZiAoaW5kZXglMj09MCkge1xuXHRcdFx0XHRvZGRSb3cgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRvZGRSb3cgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZGF0YU9iamVjdCA9IGNvbnRleHR1YWxpc2VkRGF0YVtpbmRleF07XG5cdFx0XHRkcmF3YWJsZU9iamVjdCA9IGRhdGFPYmplY3QuZ2V0RHJhd2FibGVPYmplY3RCeVN0eWxlKHRoaXMuZGlzcGxheVN0eWxlKTtcblx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoJ3ZpZXdzLXJvdycpO1xuXHRcdFx0aWYob2RkUm93ID09IHRydWUpe1xuXHRcdFx0XHRkcmF3YWJsZU9iamVjdC5jbGFzc0xpc3QuYWRkKFwidmlld3Mtcm93LW9kZFwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRkcmF3YWJsZU9iamVjdC5jbGFzc0xpc3QuYWRkKFwidmlld3Mtcm93LWV2ZW5cIik7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoZHJhd2FibGVPYmplY3QpO1xuXHRcdFx0aW5kZXgrKztcblx0XHR9XG5cdFx0aWYgKGNvbnRleHR1YWxpc2VkRGF0YS5sZW5ndGggPT0gMCkge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuZ2V0RW1wdHlSZWNvcmQoKSk7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBjb250ZXh0dWFsaXNlZERhdGEubGVuZ3RoO1xuXHRcdHRoaXMudXBkYXRlR2xvYmFsU3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEKTtcblx0XHQvKlxuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50VG90YWxSZXN1bHRzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50VG90YWxSZXN1bHRzKTtcblx0XHRjb25zb2xlLmxvZygnY3VycmVudFN0YXJ0UmVzdWx0Jyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50U3RhcnRSZXN1bHQpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cycpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50RmlsdGVycycpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudEZpbHRlcnMpO1xuXHRcdCovXG5cdFx0XG5cdH0sXG5cdFxuXHQvKipcblx0ICogXHRSZXR1cm5zIG9uZSByb3cgZXhwbGFpbmluZyB0aGUgYWJzZW5jZSBvZiByZWFsIHJlc3VsdHMuXG5cdCAqIFx0e0hUTUwgT2JqZWN0fSAtIEVtcHR5IHJlc3VsdC5cblx0ICovXG5cdGdldEVtcHR5UmVjb3JkIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG5cdFx0dmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuXHRcdFxuXHRcdHZhciBzcGFuVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHR2YXIgdGV4dCA9ICdDYW5ub3QgYmUgZm91bmQgYW55IHJlbGF0ZWQgcmVzdWx0Jztcblx0XHRzcGFuVGV4dC5pbm5lckhUTUwgPSB0ZXh0O1xuXHRcdHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHNwYW5UZXh0KTtcblx0XHRtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblx0XHRyZXR1cm4gbWFpbkNvbnRhaW5lcjtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBVcGRhdGVzLCBkZXBlbmRpbmcgb24gdGhlIG5ldyBzdGF0dXMsIGludGVybmFsIHZhcmlhYmxlcyBvZiB0aGUgY29tcG9uZW50IGFuZCwgaWZcblx0ICogbmV3IHN0YXR1cyBpcyAnTE9BREVEJywgZXhlY3V0ZXMgdGhlICdvbkxvYWRlZCcgZnVuY3Rpb25zIHJlZ2lzdGVyZWQuIFxuXHQgKiBAcGFyYW0gbmV3U3RhdHVzIHtzdHJpbmd9IC0gQ29udGV4dERhdGFMaXN0LkxPQURJTkcgb3IgQ29udGV4dERhdGFMaXN0LkVSUk9SIG9yIENvbnRleHREYXRhTGlzdC5MT0FERUQgXG5cdCAqL1xuXHR1cGRhdGVHbG9iYWxTdGF0dXMgOiBmdW5jdGlvbihuZXdTdGF0dXMpe1xuXHRcdC8vIG5ldyBzdGF0dXMgbXVzdCBiZSBvbmUgb2YgdGhlIHBvc2libGUgc3RhdHVzXG5cdFx0aWYgKG5ld1N0YXR1cyAhPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcgJiZcblx0XHQgICAgbmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IgJiZcblx0XHQgICAgbmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEICl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuY3VycmVudFN0YXR1cyA9IG5ld1N0YXR1cztcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyl7XG5cdFx0XHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IG51bGw7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHRcdC8vIGlmIG5ldyBzdGF0dXMgaXMgTE9BREVELCBoZXJlIHdlIGNhbm5vdCBrbm93IGFueXRoaW5nIGFib3V0IGFsbCB0aGVzZSBpbnRlcm5hbCB2YXJpYWJsZXMuXG5cdFx0fS8qZWxzZSBpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IHRoaXMuTE9BREVEKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHR9Ki9cblx0XHRcblx0XHQvLyBGaW5hbGx5IHdlIGV4ZWN1dGUgcmVnaXN0ZXJlZCAnb25Mb2FkZWQnIGZ1bmN0aW9uc1xuXHRcdGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQgfHxcblx0XHQgICAgdGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IgKXtcblx0XHRcdHRoaXMuZXhlY3V0ZU9uTG9hZGVkRnVuY3Rpb25zKCk7XG5cdFx0fVxuXHR9LFxuXHRcblx0LyoqXG5cdCogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndGl0bGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuXHQqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBBTkNIT1IgZWxlbWVudCB3aXRoICd0aXRsZScgaW5mb3JtYXRpb24gbGlua2luZyB0byB0aGUgb3JpZ2luYWwgc291cmNlLlxuXHQqL1xuXHQvKmRyYXdIZWxwSW1hZ2U6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGhlbHBDb250YWluZXIgPSBudWxsO1xuXHRcdGlmICh0aGlzLnVzZXJIZWxwQ2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHR2YXIgaGVscENvbnRhaW5lcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lcik7XG5cdFx0XHRpZiAoaGVscENvbnRhaW5lcnMgIT0gbnVsbCAmJiBoZWxwQ29udGFpbmVycy5sZW5ndGg+MCkgaGVscENvbnRhaW5lciA9IGhlbHBDb250YWluZXJzWzBdO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyICE9IG51bGwpe1xuXHRcdFx0dmFyIGhlbHBDb250YWluZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VySGVscFRhZ0NvbnRhaW5lcik7XG5cdFx0XHRpZiAoaGVscENvbnRhaW5lcnMgIT0gbnVsbCAmJiBoZWxwQ29udGFpbmVycy5sZW5ndGg+MCkgaGVscENvbnRhaW5lciA9IGhlbHBDb250YWluZXJzWzBdO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhoZWxwQ29udGFpbmVyKTtcblx0XHRpZiAoaGVscENvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHR2YXIgaGVscEltYWdlID0gdGhpcy5nZXRIZWxwSW1hZ2UoKTtcblx0XHRcdGlmIChoZWxwSW1hZ2UgIT0gbnVsbCkge1xuXHRcdFx0XHRoZWxwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0b29sdGlwXCIpO1xuXHRcdFx0XHRoZWxwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZ2V0SGVscEltYWdlKCkpO1xuXHRcdFx0XHQvL2hlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5nZXRIZWxwVGV4dCgpKTtcblx0XHRcdFx0Ly9oZWxwQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlbHBJbWFnZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCovXG5cdFxuXHQvKipcblx0KiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG5cdCogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIEFOQ0hPUiBlbGVtZW50IHdpdGggJ3RpdGxlJyBpbmZvcm1hdGlvbiBsaW5raW5nIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG5cdCovXG4gICAgICAgIC8qZ2V0SGVscEltYWdlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBpbWdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cdFx0aW1nRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9oZWxwX2ltZ1wiKTtcblxuXHRcdHJldHVybiBpbWdFbGVtZW50O1xuICAgICAgICB9LCovXG5cdFxuXHRcblx0XG5cdC8qKlxuXHQgKiBSZWdpc3RlciBuZXcgZnVuY3Rpb25zIHRvIGJlIGV4ZWN1dGVkIHdoZW4gc3RhdHVzIGNvbXBvbmVudCBpcyB1cGRhdGVkIHRvICdMT0FERUQnXG5cdCAqIG15Q29udGV4dCB7T2JqZWN0fSBteUNvbnRleHQgLSBDb250ZXh0IGluIHdoaWNoIG15RnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGUuIFVzdWFsbHkgaXRzIG93biBvYmplY3QgY29udGFpbmVyLlxuXHQgKiBteUNvbnRleHQge09iamVjdH0gbXlGdW5jdGlvbiAtIEZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxuXHQgKi9cblx0cmVnaXN0ZXJPbkxvYWRlZEZ1bmN0aW9uIDogZnVuY3Rpb24obXlDb250ZXh0LCBteUZ1bmN0aW9uKXtcblx0XHR2YXIgb25Mb2FkZWRPYmplY3QgPSB7XG5cdFx0XHQnbXlDb250ZXh0J1x0OiBteUNvbnRleHQsXG5cdFx0XHQnbXlGdW5jdGlvbidcdDogbXlGdW5jdGlvblxuXHRcdH07XG5cdFx0dGhpcy5fb25Mb2FkZWRGdW5jdGlvbnMucHVzaChvbkxvYWRlZE9iamVjdCk7XG5cdH0sXG5cdFxuXHRcblx0LyoqXG5cdCAqIEV4ZWN1dGUgYWxsIHJlZ2lzdGVyZWQgJ29uTG9hZGVkJyBmdW5jdGlvbnNcblx0ICovXG5cdGV4ZWN1dGVPbkxvYWRlZEZ1bmN0aW9ucyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb25PYmplY3QgPSBudWxsO1xuXHRcdHZhciBvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCA9IG51bGw7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb24gPSBudWxsO1xuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5fb25Mb2FkZWRGdW5jdGlvbnMubGVuZ3RoO2krKyl7XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uT2JqZWN0ID0gdGhpcy5fb25Mb2FkZWRGdW5jdGlvbnNbaV07XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCA9IG9uTG9hZGVkRnVuY3Rpb25PYmplY3QubXlDb250ZXh0O1xuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbiA9IG9uTG9hZGVkRnVuY3Rpb25PYmplY3QubXlGdW5jdGlvbjtcblx0XHRcdC8vIHdlIGV4ZWN1dGUgdGhlIG9uTG9hZGVkRnVuY3Rpb24gd2l0aCBpdHMgb3duIGNvbnRleHRcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb24uY2FsbChvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCk7XG5cdFx0fVxuXHR9LFxuXHRcdFxuICAgICAgXG5cdC8qKlxuXHQgKiBQcmludHMgYXMgYW4gZXJyb3IgdG8gdGhlIGNvbnNvbGUgdGhlIG1lc3NhZ2UgcmVjZWl2ZWQuIFxuXHQgKiBlcnJvciB7c3RyaW5nfSBlcnJvciAtIFN0cmluZyB0byBiZSBwcmludGVkXG5cdCAqL1xuXHRwcm9jZXNzRXJyb3IgOiBmdW5jdGlvbihlcnJvcikge1xuXHQgICAgY29uc29sZS5sb2coXCJFUlJPUjpcIiArIGVycm9yKTtcblx0fVxuXG59XG5cblxuLy8gU1RBVElDIEFUVFJJQlVURVNcbi8qXG52YXIgQ09OU1RTID0ge1xuXHQvL0xpc3Qgb2YgcG9zc2libGUgY29udGV4dCBkYXRhIHNvdXJjZXMgXG5cdFNPVVJDRV9FTElYSVJfUkVHSVNUUlk6XCJFU1JcIixcblx0U09VUkNFX0VMSVhJUl9URVNTOlwiVFNTXCIsXG5cdFNPVVJDRV9FTElYSVJfRVZFTlRTOlwiRUVWXCIsXG5cdC8vc3R5bGUgb2YgdmlzdWFsaXphdGlvblxuXHRGVUxMX1NUWUxFOlwiRlVMTF9TVFlMRVwiLFxuXHRDT01NT05fU1RZTEU6XCJDT01NT05fU1RZTEVcIixcblx0Ly9tYXggbnVtYmVyIG9mIHJvd3MgdG8gcmV0cmlldmUgZnJvbSB0aGUgc2VydmVyLCB3aGF0ZXZlciAnbnVtYmVyUmVzdWx0cycgY2FuIGJlXG5cdE1BWF9ST1dTOjEwMCxcblx0Ly9tYXhpbXVtIGxlbmd0aCB0byBiZSB1c2VkIGZyb20gdGhlIGRlc2NyaXB0aW9uIHRvIGZpbHRlciBzYW1lIHJlc3VsdHNcblx0TlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTjo1MCxcblx0Ly9FdmVudHMgXG5cdEVWVF9PTl9SRVNVTFRTX0xPQURFRDogXCJvblJlc3VsdHNMb2FkZWRcIixcblx0RVZUX09OX1JFUVVFU1RfRVJST1I6IFwib25SZXF1ZXN0RXJyb3JcIixcblx0Ly9EaWZmZXJlbnQgd2lkZ2V0IHN0YXR1c1xuXHRMT0FESU5HOiBcIkxPQURJTkdcIixcblx0TE9BREVEOiBcIkxPQURFRFwiLFxuXHRFUlJPUjogXCJFUlJPUlwiXG59O1xuXG5mb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICBDb250ZXh0RGF0YUxpc3Rba2V5XSA9IENPTlNUU1trZXldO1xufSovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0RGF0YUxpc3Q7XG4iLCJcbnZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcbnZhciBFbGl4aXJUcmFpbmluZ0RhdGEgPSByZXF1aXJlKFwiLi9FbGl4aXJUcmFpbmluZ0RhdGEuanNcIik7XG52YXIgRWxpeGlyRXZlbnREYXRhID0gcmVxdWlyZShcIi4vRWxpeGlyRXZlbnREYXRhLmpzXCIpO1xudmFyIEVsaXhpclJlZ2lzdHJ5RGF0YSA9IHJlcXVpcmUoXCIuL0VsaXhpclJlZ2lzdHJ5RGF0YS5qc1wiKTtcblxuLyoqIFxuICogRGF0YSBtYW5hZ21lbnQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBEYXRhTWFuYWdlciBjb21wb25lbnQuXG4gKiAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J1lvdXJPd25Eb21haW4nXS5cbiAqICAgICAgVVJMIHRoYXQgaWRlbnRpZmllcyB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKi9cbnZhciBEYXRhTWFuYWdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiBcbiAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgY3VycmVudERvbWFpbjogbnVsbFxuICAgIH07XG4gICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICB9XG4gICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gICAgXG59XG5cbi8qKiBcbiAqIERhdGEgbWFuYWdtZW50IGZ1bmN0aW9uYWxpdHkuXG4gKiBCdWlsZHMgb25lIGtpbmQgb2YgQ29tbW9uRGF0YSBkZXBlbmRpbmcgb24gaXRzICdzb3VyY2UnIHZhbHVlLlxuICogXG4gKiBAY2xhc3MgRGF0YU1hbmFnZXJcbiAqXG4gKi9cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogRGF0YU1hbmFnZXIsXG4gICAgc291cmNlRmllbGQ6ICdzb3VyY2UnLFxuICAgIFxuICAgIC8qKlxuICAgICogICBSZXR1cm5zIHNvdXJjZSBmaWVsZCB2YWx1ZSBvZiB0aGUgSlNPTiBzdHJ1Y3R1cmUgcGFzc2VkIGFzIGFyZ3VtZW50LlxuICAgICogICBAcGFyYW0ganNvbkVudHJ5IHtPYmplY3R9IC0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIG9uZSBlbnRpdHkncyBkYXRhLlxuICAgICogICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHNvdXJjZSB2YWx1ZSBvZiB0aGUgSlNPTiBzdHJ1Y3R1cmUuXG4gICAgKi9cbiAgICBnZXRTb3VyY2VGaWVsZCA6IGZ1bmN0aW9uKGpzb25FbnRyeSl7XG4gICAgICAgIGlmIChqc29uRW50cnkgIT09IG51bGwgJiYganNvbkVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBqc29uRW50cnlbdGhpcy5zb3VyY2VGaWVsZF07XG4gICAgICAgIH1lbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgICAgIFxuICAgIC8qKlxuICAgICogICBSZXR1cm5zIG9uZSBDb21tb25EYXRhIG9iamVjdCByZXByZXNlbnRpbmcgb25lIGRhdGEgcmVnaXN0cnkuXG4gICAgKiAgIEBwYXJhbSBqc29uRW50cnkge09iamVjdH0gLSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggb25lIGVudGl0eSdzIGRhdGEuXG4gICAgKiAgIHtDb21tb25EYXRhIE9iamVjdH0gLSBDb21tb25EYXRhIGNoaWxkIHRoYXQgcmVwcmVzZW50cyBvYmpldGlmaWVkIGpzb24gZGF0YS5cbiAgICAqL1xuICAgIGdldERhdGFFbnRpdHkgOiBmdW5jdGlvbiAoanNvbkVudHJ5KXtcbiAgICAgICAgdmFyIHNvdXJjZUZpZWxkVmFsdWUgPSB0aGlzLmdldFNvdXJjZUZpZWxkKGpzb25FbnRyeSk7XG4gICAgICAgIHZhciBjb21tb25EYXRhID0gbnVsbDtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgb3B0aW9uc1snY3VycmVudERvbWFpbiddID0gdGhpcy5jdXJyZW50RG9tYWluO1xuICAgICAgICBzd2l0Y2goc291cmNlRmllbGRWYWx1ZSl7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJSZWdpc3RyeURhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyUmVnaXN0cnlEYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJUcmFpbmluZ0RhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyVHJhaW5pbmdEYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJFdmVudERhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyRXZlbnREYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFVua25vd24gc291cmNlIGZpZWxkIHZhbHVlOiBcIiArIHNvdXJjZUZpZWxkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21tb25EYXRhO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFNYW5hZ2VyOyIsInZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcblxuLyoqXG4gKiBFbGl4aXJFdmVudERhdGEgY29uc3RydWN0b3JcbiAqIEBwYXJhbSBqc29uRGF0YSB7T2JqZWN0fSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggdGhlIG9yaWdpbmFsIGRhdGEgcmV0cmlldmVkIGJ5IG91ciBkYXRhIHNlcnZlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciB0aGlzIHN0cnVjdHVyZS5cbiAqICAgICAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J3VybCddXG4gKiAgICAgICAgICBVUkwgd2l0aCB0aGUgdXNlcidzIHBhZ2UgZG9tYWluLlxuICovXG52YXIgRWxpeGlyRXZlbnREYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgQ09OU1RTID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ0FURUdPUlkgICAgICAgICAgICAgICAgICAgIDogXCJjYXRlZ29yeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ0lUWSAgICAgICAgICAgICAgICAgICAgICAgIDogXCJjaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBDT1VOVFJZICAgICAgICAgICAgICAgICAgICAgOiBcImNvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQVJUX0RBVEUgICAgICAgICAgICAgICAgICA6IFwic3RhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIEVORF9EQVRFICAgICAgICAgICAgICAgICAgICA6IFwiZW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBWRU5VRSAgICAgICAgICAgICAgICAgICAgICAgOiBcInZlbnVlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBQUk9WSURFUiAgICAgICAgICAgICAgICAgICAgOiBcInByb3ZpZGVyXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IENPTlNUU1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiaWFublwiO1xuICAgXG59O1xuXG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyRXZlbnREYXRhIGNoaWxkIGNsYXNzIHdpdGggc3BlY2lmaWMgaW5mb3JtYXRpb24gb2YgdGhpcyBraW5kIG9mIHJlZ2lzdHJpZXMuXG4gKi8gICAgICAgICBcbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1vbkRhdGEucHJvdG90eXBlKTtcbkVsaXhpckV2ZW50RGF0YS5jb25zdHJ1Y3Rvcj0gRWxpeGlyRXZlbnREYXRhO1xuICAgICAgIFxuICAgICAgICAgICAgXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgYWxsIGNhdGVnb3JpZXMgcHJlc2VudCBpbiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtBcnJheX0gLSBBcnJheSBvZiBzdHJpbmdzIHdpdGggY2F0ZWdvcmllcyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlWYWx1ZXM9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5DQVRFR09SWSk7ICAgICAgXG59LFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgY2l0eSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgY2l0eSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDaXR5VmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ0lUWSk7ICAgICAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgY291bnRyeSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgY291bnRyeSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDb3VudHJ5VmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ09VTlRSWSk7ICAgICAgXG59O1xuXG5cbi8qKlxuICogICAgICAgICAgQXV4aWxpYXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIG9uZSBkYXRlIGFkYXB0ZWQgdG8gdXNlcidzIGxvY2FsZS5cbiAqICAgICAgICAgIEBwYXJhbSBzb3VyY2VEYXRlIHtTdHJpbmd9IC0gU3RyaW5nIGRhdGUgaW4gVVRGIGZvcm1hdCB0byBiZSBjb252ZXJ0ZWQgaW50byBhIGxvY2FsZSBmb3JtYXQuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGN1cmF0ZWQgZGF0ZS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDdXJhdGVkRGF0ZSA9IGZ1bmN0aW9uKHNvdXJjZURhdGUpe1xuICAgICAgICAgICAgdmFyIGRhdGVWYWx1ZSA9IG5ldyBEYXRlKHNvdXJjZURhdGUpO1xuICAgICAgICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZVZhbHVlKSA9PT0gXCJbb2JqZWN0IERhdGVdXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBpcyBhIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaXNOYU4oIGRhdGVWYWx1ZS5nZXRUaW1lKCkgKSApIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRlIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZURhdGU7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVWYWx1ZS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IGEgZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZURhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBzdGFydGluZyBkYXRlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBzdGFydGluZyBkYXRlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldFN0YXJ0RGF0ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZT0gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5TVEFSVF9EQVRFKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cmF0ZWREYXRlKHZhbHVlKTtcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBlbmRpbmcgZGF0ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgZW5kaW5nIGRhdGUgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RW5kRGF0ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuRU5EX0RBVEUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VyYXRlZERhdGUodmFsdWUpO1xufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIHZlbnVlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSB2ZW51ZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRWZW51ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlZFTlVFKTsgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIHByb3ZpZGVyIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBwcm92aWRlciB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRQcm92aWRlclZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlBST1ZJREVSKTsgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIGltcHJvdmVkIHdheSBvZiByZXByZXNlbnRpbmcgRWxpeGlyRXZlbnREYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9Db21tb25EYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBnZXRFeHBhbmRhYmxlRGV0YWlscyA9IHRoaXMuZ2V0RXhwYW5kYWJsZURldGFpbHMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcbiAgICAgICAgICAgIHZhciBsZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9sZWZ0XCIpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfcmlnaHRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BpY3MpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChnZXRFeHBhbmRhYmxlRGV0YWlscyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgZXhwYW5kYWJsZSBvYmplY3Qgd2l0aCBtYW55IGRldGFpbHMgcmVsYXRlZCB3aXRoIHRoaXMgRWxpeGlyRXZlbnREYXRhIHJlY29yZC5cbiAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBEcmF3YWJsZSBvYmplY3Qgd2l0aCBkZXRhaWxzIHJlbGF0ZWQgd2l0aCB0aGlzIHJlY29yZC5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRFeHBhbmRhYmxlRGV0YWlscyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgZGV0YWlsc0FycmF5ID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuUHJvdmlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHNwYW5Qcm92aWRlci5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICBzcGFuUHJvdmlkZXIuY2xhc3NMaXN0LmFkZChcInByb3ZpZGVyXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhblByb3ZpZGVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyVmFsdWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyICE9PSB1bmRlZmluZWQgKSB7ICAgIFxuICAgICAgICAgICAgICAgICAgICBzcGFuUHJvdmlkZXJUZXh0ID0gXCJQcm92aWRlcjogXCIrcHJvdmlkZXI7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5Qcm92aWRlci5pbm5lckhUTUwgPSBzcGFuUHJvdmlkZXJUZXh0O1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuUHJvdmlkZXIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BhblZlbnVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuVmVudWUuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlLmNsYXNzTGlzdC5hZGQoXCJ2ZW51ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW5WZW51ZVRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlbnVlID0gdGhpcy5nZXRWZW51ZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZW51ZSAhPT0gdW5kZWZpbmVkICkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlVGV4dCA9IHZlbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuVmVudWVUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5Mb2NhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgc3BhbkxvY2F0aW9uLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5jbGFzc0xpc3QuYWRkKFwibG9jYXRpb25cIik7XG4gICAgICAgICAgICB2YXIgc3BhbkxvY2F0aW9uVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRyeSA9IHRoaXMuZ2V0Q291bnRyeVZhbHVlKCk7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IHRoaXMuZ2V0Q2l0eVZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoY291bnRyeSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArIGNvdW50cnk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaXR5ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGFuTG9jYXRpb25UZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvblRleHQgPSBzcGFuTG9jYXRpb25UZXh0ICtcIiwgXCIrIGNpdHk7ICBcbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvblRleHQgPSBzcGFuTG9jYXRpb25UZXh0ICsgY2l0eTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYW5Mb2NhdGlvblRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uLmlubmVySFRNTCA9IHNwYW5Mb2NhdGlvblRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuTG9jYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhbkRhdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBzcGFuRGF0ZXMuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgc3BhbkRhdGVzLmNsYXNzTGlzdC5hZGQoXCJkYXRlc1wiKTtcbiAgICAgICAgICAgIHZhciBzcGFuRGF0ZXNUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSB0aGlzLmdldFN0YXJ0RGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IHRoaXMuZ2V0RW5kRGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzdGFydERhdGUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gXCJGcm9tIFwiK3N0YXJ0RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IHN0YXJ0RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbmREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BhbkRhdGVzVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gc3BhbkRhdGVzVGV4dCArIFwiIHRvIFwiK2VuZERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBlbmREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYW5EYXRlc1RleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzLmlubmVySFRNTCA9IHNwYW5EYXRlc1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuRGF0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWF5YmUgd2UgY2FuIGFkZCBsYXRlciAnY2F0ZWdvcnknIG9yICdrZXl3b3JkcydcbiAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGV0YWlscyA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRldGFpbHNBcnJheSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kYWJsZURldGFpbHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbGl4aXJFdmVudERhdGE7XG4gICAgICAiLCJ2YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyUmVnaXN0cnlEYXRhIGNvbnN0cnVjdG9yXG4gKiAgICAgICAgICBAcGFyYW0ganNvbkRhdGEge09iamVjdH0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIHRoZSBvcmlnaW5hbCBkYXRhIHJldHJpZXZlZCBieSBvdXIgZGF0YSBzZXJ2ZXIuXG4gKiAgICAgICAgICBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgdGhpcyBzdHJ1Y3R1cmUuXG4gKiAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSd1cmwnXVxuICogICAgICAgICAgICAgICAgICAgICAgVVJMIHdpdGggdGhlIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqXG4gKi9cbnZhciBFbGl4aXJSZWdpc3RyeURhdGEgPSBmdW5jdGlvbihqc29uRGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiZWxpeGlyX3JlZ2lzdHJ5XCIgOyAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJSZWdpc3RyeURhdGEgY2hpbGQgY2xhc3Mgd2l0aCBzcGVjaWZpYyBpbmZvcm1hdGlvbiBvZiB0aGlzIGtpbmQgb2YgcmVjb3Jkcy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbW9uRGF0YS5wcm90b3R5cGUpO1xuRWxpeGlyUmVnaXN0cnlEYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJSZWdpc3RyeURhdGE7XG5cbiAgICAgICAgICAgIFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIG1vcmUgZGV0YWlsZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhIEVsaXhpclJlZ2lzdHJ5RGF0YSByZWNvcmQgdHJhbnNmb3JtZWRcbiAqICAgICAgICAgIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoPkNvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgQ29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pK1wiIFsuLi5dXCIsWydlbGl4aXJfcmVnaXN0cnknXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLFsnZWxpeGlyX3JlZ2lzdHJ5J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChleHBhbmRhYmxlRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyUmVnaXN0cnlEYXRhOyIsIlxudmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclRyYWluaW5nRGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogICAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgICAgICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgICAgICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKlxuICovXG52YXIgRWxpeGlyVHJhaW5pbmdEYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xuICAgICAgICAgICAgdGhpcy5TT1VSQ0VfRklFTERfVkFMVUUgPSBcImNrYW5cIjsgXG59O1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclRyYWluaW5nRGF0YSBjaGlsZCBjbGFzcyB3aXRoIHNwZWNpZmljIGluZm9ybWF0aW9uIG9mIHRoaXMga2luZCBvZiByZWdpc3RyaWVzLlxuICovXG5FbGl4aXJUcmFpbmluZ0RhdGEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tb25EYXRhLnByb3RvdHlwZSk7IFxuRWxpeGlyVHJhaW5pbmdEYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJUcmFpbmluZ0RhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgbW9yZSBkZXRhaWxlZCB3YXkgb2YgcmVwcmVzZW50aW5nIGEgRWxpeGlyVHJhaW5pbmdEYXRhIHJlY29yZCB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gKi9cbkVsaXhpclRyYWluaW5nRGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RGVzY3JpcHRpb25WYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aD5Db21tb25EYXRhLk1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIENvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKStcIiBbLi4uXVwiLFsndHJhaW5pbmdfbWF0ZXJpYWwnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLFsndHJhaW5pbmdfbWF0ZXJpYWwnXSk7ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZXhwYW5kYWJsZURlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xufTtcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsaXhpclRyYWluaW5nRGF0YTsiLCJ2YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcblxuLyoqIFxuICogUGFnZU1hbmFnZXIgY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtDb250ZXh0RGF0YUxpc3QgT2JqZWN0fSBSZWZlcmVuY2UgdG8gQ29udGV4dERhdGFMaXN0IG9iamVjdCBpbiBvcmRlciB0byBtYW5hZ2UgaXRzIGZpbHRlcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgUGFnZU1hbmFnZXIgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0PSdZb3VyT3duRGl2SWQnXVxuICogICAgSWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKi9cbnZhciBQYWdlTWFuYWdlciA9IGZ1bmN0aW9uKGNvbnRleHREYXRhTGlzdCwgb3B0aW9ucykge1xuXHR2YXIgY29uc3RzID0ge1xuXHR9O1xuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHsgICAgICAgIFxuXHR9O1xuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0ICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdCAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuXHR9XG5cdFxuXHRmb3IodmFyIGtleSBpbiBjb25zdHMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGNvbnN0c1trZXldO1xuXHR9XG4gICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0ID0gY29udGV4dERhdGFMaXN0O1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQgPSAwO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5yZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24odGhpcywgdGhpcy5idWlsZCk7XG59XG5cbi8qKiBcbiAqIFBhZ2VNYW5hZ2VyIGZ1bmN0aW9uYWxpdHkuXG4gKiBcbiAqIEBjbGFzcyBQYWdlTWFuYWdlclxuICogXG4gKi9cblBhZ2VNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IFBhZ2VNYW5hZ2VyLFxuICAgICAgICBcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcblx0ICovICAgICAgICBcblx0YnVpbGQgOiBmdW5jdGlvbiAoKXtcblx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRJZCk7XG5cdFx0aWYgKHRhcmdldCA9PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09IG51bGwpe1xuXHRcdFx0cmV0dXJuO1x0XG5cdFx0fVxuXHRcdHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGFyZ2V0LnJlbW92ZUNoaWxkKHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUil7XG5cdFx0XHR2YXIgc3RhdHVzVGV4dCA9IHRoaXMuZ2V0Q3VycmVudFN0YXR1cygpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0YXR1c1RleHQpO1xuXHRcdH1lbHNlIGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0XHRcblx0XHRcdHZhciBuYXZEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdG5hdkRpdi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfbmF2Jyk7XG5cdFx0XHRcblx0XHRcdHZhciBwcmV2aW91c0J1dHRvbiA9IHRoaXMuY3JlYXRlUHJldmlvdXNCdXR0b24oKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZChwcmV2aW91c0J1dHRvbik7XG5cdFx0XHRcblx0XHRcdHZhciB0ZXh0U2VwYXJhdG9yID0gdGhpcy5jcmVhdGVUZXh0U2VwYXJhdG9yKCk7XG5cdFx0XHRuYXZEaXYuYXBwZW5kQ2hpbGQodGV4dFNlcGFyYXRvcik7XG5cdFx0XHRcblx0XHRcdHZhciBuZXh0QnV0dG9uID0gdGhpcy5jcmVhdGVOZXh0QnV0dG9uKCk7XG5cdFx0XHRuYXZEaXYuYXBwZW5kQ2hpbGQobmV4dEJ1dHRvbik7XG5cdFx0XHRcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChuYXZEaXYpO1xuXHRcdH1lbHNle1xuXHRcdFx0Y29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBzdGF0dXM6IFwiK3RoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMpO1xuXHRcdH1cblx0XHRcblx0fSxcbiAgICAgICAgXG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIHRleHQgc2VwYXJhdG9yLlxuICAgICAgICAqLyAgXG5cdGNyZWF0ZVRleHRTZXBhcmF0b3IgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy0nKTtcblx0XHRlbGVtZW50LmFwcGVuZENoaWxkKHRleHQpO1xuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgaWYgaXQncyBwb3NzaWJsZSB0byByZXRyaWV2ZSBwcmV2aW91cyByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGV4aXN0UHJldmlvdXNSZXN1bHRzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgc3RhcnRSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0aWYgKHN0YXJ0UmVzdWx0ID09IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ZWxzZVxuXHRcdFx0cmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBpZiBpdCdzIHBvc3NpYmxlIHRvIHJldHJpZXZlIG5leHQgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBleGlzdE5leHRSZXN1bHRzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgc3RhcnRSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0dmFyIG1heFJvd3MgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0dmFyIHRvdGFsUmVzdWx0cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cblx0XHRpZiAoc3RhcnRSZXN1bHQrbWF4Um93czx0b3RhbFJlc3VsdHMpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB0byBnZXQgcHJldmlvdXMgcmVzdWx0cy5Pbmx5IHRleHQgaWYgdGhlcmUgYXJlbid0IHByZXZpb3VzIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlUHJldmlvdXNCdXR0b24gOiBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmV4aXN0UHJldmlvdXNSZXN1bHRzKCkpIHtcblx0XHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0dmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1ByZXZpb3VzJyk7XG5cdFx0XHRidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuXHRcdFx0YnV0dG9uLnRpdGxlID0gJ1ByZXZpb3VzJztcblx0XHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0XHR2YXIgbXlQYWdlTWFuYWdlciA9IHRoaXM7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuXHRcdFx0ICAgIHZhciBtYXhSb3dzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuZ2V0TWF4Um93cygpO1xuXHRcdFx0ICAgIHZhciB0b3RhbFJlc3VsdHMgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0ICAgIHZhciBzdGFydFJlc3VsdCA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRcdCAgICB2YXIgbmV3U3RhcnRSZXN1bHQgPSAwO1xuXHRcdFx0ICAgIGlmIChzdGFydFJlc3VsdC1tYXhSb3dzPD0wKSB7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IDA7XHRcblx0XHRcdCAgICB9ZWxzZXtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQtbWF4Um93cztcblx0XHRcdCAgICB9XG5cdFx0XHQgICAgbXlQYWdlTWFuYWdlci5fY2hhbmdlUGFnZShuZXdTdGFydFJlc3VsdCk7XG5cdFx0XHQgICAgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJ1dHRvbjsgIFxuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHByZXZpb3VzU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdHZhciBwcmV2aW91c1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUHJldmlvdXMnKTtcblx0XHRcdHByZXZpb3VzU3Bhbi5hcHBlbmRDaGlsZChwcmV2aW91c1RleHQpO1xuXHRcdFx0cHJldmlvdXNTcGFuLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHJldHVybiBwcmV2aW91c1NwYW47XG5cdFx0fVxuICAgICAgICAgICAgICBcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHRvIGdldCBwcmV2aW91cyByZXN1bHRzLk9ubHkgdGV4dCBpZiB0aGVyZSBhcmVuJ3QgbW9yZSByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZU5leHRCdXR0b24gOiBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmV4aXN0TmV4dFJlc3VsdHMoKSkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTmV4dCcpO1xuXHRcdFx0YnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcblx0XHRcdGJ1dHRvbi50aXRsZSA9ICdOZXh0Jztcblx0XHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0XHR2YXIgbXlQYWdlTWFuYWdlciA9IHRoaXM7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuXHRcdFx0ICAgIHZhciBtYXhSb3dzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuZ2V0TWF4Um93cygpO1xuXHRcdFx0ICAgIHZhciB0b3RhbFJlc3VsdHMgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0ICAgIHZhciBzdGFydFJlc3VsdCA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRcdCAgICB2YXIgbmV3U3RhcnRSZXN1bHQgPSAwO1xuXHRcdFx0ICAgIGlmIChzdGFydFJlc3VsdCttYXhSb3dzPHRvdGFsUmVzdWx0cykge1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdCttYXhSb3dzO1x0XG5cdFx0XHQgICAgfWVsc2V7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgICBteVBhZ2VNYW5hZ2VyLl9jaGFuZ2VQYWdlKG5ld1N0YXJ0UmVzdWx0KTtcblx0XHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIG5leHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0dmFyIG5leHRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05leHQnKTtcblx0XHRcdG5leHRTcGFuLmFwcGVuZENoaWxkKG5leHRUZXh0KTtcblx0XHRcdG5leHRTcGFuLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHJldHVybiBuZXh0U3Bhbjtcblx0XHR9XG4gICAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyB0aGUgcmVkcmF3biBvZiB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBoYXZpbmcgaW50byBhY2NvdW50XG4gICAgICAgICogcHJldmlvdXNseSBjaG9zZW4gZmlsdGVycy5cbiAgICAgICAgKiBAcGFyYW0gc3RhcnRSZXN1bHQge0ludGVnZXJ9IC0gbnVtYmVyIG9mIHRoZSBmaXJzdCByZXN1bHQgdG8gYmUgc2hvd25cbiAgICAgICAgKi8gIFxuICAgICAgICBfY2hhbmdlUGFnZTogZnVuY3Rpb24gKHN0YXJ0UmVzdWx0KXtcblx0ICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0O1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuZHJhd0NvbnRleHREYXRhTGlzdCgpO1xuICAgICAgICB9LFxuXHQgXG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHRleHR1YWwgZGVzY3JpcHRpb24gb2Y6IGZpcnN0IHJlc3VsdCBzaG93biwgbGFzdCByZXN1bHRzIHNob3duIGFuZFxuICAgICAgICAqIHRvdGFsIG51bWJlciBvZiByZXN1bHRzLlxuICAgICAgICAqLyAgXG5cdGdldEN1cnJlbnRTdGF0dXMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfc3RhdHVzJyk7XG5cdFx0dmFyIHN0YXJ0aW5nUmVzdWx0ID0gbnVsbDtcblx0XHR2YXIgZW5kaW5nUmVzdWx0ID0gbnVsbDtcblx0XHR2YXIgdG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHR2YXIgcmVzdWx0VGV4dCA9IFwiXCI7XG5cdFx0XG5cdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHJlc3VsdFRleHQgPSBcIkxvYWRpbmcgcmVzb3VyY2VzLi4uXCI7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUil7XG5cdFx0XHRyZXN1bHRUZXh0ID0gXCJcIjtcblx0XHR9ZWxzZXtcblx0XHRcdHN0YXJ0aW5nUmVzdWx0ID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0dmFyIGN1cnJlbnRUb3RhbFJlc3VsdHMgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0dmFyIG51bVJvd3NMb2FkZWQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cztcblx0XHRcdFxuXHRcdFx0ZW5kaW5nUmVzdWx0ID0gc3RhcnRpbmdSZXN1bHQgKyBudW1Sb3dzTG9hZGVkO1xuXHRcdFx0aWYgKGN1cnJlbnRUb3RhbFJlc3VsdHM+MCkge1xuXHRcdFx0XHQvLyBvbmx5IHRvIHNob3cgaXQgdG8gdGhlIHVzZXJcblx0XHRcdFx0c3RhcnRpbmdSZXN1bHQgPSBzdGFydGluZ1Jlc3VsdCsxO1xuXHRcdFx0fVxuXHRcdFx0cmVzdWx0VGV4dCA9IFwiUmVjb3JkcyBcIitzdGFydGluZ1Jlc3VsdCtcIiB0byBcIitlbmRpbmdSZXN1bHQrXCIgb2YgXCIrY3VycmVudFRvdGFsUmVzdWx0c1xuXHRcdFx0XG5cdFx0fVxuXHRcdGVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0VGV4dDtcblx0XHRcblx0XHRyZXR1cm4gZWxlbWVudDtcblx0fVxuICAgICAgICBcbiAgICAgICAgXG59XG4gICAgICBcbm1vZHVsZS5leHBvcnRzID0gUGFnZU1hbmFnZXI7XG4gICAgICBcbiAgIiwiXG5cbmZ1bmN0aW9uIGRlZmluZShuYW1lLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiAgICAgIHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSk7XG59XG5cbi8vIENvbnRleHREYXRhTGlzdCBjb25zdGFudHNcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9TT1VSQ0VfRUxJWElSX1JFR0lTVFJZXCIsIFwiRVNSXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfVEVTU1wiLCBcIlRTU1wiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9TT1VSQ0VfRUxJWElSX0VWRU5UU1wiLCBcIkVFVlwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFXCIsIFwiRlVMTF9TVFlMRVwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEVcIiwgXCJDT01NT05fU1RZTEVcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfTUFYX1JPV1NcIiwgMTAwKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OXCIsIDUwKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FVlRfT05fUkVTVUxUU19MT0FERURcIiwgXCJvblJlc3VsdHNMb2FkZWRcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRVZUX09OX1JFUVVFU1RfRVJST1JcIiwgXCJvblJlcXVlc3RFcnJvclwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9MT0FESU5HXCIsIFwiTE9BRElOR1wiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9MT0FERURcIiwgXCJMT0FERURcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRVJST1JcIiwgXCJFUlJPUlwiKTtcblxuLy8gQ29tbW9uRGF0YSBjb25zdGFudHNcbmRlZmluZShcIkNvbW1vbkRhdGFfTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OXCIsIDEwMDApO1xuXG4vLyBCdXR0b25zTWFuYWdlciBjb25zdGFudHNcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX1NRVUFSRURfM0RcIiwgXCJTUVVBUkVEXzNEXCIpO1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfUk9VTkRfRkxBVFwiLCBcIlJPVU5EX0ZMQVRcIik7XG5kZWZpbmUoXCJCdXR0b25zTWFuYWdlcl9JQ09OU19PTkxZXCIsIFwiSUNPTlNfT05MWVwiKTtcblxuIixudWxsLCIvKiFcbiAgKiBSZXF3ZXN0ISBBIGdlbmVyYWwgcHVycG9zZSBYSFIgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICogbGljZW5zZSBNSVQgKGMpIER1c3RpbiBEaWF6IDIwMTVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3JlcXdlc3RcbiAgKi9cblxuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgncmVxd2VzdCcsIHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgY29udGV4dCA9IHRoaXNcblxuICBpZiAoJ3dpbmRvdycgaW4gY29udGV4dCkge1xuICAgIHZhciBkb2MgPSBkb2N1bWVudFxuICAgICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAgICwgaGVhZCA9IGRvY1tieVRhZ10oJ2hlYWQnKVswXVxuICB9IGVsc2Uge1xuICAgIHZhciBYSFIyXG4gICAgdHJ5IHtcbiAgICAgIFhIUjIgPSByZXF1aXJlKCd4aHIyJylcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQZWVyIGRlcGVuZGVuY3kgYHhocjJgIHJlcXVpcmVkISBQbGVhc2UgbnBtIGluc3RhbGwgeGhyMicpXG4gICAgfVxuICB9XG5cblxuICB2YXIgaHR0cHNSZSA9IC9eaHR0cC9cbiAgICAsIHByb3RvY29sUmUgPSAvKF5cXHcrKTpcXC9cXC8vXG4gICAgLCB0d29IdW5kbyA9IC9eKDIwXFxkfDEyMjMpJC8gLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgICdjb250ZW50VHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgJ3JlcXVlc3RlZFdpdGgnOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsICdhY2NlcHQnOiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCAneG1sJzogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCAnaHRtbCc6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsICdqc29uJzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwgJ2pzJzogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAob1snY3Jvc3NPcmlnaW4nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSBjb250ZXh0W3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0W3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0cycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHRbeG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSBpZiAoWEhSMikge1xuICAgICAgICAgIHJldHVybiBuZXcgWEhSMigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gc3VjY2VlZChyKSB7XG4gICAgdmFyIHByb3RvY29sID0gcHJvdG9jb2xSZS5leGVjKHIudXJsKVxuICAgIHByb3RvY29sID0gKHByb3RvY29sICYmIHByb3RvY29sWzFdKSB8fCBjb250ZXh0LmxvY2F0aW9uLnByb3RvY29sXG4gICAgcmV0dXJuIGh0dHBzUmUudGVzdChwcm90b2NvbCkgPyB0d29IdW5kby50ZXN0KHIucmVxdWVzdC5zdGF0dXMpIDogISFyLnJlcXVlc3QucmVzcG9uc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIuX3RpbWVkT3V0KSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0JylcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHN1Y2NlZWQocikpIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gb1snaGVhZGVycyddIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gaGVhZGVyc1snQWNjZXB0J11cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVtvWyd0eXBlJ11dXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bJyonXVxuXG4gICAgdmFyIGlzQUZvcm1EYXRhID0gdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiAob1snZGF0YSddIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW9bJ2Nyb3NzT3JpZ2luJ10gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVyc1sncmVxdWVzdGVkV2l0aCddXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSAmJiAhaXNBRm9ybURhdGEpIGhlYWRlcnNbY29udGVudFR5cGVdID0gb1snY29udGVudFR5cGUnXSB8fCBkZWZhdWx0SGVhZGVyc1snY29udGVudFR5cGUnXVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG9bJ3dpdGhDcmVkZW50aWFscyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhb1snd2l0aENyZWRlbnRpYWxzJ11cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvWydqc29ucENhbGxiYWNrJ10gfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvWydqc29ucENhbGxiYWNrTmFtZSddIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgY29udGV4dFtjYnZhbF0gPSBnZW5lcmFsQ2FsbGJhY2tcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICBzY3JpcHQuc3JjID0gdXJsXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzSUUxMCkge1xuICAgICAgLy8gbmVlZCB0aGlzIGZvciBJRSBkdWUgdG8gb3V0LW9mLW9yZGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSgpLCBiaW5kaW5nIHNjcmlwdFxuICAgICAgLy8gZXhlY3V0aW9uIHRvIGFuIGV2ZW50IGxpc3RlbmVyIGdpdmVzIHVzIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBzY3JpcHRcbiAgICAgIC8vIGlzIGV4ZWN1dGVkLiBTZWUgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZCA9ICdfcmVxd2VzdF8nICsgcmVxSWRcbiAgICB9XG5cbiAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgoc2NyaXB0W3JlYWR5U3RhdGVdICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2NvbXBsZXRlJyAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdsb2FkZWQnKSB8fCBsb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgIHNjcmlwdC5vbmNsaWNrICYmIHNjcmlwdC5vbmNsaWNrKClcbiAgICAgIC8vIENhbGwgdGhlIHVzZXIgY2FsbGJhY2sgd2l0aCB0aGUgbGFzdCB2YWx1ZSBzdG9yZWQgYW5kIGNsZWFuIHVwIHZhbHVlcyBhbmQgc2NyaXB0cy5cbiAgICAgIGZuKGxhc3RWYWx1ZSlcbiAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICBsb2FkZWQgPSAxXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBzY3JpcHQgdG8gdGhlIERPTSBoZWFkXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbiAgICAvLyBFbmFibGUgSlNPTlAgdGltZW91dFxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgZXJyKHt9LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0Jywge30pXG4gICAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgICAgbG9hZGVkID0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3QoZm4sIGVycikge1xuICAgIHZhciBvID0gdGhpcy5vXG4gICAgICAsIG1ldGhvZCA9IChvWydtZXRob2QnXSB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuICAgICAgLCB1cmwgPSB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICAgIC8vIGNvbnZlcnQgbm9uLXN0cmluZyBvYmplY3RzIHRvIHF1ZXJ5LXN0cmluZyBmb3JtIHVubGVzcyBvWydwcm9jZXNzRGF0YSddIGlzIGZhbHNlXG4gICAgICAsIGRhdGEgPSAob1sncHJvY2Vzc0RhdGEnXSAhPT0gZmFsc2UgJiYgb1snZGF0YSddICYmIHR5cGVvZiBvWydkYXRhJ10gIT09ICdzdHJpbmcnKVxuICAgICAgICA/IHJlcXdlc3QudG9RdWVyeVN0cmluZyhvWydkYXRhJ10pXG4gICAgICAgIDogKG9bJ2RhdGEnXSB8fCBudWxsKVxuICAgICAgLCBodHRwXG4gICAgICAsIHNlbmRXYWl0ID0gZmFsc2VcblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgb24gYSBHRVQgcmVxdWVzdCBhbmQgd2UgaGF2ZSBkYXRhIHRoZW4gd2Ugc2hvdWxkIGFwcGVuZFxuICAgIC8vIHF1ZXJ5IHN0cmluZyB0byBlbmQgb2YgVVJMIGFuZCBub3QgcG9zdCBkYXRhXG4gICAgaWYgKChvWyd0eXBlJ10gPT0gJ2pzb25wJyB8fCBtZXRob2QgPT0gJ0dFVCcpICYmIGRhdGEpIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGRhdGEpXG4gICAgICBkYXRhID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChvWyd0eXBlJ10gPT0gJ2pzb25wJykgcmV0dXJuIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybClcblxuICAgIC8vIGdldCB0aGUgeGhyIGZyb20gdGhlIGZhY3RvcnkgaWYgcGFzc2VkXG4gICAgLy8gaWYgdGhlIGZhY3RvcnkgcmV0dXJucyBudWxsLCBmYWxsLWJhY2sgdG8gb3Vyc1xuICAgIGh0dHAgPSAoby54aHIgJiYgby54aHIobykpIHx8IHhocihvKVxuXG4gICAgaHR0cC5vcGVuKG1ldGhvZCwgdXJsLCBvWydhc3luYyddID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBzZXRIZWFkZXJzKGh0dHAsIG8pXG4gICAgc2V0Q3JlZGVudGlhbHMoaHR0cCwgbylcbiAgICBpZiAoY29udGV4dFt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIGNvbnRleHRbeERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvWydiZWZvcmUnXSAmJiBvWydiZWZvcmUnXShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUoaGVhZGVyKSB7XG4gICAgLy8ganNvbiwgamF2YXNjcmlwdCwgdGV4dC9wbGFpbiwgdGV4dC9odG1sLCB4bWxcbiAgICBpZiAoaGVhZGVyID09PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkOyAvL0luIGNhc2Ugb2Ygbm8gY29udGVudC10eXBlLlxuICAgIGlmIChoZWFkZXIubWF0Y2goJ2pzb24nKSkgcmV0dXJuICdqc29uJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ2phdmFzY3JpcHQnKSkgcmV0dXJuICdqcydcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd0ZXh0JykpIHJldHVybiAnaHRtbCdcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd4bWwnKSkgcmV0dXJuICd4bWwnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAob1sndGltZW91dCddKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZWRPdXQoKVxuICAgICAgfSwgb1sndGltZW91dCddKVxuICAgIH1cblxuICAgIGlmIChvWydzdWNjZXNzJ10pIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydzdWNjZXNzJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvWydlcnJvciddKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydlcnJvciddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG9bJ2NvbXBsZXRlJ10pIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2NvbXBsZXRlJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgb1sndGltZW91dCddICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHZhciB0eXBlID0gb1sndHlwZSddIHx8IHJlc3AgJiYgc2V0VHlwZShyZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSkgLy8gcmVzcCBjYW4gYmUgdW5kZWZpbmVkIGluIElFXG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSBjb250ZXh0LkpTT04gPyBjb250ZXh0LkpTT04ucGFyc2UocikgOiBldmFsKCcoJyArIHIgKyAnKScpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IocmVzcCwgJ0NvdWxkIG5vdCBwYXJzZSBKU09OIGluIHJlc3BvbnNlJywgZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgcmVzcCA9IGV2YWwocilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICByZXNwID0gclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgcmVzcCA9IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yIC8vIElFIHRyb2xvbG9cbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLmVycm9yQ29kZVxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IucmVhc29uXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9mdWxmaWxsZWQgPSB0cnVlXG4gICAgICBmbihyZXNwKVxuICAgICAgc2VsZi5fc3VjY2Vzc0hhbmRsZXIocmVzcClcbiAgICAgIHdoaWxlIChzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcCA9IHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuXG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWVkT3V0KCkge1xuICAgICAgc2VsZi5fdGltZWRPdXQgPSB0cnVlXG4gICAgICBzZWxmLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3AsIG1zZywgdCkge1xuICAgICAgcmVzcCA9IHNlbGYucmVxdWVzdFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MubXNnID0gbXNnXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MudCA9IHRcbiAgICAgIHNlbGYuX2VycmVkID0gdHJ1ZVxuICAgICAgd2hpbGUgKHNlbGYuX2Vycm9ySGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkocmVzcCwgbXNnLCB0KVxuICAgICAgfVxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSBnZXRSZXF1ZXN0LmNhbGwodGhpcywgc3VjY2VzcywgZXJyb3IpXG4gIH1cblxuICBSZXF3ZXN0LnByb3RvdHlwZSA9IHtcbiAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWVcbiAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICwgcmV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXQuY2FsbCh0aGlzLCB0aGlzLm8sIHRoaXMuZm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU21hbGwgZGV2aWF0aW9uIGZyb20gdGhlIFByb21pc2VzIEEgQ29tbW9uSnMgc3BlY2lmaWNhdGlvblxuICAgICAqIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1Byb21pc2VzL0FcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIGB0aGVuYCB3aWxsIGV4ZWN1dGUgdXBvbiBzdWNjZXNzZnVsIHJlcXVlc3RzXG4gICAgICovXG4gICwgdGhlbjogZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBmYWlsID0gZmFpbCB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCA9IHN1Y2Nlc3ModGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZhaWwodGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpXG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmYWlsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgYWx3YXlzYCB3aWxsIGV4ZWN1dGUgd2hldGhlciB0aGUgcmVxdWVzdCBzdWNjZWVkcyBvciBmYWlsc1xuICAgICAqL1xuICAsIGFsd2F5czogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkIHx8IHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgZmFpbGAgd2lsbCBleGVjdXRlIHdoZW4gdGhlIHJlcXVlc3QgZmFpbHNcbiAgICAgKi9cbiAgLCBmYWlsOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgLCAnY2F0Y2gnOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLmZhaWwoZm4pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVxd2VzdChvLCBmbikge1xuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIC8vIG5vcm1hbGl6ZSBuZXdsaW5lIHZhcmlhbnRzIGFjY29yZGluZyB0byBzcGVjIC0+IENSTEZcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvXFxyP1xcbi9nLCAnXFxyXFxuJykgOiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsKGVsLCBjYikge1xuICAgIHZhciBuID0gZWwubmFtZVxuICAgICAgLCB0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIG9wdENiID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAvLyBJRSBnaXZlcyB2YWx1ZT1cIlwiIGV2ZW4gd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgYXR0cmlidXRlXG4gICAgICAgICAgLy8gJ3NwZWNpZmllZCcgcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2NvcmUuaHRtbCNJRC04NjI1MjkyNzNcbiAgICAgICAgICBpZiAobyAmJiAhb1snZGlzYWJsZWQnXSlcbiAgICAgICAgICAgIGNiKG4sIG5vcm1hbGl6ZShvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ10gJiYgb1snYXR0cmlidXRlcyddWyd2YWx1ZSddWydzcGVjaWZpZWQnXSA/IG9bJ3ZhbHVlJ10gOiBvWyd0ZXh0J10pKVxuICAgICAgICB9XG4gICAgICAsIGNoLCByYSwgdmFsLCBpXG5cbiAgICAvLyBkb24ndCBzZXJpYWxpemUgZWxlbWVudHMgdGhhdCBhcmUgZGlzYWJsZWQgb3Igd2l0aG91dCBhIG5hbWVcbiAgICBpZiAoZWwuZGlzYWJsZWQgfHwgIW4pIHJldHVyblxuXG4gICAgc3dpdGNoICh0KSB7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCEvcmVzZXR8YnV0dG9ufGltYWdlfGZpbGUvaS50ZXN0KGVsLnR5cGUpKSB7XG4gICAgICAgIGNoID0gL2NoZWNrYm94L2kudGVzdChlbC50eXBlKVxuICAgICAgICByYSA9IC9yYWRpby9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgdmFsID0gZWwudmFsdWVcbiAgICAgICAgLy8gV2ViS2l0IGdpdmVzIHVzIFwiXCIgaW5zdGVhZCBvZiBcIm9uXCIgaWYgYSBjaGVja2JveCBoYXMgbm8gdmFsdWUsIHNvIGNvcnJlY3QgaXQgaGVyZVxuICAgICAgICA7KCEoY2ggfHwgcmEpIHx8IGVsLmNoZWNrZWQpICYmIGNiKG4sIG5vcm1hbGl6ZShjaCAmJiB2YWwgPT09ICcnID8gJ29uJyA6IHZhbCkpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNiKG4sIG5vcm1hbGl6ZShlbC52YWx1ZSkpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoZWwudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0LW9uZScpIHtcbiAgICAgICAgb3B0Q2IoZWwuc2VsZWN0ZWRJbmRleCA+PSAwID8gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XSA6IG51bGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBlbC5sZW5ndGggJiYgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwub3B0aW9uc1tpXS5zZWxlY3RlZCAmJiBvcHRDYihlbC5vcHRpb25zW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbGxlY3QgdXAgYWxsIGZvcm0gZWxlbWVudHMgZm91bmQgZnJvbSB0aGUgcGFzc2VkIGFyZ3VtZW50IGVsZW1lbnRzIGFsbFxuICAvLyB0aGUgd2F5IGRvd24gdG8gY2hpbGQgZWxlbWVudHM7IHBhc3MgYSAnPGZvcm0+JyBvciBmb3JtIGZpZWxkcy5cbiAgLy8gY2FsbGVkIHdpdGggJ3RoaXMnPWNhbGxiYWNrIHRvIHVzZSBmb3Igc2VyaWFsKCkgb24gZWFjaCBlbGVtZW50XG4gIGZ1bmN0aW9uIGVhY2hGb3JtRWxlbWVudCgpIHtcbiAgICB2YXIgY2IgPSB0aGlzXG4gICAgICAsIGUsIGlcbiAgICAgICwgc2VyaWFsaXplU3VidGFncyA9IGZ1bmN0aW9uIChlLCB0YWdzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGZhXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZhID0gZVtieVRhZ10odGFnc1tpXSlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYS5sZW5ndGg7IGorKykgc2VyaWFsKGZhW2pdLCBjYilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUgPSBhcmd1bWVudHNbaV1cbiAgICAgIGlmICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhL2kudGVzdChlLnRhZ05hbWUpKSBzZXJpYWwoZSwgY2IpXG4gICAgICBzZXJpYWxpemVTdWJ0YWdzKGUsIFsgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScgXSlcbiAgICB9XG4gIH1cblxuICAvLyBzdGFuZGFyZCBxdWVyeSBzdHJpbmcgc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVRdWVyeVN0cmluZygpIHtcbiAgICByZXR1cm4gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKHJlcXdlc3Quc2VyaWFsaXplQXJyYXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gIC8vIHsgJ25hbWUnOiAndmFsdWUnLCAuLi4gfSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZUhhc2goKSB7XG4gICAgdmFyIGhhc2ggPSB7fVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lIGluIGhhc2gpIHtcbiAgICAgICAgaGFzaFtuYW1lXSAmJiAhaXNBcnJheShoYXNoW25hbWVdKSAmJiAoaGFzaFtuYW1lXSA9IFtoYXNoW25hbWVdXSlcbiAgICAgICAgaGFzaFtuYW1lXS5wdXNoKHZhbHVlKVxuICAgICAgfSBlbHNlIGhhc2hbbmFtZV0gPSB2YWx1ZVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLy8gWyB7IG5hbWU6ICduYW1lJywgdmFsdWU6ICd2YWx1ZScgfSwgLi4uIF0gc3R5bGUgc2VyaWFsaXphdGlvblxuICByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnIgPSBbXVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGFyci5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9KVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICByZXF3ZXN0LnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gICAgdmFyIG9wdCwgZm5cbiAgICAgICwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblxuICAgIG9wdCA9IGFyZ3MucG9wKClcbiAgICBvcHQgJiYgb3B0Lm5vZGVUeXBlICYmIGFyZ3MucHVzaChvcHQpICYmIChvcHQgPSBudWxsKVxuICAgIG9wdCAmJiAob3B0ID0gb3B0LnR5cGUpXG5cbiAgICBpZiAob3B0ID09ICdtYXAnKSBmbiA9IHNlcmlhbGl6ZUhhc2hcbiAgICBlbHNlIGlmIChvcHQgPT0gJ2FycmF5JykgZm4gPSByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5XG4gICAgZWxzZSBmbiA9IHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nXG5cbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuXG4gIHJlcXdlc3QudG9RdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChvLCB0cmFkKSB7XG4gICAgdmFyIHByZWZpeCwgaVxuICAgICAgLCB0cmFkaXRpb25hbCA9IHRyYWQgfHwgZmFsc2VcbiAgICAgICwgcyA9IFtdXG4gICAgICAsIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgLCBhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgIC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgICAgIHZhbHVlID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiB2YWx1ZSkgPyB2YWx1ZSgpIDogKHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlKVxuICAgICAgICAgIHNbcy5sZW5ndGhdID0gZW5jKGtleSkgKyAnPScgKyBlbmModmFsdWUpXG4gICAgICAgIH1cbiAgICAvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuICAgIGlmIChpc0FycmF5KG8pKSB7XG4gICAgICBmb3IgKGkgPSAwOyBvICYmIGkgPCBvLmxlbmd0aDsgaSsrKSBhZGQob1tpXVsnbmFtZSddLCBvW2ldWyd2YWx1ZSddKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuICAgICAgLy8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG4gICAgICBmb3IgKHByZWZpeCBpbiBvKSB7XG4gICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByZWZpeCkpIGJ1aWxkUGFyYW1zKHByZWZpeCwgb1twcmVmaXhdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwYWNlcyBzaG91bGQgYmUgKyBhY2NvcmRpbmcgdG8gc3BlY1xuICAgIHJldHVybiBzLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRQYXJhbXMocHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQpIHtcbiAgICB2YXIgbmFtZSwgaSwgdlxuICAgICAgLCByYnJhY2tldCA9IC9cXFtcXF0kL1xuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgLy8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG4gICAgICBmb3IgKGkgPSAwOyBvYmogJiYgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ID0gb2JqW2ldXG4gICAgICAgIGlmICh0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG4gICAgICAgICAgYWRkKHByZWZpeCwgdilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIHYgPT09ICdvYmplY3QnID8gaSA6ICcnKSArICddJywgdiwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgLy8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBuYW1lICsgJ10nLCBvYmpbbmFtZV0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuICAgICAgYWRkKHByZWZpeCwgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrUHJlZml4XG4gIH1cblxuICAvLyBqUXVlcnkgYW5kIFplcHRvIGNvbXBhdGliaWxpdHksIGRpZmZlcmVuY2VzIGNhbiBiZSByZW1hcHBlZCBoZXJlIHNvIHlvdSBjYW4gY2FsbFxuICAvLyAuYWpheC5jb21wYXQob3B0aW9ucywgY2FsbGJhY2spXG4gIHJlcXdlc3QuY29tcGF0ID0gZnVuY3Rpb24gKG8sIGZuKSB7XG4gICAgaWYgKG8pIHtcbiAgICAgIG9bJ3R5cGUnXSAmJiAob1snbWV0aG9kJ10gPSBvWyd0eXBlJ10pICYmIGRlbGV0ZSBvWyd0eXBlJ11cbiAgICAgIG9bJ2RhdGFUeXBlJ10gJiYgKG9bJ3R5cGUnXSA9IG9bJ2RhdGFUeXBlJ10pXG4gICAgICBvWydqc29ucENhbGxiYWNrJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gPSBvWydqc29ucENhbGxiYWNrJ10pICYmIGRlbGV0ZSBvWydqc29ucENhbGxiYWNrJ11cbiAgICAgIG9bJ2pzb25wJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2snXSA9IG9bJ2pzb25wJ10pXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIHJlcXdlc3QuYWpheFNldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucykge1xuICAgICAgZ2xvYmFsU2V0dXBPcHRpb25zW2tdID0gb3B0aW9uc1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF3ZXN0XG59KTtcbiIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG52YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIEJ1dHRvbnNNYW5hZ2VyID0gcmVxdWlyZShcIi4vQnV0dG9uc01hbmFnZXIuanNcIik7XG52YXIgUGFnZU1hbmFnZXIgPSByZXF1aXJlKFwiLi9QYWdlTWFuYWdlci5qc1wiKTtcblxuLyoqIFxuICogQmlvQ0lERVIgQ29tcG9uZW50LlxuICpcbiAqIFB1cnBvc2Ugb2YgdGhpcyB3aWRnZXQgaXMgc2hvd2luZyB0byB0aGUgdXNlciwgd2l0aG91dCBhbnkgZGlyZWN0IGFjdGlvbiBieSBoaW1zZWxmLFxuICogaW5mb3JtYXRpb24gb2YgaGlzIGludGVyZXN0IHJlbGF0ZWQgd2l0aCB0aGUgY29udGVudCB0aGF0IGlzIGJlaW5nIHNob3duIGN1cnJlbnRseSB0byBoaW0gLlxuICogVG8gYWNoaWV2ZSB0aGlzLCB3ZSBjb2xsZWN0IGluIGEgU29sciBzeXN0ZW0gaW5mb3JtYXRpb24gb2YgZGlmZmVyZW50IHJlcG9zaXRvcmllc1xuICogKEVsaXhpciBTZXJ2aWNlIFJlZ2lzdHJ5LCBFbGl4aXIgVHJhaW5pbmcgUG9ydGFsLCBhbmQgRWxpeGlyIEV2ZW50cyBQb3J0YWwsIHVudGlsIG5vdyksIHNvXG4gKiB3ZSBjYW4gc2VhcmNoIGludG8gdGhpcyBpbmZvcm1hdGlvbiB3aGljaCBpcyByZWxhdGVkIHdpdGggY29udGVudCBhY2Nlc2VkIGJ5IHVzZXIuXG4gKiBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0SWQgIElkIG9mIHRoZSBtYWluIGNvbnRhaW5lciB0byBwdXQgdGhpcyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dERhdGFMaXN0T3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3Qgc3ViY29tcG9uZW50LlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBcdFx0VHlwZSBvZiByb3dzIHZpc3VhbGlzYXRpb24uXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0SWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFx0XHRUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC4gSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0VGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgXHRcdFRhZyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLiBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0SWRDb250YWluZXIgb3IgdXNlclRleHRDbGFzc0NvbnRhaW5lciBpcyBkZWZpbmVkXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0lkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBcdFx0VGFnIGlkIHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIFx0XHRJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc1RhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIFx0XHRUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgXHRcdEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgb3IgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBkZXNjcmlwdGlvbiB0byBoZWxwIGZpbHRlciBzYW1lIHJlc3VsdHMgdGhhdCB1c2VyIGlzIHNlZWluZy5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlckhlbHBDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIFx0XHRDbGFzcyBuYW1lIHRoYXQgd2lsbCBjb250YWlucyBoZWxwIGljb24uXG4gKiBcdEBvcHRpb24ge2ludH0gW251bWJlclJlc3VsdHM9bnVtYmVyIF1cbiAqICAgIFx0XHRJbnRlZ2VyIHRoYXQgcmVzdHJpY3RzIHRoZSByZXN1bHRzIG51bWJlciB0aGF0IHNob3VsZCBiZSBzaG93bi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYnV0dG9uc01hbmFnZXJPcHRpb25zICBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBCdXR0b25zTWFuYWdlciBzdWJjb21wb25lbnQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldElkPSdZb3VyT3duRGl2SWQnXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRDbGFzcz0nWW91ck93bkNsYXNzJ11cbiAqICAgIFx0XHRDbGFzcyBuYW1lIG9mIHRoZSBESVYgd2hlcmUgdGhlIEJ1dHRvbnNNYW5hZ2VyIG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKiBcdEBvcHRpb24ge2Jvb2xlYW59IFtoZWxwVGV4dF1cbiAqICAgIFx0XHRUcnVlIGlmIHlvdSB3YW50IHRvIHNob3cgYSBoZWxwIHRleHQgb3ZlciB0aGUgYnV0dG9ucy5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbYnV0dG9uc1N0eWxlPSdTUVVBUkVEXzNEJyAsICdST1VORF9GTEFUJyBvciAnSUNPTlNfT05MWScuIElDT05TX09OTFkgYnkgZGVmYXVsdC5dXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgYnV0dG9ucyB2aXN1YWxpc2F0aW9uIHR5cGUuXG4gKiBcdEBvcHRpb24ge2Jvb2xlYW59IFtwcmVzc2VkVW5kZXJsaW5lc11cbiAqICAgIFx0XHRUcnVlIGlmIHlvdSB3YW50IHRvIHNob3cgdW5kZXJsaW5lcyB3aGVuIHlvdSBwcmVzcyBhIGJ1dHRvbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFnZU1hbmFnZXJPcHRpb25zICBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBQYWdlTWFuYWdlciBzdWJjb21wb25lbnQuXG4gKlx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgUGFnZU1hbmFnZXIgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuICBcbiAqL1xuLy9mdW5jdGlvbiBCaW9DaWRlciAodGFyZ2V0SWQsIGNvbnRleHREYXRhTGlzdE9wdGlvbnMsIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyxwYWdlTWFuYWdlck9wdGlvbnMpIHtcbnZhciBiaW9jaWRlciA9IGZ1bmN0aW9uICh0YXJnZXRJZCwgY29udGV4dERhdGFMaXN0T3B0aW9ucywgYnV0dG9uc01hbmFnZXJPcHRpb25zLHBhZ2VNYW5hZ2VyT3B0aW9ucykge1xuXHRcblx0dGhpcy50YXJnZXRJZCA9IHRhcmdldElkO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnMgPSB7fTtcblx0dGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnMgPSB7fTtcblx0dGhpcy5wYWdlTWFuYWdlck9wdGlvbnMgPSB7fTtcblx0XG5cdHZhciBkZWZhdWx0Q29udGV4dERhdGFMaXN0T3B0aW9ucyA9IHtcblx0XHR0YXJnZXRJZDogJ2NvbnRleHRfZGF0YV9saXN0Jyxcblx0XHR0YXJnZXRDbGFzczogJ2NvbnRleHRfZGF0YV9saXN0Jyxcblx0XHR1c2VyVGV4dFRhZ0NvbnRhaW5lcjogJ2gxJyxcblx0XHRudW1iZXJSZXN1bHRzOiA1LFxuXHRcdGRpc3BsYXlTdHlsZTogY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFLFxuXHRcdHVzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyOiAnY29udGV4dF9kZXNjcmlwdGlvbl9jb250YWluZXInXG5cdH07XG5cdFxuXHR2YXIgZGVmYXVsdEJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyA9IHtcblx0XHR0YXJnZXRJZDogJ2J1dHRvbnNfbWFuYWdlcl9jb250YWluZXInLFxuXHRcdHRhcmdldENsYXNzOiAnYnV0dG9uX2NvbnRhaW5lcicsXG5cdFx0aGVscFRleHQ6IHRydWUsXG5cdFx0YnV0dG9uc1N0eWxlOmNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9JQ09OU19PTkxZLFxuXHRcdHByZXNzZWRVbmRlcmxpbmVzOnRydWVcblx0fTtcblx0XG5cdHZhciBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zID0ge1xuXHRcdHRhcmdldENsYXNzOiAncGFnZV9tYW5hZ2VyX2NvbnRhaW5lcicsXG5cdFx0dGFyZ2V0SWQ6ICdwYWdlX21hbmFnZXJfY29udGFpbmVyJ1xuXHR9XG5cdFxuXHRcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnMpe1xuXHQgICAgIHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1trZXldID0gZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBjb250ZXh0RGF0YUxpc3RPcHRpb25zKXtcblx0ICAgICB0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XSA9IGNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0QnV0dG9uc01hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldID0gZGVmYXVsdEJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNba2V5XSA9IGJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdFxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldID0gZGVmYXVsdFBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIHBhZ2VNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5wYWdlTWFuYWdlck9wdGlvbnNba2V5XSA9IHBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdFxuXHRcbiAgICAgICAgXG59XG5cbmJpb2NpZGVyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IGJpb2NpZGVyLFxuXHRcbiAgICAgICAgXG4gICAgICAgIFxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgZGlmZmVyZW50IG9iamVjdHMgYW5kIGRyYXcgdGhlbS5cblx0ICovICAgICAgICBcblx0ZHJhdyA6IGZ1bmN0aW9uICgpe1xuXHRcdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVycygpO1xuXHRcdFx0XHRcdFx0XG5cdFx0dmFyIGNvbnRleHREYXRhTGlzdEluc3RhbmNlID0gbmV3IENvbnRleHREYXRhTGlzdCh0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnMpO1xuXHRcdFxuXHRcdC8vIGJlZm9yZSBpbml0aWFsaXNpbmcgdGhlIG1haW4gY29tcG9uZW50LCB3ZSBzaG91bGQgaW5pdGlhbGlzZSBpdHMgJ3BsdWdpbnMnLlxuXHRcdHZhciBidXR0b25zSW5zdGFuY2UgPSBuZXcgQnV0dG9uc01hbmFnZXIoY29udGV4dERhdGFMaXN0SW5zdGFuY2UsdGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnMpO1xuXHRcdGJ1dHRvbnNJbnN0YW5jZS5idWlsZFByZXNzZWRCdXR0b25zKCk7XG5cdFx0XG5cdFx0dmFyIHBhZ2VNYW5hZ2VySW5zdGFuY2UgPSBuZXcgUGFnZU1hbmFnZXIoY29udGV4dERhdGFMaXN0SW5zdGFuY2UsdGhpcy5wYWdlTWFuYWdlck9wdGlvbnMpO1xuXHRcdHBhZ2VNYW5hZ2VySW5zdGFuY2UuYnVpbGQoKTtcblx0XHRcblx0XHRcblx0XHQvL3RyaWdnZXJzIHRoZSBjb250ZXh0dWFsaXNlZCBkYXRhIGxvYWRpbmcgcHJvY2Vzc1xuXHRcdGNvbnRleHREYXRhTGlzdEluc3RhbmNlLmRyYXdDb250ZXh0RGF0YUxpc3QoKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBjcmVhdGUgb3IgcmV1c2UgaW50ZXJuYWwgY29udGFpbmVycyBvZiBlYWNoIHN1YmNvbXBvbmVudC5cblx0ICovXG5cdGluaXRDb250YWluZXJzOiBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNbJ3RhcmdldENsYXNzJ10pO1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5wYWdlTWFuYWdlck9wdGlvbnNbJ3RhcmdldENsYXNzJ10pO1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNbJ3RhcmdldElkJ10sXG5cdFx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0XG5cdFx0XG5cdH0sXG5cdFxuXHQvKipcblx0ICogQXV4aWxpYXJ5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBvciByZXVzZSBpbnRlcm5hbCBjb250YWluZXJzIG9mIG9uZSBzdWJjb21wb25lbnQuXG5cdCAqIEBwYXJhbSBnbG9iYWxDb250YWluZXJJZCB7c3RyaW5nfSBJZCBvZiB0aGUgQmlvQ2lkZXIgZGl2IGNvbnRhaW5lci5cblx0ICogQHBhcmFtIGNvbnRhaW5lcklkIHtzdHJpbmd9IElkIG9mIHRoZSBsb2NhbCBzdWJjb21wb25lbnQgZGl2IGNvbnRhaW5lci5cblx0ICogQHBhcmFtIGNvbnRhaW5lckNsYXNzIHtzdHJpbmd9IENsYXNzIG5hbWUgdG8gYXBwbHkgdG8gdGhlIHN1YmNvbXBvbmVudCBjb250YWluZXIuXG5cdCAqL1xuXHRpbml0Q29udGFpbmVyIDogZnVuY3Rpb24oZ2xvYmFsQ29udGFpbmVySWQsIGNvbnRhaW5lcklkLCBjb250YWluZXJDbGFzcyl7XG5cdFx0dmFyIGdsb2JhbENvbnRhaW5lckV4aXN0cyA9IGZhbHNlO1xuXHRcdHZhciBsb2NhbENvbnRhaW5lckV4aXN0cyA9IGZhbHNlO1xuXHRcdHZhciBnbG9iYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChnbG9iYWxDb250YWluZXJJZCk7XG5cdFx0aWYgKGdsb2JhbENvbnRhaW5lciAhPSB1bmRlZmluZWQgfHwgZ2xvYmFsQ29udGFpbmVyICE9IG51bGwpe1xuXHRcdFx0Z2xvYmFsQ29udGFpbmVyRXhpc3RzID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKGNvbnRhaW5lcklkICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXJJZCAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpO1xuXHRcdFx0aWYgKGNvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgY29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0fWVsc2V7XHQvLyBuZWVkIHRvIGNyZWF0ZSB0aGUgc3ViY29udGFpbmVyXG5cdFx0XHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRjb250YWluZXIuaWQgPSBjb250YWluZXJJZDtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyRXhpc3RzKSB7XG5cdFx0XHRcdFx0Z2xvYmFsQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1lbHNle1x0Ly8gaWYgd2UgZG9uJ3QgaGF2ZSBhIGNvbnRhaW5lcklkLCB3ZSBjYW4gdHJ5IHRvIGRvIHRoZSBzYW1lIHdpdGggdGhlIGNsYXNzTmFtZVxuXHRcdFx0dmFyIHBvc3NpYmxlQ29udGFpbmVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IG51bGw7XG5cdFx0XHRpZiAocG9zc2libGVDb250YWluZXJzICE9IG51bGwgJiYgcG9zc2libGVDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gcG9zc2libGVDb250YWluZXJzWzBdO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoY29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0XHQvLyBub3RoaW5nIHRvIGRvXG5cdFx0XHR9ZWxzZXtcdC8vIG5lZWQgdG8gY3JlYXRlIHRoZSBzdWJjb250YWluZXJcblx0XHRcdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbnRhaW5lci5pZCA9IGNvbnRhaW5lcklkO1xuXHRcdFx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyRXhpc3RzKSB7XG5cdFx0XHRcdFx0Z2xvYmFsQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0fVxuICAgICAgICBcbiAgICAgICAgXG59XG4gICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IGJpb2NpZGVyO1xuICAiXX0=
