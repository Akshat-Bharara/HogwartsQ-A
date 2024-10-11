# Hogwarts Q&A

Task for WEC Recruitment

## Demo videos
- [FastAPI Demo Video](https://www.loom.com/share/e265a9ad0c7c48e5ba848b016e5f00ec?sid=915fb459-6c7a-4c54-9883-2d1e3bd63f8d)  
  This video demonstrates the backend functionalities implemented using FastAPI.

- [React App Demo Video](https://www.loom.com/share/5c85d7fa9e874a4e8be1094b1ad7d928?sid=31b38af2-8455-4531-a077-234212a9ea6f)  
  This video showcases the frontend of the application built using React.

## To access app 
1. FastAPI
- Download the folder/clone the repo.
  ```bash
    https://github.com/Akshat-Bharara/HogwartsQ-A.git
    cd HogwartsQ-A
    ```
- Install the dependencies
  ```bash
    pip install -r requirements.txt
    ```
- Run the rag_fast_api.py file. Go to `http://localhost:8000/docs` to see the working of the API.

2. React application
- Go to the react app directory
  ```bash
    cd react-app
    ```
- Install node modules
  ```bash
    npm install
    ```
- Run the app
  ```bash
    npm start
    ```
- The React app will be running at `http://localhost:3000`
  
## Technologies Used
- FastAPI
- Python
- React

## List of Implemented Features

### Data Collection and ingestion
- Text Parsing: The full text of Harry Potter and the Prisoner of Azkaban is parsed and stored in a machine-readable format are preserved.

- Chunking: The text is broken down into smaller chunks of about 100-150 words for effective retrieval. Each chunk contains self-contained information, allowing for accurate responses.

### Embedding generation
- Pre-trained Embedding Model: The all-MiniLM-L6-v2 model from Sentence Transformers is used to generate dense vector representations of each text chunk. These embeddings capture the semantic meaning of the text for better retrieval.

### Vector Database integration
- Efficient Retrieval: The embeddings are stored in a vector database like ChromaDB, FAISS, or Milvus for fast similarity searches. This enables quick lookups of contextually relevant text during query handling.

### Query Handling & Retrieval
- Embedding-based Search: User queries are processed using the embedding model. The query is converted into an embedding and matched against the database to retrieve the top N most relevant text chunks.
(in this case I have taken n=3)

### Contextual Response Generation
- Language Model Integration: Gemini model is used to combine the retrieved chunks into a coherent response. The response includes relevant quotes and maintains the tone and style of the Harry Potter universe.
- Quote Inclusion: Responses include references to specific parts of the book, ensuring that users can trace answers back to the source material.

### FastAPI Backend
- /query Endpoint: The system is accessible via the /query endpoint, which accepts POST requests with a JSON body containing the user's question. The response includes the answer, relevant quotes, and additional metadata.
- API Integration: The FastAPI backend efficiently manages user queries, processes embeddings, and returns responses in JSON format.

### User Interface
- Chat-like Interface: A simple, user-friendly web application allows users to ask questions and receive answers in a chat-like interface. The front-end communicates with the FastAPI backend to display answers.
- Time-Turner: The "Time-Turner" feature allows users to view their conversation history and revisit previous points in the chat. The previous conversations are stored locally for a seamless experience.

## References:
- FastAPI Docs: https://fastapi.tiangolo.com/
- LangChain Documentation: https://python.langchain.com/en/latest/
- Sentence Transformers: https://huggingface.co/sentence-transformers
- FAISS GitHub: https://github.com/facebookresearch/faiss
