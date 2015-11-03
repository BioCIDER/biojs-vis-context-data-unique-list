
/*
 *  Use case example of ContextDataList widget.
 */

document.addEventListener("DOMContentLoaded", function(e) {

    var contextDataListInstance = new ContextDataList({
      targetId: 'context_data_list',
      //userTextClassContainer: 'contextualisation_text',
      userTextTagContainer: 'h1',
      numberResults: 5,
      //displayStyle: ContextDataList.COMMON_STYLE
      displayStyle: ContextDataList.FULL_STYLE,
      //userHelpClassContainer: 'contex_help_container',
      userDescriptionClassContainer: 'context_description_container'
      //userHelpTagContainer: 'h1'
      //includeSameSiteResults: false
      
      // CREATE A SUMMARY OF THE DOCUMENTATION TO LINK FROM THE
    });
    
    // before initialising the main component, we should initialise its 'plugins'.
    var buttonsInstance = new ButtonsManager(contextDataListInstance,{
      targetId: 'buttons_manager_container',
      helpText: true,
      buttonsStyle:ButtonsManager.ICONS_ONLY,
      pressedUnderlines:true
    });
    
    buttonsInstance.buildPressedButtons();
    
    
    var pageManagerInstance = new PageManager(contextDataListInstance,{
      targetId: 'page_manager_container'
    });
    
    pageManagerInstance.build();
    
    
    //triggers the contextualised data loading process
    contextDataListInstance.drawContextDataList();
    
});  