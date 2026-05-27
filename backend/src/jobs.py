import os
import re
from functools import lru_cache
from pathlib import Path

import frontmatter

_JOB_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$")
_METADATA_FIELDS = (
    "id",
    "company_name",
    "recruiter_name",
    "links",
)


def _find_jobs_path() -> Path:
    env = os.environ.get("JOBS_PATH")
    if env:
        return Path(env)
    for parent in Path(__file__).parents:
        candidate = parent / "content" / "jobs"
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Cannot find jobs directory. Set JOBS_PATH env var.")


def _format_value(value: object) -> str:
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return str(value)


def _format_metadata(metadata: dict) -> str:
    lines = []
    for key in _METADATA_FIELDS:
        value = metadata.get(key)
        if value:
            lines.append(f"{key}: {_format_value(value)}")
    return "\n".join(lines)


def _load_job_file(path: Path) -> str:
    post = frontmatter.load(str(path))
    metadata = _format_metadata(post.metadata)
    parts = [f"# Job Context: {post.metadata.get('id', path.stem)}"]
    if metadata:
        parts.append(metadata)
    if post.content.strip():
        parts.append(post.content.strip())
    return "\n\n".join(parts)


@lru_cache(maxsize=128)
def _get_job_context_cached(job_id: str) -> str:
    job_file = _find_jobs_path() / f"{job_id}.md"
    if not job_file.is_file():
        return ""
    return _load_job_file(job_file)


def get_job_context(job_id: str | None) -> str:
    if not job_id:
        return ""

    normalized_job_id = job_id.strip()
    if not _JOB_ID_RE.fullmatch(normalized_job_id):
        return ""

    return _get_job_context_cached(normalized_job_id)
