from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.routes import auth
from app.db import Base, engine, get_db
from app.models import Application, Project, Tag, User
from app.schemas import (
    ApplicationCreate,
    ApplicationRead,
    ProjectCreate,
    ProjectRead,
    TagCreate,
    TagRead,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="DevBoard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- TAGS ----------

@app.get("/tags", response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db)):
    return db.query(Tag).order_by(Tag.name).all()


@app.post("/tags", response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(
    payload: TagCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    tag = Tag(name=payload.name)
    db.add(tag)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Tag already exists")
    db.refresh(tag)
    return tag


# ---------- PROJECTS (публичные чтения) ----------

@app.get("/projects", response_model=list[ProjectRead])
def list_projects(
    query: str | None = Query(default=None, max_length=200),
    project_status: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    q = db.query(Project)
    if project_status and project_status != "all":
        q = q.filter(Project.status == project_status)
    if query and query.strip():
        pattern = f"%{query.strip()}%"
        q = q.filter(or_(Project.title.ilike(pattern), Project.description.ilike(pattern)))
    return q.order_by(Project.created_at.desc(), Project.id.desc()).all()


@app.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return project


# ---------- PROJECTS (защищённые операции) ----------

@app.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tags: list[Tag] = []
    if payload.tag_ids:
        unique_ids = set(payload.tag_ids)
        tags = db.query(Tag).filter(Tag.id.in_(unique_ids)).all()
        if len(tags) != len(unique_ids):
            found = {t.id for t in tags}
            missing = sorted(unique_ids - found)
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Tags not found: {missing}")

    project = Project(
        title=payload.title,
        description=payload.description,
        author_id=current_user.id,
        tags=tags,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    if project.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not the author")
    db.delete(project)
    db.commit()
    return None


# ---------- APPLICATIONS ----------

@app.post("/applications", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.get(Project, payload.project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    if project.author_id == current_user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cannot apply to your own project")

    already = (
        db.query(Application)
        .filter(Application.project_id == payload.project_id, Application.user_id == current_user.id)
        .first()
    )
    if already:
        raise HTTPException(status.HTTP_409_CONFLICT, "Already applied")

    application = Application(
        project_id=payload.project_id,
        user_id=current_user.id,
        message=payload.message,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@app.get("/projects/{project_id}/applications", response_model=list[ApplicationRead])
def list_project_applications(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    if project.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not the author")
    return db.query(Application).filter(Application.project_id == project_id).all()
