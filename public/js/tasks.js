function loadTasks(includeCompleted = false) {
    $.ajax({
        url: taskRoutes.showAll,
        method: 'GET',
        data: {
            include_completed: includeCompleted
        },

        success: function(response) {
            $('#taskTable').empty();
            if (!response.hasTasks) {
                $('#taskTable').append('<tr id="noTasksRow"><td colspan="4" class="text-center">No tasks found</td></tr>');
            } else {
                response.tasks.forEach(function(task, index) {
                    $('#taskTable').append(`
                        <tr data-id="${task.id}">
                            <td>${index + 1}</td>
                            <td>${task.name}</td>
                            <td>${task.is_completed ? 'Done' : 'Pending'}</td>
                            <td>
                                ${task.is_completed ? '' : `
                                <button class="btn btn-success btn-sm completeTask">
                                    <i class="fa fa-check"></i>
                                </button>
                                `}
                                <button class="btn btn-danger btn-sm deleteTask">
                                    <i class="fa fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });
            }
        }
    });
}

$(document).ready(function() {
loadTasks();
$('#taskForm').on('submit', function(e) {
    e.preventDefault();
    let task = $('#taskInput').val();
    $.ajax({
        url: taskRoutes.store,
        method: 'POST',
        data: {
            _token: csrfToken,
            name: task
        },
        success: function(response) {
            $('#noTasksRow').remove();
            $('#taskInput').val('');
            $('#taskTable').append(`
                <tr data-id="${response.id}">
                    <td>${$('#taskTable tr').length + 1}</td>
                    <td>${response.name}</td>
                    <td>${response.is_completed ? 'Done' : 'Pending'}</td>
                    <td>
                        <button class="btn btn-success btn-sm completeTask">
                            <i class="fa fa-check"></i>
                        </button>
                        <button class="btn btn-danger btn-sm deleteTask">
                            <i class="fa fa-times"></i>
                        </button>
                    </td>
                </tr>
            `);
        },
        error: function(response) {
            if (response.status === 422) {  // Check if the status is 422
                let errors = response.responseJSON.errors; // Get the errors from the response
                $.each(errors, function(key, messages) {
                    toastr.error(messages.join(' '), 'Validation Error');
                });
            } else {
                toastr.error('An unexpected error occurred.', 'Error');
            }
        }
    });
});

$(document).on('click', '.completeTask', function() {
    let taskRow = $(this).closest('tr');
    let taskId = taskRow.data('id');
    $.ajax({
        url: taskRoutes.toggleComplete.replace('{id}', taskId),
        method: 'PUT',
        data: {
            _token: csrfToken
        },
        success: function(response) {
            taskRow.remove();
            // Check if there are no tasks left and show the "No tasks found" message if needed
            if ($('#taskTable tr').length === 0) {
                $('#taskTable').append('<tr id="noTasksRow"><td colspan="4" class="text-center">No tasks found</td></tr>');
            }
            toastr.success('Task marked as completed!', 'Success');
        }
    });
});

$(document).on('click', '.deleteTask', function() {
    if (confirm('Are you sure to delete this task?')) {
        let taskRow = $(this).closest('tr');
        let taskId = taskRow.data('id');
        $.ajax({
            url: taskRoutes.delete.replace('{id}', taskId),
            type: 'DELETE',
            data: {
                _token: csrfToken
            },
            success: function () {
                taskRow.remove();
                if ($('#taskTable tr').length === 0) {
                    $('#taskTable').append('<tr id="noTasksRow"><td colspan="4" class="text-center">No tasks found</td></tr>');
                }
                toastr.success('Task deleted successfully!', 'Success');
            }
        });
    }
});

$('#showAllTasks').on('click', function() {
    loadTasks(true);
});
});