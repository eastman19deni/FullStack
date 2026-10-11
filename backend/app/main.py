from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import Base, engine, get_db
from app.model import User, Tag, Project, Application
from app.schemas import (
    UserCreate, UserRead,
    TagCreate, TagRead,
    ProjectCreate, ProjectRead,
    ApplicationCreate, ApplicationRead,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevBoard API")


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- USERS ----------
@app.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = User(
        email=payload.email,
        username=payload.username,
        password_hash="",   # на ЛР4 заменим на bcrypt-хеш
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already in use",
        )
    db.refresh(user)
    return user


@app.get("/users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return user


# ---------- TAGS ----------
@app.post("/tags", response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(payload: TagCreate, db: Session = Depends(get_db)):
    tag = Tag(name=payload.name)
    db.add(tag)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tag already exists",
        )
    db.refresh(tag)
    return tag


@app.get("/tags", response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()


# ---------- PROJECTS ----------
@app.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    author = db.get(User, payload.author_id)
    if not author:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Author not found")

    project = Project(
        title=payload.title,
        description=payload.description,
        author_id=payload.author_id,
    )

    for tag_id in payload.tag_ids:
        tag = db.get(Tag, tag_id)
        if not tag:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                f"Tag {tag_id} not found",
            )
        project.tags.append(tag)

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return project


@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    db.delete(project)
    db.commit()
    return None


# ---------- APPLICATIONS ----------
@app.post("/applications", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    project = db.get(Project, payload.project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")

    user = db.get(User, payload.user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    application = Application(
        project_id=payload.project_id,
        user_id=payload.user_id,
        message=payload.message,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@app.get("/projects/{project_id}/applications", response_model=list[ApplicationRead])
def list_project_applications(project_id: int, db: Session = Depends(get_db)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")

    return (
        db.query(Application)
        .filter(Application.project_id == project_id)
        .all()
    )