import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const URL = 'http://localhost:3001/'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [editTask, setEditTask] = useState(null)
  const [editDescription,setEditDescription] = useState('')

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setTasks(response.data)
      }).catch (error => {
        alert(error.response.data.error)
      })
  }, [])

  function save() {
    const json = JSON.stringify({description: newTask})
    axios.post(URL + 'new',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      // Convert stringifyed JSON object back to Javascript object.
      const addedObject = JSON.parse(json)
      // Add id returned by the server to object.
      addedObject.id = response.data.id
      // Update state variable with newly added data.
      setTasks(tasks => [...tasks, addedObject])
      setNewTask('')
    }).catch(error => {
      alert(error.response.data.error)
    })
  }
  
  function remove(id) {
    axios.delete(`${URL}delete/${id}`)
    .then(()=> {
      const newListWithoutRemoved = tasks.filter((item) => item.id !==id)
      setTasks(newListWithoutRemoved)
    }).catch (error => {
      alert(error.response.data.error)
    })
  }
  function edit() {
    const json = JSON.stringify({id: editTask.id,description: editDescription})
    axios.put(URL + 'edit',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      // Convert stringifyed JSON object back to Javascript object.
      const editedObject = JSON.parse(json)
      // Create copy of tasks state variable.
      const tempArray = [...tasks]
      // Fins task that was being edited.
      const index = tempArray.findIndex(task => {return task.id === editTask.id})
      // If found, update description.
      if (index !==-1) tempArray[index].description = editDescription
      // Update state containing list of tasks.
      setTasks(tempArray)
      // Reset state variables related to editing.
      setEditTask(null)
      setEditDescription('')
     

    }).catch(error => {
      alert(error.response.data.error)
    })
  }

  function setEditableRow(task)  {
    setEditTask(task)
    setEditDescription(task.description)
  }

  const handleChange = (e) => {
    setEditDescription(e.target.value)
    //console.log('tasks handleChange')
    //console.log(tasks)
  }

  return (
    <div style={{margin: '20px'}}>
      <h3>My tasks</h3>
      <form>
        <label>Add new</label>
        <input value={newTask} onChange={e => setNewTask(e.target.value)}/>
        <button type='button' onClick={save}>Save</button>
      </form>
      <ol>
      {tasks.map(task => (
        <li key={task.id} data-testid='todo'>
          {editTask?.id !== task.id &&
            task.id + ' ' + task.description + ' '
          }
          {editTask?.id === task.id &&
            <form>
              <output>{task.id}</output>
              <input value={editDescription} onChange={e => handleChange(e)} />
              <button type="button" onClick={edit}>Save</button>
              <button type="button" onClick={() => setEditTask(null)}>Cancel</button>
            </form>
          }
          <a href="#" onClick={() => remove(task.id)}>Delete</a>&nbsp;
          {editTask === null &&
            <a href="#" onClick={() => setEditableRow(task)}>Edit</a>
          }
        </li>
      ))}
      </ol>
    </div>
  );
}

export default App;
