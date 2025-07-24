# Deployment Guide - Music Collaboration Platform

This guide will help you deploy the Music Collaboration Platform to Vercel.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v18 or higher)
2. [Git](https://git-scm.com/)
3. [Vercel Account](https://vercel.com/signup)
4. [Supabase Account](https://supabase.com/) (for backend services)

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Configure project settings
   - Set environment variables when prompted

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables:**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Option 3: Deploy with Git

1. **Install Vercel CLI and login:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Link to Vercel:**
   ```bash
   vercel link
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Environment Variables

The following environment variables need to be set in Vercel:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for Edge Functions) | No* |

*Only required if deploying Supabase Edge Functions

## Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials:**
   - Project URL: Found in Settings → API
   - Anon Key: Found in Settings → API

3. **Deploy Edge Functions** (if needed):
   ```bash
   supabase functions deploy
   ```

## Post-Deployment

1. **Verify deployment:**
   - Visit your Vercel URL
   - Test authentication features
   - Check project creation and collaboration features

2. **Monitor performance:**
   - Use Vercel Analytics
   - Monitor Supabase usage

3. **Custom domain** (optional):
   - Add custom domain in Vercel dashboard
   - Configure DNS settings

## Troubleshooting

### Build Errors

- Ensure all dependencies are listed in `package.json`
- Check TypeScript errors with `npm run type-check`
- Verify environment variables are set correctly

### Runtime Errors

- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure Supabase project is active

### Authentication Issues

- Verify Supabase Auth settings
- Check redirect URLs in Supabase dashboard
- Ensure environment variables match your Supabase project

## Build Configuration

The project uses Vite for building. Key configurations:

- **Output Directory:** `dist`
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui

## Performance Optimization

The build is optimized with:
- Code splitting for better loading performance
- Separate chunks for vendor libraries
- CSS optimization with Tailwind
- Tree shaking for unused code removal

## Security Notes

- Never commit `.env` files
- Use Vercel's environment variables for production
- Keep Supabase service role key secure
- Enable RLS (Row Level Security) in Supabase

## Support

For issues or questions:
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit [Supabase Documentation](https://supabase.com/docs)
- Review project README for feature information