import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Fetch the ToDo items from the backend
    axios.get('http://localhost:8080/tasks/')
      .then((response) => {
        const fetchedTodos = response.data;
        setTodos(fetchedTodos);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  const addTodo = () => {
    if (input && description && status) {
      const newTodo = { title: input, description, status };

      // Send a POST request to add a new ToDo item
      axios.post('http://localhost:8080/tasks/', newTodo)
        .then((response) => {
          const createdTodo = response.data;
          setTodos([...todos, createdTodo]);
          setInput('');
          setDescription('');
          setStatus('pending');
        })
        .catch((error) => {
          console.error('Error adding ToDo:', error);
        });
    }
  };

  const updateTodo = () => {
    if (selectedTask) {
      const updatedTodo = { ...selectedTask, title: input, description, status };

      // Send a PUT request to update the selected ToDo item
      axios.put(`http://localhost:8080/tasks/${selectedTask.id}`, updatedTodo)
        .then(() => {
          // Update the local state with the edited ToDo item
          const updatedTodos = todos.map((todo) =>
            todo.id === selectedTask.id ? updatedTodo : todo
          );
          setTodos(updatedTodos);
          setSelectedTask(null);
          setInput('');
          setDescription('');
          setStatus('');
        })
        .catch((error) => {
          console.error('Error updating ToDo:', error);
        });
    }
  };

  const deleteTodo = (id) => {
    console.log("id is ",id);
    // const fetchedTodos = response.data;
    // Send a DELETE request to the backend to delete the ToDo item
    axios.delete(`http://localhost:8080/tasks/${id}`)
      .then(() => {
        // Remove the deleted ToDo from the local state
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error('Error deleting ToDo:', error);
      });
  };

  const editTodo = (id) => {
    // Find the task to edit by ID
    const taskToEdit = todos.find((todo) => todo.id === id);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setInput(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    }
  };

  return (
    <div>
      <h1>ToDo App</h1>
      <input
        type="text"
        placeholder="Title"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="inProgress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      {selectedTask ? (
        <button onClick={updateTodo}>Update</button>
      ) : (
        <button onClick={addTodo}>Add</button>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>Title:</strong> {todo.title} <br />
            <strong>Description:</strong> {todo.description} <br />
            <strong>Status:</strong> {todo.status} <br />
            <button onClick={() => editTodo(todo.id)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;