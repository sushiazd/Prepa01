# Prepa01

**Free, open-source exam practice for first-year engineering students.**
Unlimited generated exercises, automatic grading of real math answers (formulas, complex numbers, sets, Python code), and a mastery score that tells you what to revise next.

🔗 **Live site:** https://sushiazd.github.io/Prepa01/

Built for students at ESIR (Université de Rennes), but the engine is subject-agnostic. The interface is in French.

---

## Why

Our courses come with few practice problems and even fewer worked solutions. Past exams run out after one pass. Prepa01 generates new variants of each exercise type, so you can keep practising until you have actually mastered the method, not just memorised the answer.

## Features

- **Generated exercises.** Parameterised templates produce new values and new questions on every attempt, with step-by-step corrections.
- **Real answer checking.** It doesn't just compare strings:
  - literal formulas are checked by evaluating them on random values;
  - antiderivatives are checked by differentiating them;
  - it understands complex numbers, intervals, sets, truth tables and Taylor expansions;
  - Python functions run in the browser against test cases (Pyodide in a Web Worker).
- **Mastery and Elo.** Each skill gets a mastery score (a Wilson interval on recent answers, weighted by coverage of the exercise types). An overall Elo from 0 to 2500 drives spaced review and the "what next" guidance.
- **Guided learning path.** A skill tree per subject, with "Understand" lessons and hints, plus an explanation of where a wrong answer came from.
- **Timed mock exams.** Built on the format of past exams. A mock exam in progress syncs across devices, so you can start it on a tablet and finish it on a PC.
- **Group mode.** Live group tests with a shared timer and a waiting room. For electronics, students photograph their paper copies and correct each other's.
- **Exam calendar.** Reads the university timetable (ADE export) and puts each subject's next test on the home page.
- **Works without an account.** Progress stays in the browser; signing in syncs it through Supabase.

### Subjects

| Page | Topic |
|---|---|
| `maths/` | math MCQ (calculus, algebra), Hardcore mode, problem of the day |
| `maths-s1/`, `maths-s1-analyse/` | logic, sets, relations; complex numbers, limits, Taylor expansions, integrals |
| `elec/`, `elec2/` | DC circuits, Thévenin/Norton, Millman, first-order RC/RL circuits |
| `phys/` | point mechanics: Newton's laws, energy, oscillators, angular momentum |
| `meca/` | statics: moments, wrenches, joints, equilibrium |
| `ato/` | atomistics: the atom |
| `algo/` | Python: functions, complexity, lists, dictionaries |

## Tech

Plain HTML, CSS and JavaScript with **no build step**. Every page is a static file served by GitHub Pages.

- `core.js` / `core.css`: the shared engine (learning path, mastery, mock exams, sync) used by every subject page.
- `account.js`: single sign-on and progress sync ([Supabase](https://supabase.com), with row-level security in `supabase.sql`).
- `supabase/functions/planning/`: an edge function that relays the university timetable.
- [Pyodide](https://pyodide.org) for running Python in the browser.

## Running it locally

```bash
git clone https://github.com/sushiazd/Prepa01.git
cd Prepa01
python -m http.server 8000
```

Then open http://localhost:8000. Without changes to `config.js`, the site uses the project's public Supabase instance (the key in it is the public *anon* key; access is restricted by the database rules).

To deploy your own copy with your own database, follow [DEPLOIEMENT.md](DEPLOIEMENT.md) (in French).

## Adding a subject

Each subject page loads the shared engine and declares its own skills, exercise generators and lessons (`learn.js`). The easiest starting point is to copy an existing page such as `ato/` and replace its content. Exam dates go in `subjects.js`.

## Contributing

Issues and pull requests are welcome, whether they add exercises, fix a wrong correction or improve accessibility. If you spot a mistake in an exercise, please open an issue with the subject, the question and the expected answer.

## License

The code is under the [MIT License](LICENSE). Exercises adapted from past ESIR / Université de Rennes exams and course material remain the property of their authors.
