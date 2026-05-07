import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import sortBy from 'lodash/sortBy'; // Optimized: cherry-picked import

// Optimized: Code splitting - Lazy load the heavy list component
const ArticleList = lazy(() => import('./components/ArticleList'));

const App = () => {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        
        // Optimized: Parallelized data fetching with Promise.all
        const limitedIds = storyIds.slice(0, 500);
        const storyPromises = limitedIds.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        const stories = await Promise.all(storyPromises);
        setArticles(stories.filter(s => s !== null));
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStories();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSort = () => {
    // Optimized: using cherry-picked sortBy
    const sorted = sortBy(articles, 'score').reverse();
    setArticles(sorted);
  };

  // Optimized: Memoized filtering
  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      article?.title?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [articles, filter]);

  return (
    <div className="container">
      {/* Optimized: Modern image attributes */}
      <img 
        src="/hero.webp" 
        className="hero-image" 
        alt="Hero" 
        data-testid="hero-image"
        width="1200"
        height="400"
        srcSet="/hero-small.webp 600w, /hero.webp 1200w"
        sizes="(max-width: 600px) 600px, 1200px"
      />
      
      <h1>HackerNews Top 500 (Optimized)</h1>

      <div className="controls">
        <input 
          type="text" 
          placeholder="Filter by title..." 
          value={filter}
          onChange={handleFilterChange}
        />
        <button onClick={handleSort}>Sort by Score</button>
      </div>

      {loading ? (
        <p>Loading 500 stories in parallel...</p>
      ) : (
        <Suspense fallback={<p>Loading list component...</p>}>
          <ArticleList articles={filteredArticles} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
