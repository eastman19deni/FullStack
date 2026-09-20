from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class UserCreate(BaseModel):
    email:str
    username: str = Field(min_length = 3)

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes = True)
    id: int 
    email: str
    username: str

class TagCreate(BaseModel):
    name: str

class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes= True)
    id: int 
    name: str

class ProjectCreate(BaseModel):
    title: str = Field(min_length = 3)
    description: str = Field(min_length = 20)
    tag_ids: list[int] = []
    author_id: int

class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    status: str
    author: UserRead
    tags: list[TagRead]
    created_at: datetime

class ApplicationCreate(BaseModel):
    project_id: int
    user_id: int
    massage: str = ""

class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes = True)
    id: int
    project_id: int
    user_id: int 
    massage: str
    status: str
    create_at: datetime

