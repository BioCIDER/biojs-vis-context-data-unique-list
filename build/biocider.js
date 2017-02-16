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
 * @option {string} [buttonsStyle='SQUARED_3D' , 'ROUND_FLAT', 'ICONS_ONLY' or 'ELIXIR'. ICONS_ONLY by default.]
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
	if (constants.ButtonsManager_ELIXIR == this.buttonsStyle){
		this.buttonsBasicData.push(['Data','database','database','Data'],
				   ['Interoperability','events','Event','Interoperability'],
				   ['Tools','tools','Tool','Tools'],
				   ['Training','training_material','Training Material','Training']
		);
	}else{
		this.buttonsBasicData.push(['Database','database','database','Databases'],
				   ['Events','events','Event','Events'],
				   ['Tools','tools','Tool','Tools'],
				   ['Training materials','training_material','Training Material','Training materials']
		);
	}
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
			}else if (constants.ButtonsManager_ELIXIR == this.buttonsStyle){
				myButton = this.createElixirButton(buttonData[0],buttonData[1],buttonData[2]);
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
        * Function that creates one button with 'ELIXIR' aspect.
        * @param label {String} - Title to be used into the ANCHOR element.
        * @param internalClass {String} - Specific className to be used into the ANCHOR element.
        * @param internalName {String} - Name to be used into the ANCHOR element. It should be a filter name.
        */  
        createElixirButton : function(label, internalClass, internalName){
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
	    button.classList.add('elixir');
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
                        currentDomain: null,
                        resourceTypeSet: constants.ResourceTypeSets_FLAT,
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
                                    if (constants.ResourceTypeSets_ELIXIR == this.resourceTypeSet) {
                                          element.classList.add('elixir_resource_type');   
                                    }else{
                                    // flat gray style
                                          element.classList.add('flat_resource_type');      
                                    }
                                    
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
	this.contextDataServer = "https://www.biocider.org:8983/solr/contextData";
	
	
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
        
        this.dataManager = new DataManager({'currentDomain':this.currentDomain,'resourceTypeSet':this.resourceTypeSet});
	
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
		var userDescription = this.getUserContentDescription();
		var maxRows = this.getMaxRows();
		var newUrl = this._getNewUrl(userText, userKeywords, userDescription, this.currentFilters, this.currentStartResult, maxRows);
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
<<<<<<< HEAD
                        if (userText == undefined || userText == null) {
				userText = myFirstElement.value;
			}
=======
                        if (myFirstElement.hasOwnProperty("value") && (userText == undefined || userText == null || userText == '' )){
                              userText = myFirstElement.value;
                              //alert('userText value: '+userText);     
                        }
                        
>>>>>>> development
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
	 * @param keywords {string} Associated keywords to the content.
	 * @param descriptionText {string} Associated description of the content.
	 * @param filters {Array} Array of filters - Only results with one of these resource types will be get.
	 * @param start {integer} Position of the first result to retrieve.
	 * @param rowsNumber {integer} Indicates the maximum number of results that will be shown on the screen;
	 */
	_getNewUrl : function(fieldText, keywords, descriptionText, filters, start, rowsNumber){
		//console.log('_getNewUrl, fieldText: '+fieldText+', descriptionText: '+descriptionText+', filters: '+filters+', start: '+start+', rowsNumber: '+rowsNumber);
		var count = 0;
		var url = "";
		
                var fieldTextWithKeywords = fieldText;
                // if we have keywords, we can join them to the userText in order to create the searchphrase.
                if (keywords!=null && keywords.length > 0) {
                    for(var i=0;i<keywords.length;i++){
                         fieldTextWithKeywords = fieldTextWithKeywords +" "+keywords[i];
                    }
                }
                
                
		var words = fieldTextWithKeywords.split(" ");
		var searchPhrase = "";
                var currentWord = "";
		while (count < words.length) {
                        currentWord = words[count];
                        // 'and' word is problematic in the query
                        if (currentWord != 'and') {
                              searchPhrase += currentWord;
                              count++;
                              if(count < words.length){
                                    searchPhrase += '+';
                              }
                        }else{
                              count++;
                        }
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
                        var curatedFieldText = fieldText.replace('&','');
			fq = fq+" AND -"+titleField+":\""+curatedFieldText+"\"";
			
		}
		
		
		if (fq!=null) {
			url = url+" &fq="+fq;
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
        options['resourceTypeSet'] = this.resourceTypeSet;
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
define("ButtonsManager_ELIXIR", "ELIXIR");

// ResourceTypeSets constants
define("ResourceTypeSets_FLAT", "FLAT");
define("ResourceTypeSets_ELIXIR", "ELIXIR");


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
<<<<<<< HEAD
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0J1dHRvbnNNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db21tb25EYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db250ZXh0RGF0YUxpc3QuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0RhdGFNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9FbGl4aXJFdmVudERhdGEuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0VsaXhpclJlZ2lzdHJ5RGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvRWxpeGlyVHJhaW5pbmdEYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9QYWdlTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiLi9qcy9CaW9DaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKiogXG4gKiBCdXR0b25zJyBmaWx0ZXJpbmcgY29uc3RydWN0b3IuXG4gKiBcbiAqIEBjbGFzcyBCdXR0b25zTWFuYWdlclxuICpcbiAqIEBwYXJhbSB7Q29udGV4dERhdGFMaXN0IE9iamVjdH0gUmVmZXJlbmNlIHRvIENvbnRleHREYXRhTGlzdCBvYmplY3QgaW4gb3JkZXIgdG8gbWFuYWdlIGl0cyBmaWx0ZXJzLlxuICogQHBhcmFtIHtBcnJheX0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgQnV0dG9uc01hbmFnZXIgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0PSdZb3VyT3duRGl2SWQnXVxuICogICAgSWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBAb3B0aW9uIHtib29sZWFufSBbaGVscFRleHRdXG4gKiAgICBUcnVlIGlmIHlvdSB3YW50IHRvIHNob3cgYSBoZWxwIHRleHQgb3ZlciB0aGUgYnV0dG9ucy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW2J1dHRvbnNTdHlsZT0nU1FVQVJFRF8zRCcgLCAnUk9VTkRfRkxBVCcsICdJQ09OU19PTkxZJyBvciAnRUxJWElSJy4gSUNPTlNfT05MWSBieSBkZWZhdWx0Ll1cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIGJ1dHRvbnMgdmlzdWFsaXNhdGlvbiB0eXBlLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW3ByZXNzZWRVbmRlcmxpbmVzXVxuICogICAgVHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IHVuZGVybGluZXMgd2hlbiB5b3UgcHJlc3MgYSBidXR0b24uXG4gKi9cbnZhciBCdXR0b25zTWFuYWdlciA9IGZ1bmN0aW9uKGNvbnRleHREYXRhTGlzdCwgb3B0aW9ucykge1xuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcblx0XHRoZWxwVGV4dDogdHJ1ZSxcblx0XHRidXR0b25zU3R5bGU6IGNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9TUVVBUkVEXzNELFxuXHRcdHByZXNzZWRVbmRlcmxpbmVzOiBmYWxzZVxuXHR9O1xuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcblx0XHR0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XHRcblx0fVxuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0XHR0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cbiAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QgPSBjb250ZXh0RGF0YUxpc3Q7XG5cdHRoaXMuYnV0dG9uc0Jhc2ljRGF0YSA9IFtdO1xuXHQvLyBCQVNJQyBCVVRUT04nUyBEQVRBOiBMQUJFTCwgSU5URVJOQUwgQ0xBU1MgTkFNRSwgSU5URVJOQUwgTkFNRSBBTkQgSEVMUCBURVhUXG5cdGlmIChjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfRUxJWElSID09IHRoaXMuYnV0dG9uc1N0eWxlKXtcblx0XHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEucHVzaChbJ0RhdGEnLCdkYXRhYmFzZScsJ2RhdGFiYXNlJywnRGF0YSddLFxuXHRcdFx0XHQgICBbJ0ludGVyb3BlcmFiaWxpdHknLCdldmVudHMnLCdFdmVudCcsJ0ludGVyb3BlcmFiaWxpdHknXSxcblx0XHRcdFx0ICAgWydUb29scycsJ3Rvb2xzJywnVG9vbCcsJ1Rvb2xzJ10sXG5cdFx0XHRcdCAgIFsnVHJhaW5pbmcnLCd0cmFpbmluZ19tYXRlcmlhbCcsJ1RyYWluaW5nIE1hdGVyaWFsJywnVHJhaW5pbmcnXVxuXHRcdCk7XG5cdH1lbHNle1xuXHRcdHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5wdXNoKFsnRGF0YWJhc2UnLCdkYXRhYmFzZScsJ2RhdGFiYXNlJywnRGF0YWJhc2VzJ10sXG5cdFx0XHRcdCAgIFsnRXZlbnRzJywnZXZlbnRzJywnRXZlbnQnLCdFdmVudHMnXSxcblx0XHRcdFx0ICAgWydUb29scycsJ3Rvb2xzJywnVG9vbCcsJ1Rvb2xzJ10sXG5cdFx0XHRcdCAgIFsnVHJhaW5pbmcgbWF0ZXJpYWxzJywndHJhaW5pbmdfbWF0ZXJpYWwnLCdUcmFpbmluZyBNYXRlcmlhbCcsJ1RyYWluaW5nIG1hdGVyaWFscyddXG5cdFx0KTtcblx0fVxuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5yZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24odGhpcywgdGhpcy51cGRhdGVCdXR0b25zU3RhdHVzKTtcbn1cblxuLyoqXG4gKiAgICAgIEJ1dHRvbnNNYW5hZ2VyIGNsYXNzLiBSZXByZXNlbnRzIGEgc2V0IG9mIGZpbHRlcnMgc2VsZWN0YWJsZSB2aWEgYnV0dG9ucyBieSB1c2Vycy5cbiAqIFxuICogICAgICBAY2xhc3MgQnV0dG9uc01hbmFnZXJcbiAqICAgICAgXG4gKi9cbkJ1dHRvbnNNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IEJ1dHRvbnNNYW5hZ2VyLFxuICAgICAgICBidXR0b25zIDogW10sXG5cdFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgYnV0dG9ucyBzdGF0dXMgaGF2aW5nIGludG8gYWNjb3VudCBDb250ZXh0RGF0YUxpc3Qgc3RhdHVzXG4gICAgICAgICAqLyAgICAgICAgXG5cdHVwZGF0ZUJ1dHRvbnNTdGF0dXMgOiBmdW5jdGlvbiAoKXtcblx0XHRcblx0XHQvLyBXZSBkcmF3IHNsaWdodGx5IHNvZnRlciBidXR0b25zIG9mIHJlc291cmNlIHR5cGVzIHdpdGhvdXQgYW55IHJlc3VsdHNcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRmb3IodmFyIHByb3BlcnR5IGluIHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUpe1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHR2YXIgcHJvcGVydHlDb3VudCA9IHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGVbcHJvcGVydHldO1xuXHRcdFx0XHRcdHZhciBteUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BlcnR5KTtcblx0XHRcdFx0XHR0aGlzLnNldEJ1dHRvbkFzcGVjdEFzUmVzdWx0cyhteUJ1dHRvbixwcm9wZXJ0eUNvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XG5cdFx0fVxuXHR9LFxuICAgICAgICBcbiAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcbiAgICAgICAgICovICAgICAgICBcblx0YnVpbGRCdXR0b25zIDogZnVuY3Rpb24gKCl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5oZWxwVGV4dCl7XG5cdFx0XHR2YXIgaGVscFRleHRDb250YWluZXIgPSB0aGlzLmNyZWF0ZUJ1dHRvbnNIZWxwVGV4dCgpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKGhlbHBUZXh0Q29udGFpbmVyKTtcblx0XHR9XG5cdFx0dmFyIHJvd0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHJvd0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3Jvd19jb250YWluZXInKTtcblx0XHRcblx0XHRpZiAodGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aD4wKSB7XG5cdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbEZpbHRlcnMgPSBbXTtcblx0XHR9XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteUJ1dHRvbiA9IG51bGw7XG5cdFx0XHRpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX1JPVU5EX0ZMQVQgPT0gdGhpcy5idXR0b25zU3R5bGUpIHtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZVJvdW5kRmxhdEJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9ZWxzZSBpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFkgPT0gdGhpcy5idXR0b25zU3R5bGUpe1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlSWNvbk9ubHlCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fWVsc2UgaWYgKGNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9FTElYSVIgPT0gdGhpcy5idXR0b25zU3R5bGUpe1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlRWxpeGlyQnV0dG9uKGJ1dHRvbkRhdGFbMF0sYnV0dG9uRGF0YVsxXSxidXR0b25EYXRhWzJdKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlU3F1YXJlZDNEZEJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbXlCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdG15QnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfY2VsbF9jb250YWluZXInKTtcblx0XHRcdG15QnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKG15QnV0dG9uKTtcblx0XHRcdHJvd0NvbnRhaW5lci5hcHBlbmRDaGlsZChteUJ1dHRvbkNvbnRhaW5lcik7XG5cblx0XHRcdHRoaXMuYnV0dG9ucy5wdXNoKG15QnV0dG9uKTtcblx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0LnRvdGFsRmlsdGVycy5wdXNoKGJ1dHRvbkRhdGFbMl0pO1xuXHRcdH1cblx0XHRcbiAgICAgICAgICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocm93Q29udGFpbmVyKTtcblx0XHRcblx0XHRpZiAodGhpcy5wcmVzc2VkVW5kZXJsaW5lcyl7XG5cdFx0XHR2YXIgdW5kZXJsaW5lc0NvbnRhaW5lciA9IHRoaXMuY3JlYXRlQnV0dG9uc1VuZGVybGluZUNvbnRhaW5lcigpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHVuZGVybGluZXNDb250YWluZXIpO1xuXHRcdH1cblx0XHRcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50RmlsdGVycyA9IHRoaXMuZ2V0UHJlc2VudEZpbHRlcnNCeUJ1dHRvbnMoKTtcblx0fSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIENyZWF0ZXMgcHJlc3NlZCBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcbiAgICAgICAgKi8gIFxuICAgICAgICBidWlsZFByZXNzZWRCdXR0b25zIDogZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkQnV0dG9ucygpO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzQnV0dG9uUHJlc3NlZCh0aGlzLmJ1dHRvbnNbaV0pKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93QnV0dG9uQ2xpY2sodGhpcy5idXR0b25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50RmlsdGVycyA9IHRoaXMuZ2V0UHJlc2VudEZpbHRlcnNCeUJ1dHRvbnMoKTtcblxuICAgICAgICB9LFxuXHRcblx0XG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHdpdGggJ1JPVU5EX0ZMQVQnIGFzcGVjdC5cbiAgICAgICAgKiBAcGFyYW0gbGFiZWwge1N0cmluZ30gLSBUaXRsZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbENsYXNzIHtTdHJpbmd9IC0gU3BlY2lmaWMgY2xhc3NOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsTmFtZSB7U3RyaW5nfSAtIE5hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC4gSXQgc2hvdWxkIGJlIGEgZmlsdGVyIG5hbWUuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlUm91bmRGbGF0QnV0dG9uIDogZnVuY3Rpb24obGFiZWwsIGludGVybmFsQ2xhc3MsIGludGVybmFsTmFtZSl7XG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgdmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcbiAgICAgICAgICAgIGJ1dHRvbi50aXRsZSA9IGxhYmVsO1xuICAgICAgICAgICAgYnV0dG9uLm5hbWUgPSBpbnRlcm5hbE5hbWU7XG5cdCAgICBidXR0b24uaWQgPSBpbnRlcm5hbE5hbWU7XG4gICAgICAgICAgICBidXR0b24uaHJlZiA9IFwiI1wiO1xuICAgICAgICAgICAgdmFyIG15QnV0dG9uc01hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBteUJ1dHRvbnNNYW5hZ2VyLmZpbHRlcih0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uJyk7XG5cdCAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgncm91bmRfZmxhdCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoaW50ZXJuYWxDbGFzcyk7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHdpdGggJ1NRVUFSRURfM0QnIGFzcGVjdC5cbiAgICAgICAgKiBAcGFyYW0gbGFiZWwge1N0cmluZ30gLSBUaXRsZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbENsYXNzIHtTdHJpbmd9IC0gU3BlY2lmaWMgY2xhc3NOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsTmFtZSB7U3RyaW5nfSAtIE5hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC4gSXQgc2hvdWxkIGJlIGEgZmlsdGVyIG5hbWUuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlU3F1YXJlZDNEZEJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG4gICAgICAgICAgICBidXR0b24udGl0bGUgPSBsYWJlbDtcbiAgICAgICAgICAgIGJ1dHRvbi5uYW1lID0gaW50ZXJuYWxOYW1lO1xuXHQgICAgYnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuICAgICAgICAgICAgYnV0dG9uLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIHZhciBteUJ1dHRvbnNNYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHQgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NxdWFyZWRfM2QnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjsgICAgXG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB3aXRoICdJQ09OX09OTFknIGFzcGVjdC5cbiAgICAgICAgKiBAcGFyYW0gbGFiZWwge1N0cmluZ30gLSBUaXRsZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbENsYXNzIHtTdHJpbmd9IC0gU3BlY2lmaWMgY2xhc3NOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsTmFtZSB7U3RyaW5nfSAtIE5hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC4gSXQgc2hvdWxkIGJlIGEgZmlsdGVyIG5hbWUuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlSWNvbk9ubHlCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcblx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcblx0XHRidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuXHRcdGJ1dHRvbi50aXRsZSA9IGxhYmVsO1xuXHRcdGJ1dHRvbi5uYW1lID0gaW50ZXJuYWxOYW1lO1xuXHRcdGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcblx0XHRidXR0b24uaHJlZiA9IFwiI1wiO1xuXHRcdHZhciBteUJ1dHRvbnNNYW5hZ2VyID0gdGhpcztcblx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuXHRcdCAgICBteUJ1dHRvbnNNYW5hZ2VyLmZpbHRlcih0aGlzKTtcblx0XHQgICAgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uJyk7XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ljb25zX29ubHknKTtcblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgndW5wcmVzc2VkJyk7XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoaW50ZXJuYWxDbGFzcyk7XG5cdFx0cmV0dXJuIGJ1dHRvbjsgICAgXG4gICAgICAgIH0sXG5cdFxuXHRcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnRUxJWElSJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZUVsaXhpckJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG4gICAgICAgICAgICBidXR0b24udGl0bGUgPSBsYWJlbDtcbiAgICAgICAgICAgIGJ1dHRvbi5uYW1lID0gaW50ZXJuYWxOYW1lO1xuXHQgICAgYnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuICAgICAgICAgICAgYnV0dG9uLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIHZhciBteUJ1dHRvbnNNYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHQgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2VsaXhpcicpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoaW50ZXJuYWxDbGFzcyk7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgc3RhdHVzIG9mIHRoZSBidXR0b24gYW5kIGV4ZWN1dGVzIHRoZSByZWRyYXduIG9mIHRoZSBDb250ZXh0RGF0YUxpc3RcbiAgICAgICAgKiBvYmplY3QgaGF2aW5nIGludG8gYWNjb3VudCBjaG9zZW4gZmlsdGVycy5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gYmUgcHJlc3NlZC91bnByZXNzZWQuXG4gICAgICAgICovICBcbiAgICAgICAgZmlsdGVyOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgdGhpcy5zaG93QnV0dG9uQ2xpY2sobXlCdXR0b24pO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbERyYXdDb250ZXh0RGF0YUxpc3QoKTtcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgYXNwZWN0IG9mIG9uZSBidXR0b24gZGVwZW5kaW5nIG9uIGlmIGl0IGhhcyBhbnkgYXNzb2NpYXRlZCByZXN1bHQgb3Igbm90LlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBiZSBtb2RpZmllZC5cbiAgICAgICAgKiBAcGFyYW0gbnVtYmVyUmVzdWx0cyB7SW50ZWdlcn0gLSBOdW1iZXIgb2Ygb2NjdXJyZW5jZXMgYXNzb2NpYXRlZCB0byB0aGUgYnV0dG9uLlxuICAgICAgICAqLyBcbiAgICAgICAgc2V0QnV0dG9uQXNwZWN0QXNSZXN1bHRzOiBmdW5jdGlvbiAobXlCdXR0b24sIG51bWJlclJlc3VsdHMpe1xuXHRcdGlmIChteUJ1dHRvbiA9PSB1bmRlZmluZWQgfHwgbXlCdXR0b24gPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1x0ICAgIFxuXHRcdH1cblx0XHR2YXIgZW1wdHlUaXRsZVN1ZmZpeCA9ICcgKG5vIHJlc3VsdHMpJztcblx0XHRpZiAobnVtYmVyUmVzdWx0cyA9PSAwKSB7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk9PS0xKSB7XG5cdFx0XHRcdG15QnV0dG9uLnRpdGxlID0gbXlCdXR0b24udGl0bGUgKyBlbXB0eVRpdGxlU3VmZml4O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fWVsc2V7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk+LTEpIHtcblx0XHRcdFx0bXlCdXR0b24udGl0bGUucmVwbGFjZShlbXB0eVRpdGxlU3VmZml4LCcnKTtcblx0XHRcdH1cblx0XHR9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNoYW5nZXMgdGhlIGFzcGVjdCBvZiBvbmUgYnV0dG9uIGZyb20gcHJlc3NlZCB0byB1bnByZXNzZWQsIG9yIHZpY2UgdmVyc2EuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGJlIHByZXNzZWQvdW5wcmVzc2VkLlxuICAgICAgICAqLyBcbiAgICAgICAgc2hvd0J1dHRvbkNsaWNrOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuXHRcdG15QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJ1bnByZXNzZWRcIik7XG5cdFx0bXlCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcInByZXNzZWRcIik7XG5cdFx0aWYgKHRoaXMucHJlc3NlZFVuZGVybGluZXMpIHtcblx0XHRcdHZhciB1bmRlcmxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChteUJ1dHRvbi5pZCtcIl91bmRlcmxpbmVcIik7XG5cdFx0XHRpZiAodGhpcy5pc0J1dHRvblByZXNzZWQobXlCdXR0b24pKSB7XG5cdFx0XHRcdHVuZGVybGluZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR1bmRlcmxpbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgaWYgdGhlIGJ1dHRvbiBwYXNzZWQgYXMgYXJndW1lbnQgaXMgcHJlc3NlZCBvciBub3QuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGNoZWNrIGl0cyBzdGF0dXMuXG4gICAgICAgICoge0Jvb2xlYW59IC0gUmV0dXJucyBpZiBteUJ1dHRvbiBpcyBwcmVzc2VkIG9yIG5vdC5cbiAgICAgICAgKi9cbiAgICAgICAgaXNCdXR0b25QcmVzc2VkOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgaWYgKCFteUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJwcmVzc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfWVsc2UgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYWN0aXZlIGZpbHRlcnMgcmVsYXRlZCB3aXRoIHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKiB7QXJyYXl9IC0gQ3VycmVudCBhcHBsaWNhYmxlIGZpbHRlcnMuXG4gICAgICAgICovXG4gICAgICAgIGdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwcmVzc2VkQnV0dG9ucyA9IHRoaXMuZ2V0UHJlc3NlZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHByZXNzZWRCdXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaChwcmVzc2VkQnV0dG9uc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJzOyAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbGwgcHJlc3NlZCBidXR0b25zLlxuICAgICAgICAqIHtBcnJheX0gLSBDdXJyZW50IHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKi9cbiAgICAgICAgZ2V0UHJlc3NlZEJ1dHRvbnMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHByZXNzZWRCdXR0b25zID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0J1dHRvblByZXNzZWQodGhpcy5idXR0b25zW2ldKSl7XG4gICAgICAgICAgICAgICAgICAgIHByZXNzZWRCdXR0b25zLnB1c2godGhpcy5idXR0b25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJlc3NlZEJ1dHRvbnM7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXJhZ3JhcGggZWxlbWVudCB3aXRoIHNwZWNpZmljIHRleHQgYWJvdXQgZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvblxuXHQqICAge0hUTUwgT2JqZWN0fSAtIGRpdiBlbGVtZW50IHdpdGggaGVscCByZWxhdGVkIHRvIGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25zLlxuICAgICAgICAqL1xuXHRjcmVhdGVCdXR0b25zSGVscFRleHQgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBoZWxwX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGhlbHBfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfcm93X2NvbnRhaW5lcicpO1xuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbnNCYXNpY0RhdGFbaV07XG5cdFx0XHRcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaW5uZXJIVE1MID0gYnV0dG9uRGF0YVszXTtcblx0XHRcdG15VGV4dC5jbGFzc0xpc3QuYWRkKCdidXR0b25faGVscCcpO1xuXHRcdFx0aGVscF9jb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcdFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gaGVscF9jb250YWluZXI7XG5cdH0sXG5cdFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGFyYWdyYXBoIGVsZW1lbnQgd2l0aCBzcGVjaWZpYyB0ZXh0IGFib3V0IGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25cblx0KiAgIHtIVE1MIE9iamVjdH0gLSBkaXYgZWxlbWVudCB3aXRoIGhlbHAgcmVsYXRlZCB0byBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9ucy5cbiAgICAgICAgKi9cblx0Y3JlYXRlQnV0dG9uc1VuZGVybGluZUNvbnRhaW5lciA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHVuZGVybGluZXNfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dW5kZXJsaW5lc19jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19yb3dfY29udGFpbmVyJyk7XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaWQgPSBidXR0b25EYXRhWzJdK1wiX3VuZGVybGluZVwiO1xuXHRcdFx0bXlUZXh0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl91bmRlcmxpbmUnKTtcblx0XHRcdFxuXHRcdFx0dmFyIG15VW5kZXJsaW5lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRteVVuZGVybGluZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3VuZGVybGluZV9jZWxsX2NvbnRhaW5lcicpO1xuXHRcdFx0bXlVbmRlcmxpbmVDb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcblx0XHRcdHVuZGVybGluZXNfY29udGFpbmVyLmFwcGVuZENoaWxkKG15VW5kZXJsaW5lQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHVuZGVybGluZXNfY29udGFpbmVyO1xuXHR9XG59XG5cbi8vIFNUQVRJQyBBVFRSSUJVVEVTXG4vKlxudmFyIENPTlNUUyA9IHtcblx0Ly9zdHlsZSBvZiB2aXN1YWxpemF0aW9uXG5cdFNRVUFSRURfM0Q6XCJTUVVBUkVEXzNEXCIsXG5cdFJPVU5EX0ZMQVQ6XCJST1VORF9GTEFUXCIsXG5cdElDT05TX09OTFk6XCJJQ09OU19PTkxZXCJcbn07XG5cbmZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgIEJ1dHRvbnNNYW5hZ2VyW2tleV0gPSBDT05TVFNba2V5XTtcbn1cbiovICAgIFxuICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbnNNYW5hZ2VyO1xuICAgICAgXG4gICIsInZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIENvbW1vbkRhdGEgY29uc3RydWN0b3JcbiAqICAgICAgICAgIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogICAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgICAgICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgICAgICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKi9cbnZhciBDb21tb25EYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VUeXBlU2V0OiBjb25zdGFudHMuUmVzb3VyY2VUeXBlU2V0c19GTEFULFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuanNvbkRhdGEgPSBqc29uRGF0YTtcbn07XG5cbi8qKlxuICogICAgICAgICAgQ29tbW9uIHBhcmVudCBjbGFzcyB0aGF0IHNob3VsZCBiZSBpbmhlcml0ZWQgYnkgYWxsIHNwZWNpZmljIGNsYXNzZXMgdG8gYmUgbWFuYWdlZCBvbiB0aGlzIGNvbXBvbmVudC5cbiAqL1xuQ29tbW9uRGF0YS5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcjogQ29tbW9uRGF0YSxcbiAgICAgICAgICAgIFNPVVJDRV9GSUVMRCAgICAgICAgICAgICAgICA6IFwic291cmNlXCIsXG4gICAgICAgICAgICBSRVNPVVJDRV9UWVBFX0ZJRUxEICAgICAgICAgOiBcInJlc291cmNlX3R5cGVcIixcbiAgICAgICAgICAgIFRJVExFX0ZJRUxEICAgICAgICAgICAgICAgICA6IFwidGl0bGVcIixcbiAgICAgICAgICAgIFRPUElDX0ZJRUxEICAgICAgICAgICAgICAgICA6IFwiZmllbGRcIixcbiAgICAgICAgICAgIERFU0NSSVBUSU9OX0ZJRUxEICAgICAgICAgICA6IFwiZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIExJTktfRklFTEQgICAgICAgICAgICAgICAgICA6IFwibGlua1wiLFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyByZXRyaWV2ZXMgdGhlIHByb3BlciBjbGFzcyBuYW1lIGJhc2VkIG9uIHRoZSByZWFsIHJlc291cmNlIHR5cGVcbiAgICAgICAgICAgIG1hcHBpbmdSZXNvdXJjZVR5cGVDbGFzc2VzIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1Rvb2wnICAgICAgICAgICAgICAgICAgOid0b29scycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnV29ya2Zsb3cnICAgICAgICAgICAgICA6J3dvcmtmbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdEYXRhYmFzZScgICAgICAgICAgICAgIDonZGF0YWJhc2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1RyYWluaW5nIE1hdGVyaWFsJyAgICAgOid0cmFpbmluZ19tYXRlcmlhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnRXZlbnQnICAgICAgICAgICAgICAgICA6J2V2ZW50cydcbiAgICAgICAgICAgIH0sXG4gICAgIFxuICAgICAgICAgICAgLyoqICAgICAgICAgVVRJTElUWSBGVU5DVElPTlMgVE8gR0VUIEZJRUxEJ1MgVkFMVUUgICAgICAgICAgICAgICAgICAgICovXG4gICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBBdXhpbGlhciBmdW5jdGlvbiB0byBnZXQgZWFzaWx5IGFueSBraW5kIG9mIGRhdGEgcHJlc2VudCBpbiB0aGUgaW50ZXJuYWxcbiAgICAgICAgICAgICAqICAgICAgICAgIGRhdGEgc3RydWN0dXJlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGZpZWxkTmFtZSB7U3RyaW5nfSAtIE5hbWUgb2YgdGhlIGZpZWxkIHRvIGJlIHJldHVybmVkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJpc2VkVmFsdWUgOiBmdW5jdGlvbihmaWVsZE5hbWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuanNvbkRhdGEgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmpzb25EYXRhICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5qc29uRGF0YVtmaWVsZE5hbWVdOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBtYW5kYXRvcnkgZmllbGRzXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgc291cmNlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBzb3VyY2UgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFNvdXJjZVZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlNPVVJDRV9GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGFsbCByZXNvdXJjZSB0eXBlcyBwcmVzZW50IGluIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAge0FycmF5fSAtIEFycmF5IG9mIHN0cmluZ3Mgd2l0aCByZXNvdXJjZSB0eXBlcnMgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRSZXNvdXJjZVR5cGVWYWx1ZXMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuUkVTT1VSQ0VfVFlQRV9GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBTb21ldGltZXMgY2FuIGJlIGR1cGxpY2F0ZSByZXNvdXJjZSB0eXBlcy5cbiAgICAgICAgICAgICAqICAgICAgICAgIFRoaXMgZnVuY3Rpb24gb25seSByZXR1cm5zIHVuaXF1ZSByZXNvdXJjZSB0eXBlcy5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtBcnJheX0gLSBBcnJheSBvZiBzdHJpbmdzIHdpdGggdW5pcXVlIHJlc291cmNlIHR5cGVycyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFVuaXF1ZVJlc291cmNlVHlwZVZhbHVlcyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0UmVzb3VyY2VUeXBlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW5pcXVlUmVzb3VyY2VUeXBlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxyZXNvdXJjZVR5cGVzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEgKHVuaXF1ZVJlc291cmNlVHlwZXMuaW5kZXhPZihyZXNvdXJjZVR5cGVzW2ldKSA+IC0xKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmlxdWVSZXNvdXJjZVR5cGVzLnB1c2gocmVzb3VyY2VUeXBlc1tpXSk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pcXVlUmVzb3VyY2VUeXBlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgdGhlIHRpdGxlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBUaXRsZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VGl0bGVWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5USVRMRV9GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGFsbCB0b3BpYyBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtBcnJheX0gLSBUb3BpY3MgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRUb3BpY1ZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlRPUElDX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIG9wdGlvbmFsIGZpZWxkc1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHRoZSBkZXNjcmlwdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhpcyBlbnRpdHkgKGlmIGV4aXN0cykuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFRleHR1YWwgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldERlc2NyaXB0aW9uVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuREVTQ1JJUFRJT05fRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHRoZSBVUkwgdG8gYWNjZXNzIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2Ugb2YgdGhpcyBlbnRpdHkgKGlmIGV4aXN0cykuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFNvdXJjZSdzIFVSTC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGlua1ZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkxJTktfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgIFxuICAgICAgXG4gICAgICAgICAgICAvKiogICAgICAgICBTVEFOREFSRCBGVU5DVElPTlMgVE8gTUFOQUdFIEhUTUwgQkVIQVZJT1VSIE9GIFRISVMgRU5USVRZICAgICAqL1xuICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIGtpbmQgb2YgQ29tbW9uRGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQgaW4gYSB3YXkgdGhhdFxuICAgICAgICAgICAgICogICAgICAgICAgZGVwZW5kcyBvbiB3aGF0IGtpbmQgb2Ygc3R5bGUgeW91IHdhbnQgaXQgd2lsbCBiZSBkcmF3bi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBkaXNwbGF5U3R5bGUge1N0cmluZ30gLSBPbmUgZHJhd2luZyBzdHlsZS4gQ3VycmVudGx5IENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEUgb3IgQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldERyYXdhYmxlT2JqZWN0QnlTdHlsZSA6IGZ1bmN0aW9uKGRpc3BsYXlTdHlsZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheVN0eWxlID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfQ09NTU9OX1NUWUxFKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbW1vbkRyYXdhYmxlT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoZGlzcGxheVN0eWxlID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRlVMTF9TVFlMRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRGdWxsRHJhd2FibGVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBpbXByb3ZlZCB3YXkgb2YgcmVwcmVzZW50aW5nIGFueSBDb21tb25EYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIEl0IGhhcyB0byBiZSBleHRlbmRlZCBieSBlYWNoIGNoaWxkcmVuIG9iamVjdDsgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gY2FsbHMgdG9cbiAgICAgICAgICAgICAqICAgICAgICAgIGdldENvbW1vbkRyYXdhYmxlT2JqZWN0LlxuICAgICAgICAgICAgICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRGdWxsRHJhd2FibGVPYmplY3QgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyBhbnkgQ29tbW9uRGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldENvbW1vbkRyYXdhYmxlT2JqZWN0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9sZWZ0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfcmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BpY3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xpc3RFbGVtZW50LmFwcGVuZENoaWxkKG1haW5Db250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gbGlzdEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFpbkNvbnRhaW5lcjtcbiAgICAgICAgICAgIH0sXG4gICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndGl0bGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIEFOQ0hPUiBlbGVtZW50IHdpdGggJ3RpdGxlJyBpbmZvcm1hdGlvbiBsaW5raW5nIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExhYmVsVGl0bGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0xvY2FsVXJsKHRoaXMuZ2V0TGlua1ZhbHVlKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZXh0ZXJuYWxfbGlua1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnRpdGxlID0gJ0V4dGVybmFsIGxpbmsnOyAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsdGhpcy5nZXRMaW5rVmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZ2V0VGl0bGVWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29tZXRpbWVzIGRlc2NyaXB0aW9uIGhhdmUgbG9uZyB2YWx1ZXMgYW5kIGl0IHNlZW1zIG1vcmUgbGlrZSBlcnJvcnMhXG4gICAgICAgICAgICAgICAgICAgICAgICAvKnZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RGVzY3JpcHRpb25WYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCAmJiBkZXNjcmlwdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnRpdGxlID0gZGVzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YXJnZXQnLCdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0b3BpY3MnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIERJViBlbGVtZW50IHdpdGggYWxsICd0b3BpY3MnIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExhYmVsVG9waWNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV90b3BpY3NcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmF3VG9waWNWYWx1ZSA9IHRoaXMuZ2V0VG9waWNWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsU3RyaW5nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHJhd1RvcGljVmFsdWUubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFN0cmluZyA9IGZpbmFsU3RyaW5nICsgcmF3VG9waWNWYWx1ZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaSsxKSA8IHJhd1RvcGljVmFsdWUubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZmluYWxTdHJpbmcgKz0gJywgJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBmaW5hbFN0cmluZzsgXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIHN0YW5kYXJkIHRleHR1YWwgd2F5IG9mIHJlcHJlc2VudGluZyAncmVzb3VyY2UgdHlwZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gU1BBTiBlbGVtZW50IHdpdGggYWxsICdyZXNvdXJjZSB0eXBlJyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMYWJlbFJlc291cmNlVHlwZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5nZXRVbmlxdWVSZXNvdXJjZVR5cGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgc3RhbmRhcmQgd2F5IChhcyBhIHNldCBvZiBpbWFnZXMpIG9mIHJlcHJlc2VudGluZyAncmVzb3VyY2UgdHlwZSdcbiAgICAgICAgICAgICAqICAgICAgICAgIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIFNQQU4gZWxlbWVudCB3aXRoIGFsbCAncmVzb3VyY2UgdHlwZScgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGlzIGVudGl0eVxuICAgICAgICAgICAgICogICAgICAgICAgcmVwcmVzZW50ZWQgYXMgc2V0IG9mIGltYWdlcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldFVuaXF1ZVJlc291cmNlVHlwZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxyZXNvdXJjZVR5cGVzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlX3R5cGUgPSByZXNvdXJjZVR5cGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnRpdGxlID0gcmVzb3VyY2VfdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zdGFudHMuUmVzb3VyY2VUeXBlU2V0c19FTElYSVIgPT0gdGhpcy5yZXNvdXJjZVR5cGVTZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZWxpeGlyX3Jlc291cmNlX3R5cGUnKTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmxhdCBncmF5IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ZsYXRfcmVzb3VyY2VfdHlwZScpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2dyYXknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdW5kIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVzb3VyY2VfdHlwZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NpcmNsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMubWFwcGluZ1Jlc291cmNlVHlwZUNsYXNzZXNbcmVzb3VyY2VfdHlwZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgZGl2IG9iamVjdCB3aXRoIGEgc2hvcnQgZGVzY3JpcHRpb24gdGhhdCBjYW4gYmUgZXhwYW5kZWQgdG8gc2hvdyBhIGxvbmdlciBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBzaG9ydFRleHQge1N0cmluZ30gLSBUZXh0IGxpbmsgdG8gaGlkZSBvciBleHBhbmQgdGhlIGxvbmcgdGV4dC5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBsb25nVGV4dCB7U3RyaW5nLCBIVE1MIEVMRU1FTlQgb3IgQXJyYXkgb2YgYm90aH0gLSBMb25nIGRlc2NyaXB0aW9uIG9yIEhUTUwgZmllbGQgd2l0aCBhIGxvbmcgZGVzY3JpcHRpb24gb2YgdGhlIHJlY29yZC5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBsb25nVGV4dENsYXNzZXMge0FycmF5fSAtIENsYXNzZXMgdG8gbW9kaWZ5IHRoZSBhc3BlY3Qgb2YgdGhlIGV4cGFuZGFibGUgdGV4dC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBESVYgZWxlbWVudCB3aXRoIGJvdGggc2hvcnQgYW5kIGZpZWxkIGRlc2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RXhwYW5kYWJsZVRleHQ6IGZ1bmN0aW9uKHNob3J0VGV4dCwgbG9uZ1RleHQsIGxvbmdUZXh0Q2xhc3Nlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZXhwYW5kYWJsZV9kaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21JbnROdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAwMDAwIC0gMCkpICsgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlcyB0aGUgbGluayB0byBoaWRlIGFuZCBzaG93IHRoZSBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGl2X3RpdGxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLFwiI1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdpZCcsXCJleHBhbmRhYmxlX2Rpdl90aXRsZV9cIityYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZXhwYW5kc2lnbmFsID0gXCJbK11cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2hpZGVzaWduYWwgPSBcIlstXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lckhUTUwgPSBzaG9ydFRleHQrXCIgXCIrdG9leHBhbmRzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSBtb3JlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZV9kaXZfdGl0bGVfJytyYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X2ludGVybmFsZGl2XycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwgPWV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwucmVwbGFjZSh0b2V4cGFuZHNpZ25hbCx0b2hpZGVzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIGhpZGUgdGhlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MID0gZXhwYW5kYWJsZVRpdGxlLmlubmVySFRNTC5yZXBsYWNlKHRvaGlkZXNpZ25hbCx0b2V4cGFuZHNpZ25hbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUudGl0bGUgPSBcIkNsaWNrIGhlcmUgdG8gc2VlIG1vcmUgaW5mb3JtYXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVzIHRoZSBpbnRlcm5hbCBkaXYgd2l0aCB0aGUgZnVsbCBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludGVybmFsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuc2V0QXR0cmlidXRlKCdpZCcsJ2V4cGFuZGFibGVfZGl2X2ludGVybmFsZGl2XycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb25nVGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmlubmVySFRNTCA9IGxvbmdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGxvbmdUZXh0Q2xhc3Nlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuYXBwZW5kQ2hpbGQobmV3U3BhbkVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcnJheSBvZiBIVE1MIG9iamVjdHMgb3Igc3RyaW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobG9uZ1RleHQpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8bG9uZ1RleHQubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxvbmdUZXh0W2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1NwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuaW5uZXJIVE1MID0gbG9uZ1RleHRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9uZ1RleHRDbGFzc2VzICE9IHVuZGVmaW5lZCAmJiBsb25nVGV4dENsYXNzZXMgIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaUM9MDtpQzxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2lDKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChsb25nVGV4dENsYXNzZXNbaUNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1NwYW5FbGVtZW50ID0gbG9uZ1RleHRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9uZ1RleHRDbGFzc2VzICE9IHVuZGVmaW5lZCAmJiBsb25nVGV4dENsYXNzZXMgIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaUM9MDtpQzxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2lDKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChsb25nVGV4dENsYXNzZXNbaUNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUTUwgb2JqZWN0ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGxvbmdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGludGVybmFsRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBkaXYgY29udGFpbmVyIHdpdGggYSBsaW5rIHRvIGFuIGFsZXJ0IHRvIHNob3cgYSBsb25nIGRlc2NyaXB0aW9uLlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIHNob3J0VGV4dCB7U3RyaW5nfSAtIFRleHQgbGluayB0byBzaG93IHRoZSBsb25nIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHQge1N0cmluZywgSFRNTCBFTEVNRU5UIG9yIEFycmF5IG9mIGJvdGh9IC0gTG9uZyBkZXNjcmlwdGlvbiBvciBIVE1MIGZpZWxkIHdpdGggYSBsb25nIGRlc2NyaXB0aW9uIG9mIHRoZSByZWNvcmQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBib3RoIHNob3J0IGFuZCBmaWVsZCBkZXNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExvbmdGbG9hdGluZ1RleHQ6IGZ1bmN0aW9uKHNob3J0VGV4dCwgbG9uZ1RleHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGFibGVfZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW50TnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMCAtIDApKSArIDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZXMgdGhlIGxpbmsgdG8gaGlkZSBhbmQgc2hvdyB0aGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2Rpdl90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVfXCIrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2V4cGFuZHNpZ25hbCA9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lckhUTUwgPSBzaG9ydFRleHQrXCIgXCIrdG9leHBhbmRzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSB0aGUgbG9uZyB0ZXh0IGludG8gYSBuZXcgbGl0dGxlIHdpbmRvd1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZVRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X3RpdGxlXycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQobG9uZ1RleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIEF1eGlsaWFyeSBmdW5jdGlvbiB0aGF0IHJldHVybnMgaWYgb25lIFVSTCBiZWxvbmcgdG8gdGhlIGN1cnJlbnQgdXNlcidzIHBhZ2UgZG9tYWluLlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIHVybCB7U3RyaW5nfSAtIGxpbmsgdG8gYW5hbHlzZS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtCb29sZWFufSAtIFRydWUgaWYgdGhlIFVSTCBiZWxvbmdzIHRvIHRoZSBtYWluIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaXNMb2NhbFVybDogZnVuY3Rpb24odXJsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnREb21haW4gIT0gbnVsbCAmJiB0aGlzLmN1cnJlbnREb21haW4ubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXJsICE9IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHVybC5pbmRleE9mKHRoaXMuY3VycmVudERvbWFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgXG59O1xuXG5cbi8vIFNUQVRJQyBBVFRSSUJVVEVTXG4vKlxudmFyIENPTlNUUyA9IHtcblx0TUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OOiAxMDAwXG59O1xuXG5mb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICBDb21tb25EYXRhW2tleV0gPSBDT05TVFNba2V5XTtcbn0qL1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tb25EYXRhOyIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG52YXIgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9EYXRhTWFuYWdlci5qc1wiKTtcbnZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcbnZhciByZXF3ZXN0ID0gcmVxdWlyZShcInJlcXdlc3RcIik7XG5cbi8qKiBcbiAqIENvbnRleHREYXRhTGlzdCBDb25zdHJ1Y3Rvci5cbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIENvbnRleHREYXRhTGlzdCBjb21wb25lbnQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbZGlzcGxheVN0eWxlPSBDb250ZXh0RGF0YUxpc3QuRlVMTF9TVFlMRSwgQ29udGV4dERhdGFMaXN0LkNPTU1PTl9TVFlMRV1cbiAqICAgIFR5cGUgb2Ygcm93cyB2aXN1YWxpc2F0aW9uLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRJZENvbnRhaW5lcj1Zb3VyIG93biB0YWcgaWQgXVxuICogICAgVGFnIGlkIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guXG4gKiAgICBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0SWRDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0VGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIG9yIHVzZXJUZXh0Q2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqICAgIFRhZyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzSWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VyS2V5d29yZHNUYWdDb250YWluZXI9T25lIHN0YWJsaXNoZWQgdGFnIG5hbWUsIGZvciBleGFtcGxlIGgxLiBdXG4gKiAgICBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBvciB1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7SFRNTCBvYmplY3R9IFt1c2VyS2V5d29yZHNDb250YWluZXI9VGhlIGh0bWwga2V5d29yZHMgY29udGFpbmVyIGl0c2VsZi4gXVxuICogICAgSFRNTCBvYmplY3QgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIsIHVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyIG9yIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgZGVzY3JpcHRpb24gdG8gaGVscCBmaWx0ZXIgc2FtZSByZXN1bHRzIHRoYXQgdXNlciBpcyBzZWVpbmcuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VySGVscENsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IHdpbGwgY29udGFpbnMgaGVscCBpY29uLlxuICogQG9wdGlvbiB7aW50fSBbbnVtYmVyUmVzdWx0cz1udW1iZXIgXVxuICogICAgSW50ZWdlciB0aGF0IHJlc3RyaWN0cyB0aGUgcmVzdWx0cyBudW1iZXIgdGhhdCBzaG91bGQgYmUgc2hvd24uXG4gKiBAb3B0aW9uIHtib29sZWFufSBbaW5jbHVkZVNhbWVTaXRlUmVzdWx0cz1JZiB5b3Ugd2FudCB0byBzZWUgcmVjb3JkcyBvZiB5b3VyIHByZXNlbnQgc2l0ZS4gVGVtcG9yYXJ5IGRpc2FibGVkLiBdXG4gKiAgICBCb29sZWFuIHRoYXQgYXZvaWRzIG9yIG5vdCByZXN1bHRzIGZyb20gdGhlIHNhbWUgc2l0ZSB5b3UgYXJlIHNlZWluZy4gKi9cbi8vZnVuY3Rpb24gQ29udGV4dERhdGFMaXN0IChvcHRpb25zKSB7XG52YXIgQ29udGV4dERhdGFMaXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG5cdHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0geyAgICAgICAgXG5cdCAgICAgZGlzcGxheVN0eWxlOiBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEUsXG5cdCAgICAgaW5jbHVkZVNhbWVTaXRlUmVzdWx0cyA6IHRydWVcblx0fTtcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdCAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuXHQgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcblx0fVxuXHR0aGlzLmNvbnRleHREYXRhU2VydmVyID0gXCJodHRwczovL3d3dy5iaW9jaWRlci5vcmc6ODk4My9zb2xyL2NvbnRleHREYXRhXCI7XG5cdFxuXHRcblx0Ly8gZ2xvYmFsIGN1cnJlbnQgc3RhdHVzXG5cdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cz0gbnVsbDtcblx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQ9IG51bGw7XG5cdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHM9IG51bGw7XG5cdHRoaXMuY3VycmVudFN0YXR1cz0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HO1xuXHR0aGlzLmN1cnJlbnRGaWx0ZXJzPSBudWxsO1xuXHR0aGlzLnRvdGFsRmlsdGVycz1udWxsO1xuXHR0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGU9IG51bGw7XG5cdHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlPSBudWxsO1xuXHRcblx0dGhpcy5jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdHRoaXMuY3VycmVudERvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcblx0XG5cdHRoaXMuX29uTG9hZGVkRnVuY3Rpb25zPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0YU1hbmFnZXIgPSBuZXcgRGF0YU1hbmFnZXIoeydjdXJyZW50RG9tYWluJzp0aGlzLmN1cnJlbnREb21haW4sJ3Jlc291cmNlVHlwZVNldCc6dGhpcy5yZXNvdXJjZVR5cGVTZXR9KTtcblx0XG5cdC8vdGhpcy5kcmF3SGVscEltYWdlKCk7XG5cdFxuICAgICAgXG59XG5cblxuXG4vKiogXG4gKiBSZXNvdXJjZSBjb250ZXh0dWFsaXNhdGlvbiB3aWRnZXQuXG4gKiBcbiAqIFxuICogQGNsYXNzIENvbnRleHREYXRhTGlzdFxuICpcbiAqL1xuQ29udGV4dERhdGFMaXN0LnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IENvbnRleHREYXRhTGlzdCxcblx0XG5cdC8qKlxuXHQgKiBTaG93cyB0aGUgY29udGV4dHVhbGlzZWQgZGF0YSBpbnRvIHRoZSB3aWRnZXQuXG5cdCAqL1xuXHRkcmF3Q29udGV4dERhdGFMaXN0IDogZnVuY3Rpb24gKCl7XG5cdFx0Ly9jb25zb2xlLmxvZygnQ29udGV4dERhdGFMaXN0LkxPQURJTkcsJytjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpO1xuXHRcdC8vY29uc29sZS5sb2coJ0NvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEUsJytjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRSk7XG5cdFx0dGhpcy5jdXJyZW50U3RhdHVzID0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HO1xuXHRcdC8vdGhpcy51cGRhdGVHbG9iYWxTdGF0dXModGhpcy5MT0FESU5HKTtcblx0XHR2YXIgdXNlclRleHQgPSB0aGlzLmdldFVzZXJTZWFyY2goKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcktleXdvcmRzID0gdGhpcy5nZXRVc2VyS2V5d29yZHMoKTtcblx0XHR2YXIgdXNlckRlc2NyaXB0aW9uID0gdGhpcy5nZXRVc2VyQ29udGVudERlc2NyaXB0aW9uKCk7XG5cdFx0dmFyIG1heFJvd3MgPSB0aGlzLmdldE1heFJvd3MoKTtcblx0XHR2YXIgbmV3VXJsID0gdGhpcy5fZ2V0TmV3VXJsKHVzZXJUZXh0LCB1c2VyS2V5d29yZHMsIHVzZXJEZXNjcmlwdGlvbiwgdGhpcy5jdXJyZW50RmlsdGVycywgdGhpcy5jdXJyZW50U3RhcnRSZXN1bHQsIG1heFJvd3MpO1xuXHRcdHRoaXMucHJvY2Vzc0RhdGFGcm9tVXJsKG5ld1VybCk7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogU2hvd3MgdGhlIGNvbnRleHR1YWxpc2VkIGRhdGEgaW50byB0aGUgd2lkZ2V0LCB1cGRhdGluZyB0aGUgd2hvbGUgaW50ZXJuYWwgc3RhdHVzIG9mIHRoZSB3aWRnZXQuXG5cdCAqL1xuXHR0b3RhbERyYXdDb250ZXh0RGF0YUxpc3QgOiBmdW5jdGlvbiAoKXtcblx0XHR0aGlzLnVwZGF0ZUdsb2JhbFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpO1xuXHRcdHRoaXMuZHJhd0NvbnRleHREYXRhTGlzdCgpO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFJldHVybnMgVXNlcidzIHRleHQgdG8gY29udGV4dHVhbGlzZSwgaWYgaXQgZXhpc3RzLlxuICAgICAgICAgKiB7U3RyaW5nfSAtIFRleHQgZm91bmQgaW50byB0aGUgY2xpZW50IGRvY3VtZW50IHRoYXQgY29udGFpbnMgQ29udGV4dHVhbGlzYXRpb24gd2lkZ2V0LlxuXHQgKi9cblx0Z2V0VXNlclNlYXJjaCA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB1c2VyVGV4dCA9ICcnO1xuXHRcdHZhciBlbGVtZW50c0NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlclRleHRJZENvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyVGV4dElkQ29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNDb250YWluZXIgPSBbXTtcblx0XHQgICAgZWxlbWVudHNDb250YWluZXJbMF0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnVzZXJUZXh0SWRDb250YWluZXIpO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJUZXh0Q2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlclRleHRDbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VyVGV4dENsYXNzQ29udGFpbmVyKTtcblx0XHR9ZWxzZXtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VyVGV4dFRhZ0NvbnRhaW5lcik7XG5cdFx0fVxuXHRcdFxuXHRcdGlmIChlbGVtZW50c0NvbnRhaW5lciAhPSBudWxsICYmIGVsZW1lbnRzQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBteUZpcnN0RWxlbWVudCA9IGVsZW1lbnRzQ29udGFpbmVyWzBdO1xuXHRcdFx0dXNlclRleHQgPSBteUZpcnN0RWxlbWVudC5pbm5lclRleHQ7XG5cdFx0XHRpZiAodXNlclRleHQgPT0gdW5kZWZpbmVkIHx8IHVzZXJUZXh0ID09IG51bGwpIHtcblx0XHRcdFx0dXNlclRleHQgPSBteUZpcnN0RWxlbWVudC5pbm5lckhUTUw7XG5cdFx0XHR9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlclRleHQgPT0gdW5kZWZpbmVkIHx8IHVzZXJUZXh0ID09IG51bGwpIHtcblx0XHRcdFx0dXNlclRleHQgPSBteUZpcnN0RWxlbWVudC52YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHVzZXJUZXh0O1xuXHR9LFxuXHRcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBSZXR1cm5zIFVzZXIncyBrZXl3b3JkcyBpbiBvcmRlciB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLCBpZiB0aGV5IGV4aXN0LlxuICAgICAgICAgKiB7QXJyYXl9IC0gTGlzdCBvZiBrZXl3b3JkcyBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQgdGhhdCBjYW4gaGVscCB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuXHQgKi9cblx0Z2V0VXNlcktleXdvcmRzIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVzZXJLZXl3b3JkcyA9IFtdO1xuXHRcdHZhciBlbGVtZW50c0NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0NvbnRhaW5lciA9IFtdO1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lclswXSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudXNlcktleXdvcmRzSWRDb250YWluZXIpO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHQgICAgZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIpO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJLZXl3b3Jkc1RhZ0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyS2V5d29yZHNUYWdDb250YWluZXIgIT0gbnVsbCl7XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VyS2V5d29yZHNUYWdDb250YWluZXIpO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJLZXl3b3Jkc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyS2V5d29yZHNDb250YWluZXIgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzQ29udGFpbmVyID0gW107XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyWzBdID0gdGhpcy51c2VyS2V5d29yZHNDb250YWluZXI7XG5cdFx0fVxuXHRcdFxuXHRcdGlmIChlbGVtZW50c0NvbnRhaW5lciAhPSBudWxsICYmIGVsZW1lbnRzQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBteUZpcnN0RWxlbWVudCA9IGVsZW1lbnRzQ29udGFpbmVyWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBteUZpcnN0RWxlbWVudC5pbm5lclRleHQgfHwgbXlGaXJzdEVsZW1lbnQudGV4dENvbnRlbnQ7XG5cdFx0XHR1c2VyS2V5d29yZHMgPSBjb250ZW50LnNwbGl0KFwiIFwiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHVzZXJLZXl3b3Jkcztcblx0fSxcbiAgICAgICAgXG4gICAgICAgIFxuXHQvKipcblx0ICogUmV0dXJucyBVc2VyJ3MgZGVzY3JpcHRpb24gdG8gaGVscCBmaWx0ZXIgc2FtZSByZXN1bHRzIHRoYW4gdXNlciBpcyBzZWVpbmcuXG4gICAgICAgICAqIHtTdHJpbmd9IC0gVGV4dCBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQuXG5cdCAqL1xuXHRnZXRVc2VyQ29udGVudERlc2NyaXB0aW9uIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlc2NyaXB0aW9uID0gJyc7XG5cdFx0dmFyIGVsZW1lbnRzQ29udGFpbmVyID0gbnVsbDtcblx0XHRpZiAodGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcik7XG5cdFx0fS8qZWxzZXtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VyRGVzY3JpcHRpb25UYWdDb250YWluZXIpO1xuXHRcdH0qL1xuXHRcdFxuXHRcdGlmIChlbGVtZW50c0NvbnRhaW5lciAhPSBudWxsICYmIGVsZW1lbnRzQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBteUZpcnN0RWxlbWVudCA9IGVsZW1lbnRzQ29udGFpbmVyWzBdO1xuXHRcdFx0ZGVzY3JpcHRpb24gPSBteUZpcnN0RWxlbWVudC5pbm5lclRleHQ7XG5cdFx0XHRpZiAoZGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkIHx8IGRlc2NyaXB0aW9uID09IG51bGwpIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBteUZpcnN0RWxlbWVudC5pbm5lckhUTUw7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdGhhdCBjYW4gYmUgc2hvd24gaW50byB0aGUgd2lkZ2V0LlxuICAgICAgICAgKiB7SW50ZWdlcn0gLSBNYXhpbXVtIGFtb3VudCBvZiByZXN1bHRzIHRoYXQgY2FuIGJlIHNob3duIGF0IHRoZSBzYW1lIHRpbWUuXG5cdCAqL1xuXHRnZXRNYXhSb3dzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgbWF4Um93cyA9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTUFYX1JPV1M7XG5cdFx0aWYgKHRoaXMubnVtYmVyUmVzdWx0cyAhPSBcInVuZGVmaW5lZFwiICYmICFpc05hTih0aGlzLm51bWJlclJlc3VsdHMpICYmIHR5cGVvZiB0aGlzLm51bWJlclJlc3VsdHMgPT09ICdudW1iZXInICYmICh0aGlzLm51bWJlclJlc3VsdHMgJSAxID09PSAwKSApIHtcblx0XHRcdGlmICh0aGlzLm51bWJlclJlc3VsdHMgPCBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X01BWF9ST1dTKSB7XG5cdFx0XHRcdG1heFJvd3MgPSB0aGlzLm51bWJlclJlc3VsdHM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXhSb3dzO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHVybCB0byB0aGUgU29sUiBkYXRhYmFzZSB3aXRoIGFsbCBkeW5hbWljIHBhcmFtZXRlcnMgZ2VuZXJhdGVkIGZyb20gdGhlc2UgYXJndW1lbnRzLlxuXHQgKiBAcGFyYW0gZmllbGRUZXh0IHtzdHJpbmd9IFRleHQgdG8gc2VhcmNoLlxuXHQgKiBAcGFyYW0ga2V5d29yZHMge3N0cmluZ30gQXNzb2NpYXRlZCBrZXl3b3JkcyB0byB0aGUgY29udGVudC5cblx0ICogQHBhcmFtIGRlc2NyaXB0aW9uVGV4dCB7c3RyaW5nfSBBc3NvY2lhdGVkIGRlc2NyaXB0aW9uIG9mIHRoZSBjb250ZW50LlxuXHQgKiBAcGFyYW0gZmlsdGVycyB7QXJyYXl9IEFycmF5IG9mIGZpbHRlcnMgLSBPbmx5IHJlc3VsdHMgd2l0aCBvbmUgb2YgdGhlc2UgcmVzb3VyY2UgdHlwZXMgd2lsbCBiZSBnZXQuXG5cdCAqIEBwYXJhbSBzdGFydCB7aW50ZWdlcn0gUG9zaXRpb24gb2YgdGhlIGZpcnN0IHJlc3VsdCB0byByZXRyaWV2ZS5cblx0ICogQHBhcmFtIHJvd3NOdW1iZXIge2ludGVnZXJ9IEluZGljYXRlcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0aGF0IHdpbGwgYmUgc2hvd24gb24gdGhlIHNjcmVlbjtcblx0ICovXG5cdF9nZXROZXdVcmwgOiBmdW5jdGlvbihmaWVsZFRleHQsIGtleXdvcmRzLCBkZXNjcmlwdGlvblRleHQsIGZpbHRlcnMsIHN0YXJ0LCByb3dzTnVtYmVyKXtcblx0XHQvL2NvbnNvbGUubG9nKCdfZ2V0TmV3VXJsLCBmaWVsZFRleHQ6ICcrZmllbGRUZXh0KycsIGRlc2NyaXB0aW9uVGV4dDogJytkZXNjcmlwdGlvblRleHQrJywgZmlsdGVyczogJytmaWx0ZXJzKycsIHN0YXJ0OiAnK3N0YXJ0KycsIHJvd3NOdW1iZXI6ICcrcm93c051bWJlcik7XG5cdFx0dmFyIGNvdW50ID0gMDtcblx0XHR2YXIgdXJsID0gXCJcIjtcblx0XHRcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRUZXh0V2l0aEtleXdvcmRzID0gZmllbGRUZXh0O1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUga2V5d29yZHMsIHdlIGNhbiBqb2luIHRoZW0gdG8gdGhlIHVzZXJUZXh0IGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgc2VhcmNocGhyYXNlLlxuICAgICAgICAgICAgICAgIGlmIChrZXl3b3JkcyE9bnVsbCAmJiBrZXl3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8a2V5d29yZHMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRUZXh0V2l0aEtleXdvcmRzID0gZmllbGRUZXh0V2l0aEtleXdvcmRzICtcIiBcIitrZXl3b3Jkc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcblx0XHR2YXIgd29yZHMgPSBmaWVsZFRleHRXaXRoS2V5d29yZHMuc3BsaXQoXCIgXCIpO1xuXHRcdHZhciBzZWFyY2hQaHJhc2UgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50V29yZCA9IFwiXCI7XG5cdFx0d2hpbGUgKGNvdW50IDwgd29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50V29yZCA9IHdvcmRzW2NvdW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICdhbmQnIHdvcmQgaXMgcHJvYmxlbWF0aWMgaW4gdGhlIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFdvcmQgIT0gJ2FuZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFBocmFzZSArPSBjdXJyZW50V29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb3VudCA8IHdvcmRzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hQaHJhc2UgKz0gJysnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXHRcdH1cblx0XHQvLyB3ZSBleGNsdWRlIGFsbCByZXN1bHRzIGZyb20gdGhpcyBkb21haW46IGRpc2FibGVkIHVudGlsIHJlaW5kZXhpbmdcblx0XHQvKmlmICghdGhpcy5pbmNsdWRlU2FtZVNpdGVSZXN1bHRzKSB7XG5cdFx0XHR2YXIgZXhjbHVkaW5nUGhyYXNlID0gXCJcIjtcblx0XHRcdC8vZXhjbHVkaW5nUGhyYXNlID0gXCIgTk9UKFwiK3RoaXMuY3VycmVudERvbWFpbitcIilcIjtcblx0XHRcdGV4Y2x1ZGluZ1BocmFzZSA9IFwiLVxcXCIqdGdhYy5hYy51aypcXFwiXCI7XG5cdFx0XHRzZWFyY2hQaHJhc2UgPSBcIihcIitzZWFyY2hQaHJhc2UrZXhjbHVkaW5nUGhyYXNlK1wiKVwiO1xuXHRcdC8vIHdlIGV4Y2x1ZGUgb25seSB0aGUgc2FtZSByZWNvcmQgdGhhbiB1c2VyIGlzXG5cdFx0fWVsc2V7Ki9cblx0XHQvKlx0XG5cdFx0aWYgKHRoaXMuY3VycmVudFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmN1cnJlbnRVUkwgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGV4Y2x1ZGluZ1BocmFzZSA9IFwiXCI7XG5cdFx0XHQvLyBUaGVyZSBhcmUgc29tZSBjaGFyYWN0ZXJzIHRoYXQgY2FuIGJyZWFrIHRoZSBmdWxsIFVSTDsgd2UgcmVtb3ZlIHRoZW0uXG5cdFx0XHR2YXIgY3VyYXRlZFVSTCA9IHRoaXMuY3VycmVudFVSTC5yZXBsYWNlKCcjJywnJyk7XG5cdFx0XHRleGNsdWRpbmdQaHJhc2UgPSBcIiBOT1QoXFxcIlwiK2N1cmF0ZWRVUkwrXCJcXFwiKVwiO1xuXHRcdFx0c2VhcmNoUGhyYXNlID0gXCIoXCIrc2VhcmNoUGhyYXNlK1wiKSBBTkQgXCIrZXhjbHVkaW5nUGhyYXNlO1xuXHRcdH0qL1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuXHRcdHNlYXJjaFBocmFzZSA9IFwiKFwiK3NlYXJjaFBocmFzZStcIilcIjtcdFxuXHRcdFxuXHRcdC8vfVx0XG5cdFx0XG5cdFx0dXJsID0gdGhpcy5jb250ZXh0RGF0YVNlcnZlcitcIi9zZWxlY3Q/ZGVmVHlwZT1lZGlzbWF4JnE9XCIrc2VhcmNoUGhyYXNlO1xuXHRcdFxuXHRcdHZhciBmcSA9IG51bGw7XG5cdFx0aWYgKGZpbHRlcnMgIT09IFwidW5kZWZpbmVkXCIgJiYgZmlsdGVycyE9bnVsbCApIHtcblx0XHRcdGlmIChmaWx0ZXJzIGluc3RhbmNlb2YgQXJyYXkgJiYgZmlsdGVycy5sZW5ndGg+MCkge1xuXHRcdFx0XHRmcSA9IFwiXCI7XG5cdFx0XHRcdHZhciBmaWx0ZXJDb3VudCA9IDA7XG5cdFx0XHRcdHZhciBmaWx0ZXJDaGFpbiA9IFwiXCI7XG5cdFx0XHRcdHdoaWxlIChmaWx0ZXJDb3VudCA8IGZpbHRlcnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZmlsdGVyQ2hhaW4gKz0gXCInXCIrZmlsdGVyc1tmaWx0ZXJDb3VudF0rXCInXCI7XG5cdFx0XHRcdFx0ZmlsdGVyQ291bnQrKztcblx0XHRcdFx0XHRpZihmaWx0ZXJDb3VudCA8IGZpbHRlcnMubGVuZ3RoKXtmaWx0ZXJDaGFpbiArPSAnIE9SICd9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnE9XCJyZXNvdXJjZV90eXBlOihcIitmaWx0ZXJDaGFpbitcIilcIjtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRmcSA9IFwicmVzb3VyY2VfdHlwZTp1bmRlZmluZWRcIjtcblx0XHRcdH1cblxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50VVJMICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuY3VycmVudFVSTCAhPSBudWxsKSB7XG5cdFx0XHRpZiAoZnE9PW51bGwpIHtcblx0XHRcdFx0ZnEgPSBcIio6KlwiO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVGhlcmUgYXJlIHNvbWUgY2hhcmFjdGVycyB0aGF0IGNhbiBicmVhayB0aGUgZnVsbCBVUkw7IHdlIHJlbW92ZSB0aGVtLlxuXHRcdFx0dmFyIGN1cmF0ZWRVUkwgPSB0aGlzLmN1cnJlbnRVUkwucmVwbGFjZSgnIycsJycpO1xuXHRcdFx0dmFyIGxpbmtGaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLkxJTktfRklFTEQ7XG5cdFx0XHRmcSA9IGZxK1wiIEFORCAtXCIrbGlua0ZpZWxkK1wiOlxcXCJcIitjdXJhdGVkVVJMK1wiXFxcIlwiO1x0XG5cdFx0fVxuXHQgICAgICAgIFxuXHRcdC8vIElmIHdlIGhhdmUgZGVzY3JpcHRpb24sIHdlIGNhbiB0cnkgdG8gZmlsdGVyIHVuZGVzaXJlZCByZXN1bHRzIChpLmUuLCByZXN1bHRzIHRoYXQgYXJlIHRoZSBzYW1lIHRoYW4gdXNlcidzIGN1cnJlbnQgcGFnZSlcblx0XHRpZiAoZGVzY3JpcHRpb25UZXh0ICE9IG51bGwpIHtcblx0XHRcdGlmIChmcT09bnVsbCkge1xuXHRcdFx0XHRmcSA9IFwiKjoqXCI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciBkZXNjVXNlZCA9IGRlc2NyaXB0aW9uVGV4dDtcblx0XHRcdGlmIChkZXNjVXNlZC5sZW5ndGg+Y29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OKSB7XG5cdFx0XHRcdGRlc2NVc2VkID0gZGVzY1VzZWQuc3BsaXQoXCIgXCIpLnNsaWNlKDAsY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OKS5qb2luKFwiIFwiKTtcblx0XHRcdH1cblx0XHRcdC8vIHdlIHJlbW92ZSB3ZWlyZCBjaGFyYWN0ZXJzIGFuZCBcIlxuXHRcdFx0ZGVzY1VzZWQgPSBkZXNjVXNlZC5yZXBsYWNlKC9cXFwiL2csJycpO1xuXHRcdFx0ZGVzY1VzZWQgPSBlbmNvZGVVUklDb21wb25lbnQoZGVzY1VzZWQpO1xuXHRcdFx0XG5cdFx0XHR2YXIgZGVzY3JpcHRpb25GaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLkRFU0NSSVBUSU9OX0ZJRUxEO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK2Rlc2NyaXB0aW9uRmllbGQrXCI6XFxcIlwiK2Rlc2NVc2VkK1wiXFxcIlwiO1xuXHRcdFx0XG5cdFx0XHR2YXIgdGl0bGVGaWVsZCA9IG5ldyBDb21tb25EYXRhKG51bGwpLlRJVExFX0ZJRUxEO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cmF0ZWRGaWVsZFRleHQgPSBmaWVsZFRleHQucmVwbGFjZSgnJicsJycpO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK3RpdGxlRmllbGQrXCI6XFxcIlwiK2N1cmF0ZWRGaWVsZFRleHQrXCJcXFwiXCI7XG5cdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKGZxIT1udWxsKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCIgJmZxPVwiK2ZxO1xuXHRcdH1cblx0XHRcblx0XHQvLyBxZlxuXHRcdHVybCA9IHVybCtcIiZxZj10aXRsZV4yLjArZmllbGReMi4wK2Rlc2NyaXB0aW9uXjEuMFwiO1xuXHRcdFxuXHRcdC8vIHN0YXJ0IHJvd1xuXHRcdGlmIChzdGFydCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzdGFydCE9bnVsbCAmJiAhaXNOYU4oc3RhcnQpICYmIHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicgJiYgKHN0YXJ0ICUgMSA9PT0gMCkgKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCImc3RhcnQ9XCIrc3RhcnQ7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IHN0YXJ0O1xuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSAwO1xuXHRcdH1cblx0XHRcblx0XHQvLyBudW0gcm93c1xuXHRcdGlmIChyb3dzTnVtYmVyICE9PSBcInVuZGVmaW5lZFwiICYmIHJvd3NOdW1iZXIhPW51bGwgJiYgcm93c051bWJlciE9bnVsbCAmJiAhaXNOYU4ocm93c051bWJlcikgJiYgdHlwZW9mIHJvd3NOdW1iZXIgPT09ICdudW1iZXInICYmIChyb3dzTnVtYmVyICUgMSA9PT0gMCkgKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCImcm93cz1cIityb3dzTnVtYmVyO1xuXHRcdH1cblx0XHRcdFxuXHRcdFx0XG5cdFx0Ly8gU3RhdHMuIFdlIGNvdW50IGFsbCB0aGUgZGlmZmVyZW50IHJlc3VsdHMgYnkgcmVzb3VyY2UgdHlwZVxuXHRcdHVybCA9IHVybCtcIiZmYWNldD10cnVlJmZhY2V0Lm1ldGhvZD1lbnVtJmZhY2V0LmxpbWl0PS0xJmZhY2V0LmZpZWxkPXJlc291cmNlX3R5cGVcIlxuXHRcdFxuXHRcdFx0XHRcblx0XHQvLyB3dFxuXHRcdHVybCA9IHVybCtcIiZ3dD1qc29uXCI7XG5cdFx0XG5cdFx0Ly8gbWF5YmUgd2UgY291bGQgYWxzbyBmaWx0ZXIgZmllbGRzIHRoYXQgd2UgcmV0dXJuXG5cdFx0Ly8gJmZsPXN0YXJ0LHRpdGxlLG5vdGVzLGxpbmtcblx0XHRcblx0XHRcblx0XHRyZXR1cm4gdXJsO1xuXHR9LFxuXHRcblx0XG5cdFxuXHQvKipcblx0ICogTWFrZXMgYW4gYXN5bmNocm9ub3VzIHJlcXVlc3QgdG8gdGhlIENvbnRleHR1YWxpc2F0aW9uIGRhdGEgc2VydmVyIGFuZCBwcm9jZXNzIGl0cyByZXBseS5cblx0ICogQHBhcmFtIHVybCB7c3RyaW5nfSAtIFVuaWZvcm0gUmVzb3VyY2UgTG9jYXRvclxuXHQgKi9cblx0cHJvY2Vzc0RhdGFGcm9tVXJsOiBmdW5jdGlvbih1cmwpe1xuXHRcdHZhciBteUNvbnRleHREYXRhTGlzdCA9IHRoaXM7XG5cdFx0cmVxd2VzdCh7XG5cdFx0XHR1cmw6IHVybCAsXG5cdFx0XHR0eXBlOiAnanNvbicgLFxuXHRcdFx0bWV0aG9kOiAncG9zdCcgLFxuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyAsXG5cdFx0XHRjcm9zc09yaWdpbjogdHJ1ZSxcblx0XHRcdHRpbWVvdXQ6IDEwMDAgKiA1LFxuXHRcdFx0d2l0aENyZWRlbnRpYWxzOiB0cnVlLCAgLy8gV2Ugd2lsbCBoYXZlIHRvIGluY2x1ZGUgbW9yZSBzZWN1cml0eSBpbiBvdXIgU29sciBzZXJ2ZXJcblx0XHRcdFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKGVycik7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LnVwZGF0ZUdsb2JhbFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKTtcblx0XHRcdH0gLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3ApIHtcblx0XHRcdFx0dmFyIGNvbnRleHR1YWxpc2VkRGF0YSA9IG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NDb250ZXh0dWFsaXNlZERhdGEocmVzcCk7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LmRyYXdDb250ZXh0dWFsaXNlZERhdGEoY29udGV4dHVhbGlzZWREYXRhKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgc29tZSBlcnJvcnMgYW5kIHByb2Nlc3MgZWFjaCByZXN1bHQgdG8gYmUgZ2V0IGluIGEgcHJvcGVyIHdheS5cblx0ICogQHBhcmFtIGRhdGEge09iamVjdH0gLSBUaGUgZnVsbCBkYXRhIGxpc3QgdG8gYmUgcHJvY2Vzc2VkIGFuZCBzaG93blxuXHQgKiB7QXJyYXl9IC0gQXJyYXkgd2l0aCBvYmplY3RzIGNvbnZlcnRlZCBmcm9tIHRoZWlyIG9yaWdpbmFsIEpTT04gc3RhdHVzXG5cdCAqL1xuXHRwcm9jZXNzQ29udGV4dHVhbGlzZWREYXRhIDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHZhciBteUNvbnRleHREYXRhTGlzdCA9IHRoaXM7XG5cdFx0dmFyIGNvbnRleHR1YWxpc2VkRGF0YSA9IFtdO1xuXHRcdGlmKGRhdGEucmVzcG9uc2UgIT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKGRhdGEucmVzcG9uc2UuZG9jcyAhPSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gZGF0YS5yZXNwb25zZS5udW1Gb3VuZDtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlID0gdGhpcy5nZXROdW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUoZGF0YSk7XG5cdFx0XHRcdGlmICh0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHRoaXMubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRkYXRhLnJlc3BvbnNlLmRvY3MuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdHZhciB0eXBlZERhdGEgPSBteUNvbnRleHREYXRhTGlzdC5kYXRhTWFuYWdlci5nZXREYXRhRW50aXR5KGVudHJ5KTtcblx0XHRcdFx0XHRjb250ZXh0dWFsaXNlZERhdGEucHVzaCh0eXBlZERhdGEpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzRXJyb3IoXCJkYXRhLnJlc3BvbnNlLmRvY3MgdW5kZWZpbmVkXCIpO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5jaGFuZ2VDdXJyZW50U3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzRXJyb3IoXCJkYXRhLnJlc3BvbnNlIHVuZGVmaW5lZFwiKTtcblx0XHRcdG15Q29udGV4dERhdGFMaXN0LmNoYW5nZUN1cnJlbnRTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUik7XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIGNvbnRleHR1YWxpc2VkRGF0YTtcblx0fSxcblx0Lypcblx0ZmlsdGVyU2FtZURhdGFSZXN1bHRzIDogZnVuY3Rpb24oZGF0YSwgbWFpblRleHQsIGNvbnRlbnREZXNjcmlwdGlvbil7XG5cdFx0dmFyIGZpbHRlcmVkX2RhdGEgPSBkYXRhO1xuXHRcdFxuXHRcdGRhdGEucmVzcG9uc2UuZG9jcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHR2YXIgdHlwZWREYXRhID0gbXlDb250ZXh0RGF0YUxpc3QuZGF0YU1hbmFnZXIuZ2V0RGF0YUVudGl0eShlbnRyeSk7XG5cdFx0XHRjb250ZXh0dWFsaXNlZERhdGEucHVzaCh0eXBlZERhdGEpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdENvbW1vbkRhdGEuVElUTEVfRklFTERcblx0XHRDb21tb25EYXRhLkRFU0NSSVBUSU9OX0ZJRUxEXG5cdFx0XG5cdFx0cmV0dXJuIGZpbHRlcmVkX2RhdGE7XG5cdH0sKi9cblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF0YSBvZiBlYWNoIHJlc291cmNlIHR5cGUuXG5cdCAqIEBwYXJhbSAgZGF0YSB7T2JqZWN0fSAtIFRoZSBmdWxsIGRhdGEgbGlzdCB0byBiZSBwcm9jZXNzZWRcblx0ICogZGF0YSB7T2JqZWN0fSAtIE9iamVjdCB3aXRoIG9uZSBwcm9wZXJ0eSBieSBlYWNoIHJlc291cmNlIHR5cGUgYW5kIHZhbHVlIG9mIGl0cyBvY3VycmVuY2VzLlxuXHQgKi9cblx0Z2V0TnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlIDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHZhciBmYWNldF9jb3VudHMgPSBkYXRhLmZhY2V0X2NvdW50cztcblx0XHR2YXIgcmVzb3VyY2VfdHlwZXNfY291bnQgPSBudWxsO1xuXHRcdGlmIChmYWNldF9jb3VudHMgIT0gdW5kZWZpbmVkIHx8IGZhY2V0X2NvdW50cyAhPSBudWxsICkge1xuXHRcdFx0dmFyIGZhY2V0X2ZpZWxkcyA9IGZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XG5cdFx0XHRpZiAoZmFjZXRfZmllbGRzICE9IHVuZGVmaW5lZCB8fCBmYWNldF9maWVsZHMgIT0gbnVsbCApIHtcblx0XHRcdFx0cmVzb3VyY2VfdHlwZXNfY291bnQgPSBmYWNldF9maWVsZHMucmVzb3VyY2VfdHlwZTtcdFxuXHRcdFx0fVx0XG5cdFx0fVxuXHRcdGlmIChyZXNvdXJjZV90eXBlc19jb3VudCA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0XG5cdFx0dmFyIG51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHt9O1xuXHRcdGlmICh0aGlzLnRvdGFsRmlsdGVycyAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY3VycmVudEZpbHRlciA9IG51bGw7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLnRvdGFsRmlsdGVycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdGN1cnJlbnRGaWx0ZXIgPSB0aGlzLnRvdGFsRmlsdGVyc1tpXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRfY291bnQgPSBudWxsO1xuXHRcdFx0XHRmb3IgKHZhciBqPTA7ajxyZXNvdXJjZV90eXBlc19jb3VudC5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdFx0Y3VycmVudF9jb3VudCA9IHJlc291cmNlX3R5cGVzX2NvdW50W2pdO1xuXHRcdFx0XHRcdGlmICggKHR5cGVvZiBjdXJyZW50X2NvdW50ID09PSAnc3RyaW5nJyB8fCBjdXJyZW50X2NvdW50IGluc3RhbmNlb2YgU3RyaW5nKVxuXHRcdFx0XHRcdCAgICAmJiBjdXJyZW50RmlsdGVyLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihjdXJyZW50X2NvdW50KSA+IC0xICkge1xuXHRcdFx0XHRcdFx0bnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlW2N1cnJlbnRGaWx0ZXJdID0gcmVzb3VyY2VfdHlwZXNfY291bnRbaisxXTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlO1xuXHR9LFxuXHRcbiAgICAgICAgIFxuXHQvKipcblx0ICogRHJhdyBhIGVudGlyZSBsaXN0IG9mIGNvbnRleHR1YWxpc2VkIHJlc291cmNlc1xuXHQgKiBAcGFyYW0gY29udGV4dHVhbGlzZWREYXRhIHtvYmplY3QgT2JqZWN0fSAtIEFsbCB0aGUgZGF0YSB0byBiZSBkcmF3biBpbnRvIHRoZSB3aWRnZXQuXG5cdCAqL1xuXHRkcmF3Q29udGV4dHVhbGlzZWREYXRhIDogZnVuY3Rpb24oY29udGV4dHVhbGlzZWREYXRhKXtcblx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRJZCk7XG5cdFx0aWYgKHRhcmdldCA9PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09IG51bGwpe1xuXHRcdFx0cmV0dXJuO1x0XG5cdFx0fVxuXHRcdHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGFyZ2V0LnJlbW92ZUNoaWxkKHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0XG5cdFx0dmFyIGluZGV4ID0gMDtcblx0XHR2YXIgZGF0YU9iamVjdDtcblx0XHR2YXIgZHJhd2FibGVPYmplY3Q7XG5cdFx0dmFyIG9kZFJvdyA9IHRydWU7XG5cdFx0d2hpbGUoaW5kZXggPCBjb250ZXh0dWFsaXNlZERhdGEubGVuZ3RoKXtcblx0XHRcdGlmIChpbmRleCUyPT0wKSB7XG5cdFx0XHRcdG9kZFJvdyA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG9kZFJvdyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRkYXRhT2JqZWN0ID0gY29udGV4dHVhbGlzZWREYXRhW2luZGV4XTtcblx0XHRcdGRyYXdhYmxlT2JqZWN0ID0gZGF0YU9iamVjdC5nZXREcmF3YWJsZU9iamVjdEJ5U3R5bGUodGhpcy5kaXNwbGF5U3R5bGUpO1xuXHRcdFx0ZHJhd2FibGVPYmplY3QuY2xhc3NMaXN0LmFkZCgndmlld3Mtcm93Jyk7XG5cdFx0XHRpZihvZGRSb3cgPT0gdHJ1ZSl7XG5cdFx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoXCJ2aWV3cy1yb3ctb2RkXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoXCJ2aWV3cy1yb3ctZXZlblwiKTtcblx0XHRcdH1cblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChkcmF3YWJsZU9iamVjdCk7XG5cdFx0XHRpbmRleCsrO1xuXHRcdH1cblx0XHRpZiAoY29udGV4dHVhbGlzZWREYXRhLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5nZXRFbXB0eVJlY29yZCgpKTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IGNvbnRleHR1YWxpc2VkRGF0YS5sZW5ndGg7XG5cdFx0dGhpcy51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQpO1xuXHRcdC8qXG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnRUb3RhbFJlc3VsdHMnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50U3RhcnRSZXN1bHQnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCk7XG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyk7XG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnRGaWx0ZXJzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50RmlsdGVycyk7XG5cdFx0Ki9cblx0XHRcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBcdFJldHVybnMgb25lIHJvdyBleHBsYWluaW5nIHRoZSBhYnNlbmNlIG9mIHJlYWwgcmVzdWx0cy5cblx0ICogXHR7SFRNTCBPYmplY3R9IC0gRW1wdHkgcmVzdWx0LlxuXHQgKi9cblx0Z2V0RW1wdHlSZWNvcmQgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcblx0XHR2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG5cdFx0XG5cdFx0dmFyIHNwYW5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdHZhciB0ZXh0ID0gJ05vIHJlc3VsdHMgZm91bmQnO1xuXHRcdHNwYW5UZXh0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0dHJDb250YWluZXIuYXBwZW5kQ2hpbGQoc3BhblRleHQpO1xuXHRcdG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuXHRcdHJldHVybiBtYWluQ29udGFpbmVyO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFVwZGF0ZXMsIGRlcGVuZGluZyBvbiB0aGUgbmV3IHN0YXR1cywgaW50ZXJuYWwgdmFyaWFibGVzIG9mIHRoZSBjb21wb25lbnQgYW5kLCBpZlxuXHQgKiBuZXcgc3RhdHVzIGlzICdMT0FERUQnLCBleGVjdXRlcyB0aGUgJ29uTG9hZGVkJyBmdW5jdGlvbnMgcmVnaXN0ZXJlZC4gXG5cdCAqIEBwYXJhbSBuZXdTdGF0dXMge3N0cmluZ30gLSBDb250ZXh0RGF0YUxpc3QuTE9BRElORyBvciBDb250ZXh0RGF0YUxpc3QuRVJST1Igb3IgQ29udGV4dERhdGFMaXN0LkxPQURFRCBcblx0ICovXG5cdHVwZGF0ZUdsb2JhbFN0YXR1cyA6IGZ1bmN0aW9uKG5ld1N0YXR1cyl7XG5cdFx0Ly8gbmV3IHN0YXR1cyBtdXN0IGJlIG9uZSBvZiB0aGUgcG9zaWJsZSBzdGF0dXNcblx0XHRpZiAobmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyAmJlxuXHRcdCAgICBuZXdTdGF0dXMgIT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUiAmJlxuXHRcdCAgICBuZXdTdGF0dXMgIT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQgKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5jdXJyZW50U3RhdHVzID0gbmV3U3RhdHVzO1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHR9ZWxzZSBpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1Ipe1xuXHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0Ly8gaWYgbmV3IHN0YXR1cyBpcyBMT0FERUQsIGhlcmUgd2UgY2Fubm90IGtub3cgYW55dGhpbmcgYWJvdXQgYWxsIHRoZXNlIGludGVybmFsIHZhcmlhYmxlcy5cblx0XHR9LyplbHNlIGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gdGhpcy5MT0FERUQpe1xuXHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBudWxsO1xuXHRcdH0qL1xuXHRcdFxuXHRcdC8vIEZpbmFsbHkgd2UgZXhlY3V0ZSByZWdpc3RlcmVkICdvbkxvYWRlZCcgZnVuY3Rpb25zXG5cdFx0aWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURFRCB8fFxuXHRcdCAgICB0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUiApe1xuXHRcdFx0dGhpcy5leGVjdXRlT25Mb2FkZWRGdW5jdGlvbnMoKTtcblx0XHR9XG5cdH0sXG5cdFxuXHQvKipcblx0KiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG5cdCogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIEFOQ0hPUiBlbGVtZW50IHdpdGggJ3RpdGxlJyBpbmZvcm1hdGlvbiBsaW5raW5nIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG5cdCovXG5cdC8qZHJhd0hlbHBJbWFnZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgaGVscENvbnRhaW5lciA9IG51bGw7XG5cdFx0aWYgKHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VySGVscENsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdHZhciBoZWxwQ29udGFpbmVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VySGVscENsYXNzQ29udGFpbmVyKTtcblx0XHRcdGlmIChoZWxwQ29udGFpbmVycyAhPSBudWxsICYmIGhlbHBDb250YWluZXJzLmxlbmd0aD4wKSBoZWxwQ29udGFpbmVyID0gaGVscENvbnRhaW5lcnNbMF07XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlckhlbHBUYWdDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckhlbHBUYWdDb250YWluZXIgIT0gbnVsbCl7XG5cdFx0XHR2YXIgaGVscENvbnRhaW5lcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyKTtcblx0XHRcdGlmIChoZWxwQ29udGFpbmVycyAhPSBudWxsICYmIGhlbHBDb250YWluZXJzLmxlbmd0aD4wKSBoZWxwQ29udGFpbmVyID0gaGVscENvbnRhaW5lcnNbMF07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKGhlbHBDb250YWluZXIpO1xuXHRcdGlmIChoZWxwQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdHZhciBoZWxwSW1hZ2UgPSB0aGlzLmdldEhlbHBJbWFnZSgpO1xuXHRcdFx0aWYgKGhlbHBJbWFnZSAhPSBudWxsKSB7XG5cdFx0XHRcdGhlbHBDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRvb2x0aXBcIik7XG5cdFx0XHRcdGhlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5nZXRIZWxwSW1hZ2UoKSk7XG5cdFx0XHRcdC8vaGVscENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmdldEhlbHBUZXh0KCkpO1xuXHRcdFx0XHQvL2hlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQoaGVscEltYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sKi9cblx0XG5cdC8qKlxuXHQqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RpdGxlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cblx0KiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gQU5DSE9SIGVsZW1lbnQgd2l0aCAndGl0bGUnIGluZm9ybWF0aW9uIGxpbmtpbmcgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZS5cblx0Ki9cbiAgICAgICAgLypnZXRIZWxwSW1hZ2U6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblx0XHRpbWdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2hlbHBfaW1nXCIpO1xuXG5cdFx0cmV0dXJuIGltZ0VsZW1lbnQ7XG4gICAgICAgIH0sKi9cblx0XG5cdFxuXHRcblx0LyoqXG5cdCAqIFJlZ2lzdGVyIG5ldyBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgd2hlbiBzdGF0dXMgY29tcG9uZW50IGlzIHVwZGF0ZWQgdG8gJ0xPQURFRCdcblx0ICogbXlDb250ZXh0IHtPYmplY3R9IG15Q29udGV4dCAtIENvbnRleHQgaW4gd2hpY2ggbXlGdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZS4gVXN1YWxseSBpdHMgb3duIG9iamVjdCBjb250YWluZXIuXG5cdCAqIG15Q29udGV4dCB7T2JqZWN0fSBteUZ1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG5cdCAqL1xuXHRyZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24gOiBmdW5jdGlvbihteUNvbnRleHQsIG15RnVuY3Rpb24pe1xuXHRcdHZhciBvbkxvYWRlZE9iamVjdCA9IHtcblx0XHRcdCdteUNvbnRleHQnXHQ6IG15Q29udGV4dCxcblx0XHRcdCdteUZ1bmN0aW9uJ1x0OiBteUZ1bmN0aW9uXG5cdFx0fTtcblx0XHR0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucy5wdXNoKG9uTG9hZGVkT2JqZWN0KTtcblx0fSxcblx0XG5cdFxuXHQvKipcblx0ICogRXhlY3V0ZSBhbGwgcmVnaXN0ZXJlZCAnb25Mb2FkZWQnIGZ1bmN0aW9uc1xuXHQgKi9cblx0ZXhlY3V0ZU9uTG9hZGVkRnVuY3Rpb25zIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgb25Mb2FkZWRGdW5jdGlvbk9iamVjdCA9IG51bGw7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0ID0gbnVsbDtcblx0XHR2YXIgb25Mb2FkZWRGdW5jdGlvbiA9IG51bGw7XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucy5sZW5ndGg7aSsrKXtcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb25PYmplY3QgPSB0aGlzLl9vbkxvYWRlZEZ1bmN0aW9uc1tpXTtcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0ID0gb25Mb2FkZWRGdW5jdGlvbk9iamVjdC5teUNvbnRleHQ7XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uID0gb25Mb2FkZWRGdW5jdGlvbk9iamVjdC5teUZ1bmN0aW9uO1xuXHRcdFx0Ly8gd2UgZXhlY3V0ZSB0aGUgb25Mb2FkZWRGdW5jdGlvbiB3aXRoIGl0cyBvd24gY29udGV4dFxuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbi5jYWxsKG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0KTtcblx0XHR9XG5cdH0sXG5cdFx0XG4gICAgICBcblx0LyoqXG5cdCAqIFByaW50cyBhcyBhbiBlcnJvciB0byB0aGUgY29uc29sZSB0aGUgbWVzc2FnZSByZWNlaXZlZC4gXG5cdCAqIGVycm9yIHtzdHJpbmd9IGVycm9yIC0gU3RyaW5nIHRvIGJlIHByaW50ZWRcblx0ICovXG5cdHByb2Nlc3NFcnJvciA6IGZ1bmN0aW9uKGVycm9yKSB7XG5cdCAgICBjb25zb2xlLmxvZyhcIkVSUk9SOlwiICsgZXJyb3IpO1xuXHR9XG5cbn1cblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdC8vTGlzdCBvZiBwb3NzaWJsZSBjb250ZXh0IGRhdGEgc291cmNlcyBcblx0U09VUkNFX0VMSVhJUl9SRUdJU1RSWTpcIkVTUlwiLFxuXHRTT1VSQ0VfRUxJWElSX1RFU1M6XCJUU1NcIixcblx0U09VUkNFX0VMSVhJUl9FVkVOVFM6XCJFRVZcIixcblx0Ly9zdHlsZSBvZiB2aXN1YWxpemF0aW9uXG5cdEZVTExfU1RZTEU6XCJGVUxMX1NUWUxFXCIsXG5cdENPTU1PTl9TVFlMRTpcIkNPTU1PTl9TVFlMRVwiLFxuXHQvL21heCBudW1iZXIgb2Ygcm93cyB0byByZXRyaWV2ZSBmcm9tIHRoZSBzZXJ2ZXIsIHdoYXRldmVyICdudW1iZXJSZXN1bHRzJyBjYW4gYmVcblx0TUFYX1JPV1M6MTAwLFxuXHQvL21heGltdW0gbGVuZ3RoIHRvIGJlIHVzZWQgZnJvbSB0aGUgZGVzY3JpcHRpb24gdG8gZmlsdGVyIHNhbWUgcmVzdWx0c1xuXHROVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OOjUwLFxuXHQvL0V2ZW50cyBcblx0RVZUX09OX1JFU1VMVFNfTE9BREVEOiBcIm9uUmVzdWx0c0xvYWRlZFwiLFxuXHRFVlRfT05fUkVRVUVTVF9FUlJPUjogXCJvblJlcXVlc3RFcnJvclwiLFxuXHQvL0RpZmZlcmVudCB3aWRnZXQgc3RhdHVzXG5cdExPQURJTkc6IFwiTE9BRElOR1wiLFxuXHRMT0FERUQ6IFwiTE9BREVEXCIsXG5cdEVSUk9SOiBcIkVSUk9SXCJcbn07XG5cbmZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgIENvbnRleHREYXRhTGlzdFtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHREYXRhTGlzdDtcbiIsIlxudmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xudmFyIEVsaXhpclRyYWluaW5nRGF0YSA9IHJlcXVpcmUoXCIuL0VsaXhpclRyYWluaW5nRGF0YS5qc1wiKTtcbnZhciBFbGl4aXJFdmVudERhdGEgPSByZXF1aXJlKFwiLi9FbGl4aXJFdmVudERhdGEuanNcIik7XG52YXIgRWxpeGlyUmVnaXN0cnlEYXRhID0gcmVxdWlyZShcIi4vRWxpeGlyUmVnaXN0cnlEYXRhLmpzXCIpO1xuXG4vKiogXG4gKiBEYXRhIG1hbmFnbWVudCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIERhdGFNYW5hZ2VyIGNvbXBvbmVudC5cbiAqICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0nWW91ck93bkRvbWFpbiddLlxuICogICAgICBVUkwgdGhhdCBpZGVudGlmaWVzIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqL1xudmFyIERhdGFNYW5hZ2VyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuIFxuICAgIHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0ge1xuICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgfTtcbiAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuICAgIH1cbiAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgICBcbn1cblxuLyoqIFxuICogRGF0YSBtYW5hZ21lbnQgZnVuY3Rpb25hbGl0eS5cbiAqIEJ1aWxkcyBvbmUga2luZCBvZiBDb21tb25EYXRhIGRlcGVuZGluZyBvbiBpdHMgJ3NvdXJjZScgdmFsdWUuXG4gKiBcbiAqIEBjbGFzcyBEYXRhTWFuYWdlclxuICpcbiAqL1xuRGF0YU1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBEYXRhTWFuYWdlcixcbiAgICBzb3VyY2VGaWVsZDogJ3NvdXJjZScsXG4gICAgXG4gICAgLyoqXG4gICAgKiAgIFJldHVybnMgc291cmNlIGZpZWxkIHZhbHVlIG9mIHRoZSBKU09OIHN0cnVjdHVyZSBwYXNzZWQgYXMgYXJndW1lbnQuXG4gICAgKiAgIEBwYXJhbSBqc29uRW50cnkge09iamVjdH0gLSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggb25lIGVudGl0eSdzIGRhdGEuXG4gICAgKiAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgc291cmNlIHZhbHVlIG9mIHRoZSBKU09OIHN0cnVjdHVyZS5cbiAgICAqL1xuICAgIGdldFNvdXJjZUZpZWxkIDogZnVuY3Rpb24oanNvbkVudHJ5KXtcbiAgICAgICAgaWYgKGpzb25FbnRyeSAhPT0gbnVsbCAmJiBqc29uRW50cnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGpzb25FbnRyeVt0aGlzLnNvdXJjZUZpZWxkXTtcbiAgICAgICAgfWVsc2UgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAgICAgXG4gICAgLyoqXG4gICAgKiAgIFJldHVybnMgb25lIENvbW1vbkRhdGEgb2JqZWN0IHJlcHJlc2VudGluZyBvbmUgZGF0YSByZWdpc3RyeS5cbiAgICAqICAgQHBhcmFtIGpzb25FbnRyeSB7T2JqZWN0fSAtIEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCBvbmUgZW50aXR5J3MgZGF0YS5cbiAgICAqICAge0NvbW1vbkRhdGEgT2JqZWN0fSAtIENvbW1vbkRhdGEgY2hpbGQgdGhhdCByZXByZXNlbnRzIG9iamV0aWZpZWQganNvbiBkYXRhLlxuICAgICovXG4gICAgZ2V0RGF0YUVudGl0eSA6IGZ1bmN0aW9uIChqc29uRW50cnkpe1xuICAgICAgICB2YXIgc291cmNlRmllbGRWYWx1ZSA9IHRoaXMuZ2V0U291cmNlRmllbGQoanNvbkVudHJ5KTtcbiAgICAgICAgdmFyIGNvbW1vbkRhdGEgPSBudWxsO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICBvcHRpb25zWydjdXJyZW50RG9tYWluJ10gPSB0aGlzLmN1cnJlbnREb21haW47XG4gICAgICAgIG9wdGlvbnNbJ3Jlc291cmNlVHlwZVNldCddID0gdGhpcy5yZXNvdXJjZVR5cGVTZXQ7XG4gICAgICAgIHN3aXRjaChzb3VyY2VGaWVsZFZhbHVlKXtcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpclJlZ2lzdHJ5RGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJSZWdpc3RyeURhdGEoanNvbkVudHJ5LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpclRyYWluaW5nRGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJUcmFpbmluZ0RhdGEoanNvbkVudHJ5LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpckV2ZW50RGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJFdmVudERhdGEoanNvbkVudHJ5LCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBzb3VyY2UgZmllbGQgdmFsdWU6IFwiICsgc291cmNlRmllbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbW1vbkRhdGE7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YU1hbmFnZXI7IiwidmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqIEVsaXhpckV2ZW50RGF0YSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKi9cbnZhciBFbGl4aXJFdmVudERhdGEgPSBmdW5jdGlvbihqc29uRGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBDT05TVFMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDQVRFR09SWSAgICAgICAgICAgICAgICAgICAgOiBcImNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBDSVRZICAgICAgICAgICAgICAgICAgICAgICAgOiBcImNpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIENPVU5UUlkgICAgICAgICAgICAgICAgICAgICA6IFwiY291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgU1RBUlRfREFURSAgICAgICAgICAgICAgICAgIDogXCJzdGFydFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgRU5EX0RBVEUgICAgICAgICAgICAgICAgICAgIDogXCJlbmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFZFTlVFICAgICAgICAgICAgICAgICAgICAgICA6IFwidmVudWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFBST1ZJREVSICAgICAgICAgICAgICAgICAgICA6IFwicHJvdmlkZXJcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gQ09OU1RTW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuanNvbkRhdGEgPSBqc29uRGF0YTtcbiAgICAgICAgICAgIHRoaXMuU09VUkNFX0ZJRUxEX1ZBTFVFID0gXCJpYW5uXCI7XG4gICBcbn07XG5cblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJFdmVudERhdGEgY2hpbGQgY2xhc3Mgd2l0aCBzcGVjaWZpYyBpbmZvcm1hdGlvbiBvZiB0aGlzIGtpbmQgb2YgcmVnaXN0cmllcy5cbiAqLyAgICAgICAgIFxuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbW9uRGF0YS5wcm90b3R5cGUpO1xuRWxpeGlyRXZlbnREYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJFdmVudERhdGE7XG4gICAgICAgXG4gICAgICAgICAgICBcbi8qKlxuICogICAgICAgICAgUmV0dXJucyBhbGwgY2F0ZWdvcmllcyBwcmVzZW50IGluIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge0FycmF5fSAtIEFycmF5IG9mIHN0cmluZ3Mgd2l0aCBjYXRlZ29yaWVzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDYXRlZ29yeVZhbHVlcz0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkNBVEVHT1JZKTsgICAgICBcbn0sXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBjaXR5IGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBjaXR5IHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldENpdHlWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5DSVRZKTsgICAgICBcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBjb3VudHJ5IGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBjb3VudHJ5IHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldENvdW50cnlWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5DT1VOVFJZKTsgICAgICBcbn07XG5cblxuLyoqXG4gKiAgICAgICAgICBBdXhpbGlhciBmdW5jdGlvbiB0aGF0IHJldHVybnMgb25lIGRhdGUgYWRhcHRlZCB0byB1c2VyJ3MgbG9jYWxlLlxuICogICAgICAgICAgQHBhcmFtIHNvdXJjZURhdGUge1N0cmluZ30gLSBTdHJpbmcgZGF0ZSBpbiBVVEYgZm9ybWF0IHRvIGJlIGNvbnZlcnRlZCBpbnRvIGEgbG9jYWxlIGZvcm1hdC5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgY3VyYXRlZCBkYXRlLlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldEN1cmF0ZWREYXRlID0gZnVuY3Rpb24oc291cmNlRGF0ZSl7XG4gICAgICAgICAgICB2YXIgZGF0ZVZhbHVlID0gbmV3IERhdGUoc291cmNlRGF0ZSk7XG4gICAgICAgICAgICBpZiAoIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlVmFsdWUpID09PSBcIltvYmplY3QgRGF0ZV1cIiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGlzIGEgZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpc05hTiggZGF0ZVZhbHVlLmdldFRpbWUoKSApICkgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGUgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlRGF0ZTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRlIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZVZhbHVlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub3QgYSBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIHN0YXJ0aW5nIGRhdGUgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHN0YXJ0aW5nIGRhdGUgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0U3RhcnREYXRlVmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHZhbHVlPSB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlNUQVJUX0RBVEUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VyYXRlZERhdGUodmFsdWUpO1xufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGVuZGluZyBkYXRlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBlbmRpbmcgZGF0ZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRFbmREYXRlVmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5FTkRfREFURSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJhdGVkRGF0ZSh2YWx1ZSk7XG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgdmVudWUgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHZlbnVlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldFZlbnVlVmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuVkVOVUUpOyAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgcHJvdmlkZXIgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHByb3ZpZGVyIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldFByb3ZpZGVyVmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuUFJPVklERVIpOyAgXG59O1xuXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgaW1wcm92ZWQgd2F5IG9mIHJlcHJlc2VudGluZyBFbGl4aXJFdmVudERhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldEZ1bGxEcmF3YWJsZU9iamVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL0NvbW1vbkRhdGEucHJvdG90eXBlLmdldEZ1bGxEcmF3YWJsZU9iamVjdC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGdldEV4cGFuZGFibGVEZXRhaWxzID0gdGhpcy5nZXRFeHBhbmRhYmxlRGV0YWlscygpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGdldEV4cGFuZGFibGVEZXRhaWxzKTtcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc291cmNlVHlwZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gbWFpbkNvbnRhaW5lcjtcbn07XG5cblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBleHBhbmRhYmxlIG9iamVjdCB3aXRoIG1hbnkgZGV0YWlscyByZWxhdGVkIHdpdGggdGhpcyBFbGl4aXJFdmVudERhdGEgcmVjb3JkLlxuICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIERyYXdhYmxlIG9iamVjdCB3aXRoIGRldGFpbHMgcmVsYXRlZCB3aXRoIHRoaXMgcmVjb3JkLlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldEV4cGFuZGFibGVEZXRhaWxzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBkZXRhaWxzQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5Qcm92aWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgc3BhblByb3ZpZGVyLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgIHNwYW5Qcm92aWRlci5jbGFzc0xpc3QuYWRkKFwicHJvdmlkZXJcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuUHJvdmlkZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXJWYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocHJvdmlkZXIgIT09IHVuZGVmaW5lZCApIHsgICAgXG4gICAgICAgICAgICAgICAgICAgIHNwYW5Qcm92aWRlclRleHQgPSBcIlByb3ZpZGVyOiBcIitwcm92aWRlcjtcbiAgICAgICAgICAgICAgICAgICAgc3BhblByb3ZpZGVyLmlubmVySFRNTCA9IHNwYW5Qcm92aWRlclRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNBcnJheS5wdXNoKHNwYW5Qcm92aWRlcik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcGFuVmVudWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5WZW51ZS5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuVmVudWUuY2xhc3NMaXN0LmFkZChcInZlbnVlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BhblZlbnVlVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmVudWUgPSB0aGlzLmdldFZlbnVlVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlbnVlICE9PSB1bmRlZmluZWQgKSB7ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuVmVudWVUZXh0ID0gdmVudWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHNBcnJheS5wdXNoKHNwYW5WZW51ZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhbkxvY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBzcGFuTG9jYXRpb24uY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgc3BhbkxvY2F0aW9uLmNsYXNzTGlzdC5hZGQoXCJsb2NhdGlvblwiKTtcbiAgICAgICAgICAgIHZhciBzcGFuTG9jYXRpb25UZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBjb3VudHJ5ID0gdGhpcy5nZXRDb3VudHJ5VmFsdWUoKTtcbiAgICAgICAgICAgIHZhciBjaXR5ID0gdGhpcy5nZXRDaXR5VmFsdWUoKTtcbiAgICAgICAgICAgIGlmIChjb3VudHJ5ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvblRleHQgPSBzcGFuTG9jYXRpb25UZXh0ICsgY291bnRyeTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNpdHkgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNwYW5Mb2NhdGlvblRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uVGV4dCA9IHNwYW5Mb2NhdGlvblRleHQgK1wiLCBcIisgY2l0eTsgIFxuICAgICAgICAgICAgICAgICAgICB9ZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uVGV4dCA9IHNwYW5Mb2NhdGlvblRleHQgKyBjaXR5OyAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhbkxvY2F0aW9uVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb24uaW5uZXJIVE1MID0gc3BhbkxvY2F0aW9uVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHNBcnJheS5wdXNoKHNwYW5Mb2NhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuRGF0ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHNwYW5EYXRlcy5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICBzcGFuRGF0ZXMuY2xhc3NMaXN0LmFkZChcImRhdGVzXCIpO1xuICAgICAgICAgICAgdmFyIHNwYW5EYXRlc1RleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IHRoaXMuZ2V0U3RhcnREYXRlVmFsdWUoKTtcbiAgICAgICAgICAgIHZhciBlbmREYXRlID0gdGhpcy5nZXRFbmREYXRlVmFsdWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHN0YXJ0RGF0ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZERhdGUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBcIkZyb20gXCIrc3RhcnREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gc3RhcnREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVuZERhdGUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFuRGF0ZXNUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBzcGFuRGF0ZXNUZXh0ICsgXCIgdG8gXCIrZW5kRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IGVuZERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhbkRhdGVzVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXMuaW5uZXJIVE1MID0gc3BhbkRhdGVzVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHNBcnJheS5wdXNoKHNwYW5EYXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtYXliZSB3ZSBjYW4gYWRkIGxhdGVyICdjYXRlZ29yeScgb3IgJ2tleXdvcmRzJ1xuICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXRhaWxzID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGV0YWlsc0FycmF5KTtcbiAgICAgICAgICAgIHJldHVybiBleHBhbmRhYmxlRGV0YWlscztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsaXhpckV2ZW50RGF0YTtcbiAgICAgICIsInZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJSZWdpc3RyeURhdGEgY29uc3RydWN0b3JcbiAqICAgICAgICAgIEBwYXJhbSBqc29uRGF0YSB7T2JqZWN0fSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggdGhlIG9yaWdpbmFsIGRhdGEgcmV0cmlldmVkIGJ5IG91ciBkYXRhIHNlcnZlci5cbiAqICAgICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciB0aGlzIHN0cnVjdHVyZS5cbiAqICAgICAgICAgICAgICAgICAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J3VybCddXG4gKiAgICAgICAgICAgICAgICAgICAgICBVUkwgd2l0aCB0aGUgdXNlcidzIHBhZ2UgZG9tYWluLlxuICpcbiAqL1xudmFyIEVsaXhpclJlZ2lzdHJ5RGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudERvbWFpbjogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuanNvbkRhdGEgPSBqc29uRGF0YTtcbiAgICAgICAgICAgIHRoaXMuU09VUkNFX0ZJRUxEX1ZBTFVFID0gXCJlbGl4aXJfcmVnaXN0cnlcIiA7ICAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclJlZ2lzdHJ5RGF0YSBjaGlsZCBjbGFzcyB3aXRoIHNwZWNpZmljIGluZm9ybWF0aW9uIG9mIHRoaXMga2luZCBvZiByZWNvcmRzLlxuICovXG5FbGl4aXJSZWdpc3RyeURhdGEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tb25EYXRhLnByb3RvdHlwZSk7XG5FbGl4aXJSZWdpc3RyeURhdGEuY29uc3RydWN0b3I9IEVsaXhpclJlZ2lzdHJ5RGF0YTtcblxuICAgICAgICAgICAgXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgbW9yZSBkZXRhaWxlZCB3YXkgb2YgcmVwcmVzZW50aW5nIGEgRWxpeGlyUmVnaXN0cnlEYXRhIHJlY29yZCB0cmFuc2Zvcm1lZFxuICogICAgICAgICAgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICovXG5FbGl4aXJSZWdpc3RyeURhdGEucHJvdG90eXBlLmdldEZ1bGxEcmF3YWJsZU9iamVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmdldERlc2NyaXB0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcbiAgICAgICAgICAgIHZhciBsZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9sZWZ0XCIpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfcmlnaHRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BpY3MpO1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uICE9IHVuZGVmaW5lZCAmJiBkZXNjcmlwdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGg+Q29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCBDb21tb25EYXRhLk1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTikrXCIgWy4uLl1cIixbJ2VsaXhpcl9yZWdpc3RyeSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24sWydlbGl4aXJfcmVnaXN0cnknXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKGV4cGFuZGFibGVEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc291cmNlVHlwZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0Q29udGFpbmVyKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gbWFpbkNvbnRhaW5lcjtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbGl4aXJSZWdpc3RyeURhdGE7IiwiXG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyVHJhaW5pbmdEYXRhIGNvbnN0cnVjdG9yXG4gKiAgICAgICAgICBAcGFyYW0ganNvbkRhdGEge09iamVjdH0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIHRoZSBvcmlnaW5hbCBkYXRhIHJldHJpZXZlZCBieSBvdXIgZGF0YSBzZXJ2ZXIuXG4gKiAgICAgICAgICBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgdGhpcyBzdHJ1Y3R1cmUuXG4gKiAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSd1cmwnXVxuICogICAgICAgICAgICAgICAgICAgICAgVVJMIHdpdGggdGhlIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqXG4gKi9cbnZhciBFbGl4aXJUcmFpbmluZ0RhdGEgPSBmdW5jdGlvbihqc29uRGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiY2thblwiOyBcbn07XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyVHJhaW5pbmdEYXRhIGNoaWxkIGNsYXNzIHdpdGggc3BlY2lmaWMgaW5mb3JtYXRpb24gb2YgdGhpcyBraW5kIG9mIHJlZ2lzdHJpZXMuXG4gKi9cbkVsaXhpclRyYWluaW5nRGF0YS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1vbkRhdGEucHJvdG90eXBlKTsgXG5FbGl4aXJUcmFpbmluZ0RhdGEuY29uc3RydWN0b3I9IEVsaXhpclRyYWluaW5nRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBtb3JlIGRldGFpbGVkIHdheSBvZiByZXByZXNlbnRpbmcgYSBFbGl4aXJUcmFpbmluZ0RhdGEgcmVjb3JkIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyVHJhaW5pbmdEYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoPkNvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgQ29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pK1wiIFsuLi5dXCIsWyd0cmFpbmluZ19tYXRlcmlhbCddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24sWyd0cmFpbmluZ19tYXRlcmlhbCddKTsgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChleHBhbmRhYmxlRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyVHJhaW5pbmdEYXRhOyIsInZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKiogXG4gKiBQYWdlTWFuYWdlciBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge0NvbnRleHREYXRhTGlzdCBPYmplY3R9IFJlZmVyZW5jZSB0byBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGluIG9yZGVyIHRvIG1hbmFnZSBpdHMgZmlsdGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBQYWdlTWFuYWdlciBjb21wb25lbnQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqL1xudmFyIFBhZ2VNYW5hZ2VyID0gZnVuY3Rpb24oY29udGV4dERhdGFMaXN0LCBvcHRpb25zKSB7XG5cdHZhciBjb25zdHMgPSB7XG5cdH07XG5cdHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0geyAgICAgICAgXG5cdH07XG5cdGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuXHQgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcblx0ICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG5cdH1cblx0XG5cdGZvcih2YXIga2V5IGluIGNvbnN0cyl7XG5cdCAgICAgdGhpc1trZXldID0gY29uc3RzW2tleV07XG5cdH1cbiAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QgPSBjb250ZXh0RGF0YUxpc3Q7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdCA9IDA7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0LnJlZ2lzdGVyT25Mb2FkZWRGdW5jdGlvbih0aGlzLCB0aGlzLmJ1aWxkKTtcbn1cblxuLyoqIFxuICogUGFnZU1hbmFnZXIgZnVuY3Rpb25hbGl0eS5cbiAqIFxuICogQGNsYXNzIFBhZ2VNYW5hZ2VyXG4gKiBcbiAqL1xuUGFnZU1hbmFnZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogUGFnZU1hbmFnZXIsXG4gICAgICAgIFxuICAgICAgICBcblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGJ1dHRvbnMgYW5kIGRyYXcgdGhlbSBpbnRvIHRoZSBlbGVtZW50IHdpdGggaWQgJ3RhcmdldElkJ1xuXHQgKi8gICAgICAgIFxuXHRidWlsZCA6IGZ1bmN0aW9uICgpe1xuXHRcdHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldElkKTtcblx0XHRpZiAodGFyZ2V0ID09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT0gbnVsbCl7XG5cdFx0XHRyZXR1cm47XHRcblx0XHR9XG5cdFx0d2hpbGUgKHRhcmdldC5maXJzdENoaWxkKSB7XG5cdFx0XHR0YXJnZXQucmVtb3ZlQ2hpbGQodGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpe1xuXHRcdFx0dmFyIHN0YXR1c1RleHQgPSB0aGlzLmdldEN1cnJlbnRTdGF0dXMoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdGF0dXNUZXh0KTtcblx0XHR9ZWxzZSBpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQpe1xuXHRcdFx0dmFyIHN0YXR1c1RleHQgPSB0aGlzLmdldEN1cnJlbnRTdGF0dXMoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdGF0dXNUZXh0KTtcblx0XHRcdFxuXHRcdFx0dmFyIG5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bmF2RGl2LmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9uYXYnKTtcblx0XHRcdFxuXHRcdFx0dmFyIHByZXZpb3VzQnV0dG9uID0gdGhpcy5jcmVhdGVQcmV2aW91c0J1dHRvbigpO1xuXHRcdFx0bmF2RGl2LmFwcGVuZENoaWxkKHByZXZpb3VzQnV0dG9uKTtcblx0XHRcdFxuXHRcdFx0dmFyIHRleHRTZXBhcmF0b3IgPSB0aGlzLmNyZWF0ZVRleHRTZXBhcmF0b3IoKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZCh0ZXh0U2VwYXJhdG9yKTtcblx0XHRcdFxuXHRcdFx0dmFyIG5leHRCdXR0b24gPSB0aGlzLmNyZWF0ZU5leHRCdXR0b24oKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZChuZXh0QnV0dG9uKTtcblx0XHRcdFxuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKG5hdkRpdik7XG5cdFx0fWVsc2V7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIHN0YXR1czogXCIrdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyk7XG5cdFx0fVxuXHRcdFxuXHR9LFxuICAgICAgICBcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgdGV4dCBzZXBhcmF0b3IuXG4gICAgICAgICovICBcblx0Y3JlYXRlVGV4dFNlcGFyYXRvciA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0dmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLScpO1xuXHRcdGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBpZiBpdCdzIHBvc3NpYmxlIHRvIHJldHJpZXZlIHByZXZpb3VzIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgZXhpc3RQcmV2aW91c1Jlc3VsdHMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBzdGFydFJlc3VsdCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRpZiAoc3RhcnRSZXN1bHQgPT0gMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1lbHNlXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIGlmIGl0J3MgcG9zc2libGUgdG8gcmV0cmlldmUgbmV4dCByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGV4aXN0TmV4dFJlc3VsdHMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBzdGFydFJlc3VsdCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHR2YXIgbWF4Um93cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmdldE1heFJvd3MoKTtcblx0XHR2YXIgdG90YWxSZXN1bHRzID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFRvdGFsUmVzdWx0cztcblxuXHRcdGlmIChzdGFydFJlc3VsdCttYXhSb3dzPHRvdGFsUmVzdWx0cykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fWVsc2Vcblx0XHRcdHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHRvIGdldCBwcmV2aW91cyByZXN1bHRzLk9ubHkgdGV4dCBpZiB0aGVyZSBhcmVuJ3QgcHJldmlvdXMgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVQcmV2aW91c0J1dHRvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuZXhpc3RQcmV2aW91c1Jlc3VsdHMoKSkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUHJldmlvdXMnKTtcblx0XHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG5cdFx0XHRidXR0b24udGl0bGUgPSAnUHJldmlvdXMnO1xuXHRcdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHRcdHZhciBteVBhZ2VNYW5hZ2VyID0gdGhpcztcblx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0XHQgICAgdmFyIG1heFJvd3MgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0XHQgICAgdmFyIHRvdGFsUmVzdWx0cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHQgICAgdmFyIHN0YXJ0UmVzdWx0ID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIHZhciBuZXdTdGFydFJlc3VsdCA9IDA7XG5cdFx0XHQgICAgaWYgKHN0YXJ0UmVzdWx0LW1heFJvd3M8PTApIHtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gMDtcdFxuXHRcdFx0ICAgIH1lbHNle1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdC1tYXhSb3dzO1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgICBteVBhZ2VNYW5hZ2VyLl9jaGFuZ2VQYWdlKG5ld1N0YXJ0UmVzdWx0KTtcblx0XHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYnV0dG9uOyAgXG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgcHJldmlvdXNTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0dmFyIHByZXZpb3VzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQcmV2aW91cycpO1xuXHRcdFx0cHJldmlvdXNTcGFuLmFwcGVuZENoaWxkKHByZXZpb3VzVGV4dCk7XG5cdFx0XHRwcmV2aW91c1NwYW4uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0cmV0dXJuIHByZXZpb3VzU3Bhbjtcblx0XHR9XG4gICAgICAgICAgICAgIFxuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gdG8gZ2V0IHByZXZpb3VzIHJlc3VsdHMuT25seSB0ZXh0IGlmIHRoZXJlIGFyZW4ndCBtb3JlIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlTmV4dEJ1dHRvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuZXhpc3ROZXh0UmVzdWx0cygpKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOZXh0Jyk7XG5cdFx0XHRidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuXHRcdFx0YnV0dG9uLnRpdGxlID0gJ05leHQnO1xuXHRcdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHRcdHZhciBteVBhZ2VNYW5hZ2VyID0gdGhpcztcblx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0XHQgICAgdmFyIG1heFJvd3MgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0XHQgICAgdmFyIHRvdGFsUmVzdWx0cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHQgICAgdmFyIHN0YXJ0UmVzdWx0ID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIHZhciBuZXdTdGFydFJlc3VsdCA9IDA7XG5cdFx0XHQgICAgaWYgKHN0YXJ0UmVzdWx0K21heFJvd3M8dG90YWxSZXN1bHRzKSB7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0K21heFJvd3M7XHRcblx0XHRcdCAgICB9ZWxzZXtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQ7XG5cdFx0XHQgICAgfVxuXHRcdFx0ICAgIG15UGFnZU1hbmFnZXIuX2NoYW5nZVBhZ2UobmV3U3RhcnRSZXN1bHQpO1xuXHRcdFx0ICAgIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBidXR0b247XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgbmV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHR2YXIgbmV4dFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTmV4dCcpO1xuXHRcdFx0bmV4dFNwYW4uYXBwZW5kQ2hpbGQobmV4dFRleHQpO1xuXHRcdFx0bmV4dFNwYW4uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0cmV0dXJuIG5leHRTcGFuO1xuXHRcdH1cbiAgICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGV4ZWN1dGVzIHRoZSByZWRyYXduIG9mIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGhhdmluZyBpbnRvIGFjY291bnRcbiAgICAgICAgKiBwcmV2aW91c2x5IGNob3NlbiBmaWx0ZXJzLlxuICAgICAgICAqIEBwYXJhbSBzdGFydFJlc3VsdCB7SW50ZWdlcn0gLSBudW1iZXIgb2YgdGhlIGZpcnN0IHJlc3VsdCB0byBiZSBzaG93blxuICAgICAgICAqLyAgXG4gICAgICAgIF9jaGFuZ2VQYWdlOiBmdW5jdGlvbiAoc3RhcnRSZXN1bHQpe1xuXHQgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQ7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5kcmF3Q29udGV4dERhdGFMaXN0KCk7XG4gICAgICAgIH0sXG5cdCBcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZjogZmlyc3QgcmVzdWx0IHNob3duLCBsYXN0IHJlc3VsdHMgc2hvd24gYW5kXG4gICAgICAgICogdG90YWwgbnVtYmVyIG9mIHJlc3VsdHMuXG4gICAgICAgICovICBcblx0Z2V0Q3VycmVudFN0YXR1cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9zdGF0dXMnKTtcblx0XHR2YXIgc3RhcnRpbmdSZXN1bHQgPSBudWxsO1xuXHRcdHZhciBlbmRpbmdSZXN1bHQgPSBudWxsO1xuXHRcdHZhciB0b3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdHZhciByZXN1bHRUZXh0ID0gXCJcIjtcblx0XHRcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpe1xuXHRcdFx0cmVzdWx0VGV4dCA9IFwiTG9hZGluZyByZXNvdXJjZXMuLi5cIjtcblx0XHR9ZWxzZSBpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHJlc3VsdFRleHQgPSBcIlwiO1xuXHRcdH1lbHNle1xuXHRcdFx0c3RhcnRpbmdSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0XHR2YXIgY3VycmVudFRvdGFsUmVzdWx0cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHR2YXIgbnVtUm93c0xvYWRlZCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzO1xuXHRcdFx0XG5cdFx0XHRlbmRpbmdSZXN1bHQgPSBzdGFydGluZ1Jlc3VsdCArIG51bVJvd3NMb2FkZWQ7XG5cdFx0XHRpZiAoY3VycmVudFRvdGFsUmVzdWx0cz4wKSB7XG5cdFx0XHRcdC8vIG9ubHkgdG8gc2hvdyBpdCB0byB0aGUgdXNlclxuXHRcdFx0XHRzdGFydGluZ1Jlc3VsdCA9IHN0YXJ0aW5nUmVzdWx0KzE7XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHRUZXh0ID0gXCJSZWNvcmRzIFwiK3N0YXJ0aW5nUmVzdWx0K1wiIHRvIFwiK2VuZGluZ1Jlc3VsdCtcIiBvZiBcIitjdXJyZW50VG90YWxSZXN1bHRzXG5cdFx0XHRcblx0XHR9XG5cdFx0ZWxlbWVudC5pbm5lckhUTUwgPSByZXN1bHRUZXh0O1xuXHRcdFxuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG4gICAgICAgIFxuICAgICAgICBcbn1cbiAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBQYWdlTWFuYWdlcjtcbiAgICAgIFxuICAiLCJcblxuZnVuY3Rpb24gZGVmaW5lKG5hbWUsIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6ICAgICAgdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbn1cblxuLy8gQ29udGV4dERhdGFMaXN0IGNvbnN0YW50c1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfUkVHSVNUUllcIiwgXCJFU1JcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfU09VUkNFX0VMSVhJUl9URVNTXCIsIFwiVFNTXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfRVZFTlRTXCIsIFwiRUVWXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEVcIiwgXCJGVUxMX1NUWUxFXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRVwiLCBcIkNPTU1PTl9TVFlMRVwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9NQVhfUk9XU1wiLCAxMDApO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X05VTV9XT1JEU19GSUxURVJJTkdfREVTQ1JJUFRJT05cIiwgNTApO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0VWVF9PTl9SRVNVTFRTX0xPQURFRFwiLCBcIm9uUmVzdWx0c0xvYWRlZFwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FVlRfT05fUkVRVUVTVF9FUlJPUlwiLCBcIm9uUmVxdWVzdEVycm9yXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0xPQURJTkdcIiwgXCJMT0FESU5HXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0xPQURFRFwiLCBcIkxPQURFRFwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FUlJPUlwiLCBcIkVSUk9SXCIpO1xuXG4vLyBDb21tb25EYXRhIGNvbnN0YW50c1xuZGVmaW5lKFwiQ29tbW9uRGF0YV9NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT05cIiwgMTAwMCk7XG5cbi8vIEJ1dHRvbnNNYW5hZ2VyIGNvbnN0YW50c1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfU1FVQVJFRF8zRFwiLCBcIlNRVUFSRURfM0RcIik7XG5kZWZpbmUoXCJCdXR0b25zTWFuYWdlcl9ST1VORF9GTEFUXCIsIFwiUk9VTkRfRkxBVFwiKTtcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFlcIiwgXCJJQ09OU19PTkxZXCIpO1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfRUxJWElSXCIsIFwiRUxJWElSXCIpO1xuXG4vLyBSZXNvdXJjZVR5cGVTZXRzIGNvbnN0YW50c1xuZGVmaW5lKFwiUmVzb3VyY2VUeXBlU2V0c19GTEFUXCIsIFwiRkxBVFwiKTtcbmRlZmluZShcIlJlc291cmNlVHlwZVNldHNfRUxJWElSXCIsIFwiRUxJWElSXCIpO1xuXG4iLG51bGwsIi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiBsaWNlbnNlIE1JVCAoYykgRHVzdGluIERpYXogMjAxNVxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqL1xuXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBjb250ZXh0ID0gdGhpc1xuXG4gIGlmICgnd2luZG93JyBpbiBjb250ZXh0KSB7XG4gICAgdmFyIGRvYyA9IGRvY3VtZW50XG4gICAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gIH0gZWxzZSB7XG4gICAgdmFyIFhIUjJcbiAgICB0cnkge1xuICAgICAgWEhSMiA9IHJlcXVpcmUoJ3hocjInKVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BlZXIgZGVwZW5kZW5jeSBgeGhyMmAgcmVxdWlyZWQhIFBsZWFzZSBucG0gaW5zdGFsbCB4aHIyJylcbiAgICB9XG4gIH1cblxuXG4gIHZhciBodHRwc1JlID0gL15odHRwL1xuICAgICwgcHJvdG9jb2xSZSA9IC8oXlxcdyspOlxcL1xcLy9cbiAgICAsIHR3b0h1bmRvID0gL14oMjBcXGR8MTIyMykkLyAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgY29udGVudFR5cGUgPSAnQ29udGVudC1UeXBlJ1xuICAgICwgcmVxdWVzdGVkV2l0aCA9ICdYLVJlcXVlc3RlZC1XaXRoJ1xuICAgICwgdW5pcWlkID0gMFxuICAgICwgY2FsbGJhY2tQcmVmaXggPSAncmVxd2VzdF8nICsgKCtuZXcgRGF0ZSgpKVxuICAgICwgbGFzdFZhbHVlIC8vIGRhdGEgc3RvcmVkIGJ5IHRoZSBtb3N0IHJlY2VudCBKU09OUCBjYWxsYmFja1xuICAgICwgeG1sSHR0cFJlcXVlc3QgPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgLCB4RG9tYWluUmVxdWVzdCA9ICdYRG9tYWluUmVxdWVzdCdcbiAgICAsIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxuXG4gICAgLCBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IEFycmF5LmlzQXJyYXlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgIH1cblxuICAgICwgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgICAgICAgJ2NvbnRlbnRUeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgLCAncmVxdWVzdGVkV2l0aCc6IHhtbEh0dHBSZXF1ZXN0XG4gICAgICAgICwgJ2FjY2VwdCc6IHtcbiAgICAgICAgICAgICAgJyonOiAgJ3RleHQvamF2YXNjcmlwdCwgdGV4dC9odG1sLCBhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sLCAqLyonXG4gICAgICAgICAgICAsICd4bWwnOiAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnXG4gICAgICAgICAgICAsICdodG1sJzogJ3RleHQvaHRtbCdcbiAgICAgICAgICAgICwgJ3RleHQnOiAndGV4dC9wbGFpbidcbiAgICAgICAgICAgICwgJ2pzb24nOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgICAgLCAnanMnOiAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCB4aHIgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIC8vIGlzIGl0IHgtZG9tYWluXG4gICAgICAgIGlmIChvWydjcm9zc09yaWdpbiddID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHhociA9IGNvbnRleHRbeG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHRbeERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dFt4bWxIdHRwUmVxdWVzdF0pIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfSBlbHNlIGlmIChYSFIyKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYSFIyKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgZ2xvYmFsU2V0dXBPcHRpb25zID0ge1xuICAgICAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH1cblxuICBmdW5jdGlvbiBzdWNjZWVkKHIpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBwcm90b2NvbFJlLmV4ZWMoci51cmwpXG4gICAgcHJvdG9jb2wgPSAocHJvdG9jb2wgJiYgcHJvdG9jb2xbMV0pIHx8IGNvbnRleHQubG9jYXRpb24ucHJvdG9jb2xcbiAgICByZXR1cm4gaHR0cHNSZS50ZXN0KHByb3RvY29sKSA/IHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykgOiAhIXIucmVxdWVzdC5yZXNwb25zZVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5fdGltZWRPdXQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QsICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnKVxuICAgICAgaWYgKHIucmVxdWVzdCAmJiByLnJlcXVlc3RbcmVhZHlTdGF0ZV0gPT0gNCkge1xuICAgICAgICByLnJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxuICAgICAgICBpZiAoc3VjY2VlZChyKSkgc3VjY2VzcyhyLnJlcXVlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlcnJvcihyLnJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyhodHRwLCBvKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBvWydoZWFkZXJzJ10gfHwge31cbiAgICAgICwgaFxuXG4gICAgaGVhZGVyc1snQWNjZXB0J10gPSBoZWFkZXJzWydBY2NlcHQnXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddW29bJ3R5cGUnXV1cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVsnKiddXG5cbiAgICB2YXIgaXNBRm9ybURhdGEgPSB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnICYmIChvWydkYXRhJ10gaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghb1snY3Jvc3NPcmlnaW4nXSAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzWydyZXF1ZXN0ZWRXaXRoJ11cbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdICYmICFpc0FGb3JtRGF0YSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvWydjb250ZW50VHlwZSddIHx8IGRlZmF1bHRIZWFkZXJzWydjb250ZW50VHlwZSddXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygb1snd2l0aENyZWRlbnRpYWxzJ10gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvWyd3aXRoQ3JlZGVudGlhbHMnXVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG9bJ2pzb25wQ2FsbGJhY2snXSB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICBjb250ZXh0W2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG9bJ21ldGhvZCddIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG9bJ3Byb2Nlc3NEYXRhJ10gaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvWydwcm9jZXNzRGF0YSddICE9PSBmYWxzZSAmJiBvWydkYXRhJ10gJiYgdHlwZW9mIG9bJ2RhdGEnXSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG9bJ2RhdGEnXSlcbiAgICAgICAgOiAob1snZGF0YSddIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG9bJ3R5cGUnXSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG9bJ3R5cGUnXSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgLy8gZ2V0IHRoZSB4aHIgZnJvbSB0aGUgZmFjdG9yeSBpZiBwYXNzZWRcbiAgICAvLyBpZiB0aGUgZmFjdG9yeSByZXR1cm5zIG51bGwsIGZhbGwtYmFjayB0byBvdXJzXG4gICAgaHR0cCA9IChvLnhociAmJiBvLnhocihvKSkgfHwgeGhyKG8pXG5cbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG9bJ2FzeW5jJ10gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmIChjb250ZXh0W3hEb21haW5SZXF1ZXN0XSAmJiBodHRwIGluc3RhbmNlb2YgY29udGV4dFt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG9bJ2JlZm9yZSddICYmIG9bJ2JlZm9yZSddKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZShoZWFkZXIpIHtcbiAgICAvLyBqc29uLCBqYXZhc2NyaXB0LCB0ZXh0L3BsYWluLCB0ZXh0L2h0bWwsIHhtbFxuICAgIGlmIChoZWFkZXIgPT09IG51bGwpIHJldHVybiB1bmRlZmluZWQ7IC8vSW4gY2FzZSBvZiBubyBjb250ZW50LXR5cGUuXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnanNvbicpKSByZXR1cm4gJ2pzb24nXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnamF2YXNjcmlwdCcpKSByZXR1cm4gJ2pzJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3RleHQnKSkgcmV0dXJuICdodG1sJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3htbCcpKSByZXR1cm4gJ3htbCdcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQobywgZm4pIHtcblxuICAgIHRoaXMudXJsID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyB3aGV0aGVyIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkIGZvciBwdXJwb3NlXG4gICAgLy8gb2YgdHJhY2tpbmcgdGhlIFByb21pc2VzXG4gICAgdGhpcy5fZnVsZmlsbGVkID0gZmFsc2VcbiAgICAvLyBzdWNjZXNzIGhhbmRsZXJzXG4gICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbigpe31cbiAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzID0gW11cbiAgICAvLyBlcnJvciBoYW5kbGVyc1xuICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMgPSBbXVxuICAgIC8vIGNvbXBsZXRlIChib3RoIHN1Y2Nlc3MgYW5kIGZhaWwpIGhhbmRsZXJzXG4gICAgdGhpcy5fY29tcGxldGVIYW5kbGVycyA9IFtdXG4gICAgdGhpcy5fZXJyZWQgPSBmYWxzZVxuICAgIHRoaXMuX3Jlc3BvbnNlQXJncyA9IHt9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgIGZuID0gZm4gfHwgZnVuY3Rpb24gKCkge31cblxuICAgIGlmIChvWyd0aW1lb3V0J10pIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lZE91dCgpXG4gICAgICB9LCBvWyd0aW1lb3V0J10pXG4gICAgfVxuXG4gICAgaWYgKG9bJ3N1Y2Nlc3MnXSkge1xuICAgICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ3N1Y2Nlc3MnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9bJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2Vycm9yJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAob1snY29tcGxldGUnXSkge1xuICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snY29tcGxldGUnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlIChyZXNwKSB7XG4gICAgICBvWyd0aW1lb3V0J10gJiYgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcbiAgICAgIHNlbGYudGltZW91dCA9IG51bGxcbiAgICAgIHdoaWxlIChzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fY29tcGxldGVIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2VzcyAocmVzcCkge1xuICAgICAgdmFyIHR5cGUgPSBvWyd0eXBlJ10gfHwgcmVzcCAmJiBzZXRUeXBlKHJlc3AuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpKSAvLyByZXNwIGNhbiBiZSB1bmRlZmluZWQgaW4gSUVcbiAgICAgIHJlc3AgPSAodHlwZSAhPT0gJ2pzb25wJykgPyBzZWxmLnJlcXVlc3QgOiByZXNwXG4gICAgICAvLyB1c2UgZ2xvYmFsIGRhdGEgZmlsdGVyIG9uIHJlc3BvbnNlIHRleHRcbiAgICAgIHZhciBmaWx0ZXJlZFJlc3BvbnNlID0gZ2xvYmFsU2V0dXBPcHRpb25zLmRhdGFGaWx0ZXIocmVzcC5yZXNwb25zZVRleHQsIHR5cGUpXG4gICAgICAgICwgciA9IGZpbHRlcmVkUmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0ID0gclxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjYW4ndCBhc3NpZ24gdGhpcyBpbiBJRTw9OCwganVzdCBpZ25vcmVcbiAgICAgIH1cbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IGNvbnRleHQuSlNPTiA/IGNvbnRleHQuSlNPTi5wYXJzZShyKSA6IGV2YWwoJygnICsgciArICcpJylcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcihyZXNwLCAnQ291bGQgbm90IHBhcnNlIEpTT04gaW4gcmVzcG9uc2UnLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICByZXNwID0gZXZhbChyKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgIHJlc3AgPSByXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICByZXNwID0gcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IgLy8gSUUgdHJvbG9sb1xuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IuZXJyb3JDb2RlXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5yZWFzb25cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX2Z1bGZpbGxlZCA9IHRydWVcbiAgICAgIGZuKHJlc3ApXG4gICAgICBzZWxmLl9zdWNjZXNzSGFuZGxlcihyZXNwKVxuICAgICAgd2hpbGUgKHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwID0gc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG5cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZWRPdXQoKSB7XG4gICAgICBzZWxmLl90aW1lZE91dCA9IHRydWVcbiAgICAgIHNlbGYucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcCwgbXNnLCB0KSB7XG4gICAgICByZXNwID0gc2VsZi5yZXF1ZXN0XG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5tc2cgPSBtc2dcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy50ID0gdFxuICAgICAgc2VsZi5fZXJyZWQgPSB0cnVlXG4gICAgICB3aGlsZSAoc2VsZi5fZXJyb3JIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2Vycm9ySGFuZGxlcnMuc2hpZnQoKShyZXNwLCBtc2csIHQpXG4gICAgICB9XG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IGdldFJlcXVlc3QuY2FsbCh0aGlzLCBzdWNjZXNzLCBlcnJvcilcbiAgfVxuXG4gIFJlcXdlc3QucHJvdG90eXBlID0ge1xuICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgLCByZXRyeTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdC5jYWxsKHRoaXMsIHRoaXMubywgdGhpcy5mbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbWFsbCBkZXZpYXRpb24gZnJvbSB0aGUgUHJvbWlzZXMgQSBDb21tb25KcyBzcGVjaWZpY2F0aW9uXG4gICAgICogaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvUHJvbWlzZXMvQVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogYHRoZW5gIHdpbGwgZXhlY3V0ZSB1cG9uIHN1Y2Nlc3NmdWwgcmVxdWVzdHNcbiAgICAgKi9cbiAgLCB0aGVuOiBmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGZhaWwgPSBmYWlsIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwID0gc3VjY2Vzcyh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZmFpbCh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzLnB1c2goc3VjY2VzcylcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZhaWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBhbHdheXNgIHdpbGwgZXhlY3V0ZSB3aGV0aGVyIHRoZSByZXF1ZXN0IHN1Y2NlZWRzIG9yIGZhaWxzXG4gICAgICovXG4gICwgYWx3YXlzOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQgfHwgdGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBmYWlsYCB3aWxsIGV4ZWN1dGUgd2hlbiB0aGUgcmVxdWVzdCBmYWlsc1xuICAgICAqL1xuICAsIGZhaWw6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAsICdjYXRjaCc6IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIHRoaXMuZmFpbChmbilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXF3ZXN0KG8sIGZuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgLy8gbm9ybWFsaXplIG5ld2xpbmUgdmFyaWFudHMgYWNjb3JkaW5nIHRvIHNwZWMgLT4gQ1JMRlxuICBmdW5jdGlvbiBub3JtYWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC9cXHI/XFxuL2csICdcXHJcXG4nKSA6ICcnXG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWwoZWwsIGNiKSB7XG4gICAgdmFyIG4gPSBlbC5uYW1lXG4gICAgICAsIHQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICwgb3B0Q2IgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgIC8vIElFIGdpdmVzIHZhbHVlPVwiXCIgZXZlbiB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyAnc3BlY2lmaWVkJyByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUNvcmUvY29yZS5odG1sI0lELTg2MjUyOTI3M1xuICAgICAgICAgIGlmIChvICYmICFvWydkaXNhYmxlZCddKVxuICAgICAgICAgICAgY2Iobiwgbm9ybWFsaXplKG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXSAmJiBvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ11bJ3NwZWNpZmllZCddID8gb1sndmFsdWUnXSA6IG9bJ3RleHQnXSkpXG4gICAgICAgIH1cbiAgICAgICwgY2gsIHJhLCB2YWwsIGlcblxuICAgIC8vIGRvbid0IHNlcmlhbGl6ZSBlbGVtZW50cyB0aGF0IGFyZSBkaXNhYmxlZCBvciB3aXRob3V0IGEgbmFtZVxuICAgIGlmIChlbC5kaXNhYmxlZCB8fCAhbikgcmV0dXJuXG5cbiAgICBzd2l0Y2ggKHQpIHtcbiAgICBjYXNlICdpbnB1dCc6XG4gICAgICBpZiAoIS9yZXNldHxidXR0b258aW1hZ2V8ZmlsZS9pLnRlc3QoZWwudHlwZSkpIHtcbiAgICAgICAgY2ggPSAvY2hlY2tib3gvaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHJhID0gL3JhZGlvL2kudGVzdChlbC50eXBlKVxuICAgICAgICB2YWwgPSBlbC52YWx1ZVxuICAgICAgICAvLyBXZWJLaXQgZ2l2ZXMgdXMgXCJcIiBpbnN0ZWFkIG9mIFwib25cIiBpZiBhIGNoZWNrYm94IGhhcyBubyB2YWx1ZSwgc28gY29ycmVjdCBpdCBoZXJlXG4gICAgICAgIDsoIShjaCB8fCByYSkgfHwgZWwuY2hlY2tlZCkgJiYgY2Iobiwgbm9ybWFsaXplKGNoICYmIHZhbCA9PT0gJycgPyAnb24nIDogdmFsKSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2Iobiwgbm9ybWFsaXplKGVsLnZhbHVlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3Qtb25lJykge1xuICAgICAgICBvcHRDYihlbC5zZWxlY3RlZEluZGV4ID49IDAgPyBlbC5vcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGVsLmxlbmd0aCAmJiBpIDwgZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbC5vcHRpb25zW2ldLnNlbGVjdGVkICYmIG9wdENiKGVsLm9wdGlvbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gY29sbGVjdCB1cCBhbGwgZm9ybSBlbGVtZW50cyBmb3VuZCBmcm9tIHRoZSBwYXNzZWQgYXJndW1lbnQgZWxlbWVudHMgYWxsXG4gIC8vIHRoZSB3YXkgZG93biB0byBjaGlsZCBlbGVtZW50czsgcGFzcyBhICc8Zm9ybT4nIG9yIGZvcm0gZmllbGRzLlxuICAvLyBjYWxsZWQgd2l0aCAndGhpcyc9Y2FsbGJhY2sgdG8gdXNlIGZvciBzZXJpYWwoKSBvbiBlYWNoIGVsZW1lbnRcbiAgZnVuY3Rpb24gZWFjaEZvcm1FbGVtZW50KCkge1xuICAgIHZhciBjYiA9IHRoaXNcbiAgICAgICwgZSwgaVxuICAgICAgLCBzZXJpYWxpemVTdWJ0YWdzID0gZnVuY3Rpb24gKGUsIHRhZ3MpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgZmFcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmEgPSBlW2J5VGFnXSh0YWdzW2ldKVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZhLmxlbmd0aDsgaisrKSBzZXJpYWwoZmFbal0sIGNiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZSA9IGFyZ3VtZW50c1tpXVxuICAgICAgaWYgKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWEvaS50ZXN0KGUudGFnTmFtZSkpIHNlcmlhbChlLCBjYilcbiAgICAgIHNlcmlhbGl6ZVN1YnRhZ3MoZSwgWyAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJyBdKVxuICAgIH1cbiAgfVxuXG4gIC8vIHN0YW5kYXJkIHF1ZXJ5IHN0cmluZyBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKCkge1xuICAgIHJldHVybiByZXF3ZXN0LnRvUXVlcnlTdHJpbmcocmVxd2VzdC5zZXJpYWxpemVBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICB9XG5cbiAgLy8geyAnbmFtZSc6ICd2YWx1ZScsIC4uLiB9IHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplSGFzaCgpIHtcbiAgICB2YXIgaGFzaCA9IHt9XG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgaW4gaGFzaCkge1xuICAgICAgICBoYXNoW25hbWVdICYmICFpc0FycmF5KGhhc2hbbmFtZV0pICYmIChoYXNoW25hbWVdID0gW2hhc2hbbmFtZV1dKVxuICAgICAgICBoYXNoW25hbWVdLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2UgaGFzaFtuYW1lXSA9IHZhbHVlXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBoYXNoXG4gIH1cblxuICAvLyBbIHsgbmFtZTogJ25hbWUnLCB2YWx1ZTogJ3ZhbHVlJyB9LCAuLi4gXSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIHJlcXdlc3Quc2VyaWFsaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyciA9IFtdXG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgYXJyLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0pXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHJlcXdlc3Quc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgICB2YXIgb3B0LCBmblxuICAgICAgLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXG4gICAgb3B0ID0gYXJncy5wb3AoKVxuICAgIG9wdCAmJiBvcHQubm9kZVR5cGUgJiYgYXJncy5wdXNoKG9wdCkgJiYgKG9wdCA9IG51bGwpXG4gICAgb3B0ICYmIChvcHQgPSBvcHQudHlwZSlcblxuICAgIGlmIChvcHQgPT0gJ21hcCcpIGZuID0gc2VyaWFsaXplSGFzaFxuICAgIGVsc2UgaWYgKG9wdCA9PSAnYXJyYXknKSBmbiA9IHJlcXdlc3Quc2VyaWFsaXplQXJyYXlcbiAgICBlbHNlIGZuID0gc2VyaWFsaXplUXVlcnlTdHJpbmdcblxuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG5cbiAgcmVxd2VzdC50b1F1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHRyYWQpIHtcbiAgICB2YXIgcHJlZml4LCBpXG4gICAgICAsIHRyYWRpdGlvbmFsID0gdHJhZCB8fCBmYWxzZVxuICAgICAgLCBzID0gW11cbiAgICAgICwgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAsIGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHZhbHVlKSA/IHZhbHVlKCkgOiAodmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpXG4gICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmMoa2V5KSArICc9JyArIGVuYyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG4gICAgaWYgKGlzQXJyYXkobykpIHtcbiAgICAgIGZvciAoaSA9IDA7IG8gJiYgaSA8IG8ubGVuZ3RoOyBpKyspIGFkZChvW2ldWyduYW1lJ10sIG9baV1bJ3ZhbHVlJ10pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG4gICAgICAvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cbiAgICAgIGZvciAocHJlZml4IGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJlZml4KSkgYnVpbGRQYXJhbXMocHJlZml4LCBvW3ByZWZpeF0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BhY2VzIHNob3VsZCBiZSArIGFjY29yZGluZyB0byBzcGVjXG4gICAgcmV0dXJuIHMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFBhcmFtcyhwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCkge1xuICAgIHZhciBuYW1lLCBpLCB2XG4gICAgICAsIHJicmFja2V0ID0gL1xcW1xcXSQvXG5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cbiAgICAgIGZvciAoaSA9IDA7IG9iaiAmJiBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHYgPSBvYmpbaV1cbiAgICAgICAgaWYgKHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cbiAgICAgICAgICBhZGQocHJlZml4LCB2KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCB2LCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIG5hbWUgKyAnXScsIG9ialtuYW1lXSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG4gICAgICBhZGQocHJlZml4LCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tQcmVmaXhcbiAgfVxuXG4gIC8vIGpRdWVyeSBhbmQgWmVwdG8gY29tcGF0aWJpbGl0eSwgZGlmZmVyZW5jZXMgY2FuIGJlIHJlbWFwcGVkIGhlcmUgc28geW91IGNhbiBjYWxsXG4gIC8vIC5hamF4LmNvbXBhdChvcHRpb25zLCBjYWxsYmFjaylcbiAgcmVxd2VzdC5jb21wYXQgPSBmdW5jdGlvbiAobywgZm4pIHtcbiAgICBpZiAobykge1xuICAgICAgb1sndHlwZSddICYmIChvWydtZXRob2QnXSA9IG9bJ3R5cGUnXSkgJiYgZGVsZXRlIG9bJ3R5cGUnXVxuICAgICAgb1snZGF0YVR5cGUnXSAmJiAob1sndHlwZSddID0gb1snZGF0YVR5cGUnXSlcbiAgICAgIG9bJ2pzb25wQ2FsbGJhY2snXSAmJiAob1snanNvbnBDYWxsYmFja05hbWUnXSA9IG9bJ2pzb25wQ2FsbGJhY2snXSkgJiYgZGVsZXRlIG9bJ2pzb25wQ2FsbGJhY2snXVxuICAgICAgb1snanNvbnAnXSAmJiAob1snanNvbnBDYWxsYmFjayddID0gb1snanNvbnAnXSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgcmVxd2VzdC5hamF4U2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgZm9yICh2YXIgayBpbiBvcHRpb25zKSB7XG4gICAgICBnbG9iYWxTZXR1cE9wdGlvbnNba10gPSBvcHRpb25zW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcXdlc3Rcbn0pO1xuIiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcbnZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgQnV0dG9uc01hbmFnZXIgPSByZXF1aXJlKFwiLi9CdXR0b25zTWFuYWdlci5qc1wiKTtcbnZhciBQYWdlTWFuYWdlciA9IHJlcXVpcmUoXCIuL1BhZ2VNYW5hZ2VyLmpzXCIpO1xuXG4vKiogXG4gKiBCaW9DSURFUiBDb21wb25lbnQuXG4gKlxuICogUHVycG9zZSBvZiB0aGlzIHdpZGdldCBpcyBzaG93aW5nIHRvIHRoZSB1c2VyLCB3aXRob3V0IGFueSBkaXJlY3QgYWN0aW9uIGJ5IGhpbXNlbGYsXG4gKiBpbmZvcm1hdGlvbiBvZiBoaXMgaW50ZXJlc3QgcmVsYXRlZCB3aXRoIHRoZSBjb250ZW50IHRoYXQgaXMgYmVpbmcgc2hvd24gY3VycmVudGx5IHRvIGhpbSAuXG4gKiBUbyBhY2hpZXZlIHRoaXMsIHdlIGNvbGxlY3QgaW4gYSBTb2xyIHN5c3RlbSBpbmZvcm1hdGlvbiBvZiBkaWZmZXJlbnQgcmVwb3NpdG9yaWVzXG4gKiAoRWxpeGlyIFNlcnZpY2UgUmVnaXN0cnksIEVsaXhpciBUcmFpbmluZyBQb3J0YWwsIGFuZCBFbGl4aXIgRXZlbnRzIFBvcnRhbCwgdW50aWwgbm93KSwgc29cbiAqIHdlIGNhbiBzZWFyY2ggaW50byB0aGlzIGluZm9ybWF0aW9uIHdoaWNoIGlzIHJlbGF0ZWQgd2l0aCBjb250ZW50IGFjY2VzZWQgYnkgdXNlci5cbiAqIFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRJZCAgSWQgb2YgdGhlIG1haW4gY29udGFpbmVyIHRvIHB1dCB0aGlzIGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0RGF0YUxpc3RPcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBtYWluIG9wdGlvbnMgZm9yIENvbnRleHREYXRhTGlzdCBzdWJjb21wb25lbnQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldElkPSdZb3VyT3duRGl2SWQnXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIENvbnRleHREYXRhTGlzdCBvYmplY3Qgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0Q2xhc3M9J1lvdXJPd25DbGFzcyddXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSBvZiB0aGUgRElWIHdoZXJlIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuICBcbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbZGlzcGxheVN0eWxlPSBDb250ZXh0RGF0YUxpc3QuRlVMTF9TVFlMRSwgQ29udGV4dERhdGFMaXN0LkNPTU1PTl9TVFlMRV1cbiAqICAgIFx0XHRUeXBlIG9mIHJvd3MgdmlzdWFsaXNhdGlvbi5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRJZENvbnRhaW5lcj1Zb3VyIG93biB0YWcgaWQgXVxuICogICAgXHRcdFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIFx0XHRDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLiBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0SWRDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRUYWdDb250YWluZXI9T25lIHN0YWJsaXNoZWQgdGFnIG5hbWUsIGZvciBleGFtcGxlIGgxLiBdXG4gKiAgICBcdFx0VGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guIEl0J3Mgbm90IHVzZWQgaWYgdXNlclRleHRJZENvbnRhaW5lciBvciB1c2VyVGV4dENsYXNzQ29udGFpbmVyIGlzIGRlZmluZWRcbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzSWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFx0XHRUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgXHRcdEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzVGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgXHRcdFRhZyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBcdFx0SXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBvciB1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogXHRAb3B0aW9uIHtIVE1MIG9iamVjdH0gW3VzZXJLZXl3b3Jkc0NvbnRhaW5lcj1UaGUgaHRtbCBrZXl3b3JkcyBjb250YWluZXIgaXRzZWxmLiBdXG4gKiAgICBcdFx0SFRNTCBvYmplY3QgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIFx0XHRJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyLCB1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciBvciB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIFx0XHRDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGRlc2NyaXB0aW9uIHRvIGhlbHAgZmlsdGVyIHNhbWUgcmVzdWx0cyB0aGF0IHVzZXIgaXMgc2VlaW5nLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt1c2VySGVscENsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCB3aWxsIGNvbnRhaW5zIGhlbHAgaWNvbi5cbiAqIFx0QG9wdGlvbiB7aW50fSBbbnVtYmVyUmVzdWx0cz1udW1iZXIgXVxuICogICAgXHRcdEludGVnZXIgdGhhdCByZXN0cmljdHMgdGhlIHJlc3VsdHMgbnVtYmVyIHRoYXQgc2hvdWxkIGJlIHNob3duLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBidXR0b25zTWFuYWdlck9wdGlvbnMgIEFuIG9iamVjdCB3aXRoIHRoZSBtYWluIG9wdGlvbnMgZm9yIEJ1dHRvbnNNYW5hZ2VyIHN1YmNvbXBvbmVudC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgQnV0dG9uc01hbmFnZXIgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuICBcbiAqIFx0QG9wdGlvbiB7Ym9vbGVhbn0gW2hlbHBUZXh0XVxuICogICAgXHRcdFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyBhIGhlbHAgdGV4dCBvdmVyIHRoZSBidXR0b25zLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFtidXR0b25zU3R5bGU9J1NRVUFSRURfM0QnICwgJ1JPVU5EX0ZMQVQnIG9yICdJQ09OU19PTkxZJy4gSUNPTlNfT05MWSBieSBkZWZhdWx0Ll1cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBidXR0b25zIHZpc3VhbGlzYXRpb24gdHlwZS5cbiAqIFx0QG9wdGlvbiB7Ym9vbGVhbn0gW3ByZXNzZWRVbmRlcmxpbmVzXVxuICogICAgXHRcdFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyB1bmRlcmxpbmVzIHdoZW4geW91IHByZXNzIGEgYnV0dG9uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYWdlTWFuYWdlck9wdGlvbnMgIEFuIG9iamVjdCB3aXRoIHRoZSBtYWluIG9wdGlvbnMgZm9yIFBhZ2VNYW5hZ2VyIHN1YmNvbXBvbmVudC5cbiAqXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0Q2xhc3M9J1lvdXJPd25DbGFzcyddXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSBvZiB0aGUgRElWIHdoZXJlIHRoZSBQYWdlTWFuYWdlciBvYmplY3Qgc2hvdWxkIGJlIGRpc3BsYXllZC4gIFxuICovXG4vL2Z1bmN0aW9uIEJpb0NpZGVyICh0YXJnZXRJZCwgY29udGV4dERhdGFMaXN0T3B0aW9ucywgYnV0dG9uc01hbmFnZXJPcHRpb25zLHBhZ2VNYW5hZ2VyT3B0aW9ucykge1xudmFyIGJpb2NpZGVyID0gZnVuY3Rpb24gKHRhcmdldElkLCBjb250ZXh0RGF0YUxpc3RPcHRpb25zLCBidXR0b25zTWFuYWdlck9wdGlvbnMscGFnZU1hbmFnZXJPcHRpb25zKSB7XG5cdFxuXHR0aGlzLnRhcmdldElkID0gdGFyZ2V0SWQ7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9ucyA9IHt9O1xuXHR0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyA9IHt9O1xuXHR0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9ucyA9IHt9O1xuXHRcblx0dmFyIGRlZmF1bHRDb250ZXh0RGF0YUxpc3RPcHRpb25zID0ge1xuXHRcdHRhcmdldElkOiAnY29udGV4dF9kYXRhX2xpc3QnLFxuXHRcdHRhcmdldENsYXNzOiAnY29udGV4dF9kYXRhX2xpc3QnLFxuXHRcdHVzZXJUZXh0VGFnQ29udGFpbmVyOiAnaDEnLFxuXHRcdG51bWJlclJlc3VsdHM6IDUsXG5cdFx0ZGlzcGxheVN0eWxlOiBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEUsXG5cdFx0dXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXI6ICdjb250ZXh0X2Rlc2NyaXB0aW9uX2NvbnRhaW5lcidcblx0fTtcblx0XG5cdHZhciBkZWZhdWx0QnV0dG9uc01hbmFnZXJPcHRpb25zID0ge1xuXHRcdHRhcmdldElkOiAnYnV0dG9uc19tYW5hZ2VyX2NvbnRhaW5lcicsXG5cdFx0dGFyZ2V0Q2xhc3M6ICdidXR0b25fY29udGFpbmVyJyxcblx0XHRoZWxwVGV4dDogdHJ1ZSxcblx0XHRidXR0b25zU3R5bGU6Y29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFksXG5cdFx0cHJlc3NlZFVuZGVybGluZXM6dHJ1ZVxuXHR9O1xuXHRcblx0dmFyIGRlZmF1bHRQYWdlTWFuYWdlck9wdGlvbnMgPSB7XG5cdFx0dGFyZ2V0Q2xhc3M6ICdwYWdlX21hbmFnZXJfY29udGFpbmVyJyxcblx0XHR0YXJnZXRJZDogJ3BhZ2VfbWFuYWdlcl9jb250YWluZXInXG5cdH1cblx0XG5cdFxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0Q29udGV4dERhdGFMaXN0T3B0aW9ucyl7XG5cdCAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV0gPSBkZWZhdWx0Q29udGV4dERhdGFMaXN0T3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIGNvbnRleHREYXRhTGlzdE9wdGlvbnMpe1xuXHQgICAgIHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1trZXldID0gY29udGV4dERhdGFMaXN0T3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRCdXR0b25zTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV0gPSBkZWZhdWx0QnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gYnV0dG9uc01hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldID0gYnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRQYWdlTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMucGFnZU1hbmFnZXJPcHRpb25zW2tleV0gPSBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gcGFnZU1hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldID0gcGFnZU1hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0XG5cdFxuICAgICAgICBcbn1cblxuXG4vKiogXG4gKiBCaW9DaWRlciBmdW5jdGlvbmFsaXR5LlxuICogXG4gKiBAY2xhc3MgQmlvQ2lkZXJcbiAqIFxuICovXG5iaW9jaWRlci5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBiaW9jaWRlcixcblxuXHQgICAgICBcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBhbmQgZHJhdyB0aGVtLlxuXHQgKi8gICAgICAgIFxuXHRkcmF3IDogZnVuY3Rpb24gKCl7XG5cdFx0XHRcblx0XHR0aGlzLmluaXRDb250YWluZXJzKCk7XG5cdFx0XHRcdFx0XHRcblx0XHR2YXIgY29udGV4dERhdGFMaXN0SW5zdGFuY2UgPSBuZXcgQ29udGV4dERhdGFMaXN0KHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9ucyk7XG5cdFx0XG5cdFx0Ly8gYmVmb3JlIGluaXRpYWxpc2luZyB0aGUgbWFpbiBjb21wb25lbnQsIHdlIHNob3VsZCBpbml0aWFsaXNlIGl0cyAncGx1Z2lucycuXG5cdFx0dmFyIGJ1dHRvbnNJbnN0YW5jZSA9IG5ldyBCdXR0b25zTWFuYWdlcihjb250ZXh0RGF0YUxpc3RJbnN0YW5jZSx0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyk7XG5cdFx0YnV0dG9uc0luc3RhbmNlLmJ1aWxkUHJlc3NlZEJ1dHRvbnMoKTtcblx0XHRcblx0XHR2YXIgcGFnZU1hbmFnZXJJbnN0YW5jZSA9IG5ldyBQYWdlTWFuYWdlcihjb250ZXh0RGF0YUxpc3RJbnN0YW5jZSx0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9ucyk7XG5cdFx0cGFnZU1hbmFnZXJJbnN0YW5jZS5idWlsZCgpO1xuXHRcdFxuXHRcdFxuXHRcdC8vdHJpZ2dlcnMgdGhlIGNvbnRleHR1YWxpc2VkIGRhdGEgbG9hZGluZyBwcm9jZXNzXG5cdFx0Y29udGV4dERhdGFMaXN0SW5zdGFuY2UuZHJhd0NvbnRleHREYXRhTGlzdCgpO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGNyZWF0ZSBvciByZXVzZSBpbnRlcm5hbCBjb250YWluZXJzIG9mIGVhY2ggc3ViY29tcG9uZW50LlxuXHQgKi9cblx0aW5pdENvbnRhaW5lcnM6IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zWyd0YXJnZXRJZCddLFxuXHRcdFx0XHR0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMucGFnZU1hbmFnZXJPcHRpb25zWyd0YXJnZXRJZCddLFxuXHRcdFx0XHR0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zWyd0YXJnZXRDbGFzcyddKTtcblx0XHRcblx0XHRcblx0XHRcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gY3JlYXRlIG9yIHJldXNlIGludGVybmFsIGNvbnRhaW5lcnMgb2Ygb25lIHN1YmNvbXBvbmVudC5cblx0ICogQHBhcmFtIGdsb2JhbENvbnRhaW5lcklkIHtzdHJpbmd9IElkIG9mIHRoZSBCaW9DaWRlciBkaXYgY29udGFpbmVyLlxuXHQgKiBAcGFyYW0gY29udGFpbmVySWQge3N0cmluZ30gSWQgb2YgdGhlIGxvY2FsIHN1YmNvbXBvbmVudCBkaXYgY29udGFpbmVyLlxuXHQgKiBAcGFyYW0gY29udGFpbmVyQ2xhc3Mge3N0cmluZ30gQ2xhc3MgbmFtZSB0byBhcHBseSB0byB0aGUgc3ViY29tcG9uZW50IGNvbnRhaW5lci5cblx0ICovXG5cdGluaXRDb250YWluZXIgOiBmdW5jdGlvbihnbG9iYWxDb250YWluZXJJZCwgY29udGFpbmVySWQsIGNvbnRhaW5lckNsYXNzKXtcblx0XHR2YXIgZ2xvYmFsQ29udGFpbmVyRXhpc3RzID0gZmFsc2U7XG5cdFx0dmFyIGxvY2FsQ29udGFpbmVyRXhpc3RzID0gZmFsc2U7XG5cdFx0dmFyIGdsb2JhbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdsb2JhbENvbnRhaW5lcklkKTtcblx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyICE9IHVuZGVmaW5lZCB8fCBnbG9iYWxDb250YWluZXIgIT0gbnVsbCl7XG5cdFx0XHRnbG9iYWxDb250YWluZXJFeGlzdHMgPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAoY29udGFpbmVySWQgIT0gdW5kZWZpbmVkICYmIGNvbnRhaW5lcklkICE9IG51bGwpIHtcblx0XHRcdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCk7XG5cdFx0XHRpZiAoY29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzcyk7XG5cdFx0XHR9ZWxzZXtcdC8vIG5lZWQgdG8gY3JlYXRlIHRoZSBzdWJjb250YWluZXJcblx0XHRcdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbnRhaW5lci5pZCA9IGNvbnRhaW5lcklkO1xuXHRcdFx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzcyk7XG5cdFx0XHRcdGlmIChnbG9iYWxDb250YWluZXJFeGlzdHMpIHtcblx0XHRcdFx0XHRnbG9iYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fWVsc2V7XHQvLyBpZiB3ZSBkb24ndCBoYXZlIGEgY29udGFpbmVySWQsIHdlIGNhbiB0cnkgdG8gZG8gdGhlIHNhbWUgd2l0aCB0aGUgY2xhc3NOYW1lXG5cdFx0XHR2YXIgcG9zc2libGVDb250YWluZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjb250YWluZXJDbGFzcyk7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gbnVsbDtcblx0XHRcdGlmIChwb3NzaWJsZUNvbnRhaW5lcnMgIT0gbnVsbCAmJiBwb3NzaWJsZUNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb250YWluZXIgPSBwb3NzaWJsZUNvbnRhaW5lcnNbMF07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChjb250YWluZXIgIT0gdW5kZWZpbmVkICYmIGNvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRcdC8vIG5vdGhpbmcgdG8gZG9cblx0XHRcdH1lbHNle1x0Ly8gbmVlZCB0byBjcmVhdGUgdGhlIHN1YmNvbnRhaW5lclxuXHRcdFx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0Y29udGFpbmVyLmlkID0gY29udGFpbmVySWQ7XG5cdFx0XHRcdGlmIChnbG9iYWxDb250YWluZXJFeGlzdHMpIHtcblx0XHRcdFx0XHRnbG9iYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHR9XG4gICAgICAgIFxuICAgICAgICBcbn1cbiAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gYmlvY2lkZXI7XG4gICJdfQ==
=======
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0J1dHRvbnNNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db21tb25EYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9Db250ZXh0RGF0YUxpc3QuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0RhdGFNYW5hZ2VyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9FbGl4aXJFdmVudERhdGEuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpIHNpbXBsaWZ5aW5nL2pzL0VsaXhpclJlZ2lzdHJ5RGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvRWxpeGlyVHJhaW5pbmdEYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9qcy9QYWdlTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikgc2ltcGxpZnlpbmcvanMvY29uc3RhbnRzLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKSBzaW1wbGlmeWluZy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiLi9qcy9CaW9DaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdG5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcblxuLyoqIFxuICogQnV0dG9ucycgZmlsdGVyaW5nIGNvbnN0cnVjdG9yLlxuICogXG4gKiBAY2xhc3MgQnV0dG9uc01hbmFnZXJcbiAqXG4gKiBAcGFyYW0ge0NvbnRleHREYXRhTGlzdCBPYmplY3R9IFJlZmVyZW5jZSB0byBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGluIG9yZGVyIHRvIG1hbmFnZSBpdHMgZmlsdGVycy5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIEJ1dHRvbnNNYW5hZ2VyIGNvbXBvbmVudC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3RhcmdldD0nWW91ck93bkRpdklkJ11cbiAqICAgIElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW2hlbHBUZXh0XVxuICogICAgVHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IGEgaGVscCB0ZXh0IG92ZXIgdGhlIGJ1dHRvbnMuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFtidXR0b25zU3R5bGU9J1NRVUFSRURfM0QnICwgJ1JPVU5EX0ZMQVQnLCAnSUNPTlNfT05MWScgb3IgJ0VMSVhJUicuIElDT05TX09OTFkgYnkgZGVmYXVsdC5dXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBidXR0b25zIHZpc3VhbGlzYXRpb24gdHlwZS5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtwcmVzc2VkVW5kZXJsaW5lc11cbiAqICAgIFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyB1bmRlcmxpbmVzIHdoZW4geW91IHByZXNzIGEgYnV0dG9uLlxuICovXG52YXIgQnV0dG9uc01hbmFnZXIgPSBmdW5jdGlvbihjb250ZXh0RGF0YUxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG5cdFx0aGVscFRleHQ6IHRydWUsXG5cdFx0YnV0dG9uc1N0eWxlOiBjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfU1FVQVJFRF8zRCxcblx0XHRwcmVzc2VkVW5kZXJsaW5lczogZmFsc2Vcblx0fTtcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdFx0dGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1x0XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG5cdFx0dGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuXHR9XG4gICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0ID0gY29udGV4dERhdGFMaXN0O1xuXHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEgPSBbXTtcblx0Ly8gQkFTSUMgQlVUVE9OJ1MgREFUQTogTEFCRUwsIElOVEVSTkFMIENMQVNTIE5BTUUsIElOVEVSTkFMIE5BTUUgQU5EIEhFTFAgVEVYVFxuXHRpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX0VMSVhJUiA9PSB0aGlzLmJ1dHRvbnNTdHlsZSl7XG5cdFx0dGhpcy5idXR0b25zQmFzaWNEYXRhLnB1c2goWydEYXRhJywnZGF0YWJhc2UnLCdkYXRhYmFzZScsJ0RhdGEnXSxcblx0XHRcdFx0ICAgWydJbnRlcm9wZXJhYmlsaXR5JywnZXZlbnRzJywnRXZlbnQnLCdJbnRlcm9wZXJhYmlsaXR5J10sXG5cdFx0XHRcdCAgIFsnVG9vbHMnLCd0b29scycsJ1Rvb2wnLCdUb29scyddLFxuXHRcdFx0XHQgICBbJ1RyYWluaW5nJywndHJhaW5pbmdfbWF0ZXJpYWwnLCdUcmFpbmluZyBNYXRlcmlhbCcsJ1RyYWluaW5nJ11cblx0XHQpO1xuXHR9ZWxzZXtcblx0XHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEucHVzaChbJ0RhdGFiYXNlJywnZGF0YWJhc2UnLCdkYXRhYmFzZScsJ0RhdGFiYXNlcyddLFxuXHRcdFx0XHQgICBbJ0V2ZW50cycsJ2V2ZW50cycsJ0V2ZW50JywnRXZlbnRzJ10sXG5cdFx0XHRcdCAgIFsnVG9vbHMnLCd0b29scycsJ1Rvb2wnLCdUb29scyddLFxuXHRcdFx0XHQgICBbJ1RyYWluaW5nIG1hdGVyaWFscycsJ3RyYWluaW5nX21hdGVyaWFsJywnVHJhaW5pbmcgTWF0ZXJpYWwnLCdUcmFpbmluZyBtYXRlcmlhbHMnXVxuXHRcdCk7XG5cdH1cblx0dGhpcy5jb250ZXh0RGF0YUxpc3QucmVnaXN0ZXJPbkxvYWRlZEZ1bmN0aW9uKHRoaXMsIHRoaXMudXBkYXRlQnV0dG9uc1N0YXR1cyk7XG59XG5cbi8qKlxuICogICAgICBCdXR0b25zTWFuYWdlciBjbGFzcy4gUmVwcmVzZW50cyBhIHNldCBvZiBmaWx0ZXJzIHNlbGVjdGFibGUgdmlhIGJ1dHRvbnMgYnkgdXNlcnMuXG4gKiBcbiAqICAgICAgQGNsYXNzIEJ1dHRvbnNNYW5hZ2VyXG4gKiAgICAgIFxuICovXG5CdXR0b25zTWFuYWdlci5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBCdXR0b25zTWFuYWdlcixcbiAgICAgICAgYnV0dG9ucyA6IFtdLFxuXHRcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIGJ1dHRvbnMgc3RhdHVzIGhhdmluZyBpbnRvIGFjY291bnQgQ29udGV4dERhdGFMaXN0IHN0YXR1c1xuICAgICAgICAgKi8gICAgICAgIFxuXHR1cGRhdGVCdXR0b25zU3RhdHVzIDogZnVuY3Rpb24gKCl7XG5cdFx0XG5cdFx0Ly8gV2UgZHJhdyBzbGlnaHRseSBzb2Z0ZXIgYnV0dG9ucyBvZiByZXNvdXJjZSB0eXBlcyB3aXRob3V0IGFueSByZXN1bHRzXG5cdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUgIT0gbnVsbCkge1xuXHRcdFx0Zm9yKHZhciBwcm9wZXJ0eSBpbiB0aGlzLmNvbnRleHREYXRhTGlzdC5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlKXtcblx0XHRcdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5Q291bnQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlW3Byb3BlcnR5XTtcblx0XHRcdFx0XHR2YXIgbXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0dGhpcy5zZXRCdXR0b25Bc3BlY3RBc1Jlc3VsdHMobXlCdXR0b24scHJvcGVydHlDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdH1cblx0fSxcbiAgICAgICAgXG4gICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYnV0dG9ucyBhbmQgZHJhdyB0aGVtIGludG8gdGhlIGVsZW1lbnQgd2l0aCBpZCAndGFyZ2V0SWQnXG4gICAgICAgICAqLyAgICAgICAgXG5cdGJ1aWxkQnV0dG9ucyA6IGZ1bmN0aW9uICgpe1xuXHRcdHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldElkKTtcblx0XHRpZiAodGFyZ2V0ID09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT0gbnVsbCl7XG5cdFx0XHRyZXR1cm47XHRcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHRoaXMuaGVscFRleHQpe1xuXHRcdFx0dmFyIGhlbHBUZXh0Q29udGFpbmVyID0gdGhpcy5jcmVhdGVCdXR0b25zSGVscFRleHQoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChoZWxwVGV4dENvbnRhaW5lcik7XG5cdFx0fVxuXHRcdHZhciByb3dDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRyb3dDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19yb3dfY29udGFpbmVyJyk7XG5cdFx0XG5cdFx0aWYgKHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5sZW5ndGg+MCkge1xuXHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3QudG90YWxGaWx0ZXJzID0gW107XG5cdFx0fVxuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbnNCYXNpY0RhdGFbaV07XG5cdFx0XHR2YXIgbXlCdXR0b24gPSBudWxsO1xuXHRcdFx0aWYgKGNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9ST1VORF9GTEFUID09IHRoaXMuYnV0dG9uc1N0eWxlKSB7XG5cdFx0XHRcdG15QnV0dG9uID0gdGhpcy5jcmVhdGVSb3VuZEZsYXRCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fWVsc2UgaWYgKGNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9JQ09OU19PTkxZID09IHRoaXMuYnV0dG9uc1N0eWxlKXtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZUljb25Pbmx5QnV0dG9uKGJ1dHRvbkRhdGFbMF0sYnV0dG9uRGF0YVsxXSxidXR0b25EYXRhWzJdKTtcblx0XHRcdH1lbHNlIGlmIChjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfRUxJWElSID09IHRoaXMuYnV0dG9uc1N0eWxlKXtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZUVsaXhpckJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZVNxdWFyZWQzRGRCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG15QnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRteUJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX2NlbGxfY29udGFpbmVyJyk7XG5cdFx0XHRteUJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChteUJ1dHRvbik7XG5cdFx0XHRyb3dDb250YWluZXIuYXBwZW5kQ2hpbGQobXlCdXR0b25Db250YWluZXIpO1xuXG5cdFx0XHR0aGlzLmJ1dHRvbnMucHVzaChteUJ1dHRvbik7XG5cdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbEZpbHRlcnMucHVzaChidXR0b25EYXRhWzJdKTtcblx0XHR9XG5cdFx0XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHJvd0NvbnRhaW5lcik7XG5cdFx0XG5cdFx0aWYgKHRoaXMucHJlc3NlZFVuZGVybGluZXMpe1xuXHRcdFx0dmFyIHVuZGVybGluZXNDb250YWluZXIgPSB0aGlzLmNyZWF0ZUJ1dHRvbnNVbmRlcmxpbmVDb250YWluZXIoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZCh1bmRlcmxpbmVzQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG5cdH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBDcmVhdGVzIHByZXNzZWQgYnV0dG9ucyBhbmQgZHJhdyB0aGVtIGludG8gdGhlIGVsZW1lbnQgd2l0aCBpZCAndGFyZ2V0SWQnXG4gICAgICAgICovICBcbiAgICAgICAgYnVpbGRQcmVzc2VkQnV0dG9ucyA6IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdGhpcy5idWlsZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0J1dHRvblByZXNzZWQodGhpcy5idXR0b25zW2ldKSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0J1dHRvbkNsaWNrKHRoaXMuYnV0dG9uc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG5cbiAgICAgICAgfSxcblx0XG5cdFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB3aXRoICdST1VORF9GTEFUJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZVJvdW5kRmxhdEJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuICAgICAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG4gICAgICAgICAgICBidXR0b24udGl0bGUgPSBsYWJlbDtcbiAgICAgICAgICAgIGJ1dHRvbi5uYW1lID0gaW50ZXJuYWxOYW1lO1xuXHQgICAgYnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuICAgICAgICAgICAgYnV0dG9uLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIHZhciBteUJ1dHRvbnNNYW5hZ2VyID0gdGhpcztcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHQgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3JvdW5kX2ZsYXQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB3aXRoICdTUVVBUkVEXzNEJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZVNxdWFyZWQzRGRCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYnV0dG9uLnRpdGxlID0gbGFiZWw7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0ICAgIGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbi5ocmVmID0gXCIjXCI7XG4gICAgICAgICAgICB2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0ICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzcXVhcmVkXzNkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgndW5wcmVzc2VkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcbiAgICAgICAgICAgIHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnSUNPTl9PTkxZJyBhc3BlY3QuXG4gICAgICAgICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IC0gVGl0bGUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxDbGFzcyB7U3RyaW5nfSAtIFNwZWNpZmljIGNsYXNzTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LlxuICAgICAgICAqIEBwYXJhbSBpbnRlcm5hbE5hbWUge1N0cmluZ30gLSBOYW1lIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuIEl0IHNob3VsZCBiZSBhIGZpbHRlciBuYW1lLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZUljb25Pbmx5QnV0dG9uIDogZnVuY3Rpb24obGFiZWwsIGludGVybmFsQ2xhc3MsIGludGVybmFsTmFtZSl7XG5cdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG5cdFx0YnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcblx0XHRidXR0b24udGl0bGUgPSBsYWJlbDtcblx0XHRidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0XHRidXR0b24uaWQgPSBpbnRlcm5hbE5hbWU7XG5cdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHR2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG5cdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcblx0XHQgICAgbXlCdXR0b25zTWFuYWdlci5maWx0ZXIodGhpcyk7XG5cdFx0ICAgIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpY29uc19vbmx5Jyk7XG5cdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuXHRcdHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuXHRcblx0XG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHdpdGggJ0VMSVhJUicgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVFbGl4aXJCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYnV0dG9uLnRpdGxlID0gbGFiZWw7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0ICAgIGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbi5ocmVmID0gXCIjXCI7XG4gICAgICAgICAgICB2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0ICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdlbGl4aXInKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGludGVybmFsQ2xhc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjsgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNoYW5nZXMgdGhlIHN0YXR1cyBvZiB0aGUgYnV0dG9uIGFuZCBleGVjdXRlcyB0aGUgcmVkcmF3biBvZiB0aGUgQ29udGV4dERhdGFMaXN0XG4gICAgICAgICogb2JqZWN0IGhhdmluZyBpbnRvIGFjY291bnQgY2hvc2VuIGZpbHRlcnMuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGJlIHByZXNzZWQvdW5wcmVzc2VkLlxuICAgICAgICAqLyAgXG4gICAgICAgIGZpbHRlcjogZnVuY3Rpb24gKG15QnV0dG9uKXtcbiAgICAgICAgICAgIHRoaXMuc2hvd0J1dHRvbkNsaWNrKG15QnV0dG9uKTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRGaWx0ZXJzID0gdGhpcy5nZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucygpO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QudG90YWxEcmF3Q29udGV4dERhdGFMaXN0KCk7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNoYW5nZXMgdGhlIGFzcGVjdCBvZiBvbmUgYnV0dG9uIGRlcGVuZGluZyBvbiBpZiBpdCBoYXMgYW55IGFzc29jaWF0ZWQgcmVzdWx0IG9yIG5vdC5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gYmUgbW9kaWZpZWQuXG4gICAgICAgICogQHBhcmFtIG51bWJlclJlc3VsdHMge0ludGVnZXJ9IC0gTnVtYmVyIG9mIG9jY3VycmVuY2VzIGFzc29jaWF0ZWQgdG8gdGhlIGJ1dHRvbi5cbiAgICAgICAgKi8gXG4gICAgICAgIHNldEJ1dHRvbkFzcGVjdEFzUmVzdWx0czogZnVuY3Rpb24gKG15QnV0dG9uLCBudW1iZXJSZXN1bHRzKXtcblx0XHRpZiAobXlCdXR0b24gPT0gdW5kZWZpbmVkIHx8IG15QnV0dG9uID09IG51bGwpIHtcblx0XHRcdHJldHVybjtcdCAgICBcblx0XHR9XG5cdFx0dmFyIGVtcHR5VGl0bGVTdWZmaXggPSAnIChubyByZXN1bHRzKSc7XG5cdFx0aWYgKG51bWJlclJlc3VsdHMgPT0gMCkge1xuXHRcdFx0bXlCdXR0b24uY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcblx0XHRcdGlmIChteUJ1dHRvbi50aXRsZS5pbmRleE9mKGVtcHR5VGl0bGVTdWZmaXgpPT0tMSkge1xuXHRcdFx0XHRteUJ1dHRvbi50aXRsZSA9IG15QnV0dG9uLnRpdGxlICsgZW1wdHlUaXRsZVN1ZmZpeDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1lbHNle1xuXHRcdFx0bXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcblx0XHRcdGlmIChteUJ1dHRvbi50aXRsZS5pbmRleE9mKGVtcHR5VGl0bGVTdWZmaXgpPi0xKSB7XG5cdFx0XHRcdG15QnV0dG9uLnRpdGxlLnJlcGxhY2UoZW1wdHlUaXRsZVN1ZmZpeCwnJyk7XG5cdFx0XHR9XG5cdFx0fVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjaGFuZ2VzIHRoZSBhc3BlY3Qgb2Ygb25lIGJ1dHRvbiBmcm9tIHByZXNzZWQgdG8gdW5wcmVzc2VkLCBvciB2aWNlIHZlcnNhLlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBiZSBwcmVzc2VkL3VucHJlc3NlZC5cbiAgICAgICAgKi8gXG4gICAgICAgIHNob3dCdXR0b25DbGljazogZnVuY3Rpb24gKG15QnV0dG9uKXtcblx0XHRteUJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwidW5wcmVzc2VkXCIpO1xuXHRcdG15QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJwcmVzc2VkXCIpO1xuXHRcdGlmICh0aGlzLnByZXNzZWRVbmRlcmxpbmVzKSB7XG5cdFx0XHR2YXIgdW5kZXJsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobXlCdXR0b24uaWQrXCJfdW5kZXJsaW5lXCIpO1xuXHRcdFx0aWYgKHRoaXMuaXNCdXR0b25QcmVzc2VkKG15QnV0dG9uKSkge1xuXHRcdFx0XHR1bmRlcmxpbmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dW5kZXJsaW5lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGlmIHRoZSBidXR0b24gcGFzc2VkIGFzIGFyZ3VtZW50IGlzIHByZXNzZWQgb3Igbm90LlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBjaGVjayBpdHMgc3RhdHVzLlxuICAgICAgICAqIHtCb29sZWFufSAtIFJldHVybnMgaWYgbXlCdXR0b24gaXMgcHJlc3NlZCBvciBub3QuXG4gICAgICAgICovXG4gICAgICAgIGlzQnV0dG9uUHJlc3NlZDogZnVuY3Rpb24gKG15QnV0dG9uKXtcbiAgICAgICAgICAgIGlmICghbXlCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKFwicHJlc3NlZFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1lbHNlIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGFjdGl2ZSBmaWx0ZXJzIHJlbGF0ZWQgd2l0aCBwcmVzc2VkIGJ1dHRvbnMuXG4gICAgICAgICoge0FycmF5fSAtIEN1cnJlbnQgYXBwbGljYWJsZSBmaWx0ZXJzLlxuICAgICAgICAqL1xuICAgICAgICBnZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgcHJlc3NlZEJ1dHRvbnMgPSB0aGlzLmdldFByZXNzZWRCdXR0b25zKCk7XG4gICAgICAgICAgICB2YXIgZmlsdGVycyA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxwcmVzc2VkQnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzLnB1c2gocHJlc3NlZEJ1dHRvbnNbaV0ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyczsgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYWxsIHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKiB7QXJyYXl9IC0gQ3VycmVudCBwcmVzc2VkIGJ1dHRvbnMuXG4gICAgICAgICovXG4gICAgICAgIGdldFByZXNzZWRCdXR0b25zIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwcmVzc2VkQnV0dG9ucyA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNCdXR0b25QcmVzc2VkKHRoaXMuYnV0dG9uc1tpXSkpe1xuICAgICAgICAgICAgICAgICAgICBwcmVzc2VkQnV0dG9ucy5wdXNoKHRoaXMuYnV0dG9uc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByZXNzZWRCdXR0b25zO1xuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGFyYWdyYXBoIGVsZW1lbnQgd2l0aCBzcGVjaWZpYyB0ZXh0IGFib3V0IGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25cblx0KiAgIHtIVE1MIE9iamVjdH0gLSBkaXYgZWxlbWVudCB3aXRoIGhlbHAgcmVsYXRlZCB0byBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9ucy5cbiAgICAgICAgKi9cblx0Y3JlYXRlQnV0dG9uc0hlbHBUZXh0IDogZnVuY3Rpb24oKXtcblx0XHR2YXIgaGVscF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRoZWxwX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3Jvd19jb250YWluZXInKTtcblx0XHRcblx0XHRmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9uc0Jhc2ljRGF0YS5sZW5ndGg7aSsrKXtcblx0XHRcdHZhciBidXR0b25EYXRhID0gdGhpcy5idXR0b25zQmFzaWNEYXRhW2ldO1xuXHRcdFx0XG5cdFx0XHR2YXIgbXlUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0bXlUZXh0LmlubmVySFRNTCA9IGJ1dHRvbkRhdGFbM107XG5cdFx0XHRteVRleHQuY2xhc3NMaXN0LmFkZCgnYnV0dG9uX2hlbHAnKTtcblx0XHRcdGhlbHBfY29udGFpbmVyLmFwcGVuZENoaWxkKG15VGV4dCk7XHRcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIGhlbHBfY29udGFpbmVyO1xuXHR9LFxuXHRcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHBhcmFncmFwaCBlbGVtZW50IHdpdGggc3BlY2lmaWMgdGV4dCBhYm91dCBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9uXG5cdCogICB7SFRNTCBPYmplY3R9IC0gZGl2IGVsZW1lbnQgd2l0aCBoZWxwIHJlbGF0ZWQgdG8gZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvbnMuXG4gICAgICAgICovXG5cdGNyZWF0ZUJ1dHRvbnNVbmRlcmxpbmVDb250YWluZXIgOiBmdW5jdGlvbigpe1xuXHRcdHZhciB1bmRlcmxpbmVzX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHVuZGVybGluZXNfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfcm93X2NvbnRhaW5lcicpO1xuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbnNCYXNpY0RhdGFbaV07XG5cdFx0XHR2YXIgbXlUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0bXlUZXh0LmlkID0gYnV0dG9uRGF0YVsyXStcIl91bmRlcmxpbmVcIjtcblx0XHRcdG15VGV4dC5jbGFzc0xpc3QuYWRkKCdidXR0b25fdW5kZXJsaW5lJyk7XG5cdFx0XHRcblx0XHRcdHZhciBteVVuZGVybGluZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bXlVbmRlcmxpbmVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc191bmRlcmxpbmVfY2VsbF9jb250YWluZXInKTtcblx0XHRcdG15VW5kZXJsaW5lQ29udGFpbmVyLmFwcGVuZENoaWxkKG15VGV4dCk7XG5cdFx0XHR1bmRlcmxpbmVzX2NvbnRhaW5lci5hcHBlbmRDaGlsZChteVVuZGVybGluZUNvbnRhaW5lcik7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiB1bmRlcmxpbmVzX2NvbnRhaW5lcjtcblx0fVxufVxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdC8vc3R5bGUgb2YgdmlzdWFsaXphdGlvblxuXHRTUVVBUkVEXzNEOlwiU1FVQVJFRF8zRFwiLFxuXHRST1VORF9GTEFUOlwiUk9VTkRfRkxBVFwiLFxuXHRJQ09OU19PTkxZOlwiSUNPTlNfT05MWVwiXG59O1xuXG5mb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICBCdXR0b25zTWFuYWdlcltrZXldID0gQ09OU1RTW2tleV07XG59XG4qLyAgICBcbiAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBCdXR0b25zTWFuYWdlcjtcbiAgICAgIFxuICAiLCJ2YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcblxuLyoqXG4gKiAgICAgICAgICBDb21tb25EYXRhIGNvbnN0cnVjdG9yXG4gKiAgICAgICAgICBqc29uRGF0YSB7T2JqZWN0fSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggdGhlIG9yaWdpbmFsIGRhdGEgcmV0cmlldmVkIGJ5IG91ciBkYXRhIHNlcnZlci5cbiAqICAgICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciB0aGlzIHN0cnVjdHVyZS5cbiAqICAgICAgICAgICAgICAgICAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J3VybCddXG4gKiAgICAgICAgICAgICAgICAgICAgICBVUkwgd2l0aCB0aGUgdXNlcidzIHBhZ2UgZG9tYWluLlxuICovXG52YXIgQ29tbW9uRGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudERvbWFpbjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlVHlwZVNldDogY29uc3RhbnRzLlJlc291cmNlVHlwZVNldHNfRkxBVCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG59O1xuXG4vKipcbiAqICAgICAgICAgIENvbW1vbiBwYXJlbnQgY2xhc3MgdGhhdCBzaG91bGQgYmUgaW5oZXJpdGVkIGJ5IGFsbCBzcGVjaWZpYyBjbGFzc2VzIHRvIGJlIG1hbmFnZWQgb24gdGhpcyBjb21wb25lbnQuXG4gKi9cbkNvbW1vbkRhdGEucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgY29uc3RydWN0b3I6IENvbW1vbkRhdGEsXG4gICAgICAgICAgICBTT1VSQ0VfRklFTEQgICAgICAgICAgICAgICAgOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgUkVTT1VSQ0VfVFlQRV9GSUVMRCAgICAgICAgIDogXCJyZXNvdXJjZV90eXBlXCIsXG4gICAgICAgICAgICBUSVRMRV9GSUVMRCAgICAgICAgICAgICAgICAgOiBcInRpdGxlXCIsXG4gICAgICAgICAgICBUT1BJQ19GSUVMRCAgICAgICAgICAgICAgICAgOiBcImZpZWxkXCIsXG4gICAgICAgICAgICBERVNDUklQVElPTl9GSUVMRCAgICAgICAgICAgOiBcImRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICBMSU5LX0ZJRUxEICAgICAgICAgICAgICAgICAgOiBcImxpbmtcIixcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcmV0cmlldmVzIHRoZSBwcm9wZXIgY2xhc3MgbmFtZSBiYXNlZCBvbiB0aGUgcmVhbCByZXNvdXJjZSB0eXBlXG4gICAgICAgICAgICBtYXBwaW5nUmVzb3VyY2VUeXBlQ2xhc3NlcyA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdUb29sJyAgICAgICAgICAgICAgICAgIDondG9vbHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1dvcmtmbG93JyAgICAgICAgICAgICAgOid3b3JrZmxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnRGF0YWJhc2UnICAgICAgICAgICAgICA6J2RhdGFiYXNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdUcmFpbmluZyBNYXRlcmlhbCcgICAgIDondHJhaW5pbmdfbWF0ZXJpYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0V2ZW50JyAgICAgICAgICAgICAgICAgOidldmVudHMnXG4gICAgICAgICAgICB9LFxuICAgICBcbiAgICAgICAgICAgIC8qKiAgICAgICAgIFVUSUxJVFkgRlVOQ1RJT05TIFRPIEdFVCBGSUVMRCdTIFZBTFVFICAgICAgICAgICAgICAgICAgICAqL1xuICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgQXV4aWxpYXIgZnVuY3Rpb24gdG8gZ2V0IGVhc2lseSBhbnkga2luZCBvZiBkYXRhIHByZXNlbnQgaW4gdGhlIGludGVybmFsXG4gICAgICAgICAgICAgKiAgICAgICAgICBkYXRhIHN0cnVjdHVyZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBmaWVsZE5hbWUge1N0cmluZ30gLSBOYW1lIG9mIHRoZSBmaWVsZCB0byBiZSByZXR1cm5lZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyaXNlZFZhbHVlIDogZnVuY3Rpb24oZmllbGROYW1lKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmpzb25EYXRhICE9PSB1bmRlZmluZWQgJiYgdGhpcy5qc29uRGF0YSAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuanNvbkRhdGFbZmllbGROYW1lXTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gbWFuZGF0b3J5IGZpZWxkc1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHNvdXJjZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgc291cmNlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRTb3VyY2VWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5TT1VSQ0VfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhbGwgcmVzb3VyY2UgdHlwZXMgcHJlc2VudCBpbiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtBcnJheX0gLSBBcnJheSBvZiBzdHJpbmdzIHdpdGggcmVzb3VyY2UgdHlwZXJzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UmVzb3VyY2VUeXBlVmFsdWVzIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlJFU09VUkNFX1RZUEVfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgU29tZXRpbWVzIGNhbiBiZSBkdXBsaWNhdGUgcmVzb3VyY2UgdHlwZXMuXG4gICAgICAgICAgICAgKiAgICAgICAgICBUaGlzIGZ1bmN0aW9uIG9ubHkgcmV0dXJucyB1bmlxdWUgcmVzb3VyY2UgdHlwZXMuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIHVuaXF1ZSByZXNvdXJjZSB0eXBlcnMgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRVbmlxdWVSZXNvdXJjZVR5cGVWYWx1ZXMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldFJlc291cmNlVHlwZVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXF1ZVJlc291cmNlVHlwZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmVzb3VyY2VUeXBlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghICh1bmlxdWVSZXNvdXJjZVR5cGVzLmluZGV4T2YocmVzb3VyY2VUeXBlc1tpXSkgPiAtMSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pcXVlUmVzb3VyY2VUeXBlcy5wdXNoKHJlc291cmNlVHlwZXNbaV0pOyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuaXF1ZVJlc291cmNlVHlwZXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIHRoZSB0aXRsZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gVGl0bGUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFRpdGxlVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuVElUTEVfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhbGwgdG9waWMgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gVG9waWNzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VG9waWNWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5UT1BJQ19GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBvcHRpb25hbCBmaWVsZHNcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgZGVzY3JpcHRpb24gYXNzb2NpYXRlZCB3aXRoIHRoaXMgZW50aXR5IChpZiBleGlzdHMpLlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBUZXh0dWFsIGRlc2NyaXB0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXREZXNjcmlwdGlvblZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkRFU0NSSVBUSU9OX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgVVJMIHRvIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgc291cmNlIG9mIHRoaXMgZW50aXR5IChpZiBleGlzdHMpLlxuICAgICAgICAgICAgICogICAgICAgICAge1N0cmluZ30gLSBTb3VyY2UncyBVUkwuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExpbmtWYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5MSU5LX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICBcbiAgICAgIFxuICAgICAgICAgICAgLyoqICAgICAgICAgU1RBTkRBUkQgRlVOQ1RJT05TIFRPIE1BTkFHRSBIVE1MIEJFSEFWSU9VUiBPRiBUSElTIEVOVElUWSAgICAgKi9cbiAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBraW5kIG9mIENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50IGluIGEgd2F5IHRoYXRcbiAgICAgICAgICAgICAqICAgICAgICAgIGRlcGVuZHMgb24gd2hhdCBraW5kIG9mIHN0eWxlIHlvdSB3YW50IGl0IHdpbGwgYmUgZHJhd24uXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gZGlzcGxheVN0eWxlIHtTdHJpbmd9IC0gT25lIGRyYXdpbmcgc3R5bGUuIEN1cnJlbnRseSBDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFIG9yIENvbnRleHREYXRhTGlzdC5GVUxMX1NUWUxFLlxuICAgICAgICAgICAgICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXREcmF3YWJsZU9iamVjdEJ5U3R5bGUgOiBmdW5jdGlvbihkaXNwbGF5U3R5bGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3BsYXlTdHlsZSA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21tb25EcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYgKGRpc3BsYXlTdHlsZSA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVsbERyYXdhYmxlT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgaW1wcm92ZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhbnkgQ29tbW9uRGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBJdCBoYXMgdG8gYmUgZXh0ZW5kZWQgYnkgZWFjaCBjaGlsZHJlbiBvYmplY3Q7IHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGNhbGxzIHRvXG4gICAgICAgICAgICAgKiAgICAgICAgICBnZXRDb21tb25EcmF3YWJsZU9iamVjdC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RnVsbERyYXdhYmxlT2JqZWN0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENvbW1vbkRyYXdhYmxlT2JqZWN0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgYW55IENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge09iamVjdH0gLSBBcnJheSB3aXRoIEhUTUwgc3RydWN0dXJlZCBjb252ZXJ0ZWQgZnJvbSB0aGlzIGVudGl0eSdzIG9yaWdpbmFsIEpTT04gc3RhdHVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRDb21tb25EcmF3YWJsZU9iamVjdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHJlc291cmNlVHlwZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9saXN0RWxlbWVudC5hcHBlbmRDaGlsZChtYWluQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGxpc3RFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RpdGxlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBBTkNIT1IgZWxlbWVudCB3aXRoICd0aXRsZScgaW5mb3JtYXRpb24gbGlua2luZyB0byB0aGUgb3JpZ2luYWwgc291cmNlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMYWJlbFRpdGxlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNMb2NhbFVybCh0aGlzLmdldExpbmtWYWx1ZSgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImV4dGVybmFsX2xpbmtcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aXRsZSA9ICdFeHRlcm5hbCBsaW5rJzsgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLHRoaXMuZ2V0TGlua1ZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFRpdGxlVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aW1lcyBkZXNjcmlwdGlvbiBoYXZlIGxvbmcgdmFsdWVzIGFuZCBpdCBzZWVtcyBtb3JlIGxpa2UgZXJyb3JzIVxuICAgICAgICAgICAgICAgICAgICAgICAgLyp2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmdldERlc2NyaXB0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aXRsZSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFyZ2V0JywnX2JsYW5rJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndG9waWNzJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBESVYgZWxlbWVudCB3aXRoIGFsbCAndG9waWNzJyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMYWJlbFRvcGljczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfdG9waWNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhd1RvcGljVmFsdWUgPSB0aGlzLmdldFRvcGljVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaW5hbFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxyYXdUb3BpY1ZhbHVlLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxTdHJpbmcgPSBmaW5hbFN0cmluZyArIHJhd1RvcGljVmFsdWVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGkrMSkgPCByYXdUb3BpY1ZhbHVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZpbmFsU3RyaW5nICs9ICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZmluYWxTdHJpbmc7IFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBzdGFuZGFyZCB0ZXh0dWFsIHdheSBvZiByZXByZXNlbnRpbmcgJ3Jlc291cmNlIHR5cGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIFNQQU4gZWxlbWVudCB3aXRoIGFsbCAncmVzb3VyY2UgdHlwZScgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxSZXNvdXJjZVR5cGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIHN0YW5kYXJkIHdheSAoYXMgYSBzZXQgb2YgaW1hZ2VzKSBvZiByZXByZXNlbnRpbmcgJ3Jlc291cmNlIHR5cGUnXG4gICAgICAgICAgICAgKiAgICAgICAgICBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBTUEFOIGVsZW1lbnQgd2l0aCBhbGwgJ3Jlc291cmNlIHR5cGUnIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHlcbiAgICAgICAgICAgICAqICAgICAgICAgIHJlcHJlc2VudGVkIGFzIHNldCBvZiBpbWFnZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEltYWdlUmVzb3VyY2VUeXBlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRVbmlxdWVSZXNvdXJjZVR5cGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmVzb3VyY2VUeXBlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZV90eXBlID0gcmVzb3VyY2VUeXBlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aXRsZSA9IHJlc291cmNlX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc3RhbnRzLlJlc291cmNlVHlwZVNldHNfRUxJWElSID09IHRoaXMucmVzb3VyY2VUeXBlU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VsaXhpcl9yZXNvdXJjZV90eXBlJyk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZsYXQgZ3JheSBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmbGF0X3Jlc291cmNlX3R5cGUnKTsgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdncmF5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3VuZCBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Jlc291cmNlX3R5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjaXJjbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLm1hcHBpbmdSZXNvdXJjZVR5cGVDbGFzc2VzW3Jlc291cmNlX3R5cGVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIGRpdiBvYmplY3Qgd2l0aCBhIHNob3J0IGRlc2NyaXB0aW9uIHRoYXQgY2FuIGJlIGV4cGFuZGVkIHRvIHNob3cgYSBsb25nZXIgZGVzY3JpcHRpb24uXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gc2hvcnRUZXh0IHtTdHJpbmd9IC0gVGV4dCBsaW5rIHRvIGhpZGUgb3IgZXhwYW5kIHRoZSBsb25nIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHQge1N0cmluZywgSFRNTCBFTEVNRU5UIG9yIEFycmF5IG9mIGJvdGh9IC0gTG9uZyBkZXNjcmlwdGlvbiBvciBIVE1MIGZpZWxkIHdpdGggYSBsb25nIGRlc2NyaXB0aW9uIG9mIHRoZSByZWNvcmQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHRDbGFzc2VzIHtBcnJheX0gLSBDbGFzc2VzIHRvIG1vZGlmeSB0aGUgYXNwZWN0IG9mIHRoZSBleHBhbmRhYmxlIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBib3RoIHNob3J0IGFuZCBmaWVsZCBkZXNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEV4cGFuZGFibGVUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0LCBsb25nVGV4dENsYXNzZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGFibGVfZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW50TnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMCAtIDApKSArIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZXMgdGhlIGxpbmsgdG8gaGlkZSBhbmQgc2hvdyB0aGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2Rpdl90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVfXCIrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2V4cGFuZHNpZ25hbCA9IFwiWytdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9oaWRlc2lnbmFsID0gXCJbLV1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgbW9yZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZVRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X3RpdGxlXycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MID1leHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MLnJlcGxhY2UodG9leHBhbmRzaWduYWwsdG9oaWRlc2lnbmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVUaXRsZS50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBoaWRlIHRoZSBpbmZvcm1hdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLmlubmVySFRNTCA9IGV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwucmVwbGFjZSh0b2hpZGVzaWduYWwsdG9leHBhbmRzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSBtb3JlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlcyB0aGUgaW50ZXJuYWwgZGl2IHdpdGggdGhlIGZ1bGwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnRlcm5hbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuY2xhc3NMaXN0LmFkZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LnNldEF0dHJpYnV0ZSgnaWQnLCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbG9uZ1RleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5pbm5lckhUTUwgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXJyYXkgb2YgSFRNTCBvYmplY3RzIG9yIHN0cmluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxvbmdUZXh0KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGxvbmdUZXh0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb25nVGV4dFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmlubmVySFRNTCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGxvbmdUZXh0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIVE1MIG9iamVjdCAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U3BhbkVsZW1lbnQgPSBsb25nVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb25nVGV4dENsYXNzZXMgIT0gdW5kZWZpbmVkICYmIGxvbmdUZXh0Q2xhc3NlcyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpQz0wO2lDPGxvbmdUZXh0Q2xhc3Nlcy5sZW5ndGg7aUMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGFuRWxlbWVudC5jbGFzc0xpc3QuYWRkKGxvbmdUZXh0Q2xhc3Nlc1tpQ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuYXBwZW5kQ2hpbGQobmV3U3BhbkVsZW1lbnQpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnRlcm5hbERpdik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgZGl2IGNvbnRhaW5lciB3aXRoIGEgbGluayB0byBhbiBhbGVydCB0byBzaG93IGEgbG9uZyBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBzaG9ydFRleHQge1N0cmluZ30gLSBUZXh0IGxpbmsgdG8gc2hvdyB0aGUgbG9uZyB0ZXh0LlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGxvbmdUZXh0IHtTdHJpbmcsIEhUTUwgRUxFTUVOVCBvciBBcnJheSBvZiBib3RofSAtIExvbmcgZGVzY3JpcHRpb24gb3IgSFRNTCBmaWVsZCB3aXRoIGEgbG9uZyBkZXNjcmlwdGlvbiBvZiB0aGUgcmVjb3JkLlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIERJViBlbGVtZW50IHdpdGggYm90aCBzaG9ydCBhbmQgZmllbGQgZGVzY3JpcHRpb25zLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMb25nRmxvYXRpbmdUZXh0OiBmdW5jdGlvbihzaG9ydFRleHQsIGxvbmdUZXh0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdleHBhbmRhYmxlX2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbUludE51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAgLSAwKSkgKyAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVzIHRoZSBsaW5rIHRvIGhpZGUgYW5kIHNob3cgdGhlIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2lkJyxcImV4cGFuZGFibGVfZGl2X3RpdGxlX1wiK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9leHBhbmRzaWduYWwgPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2hvcnRUZXh0K1wiIFwiK3RvZXhwYW5kc2lnbmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay50aXRsZSA9IFwiQ2xpY2sgaGVyZSB0byBzZWUgdGhlIGxvbmcgdGV4dCBpbnRvIGEgbmV3IGxpdHRsZSB3aW5kb3dcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl90aXRsZV8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZV9kaXZfaW50ZXJuYWxkaXZfJytyYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGxvbmdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBBdXhpbGlhcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGlmIG9uZSBVUkwgYmVsb25nIHRvIHRoZSBjdXJyZW50IHVzZXIncyBwYWdlIGRvbWFpbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSB1cmwge1N0cmluZ30gLSBsaW5rIHRvIGFuYWx5c2UuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7Qm9vbGVhbn0gLSBUcnVlIGlmIHRoZSBVUkwgYmVsb25ncyB0byB0aGUgbWFpbiB1c2VyJ3MgcGFnZSBkb21haW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlzTG9jYWxVcmw6IGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RG9tYWluICE9IG51bGwgJiYgdGhpcy5jdXJyZW50RG9tYWluLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybCAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSB1cmwuaW5kZXhPZih0aGlzLmN1cnJlbnREb21haW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIFxufTtcblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdE1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTjogMTAwMFxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQ29tbW9uRGF0YVtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uRGF0YTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXIuanNcIik7XG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG52YXIgcmVxd2VzdCA9IHJlcXVpcmUoXCJyZXF3ZXN0XCIpO1xuXG4vKiogXG4gKiBDb250ZXh0RGF0YUxpc3QgQ29uc3RydWN0b3IuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3QgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBUeXBlIG9mIHJvd3MgdmlzdWFsaXNhdGlvbi5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0SWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFRhZyBpZCB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt1c2VyVGV4dFRhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlclRleHRJZENvbnRhaW5lciBvciB1c2VyVGV4dENsYXNzQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiAgICBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0lkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgSXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlcktleXdvcmRzVGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgVGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgb3IgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIEBvcHRpb24ge0hUTUwgb2JqZWN0fSBbdXNlcktleXdvcmRzQ29udGFpbmVyPVRoZSBodG1sIGtleXdvcmRzIGNvbnRhaW5lciBpdHNlbGYuIF1cbiAqICAgIEhUTUwgb2JqZWN0IHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyLCB1c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciBvciB1c2VyS2V5d29yZHNJZENvbnRhaW5lciBpcyBkZWZpbmVkLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIGRlc2NyaXB0aW9uIHRvIGhlbHAgZmlsdGVyIHNhbWUgcmVzdWx0cyB0aGF0IHVzZXIgaXMgc2VlaW5nLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlckhlbHBDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIENsYXNzIG5hbWUgdGhhdCB3aWxsIGNvbnRhaW5zIGhlbHAgaWNvbi5cbiAqIEBvcHRpb24ge2ludH0gW251bWJlclJlc3VsdHM9bnVtYmVyIF1cbiAqICAgIEludGVnZXIgdGhhdCByZXN0cmljdHMgdGhlIHJlc3VsdHMgbnVtYmVyIHRoYXQgc2hvdWxkIGJlIHNob3duLlxuICogQG9wdGlvbiB7Ym9vbGVhbn0gW2luY2x1ZGVTYW1lU2l0ZVJlc3VsdHM9SWYgeW91IHdhbnQgdG8gc2VlIHJlY29yZHMgb2YgeW91ciBwcmVzZW50IHNpdGUuIFRlbXBvcmFyeSBkaXNhYmxlZC4gXVxuICogICAgQm9vbGVhbiB0aGF0IGF2b2lkcyBvciBub3QgcmVzdWx0cyBmcm9tIHRoZSBzYW1lIHNpdGUgeW91IGFyZSBzZWVpbmcuICovXG4vL2Z1bmN0aW9uIENvbnRleHREYXRhTGlzdCAob3B0aW9ucykge1xudmFyIENvbnRleHREYXRhTGlzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHsgICAgICAgIFxuXHQgICAgIGRpc3BsYXlTdHlsZTogY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFLFxuXHQgICAgIGluY2x1ZGVTYW1lU2l0ZVJlc3VsdHMgOiB0cnVlXG5cdH07XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0ICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cblx0dGhpcy5jb250ZXh0RGF0YVNlcnZlciA9IFwiaHR0cHM6Ly93d3cuYmlvY2lkZXIub3JnOjg5ODMvc29sci9jb250ZXh0RGF0YVwiO1xuXHRcblx0XG5cdC8vIGdsb2JhbCBjdXJyZW50IHN0YXR1c1xuXHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHM9IG51bGw7XG5cdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0PSBudWxsO1xuXHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzPSBudWxsO1xuXHR0aGlzLmN1cnJlbnRTdGF0dXM9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORztcblx0dGhpcy5jdXJyZW50RmlsdGVycz0gbnVsbDtcblx0dGhpcy50b3RhbEZpbHRlcnM9bnVsbDtcblx0dGhpcy5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlPSBudWxsO1xuXHR0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZT0gbnVsbDtcblx0XG5cdHRoaXMuY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHR0aGlzLmN1cnJlbnREb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG5cdFxuXHR0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucz0gW107XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGFNYW5hZ2VyID0gbmV3IERhdGFNYW5hZ2VyKHsnY3VycmVudERvbWFpbic6dGhpcy5jdXJyZW50RG9tYWluLCdyZXNvdXJjZVR5cGVTZXQnOnRoaXMucmVzb3VyY2VUeXBlU2V0fSk7XG5cdFxuXHQvL3RoaXMuZHJhd0hlbHBJbWFnZSgpO1xuXHRcbiAgICAgIFxufVxuXG5cblxuLyoqIFxuICogUmVzb3VyY2UgY29udGV4dHVhbGlzYXRpb24gd2lkZ2V0LlxuICogXG4gKiBcbiAqIEBjbGFzcyBDb250ZXh0RGF0YUxpc3RcbiAqXG4gKi9cbkNvbnRleHREYXRhTGlzdC5wcm90b3R5cGUgPSB7XG5cdGNvbnN0cnVjdG9yOiBDb250ZXh0RGF0YUxpc3QsXG5cdFxuXHQvKipcblx0ICogU2hvd3MgdGhlIGNvbnRleHR1YWxpc2VkIGRhdGEgaW50byB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0ZHJhd0NvbnRleHREYXRhTGlzdCA6IGZ1bmN0aW9uICgpe1xuXHRcdC8vY29uc29sZS5sb2coJ0NvbnRleHREYXRhTGlzdC5MT0FESU5HLCcrY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKTtcblx0XHQvL2NvbnNvbGUubG9nKCdDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFLCcrY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEUpO1xuXHRcdHRoaXMuY3VycmVudFN0YXR1cyA9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORztcblx0XHQvL3RoaXMudXBkYXRlR2xvYmFsU3RhdHVzKHRoaXMuTE9BRElORyk7XG5cdFx0dmFyIHVzZXJUZXh0ID0gdGhpcy5nZXRVc2VyU2VhcmNoKCk7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJLZXl3b3JkcyA9IHRoaXMuZ2V0VXNlcktleXdvcmRzKCk7XG5cdFx0dmFyIHVzZXJEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0VXNlckNvbnRlbnREZXNjcmlwdGlvbigpO1xuXHRcdHZhciBtYXhSb3dzID0gdGhpcy5nZXRNYXhSb3dzKCk7XG5cdFx0dmFyIG5ld1VybCA9IHRoaXMuX2dldE5ld1VybCh1c2VyVGV4dCwgdXNlcktleXdvcmRzLCB1c2VyRGVzY3JpcHRpb24sIHRoaXMuY3VycmVudEZpbHRlcnMsIHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0LCBtYXhSb3dzKTtcblx0XHR0aGlzLnByb2Nlc3NEYXRhRnJvbVVybChuZXdVcmwpO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFNob3dzIHRoZSBjb250ZXh0dWFsaXNlZCBkYXRhIGludG8gdGhlIHdpZGdldCwgdXBkYXRpbmcgdGhlIHdob2xlIGludGVybmFsIHN0YXR1cyBvZiB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0dG90YWxEcmF3Q29udGV4dERhdGFMaXN0IDogZnVuY3Rpb24gKCl7XG5cdFx0dGhpcy51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKTtcblx0XHR0aGlzLmRyYXdDb250ZXh0RGF0YUxpc3QoKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIFVzZXIncyB0ZXh0IHRvIGNvbnRleHR1YWxpc2UsIGlmIGl0IGV4aXN0cy5cbiAgICAgICAgICoge1N0cmluZ30gLSBUZXh0IGZvdW5kIGludG8gdGhlIGNsaWVudCBkb2N1bWVudCB0aGF0IGNvbnRhaW5zIENvbnRleHR1YWxpc2F0aW9uIHdpZGdldC5cblx0ICovXG5cdGdldFVzZXJTZWFyY2ggOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdXNlclRleHQgPSAnJztcblx0XHR2YXIgZWxlbWVudHNDb250YWluZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJUZXh0SWRDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlclRleHRJZENvbnRhaW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzQ29udGFpbmVyID0gW107XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyWzBdID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy51c2VyVGV4dElkQ29udGFpbmVyKTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VyVGV4dENsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJUZXh0Q2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlclRleHRDbGFzc0NvbnRhaW5lcik7XG5cdFx0fWVsc2V7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlclRleHRUYWdDb250YWluZXIpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcblx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0O1xuXHRcdFx0aWYgKHVzZXJUZXh0ID09IHVuZGVmaW5lZCB8fCB1c2VyVGV4dCA9PSBudWxsKSB7XG5cdFx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdFx0fVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG15Rmlyc3RFbGVtZW50Lmhhc093blByb3BlcnR5KFwidmFsdWVcIikgJiYgKHVzZXJUZXh0ID09IHVuZGVmaW5lZCB8fCB1c2VyVGV4dCA9PSBudWxsIHx8IHVzZXJUZXh0ID09ICcnICkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclRleHQgPSBteUZpcnN0RWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYWxlcnQoJ3VzZXJUZXh0IHZhbHVlOiAnK3VzZXJUZXh0KTsgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cdFx0fVxuXHRcdHJldHVybiB1c2VyVGV4dDtcblx0fSxcblx0XG4gICAgICAgIFxuXHQvKipcblx0ICogUmV0dXJucyBVc2VyJ3Mga2V5d29yZHMgaW4gb3JkZXIgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cywgaWYgdGhleSBleGlzdC5cbiAgICAgICAgICoge0FycmF5fSAtIExpc3Qgb2Yga2V5d29yZHMgZm91bmQgaW50byB0aGUgY2xpZW50IGRvY3VtZW50IHRoYXQgY2FuIGhlbHAgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cblx0ICovXG5cdGdldFVzZXJLZXl3b3JkcyA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB1c2VyS2V5d29yZHMgPSBbXTtcblx0XHR2YXIgZWxlbWVudHNDb250YWluZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNDb250YWluZXIgPSBbXTtcblx0XHQgICAgZWxlbWVudHNDb250YWluZXJbMF0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyKTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyS2V5d29yZHNDbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0ICAgIGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLnVzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyKTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VyS2V5d29yZHNUYWdDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlcktleXdvcmRzVGFnQ29udGFpbmVyICE9IG51bGwpe1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlcktleXdvcmRzVGFnQ29udGFpbmVyKTtcblx0XHR9ZWxzZSBpZiAodGhpcy51c2VyS2V5d29yZHNDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlcktleXdvcmRzQ29udGFpbmVyICE9IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0NvbnRhaW5lciA9IFtdO1xuXHRcdCAgICBlbGVtZW50c0NvbnRhaW5lclswXSA9IHRoaXMudXNlcktleXdvcmRzQ29udGFpbmVyO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0IHx8IG15Rmlyc3RFbGVtZW50LnRleHRDb250ZW50O1xuXHRcdFx0dXNlcktleXdvcmRzID0gY29udGVudC5zcGxpdChcIiBcIik7XG5cdFx0fVxuXHRcdHJldHVybiB1c2VyS2V5d29yZHM7XG5cdH0sXG4gICAgICAgIFxuICAgICAgICBcblx0LyoqXG5cdCAqIFJldHVybnMgVXNlcidzIGRlc2NyaXB0aW9uIHRvIGhlbHAgZmlsdGVyIHNhbWUgcmVzdWx0cyB0aGFuIHVzZXIgaXMgc2VlaW5nLlxuICAgICAgICAgKiB7U3RyaW5nfSAtIFRleHQgZm91bmQgaW50byB0aGUgY2xpZW50IGRvY3VtZW50LlxuXHQgKi9cblx0Z2V0VXNlckNvbnRlbnREZXNjcmlwdGlvbiA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZXNjcmlwdGlvbiA9ICcnO1xuXHRcdHZhciBlbGVtZW50c0NvbnRhaW5lciA9IG51bGw7XG5cdFx0aWYgKHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXIpO1xuXHRcdH0vKmVsc2V7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlckRlc2NyaXB0aW9uVGFnQ29udGFpbmVyKTtcblx0XHR9Ki9cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcblx0XHRcdGRlc2NyaXB0aW9uID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0O1xuXHRcdFx0aWYgKGRlc2NyaXB0aW9uID09IHVuZGVmaW5lZCB8fCBkZXNjcmlwdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdH0sXG5cdFxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBtYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRoYXQgY2FuIGJlIHNob3duIGludG8gdGhlIHdpZGdldC5cbiAgICAgICAgICoge0ludGVnZXJ9IC0gTWF4aW11bSBhbW91bnQgb2YgcmVzdWx0cyB0aGF0IGNhbiBiZSBzaG93biBhdCB0aGUgc2FtZSB0aW1lLlxuXHQgKi9cblx0Z2V0TWF4Um93cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG1heFJvd3MgPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X01BWF9ST1dTO1xuXHRcdGlmICh0aGlzLm51bWJlclJlc3VsdHMgIT0gXCJ1bmRlZmluZWRcIiAmJiAhaXNOYU4odGhpcy5udW1iZXJSZXN1bHRzKSAmJiB0eXBlb2YgdGhpcy5udW1iZXJSZXN1bHRzID09PSAnbnVtYmVyJyAmJiAodGhpcy5udW1iZXJSZXN1bHRzICUgMSA9PT0gMCkgKSB7XG5cdFx0XHRpZiAodGhpcy5udW1iZXJSZXN1bHRzIDwgY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9NQVhfUk9XUykge1xuXHRcdFx0XHRtYXhSb3dzID0gdGhpcy5udW1iZXJSZXN1bHRzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWF4Um93cztcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSB1cmwgdG8gdGhlIFNvbFIgZGF0YWJhc2Ugd2l0aCBhbGwgZHluYW1pYyBwYXJhbWV0ZXJzIGdlbmVyYXRlZCBmcm9tIHRoZXNlIGFyZ3VtZW50cy5cblx0ICogQHBhcmFtIGZpZWxkVGV4dCB7c3RyaW5nfSBUZXh0IHRvIHNlYXJjaC5cblx0ICogQHBhcmFtIGtleXdvcmRzIHtzdHJpbmd9IEFzc29jaWF0ZWQga2V5d29yZHMgdG8gdGhlIGNvbnRlbnQuXG5cdCAqIEBwYXJhbSBkZXNjcmlwdGlvblRleHQge3N0cmluZ30gQXNzb2NpYXRlZCBkZXNjcmlwdGlvbiBvZiB0aGUgY29udGVudC5cblx0ICogQHBhcmFtIGZpbHRlcnMge0FycmF5fSBBcnJheSBvZiBmaWx0ZXJzIC0gT25seSByZXN1bHRzIHdpdGggb25lIG9mIHRoZXNlIHJlc291cmNlIHR5cGVzIHdpbGwgYmUgZ2V0LlxuXHQgKiBAcGFyYW0gc3RhcnQge2ludGVnZXJ9IFBvc2l0aW9uIG9mIHRoZSBmaXJzdCByZXN1bHQgdG8gcmV0cmlldmUuXG5cdCAqIEBwYXJhbSByb3dzTnVtYmVyIHtpbnRlZ2VyfSBJbmRpY2F0ZXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdGhhdCB3aWxsIGJlIHNob3duIG9uIHRoZSBzY3JlZW47XG5cdCAqL1xuXHRfZ2V0TmV3VXJsIDogZnVuY3Rpb24oZmllbGRUZXh0LCBrZXl3b3JkcywgZGVzY3JpcHRpb25UZXh0LCBmaWx0ZXJzLCBzdGFydCwgcm93c051bWJlcil7XG5cdFx0Ly9jb25zb2xlLmxvZygnX2dldE5ld1VybCwgZmllbGRUZXh0OiAnK2ZpZWxkVGV4dCsnLCBkZXNjcmlwdGlvblRleHQ6ICcrZGVzY3JpcHRpb25UZXh0KycsIGZpbHRlcnM6ICcrZmlsdGVycysnLCBzdGFydDogJytzdGFydCsnLCByb3dzTnVtYmVyOiAnK3Jvd3NOdW1iZXIpO1xuXHRcdHZhciBjb3VudCA9IDA7XG5cdFx0dmFyIHVybCA9IFwiXCI7XG5cdFx0XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkVGV4dFdpdGhLZXl3b3JkcyA9IGZpZWxkVGV4dDtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGtleXdvcmRzLCB3ZSBjYW4gam9pbiB0aGVtIHRvIHRoZSB1c2VyVGV4dCBpbiBvcmRlciB0byBjcmVhdGUgdGhlIHNlYXJjaHBocmFzZS5cbiAgICAgICAgICAgICAgICBpZiAoa2V5d29yZHMhPW51bGwgJiYga2V5d29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGtleXdvcmRzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkVGV4dFdpdGhLZXl3b3JkcyA9IGZpZWxkVGV4dFdpdGhLZXl3b3JkcyArXCIgXCIra2V5d29yZHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG5cdFx0dmFyIHdvcmRzID0gZmllbGRUZXh0V2l0aEtleXdvcmRzLnNwbGl0KFwiIFwiKTtcblx0XHR2YXIgc2VhcmNoUGhyYXNlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFdvcmQgPSBcIlwiO1xuXHRcdHdoaWxlIChjb3VudCA8IHdvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFdvcmQgPSB3b3Jkc1tjb3VudF07XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAnYW5kJyB3b3JkIGlzIHByb2JsZW1hdGljIGluIHRoZSBxdWVyeVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRXb3JkICE9ICdhbmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hQaHJhc2UgKz0gY3VycmVudFdvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY291bnQgPCB3b3Jkcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoUGhyYXNlICs9ICcrJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0XHR9XG5cdFx0Ly8gd2UgZXhjbHVkZSBhbGwgcmVzdWx0cyBmcm9tIHRoaXMgZG9tYWluOiBkaXNhYmxlZCB1bnRpbCByZWluZGV4aW5nXG5cdFx0LyppZiAoIXRoaXMuaW5jbHVkZVNhbWVTaXRlUmVzdWx0cykge1xuXHRcdFx0dmFyIGV4Y2x1ZGluZ1BocmFzZSA9IFwiXCI7XG5cdFx0XHQvL2V4Y2x1ZGluZ1BocmFzZSA9IFwiIE5PVChcIit0aGlzLmN1cnJlbnREb21haW4rXCIpXCI7XG5cdFx0XHRleGNsdWRpbmdQaHJhc2UgPSBcIi1cXFwiKnRnYWMuYWMudWsqXFxcIlwiO1xuXHRcdFx0c2VhcmNoUGhyYXNlID0gXCIoXCIrc2VhcmNoUGhyYXNlK2V4Y2x1ZGluZ1BocmFzZStcIilcIjtcblx0XHQvLyB3ZSBleGNsdWRlIG9ubHkgdGhlIHNhbWUgcmVjb3JkIHRoYW4gdXNlciBpc1xuXHRcdH1lbHNleyovXG5cdFx0LypcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRVUkwgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5jdXJyZW50VVJMICE9IG51bGwpIHtcblx0XHRcdHZhciBleGNsdWRpbmdQaHJhc2UgPSBcIlwiO1xuXHRcdFx0Ly8gVGhlcmUgYXJlIHNvbWUgY2hhcmFjdGVycyB0aGF0IGNhbiBicmVhayB0aGUgZnVsbCBVUkw7IHdlIHJlbW92ZSB0aGVtLlxuXHRcdFx0dmFyIGN1cmF0ZWRVUkwgPSB0aGlzLmN1cnJlbnRVUkwucmVwbGFjZSgnIycsJycpO1xuXHRcdFx0ZXhjbHVkaW5nUGhyYXNlID0gXCIgTk9UKFxcXCJcIitjdXJhdGVkVVJMK1wiXFxcIilcIjtcblx0XHRcdHNlYXJjaFBocmFzZSA9IFwiKFwiK3NlYXJjaFBocmFzZStcIikgQU5EIFwiK2V4Y2x1ZGluZ1BocmFzZTtcblx0XHR9Ki9cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcblx0XHRzZWFyY2hQaHJhc2UgPSBcIihcIitzZWFyY2hQaHJhc2UrXCIpXCI7XHRcblx0XHRcblx0XHQvL31cdFxuXHRcdFxuXHRcdHVybCA9IHRoaXMuY29udGV4dERhdGFTZXJ2ZXIrXCIvc2VsZWN0P2RlZlR5cGU9ZWRpc21heCZxPVwiK3NlYXJjaFBocmFzZTtcblx0XHRcblx0XHR2YXIgZnEgPSBudWxsO1xuXHRcdGlmIChmaWx0ZXJzICE9PSBcInVuZGVmaW5lZFwiICYmIGZpbHRlcnMhPW51bGwgKSB7XG5cdFx0XHRpZiAoZmlsdGVycyBpbnN0YW5jZW9mIEFycmF5ICYmIGZpbHRlcnMubGVuZ3RoPjApIHtcblx0XHRcdFx0ZnEgPSBcIlwiO1xuXHRcdFx0XHR2YXIgZmlsdGVyQ291bnQgPSAwO1xuXHRcdFx0XHR2YXIgZmlsdGVyQ2hhaW4gPSBcIlwiO1xuXHRcdFx0XHR3aGlsZSAoZmlsdGVyQ291bnQgPCBmaWx0ZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZpbHRlckNoYWluICs9IFwiJ1wiK2ZpbHRlcnNbZmlsdGVyQ291bnRdK1wiJ1wiO1xuXHRcdFx0XHRcdGZpbHRlckNvdW50Kys7XG5cdFx0XHRcdFx0aWYoZmlsdGVyQ291bnQgPCBmaWx0ZXJzLmxlbmd0aCl7ZmlsdGVyQ2hhaW4gKz0gJyBPUiAnfVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZxPVwicmVzb3VyY2VfdHlwZTooXCIrZmlsdGVyQ2hhaW4rXCIpXCI7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZnEgPSBcInJlc291cmNlX3R5cGU6dW5kZWZpbmVkXCI7XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzLmN1cnJlbnRVUkwgIT0gbnVsbCkge1xuXHRcdFx0aWYgKGZxPT1udWxsKSB7XG5cdFx0XHRcdGZxID0gXCIqOipcIjtcblx0XHRcdH1cblx0XHRcdC8vIFRoZXJlIGFyZSBzb21lIGNoYXJhY3RlcnMgdGhhdCBjYW4gYnJlYWsgdGhlIGZ1bGwgVVJMOyB3ZSByZW1vdmUgdGhlbS5cblx0XHRcdHZhciBjdXJhdGVkVVJMID0gdGhpcy5jdXJyZW50VVJMLnJlcGxhY2UoJyMnLCcnKTtcblx0XHRcdHZhciBsaW5rRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5MSU5LX0ZJRUxEO1xuXHRcdFx0ZnEgPSBmcStcIiBBTkQgLVwiK2xpbmtGaWVsZCtcIjpcXFwiXCIrY3VyYXRlZFVSTCtcIlxcXCJcIjtcdFxuXHRcdH1cblx0ICAgICAgICBcblx0XHQvLyBJZiB3ZSBoYXZlIGRlc2NyaXB0aW9uLCB3ZSBjYW4gdHJ5IHRvIGZpbHRlciB1bmRlc2lyZWQgcmVzdWx0cyAoaS5lLiwgcmVzdWx0cyB0aGF0IGFyZSB0aGUgc2FtZSB0aGFuIHVzZXIncyBjdXJyZW50IHBhZ2UpXG5cdFx0aWYgKGRlc2NyaXB0aW9uVGV4dCAhPSBudWxsKSB7XG5cdFx0XHRpZiAoZnE9PW51bGwpIHtcblx0XHRcdFx0ZnEgPSBcIio6KlwiO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR2YXIgZGVzY1VzZWQgPSBkZXNjcmlwdGlvblRleHQ7XG5cdFx0XHRpZiAoZGVzY1VzZWQubGVuZ3RoPmNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTikge1xuXHRcdFx0XHRkZXNjVXNlZCA9IGRlc2NVc2VkLnNwbGl0KFwiIFwiKS5zbGljZSgwLGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTikuam9pbihcIiBcIik7XG5cdFx0XHR9XG5cdFx0XHQvLyB3ZSByZW1vdmUgd2VpcmQgY2hhcmFjdGVycyBhbmQgXCJcblx0XHRcdGRlc2NVc2VkID0gZGVzY1VzZWQucmVwbGFjZSgvXFxcIi9nLCcnKTtcblx0XHRcdGRlc2NVc2VkID0gZW5jb2RlVVJJQ29tcG9uZW50KGRlc2NVc2VkKTtcblx0XHRcdFxuXHRcdFx0dmFyIGRlc2NyaXB0aW9uRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5ERVNDUklQVElPTl9GSUVMRDtcblx0XHRcdGZxID0gZnErXCIgQU5EIC1cIitkZXNjcmlwdGlvbkZpZWxkK1wiOlxcXCJcIitkZXNjVXNlZCtcIlxcXCJcIjtcblx0XHRcdFxuXHRcdFx0dmFyIHRpdGxlRmllbGQgPSBuZXcgQ29tbW9uRGF0YShudWxsKS5USVRMRV9GSUVMRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJhdGVkRmllbGRUZXh0ID0gZmllbGRUZXh0LnJlcGxhY2UoJyYnLCcnKTtcblx0XHRcdGZxID0gZnErXCIgQU5EIC1cIit0aXRsZUZpZWxkK1wiOlxcXCJcIitjdXJhdGVkRmllbGRUZXh0K1wiXFxcIlwiO1xuXHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmIChmcSE9bnVsbCkge1xuXHRcdFx0dXJsID0gdXJsK1wiICZmcT1cIitmcTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gcWZcblx0XHR1cmwgPSB1cmwrXCImcWY9dGl0bGVeMi4wK2ZpZWxkXjIuMCtkZXNjcmlwdGlvbl4xLjBcIjtcblx0XHRcblx0XHQvLyBzdGFydCByb3dcblx0XHRpZiAoc3RhcnQgIT09IFwidW5kZWZpbmVkXCIgJiYgc3RhcnQhPW51bGwgJiYgIWlzTmFOKHN0YXJ0KSAmJiB0eXBlb2Ygc3RhcnQgPT09ICdudW1iZXInICYmIChzdGFydCAlIDEgPT09IDApICkge1xuXHRcdFx0dXJsID0gdXJsK1wiJnN0YXJ0PVwiK3N0YXJ0O1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBzdGFydDtcblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gMDtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gbnVtIHJvd3Ncblx0XHRpZiAocm93c051bWJlciAhPT0gXCJ1bmRlZmluZWRcIiAmJiByb3dzTnVtYmVyIT1udWxsICYmIHJvd3NOdW1iZXIhPW51bGwgJiYgIWlzTmFOKHJvd3NOdW1iZXIpICYmIHR5cGVvZiByb3dzTnVtYmVyID09PSAnbnVtYmVyJyAmJiAocm93c051bWJlciAlIDEgPT09IDApICkge1xuXHRcdFx0dXJsID0gdXJsK1wiJnJvd3M9XCIrcm93c051bWJlcjtcblx0XHR9XG5cdFx0XHRcblx0XHRcdFxuXHRcdC8vIFN0YXRzLiBXZSBjb3VudCBhbGwgdGhlIGRpZmZlcmVudCByZXN1bHRzIGJ5IHJlc291cmNlIHR5cGVcblx0XHR1cmwgPSB1cmwrXCImZmFjZXQ9dHJ1ZSZmYWNldC5tZXRob2Q9ZW51bSZmYWNldC5saW1pdD0tMSZmYWNldC5maWVsZD1yZXNvdXJjZV90eXBlXCJcblx0XHRcblx0XHRcdFx0XG5cdFx0Ly8gd3Rcblx0XHR1cmwgPSB1cmwrXCImd3Q9anNvblwiO1xuXHRcdFxuXHRcdC8vIG1heWJlIHdlIGNvdWxkIGFsc28gZmlsdGVyIGZpZWxkcyB0aGF0IHdlIHJldHVyblxuXHRcdC8vICZmbD1zdGFydCx0aXRsZSxub3RlcyxsaW5rXG5cdFx0XG5cdFx0XG5cdFx0cmV0dXJuIHVybDtcblx0fSxcblx0XG5cdFxuXHRcblx0LyoqXG5cdCAqIE1ha2VzIGFuIGFzeW5jaHJvbm91cyByZXF1ZXN0IHRvIHRoZSBDb250ZXh0dWFsaXNhdGlvbiBkYXRhIHNlcnZlciBhbmQgcHJvY2VzcyBpdHMgcmVwbHkuXG5cdCAqIEBwYXJhbSB1cmwge3N0cmluZ30gLSBVbmlmb3JtIFJlc291cmNlIExvY2F0b3Jcblx0ICovXG5cdHByb2Nlc3NEYXRhRnJvbVVybDogZnVuY3Rpb24odXJsKXtcblx0XHR2YXIgbXlDb250ZXh0RGF0YUxpc3QgPSB0aGlzO1xuXHRcdHJlcXdlc3Qoe1xuXHRcdFx0dXJsOiB1cmwgLFxuXHRcdFx0dHlwZTogJ2pzb24nICxcblx0XHRcdG1ldGhvZDogJ3Bvc3QnICxcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicgLFxuXHRcdFx0Y3Jvc3NPcmlnaW46IHRydWUsXG5cdFx0XHR0aW1lb3V0OiAxMDAwICogNSxcblx0XHRcdHdpdGhDcmVkZW50aWFsczogdHJ1ZSwgIC8vIFdlIHdpbGwgaGF2ZSB0byBpbmNsdWRlIG1vcmUgc2VjdXJpdHkgaW4gb3VyIFNvbHIgc2VydmVyXG5cdFx0XHRcblx0XHRcdGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NFcnJvcihlcnIpO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUik7XG5cdFx0XHR9ICxcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwKSB7XG5cdFx0XHRcdHZhciBjb250ZXh0dWFsaXNlZERhdGEgPSBteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzQ29udGV4dHVhbGlzZWREYXRhKHJlc3ApO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5kcmF3Q29udGV4dHVhbGlzZWREYXRhKGNvbnRleHR1YWxpc2VkRGF0YSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdFxuXG5cdC8qKlxuXHQgKiBNYW5hZ2VzIHNvbWUgZXJyb3JzIGFuZCBwcm9jZXNzIGVhY2ggcmVzdWx0IHRvIGJlIGdldCBpbiBhIHByb3BlciB3YXkuXG5cdCAqIEBwYXJhbSBkYXRhIHtPYmplY3R9IC0gVGhlIGZ1bGwgZGF0YSBsaXN0IHRvIGJlIHByb2Nlc3NlZCBhbmQgc2hvd25cblx0ICoge0FycmF5fSAtIEFycmF5IHdpdGggb2JqZWN0cyBjb252ZXJ0ZWQgZnJvbSB0aGVpciBvcmlnaW5hbCBKU09OIHN0YXR1c1xuXHQgKi9cblx0cHJvY2Vzc0NvbnRleHR1YWxpc2VkRGF0YSA6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgbXlDb250ZXh0RGF0YUxpc3QgPSB0aGlzO1xuXHRcdHZhciBjb250ZXh0dWFsaXNlZERhdGEgPSBbXTtcblx0XHRpZihkYXRhLnJlc3BvbnNlICE9IHVuZGVmaW5lZCl7XG5cdFx0XHRpZihkYXRhLnJlc3BvbnNlLmRvY3MgIT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IGRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHRoaXMuZ2V0TnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlKGRhdGEpO1xuXHRcdFx0XHRpZiAodGhpcy5udW1Jbml0aWFsUmVzdWx0c0J5UmVzb3VyY2VUeXBlID09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUgPSB0aGlzLm51bVJlc3VsdHNCeVJlc291cmNlVHlwZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0ZGF0YS5yZXNwb25zZS5kb2NzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcblx0XHRcdFx0XHR2YXIgdHlwZWREYXRhID0gbXlDb250ZXh0RGF0YUxpc3QuZGF0YU1hbmFnZXIuZ2V0RGF0YUVudGl0eShlbnRyeSk7XG5cdFx0XHRcdFx0Y29udGV4dHVhbGlzZWREYXRhLnB1c2godHlwZWREYXRhKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKFwiZGF0YS5yZXNwb25zZS5kb2NzIHVuZGVmaW5lZFwiKTtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QuY2hhbmdlQ3VycmVudFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKFwiZGF0YS5yZXNwb25zZSB1bmRlZmluZWRcIik7XG5cdFx0XHRteUNvbnRleHREYXRhTGlzdC5jaGFuZ2VDdXJyZW50U3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IpO1xuXHRcdH1cblx0XHRcdFxuXHRcdHJldHVybiBjb250ZXh0dWFsaXNlZERhdGE7XG5cdH0sXG5cdC8qXG5cdGZpbHRlclNhbWVEYXRhUmVzdWx0cyA6IGZ1bmN0aW9uKGRhdGEsIG1haW5UZXh0LCBjb250ZW50RGVzY3JpcHRpb24pe1xuXHRcdHZhciBmaWx0ZXJlZF9kYXRhID0gZGF0YTtcblx0XHRcblx0XHRkYXRhLnJlc3BvbnNlLmRvY3MuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0dmFyIHR5cGVkRGF0YSA9IG15Q29udGV4dERhdGFMaXN0LmRhdGFNYW5hZ2VyLmdldERhdGFFbnRpdHkoZW50cnkpO1xuXHRcdFx0Y29udGV4dHVhbGlzZWREYXRhLnB1c2godHlwZWREYXRhKTtcblx0XHR9KTtcblx0XHRcblx0XHRDb21tb25EYXRhLlRJVExFX0ZJRUxEXG5cdFx0Q29tbW9uRGF0YS5ERVNDUklQVElPTl9GSUVMRFxuXHRcdFxuXHRcdHJldHVybiBmaWx0ZXJlZF9kYXRhO1xuXHR9LCovXG5cdFxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRhdGEgb2YgZWFjaCByZXNvdXJjZSB0eXBlLlxuXHQgKiBAcGFyYW0gIGRhdGEge09iamVjdH0gLSBUaGUgZnVsbCBkYXRhIGxpc3QgdG8gYmUgcHJvY2Vzc2VkXG5cdCAqIGRhdGEge09iamVjdH0gLSBPYmplY3Qgd2l0aCBvbmUgcHJvcGVydHkgYnkgZWFjaCByZXNvdXJjZSB0eXBlIGFuZCB2YWx1ZSBvZiBpdHMgb2N1cnJlbmNlcy5cblx0ICovXG5cdGdldE51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgZmFjZXRfY291bnRzID0gZGF0YS5mYWNldF9jb3VudHM7XG5cdFx0dmFyIHJlc291cmNlX3R5cGVzX2NvdW50ID0gbnVsbDtcblx0XHRpZiAoZmFjZXRfY291bnRzICE9IHVuZGVmaW5lZCB8fCBmYWNldF9jb3VudHMgIT0gbnVsbCApIHtcblx0XHRcdHZhciBmYWNldF9maWVsZHMgPSBmYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuXHRcdFx0aWYgKGZhY2V0X2ZpZWxkcyAhPSB1bmRlZmluZWQgfHwgZmFjZXRfZmllbGRzICE9IG51bGwgKSB7XG5cdFx0XHRcdHJlc291cmNlX3R5cGVzX2NvdW50ID0gZmFjZXRfZmllbGRzLnJlc291cmNlX3R5cGU7XHRcblx0XHRcdH1cdFxuXHRcdH1cblx0XHRpZiAocmVzb3VyY2VfdHlwZXNfY291bnQgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdFxuXHRcdHZhciBudW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUgPSB7fTtcblx0XHRpZiAodGhpcy50b3RhbEZpbHRlcnMgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGN1cnJlbnRGaWx0ZXIgPSBudWxsO1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy50b3RhbEZpbHRlcnMubGVuZ3RoO2krKykge1xuXHRcdFx0XHRjdXJyZW50RmlsdGVyID0gdGhpcy50b3RhbEZpbHRlcnNbaV07XG5cdFx0XHRcdHZhciBjdXJyZW50X2NvdW50ID0gbnVsbDtcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8cmVzb3VyY2VfdHlwZXNfY291bnQubGVuZ3RoO2orKykge1xuXHRcdFx0XHRcdGN1cnJlbnRfY291bnQgPSByZXNvdXJjZV90eXBlc19jb3VudFtqXTtcblx0XHRcdFx0XHRpZiAoICh0eXBlb2YgY3VycmVudF9jb3VudCA9PT0gJ3N0cmluZycgfHwgY3VycmVudF9jb3VudCBpbnN0YW5jZW9mIFN0cmluZylcblx0XHRcdFx0XHQgICAgJiYgY3VycmVudEZpbHRlci50b0xvd2VyQ2FzZSgpLmluZGV4T2YoY3VycmVudF9jb3VudCkgPiAtMSApIHtcblx0XHRcdFx0XHRcdG51bVJlc3VsdHNCeVJlc291cmNlVHlwZVtjdXJyZW50RmlsdGVyXSA9IHJlc291cmNlX3R5cGVzX2NvdW50W2orMV07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bVJlc3VsdHNCeVJlc291cmNlVHlwZTtcblx0fSxcblx0XG4gICAgICAgICBcblx0LyoqXG5cdCAqIERyYXcgYSBlbnRpcmUgbGlzdCBvZiBjb250ZXh0dWFsaXNlZCByZXNvdXJjZXNcblx0ICogQHBhcmFtIGNvbnRleHR1YWxpc2VkRGF0YSB7b2JqZWN0IE9iamVjdH0gLSBBbGwgdGhlIGRhdGEgdG8gYmUgZHJhd24gaW50byB0aGUgd2lkZ2V0LlxuXHQgKi9cblx0ZHJhd0NvbnRleHR1YWxpc2VkRGF0YSA6IGZ1bmN0aW9uKGNvbnRleHR1YWxpc2VkRGF0YSl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHR3aGlsZSAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHRhcmdldC5yZW1vdmVDaGlsZCh0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdFxuXHRcdHZhciBpbmRleCA9IDA7XG5cdFx0dmFyIGRhdGFPYmplY3Q7XG5cdFx0dmFyIGRyYXdhYmxlT2JqZWN0O1xuXHRcdHZhciBvZGRSb3cgPSB0cnVlO1xuXHRcdHdoaWxlKGluZGV4IDwgY29udGV4dHVhbGlzZWREYXRhLmxlbmd0aCl7XG5cdFx0XHRpZiAoaW5kZXglMj09MCkge1xuXHRcdFx0XHRvZGRSb3cgPSBmYWxzZTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRvZGRSb3cgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZGF0YU9iamVjdCA9IGNvbnRleHR1YWxpc2VkRGF0YVtpbmRleF07XG5cdFx0XHRkcmF3YWJsZU9iamVjdCA9IGRhdGFPYmplY3QuZ2V0RHJhd2FibGVPYmplY3RCeVN0eWxlKHRoaXMuZGlzcGxheVN0eWxlKTtcblx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoJ3ZpZXdzLXJvdycpO1xuXHRcdFx0aWYob2RkUm93ID09IHRydWUpe1xuXHRcdFx0XHRkcmF3YWJsZU9iamVjdC5jbGFzc0xpc3QuYWRkKFwidmlld3Mtcm93LW9kZFwiKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRkcmF3YWJsZU9iamVjdC5jbGFzc0xpc3QuYWRkKFwidmlld3Mtcm93LWV2ZW5cIik7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoZHJhd2FibGVPYmplY3QpO1xuXHRcdFx0aW5kZXgrKztcblx0XHR9XG5cdFx0aWYgKGNvbnRleHR1YWxpc2VkRGF0YS5sZW5ndGggPT0gMCkge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuZ2V0RW1wdHlSZWNvcmQoKSk7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBjb250ZXh0dWFsaXNlZERhdGEubGVuZ3RoO1xuXHRcdHRoaXMudXBkYXRlR2xvYmFsU3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEKTtcblx0XHQvKlxuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50VG90YWxSZXN1bHRzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50VG90YWxSZXN1bHRzKTtcblx0XHRjb25zb2xlLmxvZygnY3VycmVudFN0YXJ0UmVzdWx0Jyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50U3RhcnRSZXN1bHQpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cycpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50RmlsdGVycycpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudEZpbHRlcnMpO1xuXHRcdCovXG5cdFx0XG5cdH0sXG5cdFxuXHQvKipcblx0ICogXHRSZXR1cm5zIG9uZSByb3cgZXhwbGFpbmluZyB0aGUgYWJzZW5jZSBvZiByZWFsIHJlc3VsdHMuXG5cdCAqIFx0e0hUTUwgT2JqZWN0fSAtIEVtcHR5IHJlc3VsdC5cblx0ICovXG5cdGdldEVtcHR5UmVjb3JkIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG5cdFx0dmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuXHRcdFxuXHRcdHZhciBzcGFuVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHR2YXIgdGV4dCA9ICdObyByZXN1bHRzIGZvdW5kJztcblx0XHRzcGFuVGV4dC5pbm5lckhUTUwgPSB0ZXh0O1xuXHRcdHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKHNwYW5UZXh0KTtcblx0XHRtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblx0XHRyZXR1cm4gbWFpbkNvbnRhaW5lcjtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBVcGRhdGVzLCBkZXBlbmRpbmcgb24gdGhlIG5ldyBzdGF0dXMsIGludGVybmFsIHZhcmlhYmxlcyBvZiB0aGUgY29tcG9uZW50IGFuZCwgaWZcblx0ICogbmV3IHN0YXR1cyBpcyAnTE9BREVEJywgZXhlY3V0ZXMgdGhlICdvbkxvYWRlZCcgZnVuY3Rpb25zIHJlZ2lzdGVyZWQuIFxuXHQgKiBAcGFyYW0gbmV3U3RhdHVzIHtzdHJpbmd9IC0gQ29udGV4dERhdGFMaXN0LkxPQURJTkcgb3IgQ29udGV4dERhdGFMaXN0LkVSUk9SIG9yIENvbnRleHREYXRhTGlzdC5MT0FERUQgXG5cdCAqL1xuXHR1cGRhdGVHbG9iYWxTdGF0dXMgOiBmdW5jdGlvbihuZXdTdGF0dXMpe1xuXHRcdC8vIG5ldyBzdGF0dXMgbXVzdCBiZSBvbmUgb2YgdGhlIHBvc2libGUgc3RhdHVzXG5cdFx0aWYgKG5ld1N0YXR1cyAhPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcgJiZcblx0XHQgICAgbmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IgJiZcblx0XHQgICAgbmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEICl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuY3VycmVudFN0YXR1cyA9IG5ld1N0YXR1cztcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyl7XG5cdFx0XHR0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSBudWxsO1xuXHRcdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IG51bGw7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHRcdC8vIGlmIG5ldyBzdGF0dXMgaXMgTE9BREVELCBoZXJlIHdlIGNhbm5vdCBrbm93IGFueXRoaW5nIGFib3V0IGFsbCB0aGVzZSBpbnRlcm5hbCB2YXJpYWJsZXMuXG5cdFx0fS8qZWxzZSBpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IHRoaXMuTE9BREVEKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHR9Ki9cblx0XHRcblx0XHQvLyBGaW5hbGx5IHdlIGV4ZWN1dGUgcmVnaXN0ZXJlZCAnb25Mb2FkZWQnIGZ1bmN0aW9uc1xuXHRcdGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQgfHxcblx0XHQgICAgdGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IgKXtcblx0XHRcdHRoaXMuZXhlY3V0ZU9uTG9hZGVkRnVuY3Rpb25zKCk7XG5cdFx0fVxuXHR9LFxuXHRcblx0LyoqXG5cdCogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndGl0bGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuXHQqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBBTkNIT1IgZWxlbWVudCB3aXRoICd0aXRsZScgaW5mb3JtYXRpb24gbGlua2luZyB0byB0aGUgb3JpZ2luYWwgc291cmNlLlxuXHQqL1xuXHQvKmRyYXdIZWxwSW1hZ2U6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGhlbHBDb250YWluZXIgPSBudWxsO1xuXHRcdGlmICh0aGlzLnVzZXJIZWxwQ2xhc3NDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHR2YXIgaGVscENvbnRhaW5lcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lcik7XG5cdFx0XHRpZiAoaGVscENvbnRhaW5lcnMgIT0gbnVsbCAmJiBoZWxwQ29udGFpbmVycy5sZW5ndGg+MCkgaGVscENvbnRhaW5lciA9IGhlbHBDb250YWluZXJzWzBdO1xuXHRcdH1lbHNlIGlmICh0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyICE9IG51bGwpe1xuXHRcdFx0dmFyIGhlbHBDb250YWluZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VySGVscFRhZ0NvbnRhaW5lcik7XG5cdFx0XHRpZiAoaGVscENvbnRhaW5lcnMgIT0gbnVsbCAmJiBoZWxwQ29udGFpbmVycy5sZW5ndGg+MCkgaGVscENvbnRhaW5lciA9IGhlbHBDb250YWluZXJzWzBdO1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhoZWxwQ29udGFpbmVyKTtcblx0XHRpZiAoaGVscENvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHR2YXIgaGVscEltYWdlID0gdGhpcy5nZXRIZWxwSW1hZ2UoKTtcblx0XHRcdGlmIChoZWxwSW1hZ2UgIT0gbnVsbCkge1xuXHRcdFx0XHRoZWxwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0b29sdGlwXCIpO1xuXHRcdFx0XHRoZWxwQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZ2V0SGVscEltYWdlKCkpO1xuXHRcdFx0XHQvL2hlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5nZXRIZWxwVGV4dCgpKTtcblx0XHRcdFx0Ly9oZWxwQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlbHBJbWFnZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCovXG5cdFxuXHQvKipcblx0KiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG5cdCogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIEFOQ0hPUiBlbGVtZW50IHdpdGggJ3RpdGxlJyBpbmZvcm1hdGlvbiBsaW5raW5nIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG5cdCovXG4gICAgICAgIC8qZ2V0SGVscEltYWdlOiBmdW5jdGlvbigpe1xuXHRcdHZhciBpbWdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cdFx0aW1nRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9oZWxwX2ltZ1wiKTtcblxuXHRcdHJldHVybiBpbWdFbGVtZW50O1xuICAgICAgICB9LCovXG5cdFxuXHRcblx0XG5cdC8qKlxuXHQgKiBSZWdpc3RlciBuZXcgZnVuY3Rpb25zIHRvIGJlIGV4ZWN1dGVkIHdoZW4gc3RhdHVzIGNvbXBvbmVudCBpcyB1cGRhdGVkIHRvICdMT0FERUQnXG5cdCAqIG15Q29udGV4dCB7T2JqZWN0fSBteUNvbnRleHQgLSBDb250ZXh0IGluIHdoaWNoIG15RnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGUuIFVzdWFsbHkgaXRzIG93biBvYmplY3QgY29udGFpbmVyLlxuXHQgKiBteUNvbnRleHQge09iamVjdH0gbXlGdW5jdGlvbiAtIEZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxuXHQgKi9cblx0cmVnaXN0ZXJPbkxvYWRlZEZ1bmN0aW9uIDogZnVuY3Rpb24obXlDb250ZXh0LCBteUZ1bmN0aW9uKXtcblx0XHR2YXIgb25Mb2FkZWRPYmplY3QgPSB7XG5cdFx0XHQnbXlDb250ZXh0J1x0OiBteUNvbnRleHQsXG5cdFx0XHQnbXlGdW5jdGlvbidcdDogbXlGdW5jdGlvblxuXHRcdH07XG5cdFx0dGhpcy5fb25Mb2FkZWRGdW5jdGlvbnMucHVzaChvbkxvYWRlZE9iamVjdCk7XG5cdH0sXG5cdFxuXHRcblx0LyoqXG5cdCAqIEV4ZWN1dGUgYWxsIHJlZ2lzdGVyZWQgJ29uTG9hZGVkJyBmdW5jdGlvbnNcblx0ICovXG5cdGV4ZWN1dGVPbkxvYWRlZEZ1bmN0aW9ucyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb25PYmplY3QgPSBudWxsO1xuXHRcdHZhciBvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCA9IG51bGw7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb24gPSBudWxsO1xuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5fb25Mb2FkZWRGdW5jdGlvbnMubGVuZ3RoO2krKyl7XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uT2JqZWN0ID0gdGhpcy5fb25Mb2FkZWRGdW5jdGlvbnNbaV07XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCA9IG9uTG9hZGVkRnVuY3Rpb25PYmplY3QubXlDb250ZXh0O1xuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbiA9IG9uTG9hZGVkRnVuY3Rpb25PYmplY3QubXlGdW5jdGlvbjtcblx0XHRcdC8vIHdlIGV4ZWN1dGUgdGhlIG9uTG9hZGVkRnVuY3Rpb24gd2l0aCBpdHMgb3duIGNvbnRleHRcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb24uY2FsbChvbkxvYWRlZEZ1bmN0aW9uQ29udGV4dCk7XG5cdFx0fVxuXHR9LFxuXHRcdFxuICAgICAgXG5cdC8qKlxuXHQgKiBQcmludHMgYXMgYW4gZXJyb3IgdG8gdGhlIGNvbnNvbGUgdGhlIG1lc3NhZ2UgcmVjZWl2ZWQuIFxuXHQgKiBlcnJvciB7c3RyaW5nfSBlcnJvciAtIFN0cmluZyB0byBiZSBwcmludGVkXG5cdCAqL1xuXHRwcm9jZXNzRXJyb3IgOiBmdW5jdGlvbihlcnJvcikge1xuXHQgICAgY29uc29sZS5sb2coXCJFUlJPUjpcIiArIGVycm9yKTtcblx0fVxuXG59XG5cblxuLy8gU1RBVElDIEFUVFJJQlVURVNcbi8qXG52YXIgQ09OU1RTID0ge1xuXHQvL0xpc3Qgb2YgcG9zc2libGUgY29udGV4dCBkYXRhIHNvdXJjZXMgXG5cdFNPVVJDRV9FTElYSVJfUkVHSVNUUlk6XCJFU1JcIixcblx0U09VUkNFX0VMSVhJUl9URVNTOlwiVFNTXCIsXG5cdFNPVVJDRV9FTElYSVJfRVZFTlRTOlwiRUVWXCIsXG5cdC8vc3R5bGUgb2YgdmlzdWFsaXphdGlvblxuXHRGVUxMX1NUWUxFOlwiRlVMTF9TVFlMRVwiLFxuXHRDT01NT05fU1RZTEU6XCJDT01NT05fU1RZTEVcIixcblx0Ly9tYXggbnVtYmVyIG9mIHJvd3MgdG8gcmV0cmlldmUgZnJvbSB0aGUgc2VydmVyLCB3aGF0ZXZlciAnbnVtYmVyUmVzdWx0cycgY2FuIGJlXG5cdE1BWF9ST1dTOjEwMCxcblx0Ly9tYXhpbXVtIGxlbmd0aCB0byBiZSB1c2VkIGZyb20gdGhlIGRlc2NyaXB0aW9uIHRvIGZpbHRlciBzYW1lIHJlc3VsdHNcblx0TlVNX1dPUkRTX0ZJTFRFUklOR19ERVNDUklQVElPTjo1MCxcblx0Ly9FdmVudHMgXG5cdEVWVF9PTl9SRVNVTFRTX0xPQURFRDogXCJvblJlc3VsdHNMb2FkZWRcIixcblx0RVZUX09OX1JFUVVFU1RfRVJST1I6IFwib25SZXF1ZXN0RXJyb3JcIixcblx0Ly9EaWZmZXJlbnQgd2lkZ2V0IHN0YXR1c1xuXHRMT0FESU5HOiBcIkxPQURJTkdcIixcblx0TE9BREVEOiBcIkxPQURFRFwiLFxuXHRFUlJPUjogXCJFUlJPUlwiXG59O1xuXG5mb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICBDb250ZXh0RGF0YUxpc3Rba2V5XSA9IENPTlNUU1trZXldO1xufSovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0RGF0YUxpc3Q7XG4iLCJcbnZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcbnZhciBFbGl4aXJUcmFpbmluZ0RhdGEgPSByZXF1aXJlKFwiLi9FbGl4aXJUcmFpbmluZ0RhdGEuanNcIik7XG52YXIgRWxpeGlyRXZlbnREYXRhID0gcmVxdWlyZShcIi4vRWxpeGlyRXZlbnREYXRhLmpzXCIpO1xudmFyIEVsaXhpclJlZ2lzdHJ5RGF0YSA9IHJlcXVpcmUoXCIuL0VsaXhpclJlZ2lzdHJ5RGF0YS5qc1wiKTtcblxuLyoqIFxuICogRGF0YSBtYW5hZ21lbnQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBEYXRhTWFuYWdlciBjb21wb25lbnQuXG4gKiAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J1lvdXJPd25Eb21haW4nXS5cbiAqICAgICAgVVJMIHRoYXQgaWRlbnRpZmllcyB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKi9cbnZhciBEYXRhTWFuYWdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiBcbiAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgY3VycmVudERvbWFpbjogbnVsbFxuICAgIH07XG4gICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICB9XG4gICAgZm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG4gICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gICAgXG59XG5cbi8qKiBcbiAqIERhdGEgbWFuYWdtZW50IGZ1bmN0aW9uYWxpdHkuXG4gKiBCdWlsZHMgb25lIGtpbmQgb2YgQ29tbW9uRGF0YSBkZXBlbmRpbmcgb24gaXRzICdzb3VyY2UnIHZhbHVlLlxuICogXG4gKiBAY2xhc3MgRGF0YU1hbmFnZXJcbiAqXG4gKi9cbkRhdGFNYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogRGF0YU1hbmFnZXIsXG4gICAgc291cmNlRmllbGQ6ICdzb3VyY2UnLFxuICAgIFxuICAgIC8qKlxuICAgICogICBSZXR1cm5zIHNvdXJjZSBmaWVsZCB2YWx1ZSBvZiB0aGUgSlNPTiBzdHJ1Y3R1cmUgcGFzc2VkIGFzIGFyZ3VtZW50LlxuICAgICogICBAcGFyYW0ganNvbkVudHJ5IHtPYmplY3R9IC0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIG9uZSBlbnRpdHkncyBkYXRhLlxuICAgICogICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHNvdXJjZSB2YWx1ZSBvZiB0aGUgSlNPTiBzdHJ1Y3R1cmUuXG4gICAgKi9cbiAgICBnZXRTb3VyY2VGaWVsZCA6IGZ1bmN0aW9uKGpzb25FbnRyeSl7XG4gICAgICAgIGlmIChqc29uRW50cnkgIT09IG51bGwgJiYganNvbkVudHJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBqc29uRW50cnlbdGhpcy5zb3VyY2VGaWVsZF07XG4gICAgICAgIH1lbHNlIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgICAgIFxuICAgIC8qKlxuICAgICogICBSZXR1cm5zIG9uZSBDb21tb25EYXRhIG9iamVjdCByZXByZXNlbnRpbmcgb25lIGRhdGEgcmVnaXN0cnkuXG4gICAgKiAgIEBwYXJhbSBqc29uRW50cnkge09iamVjdH0gLSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggb25lIGVudGl0eSdzIGRhdGEuXG4gICAgKiAgIHtDb21tb25EYXRhIE9iamVjdH0gLSBDb21tb25EYXRhIGNoaWxkIHRoYXQgcmVwcmVzZW50cyBvYmpldGlmaWVkIGpzb24gZGF0YS5cbiAgICAqL1xuICAgIGdldERhdGFFbnRpdHkgOiBmdW5jdGlvbiAoanNvbkVudHJ5KXtcbiAgICAgICAgdmFyIHNvdXJjZUZpZWxkVmFsdWUgPSB0aGlzLmdldFNvdXJjZUZpZWxkKGpzb25FbnRyeSk7XG4gICAgICAgIHZhciBjb21tb25EYXRhID0gbnVsbDtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgb3B0aW9uc1snY3VycmVudERvbWFpbiddID0gdGhpcy5jdXJyZW50RG9tYWluO1xuICAgICAgICBvcHRpb25zWydyZXNvdXJjZVR5cGVTZXQnXSA9IHRoaXMucmVzb3VyY2VUeXBlU2V0O1xuICAgICAgICBzd2l0Y2goc291cmNlRmllbGRWYWx1ZSl7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJSZWdpc3RyeURhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyUmVnaXN0cnlEYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJUcmFpbmluZ0RhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyVHJhaW5pbmdEYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG5ldyBFbGl4aXJFdmVudERhdGEobnVsbCkuU09VUkNFX0ZJRUxEX1ZBTFVFOlxuICAgICAgICAgICAgICAgIGNvbW1vbkRhdGEgPSBuZXcgRWxpeGlyRXZlbnREYXRhKGpzb25FbnRyeSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1I6IFVua25vd24gc291cmNlIGZpZWxkIHZhbHVlOiBcIiArIHNvdXJjZUZpZWxkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21tb25EYXRhO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFNYW5hZ2VyOyIsInZhciBDb21tb25EYXRhID0gcmVxdWlyZShcIi4vQ29tbW9uRGF0YS5qc1wiKTtcblxuLyoqXG4gKiBFbGl4aXJFdmVudERhdGEgY29uc3RydWN0b3JcbiAqIEBwYXJhbSBqc29uRGF0YSB7T2JqZWN0fSBKU09OIGRhdGEgc3RydWN0dXJlIHdpdGggdGhlIG9yaWdpbmFsIGRhdGEgcmV0cmlldmVkIGJ5IG91ciBkYXRhIHNlcnZlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciB0aGlzIHN0cnVjdHVyZS5cbiAqICAgICAgICAgIEBvcHRpb24ge3N0cmluZ30gW2N1cnJlbnREb21haW49J3VybCddXG4gKiAgICAgICAgICBVUkwgd2l0aCB0aGUgdXNlcidzIHBhZ2UgZG9tYWluLlxuICovXG52YXIgRWxpeGlyRXZlbnREYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgQ09OU1RTID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ0FURUdPUlkgICAgICAgICAgICAgICAgICAgIDogXCJjYXRlZ29yeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ0lUWSAgICAgICAgICAgICAgICAgICAgICAgIDogXCJjaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBDT1VOVFJZICAgICAgICAgICAgICAgICAgICAgOiBcImNvdW50cnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQVJUX0RBVEUgICAgICAgICAgICAgICAgICA6IFwic3RhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIEVORF9EQVRFICAgICAgICAgICAgICAgICAgICA6IFwiZW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBWRU5VRSAgICAgICAgICAgICAgICAgICAgICAgOiBcInZlbnVlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBQUk9WSURFUiAgICAgICAgICAgICAgICAgICAgOiBcInByb3ZpZGVyXCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IENPTlNUU1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiaWFublwiO1xuICAgXG59O1xuXG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyRXZlbnREYXRhIGNoaWxkIGNsYXNzIHdpdGggc3BlY2lmaWMgaW5mb3JtYXRpb24gb2YgdGhpcyBraW5kIG9mIHJlZ2lzdHJpZXMuXG4gKi8gICAgICAgICBcbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1vbkRhdGEucHJvdG90eXBlKTtcbkVsaXhpckV2ZW50RGF0YS5jb25zdHJ1Y3Rvcj0gRWxpeGlyRXZlbnREYXRhO1xuICAgICAgIFxuICAgICAgICAgICAgXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgYWxsIGNhdGVnb3JpZXMgcHJlc2VudCBpbiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtBcnJheX0gLSBBcnJheSBvZiBzdHJpbmdzIHdpdGggY2F0ZWdvcmllcyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnlWYWx1ZXM9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5DQVRFR09SWSk7ICAgICAgXG59LFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgY2l0eSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgY2l0eSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDaXR5VmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ0lUWSk7ICAgICAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgY291bnRyeSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgY291bnRyeSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDb3VudHJ5VmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ09VTlRSWSk7ICAgICAgXG59O1xuXG5cbi8qKlxuICogICAgICAgICAgQXV4aWxpYXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIG9uZSBkYXRlIGFkYXB0ZWQgdG8gdXNlcidzIGxvY2FsZS5cbiAqICAgICAgICAgIEBwYXJhbSBzb3VyY2VEYXRlIHtTdHJpbmd9IC0gU3RyaW5nIGRhdGUgaW4gVVRGIGZvcm1hdCB0byBiZSBjb252ZXJ0ZWQgaW50byBhIGxvY2FsZSBmb3JtYXQuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGN1cmF0ZWQgZGF0ZS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRDdXJhdGVkRGF0ZSA9IGZ1bmN0aW9uKHNvdXJjZURhdGUpe1xuICAgICAgICAgICAgdmFyIGRhdGVWYWx1ZSA9IG5ldyBEYXRlKHNvdXJjZURhdGUpO1xuICAgICAgICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZVZhbHVlKSA9PT0gXCJbb2JqZWN0IERhdGVdXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBpcyBhIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggaXNOYU4oIGRhdGVWYWx1ZS5nZXRUaW1lKCkgKSApIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRlIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZURhdGU7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVWYWx1ZS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IGEgZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZURhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBzdGFydGluZyBkYXRlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBzdGFydGluZyBkYXRlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldFN0YXJ0RGF0ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZT0gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5TVEFSVF9EQVRFKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cmF0ZWREYXRlKHZhbHVlKTtcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBlbmRpbmcgZGF0ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgZW5kaW5nIGRhdGUgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RW5kRGF0ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuRU5EX0RBVEUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VyYXRlZERhdGUodmFsdWUpO1xufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIHZlbnVlIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSB2ZW51ZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRWZW51ZVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlZFTlVFKTsgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIHByb3ZpZGVyIGZpZWxkIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBwcm92aWRlciB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRQcm92aWRlclZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlBST1ZJREVSKTsgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIGltcHJvdmVkIHdheSBvZiByZXByZXNlbnRpbmcgRWxpeGlyRXZlbnREYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9Db21tb25EYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBnZXRFeHBhbmRhYmxlRGV0YWlscyA9IHRoaXMuZ2V0RXhwYW5kYWJsZURldGFpbHMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1haW5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX3Jvd1wiKTtcbiAgICAgICAgICAgIHZhciBsZWZ0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9sZWZ0XCIpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfcmlnaHRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BpY3MpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChnZXRFeHBhbmRhYmxlRGV0YWlscyk7XG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgZXhwYW5kYWJsZSBvYmplY3Qgd2l0aCBtYW55IGRldGFpbHMgcmVsYXRlZCB3aXRoIHRoaXMgRWxpeGlyRXZlbnREYXRhIHJlY29yZC5cbiAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBEcmF3YWJsZSBvYmplY3Qgd2l0aCBkZXRhaWxzIHJlbGF0ZWQgd2l0aCB0aGlzIHJlY29yZC5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRFeHBhbmRhYmxlRGV0YWlscyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgZGV0YWlsc0FycmF5ID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuUHJvdmlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHNwYW5Qcm92aWRlci5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICBzcGFuUHJvdmlkZXIuY2xhc3NMaXN0LmFkZChcInByb3ZpZGVyXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhblByb3ZpZGVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyVmFsdWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHByb3ZpZGVyICE9PSB1bmRlZmluZWQgKSB7ICAgIFxuICAgICAgICAgICAgICAgICAgICBzcGFuUHJvdmlkZXJUZXh0ID0gXCJQcm92aWRlcjogXCIrcHJvdmlkZXI7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5Qcm92aWRlci5pbm5lckhUTUwgPSBzcGFuUHJvdmlkZXJUZXh0O1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuUHJvdmlkZXIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3BhblZlbnVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuVmVudWUuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlLmNsYXNzTGlzdC5hZGQoXCJ2ZW51ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW5WZW51ZVRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZlbnVlID0gdGhpcy5nZXRWZW51ZVZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZW51ZSAhPT0gdW5kZWZpbmVkICkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlVGV4dCA9IHZlbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuVmVudWVUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5Mb2NhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgc3BhbkxvY2F0aW9uLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5jbGFzc0xpc3QuYWRkKFwibG9jYXRpb25cIik7XG4gICAgICAgICAgICB2YXIgc3BhbkxvY2F0aW9uVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgY291bnRyeSA9IHRoaXMuZ2V0Q291bnRyeVZhbHVlKCk7XG4gICAgICAgICAgICB2YXIgY2l0eSA9IHRoaXMuZ2V0Q2l0eVZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoY291bnRyeSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArIGNvdW50cnk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaXR5ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGFuTG9jYXRpb25UZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvblRleHQgPSBzcGFuTG9jYXRpb25UZXh0ICtcIiwgXCIrIGNpdHk7ICBcbiAgICAgICAgICAgICAgICAgICAgfWVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvblRleHQgPSBzcGFuTG9jYXRpb25UZXh0ICsgY2l0eTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYW5Mb2NhdGlvblRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uLmlubmVySFRNTCA9IHNwYW5Mb2NhdGlvblRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuTG9jYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhbkRhdGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBzcGFuRGF0ZXMuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgc3BhbkRhdGVzLmNsYXNzTGlzdC5hZGQoXCJkYXRlc1wiKTtcbiAgICAgICAgICAgIHZhciBzcGFuRGF0ZXNUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBzdGFydERhdGUgPSB0aGlzLmdldFN0YXJ0RGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICB2YXIgZW5kRGF0ZSA9IHRoaXMuZ2V0RW5kRGF0ZVZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzdGFydERhdGUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gXCJGcm9tIFwiK3N0YXJ0RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IHN0YXJ0RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlbmREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BhbkRhdGVzVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gc3BhbkRhdGVzVGV4dCArIFwiIHRvIFwiK2VuZERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBlbmREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYW5EYXRlc1RleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzLmlubmVySFRNTCA9IHNwYW5EYXRlc1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxzQXJyYXkucHVzaChzcGFuRGF0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbWF5YmUgd2UgY2FuIGFkZCBsYXRlciAnY2F0ZWdvcnknIG9yICdrZXl3b3JkcydcbiAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGV0YWlscyA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRldGFpbHNBcnJheSk7XG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kYWJsZURldGFpbHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbGl4aXJFdmVudERhdGE7XG4gICAgICAiLCJ2YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyUmVnaXN0cnlEYXRhIGNvbnN0cnVjdG9yXG4gKiAgICAgICAgICBAcGFyYW0ganNvbkRhdGEge09iamVjdH0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIHRoZSBvcmlnaW5hbCBkYXRhIHJldHJpZXZlZCBieSBvdXIgZGF0YSBzZXJ2ZXIuXG4gKiAgICAgICAgICBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgdGhpcyBzdHJ1Y3R1cmUuXG4gKiAgICAgICAgICAgICAgICAgICAgICBAb3B0aW9uIHtzdHJpbmd9IFtjdXJyZW50RG9tYWluPSd1cmwnXVxuICogICAgICAgICAgICAgICAgICAgICAgVVJMIHdpdGggdGhlIHVzZXIncyBwYWdlIGRvbWFpbi5cbiAqXG4gKi9cbnZhciBFbGl4aXJSZWdpc3RyeURhdGEgPSBmdW5jdGlvbihqc29uRGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnREb21haW46IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiZWxpeGlyX3JlZ2lzdHJ5XCIgOyAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJSZWdpc3RyeURhdGEgY2hpbGQgY2xhc3Mgd2l0aCBzcGVjaWZpYyBpbmZvcm1hdGlvbiBvZiB0aGlzIGtpbmQgb2YgcmVjb3Jkcy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbW9uRGF0YS5wcm90b3R5cGUpO1xuRWxpeGlyUmVnaXN0cnlEYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJSZWdpc3RyeURhdGE7XG5cbiAgICAgICAgICAgIFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIG1vcmUgZGV0YWlsZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhIEVsaXhpclJlZ2lzdHJ5RGF0YSByZWNvcmQgdHJhbnNmb3JtZWRcbiAqICAgICAgICAgIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoPkNvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgQ29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pK1wiIFsuLi5dXCIsWydlbGl4aXJfcmVnaXN0cnknXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLFsnZWxpeGlyX3JlZ2lzdHJ5J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChleHBhbmRhYmxlRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyUmVnaXN0cnlEYXRhOyIsIlxudmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclRyYWluaW5nRGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICogICAgICAgICAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIHRoaXMgc3RydWN0dXJlLlxuICogICAgICAgICAgICAgICAgICAgICAgQG9wdGlvbiB7c3RyaW5nfSBbY3VycmVudERvbWFpbj0ndXJsJ11cbiAqICAgICAgICAgICAgICAgICAgICAgIFVSTCB3aXRoIHRoZSB1c2VyJ3MgcGFnZSBkb21haW4uXG4gKlxuICovXG52YXIgRWxpeGlyVHJhaW5pbmdEYXRhID0gZnVuY3Rpb24oanNvbkRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RG9tYWluOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xuICAgICAgICAgICAgdGhpcy5TT1VSQ0VfRklFTERfVkFMVUUgPSBcImNrYW5cIjsgXG59O1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclRyYWluaW5nRGF0YSBjaGlsZCBjbGFzcyB3aXRoIHNwZWNpZmljIGluZm9ybWF0aW9uIG9mIHRoaXMga2luZCBvZiByZWdpc3RyaWVzLlxuICovXG5FbGl4aXJUcmFpbmluZ0RhdGEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tb25EYXRhLnByb3RvdHlwZSk7IFxuRWxpeGlyVHJhaW5pbmdEYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJUcmFpbmluZ0RhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBvbmUgbW9yZSBkZXRhaWxlZCB3YXkgb2YgcmVwcmVzZW50aW5nIGEgRWxpeGlyVHJhaW5pbmdEYXRhIHJlY29yZCB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gKi9cbkVsaXhpclRyYWluaW5nRGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0TGFiZWxUaXRsZSgpO1xuICAgICAgICAgICAgdmFyIHRvcGljcyA9IHRoaXMuZ2V0TGFiZWxUb3BpY3MoKTtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRJbWFnZVJlc291cmNlVHlwZXMoKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RGVzY3JpcHRpb25WYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gIT0gdW5kZWZpbmVkICYmIGRlc2NyaXB0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aD5Db21tb25EYXRhLk1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIENvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKStcIiBbLi4uXVwiLFsndHJhaW5pbmdfbWF0ZXJpYWwnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLFsndHJhaW5pbmdfbWF0ZXJpYWwnXSk7ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZXhwYW5kYWJsZURlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xufTtcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsaXhpclRyYWluaW5nRGF0YTsiLCJ2YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcblxuLyoqIFxuICogUGFnZU1hbmFnZXIgY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtDb250ZXh0RGF0YUxpc3QgT2JqZWN0fSBSZWZlcmVuY2UgdG8gQ29udGV4dERhdGFMaXN0IG9iamVjdCBpbiBvcmRlciB0byBtYW5hZ2UgaXRzIGZpbHRlcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBmb3IgUGFnZU1hbmFnZXIgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0PSdZb3VyT3duRGl2SWQnXVxuICogICAgSWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKi9cbnZhciBQYWdlTWFuYWdlciA9IGZ1bmN0aW9uKGNvbnRleHREYXRhTGlzdCwgb3B0aW9ucykge1xuXHR2YXIgY29uc3RzID0ge1xuXHR9O1xuXHR2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHsgICAgICAgIFxuXHR9O1xuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0ICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdCAgICAgdGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1xuXHR9XG5cdFxuXHRmb3IodmFyIGtleSBpbiBjb25zdHMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGNvbnN0c1trZXldO1xuXHR9XG4gICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0ID0gY29udGV4dERhdGFMaXN0O1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQgPSAwO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5yZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24odGhpcywgdGhpcy5idWlsZCk7XG59XG5cbi8qKiBcbiAqIFBhZ2VNYW5hZ2VyIGZ1bmN0aW9uYWxpdHkuXG4gKiBcbiAqIEBjbGFzcyBQYWdlTWFuYWdlclxuICogXG4gKi9cblBhZ2VNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IFBhZ2VNYW5hZ2VyLFxuICAgICAgICBcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcblx0ICovICAgICAgICBcblx0YnVpbGQgOiBmdW5jdGlvbiAoKXtcblx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRJZCk7XG5cdFx0aWYgKHRhcmdldCA9PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09IG51bGwpe1xuXHRcdFx0cmV0dXJuO1x0XG5cdFx0fVxuXHRcdHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGFyZ2V0LnJlbW92ZUNoaWxkKHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUil7XG5cdFx0XHR2YXIgc3RhdHVzVGV4dCA9IHRoaXMuZ2V0Q3VycmVudFN0YXR1cygpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0YXR1c1RleHQpO1xuXHRcdH1lbHNlIGlmICh0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BREVEKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0XHRcblx0XHRcdHZhciBuYXZEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdG5hdkRpdi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfbmF2Jyk7XG5cdFx0XHRcblx0XHRcdHZhciBwcmV2aW91c0J1dHRvbiA9IHRoaXMuY3JlYXRlUHJldmlvdXNCdXR0b24oKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZChwcmV2aW91c0J1dHRvbik7XG5cdFx0XHRcblx0XHRcdHZhciB0ZXh0U2VwYXJhdG9yID0gdGhpcy5jcmVhdGVUZXh0U2VwYXJhdG9yKCk7XG5cdFx0XHRuYXZEaXYuYXBwZW5kQ2hpbGQodGV4dFNlcGFyYXRvcik7XG5cdFx0XHRcblx0XHRcdHZhciBuZXh0QnV0dG9uID0gdGhpcy5jcmVhdGVOZXh0QnV0dG9uKCk7XG5cdFx0XHRuYXZEaXYuYXBwZW5kQ2hpbGQobmV4dEJ1dHRvbik7XG5cdFx0XHRcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChuYXZEaXYpO1xuXHRcdH1lbHNle1xuXHRcdFx0Y29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBzdGF0dXM6IFwiK3RoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMpO1xuXHRcdH1cblx0XHRcblx0fSxcbiAgICAgICAgXG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIHRleHQgc2VwYXJhdG9yLlxuICAgICAgICAqLyAgXG5cdGNyZWF0ZVRleHRTZXBhcmF0b3IgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdHZhciB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy0nKTtcblx0XHRlbGVtZW50LmFwcGVuZENoaWxkKHRleHQpO1xuXHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgaWYgaXQncyBwb3NzaWJsZSB0byByZXRyaWV2ZSBwcmV2aW91cyByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGV4aXN0UHJldmlvdXNSZXN1bHRzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgc3RhcnRSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0aWYgKHN0YXJ0UmVzdWx0ID09IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ZWxzZVxuXHRcdFx0cmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBpZiBpdCdzIHBvc3NpYmxlIHRvIHJldHJpZXZlIG5leHQgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBleGlzdE5leHRSZXN1bHRzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgc3RhcnRSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0dmFyIG1heFJvd3MgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0dmFyIHRvdGFsUmVzdWx0cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cblx0XHRpZiAoc3RhcnRSZXN1bHQrbWF4Um93czx0b3RhbFJlc3VsdHMpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNyZWF0ZXMgb25lIGJ1dHRvbiB0byBnZXQgcHJldmlvdXMgcmVzdWx0cy5Pbmx5IHRleHQgaWYgdGhlcmUgYXJlbid0IHByZXZpb3VzIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlUHJldmlvdXNCdXR0b24gOiBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmV4aXN0UHJldmlvdXNSZXN1bHRzKCkpIHtcblx0XHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0dmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1ByZXZpb3VzJyk7XG5cdFx0XHRidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuXHRcdFx0YnV0dG9uLnRpdGxlID0gJ1ByZXZpb3VzJztcblx0XHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0XHR2YXIgbXlQYWdlTWFuYWdlciA9IHRoaXM7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuXHRcdFx0ICAgIHZhciBtYXhSb3dzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuZ2V0TWF4Um93cygpO1xuXHRcdFx0ICAgIHZhciB0b3RhbFJlc3VsdHMgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0ICAgIHZhciBzdGFydFJlc3VsdCA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRcdCAgICB2YXIgbmV3U3RhcnRSZXN1bHQgPSAwO1xuXHRcdFx0ICAgIGlmIChzdGFydFJlc3VsdC1tYXhSb3dzPD0wKSB7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IDA7XHRcblx0XHRcdCAgICB9ZWxzZXtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQtbWF4Um93cztcblx0XHRcdCAgICB9XG5cdFx0XHQgICAgbXlQYWdlTWFuYWdlci5fY2hhbmdlUGFnZShuZXdTdGFydFJlc3VsdCk7XG5cdFx0XHQgICAgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJ1dHRvbjsgIFxuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHByZXZpb3VzU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdHZhciBwcmV2aW91c1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUHJldmlvdXMnKTtcblx0XHRcdHByZXZpb3VzU3Bhbi5hcHBlbmRDaGlsZChwcmV2aW91c1RleHQpO1xuXHRcdFx0cHJldmlvdXNTcGFuLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHJldHVybiBwcmV2aW91c1NwYW47XG5cdFx0fVxuICAgICAgICAgICAgICBcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHRvIGdldCBwcmV2aW91cyByZXN1bHRzLk9ubHkgdGV4dCBpZiB0aGVyZSBhcmVuJ3QgbW9yZSByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGNyZWF0ZU5leHRCdXR0b24gOiBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLmV4aXN0TmV4dFJlc3VsdHMoKSkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTmV4dCcpO1xuXHRcdFx0YnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcblx0XHRcdGJ1dHRvbi50aXRsZSA9ICdOZXh0Jztcblx0XHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0XHR2YXIgbXlQYWdlTWFuYWdlciA9IHRoaXM7XG5cdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuXHRcdFx0ICAgIHZhciBtYXhSb3dzID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuZ2V0TWF4Um93cygpO1xuXHRcdFx0ICAgIHZhciB0b3RhbFJlc3VsdHMgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0ICAgIHZhciBzdGFydFJlc3VsdCA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRcdCAgICB2YXIgbmV3U3RhcnRSZXN1bHQgPSAwO1xuXHRcdFx0ICAgIGlmIChzdGFydFJlc3VsdCttYXhSb3dzPHRvdGFsUmVzdWx0cykge1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdCttYXhSb3dzO1x0XG5cdFx0XHQgICAgfWVsc2V7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgICBteVBhZ2VNYW5hZ2VyLl9jaGFuZ2VQYWdlKG5ld1N0YXJ0UmVzdWx0KTtcblx0XHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIG5leHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0dmFyIG5leHRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ05leHQnKTtcblx0XHRcdG5leHRTcGFuLmFwcGVuZENoaWxkKG5leHRUZXh0KTtcblx0XHRcdG5leHRTcGFuLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHJldHVybiBuZXh0U3Bhbjtcblx0XHR9XG4gICAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyB0aGUgcmVkcmF3biBvZiB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBoYXZpbmcgaW50byBhY2NvdW50XG4gICAgICAgICogcHJldmlvdXNseSBjaG9zZW4gZmlsdGVycy5cbiAgICAgICAgKiBAcGFyYW0gc3RhcnRSZXN1bHQge0ludGVnZXJ9IC0gbnVtYmVyIG9mIHRoZSBmaXJzdCByZXN1bHQgdG8gYmUgc2hvd25cbiAgICAgICAgKi8gIFxuICAgICAgICBfY2hhbmdlUGFnZTogZnVuY3Rpb24gKHN0YXJ0UmVzdWx0KXtcblx0ICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0O1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuZHJhd0NvbnRleHREYXRhTGlzdCgpO1xuICAgICAgICB9LFxuXHQgXG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHRleHR1YWwgZGVzY3JpcHRpb24gb2Y6IGZpcnN0IHJlc3VsdCBzaG93biwgbGFzdCByZXN1bHRzIHNob3duIGFuZFxuICAgICAgICAqIHRvdGFsIG51bWJlciBvZiByZXN1bHRzLlxuICAgICAgICAqLyAgXG5cdGdldEN1cnJlbnRTdGF0dXMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfc3RhdHVzJyk7XG5cdFx0dmFyIHN0YXJ0aW5nUmVzdWx0ID0gbnVsbDtcblx0XHR2YXIgZW5kaW5nUmVzdWx0ID0gbnVsbDtcblx0XHR2YXIgdG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHR2YXIgcmVzdWx0VGV4dCA9IFwiXCI7XG5cdFx0XG5cdFx0aWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHJlc3VsdFRleHQgPSBcIkxvYWRpbmcgcmVzb3VyY2VzLi4uXCI7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUil7XG5cdFx0XHRyZXN1bHRUZXh0ID0gXCJcIjtcblx0XHR9ZWxzZXtcblx0XHRcdHN0YXJ0aW5nUmVzdWx0ID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0dmFyIGN1cnJlbnRUb3RhbFJlc3VsdHMgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50VG90YWxSZXN1bHRzO1xuXHRcdFx0dmFyIG51bVJvd3NMb2FkZWQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cztcblx0XHRcdFxuXHRcdFx0ZW5kaW5nUmVzdWx0ID0gc3RhcnRpbmdSZXN1bHQgKyBudW1Sb3dzTG9hZGVkO1xuXHRcdFx0aWYgKGN1cnJlbnRUb3RhbFJlc3VsdHM+MCkge1xuXHRcdFx0XHQvLyBvbmx5IHRvIHNob3cgaXQgdG8gdGhlIHVzZXJcblx0XHRcdFx0c3RhcnRpbmdSZXN1bHQgPSBzdGFydGluZ1Jlc3VsdCsxO1xuXHRcdFx0fVxuXHRcdFx0cmVzdWx0VGV4dCA9IFwiUmVjb3JkcyBcIitzdGFydGluZ1Jlc3VsdCtcIiB0byBcIitlbmRpbmdSZXN1bHQrXCIgb2YgXCIrY3VycmVudFRvdGFsUmVzdWx0c1xuXHRcdFx0XG5cdFx0fVxuXHRcdGVsZW1lbnQuaW5uZXJIVE1MID0gcmVzdWx0VGV4dDtcblx0XHRcblx0XHRyZXR1cm4gZWxlbWVudDtcblx0fVxuICAgICAgICBcbiAgICAgICAgXG59XG4gICAgICBcbm1vZHVsZS5leHBvcnRzID0gUGFnZU1hbmFnZXI7XG4gICAgICBcbiAgIiwiXG5cbmZ1bmN0aW9uIGRlZmluZShuYW1lLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiAgICAgIHZhbHVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSk7XG59XG5cbi8vIENvbnRleHREYXRhTGlzdCBjb25zdGFudHNcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9TT1VSQ0VfRUxJWElSX1JFR0lTVFJZXCIsIFwiRVNSXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfVEVTU1wiLCBcIlRTU1wiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9TT1VSQ0VfRUxJWElSX0VWRU5UU1wiLCBcIkVFVlwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFXCIsIFwiRlVMTF9TVFlMRVwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEVcIiwgXCJDT01NT05fU1RZTEVcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfTUFYX1JPV1NcIiwgMTAwKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9OVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OXCIsIDUwKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FVlRfT05fUkVTVUxUU19MT0FERURcIiwgXCJvblJlc3VsdHNMb2FkZWRcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRVZUX09OX1JFUVVFU1RfRVJST1JcIiwgXCJvblJlcXVlc3RFcnJvclwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9MT0FESU5HXCIsIFwiTE9BRElOR1wiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9MT0FERURcIiwgXCJMT0FERURcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfRVJST1JcIiwgXCJFUlJPUlwiKTtcblxuLy8gQ29tbW9uRGF0YSBjb25zdGFudHNcbmRlZmluZShcIkNvbW1vbkRhdGFfTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OXCIsIDEwMDApO1xuXG4vLyBCdXR0b25zTWFuYWdlciBjb25zdGFudHNcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX1NRVUFSRURfM0RcIiwgXCJTUVVBUkVEXzNEXCIpO1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfUk9VTkRfRkxBVFwiLCBcIlJPVU5EX0ZMQVRcIik7XG5kZWZpbmUoXCJCdXR0b25zTWFuYWdlcl9JQ09OU19PTkxZXCIsIFwiSUNPTlNfT05MWVwiKTtcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX0VMSVhJUlwiLCBcIkVMSVhJUlwiKTtcblxuLy8gUmVzb3VyY2VUeXBlU2V0cyBjb25zdGFudHNcbmRlZmluZShcIlJlc291cmNlVHlwZVNldHNfRkxBVFwiLCBcIkZMQVRcIik7XG5kZWZpbmUoXCJSZXNvdXJjZVR5cGVTZXRzX0VMSVhJUlwiLCBcIkVMSVhJUlwiKTtcblxuIixudWxsLCIvKiFcbiAgKiBSZXF3ZXN0ISBBIGdlbmVyYWwgcHVycG9zZSBYSFIgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICogbGljZW5zZSBNSVQgKGMpIER1c3RpbiBEaWF6IDIwMTVcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL3JlcXdlc3RcbiAgKi9cblxuIWZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSgncmVxd2VzdCcsIHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgY29udGV4dCA9IHRoaXNcblxuICBpZiAoJ3dpbmRvdycgaW4gY29udGV4dCkge1xuICAgIHZhciBkb2MgPSBkb2N1bWVudFxuICAgICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAgICwgaGVhZCA9IGRvY1tieVRhZ10oJ2hlYWQnKVswXVxuICB9IGVsc2Uge1xuICAgIHZhciBYSFIyXG4gICAgdHJ5IHtcbiAgICAgIFhIUjIgPSByZXF1aXJlKCd4aHIyJylcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQZWVyIGRlcGVuZGVuY3kgYHhocjJgIHJlcXVpcmVkISBQbGVhc2UgbnBtIGluc3RhbGwgeGhyMicpXG4gICAgfVxuICB9XG5cblxuICB2YXIgaHR0cHNSZSA9IC9eaHR0cC9cbiAgICAsIHByb3RvY29sUmUgPSAvKF5cXHcrKTpcXC9cXC8vXG4gICAgLCB0d29IdW5kbyA9IC9eKDIwXFxkfDEyMjMpJC8gLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgICAsIHJlYWR5U3RhdGUgPSAncmVhZHlTdGF0ZSdcbiAgICAsIGNvbnRlbnRUeXBlID0gJ0NvbnRlbnQtVHlwZSdcbiAgICAsIHJlcXVlc3RlZFdpdGggPSAnWC1SZXF1ZXN0ZWQtV2l0aCdcbiAgICAsIHVuaXFpZCA9IDBcbiAgICAsIGNhbGxiYWNrUHJlZml4ID0gJ3JlcXdlc3RfJyArICgrbmV3IERhdGUoKSlcbiAgICAsIGxhc3RWYWx1ZSAvLyBkYXRhIHN0b3JlZCBieSB0aGUgbW9zdCByZWNlbnQgSlNPTlAgY2FsbGJhY2tcbiAgICAsIHhtbEh0dHBSZXF1ZXN0ID0gJ1hNTEh0dHBSZXF1ZXN0J1xuICAgICwgeERvbWFpblJlcXVlc3QgPSAnWERvbWFpblJlcXVlc3QnXG4gICAgLCBub29wID0gZnVuY3Rpb24gKCkge31cblxuICAgICwgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09ICdmdW5jdGlvbidcbiAgICAgICAgPyBBcnJheS5pc0FycmF5XG4gICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICB9XG5cbiAgICAsIGRlZmF1bHRIZWFkZXJzID0ge1xuICAgICAgICAgICdjb250ZW50VHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICwgJ3JlcXVlc3RlZFdpdGgnOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsICdhY2NlcHQnOiB7XG4gICAgICAgICAgICAgICcqJzogICd0ZXh0L2phdmFzY3JpcHQsIHRleHQvaHRtbCwgYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbCwgKi8qJ1xuICAgICAgICAgICAgLCAneG1sJzogICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJ1xuICAgICAgICAgICAgLCAnaHRtbCc6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICAgICAgICAsICdqc29uJzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdCdcbiAgICAgICAgICAgICwgJ2pzJzogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAob1snY3Jvc3NPcmlnaW4nXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSBjb250ZXh0W3htbEh0dHBSZXF1ZXN0XSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbFxuICAgICAgICAgIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICByZXR1cm4geGhyXG4gICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0W3hEb21haW5SZXF1ZXN0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNyb3NzLW9yaWdpbiByZXF1ZXN0cycpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHRbeG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSBpZiAoWEhSMikge1xuICAgICAgICAgIHJldHVybiBuZXcgWEhSMigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gc3VjY2VlZChyKSB7XG4gICAgdmFyIHByb3RvY29sID0gcHJvdG9jb2xSZS5leGVjKHIudXJsKVxuICAgIHByb3RvY29sID0gKHByb3RvY29sICYmIHByb3RvY29sWzFdKSB8fCBjb250ZXh0LmxvY2F0aW9uLnByb3RvY29sXG4gICAgcmV0dXJuIGh0dHBzUmUudGVzdChwcm90b2NvbCkgPyB0d29IdW5kby50ZXN0KHIucmVxdWVzdC5zdGF0dXMpIDogISFyLnJlcXVlc3QucmVzcG9uc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlYWR5U3RhdGUociwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdXNlIF9hYm9ydGVkIHRvIG1pdGlnYXRlIGFnYWluc3QgSUUgZXJyIGMwMGMwMjNmXG4gICAgICAvLyAoY2FuJ3QgcmVhZCBwcm9wcyBvbiBhYm9ydGVkIHJlcXVlc3Qgb2JqZWN0cylcbiAgICAgIGlmIChyLl9hYm9ydGVkKSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgaWYgKHIuX3RpbWVkT3V0KSByZXR1cm4gZXJyb3Ioci5yZXF1ZXN0LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0JylcbiAgICAgIGlmIChyLnJlcXVlc3QgJiYgci5yZXF1ZXN0W3JlYWR5U3RhdGVdID09IDQpIHtcbiAgICAgICAgci5yZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG5vb3BcbiAgICAgICAgaWYgKHN1Y2NlZWQocikpIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gb1snaGVhZGVycyddIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnNbJ0FjY2VwdCddID0gaGVhZGVyc1snQWNjZXB0J11cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVtvWyd0eXBlJ11dXG4gICAgICB8fCBkZWZhdWx0SGVhZGVyc1snYWNjZXB0J11bJyonXVxuXG4gICAgdmFyIGlzQUZvcm1EYXRhID0gdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiAob1snZGF0YSddIGluc3RhbmNlb2YgRm9ybURhdGEpO1xuICAgIC8vIGJyZWFrcyBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgd2l0aCBsZWdhY3kgYnJvd3NlcnNcbiAgICBpZiAoIW9bJ2Nyb3NzT3JpZ2luJ10gJiYgIWhlYWRlcnNbcmVxdWVzdGVkV2l0aF0pIGhlYWRlcnNbcmVxdWVzdGVkV2l0aF0gPSBkZWZhdWx0SGVhZGVyc1sncmVxdWVzdGVkV2l0aCddXG4gICAgaWYgKCFoZWFkZXJzW2NvbnRlbnRUeXBlXSAmJiAhaXNBRm9ybURhdGEpIGhlYWRlcnNbY29udGVudFR5cGVdID0gb1snY29udGVudFR5cGUnXSB8fCBkZWZhdWx0SGVhZGVyc1snY29udGVudFR5cGUnXVxuICAgIGZvciAoaCBpbiBoZWFkZXJzKVxuICAgICAgaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoKSAmJiAnc2V0UmVxdWVzdEhlYWRlcicgaW4gaHR0cCAmJiBodHRwLnNldFJlcXVlc3RIZWFkZXIoaCwgaGVhZGVyc1toXSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldENyZWRlbnRpYWxzKGh0dHAsIG8pIHtcbiAgICBpZiAodHlwZW9mIG9bJ3dpdGhDcmVkZW50aWFscyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaHR0cC53aXRoQ3JlZGVudGlhbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBodHRwLndpdGhDcmVkZW50aWFscyA9ICEhb1snd2l0aENyZWRlbnRpYWxzJ11cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmFsQ2FsbGJhY2soZGF0YSkge1xuICAgIGxhc3RWYWx1ZSA9IGRhdGFcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybGFwcGVuZCAodXJsLCBzKSB7XG4gICAgcmV0dXJuIHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKSB7XG4gICAgdmFyIHJlcUlkID0gdW5pcWlkKytcbiAgICAgICwgY2JrZXkgPSBvWydqc29ucENhbGxiYWNrJ10gfHwgJ2NhbGxiYWNrJyAvLyB0aGUgJ2NhbGxiYWNrJyBrZXlcbiAgICAgICwgY2J2YWwgPSBvWydqc29ucENhbGxiYWNrTmFtZSddIHx8IHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXgocmVxSWQpXG4gICAgICAsIGNicmVnID0gbmV3IFJlZ0V4cCgnKChefFxcXFw/fCYpJyArIGNia2V5ICsgJyk9KFteJl0rKScpXG4gICAgICAsIG1hdGNoID0gdXJsLm1hdGNoKGNicmVnKVxuICAgICAgLCBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICwgbG9hZGVkID0gMFxuICAgICAgLCBpc0lFMTAgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgMTAuMCcpICE9PSAtMVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBpZiAobWF0Y2hbM10gPT09ICc/Jykge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShjYnJlZywgJyQxPScgKyBjYnZhbCkgLy8gd2lsZGNhcmQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYnZhbCA9IG1hdGNoWzNdIC8vIHByb3ZpZGVkIGNhbGxiYWNrIGZ1bmMgbmFtZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmxhcHBlbmQodXJsLCBjYmtleSArICc9JyArIGNidmFsKSAvLyBubyBjYWxsYmFjayBkZXRhaWxzLCBhZGQgJ2VtXG4gICAgfVxuXG4gICAgY29udGV4dFtjYnZhbF0gPSBnZW5lcmFsQ2FsbGJhY2tcblxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICBzY3JpcHQuc3JjID0gdXJsXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgIGlmICh0eXBlb2Ygc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzSUUxMCkge1xuICAgICAgLy8gbmVlZCB0aGlzIGZvciBJRSBkdWUgdG8gb3V0LW9mLW9yZGVyIG9ucmVhZHlzdGF0ZWNoYW5nZSgpLCBiaW5kaW5nIHNjcmlwdFxuICAgICAgLy8gZXhlY3V0aW9uIHRvIGFuIGV2ZW50IGxpc3RlbmVyIGdpdmVzIHVzIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBzY3JpcHRcbiAgICAgIC8vIGlzIGV4ZWN1dGVkLiBTZWUgaHR0cDovL2phdWJvdXJnLm5ldC8yMDEwLzA3L2xvYWRpbmctc2NyaXB0LWFzLW9uY2xpY2staGFuZGxlci1vZi5odG1sXG4gICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZCA9ICdfcmVxd2VzdF8nICsgcmVxSWRcbiAgICB9XG5cbiAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgoc2NyaXB0W3JlYWR5U3RhdGVdICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2NvbXBsZXRlJyAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdsb2FkZWQnKSB8fCBsb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgIHNjcmlwdC5vbmNsaWNrICYmIHNjcmlwdC5vbmNsaWNrKClcbiAgICAgIC8vIENhbGwgdGhlIHVzZXIgY2FsbGJhY2sgd2l0aCB0aGUgbGFzdCB2YWx1ZSBzdG9yZWQgYW5kIGNsZWFuIHVwIHZhbHVlcyBhbmQgc2NyaXB0cy5cbiAgICAgIGZuKGxhc3RWYWx1ZSlcbiAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICBsb2FkZWQgPSAxXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBzY3JpcHQgdG8gdGhlIERPTSBoZWFkXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbiAgICAvLyBFbmFibGUgSlNPTlAgdGltZW91dFxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgZXJyKHt9LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0Jywge30pXG4gICAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgICAgbG9hZGVkID0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3QoZm4sIGVycikge1xuICAgIHZhciBvID0gdGhpcy5vXG4gICAgICAsIG1ldGhvZCA9IChvWydtZXRob2QnXSB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuICAgICAgLCB1cmwgPSB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICAgIC8vIGNvbnZlcnQgbm9uLXN0cmluZyBvYmplY3RzIHRvIHF1ZXJ5LXN0cmluZyBmb3JtIHVubGVzcyBvWydwcm9jZXNzRGF0YSddIGlzIGZhbHNlXG4gICAgICAsIGRhdGEgPSAob1sncHJvY2Vzc0RhdGEnXSAhPT0gZmFsc2UgJiYgb1snZGF0YSddICYmIHR5cGVvZiBvWydkYXRhJ10gIT09ICdzdHJpbmcnKVxuICAgICAgICA/IHJlcXdlc3QudG9RdWVyeVN0cmluZyhvWydkYXRhJ10pXG4gICAgICAgIDogKG9bJ2RhdGEnXSB8fCBudWxsKVxuICAgICAgLCBodHRwXG4gICAgICAsIHNlbmRXYWl0ID0gZmFsc2VcblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgb24gYSBHRVQgcmVxdWVzdCBhbmQgd2UgaGF2ZSBkYXRhIHRoZW4gd2Ugc2hvdWxkIGFwcGVuZFxuICAgIC8vIHF1ZXJ5IHN0cmluZyB0byBlbmQgb2YgVVJMIGFuZCBub3QgcG9zdCBkYXRhXG4gICAgaWYgKChvWyd0eXBlJ10gPT0gJ2pzb25wJyB8fCBtZXRob2QgPT0gJ0dFVCcpICYmIGRhdGEpIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGRhdGEpXG4gICAgICBkYXRhID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChvWyd0eXBlJ10gPT0gJ2pzb25wJykgcmV0dXJuIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybClcblxuICAgIC8vIGdldCB0aGUgeGhyIGZyb20gdGhlIGZhY3RvcnkgaWYgcGFzc2VkXG4gICAgLy8gaWYgdGhlIGZhY3RvcnkgcmV0dXJucyBudWxsLCBmYWxsLWJhY2sgdG8gb3Vyc1xuICAgIGh0dHAgPSAoby54aHIgJiYgby54aHIobykpIHx8IHhocihvKVxuXG4gICAgaHR0cC5vcGVuKG1ldGhvZCwgdXJsLCBvWydhc3luYyddID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBzZXRIZWFkZXJzKGh0dHAsIG8pXG4gICAgc2V0Q3JlZGVudGlhbHMoaHR0cCwgbylcbiAgICBpZiAoY29udGV4dFt4RG9tYWluUmVxdWVzdF0gJiYgaHR0cCBpbnN0YW5jZW9mIGNvbnRleHRbeERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvWydiZWZvcmUnXSAmJiBvWydiZWZvcmUnXShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUoaGVhZGVyKSB7XG4gICAgLy8ganNvbiwgamF2YXNjcmlwdCwgdGV4dC9wbGFpbiwgdGV4dC9odG1sLCB4bWxcbiAgICBpZiAoaGVhZGVyID09PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkOyAvL0luIGNhc2Ugb2Ygbm8gY29udGVudC10eXBlLlxuICAgIGlmIChoZWFkZXIubWF0Y2goJ2pzb24nKSkgcmV0dXJuICdqc29uJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ2phdmFzY3JpcHQnKSkgcmV0dXJuICdqcydcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd0ZXh0JykpIHJldHVybiAnaHRtbCdcbiAgICBpZiAoaGVhZGVyLm1hdGNoKCd4bWwnKSkgcmV0dXJuICd4bWwnXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KG8sIGZuKSB7XG5cbiAgICB0aGlzLnVybCA9IHR5cGVvZiBvID09ICdzdHJpbmcnID8gbyA6IG9bJ3VybCddXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuXG4gICAgLy8gd2hldGhlciByZXF1ZXN0IGhhcyBiZWVuIGZ1bGZpbGxlZCBmb3IgcHVycG9zZVxuICAgIC8vIG9mIHRyYWNraW5nIHRoZSBQcm9taXNlc1xuICAgIHRoaXMuX2Z1bGZpbGxlZCA9IGZhbHNlXG4gICAgLy8gc3VjY2VzcyBoYW5kbGVyc1xuICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oKXt9XG4gICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycyA9IFtdXG4gICAgLy8gZXJyb3IgaGFuZGxlcnNcbiAgICB0aGlzLl9lcnJvckhhbmRsZXJzID0gW11cbiAgICAvLyBjb21wbGV0ZSAoYm90aCBzdWNjZXNzIGFuZCBmYWlsKSBoYW5kbGVyc1xuICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMgPSBbXVxuICAgIHRoaXMuX2VycmVkID0gZmFsc2VcbiAgICB0aGlzLl9yZXNwb25zZUFyZ3MgPSB7fVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICBmbiA9IGZuIHx8IGZ1bmN0aW9uICgpIHt9XG5cbiAgICBpZiAob1sndGltZW91dCddKSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZWRPdXQoKVxuICAgICAgfSwgb1sndGltZW91dCddKVxuICAgIH1cblxuICAgIGlmIChvWydzdWNjZXNzJ10pIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydzdWNjZXNzJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvWydlcnJvciddKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvWydlcnJvciddLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG9bJ2NvbXBsZXRlJ10pIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2NvbXBsZXRlJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgb1sndGltZW91dCddICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHZhciB0eXBlID0gb1sndHlwZSddIHx8IHJlc3AgJiYgc2V0VHlwZShyZXNwLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSkgLy8gcmVzcCBjYW4gYmUgdW5kZWZpbmVkIGluIElFXG4gICAgICByZXNwID0gKHR5cGUgIT09ICdqc29ucCcpID8gc2VsZi5yZXF1ZXN0IDogcmVzcFxuICAgICAgLy8gdXNlIGdsb2JhbCBkYXRhIGZpbHRlciBvbiByZXNwb25zZSB0ZXh0XG4gICAgICB2YXIgZmlsdGVyZWRSZXNwb25zZSA9IGdsb2JhbFNldHVwT3B0aW9ucy5kYXRhRmlsdGVyKHJlc3AucmVzcG9uc2VUZXh0LCB0eXBlKVxuICAgICAgICAsIHIgPSBmaWx0ZXJlZFJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dCA9IHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2FuJ3QgYXNzaWduIHRoaXMgaW4gSUU8PTgsIGp1c3QgaWdub3JlXG4gICAgICB9XG4gICAgICBpZiAocikge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3AgPSBjb250ZXh0LkpTT04gPyBjb250ZXh0LkpTT04ucGFyc2UocikgOiBldmFsKCcoJyArIHIgKyAnKScpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IocmVzcCwgJ0NvdWxkIG5vdCBwYXJzZSBKU09OIGluIHJlc3BvbnNlJywgZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgcmVzcCA9IGV2YWwocilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICByZXNwID0gclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgcmVzcCA9IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yIC8vIElFIHRyb2xvbG9cbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLmVycm9yQ29kZVxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IucmVhc29uXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9mdWxmaWxsZWQgPSB0cnVlXG4gICAgICBmbihyZXNwKVxuICAgICAgc2VsZi5fc3VjY2Vzc0hhbmRsZXIocmVzcClcbiAgICAgIHdoaWxlIChzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcCA9IHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuXG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWVkT3V0KCkge1xuICAgICAgc2VsZi5fdGltZWRPdXQgPSB0cnVlXG4gICAgICBzZWxmLnJlcXVlc3QuYWJvcnQoKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3AsIG1zZywgdCkge1xuICAgICAgcmVzcCA9IHNlbGYucmVxdWVzdFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MubXNnID0gbXNnXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MudCA9IHRcbiAgICAgIHNlbGYuX2VycmVkID0gdHJ1ZVxuICAgICAgd2hpbGUgKHNlbGYuX2Vycm9ySGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkocmVzcCwgbXNnLCB0KVxuICAgICAgfVxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSBnZXRSZXF1ZXN0LmNhbGwodGhpcywgc3VjY2VzcywgZXJyb3IpXG4gIH1cblxuICBSZXF3ZXN0LnByb3RvdHlwZSA9IHtcbiAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWVcbiAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICwgcmV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXQuY2FsbCh0aGlzLCB0aGlzLm8sIHRoaXMuZm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU21hbGwgZGV2aWF0aW9uIGZyb20gdGhlIFByb21pc2VzIEEgQ29tbW9uSnMgc3BlY2lmaWNhdGlvblxuICAgICAqIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1Byb21pc2VzL0FcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIGB0aGVuYCB3aWxsIGV4ZWN1dGUgdXBvbiBzdWNjZXNzZnVsIHJlcXVlc3RzXG4gICAgICovXG4gICwgdGhlbjogZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBmYWlsID0gZmFpbCB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCA9IHN1Y2Nlc3ModGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZhaWwodGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpXG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmYWlsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgYWx3YXlzYCB3aWxsIGV4ZWN1dGUgd2hldGhlciB0aGUgcmVxdWVzdCBzdWNjZWVkcyBvciBmYWlsc1xuICAgICAqL1xuICAsIGFsd2F5czogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkIHx8IHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgZmFpbGAgd2lsbCBleGVjdXRlIHdoZW4gdGhlIHJlcXVlc3QgZmFpbHNcbiAgICAgKi9cbiAgLCBmYWlsOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgLCAnY2F0Y2gnOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiB0aGlzLmZhaWwoZm4pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVxd2VzdChvLCBmbikge1xuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIC8vIG5vcm1hbGl6ZSBuZXdsaW5lIHZhcmlhbnRzIGFjY29yZGluZyB0byBzcGVjIC0+IENSTEZcbiAgZnVuY3Rpb24gbm9ybWFsaXplKHMpIHtcbiAgICByZXR1cm4gcyA/IHMucmVwbGFjZSgvXFxyP1xcbi9nLCAnXFxyXFxuJykgOiAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gc2VyaWFsKGVsLCBjYikge1xuICAgIHZhciBuID0gZWwubmFtZVxuICAgICAgLCB0ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIG9wdENiID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgICAvLyBJRSBnaXZlcyB2YWx1ZT1cIlwiIGV2ZW4gd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgYXR0cmlidXRlXG4gICAgICAgICAgLy8gJ3NwZWNpZmllZCcgcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2NvcmUuaHRtbCNJRC04NjI1MjkyNzNcbiAgICAgICAgICBpZiAobyAmJiAhb1snZGlzYWJsZWQnXSlcbiAgICAgICAgICAgIGNiKG4sIG5vcm1hbGl6ZShvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ10gJiYgb1snYXR0cmlidXRlcyddWyd2YWx1ZSddWydzcGVjaWZpZWQnXSA/IG9bJ3ZhbHVlJ10gOiBvWyd0ZXh0J10pKVxuICAgICAgICB9XG4gICAgICAsIGNoLCByYSwgdmFsLCBpXG5cbiAgICAvLyBkb24ndCBzZXJpYWxpemUgZWxlbWVudHMgdGhhdCBhcmUgZGlzYWJsZWQgb3Igd2l0aG91dCBhIG5hbWVcbiAgICBpZiAoZWwuZGlzYWJsZWQgfHwgIW4pIHJldHVyblxuXG4gICAgc3dpdGNoICh0KSB7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCEvcmVzZXR8YnV0dG9ufGltYWdlfGZpbGUvaS50ZXN0KGVsLnR5cGUpKSB7XG4gICAgICAgIGNoID0gL2NoZWNrYm94L2kudGVzdChlbC50eXBlKVxuICAgICAgICByYSA9IC9yYWRpby9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgdmFsID0gZWwudmFsdWVcbiAgICAgICAgLy8gV2ViS2l0IGdpdmVzIHVzIFwiXCIgaW5zdGVhZCBvZiBcIm9uXCIgaWYgYSBjaGVja2JveCBoYXMgbm8gdmFsdWUsIHNvIGNvcnJlY3QgaXQgaGVyZVxuICAgICAgICA7KCEoY2ggfHwgcmEpIHx8IGVsLmNoZWNrZWQpICYmIGNiKG4sIG5vcm1hbGl6ZShjaCAmJiB2YWwgPT09ICcnID8gJ29uJyA6IHZhbCkpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgIGNiKG4sIG5vcm1hbGl6ZShlbC52YWx1ZSkpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBpZiAoZWwudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0LW9uZScpIHtcbiAgICAgICAgb3B0Q2IoZWwuc2VsZWN0ZWRJbmRleCA+PSAwID8gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XSA6IG51bGwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwOyBlbC5sZW5ndGggJiYgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWwub3B0aW9uc1tpXS5zZWxlY3RlZCAmJiBvcHRDYihlbC5vcHRpb25zW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbGxlY3QgdXAgYWxsIGZvcm0gZWxlbWVudHMgZm91bmQgZnJvbSB0aGUgcGFzc2VkIGFyZ3VtZW50IGVsZW1lbnRzIGFsbFxuICAvLyB0aGUgd2F5IGRvd24gdG8gY2hpbGQgZWxlbWVudHM7IHBhc3MgYSAnPGZvcm0+JyBvciBmb3JtIGZpZWxkcy5cbiAgLy8gY2FsbGVkIHdpdGggJ3RoaXMnPWNhbGxiYWNrIHRvIHVzZSBmb3Igc2VyaWFsKCkgb24gZWFjaCBlbGVtZW50XG4gIGZ1bmN0aW9uIGVhY2hGb3JtRWxlbWVudCgpIHtcbiAgICB2YXIgY2IgPSB0aGlzXG4gICAgICAsIGUsIGlcbiAgICAgICwgc2VyaWFsaXplU3VidGFncyA9IGZ1bmN0aW9uIChlLCB0YWdzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGZhXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZhID0gZVtieVRhZ10odGFnc1tpXSlcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYS5sZW5ndGg7IGorKykgc2VyaWFsKGZhW2pdLCBjYilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGUgPSBhcmd1bWVudHNbaV1cbiAgICAgIGlmICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhL2kudGVzdChlLnRhZ05hbWUpKSBzZXJpYWwoZSwgY2IpXG4gICAgICBzZXJpYWxpemVTdWJ0YWdzKGUsIFsgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScgXSlcbiAgICB9XG4gIH1cblxuICAvLyBzdGFuZGFyZCBxdWVyeSBzdHJpbmcgc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVRdWVyeVN0cmluZygpIHtcbiAgICByZXR1cm4gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKHJlcXdlc3Quc2VyaWFsaXplQXJyYXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gIC8vIHsgJ25hbWUnOiAndmFsdWUnLCAuLi4gfSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZUhhc2goKSB7XG4gICAgdmFyIGhhc2ggPSB7fVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChuYW1lIGluIGhhc2gpIHtcbiAgICAgICAgaGFzaFtuYW1lXSAmJiAhaXNBcnJheShoYXNoW25hbWVdKSAmJiAoaGFzaFtuYW1lXSA9IFtoYXNoW25hbWVdXSlcbiAgICAgICAgaGFzaFtuYW1lXS5wdXNoKHZhbHVlKVxuICAgICAgfSBlbHNlIGhhc2hbbmFtZV0gPSB2YWx1ZVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLy8gWyB7IG5hbWU6ICduYW1lJywgdmFsdWU6ICd2YWx1ZScgfSwgLi4uIF0gc3R5bGUgc2VyaWFsaXphdGlvblxuICByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnIgPSBbXVxuICAgIGVhY2hGb3JtRWxlbWVudC5hcHBseShmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgIGFyci5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9KVxuICAgIH0sIGFyZ3VtZW50cylcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICByZXF3ZXN0LnNlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gICAgdmFyIG9wdCwgZm5cbiAgICAgICwgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcblxuICAgIG9wdCA9IGFyZ3MucG9wKClcbiAgICBvcHQgJiYgb3B0Lm5vZGVUeXBlICYmIGFyZ3MucHVzaChvcHQpICYmIChvcHQgPSBudWxsKVxuICAgIG9wdCAmJiAob3B0ID0gb3B0LnR5cGUpXG5cbiAgICBpZiAob3B0ID09ICdtYXAnKSBmbiA9IHNlcmlhbGl6ZUhhc2hcbiAgICBlbHNlIGlmIChvcHQgPT0gJ2FycmF5JykgZm4gPSByZXF3ZXN0LnNlcmlhbGl6ZUFycmF5XG4gICAgZWxzZSBmbiA9IHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nXG5cbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuXG4gIHJlcXdlc3QudG9RdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChvLCB0cmFkKSB7XG4gICAgdmFyIHByZWZpeCwgaVxuICAgICAgLCB0cmFkaXRpb25hbCA9IHRyYWQgfHwgZmFsc2VcbiAgICAgICwgcyA9IFtdXG4gICAgICAsIGVuYyA9IGVuY29kZVVSSUNvbXBvbmVudFxuICAgICAgLCBhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgIC8vIElmIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGludm9rZSBpdCBhbmQgcmV0dXJuIGl0cyB2YWx1ZVxuICAgICAgICAgIHZhbHVlID0gKCdmdW5jdGlvbicgPT09IHR5cGVvZiB2YWx1ZSkgPyB2YWx1ZSgpIDogKHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlKVxuICAgICAgICAgIHNbcy5sZW5ndGhdID0gZW5jKGtleSkgKyAnPScgKyBlbmModmFsdWUpXG4gICAgICAgIH1cbiAgICAvLyBJZiBhbiBhcnJheSB3YXMgcGFzc2VkIGluLCBhc3N1bWUgdGhhdCBpdCBpcyBhbiBhcnJheSBvZiBmb3JtIGVsZW1lbnRzLlxuICAgIGlmIChpc0FycmF5KG8pKSB7XG4gICAgICBmb3IgKGkgPSAwOyBvICYmIGkgPCBvLmxlbmd0aDsgaSsrKSBhZGQob1tpXVsnbmFtZSddLCBvW2ldWyd2YWx1ZSddKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0cmFkaXRpb25hbCwgZW5jb2RlIHRoZSBcIm9sZFwiIHdheSAodGhlIHdheSAxLjMuMiBvciBvbGRlclxuICAgICAgLy8gZGlkIGl0KSwgb3RoZXJ3aXNlIGVuY29kZSBwYXJhbXMgcmVjdXJzaXZlbHkuXG4gICAgICBmb3IgKHByZWZpeCBpbiBvKSB7XG4gICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KHByZWZpeCkpIGJ1aWxkUGFyYW1zKHByZWZpeCwgb1twcmVmaXhdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwYWNlcyBzaG91bGQgYmUgKyBhY2NvcmRpbmcgdG8gc3BlY1xuICAgIHJldHVybiBzLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRQYXJhbXMocHJlZml4LCBvYmosIHRyYWRpdGlvbmFsLCBhZGQpIHtcbiAgICB2YXIgbmFtZSwgaSwgdlxuICAgICAgLCByYnJhY2tldCA9IC9cXFtcXF0kL1xuXG4gICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgLy8gU2VyaWFsaXplIGFycmF5IGl0ZW0uXG4gICAgICBmb3IgKGkgPSAwOyBvYmogJiYgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ID0gb2JqW2ldXG4gICAgICAgIGlmICh0cmFkaXRpb25hbCB8fCByYnJhY2tldC50ZXN0KHByZWZpeCkpIHtcbiAgICAgICAgICAvLyBUcmVhdCBlYWNoIGFycmF5IGl0ZW0gYXMgYSBzY2FsYXIuXG4gICAgICAgICAgYWRkKHByZWZpeCwgdilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyAodHlwZW9mIHYgPT09ICdvYmplY3QnID8gaSA6ICcnKSArICddJywgdiwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIG9iai50b1N0cmluZygpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgLy8gU2VyaWFsaXplIG9iamVjdCBpdGVtLlxuICAgICAgZm9yIChuYW1lIGluIG9iaikge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXggKyAnWycgKyBuYW1lICsgJ10nLCBvYmpbbmFtZV0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VyaWFsaXplIHNjYWxhciBpdGVtLlxuICAgICAgYWRkKHByZWZpeCwgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXdlc3QuZ2V0Y2FsbGJhY2tQcmVmaXggPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrUHJlZml4XG4gIH1cblxuICAvLyBqUXVlcnkgYW5kIFplcHRvIGNvbXBhdGliaWxpdHksIGRpZmZlcmVuY2VzIGNhbiBiZSByZW1hcHBlZCBoZXJlIHNvIHlvdSBjYW4gY2FsbFxuICAvLyAuYWpheC5jb21wYXQob3B0aW9ucywgY2FsbGJhY2spXG4gIHJlcXdlc3QuY29tcGF0ID0gZnVuY3Rpb24gKG8sIGZuKSB7XG4gICAgaWYgKG8pIHtcbiAgICAgIG9bJ3R5cGUnXSAmJiAob1snbWV0aG9kJ10gPSBvWyd0eXBlJ10pICYmIGRlbGV0ZSBvWyd0eXBlJ11cbiAgICAgIG9bJ2RhdGFUeXBlJ10gJiYgKG9bJ3R5cGUnXSA9IG9bJ2RhdGFUeXBlJ10pXG4gICAgICBvWydqc29ucENhbGxiYWNrJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gPSBvWydqc29ucENhbGxiYWNrJ10pICYmIGRlbGV0ZSBvWydqc29ucENhbGxiYWNrJ11cbiAgICAgIG9bJ2pzb25wJ10gJiYgKG9bJ2pzb25wQ2FsbGJhY2snXSA9IG9bJ2pzb25wJ10pXG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVxd2VzdChvLCBmbilcbiAgfVxuXG4gIHJlcXdlc3QuYWpheFNldHVwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIGZvciAodmFyIGsgaW4gb3B0aW9ucykge1xuICAgICAgZ2xvYmFsU2V0dXBPcHRpb25zW2tdID0gb3B0aW9uc1trXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF3ZXN0XG59KTtcbiIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG52YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIEJ1dHRvbnNNYW5hZ2VyID0gcmVxdWlyZShcIi4vQnV0dG9uc01hbmFnZXIuanNcIik7XG52YXIgUGFnZU1hbmFnZXIgPSByZXF1aXJlKFwiLi9QYWdlTWFuYWdlci5qc1wiKTtcblxuLyoqIFxuICogQmlvQ0lERVIgQ29tcG9uZW50LlxuICpcbiAqIFB1cnBvc2Ugb2YgdGhpcyB3aWRnZXQgaXMgc2hvd2luZyB0byB0aGUgdXNlciwgd2l0aG91dCBhbnkgZGlyZWN0IGFjdGlvbiBieSBoaW1zZWxmLFxuICogaW5mb3JtYXRpb24gb2YgaGlzIGludGVyZXN0IHJlbGF0ZWQgd2l0aCB0aGUgY29udGVudCB0aGF0IGlzIGJlaW5nIHNob3duIGN1cnJlbnRseSB0byBoaW0gLlxuICogVG8gYWNoaWV2ZSB0aGlzLCB3ZSBjb2xsZWN0IGluIGEgU29sciBzeXN0ZW0gaW5mb3JtYXRpb24gb2YgZGlmZmVyZW50IHJlcG9zaXRvcmllc1xuICogKEVsaXhpciBTZXJ2aWNlIFJlZ2lzdHJ5LCBFbGl4aXIgVHJhaW5pbmcgUG9ydGFsLCBhbmQgRWxpeGlyIEV2ZW50cyBQb3J0YWwsIHVudGlsIG5vdyksIHNvXG4gKiB3ZSBjYW4gc2VhcmNoIGludG8gdGhpcyBpbmZvcm1hdGlvbiB3aGljaCBpcyByZWxhdGVkIHdpdGggY29udGVudCBhY2Nlc2VkIGJ5IHVzZXIuXG4gKiBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0SWQgIElkIG9mIHRoZSBtYWluIGNvbnRhaW5lciB0byBwdXQgdGhpcyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dERhdGFMaXN0T3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3Qgc3ViY29tcG9uZW50LlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBcdFx0VHlwZSBvZiByb3dzIHZpc3VhbGlzYXRpb24uXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0SWRDb250YWluZXI9WW91ciBvd24gdGFnIGlkIF1cbiAqICAgIFx0XHRUYWcgaWQgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC4gSXQncyBub3QgdXNlZCBpZiB1c2VyVGV4dElkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0VGFnQ29udGFpbmVyPU9uZSBzdGFibGlzaGVkIHRhZyBuYW1lLCBmb3IgZXhhbXBsZSBoMS4gXVxuICogICAgXHRcdFRhZyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLiBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0SWRDb250YWluZXIgb3IgdXNlclRleHRDbGFzc0NvbnRhaW5lciBpcyBkZWZpbmVkXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0lkQ29udGFpbmVyPVlvdXIgb3duIHRhZyBpZCBdXG4gKiAgICBcdFx0VGFnIGlkIHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc0NsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3Mga2V5d29yZHMgdG8gaW1wcm92ZSBzZWFyY2ggcmVzdWx0cy5cbiAqICAgIFx0XHRJdCdzIG5vdCB1c2VkIGlmIHVzZXJLZXl3b3Jkc0lkQ29udGFpbmVyIGlzIGRlZmluZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJLZXl3b3Jkc1RhZ0NvbnRhaW5lcj1PbmUgc3RhYmxpc2hlZCB0YWcgbmFtZSwgZm9yIGV4YW1wbGUgaDEuIF1cbiAqICAgIFx0XHRUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBrZXl3b3JkcyB0byBpbXByb3ZlIHNlYXJjaCByZXN1bHRzLlxuICogICAgXHRcdEl0J3Mgbm90IHVzZWQgaWYgdXNlcktleXdvcmRzSWRDb250YWluZXIgb3IgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIFx0QG9wdGlvbiB7SFRNTCBvYmplY3R9IFt1c2VyS2V5d29yZHNDb250YWluZXI9VGhlIGh0bWwga2V5d29yZHMgY29udGFpbmVyIGl0c2VsZi4gXVxuICogICAgXHRcdEhUTUwgb2JqZWN0IHRoYXQgY29udGFpbnMgdXNlcidzIGtleXdvcmRzIHRvIGltcHJvdmUgc2VhcmNoIHJlc3VsdHMuXG4gKiAgICBcdFx0SXQncyBub3QgdXNlZCBpZiB1c2VyS2V5d29yZHNJZENvbnRhaW5lciwgdXNlcktleXdvcmRzQ2xhc3NDb250YWluZXIgb3IgdXNlcktleXdvcmRzSWRDb250YWluZXIgaXMgZGVmaW5lZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlckRlc2NyaXB0aW9uQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBkZXNjcmlwdGlvbiB0byBoZWxwIGZpbHRlciBzYW1lIHJlc3VsdHMgdGhhdCB1c2VyIGlzIHNlZWluZy5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlckhlbHBDbGFzc0NvbnRhaW5lcj1Zb3VyIG93biBjbGFzcyBuYW1lIF1cbiAqICAgIFx0XHRDbGFzcyBuYW1lIHRoYXQgd2lsbCBjb250YWlucyBoZWxwIGljb24uXG4gKiBcdEBvcHRpb24ge2ludH0gW251bWJlclJlc3VsdHM9bnVtYmVyIF1cbiAqICAgIFx0XHRJbnRlZ2VyIHRoYXQgcmVzdHJpY3RzIHRoZSByZXN1bHRzIG51bWJlciB0aGF0IHNob3VsZCBiZSBzaG93bi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYnV0dG9uc01hbmFnZXJPcHRpb25zICBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBCdXR0b25zTWFuYWdlciBzdWJjb21wb25lbnQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldElkPSdZb3VyT3duRGl2SWQnXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRDbGFzcz0nWW91ck93bkNsYXNzJ11cbiAqICAgIFx0XHRDbGFzcyBuYW1lIG9mIHRoZSBESVYgd2hlcmUgdGhlIEJ1dHRvbnNNYW5hZ2VyIG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKiBcdEBvcHRpb24ge2Jvb2xlYW59IFtoZWxwVGV4dF1cbiAqICAgIFx0XHRUcnVlIGlmIHlvdSB3YW50IHRvIHNob3cgYSBoZWxwIHRleHQgb3ZlciB0aGUgYnV0dG9ucy5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbYnV0dG9uc1N0eWxlPSdTUVVBUkVEXzNEJyAsICdST1VORF9GTEFUJyBvciAnSUNPTlNfT05MWScuIElDT05TX09OTFkgYnkgZGVmYXVsdC5dXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgYnV0dG9ucyB2aXN1YWxpc2F0aW9uIHR5cGUuXG4gKiBcdEBvcHRpb24ge2Jvb2xlYW59IFtwcmVzc2VkVW5kZXJsaW5lc11cbiAqICAgIFx0XHRUcnVlIGlmIHlvdSB3YW50IHRvIHNob3cgdW5kZXJsaW5lcyB3aGVuIHlvdSBwcmVzcyBhIGJ1dHRvbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFnZU1hbmFnZXJPcHRpb25zICBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBQYWdlTWFuYWdlciBzdWJjb21wb25lbnQuXG4gKlx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBcdFx0SWRlbnRpZmllciBvZiB0aGUgRElWIHRhZyB3aGVyZSB0aGUgY29tcG9uZW50IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgUGFnZU1hbmFnZXIgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuICBcbiAqL1xuLy9mdW5jdGlvbiBCaW9DaWRlciAodGFyZ2V0SWQsIGNvbnRleHREYXRhTGlzdE9wdGlvbnMsIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyxwYWdlTWFuYWdlck9wdGlvbnMpIHtcbnZhciBiaW9jaWRlciA9IGZ1bmN0aW9uICh0YXJnZXRJZCwgY29udGV4dERhdGFMaXN0T3B0aW9ucywgYnV0dG9uc01hbmFnZXJPcHRpb25zLHBhZ2VNYW5hZ2VyT3B0aW9ucykge1xuXHRcblx0dGhpcy50YXJnZXRJZCA9IHRhcmdldElkO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnMgPSB7fTtcblx0dGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnMgPSB7fTtcblx0dGhpcy5wYWdlTWFuYWdlck9wdGlvbnMgPSB7fTtcblx0XG5cdHZhciBkZWZhdWx0Q29udGV4dERhdGFMaXN0T3B0aW9ucyA9IHtcblx0XHR0YXJnZXRJZDogJ2NvbnRleHRfZGF0YV9saXN0Jyxcblx0XHR0YXJnZXRDbGFzczogJ2NvbnRleHRfZGF0YV9saXN0Jyxcblx0XHR1c2VyVGV4dFRhZ0NvbnRhaW5lcjogJ2gxJyxcblx0XHRudW1iZXJSZXN1bHRzOiA1LFxuXHRcdGRpc3BsYXlTdHlsZTogY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFLFxuXHRcdHVzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyOiAnY29udGV4dF9kZXNjcmlwdGlvbl9jb250YWluZXInXG5cdH07XG5cdFxuXHR2YXIgZGVmYXVsdEJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyA9IHtcblx0XHR0YXJnZXRJZDogJ2J1dHRvbnNfbWFuYWdlcl9jb250YWluZXInLFxuXHRcdHRhcmdldENsYXNzOiAnYnV0dG9uX2NvbnRhaW5lcicsXG5cdFx0aGVscFRleHQ6IHRydWUsXG5cdFx0YnV0dG9uc1N0eWxlOmNvbnN0YW50cy5CdXR0b25zTWFuYWdlcl9JQ09OU19PTkxZLFxuXHRcdHByZXNzZWRVbmRlcmxpbmVzOnRydWVcblx0fTtcblx0XG5cdHZhciBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zID0ge1xuXHRcdHRhcmdldENsYXNzOiAncGFnZV9tYW5hZ2VyX2NvbnRhaW5lcicsXG5cdFx0dGFyZ2V0SWQ6ICdwYWdlX21hbmFnZXJfY29udGFpbmVyJ1xuXHR9XG5cdFxuXHRcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnMpe1xuXHQgICAgIHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1trZXldID0gZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBjb250ZXh0RGF0YUxpc3RPcHRpb25zKXtcblx0ICAgICB0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XSA9IGNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0QnV0dG9uc01hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldID0gZGVmYXVsdEJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNba2V5XSA9IGJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdFxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldID0gZGVmYXVsdFBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdGZvcih2YXIga2V5IGluIHBhZ2VNYW5hZ2VyT3B0aW9ucyl7XG5cdCAgICAgdGhpcy5wYWdlTWFuYWdlck9wdGlvbnNba2V5XSA9IHBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldO1xuXHR9XG5cdFxuXHRcbiAgICAgICAgXG59XG5cblxuLyoqIFxuICogQmlvQ2lkZXIgZnVuY3Rpb25hbGl0eS5cbiAqIFxuICogQGNsYXNzIEJpb0NpZGVyXG4gKiBcbiAqL1xuYmlvY2lkZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogYmlvY2lkZXIsXG5cblx0ICAgICAgXG4gICAgICAgIFxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgZGlmZmVyZW50IG9iamVjdHMgYW5kIGRyYXcgdGhlbS5cblx0ICovICAgICAgICBcblx0ZHJhdyA6IGZ1bmN0aW9uICgpe1xuXHRcdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVycygpO1xuXHRcdFx0XHRcdFx0XG5cdFx0dmFyIGNvbnRleHREYXRhTGlzdEluc3RhbmNlID0gbmV3IENvbnRleHREYXRhTGlzdCh0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnMpO1xuXHRcdFxuXHRcdC8vIGJlZm9yZSBpbml0aWFsaXNpbmcgdGhlIG1haW4gY29tcG9uZW50LCB3ZSBzaG91bGQgaW5pdGlhbGlzZSBpdHMgJ3BsdWdpbnMnLlxuXHRcdHZhciBidXR0b25zSW5zdGFuY2UgPSBuZXcgQnV0dG9uc01hbmFnZXIoY29udGV4dERhdGFMaXN0SW5zdGFuY2UsdGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnMpO1xuXHRcdGJ1dHRvbnNJbnN0YW5jZS5idWlsZFByZXNzZWRCdXR0b25zKCk7XG5cdFx0XG5cdFx0dmFyIHBhZ2VNYW5hZ2VySW5zdGFuY2UgPSBuZXcgUGFnZU1hbmFnZXIoY29udGV4dERhdGFMaXN0SW5zdGFuY2UsdGhpcy5wYWdlTWFuYWdlck9wdGlvbnMpO1xuXHRcdHBhZ2VNYW5hZ2VySW5zdGFuY2UuYnVpbGQoKTtcblx0XHRcblx0XHRcblx0XHQvL3RyaWdnZXJzIHRoZSBjb250ZXh0dWFsaXNlZCBkYXRhIGxvYWRpbmcgcHJvY2Vzc1xuXHRcdGNvbnRleHREYXRhTGlzdEluc3RhbmNlLmRyYXdDb250ZXh0RGF0YUxpc3QoKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBjcmVhdGUgb3IgcmV1c2UgaW50ZXJuYWwgY29udGFpbmVycyBvZiBlYWNoIHN1YmNvbXBvbmVudC5cblx0ICovXG5cdGluaXRDb250YWluZXJzOiBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5idXR0b25zTWFuYWdlck9wdGlvbnNbJ3RhcmdldENsYXNzJ10pO1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5wYWdlTWFuYWdlck9wdGlvbnNbJ3RhcmdldENsYXNzJ10pO1xuXHRcdFxuXHRcdHRoaXMuaW5pdENvbnRhaW5lcih0aGlzLnRhcmdldElkLFxuXHRcdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNbJ3RhcmdldElkJ10sXG5cdFx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0XG5cdFx0XG5cdH0sXG5cdFxuXHQvKipcblx0ICogQXV4aWxpYXJ5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBvciByZXVzZSBpbnRlcm5hbCBjb250YWluZXJzIG9mIG9uZSBzdWJjb21wb25lbnQuXG5cdCAqIEBwYXJhbSBnbG9iYWxDb250YWluZXJJZCB7c3RyaW5nfSBJZCBvZiB0aGUgQmlvQ2lkZXIgZGl2IGNvbnRhaW5lci5cblx0ICogQHBhcmFtIGNvbnRhaW5lcklkIHtzdHJpbmd9IElkIG9mIHRoZSBsb2NhbCBzdWJjb21wb25lbnQgZGl2IGNvbnRhaW5lci5cblx0ICogQHBhcmFtIGNvbnRhaW5lckNsYXNzIHtzdHJpbmd9IENsYXNzIG5hbWUgdG8gYXBwbHkgdG8gdGhlIHN1YmNvbXBvbmVudCBjb250YWluZXIuXG5cdCAqL1xuXHRpbml0Q29udGFpbmVyIDogZnVuY3Rpb24oZ2xvYmFsQ29udGFpbmVySWQsIGNvbnRhaW5lcklkLCBjb250YWluZXJDbGFzcyl7XG5cdFx0dmFyIGdsb2JhbENvbnRhaW5lckV4aXN0cyA9IGZhbHNlO1xuXHRcdHZhciBsb2NhbENvbnRhaW5lckV4aXN0cyA9IGZhbHNlO1xuXHRcdHZhciBnbG9iYWxDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChnbG9iYWxDb250YWluZXJJZCk7XG5cdFx0aWYgKGdsb2JhbENvbnRhaW5lciAhPSB1bmRlZmluZWQgfHwgZ2xvYmFsQ29udGFpbmVyICE9IG51bGwpe1xuXHRcdFx0Z2xvYmFsQ29udGFpbmVyRXhpc3RzID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYgKGNvbnRhaW5lcklkICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXJJZCAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpO1xuXHRcdFx0aWYgKGNvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgY29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0fWVsc2V7XHQvLyBuZWVkIHRvIGNyZWF0ZSB0aGUgc3ViY29udGFpbmVyXG5cdFx0XHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRjb250YWluZXIuaWQgPSBjb250YWluZXJJZDtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTGlzdC5hZGQoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyRXhpc3RzKSB7XG5cdFx0XHRcdFx0Z2xvYmFsQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1lbHNle1x0Ly8gaWYgd2UgZG9uJ3QgaGF2ZSBhIGNvbnRhaW5lcklkLCB3ZSBjYW4gdHJ5IHRvIGRvIHRoZSBzYW1lIHdpdGggdGhlIGNsYXNzTmFtZVxuXHRcdFx0dmFyIHBvc3NpYmxlQ29udGFpbmVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY29udGFpbmVyQ2xhc3MpO1xuXHRcdFx0dmFyIGNvbnRhaW5lciA9IG51bGw7XG5cdFx0XHRpZiAocG9zc2libGVDb250YWluZXJzICE9IG51bGwgJiYgcG9zc2libGVDb250YWluZXJzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gcG9zc2libGVDb250YWluZXJzWzBdO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoY29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0XHQvLyBub3RoaW5nIHRvIGRvXG5cdFx0XHR9ZWxzZXtcdC8vIG5lZWQgdG8gY3JlYXRlIHRoZSBzdWJjb250YWluZXJcblx0XHRcdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbnRhaW5lci5pZCA9IGNvbnRhaW5lcklkO1xuXHRcdFx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyRXhpc3RzKSB7XG5cdFx0XHRcdFx0Z2xvYmFsQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0fVxuICAgICAgICBcbiAgICAgICAgXG59XG4gICAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IGJpb2NpZGVyO1xuICAiXX0=
>>>>>>> development
