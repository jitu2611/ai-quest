# AI Quest

An interactive AI curriculum for developers who are new to AI.

**Learn AI by making it click:** concise explanations, experiments you can manipulate, and mastery-based challenges that unlock the next mission.

## Included in this first build

- Polished landing page and Chapter 01 learning map
- A complete five-mission Chapter 01: AI vocabulary, examples, data splits, overfitting, and evaluation metrics
- An interactive overfitting simulator with live training/validation error feedback
- Three checkpoint questions per mission with hints, retries, immediate feedback, and mastery gating
- Browser-local progress persistence plus a confirmed **Start over** action—no account required
- Responsive layout for desktop and mobile

## Stack

- Next.js App Router + TypeScript
- React 19
- Tailwind CSS 4 (global design system styles)
- LocalStorage for early progress persistence
- Ready to deploy on Vercel

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npm run build
```

## Next steps

1. Turn the learning content into schema-validated MDX/JSON files.
2. Add the remaining Chapter 01 missions and prerequisite rules.
3. Add unit and end-to-end tests for grading and progress recovery.
4. Add optional GitHub authentication and cloud progress sync.
5. Publish the repository and import it into Vercel.
