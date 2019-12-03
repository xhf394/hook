import React, { useState, useReducer, createContext } from 'react';
import uuid from 'uuid/v4';
import './App.css';



const initialTodos = [
  {
  	id: uuid(),
  	task: 'Complete Leecode',
  	complete: true,
  },
  {
  	id: uuid(),
  	task: 'Learn new technology',
  	complete: false,
  },
  {
  	id: uuid(),
  	task: 'Seek and Application',
  	complete: false,
  }
]

//implement reducer
/**Description of Reducer
 * syntax (state, action) => newState
 * state processed with immutable data structure
 * reducer is used for updating state from A to B
 * action is an object, first layer with more general info
   and more details could be put in such as payload.
**/
const todoReducer = (state, action) => { 
  switch (action.type) {
    case 'DO_TODO':
      return state.map(todo => {
      	if(todo.id === action.id) {
      	  return {...todo, complete: true}
      	}
      	else {
      	  return todo;
      	}
      });
    case 'UNDO_TODO':
      return state.map(todo => {
      	if(todo.id === action.id) {
          return {...todo, complete: false}
        }
        else { 
          return todo;
        } 
      });
    case 'ADD_TODO':
      return state.concat({
      	id: uuid(), 
      	task: action.task, 
      	complete: false
      });  
    default:
    //for instance: initial list;
      return state;   
  }
};

const filterReducer = (state, action) => {
    //here transition one string to another as state;
    //more often, current state is used to compute the new state	
	switch (action.type) {
      case'SHOW_ALL':
        return 'ALL'  ;
      case 'SHOW_COMPLETE':
        return 'COMPLETE'  ;
      case 'SHOW_INCOMPLETE':
        return  'INCOMPLETE' ;
      default:
        throw new Error(); 
	}
}                             

const Filter = ({dispatch}) => {
  
  const handleShowAll = () => {
    dispatch({type: 'SHOW_ALL'})
  };

  const handleShowComplete = () => {
    dispatch({type: 'SHOW_COMPLETE'});
  };

  const handleShowIncomplete = () => {
    dispatch({type: 'SHOW_INCOMPLETE'});
  };

  return (
    <div> 
      <button type="button" onClick={handleShowAll}> Show All </button>
      <button type="button" onClick={handleShowComplete}> Show Complete </button>
      <button type="button" onClick={handleShowIncomplete}> Show Incomplete </button>
    </div>
  )
};

const TodoList = ({todoList, dispatch}) => {
  
  const handleChange = todo => {
  	//this can be considered as an action object
  	dispatch({
  	  type:todo.complete ? 'UNDO_TODO' : 'DO_TODO', 
  	  id: todo.id})
  };
  return (
  	<div> 
      <ul>
          {todoList.map(todo => (
     	    <li key={todo.id}>
     	      <label>
                <input
                  type='checkbox'
                  checked={todo.complete}
                  onChange={() => handleChange(todo)}
                />
                  {todo.task}
     	      </label>
     	    </li>
          ))}
        </ul>
  	</div>
  )
};

const AddTodo = ({dispatch}) => {
  const [task, setTask] = useState('');
    //onsubmit
  const handleSubmit = event => {
   if(task) {
   	  dispatch({type: 'ADD_TODO', id: uuid(), task});
   }
   
   setTask("")
   event.preventDefault();
  };

  const handleChangeInput = (event) => {
    setTask(event.target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
          <input type="text" value={task} onChange={handleChangeInput} />
          <button type="submit"> Add Todo </button>
        </form>
    </div>
  )
};


const Hook = () => {
  
  //useReducer in Hook
  const [filter, dispatchFilter] = useReducer(filterReducer, 'ALL');

  //useReducer
  const[todos, dispatchTodos] = useReducer(todoReducer, initialTodos);

  

  const filterTodos = todos.filter(todo => {
  	if(filter === 'ALL') {
  	  return true;	
  	}
  	if(filter === 'COMPLETE' && todo.complete) {
  	  return true;	
  	}
  	if(filter === 'INCOMPLETE' && !todo.complete) {
  	  return true;	
  	}
  });

  console.log(filterTodos);

  return(
  	<div>
  	  <AddTodo dispatch={dispatchTodos}/>
  	  <Filter dispatch={dispatchFilter}/>
  	  <TodoList dispatch={dispatchTodos} todoList={filterTodos}/>
  	  
      <div>
       
      </div>     
    </div>  
  )	
}


const App = () => {
  return (
    <div className="App">
    <Hook />

    </div>
  );
}

export default App;

//tips:
//1. input needs to have a value attribute as a controlled component
