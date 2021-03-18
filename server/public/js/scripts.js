
const tasksList = document.querySelector('#tasks-list');
const btnAddNewTask = document.querySelector('#btn-addNewTask');
const liArray = new Map()

let uid = 0;

main()

function main() {
  btnAddNewTask.addEventListener('click', addNewTaskInList);
  loadTask()
}


document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    key === 'Enter' ? btnAddNewTask.focus() : ''

});




//
// INTEGRAÇÃO COM API
//



function loadTask() {

  const init = {
    method: 'GET',
  }

  let tasks = [];

  fetch('http://localhost:3001/', init)
    .then( res => res.json())
    .then( (resJSON) => {
      tasks = resJSON.tasks
      for (let t in tasks) {
        setUID(resJSON.nextId);
        if (String(tasks[t].closed) === String(false)) {
          addTaskInList(tasks[t].id, String(tasks[t].title))
        }
      }
    })
    .catch( err => console.log(err))

}

function postTask() {
  const bodyData = {
    title: '',
    closed: false,
  }

  const init = {
    method: 'POST',
    body: JSON.stringify(bodyData)
  }

  fetch('http://localhost:3001/', init)
}

function deleteTask(id) {
  const bodyData = {
    id,
  }

  const init = {
    method: 'DELETE',
    body: JSON.stringify(bodyData)
  }

  fetch('http://localhost:3001/', init)
}

function putTask(id) {
  const title = liArray.get(id).querySelector('input').value;

  const bodyData = {
    title: `${title}`,
    id: id
  }

  const init = {
    method: 'PUT',
    body: JSON.stringify(bodyData)
  }

  fetch('http://localhost:3001/', init)
}

function putCheck(id) {
  const bodyData = {
    id
  }

  const init = {
    method: 'PUT',
    body: JSON.stringify(bodyData)
  }

  fetch('http://localhost:3001/', init)
}

function setUID(id) {
  uid = id;
}

//
// INTERFACE GRÁFICA
//

function addTaskInList(id, tittle) {
  const li = document.createElement('li');
  li.setAttribute('class', 'task grid-12');
  
  const btnCheck = document.createElement('button');
  btnCheck.setAttribute('class', 'btn-check grid-1');
  btnCheck.setAttribute('onclick', `checkTask(${id})`);
  
  const input = document.createElement('input');
  input.setAttribute('class', 'grid-8');
  input.setAttribute('value', `${tittle}`);
  input.setAttribute('onfocusout', `putTask(${id})`);
  
  
  const btnDelete = document.createElement('button');
  btnDelete.setAttribute('class', 'btn-delete grid-1');
  btnDelete.setAttribute('onclick', `deleteTaskInList(${id})`);

  liArray.set(id, li);

  li.append(btnCheck, input, btnDelete);
  tasksList.prepend(li);

  return input;
}

function addNewTaskInList() {
  postTask()
  const element = addTaskInList(uid, ' ');
  element.focus()
  uid++;
}


function deleteTaskInList(taskId) {
  const li = liArray.get(taskId);

  const duration = 350;
  startAnimation(1, li, duration/1000);

  setTimeout(() => {
    li.remove();
    deleteTask(taskId);
  }, duration)
}

function checkTask(taskId){
  const li = liArray.get(taskId);

  const duration = 500;
  startAnimation(2, li, duration/1000);
  changeCheckInput(taskId);

  setTimeout(() => {
    li.remove();
    putCheck(taskId);
  }, duration)
}



//
// ANIMAÇÕES
//



function changeCheckInput(taskId) {
  const li = liArray.get(taskId);
  const btn = li.querySelector('.btn-check');

  btn.setAttribute('style', `
    transition: 0.2s;
    background: url(./img/check-checked.png) no-repeat center;
    background-color: var(--color-dark-black);
    background-position: 50% 60%;
    `)
}

function startAnimation(animationID, element, duration) {
  const animations = []
  animations[1] = deleteAnimation;
  animations[2] = checkAnimation;

  animations[animationID](element, duration)
}

const deleteAnimation = (element, duration) => {
  element.setAttribute('style', `opacity: 0; height: 0; overflow: hidden; transition: ${duration}s;`)
}

const checkAnimation = (element, duration) => {

  element.setAttribute('style', `
    transition: ${duration / 3 * 2}s;
    background-color: var(--color-orange);
    overflow: hidden; 
    `);

  setTimeout(() => {
   element.setAttribute('style', `
      height: 0; 
      opacity: 0; 
      background-color: var(--color-orange); 
      overflow: hidden; 
      transition: ${duration / 3}s;
      `)
  }, duration / 3 * 2 * 1000);
}
