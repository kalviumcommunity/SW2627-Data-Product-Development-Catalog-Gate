import subprocess
import sys
import logging
from pathlib import Path

WORKER_SCRIPT = Path(__file__).parent / "worker.py"
TOTAL = 2

logging.basicConfig(
    level=logging.INFO,
    format="%(process)d: %(asctime)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

if __name__ == '__main__':
    logger.info("Starting %d validation workers...", TOTAL)
    processes = []

    for i in range(TOTAL):
        logger.info("Starting worker #%d", i + 1)
        p = subprocess.Popen(
            [sys.executable, str(WORKER_SCRIPT)],
        )
        processes.append(p)
        logger.info("Worker #%d started with PID %d", i + 1, p.pid)
    
    try:
        for p in processes:
            p.wait()
    except KeyboardInterrupt:
        logger.info("Shutting down gracefully...")
        for p in processes:
            p.terminate()
            p.wait()
    
    logger.info("All workers shut down.")
    
    
    