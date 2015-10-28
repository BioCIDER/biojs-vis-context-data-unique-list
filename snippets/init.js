
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
      userHelpClassContainer: 'contex_help_container'
      //userHelpTagContainer: 'h1'
      //includeSameSiteResults: false
      
      // ADD TEXT LEGENT BY DEFAULT?
      // CHANGE BUTTONS STYLES TO UNDERLINED 
      // CONVERT WORKFLOWS TO TOOLS - OK
      // CREATE A SUMMARY OF THE DOCUMENTATION TO LINK FROM THE
      // TRANSLUCID BUTTONS WHEN THERE ARE NO RESULTS OF THEIR TYPE - OK
    });
    
    // before initialising the main component, we should initialise its 'plugins'.
    var buttonsInstance = new ButtonsManager(contextDataListInstance,{
      targetId: 'buttons_manager_container',
      helpText: true,
      buttonsStyle:ButtonsManager.SQUARED_3D
    });
    
    buttonsInstance.buildPressedButtons();
    
    
    var pageManagerInstance = new PageManager(contextDataListInstance,{
      targetId: 'page_manager_container'
    });
    
    pageManagerInstance.build();
    
    
    //triggers the contextualised data loading process
    contextDataListInstance.drawContextDataList();
    
});  