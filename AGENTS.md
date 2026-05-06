# DragonBudget.com Codex Workflow

- For DragonBudget.com implementation tasks, update `docs/DragonBudget.com LLM Prompt Source.txt` in the same pass unless the user explicitly says to skip the ledger update.
- Use the next prompt number, mark the task status, add generated prompt details, and add any relevant validation or workflow notes.
- Keep the site static and no-build: plain HTML, CSS, JavaScript, and repository-root GitHub Pages files.
- After changes, run `python3 tools/check_site.py` when the task touches public pages, links, metadata, schema, navigation, scripts, or assets.
