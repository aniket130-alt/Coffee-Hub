import React, { useState } from 'react';
import { BlogPost } from '../types';
import { X, Calendar, User } from 'lucide-react';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  return (
    <section className="blogs-section" id="blogs">
      <div className="blogs-container">
        <h2 className="section-title">
          Latest <span>Blogs</span>
        </h2>
        <p className="section-subtitle">
          Stories, brewing tutorials, origin explorations, and insider roastery news.
        </p>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <img src={blog.imageUrl} alt={blog.title} />
              <div className="blog-card-body">
                <h3>{blog.title}</h3>
                <div className="blog-meta">
                  {blog.author} / {blog.date}
                </div>
                <p>{blog.summary}</p>
                <button
                  className="blog-read-btn"
                  onClick={() => setActiveBlog(blog)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      {activeBlog && (
        <div className="modal-overlay" onClick={() => setActiveBlog(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px' }}>{activeBlog.title}</h3>
              <button
                onClick={() => setActiveBlog(null)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <img
                src={activeBlog.imageUrl}
                alt={activeBlog.title}
                style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '8px', marginBottom: '18px' }}
              />
              <div style={{ display: 'flex', gap: '15px', color: '#b2744c', fontSize: '13px', fontWeight: 600, marginBottom: '15px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={14} /> {activeBlog.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {activeBlog.date}
                </span>
              </div>
              <p style={{ lineHeight: '1.8', color: '#444', whiteSpace: 'pre-line', fontSize: '15px' }}>
                {activeBlog.content || activeBlog.summary}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="about-btn"
                style={{ padding: '8px 20px', fontSize: '14px' }}
                onClick={() => setActiveBlog(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
