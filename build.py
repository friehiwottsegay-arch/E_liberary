#!/usr/bin/env python3
"""
Build script for Render deployment
"""
import os
import subprocess
import sys

def run_command(command, cwd=None):
    """Run a command and handle errors"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    """Main build process"""
    print("Starting E-Library build process...")
    
    # Install Python dependencies
    print("\n1. Installing Python dependencies...")
    if not run_command("pip install --upgrade pip"):
        sys.exit(1)
    
    if not run_command("pip install -r requirements.txt"):
        sys.exit(1)
    
    # Change to backend directory
    backend_dir = "backend"
    if not os.path.exists(backend_dir):
        print(f"Error: {backend_dir} directory not found")
        sys.exit(1)
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings_production')
    
    # Collect static files
    print("\n2. Collecting static files...")
    if not run_command("python manage.py collectstatic --no-input --settings=dl.settings_production", cwd=backend_dir):
        sys.exit(1)
    
    # Run migrations
    print("\n3. Running database migrations...")
    if not run_command("python manage.py migrate --settings=dl.settings_production", cwd=backend_dir):
        sys.exit(1)
    
    print("\n✅ Build completed successfully!")

if __name__ == "__main__":
    main()