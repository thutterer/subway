import { expect, test } from "@playwright/test";

test.describe("CRUD", () => {
	const uid = () => Math.random().toString(36).slice(2, 8);

	test("create and edit a Note", async ({ page }) => {
		const text = `note-${uid()}`;

		await page.goto("/");
		await expect(page.getByText("Subway Notes")).toBeVisible();
		await page.getByText("+ New").click();

		await expect(page.getByText("What do you want to create?")).toBeVisible();
		await page.getByText("Note", { exact: true }).click();

		await expect(page.locator("textarea")).toBeVisible();
		await expect(page.locator("textarea")).toHaveValue("");

		await page.locator("textarea").fill(text);
		await page.goto("/");
		await expect(page.getByText(text)).toBeVisible();
	});

	test("create and manage a List", async ({ page }) => {
		const title = `list-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("List", { exact: true }).click();

		await expect(page.getByText("Untitled")).toBeVisible();
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

	test("delete a note", async ({ page }) => {
		const text = `del-${uid()}`;

		await page.goto("/");
		await page.getByText("+ New").click();
		await page.getByText("Note", { exact: true }).click();
		await expect(page.locator("textarea")).toBeVisible();
		await page.locator("textarea").fill(text);
		await page.goto("/");

		await expect(page.getByText(text)).toBeVisible();
		await page.getByText(text).click();

		page.once("dialog", (d) => d.accept());
		await page.getByRole("button", { name: "delete" }).click();

		await expect(page.getByText(text)).not.toBeVisible();
	});

	test("unknown route shows 404", async ({ page }) => {
		await page.goto("/does-not-exist");
		await expect(page.getByText("404")).toBeVisible();
	});
});
