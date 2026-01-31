# 💸 Buckify - Smart Financial Control

> **Note:** This project serves as a **QA & Automation Laboratory**, demonstrating my transition from Senior Frontend Developer to **QA Automation Engineer**.


## 🎯 The Goal (The Pivot)
I built this application to solve a personal need (budget buckets management) while simultaneously creating a complex environment to practice and demonstrate **Modern Testing Architectures**.

It is built with **Next.js 14**, **Firebase**, and **GraphQL**, but the highlight is the **Quality Engineering ecosystem** surrounding it.

## 🧪 Quality Assurance & Automation Stack

This is where my focus lies. The project implements a robust testing strategy:

### 🎭 End-to-End Testing (Playwright)
Located in `/e2e`, I use **Playwright** to test critical user flows.
- **Page Object Model (POM):** To ensure test maintainability.
- **Authentication Flows:** Handling Google OAuth in testing environments.
- **Visual Regression:** Ensuring UI consistency.

### ⚡ Unit Testing (Vitest)
Used for testing business logic, reducers, and utility functions independent of the UI.

### 🤖 AI-Powered Developer Experience (DX)
Leveraging my background in development, I created custom scripts (located in `src/scripts`) powered by **Google GenAI** to automate tedious tasks:
- **`fix-comments-ai.ts`**: Automatically cleans up code during pre-commit.
- **`sync-translations.ts`**: Uses AI to detect missing i18n keys and auto-translate them to all supported languages, keeping `en.json` and others perfectly aligned.
- **`scan-statement.ts`**: The app itself uses AI to parse bank statements from images/PDFs.

### 🔄 CI/CD (GitHub Actions)
Fully automated pipeline defined in `.github/workflows/playwright.yml`:
1.  Linting (Biome)
2.  Type Checking
3.  Unit Tests
4.  E2E Tests (Headless)

## 🛠️ Tech Stack (The Product)
- **Core:** Next.js 14, React 18, TypeScript
- **State:** Redux Toolkit
- **Data:** GraphQL (Apollo Client), Firebase
- **UI:** Shadcn/UI, TailwindCSS (Spotify/Hades II inspired theme)
- **AI Integration:** Google Generative AI SDK

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   pnpm install
    ```
2. **Set up environment variables:** Create a `.env.local` file based on `.env.example` and fill in the required values.
3. **Run the development server:**
    ```bash
    pnpm dev
      ```
4. **Run tests:**
    - **Unit Tests:**
      ```bash
      pnpm test:unit
      ```
    - **E2E Tests:**
      ```bash
      pnpm test:e2e
      ```  
      
