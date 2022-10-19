import { render, waitFor, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios')

const dummyTodos = [
  {
    id: 1,
    description: 'Todo 1'
  },
  {
    id: 2,
    description: 'Todo 2'
  },
  {
    id: 3,
    description: 'Todo 3'
  }
]

test('todos list',async() => {
  axios.get.mockResolvedValue({data: dummyTodos})
  render(<App />)
  const todoList = await waitFor(()=> screen.findAllByTestId('todo'))
  expect(todoList).toHaveLength(3)
})




