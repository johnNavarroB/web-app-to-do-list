const listsUnorderedList = document.getElementById( "list_list" );
const tasksUnorderedList = document.getElementById( "task_list" );

const url = "https://todo-list-springboot.herokuapp.com";
const getItems = "/todoitems";
const getLists = "/todolists";
const lists = [];

let ableToRenameList = true;
let selectedId = -1;
/**
 * Closes all the tasks, shows the current selected list tasks,
 * enables the ability to close the current elements and makes them sortable.
 */
function updateTasks()
{
    closeAll();

    if ( listIds.length > 0 ) getTasksListById( selectedId );

    updateCloseButton();

    makeSortable( tasksUnorderedList );
}
/**
 * Starts the process of fetching a POST event to the network,
 * returning a promise which is fulfilled once the response is available.
 * Then converts it to JSON and updates the shown lists.
 */
function addNewList()
{
    let li = document.createElement( "li" )
    let inputText = document.getElementById( "list" ).value
    let textNode = document.createTextNode( inputText )

    if ( inputText === "" ) alert( "You can not create a nameless list" );
    else
    {
        let data = { name : inputText };
        fetch( url + getLists,
            {
                method : "POST",
                body : JSON.stringify( data ),
                headers : { "Content-Type" : "application/json" }
            } ).then( response => response.json() ).catch( error => console.log( error ) ).then( () => addList( li, inputText, textNode ) );
    }
}
/**
 * Starts the process of fetching a POST event to the network,
 * returning a promise which is fulfilled once the response is available.
 * Then converts it to JSON and updates the shown tasks.
 * @param description The title of the task to be added.
 */
function addNewTaskToList( description )
{
    let data =
        {
            descripcio : description,
            fet : false,
            prioritat : 0
        };
    fetch( url + getLists + "/" + selectedId + getItems,
        {
            method : "POST",
            body : JSON.stringify( data ),
            headers : { "Content-Type" : "application/json" }
        } ).then( response => response.json() ).catch( error => console.log( error ) ).then( () => updateTasks() );
}
/**
 * Enables sorting for an element.
 * @param element The element which will be sortable.
 */
function makeSortable( element )
{
    Sortable.create( element,{} );
}
/**
 * Enables sorting for all the displayed elements.
 */
function enableListSorting()
{
    makeSortable( listsUnorderedList );
    makeSortable( tasksUnorderedList );
}
/**
 * Removes a desired id from the array of ids.
 * @param listId The id to be removed from the list.
 */
function remove( listId )
{
    for ( let i = 0 ; i < listIds.length ; i ++ ) if ( listIds[ i ] === listId ) listIds.splice( i, 1 );
}
/**
 * Removes all the current list ids.
 */
function removeAllLists()
{
    for ( let i = 0 ; i < listIds.length ; i ++ ) remove( listIds[ i ] );
}
/**
 * Starts the process of fetching a PUT event to the network,
 * returning a promise which is fulfilled once the response is available.
 * @param listId The identifier of the list that contains the task to be updated.
 * @param taskId The identifier of the task to be updated.
 * @param isDone If the task was checked or not.
 * @param description Brief text that explains the task to be done.
 * @param priority The value of a task as a number.
 */
function checkTaskFromList( listId, taskId, isDone, description, priority )
{
    let data =
        {
            descripcio : description,
            fet : !isDone,
            prioritat : priority
        };
    fetch( url + getLists + "/" + listId + getItems + "/" + taskId,
        {
            method : "PUT",
            body : JSON.stringify( data ),
            headers : { "Content-Type" : "application/json" }
        } ).catch( error => console.log( error ) );
}
/**
 * Starts the process of fetching a DELETE event to the network,
 * returning a promise which is fulfilled once the response is available.
 * @param taskId The identifier of the task to be removed.
 */
function removeTaskFromList( taskId )
{
    fetch( url + getItems + "/" + taskId,
        {
            method : "DELETE",
            headers : { "Content-Type" : "application/json" }
        } ).catch( error => console.log( error ) );
}
/**
 * Sets an on click listener on the (task) element which deletes it.
 * @param taskElements The task of displayed elements.
 * @param index The index of a specific element.
 */
function closeTaskOnClick( taskElements, index )
{
    taskElements[ index ].onclick = function()
    {
        const li = this.parentElement;
        li.remove();
        removeTaskFromList( parseInt( li.getAttribute( "id" ) ) );
    }
}
/**
 * Changes the title of the tasks to a specific text.
 * @param title The title of the tasks to warn the user.
 */
