console.log( 'js' );

$( document ).ready( function(){
  console.log( 'DOM is ready' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
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
    url: '/tasks',
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

function editKoala() {
  console.log('edit button clicked');
}
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
  console.log('refreshTasks');
}

/*
function removeKoala() {
  console.log(this);
  let id = $(this).closest('tr').data('id');

  $.ajax({
    type: 'DELETE',
    url: '/koalas/' + id
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) { 
    getKoalas();
  }).catch(function  (err) {
    console.log('Error getting Koalas:', err);
  });
}
*/

function setupClickListeners() {
  $( '#addButton' ).on( 'click', addTask);
  // $( '#viewTasks').on( 'click', '.checkbox', toggleCheckbox);
  // $( '#viewTasks' ).on('click', '.removeButton', removeKoala);
  // $( '#viewTasks' ).on('click', '.editButton', editKoala);
  // $( '#viewTasks' ).on('click', '.readyButton', toggleTransfer);
}

/*
function toggleTransfer() {

  let id = $(this).closest('tr').data('id');
  
  $.ajax({
    type: 'PUT',
    url: '/koalas/toggle-ready/' + id
    //then, when you get a response, append a table row to the DOM with the info you received
  }).then(function (response) {
    getKoalas();
  }).catch(function  (err) {
    console.log('Error getting Koalas:', err);
  });
}
*/

function updateTasks(response) {
  $('#viewTasks').empty();
  for (let i = 0; i < response.length; i++) {
    let item = response[i];
    $('#viewTasks').append(`
      <tr data-id="${item.id}">
        <td><input type="checkbox">${item.complete}</button></td>
        <td>${item.task}</td>
        <td><button class="removeButton">Remove</button></td>
      </tr>
    `); // <td><button class="editButton">Edit</button></td>
  }
}
//TODO update