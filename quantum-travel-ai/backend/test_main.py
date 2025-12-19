"""
Tests for Quantum Travel AI
Run with: pytest test_main.py
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_endpoint(self):
        """Test /api/health returns 200"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "Quantum Travel AI"
        assert "version" in data
        assert "timestamp" in data

class TestModels:
    """Test model endpoints"""
    
    def test_get_models(self):
        """Test /api/models returns available models"""
        response = client.get("/api/models")
        assert response.status_code == 200
        models = response.json()
        assert isinstance(models, list)
        assert len(models) > 0
        
        # Check first model structure
        model = models[0]
        assert "name" in model
        assert "description" in model
        assert "capabilities" in model
        assert "version" in model

class TestChat:
    """Test chat functionality"""
    
    def test_chat_endpoint(self):
        """Test /api/chat with valid message"""
        response = client.post(
            "/api/chat",
            json={
                "message": "Hello, Quantum Travel AI!",
                "model": "quantum-ai"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "conversation_id" in data
        assert "model" in data
        assert "timestamp" in data
        assert len(data["response"]) > 0
    
    def test_chat_with_conversation_id(self):
        """Test continuing conversation"""
        # First message
        response1 = client.post(
            "/api/chat",
            json={
                "message": "What is Python?",
                "model": "quantum-ai"
            }
        )
        conv_id = response1.json()["conversation_id"]
        
        # Second message with same conversation ID
        response2 = client.post(
            "/api/chat",
            json={
                "message": "Tell me more",
                "conversation_id": conv_id,
                "model": "quantum-ai"
            }
        )
        assert response2.status_code == 200
        assert response2.json()["conversation_id"] == conv_id
    
    def test_chat_empty_message(self):
        """Test chat with empty message"""
        response = client.post(
            "/api/chat",
            json={
                "message": "",
                "model": "quantum-ai"
            }
        )
        # Should still process but response handling varies
        assert response.status_code in [200, 400]

class TestHistory:
    """Test conversation history"""
    
    def test_get_history(self):
        """Test retrieving conversation history"""
        # Create a conversation
        response = client.post(
            "/api/chat",
            json={
                "message": "Test message",
                "model": "quantum-ai"
            }
        )
        conv_id = response.json()["conversation_id"]
        
        # Get history
        history_response = client.get(f"/api/history/{conv_id}")
        assert history_response.status_code == 200
        data = history_response.json()
        assert "conversation_id" in data
        assert "messages" in data
        assert len(data["messages"]) >= 2  # User message + AI response
    
    def test_get_nonexistent_history(self):
        """Test getting history for non-existent conversation"""
        response = client.get("/api/history/nonexistent_id")
        assert response.status_code == 200
        data = response.json()
        assert data["messages"] == []

class TestStats:
    """Test statistics endpoint"""
    
    def test_get_stats(self):
        """Test /api/stats endpoint"""
        response = client.get("/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_conversations" in data
        assert "active_connections" in data
        assert "supported_models" in data
        assert "version" in data

class TestUpload:
    """Test file upload"""
    
    def test_upload_file(self):
        """Test file upload endpoint"""
        # Create a test file
        files = {
            "file": ("test.txt", b"Test file content", "text/plain")
        }
        response = client.post("/api/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "filename" in data
        assert "size" in data
        assert data["filename"] == "test.txt"

class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root_returns_html(self):
        """Test / returns HTML page"""
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
