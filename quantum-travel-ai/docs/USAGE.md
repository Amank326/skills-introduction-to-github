# Quantum Travel AI - Usage Guide

This guide provides detailed examples and best practices for using Quantum Travel AI.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Usage](#basic-usage)
3. [Advanced Features](#advanced-features)
4. [Code Examples](#code-examples)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Steps

1. **Access the Application**
   - Open your browser
   - Navigate to `http://localhost:8000`
   - You'll see the welcome screen

2. **Start a Conversation**
   - Type your message in the input box
   - Press Enter or click the send button
   - Wait for the AI response

3. **Select a Model**
   - Use the model selector in the header
   - Choose between Quantum AI or Quantum Pro
   - Different models have different capabilities

---

## Basic Usage

### Asking Questions

**Natural Language Questions:**
```
What is machine learning?
How does blockchain work?
Explain quantum computing in simple terms
```

**Calculations:**
```
Calculate 25% of 1500
Solve: 2x + 5 = 15
What is the square root of 144?
```

**Translations:**
```
Translate "Hello, how are you?" to Spanish
What does "Bonjour" mean in English?
```

### Code Generation

**Request Code:**
```
Write a Python function to reverse a string
Create a JavaScript function to validate email addresses
Generate a SQL query to find users by age
```

**Example Response:**
```python
def reverse_string(text):
    """
    Reverse a string using slicing
    
    Args:
        text (str): Input string
    
    Returns:
        str: Reversed string
    """
    return text[::-1]

# Usage
result = reverse_string("Hello")
print(result)  # Output: olleH
```

### Data Analysis

**Request Analysis:**
```
Analyze this data: [10, 20, 30, 40, 50]
What are the statistical measures of this dataset?
Find the mean, median, and mode
```

### Problem Solving

**Complex Problems:**
```
How can I optimize database queries?
What's the best way to implement user authentication?
Design a scalable microservices architecture
```

---

## Advanced Features

### Context-Aware Conversations

The AI maintains context throughout a conversation:

```
User: What is Python?
AI: [Explains Python programming language]

User: Show me an example
AI: [Provides Python code example, remembering context]

User: Can you optimize it?
AI: [Optimizes the previously shown code]
```

### Multi-Step Tasks

**Complex Task Example:**
```
User: I need to build a REST API for a todo application

AI: [Provides architecture overview]

User: Show me the database schema

AI: [Provides database design]

User: Now show the API endpoints

AI: [Lists and explains endpoints]

User: Give me the Python code for creating a todo item

AI: [Provides complete implementation]
```

### Code Review and Debugging

**Submit Code for Review:**
```python
User: Review this code:

def calculate(a, b):
    return a + b * 2

AI: [Provides review with suggestions]
- Missing docstring
- Variable names could be more descriptive
- Consider edge cases (None values, type checking)
- Operator precedence might be confusing

Improved version:
def calculate_weighted_sum(base_value, multiplier_value):
    """Calculate sum with weighted multiplier."""
    if base_value is None or multiplier_value is None:
        raise ValueError("Values cannot be None")
    return base_value + (multiplier_value * 2)
```

### File Operations (Coming Soon)

Upload and process files:
- Documents (PDF, DOCX, TXT)
- Images (PNG, JPG, GIF)
- Data files (CSV, JSON, XML)
- Code files (PY, JS, JAVA)

---

## Code Examples

### Python Client

```python
import requests
import json

class QuantumTravelClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.conversation_id = None
    
    def chat(self, message, model="quantum-ai"):
        """Send a chat message"""
        response = requests.post(
            f"{self.base_url}/api/chat",
            json={
                "message": message,
                "model": model,
                "conversation_id": self.conversation_id
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            self.conversation_id = data["conversation_id"]
            return data["response"]
        else:
            raise Exception(f"Error: {response.status_code}")
    
    def get_history(self):
        """Get conversation history"""
        if not self.conversation_id:
            return []
        
        response = requests.get(
            f"{self.base_url}/api/history/{self.conversation_id}"
        )
        return response.json()

# Usage
client = QuantumTravelClient()

# Send message
response = client.chat("What is Python?")
print(response)

# Continue conversation
response = client.chat("Show me an example")
print(response)

# Get history
history = client.get_history()
print(json.dumps(history, indent=2))
```

### JavaScript/Node.js Client

```javascript
const axios = require('axios');

class QuantumTravelClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
        this.conversationId = null;
    }
    
    async chat(message, model = 'quantum-ai') {
        try {
            const response = await axios.post(`${this.baseURL}/api/chat`, {
                message: message,
                model: model,
                conversation_id: this.conversationId
            });
            
            this.conversationId = response.data.conversation_id;
            return response.data.response;
        } catch (error) {
            throw new Error(`Chat error: ${error.message}`);
        }
    }
    
    async getHistory() {
        if (!this.conversationId) return [];
        
        try {
            const response = await axios.get(
                `${this.baseURL}/api/history/${this.conversationId}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`History error: ${error.message}`);
        }
    }
}

