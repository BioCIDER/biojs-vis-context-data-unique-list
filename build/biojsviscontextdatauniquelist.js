require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * 	@option {string} [userTextClassContainer=Your own class name ]
 *    		Class name that contains user's text to search.
 * 	@option {string} [userTextTagContainer=One stablished tag name, for example h1. It's not used if userTextClassContainer is defined ]
 *    		Tag name that contains user's text to search.
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
var BioCider = function (targetId, contextDataListOptions, buttonsManagerOptions,pageManagerOptions) {
	
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
	console.log(this.contextDataListOptions['targetId'] );
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

BioCider.prototype = {
	constructor: BioCider,
	
        
        
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
          
module.exports = BioCider;
  
},{"./ButtonsManager.js":2,"./ContextDataList.js":4,"./PageManager.js":9,"./constants.js":10}],2:[function(require,module,exports){
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
      
  
},{"./constants.js":10}],3:[function(require,module,exports){
var ContextDataList = require("./ContextDataList.js");
var constants = require("./constants.js");

/**
 *          CommonData constructor
 *          jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
var CommonData = function(jsonData) {
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
},{"./ContextDataList.js":4,"./constants.js":10}],4:[function(require,module,exports){
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
 * @option {string} [userTextClassContainer=Your own class name ]
 *    Class name that contains user's text to search.
 * @option {string} [userTextTagContainer=One stablished tag name, for example h1. It's not used if userTextClassContainer is defined ]
 *    Tag name that contains user's text to search.
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
	     displayStyle: constants.ContextDataList_COMMON_STYLE,
	     includeSameSiteResults : true
	};
	for(var key in default_options_values){
	     this[key] = default_options_values[key];
	}
	for(var key in options){
	     this[key] = options[key];
	}
	this.contextDataServer = "http://www.biocider.org:8983/solr/contextData";
	this.dataManager = new DataManager();
	
	
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
		console.log('ContextDataList.LOADING,'+constants.ContextDataList_LOADING);
		console.log('ContextDataList.COMMON_STYLE,'+constants.ContextDataList_COMMON_STYLE);
		this.currentStatus = constants.ContextDataList_LOADING;
		//this.updateGlobalStatus(this.LOADING);
		var userText = this.getUserSearch();
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

},{"./CommonData.js":3,"./DataManager.js":5,"./constants.js":10,"reqwest":12}],5:[function(require,module,exports){

var CommonData = require("./CommonData.js");
var ElixirTrainingData = require("./ElixirTrainingData.js");
var ElixirEventData = require("./ElixirEventData.js");
var ElixirRegistryData = require("./ElixirRegistryData.js");

/** 
 * Data managment constructor.
 * @param {Array} options An object with the options for DataManager component. For future improvements.
 */
var DataManager = function(options) {
 
    var default_options_values = {      
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
        switch(sourceFieldValue){
            case new ElixirRegistryData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirRegistryData(jsonEntry);
                break;
            case new ElixirTrainingData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirTrainingData(jsonEntry);
                break;
            case new ElixirEventData(null).SOURCE_FIELD_VALUE:
                commonData = new ElixirEventData(jsonEntry);
                break;
            default:
                console.log("ERROR: Unknown source field value: " + sourceFieldValue);
        }
        return commonData;
    }

}

module.exports = DataManager;
},{"./CommonData.js":3,"./ElixirEventData.js":6,"./ElixirRegistryData.js":7,"./ElixirTrainingData.js":8}],6:[function(require,module,exports){
var CommonData = require("./CommonData.js");

/**
 *          ElixirEventData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
var ElixirEventData = function(jsonData) {
           
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
      
},{"./CommonData.js":3}],7:[function(require,module,exports){
var CommonData = require("./CommonData.js");

/**
 *          ElixirRegistryData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
var ElixirRegistryData = function(jsonData) {            
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
},{"./CommonData.js":3}],8:[function(require,module,exports){

var CommonData = require("./CommonData.js");

/**
 *          ElixirTrainingData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
var ElixirTrainingData = function(jsonData) {            
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
},{"./CommonData.js":3}],9:[function(require,module,exports){
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
      
  
},{"./ContextDataList.js":4,"./constants.js":10}],10:[function(require,module,exports){


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


},{}],11:[function(require,module,exports){

},{}],12:[function(require,module,exports){
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

},{"xhr2":11}],"biocider":[function(require,module,exports){

module.exports.constants = require("../js/constants.js");
module.exports.ButtonsManager = require("../js/ButtonsManager.js");
module.exports.CommonData = require("../js/CommonData.js");
module.exports.ElixirEventData = require("../js/ElixirEventData.js");
module.exports.ElixirRegistryData = require("../js/ElixirRegistryData.js");
module.exports.ElixirTrainingData = require("../js/ElixirTrainingData.js");
module.exports.ContextDataList = require("../js/ContextDataList.js");
module.exports.DataManager = require("../js/DataManager.js");
module.exports.PageManager = require("../js/PageManager.js");
module.exports.BioCider = require("../js/BioCider.js");
},{"../js/BioCider.js":1,"../js/ButtonsManager.js":2,"../js/CommonData.js":3,"../js/ContextDataList.js":4,"../js/DataManager.js":5,"../js/ElixirEventData.js":6,"../js/ElixirRegistryData.js":7,"../js/ElixirTrainingData.js":8,"../js/PageManager.js":9,"../js/constants.js":10}]},{},["biocider"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpL2pzL0Jpb0NpZGVyLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKS9qcy9CdXR0b25zTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvanMvQ29tbW9uRGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvanMvQ29udGV4dERhdGFMaXN0LmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKS9qcy9EYXRhTWFuYWdlci5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvanMvRWxpeGlyRXZlbnREYXRhLmpzIiwiL1VzZXJzL2hvcnJvYy9Eb2N1bWVudHMvUHJveWVjdHMgR0lUL2Jpb0NJREVSL2Jpb2pzLXZpcy1jb250ZXh0LWRhdGEtdW5pcXVlLWxpc3QgKGJpb0NJREVSKS9qcy9FbGl4aXJSZWdpc3RyeURhdGEuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpL2pzL0VsaXhpclRyYWluaW5nRGF0YS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvanMvUGFnZU1hbmFnZXIuanMiLCIvVXNlcnMvaG9ycm9jL0RvY3VtZW50cy9Qcm95ZWN0cyBHSVQvYmlvQ0lERVIvYmlvanMtdmlzLWNvbnRleHQtZGF0YS11bmlxdWUtbGlzdCAoYmlvQ0lERVIpL2pzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIi9Vc2Vycy9ob3Jyb2MvRG9jdW1lbnRzL1Byb3llY3RzIEdJVC9iaW9DSURFUi9iaW9qcy12aXMtY29udGV4dC1kYXRhLXVuaXF1ZS1saXN0IChiaW9DSURFUikvbm9kZV9tb2R1bGVzL3JlcXdlc3QvcmVxd2VzdC5qcyIsIi4vanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdG5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG52YXIgQ29udGV4dERhdGFMaXN0ID0gcmVxdWlyZShcIi4vQ29udGV4dERhdGFMaXN0LmpzXCIpO1xudmFyIEJ1dHRvbnNNYW5hZ2VyID0gcmVxdWlyZShcIi4vQnV0dG9uc01hbmFnZXIuanNcIik7XG52YXIgUGFnZU1hbmFnZXIgPSByZXF1aXJlKFwiLi9QYWdlTWFuYWdlci5qc1wiKTtcblxuLyoqIFxuICogQmlvQ0lERVIgQ29tcG9uZW50LlxuICpcbiAqIFB1cnBvc2Ugb2YgdGhpcyB3aWRnZXQgaXMgc2hvd2luZyB0byB0aGUgdXNlciwgd2l0aG91dCBhbnkgZGlyZWN0IGFjdGlvbiBieSBoaW1zZWxmLFxuICogaW5mb3JtYXRpb24gb2YgaGlzIGludGVyZXN0IHJlbGF0ZWQgd2l0aCB0aGUgY29udGVudCB0aGF0IGlzIGJlaW5nIHNob3duIGN1cnJlbnRseSB0byBoaW0gLlxuICogVG8gYWNoaWV2ZSB0aGlzLCB3ZSBjb2xsZWN0IGluIGEgU29sciBzeXN0ZW0gaW5mb3JtYXRpb24gb2YgZGlmZmVyZW50IHJlcG9zaXRvcmllc1xuICogKEVsaXhpciBTZXJ2aWNlIFJlZ2lzdHJ5LCBFbGl4aXIgVHJhaW5pbmcgUG9ydGFsLCBhbmQgRWxpeGlyIEV2ZW50cyBQb3J0YWwsIHVudGlsIG5vdyksIHNvXG4gKiB3ZSBjYW4gc2VhcmNoIGludG8gdGhpcyBpbmZvcm1hdGlvbiB3aGljaCBpcyByZWxhdGVkIHdpdGggY29udGVudCBhY2Nlc2VkIGJ5IHVzZXIuXG4gKiBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0SWQgIElkIG9mIHRoZSBtYWluIGNvbnRhaW5lciB0byBwdXQgdGhpcyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dERhdGFMaXN0T3B0aW9ucyBBbiBvYmplY3Qgd2l0aCB0aGUgbWFpbiBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3Qgc3ViY29tcG9uZW50LlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IHNob3VsZCBiZSBkaXNwbGF5ZWQuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldENsYXNzPSdZb3VyT3duQ2xhc3MnXVxuICogICAgXHRcdENsYXNzIG5hbWUgb2YgdGhlIERJViB3aGVyZSB0aGUgQ29udGV4dERhdGFMaXN0IG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBcdFx0VHlwZSBvZiByb3dzIHZpc3VhbGlzYXRpb24uXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRUYWdDb250YWluZXI9T25lIHN0YWJsaXNoZWQgdGFnIG5hbWUsIGZvciBleGFtcGxlIGgxLiBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0Q2xhc3NDb250YWluZXIgaXMgZGVmaW5lZCBdXG4gKiAgICBcdFx0VGFnIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgdGV4dCB0byBzZWFyY2guXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgXHRcdENsYXNzIG5hbWUgdGhhdCBjb250YWlucyB1c2VyJ3MgZGVzY3JpcHRpb24gdG8gaGVscCBmaWx0ZXIgc2FtZSByZXN1bHRzIHRoYXQgdXNlciBpcyBzZWVpbmcuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW3VzZXJIZWxwQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSB0aGF0IHdpbGwgY29udGFpbnMgaGVscCBpY29uLlxuICogXHRAb3B0aW9uIHtpbnR9IFtudW1iZXJSZXN1bHRzPW51bWJlciBdXG4gKiAgICBcdFx0SW50ZWdlciB0aGF0IHJlc3RyaWN0cyB0aGUgcmVzdWx0cyBudW1iZXIgdGhhdCBzaG91bGQgYmUgc2hvd24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyAgQW4gb2JqZWN0IHdpdGggdGhlIG1haW4gb3B0aW9ucyBmb3IgQnV0dG9uc01hbmFnZXIgc3ViY29tcG9uZW50LlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRJZD0nWW91ck93bkRpdklkJ11cbiAqICAgIFx0XHRJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIFx0QG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0Q2xhc3M9J1lvdXJPd25DbGFzcyddXG4gKiAgICBcdFx0Q2xhc3MgbmFtZSBvZiB0aGUgRElWIHdoZXJlIHRoZSBCdXR0b25zTWFuYWdlciBvYmplY3Qgc2hvdWxkIGJlIGRpc3BsYXllZC4gIFxuICogXHRAb3B0aW9uIHtib29sZWFufSBbaGVscFRleHRdXG4gKiAgICBcdFx0VHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IGEgaGVscCB0ZXh0IG92ZXIgdGhlIGJ1dHRvbnMuXG4gKiBcdEBvcHRpb24ge3N0cmluZ30gW2J1dHRvbnNTdHlsZT0nU1FVQVJFRF8zRCcgLCAnUk9VTkRfRkxBVCcgb3IgJ0lDT05TX09OTFknLiBJQ09OU19PTkxZIGJ5IGRlZmF1bHQuXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIGJ1dHRvbnMgdmlzdWFsaXNhdGlvbiB0eXBlLlxuICogXHRAb3B0aW9uIHtib29sZWFufSBbcHJlc3NlZFVuZGVybGluZXNdXG4gKiAgICBcdFx0VHJ1ZSBpZiB5b3Ugd2FudCB0byBzaG93IHVuZGVybGluZXMgd2hlbiB5b3UgcHJlc3MgYSBidXR0b24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhZ2VNYW5hZ2VyT3B0aW9ucyAgQW4gb2JqZWN0IHdpdGggdGhlIG1haW4gb3B0aW9ucyBmb3IgUGFnZU1hbmFnZXIgc3ViY29tcG9uZW50LlxuICpcdEBvcHRpb24ge3N0cmluZ30gW3RhcmdldElkPSdZb3VyT3duRGl2SWQnXVxuICogICAgXHRcdElkZW50aWZpZXIgb2YgdGhlIERJViB0YWcgd2hlcmUgdGhlIGNvbXBvbmVudCBzaG91bGQgYmUgZGlzcGxheWVkLlxuICogXHRAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXRDbGFzcz0nWW91ck93bkNsYXNzJ11cbiAqICAgIFx0XHRDbGFzcyBuYW1lIG9mIHRoZSBESVYgd2hlcmUgdGhlIFBhZ2VNYW5hZ2VyIG9iamVjdCBzaG91bGQgYmUgZGlzcGxheWVkLiAgXG4gKi9cbi8vZnVuY3Rpb24gQmlvQ2lkZXIgKHRhcmdldElkLCBjb250ZXh0RGF0YUxpc3RPcHRpb25zLCBidXR0b25zTWFuYWdlck9wdGlvbnMscGFnZU1hbmFnZXJPcHRpb25zKSB7XG52YXIgQmlvQ2lkZXIgPSBmdW5jdGlvbiAodGFyZ2V0SWQsIGNvbnRleHREYXRhTGlzdE9wdGlvbnMsIGJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyxwYWdlTWFuYWdlck9wdGlvbnMpIHtcblx0XG5cdHRoaXMudGFyZ2V0SWQgPSB0YXJnZXRJZDtcblx0dGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zID0ge307XG5cdHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zID0ge307XG5cdHRoaXMucGFnZU1hbmFnZXJPcHRpb25zID0ge307XG5cdFxuXHR2YXIgZGVmYXVsdENvbnRleHREYXRhTGlzdE9wdGlvbnMgPSB7XG5cdFx0dGFyZ2V0SWQ6ICdjb250ZXh0X2RhdGFfbGlzdCcsXG5cdFx0dGFyZ2V0Q2xhc3M6ICdjb250ZXh0X2RhdGFfbGlzdCcsXG5cdFx0dXNlclRleHRUYWdDb250YWluZXI6ICdoMScsXG5cdFx0bnVtYmVyUmVzdWx0czogNSxcblx0XHRkaXNwbGF5U3R5bGU6IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRlVMTF9TVFlMRSxcblx0XHR1c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcjogJ2NvbnRleHRfZGVzY3JpcHRpb25fY29udGFpbmVyJ1xuXHR9O1xuXHRcblx0dmFyIGRlZmF1bHRCdXR0b25zTWFuYWdlck9wdGlvbnMgPSB7XG5cdFx0dGFyZ2V0SWQ6ICdidXR0b25zX21hbmFnZXJfY29udGFpbmVyJyxcblx0XHR0YXJnZXRDbGFzczogJ2J1dHRvbl9jb250YWluZXInLFxuXHRcdGhlbHBUZXh0OiB0cnVlLFxuXHRcdGJ1dHRvbnNTdHlsZTpjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfSUNPTlNfT05MWSxcblx0XHRwcmVzc2VkVW5kZXJsaW5lczp0cnVlXG5cdH07XG5cdFxuXHR2YXIgZGVmYXVsdFBhZ2VNYW5hZ2VyT3B0aW9ucyA9IHtcblx0XHR0YXJnZXRDbGFzczogJ3BhZ2VfbWFuYWdlcl9jb250YWluZXInLFxuXHRcdHRhcmdldElkOiAncGFnZV9tYW5hZ2VyX2NvbnRhaW5lcidcblx0fVxuXHRcblx0XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRDb250ZXh0RGF0YUxpc3RPcHRpb25zKXtcblx0ICAgICB0aGlzLmNvbnRleHREYXRhTGlzdE9wdGlvbnNba2V5XSA9IGRlZmF1bHRDb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gY29udGV4dERhdGFMaXN0T3B0aW9ucyl7XG5cdCAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV0gPSBjb250ZXh0RGF0YUxpc3RPcHRpb25zW2tleV07XG5cdH1cblx0Y29uc29sZS5sb2codGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zWyd0YXJnZXRJZCddICk7XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRCdXR0b25zTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV0gPSBkZWZhdWx0QnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gYnV0dG9uc01hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1trZXldID0gYnV0dG9uc01hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRQYWdlTWFuYWdlck9wdGlvbnMpe1xuXHQgICAgIHRoaXMucGFnZU1hbmFnZXJPcHRpb25zW2tleV0gPSBkZWZhdWx0UGFnZU1hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gcGFnZU1hbmFnZXJPcHRpb25zKXtcblx0ICAgICB0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1trZXldID0gcGFnZU1hbmFnZXJPcHRpb25zW2tleV07XG5cdH1cblx0XG5cdFxuICAgICAgICBcbn1cblxuQmlvQ2lkZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogQmlvQ2lkZXIsXG5cdFxuICAgICAgICBcbiAgICAgICAgXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBhbmQgZHJhdyB0aGVtLlxuXHQgKi8gICAgICAgIFxuXHRkcmF3IDogZnVuY3Rpb24gKCl7XG5cdFx0XHRcblx0XHR0aGlzLmluaXRDb250YWluZXJzKCk7XG5cdFx0XHRcdFx0XHRcblx0XHR2YXIgY29udGV4dERhdGFMaXN0SW5zdGFuY2UgPSBuZXcgQ29udGV4dERhdGFMaXN0KHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9ucyk7XG5cdFx0XG5cdFx0Ly8gYmVmb3JlIGluaXRpYWxpc2luZyB0aGUgbWFpbiBjb21wb25lbnQsIHdlIHNob3VsZCBpbml0aWFsaXNlIGl0cyAncGx1Z2lucycuXG5cdFx0dmFyIGJ1dHRvbnNJbnN0YW5jZSA9IG5ldyBCdXR0b25zTWFuYWdlcihjb250ZXh0RGF0YUxpc3RJbnN0YW5jZSx0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9ucyk7XG5cdFx0YnV0dG9uc0luc3RhbmNlLmJ1aWxkUHJlc3NlZEJ1dHRvbnMoKTtcblx0XHRcblx0XHR2YXIgcGFnZU1hbmFnZXJJbnN0YW5jZSA9IG5ldyBQYWdlTWFuYWdlcihjb250ZXh0RGF0YUxpc3RJbnN0YW5jZSx0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9ucyk7XG5cdFx0cGFnZU1hbmFnZXJJbnN0YW5jZS5idWlsZCgpO1xuXHRcdFxuXHRcdFxuXHRcdC8vdHJpZ2dlcnMgdGhlIGNvbnRleHR1YWxpc2VkIGRhdGEgbG9hZGluZyBwcm9jZXNzXG5cdFx0Y29udGV4dERhdGFMaXN0SW5zdGFuY2UuZHJhd0NvbnRleHREYXRhTGlzdCgpO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHRvIGNyZWF0ZSBvciByZXVzZSBpbnRlcm5hbCBjb250YWluZXJzIG9mIGVhY2ggc3ViY29tcG9uZW50LlxuXHQgKi9cblx0aW5pdENvbnRhaW5lcnM6IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMuYnV0dG9uc01hbmFnZXJPcHRpb25zWyd0YXJnZXRJZCddLFxuXHRcdFx0XHR0aGlzLmJ1dHRvbnNNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMucGFnZU1hbmFnZXJPcHRpb25zWyd0YXJnZXRJZCddLFxuXHRcdFx0XHR0aGlzLnBhZ2VNYW5hZ2VyT3B0aW9uc1sndGFyZ2V0Q2xhc3MnXSk7XG5cdFx0XG5cdFx0dGhpcy5pbml0Q29udGFpbmVyKHRoaXMudGFyZ2V0SWQsXG5cdFx0XHRcdHRoaXMuY29udGV4dERhdGFMaXN0T3B0aW9uc1sndGFyZ2V0SWQnXSxcblx0XHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3RPcHRpb25zWyd0YXJnZXRDbGFzcyddKTtcblx0XHRcblx0XHRcblx0XHRcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gY3JlYXRlIG9yIHJldXNlIGludGVybmFsIGNvbnRhaW5lcnMgb2Ygb25lIHN1YmNvbXBvbmVudC5cblx0ICogQHBhcmFtIGdsb2JhbENvbnRhaW5lcklkIHtzdHJpbmd9IElkIG9mIHRoZSBCaW9DaWRlciBkaXYgY29udGFpbmVyLlxuXHQgKiBAcGFyYW0gY29udGFpbmVySWQge3N0cmluZ30gSWQgb2YgdGhlIGxvY2FsIHN1YmNvbXBvbmVudCBkaXYgY29udGFpbmVyLlxuXHQgKiBAcGFyYW0gY29udGFpbmVyQ2xhc3Mge3N0cmluZ30gQ2xhc3MgbmFtZSB0byBhcHBseSB0byB0aGUgc3ViY29tcG9uZW50IGNvbnRhaW5lci5cblx0ICovXG5cdGluaXRDb250YWluZXIgOiBmdW5jdGlvbihnbG9iYWxDb250YWluZXJJZCwgY29udGFpbmVySWQsIGNvbnRhaW5lckNsYXNzKXtcblx0XHR2YXIgZ2xvYmFsQ29udGFpbmVyRXhpc3RzID0gZmFsc2U7XG5cdFx0dmFyIGxvY2FsQ29udGFpbmVyRXhpc3RzID0gZmFsc2U7XG5cdFx0dmFyIGdsb2JhbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdsb2JhbENvbnRhaW5lcklkKTtcblx0XHRpZiAoZ2xvYmFsQ29udGFpbmVyICE9IHVuZGVmaW5lZCB8fCBnbG9iYWxDb250YWluZXIgIT0gbnVsbCl7XG5cdFx0XHRnbG9iYWxDb250YWluZXJFeGlzdHMgPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAoY29udGFpbmVySWQgIT0gdW5kZWZpbmVkICYmIGNvbnRhaW5lcklkICE9IG51bGwpIHtcblx0XHRcdHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCk7XG5cdFx0XHRpZiAoY29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiBjb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzcyk7XG5cdFx0XHR9ZWxzZXtcdC8vIG5lZWQgdG8gY3JlYXRlIHRoZSBzdWJjb250YWluZXJcblx0XHRcdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGNvbnRhaW5lci5pZCA9IGNvbnRhaW5lcklkO1xuXHRcdFx0XHRjb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzcyk7XG5cdFx0XHRcdGlmIChnbG9iYWxDb250YWluZXJFeGlzdHMpIHtcblx0XHRcdFx0XHRnbG9iYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fWVsc2V7XHQvLyBpZiB3ZSBkb24ndCBoYXZlIGEgY29udGFpbmVySWQsIHdlIGNhbiB0cnkgdG8gZG8gdGhlIHNhbWUgd2l0aCB0aGUgY2xhc3NOYW1lXG5cdFx0XHR2YXIgcG9zc2libGVDb250YWluZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjb250YWluZXJDbGFzcyk7XG5cdFx0XHR2YXIgY29udGFpbmVyID0gbnVsbDtcblx0XHRcdGlmIChwb3NzaWJsZUNvbnRhaW5lcnMgIT0gbnVsbCAmJiBwb3NzaWJsZUNvbnRhaW5lcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb250YWluZXIgPSBwb3NzaWJsZUNvbnRhaW5lcnNbMF07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChjb250YWluZXIgIT0gdW5kZWZpbmVkICYmIGNvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRcdC8vIG5vdGhpbmcgdG8gZG9cblx0XHRcdH1lbHNle1x0Ly8gbmVlZCB0byBjcmVhdGUgdGhlIHN1YmNvbnRhaW5lclxuXHRcdFx0XHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0Y29udGFpbmVyLmlkID0gY29udGFpbmVySWQ7XG5cdFx0XHRcdGlmIChnbG9iYWxDb250YWluZXJFeGlzdHMpIHtcblx0XHRcdFx0XHRnbG9iYWxDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHR9XG4gICAgICAgIFxuICAgICAgICBcbn1cbiAgICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gQmlvQ2lkZXI7XG4gICIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHMuanNcIik7XG5cbi8qKiBcbiAqIEJ1dHRvbnMnIGZpbHRlcmluZyBjb25zdHJ1Y3Rvci5cbiAqIFxuICogQGNsYXNzIEJ1dHRvbnNNYW5hZ2VyXG4gKlxuICogQHBhcmFtIHtDb250ZXh0RGF0YUxpc3QgT2JqZWN0fSBSZWZlcmVuY2UgdG8gQ29udGV4dERhdGFMaXN0IG9iamVjdCBpbiBvcmRlciB0byBtYW5hZ2UgaXRzIGZpbHRlcnMuXG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBCdXR0b25zTWFuYWdlciBjb21wb25lbnQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtoZWxwVGV4dF1cbiAqICAgIFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyBhIGhlbHAgdGV4dCBvdmVyIHRoZSBidXR0b25zLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbYnV0dG9uc1N0eWxlPSdTUVVBUkVEXzNEJyAsICdST1VORF9GTEFUJyBvciAnSUNPTlNfT05MWScuIElDT05TX09OTFkgYnkgZGVmYXVsdC5dXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBidXR0b25zIHZpc3VhbGlzYXRpb24gdHlwZS5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtwcmVzc2VkVW5kZXJsaW5lc11cbiAqICAgIFRydWUgaWYgeW91IHdhbnQgdG8gc2hvdyB1bmRlcmxpbmVzIHdoZW4geW91IHByZXNzIGEgYnV0dG9uLlxuICovXG52YXIgQnV0dG9uc01hbmFnZXIgPSBmdW5jdGlvbihjb250ZXh0RGF0YUxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7XG5cdFx0aGVscFRleHQ6IHRydWUsXG5cdFx0YnV0dG9uc1N0eWxlOiBjb25zdGFudHMuQnV0dG9uc01hbmFnZXJfU1FVQVJFRF8zRCxcblx0XHRwcmVzc2VkVW5kZXJsaW5lczogZmFsc2Vcblx0fTtcblx0Zm9yKHZhciBrZXkgaW4gZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyl7XG5cdFx0dGhpc1trZXldID0gZGVmYXVsdF9vcHRpb25zX3ZhbHVlc1trZXldO1x0XG5cdH1cblx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucyl7XG5cdFx0dGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuXHR9XG4gICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0ID0gY29udGV4dERhdGFMaXN0O1xuXHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEgPSBbXTtcblx0Ly8gQkFTSUMgQlVUVE9OJ1MgREFUQTogTEFCRUwsIElOVEVSTkFMIENMQVNTIE5BTUUsIElOVEVSTkFMIE5BTUUgQU5EIEhFTFAgVEVYVFxuXHR0aGlzLmJ1dHRvbnNCYXNpY0RhdGEucHVzaChbJ0RhdGFiYXNlJywnZGF0YWJhc2UnLCdkYXRhYmFzZScsJ0RhdGFiYXNlcyddLFxuXHRcdFx0XHQgICBbJ0V2ZW50cycsJ2V2ZW50cycsJ0V2ZW50JywnRXZlbnRzJ10sXG5cdFx0XHRcdCAgIFsnVG9vbHMnLCd0b29scycsJ1Rvb2wnLCdUb29scyddLFxuXHRcdFx0XHQgICBbJ1RyYWluaW5nIG1hdGVyaWFscycsJ3RyYWluaW5nX21hdGVyaWFsJywnVHJhaW5pbmcgTWF0ZXJpYWwnLCdUcmFpbmluZyBtYXRlcmlhbHMnXVxuXHQpO1xuXHR0aGlzLmNvbnRleHREYXRhTGlzdC5yZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24odGhpcywgdGhpcy51cGRhdGVCdXR0b25zU3RhdHVzKTtcbn1cblxuLyoqXG4gKiAgICAgIEJ1dHRvbnNNYW5hZ2VyIGNsYXNzLiBSZXByZXNlbnRzIGEgc2V0IG9mIGZpbHRlcnMgc2VsZWN0YWJsZSB2aWEgYnV0dG9ucyBieSB1c2Vycy5cbiAqIFxuICogICAgICBAY2xhc3MgQnV0dG9uc01hbmFnZXJcbiAqICAgICAgXG4gKi9cbkJ1dHRvbnNNYW5hZ2VyLnByb3RvdHlwZSA9IHtcblx0Y29uc3RydWN0b3I6IEJ1dHRvbnNNYW5hZ2VyLFxuICAgICAgICBidXR0b25zIDogW10sXG5cdFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgYnV0dG9ucyBzdGF0dXMgaGF2aW5nIGludG8gYWNjb3VudCBDb250ZXh0RGF0YUxpc3Qgc3RhdHVzXG4gICAgICAgICAqLyAgICAgICAgXG5cdHVwZGF0ZUJ1dHRvbnNTdGF0dXMgOiBmdW5jdGlvbiAoKXtcblx0XHRcblx0XHQvLyBXZSBkcmF3IHNsaWdodGx5IHNvZnRlciBidXR0b25zIG9mIHJlc291cmNlIHR5cGVzIHdpdGhvdXQgYW55IHJlc3VsdHNcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSAhPSBudWxsKSB7XG5cdFx0XHRmb3IodmFyIHByb3BlcnR5IGluIHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUpe1xuXHRcdFx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcblx0XHRcdFx0XHR2YXIgcHJvcGVydHlDb3VudCA9IHRoaXMuY29udGV4dERhdGFMaXN0Lm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGVbcHJvcGVydHldO1xuXHRcdFx0XHRcdHZhciBteUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BlcnR5KTtcblx0XHRcdFx0XHR0aGlzLnNldEJ1dHRvbkFzcGVjdEFzUmVzdWx0cyhteUJ1dHRvbixwcm9wZXJ0eUNvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XG5cdFx0fVxuXHR9LFxuICAgICAgICBcbiAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBidXR0b25zIGFuZCBkcmF3IHRoZW0gaW50byB0aGUgZWxlbWVudCB3aXRoIGlkICd0YXJnZXRJZCdcbiAgICAgICAgICovICAgICAgICBcblx0YnVpbGRCdXR0b25zIDogZnVuY3Rpb24gKCl7XG5cdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0SWQpO1xuXHRcdGlmICh0YXJnZXQgPT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PSBudWxsKXtcblx0XHRcdHJldHVybjtcdFxuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5oZWxwVGV4dCl7XG5cdFx0XHR2YXIgaGVscFRleHRDb250YWluZXIgPSB0aGlzLmNyZWF0ZUJ1dHRvbnNIZWxwVGV4dCgpO1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKGhlbHBUZXh0Q29udGFpbmVyKTtcblx0XHR9XG5cdFx0dmFyIHJvd0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHJvd0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3Jvd19jb250YWluZXInKTtcblx0XHRcblx0XHRpZiAodGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aD4wKSB7XG5cdFx0XHR0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbEZpbHRlcnMgPSBbXTtcblx0XHR9XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteUJ1dHRvbiA9IG51bGw7XG5cdFx0XHRpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX1JPVU5EX0ZMQVQgPT0gdGhpcy5idXR0b25zU3R5bGUpIHtcblx0XHRcdFx0bXlCdXR0b24gPSB0aGlzLmNyZWF0ZVJvdW5kRmxhdEJ1dHRvbihidXR0b25EYXRhWzBdLGJ1dHRvbkRhdGFbMV0sYnV0dG9uRGF0YVsyXSk7XG5cdFx0XHR9ZWxzZSBpZiAoY29uc3RhbnRzLkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFkgPT0gdGhpcy5idXR0b25zU3R5bGUpe1xuXHRcdFx0XHRteUJ1dHRvbiA9IHRoaXMuY3JlYXRlSWNvbk9ubHlCdXR0b24oYnV0dG9uRGF0YVswXSxidXR0b25EYXRhWzFdLGJ1dHRvbkRhdGFbMl0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG15QnV0dG9uID0gdGhpcy5jcmVhdGVTcXVhcmVkM0RkQnV0dG9uKGJ1dHRvbkRhdGFbMF0sYnV0dG9uRGF0YVsxXSxidXR0b25EYXRhWzJdKTtcblx0XHRcdH1cblx0XHRcdHZhciBteUJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bXlCdXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19jZWxsX2NvbnRhaW5lcicpO1xuXHRcdFx0bXlCdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQobXlCdXR0b24pO1xuXHRcdFx0cm93Q29udGFpbmVyLmFwcGVuZENoaWxkKG15QnV0dG9uQ29udGFpbmVyKTtcblxuXHRcdFx0dGhpcy5idXR0b25zLnB1c2gobXlCdXR0b24pO1xuXHRcdFx0dGhpcy5jb250ZXh0RGF0YUxpc3QudG90YWxGaWx0ZXJzLnB1c2goYnV0dG9uRGF0YVsyXSk7XG5cdFx0fVxuXHRcdFxuICAgICAgICAgICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChyb3dDb250YWluZXIpO1xuXHRcdFxuXHRcdGlmICh0aGlzLnByZXNzZWRVbmRlcmxpbmVzKXtcblx0XHRcdHZhciB1bmRlcmxpbmVzQ29udGFpbmVyID0gdGhpcy5jcmVhdGVCdXR0b25zVW5kZXJsaW5lQ29udGFpbmVyKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQodW5kZXJsaW5lc0NvbnRhaW5lcik7XG5cdFx0fVxuXHRcdFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRGaWx0ZXJzID0gdGhpcy5nZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucygpO1xuXHR9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogQ3JlYXRlcyBwcmVzc2VkIGJ1dHRvbnMgYW5kIGRyYXcgdGhlbSBpbnRvIHRoZSBlbGVtZW50IHdpdGggaWQgJ3RhcmdldElkJ1xuICAgICAgICAqLyAgXG4gICAgICAgIGJ1aWxkUHJlc3NlZEJ1dHRvbnMgOiBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRCdXR0b25zKCk7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNCdXR0b25QcmVzc2VkKHRoaXMuYnV0dG9uc1tpXSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dCdXR0b25DbGljayh0aGlzLmJ1dHRvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRGaWx0ZXJzID0gdGhpcy5nZXRQcmVzZW50RmlsdGVyc0J5QnV0dG9ucygpO1xuXG4gICAgICAgIH0sXG5cdFxuXHRcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnUk9VTkRfRkxBVCcgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVSb3VuZEZsYXRCdXR0b24gOiBmdW5jdGlvbihsYWJlbCwgaW50ZXJuYWxDbGFzcywgaW50ZXJuYWxOYW1lKXtcbiAgICAgICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICAgICBidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuICAgICAgICAgICAgYnV0dG9uLnRpdGxlID0gbGFiZWw7XG4gICAgICAgICAgICBidXR0b24ubmFtZSA9IGludGVybmFsTmFtZTtcblx0ICAgIGJ1dHRvbi5pZCA9IGludGVybmFsTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbi5ocmVmID0gXCIjXCI7XG4gICAgICAgICAgICB2YXIgbXlCdXR0b25zTWFuYWdlciA9IHRoaXM7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0ICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdyb3VuZF9mbGF0Jyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgndW5wcmVzc2VkJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcbiAgICAgICAgICAgIHJldHVybiBidXR0b247ICAgIFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gd2l0aCAnU1FVQVJFRF8zRCcgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVTcXVhcmVkM0RkQnV0dG9uIDogZnVuY3Rpb24obGFiZWwsIGludGVybmFsQ2xhc3MsIGludGVybmFsTmFtZSl7XG4gICAgICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgdmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKGxpbmtUZXh0KTtcbiAgICAgICAgICAgIGJ1dHRvbi50aXRsZSA9IGxhYmVsO1xuICAgICAgICAgICAgYnV0dG9uLm5hbWUgPSBpbnRlcm5hbE5hbWU7XG5cdCAgICBidXR0b24uaWQgPSBpbnRlcm5hbE5hbWU7XG4gICAgICAgICAgICBidXR0b24uaHJlZiA9IFwiI1wiO1xuICAgICAgICAgICAgdmFyIG15QnV0dG9uc01hbmFnZXIgPSB0aGlzO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBteUJ1dHRvbnNNYW5hZ2VyLmZpbHRlcih0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uJyk7XG5cdCAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc3F1YXJlZF8zZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3VucHJlc3NlZCcpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoaW50ZXJuYWxDbGFzcyk7XG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHdpdGggJ0lDT05fT05MWScgYXNwZWN0LlxuICAgICAgICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSAtIFRpdGxlIHRvIGJlIHVzZWQgaW50byB0aGUgQU5DSE9SIGVsZW1lbnQuXG4gICAgICAgICogQHBhcmFtIGludGVybmFsQ2xhc3Mge1N0cmluZ30gLSBTcGVjaWZpYyBjbGFzc05hbWUgdG8gYmUgdXNlZCBpbnRvIHRoZSBBTkNIT1IgZWxlbWVudC5cbiAgICAgICAgKiBAcGFyYW0gaW50ZXJuYWxOYW1lIHtTdHJpbmd9IC0gTmFtZSB0byBiZSB1c2VkIGludG8gdGhlIEFOQ0hPUiBlbGVtZW50LiBJdCBzaG91bGQgYmUgYSBmaWx0ZXIgbmFtZS5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVJY29uT25seUJ1dHRvbiA6IGZ1bmN0aW9uKGxhYmVsLCBpbnRlcm5hbENsYXNzLCBpbnRlcm5hbE5hbWUpe1xuXHRcdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0dmFyIGxpbmtUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuXHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG5cdFx0YnV0dG9uLnRpdGxlID0gbGFiZWw7XG5cdFx0YnV0dG9uLm5hbWUgPSBpbnRlcm5hbE5hbWU7XG5cdFx0YnV0dG9uLmlkID0gaW50ZXJuYWxOYW1lO1xuXHRcdGJ1dHRvbi5ocmVmID0gXCIjXCI7XG5cdFx0dmFyIG15QnV0dG9uc01hbmFnZXIgPSB0aGlzO1xuXHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0ICAgIG15QnV0dG9uc01hbmFnZXIuZmlsdGVyKHRoaXMpO1xuXHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZCgnaWNvbnNfb25seScpO1xuXHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd1bnByZXNzZWQnKTtcblx0XHRidXR0b24uY2xhc3NMaXN0LmFkZChpbnRlcm5hbENsYXNzKTtcblx0XHRyZXR1cm4gYnV0dG9uOyAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgc3RhdHVzIG9mIHRoZSBidXR0b24gYW5kIGV4ZWN1dGVzIHRoZSByZWRyYXduIG9mIHRoZSBDb250ZXh0RGF0YUxpc3RcbiAgICAgICAgKiBvYmplY3QgaGF2aW5nIGludG8gYWNjb3VudCBjaG9zZW4gZmlsdGVycy5cbiAgICAgICAgKiBAcGFyYW0gbXlCdXR0b24ge0J1dHRvbn0gLSBCdXR0b24gdG8gYmUgcHJlc3NlZC91bnByZXNzZWQuXG4gICAgICAgICovICBcbiAgICAgICAgZmlsdGVyOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgdGhpcy5zaG93QnV0dG9uQ2xpY2sobXlCdXR0b24pO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudEZpbHRlcnMgPSB0aGlzLmdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zKCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC50b3RhbERyYXdDb250ZXh0RGF0YUxpc3QoKTtcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY2hhbmdlcyB0aGUgYXNwZWN0IG9mIG9uZSBidXR0b24gZGVwZW5kaW5nIG9uIGlmIGl0IGhhcyBhbnkgYXNzb2NpYXRlZCByZXN1bHQgb3Igbm90LlxuICAgICAgICAqIEBwYXJhbSBteUJ1dHRvbiB7QnV0dG9ufSAtIEJ1dHRvbiB0byBiZSBtb2RpZmllZC5cbiAgICAgICAgKiBAcGFyYW0gbnVtYmVyUmVzdWx0cyB7SW50ZWdlcn0gLSBOdW1iZXIgb2Ygb2NjdXJyZW5jZXMgYXNzb2NpYXRlZCB0byB0aGUgYnV0dG9uLlxuICAgICAgICAqLyBcbiAgICAgICAgc2V0QnV0dG9uQXNwZWN0QXNSZXN1bHRzOiBmdW5jdGlvbiAobXlCdXR0b24sIG51bWJlclJlc3VsdHMpe1xuXHRcdGlmIChteUJ1dHRvbiA9PSB1bmRlZmluZWQgfHwgbXlCdXR0b24gPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1x0ICAgIFxuXHRcdH1cblx0XHR2YXIgZW1wdHlUaXRsZVN1ZmZpeCA9ICcgKG5vIHJlc3VsdHMpJztcblx0XHRpZiAobnVtYmVyUmVzdWx0cyA9PSAwKSB7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk9PS0xKSB7XG5cdFx0XHRcdG15QnV0dG9uLnRpdGxlID0gbXlCdXR0b24udGl0bGUgKyBlbXB0eVRpdGxlU3VmZml4O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fWVsc2V7XG5cdFx0XHRteUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuXHRcdFx0aWYgKG15QnV0dG9uLnRpdGxlLmluZGV4T2YoZW1wdHlUaXRsZVN1ZmZpeCk+LTEpIHtcblx0XHRcdFx0bXlCdXR0b24udGl0bGUucmVwbGFjZShlbXB0eVRpdGxlU3VmZml4LCcnKTtcblx0XHRcdH1cblx0XHR9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGNoYW5nZXMgdGhlIGFzcGVjdCBvZiBvbmUgYnV0dG9uIGZyb20gcHJlc3NlZCB0byB1bnByZXNzZWQsIG9yIHZpY2UgdmVyc2EuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGJlIHByZXNzZWQvdW5wcmVzc2VkLlxuICAgICAgICAqLyBcbiAgICAgICAgc2hvd0J1dHRvbkNsaWNrOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuXHRcdG15QnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJ1bnByZXNzZWRcIik7XG5cdFx0bXlCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcInByZXNzZWRcIik7XG5cdFx0aWYgKHRoaXMucHJlc3NlZFVuZGVybGluZXMpIHtcblx0XHRcdHZhciB1bmRlcmxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChteUJ1dHRvbi5pZCtcIl91bmRlcmxpbmVcIik7XG5cdFx0XHRpZiAodGhpcy5pc0J1dHRvblByZXNzZWQobXlCdXR0b24pKSB7XG5cdFx0XHRcdHVuZGVybGluZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR1bmRlcmxpbmUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgaWYgdGhlIGJ1dHRvbiBwYXNzZWQgYXMgYXJndW1lbnQgaXMgcHJlc3NlZCBvciBub3QuXG4gICAgICAgICogQHBhcmFtIG15QnV0dG9uIHtCdXR0b259IC0gQnV0dG9uIHRvIGNoZWNrIGl0cyBzdGF0dXMuXG4gICAgICAgICoge0Jvb2xlYW59IC0gUmV0dXJucyBpZiBteUJ1dHRvbiBpcyBwcmVzc2VkIG9yIG5vdC5cbiAgICAgICAgKi9cbiAgICAgICAgaXNCdXR0b25QcmVzc2VkOiBmdW5jdGlvbiAobXlCdXR0b24pe1xuICAgICAgICAgICAgaWYgKCFteUJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJwcmVzc2VkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfWVsc2UgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYWN0aXZlIGZpbHRlcnMgcmVsYXRlZCB3aXRoIHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKiB7QXJyYXl9IC0gQ3VycmVudCBhcHBsaWNhYmxlIGZpbHRlcnMuXG4gICAgICAgICovXG4gICAgICAgIGdldFByZXNlbnRGaWx0ZXJzQnlCdXR0b25zIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwcmVzc2VkQnV0dG9ucyA9IHRoaXMuZ2V0UHJlc3NlZEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHByZXNzZWRCdXR0b25zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGZpbHRlcnMucHVzaChwcmVzc2VkQnV0dG9uc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJzOyAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbGwgcHJlc3NlZCBidXR0b25zLlxuICAgICAgICAqIHtBcnJheX0gLSBDdXJyZW50IHByZXNzZWQgYnV0dG9ucy5cbiAgICAgICAgKi9cbiAgICAgICAgZ2V0UHJlc3NlZEJ1dHRvbnMgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHByZXNzZWRCdXR0b25zID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuYnV0dG9ucy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0J1dHRvblByZXNzZWQodGhpcy5idXR0b25zW2ldKSl7XG4gICAgICAgICAgICAgICAgICAgIHByZXNzZWRCdXR0b25zLnB1c2godGhpcy5idXR0b25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJlc3NlZEJ1dHRvbnM7XG4gICAgICAgIH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXJhZ3JhcGggZWxlbWVudCB3aXRoIHNwZWNpZmljIHRleHQgYWJvdXQgZWFjaCByZXNvdXJjZSB0eXBlIGJ1dHRvblxuXHQqICAge0hUTUwgT2JqZWN0fSAtIGRpdiBlbGVtZW50IHdpdGggaGVscCByZWxhdGVkIHRvIGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25zLlxuICAgICAgICAqL1xuXHRjcmVhdGVCdXR0b25zSGVscFRleHQgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBoZWxwX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGhlbHBfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbnNfcm93X2NvbnRhaW5lcicpO1xuXHRcdFxuXHRcdGZvcih2YXIgaT0wO2k8dGhpcy5idXR0b25zQmFzaWNEYXRhLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIGJ1dHRvbkRhdGEgPSB0aGlzLmJ1dHRvbnNCYXNpY0RhdGFbaV07XG5cdFx0XHRcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaW5uZXJIVE1MID0gYnV0dG9uRGF0YVszXTtcblx0XHRcdG15VGV4dC5jbGFzc0xpc3QuYWRkKCdidXR0b25faGVscCcpO1xuXHRcdFx0aGVscF9jb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcdFxuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gaGVscF9jb250YWluZXI7XG5cdH0sXG5cdFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGFyYWdyYXBoIGVsZW1lbnQgd2l0aCBzcGVjaWZpYyB0ZXh0IGFib3V0IGVhY2ggcmVzb3VyY2UgdHlwZSBidXR0b25cblx0KiAgIHtIVE1MIE9iamVjdH0gLSBkaXYgZWxlbWVudCB3aXRoIGhlbHAgcmVsYXRlZCB0byBlYWNoIHJlc291cmNlIHR5cGUgYnV0dG9ucy5cbiAgICAgICAgKi9cblx0Y3JlYXRlQnV0dG9uc1VuZGVybGluZUNvbnRhaW5lciA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHVuZGVybGluZXNfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dW5kZXJsaW5lc19jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYnV0dG9uc19yb3dfY29udGFpbmVyJyk7XG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLmJ1dHRvbnNCYXNpY0RhdGEubGVuZ3RoO2krKyl7XG5cdFx0XHR2YXIgYnV0dG9uRGF0YSA9IHRoaXMuYnV0dG9uc0Jhc2ljRGF0YVtpXTtcblx0XHRcdHZhciBteVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRteVRleHQuaWQgPSBidXR0b25EYXRhWzJdK1wiX3VuZGVybGluZVwiO1xuXHRcdFx0bXlUZXh0LmNsYXNzTGlzdC5hZGQoJ2J1dHRvbl91bmRlcmxpbmUnKTtcblx0XHRcdFxuXHRcdFx0dmFyIG15VW5kZXJsaW5lQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRteVVuZGVybGluZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdidXR0b25zX3VuZGVybGluZV9jZWxsX2NvbnRhaW5lcicpO1xuXHRcdFx0bXlVbmRlcmxpbmVDb250YWluZXIuYXBwZW5kQ2hpbGQobXlUZXh0KTtcblx0XHRcdHVuZGVybGluZXNfY29udGFpbmVyLmFwcGVuZENoaWxkKG15VW5kZXJsaW5lQ29udGFpbmVyKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHVuZGVybGluZXNfY29udGFpbmVyO1xuXHR9XG59XG5cbi8vIFNUQVRJQyBBVFRSSUJVVEVTXG4vKlxudmFyIENPTlNUUyA9IHtcblx0Ly9zdHlsZSBvZiB2aXN1YWxpemF0aW9uXG5cdFNRVUFSRURfM0Q6XCJTUVVBUkVEXzNEXCIsXG5cdFJPVU5EX0ZMQVQ6XCJST1VORF9GTEFUXCIsXG5cdElDT05TX09OTFk6XCJJQ09OU19PTkxZXCJcbn07XG5cbmZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgIEJ1dHRvbnNNYW5hZ2VyW2tleV0gPSBDT05TVFNba2V5XTtcbn1cbiovICAgIFxuICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbnNNYW5hZ2VyO1xuICAgICAgXG4gICIsInZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIENvbW1vbkRhdGEgY29uc3RydWN0b3JcbiAqICAgICAgICAgIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICpcbiAqL1xudmFyIENvbW1vbkRhdGEgPSBmdW5jdGlvbihqc29uRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xufTtcblxuLyoqXG4gKiAgICAgICAgICBDb21tb24gcGFyZW50IGNsYXNzIHRoYXQgc2hvdWxkIGJlIGluaGVyaXRlZCBieSBhbGwgc3BlY2lmaWMgY2xhc3NlcyB0byBiZSBtYW5hZ2VkIG9uIHRoaXMgY29tcG9uZW50LlxuICovXG5Db21tb25EYXRhLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yOiBDb21tb25EYXRhLFxuICAgICAgICAgICAgU09VUkNFX0ZJRUxEICAgICAgICAgICAgICAgIDogXCJzb3VyY2VcIixcbiAgICAgICAgICAgIFJFU09VUkNFX1RZUEVfRklFTEQgICAgICAgICA6IFwicmVzb3VyY2VfdHlwZVwiLFxuICAgICAgICAgICAgVElUTEVfRklFTEQgICAgICAgICAgICAgICAgIDogXCJ0aXRsZVwiLFxuICAgICAgICAgICAgVE9QSUNfRklFTEQgICAgICAgICAgICAgICAgIDogXCJmaWVsZFwiLFxuICAgICAgICAgICAgREVTQ1JJUFRJT05fRklFTEQgICAgICAgICAgIDogXCJkZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgTElOS19GSUVMRCAgICAgICAgICAgICAgICAgIDogXCJsaW5rXCIsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHJldHJpZXZlcyB0aGUgcHJvcGVyIGNsYXNzIG5hbWUgYmFzZWQgb24gdGhlIHJlYWwgcmVzb3VyY2UgdHlwZVxuICAgICAgICAgICAgbWFwcGluZ1Jlc291cmNlVHlwZUNsYXNzZXMgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnVG9vbCcgICAgICAgICAgICAgICAgICA6J3Rvb2xzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdXb3JrZmxvdycgICAgICAgICAgICAgIDond29ya2Zsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0RhdGFiYXNlJyAgICAgICAgICAgICAgOidkYXRhYmFzZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnVHJhaW5pbmcgTWF0ZXJpYWwnICAgICA6J3RyYWluaW5nX21hdGVyaWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdFdmVudCcgICAgICAgICAgICAgICAgIDonZXZlbnRzJ1xuICAgICAgICAgICAgfSxcbiAgICAgXG4gICAgICAgICAgICAvKiogICAgICAgICBVVElMSVRZIEZVTkNUSU9OUyBUTyBHRVQgRklFTEQnUyBWQUxVRSAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIEF1eGlsaWFyIGZ1bmN0aW9uIHRvIGdldCBlYXNpbHkgYW55IGtpbmQgb2YgZGF0YSBwcmVzZW50IGluIHRoZSBpbnRlcm5hbFxuICAgICAgICAgICAgICogICAgICAgICAgZGF0YSBzdHJ1Y3R1cmUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gZmllbGROYW1lIHtTdHJpbmd9IC0gTmFtZSBvZiB0aGUgZmllbGQgdG8gYmUgcmV0dXJuZWQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFBhcmFtZXRlcmlzZWRWYWx1ZSA6IGZ1bmN0aW9uKGZpZWxkTmFtZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5qc29uRGF0YSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuanNvbkRhdGEgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25EYXRhW2ZpZWxkTmFtZV07ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIG1hbmRhdG9yeSBmaWVsZHNcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBzb3VyY2UgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIHNvdXJjZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0U291cmNlVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuU09VUkNFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYWxsIHJlc291cmNlIHR5cGVzIHByZXNlbnQgaW4gdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIHJlc291cmNlIHR5cGVycyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFJlc291cmNlVHlwZVZhbHVlcyA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5SRVNPVVJDRV9UWVBFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFNvbWV0aW1lcyBjYW4gYmUgZHVwbGljYXRlIHJlc291cmNlIHR5cGVzLlxuICAgICAgICAgICAgICogICAgICAgICAgVGhpcyBmdW5jdGlvbiBvbmx5IHJldHVybnMgdW5pcXVlIHJlc291cmNlIHR5cGVzLlxuICAgICAgICAgICAgICogICAgICAgICAge0FycmF5fSAtIEFycmF5IG9mIHN0cmluZ3Mgd2l0aCB1bmlxdWUgcmVzb3VyY2UgdHlwZXJzIHJlbGF0ZWQgd2l0aCB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRSZXNvdXJjZVR5cGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmlxdWVSZXNvdXJjZVR5cGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHJlc291cmNlVHlwZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISAodW5pcXVlUmVzb3VyY2VUeXBlcy5pbmRleE9mKHJlc291cmNlVHlwZXNbaV0pID4gLTEpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZVJlc291cmNlVHlwZXMucHVzaChyZXNvdXJjZVR5cGVzW2ldKTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmlxdWVSZXNvdXJjZVR5cGVzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyB0aGUgdGl0bGUgb2YgdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7U3RyaW5nfSAtIFRpdGxlIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRUaXRsZVZhbHVlIDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLlRJVExFX0ZJRUxEKTsgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYWxsIHRvcGljIG9mIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICogICAgICAgICAge0FycmF5fSAtIFRvcGljcyByZWxhdGVkIHdpdGggdGhpcyBlbnRpdHkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFRvcGljVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuVE9QSUNfRklFTEQpOyAgICAgIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gb3B0aW9uYWwgZmllbGRzXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgdGhlIGRlc2NyaXB0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVudGl0eSAoaWYgZXhpc3RzKS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gVGV4dHVhbCBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RGVzY3JpcHRpb25WYWx1ZSA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5ERVNDUklQVElPTl9GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgdGhlIFVSTCB0byBhY2Nlc3MgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZSBvZiB0aGlzIGVudGl0eSAoaWYgZXhpc3RzKS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtTdHJpbmd9IC0gU291cmNlJ3MgVVJMLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMaW5rVmFsdWUgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuTElOS19GSUVMRCk7ICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgXG4gICAgICBcbiAgICAgICAgICAgIC8qKiAgICAgICAgIFNUQU5EQVJEIEZVTkNUSU9OUyBUTyBNQU5BR0UgSFRNTCBCRUhBVklPVVIgT0YgVEhJUyBFTlRJVFkgICAgICovXG4gICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUga2luZCBvZiBDb21tb25EYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudCBpbiBhIHdheSB0aGF0XG4gICAgICAgICAgICAgKiAgICAgICAgICBkZXBlbmRzIG9uIHdoYXQga2luZCBvZiBzdHlsZSB5b3Ugd2FudCBpdCB3aWxsIGJlIGRyYXduLlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIGRpc3BsYXlTdHlsZSB7U3RyaW5nfSAtIE9uZSBkcmF3aW5nIHN0eWxlLiBDdXJyZW50bHkgQ29udGV4dERhdGFMaXN0LkNPTU1PTl9TVFlMRSBvciBDb250ZXh0RGF0YUxpc3QuRlVMTF9TVFlMRS5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RHJhd2FibGVPYmplY3RCeVN0eWxlIDogZnVuY3Rpb24oZGlzcGxheVN0eWxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmIChkaXNwbGF5U3R5bGUgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9GVUxMX1NUWUxFKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZ1bGxEcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgb25lIGltcHJvdmVkIHdheSBvZiByZXByZXNlbnRpbmcgYW55IENvbW1vbkRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAgSXQgaGFzIHRvIGJlIGV4dGVuZGVkIGJ5IGVhY2ggY2hpbGRyZW4gb2JqZWN0OyB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjYWxscyB0b1xuICAgICAgICAgICAgICogICAgICAgICAgZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEZ1bGxEcmF3YWJsZU9iamVjdCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21tb25EcmF3YWJsZU9iamVjdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nIGFueSBDb21tb25EYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0Q29tbW9uRHJhd2FibGVPYmplY3QgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ckNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfcm93XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX2xlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyX2NvbF9yaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvcGljcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGlzdEVsZW1lbnQuYXBwZW5kQ2hpbGQobWFpbkNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBsaXN0RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gQU5DSE9SIGVsZW1lbnQgd2l0aCAndGl0bGUnIGluZm9ybWF0aW9uIGxpbmtpbmcgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxUaXRsZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX3RpdGxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLHRoaXMuZ2V0TGlua1ZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFRpdGxlVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aW1lcyBkZXNjcmlwdGlvbiBoYXZlIGxvbmcgdmFsdWVzIGFuZCBpdCBzZWVtcyBtb3JlIGxpa2UgZXJyb3JzIVxuICAgICAgICAgICAgICAgICAgICAgICAgLyp2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmdldERlc2NyaXB0aW9uVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aXRsZSA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFyZ2V0JywnX2JsYW5rJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBvbmUgc3RhbmRhcmQgd2F5IG9mIHJlcHJlc2VudGluZyAndG9waWNzJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBESVYgZWxlbWVudCB3aXRoIGFsbCAndG9waWNzJyBpbmZvcm1hdGlvbiByZWxhdGVkIHRvIHRoaXMgZW50aXR5LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRMYWJlbFRvcGljczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfdG9waWNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhd1RvcGljVmFsdWUgPSB0aGlzLmdldFRvcGljVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaW5hbFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxyYXdUb3BpY1ZhbHVlLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxTdHJpbmcgPSBmaW5hbFN0cmluZyArIHJhd1RvcGljVmFsdWVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGkrMSkgPCByYXdUb3BpY1ZhbHVlLmxlbmd0aCkge1xuXHRcdFx0XHRcdGZpbmFsU3RyaW5nICs9ICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZmluYWxTdHJpbmc7IFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBzdGFuZGFyZCB0ZXh0dWFsIHdheSBvZiByZXByZXNlbnRpbmcgJ3Jlc291cmNlIHR5cGUnIGRhdGEgdHJhbnNmb3JtZWQgaW50byBhIEhUTUwgY29tcG9uZW50LlxuICAgICAgICAgICAgICogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIFNQQU4gZWxlbWVudCB3aXRoIGFsbCAncmVzb3VyY2UgdHlwZScgaW5mb3JtYXRpb24gcmVsYXRlZCB0byB0aGlzIGVudGl0eS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0TGFiZWxSZXNvdXJjZVR5cGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZ2V0VW5pcXVlUmVzb3VyY2VUeXBlVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogICAgICAgICAgUmV0dXJucyBhIHN0YW5kYXJkIHdheSAoYXMgYSBzZXQgb2YgaW1hZ2VzKSBvZiByZXByZXNlbnRpbmcgJ3Jlc291cmNlIHR5cGUnXG4gICAgICAgICAgICAgKiAgICAgICAgICBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBTUEFOIGVsZW1lbnQgd2l0aCBhbGwgJ3Jlc291cmNlIHR5cGUnIGluZm9ybWF0aW9uIHJlbGF0ZWQgdG8gdGhpcyBlbnRpdHlcbiAgICAgICAgICAgICAqICAgICAgICAgIHJlcHJlc2VudGVkIGFzIHNldCBvZiBpbWFnZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldEltYWdlUmVzb3VyY2VUeXBlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZVR5cGVzID0gdGhpcy5nZXRVbmlxdWVSZXNvdXJjZVR5cGVWYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8cmVzb3VyY2VUeXBlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZV90eXBlID0gcmVzb3VyY2VUeXBlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50aXRsZSA9IHJlc291cmNlX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmbGF0IGdyYXkgc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZmxhdF9yZXNvdXJjZV90eXBlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2dyYXknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdW5kIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2VsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmVzb3VyY2VfdHlwZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NpcmNsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMubWFwcGluZ1Jlc291cmNlVHlwZUNsYXNzZXNbcmVzb3VyY2VfdHlwZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgICAgICAgICBSZXR1cm5zIGEgZGl2IG9iamVjdCB3aXRoIGEgc2hvcnQgZGVzY3JpcHRpb24gdGhhdCBjYW4gYmUgZXhwYW5kZWQgdG8gc2hvdyBhIGxvbmdlciBkZXNjcmlwdGlvbi5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBzaG9ydFRleHQge1N0cmluZ30gLSBUZXh0IGxpbmsgdG8gaGlkZSBvciBleHBhbmQgdGhlIGxvbmcgdGV4dC5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBsb25nVGV4dCB7U3RyaW5nLCBIVE1MIEVMRU1FTlQgb3IgQXJyYXkgb2YgYm90aH0gLSBMb25nIGRlc2NyaXB0aW9uIG9yIEhUTUwgZmllbGQgd2l0aCBhIGxvbmcgZGVzY3JpcHRpb24gb2YgdGhlIHJlY29yZC5cbiAgICAgICAgICAgICAqICAgICAgICAgIEBwYXJhbSBsb25nVGV4dENsYXNzZXMge0FycmF5fSAtIENsYXNzZXMgdG8gbW9kaWZ5IHRoZSBhc3BlY3Qgb2YgdGhlIGV4cGFuZGFibGUgdGV4dC5cbiAgICAgICAgICAgICAqICAgICAgICAgIHtIVE1MIE9iamVjdH0gLSBESVYgZWxlbWVudCB3aXRoIGJvdGggc2hvcnQgYW5kIGZpZWxkIGRlc2NyaXB0aW9ucy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0RXhwYW5kYWJsZVRleHQ6IGZ1bmN0aW9uKHNob3J0VGV4dCwgbG9uZ1RleHQsIGxvbmdUZXh0Q2xhc3Nlcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZXhwYW5kYWJsZV9kaXYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21JbnROdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAwMDAwIC0gMCkpICsgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlcyB0aGUgbGluayB0byBoaWRlIGFuZCBzaG93IHRoZSBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGl2X3RpdGxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLFwiI1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdpZCcsXCJleHBhbmRhYmxlX2Rpdl90aXRsZV9cIityYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZXhwYW5kc2lnbmFsID0gXCJbK11cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2hpZGVzaWduYWwgPSBcIlstXVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lckhUTUwgPSBzaG9ydFRleHQrXCIgXCIrdG9leHBhbmRzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSBtb3JlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsub25jbGljayA9IGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlVGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhwYW5kYWJsZV9kaXZfdGl0bGVfJytyYW5kb21JbnROdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHBhbmRhYmxlRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X2ludGVybmFsZGl2XycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwgPWV4cGFuZGFibGVUaXRsZS5pbm5lckhUTUwucmVwbGFjZSh0b2V4cGFuZHNpZ25hbCx0b2hpZGVzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZVRpdGxlLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIGhpZGUgdGhlIGluZm9ybWF0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUuaW5uZXJIVE1MID0gZXhwYW5kYWJsZVRpdGxlLmlubmVySFRNTC5yZXBsYWNlKHRvaGlkZXNpZ25hbCx0b2V4cGFuZHNpZ25hbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlVGl0bGUudGl0bGUgPSBcIkNsaWNrIGhlcmUgdG8gc2VlIG1vcmUgaW5mb3JtYXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGVzIHRoZSBpbnRlcm5hbCBkaXYgd2l0aCB0aGUgZnVsbCBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludGVybmFsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5jbGFzc0xpc3QuYWRkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuc2V0QXR0cmlidXRlKCdpZCcsJ2V4cGFuZGFibGVfZGl2X2ludGVybmFsZGl2XycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb25nVGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmlubmVySFRNTCA9IGxvbmdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGxvbmdUZXh0Q2xhc3Nlcy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEaXYuYXBwZW5kQ2hpbGQobmV3U3BhbkVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcnJheSBvZiBIVE1MIG9iamVjdHMgb3Igc3RyaW5nc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobG9uZ1RleHQpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8bG9uZ1RleHQubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxvbmdUZXh0W2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1NwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuaW5uZXJIVE1MID0gbG9uZ1RleHRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9uZ1RleHRDbGFzc2VzICE9IHVuZGVmaW5lZCAmJiBsb25nVGV4dENsYXNzZXMgIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaUM9MDtpQzxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2lDKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChsb25nVGV4dENsYXNzZXNbaUNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1NwYW5FbGVtZW50ID0gbG9uZ1RleHRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9uZ1RleHRDbGFzc2VzICE9IHVuZGVmaW5lZCAmJiBsb25nVGV4dENsYXNzZXMgIT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaUM9MDtpQzxsb25nVGV4dENsYXNzZXMubGVuZ3RoO2lDKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3BhbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChsb25nVGV4dENsYXNzZXNbaUNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVybmFsRGl2LmFwcGVuZENoaWxkKG5ld1NwYW5FbGVtZW50KTsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhUTUwgb2JqZWN0ICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTcGFuRWxlbWVudCA9IGxvbmdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdUZXh0Q2xhc3NlcyAhPSB1bmRlZmluZWQgJiYgbG9uZ1RleHRDbGFzc2VzICE9IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGlDPTA7aUM8bG9uZ1RleHRDbGFzc2VzLmxlbmd0aDtpQysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NwYW5FbGVtZW50LmNsYXNzTGlzdC5hZGQobG9uZ1RleHRDbGFzc2VzW2lDXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbERpdi5hcHBlbmRDaGlsZChuZXdTcGFuRWxlbWVudCk7ICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGludGVybmFsRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICAgICAgICAgIFJldHVybnMgYSBkaXYgY29udGFpbmVyIHdpdGggYSBsaW5rIHRvIGFuIGFsZXJ0IHRvIHNob3cgYSBsb25nIGRlc2NyaXB0aW9uLlxuICAgICAgICAgICAgICogICAgICAgICAgQHBhcmFtIHNob3J0VGV4dCB7U3RyaW5nfSAtIFRleHQgbGluayB0byBzaG93IHRoZSBsb25nIHRleHQuXG4gICAgICAgICAgICAgKiAgICAgICAgICBAcGFyYW0gbG9uZ1RleHQge1N0cmluZywgSFRNTCBFTEVNRU5UIG9yIEFycmF5IG9mIGJvdGh9IC0gTG9uZyBkZXNjcmlwdGlvbiBvciBIVE1MIGZpZWxkIHdpdGggYSBsb25nIGRlc2NyaXB0aW9uIG9mIHRoZSByZWNvcmQuXG4gICAgICAgICAgICAgKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRElWIGVsZW1lbnQgd2l0aCBib3RoIHNob3J0IGFuZCBmaWVsZCBkZXNjcmlwdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldExvbmdGbG9hdGluZ1RleHQ6IGZ1bmN0aW9uKHNob3J0VGV4dCwgbG9uZ1RleHQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGFibGVfZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW50TnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMCAtIDApKSArIDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZXMgdGhlIGxpbmsgdG8gaGlkZSBhbmQgc2hvdyB0aGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2Rpdl90aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJyxcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLFwiZXhwYW5kYWJsZV9kaXZfdGl0bGVfXCIrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2V4cGFuZHNpZ25hbCA9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5pbm5lckhUTUwgPSBzaG9ydFRleHQrXCIgXCIrdG9leHBhbmRzaWduYWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnRpdGxlID0gXCJDbGljayBoZXJlIHRvIHNlZSB0aGUgbG9uZyB0ZXh0IGludG8gYSBuZXcgbGl0dGxlIHdpbmRvd1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLm9uY2xpY2sgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZVRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGFuZGFibGVfZGl2X3RpdGxlXycrcmFuZG9tSW50TnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleHBhbmRhYmxlX2Rpdl9pbnRlcm5hbGRpdl8nK3JhbmRvbUludE51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQobG9uZ1RleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIFxufTtcblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdE1JTl9MRU5HVEhfTE9OR19ERVNDUklQVElPTjogMTAwMFxufTtcblxuZm9yKHZhciBrZXkgaW4gQ09OU1RTKXtcbiAgICAgQ29tbW9uRGF0YVtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uRGF0YTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4vRGF0YU1hbmFnZXIuanNcIik7XG52YXIgQ29tbW9uRGF0YSA9IHJlcXVpcmUoXCIuL0NvbW1vbkRhdGEuanNcIik7XG52YXIgcmVxd2VzdCA9IHJlcXVpcmUoXCJyZXF3ZXN0XCIpO1xuXG4vKiogXG4gKiBDb250ZXh0RGF0YUxpc3QgQ29uc3RydWN0b3IuXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBDb250ZXh0RGF0YUxpc3QgY29tcG9uZW50LlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdGFyZ2V0SWQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW2Rpc3BsYXlTdHlsZT0gQ29udGV4dERhdGFMaXN0LkZVTExfU1RZTEUsIENvbnRleHREYXRhTGlzdC5DT01NT05fU1RZTEVdXG4gKiAgICBUeXBlIG9mIHJvd3MgdmlzdWFsaXNhdGlvbi5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJUZXh0Q2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgY29udGFpbnMgdXNlcidzIHRleHQgdG8gc2VhcmNoLlxuICogQG9wdGlvbiB7c3RyaW5nfSBbdXNlclRleHRUYWdDb250YWluZXI9T25lIHN0YWJsaXNoZWQgdGFnIG5hbWUsIGZvciBleGFtcGxlIGgxLiBJdCdzIG5vdCB1c2VkIGlmIHVzZXJUZXh0Q2xhc3NDb250YWluZXIgaXMgZGVmaW5lZCBdXG4gKiAgICBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyB0ZXh0IHRvIHNlYXJjaC5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJEZXNjcmlwdGlvbkNsYXNzQ29udGFpbmVyPVlvdXIgb3duIGNsYXNzIG5hbWUgXVxuICogICAgQ2xhc3MgbmFtZSB0aGF0IGNvbnRhaW5zIHVzZXIncyBkZXNjcmlwdGlvbiB0byBoZWxwIGZpbHRlciBzYW1lIHJlc3VsdHMgdGhhdCB1c2VyIGlzIHNlZWluZy5cbiAqIEBvcHRpb24ge3N0cmluZ30gW3VzZXJIZWxwQ2xhc3NDb250YWluZXI9WW91ciBvd24gY2xhc3MgbmFtZSBdXG4gKiAgICBDbGFzcyBuYW1lIHRoYXQgd2lsbCBjb250YWlucyBoZWxwIGljb24uXG4gKiBAb3B0aW9uIHtpbnR9IFtudW1iZXJSZXN1bHRzPW51bWJlciBdXG4gKiAgICBJbnRlZ2VyIHRoYXQgcmVzdHJpY3RzIHRoZSByZXN1bHRzIG51bWJlciB0aGF0IHNob3VsZCBiZSBzaG93bi5cbiAqIEBvcHRpb24ge2Jvb2xlYW59IFtpbmNsdWRlU2FtZVNpdGVSZXN1bHRzPUlmIHlvdSB3YW50IHRvIHNlZSByZWNvcmRzIG9mIHlvdXIgcHJlc2VudCBzaXRlLiBUZW1wb3JhcnkgZGlzYWJsZWQuIF1cbiAqICAgIEJvb2xlYW4gdGhhdCBhdm9pZHMgb3Igbm90IHJlc3VsdHMgZnJvbSB0aGUgc2FtZSBzaXRlIHlvdSBhcmUgc2VlaW5nLiAqL1xuLy9mdW5jdGlvbiBDb250ZXh0RGF0YUxpc3QgKG9wdGlvbnMpIHtcbnZhciBDb250ZXh0RGF0YUxpc3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0dmFyIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMgPSB7ICAgICAgICBcblx0ICAgICBkaXNwbGF5U3R5bGU6IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfQ09NTU9OX1NUWUxFLFxuXHQgICAgIGluY2x1ZGVTYW1lU2l0ZVJlc3VsdHMgOiB0cnVlXG5cdH07XG5cdGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuXHQgICAgIHRoaXNba2V5XSA9IGRlZmF1bHRfb3B0aW9uc192YWx1ZXNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBvcHRpb25zKXtcblx0ICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdH1cblx0dGhpcy5jb250ZXh0RGF0YVNlcnZlciA9IFwiaHR0cDovL3d3dy5iaW9jaWRlci5vcmc6ODk4My9zb2xyL2NvbnRleHREYXRhXCI7XG5cdHRoaXMuZGF0YU1hbmFnZXIgPSBuZXcgRGF0YU1hbmFnZXIoKTtcblx0XG5cdFxuXHQvLyBnbG9iYWwgY3VycmVudCBzdGF0dXNcblx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzPSBudWxsO1xuXHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdD0gbnVsbDtcblx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cz0gbnVsbDtcblx0dGhpcy5jdXJyZW50U3RhdHVzPSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkc7XG5cdHRoaXMuY3VycmVudEZpbHRlcnM9IG51bGw7XG5cdHRoaXMudG90YWxGaWx0ZXJzPW51bGw7XG5cdHRoaXMubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZT0gbnVsbDtcblx0dGhpcy5udW1SZXN1bHRzQnlSZXNvdXJjZVR5cGU9IG51bGw7XG5cdFxuXHR0aGlzLmN1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0dGhpcy5jdXJyZW50RG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuXHRcblx0dGhpcy5fb25Mb2FkZWRGdW5jdGlvbnM9IFtdO1xuXHRcblx0Ly90aGlzLmRyYXdIZWxwSW1hZ2UoKTtcblx0XG4gICAgICBcbn1cblxuXG5cbi8qKiBcbiAqIFJlc291cmNlIGNvbnRleHR1YWxpc2F0aW9uIHdpZGdldC5cbiAqIFxuICogXG4gKiBAY2xhc3MgQ29udGV4dERhdGFMaXN0XG4gKlxuICovXG5Db250ZXh0RGF0YUxpc3QucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogQ29udGV4dERhdGFMaXN0LFxuXHRcblx0LyoqXG5cdCAqIFNob3dzIHRoZSBjb250ZXh0dWFsaXNlZCBkYXRhIGludG8gdGhlIHdpZGdldC5cblx0ICovXG5cdGRyYXdDb250ZXh0RGF0YUxpc3QgOiBmdW5jdGlvbiAoKXtcblx0XHRjb25zb2xlLmxvZygnQ29udGV4dERhdGFMaXN0LkxPQURJTkcsJytjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpO1xuXHRcdGNvbnNvbGUubG9nKCdDb250ZXh0RGF0YUxpc3QuQ09NTU9OX1NUWUxFLCcrY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9DT01NT05fU1RZTEUpO1xuXHRcdHRoaXMuY3VycmVudFN0YXR1cyA9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORztcblx0XHQvL3RoaXMudXBkYXRlR2xvYmFsU3RhdHVzKHRoaXMuTE9BRElORyk7XG5cdFx0dmFyIHVzZXJUZXh0ID0gdGhpcy5nZXRVc2VyU2VhcmNoKCk7XG5cdFx0dmFyIHVzZXJEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0VXNlckNvbnRlbnREZXNjcmlwdGlvbigpO1xuXHRcdHZhciBtYXhSb3dzID0gdGhpcy5nZXRNYXhSb3dzKCk7XG5cdFx0dmFyIG5ld1VybCA9IHRoaXMuX2dldE5ld1VybCh1c2VyVGV4dCwgdXNlckRlc2NyaXB0aW9uLCB0aGlzLmN1cnJlbnRGaWx0ZXJzLCB0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCwgbWF4Um93cyk7XG5cdFx0dGhpcy5wcm9jZXNzRGF0YUZyb21VcmwobmV3VXJsKTtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBTaG93cyB0aGUgY29udGV4dHVhbGlzZWQgZGF0YSBpbnRvIHRoZSB3aWRnZXQsIHVwZGF0aW5nIHRoZSB3aG9sZSBpbnRlcm5hbCBzdGF0dXMgb2YgdGhlIHdpZGdldC5cblx0ICovXG5cdHRvdGFsRHJhd0NvbnRleHREYXRhTGlzdCA6IGZ1bmN0aW9uICgpe1xuXHRcdHRoaXMudXBkYXRlR2xvYmFsU3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyk7XG5cdFx0dGhpcy5kcmF3Q29udGV4dERhdGFMaXN0KCk7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBVc2VyJ3MgdGV4dCB0byBjb250ZXh0dWFsaXNlLCBpZiBpdCBleGlzdHMuXG4gICAgICAgICAqIHtTdHJpbmd9IC0gVGV4dCBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQgdGhhdCBjb250YWlucyBDb250ZXh0dWFsaXNhdGlvbiB3aWRnZXQuXG5cdCAqL1xuXHRnZXRVc2VyU2VhcmNoIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVzZXJUZXh0ID0gJyc7XG5cdFx0dmFyIGVsZW1lbnRzQ29udGFpbmVyID0gbnVsbDtcblx0XHRpZiAodGhpcy51c2VyVGV4dENsYXNzQ29udGFpbmVyICE9IHVuZGVmaW5lZCAmJiB0aGlzLnVzZXJUZXh0Q2xhc3NDb250YWluZXIgIT0gbnVsbCkge1xuXHRcdFx0ZWxlbWVudHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMudXNlclRleHRDbGFzc0NvbnRhaW5lcik7XG5cdFx0fWVsc2V7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRoaXMudXNlclRleHRUYWdDb250YWluZXIpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoZWxlbWVudHNDb250YWluZXIgIT0gbnVsbCAmJiBlbGVtZW50c0NvbnRhaW5lci5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbXlGaXJzdEVsZW1lbnQgPSBlbGVtZW50c0NvbnRhaW5lclswXTtcblx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJUZXh0O1xuXHRcdFx0aWYgKHVzZXJUZXh0ID09IHVuZGVmaW5lZCB8fCB1c2VyVGV4dCA9PSBudWxsKSB7XG5cdFx0XHRcdHVzZXJUZXh0ID0gbXlGaXJzdEVsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdXNlclRleHQ7XG5cdH0sXG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBVc2VyJ3MgZGVzY3JpcHRpb24gdG8gaGVscCBmaWx0ZXIgc2FtZSByZXN1bHRzIHRoYW4gdXNlciBpcyBzZWVpbmcuXG4gICAgICAgICAqIHtTdHJpbmd9IC0gVGV4dCBmb3VuZCBpbnRvIHRoZSBjbGllbnQgZG9jdW1lbnQuXG5cdCAqL1xuXHRnZXRVc2VyQ29udGVudERlc2NyaXB0aW9uIDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlc2NyaXB0aW9uID0gJyc7XG5cdFx0dmFyIGVsZW1lbnRzQ29udGFpbmVyID0gbnVsbDtcblx0XHRpZiAodGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lciAhPSBudWxsKSB7XG5cdFx0XHRlbGVtZW50c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VyRGVzY3JpcHRpb25DbGFzc0NvbnRhaW5lcik7XG5cdFx0fS8qZWxzZXtcblx0XHRcdGVsZW1lbnRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGhpcy51c2VyRGVzY3JpcHRpb25UYWdDb250YWluZXIpO1xuXHRcdH0qL1xuXHRcdFxuXHRcdGlmIChlbGVtZW50c0NvbnRhaW5lciAhPSBudWxsICYmIGVsZW1lbnRzQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBteUZpcnN0RWxlbWVudCA9IGVsZW1lbnRzQ29udGFpbmVyWzBdO1xuXHRcdFx0ZGVzY3JpcHRpb24gPSBteUZpcnN0RWxlbWVudC5pbm5lclRleHQ7XG5cdFx0XHRpZiAoZGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkIHx8IGRlc2NyaXB0aW9uID09IG51bGwpIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBteUZpcnN0RWxlbWVudC5pbm5lckhUTUw7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG1heGltdW0gbnVtYmVyIG9mIHJlc3VsdHMgdGhhdCBjYW4gYmUgc2hvd24gaW50byB0aGUgd2lkZ2V0LlxuICAgICAgICAgKiB7SW50ZWdlcn0gLSBNYXhpbXVtIGFtb3VudCBvZiByZXN1bHRzIHRoYXQgY2FuIGJlIHNob3duIGF0IHRoZSBzYW1lIHRpbWUuXG5cdCAqL1xuXHRnZXRNYXhSb3dzIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgbWF4Um93cyA9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTUFYX1JPV1M7XG5cdFx0aWYgKHRoaXMubnVtYmVyUmVzdWx0cyAhPSBcInVuZGVmaW5lZFwiICYmICFpc05hTih0aGlzLm51bWJlclJlc3VsdHMpICYmIHR5cGVvZiB0aGlzLm51bWJlclJlc3VsdHMgPT09ICdudW1iZXInICYmICh0aGlzLm51bWJlclJlc3VsdHMgJSAxID09PSAwKSApIHtcblx0XHRcdGlmICh0aGlzLm51bWJlclJlc3VsdHMgPCBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X01BWF9ST1dTKSB7XG5cdFx0XHRcdG1heFJvd3MgPSB0aGlzLm51bWJlclJlc3VsdHM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBtYXhSb3dzO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIHVybCB0byB0aGUgU29sUiBkYXRhYmFzZSB3aXRoIGFsbCBkeW5hbWljIHBhcmFtZXRlcnMgZ2VuZXJhdGVkIGZyb20gdGhlc2UgYXJndW1lbnRzLlxuXHQgKiBAcGFyYW0gZmllbGRUZXh0IHtzdHJpbmd9IFRleHQgdG8gc2VhcmNoLlxuXHQgKiBAcGFyYW0gZGVzY3JpcHRpb25UZXh0IHtzdHJpbmd9IEFzc29jaWF0ZWQgZGVzY3JpcHRpb24gb2YgdGhlIGNvbnRlbnQuXG5cdCAqIEBwYXJhbSBmaWx0ZXJzIHtBcnJheX0gQXJyYXkgb2YgZmlsdGVycyAtIE9ubHkgcmVzdWx0cyB3aXRoIG9uZSBvZiB0aGVzZSByZXNvdXJjZSB0eXBlcyB3aWxsIGJlIGdldC5cblx0ICogQHBhcmFtIHN0YXJ0IHtpbnRlZ2VyfSBQb3NpdGlvbiBvZiB0aGUgZmlyc3QgcmVzdWx0IHRvIHJldHJpZXZlLlxuXHQgKiBAcGFyYW0gcm93c051bWJlciB7aW50ZWdlcn0gSW5kaWNhdGVzIHRoZSBtYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRoYXQgd2lsbCBiZSBzaG93biBvbiB0aGUgc2NyZWVuO1xuXHQgKi9cblx0X2dldE5ld1VybCA6IGZ1bmN0aW9uKGZpZWxkVGV4dCwgZGVzY3JpcHRpb25UZXh0LCBmaWx0ZXJzLCBzdGFydCwgcm93c051bWJlcil7XG5cdFx0Ly9jb25zb2xlLmxvZygnX2dldE5ld1VybCwgZmllbGRUZXh0OiAnK2ZpZWxkVGV4dCsnLCBkZXNjcmlwdGlvblRleHQ6ICcrZGVzY3JpcHRpb25UZXh0KycsIGZpbHRlcnM6ICcrZmlsdGVycysnLCBzdGFydDogJytzdGFydCsnLCByb3dzTnVtYmVyOiAnK3Jvd3NOdW1iZXIpO1xuXHRcdHZhciBjb3VudCA9IDA7XG5cdFx0dmFyIHVybCA9IFwiXCI7XG5cdFx0XG5cdFx0dmFyIHdvcmRzID0gZmllbGRUZXh0LnNwbGl0KFwiIFwiKTtcblx0XHR2YXIgc2VhcmNoUGhyYXNlID0gXCJcIjtcblx0XHR3aGlsZSAoY291bnQgPCB3b3Jkcy5sZW5ndGgpIHtcblx0XHRcdHNlYXJjaFBocmFzZSArPSB3b3Jkc1tjb3VudF07XG5cdFx0XHRjb3VudCsrO1xuXHRcdFx0aWYoY291bnQgPCB3b3Jkcy5sZW5ndGgpe3NlYXJjaFBocmFzZSArPSAnKyd9XG5cdFx0fVxuXHRcdC8vIHdlIGV4Y2x1ZGUgYWxsIHJlc3VsdHMgZnJvbSB0aGlzIGRvbWFpbjogZGlzYWJsZWQgdW50aWwgcmVpbmRleGluZ1xuXHRcdC8qaWYgKCF0aGlzLmluY2x1ZGVTYW1lU2l0ZVJlc3VsdHMpIHtcblx0XHRcdHZhciBleGNsdWRpbmdQaHJhc2UgPSBcIlwiO1xuXHRcdFx0Ly9leGNsdWRpbmdQaHJhc2UgPSBcIiBOT1QoXCIrdGhpcy5jdXJyZW50RG9tYWluK1wiKVwiO1xuXHRcdFx0ZXhjbHVkaW5nUGhyYXNlID0gXCItXFxcIip0Z2FjLmFjLnVrKlxcXCJcIjtcblx0XHRcdHNlYXJjaFBocmFzZSA9IFwiKFwiK3NlYXJjaFBocmFzZStleGNsdWRpbmdQaHJhc2UrXCIpXCI7XG5cdFx0Ly8gd2UgZXhjbHVkZSBvbmx5IHRoZSBzYW1lIHJlY29yZCB0aGFuIHVzZXIgaXNcblx0XHR9ZWxzZXsqL1xuXHRcdC8qXHRcblx0XHRpZiAodGhpcy5jdXJyZW50VVJMICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMuY3VycmVudFVSTCAhPSBudWxsKSB7XG5cdFx0XHR2YXIgZXhjbHVkaW5nUGhyYXNlID0gXCJcIjtcblx0XHRcdC8vIFRoZXJlIGFyZSBzb21lIGNoYXJhY3RlcnMgdGhhdCBjYW4gYnJlYWsgdGhlIGZ1bGwgVVJMOyB3ZSByZW1vdmUgdGhlbS5cblx0XHRcdHZhciBjdXJhdGVkVVJMID0gdGhpcy5jdXJyZW50VVJMLnJlcGxhY2UoJyMnLCcnKTtcblx0XHRcdGV4Y2x1ZGluZ1BocmFzZSA9IFwiIE5PVChcXFwiXCIrY3VyYXRlZFVSTCtcIlxcXCIpXCI7XG5cdFx0XHRzZWFyY2hQaHJhc2UgPSBcIihcIitzZWFyY2hQaHJhc2UrXCIpIEFORCBcIitleGNsdWRpbmdQaHJhc2U7XG5cdFx0fSovXG5cdFx0c2VhcmNoUGhyYXNlID0gXCIoXCIrc2VhcmNoUGhyYXNlK1wiKVwiO1x0XG5cdFx0XG5cdFx0Ly99XHRcblx0XHRcblx0XHR1cmwgPSB0aGlzLmNvbnRleHREYXRhU2VydmVyK1wiL3NlbGVjdD9kZWZUeXBlPWVkaXNtYXgmcT1cIitzZWFyY2hQaHJhc2U7XG5cdFx0XG5cdFx0dmFyIGZxID0gbnVsbDtcblx0XHRpZiAoZmlsdGVycyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBmaWx0ZXJzIT1udWxsICkge1xuXHRcdFx0aWYgKGZpbHRlcnMgaW5zdGFuY2VvZiBBcnJheSAmJiBmaWx0ZXJzLmxlbmd0aD4wKSB7XG5cdFx0XHRcdGZxID0gXCJcIjtcblx0XHRcdFx0dmFyIGZpbHRlckNvdW50ID0gMDtcblx0XHRcdFx0dmFyIGZpbHRlckNoYWluID0gXCJcIjtcblx0XHRcdFx0d2hpbGUgKGZpbHRlckNvdW50IDwgZmlsdGVycy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmaWx0ZXJDaGFpbiArPSBcIidcIitmaWx0ZXJzW2ZpbHRlckNvdW50XStcIidcIjtcblx0XHRcdFx0XHRmaWx0ZXJDb3VudCsrO1xuXHRcdFx0XHRcdGlmKGZpbHRlckNvdW50IDwgZmlsdGVycy5sZW5ndGgpe2ZpbHRlckNoYWluICs9ICcgT1IgJ31cblx0XHRcdFx0fVxuXHRcdFx0XHRmcT1cInJlc291cmNlX3R5cGU6KFwiK2ZpbHRlckNoYWluK1wiKVwiO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGZxID0gXCJyZXNvdXJjZV90eXBlOnVuZGVmaW5lZFwiO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRVUkwgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpcy5jdXJyZW50VVJMICE9IG51bGwpIHtcblx0XHRcdGlmIChmcT09bnVsbCkge1xuXHRcdFx0XHRmcSA9IFwiKjoqXCI7XG5cdFx0XHR9XG5cdFx0XHQvLyBUaGVyZSBhcmUgc29tZSBjaGFyYWN0ZXJzIHRoYXQgY2FuIGJyZWFrIHRoZSBmdWxsIFVSTDsgd2UgcmVtb3ZlIHRoZW0uXG5cdFx0XHR2YXIgY3VyYXRlZFVSTCA9IHRoaXMuY3VycmVudFVSTC5yZXBsYWNlKCcjJywnJyk7XG5cdFx0XHR2YXIgbGlua0ZpZWxkID0gbmV3IENvbW1vbkRhdGEobnVsbCkuTElOS19GSUVMRDtcblx0XHRcdGZxID0gZnErXCIgQU5EIC1cIitsaW5rRmllbGQrXCI6XFxcIlwiK2N1cmF0ZWRVUkwrXCJcXFwiXCI7XHRcblx0XHR9XG5cdCAgICAgICAgXG5cdFx0Ly8gSWYgd2UgaGF2ZSBkZXNjcmlwdGlvbiwgd2UgY2FuIHRyeSB0byBmaWx0ZXIgdW5kZXNpcmVkIHJlc3VsdHMgKGkuZS4sIHJlc3VsdHMgdGhhdCBhcmUgdGhlIHNhbWUgdGhhbiB1c2VyJ3MgY3VycmVudCBwYWdlKVxuXHRcdGlmIChkZXNjcmlwdGlvblRleHQgIT0gbnVsbCkge1xuXHRcdFx0aWYgKGZxPT1udWxsKSB7XG5cdFx0XHRcdGZxID0gXCIqOipcIjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dmFyIGRlc2NVc2VkID0gZGVzY3JpcHRpb25UZXh0O1xuXHRcdFx0aWYgKGRlc2NVc2VkLmxlbmd0aD5jb25zdGFudHMuQ29udGV4dERhdGFMaXN0X05VTV9XT1JEU19GSUxURVJJTkdfREVTQ1JJUFRJT04pIHtcblx0XHRcdFx0ZGVzY1VzZWQgPSBkZXNjVXNlZC5zcGxpdChcIiBcIikuc2xpY2UoMCxjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X05VTV9XT1JEU19GSUxURVJJTkdfREVTQ1JJUFRJT04pLmpvaW4oXCIgXCIpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gd2UgcmVtb3ZlIHdlaXJkIGNoYXJhY3RlcnMgYW5kIFwiXG5cdFx0XHRkZXNjVXNlZCA9IGRlc2NVc2VkLnJlcGxhY2UoL1xcXCIvZywnJyk7XG5cdFx0XHRkZXNjVXNlZCA9IGVuY29kZVVSSUNvbXBvbmVudChkZXNjVXNlZCk7XG5cdFx0XHRcblx0XHRcdHZhciBkZXNjcmlwdGlvbkZpZWxkID0gbmV3IENvbW1vbkRhdGEobnVsbCkuREVTQ1JJUFRJT05fRklFTEQ7XG5cdFx0XHRmcSA9IGZxK1wiIEFORCAtXCIrZGVzY3JpcHRpb25GaWVsZCtcIjpcXFwiXCIrZGVzY1VzZWQrXCJcXFwiXCI7XG5cdFx0XHRcblx0XHRcdHZhciB0aXRsZUZpZWxkID0gbmV3IENvbW1vbkRhdGEobnVsbCkuVElUTEVfRklFTEQ7XG5cdFx0XHRmcSA9IGZxK1wiIEFORCAtXCIrdGl0bGVGaWVsZCtcIjpcXFwiXCIrZmllbGRUZXh0K1wiXFxcIlwiO1xuXHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmIChmcSE9bnVsbCkge1xuXHRcdFx0dXJsID0gdXJsK1wiJmZxPVwiK2ZxO1xuXHRcdH1cblx0XHRcblx0XHQvLyBxZlxuXHRcdHVybCA9IHVybCtcIiZxZj10aXRsZV4yLjArZmllbGReMi4wK2Rlc2NyaXB0aW9uXjEuMFwiO1xuXHRcdFxuXHRcdC8vIHN0YXJ0IHJvd1xuXHRcdGlmIChzdGFydCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzdGFydCE9bnVsbCAmJiAhaXNOYU4oc3RhcnQpICYmIHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicgJiYgKHN0YXJ0ICUgMSA9PT0gMCkgKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCImc3RhcnQ9XCIrc3RhcnQ7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IHN0YXJ0O1xuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhcnRSZXN1bHQgPSAwO1xuXHRcdH1cblx0XHRcblx0XHQvLyBudW0gcm93c1xuXHRcdGlmIChyb3dzTnVtYmVyICE9PSBcInVuZGVmaW5lZFwiICYmIHJvd3NOdW1iZXIhPW51bGwgJiYgcm93c051bWJlciE9bnVsbCAmJiAhaXNOYU4ocm93c051bWJlcikgJiYgdHlwZW9mIHJvd3NOdW1iZXIgPT09ICdudW1iZXInICYmIChyb3dzTnVtYmVyICUgMSA9PT0gMCkgKSB7XG5cdFx0XHR1cmwgPSB1cmwrXCImcm93cz1cIityb3dzTnVtYmVyO1xuXHRcdH1cblx0XHRcdFxuXHRcdFx0XG5cdFx0Ly8gU3RhdHMuIFdlIGNvdW50IGFsbCB0aGUgZGlmZmVyZW50IHJlc3VsdHMgYnkgcmVzb3VyY2UgdHlwZVxuXHRcdHVybCA9IHVybCtcIiZmYWNldD10cnVlJmZhY2V0Lm1ldGhvZD1lbnVtJmZhY2V0LmxpbWl0PS0xJmZhY2V0LmZpZWxkPXJlc291cmNlX3R5cGVcIlxuXHRcdFxuXHRcdFx0XHRcblx0XHQvLyB3dFxuXHRcdHVybCA9IHVybCtcIiZ3dD1qc29uXCI7XG5cdFx0XG5cdFx0Ly8gbWF5YmUgd2UgY291bGQgYWxzbyBmaWx0ZXIgZmllbGRzIHRoYXQgd2UgcmV0dXJuXG5cdFx0Ly8gJmZsPXN0YXJ0LHRpdGxlLG5vdGVzLGxpbmtcblx0XHRcblx0XHRcblx0XHRyZXR1cm4gdXJsO1xuXHR9LFxuXHRcblx0XG5cdFxuXHQvKipcblx0ICogTWFrZXMgYW4gYXN5bmNocm9ub3VzIHJlcXVlc3QgdG8gdGhlIENvbnRleHR1YWxpc2F0aW9uIGRhdGEgc2VydmVyIGFuZCBwcm9jZXNzIGl0cyByZXBseS5cblx0ICogQHBhcmFtIHVybCB7c3RyaW5nfSAtIFVuaWZvcm0gUmVzb3VyY2UgTG9jYXRvclxuXHQgKi9cblx0cHJvY2Vzc0RhdGFGcm9tVXJsOiBmdW5jdGlvbih1cmwpe1xuXHRcdHZhciBteUNvbnRleHREYXRhTGlzdCA9IHRoaXM7XG5cdFx0cmVxd2VzdCh7XG5cdFx0XHR1cmw6IHVybCAsXG5cdFx0XHR0eXBlOiAnanNvbicgLFxuXHRcdFx0bWV0aG9kOiAncG9zdCcgLFxuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyAsXG5cdFx0XHRjcm9zc09yaWdpbjogdHJ1ZSxcblx0XHRcdHRpbWVvdXQ6IDEwMDAgKiA1LFxuXHRcdFx0d2l0aENyZWRlbnRpYWxzOiB0cnVlLCAgLy8gV2Ugd2lsbCBoYXZlIHRvIGluY2x1ZGUgbW9yZSBzZWN1cml0eSBpbiBvdXIgU29sciBzZXJ2ZXJcblx0XHRcdFxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0bXlDb250ZXh0RGF0YUxpc3QucHJvY2Vzc0Vycm9yKGVycik7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LnVwZGF0ZUdsb2JhbFN0YXR1cyhjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKTtcblx0XHRcdH0gLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24gKHJlc3ApIHtcblx0XHRcdFx0dmFyIGNvbnRleHR1YWxpc2VkRGF0YSA9IG15Q29udGV4dERhdGFMaXN0LnByb2Nlc3NDb250ZXh0dWFsaXNlZERhdGEocmVzcCk7XG5cdFx0XHRcdG15Q29udGV4dERhdGFMaXN0LmRyYXdDb250ZXh0dWFsaXNlZERhdGEoY29udGV4dHVhbGlzZWREYXRhKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgc29tZSBlcnJvcnMgYW5kIHByb2Nlc3MgZWFjaCByZXN1bHQgdG8gYmUgZ2V0IGluIGEgcHJvcGVyIHdheS5cblx0ICogQHBhcmFtIGRhdGEge09iamVjdH0gLSBUaGUgZnVsbCBkYXRhIGxpc3QgdG8gYmUgcHJvY2Vzc2VkIGFuZCBzaG93blxuXHQgKiB7QXJyYXl9IC0gQXJyYXkgd2l0aCBvYmplY3RzIGNvbnZlcnRlZCBmcm9tIHRoZWlyIG9yaWdpbmFsIEpTT04gc3RhdHVzXG5cdCAqL1xuXHRwcm9jZXNzQ29udGV4dHVhbGlzZWREYXRhIDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHZhciBteUNvbnRleHREYXRhTGlzdCA9IHRoaXM7XG5cdFx0dmFyIGNvbnRleHR1YWxpc2VkRGF0YSA9IFtdO1xuXHRcdGlmKGRhdGEucmVzcG9uc2UgIT0gdW5kZWZpbmVkKXtcblx0XHRcdGlmKGRhdGEucmVzcG9uc2UuZG9jcyAhPSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gZGF0YS5yZXNwb25zZS5udW1Gb3VuZDtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlID0gdGhpcy5nZXROdW1SZXN1bHRzQnlSZXNvdXJjZVR5cGUoZGF0YSk7XG5cdFx0XHRcdGlmICh0aGlzLm51bUluaXRpYWxSZXN1bHRzQnlSZXNvdXJjZVR5cGUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHRoaXMubnVtSW5pdGlhbFJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHRoaXMubnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRkYXRhLnJlc3BvbnNlLmRvY3MuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuXHRcdFx0XHRcdHZhciB0eXBlZERhdGEgPSBteUNvbnRleHREYXRhTGlzdC5kYXRhTWFuYWdlci5nZXREYXRhRW50aXR5KGVudHJ5KTtcblx0XHRcdFx0XHRjb250ZXh0dWFsaXNlZERhdGEucHVzaCh0eXBlZERhdGEpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzRXJyb3IoXCJkYXRhLnJlc3BvbnNlLmRvY3MgdW5kZWZpbmVkXCIpO1xuXHRcdFx0XHRteUNvbnRleHREYXRhTGlzdC5jaGFuZ2VDdXJyZW50U3RhdHVzKGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1IpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRteUNvbnRleHREYXRhTGlzdC5wcm9jZXNzRXJyb3IoXCJkYXRhLnJlc3BvbnNlIHVuZGVmaW5lZFwiKTtcblx0XHRcdG15Q29udGV4dERhdGFMaXN0LmNoYW5nZUN1cnJlbnRTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUik7XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIGNvbnRleHR1YWxpc2VkRGF0YTtcblx0fSxcblx0Lypcblx0ZmlsdGVyU2FtZURhdGFSZXN1bHRzIDogZnVuY3Rpb24oZGF0YSwgbWFpblRleHQsIGNvbnRlbnREZXNjcmlwdGlvbil7XG5cdFx0dmFyIGZpbHRlcmVkX2RhdGEgPSBkYXRhO1xuXHRcdFxuXHRcdGRhdGEucmVzcG9uc2UuZG9jcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG5cdFx0XHR2YXIgdHlwZWREYXRhID0gbXlDb250ZXh0RGF0YUxpc3QuZGF0YU1hbmFnZXIuZ2V0RGF0YUVudGl0eShlbnRyeSk7XG5cdFx0XHRjb250ZXh0dWFsaXNlZERhdGEucHVzaCh0eXBlZERhdGEpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdENvbW1vbkRhdGEuVElUTEVfRklFTERcblx0XHRDb21tb25EYXRhLkRFU0NSSVBUSU9OX0ZJRUxEXG5cdFx0XG5cdFx0cmV0dXJuIGZpbHRlcmVkX2RhdGE7XG5cdH0sKi9cblx0XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF0YSBvZiBlYWNoIHJlc291cmNlIHR5cGUuXG5cdCAqIEBwYXJhbSAgZGF0YSB7T2JqZWN0fSAtIFRoZSBmdWxsIGRhdGEgbGlzdCB0byBiZSBwcm9jZXNzZWRcblx0ICogZGF0YSB7T2JqZWN0fSAtIE9iamVjdCB3aXRoIG9uZSBwcm9wZXJ0eSBieSBlYWNoIHJlc291cmNlIHR5cGUgYW5kIHZhbHVlIG9mIGl0cyBvY3VycmVuY2VzLlxuXHQgKi9cblx0Z2V0TnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlIDogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHZhciBmYWNldF9jb3VudHMgPSBkYXRhLmZhY2V0X2NvdW50cztcblx0XHR2YXIgcmVzb3VyY2VfdHlwZXNfY291bnQgPSBudWxsO1xuXHRcdGlmIChmYWNldF9jb3VudHMgIT0gdW5kZWZpbmVkIHx8IGZhY2V0X2NvdW50cyAhPSBudWxsICkge1xuXHRcdFx0dmFyIGZhY2V0X2ZpZWxkcyA9IGZhY2V0X2NvdW50cy5mYWNldF9maWVsZHM7XG5cdFx0XHRpZiAoZmFjZXRfZmllbGRzICE9IHVuZGVmaW5lZCB8fCBmYWNldF9maWVsZHMgIT0gbnVsbCApIHtcblx0XHRcdFx0cmVzb3VyY2VfdHlwZXNfY291bnQgPSBmYWNldF9maWVsZHMucmVzb3VyY2VfdHlwZTtcdFxuXHRcdFx0fVx0XG5cdFx0fVxuXHRcdGlmIChyZXNvdXJjZV90eXBlc19jb3VudCA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0XG5cdFx0dmFyIG51bVJlc3VsdHNCeVJlc291cmNlVHlwZSA9IHt9O1xuXHRcdGlmICh0aGlzLnRvdGFsRmlsdGVycyAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY3VycmVudEZpbHRlciA9IG51bGw7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLnRvdGFsRmlsdGVycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdGN1cnJlbnRGaWx0ZXIgPSB0aGlzLnRvdGFsRmlsdGVyc1tpXTtcblx0XHRcdFx0dmFyIGN1cnJlbnRfY291bnQgPSBudWxsO1xuXHRcdFx0XHRmb3IgKHZhciBqPTA7ajxyZXNvdXJjZV90eXBlc19jb3VudC5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdFx0Y3VycmVudF9jb3VudCA9IHJlc291cmNlX3R5cGVzX2NvdW50W2pdO1xuXHRcdFx0XHRcdGlmICggKHR5cGVvZiBjdXJyZW50X2NvdW50ID09PSAnc3RyaW5nJyB8fCBjdXJyZW50X2NvdW50IGluc3RhbmNlb2YgU3RyaW5nKVxuXHRcdFx0XHRcdCAgICAmJiBjdXJyZW50RmlsdGVyLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihjdXJyZW50X2NvdW50KSA+IC0xICkge1xuXHRcdFx0XHRcdFx0bnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlW2N1cnJlbnRGaWx0ZXJdID0gcmVzb3VyY2VfdHlwZXNfY291bnRbaisxXTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVtUmVzdWx0c0J5UmVzb3VyY2VUeXBlO1xuXHR9LFxuXHRcbiAgICAgICAgIFxuXHQvKipcblx0ICogRHJhdyBhIGVudGlyZSBsaXN0IG9mIGNvbnRleHR1YWxpc2VkIHJlc291cmNlc1xuXHQgKiBAcGFyYW0gY29udGV4dHVhbGlzZWREYXRhIHtvYmplY3QgT2JqZWN0fSAtIEFsbCB0aGUgZGF0YSB0byBiZSBkcmF3biBpbnRvIHRoZSB3aWRnZXQuXG5cdCAqL1xuXHRkcmF3Q29udGV4dHVhbGlzZWREYXRhIDogZnVuY3Rpb24oY29udGV4dHVhbGlzZWREYXRhKXtcblx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRJZCk7XG5cdFx0aWYgKHRhcmdldCA9PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09IG51bGwpe1xuXHRcdFx0cmV0dXJuO1x0XG5cdFx0fVxuXHRcdHdoaWxlICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuXHRcdFx0dGFyZ2V0LnJlbW92ZUNoaWxkKHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0XG5cdFx0dmFyIGluZGV4ID0gMDtcblx0XHR2YXIgZGF0YU9iamVjdDtcblx0XHR2YXIgZHJhd2FibGVPYmplY3Q7XG5cdFx0dmFyIG9kZFJvdyA9IHRydWU7XG5cdFx0d2hpbGUoaW5kZXggPCBjb250ZXh0dWFsaXNlZERhdGEubGVuZ3RoKXtcblx0XHRcdGlmIChpbmRleCUyPT0wKSB7XG5cdFx0XHRcdG9kZFJvdyA9IGZhbHNlO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG9kZFJvdyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRkYXRhT2JqZWN0ID0gY29udGV4dHVhbGlzZWREYXRhW2luZGV4XTtcblx0XHRcdGRyYXdhYmxlT2JqZWN0ID0gZGF0YU9iamVjdC5nZXREcmF3YWJsZU9iamVjdEJ5U3R5bGUodGhpcy5kaXNwbGF5U3R5bGUpO1xuXHRcdFx0ZHJhd2FibGVPYmplY3QuY2xhc3NMaXN0LmFkZCgndmlld3Mtcm93Jyk7XG5cdFx0XHRpZihvZGRSb3cgPT0gdHJ1ZSl7XG5cdFx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoXCJ2aWV3cy1yb3ctb2RkXCIpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGRyYXdhYmxlT2JqZWN0LmNsYXNzTGlzdC5hZGQoXCJ2aWV3cy1yb3ctZXZlblwiKTtcblx0XHRcdH1cblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChkcmF3YWJsZU9iamVjdCk7XG5cdFx0XHRpbmRleCsrO1xuXHRcdH1cblx0XHRpZiAoY29udGV4dHVhbGlzZWREYXRhLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5nZXRFbXB0eVJlY29yZCgpKTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyA9IGNvbnRleHR1YWxpc2VkRGF0YS5sZW5ndGg7XG5cdFx0dGhpcy51cGRhdGVHbG9iYWxTdGF0dXMoY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQpO1xuXHRcdC8qXG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnRUb3RhbFJlc3VsdHMnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRUb3RhbFJlc3VsdHMpO1xuXHRcdGNvbnNvbGUubG9nKCdjdXJyZW50U3RhcnRSZXN1bHQnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCk7XG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50TnVtYmVyTG9hZGVkUmVzdWx0cyk7XG5cdFx0Y29uc29sZS5sb2coJ2N1cnJlbnRGaWx0ZXJzJyk7XG5cdFx0Y29uc29sZS5sb2codGhpcy5jdXJyZW50RmlsdGVycyk7XG5cdFx0Ki9cblx0XHRcblx0fSxcblx0XG5cdC8qKlxuXHQgKiBcdFJldHVybnMgb25lIHJvdyBleHBsYWluaW5nIHRoZSBhYnNlbmNlIG9mIHJlYWwgcmVzdWx0cy5cblx0ICogXHR7SFRNTCBPYmplY3R9IC0gRW1wdHkgcmVzdWx0LlxuXHQgKi9cblx0Z2V0RW1wdHlSZWNvcmQgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lclwiKTtcblx0XHR2YXIgdHJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG5cdFx0XG5cdFx0dmFyIHNwYW5UZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdHZhciB0ZXh0ID0gJ0Nhbm5vdCBiZSBmb3VuZCBhbnkgcmVsYXRlZCByZXN1bHQnO1xuXHRcdHNwYW5UZXh0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0dHJDb250YWluZXIuYXBwZW5kQ2hpbGQoc3BhblRleHQpO1xuXHRcdG1haW5Db250YWluZXIuYXBwZW5kQ2hpbGQodHJDb250YWluZXIpO1xuXHRcdHJldHVybiBtYWluQ29udGFpbmVyO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIFVwZGF0ZXMsIGRlcGVuZGluZyBvbiB0aGUgbmV3IHN0YXR1cywgaW50ZXJuYWwgdmFyaWFibGVzIG9mIHRoZSBjb21wb25lbnQgYW5kLCBpZlxuXHQgKiBuZXcgc3RhdHVzIGlzICdMT0FERUQnLCBleGVjdXRlcyB0aGUgJ29uTG9hZGVkJyBmdW5jdGlvbnMgcmVnaXN0ZXJlZC4gXG5cdCAqIEBwYXJhbSBuZXdTdGF0dXMge3N0cmluZ30gLSBDb250ZXh0RGF0YUxpc3QuTE9BRElORyBvciBDb250ZXh0RGF0YUxpc3QuRVJST1Igb3IgQ29udGV4dERhdGFMaXN0LkxPQURFRCBcblx0ICovXG5cdHVwZGF0ZUdsb2JhbFN0YXR1cyA6IGZ1bmN0aW9uKG5ld1N0YXR1cyl7XG5cdFx0Ly8gbmV3IHN0YXR1cyBtdXN0IGJlIG9uZSBvZiB0aGUgcG9zaWJsZSBzdGF0dXNcblx0XHRpZiAobmV3U3RhdHVzICE9IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfTE9BRElORyAmJlxuXHRcdCAgICBuZXdTdGF0dXMgIT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUiAmJlxuXHRcdCAgICBuZXdTdGF0dXMgIT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQgKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5jdXJyZW50U3RhdHVzID0gbmV3U3RhdHVzO1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FESU5HKXtcblx0XHRcdHRoaXMuY3VycmVudFRvdGFsUmVzdWx0cyA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnRTdGFydFJlc3VsdCA9IG51bGw7XG5cdFx0XHR0aGlzLmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzID0gbnVsbDtcblx0XHR9ZWxzZSBpZiAodGhpcy5jdXJyZW50U3RhdHVzID09IGNvbnN0YW50cy5Db250ZXh0RGF0YUxpc3RfRVJST1Ipe1xuXHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBudWxsO1xuXHRcdFx0Ly8gaWYgbmV3IHN0YXR1cyBpcyBMT0FERUQsIGhlcmUgd2UgY2Fubm90IGtub3cgYW55dGhpbmcgYWJvdXQgYWxsIHRoZXNlIGludGVybmFsIHZhcmlhYmxlcy5cblx0XHR9LyplbHNlIGlmICh0aGlzLmN1cnJlbnRTdGF0dXMgPT0gdGhpcy5MT0FERUQpe1xuXHRcdFx0dGhpcy5jdXJyZW50VG90YWxSZXN1bHRzID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudFN0YXJ0UmVzdWx0ID0gbnVsbDtcblx0XHRcdHRoaXMuY3VycmVudE51bWJlckxvYWRlZFJlc3VsdHMgPSBudWxsO1xuXHRcdH0qL1xuXHRcdFxuXHRcdC8vIEZpbmFsbHkgd2UgZXhlY3V0ZSByZWdpc3RlcmVkICdvbkxvYWRlZCcgZnVuY3Rpb25zXG5cdFx0aWYgKHRoaXMuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURFRCB8fFxuXHRcdCAgICB0aGlzLmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9FUlJPUiApe1xuXHRcdFx0dGhpcy5leGVjdXRlT25Mb2FkZWRGdW5jdGlvbnMoKTtcblx0XHR9XG5cdH0sXG5cdFxuXHQvKipcblx0KiAgICAgICAgICBSZXR1cm5zIG9uZSBzdGFuZGFyZCB3YXkgb2YgcmVwcmVzZW50aW5nICd0aXRsZScgZGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG5cdCogICAgICAgICAge0hUTUwgT2JqZWN0fSAtIEFOQ0hPUiBlbGVtZW50IHdpdGggJ3RpdGxlJyBpbmZvcm1hdGlvbiBsaW5raW5nIHRvIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG5cdCovXG5cdC8qZHJhd0hlbHBJbWFnZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgaGVscENvbnRhaW5lciA9IG51bGw7XG5cdFx0aWYgKHRoaXMudXNlckhlbHBDbGFzc0NvbnRhaW5lciAhPSB1bmRlZmluZWQgJiYgdGhpcy51c2VySGVscENsYXNzQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdHZhciBoZWxwQ29udGFpbmVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy51c2VySGVscENsYXNzQ29udGFpbmVyKTtcblx0XHRcdGlmIChoZWxwQ29udGFpbmVycyAhPSBudWxsICYmIGhlbHBDb250YWluZXJzLmxlbmd0aD4wKSBoZWxwQ29udGFpbmVyID0gaGVscENvbnRhaW5lcnNbMF07XG5cdFx0fWVsc2UgaWYgKHRoaXMudXNlckhlbHBUYWdDb250YWluZXIgIT0gdW5kZWZpbmVkICYmIHRoaXMudXNlckhlbHBUYWdDb250YWluZXIgIT0gbnVsbCl7XG5cdFx0XHR2YXIgaGVscENvbnRhaW5lcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0aGlzLnVzZXJIZWxwVGFnQ29udGFpbmVyKTtcblx0XHRcdGlmIChoZWxwQ29udGFpbmVycyAhPSBudWxsICYmIGhlbHBDb250YWluZXJzLmxlbmd0aD4wKSBoZWxwQ29udGFpbmVyID0gaGVscENvbnRhaW5lcnNbMF07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKGhlbHBDb250YWluZXIpO1xuXHRcdGlmIChoZWxwQ29udGFpbmVyICE9IG51bGwpIHtcblx0XHRcdHZhciBoZWxwSW1hZ2UgPSB0aGlzLmdldEhlbHBJbWFnZSgpO1xuXHRcdFx0aWYgKGhlbHBJbWFnZSAhPSBudWxsKSB7XG5cdFx0XHRcdGhlbHBDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInRvb2x0aXBcIik7XG5cdFx0XHRcdGhlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5nZXRIZWxwSW1hZ2UoKSk7XG5cdFx0XHRcdC8vaGVscENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmdldEhlbHBUZXh0KCkpO1xuXHRcdFx0XHQvL2hlbHBDb250YWluZXIuYXBwZW5kQ2hpbGQoaGVscEltYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sKi9cblx0XG5cdC8qKlxuXHQqICAgICAgICAgIFJldHVybnMgb25lIHN0YW5kYXJkIHdheSBvZiByZXByZXNlbnRpbmcgJ3RpdGxlJyBkYXRhIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cblx0KiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gQU5DSE9SIGVsZW1lbnQgd2l0aCAndGl0bGUnIGluZm9ybWF0aW9uIGxpbmtpbmcgdG8gdGhlIG9yaWdpbmFsIHNvdXJjZS5cblx0Ki9cbiAgICAgICAgLypnZXRIZWxwSW1hZ2U6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblx0XHRpbWdFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2hlbHBfaW1nXCIpO1xuXG5cdFx0cmV0dXJuIGltZ0VsZW1lbnQ7XG4gICAgICAgIH0sKi9cblx0XG5cdFxuXHRcblx0LyoqXG5cdCAqIFJlZ2lzdGVyIG5ldyBmdW5jdGlvbnMgdG8gYmUgZXhlY3V0ZWQgd2hlbiBzdGF0dXMgY29tcG9uZW50IGlzIHVwZGF0ZWQgdG8gJ0xPQURFRCdcblx0ICogbXlDb250ZXh0IHtPYmplY3R9IG15Q29udGV4dCAtIENvbnRleHQgaW4gd2hpY2ggbXlGdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZS4gVXN1YWxseSBpdHMgb3duIG9iamVjdCBjb250YWluZXIuXG5cdCAqIG15Q29udGV4dCB7T2JqZWN0fSBteUZ1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG5cdCAqL1xuXHRyZWdpc3Rlck9uTG9hZGVkRnVuY3Rpb24gOiBmdW5jdGlvbihteUNvbnRleHQsIG15RnVuY3Rpb24pe1xuXHRcdHZhciBvbkxvYWRlZE9iamVjdCA9IHtcblx0XHRcdCdteUNvbnRleHQnXHQ6IG15Q29udGV4dCxcblx0XHRcdCdteUZ1bmN0aW9uJ1x0OiBteUZ1bmN0aW9uXG5cdFx0fTtcblx0XHR0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucy5wdXNoKG9uTG9hZGVkT2JqZWN0KTtcblx0fSxcblx0XG5cdFxuXHQvKipcblx0ICogRXhlY3V0ZSBhbGwgcmVnaXN0ZXJlZCAnb25Mb2FkZWQnIGZ1bmN0aW9uc1xuXHQgKi9cblx0ZXhlY3V0ZU9uTG9hZGVkRnVuY3Rpb25zIDogZnVuY3Rpb24oKXtcblx0XHR2YXIgb25Mb2FkZWRGdW5jdGlvbk9iamVjdCA9IG51bGw7XG5cdFx0dmFyIG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0ID0gbnVsbDtcblx0XHR2YXIgb25Mb2FkZWRGdW5jdGlvbiA9IG51bGw7XG5cdFx0Zm9yKHZhciBpPTA7aTx0aGlzLl9vbkxvYWRlZEZ1bmN0aW9ucy5sZW5ndGg7aSsrKXtcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb25PYmplY3QgPSB0aGlzLl9vbkxvYWRlZEZ1bmN0aW9uc1tpXTtcblx0XHRcdG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0ID0gb25Mb2FkZWRGdW5jdGlvbk9iamVjdC5teUNvbnRleHQ7XG5cdFx0XHRvbkxvYWRlZEZ1bmN0aW9uID0gb25Mb2FkZWRGdW5jdGlvbk9iamVjdC5teUZ1bmN0aW9uO1xuXHRcdFx0Ly8gd2UgZXhlY3V0ZSB0aGUgb25Mb2FkZWRGdW5jdGlvbiB3aXRoIGl0cyBvd24gY29udGV4dFxuXHRcdFx0b25Mb2FkZWRGdW5jdGlvbi5jYWxsKG9uTG9hZGVkRnVuY3Rpb25Db250ZXh0KTtcblx0XHR9XG5cdH0sXG5cdFx0XG4gICAgICBcblx0LyoqXG5cdCAqIFByaW50cyBhcyBhbiBlcnJvciB0byB0aGUgY29uc29sZSB0aGUgbWVzc2FnZSByZWNlaXZlZC4gXG5cdCAqIGVycm9yIHtzdHJpbmd9IGVycm9yIC0gU3RyaW5nIHRvIGJlIHByaW50ZWRcblx0ICovXG5cdHByb2Nlc3NFcnJvciA6IGZ1bmN0aW9uKGVycm9yKSB7XG5cdCAgICBjb25zb2xlLmxvZyhcIkVSUk9SOlwiICsgZXJyb3IpO1xuXHR9XG5cbn1cblxuXG4vLyBTVEFUSUMgQVRUUklCVVRFU1xuLypcbnZhciBDT05TVFMgPSB7XG5cdC8vTGlzdCBvZiBwb3NzaWJsZSBjb250ZXh0IGRhdGEgc291cmNlcyBcblx0U09VUkNFX0VMSVhJUl9SRUdJU1RSWTpcIkVTUlwiLFxuXHRTT1VSQ0VfRUxJWElSX1RFU1M6XCJUU1NcIixcblx0U09VUkNFX0VMSVhJUl9FVkVOVFM6XCJFRVZcIixcblx0Ly9zdHlsZSBvZiB2aXN1YWxpemF0aW9uXG5cdEZVTExfU1RZTEU6XCJGVUxMX1NUWUxFXCIsXG5cdENPTU1PTl9TVFlMRTpcIkNPTU1PTl9TVFlMRVwiLFxuXHQvL21heCBudW1iZXIgb2Ygcm93cyB0byByZXRyaWV2ZSBmcm9tIHRoZSBzZXJ2ZXIsIHdoYXRldmVyICdudW1iZXJSZXN1bHRzJyBjYW4gYmVcblx0TUFYX1JPV1M6MTAwLFxuXHQvL21heGltdW0gbGVuZ3RoIHRvIGJlIHVzZWQgZnJvbSB0aGUgZGVzY3JpcHRpb24gdG8gZmlsdGVyIHNhbWUgcmVzdWx0c1xuXHROVU1fV09SRFNfRklMVEVSSU5HX0RFU0NSSVBUSU9OOjUwLFxuXHQvL0V2ZW50cyBcblx0RVZUX09OX1JFU1VMVFNfTE9BREVEOiBcIm9uUmVzdWx0c0xvYWRlZFwiLFxuXHRFVlRfT05fUkVRVUVTVF9FUlJPUjogXCJvblJlcXVlc3RFcnJvclwiLFxuXHQvL0RpZmZlcmVudCB3aWRnZXQgc3RhdHVzXG5cdExPQURJTkc6IFwiTE9BRElOR1wiLFxuXHRMT0FERUQ6IFwiTE9BREVEXCIsXG5cdEVSUk9SOiBcIkVSUk9SXCJcbn07XG5cbmZvcih2YXIga2V5IGluIENPTlNUUyl7XG4gICAgIENvbnRleHREYXRhTGlzdFtrZXldID0gQ09OU1RTW2tleV07XG59Ki9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHREYXRhTGlzdDtcbiIsIlxudmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xudmFyIEVsaXhpclRyYWluaW5nRGF0YSA9IHJlcXVpcmUoXCIuL0VsaXhpclRyYWluaW5nRGF0YS5qc1wiKTtcbnZhciBFbGl4aXJFdmVudERhdGEgPSByZXF1aXJlKFwiLi9FbGl4aXJFdmVudERhdGEuanNcIik7XG52YXIgRWxpeGlyUmVnaXN0cnlEYXRhID0gcmVxdWlyZShcIi4vRWxpeGlyUmVnaXN0cnlEYXRhLmpzXCIpO1xuXG4vKiogXG4gKiBEYXRhIG1hbmFnbWVudCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnMgQW4gb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgZm9yIERhdGFNYW5hZ2VyIGNvbXBvbmVudC4gRm9yIGZ1dHVyZSBpbXByb3ZlbWVudHMuXG4gKi9cbnZhciBEYXRhTWFuYWdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiBcbiAgICB2YXIgZGVmYXVsdF9vcHRpb25zX3ZhbHVlcyA9IHsgICAgICBcbiAgICB9O1xuICAgIGZvcih2YXIga2V5IGluIGRlZmF1bHRfb3B0aW9uc192YWx1ZXMpe1xuICAgICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG4gICAgfVxuICAgIGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICAgIFxufVxuXG4vKiogXG4gKiBEYXRhIG1hbmFnbWVudCBmdW5jdGlvbmFsaXR5LlxuICogQnVpbGRzIG9uZSBraW5kIG9mIENvbW1vbkRhdGEgZGVwZW5kaW5nIG9uIGl0cyAnc291cmNlJyB2YWx1ZS5cbiAqIFxuICogQGNsYXNzIERhdGFNYW5hZ2VyXG4gKlxuICovXG5EYXRhTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IERhdGFNYW5hZ2VyLFxuICAgIHNvdXJjZUZpZWxkOiAnc291cmNlJyxcbiAgICBcbiAgICAvKipcbiAgICAqICAgUmV0dXJucyBzb3VyY2UgZmllbGQgdmFsdWUgb2YgdGhlIEpTT04gc3RydWN0dXJlIHBhc3NlZCBhcyBhcmd1bWVudC5cbiAgICAqICAgQHBhcmFtIGpzb25FbnRyeSB7T2JqZWN0fSAtIEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCBvbmUgZW50aXR5J3MgZGF0YS5cbiAgICAqICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBzb3VyY2UgdmFsdWUgb2YgdGhlIEpTT04gc3RydWN0dXJlLlxuICAgICovXG4gICAgZ2V0U291cmNlRmllbGQgOiBmdW5jdGlvbihqc29uRW50cnkpe1xuICAgICAgICBpZiAoanNvbkVudHJ5ICE9PSBudWxsICYmIGpzb25FbnRyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4ganNvbkVudHJ5W3RoaXMuc291cmNlRmllbGRdO1xuICAgICAgICB9ZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgICAgICBcbiAgICAvKipcbiAgICAqICAgUmV0dXJucyBvbmUgQ29tbW9uRGF0YSBvYmplY3QgcmVwcmVzZW50aW5nIG9uZSBkYXRhIHJlZ2lzdHJ5LlxuICAgICogICBAcGFyYW0ganNvbkVudHJ5IHtPYmplY3R9IC0gSlNPTiBkYXRhIHN0cnVjdHVyZSB3aXRoIG9uZSBlbnRpdHkncyBkYXRhLlxuICAgICogICB7Q29tbW9uRGF0YSBPYmplY3R9IC0gQ29tbW9uRGF0YSBjaGlsZCB0aGF0IHJlcHJlc2VudHMgb2JqZXRpZmllZCBqc29uIGRhdGEuXG4gICAgKi9cbiAgICBnZXREYXRhRW50aXR5IDogZnVuY3Rpb24gKGpzb25FbnRyeSl7XG4gICAgICAgIHZhciBzb3VyY2VGaWVsZFZhbHVlID0gdGhpcy5nZXRTb3VyY2VGaWVsZChqc29uRW50cnkpO1xuICAgICAgICB2YXIgY29tbW9uRGF0YSA9IG51bGw7XG4gICAgICAgIHN3aXRjaChzb3VyY2VGaWVsZFZhbHVlKXtcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpclJlZ2lzdHJ5RGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJSZWdpc3RyeURhdGEoanNvbkVudHJ5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpclRyYWluaW5nRGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJUcmFpbmluZ0RhdGEoanNvbkVudHJ5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbmV3IEVsaXhpckV2ZW50RGF0YShudWxsKS5TT1VSQ0VfRklFTERfVkFMVUU6XG4gICAgICAgICAgICAgICAgY29tbW9uRGF0YSA9IG5ldyBFbGl4aXJFdmVudERhdGEoanNvbkVudHJ5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogVW5rbm93biBzb3VyY2UgZmllbGQgdmFsdWU6IFwiICsgc291cmNlRmllbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbW1vbkRhdGE7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YU1hbmFnZXI7IiwidmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpckV2ZW50RGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICpcbiAqL1xudmFyIEVsaXhpckV2ZW50RGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIENPTlNUUyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENBVEVHT1JZICAgICAgICAgICAgICAgICAgICA6IFwiY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIENJVFkgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ09VTlRSWSAgICAgICAgICAgICAgICAgICAgIDogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFSVF9EQVRFICAgICAgICAgICAgICAgICAgOiBcInN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBFTkRfREFURSAgICAgICAgICAgICAgICAgICAgOiBcImVuZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgVkVOVUUgICAgICAgICAgICAgICAgICAgICAgIDogXCJ2ZW51ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgUFJPVklERVIgICAgICAgICAgICAgICAgICAgIDogXCJwcm92aWRlclwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBDT05TVFMpe1xuICAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSBDT05TVFNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5qc29uRGF0YSA9IGpzb25EYXRhO1xuICAgICAgICAgICAgdGhpcy5TT1VSQ0VfRklFTERfVkFMVUUgPSBcImlhbm5cIjtcbiAgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIEVsaXhpckV2ZW50RGF0YSBjaGlsZCBjbGFzcyB3aXRoIHNwZWNpZmljIGluZm9ybWF0aW9uIG9mIHRoaXMga2luZCBvZiByZWdpc3RyaWVzLlxuICovICAgICAgICAgXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb21tb25EYXRhLnByb3RvdHlwZSk7XG5FbGl4aXJFdmVudERhdGEuY29uc3RydWN0b3I9IEVsaXhpckV2ZW50RGF0YTtcbiAgICAgICBcbiAgICAgICAgICAgIFxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGFsbCBjYXRlZ29yaWVzIHByZXNlbnQgaW4gdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7QXJyYXl9IC0gQXJyYXkgb2Ygc3RyaW5ncyB3aXRoIGNhdGVnb3JpZXMgcmVsYXRlZCB3aXRoIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldENhdGVnb3J5VmFsdWVzPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuQ0FURUdPUlkpOyAgICAgIFxufSxcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGNpdHkgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGNpdHkgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q2l0eVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkNJVFkpOyAgICAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIGNvdW50cnkgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGNvdW50cnkgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q291bnRyeVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkNPVU5UUlkpOyAgICAgIFxufTtcblxuXG4vKipcbiAqICAgICAgICAgIEF1eGlsaWFyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvbmUgZGF0ZSBhZGFwdGVkIHRvIHVzZXIncyBsb2NhbGUuXG4gKiAgICAgICAgICBAcGFyYW0gc291cmNlRGF0ZSB7U3RyaW5nfSAtIFN0cmluZyBkYXRlIGluIFVURiBmb3JtYXQgdG8gYmUgY29udmVydGVkIGludG8gYSBsb2NhbGUgZm9ybWF0LlxuICogICAgICAgICAge1N0cmluZ30gLSBTdHJpbmcgbGl0ZXJhbCB3aXRoIHRoZSBjdXJhdGVkIGRhdGUuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0Q3VyYXRlZERhdGUgPSBmdW5jdGlvbihzb3VyY2VEYXRlKXtcbiAgICAgICAgICAgIHZhciBkYXRlVmFsdWUgPSBuZXcgRGF0ZShzb3VyY2VEYXRlKTtcbiAgICAgICAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGVWYWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgaXMgYSBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGlzTmFOKCBkYXRlVmFsdWUuZ2V0VGltZSgpICkgKSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0ZSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VEYXRlOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlVmFsdWUudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBhIGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2VEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgc3RhcnRpbmcgZGF0ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgc3RhcnRpbmcgZGF0ZSB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqL1xuRWxpeGlyRXZlbnREYXRhLnByb3RvdHlwZS5nZXRTdGFydERhdGVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdmFsdWU9IHRoaXMuZ2V0UGFyYW1ldGVyaXNlZFZhbHVlKHRoaXMuU1RBUlRfREFURSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJhdGVkRGF0ZSh2YWx1ZSk7XG59O1xuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgZW5kaW5nIGRhdGUgZmllbGQgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKiAgICAgICAgICB7U3RyaW5nfSAtIFN0cmluZyBsaXRlcmFsIHdpdGggdGhlIGVuZGluZyBkYXRlIHZhbHVlIG9mIHRoaXMgZW50aXR5LlxuICovXG5FbGl4aXJFdmVudERhdGEucHJvdG90eXBlLmdldEVuZERhdGVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFBhcmFtZXRlcmlzZWRWYWx1ZSh0aGlzLkVORF9EQVRFKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cmF0ZWREYXRlKHZhbHVlKTtcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyB2ZW51ZSBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgdmVudWUgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0VmVudWVWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5WRU5VRSk7ICBcbn07XG5cbi8qKlxuICogICAgICAgICAgUmV0dXJucyBwcm92aWRlciBmaWVsZCB2YWx1ZSBvZiB0aGlzIGVudGl0eS5cbiAqICAgICAgICAgIHtTdHJpbmd9IC0gU3RyaW5nIGxpdGVyYWwgd2l0aCB0aGUgcHJvdmlkZXIgdmFsdWUgb2YgdGhpcyBlbnRpdHkuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0UHJvdmlkZXJWYWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJhbWV0ZXJpc2VkVmFsdWUodGhpcy5QUk9WSURFUik7ICBcbn07XG5cblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBpbXByb3ZlZCB3YXkgb2YgcmVwcmVzZW50aW5nIEVsaXhpckV2ZW50RGF0YSB0cmFuc2Zvcm1lZCBpbnRvIGEgSFRNTCBjb21wb25lbnQuXG4gKiAgICAgICAgICB7T2JqZWN0fSAtIEFycmF5IHdpdGggSFRNTCBzdHJ1Y3R1cmVkIGNvbnZlcnRlZCBmcm9tIHRoaXMgZW50aXR5J3Mgb3JpZ2luYWwgSlNPTiBzdGF0dXMuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vQ29tbW9uRGF0YS5wcm90b3R5cGUuZ2V0RnVsbERyYXdhYmxlT2JqZWN0LmNhbGwodGhpcyk7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldExhYmVsVGl0bGUoKTtcbiAgICAgICAgICAgIHZhciB0b3BpY3MgPSB0aGlzLmdldExhYmVsVG9waWNzKCk7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VUeXBlcyA9IHRoaXMuZ2V0SW1hZ2VSZXNvdXJjZVR5cGVzKCk7XG4gICAgICAgICAgICB2YXIgZ2V0RXhwYW5kYWJsZURldGFpbHMgPSB0aGlzLmdldEV4cGFuZGFibGVEZXRhaWxzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2V0RXhwYW5kYWJsZURldGFpbHMpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuYXBwZW5kQ2hpbGQocmVzb3VyY2VUeXBlcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRDb250YWluZXIpO1xuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQocmlnaHRDb250YWluZXIpO1xuICAgICAgICAgICAgbWFpbkNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ckNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIHJldHVybiBtYWluQ29udGFpbmVyO1xufTtcblxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIGV4cGFuZGFibGUgb2JqZWN0IHdpdGggbWFueSBkZXRhaWxzIHJlbGF0ZWQgd2l0aCB0aGlzIEVsaXhpckV2ZW50RGF0YSByZWNvcmQuXG4gKiAgICAgICAgICB7SFRNTCBPYmplY3R9IC0gRHJhd2FibGUgb2JqZWN0IHdpdGggZGV0YWlscyByZWxhdGVkIHdpdGggdGhpcyByZWNvcmQuXG4gKi9cbkVsaXhpckV2ZW50RGF0YS5wcm90b3R5cGUuZ2V0RXhwYW5kYWJsZURldGFpbHMgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGRldGFpbHNBcnJheSA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3BhblByb3ZpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBzcGFuUHJvdmlkZXIuY2xhc3NMaXN0LmFkZChcImV4cGFuZGFibGVfZGV0YWlsXCIpO1xuICAgICAgICAgICAgc3BhblByb3ZpZGVyLmNsYXNzTGlzdC5hZGQoXCJwcm92aWRlclwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5Qcm92aWRlclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlclZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwcm92aWRlciAhPT0gdW5kZWZpbmVkICkgeyAgICBcbiAgICAgICAgICAgICAgICAgICAgc3BhblByb3ZpZGVyVGV4dCA9IFwiUHJvdmlkZXI6IFwiK3Byb3ZpZGVyO1xuICAgICAgICAgICAgICAgICAgICBzcGFuUHJvdmlkZXIuaW5uZXJIVE1MID0gc3BhblByb3ZpZGVyVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhblByb3ZpZGVyKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNwYW5WZW51ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhblZlbnVlLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5WZW51ZS5jbGFzc0xpc3QuYWRkKFwidmVudWVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcGFuVmVudWVUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ZW51ZSA9IHRoaXMuZ2V0VmVudWVWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVudWUgIT09IHVuZGVmaW5lZCApIHsgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5WZW51ZVRleHQgPSB2ZW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhblZlbnVlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGFuTG9jYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kYWJsZV9kZXRhaWxcIik7XG4gICAgICAgICAgICBzcGFuTG9jYXRpb24uY2xhc3NMaXN0LmFkZChcImxvY2F0aW9uXCIpO1xuICAgICAgICAgICAgdmFyIHNwYW5Mb2NhdGlvblRleHQgPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGNvdW50cnkgPSB0aGlzLmdldENvdW50cnlWYWx1ZSgpO1xuICAgICAgICAgICAgdmFyIGNpdHkgPSB0aGlzLmdldENpdHlWYWx1ZSgpO1xuICAgICAgICAgICAgaWYgKGNvdW50cnkgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhbkxvY2F0aW9uVGV4dCA9IHNwYW5Mb2NhdGlvblRleHQgKyBjb3VudHJ5OyAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2l0eSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3BhbkxvY2F0aW9uVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArXCIsIFwiKyBjaXR5OyAgXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFuTG9jYXRpb25UZXh0ID0gc3BhbkxvY2F0aW9uVGV4dCArIGNpdHk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFuTG9jYXRpb25UZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5Mb2NhdGlvbi5pbm5lckhUTUwgPSBzcGFuTG9jYXRpb25UZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhbkxvY2F0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNwYW5EYXRlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgc3BhbkRhdGVzLmNsYXNzTGlzdC5hZGQoXCJleHBhbmRhYmxlX2RldGFpbFwiKTtcbiAgICAgICAgICAgIHNwYW5EYXRlcy5jbGFzc0xpc3QuYWRkKFwiZGF0ZXNcIik7XG4gICAgICAgICAgICB2YXIgc3BhbkRhdGVzVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgc3RhcnREYXRlID0gdGhpcy5nZXRTdGFydERhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgdmFyIGVuZERhdGUgPSB0aGlzLmdldEVuZERhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoc3RhcnREYXRlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kRGF0ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IFwiRnJvbSBcIitzdGFydERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlc1RleHQgPSBzdGFydERhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwYW5EYXRlc1RleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhbkRhdGVzVGV4dCA9IHNwYW5EYXRlc1RleHQgKyBcIiB0byBcIitlbmREYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFuRGF0ZXNUZXh0ID0gZW5kRGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFuRGF0ZXNUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5EYXRlcy5pbm5lckhUTUwgPSBzcGFuRGF0ZXNUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsc0FycmF5LnB1c2goc3BhbkRhdGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG1heWJlIHdlIGNhbiBhZGQgbGF0ZXIgJ2NhdGVnb3J5JyBvciAna2V5d29yZHMnXG4gICAgICAgICAgICB2YXIgZXhwYW5kYWJsZURldGFpbHMgPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXRhaWxzQXJyYXkpO1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZGFibGVEZXRhaWxzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyRXZlbnREYXRhO1xuICAgICAgIiwidmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclJlZ2lzdHJ5RGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICpcbiAqL1xudmFyIEVsaXhpclJlZ2lzdHJ5RGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiZWxpeGlyX3JlZ2lzdHJ5XCIgOyAgIFxufTtcblxuLyoqXG4gKiAgICAgICAgICBFbGl4aXJSZWdpc3RyeURhdGEgY2hpbGQgY2xhc3Mgd2l0aCBzcGVjaWZpYyBpbmZvcm1hdGlvbiBvZiB0aGlzIGtpbmQgb2YgcmVjb3Jkcy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tbW9uRGF0YS5wcm90b3R5cGUpO1xuRWxpeGlyUmVnaXN0cnlEYXRhLmNvbnN0cnVjdG9yPSBFbGl4aXJSZWdpc3RyeURhdGE7XG5cbiAgICAgICAgICAgIFxuXG4vKipcbiAqICAgICAgICAgIFJldHVybnMgb25lIG1vcmUgZGV0YWlsZWQgd2F5IG9mIHJlcHJlc2VudGluZyBhIEVsaXhpclJlZ2lzdHJ5RGF0YSByZWNvcmQgdHJhbnNmb3JtZWRcbiAqICAgICAgICAgIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyUmVnaXN0cnlEYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoPkNvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgQ29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pK1wiIFsuLi5dXCIsWydlbGl4aXJfcmVnaXN0cnknXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RXhwYW5kYWJsZVRleHQoXCJNb3JlIFwiLGRlc2NyaXB0aW9uLFsnZWxpeGlyX3JlZ2lzdHJ5J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChleHBhbmRhYmxlRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyUmVnaXN0cnlEYXRhOyIsIlxudmFyIENvbW1vbkRhdGEgPSByZXF1aXJlKFwiLi9Db21tb25EYXRhLmpzXCIpO1xuXG4vKipcbiAqICAgICAgICAgIEVsaXhpclRyYWluaW5nRGF0YSBjb25zdHJ1Y3RvclxuICogICAgICAgICAgQHBhcmFtIGpzb25EYXRhIHtPYmplY3R9IEpTT04gZGF0YSBzdHJ1Y3R1cmUgd2l0aCB0aGUgb3JpZ2luYWwgZGF0YSByZXRyaWV2ZWQgYnkgb3VyIGRhdGEgc2VydmVyLlxuICpcbiAqL1xudmFyIEVsaXhpclRyYWluaW5nRGF0YSA9IGZ1bmN0aW9uKGpzb25EYXRhKSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmpzb25EYXRhID0ganNvbkRhdGE7XG4gICAgICAgICAgICB0aGlzLlNPVVJDRV9GSUVMRF9WQUxVRSA9IFwiY2thblwiOyBcbn07XG5cbi8qKlxuICogICAgICAgICAgRWxpeGlyVHJhaW5pbmdEYXRhIGNoaWxkIGNsYXNzIHdpdGggc3BlY2lmaWMgaW5mb3JtYXRpb24gb2YgdGhpcyBraW5kIG9mIHJlZ2lzdHJpZXMuXG4gKi9cbkVsaXhpclRyYWluaW5nRGF0YS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbW1vbkRhdGEucHJvdG90eXBlKTsgXG5FbGl4aXJUcmFpbmluZ0RhdGEuY29uc3RydWN0b3I9IEVsaXhpclRyYWluaW5nRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuLyoqXG4gKiAgICAgICAgICBSZXR1cm5zIG9uZSBtb3JlIGRldGFpbGVkIHdheSBvZiByZXByZXNlbnRpbmcgYSBFbGl4aXJUcmFpbmluZ0RhdGEgcmVjb3JkIHRyYW5zZm9ybWVkIGludG8gYSBIVE1MIGNvbXBvbmVudC5cbiAqICAgICAgICAgIHtPYmplY3R9IC0gQXJyYXkgd2l0aCBIVE1MIHN0cnVjdHVyZWQgY29udmVydGVkIGZyb20gdGhpcyBlbnRpdHkncyBvcmlnaW5hbCBKU09OIHN0YXR1cy5cbiAqL1xuRWxpeGlyVHJhaW5pbmdEYXRhLnByb3RvdHlwZS5nZXRGdWxsRHJhd2FibGVPYmplY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRMYWJlbFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgdG9waWNzID0gdGhpcy5nZXRMYWJlbFRvcGljcygpO1xuICAgICAgICAgICAgdmFyIHJlc291cmNlVHlwZXMgPSB0aGlzLmdldEltYWdlUmVzb3VyY2VUeXBlcygpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0X2RhdGFfY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9yb3dcIik7XG4gICAgICAgICAgICB2YXIgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGVmdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGV4dF9kYXRhX2NvbnRhaW5lcl9jb2xfbGVmdFwiKTtcbiAgICAgICAgICAgIHZhciByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcmlnaHRDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNvbnRleHRfZGF0YV9jb250YWluZXJfY29sX3JpZ2h0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGxlZnRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9waWNzKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbiAhPSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGFuZGFibGVEZXNjcmlwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoPkNvbW1vbkRhdGEuTUlOX0xFTkdUSF9MT05HX0RFU0NSSVBUSU9OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRhYmxlRGVzY3JpcHRpb24gPSB0aGlzLmdldEV4cGFuZGFibGVUZXh0KFwiTW9yZSBcIixkZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgQ29tbW9uRGF0YS5NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT04pK1wiIFsuLi5dXCIsWyd0cmFpbmluZ19tYXRlcmlhbCddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwYW5kYWJsZURlc2NyaXB0aW9uID0gdGhpcy5nZXRFeHBhbmRhYmxlVGV4dChcIk1vcmUgXCIsZGVzY3JpcHRpb24sWyd0cmFpbmluZ19tYXRlcmlhbCddKTsgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdENvbnRhaW5lci5hcHBlbmRDaGlsZChleHBhbmRhYmxlRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodENvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNvdXJjZVR5cGVzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJDb250YWluZXIuYXBwZW5kQ2hpbGQobGVmdENvbnRhaW5lcik7XG4gICAgICAgICAgICB0ckNvbnRhaW5lci5hcHBlbmRDaGlsZChyaWdodENvbnRhaW5lcik7XG4gICAgICAgICAgICBtYWluQ29udGFpbmVyLmFwcGVuZENoaWxkKHRyQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1haW5Db250YWluZXI7XG59O1xuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gRWxpeGlyVHJhaW5pbmdEYXRhOyIsInZhciBDb250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi9Db250ZXh0RGF0YUxpc3QuanNcIik7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xuXG4vKiogXG4gKiBQYWdlTWFuYWdlciBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge0NvbnRleHREYXRhTGlzdCBPYmplY3R9IFJlZmVyZW5jZSB0byBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGluIG9yZGVyIHRvIG1hbmFnZSBpdHMgZmlsdGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGZvciBQYWdlTWFuYWdlciBjb21wb25lbnQuXG4gKiBAb3B0aW9uIHtzdHJpbmd9IFt0YXJnZXQ9J1lvdXJPd25EaXZJZCddXG4gKiAgICBJZGVudGlmaWVyIG9mIHRoZSBESVYgdGFnIHdoZXJlIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIGRpc3BsYXllZC5cbiAqL1xudmFyIFBhZ2VNYW5hZ2VyID0gZnVuY3Rpb24oY29udGV4dERhdGFMaXN0LCBvcHRpb25zKSB7XG5cdHZhciBjb25zdHMgPSB7XG5cdH07XG5cdHZhciBkZWZhdWx0X29wdGlvbnNfdmFsdWVzID0geyAgICAgICAgXG5cdH07XG5cdGZvcih2YXIga2V5IGluIG9wdGlvbnMpe1xuXHQgICAgIHRoaXNba2V5XSA9IG9wdGlvbnNba2V5XTtcblx0fVxuXHRmb3IodmFyIGtleSBpbiBkZWZhdWx0X29wdGlvbnNfdmFsdWVzKXtcblx0ICAgICB0aGlzW2tleV0gPSBkZWZhdWx0X29wdGlvbnNfdmFsdWVzW2tleV07XG5cdH1cblx0XG5cdGZvcih2YXIga2V5IGluIGNvbnN0cyl7XG5cdCAgICAgdGhpc1trZXldID0gY29uc3RzW2tleV07XG5cdH1cbiAgICAgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QgPSBjb250ZXh0RGF0YUxpc3Q7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdCA9IDA7XG5cdHRoaXMuY29udGV4dERhdGFMaXN0LnJlZ2lzdGVyT25Mb2FkZWRGdW5jdGlvbih0aGlzLCB0aGlzLmJ1aWxkKTtcbn1cblxuLyoqIFxuICogUGFnZU1hbmFnZXIgZnVuY3Rpb25hbGl0eS5cbiAqIFxuICogQGNsYXNzIFBhZ2VNYW5hZ2VyXG4gKiBcbiAqL1xuUGFnZU1hbmFnZXIucHJvdG90eXBlID0ge1xuXHRjb25zdHJ1Y3RvcjogUGFnZU1hbmFnZXIsXG4gICAgICAgIFxuICAgICAgICBcblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIGJ1dHRvbnMgYW5kIGRyYXcgdGhlbSBpbnRvIHRoZSBlbGVtZW50IHdpdGggaWQgJ3RhcmdldElkJ1xuXHQgKi8gICAgICAgIFxuXHRidWlsZCA6IGZ1bmN0aW9uICgpe1xuXHRcdHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldElkKTtcblx0XHRpZiAodGFyZ2V0ID09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT0gbnVsbCl7XG5cdFx0XHRyZXR1cm47XHRcblx0XHR9XG5cdFx0d2hpbGUgKHRhcmdldC5maXJzdENoaWxkKSB7XG5cdFx0XHR0YXJnZXQucmVtb3ZlQ2hpbGQodGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpe1xuXHRcdFx0dmFyIHN0YXR1c1RleHQgPSB0aGlzLmdldEN1cnJlbnRTdGF0dXMoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdGF0dXNUZXh0KTtcblx0XHR9ZWxzZSBpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHZhciBzdGF0dXNUZXh0ID0gdGhpcy5nZXRDdXJyZW50U3RhdHVzKCk7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3RhdHVzVGV4dCk7XG5cdFx0fWVsc2UgaWYgKHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGF0dXMgPT0gY29uc3RhbnRzLkNvbnRleHREYXRhTGlzdF9MT0FERUQpe1xuXHRcdFx0dmFyIHN0YXR1c1RleHQgPSB0aGlzLmdldEN1cnJlbnRTdGF0dXMoKTtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdGF0dXNUZXh0KTtcblx0XHRcdFxuXHRcdFx0dmFyIG5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0bmF2RGl2LmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9uYXYnKTtcblx0XHRcdFxuXHRcdFx0dmFyIHByZXZpb3VzQnV0dG9uID0gdGhpcy5jcmVhdGVQcmV2aW91c0J1dHRvbigpO1xuXHRcdFx0bmF2RGl2LmFwcGVuZENoaWxkKHByZXZpb3VzQnV0dG9uKTtcblx0XHRcdFxuXHRcdFx0dmFyIHRleHRTZXBhcmF0b3IgPSB0aGlzLmNyZWF0ZVRleHRTZXBhcmF0b3IoKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZCh0ZXh0U2VwYXJhdG9yKTtcblx0XHRcdFxuXHRcdFx0dmFyIG5leHRCdXR0b24gPSB0aGlzLmNyZWF0ZU5leHRCdXR0b24oKTtcblx0XHRcdG5hdkRpdi5hcHBlbmRDaGlsZChuZXh0QnV0dG9uKTtcblx0XHRcdFxuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKG5hdkRpdik7XG5cdFx0fWVsc2V7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVSUk9SOiBVbmtub3duIHN0YXR1czogXCIrdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyk7XG5cdFx0fVxuXHRcdFxuXHR9LFxuICAgICAgICBcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgdGV4dCBzZXBhcmF0b3IuXG4gICAgICAgICovICBcblx0Y3JlYXRlVGV4dFNlcGFyYXRvciA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0dmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLScpO1xuXHRcdGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dCk7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH0sXG5cdFxuXHQvKipcbiAgICAgICAgKiBGdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBpZiBpdCdzIHBvc3NpYmxlIHRvIHJldHJpZXZlIHByZXZpb3VzIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgZXhpc3RQcmV2aW91c1Jlc3VsdHMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBzdGFydFJlc3VsdCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHRpZiAoc3RhcnRSZXN1bHQgPT0gMCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1lbHNlXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblx0XG5cdC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIGlmIGl0J3MgcG9zc2libGUgdG8gcmV0cmlldmUgbmV4dCByZXN1bHRzLlxuICAgICAgICAqLyAgXG4gICAgICAgIGV4aXN0TmV4dFJlc3VsdHMgOiBmdW5jdGlvbigpe1xuXHRcdHZhciBzdGFydFJlc3VsdCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRTdGFydFJlc3VsdDtcblx0XHR2YXIgbWF4Um93cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmdldE1heFJvd3MoKTtcblx0XHR2YXIgdG90YWxSZXN1bHRzID0gdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFRvdGFsUmVzdWx0cztcblxuXHRcdGlmIChzdGFydFJlc3VsdCttYXhSb3dzPHRvdGFsUmVzdWx0cykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fWVsc2Vcblx0XHRcdHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAqIEZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBvbmUgYnV0dG9uIHRvIGdldCBwcmV2aW91cyByZXN1bHRzLk9ubHkgdGV4dCBpZiB0aGVyZSBhcmVuJ3QgcHJldmlvdXMgcmVzdWx0cy5cbiAgICAgICAgKi8gIFxuICAgICAgICBjcmVhdGVQcmV2aW91c0J1dHRvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuZXhpc3RQcmV2aW91c1Jlc3VsdHMoKSkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwYWdlX21hbmFnZXJfY29tcG9uZW50Jyk7XG5cdFx0XHR2YXIgbGlua1RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnUHJldmlvdXMnKTtcblx0XHRcdGJ1dHRvbi5hcHBlbmRDaGlsZChsaW5rVGV4dCk7XG5cdFx0XHRidXR0b24udGl0bGUgPSAnUHJldmlvdXMnO1xuXHRcdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHRcdHZhciBteVBhZ2VNYW5hZ2VyID0gdGhpcztcblx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0XHQgICAgdmFyIG1heFJvd3MgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0XHQgICAgdmFyIHRvdGFsUmVzdWx0cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHQgICAgdmFyIHN0YXJ0UmVzdWx0ID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIHZhciBuZXdTdGFydFJlc3VsdCA9IDA7XG5cdFx0XHQgICAgaWYgKHN0YXJ0UmVzdWx0LW1heFJvd3M8PTApIHtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gMDtcdFxuXHRcdFx0ICAgIH1lbHNle1xuXHRcdFx0XHQgICAgbmV3U3RhcnRSZXN1bHQgPSBzdGFydFJlc3VsdC1tYXhSb3dzO1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgICBteVBhZ2VNYW5hZ2VyLl9jaGFuZ2VQYWdlKG5ld1N0YXJ0UmVzdWx0KTtcblx0XHRcdCAgICByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYnV0dG9uOyAgXG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgcHJldmlvdXNTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0dmFyIHByZXZpb3VzVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdQcmV2aW91cycpO1xuXHRcdFx0cHJldmlvdXNTcGFuLmFwcGVuZENoaWxkKHByZXZpb3VzVGV4dCk7XG5cdFx0XHRwcmV2aW91c1NwYW4uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0cmV0dXJuIHByZXZpb3VzU3Bhbjtcblx0XHR9XG4gICAgICAgICAgICAgIFxuICAgICAgICB9LFxuXHRcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCBjcmVhdGVzIG9uZSBidXR0b24gdG8gZ2V0IHByZXZpb3VzIHJlc3VsdHMuT25seSB0ZXh0IGlmIHRoZXJlIGFyZW4ndCBtb3JlIHJlc3VsdHMuXG4gICAgICAgICovICBcbiAgICAgICAgY3JlYXRlTmV4dEJ1dHRvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuZXhpc3ROZXh0UmVzdWx0cygpKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9jb21wb25lbnQnKTtcblx0XHRcdHZhciBsaW5rVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdOZXh0Jyk7XG5cdFx0XHRidXR0b24uYXBwZW5kQ2hpbGQobGlua1RleHQpO1xuXHRcdFx0YnV0dG9uLnRpdGxlID0gJ05leHQnO1xuXHRcdFx0YnV0dG9uLmhyZWYgPSBcIiNcIjtcblx0XHRcdHZhciBteVBhZ2VNYW5hZ2VyID0gdGhpcztcblx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCl7XG5cdFx0XHQgICAgdmFyIG1heFJvd3MgPSBteVBhZ2VNYW5hZ2VyLmNvbnRleHREYXRhTGlzdC5nZXRNYXhSb3dzKCk7XG5cdFx0XHQgICAgdmFyIHRvdGFsUmVzdWx0cyA9IG15UGFnZU1hbmFnZXIuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHQgICAgdmFyIHN0YXJ0UmVzdWx0ID0gbXlQYWdlTWFuYWdlci5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0O1xuXHRcdFx0ICAgIHZhciBuZXdTdGFydFJlc3VsdCA9IDA7XG5cdFx0XHQgICAgaWYgKHN0YXJ0UmVzdWx0K21heFJvd3M8dG90YWxSZXN1bHRzKSB7XG5cdFx0XHRcdCAgICBuZXdTdGFydFJlc3VsdCA9IHN0YXJ0UmVzdWx0K21heFJvd3M7XHRcblx0XHRcdCAgICB9ZWxzZXtcblx0XHRcdFx0ICAgIG5ld1N0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQ7XG5cdFx0XHQgICAgfVxuXHRcdFx0ICAgIG15UGFnZU1hbmFnZXIuX2NoYW5nZVBhZ2UobmV3U3RhcnRSZXN1bHQpO1xuXHRcdFx0ICAgIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBidXR0b247XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgbmV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHR2YXIgbmV4dFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTmV4dCcpO1xuXHRcdFx0bmV4dFNwYW4uYXBwZW5kQ2hpbGQobmV4dFRleHQpO1xuXHRcdFx0bmV4dFNwYW4uY2xhc3NMaXN0LmFkZCgncGFnZV9tYW5hZ2VyX2NvbXBvbmVudCcpO1xuXHRcdFx0cmV0dXJuIG5leHRTcGFuO1xuXHRcdH1cbiAgICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IGV4ZWN1dGVzIHRoZSByZWRyYXduIG9mIHRoZSBDb250ZXh0RGF0YUxpc3Qgb2JqZWN0IGhhdmluZyBpbnRvIGFjY291bnRcbiAgICAgICAgKiBwcmV2aW91c2x5IGNob3NlbiBmaWx0ZXJzLlxuICAgICAgICAqIEBwYXJhbSBzdGFydFJlc3VsdCB7SW50ZWdlcn0gLSBudW1iZXIgb2YgdGhlIGZpcnN0IHJlc3VsdCB0byBiZSBzaG93blxuICAgICAgICAqLyAgXG4gICAgICAgIF9jaGFuZ2VQYWdlOiBmdW5jdGlvbiAoc3RhcnRSZXN1bHQpe1xuXHQgICAgdGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXJ0UmVzdWx0ID0gc3RhcnRSZXN1bHQ7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHREYXRhTGlzdC5kcmF3Q29udGV4dERhdGFMaXN0KCk7XG4gICAgICAgIH0sXG5cdCBcblx0LyoqXG4gICAgICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgdGV4dHVhbCBkZXNjcmlwdGlvbiBvZjogZmlyc3QgcmVzdWx0IHNob3duLCBsYXN0IHJlc3VsdHMgc2hvd24gYW5kXG4gICAgICAgICogdG90YWwgbnVtYmVyIG9mIHJlc3VsdHMuXG4gICAgICAgICovICBcblx0Z2V0Q3VycmVudFN0YXR1cyA6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2VfbWFuYWdlcl9zdGF0dXMnKTtcblx0XHR2YXIgc3RhcnRpbmdSZXN1bHQgPSBudWxsO1xuXHRcdHZhciBlbmRpbmdSZXN1bHQgPSBudWxsO1xuXHRcdHZhciB0b3RhbFJlc3VsdHMgPSBudWxsO1xuXHRcdHZhciByZXN1bHRUZXh0ID0gXCJcIjtcblx0XHRcblx0XHRpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0xPQURJTkcpe1xuXHRcdFx0cmVzdWx0VGV4dCA9IFwiTG9hZGluZyByZXNvdXJjZXMuLi5cIjtcblx0XHR9ZWxzZSBpZiAodGhpcy5jb250ZXh0RGF0YUxpc3QuY3VycmVudFN0YXR1cyA9PSBjb25zdGFudHMuQ29udGV4dERhdGFMaXN0X0VSUk9SKXtcblx0XHRcdHJlc3VsdFRleHQgPSBcIlwiO1xuXHRcdH1lbHNle1xuXHRcdFx0c3RhcnRpbmdSZXN1bHQgPSB0aGlzLmNvbnRleHREYXRhTGlzdC5jdXJyZW50U3RhcnRSZXN1bHQ7XG5cdFx0XHR2YXIgY3VycmVudFRvdGFsUmVzdWx0cyA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnRUb3RhbFJlc3VsdHM7XG5cdFx0XHR2YXIgbnVtUm93c0xvYWRlZCA9IHRoaXMuY29udGV4dERhdGFMaXN0LmN1cnJlbnROdW1iZXJMb2FkZWRSZXN1bHRzO1xuXHRcdFx0XG5cdFx0XHRlbmRpbmdSZXN1bHQgPSBzdGFydGluZ1Jlc3VsdCArIG51bVJvd3NMb2FkZWQ7XG5cdFx0XHRpZiAoY3VycmVudFRvdGFsUmVzdWx0cz4wKSB7XG5cdFx0XHRcdC8vIG9ubHkgdG8gc2hvdyBpdCB0byB0aGUgdXNlclxuXHRcdFx0XHRzdGFydGluZ1Jlc3VsdCA9IHN0YXJ0aW5nUmVzdWx0KzE7XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHRUZXh0ID0gXCJSZWNvcmRzIFwiK3N0YXJ0aW5nUmVzdWx0K1wiIHRvIFwiK2VuZGluZ1Jlc3VsdCtcIiBvZiBcIitjdXJyZW50VG90YWxSZXN1bHRzXG5cdFx0XHRcblx0XHR9XG5cdFx0ZWxlbWVudC5pbm5lckhUTUwgPSByZXN1bHRUZXh0O1xuXHRcdFxuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG4gICAgICAgIFxuICAgICAgICBcbn1cbiAgICAgIFxubW9kdWxlLmV4cG9ydHMgPSBQYWdlTWFuYWdlcjtcbiAgICAgIFxuICAiLCJcblxuZnVuY3Rpb24gZGVmaW5lKG5hbWUsIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6ICAgICAgdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbn1cblxuLy8gQ29udGV4dERhdGFMaXN0IGNvbnN0YW50c1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfUkVHSVNUUllcIiwgXCJFU1JcIik7XG5kZWZpbmUoXCJDb250ZXh0RGF0YUxpc3RfU09VUkNFX0VMSVhJUl9URVNTXCIsIFwiVFNTXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X1NPVVJDRV9FTElYSVJfRVZFTlRTXCIsIFwiRUVWXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0ZVTExfU1RZTEVcIiwgXCJGVUxMX1NUWUxFXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0NPTU1PTl9TVFlMRVwiLCBcIkNPTU1PTl9TVFlMRVwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9NQVhfUk9XU1wiLCAxMDApO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X05VTV9XT1JEU19GSUxURVJJTkdfREVTQ1JJUFRJT05cIiwgNTApO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0VWVF9PTl9SRVNVTFRTX0xPQURFRFwiLCBcIm9uUmVzdWx0c0xvYWRlZFwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FVlRfT05fUkVRVUVTVF9FUlJPUlwiLCBcIm9uUmVxdWVzdEVycm9yXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0xPQURJTkdcIiwgXCJMT0FESU5HXCIpO1xuZGVmaW5lKFwiQ29udGV4dERhdGFMaXN0X0xPQURFRFwiLCBcIkxPQURFRFwiKTtcbmRlZmluZShcIkNvbnRleHREYXRhTGlzdF9FUlJPUlwiLCBcIkVSUk9SXCIpO1xuXG4vLyBDb21tb25EYXRhIGNvbnN0YW50c1xuZGVmaW5lKFwiQ29tbW9uRGF0YV9NSU5fTEVOR1RIX0xPTkdfREVTQ1JJUFRJT05cIiwgMTAwMCk7XG5cbi8vIEJ1dHRvbnNNYW5hZ2VyIGNvbnN0YW50c1xuZGVmaW5lKFwiQnV0dG9uc01hbmFnZXJfU1FVQVJFRF8zRFwiLCBcIlNRVUFSRURfM0RcIik7XG5kZWZpbmUoXCJCdXR0b25zTWFuYWdlcl9ST1VORF9GTEFUXCIsIFwiUk9VTkRfRkxBVFwiKTtcbmRlZmluZShcIkJ1dHRvbnNNYW5hZ2VyX0lDT05TX09OTFlcIiwgXCJJQ09OU19PTkxZXCIpO1xuXG4iLG51bGwsIi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiBsaWNlbnNlIE1JVCAoYykgRHVzdGluIERpYXogMjAxNVxuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqL1xuXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBjb250ZXh0ID0gdGhpc1xuXG4gIGlmICgnd2luZG93JyBpbiBjb250ZXh0KSB7XG4gICAgdmFyIGRvYyA9IGRvY3VtZW50XG4gICAgICAsIGJ5VGFnID0gJ2dldEVsZW1lbnRzQnlUYWdOYW1lJ1xuICAgICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gIH0gZWxzZSB7XG4gICAgdmFyIFhIUjJcbiAgICB0cnkge1xuICAgICAgWEhSMiA9IHJlcXVpcmUoJ3hocjInKVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BlZXIgZGVwZW5kZW5jeSBgeGhyMmAgcmVxdWlyZWQhIFBsZWFzZSBucG0gaW5zdGFsbCB4aHIyJylcbiAgICB9XG4gIH1cblxuXG4gIHZhciBodHRwc1JlID0gL15odHRwL1xuICAgICwgcHJvdG9jb2xSZSA9IC8oXlxcdyspOlxcL1xcLy9cbiAgICAsIHR3b0h1bmRvID0gL14oMjBcXGR8MTIyMykkLyAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgY29udGVudFR5cGUgPSAnQ29udGVudC1UeXBlJ1xuICAgICwgcmVxdWVzdGVkV2l0aCA9ICdYLVJlcXVlc3RlZC1XaXRoJ1xuICAgICwgdW5pcWlkID0gMFxuICAgICwgY2FsbGJhY2tQcmVmaXggPSAncmVxd2VzdF8nICsgKCtuZXcgRGF0ZSgpKVxuICAgICwgbGFzdFZhbHVlIC8vIGRhdGEgc3RvcmVkIGJ5IHRoZSBtb3N0IHJlY2VudCBKU09OUCBjYWxsYmFja1xuICAgICwgeG1sSHR0cFJlcXVlc3QgPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgLCB4RG9tYWluUmVxdWVzdCA9ICdYRG9tYWluUmVxdWVzdCdcbiAgICAsIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxuXG4gICAgLCBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IEFycmF5LmlzQXJyYXlcbiAgICAgICAgOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgIH1cblxuICAgICwgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgICAgICAgJ2NvbnRlbnRUeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgLCAncmVxdWVzdGVkV2l0aCc6IHhtbEh0dHBSZXF1ZXN0XG4gICAgICAgICwgJ2FjY2VwdCc6IHtcbiAgICAgICAgICAgICAgJyonOiAgJ3RleHQvamF2YXNjcmlwdCwgdGV4dC9odG1sLCBhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sLCAqLyonXG4gICAgICAgICAgICAsICd4bWwnOiAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnXG4gICAgICAgICAgICAsICdodG1sJzogJ3RleHQvaHRtbCdcbiAgICAgICAgICAgICwgJ3RleHQnOiAndGV4dC9wbGFpbidcbiAgICAgICAgICAgICwgJ2pzb24nOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgICAgLCAnanMnOiAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCB0ZXh0L2phdmFzY3JpcHQnXG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCB4aHIgPSBmdW5jdGlvbihvKSB7XG4gICAgICAgIC8vIGlzIGl0IHgtZG9tYWluXG4gICAgICAgIGlmIChvWydjcm9zc09yaWdpbiddID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHhociA9IGNvbnRleHRbeG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHRbeERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dFt4bWxIdHRwUmVxdWVzdF0pIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfSBlbHNlIGlmIChYSFIyKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYSFIyKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICwgZ2xvYmFsU2V0dXBPcHRpb25zID0ge1xuICAgICAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH1cblxuICBmdW5jdGlvbiBzdWNjZWVkKHIpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBwcm90b2NvbFJlLmV4ZWMoci51cmwpXG4gICAgcHJvdG9jb2wgPSAocHJvdG9jb2wgJiYgcHJvdG9jb2xbMV0pIHx8IGNvbnRleHQubG9jYXRpb24ucHJvdG9jb2xcbiAgICByZXR1cm4gaHR0cHNSZS50ZXN0KHByb3RvY29sKSA/IHR3b0h1bmRvLnRlc3Qoci5yZXF1ZXN0LnN0YXR1cykgOiAhIXIucmVxdWVzdC5yZXNwb25zZVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5fdGltZWRPdXQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QsICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnKVxuICAgICAgaWYgKHIucmVxdWVzdCAmJiByLnJlcXVlc3RbcmVhZHlTdGF0ZV0gPT0gNCkge1xuICAgICAgICByLnJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxuICAgICAgICBpZiAoc3VjY2VlZChyKSkgc3VjY2VzcyhyLnJlcXVlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlcnJvcihyLnJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SGVhZGVycyhodHRwLCBvKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBvWydoZWFkZXJzJ10gfHwge31cbiAgICAgICwgaFxuXG4gICAgaGVhZGVyc1snQWNjZXB0J10gPSBoZWFkZXJzWydBY2NlcHQnXVxuICAgICAgfHwgZGVmYXVsdEhlYWRlcnNbJ2FjY2VwdCddW29bJ3R5cGUnXV1cbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzWydhY2NlcHQnXVsnKiddXG5cbiAgICB2YXIgaXNBRm9ybURhdGEgPSB0eXBlb2YgRm9ybURhdGEgIT09ICd1bmRlZmluZWQnICYmIChvWydkYXRhJ10gaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghb1snY3Jvc3NPcmlnaW4nXSAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzWydyZXF1ZXN0ZWRXaXRoJ11cbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdICYmICFpc0FGb3JtRGF0YSkgaGVhZGVyc1tjb250ZW50VHlwZV0gPSBvWydjb250ZW50VHlwZSddIHx8IGRlZmF1bHRIZWFkZXJzWydjb250ZW50VHlwZSddXG4gICAgZm9yIChoIGluIGhlYWRlcnMpXG4gICAgICBoZWFkZXJzLmhhc093blByb3BlcnR5KGgpICYmICdzZXRSZXF1ZXN0SGVhZGVyJyBpbiBodHRwICYmIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihoLCBoZWFkZXJzW2hdKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q3JlZGVudGlhbHMoaHR0cCwgbykge1xuICAgIGlmICh0eXBlb2Ygb1snd2l0aENyZWRlbnRpYWxzJ10gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBodHRwLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGh0dHAud2l0aENyZWRlbnRpYWxzID0gISFvWyd3aXRoQ3JlZGVudGlhbHMnXVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYWxDYWxsYmFjayhkYXRhKSB7XG4gICAgbGFzdFZhbHVlID0gZGF0YVxuICB9XG5cbiAgZnVuY3Rpb24gdXJsYXBwZW5kICh1cmwsIHMpIHtcbiAgICByZXR1cm4gdXJsICsgKC9cXD8vLnRlc3QodXJsKSA/ICcmJyA6ICc/JykgKyBzXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVKc29ucChvLCBmbiwgZXJyLCB1cmwpIHtcbiAgICB2YXIgcmVxSWQgPSB1bmlxaWQrK1xuICAgICAgLCBjYmtleSA9IG9bJ2pzb25wQ2FsbGJhY2snXSB8fCAnY2FsbGJhY2snIC8vIHRoZSAnY2FsbGJhY2snIGtleVxuICAgICAgLCBjYnZhbCA9IG9bJ2pzb25wQ2FsbGJhY2tOYW1lJ10gfHwgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeChyZXFJZClcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICBjb250ZXh0W2NidmFsXSA9IGdlbmVyYWxDYWxsYmFja1xuXG4gICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgIHNjcmlwdC5zcmMgPSB1cmxcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlICE9PSAndW5kZWZpbmVkJyAmJiAhaXNJRTEwKSB7XG4gICAgICAvLyBuZWVkIHRoaXMgZm9yIElFIGR1ZSB0byBvdXQtb2Ytb3JkZXIgb25yZWFkeXN0YXRlY2hhbmdlKCksIGJpbmRpbmcgc2NyaXB0XG4gICAgICAvLyBleGVjdXRpb24gdG8gYW4gZXZlbnQgbGlzdGVuZXIgZ2l2ZXMgdXMgY29udHJvbCBvdmVyIHdoZW4gdGhlIHNjcmlwdFxuICAgICAgLy8gaXMgZXhlY3V0ZWQuIFNlZSBodHRwOi8vamF1Ym91cmcubmV0LzIwMTAvMDcvbG9hZGluZy1zY3JpcHQtYXMtb25jbGljay1oYW5kbGVyLW9mLmh0bWxcbiAgICAgIHNjcmlwdC5odG1sRm9yID0gc2NyaXB0LmlkID0gJ19yZXF3ZXN0XycgKyByZXFJZFxuICAgIH1cblxuICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKChzY3JpcHRbcmVhZHlTdGF0ZV0gJiYgc2NyaXB0W3JlYWR5U3RhdGVdICE9PSAnY29tcGxldGUnICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2xvYWRlZCcpIHx8IGxvYWRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgc2NyaXB0Lm9uY2xpY2sgJiYgc2NyaXB0Lm9uY2xpY2soKVxuICAgICAgLy8gQ2FsbCB0aGUgdXNlciBjYWxsYmFjayB3aXRoIHRoZSBsYXN0IHZhbHVlIHN0b3JlZCBhbmQgY2xlYW4gdXAgdmFsdWVzIGFuZCBzY3JpcHRzLlxuICAgICAgZm4obGFzdFZhbHVlKVxuICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgIGxvYWRlZCA9IDFcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHNjcmlwdCB0byB0aGUgRE9NIGhlYWRcbiAgICBoZWFkLmFwcGVuZENoaWxkKHNjcmlwdClcblxuICAgIC8vIEVuYWJsZSBKU09OUCB0aW1lb3V0XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbFxuICAgICAgICBlcnIoe30sICdSZXF1ZXN0IGlzIGFib3J0ZWQ6IHRpbWVvdXQnLCB7fSlcbiAgICAgICAgbGFzdFZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgIGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICAgICAgICBsb2FkZWQgPSAxXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVxdWVzdChmbiwgZXJyKSB7XG4gICAgdmFyIG8gPSB0aGlzLm9cbiAgICAgICwgbWV0aG9kID0gKG9bJ21ldGhvZCddIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAsIHVybCA9IHR5cGVvZiBvID09PSAnc3RyaW5nJyA/IG8gOiBvWyd1cmwnXVxuICAgICAgLy8gY29udmVydCBub24tc3RyaW5nIG9iamVjdHMgdG8gcXVlcnktc3RyaW5nIGZvcm0gdW5sZXNzIG9bJ3Byb2Nlc3NEYXRhJ10gaXMgZmFsc2VcbiAgICAgICwgZGF0YSA9IChvWydwcm9jZXNzRGF0YSddICE9PSBmYWxzZSAmJiBvWydkYXRhJ10gJiYgdHlwZW9mIG9bJ2RhdGEnXSAhPT0gJ3N0cmluZycpXG4gICAgICAgID8gcmVxd2VzdC50b1F1ZXJ5U3RyaW5nKG9bJ2RhdGEnXSlcbiAgICAgICAgOiAob1snZGF0YSddIHx8IG51bGwpXG4gICAgICAsIGh0dHBcbiAgICAgICwgc2VuZFdhaXQgPSBmYWxzZVxuXG4gICAgLy8gaWYgd2UncmUgd29ya2luZyBvbiBhIEdFVCByZXF1ZXN0IGFuZCB3ZSBoYXZlIGRhdGEgdGhlbiB3ZSBzaG91bGQgYXBwZW5kXG4gICAgLy8gcXVlcnkgc3RyaW5nIHRvIGVuZCBvZiBVUkwgYW5kIG5vdCBwb3N0IGRhdGFcbiAgICBpZiAoKG9bJ3R5cGUnXSA9PSAnanNvbnAnIHx8IG1ldGhvZCA9PSAnR0VUJykgJiYgZGF0YSkge1xuICAgICAgdXJsID0gdXJsYXBwZW5kKHVybCwgZGF0YSlcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKG9bJ3R5cGUnXSA9PSAnanNvbnAnKSByZXR1cm4gaGFuZGxlSnNvbnAobywgZm4sIGVyciwgdXJsKVxuXG4gICAgLy8gZ2V0IHRoZSB4aHIgZnJvbSB0aGUgZmFjdG9yeSBpZiBwYXNzZWRcbiAgICAvLyBpZiB0aGUgZmFjdG9yeSByZXR1cm5zIG51bGwsIGZhbGwtYmFjayB0byBvdXJzXG4gICAgaHR0cCA9IChvLnhociAmJiBvLnhocihvKSkgfHwgeGhyKG8pXG5cbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG9bJ2FzeW5jJ10gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmIChjb250ZXh0W3hEb21haW5SZXF1ZXN0XSAmJiBodHRwIGluc3RhbmNlb2YgY29udGV4dFt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgaHR0cC5vbmxvYWQgPSBmblxuICAgICAgICBodHRwLm9uZXJyb3IgPSBlcnJcbiAgICAgICAgLy8gTk9URTogc2VlXG4gICAgICAgIC8vIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9lbi1VUy9pZXdlYmRldmVsb3BtZW50L3RocmVhZC8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmVcbiAgICAgICAgaHR0cC5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fVxuICAgICAgICBzZW5kV2FpdCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVSZWFkeVN0YXRlKHRoaXMsIGZuLCBlcnIpXG4gICAgfVxuICAgIG9bJ2JlZm9yZSddICYmIG9bJ2JlZm9yZSddKGh0dHApXG4gICAgaWYgKHNlbmRXYWl0KSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHR0cC5zZW5kKGRhdGEpXG4gICAgICB9LCAyMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgIH1cbiAgICByZXR1cm4gaHR0cFxuICB9XG5cbiAgZnVuY3Rpb24gUmVxd2VzdChvLCBmbikge1xuICAgIHRoaXMubyA9IG9cbiAgICB0aGlzLmZuID0gZm5cblxuICAgIGluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHlwZShoZWFkZXIpIHtcbiAgICAvLyBqc29uLCBqYXZhc2NyaXB0LCB0ZXh0L3BsYWluLCB0ZXh0L2h0bWwsIHhtbFxuICAgIGlmIChoZWFkZXIgPT09IG51bGwpIHJldHVybiB1bmRlZmluZWQ7IC8vSW4gY2FzZSBvZiBubyBjb250ZW50LXR5cGUuXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnanNvbicpKSByZXR1cm4gJ2pzb24nXG4gICAgaWYgKGhlYWRlci5tYXRjaCgnamF2YXNjcmlwdCcpKSByZXR1cm4gJ2pzJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3RleHQnKSkgcmV0dXJuICdodG1sJ1xuICAgIGlmIChoZWFkZXIubWF0Y2goJ3htbCcpKSByZXR1cm4gJ3htbCdcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQobywgZm4pIHtcblxuICAgIHRoaXMudXJsID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyBvIDogb1sndXJsJ11cbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyB3aGV0aGVyIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkIGZvciBwdXJwb3NlXG4gICAgLy8gb2YgdHJhY2tpbmcgdGhlIFByb21pc2VzXG4gICAgdGhpcy5fZnVsZmlsbGVkID0gZmFsc2VcbiAgICAvLyBzdWNjZXNzIGhhbmRsZXJzXG4gICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbigpe31cbiAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzID0gW11cbiAgICAvLyBlcnJvciBoYW5kbGVyc1xuICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMgPSBbXVxuICAgIC8vIGNvbXBsZXRlIChib3RoIHN1Y2Nlc3MgYW5kIGZhaWwpIGhhbmRsZXJzXG4gICAgdGhpcy5fY29tcGxldGVIYW5kbGVycyA9IFtdXG4gICAgdGhpcy5fZXJyZWQgPSBmYWxzZVxuICAgIHRoaXMuX3Jlc3BvbnNlQXJncyA9IHt9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgIGZuID0gZm4gfHwgZnVuY3Rpb24gKCkge31cblxuICAgIGlmIChvWyd0aW1lb3V0J10pIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lZE91dCgpXG4gICAgICB9LCBvWyd0aW1lb3V0J10pXG4gICAgfVxuXG4gICAgaWYgKG9bJ3N1Y2Nlc3MnXSkge1xuICAgICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ3N1Y2Nlc3MnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9bJ2Vycm9yJ10pIHtcbiAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9bJ2Vycm9yJ10uYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAob1snY29tcGxldGUnXSkge1xuICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1snY29tcGxldGUnXS5hcHBseShvLCBhcmd1bWVudHMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlIChyZXNwKSB7XG4gICAgICBvWyd0aW1lb3V0J10gJiYgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcbiAgICAgIHNlbGYudGltZW91dCA9IG51bGxcbiAgICAgIHdoaWxlIChzZWxmLl9jb21wbGV0ZUhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5fY29tcGxldGVIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VjY2VzcyAocmVzcCkge1xuICAgICAgdmFyIHR5cGUgPSBvWyd0eXBlJ10gfHwgcmVzcCAmJiBzZXRUeXBlKHJlc3AuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpKSAvLyByZXNwIGNhbiBiZSB1bmRlZmluZWQgaW4gSUVcbiAgICAgIHJlc3AgPSAodHlwZSAhPT0gJ2pzb25wJykgPyBzZWxmLnJlcXVlc3QgOiByZXNwXG4gICAgICAvLyB1c2UgZ2xvYmFsIGRhdGEgZmlsdGVyIG9uIHJlc3BvbnNlIHRleHRcbiAgICAgIHZhciBmaWx0ZXJlZFJlc3BvbnNlID0gZ2xvYmFsU2V0dXBPcHRpb25zLmRhdGFGaWx0ZXIocmVzcC5yZXNwb25zZVRleHQsIHR5cGUpXG4gICAgICAgICwgciA9IGZpbHRlcmVkUmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0ID0gclxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjYW4ndCBhc3NpZ24gdGhpcyBpbiBJRTw9OCwganVzdCBpZ25vcmVcbiAgICAgIH1cbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IGNvbnRleHQuSlNPTiA/IGNvbnRleHQuSlNPTi5wYXJzZShyKSA6IGV2YWwoJygnICsgciArICcpJylcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcihyZXNwLCAnQ291bGQgbm90IHBhcnNlIEpTT04gaW4gcmVzcG9uc2UnLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgICByZXNwID0gZXZhbChyKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgIHJlc3AgPSByXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAneG1sJzpcbiAgICAgICAgICByZXNwID0gcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IgLy8gSUUgdHJvbG9sb1xuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IuZXJyb3JDb2RlXG4gICAgICAgICAgICAgICYmIHJlc3AucmVzcG9uc2VYTUwucGFyc2VFcnJvci5yZWFzb25cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiByZXNwLnJlc3BvbnNlWE1MXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX2Z1bGZpbGxlZCA9IHRydWVcbiAgICAgIGZuKHJlc3ApXG4gICAgICBzZWxmLl9zdWNjZXNzSGFuZGxlcihyZXNwKVxuICAgICAgd2hpbGUgKHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXNwID0gc2VsZi5fZnVsZmlsbG1lbnRIYW5kbGVycy5zaGlmdCgpKHJlc3ApXG4gICAgICB9XG5cbiAgICAgIGNvbXBsZXRlKHJlc3ApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZWRPdXQoKSB7XG4gICAgICBzZWxmLl90aW1lZE91dCA9IHRydWVcbiAgICAgIHNlbGYucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3IocmVzcCwgbXNnLCB0KSB7XG4gICAgICByZXNwID0gc2VsZi5yZXF1ZXN0XG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MucmVzcCA9IHJlc3BcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy5tc2cgPSBtc2dcbiAgICAgIHNlbGYuX3Jlc3BvbnNlQXJncy50ID0gdFxuICAgICAgc2VsZi5fZXJyZWQgPSB0cnVlXG4gICAgICB3aGlsZSAoc2VsZi5fZXJyb3JIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2Vycm9ySGFuZGxlcnMuc2hpZnQoKShyZXNwLCBtc2csIHQpXG4gICAgICB9XG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIHRoaXMucmVxdWVzdCA9IGdldFJlcXVlc3QuY2FsbCh0aGlzLCBzdWNjZXNzLCBlcnJvcilcbiAgfVxuXG4gIFJlcXdlc3QucHJvdG90eXBlID0ge1xuICAgIGFib3J0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9hYm9ydGVkID0gdHJ1ZVxuICAgICAgdGhpcy5yZXF1ZXN0LmFib3J0KClcbiAgICB9XG5cbiAgLCByZXRyeTogZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdC5jYWxsKHRoaXMsIHRoaXMubywgdGhpcy5mbilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTbWFsbCBkZXZpYXRpb24gZnJvbSB0aGUgUHJvbWlzZXMgQSBDb21tb25KcyBzcGVjaWZpY2F0aW9uXG4gICAgICogaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvUHJvbWlzZXMvQVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogYHRoZW5gIHdpbGwgZXhlY3V0ZSB1cG9uIHN1Y2Nlc3NmdWwgcmVxdWVzdHNcbiAgICAgKi9cbiAgLCB0aGVuOiBmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge31cbiAgICAgIGZhaWwgPSBmYWlsIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkKSB7XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwID0gc3VjY2Vzcyh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZmFpbCh0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzLnB1c2goc3VjY2VzcylcbiAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVycy5wdXNoKGZhaWwpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBhbHdheXNgIHdpbGwgZXhlY3V0ZSB3aGV0aGVyIHRoZSByZXF1ZXN0IHN1Y2NlZWRzIG9yIGZhaWxzXG4gICAgICovXG4gICwgYWx3YXlzOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9mdWxmaWxsZWQgfHwgdGhpcy5fZXJyZWQpIHtcbiAgICAgICAgZm4odGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wbGV0ZUhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGBmYWlsYCB3aWxsIGV4ZWN1dGUgd2hlbiB0aGUgcmVxdWVzdCBmYWlsc1xuICAgICAqL1xuICAsIGZhaWw6IGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwLCB0aGlzLl9yZXNwb25zZUFyZ3MubXNnLCB0aGlzLl9yZXNwb25zZUFyZ3MudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmbilcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAsICdjYXRjaCc6IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIHRoaXMuZmFpbChmbilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXF3ZXN0KG8sIGZuKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgLy8gbm9ybWFsaXplIG5ld2xpbmUgdmFyaWFudHMgYWNjb3JkaW5nIHRvIHNwZWMgLT4gQ1JMRlxuICBmdW5jdGlvbiBub3JtYWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC9cXHI/XFxuL2csICdcXHJcXG4nKSA6ICcnXG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWwoZWwsIGNiKSB7XG4gICAgdmFyIG4gPSBlbC5uYW1lXG4gICAgICAsIHQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICwgb3B0Q2IgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgIC8vIElFIGdpdmVzIHZhbHVlPVwiXCIgZXZlbiB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBhdHRyaWJ1dGVcbiAgICAgICAgICAvLyAnc3BlY2lmaWVkJyByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUNvcmUvY29yZS5odG1sI0lELTg2MjUyOTI3M1xuICAgICAgICAgIGlmIChvICYmICFvWydkaXNhYmxlZCddKVxuICAgICAgICAgICAgY2Iobiwgbm9ybWFsaXplKG9bJ2F0dHJpYnV0ZXMnXVsndmFsdWUnXSAmJiBvWydhdHRyaWJ1dGVzJ11bJ3ZhbHVlJ11bJ3NwZWNpZmllZCddID8gb1sndmFsdWUnXSA6IG9bJ3RleHQnXSkpXG4gICAgICAgIH1cbiAgICAgICwgY2gsIHJhLCB2YWwsIGlcblxuICAgIC8vIGRvbid0IHNlcmlhbGl6ZSBlbGVtZW50cyB0aGF0IGFyZSBkaXNhYmxlZCBvciB3aXRob3V0IGEgbmFtZVxuICAgIGlmIChlbC5kaXNhYmxlZCB8fCAhbikgcmV0dXJuXG5cbiAgICBzd2l0Y2ggKHQpIHtcbiAgICBjYXNlICdpbnB1dCc6XG4gICAgICBpZiAoIS9yZXNldHxidXR0b258aW1hZ2V8ZmlsZS9pLnRlc3QoZWwudHlwZSkpIHtcbiAgICAgICAgY2ggPSAvY2hlY2tib3gvaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHJhID0gL3JhZGlvL2kudGVzdChlbC50eXBlKVxuICAgICAgICB2YWwgPSBlbC52YWx1ZVxuICAgICAgICAvLyBXZWJLaXQgZ2l2ZXMgdXMgXCJcIiBpbnN0ZWFkIG9mIFwib25cIiBpZiBhIGNoZWNrYm94IGhhcyBubyB2YWx1ZSwgc28gY29ycmVjdCBpdCBoZXJlXG4gICAgICAgIDsoIShjaCB8fCByYSkgfHwgZWwuY2hlY2tlZCkgJiYgY2Iobiwgbm9ybWFsaXplKGNoICYmIHZhbCA9PT0gJycgPyAnb24nIDogdmFsKSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgY2Iobiwgbm9ybWFsaXplKGVsLnZhbHVlKSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgIGlmIChlbC50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3Qtb25lJykge1xuICAgICAgICBvcHRDYihlbC5zZWxlY3RlZEluZGV4ID49IDAgPyBlbC5vcHRpb25zW2VsLnNlbGVjdGVkSW5kZXhdIDogbnVsbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGVsLmxlbmd0aCAmJiBpIDwgZWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbC5vcHRpb25zW2ldLnNlbGVjdGVkICYmIG9wdENiKGVsLm9wdGlvbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gY29sbGVjdCB1cCBhbGwgZm9ybSBlbGVtZW50cyBmb3VuZCBmcm9tIHRoZSBwYXNzZWQgYXJndW1lbnQgZWxlbWVudHMgYWxsXG4gIC8vIHRoZSB3YXkgZG93biB0byBjaGlsZCBlbGVtZW50czsgcGFzcyBhICc8Zm9ybT4nIG9yIGZvcm0gZmllbGRzLlxuICAvLyBjYWxsZWQgd2l0aCAndGhpcyc9Y2FsbGJhY2sgdG8gdXNlIGZvciBzZXJpYWwoKSBvbiBlYWNoIGVsZW1lbnRcbiAgZnVuY3Rpb24gZWFjaEZvcm1FbGVtZW50KCkge1xuICAgIHZhciBjYiA9IHRoaXNcbiAgICAgICwgZSwgaVxuICAgICAgLCBzZXJpYWxpemVTdWJ0YWdzID0gZnVuY3Rpb24gKGUsIHRhZ3MpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgZmFcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZmEgPSBlW2J5VGFnXSh0YWdzW2ldKVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGZhLmxlbmd0aDsgaisrKSBzZXJpYWwoZmFbal0sIGNiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgZSA9IGFyZ3VtZW50c1tpXVxuICAgICAgaWYgKC9pbnB1dHxzZWxlY3R8dGV4dGFyZWEvaS50ZXN0KGUudGFnTmFtZSkpIHNlcmlhbChlLCBjYilcbiAgICAgIHNlcmlhbGl6ZVN1YnRhZ3MoZSwgWyAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJyBdKVxuICAgIH1cbiAgfVxuXG4gIC8vIHN0YW5kYXJkIHF1ZXJ5IHN0cmluZyBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZVF1ZXJ5U3RyaW5nKCkge1xuICAgIHJldHVybiByZXF3ZXN0LnRvUXVlcnlTdHJpbmcocmVxd2VzdC5zZXJpYWxpemVBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICB9XG5cbiAgLy8geyAnbmFtZSc6ICd2YWx1ZScsIC4uLiB9IHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplSGFzaCgpIHtcbiAgICB2YXIgaGFzaCA9IHt9XG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKG5hbWUgaW4gaGFzaCkge1xuICAgICAgICBoYXNoW25hbWVdICYmICFpc0FycmF5KGhhc2hbbmFtZV0pICYmIChoYXNoW25hbWVdID0gW2hhc2hbbmFtZV1dKVxuICAgICAgICBoYXNoW25hbWVdLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2UgaGFzaFtuYW1lXSA9IHZhbHVlXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBoYXNoXG4gIH1cblxuICAvLyBbIHsgbmFtZTogJ25hbWUnLCB2YWx1ZTogJ3ZhbHVlJyB9LCAuLi4gXSBzdHlsZSBzZXJpYWxpemF0aW9uXG4gIHJlcXdlc3Quc2VyaWFsaXplQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyciA9IFtdXG4gICAgZWFjaEZvcm1FbGVtZW50LmFwcGx5KGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgYXJyLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0pXG4gICAgfSwgYXJndW1lbnRzKVxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIHJlcXdlc3Quc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgICB2YXIgb3B0LCBmblxuICAgICAgLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXG4gICAgb3B0ID0gYXJncy5wb3AoKVxuICAgIG9wdCAmJiBvcHQubm9kZVR5cGUgJiYgYXJncy5wdXNoKG9wdCkgJiYgKG9wdCA9IG51bGwpXG4gICAgb3B0ICYmIChvcHQgPSBvcHQudHlwZSlcblxuICAgIGlmIChvcHQgPT0gJ21hcCcpIGZuID0gc2VyaWFsaXplSGFzaFxuICAgIGVsc2UgaWYgKG9wdCA9PSAnYXJyYXknKSBmbiA9IHJlcXdlc3Quc2VyaWFsaXplQXJyYXlcbiAgICBlbHNlIGZuID0gc2VyaWFsaXplUXVlcnlTdHJpbmdcblxuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG5cbiAgcmVxd2VzdC50b1F1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG8sIHRyYWQpIHtcbiAgICB2YXIgcHJlZml4LCBpXG4gICAgICAsIHRyYWRpdGlvbmFsID0gdHJhZCB8fCBmYWxzZVxuICAgICAgLCBzID0gW11cbiAgICAgICwgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgICAsIGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgLy8gSWYgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGFuZCByZXR1cm4gaXRzIHZhbHVlXG4gICAgICAgICAgdmFsdWUgPSAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHZhbHVlKSA/IHZhbHVlKCkgOiAodmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWUpXG4gICAgICAgICAgc1tzLmxlbmd0aF0gPSBlbmMoa2V5KSArICc9JyArIGVuYyh2YWx1ZSlcbiAgICAgICAgfVxuICAgIC8vIElmIGFuIGFycmF5IHdhcyBwYXNzZWQgaW4sIGFzc3VtZSB0aGF0IGl0IGlzIGFuIGFycmF5IG9mIGZvcm0gZWxlbWVudHMuXG4gICAgaWYgKGlzQXJyYXkobykpIHtcbiAgICAgIGZvciAoaSA9IDA7IG8gJiYgaSA8IG8ubGVuZ3RoOyBpKyspIGFkZChvW2ldWyduYW1lJ10sIG9baV1bJ3ZhbHVlJ10pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRyYWRpdGlvbmFsLCBlbmNvZGUgdGhlIFwib2xkXCIgd2F5ICh0aGUgd2F5IDEuMy4yIG9yIG9sZGVyXG4gICAgICAvLyBkaWQgaXQpLCBvdGhlcndpc2UgZW5jb2RlIHBhcmFtcyByZWN1cnNpdmVseS5cbiAgICAgIGZvciAocHJlZml4IGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkocHJlZml4KSkgYnVpbGRQYXJhbXMocHJlZml4LCBvW3ByZWZpeF0sIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BhY2VzIHNob3VsZCBiZSArIGFjY29yZGluZyB0byBzcGVjXG4gICAgcmV0dXJuIHMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpXG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFBhcmFtcyhwcmVmaXgsIG9iaiwgdHJhZGl0aW9uYWwsIGFkZCkge1xuICAgIHZhciBuYW1lLCBpLCB2XG4gICAgICAsIHJicmFja2V0ID0gL1xcW1xcXSQvXG5cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAvLyBTZXJpYWxpemUgYXJyYXkgaXRlbS5cbiAgICAgIGZvciAoaSA9IDA7IG9iaiAmJiBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHYgPSBvYmpbaV1cbiAgICAgICAgaWYgKHRyYWRpdGlvbmFsIHx8IHJicmFja2V0LnRlc3QocHJlZml4KSkge1xuICAgICAgICAgIC8vIFRyZWF0IGVhY2ggYXJyYXkgaXRlbSBhcyBhIHNjYWxhci5cbiAgICAgICAgICBhZGQocHJlZml4LCB2KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArICh0eXBlb2YgdiA9PT0gJ29iamVjdCcgPyBpIDogJycpICsgJ10nLCB2LCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAvLyBTZXJpYWxpemUgb2JqZWN0IGl0ZW0uXG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGJ1aWxkUGFyYW1zKHByZWZpeCArICdbJyArIG5hbWUgKyAnXScsIG9ialtuYW1lXSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZXJpYWxpemUgc2NhbGFyIGl0ZW0uXG4gICAgICBhZGQocHJlZml4LCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxd2VzdC5nZXRjYWxsYmFja1ByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tQcmVmaXhcbiAgfVxuXG4gIC8vIGpRdWVyeSBhbmQgWmVwdG8gY29tcGF0aWJpbGl0eSwgZGlmZmVyZW5jZXMgY2FuIGJlIHJlbWFwcGVkIGhlcmUgc28geW91IGNhbiBjYWxsXG4gIC8vIC5hamF4LmNvbXBhdChvcHRpb25zLCBjYWxsYmFjaylcbiAgcmVxd2VzdC5jb21wYXQgPSBmdW5jdGlvbiAobywgZm4pIHtcbiAgICBpZiAobykge1xuICAgICAgb1sndHlwZSddICYmIChvWydtZXRob2QnXSA9IG9bJ3R5cGUnXSkgJiYgZGVsZXRlIG9bJ3R5cGUnXVxuICAgICAgb1snZGF0YVR5cGUnXSAmJiAob1sndHlwZSddID0gb1snZGF0YVR5cGUnXSlcbiAgICAgIG9bJ2pzb25wQ2FsbGJhY2snXSAmJiAob1snanNvbnBDYWxsYmFja05hbWUnXSA9IG9bJ2pzb25wQ2FsbGJhY2snXSkgJiYgZGVsZXRlIG9bJ2pzb25wQ2FsbGJhY2snXVxuICAgICAgb1snanNvbnAnXSAmJiAob1snanNvbnBDYWxsYmFjayddID0gb1snanNvbnAnXSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZXF3ZXN0KG8sIGZuKVxuICB9XG5cbiAgcmVxd2VzdC5hamF4U2V0dXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgZm9yICh2YXIgayBpbiBvcHRpb25zKSB7XG4gICAgICBnbG9iYWxTZXR1cE9wdGlvbnNba10gPSBvcHRpb25zW2tdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcXdlc3Rcbn0pO1xuIiwiXG5tb2R1bGUuZXhwb3J0cy5jb25zdGFudHMgPSByZXF1aXJlKFwiLi4vanMvY29uc3RhbnRzLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMuQnV0dG9uc01hbmFnZXIgPSByZXF1aXJlKFwiLi4vanMvQnV0dG9uc01hbmFnZXIuanNcIik7XG5tb2R1bGUuZXhwb3J0cy5Db21tb25EYXRhID0gcmVxdWlyZShcIi4uL2pzL0NvbW1vbkRhdGEuanNcIik7XG5tb2R1bGUuZXhwb3J0cy5FbGl4aXJFdmVudERhdGEgPSByZXF1aXJlKFwiLi4vanMvRWxpeGlyRXZlbnREYXRhLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMuRWxpeGlyUmVnaXN0cnlEYXRhID0gcmVxdWlyZShcIi4uL2pzL0VsaXhpclJlZ2lzdHJ5RGF0YS5qc1wiKTtcbm1vZHVsZS5leHBvcnRzLkVsaXhpclRyYWluaW5nRGF0YSA9IHJlcXVpcmUoXCIuLi9qcy9FbGl4aXJUcmFpbmluZ0RhdGEuanNcIik7XG5tb2R1bGUuZXhwb3J0cy5Db250ZXh0RGF0YUxpc3QgPSByZXF1aXJlKFwiLi4vanMvQ29udGV4dERhdGFMaXN0LmpzXCIpO1xubW9kdWxlLmV4cG9ydHMuRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi4vanMvRGF0YU1hbmFnZXIuanNcIik7XG5tb2R1bGUuZXhwb3J0cy5QYWdlTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9qcy9QYWdlTWFuYWdlci5qc1wiKTtcbm1vZHVsZS5leHBvcnRzLkJpb0NpZGVyID0gcmVxdWlyZShcIi4uL2pzL0Jpb0NpZGVyLmpzXCIpOyJdfQ==
