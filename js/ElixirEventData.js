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
      