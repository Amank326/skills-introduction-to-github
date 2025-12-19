# Quantum Travel AI - API Documentation

## Overview
Quantum Travel AI provides a REST API and WebSocket interface for real-time AI communication.

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required for local development. In production, implement API key authentication.

## REST API Endpoints

### Health Check
**GET** `/api/health`

Check the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "service": "Quantum Travel AI",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000000",
  "active_connections": 5
}
```

---

### Get Available Models
**GET** `/api/models`

Retrieve list of available AI models.

**Response:**
```json
[
  {
    "name": "Quantum AI",
    "description": "Advanced quantum-enhanced AI model",
    "capabilities": [
      "Natural language understanding",
      "Code generation",
      "Mathematical computations"
    ],
    "version": "1.0.0",
    "status": "active"
  }
]
```

---

### Send Chat Message
**POST** `/api/chat`

Send a message and receive AI response.

**Request Body:**
```json
{
  "message": "What is quantum computing?",
  "conversation_id": "conv_123456",
  "model": "quantum-ai",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "response": "Quantum computing is...",
  "conversation_id": "conv_123456",
  "model": "quantum-ai",
  "timestamp": "2024-01-01T00:00:00.000000",
  "tokens_used": 150
}
```

---

### Get Conversation History
**GET** `/api/history/{conversation_id}`

Retrieve conversation history.

**Response:**
```json
{
  "conversation_id": "conv_123456",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T00:00:00.000000"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help?",
      "timestamp": "2024-01-01T00:00:01.000000"
    }
  ]
}
```

---

### Upload File
**POST** `/api/upload`

Upload a file for processing.

**Request:**
- Form data with file field

**Response:**
```json
{
  "filename": "document.pdf",
  "size": 102400,
  "content_type": "application/pdf",
  "message": "File uploaded successfully",
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

---

### Get Statistics
**GET** `/api/stats`

Get system statistics.

**Response:**
```json
{
  "total_conversations": 1234,
  "active_connections": 45,
  "supported_models": 2,
  "uptime": "operational",
  "version": "1.0.0"
}
```

---

## WebSocket API

### Connection
**WS** `/ws/{client_id}`

Connect to WebSocket for real-time communication.

**Connection Message:**
```json
{
  "type": "connection",
  "message": "Connected to Quantum Travel AI",
  "client_id": "client_abc123",
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

### Send Message
Send JSON message to the WebSocket:
```json
{
  "message": "Hello AI!",
  "model": "quantum-ai",
  "conversation_id": "conv_123456"
}
```

### Receive Message
```json
{
  "type": "message",
  "message": "Hello! How can I help you?",
  "model": "quantum-ai",
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request format"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Rate Limiting
- Default: 60 requests per minute per IP
- WebSocket: No rate limiting on established connections

---

## Best Practices

1. **Use WebSocket for Real-Time**: For chat applications, use WebSocket for better performance
2. **Handle Disconnections**: Implement reconnection logic for WebSocket
3. **Conversation Management**: Store conversation IDs to maintain context
4. **Error Handling**: Always handle API errors gracefully
5. **Message Length**: Keep messages under 4000 characters
6. **File Size**: Keep uploads under 10MB

---

## Code Examples

### JavaScript/Fetch
```javascript
async function sendMessage(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      model: 'quantum-ai'
    })
  });
  
  const data = await response.json();
  console.log(data.response);
}
```

### Python/Requests
```python
import requests

def send_message(message):
    response = requests.post(
        'http://localhost:8000/api/chat',
        json={
            'message': message,
            'model': 'quantum-ai'
        }
    )
    return response.json()
```

### WebSocket/JavaScript
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/client_123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.send(JSON.stringify({
  message: 'Hello!',
  model: 'quantum-ai'
}));
```

---

## Support
For API support, contact: support@quantumtravelai.com
