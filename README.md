<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Andrew's Church TNHB

A modern, responsive Angular web application for Andrew's Church TNHB. Built with Angular 20, TypeScript, Tailwind CSS, and Vite for fast development and production builds.

## 📋 Project Overview

This is a single-page application (SPA) that showcases church information, events, sermons, gallery, prayer requests, and more. The project uses modern Angular features including signals, standalone components, and component-based architecture.

### Key Features
- **Responsive Design** – Mobile-first UI with Tailwind CSS
- **Modern Angular** – Angular 20 with signals, standalone components, and route-based navigation
- **Fast Development** – Vite for ultra-fast HMR and builds
- **TypeScript** – Full type safety and better developer experience
- **Admin Dashboard** – Secure login with auth guard for admin features
- **Dynamic Gallery** – Image gallery with lazy loading and animations
- **Event Management** – Upcoming events and announcements
- **Prayer Requests** – User-submitted prayer requests
- **Missionary Spotlight** – Featured missionary stories
- **Contact & Messaging** – User message submissions

## 🛠️ System Requirements

### Required Versions
- **Node.js**: `v22.14.0` or `v22.12.0` (LTS recommended) or `>=24.0.0`
  - ⚠️ **NOT compatible with Node v23.x** – will cause EBADENGINE warnings
- **npm**: `^10.9.2` (comes bundled with Node.js)
- **Angular CLI**: `@angular/cli@20.3.9` (installed globally or locally)

### Recommended Setup
1. Use **nvm** (Node Version Manager) or **nvm-windows** to manage Node versions easily
2. Install **Node 22.14.0** (matches `@types/node` and is LTS stable)
3. Use **npm 10.x** (auto-installed with Node.js)

### Verify Installation
```bash
node --version    # Should output: v22.14.0 or v22.12.0 or >=v24.0.0
npm --version     # Should output: 10.x.x
```

## 🚀 Quick Start

### 1. Install Node.js & npm

#### Option A: Using nvm-windows (Recommended)
```bash
# Download and install nvm-windows from:
# https://github.com/coreybutler/nvm-windows/releases

# After installation, open a new terminal and:
nvm install 22.14.0
nvm use 22.14.0
```

#### Option B: Direct Installation
Download from [nodejs.org](https://nodejs.org/) – use the LTS version (v22.x or later).

### 2. Clone & Navigate to Project
```bash
cd c:\Users\danny\Repo\andrew's-church-tnhb
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
# or
ng serve
```
The app will be available at `http://localhost:4200`

### 5. Build for Production
```bash
npm run build
# or
ng build --configuration=production
```

## 📦 Project Dependencies

### Core Dependencies
- **@angular/core** `^20.3.0` – Angular core framework
- **@angular/common** `^20.3.0` – Common Angular utilities
- **@angular/router** `^20.3.10` – Routing and navigation
- **@angular/forms** `^20.3.10` – Reactive & template-driven forms
- **@angular/platform-browser** `^20.3.0` – Browser platform module
- **@angular/build** `^20.3.0` – Angular build system
- **rxjs** `^7.8.2` – Reactive programming library
- **tailwindcss** `latest` – Utility-first CSS framework

### Dev Dependencies
- **@angular/cli** `^20.3.0` – Angular command-line interface
- **@angular/compiler-cli** `^20.3.0` – Angular template compiler
- **typescript** `~5.8.2` – TypeScript compiler
- **vite** `^6.2.0` – Lightning-fast build tool
- **@types/node** `^22.14.0` – TypeScript definitions for Node.js

## 📂 Project Structure

```
src/
├── app.component.ts           # Root component
├── app.component.html         # Root template
├── app.routes.ts              # Route configuration
├── admin/                     # Admin dashboard module
│   ├── login/                 # Login page
│   ├── dashboard/             # Admin dashboard
│   ├── auth.service.ts        # Authentication logic
│   └── auth.guard.ts          # Route protection
├── header/                    # Navigation header
├── hero/                      # Hero banner section
├── main/                      # Main content area
├── events/                    # Events listing
├── gallery/                   # Photo gallery
├── prayer-request/            # Prayer request form
├── messages/                  # Message submissions
├── missionary-spotlight/      # Featured missionaries
├── sunday-service/            # Sunday service info
├── visit-us/                  # Location & visit info
├── milestones/                # Church milestones
├── footer/                    # Footer section
└── index.tsx                  # Application entry point

public/
└── assets/                    # Static assets (images, icons)
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `ng serve` | Alternative: run Angular dev server |
| `ng build` | Alternative: run Angular build |
| `npm install` | Install/update dependencies |

## 🔐 Admin Access

The admin dashboard is protected by an auth guard. To access:
1. Navigate to `/admin/login`
2. Enter credentials (as configured in your auth service)
3. Upon successful login, access `/admin/dashboard`

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Configuration**: `tailwind.config.js`
- **Approach**: Utility-first CSS for rapid UI development

## 🐛 Troubleshooting

### EBADENGINE warnings during npm install
- **Cause**: Node version mismatch (e.g., v23.x used with Angular CLI v20.3.9)
- **Solution**: Install Node v22.14.0 or v24+ using nvm-windows, then run `npm install` again

### "npm: command not found"
- **Cause**: Node.js not installed or not in PATH
- **Solution**: Download and install from [nodejs.org](https://nodejs.org/)

### esbuild binary errors (EFTYPE, EPERM)
- **Cause**: Corrupted node_modules or permission issues
- **Solution**: 
  ```bash
  rm -r node_modules
  rm package-lock.json
  npm cache clean --force
  npm install
  ```

### Port 4200 already in use
- **Solution**: Specify a different port:
  ```bash
  ng serve --port 4300
  ```

## 📝 Environment Variables

If using environment-specific configuration, create `.env.local`:
```
# Example
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

## 🚢 Deployment

To build and deploy to production:
```bash
npm run build
```
The optimized bundle will be in the `dist/` folder.

### Hosting Options
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your Git repo and auto-deploy
- **Traditional Server**: Copy `dist/` contents to your web server

## 📄 License

This project is created for Andrew's Church TNHB.

## 📧 Contact & Support

For issues, feature requests, or questions about the project, please reach out to the development team.
