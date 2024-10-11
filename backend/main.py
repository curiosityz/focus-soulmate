from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from haystack import Pipeline
from haystack.document_stores import InMemoryDocumentStore
from haystack.nodes import PreProcessor, BM25Retriever, FARMReader, PromptNode, AnswerParser
from haystack.schema import Document

app = FastAPI()

# Initialize document store
document_store = InMemoryDocumentStore(use_bm25=True)

# Initialize components
preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=200,
    split_overlap=20,
    split_respect_sentence_boundary=True,
)

retriever = BM25Retriever(document_store=document_store)
reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=False)
prompt_node = PromptNode("gpt-3.5-turbo", api_key="your-openai-api-key")
answer_parser = AnswerParser()

# Initialize pipelines
query_pipeline = Pipeline()
query_pipeline.add_node(component=retriever, name="Retriever", inputs=["Query"])
query_pipeline.add_node(component=reader, name="Reader", inputs=["Retriever"])

synthesis_pipeline = Pipeline()
synthesis_pipeline.add_node(component=retriever, name="Retriever", inputs=["Query"])
synthesis_pipeline.add_node(component=prompt_node, name="PromptNode", inputs=["Retriever"])
synthesis_pipeline.add_node(component=answer_parser, name="AnswerParser", inputs=["PromptNode"])

class DocumentInput(BaseModel):
    text: str

class QueryInput(BaseModel):
    query: str

class TaskInput(BaseModel):
    task: str

@app.post("/add_document")
async def add_document(document: DocumentInput):
    doc = Document(content=document.text)
    preprocessed_docs = preprocessor.process([doc])
    document_store.write_documents(preprocessed_docs)
    return {"message": "Document added successfully"}

@app.get("/get_documents")
async def get_documents():
    documents = document_store.get_all_documents()
    return {"documents": [{"id": doc.id, "content": doc.content} for doc in documents]}

@app.post("/query")
async def query(query_input: QueryInput):
    results = query_pipeline.run(query=query_input.query, params={"Retriever": {"top_k": 3}, "Reader": {"top_k": 1}})
    if results["answers"]:
        return {"answer": results["answers"][0].answer, "context": results["answers"][0].context}
    else:
        return {"message": "No answer found"}

@app.post("/synthesize")
async def synthesize(query_input: QueryInput):
    results = synthesis_pipeline.run(
        query=query_input.query,
        params={
            "Retriever": {"top_k": 5},
            "PromptNode": {"prompt_template": "Synthesize the following information:\n{join(documents)}"}
        }
    )
    if results["answers"]:
        return {"synthesis": results["answers"][0].answer}
    else:
        return {"message": "No synthesis generated"}

@app.post("/plan_task")
async def plan_task(task_input: TaskInput):
    prompt = f"Create a step-by-step plan for the following task:\n{task_input.task}"
    results = prompt_node.run(prompt)
    if results:
        return {"plan": results[0]}
    else:
        return {"message": "No plan generated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)