from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Task
from .forms import TaskForm

def index(request):
    """
    Render the index page for the tasks app.
    """
    return render(request, 'tasks/index.html')

def task_list(request):
    """
    Display all tasks.
    """
    tasks = Task.objects.all()
    return render(request, 'tasks/task_list.html', {'tasks': tasks})

def task_detail(request, pk):
    """
    Display details of a specific task.
    """
    task = get_object_or_404(Task, pk=pk)
    return render(request, 'tasks/task_detail.html', {'task': task})

def task_create(request):
    """
    Create a new task.
    """
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, '¡Tarea creada exitosamente!')
            return redirect('tasks:task_list')
    else:
        form = TaskForm()
    return render(request, 'tasks/task_form.html', {'form': form, 'title': 'Crear Tarea'})

def task_update(request, pk):
    """
    Update an existing task.
    """
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, '¡Tarea actualizada exitosamente!')
            return redirect('tasks:task_detail', pk=task.pk)
    else:
        form = TaskForm(instance=task)
    return render(request, 'tasks/task_form.html', {'form': form, 'task': task, 'title': 'Actualizar Tarea'})

def task_delete(request, pk):
    """
    Delete a task.
    """
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'POST':
        task.delete()
        messages.success(request, '¡Tarea eliminada exitosamente!')
        return redirect('tasks:task_list')
    return render(request, 'tasks/task_confirm_delete.html', {'task': task})

def task_complete(request, pk):
    """
    Mark a task as complete/incomplete.
    """
    task = get_object_or_404(Task, pk=pk)
    task.completed = not task.completed
    task.save()
    messages.success(request, f'¡Tarea marcada como {"completada" if task.completed else "incompleta"}!')
    return redirect('tasks:task_list')

