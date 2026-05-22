import os
from pathlib import Path

import frontmatter
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import Field
from rank_bm25 import BM25Okapi


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


def _parse_sections(body: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    current_heading = "_intro"
    current_lines: list[str] = []
    for line in body.splitlines():
        if line.startswith("# "):
            if current_lines:
                sections[current_heading] = "\n".join(current_lines).strip()
            current_heading = line[2:].strip()
            current_lines = []
        else:
            current_lines.append(line)
    if current_lines:
        sections[current_heading] = "\n".join(current_lines).strip()
    return {k: v for k, v in sections.items() if v}


def _meta_summary(meta: dict) -> str:
    parts = []
    for key in ("title", "company", "program", "institution", "interestName", "question",
                "course", "startDate", "endDate", "technologies", "skills", "clients"):
        val = meta.get(key)
        if not val:
            continue
        if isinstance(val, list):
            parts.append(f"{key}: {', '.join(str(v) for v in val)}")
        else:
            parts.append(f"{key}: {val}")
    return "\n".join(parts)


def _load_documents() -> list[Document]:
    kb_path = _find_kb_path()
    docs = []
    for md_file in sorted(kb_path.rglob("*.md")):
        if md_file.name == "README.md":
            continue
        post = frontmatter.load(str(md_file))
        meta_summary = _meta_summary(post.metadata)
        category = md_file.parent.name
        scalar_meta = {
            k: v
            for k, v in post.metadata.items()
            if isinstance(v, (str, int, float, bool))
        }
        base_meta = {**scalar_meta, "source": md_file.stem, "category": category}

        sections = _parse_sections(post.content)
        if not sections:
            docs.append(Document(
                page_content=f"{meta_summary}\n\n{post.content}".strip(),
                metadata=base_meta,
            ))
            continue

        for heading, content in sections.items():
            docs.append(Document(
                page_content=f"{meta_summary}\n\n{heading}:\n{content}",
                metadata={**base_meta, "section": heading},
            ))
    return docs


class _BM25Retriever(BaseRetriever):
    docs: list[Document] = Field(default_factory=list)
    bm25: BM25Okapi = Field(default=None)
    k: int = 5

    class Config:
        arbitrary_types_allowed = True

    def _get_relevant_documents(self, query: str) -> list[Document]:
        tokens = query.lower().split()
        scores = self.bm25.get_scores(tokens)
        top_indices = sorted(range(len(scores)), key=lambda i: -scores[i])[: self.k]
        return [self.docs[i] for i in top_indices]


_retriever: _BM25Retriever | None = None


def get_retriever() -> _BM25Retriever:
    global _retriever
    if _retriever is None:
        docs = _load_documents()
        corpus = [d.page_content.lower().split() for d in docs]
        _retriever = _BM25Retriever(docs=docs, bm25=BM25Okapi(corpus), k=5)
    return _retriever
