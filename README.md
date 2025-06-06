# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

```
FrontEnd/
├── app/                  # Main application directory containing all screens and routes
├── assets/              # Static assets like images, fonts, etc.
├── components/          # Reusable React components
├── constants/           # Application constants and configuration
├── hooks/               # Custom React hooks
├── .expo/               # Expo configuration and cache
├── node_modules/        # Project dependencies
├── .vscode/            # VS Code specific settings
├── scripts/            # Build and utility scripts
├── app.json            # Expo configuration file
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── eslint.config.js    # ESLint configuration
```

### Key Directories Explained

- **app/**: Contains all the screens and routes of your application using Expo Router's file-based routing system
- **components/**: Houses reusable UI components that can be shared across different screens
- **constants/**: Stores application-wide constants, theme configurations, and other static data
- **hooks/**: Contains custom React hooks for shared logic and state management
- **assets/**: Stores all static files like images, fonts, and other media files

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
