import importlib.metadata

from app.app import create_app  # noqa
from app.const import APP_NAME
from app.logging import setup_logging
from flask_migrate import Migrate

try:
    __version__ = importlib.metadata.version(APP_NAME)
except:  # noqa
    __version__ = "-"

setup_logging()

migrate = Migrate(compare_type=True)
