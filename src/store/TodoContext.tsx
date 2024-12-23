import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Todo } from '../types/Todo';
import { Field } from '../types/Field';
import {
  getLocaleStorageTodos,
  setLocaleStorageTodos,
} from '../utils/localStorageTodos';
import { filterByTodos, filteredTodos } from '../service/service';

type TodoContextType = {
  todos: Todo[];
  field: Field;
  preparedTodos: Todo[];
  isDeleted: boolean;
  completedTodosLength: number;
  editTitle: (todo: Todo, title: string) => void;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  editField: (field: Field) => void;
  handleDeleteTodo: (todoForDelete: Todo) => void;
  changeComplete: (toggleTodo: Todo) => void;
  changeCompleteAll: () => void;
  deleteCompletedTodos: () => void;
};
export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  field: Field.ALL,
  preparedTodos: [],
  isDeleted: false,
  completedTodosLength: 0,
  editTitle: () => {},
  setIsDeleted: () => {},
  handleDeleteTodo: () => {},
  setTodos: () => {},
  editField: () => {},
  changeComplete: () => {},
  changeCompleteAll: () => {},
  deleteCompletedTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [field, setField] = useState<Field>(Field.ALL);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const getTodos = getLocaleStorageTodos();

    if (getTodos.length) {
      setTodos(getTodos);
    } else {
      localStorage.setItem('todos', JSON.stringify([]));
    }
  }, []);

  const preparedTodos = filteredTodos(todos, field);
  const completedTodosLength = filterByTodos(todos).length;

  const editTitle = useCallback(
    (todo: Todo, title: string) => {
      const updatedTodo = todos.map(currentTodo =>
        todo.id === currentTodo.id
          ? { ...currentTodo, title: title.trim() }
          : currentTodo,
      );

      setTodos(updatedTodo);
      setLocaleStorageTodos(updatedTodo);
    },
    [todos],
  );
  const changeComplete = useCallback(
    (toggleTodo: Todo) => {
      const updatedTodos = todos.map((todoItem: Todo) =>
        toggleTodo.id === todoItem.id
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem,
      );

      setTodos(updatedTodos);
      setLocaleStorageTodos(updatedTodos);
    },
    [todos],
  );

  const changeCompleteAll = useCallback(() => {
    let changedTodos;

    if (!completedTodosLength) {
      changedTodos = todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));
    } else {
      changedTodos = todos.map(todo => ({
        ...todo,
        completed: true,
      }));
    }

    setTodos(changedTodos);
    setLocaleStorageTodos(changedTodos);
  }, [todos, completedTodosLength]);

  const deleteCompletedTodos = useCallback(() => {
    const updatedTodos = todos.filter(todo => !todo.completed);

    setTodos(updatedTodos);
    setLocaleStorageTodos(updatedTodos);
    setIsDeleted(true);
  }, [todos]);

  const handleDeleteTodo = useCallback(
    (todoForDelete: Todo) => {
      const updatedTodos = todos.filter(
        (todoItem: Todo) => todoItem.id !== todoForDelete.id,
      );

      setIsDeleted(true);
      setTodos(updatedTodos);
      setLocaleStorageTodos(updatedTodos);
    },
    [todos],
  );

  const editField = useCallback((fieldValue: Field) => {
    setField(fieldValue);
  }, []);

  const values = useMemo(
    () => ({
      todos,
      field,
      preparedTodos,
      handleDeleteTodo,
      isDeleted,
      completedTodosLength,
      editTitle,
      setIsDeleted,
      setTodos,
      editField,
      changeComplete,
      changeCompleteAll,

      deleteCompletedTodos,
    }),
    [
      todos,
      field,
      isDeleted,
      preparedTodos,
      editTitle,
      setIsDeleted,
      completedTodosLength,
      setTodos,
      handleDeleteTodo,
      changeComplete,
      changeCompleteAll,
      editField,
      deleteCompletedTodos,
    ],
  );

  return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;
};
