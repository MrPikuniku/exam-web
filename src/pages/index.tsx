
import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTask, completed: false }),
      });
      const task = await response.json();
      setTasks([...tasks, task]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to add task', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number) => {
    setLoading(true);
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error('Failed to toggle task', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Liste de tâches</h1>
      <input 
        type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Nouvelle tâche" 
      />
      <button onClick={addTask}>Ajouter</button>
      {loading && <p>Chargement...</p>}
      <TaskList tasks={tasks} onToggle={toggleTask} />
    </div>
  );
};

export default Home;
