console.log( 'js' );

$( document ).ready( function(){
  console.log( 'DOM is ready' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing tasks on page load
  refreshTasks();
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
  // console.logs for troubleshooting, they can be removed
  console.log('edit button clicked', this);
  
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
  // Clear out the table and then append each row in the order provided by the database
  // Store the task's id in the tr for future use.
  for (let i = 0; i < response.length; i++) {
    let item = response[i];
    $('#taskTBody').append(`
      <tr data-id="${item.id}" ${(item.completed)? 'class="bg-success"': 'class="bg-info"'}>
        <td><input class="checkbox" type="checkbox" ${(item.completed)? 'checked' : ' '}/></td>
        <td class="todo-textbox"><input type="text" disabled placeholder="${item.task}" aria-label="${item.task} click to edit"></td>
        <td><button class="removeButton btn btn-danger btn-sm" data-toggle="modal" data-target="#confirmationDialog">Remove</button></td>
      </tr>
    `);
  }
}

function openConfirmationDialog(event) {
  // console.log('this:', this);
  // console.log('correct id:', $(event.relatedTarget).closest('tr').data('id') );
  
  // Get the id that was stored in each table row. And store it for later.
  let tempID = $(event.relatedTarget).closest('tr').data('id');
  $( '#dataStorage' ).data('id', tempID);
}

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
  console.log( 'Confirmed' );
  // After the user has confirmed the removal, retrieve the task's id from storage
  // and clear out the dataStorage div
  let id = $( '#dataStorage' ).data().id;
  $( '#dataStorage' ).data('id', '');

  $.ajax({
    type: 'DELETE',
    url: '/list/' + id
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function  (response) {
    $('#confirmationDialog').modal('toggle');
    refreshTasks();
  }).catch(function  (err) {
    console.log('Error removing task, try again:', err);

  });
}

function setupClickListeners() {
  $( '#addButton' ).on( 'click', addTask);
  $( '#taskDisplay').on('change', '.checkbox', toggleCheckbox);
  $( '#taskDisplay' ).on('click', '.removeButton', openConfirmationDialog);
  $( '#taskDisplay' ).on('click', '.todo-textbox', editTaskText);
  $( '#taskDisplay' ).on('keypress', '.todo-textbox', updateTaskText);
  $( '#taskDisplay' ).submit('.todo-textbox', editTaskText);
  $( '.modal').on( 'show.bs.modal', openConfirmationDialog);
  $('.confirmed').on('click', removeTask);
}

function toggleCheckbox() {

  // take the table id from the tr and use it to update the database
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
  if (event.keyCode==13){ //if the enter key is pressed
    let id = $(this).closest('tr').data('id');
    let newText = {newText: $(this).children('input').val()};
    
    
    // console.log($(this).children());
    if (!$(this).children().is(':disabled')) {
      //disable the textbox again and if the text was changed, submit a PUT request
      textbox.prop( "disabled", true );
      console.log(newText);

      if ($(this).children('input').attr('placeholder') !== newText.newText) {
        console.log('trying to update', id);
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
          })
      }
    }
  } else {
  return; // if the enter key is not pressed, do nothing
  }
}