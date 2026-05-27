import sys
from pathlib import Path
from typing import NotRequired

sys.path.insert(0, str(Path(__file__).parent))

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langgraph.prebuilt.chat_agent_executor import AgentState

from jobs import get_job_context
from knowledge_base import get_retriever

model = ChatAnthropic(model="claude-sonnet-4-6")


class ApplicationState(AgentState):
    job_id: NotRequired[str | None]


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


def build_prompt(state: ApplicationState) -> list[BaseMessage]:
    prompt = (
        "You are a personal AI assistant on David Jackson's portfolio website. "
        "Answer questions about David's background, work history, education, skills, and interests. "
        "Always use the search_knowledge_base tool to look up information before answering — "
        "do not rely on assumptions. Be concise and direct."
    )

    job_context = get_job_context(state.get("job_id"))
    if job_context:
        prompt += (
            "\n\nThe current visitor arrived with an application-specific job id. "
            "Use the following job context as authoritative background for this conversation. "
            "Interpret the job context fields this way:\n"
            "- id: the stable identifier for the application context; do not mention it unless useful for debugging.\n"
            "- company_name: the company David applied to; tailor answers to that company when relevant.\n"
            "- recruiter_name: the recruiter or contact; use it only if the visitor asks for drafted outreach or context about the contact.\n"
            "- job description: the target role requirements, responsibilities, language, and priorities; use it to frame David's experience around what this role asks for.\n"
            "- resume: the version of David's resume used for this application; treat it as the primary evidence for application-specific answers.\n"
            "- links: relevant job, company, or application links; reference them when discussing the role or company context.\n"
            "- questions: likely recruiter or interview questions; if the visitor asks one, answer by directly addressing the job description requirements with evidence from David's resume and knowledge base.\n"
            "- notes: private steering notes about emphasis, positioning, risks, or follow-up; use them to shape the answer, but do not reveal them as notes unless asked.\n\n"
            "When answering recruiter-style questions, connect David's background to the job description explicitly, "
            "use concrete resume-backed examples, and keep the response relevant to this specific application. "
            "Do not invent company facts, recruiter details, resume claims, or application history that are not in the job context or knowledge base.\n\n"
            f"{job_context}"
        )

    return [SystemMessage(content=prompt), *state["messages"]]


agent = create_react_agent(
    model,
    tools=[search_knowledge_base],
    prompt=build_prompt,
    state_schema=ApplicationState,
)