function setTitle( title )
{
    const header = document.querySelector( "header#tasksTitle" );
    header.innerText = title;
}
/**
 * Closes all the tasks and changes the title to a default text.
 */
function closeAndChangeTitle()
{
    closeAll();
    setTitle( "There is not a list selected" );
}
/**
 * Deletes a list locally, that is represented as a "li" element.
 * Removes the id of the task deleted and updates the tasks
 * with the current first list shown. If there are not more lists, closes them all.
 * Finally, updates the current selected id to be the one of the first list shown.
 * @param li The "li" element that represents the list to be deleted locally.
 */
function closeList( li )
{
    li.remove();
    remove( parseInt( li.getAttribute( "id" ) ) );
    if ( listIds.length > 0 ) getTasksListById( listIds[ 0 ] );
    else closeAndChangeTitle();
    selectedId = listIds[ 0 ];
}
/**
 * Starts the process of fetching a DELETE event to the network,
 * returning a promise which is fulfilled once the response is available.
 */
function removeList( li )
{
    const listId = parseInt( li.getAttribute( "id" ) );

    fetch( url + getLists + "/" + listId,
        {
            method : "DELETE",
            headers : { "Content-Type" : "application/json" }
        } ).catch( error => console.log( error ) ).then( () => closeList( li ) );
}
/**
 * Sets an on click listener on the (list) element which deletes it.
 * @param listElements The list of displayed elements.
 * @param index The index of a specific element.
 */
function closeListOnClick( listElements, index )
{
    listElements[ index ].onclick = function()
    {
        if ( confirm( "Are you sure you want to delete a list and all its tasks?" ) ) removeList( this.parentElement );
    }
}
/**
 * Enables the ability to close the current (tasks and lists) elements.
 */
function updateCloseButton()
{
    const closeListElements = document.querySelectorAll( "#list_list .close" );
    for ( let i = 0 ; i < closeListElements.length ; i ++ ) closeListOnClick( closeListElements, i );
    const closeTaskElements = document.querySelectorAll( "#task_list .close" );
    for ( let i = 0 ; i < closeTaskElements.length ; i ++ ) closeTaskOnClick( closeTaskElements, i );
}
/**
 * Closes all the "li" elements that have "list" as the type attribute value.
 */
function closeAllLists()
{
    const lists = document.querySelectorAll( "li[type='list']" );
    for ( let i = 0 ; i < lists.length ; i ++ ) lists[ i ].remove();
}
/**
 * Closes all the "li" elements that have "task" as the type attribute value.
 */
function closeAll()
{
    const tasks = document.querySelectorAll( "li[type='task']" );
    for ( let i = 0 ; i < tasks.length ; i ++ ) tasks[ i ].remove();
}
/**
 * Sets an on click listener on the list element which
 * its id matches with the one given as parameter:
 * updates the tasks, deleting and showing them again.
 * @param lists The list of lists that are currently in the database.
 * @param index The index of a specific list.
 */
function updateOnClick( lists, index )
{
    lists[ index ].onclick = function()
    {
        const listId = lists[index].getAttribute( "id" );
        closeAll();
        if ( listIds.length > 0 ) getTasksListById( listId );
        selectedId = listId;
    }
}
/**
 * When a list is clicked, the tasks change.
 */
function updateTasksOnClick()
{
    const lists = document.querySelectorAll( "li[type='list']" );
    for ( let i = 0 ; i < lists.length ; i ++ ) updateOnClick( lists, i );
}


function getCurrentListName( listId )
{
    const list = document.querySelector( "li[id='" + listId + "']" );
    const listName = list.innerText;
    list.remove();
    return listName;
}


function LiMover( liParent )
{
    this.kids = liParent.children;
    this.move = ( index, beforeIndex = null ) =>
    {

        const listElements = this.kids
        const elementToMove = listElements[ index ];

        if( beforeIndex === null ) liParent.appendChild( elementToMove );
        else liParent.insertBefore( elementToMove, listElements[ beforeIndex ] );
        return this;
    }
}
const liMover = new LiMover( listsUnorderedList );


