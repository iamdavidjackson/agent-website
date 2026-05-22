import os
from pathlib import Path

import frontmatter
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document


def _find_kb_path() -> Path:
    env = os.environ.get("KNOWLEDGE_BASE_PATH")
    if env:
        return Path(env)
    for parent in Path(__file__).parents:
        candidate = parent / "content" / "knowledge-base"
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "Cannot find knowledge-base directory. Set KNOWLEDGE_BASE_PATH env var."
    )


def _load_documents() -> list[Document]:
    kb_path = _find_kb_path()
    docs = []
    for md_file in sorted(kb_path.rglob("*.md")):
        if md_file.name == "README.md":
            continue
        post = frontmatter.load(str(md_file))

        parts = []
        for key, value in post.metadata.items():
            if key in ("id", "archived", "createdAt", "updatedAt", "courseIds", "programId"):
                continue
            if isinstance(value, list):
                parts.append(f"{key}: {', '.join(str(v) for v in value)}")
            elif value is not None:
                parts.append(f"{key}: {value}")
        parts.append(post.content)

        category = md_file.parent.name
        scalar_meta = {
            k: v
            for k, v in post.metadata.items()
            if isinstance(v, (str, int, float, bool))
        }
        docs.append(Document(
            page_content="\n".join(parts),
            metadata={**scalar_meta, "source": md_file.stem, "category": category},
        ))
    return docs


_retriever: BM25Retriever | None = None


def get_retriever() -> BM25Retriever:
    global _retriever
    if _retriever is None:
        docs = _load_documents()
        _retriever = BM25Retriever.from_documents(docs, k=4)
    return _retriever
