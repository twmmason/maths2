# Maths Pathway — Interactive Learning App

## Overview
An interactive web app teaching the UK national curriculum maths from **Year 6** through **Key Stage 3** (secondary). Content is extracted from the two curriculum PDFs in `/docs/`.

## Source Documents
- `Maths_guidance_year_6.pdf` — Year 6 non-statutory guidance (DfE, June 2020)
- `SECONDARY_national_curriculum_-_Mathematics.pdf` — KS3 programme of study (DfE, Sept 2013)

## Architecture

```
maths2/
├── docs/
│   ├── PLAN.md                          ← this file
│   ├── Maths_guidance_year_6.pdf
│   └── SECONDARY_national_curriculum_-_Mathematics.pdf
└── app/
    ├── server.js        ← Node.js server (serves static files + progress API)
    ├── progress.json    ← file-based progress storage
    ├── index.html       ← single-page app shell
    ├── style.css        ← minimal/sleek dark theme
    ├── data.js          ← curriculum content, examples & quizzes
    └── app.js           ← app logic, routing, quiz engine
```

### Tech Stack
- **Server**: Node.js (no dependencies — bare `http` + `fs`)
- **Frontend**: Vanilla HTML/CSS/JS — zero dependencies
- **Progress**: JSON file (`progress.json`) read/written via REST API
- **Design**: Minimal, sleek dark theme

### Progress API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/progress` | Read full progress object |
| POST   | `/api/progress` | Write full progress object |

### Progress File Schema (`progress.json`)
```json
{
  "xp": 0,
  "streak": 0,
  "lastDate": null,
  "completed": {},
  "scores": {}
}
```
- `xp` — total experience points earned
- `streak` — consecutive days practiced
- `lastDate` — ISO date string of last practice
- `completed` — map of `topicId → true` for completed topics
- `scores` — map of `topicId → { score, total, date }` for best quiz scores

## Curriculum Topics (extracted from PDFs)

### Year 6 Strands
| Code | Topic | Strand |
|------|-------|--------|
| 6NPV-1 | Powers of 10 | Number & Place Value |
| 6NPV-2 | Compose & decompose numbers to 10 million | Number & Place Value |
| 6NPV-3 | Numbers up to 10 million in the linear number system | Number & Place Value |
| 6NPV-4 | Divide powers of 10 into equal parts / read scales | Number & Place Value |
| 6AS/MD-1 | Additive vs multiplicative relationships | Arithmetic & Structure |
| 6AS/MD-2 | Derive related calculations | Arithmetic & Structure |
| 6AS/MD-3 | Ratio relationships | Arithmetic & Structure |
| 6AS/MD-4 | Problems with 2 unknowns | Arithmetic & Structure |
| 6F-1 | Simplify fractions | Fractions |
| 6F-2 | Common denomination & compare | Fractions |
| 6F-3 | Compare fractions (reasoning) | Fractions |
| 6G-1 | Draw, compose & decompose shapes | Geometry |

### Key Stage 3 Strands (Secondary)
| Strand | Topics |
|--------|--------|
| Number | Place value, ordering, four operations, factors/primes, standard form |
| Algebra | Expressions, equations, sequences, linear/quadratic graphs |
| Ratio & Proportion | Unit conversions, scale factors, percentages, direct/inverse proportion |
| Geometry & Measures | Area, perimeter, volume, angles, Pythagoras, trigonometry, transformations |
| Probability | Outcomes, probability scale, Venn diagrams, sample spaces |
| Statistics | Mean/median/mode, charts, scatter graphs |

## UI/UX
- **Home**: hero with global progress bar → list of strands (cards with ring progress)
- **Strand view**: list of topics with completion status (checkmark or empty circle)
- **Lesson view**: 3 tabs — Learn | Examples | Practice
  - **Learn**: explanatory text with key-point callouts
  - **Examples**: worked problems with step-by-step solutions
  - **Practice**: interactive quiz (multiple choice + type-in answers), instant feedback
- **Header**: sticky, shows XP and streak, back button when navigated in

## Design Principles
- Minimal and sleek — dark background, subtle borders, no clutter
- Indigo accent (#6366f1), green for correct, red for incorrect
- Smooth transitions, no heavy animations
- Mobile-responsive

---

## Build Progress

- [x] Project structure created
- [x] `index.html` — app shell with all views
- [x] `style.css` — full dark theme styles
- [x] `PLAN.md` — this document
- [x] `progress.json` — initial empty progress file
- [x] `server.js` — Node.js static + API server (zero dependencies)
- [x] `data.js` — 20 topics across 8 strands, each with lessons, worked examples, and quizzes
- [x] `app.js` — app logic, navigation, quiz engine, file-based progress sync
- [x] Test & verify end-to-end (server starts, API reads/writes progress.json, static files served)

## How to Run

```bash
cd app
node server.js
# Open http://localhost:3000
```

## Content Coverage

| # | Strand | Topics | Source |
|---|--------|--------|--------|
| 1 | Number & Place Value | 4 topics (6NPV-1 to 6NPV-4) | Year 6 PDF |
| 2 | Arithmetic & Structure | 4 topics (6AS/MD-1 to 6AS/MD-4) | Year 6 PDF |
| 3 | Fractions | 3 topics (6F-1 to 6F-3) | Year 6 PDF |
| 4 | Geometry | 1 topic (6G-1) | Year 6 PDF |
| 5 | KS3: Number | 2 topics (primes, negatives/BIDMAS) | Secondary PDF |
| 6 | KS3: Algebra | 2 topics (expressions, sequences) | Secondary PDF |
| 7 | KS3: Ratio & Proportion | 1 topic (percentages) | Secondary PDF |
| 8 | KS3: Geometry & Measures | 2 topics (area/perimeter, angles) | Secondary PDF |
| 9 | KS3: Probability & Statistics | 2 topics (probability, averages) | Secondary PDF |
| **Total** | **9 strands** | **21 topics, 84 quiz questions** | |
