from fastapi import FastAPI

from app.routes import (
    auth_routes,
    user_routes,
    tenant_routes
)

app = FastAPI(
    title="Catalog Gate API",
    version="1.0.0"
)
# API Version 1 Routes
app.include_router(
    auth_routes.router,
    prefix="/api/v1"
)
app.include_router(
    user_routes.router,
    prefix="/api/v1"
)
app.include_router(
    tenant_routes.router,
    prefix="/api/v1"
)

# Health checks
@app.get("/")
async def read_root():
    return {
        "message": "Catalog Gate API running"
    }

@app.get("/ping")
async def ping():
    return {
        "message": "pong"
    }