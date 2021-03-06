import React, { useState, useEffect } from 'react'

import TodoAddForm from '../components/todo/TodoAddForm'
//import TodoItem from './components/TodoItem'
//import MainContent from './components/MainContent'
import TodoList from '../components/todo/TodoList'
import MyBreadcrumb from '../components/MyBreadcrumb'

function TodoApp(props) {
  // todos列表
  // todo = { id: 123213, text:'買牛奶', completed: false, edited: false }
  // const [todos, setTodos] = useState([
  //   { id: 1591256594282, text: '買牛奶', completed: false, edited: false },
  //   { id: 1591256594281, text: '買iphone', completed: false, edited: true },
  //   { id: 1591256594283, text: '學react', completed: false, edited: false },
  // ])
  //const { todos, setTodos, dataLoading, setDataLoading } = props
  //console.log(props)
  const [todos, setTodos] = useState([])

  const [dataLoading, setDataLoading] = useState(false)
  // 用於文字輸入框輸入新的todo
  const [text, setText] = useState('')

  async function getTodosFromServer() {
    // 開啟載入指示
    setDataLoading(true)

    // 注意header資料格式要設定，伺服器才知道是json格式
    const request = new Request('http://localhost:5555/todos/', {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'appliaction/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    // console.log('data', data)
    // 設定資料
    setTodos(data)
  }

  async function addNewTodoItemToSever(item) {
    // 開啟載入指示
    setDataLoading(true)

    //const newTodos = [value, ...todos]

    // 注意資料格式要設定，伺服器才知道是json格式
    const request = new Request('http://localhost:5555/todos/', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()

    console.log('伺服器回傳的json資料', data)
    // 要等驗証過，再設定資料(簡單的直接設定)
    //setTotal(total + value)
  }

  async function updateTodoItemToSever(value) {
    // 開啟載入指示
    // setDataLoading(true)

    //const newTodoItem = value

    // 注意資料格式要設定，伺服器才知道是json格式
    const request = new Request('http://localhost:5555/todos/' + value.id, {
      method: 'PUT',
      body: JSON.stringify(value),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    console.log(JSON.stringify(value))

    const response = await fetch(request)
    const data = await response.json()

    console.log('伺服器回傳的json資料', data)
    // 要等驗証過，再設定資料(簡單的直接設定)
    //setTotal(total + value)
  }

  async function deleteTodoItemToSever(id) {
    // 開啟載入指示
    //setDataLoading(true)

    //const newTodoItem = value

    // 注意資料格式要設定，伺服器才知道是json格式
    const request = new Request('http://localhost:5555/todos/' + id, {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()

    console.log('伺服器回傳的json資料', data)
    // 要等驗証過，再設定資料(簡單的直接設定)
    //setTotal(total + value)
  }

  // 一開始就會開始載入資料
  useEffect(() => {
    getTodosFromServer()
  }, [])

  // 每次total資料有變動就會3秒後關掉載入指示
  useEffect(() => {
    setTimeout(() => {
      setDataLoading(false)
    }, 500)
  }, [todos])

  // 利用id值尋找符合的todos裡的index，然後改變completed
  const handleCompleted = (id) => {
    const newTodos = [...todos]

    const todoItemIndex = todos.findIndex((v, i) => v.id === id)

    if (todoItemIndex !== -1) {
      newTodos[todoItemIndex].completed = !newTodos[todoItemIndex].completed
      updateTodoItemToSever(newTodos[todoItemIndex])
      setTodos(newTodos)
    }
  }

  // 利用id值尋找符合的todos裡的index，然後改變edited值
  const handleEditedToggle = (id) => {
    const newTodos = [...todos]

    const todoItemIndex = todos.findIndex((v, i) => v.id === id)

    if (todoItemIndex !== -1) {
      newTodos[todoItemIndex].edited = !newTodos[todoItemIndex].edited

      updateTodoItemToSever(newTodos[todoItemIndex])
      setTodos(newTodos)
    }
  }

  // 利用id值尋找符合的todos裡的index，然後改變text值
  const handleEditedSave = (id, text) => {
    const newTodos = [...todos]

    const todoItemIndex = todos.findIndex((v, i) => v.id === id)

    if (todoItemIndex !== -1) {
      newTodos[todoItemIndex].text = text
      updateTodoItemToSever(newTodos[todoItemIndex])
      setTodos(newTodos)
    }

    handleEditedToggle(id)
  }

  // 把成員直接從陣列中刪除
  const handleDelete = (id) => {
    const newTodos = todos.filter((v, i) => v.id !== id)
    deleteTodoItemToSever(id)
    setTodos(newTodos)
  }

  const loading = (
    <>
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  )

  const display = (
    <>
      <TodoAddForm
        text={text}
        todos={todos}
        setText={setText}
        setTodos={setTodos}
        addNewTodoItemToSever={addNewTodoItemToSever}
      />
      <TodoList
        todos={todos}
        handleCompleted={handleCompleted}
        handleDelete={handleDelete}
        handleEditedToggle={handleEditedToggle}
        handleEditedSave={handleEditedSave}
      />
    </>
  )

  // 初始化的第一次render的判斷，擋掉會看到空白頁，初始化值的情況
  // if (todos.length === 0) return <></>

  return (
    <>
      <MyBreadcrumb />
      {dataLoading ? loading : display}
    </>
  )
}

export default TodoApp
