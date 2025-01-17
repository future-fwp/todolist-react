import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type task = { id: number; taskName: string; completed: boolean; date: string };
const TodoApp = () => {
	const [tasks, setTasks] = useState<task[]>([]);
	const [newTask, setNewTask] = useState("");

	const [error, setError] = useState("");

	const onDragEnd = (result: any) => {
		const { destination, source } = result;
		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		const newTasks = Array.from(tasks);
		const [removeId] = newTasks.splice(source.index, 1);
		newTasks.splice(destination.index, 0, removeId);

		setTasks(newTasks);
	};

	const handleAddTask = () => {
		if (newTask.trim() === "") {
			setError("task name is required.");
			return;
		}
		if (newTask.trim() !== "") {
			setError("");
			setTasks([
				...tasks,
				{ id: tasks.length, taskName: newTask, completed: false, date: new Date().toISOString() },
			]);
			setNewTask("");
		}
	};

	const handleRemoveTask = (id: number) => {
		setTasks(
			tasks.filter((each) => {
				return each.id !== id;
			})
		);
	};

	return (
		<div>
			<h1>To-Do List</h1>
			<div>
				<input
					type="text"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					placeholder="Add a new task"
				/>
				<button onClick={handleAddTask}>Add Task</button>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="todo-list">
					{(provided) => (
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="todo-list"
						>
							{!error &&
								tasks.map((task, index) => (
									<Draggable
										key={task.id}
										draggableId={task.id.toString()}
										index={index}
									>
										{(provided) => (
											<li
												key={index}
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
											>
												{task.taskName}
												<button onClick={() => handleRemoveTask(index)}>Remove</button>
											</li>
										)}
									</Draggable>
								))}
						</ul>
					)}
				</Droppable>
			</DragDropContext>

			{error && <p>{error}</p>}
		</div>
	);
};

export default TodoApp;
