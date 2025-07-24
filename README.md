# Music Collaboration Platform

A modern web application for musicians, producers, and audio engineers to collaborate on music projects.

## Features

- **User Profiles**: Create profiles with skills, roles, and portfolio
- **Project Management**: Create and manage music projects with status tracking
- **Collaboration Tools**: Find collaborators, share files, and communicate
- **Discovery System**: Search for talent by skills, genre, and location
- **Real-time Updates**: Stay updated on project activities

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Music Collaboration Platform"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Feature components
├── contexts/         # React contexts
├── styles/          # Global styles
├── utils/           # Utility functions
│   └── supabase/    # Supabase client
├── public/          # Static assets
└── supabase/        # Edge functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.