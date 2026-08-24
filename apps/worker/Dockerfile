FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire project to have access to shared modules
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH to include shared modules
ENV PYTHONPATH=/app

# Run the worker
CMD ["python", "apps/worker/start.py"]