
const taskElem = document.querySelector('.task')
const doneElem = document.querySelector('.done')
const skipElem = document.querySelector('.skip')
const clerElem = document.querySelector('.remove-progress')
const progressElem = document.querySelector('#scale')
const URLTaskRequest = ''

class Taskmenu {
    buttonNext: Element | null
    taskText: Element | null
    scale: Element | null
    taskCurrent: string
    arrTasks: string[]
    skipFlag: boolean
    skip: Element | null
    counting: {count: number, remained: number}
    idTask: string | null
    clear: Element | null
    

    constructor(
        butDOM: Element | null, 
        taskDOM: Element | null, 
        scaleDom: Element | null, 
        skipDom : Element | null, 
        clearDom: Element | null
        ) {
        this.buttonNext = butDOM
        this.taskText = taskDOM
        this.scale = scaleDom
        this.skip = skipDom
        this.clear = clearDom
        this.taskCurrent = ''
        this.idTask = null
        this.skipFlag = false
        this.arrTasks = []
        this.counting = {count: 0, remained: 0}
    }

    _outTask() {
        if (!this.taskText) return
        this.taskText.textContent = this.taskCurrent
    }

    _updateArrTasks(arr: string[]){
        if(!Array.isArray(arr)) return
        const storage = localStorage.getItem("tasks")
        if(storage){
            const exceptions = JSON.parse(storage)
            this.arrTasks = arr.filter(item => !exceptions.includes(item))
        } else {
            this.arrTasks = arr
        }
        this.counting.count = arr.length
        this.counting.remained = this.arrTasks.length
        this._selectionRandomTask()
    }

    _selectionRandomTask(){
        let max = this.counting.remained
        if(max == 0) return
        let randomTask = Math.floor(Math.random() * (max - 0) + 0)
        this.idTask = this.arrTasks[randomTask]
        this._taskRequest()
    }

    async _taskRequest(){
        const idTask = this.idTask
        const data = await fetch(URLTaskRequest + '/task/' + idTask)
        const task = await data.json()
        if("err" in task) console.error(task.err)
        if(!task.text) return
        this.taskCurrent = task.text
        this._outTask()
    }

    _localStorageUpdate(){
        const idTask = this.idTask
        if(!idTask) return
        const item = localStorage.getItem("tasks")
        if(!item) {
            localStorage.setItem("tasks",JSON.stringify([idTask]))
        } else {
            localStorage.setItem("tasks",JSON.stringify([...JSON.parse(item), idTask]))
        }
    }

    _localStorageClear(){
        localStorage.clear()
        this.counting.count = 100
        this.counting.remained = 100
        this._progressUpdate()
    }

    _progressUpdate(){
        console.log(this.counting)
        if(!this.scale) return
        this.scale.setAttribute("max", String (this.counting.count))
        let n = this.counting.count - this.counting.remained
        this.scale.setAttribute("value", String(n))
    }

    async _tasksRequest() {
        const data = await fetch(URLTaskRequest + '/tasks')
        const tasks = await data.json()
        if("err" in tasks) console.error(tasks.err)
        if(!tasks.data) return
        this._updateArrTasks(tasks.data)
        this._progressUpdate()
    }

    async initCounting(){
        const storage = localStorage.getItem("tasks")
        if(storage){
            const data = await fetch(URLTaskRequest + '/tasks')
            const tasks = await data.json()
            if(!Array.isArray(tasks.data) && !Array.isArray(JSON.parse(storage))) {this.counting = {count: 0, remained: 0}}
            const count = tasks.data.length
            const remained = count - JSON.parse(storage).length
            this.counting = {count, remained}
        } else {
            this.counting = {count: 0, remained: 0}
        }
        console.log(this.counting)
        this._progressUpdate()
    }

    hengEvents() {
        this.buttonNext?.addEventListener('click', () => {
            this.skipFlag = false
            this._localStorageUpdate()
            this._tasksRequest()
        })
        this.skip?.addEventListener('click', () => {
            this.skipFlag = true
            this._tasksRequest()
        })
        this.clear?.addEventListener('click', () => {
            this._localStorageClear()
        })
        
    }
}

const menu = new Taskmenu(doneElem, taskElem, progressElem, skipElem, clerElem)

menu.initCounting()
menu.hengEvents()






