import { useEffect, useState } from "react";

interface PostItem {
  title: string;
  slug: string;
  author: string;
  date: string;
}

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostItem[]>([]);

  const fetchData = async () => {
    const res = await fetch(`/api/search?query=${query}`);
    const data = await res.json();

    if (data) {
      setResults(data);
    }
  };

  useEffect(() => {
    if (query?.length > 3) {
      fetchData();
    }
  }, [query]);

  return (
    <form className="mx-auto gap-2 mb-10">
      <div className="relative form-control w-full md:prose mx-auto">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        {results.length > 0 && (
          <div className="max-h-[400px] overflow-auto absolute left-0 top-[50px] rounded-md w-full py-3 bg-base-300">
            {results.map((item) => (
              <a
                href={`/posts/${item.slug}`}
                className="flex flex-col p-3 text-primary rounded-lg hover:text-secondary !no-underline transition duration-300 ease-in-out"
              >
                <div className="text-xl font-semibold mb-2">{item.title}</div>
                <div className="text-sm">Author: {item.author}</div>
                <div className="text-sm">Date: {item.date}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