function replaceLiForInput( listId )
{
    const listName = getCurrentListName( listId );

    const li = newElement( "li" );
    li.setAttribute( "id", listId );
    li.setAttribute( "class", "listBeingUpdated" );

    const penImg = newElement( "img" );
    penImg.setAttribute( "src", "resources/icons/pen.png" );
    penImg.setAttribute( "id", listId );
    penImg.setAttribute( "class", "penImg" );
    parentOf( li, penImg );

    const span = newElement( "span" );
    span.setAttribute( "class", "close" );

    const circleXImg = newElement( "img" );
    circleXImg.setAttribute( "src", "resources/icons/circleX.png" );
    circleXImg.setAttribute( "class", "circleXImg" );

    parentOf( span, circleXImg );
    parentOf( li, span );

    const input = newElement( "input" );
    input.setAttribute( "class", "listNewName" );
    input.setAttribute( "value", listName );

    parentOf( li, input );
    parentOf( listsUnorderedList, li );
    return input
}


function updateList( listId, newText )
{
    if ( newText === "" ) alert( "There can not be a list without name" );
    else
    {
        let li = document.createElement( "li" );
        let textNode = document.createTextNode( newText );

        let data =
            {
            listId : listId,
            name : newText
            };
        fetch( url + getLists,
            {
                method : "PUT",
                body : JSON.stringify( data ),
                headers: { "Content-Type" : "application/json" }
            } ).then( response => response.json() ).catch( error => console.log( error ) ).then( () => addList( li, newText, textNode ) );
    }
}


function removeTemporalUpdatingList()
{
    document.querySelector( "li[class='listBeingUpdated']" ).remove();
    ableToRenameList = true;
}


/**
 * Sets an on click listener on the pen image element which
 * its index matches with the one given as parameter.
 * It allows the user to rename a list when this element is clicked.
 * @param penIcons A list of the current pen icons of each list.
 * @param index The current index under the list of pen icons.
 */
function renameOnClick( penIcons, index )
{
    penIcons[ index ].onclick = function()
    {
        if ( ableToRenameList )
        {
            ableToRenameList = false;



            const listId = this.getAttribute( "id" );
            const input = replaceLiForInput( listId );

            const tempButton = document.createElement( "button" );
            tempButton.onclick = () =>
            {
                removeTemporalUpdatingList();

                updateList( listId, input.value );
            }

            input.addEventListener( "keyup", function( event )
            {
                if ( event.keyCode === 13 )
                {
                    event.preventDefault();

                    tempButton.click();
                }
                tempButton.remove()
            })
        }
    }
}
/**
 * Allows the user to rename each list by clicking in the corresponding pen icon.
 */
function renameListsOnClick()
{
    const penIcons = document.querySelectorAll( ".penImg" );
    for ( let i = 0 ; i < penIcons.length ; i ++ ) renameOnClick( penIcons, i );
}


/**
 * Creates the HTML element specified by tag.
 * @param tag A string that specifies the type of element to be created, in lowercase.
 *            The nodeName of the created element is initialized with the value of tag.
 * @returns {Element} The new {@code Element}.
 */
function newElement( tag )
{
    return document.createElement( tag );
}
/**
 * Adds a node to the end of the list of children of a specified parent node.
 * @param parent Parent node to append the new children to.
 * @param newChild The node to append to the given parent node.
 */
function parentOf( parent, newChild )
{
    parent.appendChild( newChild );
}
/**
 * Starts the process of fetching a (listOfTasks) resource from the network,
 * returning a promise which is fulfilled once the response is available.
 * @param listId The identifier of the list that hosts the tasks returned.
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 */
function fetchListTasks( listId )
{
    return fetch( url + getLists + "/" + listId + getItems,
        {
            method : "GET",
            headers : new Headers({ "Content-type" : "application/json" } )
        } );
}
/**
 * Gets the tasks from the list which its id matches with the id given as parameter.
 * Transforms the Response to JSON array, calls a callback function
 * on each (task) element on the array that creates a closeable element.
 * @param listId The identifier of the list that hosts the tasks to be added as new elements.
 */
