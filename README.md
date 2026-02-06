# BMI Go

BMI Go is a modern, user-friendly mobile application built with React Native and Expo designed to help users calculate their Body Mass Index (BMI) and explore health-related content.

## 📱 Features

- **BMI Calculator**: Easily calculate your Body Mass Index by entering your height, weight, and age.
- **Modern UI**: Sleek, dark-themed interface with gold accents and glassmorphism effects.
- **Explore Page**: Discover health categories and related content in a masonry grid layout.
- **Responsive Design**: optimized for both Android and iOS devices.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Platform**: [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: React Native StyleSheet with custom design tokens.

## 🚀 Get Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/bmigo.git
    cd bmigo
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the app:

    ```bash
    npx expo start
    ```

4.  Use the Expo Go app on your phone to scan the QR code, or run on an emulator:
    - Press `a` for Android Emulator.
    - Press `i` for iOS Simulator.

## 📂 Project Structure

```
bmigo/
├── app/                 # Expo Router application code
│   ├── (tabs)/          # Tab-based navigation roots
│   │   ├── index.tsx    # Home/Calculator screen
│   │   └── explore.tsx  # Explore/Discover screen
│   ├── _layout.tsx      # Root layout configuration
│   └── modal.tsx        # Modal screen
├── components/          # Reusable UI components
├── assets/              # Images, fonts, and icons
└── constants/           # App constants and theme colors
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
