from dataclasses import field
from typing import Optional

from apiflask.validators import Length
from marshmallow import ValidationError, post_load
from marshmallow_dataclass import dataclass


@dataclass
class MacroFileOut:
    id: int = field()
    path: str = field()
    name: str = field()
    extension: str = field()


@dataclass
class MacroFileContentOut:
    content: str = field()


@dataclass
class CreateMacroFileIn:
    name: str = field(metadata={"validate": Length(min=5)})
    content: Optional[str] = field(default=None)

    @post_load
    def name_must_end_with_sql(self, data, **kwargs):
        if self.name.endswith(".sql"):
            raise ValidationError("File name must end with .sql")
        return data


@dataclass
class UpdateMacroFileIn:
    name: Optional[str] = field(metadata={"required": False})
    content: Optional[str] = field(metadata={"required": False})

    @post_load
    def name_must_end_with_sql(self, data, **kwargs):
        if data.get("name") and not data.get("name").endswith(".sql"):
            raise ValidationError("File name must end with .sql")
        return data

    @post_load
    def check_at_least_one_argument(self, data, **kwargs):
        if not any([data.get("name"), data.get("content")]):
            raise ValidationError("At least one argument must be provided.")
        return data