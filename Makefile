.PHONY: server client

server:
	PYTHONPATH=.:apps/server uvicorn apps.server.main:app --reload

client:
	cd apps/client && npm run dev
