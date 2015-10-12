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




function CommonData (jsonData) {
            this.jsonData = jsonData;
};


CommonData.prototype = {
            constructor: CommonData,
            SOURCE_FIELD                : "source",
            RESOURCE_TYPE_FIELD         : "resource_type",
            TITLE_FIELD                 : "title",
            TOPIC_FIELD                 : "field",
            DESCRIPTION_FIELD           : "description",
            LINK_FIELD                  : "link",
            
            // retrieves the proper class based on the resource type
            mappingResourceTypeClasses : {
                        'Tool'                  :'tools',
                        'Workflow'              :'workflow',
                        'Database'              :'database',
                        'Training Material'     :'training_material',
                        'Event'                 :'events'
            },
     
            
            getParameterisedValue : function(fieldName){
                        if (this.jsonData !== undefined && this.jsonData !== null){
                            return this.jsonData[fieldName];   
                        }else return null;
            },
            // mandatory fields
            getSourceValue : function(){
                        return this.getParameterisedValue(this.SOURCE_FIELD);      
            },
            getResourceTypeValues : function(){
                        return this.getParameterisedValue(this.RESOURCE_TYPE_FIELD);      
            },
            getTitleValue : function(){
                        return this.getParameterisedValue(this.TITLE_FIELD);      
            },
            getTopicValue : function(){
                        return this.getParameterisedValue(this.TOPIC_FIELD);      
            },
            
            // optional fields
            getDescriptionValue : function(){
                        return this.getParameterisedValue(this.DESCRIPTION_FIELD);      
            },
            getLinkValue : function(){
                        return this.getParameterisedValue(this.LINK_FIELD);      
            },
      
      
            // FUNCTIONS
      
            getDrawableObject : function(displayStyle){
                        if (displayStyle == ContextDataList.COMMON_STYLE){
                                    return this.getCommonDrawableObject();
                        }else if (displayStyle == ContextDataList.FULL_STYLE){
                                    return this.getCommonDrawableObject();
                        }else return null;
            },
            getCommonDrawableObject : function(){
                        //var listElement = document.createElement('li');
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
      
      
      
      
            getLabelTitle: function(){
                        var element = document.createElement('a');
                        element.setAttribute('href',this.getLinkValue());
                        element.innerHTML = this.getTitleValue();
                        element.setAttribute('target','_blank');
                        return element;
            },
            
            getLabelTopics: function(){
                        var element = document.createElement('div');
                        element.innerHTML = this.getTopicValue();
                        return element;
            },
            getLabelResourceTypes: function(){
                        var element = document.createElement('span');
                        element.innerHTML = this.getResourceTypeValues();
                        return element;
            },
            
            getImageResourceTypes: function(){
                        var container = document.createElement('span');
                        
                        var resourceTypes = this.getResourceTypeValues();
                        for(var i=0;i<resourceTypes.length;i++){
                                    var resource_type = resourceTypes[i];
                                    var element = document.createElement('span');
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
             * Private function to get the label for the title of a single citation
             * 
             *  @param resultElement single citation data in a JSON format
             *  @param fontsize font size of the div containing the title
             *  @param numCurrentRows number of current rows containing the citation data
             *  @param fontfamily font-family of the div containing the title
             */
            getLabelTitleAnt: function(resultElement, fontsize, numCurrentRows, fontfamily){
		var labelTitle = resultElement.title;
		
		if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
			var tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamily+';font-size:'+fontsize+'px;">' + labelTitle + '</span>'));
			var titleRows = Math.ceil(tempWidth/this._innerWidth);
			
			if (titleRows > (this.opt.numRowCompact - numCurrentRows)){
				var indexLastTitle = (labelTitle.length * (this.opt.numRowCompact - numCurrentRows)) /  titleRows;
				indexLastTitle = indexLastTitle -3;
				labelTitle = labelTitle.substring(0, indexLastTitle)
				labelTitle += "...";
			}
		}
		
		return labelTitle;
	},

            /**
	 * Private function to get the label for the authors of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 *  @param fontsize font size of the div containing the authors
	 *  @param numCurrentRows number of current rows containing the citation data
	 *  @param fontfamily font-family of the div containing the authors
	 */
	getAuthorsElement: function (resultElement, fontSize, numCurrentRows, fontfamily){
		
		var authors = resultElement.authorList.author;
		
		var authorsHtml="";
		var labelAuth="";
		var authorName="";
		var labelAuthNew="";
		var filter="";
		var tempWidth=0;
		var numAuthRows = 0;
		for (i=0; i < authors.length; i++){
			author = authors[i];
			if (i >0){
				authorsHtml += ", ";
				labelAuth += ", ";
			}
			
			if (author.fullName!=""){
				authorName = author.fullName;
			}else if (author.lastName!=""){
				authorName = author.lastName;
			}else if (author.collectiveName!=""){
				authorName = author.collectiveName;
			}else{
				authorName = "";
			}
			
			if (authorName!=undefined && authorName!=""){ 
				labelAuthNew =  labelAuth + authorName;
				filter = "AUTH:&quot;"+authorName+"&quot;";
				authorsHtmlNew =authorsHtml + "<a class=\"epmc_citation_link\" href=\"http://europepmc.org/search?query="+filter+"&page=1\">"+authorName+"</a>";
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamily+';font-size:'+fontSize+'px;">' + labelAuthNew  + '</span>'));
					numAuthRows = Math.ceil(tempWidth/this._innerWidth);
					if (numAuthRows > (this.opt.numRowCompact - numCurrentRows)){
						numAuthRows = (this.opt.numRowCompact - numCurrentRows);
						authorsHtml = authorsHtml + "...";
						labelAuth = labelAuth + "...";
						break;
					}else{
						labelAuth = labelAuthNew;
						authorsHtml = authorsHtmlNew;
					}
				}else{
					labelAuth = labelAuthNew;
					authorsHtml = authorsHtmlNew;
				}
			}
		}
		
		this._tempLabel = labelAuth;
		return authorsHtml;
	}
};



function ElixirRegistryData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "elixir_registry" ;   
};


ElixirRegistryData.prototype = {
            constructor: ElixirRegistryData
};



function ElixirTrainingData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "ckan"; 
};


ElixirTrainingData.prototype = {
            constructor: ElixirTrainingData
      
};



function ElixirEventData (jsonData) {
            this.jsonData = jsonData;
            this.SOURCE_FIELD_VALUE = "iann";
   
};

ElixirEventData.prototype = {
            constructor: ElixirEventData     
};



// To inherit the methods and properties from CommonData
inheritPrototype(ElixirRegistryData, CommonData);
inheritPrototype(ElixirTrainingData, CommonData);
inheritPrototype(ElixirEventData, CommonData);

