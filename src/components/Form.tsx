import React, { useContext, useEffect, useRef } from 'react';

import { useForm } from '../hooks/useForm';
import { TodoContext } from '../store/TodoContext';

export const Form: React.FC = () => {
  const field = useRef<HTMLInputElement>(null);

  const { query, handleAddTodo, handleChangeQuery } = useForm();
  const { todos, isDeleted } = useContext(TodoContext);

  useEffect(() => {
    if ((field && !todos.length) || isDeleted) {
      field.current?.focus();
    }
  }, [todos.length, isDeleted]);

  return (
    <form onSubmit={handleAddTodo}>
      <input
        ref={field}
        value={query}
        onChange={handleChangeQuery}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
      />
    </form>
  );
};
