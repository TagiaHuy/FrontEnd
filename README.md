# PlantCraft Frontend

PlantCraft is a cross-platform productivity and goal management app built with React Native and Expo. It helps users set, track, and achieve their goals through structured phases, tasks, analytics, and progress tracking. The app features authentication, user profiles, dashboards, notifications, and more, with a focus on usability and real-time updates.

## Features
- User authentication (register, login, password reset, email verification)
- Profile management and settings
- Dashboard with progress overview and analytics
- Goal and phase management (CRUD, roadmap, statistics)
- Task management (by goal, phase, or independent)
- Progress and performance tracking
- Notifications and help center
- Mobile-first, responsive design
- Accessibility and security best practices

## Screens Overview
- **Authentication:** Login, Register, Forgot/Reset Password, Email Verification
- **Profile & Settings:** Profile, Account Settings, Theme, Language
- **Dashboard:** Main dashboard, Analytics, Statistics
- **Goals:** List, Create, Edit, Detail, Roadmap, Phases
- **Tasks:** List, Create, Detail, Today’s Tasks, Phase Tasks
- **Progress:** Overview, Goal/Phase Progress, Comparisons
- **Notifications & Help:** Notifications, Help Center

## Tech Stack
- **Framework:** React Native (Expo)
- **Language:** TypeScript, JavaScript
- **Navigation:** React Navigation
- **State/Storage:** AsyncStorage
- **APIs:** Custom backend (see `API.md`)
- **Other:** Expo, Babel, dotenv, image picker, date picker

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli
  ```

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd FE
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with the following:
     ```env
     API_BASE_URL=<your_api_base_url>
     API_TIMEOUT=10000
     ```

### Running the App
- Start the Expo development server:
  ```bash
  npm start
  # or
  yarn start
  ```
- To run on Android:
  ```bash
  npm run android
  ```
- To run on iOS:
  ```bash
  npm run ios
  ```
- To run in the browser:
  ```bash
  npm run web
  ```

## Scripts
- `start` – Start Expo dev server
- `android` – Run app on Android device/emulator
- `ios` – Run app on iOS simulator
- `web` – Run app in web browser

## Project Structure
```
FE/
  ├── App.js                # App entry point
  ├── app.json              # Expo config
  ├── package.json          # Dependencies and scripts
  ├── src/
  │   ├── assets/           # Images and icons
  │   ├── components/       # Reusable UI components
  │   ├── context/          # React context (e.g., Auth)
  │   ├── navigation/       # Navigation setup
  │   ├── screens/          # App screens (by feature)
  │   ├── services/         # API and service logic
  │   ├── styles/           # Style definitions
  │   └── types/            # TypeScript types and env
  ├── API.md                # Backend API documentation
  └── FrontEnd.md           # Screen and feature documentation
```

## Environment Variables
- `API_BASE_URL` – Base URL for backend API
- `API_TIMEOUT` – API request timeout (ms)

## Documentation
- **API:** See [`API.md`](./API.md)
- **Screens & Features:** See [`FrontEnd.md`](./FrontEnd.md)

## License
MIT (or specify your license) 