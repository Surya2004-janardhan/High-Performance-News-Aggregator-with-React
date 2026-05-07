import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // Anti-pattern: importing full lodash

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
        
        const stories = [];
        // Anti-pattern: sequential fetching in a loop (N+1 waterfall)
        // We only take 500 as per requirements
        for (const id of storyIds.slice(0, 500)) {
          const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const storyData = await storyResp.json();
          stories.push(storyData);
          
          // Updating state frequently to cause re-renders during loading
          // (Not strictly required but makes it even slower)
          if (stories.length % 50 === 0) {
            setArticles([...stories]);
          }
        }
        setArticles(stories);
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
    // Anti-pattern: using full lodash sortBy
    const sorted = _.sortBy(articles, 'score').reverse();
    setArticles(sorted);
  };

  // Anti-pattern: filtering in the render path without memoization
  const filteredArticles = articles.filter(article => 
    article?.title?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      {/* Anti-pattern: unoptimized hero image */}
      <img 
        src="/hero.png" 
        className="hero-image" 
        alt="Hero" 
        data-testid="hero-image"
      />
      
      <h1>HackerNews Top 500</h1>

      <div className="controls">
        <input 
          type="text" 
          placeholder="Filter by title..." 
          value={filter}
          onChange={handleFilterChange}
        />
        <button onClick={handleSort}>Sort by Score</button>
      </div>

      {loading && articles.length === 0 ? (
        <p>Loading stories one by one (very slowly)...</p>
      ) : (
        <div className="article-list" data-testid="article-list">
          {/* Anti-pattern: rendering all 500 items directly without virtualization */}
          {filteredArticles.map((article) => (
            <div key={article.id} className="article-item" data-testid="article-item">
              <h3>{article.title}</h3>
              <p>By: {article.by} | Score: {article.score}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read article</a>
              
              <div className="meta">
                {/* Anti-pattern: expensive computation in render */}
                <span>Published: {new Date(article.time * 1000).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
