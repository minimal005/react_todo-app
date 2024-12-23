import React, { useContext, useState } from 'react';
import { TodoContext } from '../store/TodoContext';
import { setLocaleStorageTodos } from '../utils/localStorageTodos';

export const useForm = () => {
  const [query, setQuery] = useState('');
  const { todos, setTodos } = useContext(TodoContext);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      const newTodo = {
        title: query.trim(),
        completed: false,
        id: +new Date(),
      };

      const updatedTodos = [...todos, newTodo];

      setTodos(updatedTodos);
      setLocaleStorageTodos(updatedTodos);
      setQuery('');
    }
  };

  return { query, handleChangeQuery, handleAddTodo };
};
