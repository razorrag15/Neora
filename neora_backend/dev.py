#!/usr/bin/env python3
"""
Development server launcher script.
This script provides easy commands to start the development server.
"""

import subprocess
import sys
import os
from pathlib import Path

def check_requirements():
    """Check if requirements are installed."""
    try:
        import uvicorn
        import fastapi
        import kiteconnect
        import pyotp
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e.name}")
        print("Run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if environment file exists."""
    env_file = Path("docker_config.env")
    if env_file.exists():
        print("✅ Environment file found: docker_config.env")
        return True
    else:
        print("❌ Environment file not found: docker_config.env")
        return False

def start_dev_server(port=4000, debug=False):
    """Start the development server with uvicorn."""
    cmd = [
        "uvicorn", 
        "app.main:app", 
        "--host", "0.0.0.0", 
        "--port", str(port), 
        "--reload"
    ]
    
    if debug:
        cmd.extend(["--log-level", "debug"])
    
    print(f"🚀 Starting development server on port {port}")
    print(f"📖 API Documentation: http://localhost:{port}/docs")
    print(f"🔍 Health Check: http://localhost:{port}/health")
    print("🔄 Auto-reload enabled - code changes will restart the server")
    print("-" * 60)
    
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except FileNotFoundError:
        print("❌ uvicorn not found. Install with: pip install uvicorn")

def main():
    """Main function to handle command line arguments."""
    print("🔧 FastAPI Development Server")
    print("=" * 40)
    
    # Check prerequisites
    if not check_requirements():
        sys.exit(1)
    
    if not check_env_file():
        print("⚠️  Continuing without environment file...")
    
    # Parse command line arguments
    port = 4000
    debug = False
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--debug":
            debug = True
        elif sys.argv[1] == "--help":
            print("\nUsage:")
            print("  python dev.py           # Start development server")
            print("  python dev.py --debug   # Start with debug logging")
            print("  python dev.py --help    # Show this help")
            return
        elif sys.argv[1].startswith("--port="):
            try:
                port = int(sys.argv[1].split("=")[1])
            except ValueError:
                print("❌ Invalid port number")
                sys.exit(1)
    
    # Start the server
    start_dev_server(port, debug)

if __name__ == "__main__":
    main()
