FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire project to have access to shared modules
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r apps/server/requirements.txt

# Set PYTHONPATH to include shared modules
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "apps.server.main:app", "--host", "0.0.0.0", "--port", "8000"]