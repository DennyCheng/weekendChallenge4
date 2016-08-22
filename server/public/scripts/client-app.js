$(document).ready(function(){
  getTask();
  //getTasks that will get the tasks and load them onto the DOM

  //event listeners for
  $("#task-submit").on("click",postTask);
  $('.task_list').on('click','.update',updateStatus);
  $('.task_list').on('click','.delete',deleteTask);

  //need two button listeners for delete and status change
});


function postTask(){
  event.preventDefault();
  var task_object = {};

  $.each($('#task-form').serializeArray(),function(i,field){
    task_object[field.name] = field.value;
  });

  if(task_object.task == ''){
    return(alert("not a task, please try again"))
  }
  else{
    console.log("this shit works")
    task_object.status = "incomplete";
    $.ajax({
      type:'POST',
      url:'/tasks',
      data:task_object,
      success: function(){
        console.log("POST /tasks works");
        $('.task_list').empty();
        getTask();
        //will load the tasks and empty out previous tasks
      },
      error: function(response){
        console.log('POST /tasks does not work..');
      },
    });
  };
  //will take in the entered task and create a objects
  //perform POST request that will add a status property
  //indicating when created it is incomplete
};

function getTask() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function (task) {
      console.log('GET /tasks returns:', task);
      $('.task_list').append("<div class = 'task_data task_label'>Task</div>"+"<div class ='task_data task_label'>Status</div>");
      task.forEach(function (tasks) {
        var $el = $('<div id ="'+tasks.id+'"</div>');

        $el.append('<div class = "task_data" >' + tasks.task + '</div>');
        $el.append('<div class = "task_data" id ="'+tasks.id+'">' + tasks.status + '</div>');
        $el.append('<div class = "button" ><button id = "button'+tasks.id+'" class ="update">Update Status</button></div>');
        $el.append('<div class = "button" ><button class ="delete">Delete</button></div>');

        $('.task_list').append($el);
      });
    },
    error: function (response) {
      console.log('GET /tasks fail. No tasks could be retrieved!');
    },
  });
}

function updateStatus(){
  var tasksToUpdate = {};
  // var inputs = $(this).parent().parent().first().serializeArray;
  //can't do serializeArray since that is only for inputs***
  // $(this).parent().parent().attr("id");

  var task_id = $(this).parent().parent().attr("id");
  // $(this).parent().parent().children().first().next().text("complete");
  //append the dom and send it over to the server and make a put request task_data
  //so when we reload it the server will be modified (@_@)
  tasksToUpdate.id = task_id;
  console.log(tasksToUpdate)
  $.ajax({
    type: 'PUT',
    url:'/tasks/' + task_id,
    data:tasksToUpdate,
    success: function(){
      $('.task_list').empty();
      getTask();
    },
    error: function(){
      console.log("Error PUT /tasks/" + task_id);
    },
  });
};

function deleteTask(){
  var taskId = $(this).parent().parent().attr("id");

  $.ajax({
    type: 'DELETE',
    url:'/tasks/' + taskId,
    success: function(){
      console.log("DELETE success");
      //repopulate the dom if a success but we empty it first
      $('.task_list').empty();
      getTask();
    },
    error: function(){
      console.log('DELETE failed');
    }
  });



};
