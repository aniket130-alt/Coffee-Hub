import React, { useState, useMemo } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuSectionProps {
  items: MenuItem[];
  searchQuery: string;
  onAddToCart: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  searchQuery,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch && item.isAvailable;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section className="menu-section" id="menu">
      <div className="menu-container">
        <h2 className="section-title">
          Our <span>Menu</span>
        </h2>
        <p className="section-subtitle">
          Freshly ground beans extracted by seasoned baristas. Enjoy in our lounge or take on the go.
        </p>

        {/* Filter categories */}
        {categories.length > 1 && (
          <div className="menu-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card">
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="menu-card-img"
              />
              <div className="menu-card-body">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < item.rating ? '#b2744c' : 'none'}
                      color="#b2744c"
                    />
                  ))}
                </div>
                <h3>{item.name}</h3>
                <p className="item-desc">{item.description}</p>
                <div className="menu-pricing-row">
                  <div className="price-display">
                    ${item.price}
                    {item.originalPrice > item.price && (
                      <s className="strike-price">${item.originalPrice}</s>
                    )}
                  </div>
                  <button
                    className="add-cart-icon-btn"
                    onClick={() => onAddToCart(item)}
                    title={`Add ${item.name} to cart`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
            No coffee items matched your search criteria.
          </p>
        )}
      </div>
    </section>
  );
};
