console.log( 'js' );

$( document ).ready( function(){
  console.log( 'DOM is ready' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing tasks on page load
  refreshTasks();

  //Swal.fire("Hello World!");
}); // end doc ready

function addTask() {
  console.log('adding a new Task');

    // get user input and put in an object
  let task = $('#taskIn').val();
  let newTask = {task};

  // ajax call with the new obejct
  $.ajax({
    type: 'POST',
    url: '/list',
    data: newTask
    
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) {
    console.log(newTask, 'added!');
    $('#taskIn').val('');
    refreshTasks();

  }).catch(function  (err) {
    console.log('Error adding a task:', err);
  })
}

function editTaskText() {
  console.log('edit button clicked', this);
  //try select [this] disabled object, then enable it, 
  //else disable it and send an AJAX PUT request
  
  textbox = $(this).children();

  console.log(textbox.is(':disabled'));

  //if the textbox is disabled, enable it and fill it with the placeholder value
  //then focus on it, so that the user can type
  if (textbox.is(':disabled')) {
    textbox.prop( "disabled", false );
    textbox.val(`${textbox.attr('placeholder')}`);
    textbox.focus();
  }
}

function formatList(response) {
  console.log(response);
  $('#taskTBody').empty();
  for (let i = 0; i < response.length; i++) {
    let item = response[i];
    $('#taskTBody').append(`
      <tr data-id="${item.id}" ${(item.completed)? 'class="bg-success"': 'class="bg-info"'}>
        <td><input class="checkbox" type="checkbox" ${(item.completed)? 'checked' : ' '}/></td>
        <td class="todo-textbox"><input type="text" disabled placeholder="${item.task}"></td>
        <td><button class="removeButton">Remove</button></td>
      </tr>
    `); // <td><button class="editButton">Edit</button></td>
  }
}

/*
Disable #x
$( "#x ).prop( "disabled", true );

Enable #x
$( "#x" ).prop( "disabled", false );
*/

/*
function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    type: 'GET',
    url: '/koalas'
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) {
    updateKoalas(response);
  }).catch(function  (err) {
    console.log('Error getting Koalas:', err);
  });
} // end getKoalas
*/

function refreshTasks() {
  console.log('in refreshTasks');
  $.ajax({
    type: 'GET',
    url: '/list'
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) {
    formatList(response);
  }).catch(function  (err) {
    console.log('Error getting tasks:', err);
  });
}

function removeTask() {
  console.log(this);
  let id = $(this).closest('tr').data('id');

  $.ajax({
    type: 'DELETE',
    url: '/list/' + id
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(refreshTasks()
  ).catch(function  (err) {
    console.log('Error getting Koalas:', err);
  });
}

function setupClickListeners() {
  $( '#addButton' ).on( 'click', addTask);
  $( '#taskDisplay').on('change', '.checkbox', toggleCheckbox);
  $( '#viewTasks' ).on('click', '.removeButton', removeTask);
  $( '#taskDisplay' ).on('click', '.todo-textbox', editTaskText);
  $( '#taskDisplay' ).on('keypress', '.todo-textbox', updateTaskText);
  $( '#taskDisplay' ).submit('.todo-textbox', editTaskText);
  // $( '#viewTasks' ).on('click', '.readyButton', toggleTransfer);
}

function toggleCheckbox() {

  console.log('checkbox clicked!');

  let id = $(this).closest('tr').data('id');
  
  $.ajax({
    type: 'PUT',
    url: '/list/toggle-completed/' + id
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) {
    refreshTasks();
  }).catch(function  (err) {
    console.log('Error updating tasks:', err);
  });
}

function updateTaskText(event) {
  if (event.keyCode==13){
    let id = $(this).closest('tr').data('id');
    let newText = {newText: $(this).children('input').val()};
    
    console.log('trying to update', id);
    console.log($(this).children());
    if (!$(this).children().is(':disabled')) {
      textbox.prop( "disabled", true );
      console.log(newText);
      $.ajax({
        type: 'PUT',
        url: '/list/update-text/' + id,
        data: newText
        //then, when you get a response, append a table row to the DOM with the info you received
      }).then(function (response) {
        console.log('DB updated!');
        $(this).children('input').attr('placeholder', newText);
      }).catch(function  (err) {
        console.log('Error updating task:', err);
      });
    }
  } else {
  return;
  }
}