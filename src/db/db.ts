import Dexie from 'dexie';

// Initialize database
export const db = new Dexie('SubwayNotes');

db.version(1).stores({
  notes: '++id, text, pending_sync, created_at'
});

// Database Actions
export const dbFetchAll = () => db.notes.orderBy('created_at').reverse().toArray();

export const dbCreateNote = () => db.notes.add({
  text: '',
  pending_sync: 1,
  created_at: Date.now()
});

export const dbCreateFoo = (text, type) => db.notes.add({
  text,
  type,
  pending_sync: 1,
  created_at: Date.now()
});

export const dbUpdateNote = (id, text) => db.notes.update(id, { text, pending_sync: 1 });

export const dbDeleteNote = (id) => db.notes.delete(id);

export const dbFetchNoteById = (id) => db.notes.get(id);
