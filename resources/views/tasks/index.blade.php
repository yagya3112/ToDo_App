@extends('layouts.app')

@section('title', 'To-Do List App')

@section('content')
    <div class="card">
        <div class="card-header">
            <h4 class="text-primary">To-Do List App</h4>
        </div>
        <div class="card-body">
            <form class="form-inline mb-3" id="taskForm">
                <div class="form-container">
                    <input type="text" id="taskInput" class="form-control" placeholder="Enter task" name="task">
                    <button type="submit" class="btn btn-primary btn-add">Add Task</button>
                </div>
            </form>
            <button class="btn btn-secondary mb-3" id="showAllTasks">Show All Tasks</button>
            <table class="table table-bordered">
                <thead class="thead-light">
                    <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="taskTable"></tbody>
            </table>
        </div>
    </div>
@endsection
@section('scripts')
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script>
        const taskRoutes = {
            showAll: "{{ route('tasks.showAll') }}",
            store: "{{ route('tasks.store') }}",
            toggleComplete: "/tasks/{id}/toggle",
            delete: "/tasks/{id}"
        };
        const csrfToken = '{{ csrf_token() }}';
    </script>
    <script src="{{ asset('js/tasks.js') }}"></script>
@endsection