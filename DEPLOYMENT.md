# AgroChain Deployment Guide

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Git account

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd project

# Install dependencies
npm install

# Set environment variables
cat > .env << ENVEND
VITE_SUPABASE_URL=https://uxfnyzfkcduyjuyeqhhv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Zm55emZrY2R1eWp1eWVxaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDgyODIsImV4cCI6MjA3OTE4NDI4Mn0.uVbbkdV8zYQVp_QiJmGzaBXD6VRuWvGnmjSHA2sl6vg
ENVEND

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then redeploy
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Authorize with GitHub for automatic deployments
```

### Option 3: GitHub Pages

```bash
# Update package.json
# "homepage": "https://yourusername.github.io/agrochain"

npm run build

# Deploy
npm run deploy
```

### Option 4: Traditional Server (AWS/DigitalOcean/Linode)

```bash
# Build
npm run build

# Upload dist/ folder to server
# Configure web server (nginx/apache)
# Point domain to server IP
```

## Environment Variables

Required for production:
```
VITE_SUPABASE_URL=https://uxfnyzfkcduyjuyeqhhv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Database Setup

### Migration
```bash
# Already executed (see schema.sql)
# Tables are created in Supabase dashboard
```

### Sample Data
```bash
# Sample data inserted automatically
# Check Supabase dashboard > SQL Editor
```

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Build report
npm run build -- --report
```

### CDN Configuration
- Enable CloudFlare for domain
- Configure caching rules
- Set cache expiration (7 days for assets)

### Image Optimization
- Use WebP format
- Responsive images with srcset
- Lazy load images

## Monitoring & Logging

### Application Monitoring
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

### Database Monitoring
- Supabase built-in analytics
- Query performance monitoring
- Connection pool monitoring

## SSL/TLS Certificate

### For Vercel/Netlify
- Automatic HTTPS
- Auto-renewal

### For Custom Domain
- Use Let's Encrypt (free)
- Or purchase from Certbot

## Backup Strategy

### Database Backups
```
Supabase automatic daily backups
30-day retention period
```

### Manual Backup
```bash
# Export from Supabase dashboard
# Store in secure cloud storage
```

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set strong CORS policies
- [ ] Implement rate limiting
- [ ] Enable RLS policies
- [ ] Secure API keys
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement monitoring

## Scaling Strategy

### Phase 1: Initial Launch
- Single Supabase instance
- Vercel/Netlify free tier
- 10,000 users

### Phase 2: Growth
- Enable Supabase read replicas
- Upgrade to paid hosting
- Add caching layer (Redis)
- 100,000 users

### Phase 3: Enterprise
- Dedicated Supabase instance
- Kubernetes deployment
- Multi-region setup
- 1M+ users

## Rollback Procedure

```bash
# Rollback to previous version
git revert <commit-hash>
npm run build
git push

# Automatic redeployment on push
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
- Check Supabase URL/Key
- Verify network connectivity
- Check CORS configuration
- Review database permissions

### Performance Issues
- Analyze bundle size
- Enable compression
- Optimize database queries
- Implement caching

## Support

For deployment issues:
- Check deployment platform logs
- Review Supabase logs
- Contact platform support
- Email: support@agrochain.com

## Post-Deployment

1. Test all functionality
2. Monitor error logs
3. Check performance metrics
4. Set up alerts
5. Plan maintenance window
6. Communicate with users

---

**AgroChain Deployment**: Production-ready in minutes!
