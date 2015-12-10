# BioCider: a Contextualisation InDEx for biological Resources discovery
## biojs-vis-context-data-unique-list

Contextualised visualisation of ELIXIR training materials, events and computing tools in a unique list.
BETA VERSION.

Purpose of this widget is to show the user, without any direct action by himself, information of his interest related with the content that is being shown currently to him .

To achieve this, we collect in a Solr system information of different repositories (Elixir Service Registry, Elixir Training Portal, and Elixir Events Portal, until now), so we can search into this information which is related with content accesed by user.

## BioCider structure

BioCider consists of 3 different subcomponents that work together:

1. **ContextDataList**. Is the main subcomponent and responsable of showing the information. Comprises some different javascript classes.
2. **ButtonsManager**. It allows filtering contents by its type.
3. **PageManager**. It allows navigating by all results.

## Including BioCider in your site

BioCider uses [npm](https://www.npmjs.com) as package manager. If you already have it, to download BioCider you only need to execute

`npm install biocider`

And use the `require` function to use it:

`var BioCider = require('biocider');`

### Starting

BioCider adopts the appeareance of the main page in which it will be embedded, but it needs a minimum set of its own styles in order to be shown properly.

So, first of all, in your html file you will need to include a reference to its css file:

```
<link href="../css/common.css" rel="stylesheet">
```

Secondly, into the `body` tag you will need two mandatory fields in order to give the minimum working information to BioCider:

1. The container of the main text that BioCider will use to search and retrieve related and significant information.
2. BioCider container itself.

One example of them could be:

```
<body>
<div class="userTextContainer"></div>
<div id="snippetDiv"> </div>
...

```

Both of them can have different attributes that we will describe later.

### Component initialization

To initialize BioCider, you only need to implement these easy steps:

* Include `biocider.js` javascript library.
* Obtain BioCider object with `require` instruction.
* Create the new BioCider object with the proper parameters.
* Execute its `draw()` function.

This could be an example of a basic BioCider initialization:

```
<script src="../build/biocider.js"></script>
<script>
BioCider = require("biocider");
var bioCiderInstance = new BioCider('snippetDiv',{'userTextClassContainer':'userTextContainer'},{},{});
bioCiderInstance.draw();
</script>
```


### Component parameters


BioCider supports many different initialization options. Some of them have default values, but others are mandatory.
There are 4 different main parameters:

1. BioCider container id (mandatory).
2. ContextDataList parameters object. You should provide a valid reference to the user's text container, providing *userTextIdContainer*, *userTextClassContainer* or *userTextTagContainer* values.
3. ButtonsManager parameters object.
4. PageManager parameters object.

```
new BioCider(id_biocider_container,{ContextDataList parameters},{ButtonsManager parameters},{PageManager parameters});
```


#### ContextDataList parameters


 * `targetId`: Identifier of the container where the ContextDataList object should be displayed.
 * 	`targetClass`: Class name of the container where the ContextDataList object should be displayed.  
 * 	`displayStyle`: Type of rows visualisation. This can take 2 discrete values: *ContextDataList.FULL_STYLE* or *ContextDataList.COMMON_STYLE*. *ContextDataList.FULL_STYLE* by default.
 * **`userTextIdContainer`**: Tag id that contains user's text to search.
 * **`userTextClassContainer`**: Class name that contains user's text to search. It's not used if *userTextIdContainer* is defined.
 * 	**`userTextTagContainer`**: Tag name that contains user's text to search. It is one stablished tag name, for example `h1`. It's not used if *userTextIdContainer* or *userTextClassContainer* is defined.
 * `userKeywordsIdContainer`: Tag id that contains user's keywords to improve search results.
 * `userKeywordsClassContainer`: Class name that contains user's keywords to improve search results. It's not used if userKeywordsIdContainer is defined.
 * `userKeywordsTagContainer`: Tag name that contains user's keywords to improve search results. It's not used if userKeywordsIdContainer or userKeywordsClassContainer is defined.
 * 	`userDescriptionClassContainer`: Class name that contains user's description to help filter same results that user is seeing.
 * 	`userHelpClassContainer`: Class name that will contain help icon.
 * 	`numberResults`: Integer that restricts the results number that should be shown.
 
 

#### ButtonsManager parameters


 * 	`targetId`: Identifier of the container where the ButtonsManager object should be displayed.
 * 	`targetClass`: Class name of the container where the ButtonsManager object should be displayed.  
 * `helpText`: boolean, *true* if you want to show a help text over the buttons.
 * 	`buttonsStyle`: Buttons visualisation type. This can take 3 discrete values: *SQUARED_3D* , *ROUND_FLAT* or *ICONS_ONLY*. *ICONS_ONLY* by default.
 * `pressedUnderlines`: Boolean. True if you want to show underlines when you press a button.


#### PageManager parameters

 
 *	`targetId`: Identifier of the container where the PageManager object should be displayed.
 * 	`targetClass`: Class name of the container where the PageManager object should be displayed.  
 
## Using BioCider

BioCider interface consists of two main areas:

1. Control panel.
2. Results viewer.

### Control panel

On one hand, BioCider control panel allows you to change the type of the results that should be shown. These types are:

* Databases
* Events
* Tools
* Training materials

By default, BioCider shows all of them, but anytime you can uncheck any of them to see only results type of your interest.

On the other hand, the control panel allows you to navigate into all results related with the page main content. They are sorted by relevance, so first results should be more relevant than later ones; but you can see them by clicking on 'Next' button.

Control panel aspect can be customised in different ways with options like *buttonsStyle* or *pressedUnderlines*.


### Results viewer

This panel show results in different ways depending on the value of *displayStyle* ContextDataList parameter. 

* *ContextDataList.COMMON_STYLE* shows only basic information shared among all different data sources.
* *ContextDataList.FULL_STYLE* (used by default) shows also specific information of each data source. This style will be explained below.


*ContextDataList.FULL_STYLE* shows results in two columns: the right one shows an icon representing the result resource type (in correspondence with the same button filters of the control panel), and the left one shows detailed content information:

1. **Title**: the result title with a link to the original resource. It also shows a special icon if this link targets to an external site (most frequent). 
2. **Topics**: EDAM tags that categorises the content.
3. **More link**: many resources offer different types of extra information, and this expandable link can show and hide it. *Events* usually show dates and location of the event, whilst others often provide detailed descriptions.