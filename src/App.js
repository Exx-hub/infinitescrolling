import React, { useState, useRef, useEffect, useCallback } from "react";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const inputRef = useRef();

  const observer = useRef();
  const lastBookRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    inputRef.current.focus();
  });

  const handleInput = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <React.Fragment>
      <input ref={inputRef} type="text" value={query} onChange={handleInput} />

      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookRef} key={book}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}

      <div>{loading && <h3>Loading..</h3>}</div>
      <div>{error && "error retrieving data, please refresh."}</div>
    </React.Fragment>
  );
}

export default App;
