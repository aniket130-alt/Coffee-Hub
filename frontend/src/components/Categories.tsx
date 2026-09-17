import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onSelectCategory?: (title: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ categories, onSelectCategory }) => {
  return (
    <section className="categories-section" id="categories">
      <h2 className="section-title">
        Top <span>Categories</span>
      </h2>
      <p className="section-subtitle">
        Explore our hand-crafted collection of premium roast styles, cold extractions, and artisanal accompaniments.
      </p>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => {
              if (onSelectCategory) {
                onSelectCategory(cat.title);
              }
              const el = document.getElementById('menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <img src={cat.imageUrl} alt={cat.title} />
            <div className="category-overlay">
              <h3>{cat.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
