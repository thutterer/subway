import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	webServer: {
		command: "npm run dev",
		port: 5173,
		reuseExistingServer: true,
	},
	use: {
		baseURL: "http://localhost:5173",
		screenshot: "only-on-failure",
		trace: "on-first-retry",
	},
	reporter: [["html"], ["list"]],
});
