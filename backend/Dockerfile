FROM langchain/langgraph-api:3.13

ADD . /deps/backend
RUN pip install -c /api/constraints.txt -e /deps/backend

ENV LANGSERVE_GRAPHS='{"agent": "/deps/backend/src/agent.py:agent"}'
