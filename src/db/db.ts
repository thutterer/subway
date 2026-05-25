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
	type?: string;
	tasks?: Task[];
	created_at: number;
}

type SubwayNotesDB = DexieType & {
	notes: DexieCloudTable<Note, "id">;
};

export const db = new Dexie("SubwayNotes", {
	addons: [dexieCloud],
}) as SubwayNotesDB;

db.version(1).stores({
	notes: "@id, created_at",
});

db.cloud.configure({
	databaseUrl: "https://zmj6t0epw.dexie.cloud",
});

export const dbFetchAll = (): Promise<Note[]> =>
	db.notes.orderBy("created_at").reverse().toArray();

export const dbCreateFoo = (text: string, type: string): Promise<string> =>
	db.notes.add({
		text,
		type,
		tasks: [],
		created_at: Date.now(),
	});

export const dbUpdateNote = (
	id: string,
	text: string,
	tasks?: Task[],
): Promise<number> => db.notes.update(id, { text, tasks });

export const dbDeleteNote = (id: string): Promise<void> => db.notes.delete(id);

export const dbFetchNoteById = (id: string): Promise<Note | undefined> =>
	db.notes.get(id);
