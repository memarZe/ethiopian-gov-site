# Ethiopian Government Website

A modern, responsive website for the Federal Government of Ethiopia built with React and Tailwind CSS.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.js        # Site header with language selector
│   ├── Navigation.js    # Main navigation menu
│   ├── Hero.js          # Homepage hero section with search
│   ├── AlertBanner.js   # Emergency alerts and notices
│   ├── PopularServices.js # Most used government services
│   ├── GovernmentServices.js # All service categories
│   ├── RegionalServices.js # Regional state services
│   ├── NewsSection.js   # Latest news and updates
│   ├── Sidebar.js       # Ministries and help section
│   ├── Footer.js        # Site footer with links
│   ├── Layout.js        # Main layout wrapper
│   └── index.js         # Component exports
├── pages/               # Full page components
│   ├── Home.js          # Homepage with all sections
│   ├── Services.js      # Government services directory
│   ├── News.js          # News and announcements
│   ├── About.js         # About Ethiopia page
│   └── index.js         # Page exports
├── data/                # Static data and content
│   └── govData.js       # Government services, news, etc.
├── utils/               # Helper functions and constants
│   ├── helpers.js       # Utility functions
│   └── constants.js     # App constants and config
└── App.js               # Main application component
```

## 🚀 Features

- **Multilingual Support**: Amharic, English, and Oromifa
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Government Services**: Comprehensive directory of all services
- **News & Updates**: Latest government announcements
- **Regional Services**: State-specific services and information
- **Search Functionality**: Find services and information quickly
- **Ethiopian Design**: Colors and styling inspired by Ethiopian flag

## 🎨 Design System

### Colors (Ethiopian Flag Theme)

- **Green**: `#166534` (Primary government color)
- **Yellow**: `#facc15` (Accent and highlights)
- **Red**: `#dc2626` (Alerts and important notices)

### Typography

- Headers: Bold, large text for maximum readability
- Body: Clean, accessible fonts supporting multiple languages
- Amharic text: Properly styled Ethiopian script

## 📱 Components

### Layout Components

- **Header**: Branding, language selector, mobile menu
- **Navigation**: Main menu with government sections
- **Footer**: Links, contact info, government branding

### Content Components

- **Hero**: Search functionality and main call-to-action
- **AlertBanner**: Important government notices
- **PopularServices**: Quick access to most-used services
- **GovernmentServices**: Complete service directory
- **NewsSection**: Latest updates and announcements
- **Sidebar**: Ministry links and citizen support

### Page Components

- **Home**: Complete homepage with all sections
- **Services**: Searchable government services directory
- **News**: Government news and announcements
- **About**: Information about Ethiopia and government

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **JavaScript ES6+**: Modern JavaScript features

## 📊 Data Structure

All government data is centralized in `src/data/govData.js`:

- `popularServices`: Most frequently accessed services
- `categories`: Government service categories with icons and counts
- `newsItems`: Latest government news and updates
- `regions`: Ethiopian regional states and city administrations
- `ministries`: Federal government ministries
- `footerLinks`: Footer navigation and legal links

## 🔧 Development

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
npm install
npm start
```

### Available Scripts

- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## 🌍 Multilingual Support

The website supports three languages:

- **English**: Default language for international users
- **አማርኛ (Amharic)**: Federal working language
- **Afaan Oromoo (Oromifa)**: Regional language support

Language switching is handled via the header dropdown and maintains user preference.

## 📱 Mobile Responsiveness

- Responsive grid system for all screen sizes
- Mobile-first design approach
- Touch-friendly interface elements
- Optimized performance on mobile devices

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## 🚀 Future Enhancements

- [ ] User authentication and citizen portal
- [ ] Online service applications
- [ ] Payment integration for government services
- [ ] Real-time chat support
- [ ] Advanced search with filters
- [ ] Document upload and tracking
- [ ] Multi-factor authentication
- [ ] API integration with government databases

## 📞 Support

For technical support or government service inquiries:

- **Phone**: 8080 (Toll Free)
- **Email**: info@ethiopia.gov.et
- **Address**: Addis Ababa, Ethiopia

## 📄 License

© 2025 Federal Government of Ethiopia. All rights reserved.
Powered by Ministry of Innovation and Technology.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
