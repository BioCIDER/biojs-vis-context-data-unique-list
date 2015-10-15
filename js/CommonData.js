/**
 *          Auxiliar function to allow inheritance in a easy way.
 */
function inheritPrototype(childObject, parentObject) {
            // We copy the properties and methods from the parentObject onto the childObject
            // So the copyOfParent object now has everything the parentObject has
            var copyOfParent = Object.create(parentObject.prototype);
            
            //Then we set the constructor of this new object to point to the childObject.
            copyOfParent.constructor = childObject;
            // Then we set the childObject prototype to copyOfParent,
            // so that the childObject can in turn inherit everything from copyOfParent (from parentObject)
            childObject.prototype = copyOfParent;
}



/**
 *          CommonData constructor
 *          jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
function CommonData (jsonData) {
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
            getDrawableObject : function(displayStyle){
                        if (displayStyle == ContextDataList.COMMON_STYLE){
                                    return this.getCommonDrawableObject();
                        }else if (displayStyle == ContextDataList.FULL_STYLE){
                                    // To implement this properly we will have to pass some kind of parameter or
                                    // to call a different function.
                                    return this.getCommonDrawableObject();
                        }else return null;
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
                        var description = this.getDescriptionValue();
                        if (description != undefined && description != null) {
                                    element.title = description;
                        }
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


           
};


/**
 *          ElixirRegistryData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
function ElixirRegistryData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "elixir_registry" ;   
};

/**
 *          ElixirRegistryData child class with specific information of this kind of registries.
 */
ElixirRegistryData.prototype = {
            constructor: ElixirRegistryData
};


/**
 *          ElixirTrainingData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
function ElixirTrainingData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "ckan"; 
};

/**
 *          ElixirTrainingData child class with specific information of this kind of registries.
 */
ElixirTrainingData.prototype = {
            constructor: ElixirTrainingData
      
};


/**
 *          ElixirEventData constructor
 *          @param jsonData {Object} JSON data structure with the original data retrieved by our data server.
 *
 */
function ElixirEventData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "iann";
   
};

/**
 *          ElixirEventData child class with specific information of this kind of registries.
 */
ElixirEventData.prototype = {
            constructor: ElixirEventData     
};



// To inherit the methods and properties from CommonData
inheritPrototype(ElixirRegistryData, CommonData);
inheritPrototype(ElixirTrainingData, CommonData);
inheritPrototype(ElixirEventData, CommonData);

