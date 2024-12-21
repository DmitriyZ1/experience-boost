
const taskElem = document.querySelector('.task')
const butElem = document.querySelector('.but')
const URLTaskRequest = ''

class Taskmenu {
    buttonNext: Element | null
    taskText: Element | null
    taskCurrent: string

    constructor(butDOM: Element | null, taskDOM: Element | null) {
        this.buttonNext = butDOM
        this.taskText = taskDOM
        this.taskCurrent = ''
    }

    _outTask() {
        if (!this.taskText) return
        this.taskText.textContent = this.taskCurrent
    }

    _selectionRandomTask(arr: string[]){
        let max = arr.length
        let randomTask = Math.floor(Math.random() * (max - 0) + 0)
        this._taskRequest(arr[randomTask])
    }

    async _taskRequest(idTask: string){
        
        const data = await fetch(URLTaskRequest + '/task/' + idTask)
        const task = await data.json()
        console.log(task)
        if("err" in task) console.error(task.err)
        if(!task.text) return
        this.taskCurrent = task.text
        this._outTask()
    }

    async _tasksRequest() {
        const data = await fetch(URLTaskRequest + '/tasks')
        const tasks = await data.json()
        if("err" in tasks) console.error(tasks.err)
        if(!tasks.data) return
        this._selectionRandomTask(tasks.data)
    }

    hengEvents() {
        if (!this.buttonNext) return 
        this.buttonNext.addEventListener('click', () => {
            this._tasksRequest()
        })
    }
}

const menu = new Taskmenu(butElem, taskElem)

menu.hengEvents()




