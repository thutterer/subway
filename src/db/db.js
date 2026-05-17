import Dexie from 'dexie';

// Initialize database
export const db = new Dexie('SubwayNotes');
db.version(1).stores({
  notes: '++id, text, pending_sync'
});

// Database Actions
export const dbFetchAll = () => db.notes.toArray();

export const dbCreateNote = () => db.notes.add({ text: '', pending_sync: 1 });

export const dbUpdateNote = (id, text) => db.notes.update(id, { text, pending_sync: 1 });

export const dbDeleteNote = (id) => db.notes.delete(id);
