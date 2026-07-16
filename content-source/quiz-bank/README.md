# Quiz Bank — Manual Upload Folder

This is where you drop in ready-made quiz questions, one file per grade +
subject. Add files here whenever you have them — today Grade 9 Math,
tomorrow Grade 9 Physics, next week Grade 10 Math, whatever order you want.
No code changes needed — the app automatically picks up every file in this
folder the next time it's built.

## File naming

`g{grade}-{subject-slug}.json`

Examples:
- `g9-mathematics.json`
- `g9-physics.json`
- `g10-mathematics.json`
- `g11-biology.json`
- `g12-english.json`

The subject slug should be the subject name from the curriculum, lowercase,
spaces replaced with hyphens (e.g. "Information Technology" → `information-technology`,
"Health and Physical Education" → `health-and-physical-education`).

If a subject has separate Natural/Social stream content for Grade 11-12 and
the questions are stream-specific, add the stream to the filename:
`g11-mathematics-natural.json` / `g11-mathematics-social.json`. If the
subject is the same for both streams, just use the plain name.

## File format

Each file is a JSON array of questions, like this:

```json
[
  {
    "id": "g9_math_u1_q1",
    "question": "What is the question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 1,
    "explanation": "A short explanation of why this is the correct answer."
  }
]
```

- `id` — must be unique across the whole file (a simple naming pattern like
  `g{grade}_{subject}_q{number}` works fine).
- `options` — always an array of 4 strings.
- `answerIndex` — the position of the correct answer in `options`, counting
  from 0. So if "Option B" is correct, `answerIndex` is `1`, not `2`.
- `explanation` — shown to the student after they answer.

An empty template is at `_template.json` in this folder — copy it to start
a new file.

## What happens to these files

These are the **source** files — the actual app code (`src/curriculum-data/quizBank.ts`)
automatically loads every `.json` file in this folder, so a student can
practice with them **completely offline, without ever calling Gemini**.
This is the same "generate once, reuse forever" idea from the architecture
doc, just for content you're supplying directly instead of AI-generating.
