const apiRoot = '/tasks';

async function fetchTasks(){
  try{
    const res = await fetch(apiRoot);
    if(!res.ok) return [];
    return res.json();
  }catch(e){
    console.error('Error fetching tasks', e);
    return [];
  }
}

async function createTask(title){
  const res = await fetch(apiRoot, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})});
  return res.json();
}

async function deleteTask(id){
  await fetch(`${apiRoot}/${id}`, {method:'DELETE'});
}

async function toggleComplete(task){
  const updated = {...task, completed: !task.completed};
  const res = await fetch(`${apiRoot}/${task._id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(updated)});
  return res.json();
}

function makeTaskElement(t){
  const li = document.createElement('li');
  li.className = 'task';

  const left = document.createElement('div'); left.className='left';
  const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = !!t.completed;
  chk.addEventListener('change', async ()=>{ await toggleComplete(t); load(); });

  const titleWrap = document.createElement('div');
  const title = document.createElement('div'); title.textContent = t.title || '(sin título)'; title.className = 'task-title';
  const meta = document.createElement('div'); meta.className='meta'; meta.textContent = t.completed ? 'Completada' : 'Abierta';
  if(t.completed){ title.classList.add('completed'); }

  titleWrap.appendChild(title); titleWrap.appendChild(meta);
  left.appendChild(chk); left.appendChild(titleWrap);

  const actions = document.createElement('div'); actions.className='task-actions';
  const del = document.createElement('button'); del.textContent='Eliminar'; del.addEventListener('click', async ()=>{ await deleteTask(t._id); load(); });
  actions.appendChild(del);

  li.appendChild(left); li.appendChild(actions);
  return li;
}

function renderTasks(tasks){
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');
  list.innerHTML = '';
  if(!tasks || tasks.length === 0){
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tasks.forEach(t=>{
    const el = makeTaskElement(t);
    list.appendChild(el);
  })
}

async function load(){
  const tasks = await fetchTasks();
  renderTasks(tasks);
}

document.getElementById('create-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const input = document.getElementById('title');
  const title = input.value.trim();
  if(!title) return;
  await createTask(title);
  input.value='';
  load();
});

document.getElementById('refresh').addEventListener('click', ()=>load());

load();
