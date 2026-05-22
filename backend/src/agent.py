from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

from .knowledge_base import get_retriever

model = ChatAnthropic(model="claude-sonnet-4-6")


@tool
def search_knowledge_base(query: str) -> str:
    """Search David Jackson's personal knowledge base. Use this for questions about
    his work history, education, skills, interests, and career FAQs."""
    docs = get_retriever().invoke(query)
    if not docs:
        return "No relevant information found."
    return "\n\n---\n\n".join(
        f"[{doc.metadata.get('category', 'general')}]\n{doc.page_content}"
        for doc in docs
    )


agent = create_react_agent(
    model,
    tools=[search_knowledge_base],
    prompt=(
        "You are a personal AI assistant on David Jackson's portfolio website. "
        "Answer questions about David's background, work history, education, skills, and interests. "
        "Always use the search_knowledge_base tool to look up information before answering — "
        "do not rely on assumptions. Be concise and direct."
    ),
)
