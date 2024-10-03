from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai

# Initialize FastAPI app
app = FastAPI()

# Define Pydantic model for request body
class QueryRequest(BaseModel):
    question: str

# Load environment variables
print("Loading environment variables...")
load_dotenv()
API_KEY = os.getenv('API_KEY')
genai.configure(api_key=API_KEY)
print("Environment variables loaded.")

# Load the PDF file
print("Loading the PDF file...")
pdf_file = open('harry_potter.pdf', 'rb')
pdf_reader = PdfReader(pdf_file)
pdf_text = ""

for page in pdf_reader.pages:
    page_text = page.extract_text()
    if page_text:
        pdf_text += page_text
print("PDF file loaded and text extracted.")

# Splitting the text into chunks for embedding creation
print("Splitting the text into chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=200,  
    length_function=len,
    separators=['\n', '\n\n', ' ', '']
)

chunks = text_splitter.split_text(text=pdf_text)
print(f"Text split into {len(chunks)} chunks.")

# Initialize the embeddings model
print("Initializing the embeddings model...")
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
print("Embeddings model initialized.")

# Indexing the data using FAISS
print("Indexing the data using FAISS...")
vectorstore = FAISS.from_texts(chunks, embedding=embeddings)
print("Data indexed.")

# Creating a retriever
print("Creating a retriever...")
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
print("Retriever created.")

# Initialize Gemini Model
print("Initializing Gemini Model...")
model = genai.GenerativeModel("gemini-1.5-flash")
print("Gemini Model initialized.")

# Define a prompt for more precise answers
prompt = """
You are an intelligent and factual AI that knows everything about the Harry Potter universe.
Your primary knowledge base is the Prisoner of Azkaban book of Harry Potter. 
Answer the question as precisely as possible using the provided context. If the answer is
not contained in the context, say "No such information found."
Do not add \n in the final response.
Include certain quotes and references from the below context to make the response more fun and engaging.
The response should maintain the tone and style of the Harry Potter universe.
Stay on-topic and politely refuse to answer unrelated questions outside Harry Potter universe.
"""

# Function to format retrieved documents into a single context string
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Function to generate an answer using the Gemini model
def get_answer(context, question):
    full_prompt = prompt + f"\n\nContext: {context}\n\nQuestion: {question}"
    response = model.generate_content(full_prompt)
    return response.text

# Define the /query endpoint
@app.post("/query")
def query_rag(request: QueryRequest):
    try:
        # Retrieve relevant documents
        print("Retrieving relevant documents...")
        retrieved_docs = retriever.invoke(request.question)
        context = format_docs(retrieved_docs)
        
        # Generate the answer to the query
        print("Generating the answer to the query...")
        answer = get_answer(context, request.question)
        
        # Prepare the response
        response = {
            "question": request.question,
            "answer": answer,
            "context": context,
            "metadata": {
                "source": "harry_potter.pdf",
                "retrieved_docs_count": len(retrieved_docs)
            }
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Go to http://localhost:8000/docs to test the API. 
