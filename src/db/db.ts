import Dexie, { type Dexie as DexieType, type Table } from 'dexie';

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id?: number;
  text: string;
  type?: string;
  tasks?: Task[];
  pending_sync: number;
  created_at: number;
}

type SubwayNotesDB = DexieType & {
  notes: Table<Note, number>;
};

export const db = new Dexie('SubwayNotes') as SubwayNotesDB;

db.version(1).stores({
  notes: '++id, text, pending_sync, created_at'
});

export const dbFetchAll = (): Promise<Note[]> =>
  db.notes.orderBy('created_at').reverse().toArray();

export const dbCreateFoo = (text: string, type: string): Promise<number> =>
  db.notes.add({
    text,
    type,
    tasks: [],
    pending_sync: 1,
    created_at: Date.now()
  });

export const dbUpdateNote = (id: number, text: string, tasks?: Task[]): Promise<number> =>
  db.notes.update(id, { text, tasks, pending_sync: 1 });

export const dbDeleteNote = (id: number): Promise<void> =>
  db.notes.delete(id);

export const dbFetchNoteById = (id: number): Promise<Note | undefined> =>
  db.notes.get(id);
