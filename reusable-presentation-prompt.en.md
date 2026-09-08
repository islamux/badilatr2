# Reusable Prompt for Preparing a Professional Technical Project Presentation

A general-purpose prompt you can use with any project you need to present to a technical team that wants to verify you understand the code and the engineering decisions — not just the polished final UI.

## How to Use

Replace the values between brackets before sending the prompt:

- `[Project Name]`
- `[Project Path]`
- `[Presentation Language]`
- `[Duration, default 60 minutes]`
- `[Audience Type]`
- `[Output Folder, default presentation/]`

## The Prompt

````text
You are a Senior Software Engineer, a technical presentation designer, and a meticulous documentation reviewer.

I want you to put together a professional and creative presentation package for the following project:

- Project Name: [Project Name]
- Project Path: [Project Path]
- Presentation Language: [Presentation Language]
- Duration: [Duration, default 60 minutes]
- Audience: [Audience Type]
- Output Folder: [Output Folder, default presentation/]

The goal is not just to market the project, but to prove that the project owner genuinely understands what was written: how data moves, why each technology was chosen, what the limits of each decision are, and how the system can be tested and improved.

## Mandatory Working Rules

1. First read the project's instruction files such as AGENTS.md, CLAUDE.md, and README.md, plus any existing style guide.
2. Check the current Git state before modifying anything. Create a separate branch with a descriptive name starting with docs/ or presentation/, and do not delete or revert changes you did not make.
3. Explore the project from the actual source; do not rely on guesses based on the framework name or a common structure.
4. Before writing, identify the task type: is it a limited presentation package or does it need a larger architectural design? If the requirements are vague, ask one question at a time about format, duration, language, and audience.
5. If there are several valid approaches, present two or three with trade-offs and a recommendation, and wait for the user's approval before executing.
6. Do not claim a function, endpoint, config key, test, or feature you cannot find in the source. Verify every name, path, number, and line before documenting it.
7. Do not modify application code or add dependencies unless the user explicitly asks. The required package is documentation and presentation oriented and should be as self-contained as possible.
8. Do not use generic marketing language such as "extremely fast" or "fully secure" without a benchmark or evidence from the project. State limitations and trade-offs clearly; knowing what is not solved is strong evidence of understanding.
9. Make the text targeted at the specified audience, and use [Presentation Language] for the prose. Keep tool names and programming concepts in English where that increases precision, such as SSG, PWA, Hydration, and Route Handler.

## Project Understanding Phase

Build an organized internal summary before creating the files, including:

- The product type and the problem it solves.
- The stack and its versions from package.json or project files.
- A folder map and the application entry points.
- The routing, public pages, and dynamic pages.
- Server/Client boundaries if the project uses SSR, SSG, or RSC.
- State management and the sources of local and cloud state.
- The data model and the data flow from source to UI.
- API endpoints, the authentication or identity model, and the database.
- The build pipeline, scripts, and PWA or caching if present.
- The testing strategy and the actual test count from the test runner output.
- The biggest performance, security, and scalability decisions.
- Known limitations, risks, and missing features.

Use precise references in the form `path/to/file.ts:line-range` in the materials, and open the source to verify the numbers before adopting them.

## The Package to Create

Create the following files inside `[Output Folder]`, unless the user asks otherwise:

### 1. `slides.html`

Create a self-contained HTML deck that runs directly in the browser with no extra build or new dependency.

Requirements:

- RTL if the presentation language is Arabic, with correct `lang` and `dir`.
- A distinctive visual identity rooted in the project's domain, not a generic card template or random colors.
- Use a small color system, a clear display font, a readable body font, and a technical font for code where needed.
- Pick one signature visual element that repeats in moderation, such as a data path, an editorial margin, or a time grid.
- Do not pack dense text without hierarchy. Make every slide answer a single question.
- Add keyboard navigation, buttons with `aria-label`, a slide index, speaker notes, fullscreen, and touch support when appropriate.
- Honor `prefers-reduced-motion`, add responsive styles for mobile, and print styles if useful.
- Make slide numbering dynamic or automatically verify it matches the real count.
- Use code snippets that match the project. If a snippet is incomplete, label it explicitly as a "snippet" and do not present fake code as if it were runnable.

Split the deck into a clear story that fits `[Duration, default 60 minutes]`:

- Opening: what is the product, and what is the problem?
- Thesis: what is the governing engineering idea?
- Decisions journey: why did the architecture change or the technologies get chosen?
- Mental model: one diagram showing the data flow.
- Product experience: what does the user see?
- Technical deep dive: routing, rendering, state, data, performance, security, testing.
- Live demo: a divider slide pointing to the script file.
- Trade-offs: what did we gain and what did we pay for it?
- Roadmap: priorities based on risk, not a wish list.
- Closing: one sentence, then open questions.

### Time Budget for a 60-Minute Presentation

Pace delivery at about **1.5–2 minutes per slide**, i.e. roughly **30–40 content slides** plus the demo divider. Allocate the duration according to the table below, and treat any slide that overruns its allotted time as a signal to cut content rather than to rush your speech:

| Section | Minutes |
|---|---|
| Opening (product + problem) | 5 |
| Thesis (the governing engineering idea) | 4 |
| Decisions journey (why the architecture changed) | 6 |
| Mental model (data flow diagram) | 4 |
| Product experience (what the user sees) | 5 |
| Technical deep dive (routing/rendering/state/data/perf/security/testing + Hydration) | 14 |
| Live demo | 11 |
| Trade-offs (what we gained and what we paid) | 4 |
| Roadmap (risk-based priorities) | 3 |
| Closing + open questions | 4 |
| **Total** | **60** |

