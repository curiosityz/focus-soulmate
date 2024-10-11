from fastapi import FastAPI
from haystack.document_stores import InMemoryDocumentStore
from haystack.pipelines import Pipeline
from haystack.nodes import TextConverter, PreProcessor

app = FastAPI()

# Initialize document store
document_store = InMemoryDocumentStore()

# Initialize preprocessing pipeline
preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=True,
    split_by="word",
    split_length=200,
    split_overlap=20,
    split_respect_sentence_boundary=True,
)

@app.post("/add_document")
async def add_document(text: str):
    # Convert text to document
    document = {"content": text}
    
    # Preprocess and index the document
    docs = preprocessor.process([document])
    document_store.write_documents(docs)
    
    return {"message": "Document added successfully"}

@app.get("/get_documents")
async def get_documents():
    documents = document_store.get_all_documents()
    return {"documents": [doc.to_dict() for doc in documents]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)