# Hogwarts Q&A

Task for WEC Recruitment

## To make things easy
- Demo video : 

## To access app 
- 


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
