from langchain_anthropic import ChatAnthropic
from langgraph.prebuilt import create_react_agent

model = ChatAnthropic(model="claude-sonnet-4-6")

agent = create_react_agent(
    model,
    tools=[],
    prompt="You are a helpful assistant.",
)
