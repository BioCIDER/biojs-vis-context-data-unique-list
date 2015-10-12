
document.addEventListener("DOMContentLoaded", function(e) {
    
    var contextDataListInstance = new ContextDataList({
      targetId: 'context_data_list',
      //userTextClassContainer: 'contextualisation_text',
      userTextTagContainer: 'h1',
      numberResults: 5,
      displayStyle: ContextDataList.COMMON_STYLE
    });	
    
    // before initialising the main component, we should initialise its 'plugins'.
    var buttonsInstance = new ButtonsManager(contextDataListInstance,{
      targetId: 'buttons_manager_container'
    });
    
    buttonsInstance.buildPressedButtons();
    
    
    var pageManagerInstance = new PageManager(contextDataListInstance,{
      targetId: 'page_manager_container'
    });
    
    pageManagerInstance.build();
    
    
    //triggers the contextualised data loading process
    contextDataListInstance.drawContextDataList();
    
});  