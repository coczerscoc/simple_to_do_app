const list_parent = document.querySelector('[data-list]')
const item_form = document.querySelector('[data-item-form]')
const item_name = document.querySelector('[data-item-name]')
const app_parent = document.querySelector('[data-task-app]')
const app_parent_title = document.querySelector('[data-task-title]')
const delete_button = document.querySelector('[data-delete-list]')
const clear_button = document.querySelector('[data-clear-list]')
const task_remaining = document.querySelector('[data-task-remaining]')
const task_form = document.querySelector('[data-task-form]')
const task_input = document.querySelector('[data-task-input]')
// const example = document.querySelector('[data-example]')

const LOCAL_STORAGE_KEY = 'task.lists'
const LOCAL_SELECTED_ID_KEY = 'task.selectedId'

let list_children = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
let selectedList = localStorage.getItem(LOCAL_SELECTED_ID_KEY)

item_name.addEventListener('focus', e => { clearPlaceholder(e.target) })
item_name.addEventListener('blur', e => { fillPlaceholder(e.target) })
task_input.addEventListener('focus', e => { clearPlaceholder(e.target) })
task_input.addEventListener('blur', e => { fillPlaceholder(e.target) })


clear_button.addEventListener('click', () => {
    list_children = []
    selectedList = null
    task_remaining.innerText = ''
    SaveAndRender()
})

delete_button.addEventListener('click', () => {
    list_children = list_children.filter(list => list.id !== selectedList)
    selectedList = null
    task_remaining.innerText = ''
    SaveAndRender()
})

item_form.addEventListener('submit', e => {
    e.preventDefault()
    const new_item_name = item_name.value
    const newItem = createItem(new_item_name)
    item_name.value = null
    list_children.push(newItem)
    SaveAndRender()
})

task_form.addEventListener('submit', e => {
    e.preventDefault()
    const new_task_name = task_input.value
    const selectedId = list_children.find(list => list.id === selectedList)
    const newTask = createTask(selectedId.tasks.length, new_task_name)
    selectedId.tasks.push(newTask)
    task_input.value = null

    SaveAndRender()
})

app_parent.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li' || e.target.tagName.toLowerCase() === 'i') {
        const getTask = list_children.find(list => list.id === selectedList)
        const getTaskId = getTask.tasks.find(find_task => find_task.id == e.target.dataset.taskId)
        if(!getTaskId.complete) {
            e.target.classList.remove("task_incomplete")
            e.target.classList.add("task_complete")
            getTaskId.complete = true

        } else {
            e.target.classList.add("task_incomplete")
            e.target.classList.remove("task_complete")
            getTaskId.complete = false
        }
    }
    SaveAndRender()
})

list_parent.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li' || e.target.tagName.toLowerCase() === 'i') {
        if(e.target.dataset.listId == selectedList) {
            selectedList = null
            e.target.classList.remove("list-active")
            app_parent.style.display = 'none'
            app_parent_title.style.display = 'none'
            task_remaining.style.display = 'none'
        } else {
            selectedList = e.target.dataset.listId
            task_remaining.style.display = 'block'
            app_parent.style.display = 'block'
            app_parent_title.style.display = 'block'
        }
        SaveAndRender()
    }
})

function clearPlaceholder(element) {
    element.placeholder = ''
}

function fillPlaceholder(element) {
    if( element.classList.contains("input_category") ) {
        element.placeholder = 'Add new category...'
    } else {
        element.placeholder = 'Add new task...'
    }
}

function createTask(task_id, task_name) {
    return { 
        id: ++task_id,
        name: task_name,
        complete: false
    }
}

function createItem(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function render() {
    clearChild(list_parent)
    clearChild(app_parent)
    app_parent_title.innerText = ''
    list_children.forEach( list_child => {
        let id = list_child.id
        const createChildFront = document.createElement('i')
        const createChild = document.createElement('li')
        createChildFront.classList.add("far", "fa-calendar-check")
        createChild.classList.add("list_children")
        createChildFront.dataset.listId = id
        createChild.dataset.listId = id
        createChild.innerText = list_child.name
        if(id == selectedList) {
            clearChild(app_parent)
            createChild.classList.add("list-active")
            app_parent_title.innerText = list_child.name
            app_parent.dataset.appId = id
            parentApp(list_child.tasks)
        }
        
        createChild.insertAdjacentElement("afterbegin", createChildFront)
        list_parent.appendChild(createChild)
    })
    // example.innerText = selectedList
}

function parentApp(tasks) {
    let taskCounter = 0;
    tasks.forEach( task => {
        const createCheck = document.createElement('i')
        const createBorder = document.createElement('hr')
        const createChildApp = document.createElement('li')
        createChildApp.innerText = task.name
        createChildApp.dataset.taskId = task.id
        createCheck.dataset.taskId = task.id
        if(!task.complete) {
            taskCounter++
            createChildApp.classList.add("task_incomplete")
            createCheck.classList.add("far", "fa-circle")
        } else {
            createChildApp.classList.add("task_complete")
            createCheck.classList.add("far", "fa-check-circle")
        }
        createChildApp.insertAdjacentElement('afterbegin', createCheck)
        createChildApp.appendChild(createBorder)
        app_parent.appendChild(createChildApp)
    })

    let taskRemaining = taskCounter == 1 ? 'task remaining' : 'tasks remaining'
    task_remaining.innerText = `${taskCounter} ${taskRemaining}`
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list_children))
    localStorage.setItem(LOCAL_SELECTED_ID_KEY, selectedList)
}

function SaveAndRender() {
    save()
    render()
}

function clearChild(parent) {
    while( parent.firstChild ) {
        parent.removeChild(parent.firstChild)
    }
}

render()