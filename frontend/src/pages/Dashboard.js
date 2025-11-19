import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DarkModeToggle from '../components/DarkModeToggle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const editingInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await api.get('/auth/profile');
        const tasksRes = await api.get('/tasks');
        setProfile(profileRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  useEffect(() => {
    if (editingTaskId && editingInputRef.current) {
      editingInputRef.current.focus();
    }
  }, [editingTaskId]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    setSavingTask(true);
    try {
      const res = await api.post('/tasks', { title: newTaskTitle });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      toast.success('Task added successfully');
    } catch {
      toast.error('Failed to add task');
    } finally {
      setSavingTask(false);
    }
  };

  const confirmDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const deleteTask = async (id) => {
    setDeletingTaskId(id);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const saveEditedTask = async () => {
    if (!editingTaskTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    setSavingTask(true);
    try {
      const res = await api.put(`/tasks/${editingTaskId}`, { title: editingTaskTitle });
      setTasks(tasks.map(t => (t._id === editingTaskId ? res.data : t)));
      setEditingTaskId(null);
      setEditingTaskTitle('');
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setSavingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3 dark:bg-gray-600"></div>
          <div className="h-6 bg-gray-300 rounded dark:bg-gray-600"></div>
          <div className="h-6 bg-gray-300 rounded w-full dark:bg-gray-600"></div>
          <div className="h-48 bg-gray-300 rounded dark:bg-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow relative text-gray-900 dark:text-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <DarkModeToggle />
          <button
            onClick={logout}
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-800"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {profile && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome, {profile.name}</h2>
          <p>Email: {profile.email}</p>
        </div>
      )}

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          className="border p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          aria-label="New task title"
          disabled={savingTask}
        />
        <button
          onClick={addTask}
          disabled={savingTask}
          className={`bg-blue-600 text-white px-4 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition ${savingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {savingTask ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          aria-label="Search tasks"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-3">Your Tasks</h3>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2h6v2a3 3 0 11-6 0zM13 7H7a2 2 0 00-2 2v6m12 0V9a2 2 0 00-2-2h-6" />
          </svg>
          <p>No tasks match your search.</p>
        </div>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task._id} className="border p-3 rounded mb-2 flex justify-between items-center dark:border-gray-700">
              {editingTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editingTaskTitle}
                    onChange={e => setEditingTaskTitle(e.target.value)}
                    className="border p-1 rounded flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    ref={editingInputRef}
                    disabled={savingTask}
                    aria-label="Edit task title"
                  />
                  <button
                    onClick={saveEditedTask}
                    disabled={savingTask}
                    className={`bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2 dark:hover:bg-green-800 ${savingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Save edited task"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditingTaskTitle('');
                    }}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 dark:hover:bg-gray-600"
                    aria-label="Cancel editing task"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <div>
                    <button
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditingTaskTitle(task.title);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2 dark:hover:bg-yellow-700"
                      aria-label={`Edit task ${task.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteTask(task._id)}
                      disabled={deletingTaskId === task._id}
                      className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 dark:hover:bg-red-800 ${deletingTaskId === task._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label={`Delete task ${task.title}`}
                    >
                      {deletingTaskId === task._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
