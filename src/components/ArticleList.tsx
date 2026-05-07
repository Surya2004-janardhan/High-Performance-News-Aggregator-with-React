import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { HNItem } from '../types';

interface ArticleItemProps {
  article: HNItem;
  height: number;
  transform: number;
}

// Optimized: ArticleItem component with React.memo
const ArticleItem: React.FC<ArticleItemProps> = React.memo(({ article, height, transform }) => {
  // Optimized: Single Intl.DateTimeFormat instance would be better, but let's use a memoized one or just pre-format
  const formattedDate = useMemo(() => {
    return new Date(article.time * 1000).toLocaleString();
  }, [article.time]);

  return (
    <div 
      className="article-item" 
      data-testid="article-item"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${height}px`,
        transform: `translateY(${transform}px)`,
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <h3>{article.title}</h3>
      <p>By: {article.by} | Score: {article.score}</p>
      {article.url && <a href={article.url} target="_blank" rel="noopener noreferrer">Read article</a>}
      <div className="meta">
        <span>Published: {formattedDate}</span>
      </div>
    </div>
  );
});

interface ArticleListProps {
  articles: HNItem[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Optimized: List virtualization with @tanstack/react-virtual
  const rowVirtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // Estimated height of each article item
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="article-list-container"
      data-testid="article-list"
      style={{
        height: `800px`,
        overflow: 'auto',
        position: 'relative',
        width: '100%',
        background: '#1a1a1a',
        borderRadius: '8px'
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <ArticleItem
            key={virtualItem.key}
            article={articles[virtualItem.index]!}
            height={virtualItem.size}
            transform={virtualItem.start}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
