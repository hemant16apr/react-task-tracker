import React, { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  }, []);

  //Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:9000/tasks");
    const data = await res.json();
    
    return data;
  }

   //Fetch a single task
   const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:9000/tasks/${id}`);
    const data = await res.json();
    
    return data;
  }

  //Add Task
  const addTask = async (task) => {
    console.log(task);
    const res = await fetch("http://localhost:9000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();
    setTasks([...tasks, data]);

    //const id = Math.floor(Math.random * 10000) + 1;
    //const newTask = {id, ...task};
    //setTasks([...tasks, newTask]);
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:9000/tasks/${id}`, {
      method: "DELETE"
    });
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const toggleReminder = async (id) => {
    console.log(id);
    const taskToToggle = await fetchTask(id);
    const updatedTask = {
      ...taskToToggle, reminder: !taskToToggle.reminder
    };

    const res = await fetch(`http://localhost:9000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder} : task));
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} title="Task Tracker" />
      {showAddTask && <AddTask onAdd={addTask} />}
      { tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : ("No tasks to show.")}
    </div>
  );
}

export default App;
