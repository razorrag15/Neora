"""
WebSocket API for Real-time Market Data
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import json
import asyncio
from app.services.neo_client import neo_client

router = APIRouter(prefix="/ws", tags=["WebSocket"])


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.subscriptions: Dict[WebSocket, List[Dict]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.subscriptions[websocket] = []
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        self.active_connections.remove(websocket)
        if websocket in self.subscriptions:
            del self.subscriptions[websocket]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific client"""
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


manager = ConnectionManager()


@router.websocket("/market-feed")
async def websocket_market_feed(websocket: WebSocket):
    """
    WebSocket endpoint for real-time market data
    
    **Message Format for Subscribe:**
    ```json
    {
        "action": "subscribe",
        "instruments": [
            {"instrument_token": "11536", "exchange_segment": "nse_cm"},
            {"instrument_token": "2885", "exchange_segment": "nse_cm"}
        ],
        "is_index": false,
        "is_depth": false
    }
    ```
    
    **Message Format for Unsubscribe:**
    ```json
    {
        "action": "unsubscribe",
        "instruments": [
            {"instrument_token": "11536", "exchange_segment": "nse_cm"}
        ]
    }
    ```
    
    **Server Response Format:**
    ```json
    {
        "type": "tick",
        "data": {
            "instrument_token": "11536",
            "last_price": 2500.50,
            "volume": 1000000,
            "timestamp": "2024-01-01T10:30:00"
        }
    }
    ```
    """
    await manager.connect(websocket)
    
    try:
        # Send welcome message
        await manager.send_personal_message({
            "type": "connection",
            "message": "Connected to NEORA WebSocket",
            "status": "connected"
        }, websocket)
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            action = message.get("action")
            
            if action == "subscribe":
                # Subscribe to instruments
                instruments = message.get("instruments", [])
                is_index = message.get("is_index", False)
                is_depth = message.get("is_depth", False)
                
                # Store subscription
                if websocket in manager.subscriptions:
                    manager.subscriptions[websocket].extend(instruments)
                
                # Send confirmation
                await manager.send_personal_message({
                    "type": "subscription",
                    "status": "success",
                    "message": f"Subscribed to {len(instruments)} instruments",
                    "instruments": instruments
                }, websocket)
                
                # Note: Actual Kotak Neo WebSocket integration would happen here
                # For now, we'll send mock data
                asyncio.create_task(send_mock_data(websocket, instruments))
                
            elif action == "unsubscribe":
                # Unsubscribe from instruments
                instruments = message.get("instruments", [])
                
                if websocket in manager.subscriptions:
                    for inst in instruments:
                        if inst in manager.subscriptions[websocket]:
                            manager.subscriptions[websocket].remove(inst)
                
                await manager.send_personal_message({
                    "type": "unsubscription",
                    "status": "success",
                    "message": f"Unsubscribed from {len(instruments)} instruments"
                }, websocket)
                
            elif action == "ping":
                # Heartbeat
                await manager.send_personal_message({
                    "type": "pong",
                    "timestamp": message.get("timestamp")
                }, websocket)
            
            else:
                await manager.send_personal_message({
                    "type": "error",
                    "message": f"Unknown action: {action}"
                }, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client disconnected")
    
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)


async def send_mock_data(websocket: WebSocket, instruments: List[Dict]):
    """
    Send mock market data (for demonstration)
    In production, this would connect to actual Kotak Neo WebSocket
    """
    import random
    from datetime import datetime
    
    try:
        while websocket in manager.active_connections:
            for instrument in instruments:
                # Generate mock tick data
                mock_data = {
                    "type": "tick",
                    "data": {
                        "instrument_token": instrument["instrument_token"],
                        "exchange_segment": instrument["exchange_segment"],
                        "last_price": round(random.uniform(1000, 3000), 2),
                        "volume": random.randint(100000, 1000000),
                        "change": round(random.uniform(-50, 50), 2),
                        "change_percent": round(random.uniform(-2, 2), 2),
                        "timestamp": datetime.now().isoformat()
                    }
                }
                
                await manager.send_personal_message(mock_data, websocket)
            
            # Wait before next update
            await asyncio.sleep(1)
    
    except Exception as e:
        print(f"Error sending mock data: {str(e)}")


@router.get("/connections")
async def get_active_connections():
    """
    Get number of active WebSocket connections (for monitoring)
    """
    return {
        "active_connections": len(manager.active_connections),
        "total_subscriptions": sum(len(subs) for subs in manager.subscriptions.values())
    }