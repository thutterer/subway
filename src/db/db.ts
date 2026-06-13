import Dexie, { type Dexie as DexieType } from "dexie";
import dexieCloud, { type DexieCloudTable } from "dexie-cloud-addon";

export interface Task {
	id: string;
	text: string;
	done: boolean;
}

export interface Note {
	id: string;
	text: string;
	title?: string;
	type?: string;
	tasks?: Task[];
	created_at: number;
}

type SubwayNotesDB = DexieType & {
	notes: DexieCloudTable<Note, "id">;
};

const dbUrl = import.meta.env.VITE_DB_URL;

export const db = new Dexie("SubwayNotes", {
	addons: dbUrl ? [dexieCloud] : [],
}) as SubwayNotesDB;

db.version(1).stores({
	notes: dbUrl ? "@id, created_at" : "id, created_at",
});

if (dbUrl) {
	db.cloud.configure({ databaseUrl: dbUrl });
}

export const dbFetchAll = (): Promise<Note[]> =>
	db.notes.orderBy("created_at").reverse().toArray();

export const dbCreateNote = (
	text: string,
	type: string,
	title = "",
): Promise<string> =>
	db.notes.add({
		id: dbUrl ? undefined : crypto.randomUUID(),
		title,
		text,
		type,
		tasks: [],
		created_at: Date.now(),
	});

export const dbUpdateNote = (
	id: string,
	text: string,
	tasks?: Task[],
	title?: string,
): Promise<number> => {
	const update: Partial<Note> = { text };
	if (tasks !== undefined) update.tasks = tasks;
	if (title !== undefined) update.title = title;
	return db.notes.update(id, update);
};

export const dbDeleteNote = (id: string): Promise<void> => db.notes.delete(id);
