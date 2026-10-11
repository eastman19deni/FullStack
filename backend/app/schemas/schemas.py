from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- USER ----------
class UserCreate(BaseModel):
    email: EmailStr = Field(
        max_length=255,
        description="Корректный email-адрес",
    )
    username: str = Field(
        min_length=3,
        max_length=14,
        pattern=r"^[a-zA-Z0-9_]+$",
        description="3–14 символов: латиница, цифры, подчёркивание",
    )


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    username: str


# ---------- TAG ----------
class TagCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=64,
        pattern=r"^[a-zA-Zа-яА-Я0-9 _\-]+$",
        description="1–64 символа: буквы, цифры, пробел, дефис, подчёркивание",
    )


class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


# ---------- PROJECT ----------
class ProjectCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200,
        description="3–200 символов",
    )
    description: str = Field(
        min_length=20,
        max_length=5000,
        description="20–5000 символов",
    )
    tag_ids: list[int] = Field(
        default_factory=list,
        max_length=10,
        description="Не более 10 тегов",
    )
    author_id: int = Field(gt=0)


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: str
    author: UserRead
    tags: list[TagRead]
    created_at: datetime


# ---------- APPLICATION ----------
class ApplicationCreate(BaseModel):
    project_id: int = Field(gt=0)
    user_id: int = Field(gt=0)
    message: str = Field(
        default="",
        max_length=2000,
        description="Не более 2000 символов",
    )


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    user_id: int
    message: str
    status: str
    created_at: datetime