function getTasksListById( listId )
{
    fetchListTasks( listId ).then( ( response ) => response.json() ).then( function( jsonTasks )
    {
        if ( jsonTasks.length === 0 )
        {
            lists.map( function( list )
            {
                if ( list[ "listId" ] === parseInt( listId ) ) setTitle( list[ "name" ] );
            } );
        }
        jsonTasks.map( function ( task )
        {
            const header = document.querySelector( "header#tasksTitle" );

            const taskId = task[ "idItem" ]; // task.idItem works too, but this looks cleaner.
            const taskDescription = task[ "descripcio" ];

            const taskIsDone = task[ "fet" ];
            const taskPriorityAmount = task[ "prioritat" ];

            //const taskListId = task[ "list" ][ "listId" ];
            header.innerText = task[ "list" ][ "name" ];

            createCloseableElement( taskId, taskDescription, "task", tasksUnorderedList, taskIsDone, taskPriorityAmount );
        } );
        makeCheckable();
    } ).catch( function( error )
    {
        console.log( error );
    } );
}
/**
 * Creates a "li" element under parentElement:
 * <ul>
 *     <li>With the attribute "id" as the value entered in the parameter id.</li>
 *     <li>With the attribute "type" as the value entered in the parameter type.</li>
 *     <li>With the attribute "class" as checked if isDone is true.</li>
 *     <li>The value of the element is the one entered as the parameter elementValue.</li>
 * </ul>
 * Parent of a "span" element:
 * <ul>
 *     <li>With the attribute value "class" as "close".</li>
 *     <li>Parent of an "i" element, holder of the cross close icon.</li>
 * </ul>
 * Finally, sets a click listener to every element in the class "close", to remove it
 * (updating the one just added when the function is executed).
 * @param id The id of the element to be added.
 * @param elementValue The value of the element to be added.
 * @param type The type of the element to be added.
 * @param parentElement The parent holder of the element to be added.
 * @param isDone If the task is done: true, false or other in case of a list.
 * @param priority The value of a task as a number.
 */
function createCloseableElement( id, elementValue, type, parentElement, isDone, priority = "" )
{
    const li = newElement( "li" );
    li.setAttribute( "id", id );
    li.setAttribute( "type", type );
    li.setAttribute( "priority", priority );
    if ( isDone === true ) li.setAttribute( "class", "checked" );
    li.innerHTML = elementValue;

    if ( type === "list" )
    {
        const penImg = newElement( "img" );
        penImg.setAttribute( "src", "resources/icons/pen.png" );
        penImg.setAttribute( "id", id );
        penImg.setAttribute( "class", "penImg" );
        parentOf( li, penImg );
    }

    const span = newElement( "span" );
    span.setAttribute( "class", "close" );

    // let i = document.createElement( "i" );
    // i.className = "fas fa-times-circle";

    const circleXImg = newElement( "img" );
    circleXImg.setAttribute( "src", "resources/icons/circleX.png" );
    circleXImg.setAttribute( "class", "circleXImg" );

    parentOf( span, circleXImg );
    parentOf( li, span );
    parentOf( parentElement, li );

    updateCloseButton();
}
/**
 * All the current ids of every list currently existing in the database.
 */
const listIds = [];
/**
 * Calls a callback function on each (list) element on the array,
 * that adds the listId to a list, and creates a closeable element.
 * @param jsonLists An array of lists from a JSON response.
 */
function setLists( jsonLists )
{
    jsonLists.map( function ( list )
    {
        lists.push( list );

        listIds.push( list[ "listId" ] );

        createCloseableElement( list[ "listId" ], list.name, "list", listsUnorderedList, "other" );

    } );
}
/**
 * Starts the process of fetching a (listOfTasksLists) resource from the network,
 * returning a promise which is fulfilled once the response is available.
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 */
function fetchLists()
{
    return fetch( url + getLists,
        {
            method : "GET",
            headers : new Headers({ "Content-type" : "application/json" } )
        } );
}
/**
 * Gets the lists fetching the resource from the network,
 * creates a closeable element for each list,
 * gets the tasks of the first list from its id and
 * updates the tasks when a list is clicked.
 * Finally, enables list sorting of the displayed elements.
 * @param id The id of the current list selected.
 */
function initializeLists( id )
{
    fetchLists().then( ( response ) => response.json() ).then( function( jsonLists )
    {

        removeAllLists();

        closeAllLists();

        setLists( jsonLists );

        renameListsOnClick();

        getTasksListById( id );

        updateTasksOnClick();

        enableListSorting();

        selectedId = id;

    } ).catch( function( error )
    {
        console.log( error );
        setTitle( "There is not a list selected" );
    } );
}


initializeLists( listIds[ 0 ] );