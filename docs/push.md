# Push

Permet de pousser la page pour afficher le menu via un bouton d'ouverture. Les sous-menus s'affiche au choix en panel ou accordéon ou les deux.

* Nom du menu : **push**
* Nom du fichier : **togglemenu-push.js**
* Nom de la classe : **$.ToggleMenuPush**


## Initialisation

    var toggleMenu = new $.ToggleMenu();
    
    toggleMenu.addMenu('push', {
        elements: {
            content: {
                close: 'Fermer',
                menu: $('#nav--main'),
                social: $('#nav--social')
            }
        }
    });


## Options

| Option                                                  | Type           | Valeur par défaut                                         | Description                                                                                                                                                                                                                                                                             |
|---------------------------------------------------------|----------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| elements                                                | object         | Voir ci-dessous                                           | Objet pour les options ci-dessous                                                                                                                                                                                                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;content                         | object         | Voir ci-dessous                                           | Objet pour le contenu du menu                                                                                                                                                                                                                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;menu    | Élément jQuery | undefined                                                 | Élément conteneur du menu, exemple : $('#nav')                                                                                                                                                                                                                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;items                           | Élément jQuery | undefined                                                 | Éléments parents, exemple : $('#nav').find('li.is-parent')                                                                                                                                                                                                                              |
| &nbsp;&nbsp;&nbsp;&nbsp;itemLink                        | function       | function (item) { return item.children('a'); }            | Fonction retournant le lien d'un élément parent                                                                                                                                                                                                                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;itemContent                     | function       | function (item) { return item.children('ul') ;}           | Fonction retournant le contenu d'un élément parent                                                                                                                                                                                                                                      |
| &nbsp;&nbsp;&nbsp;&nbsp;toggle                          | Élément jQuery | undefined                                                 | Élément pour le bouton d'ouverture/fermeture. Si la valeur n'est pas définie, l'élément sera $('.togglemenu-toggle')                                                                                                                                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;page                            | Élément jQuery | undefined                                                 | Élément wrapper de la page du site. Si la valeur n'est pas définie, l'élément sera $('body > div:first')                                                                                                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;back                            | Élément jQuery | undefined                                                 | Élément wrapper pour revenir au niveau précédent (en mode panel). Si la valeur n'est pas définie, l'élément sera généré automatiquement                                                                                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;backBtn                         | function       | function (wrapper) { return wrapper.children('button'); } | Fonction retournant le bouton du wrapper "back" permettant de revenir au niveau précédent (en mode panel)                                                                                                                                                                               |
| layout                                                  | string         | 'accordion'                                               | Mode d'affichage pour les sous-menus. Valeurs possibles : 'accordion', 'panel' ou 'data'. Si la valeur est 'data', le layout doit être défini en paramètre data-layout dans l'élément parent correspondant. Ainsi, il est possible de spécifier un layout différent par élément parent. |
| slideDuration                                           | integer        | 200                                                       | Durée d'animation du déroulement d'un accordéon                                                                                                                                                                                                                                         |
| backLink                                                | boolean        | false                                                     | Ajouter un lien sur le titre du niveau parent en mode d'affichage 'panel'                                                                                                                                                                                                               |
| classes                                                 | object         | Voir ci-dessous                                           | Objet pour les options ci-dessous                                                                                                                                                                                                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;copy                            | string         | '{prefix}-copy'                                           | Nom de la classe des éléments copiés dans le menu                                                                                                                                                                                                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;back                            | string         | 'item-back'                                               | Nom de la classe de l'élément "back" permettant de revenir au niveau précédent                                                                                                                                                                                                          |
| beforeLoad                                              | function       | undefined                                                 | Callback au début du chargement                                                                                                                                                                                                                                                         |
| beforeWrap                                              | function       | undefined                                                 | Callback avant l'ajout du wrapper dans le DOM                                                                                                                                                                                                                                           |
| onAddContent                                            | function       | undefined                                                 | Callback à chaque ajout d'un contenu dans le menu                                                                                                                                                                                                                                       |
| afterEventsHandler                                      | function       | undefined                                                 | Callback après la déclaration des événements                                                                                                                                                                                                                                            |
| afterItemHandler                                        | function       | undefined                                                 | Callback après le gestionnaire d'un élément parent                                                                                                                                                                                                                                      |
| onAddItemContent                                        | function       | undefined                                                 | Callback à chaque ajout de contenu dans un élément parent                                                                                                                                                                                                                               |
| onComplete                                              | function       | undefined                                                 | Callback à la fin du chargement                                                                                                                                                                                                                                                         |
| onToggle                                                | function       | undefined                                                 | Callback à l'ouverture/fermeture du menu                                                                                                                                                                                                                                                |
| onToggleSubmenu                                         | function       | undefined                                                 | Callback à l'ouverture/fermeture d'un sous-menu                                                                                                                                                                                                                                         |


## API

[Hérite de l'API des menus.](../README.md#api-menus)


#### getItemLayout()

Retourne le layout correspondant à l'item

* @param *{object=undefined}* **item** Élément parent
* @return *{string}*


#### toggle()

Ouverture/fermeture du menu

* @param *{object}* **event**


#### toggleSubmenu()

Ouverture/fermeture d'un sous-menu

* @param *{object}* **item** Élément parent


#### closeSubmenus()

Fermeture des sous menus

* @param *{object=undefined}* **item** Élément parent