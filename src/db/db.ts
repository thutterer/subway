import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

export interface Task {
	id: string;
	text: string;
	done: boolean;
}

export interface TextBlock {
	type: "text";
	markdown: string;
}

export interface ListBlock {
	type: "list";
	items: Task[];
}

export interface DividerBlock {
	type: "divider";
}

export type Block = TextBlock | ListBlock | DividerBlock;

export interface Doc {
	id: string;
	title?: string;
	blocks: Block[];
	created_at: number;
}

interface OldNote {
	id: string;
	text: string;
	title?: string;
	type?: string;
	tasks?: Task[];
	created_at: number;
}

type SubwayNotesDB = Dexie & {
	docs: Dexie.Table<Doc, string>;
};

const dbUrl = import.meta.env.VITE_DB_URL;

export const db = new Dexie("SubwayNotes", {
	addons: dbUrl ? [dexieCloud] : [],
}) as SubwayNotesDB;

db.version(1).stores({
	notes: dbUrl ? "@id, created_at" : "id, created_at",
});

db.version(2)
	.stores({
		docs: dbUrl ? "@id, created_at" : "id, created_at",
	})
	.upgrade(async (tx) => {
		try {
			const notes = await tx.table<OldNote>("notes").toArray();
			for (const note of notes) {
				const block: Block =
					note.type === "List"
						? { type: "list", items: note.tasks ?? [] }
						: { type: "text", markdown: note.text ?? "" };
				await tx.table("docs").add({
					id: note.id,
					title: note.title,
					blocks: [block],
					created_at: note.created_at,
				});
			}
		} catch {
			// notes table may not exist on fresh install
		}
	});

if (dbUrl) {
	db.cloud.configure({ databaseUrl: dbUrl });
}

export const dbFetchAllDocs = (): Promise<Doc[]> =>
	db.docs.orderBy("created_at").reverse().toArray();

export const dbCreateDoc = (blockType: Block["type"]): Promise<string> => {
	const block: Block =
		blockType === "list"
			? { type: "list", items: [] }
			: { type: "text", markdown: "" };
	return db.docs.add({
		id: dbUrl ? undefined : crypto.randomUUID(),
		title: "",
		blocks: [block],
		created_at: Date.now(),
	} as any);
};

export const dbUpdateDoc = (
	id: string,
	updates: { blocks?: Block[]; title?: string },
): Promise<number> => db.docs.update(id, updates);

export const dbDeleteDoc = (id: string): Promise<void> => db.docs.delete(id);
