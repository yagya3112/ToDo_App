<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return view('tasks.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:tasks|max:255',
        ]);

        $task = Task::create(['name' => $request->name]);

        return response()->json($task);
    }

    public function toggle(Task $task)
    {
        $task->is_completed = !$task->is_completed;
        $task->save();

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json($task);
    }

    public function showAll(Request $request)
    {
        $includeCompleted = filter_var($request->query('include_completed', false), FILTER_VALIDATE_BOOLEAN);

        $tasks = Task::when(!$includeCompleted, function ($query) {
            $query->where('is_completed', false);
        })->get();

        return response()->json([
            'tasks' => $tasks,
            'hasTasks' => $tasks->isNotEmpty()
        ]);
    }
}
