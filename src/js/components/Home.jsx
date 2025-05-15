import React, { useState, useEffect } from 'react';
import "../../styles/index.css";

const Home = () => {
	const [task, setTask] = useState('');
	const [tasks, setTasks] = useState([]);

	const getTask = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/users/melaniedana');
			const data = await response.json();
			setTasks(data.todos)
			console.log(data.todos)
		} catch (error) {
			console.log('Error')
		}
	};

	useEffect(() => {
		getTask();
	}, []);

	const postTask = async (item) => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/todos/melaniedana', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label: item,
					is_done: false
				})
			})
			if (response.status === 201) {
				await getTask()
				setTask("")
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	const handleKeyDown = (e) => {
		if (e.keyCode === 13 && task.trim()) {
			console.log(task)
			postTask(task)
		}
	};

	const deleteTaskApi = async (id) => {
		try {
			await fetch('https://playground.4geeks.com/todo/todos/' + id, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			})
			await getTask()
		}
		catch (error) {
			console.log(error);
		}
	}

	const deleteAllTasks = async () => {
		try {
			for (const task of tasks) {
				await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				});
			}
			setTasks([]);
		} catch (error) {
			console.error("Error al borrar tareas:", error);
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card shadow">
						<div className="card-body p-4">
							<h1 className="text-center mb-4 text-primary">Todo List</h1>

							<input
								type="text"
								className="form-control form-control-lg mb-4"
								value={task}
								onChange={(e) => setTask(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Escribe y presiona Enter"
							/>

							<div className="task-list">
								{tasks.length === 0 ? (
									<p className="text-center text-muted py-3">No hay tareas, añadir tareas...</p>
								) : (
									<>
										<p className="text-center text-muted py-1">{tasks.length} {tasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}</p>
										{tasks.length > 0 && (
											<div className="text-center mb-3">
												<button
													onClick={deleteAllTasks}
													className="btn btn-sm btn-outline-danger"
												>
													Limpiar todas las tareas
												</button>
											</div>
										)}
										{tasks.map(task => (
											<div key={task.id} className="task-item d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded"
											>
												<span>{task.label}</span>
												<button
													onClick={() => deleteTaskApi(task.id)}
													className="btn btn-sm btn-danger btn-delete">
													x
												</button>
											</div>
										))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;