// Usage
(async () => {
    const client = new QuantumTravelClient();
    
    // Send message
    const response1 = await client.chat('What is JavaScript?');
    console.log(response1);
    
    // Continue conversation
    const response2 = await client.chat('Show me an example');
    console.log(response2);
    
    // Get history
    const history = await client.getHistory();
    console.log(JSON.stringify(history, null, 2));
})();
```

### WebSocket Client Example

```javascript
class QuantumWebSocketClient {
    constructor(clientId = null) {
        this.clientId = clientId || this.generateClientId();
        this.ws = null;
        this.messageHandlers = [];
    }
    
    generateClientId() {
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(
                `ws://localhost:8000/ws/${this.clientId}`
            );
            
            this.ws.onopen = () => {
                console.log('Connected');
                resolve();
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.messageHandlers.forEach(handler => handler(data));
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
        });
    }
    
    send(message, model = 'quantum-ai') {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                message: message,
                model: model
            }));
        }
    }
    
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Usage
(async () => {
    const client = new QuantumWebSocketClient();
    
    // Set up message handler
    client.onMessage((data) => {
        if (data.type === 'message') {
            console.log('AI:', data.message);
        }
    });
    
    // Connect
    await client.connect();
    
    // Send messages
    client.send('Hello, Quantum Travel AI!');
    
    // Disconnect after 10 seconds
    setTimeout(() => client.disconnect(), 10000);
})();
```

---

## Best Practices

### 1. Clear and Specific Prompts

**Good:**
```
Write a Python function that takes a list of numbers and returns 
the sum of even numbers only. Include error handling and docstring.
```

**Not as good:**
```
Write a function
```

### 2. Provide Context

**Good:**
```
I'm building a web application with Flask. How should I structure 
my project for a REST API with authentication?
```

**Not as good:**
```
How to structure a project?
```

### 3. Break Down Complex Tasks

Instead of:
```
Build me a complete e-commerce application
```

Do this:
```
1. First: Design the database schema for products and users
2. Then: Show me the authentication endpoints
3. Next: Implement product listing and search
4. Finally: Add shopping cart functionality
```

### 4. Use Follow-up Questions

```
User: What is Docker?
AI: [Explains Docker]

User: Show me a Dockerfile example
AI: [Shows Dockerfile]

User: How do I optimize it for production?
AI: [Provides optimization tips]
```

### 5. Request Specific Formats

```
Explain REST API design principles in bullet points
Show me Python code with detailed comments
Create a markdown table comparing SQL vs NoSQL
```

---

## Troubleshooting

### Connection Issues

**Problem:** Can't connect to WebSocket

**Solutions:**
1. Check if server is running: `http://localhost:8000/api/health`
2. Verify firewall settings
3. Check browser console for errors
4. Try using REST API mode instead

### Slow Responses

**Problem:** AI responses are slow

**Solutions:**
1. Check network connection
2. Reduce message length
3. Use simpler queries
4. Check server resources

### Missing Features

**Problem:** Feature not working as expected

**Solutions:**
1. Check if feature is enabled in settings
2. Verify API keys are configured
3. Review documentation
4. Check server logs

### Error Messages

**"Connection refused"**
- Server is not running
- Wrong port number
- Firewall blocking connection

**"Rate limit exceeded"**
- Too many requests
- Wait before retrying
- Upgrade to higher tier

**"Invalid API key"**
- API key not configured
- API key expired
- Wrong API key format

---

## Tips and Tricks

### 1. Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line in input
- `Ctrl/Cmd + K`: Clear conversation

### 2. Special Commands
- Use "explain like I'm 5" for simple explanations
- Ask "show me the code" for implementation details
- Request "step by step" for detailed processes

### 3. Export Conversations
```javascript
// Save conversation to file
const history = await client.getHistory();
const blob = new Blob([JSON.stringify(history, null, 2)], 
    { type: 'application/json' });
const url = URL.createObjectURL(blob);
// Download logic here
```

### 4. Customize Experience
- Switch models for different tasks
- Adjust temperature for creativity vs accuracy
- Use specific prompts for consistent results

---

## Support and Resources

- **Documentation**: See `/docs` folder
- **API Reference**: `http://localhost:8000/api/docs`
- **GitHub**: Report issues and contribute
- **Community**: Join our Discord server

---

**Happy AI-ing with Quantum Travel AI! 🚀**
