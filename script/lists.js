// Add button active or inactive
const inputListBox = document.querySelector( ".list-insert input" );
const addListsBtn = document.querySelector( ".list-insert button" );

inputListBox.onkeyup = () =>
{
    let userData = inputListBox.value;
    if ( userData.trim() != 0 ) addListsBtn.classList.add( "active" );
    else addListsBtn.classList.remove( "active" );
}

// Get the input field
let input = document.getElementById( "list" );

// Execute a function when the user releases a key on the keyboard
input.addEventListener( "keyup", function( event )
{
    // Number 13 is the "Enter" key on the keyboard
    if ( event.keyCode === 13 )
    {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById( "addListBtn" ).click();
    }
})


function addList( li, inputText, textNode )
{
    li.appendChild( textNode );
    document.getElementById( "list" ).value = "";
    initializeLists( selectedId );
}