If the demo eats into the time, compress it to 5 minutes by running only the critical path, and point to the remaining steps in the demo script instead of skipping the following explanation.

### Hydration Explanation Is Mandatory When SSR, SSG, or Client Components Are Present

Add a clear slide, or a clear section within a slide, that explains the process in detail rather than with a shallow definition:

1. **Server render:** what does the server compute, and what can it not access, such as `window` and `localStorage`?
2. **HTML response:** how does the HTML reach the browser and render before the JavaScript completes?
3. **First Client Render:** why must the client produce the same initial tree that the server produced?
4. **Hydration:** clarify that it is the process of attaching React to the existing tree and adding event handlers, not a CSR that starts from an empty DOM.
5. **Effects after commit:** explain that `useEffect` runs after the tree is committed and can read browser-only APIs and update state in a later valid render.
6. **Mismatch:** show a wrong example that reads a preference from `localStorage` during the initial render, and show how the server can produce `dark` while the first client render produces `light`.
7. **The result:** explain that differing markup before hydration completes can lead to a warning, an error, tree reprocessing, or unexpected DOM, depending on the framework and the case.
8. **The correct pattern:** show the actual pattern in the project: a fixed default, a read after mount, and a `hydrated` save-guard that prevents overwriting the saved value.
9. **An important distinction:** separate a mismatch during the first render from a state update after `useEffect`; the latter is expected if the former matches.
10. **Practical application:** tie the explanation to an existing ThemeContext or storage hook, and point to a test proving the default before mount, restoration after mount, and no data clobbering.

### 2. `demo-script.md`

Write a numbered live demo script suited to `[Duration, default 60 minutes]`, including:

- A time allocation for each segment, with roughly **11 minutes for the demo** out of the 60-minute budget and a plan to compress it to 5.
- Correct preflight commands from package.json.
- What the speaker opens in the browser and what they say at each step.
- Evidence of behavior from the outside, then a link to a file and line from the inside.
- A routing or URL state exercise if present.
- A local state and reload exercise.
- A search or core processing exercise.
- An API or sync exercise, noting the environment conditions required.
- A PWA or offline exercise from a production build if the service worker is disabled in dev.
- The detailed Hydration explanation above, with a mismatch example and a safe-pattern example.
- A fallback plan if the database, environment variables, or a request fails.
- Statements to say and statements to avoid so the presentation does not overclaim.

Do not write commands that do not exist in the project's scripts. If a command depends on Linux or an external tool, state it clearly and provide an alternative path.

### 3. `qa-guide.md`

Create a team Q&A guide in `[Presentation Language]`, with between 25 and 35 questions depending on project size. Group the questions into categories such as:

- Architecture and system design.
- Rendering and SSR/SSG/CSR and Hydration.
- Routing and state management.
- Data pipeline and text processing.
- API, database, and identity.
- Performance, caching, and PWA.
- Security and threat model.
- Testing and observability.
- Trade-offs and roadmap.

For every question write:

- A short answer speakable within 30–60 seconds.
- A precise file and line reference.
- The trade-off or the known limit.
- A follow-up improvement when appropriate.

Add explicit questions about:

- The difference between SSR, CSR, and Hydration.
- Why mismatches happen and how to prevent them.
- What happens before and after `useEffect`.
- Why you cannot read browser APIs during render in an SSR app.
- What was actually tested and what was not.
- Which claims the presenter should not make.

### 4. `README.md`

Document how to run the package, the slide shortcuts, the order of use, and the pre-presentation checks. Mention any real environmental requirement or build warning, and do not add unverifiable claims.

Add a **pre-presentation rehearsal checklist** tailored to `[Duration, default 60 minutes]`, including:

- Run the full deck against a timer at least once, and match the timings against the minute-allocation table.
- Verify that the slide count matches the index and numbering.
- Run the preflight commands from package.json and confirm they all pass before going on stage.
- Test the fallback demo plan (a shortened script or static screenshots) if the database or environment variables are missing.
- Open `slides.html` in the browser and test: keyboard navigation, fullscreen, notes, index, and touch support.
- Check PDF/print export if useful, and that slides render correctly on the projector (aspect ratio and no clipped text).
- Prepare a demo backup (screenshots or a static build) if the live demo is fragile.

## Quality Review and Verification

After creating the files:

1. Review every claim, path, and number against the actual source.
2. Verify that every Markdown code block is balanced and that all links and paths exist.
3. Check the embedded HTML and JavaScript, the slide count, the numbering, the index, and the keyboard shortcuts.
4. Run a smoke test of the deck when possible: parse it via JSDOM or an HTML parser, then test next/previous, overview, and notes.
5. Run the project's available commands, such as:

   ```bash
   pnpm test
   pnpm run lint
   pnpm run build
   ```

6. Do not run build and typecheck in parallel if typecheck reads generated `.next` files; run them sequentially.
7. Run `git diff --check`, and review newly added files and any changes unrelated to the task.
8. Do not claim test, lint, or build success without showing a fresh result with numbers and status.
9. Do not create a commit or PR unless the user explicitly asks.

## Final Report Format

Return a concise report including:

- The files created and the responsibility of each.
- The key visual and organizational decisions.
- How Hydration and SSR/CSR mismatch were explained.
- The verification commands and their actual results.
- Any warning or limitation that remains.
- The current branch name.
- A clear confirmation if no commit or PR was created.
````

## Practical Note

If the team is going to test your understanding of the code, do not memorize the slides verbatim. Use them as a map, open the source when asked, then answer in this order: **entry point → data flow → reason for the decision → trade-off → test**.
