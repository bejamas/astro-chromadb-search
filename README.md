## Astro ChromaDB Search 🚀

Astro ChromaDB Search is a showcase project that demonstrates the integration of ChromaDB, a vector database, with the Astro framework. The goal of this project is to create an efficient and cost-effective indexing system for embeddings, showcasing the power of combining these technologies.

### Project Overview

The project aims to perform semantic search over markdown files using the Astro framework and ChromaDB. By storing documents as vectors in a high-dimensional space, it enables semantic searches to return documents with similar meanings to the input query. This setup utilizes OpenAI embeddings and supports various embeddings from Hugging Face.

### Folder Structure

```
- src
  - components
    - search.ts
  - content
  - layout
    - main-layout.astro
  - pages
    - api/search.ts
    - posts/[...slug].astro
- index-builder.js
```

### Prerequisites

Make sure you have the following prerequisites installed:

*   Astro 🚀
*   Tailwind 🌊
*   React ⚛️
*   [ChromaDB](https://www.trychroma.com/) for vector search
*   `pip` or Docker for [installing ChromaDB](https://docs.trychroma.com/getting-started#1-install)

### Running the Application

To run the application, follow these steps:

1.  Install dependencies: Run `yarn` to install the required dependencies.
2.  Install ChromaDB: Install ChromaDB by running `pip install chromadb` or via Docker Compose from the [official ChromaDB repository](https://github.com/arenah/chromadb).
3.  Start ChromaDB: Run `yarn start:chroma` to start ChromaDB by running `chroma run --path ./chromadb` (adjust the `./chromadb` path to your desired location).
4.  Create embeddings: Run `node src/index-builder.js` to process MDX files in the `content` folder and create the necessary embeddings.
5.  Perform searches: Use the UI or the `/api/search?query={phrase}` endpoint to perform searches based on the provided query.

### UI Showcase

Placeholder for GIF images showcasing the UI (Please insert GIF images here).

### Code Quality

The project demonstrates good code quality and follows best practices. Contributions are always welcome! Feel free to fork the repository and submit pull requests with your improvements.

### Additional Resources

Here are some additional resources for learning more about Astro and ChromaDB:

*   [ChromaDB Documentation](https://docs.trychroma.com/getting-started)
*   [Astro Documentation](https://docs.astro.build/en/getting-started/)


