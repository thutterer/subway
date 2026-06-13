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

		await page.getByRole("button", { name: "edit" }).click();
		const input = page.locator(".title-input");
		await input.fill(title);
		await input.press("Enter");

		await page.waitForTimeout(200);

		await page.goto("/");
		await expect(page.getByText(title)).toBeVisible();

		await page.getByText(title).click();
		await page.waitForURL(/\/note\//);
		await expect(page.getByText(title)).toBeVisible();
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

	test("delete a note via UI button with confirm dialog", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.locator("textarea").waitFor({ state: "visible" });

		page.once("dialog", (dialog) => dialog.accept());
		await page.getByRole("button", { name: "delete" }).click();
		await page.waitForURL("/");

		await expect(page.getByText("No notes yet.")).toBeVisible();
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

		await page.waitForTimeout(300);

		const taskInput = page.getByPlaceholder("Add item...");
		await taskInput.fill("Milk");
		await taskInput.press("Enter");
		await taskInput.fill("Eggs");
		await taskInput.press("Enter");

		await page.waitForTimeout(300);

		await page.goto("/");
		await expect(page.getByText(title)).toBeVisible();
	});

	test("toggle a task done/undone persists across reload", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		const noteId = page.url().split("/note/")[1];

		const taskInput = page.getByPlaceholder("Add item...");
		await taskInput.fill("Task A");
		await taskInput.press("Enter");
		await taskInput.fill("Task B");
		await taskInput.press("Enter");

		await expect(page.locator(".indicator")).toHaveText(["☐", "☐"]);

		await page.locator(".task").first().click();
		await expect(page.locator(".indicator")).toHaveText(["☑", "☐"]);

		await page.waitForTimeout(300);

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await expect(page.locator(".indicator")).toHaveText(["☑", "☐"]);

		await page.locator(".task").first().click();
		await expect(page.locator(".indicator")).toHaveText(["☐", "☐"]);

		await page.waitForTimeout(300);

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await expect(page.locator(".indicator")).toHaveText(["☐", "☐"]);
	});

	test("delete a task persists across reload", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		const noteId = page.url().split("/note/")[1];

		const taskInput = page.getByPlaceholder("Add item...");
		await taskInput.fill("Alpha");
		await taskInput.press("Enter");
		await taskInput.fill("Beta");
		await taskInput.press("Enter");
		await taskInput.fill("Gamma");
		await taskInput.press("Enter");

		await expect(page.locator(".indicator")).toHaveText(["☐", "☐", "☐"]);

		await page.locator(".task").nth(1).locator(".delete").click();
		await expect(page.locator(".task")).toHaveCount(2);
		await expect(page.locator(".task").nth(0)).toContainText("Alpha");
		await expect(page.locator(".task").nth(1)).toContainText("Gamma");

		await page.waitForTimeout(300);

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await expect(page.locator(".task")).toHaveCount(2);
		await expect(page.locator(".task").nth(0)).toContainText("Alpha");
		await expect(page.locator(".task").nth(1)).toContainText("Gamma");
	});

	test("progress bar updates when toggling tasks", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		const taskInput = page.getByPlaceholder("Add item...");
		await taskInput.fill("X");
		await taskInput.press("Enter");
		await taskInput.fill("Y");
		await taskInput.press("Enter");

		const fill = page.locator(".fill");
		await expect(fill).toHaveAttribute("style", "width: 0%");

		await page.locator(".task").first().click();
		await expect(page.locator(".indicator").first()).toHaveText("☑");
		await expect(fill).toHaveAttribute("style", "width: 50%");

		await page.locator(".task").last().click();
		await expect(page.locator(".indicator").last()).toHaveText("☑");
		await expect(fill).toHaveAttribute("style", "width: 100%");
	});
});

test.describe("Blocks", () => {
	test("insert blocks of all types and persist across reload", async ({
		page,
	}) => {
		const text = `text-${uid()}`;
		const task = `task-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });
		await page.locator("textarea").fill(text);

		// Add a list block after the first text block (inserter at position 1)
		await page
			.locator(".inserter")
			.nth(1)
			.locator(".ins-pill")
			.click({ force: true });
		await page.getByRole("button", { name: "List" }).click();
		await page.getByPlaceholder("Add item...").fill(task);
		await page.getByPlaceholder("Add item...").press("Enter");

		// Add a divider after the list block (inserter at position 2)
		await page
			.locator(".inserter")
			.nth(2)
			.locator(".ins-pill")
			.click({ force: true });
		await page.getByRole("button", { name: "---" }).click();

		// Add a text block after the divider (inserter at position 3)
		await page
			.locator(".inserter")
			.nth(3)
			.locator(".ins-pill")
			.click({ force: true });
		await page.getByRole("button", { name: "Text" }).click();
		await page.locator("textarea").nth(1).fill("After divider");

		await expect(page.locator("textarea")).toHaveCount(2);
		await expect(page.locator("list-item")).toBeVisible();
		await expect(page.locator("divider-item")).toBeVisible();

		await page.waitForTimeout(300);

		// Reload and verify all blocks persisted
		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.locator("textarea").first().waitFor({ state: "visible" });

		await expect(page.locator("textarea").first()).toHaveValue(text);
		await expect(page.locator("textarea").nth(1)).toHaveValue("After divider");
		await expect(page.locator("list-item")).toBeVisible();
		await expect(page.locator("divider-item")).toBeVisible();
		await expect(page.getByText(task)).toBeVisible();
	});

	test("delete a block", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });
		await page.locator("textarea").fill("Block A");

		// Add a second text block
		await page
			.locator(".inserter")
			.nth(1)
			.locator(".ins-pill")
			.click({ force: true });
		await page.getByRole("button", { name: "Text" }).click();
		await page.locator("textarea").nth(1).fill("Block B");

		await expect(page.locator("textarea")).toHaveCount(2);

		// Delete the first block
		page.once("dialog", (dialog) => dialog.accept());
		await page
			.locator(".block-group")
			.first()
			.locator(".block-actions button")
			.click({ force: true });

		await expect(page.locator("textarea")).toHaveCount(1);
		await expect(page.locator("textarea")).toHaveValue("Block B");

		await page.waitForTimeout(300);

		// Reload and verify deletion persisted
		await page.goto("/");
		await page.getByText("Untitled").click();
		await page.waitForURL(/\/note\//);
		await page.locator("textarea").waitFor({ state: "visible" });

		await expect(page.locator("textarea")).toHaveCount(1);
		await expect(page.locator("textarea")).toHaveValue("Block B");
	});

	test("display type on home page for multi-block docs", async ({ page }) => {
		// A doc starting with a text block shows "Note"
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });

		// Add a list block as second block
		await page
			.locator(".inserter")
			.nth(1)
			.locator(".ins-pill")
			.click({ force: true });
		await page.getByRole("button", { name: "List" }).click();
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.goto("/");
		await expect(page.locator(".type")).toHaveText("Note");

		// A doc starting with a list block shows "List"
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();
		await page.getByPlaceholder("Add item...").waitFor({ state: "visible" });

		await page.goto("/");
		await expect(page.locator(".type")).toHaveText(["List", "Note"]);
	});
});

test.describe("Navigation", () => {
	test("back-link navigates home from creation page", async ({ page }) => {
		await page.goto("/new");
		await expect(page.getByText("What do you want to create?")).toBeVisible();
		await page.getByText("<").click();
		await expect(page).toHaveURL("/");
	});

	test("back-link navigates home from edit page", async ({ page }) => {
		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await page.locator("textarea").waitFor({ state: "visible" });

		await page.getByText("<").click();
		await expect(page).toHaveURL("/");
	});
});
