export function highlightMarkdown(text: string): string {
	const escaped = text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	const lines = escaped.split("\n");
	const result: string[] = [];
	let inCodeBlock = false;

	for (const line of lines) {
		if (/^```/.test(line)) {
			inCodeBlock = !inCodeBlock;
			result.push(`<span class="md-fence">${line}</span>`);
			continue;
		}

		if (inCodeBlock) {
			result.push(`<span class="md-fence">${line}</span>`);
			continue;
		}

		if (/^#{1,6}\s/.test(line)) {
			const level = line.match(/^(#+)/)![1].length;
			result.push(`<span class="md-h${level}">${line}</span>`);
			continue;
		}

		if (/^\s*>/.test(line)) {
			result.push(`<span class="md-blockquote">${line}</span>`);
			continue;
		}

		if (/^(?:---|\*\*\*|___)\s*$/.test(line)) {
			result.push(`<span class="md-hr">${line}</span>`);
			continue;
		}

		if (/^\s*[-*+]\s/.test(line)) {
			result.push(`<span class="md-list">${line}</span>`);
			continue;
		}

		if (/^\s*\d+\.\s/.test(line)) {
			result.push(`<span class="md-list">${line}</span>`);
			continue;
		}

		result.push(processInline(line));
	}

	return result.join("\n");
}

function processInline(text: string): string {
	return text
		.replace(/`([^`\n]+)`/g, '<span class="md-code">`$1`</span>')
		.replace(/\*\*(.*?)\*\*/g, '<span class="md-bold">**$1**</span>')
		.replace(/__(.*?)__/g, '<span class="md-bold">__$1__</span>')
		.replace(
			/(?<!\*)\*([^*\n]+)\*(?!\*)/g,
			'<span class="md-italic">*$1*</span>',
		)
		.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<span class="md-italic">_$1_</span>')
		.replace(/~~(.*?)~~/g, '<span class="md-strike">~~$1~~</span>')
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<span class="md-link">[$1]($2)</span>',
		)
		.replace(
			/!\[([^\]]*)\]\(([^)]+)\)/g,
			'<span class="md-image">![$1]($2)</span>',
		);
}
