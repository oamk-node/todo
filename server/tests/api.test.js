const request = require("supertest")

const URL = "http://localhost:3001"

const newTodo = {
  description: "My test task from Jest"
}

describe("GET /",() => {
  let task = null

  beforeAll(async() => {
    const response = await request(URL).post("/new").send(newTodo)
    task = response.body
  })

  afterAll(async() => {
    await request(URL).delete(`/delete/${task.id}`)
  })

  test("should return 200",async() => {
    const response = request(URL).get("/")
    expect((await response).statusCode).toBe(200)
  })

  test("should return todos",async() => {
    const response = await request(URL).get("/")
    expect(response.body.length >=1).toBe(true)
  })

  test("should contain correct data",async() => {
    const response = await request(URL).get("/")
    const actual = response.body[0]
    const expected = {id: task.id,description: newTodo.description}
    expect(actual).toMatchObject(expected)
  })
})

describe("POST /",() => {
  let task = null

  afterAll(async() => {
    await request(URL).delete(`/delete/${task.id}`)
  })

  test("should add a new task",async() => {
    const response = await request(URL).post("/new").send(newTodo)
    expect(response.statusCode).toBe(200)
    task=response.body
    expect(task).toMatchObject(newTodo)
  })
})

describe("DELETE /",() => {
  let task = null

  beforeAll(async() => {
    const response = await request(URL).post("/new").send(newTodo)
    task = response.body
  })

  test("should delete a task",async() => {
    const response = await request(URL).delete(`/delete/${task.id}`)
    expect(response.statusCode).toBe(200)
    const id = parseInt(response.body)
    expect(id).toEqual(task.id)
  })
})

describe("PUT /",() => {
  let task = null

  beforeAll(async() => {
    const response = await request(URL).post("/new").send(newTodo)
    task = response.body
  })

  afterAll(async() => {
    await request(URL).delete(`/delete/${task.id}`)
  })

  test("should edit a task",async() => {
    const editTask = {
      id: task.id,
      description: "My edited test task from Jest"
    }
    const response = await request(URL).put("/edit").send(editTask)
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(editTask)
  })
})