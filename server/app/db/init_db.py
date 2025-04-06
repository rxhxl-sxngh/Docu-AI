# server/app/db/init_db.py
import logging
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db() -> None:
    # Create tables in the database
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created in database")
    
    db = SessionLocal()
    try:
        # Create first superuser if not exists
        user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)
        if not user:
            user_in = schemas.UserCreate(
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                full_name="Initial Admin",
                is_superuser=True,
            )
            user = crud.user.create(db, obj_in=user_in)
            logger.info(f"Initial superuser created: {user.email}")
        else:
            logger.info("Superuser already exists")
    finally:
        db.close()


if __name__ == "__main__":
    logger.info("Creating initial data")
    init_db()
    logger.info("Initial data created")