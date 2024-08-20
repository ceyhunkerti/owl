import tempfile

import requests
from app.models.script import Script
from pytest import Session
from tests.conftest import api_url


def test_upload_script(use_access_token: str, db: Session) -> None:
    content = """select * from test"""

    with tempfile.NamedTemporaryFile(
        mode="w", newline="", suffix=".sql", delete=False
    ) as f:
        f.write(content)
        f.flush()
        temp_file_name = f.name

    with open(temp_file_name, "rb") as f:
        response = requests.post(
            api_url("scripts/upload"),
            files={"file": f},
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        id = response.json()["id"]
        with db() as session:
            uploaded_script = session.query(Script).filter(Script.id == id).first()
            assert uploaded_script is not None, "Script not found in database"

        response = requests.get(
            api_url(f"scripts/{id}/exists"),
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        assert response.json()["exists"]


def test_delete_script(use_access_token: str, db: Session):
    content = """select * from test"""

    with tempfile.NamedTemporaryFile(
        mode="w", newline="", suffix=".sql", delete=False
    ) as f:
        f.write(content)
        f.flush()
        temp_file_name = f.name

    with open(temp_file_name, "rb") as f:
        response = requests.post(
            api_url("scripts/upload"),
            files={"file": f},
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        id = response.json()["id"]
        response = requests.delete(
            api_url(f"scripts/{id}"),
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text

        response = requests.get(
            api_url(f"scripts/{id}/exists"),
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        assert not response.json()["exists"]

        with db() as session:
            uploaded_file = session.query(Script).filter(Script.id == id).first()
            assert uploaded_file is None, "Script is not removed from database"


def test_rename_script(use_access_token: str, db: Session) -> None:
    content = """select * from test"""

    with tempfile.NamedTemporaryFile(
        mode="w", newline="", suffix=".sql", delete=False
    ) as f:
        f.write(content)
        f.flush()
        temp_file_name = f.name

    with open(temp_file_name, "rb") as f:
        response = requests.post(
            api_url("scripts/upload"),
            files={"file": f},
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        id = response.json()["id"]
        with db() as session:
            uploaded_script = session.query(Script).filter(Script.id == id).first()
            assert uploaded_script is not None, "Script not found in database"

        response = requests.put(
            api_url(f"scripts/{id}/rename"),
            json={
                "name": "test.sql",
            },
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text

        response = requests.get(
            api_url(f"scripts/{id}"),
            headers={"Authorization": f"Bearer {use_access_token}"},
        )
        assert response.status_code == 200, response.text
        assert response.json()["name"] == "test.sql"
