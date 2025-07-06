# worldle

## Overview

This is a Wordle clone built with React and Vite. The game allows users to guess a five-letter word within six attempts. The app is styled using Tailwind CSS and includes comprehensive security measures for safe data handling.

## Project Structure

```
worldle/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Board.jsx
│   │   ├── Keyboard.jsx
│   │   ├── Tile.jsx
│   │   ├── GameOver.jsx
│   │   ├── Stats.jsx
│   │   └── FormSettings.jsx
│   ├── hooks/
│   │   ├── useGameState.js
│   │   └── useStats.js
│   ├── constants/
│   │   ├── words.js
│   │   └── keyboardLayout.js
│   ├── utils/
│   │   ├── gameLogic.js
│   │   ├── formSubmission.js
│   │   └── security.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── fix-esbuild-vulnerability.sh
├── package.json
├── vite.config.js
├── tailwind.config.js
├── SECURITY.md
└── README.md
```

## Security Features

This application implements comprehensive security measures:

- **Input Validation**: All user inputs are validated and sanitized
- **XSS Protection**: HTML escaping prevents script injection attacks
- **URL Validation**: Only legitimate Google Forms URLs are accepted
- **Data Privacy**: Sensitive information is masked in logs
- **Dependency Security**: Regular security audits and updates

For detailed security information, see [SECURITY.md](SECURITY.md).

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/jc9677/worldle.git
cd worldle
```

2. Install dependencies:

```sh
npm install
```

### Running the App

To start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:5173/worldle/`.

### Building the App

To build the app for production:

```sh
npm run build
```

The built files will be in the `dist` directory.

### Previewing the Build

To preview the built app:

```sh
npm run serve
```

The app will be available at `http://localhost:4173/worldle/`.

## Security

### NPM Security Audit

To check for security vulnerabilities:

```sh
npm audit
```

To fix most vulnerabilities automatically:

```sh
npm audit fix
```

For the remaining esbuild vulnerability (development only), you can optionally run:

```sh
./scripts/fix-esbuild-vulnerability.sh
```

### Development Security

- Only run the development server on trusted networks
- Use the production build for deployment
- Regularly update dependencies

## GitHub Actions

This project includes a GitHub Actions workflow for automatic deployment. The workflow is defined in the `.github/workflows/deploy.yml` file. It will automatically build and deploy the app to GitHub Pages whenever changes are pushed to the `main` branch.

## License

This project is licensed under the MIT License.
