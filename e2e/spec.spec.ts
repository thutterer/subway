import { expect, test } from "@playwright/test";

const uid = () => Math.random().toString(36).slice(2, 8);

test.describe("Index", () => {
	test("shows heading and nav", async ({ page }) => {
		await page.goto("/");
		await expect(
			page.getByRole("heading", { name: "Subway Notes" }),
		).toBeVisible();
		await expect(page.getByText("+ New")).toBeVisible();
	});

	test("shows empty state", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("No notes yet.")).toBeVisible();
	});

	test('"+ New" navigates to creation page', async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await expect(page.getByText("What do you want to create?")).toBeVisible();
	});

	test("unknown route shows 404", async ({ page }) => {
		await page.goto("/does-not-exist");
		await expect(page.getByText("404")).toBeVisible();
	});
});

test.describe("Notes", () => {
	test("create note and persist body across page reload", async ({ page }) => {
		const body = `body-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });
		await page.locator("textarea").fill(body);

		await page.goto("/");
		await expect(page.getByText("Untitled")).toBeVisible();

		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);

		await expect(page.locator("textarea")).toHaveValue(body, { timeout: 5000 });
	});

	test("edit note title", async ({ page }) => {
		const title = `title-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });

		await page.goto("/");
		await expect(page.getByText("Untitled")).toBeVisible();

		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.locator("textarea").waitFor({ state: "visible" });

		const noteId = page.url().split("/note/")[1];

		await page.getByRole("button", { name: "edit" }).click();
		const input = page.locator(".title-input");
		await input.fill(title);
		await input.press("Enter");

		await page.evaluate(
			async ({ id, title }) => {
				const mod = await import("/src/db/db.ts");
				await mod.dbUpdateNote(id, "", undefined, title);
			},
			{ id: noteId, title },
		);

		await page.goto("/");
		await expect(page.getByText(title)).toBeVisible();

		await page.getByText(title).click();
		await page.waitForURL(/\/note\//);
		await expect(page.getByText(title)).toBeVisible();
	});

	test("delete a note", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });

		await page.goto("/");
		await expect(page.getByText("Untitled")).toBeVisible();

		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.locator("textarea").waitFor({ state: "visible" });

		const noteId = page.url().split("/note/")[1];
		await page.evaluate(async (id) => {
			const mod = await import("/src/db/db.ts");
			await mod.dbDeleteNote(id);
		}, noteId);

		await page.goto("/");
		await expect(page.getByText("No notes yet.")).toBeVisible();
	});

	test("navigate from list to edit page shows correct content", async ({
		page,
	}) => {
		const body = `nav-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });
		await page.locator("textarea").fill(body);

		await page.goto("/");
		await expect(page.getByText("Untitled")).toBeVisible();

		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);

		await expect(page.locator("textarea")).toHaveValue(body, { timeout: 5000 });
		await expect(page.getByRole("button", { name: "delete" })).toBeVisible();
		await expect(page.getByText("Untitled")).toBeVisible();
	});
});

test.describe("Lists", () => {
	test("create and manage a List", async ({ page }) => {
		const title = `list-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();
		await expect(page.getByText("Untitled")).toBeVisible();

		await page.goto("/");
		await expect(page.getByText("Untitled")).toBeVisible();
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.getByRole("button", { name: "edit" }).click();
		const titleInput = page.locator(".title-input");
		await titleInput.fill(title);
		await titleInput.press("Enter");

		const taskInput = page.getByPlaceholder("Add item...");
		await taskInput.fill("Milk");
		await taskInput.press("Enter");
		await taskInput.fill("Eggs");
		await taskInput.press("Enter");

		await page.goto("/");
		await expect(page.getByText(title)).toBeVisible();
	});
});
