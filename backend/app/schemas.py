from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- USERS ----------
class PublicUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str


# ---------- TAGS ----------
class TagCreate(BaseModel):
    name: str = Field(min_length=1, max_length=64, pattern=r"^[a-zA-Zа-яА-Я0-9 _\-]+$")


class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


# ---------- PROJECTS ----------
class ProjectCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=20, max_length=5000)
    tag_ids: list[int] = Field(default_factory=list, max_length=10)


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    status: str
    author: PublicUser
    tags: list[TagRead]
    created_at: datetime


# ---------- APPLICATIONS ----------
class ApplicationCreate(BaseModel):
    project_id: int = Field(gt=0)
    message: str = Field(default="", max_length=2000)


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    user_id: int
    message: str
    status: str
    created_at: datetime


# ---------- AUTH ----------
class RegisterInput(BaseModel):
    email: EmailStr = Field(max_length=255)
    username: str = Field(min_length=3, max_length=14, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=6, max_length=128)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshInput(BaseModel):
    refresh_token: str


class MeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    username: str
