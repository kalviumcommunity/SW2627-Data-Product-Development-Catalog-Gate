.PHONY: server client workers

server:
	PYTHONPATH=.:apps/server uvicorn apps.server.main:app --reload

client:
	cd apps/client && npm run dev

workers:
	PYTHONPATH=.:apps/worker python -m apps.worker.start