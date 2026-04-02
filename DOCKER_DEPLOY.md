# InvestFlow Africa — SaaS Platform
# Docker Deployment Guide

## Quick Start (Docker)

```bash
# Build and run
docker compose up -d --build

# Access the app
open http://localhost:3000
```

## Deploy on Render

### Option 1: Auto-deploy via render.yaml (Recommended)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New** → **Blueprint**
4. Connect your repo `skaba89/nimba-ressources`
5. Render auto-detects `render.yaml` and deploys

### Option 2: Manual Docker Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. **New** → **Web Service**
3. Connect repo `skaba89/nimba-ressources`
4. Settings:
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile` (auto-detected)
   - **Plan**: Starter (or higher)
   - **Region**: Frankfurt (EU)
5. Click **Create Web Service**

### Option 3: Docker Shell (Local Testing)
```bash
# Build the image
docker build -t investflow-africa .

# Run the container
docker run -p 3000:3000 --name investflow investflow-africa

# Stop
docker stop investflow
```

## Architecture
- **Next.js 16** with App Router (standalone output)
- **Multi-stage Docker build** (~150MB final image)
- **Health check** on port 3000
- **No database required** (static data + demo API)
