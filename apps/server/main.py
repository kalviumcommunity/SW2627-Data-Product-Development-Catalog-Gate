import sys
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent
ROOT_DIR = SERVER_DIR.parent.parent

if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    auth_routes,
    user_routes,
    tenant_routes,
    catalog_routes,
)

app = FastAPI(
    title="Catalog Gate API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(
    catalog_routes.router,
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