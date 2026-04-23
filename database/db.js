import Dexie from 'https://unpkg.com/dexie/dist/modern/dexie.mjs';

const db = new Dexie('tasksDB');

db.version(1).stores({
  tasks: '++id, title, description, status, date'
});

export async function add(title, description, status) {
  try {
    let date = new Date().toLocaleString('en-GB').replace(',', '');
    const id = await db.tasks.add({ title, description, status, date });
    
    return id;
  } catch (err) {
    console.error(err);
  }
}

export async function getAll() {
    try{
        return await db.tasks.toArray();
    }catch(err){
        console.log(err);
    }
}

async function get(id) {
    try{
        return await db.tasks.get(id);
    }catch(err){
        console.log(err);
    }
}

export async function updateStatus(id, status) {
    try{
        return await db.tasks.update(id, { status: status });
    }catch(err){
        console.log(err);
    }
}

export async function remove(id) {
    try{
        await db.tasks.delete(id);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

export async function removeAll() {
    try{
        await db.tasks.clear();
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}