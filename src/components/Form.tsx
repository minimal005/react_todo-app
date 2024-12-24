import React, { useEffect, useRef } from 'react';

import { useForm } from '../hooks/useForm';

export const Form: React.FC = () => {
  const field = useRef<HTMLInputElement>(null);

  const { query, handleAddTodo, handleChangeQuery } = useForm();

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, []);

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
      />
    </form>
  );
};
