# Deployment Guide - Quantum Travel AI

This guide covers various deployment options for Quantum Travel AI.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Considerations](#production-considerations)

---

## Local Development

### Prerequisites
- Python 3.8+
- pip
- Node.js 14+ (optional, for frontend development)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amank326/skills-introduction-to-github.git
   cd skills-introduction-to-github/quantum-travel-ai
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Create .env file
   cat > .env << EOF
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=your-openai-key
   GEMINI_API_KEY=your-gemini-key
   DEBUG=True
   EOF
   ```

5. **Run the application**
   ```bash
   python main.py
   ```

6. **Access the application**
   - Open browser: `http://localhost:8000`
   - API docs: `http://localhost:8000/api/docs`

---

## Docker Deployment

### Create Dockerfile

Create `Dockerfile` in the `backend` directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .
COPY ../frontend /app/frontend

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  quantum-ai:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend:/app
      - ./frontend:/app/frontend
    restart: unless-stopped
```

### Run with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd quantum-travel-ai/backend
   eb init -p python-3.11 quantum-travel-ai
   ```

3. **Create environment**
   ```bash
   eb create quantum-ai-env
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

5. **Set environment variables**
   ```bash
   eb setenv SECRET_KEY=your-key OPENAI_API_KEY=your-key
   ```

#### Using AWS Lambda + API Gateway

1. Create Lambda function with FastAPI
2. Use Mangum adapter for AWS Lambda
3. Deploy with AWS SAM or Serverless Framework

### Google Cloud Platform

#### Using Cloud Run

1. **Build container**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/quantum-ai
   ```

2. **Deploy**
   ```bash
   gcloud run deploy quantum-ai \
     --image gcr.io/PROJECT_ID/quantum-ai \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set environment variables**
   ```bash
   gcloud run services update quantum-ai \
     --update-env-vars SECRET_KEY=your-key
   ```

### Azure Deployment

#### Using Azure App Service

1. **Create App Service**
   ```bash
   az webapp create \
     --resource-group myResourceGroup \
     --plan myAppServicePlan \
     --name quantum-travel-ai \
     --runtime "PYTHON:3.11"
   ```

2. **Deploy code**
   ```bash
   az webapp deployment source config-zip \
     --resource-group myResourceGroup \
     --name quantum-travel-ai \
     --src quantum-ai.zip
   ```

3. **Configure settings**
   ```bash
   az webapp config appsettings set \
     --resource-group myResourceGroup \
     --name quantum-travel-ai \
     --settings SECRET_KEY=your-key
   ```

### Heroku Deployment

1. **Create Procfile**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy**
   ```bash
   heroku create quantum-travel-ai
   git push heroku main
   heroku config:set SECRET_KEY=your-key
   ```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build and run commands
3. Set environment variables
4. Deploy

---

## Production Considerations

### 1. Security

#### Environment Variables
- Never commit secrets to Git
- Use environment variables or secret management
- Rotate keys regularly

#### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

#### HTTPS
- Always use HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Configure proper SSL/TLS settings

#### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/chat")
@limiter.limit("60/minute")
async def chat(request: Request, chat_request: ChatRequest):
    # Your code
```

### 2. Database

For production, use a proper database:

```python
# PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/dbname"

# MongoDB
DATABASE_URL = "mongodb://user:password@localhost:27017/dbname"
```

### 3. Caching

Use Redis for caching and session management:

```python
import redis

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True
)
```

### 4. Monitoring

#### Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

#### Health Checks
Configure health check endpoints for load balancers

#### Monitoring Tools
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring
- **Datadog**: Infrastructure monitoring
- **Prometheus + Grafana**: Metrics and dashboards

### 5. Scalability

#### Load Balancing
- Use nginx or AWS ALB
- Distribute traffic across multiple instances

#### Horizontal Scaling
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quantum-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quantum-ai
  template:
    metadata:
      labels:
        app: quantum-ai
    spec:
      containers:
      - name: quantum-ai
        image: quantum-ai:latest
        ports:
        - containerPort: 8000
```

#### WebSocket Scaling
- Use Redis pub/sub for WebSocket broadcast
- Sticky sessions or shared state management

### 6. Backup and Recovery

- Regular database backups
- Code versioning with Git
- Disaster recovery plan
- Multiple deployment zones

### 7. Performance Optimization

#### Async Operations
- Use async/await for I/O operations
- Connection pooling for databases
- Caching frequently accessed data

#### CDN
- Serve static files via CDN
- Cache API responses when appropriate

#### Compression
```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

---

## Maintenance

### Updates
```bash
# Update dependencies
pip install --upgrade -r requirements.txt

# Security updates
pip install --upgrade fastapi uvicorn
```

### Backup
```bash
# Database backup
pg_dump dbname > backup.sql

# Code backup
git push origin main
```

### Monitoring Checklist
- [ ] Check error logs daily
- [ ] Monitor API response times
- [ ] Review security alerts
- [ ] Check resource usage
- [ ] Verify backup completion
- [ ] Test disaster recovery

---

## Support

For deployment support:
- Email: devops@quantumtravelai.com
- Documentation: https://docs.quantumtravelai.com
- Community: https://community.quantumtravelai.com
