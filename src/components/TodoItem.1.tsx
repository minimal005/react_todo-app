import cn from 'classnames';
import React, { useContext, useState } from 'react';
import { TodoContext } from '../store/TodoContext';
import { Props } from './TodoItem';

export const TodoItem: React.FC<Props> = ({
  todo,
  showEditId,
  setShowEditId,
}) => {
  const { changeComplete, handleDeleteTodo, editTitle, setIsDeleted } =
    useContext(TodoContext);

  const [title, setTitle] = useState(todo.title);

  const handleSubmitEditedTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim().length) {
      handleDeleteTodo(todo);
      setIsDeleted(true);
    } else if (title.trim() === todo.title) {
      setShowEditId(null);
    } else if (showEditId && title.trim()) {
      editTitle(todo, title);
      setShowEditId(null);
    }
  };

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setTitle(todo.title);
      setShowEditId(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {' '}
        <input
          checked={todo.completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeComplete(todo)}
        />
      </label>

      {showEditId ? (
        <form onSubmit={handleSubmitEditedTodo} onBlur={handleSubmitEditedTodo}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={handleEscape}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setShowEditId(todo.id)}
          >
            {todo.title}
          </span>

          <button
            onClick={() => handleDeleteTodo(todo)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            x
          </button>
        </>
      )}
    </div>
  );
};
