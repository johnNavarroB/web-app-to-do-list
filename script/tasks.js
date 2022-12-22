// Add button active or inactive
const inputBox = document.querySelector( ".task-insert input" );
const addBtn = document.querySelector( ".task-insert button" );
/**
 * When the input box of tasks is modified,
 * its submit button becomes active or inactive
 * if it has content or not, respectively.
 */
function toggleSubmitButtonOnKeyUp()
{
    inputBox.onkeyup = () =>
    {
        let userData = inputBox.value;

        if ( userData.length !== 0 ) addBtn.classList.add( "active" );
        else addBtn.classList.remove( "active" );
    }
}
/**
 * If the input box is not empty, adds a task to the database and reloads the current tasks.
 * Otherwise, warns the user that it's not allowed to create an empty task. Then, resets the input box.
 */
function addTask()
{
    const inputText = document.getElementById( "task" ).value;

    if ( inputText === "" ) alert( "You can not add an empty task." );
    else addNewTaskToList( inputText );

    document.getElementById( "task" ).value = "";
}
/**
 * When the enter key (13) is pressed, a new task is added and the button is set to inactive.
 */
function clickOnKeyupEnterEvent()
{
    // Get the input field
    let input = document.getElementById( "task" );

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener( "keyup", function( event )
    {
        // Number 13 is the "Enter" key on the keyboard
        if ( event.keyCode === 13 )
        {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById( "addBtn" ).click();

            addBtn.classList.remove("active");
        }
    });
}
/**
 * When a task is clicked, its class is updated to "checked" or removes it if already haves it.
 */
function checkTaskOnClick( taskElements, index )
{
    taskElements[ index ].onclick = function()
    {
        const isDone = this.getAttribute( "class" ) === "checked";
        const priority = this.getAttribute( "priority" );
        checkTaskFromList( selectedId, this.getAttribute( "id" ), isDone, this.innerText, priority );
        this.classList.toggle( "checked" );
    }
}
/**
 * Enables the check of all the tasks.
 */
function makeCheckable()
{
    const taskElements = document.querySelectorAll( "[type='task']" );
    for ( let i = 0 ; i < taskElements.length ; i ++ ) checkTaskOnClick( taskElements, i );
}


toggleSubmitButtonOnKeyUp();

clickOnKeyupEnterEvent();