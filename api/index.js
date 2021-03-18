const http = require('http');
const tasksData = require('./tasks.json');
const tasksStandardData = require('./tasksStandard.json');
const fs = require('fs');
const path = require('path');
const { rejects } = require('assert');

function writeInTasks(callBackFunc, data) {
  fs.writeFile( path.join(__dirname, 'tasks.json'), JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;

    callBackFunc(JSON.stringify(tasksData, null, 2));
  })
}

function getTasksDataString(data) {
  return JSON.stringify(data);
}

const server = http.createServer((req, res) => {

  const method = req.method;
  console.log(method);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE')

  if (method === 'GET') {
    res.writeHead(200, 'text/json')
    res.end(getTasksDataString(tasksData));
  }
  
  else if (method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    })
    req.on('end', () => {
      
      newTask = JSON.parse(body)
      newTask.id = tasksData.nextId;
      tasksData.nextId++;

      tasksData.tasks.push(newTask);
      
      res.writeHead(200, 'text/json');
      writeInTasks( mes => res.end(mes), tasksData);
    })
  }

  else if (method === 'PUT') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    })
    req.on('end', () => {
      bodyJSON = JSON.parse(body)

      if (bodyJSON.title) {
        taskSelected = tasksData.tasks.find( task => String(task.id) === String(bodyJSON.id) )
        if (taskSelected) {
          tasksData.tasks.find( task => String(task.id) === String(bodyJSON.id) ).title = bodyJSON.title
        }
      } 
      else {
        taskSelected = tasksData.tasks.find( task => String(task.id) === String(bodyJSON.id) )
        if (taskSelected) {
          taskClosedStatus = taskSelected.closed;
          tasksData.tasks.find( task => String(task.id) === String(bodyJSON.id) ).closed = !taskClosedStatus;
        }
      }

      res.writeHead(200, 'text/json');
      writeInTasks( mes => res.end(mes), tasksData);
    })
  }
  
  else if (method === 'DELETE') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    })

    req.on('end', () => {
      body = JSON.parse(body);

      if (body.all === '1') {
        tasksData.tasks.splice(0, tasksData.tasks.length);
        tasksData.nextId = 0;
        writeInTasks( mes => res.end(mes), tasksStandardData );
      } 
      
      else {
        const newTasksData = tasksData
        newTasksData.tasks = tasksData.tasks.filter( task => String(task.id) !== String(body.id));
        writeInTasks( mes => res.end(mes), newTasksData );
      }
    })
  }

  else {
    res.end(JSON.stringify( {'mesage': 'Algo deu errado'} ));
  }
});

server.listen(3100, '0.0.0.0', () => {
  console.log('\n>> Server is running at "0.0.0.0:3100".\n');
});
