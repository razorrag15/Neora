# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /workspace

# Copy requirements file first for better caching
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the application code
COPY app/ ./app/
COPY main.py .
COPY docker_config.env .

# Create necessary directories
RUN mkdir -p logs data

# Expose the port the app runs on
EXPOSE 4000

# The command to run the application
CMD ["python", "main.py"]