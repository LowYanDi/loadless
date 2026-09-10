# Easey

Easey is a mobile-first student capacity and commitment decision assistant. It helps a student see their combined weekly load, test the impact of a new request, coordinate assignment work, and choose a realistic action before overload happens.

**Tagline:** Know your capacity before you say yes.

## Prototype flow

1. Dashboard shows Aina's current weekly capacity at 82%.
2. Hidden Load Inbox turns a message into a confirmed commitment and exposes an evidence map for every extracted field.
3. Scenario Lab lets the user change duration, mental effort and deadline pressure, then recalculates the forecast live.
4. Action Engine explains three possible trade-offs and traces their effect through a decision impact ladder.
5. Boundary Assistant creates an editable message to rescope the request.
6. After State shows the confirmed plan reducing capacity to 84% and produces a copyable decision receipt.
7. Capacity Circle connects workload visibility with assignment ownership, submission review, leader comments and consent-based help matching.
8. Reset Mode offers Tic-Tac-Toe, unlimited personalised music and a capacity-adaptive Focus Cycle.

The demo uses realistic local data. It does not access WhatsApp, diagnose mental health conditions, or send information to a backend.

## Technology

- React 19 and TypeScript
- Vite
- TanStack Start and TanStack Router
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Recharts
- Lucide icons
- Browser localStorage for demo progress

## Run in Visual Studio Code

Install Node.js 20 or later and Git, then open this folder in Visual Studio Code.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. The development server updates automatically when source files change.

Useful commands:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Core capacity model

The interactive prototype uses an explainable point model. For the default judge scenario:

```text
time cost       = 3 hours x 4 points = 12
focus cost      = High effort        = 8
urgency cost    = Wednesday deadline = 7
context switch  = Society task       = 4
incoming load   = 12 + 8 + 7 + 4     = 31
forecast        = 82 + 31             = 113%
```

Changing any Scenario Lab control updates the calculation and charts immediately. The interface exposes the inputs and contribution of every factor rather than presenting the score as a black box. The score represents workload capacity, not a medical diagnosis.

## Distinctive prototype moments

- **Evidence Map:** links phrases in an incoming message to the extracted task, deadline and duration.
- **Scenario Lab:** gives judges a hands-on “what if” simulation instead of a static forecast.
- **Decision Impact Ladder:** shows how each recommendation creates room from 113% to 84%.
- **Decision Receipt:** turns the final plan into a useful copyable/downloadable record.
- **Decision Journey:** keeps the five-step intervention visible from capture through recovery.
- **Assignment Workboard:** shows who owns each assignment part, its progress, submission and leader review without ranking people.
- **Contribution Record:** creates a copyable factual summary for group check-ins and the assignment report.
- **Capacity-adaptive Focus Cycle:** recommends 15/5, 25/5 or 45/10 focus rhythms based on current capacity while allowing user override.
- **Personalised Music:** demonstrates interest-based recommendations, a user-controlled player and an optional reminder with no forced limit.

## Project structure

```text
src/
|-- components/loadless/   Reusable product components and navigation
|-- components/ui/         Accessible interface primitives
|-- data/loadless.ts       Demo user, workload and recommendation data
|-- hooks/                 Shared demo state and local persistence
|-- routes/                File-based application pages
|-- router.tsx             Router configuration
`-- styles.css             Theme and Tailwind design tokens
```

`src/routeTree.gen.ts` is generated from the route files. Do not edit it manually.

## Create a new GitHub repository

Create an empty repository on GitHub without adding a README, `.gitignore`, or licence. Then run these commands inside the project folder, replacing the example URL with your repository URL:

```bash
git init
git add .
git commit -m "Initial Easey prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/easey.git
git push -u origin main
```

Invite teammates from the repository's **Settings -> Collaborators** page.

## Deploy to Vercel

1. Sign in to Vercel with GitHub.
2. Choose **Add New -> Project**.
3. Import the new Easey repository.
4. Keep the detected framework and build settings.
5. Select **Deploy**.

No environment variables are required for this prototype.
