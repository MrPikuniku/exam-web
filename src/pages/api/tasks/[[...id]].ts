




import type { NextApiRequest, NextApiResponse } from "next";
import { writeFileSync, readFileSync, existsSync} from 'fs';
import { join } from "path";

export type Task = {
  id: number,
  name: string;
  createdAt: string;
  completed: boolean;
};

type TaskCreation = Omit<Task, 'id' | 'createdAt'>;

function wait(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms);
  })
}

const DB_PATH = join(process.cwd(), 'tasks.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!existsSync(DB_PATH))
      writeFileSync(DB_PATH, '[]');

  const delay = parseInt((Array.isArray(req.query.wait) ? req.query.wait[0] : req.query.wait) ?? '1000');
  await wait(delay);

  switch(req.method) {
    case 'GET':
      return res.status(200).json(list());

    case 'POST':
      return res.status(201).json(create(req.body));

    case 'PUT':
      const id = parseInt(req.query.id?.[0] ?? '');
      if (id < 1) return res.status(400).json({message: "ID is missing from URL, you must hit PUT http://localhost:3000/api/1 for instance"});
      return update(id, req.body, res);
    
    default:
      return res.status(500).json({message: "This HTTP method is not supported"})
  }
}

function list() : Task[] {
  return JSON.parse(readFileSync(DB_PATH).toString());
}

function create(data: TaskCreation) {
  const entries: [number, Task][] = list().map(task => [task.id, task]);
  
  const tasks = new Map(entries);
  const id = Date.now() + Math.round(Math.random() * 100);

  const newTask = {
    ...data,
    id,
    createdAt: new Date().toISOString()
  } satisfies Task;

  tasks.set(id, newTask);
  writeFileSync(DB_PATH, JSON.stringify(Array.from(tasks.values()), null, 2));

  return newTask;
}

function update(id: number, data: TaskCreation, res: NextApiResponse) {
  const entries: [number, Task][] = list().map(task => [task.id, task]);

  const tasks = new Map(entries);
  const task = tasks.get(id);
  if (!task)
    return res.status(404).json({ message : `There is no task found with the ID ${id}`});

  const updatedTask = {
    ...task,
    ...data,
  };

  tasks.set(id, updatedTask);

  writeFileSync(DB_PATH, JSON.stringify(Array.from(tasks.values()), null, 2));

  return res.status(200).json(updatedTask);
}









