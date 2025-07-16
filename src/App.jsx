import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import questions from "./questions.js";
import "./App.css";

function QuestionItem({ q }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);
  return (
    <li className="question-item">
      <h2 onClick={() => setOpen((v) => !v)} className="question-title">
        {q.question}
      </h2>
      <div
        ref={contentRef}
        className="question-content"
        style={{ maxHeight: `${height}px` }}
      >
        {q.explanation && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.explanation}</ReactMarkdown>
        )}
        {q.videos?.length > 0 && (
          <>
            <h3>Видео</h3>
            <ul>
              {q.videos.map((v, i) => (
                <li key={i}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer">
                    {v.title}
                  </a>
                  {v.time && ` (${v.time}s)`}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </li>
  );
}

function App() {
  const PAGE_SIZE = 50;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page whenever search term changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="app">
      <h1>Frontend Questions</h1>
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="questions">
        {paginated.map((q) => (
          <QuestionItem key={q.id} q={q} />
        ))}
      </ul>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
