from dataclasses import field
from typing import Optional

from apiflask.validators import Length
from marshmallow import ValidationError, post_load
from marshmallow_dataclass import dataclass


@dataclass
class ScriptOut:
    id: int = field()
    path: str = field()
    name: str = field()
    extension: str = field()

@dataclass
class ScriptContentOut:
    content: str = field()

@dataclass
class CreateScriptIn:
    name: str = field(metadata={"validate": Length(min=5)})
    content: Optional[str] = field(default=None)

    @post_load
    def name_must_end_with_sql(self, data, **kwargs):
        if self.name.endswith(".sql"):
            raise ValidationError("File name must end with .sql")
        return data


class UpdateScriptIn:
    name: str = field(metadata={"validate": Length(min=5)})
    content: Optional[str] = field(default=None)

    @post_load
    def name_must_end_with_sql(self, data, **kwargs):
        if self.name.endswith(".sql"):
            raise ValidationError("File name must end with .sql")
        return data

    @post_load
    def check_at_least_one_argument(self, data, **kwargs):
        if not any([data.get("name"), data.get("content")]):
            raise ValidationError("At least one argument must be provided.")
        return data
