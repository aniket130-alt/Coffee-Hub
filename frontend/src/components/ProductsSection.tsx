import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductsSectionProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  searchQuery,
  onAddToCart,
}) => {
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && p.isAvailable;
  });

  return (
    <section className="product-section" id="product">
      <h2 className="section-title">
        Packaged <span>Products</span>
      </h2>
      <p className="section-subtitle">
        Take the cafe experience home. Ethically sourced beans, meticulously sealed for maximum freshness.
      </p>

      <div className="product-grid">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="product-card">
            {prod.badge && <span className="product-badge">{prod.badge}</span>}
            <img src={prod.imageUrl} alt={prod.name} />
            <div className="product-body">
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <div className="menu-pricing-row">
                <div className="price-display">
                  ${prod.price}
                  {prod.originalPrice > prod.price && (
                    <s className="strike-price">${prod.originalPrice}</s>
                  )}
                </div>
                <button
                  className="add-cart-icon-btn"
                  onClick={() => onAddToCart(prod)}
                  title={`Add ${prod.name} to cart`}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          No packaged products found matching your search.
        </p>
      )}
    </section>
  );
};
