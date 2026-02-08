import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResourcesPage.module.css';
import AuthNavbar from '../Components/Navbar/AuthNavbar';
import { Search, X, Info } from 'lucide-react';

function ResourcesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState(null);

  const intentTemplates = [
    {
      "id": "ecommerce_conversion",
      "category": "E-commerce",
      "title": "E-commerce Conversion Focus",
      "emoji": "🛒",
      "intent": "This is an e-commerce store focused on maximizing product purchases. The primary goal is to drive conversions and increase checkout completion rates. The design should feel trustworthy, modern, and optimized for quick purchasing decisions. Target audience is online shoppers aged 25-45 looking for convenience and value.",
      "tags": ["conversion", "sales", "retail"]
    },
    {
      "id": "saas_lead_gen",
      "category": "B2B SaaS",
      "title": "SaaS Demo Signups",
      "emoji": "💼",
      "intent": "Professional SaaS landing page targeting B2B decision-makers. Primary goal is to generate demo requests and free trial signups. Design should communicate credibility, innovation, and enterprise-readiness. Target audience is CTOs, product managers, and team leads at mid-to-large companies seeking productivity tools.",
      "tags": ["b2b", "lead-gen", "enterprise"]
    },
    {
      "id": "portfolio_creative",
      "category": "Portfolio",
      "title": "Creative Portfolio Showcase",
      "emoji": "🎨",
      "intent": "Personal portfolio website for a creative professional (designer/developer/artist). Goal is to showcase work quality and attract client inquiries or job opportunities. Design should feel unique, visually impressive, and reflect personal brand. Target audience is potential clients, recruiters, and industry peers.",
      "tags": ["portfolio", "creative", "freelance"]
    },
    {
      "id": "corporate_trust",
      "category": "Corporate",
      "title": "Corporate Trust & Authority",
      "emoji": "🏢",
      "intent": "Corporate website for an established company in finance/legal/consulting. Goal is to build trust and generate consultation requests from high-value clients. Design should be professional, authoritative, and credible with minimal risk-taking. Target audience is corporate executives and decision-makers seeking reliable partners.",
      "tags": ["corporate", "b2b", "professional"]
    },
    {
      "id": "blog_engagement",
      "category": "Content/Media",
      "title": "Blog Reader Engagement",
      "emoji": "📰",
      "intent": "Content-focused blog or media site. Primary goal is to maximize article readability, time on page, and newsletter subscriptions. Design should minimize distractions, prioritize content, and encourage social sharing. Target audience is readers interested in in-depth articles and regular content consumption.",
      "tags": ["content", "media", "engagement"]
    },
    {
      "id": "nonprofit_donations",
      "category": "Nonprofit",
      "title": "Nonprofit Donation Drive",
      "emoji": "❤️",
      "intent": "Nonprofit organization website focused on raising awareness and driving donations. Goal is to inspire emotional connection and make donating easy and transparent. Design should be heartfelt, mission-driven, and include clear impact messaging. Target audience is socially-conscious individuals and corporate sponsors.",
      "tags": ["nonprofit", "donations", "social-impact"]
    },
    {
      "id": "restaurant_reservations",
      "category": "Hospitality",
      "title": "Restaurant Reservations",
      "emoji": "🍽️",
      "intent": "Restaurant website aimed at driving table reservations and online orders. Goal is to showcase atmosphere, menu appeal, and make booking frictionless. Design should be appetizing, inviting, and mobile-optimized for on-the-go diners. Target audience is local food enthusiasts and special occasion diners.",
      "tags": ["hospitality", "local-business", "reservations"]
    },
    {
      "id": "education_enrollment",
      "category": "Education",
      "title": "Course Enrollment Platform",
      "emoji": "🎓",
      "intent": "Online education platform or bootcamp focused on course enrollments and student signups. Goal is to communicate value proposition, showcase success stories, and simplify the enrollment process. Design should be approachable, motivating, and results-oriented. Target audience is career-changers and skill-seekers aged 22-40.",
      "tags": ["education", "courses", "enrollment"]
    },
    {
      "id": "app_downloads",
      "category": "Mobile App",
      "title": "Mobile App Downloads",
      "emoji": "📱",
      "intent": "Landing page for a mobile application focused on driving app downloads. Goal is to clearly explain app benefits, show screenshots/demos, and provide easy download links for iOS/Android. Design should be modern, feature-focused, and visually demonstrate the app experience. Target audience is mobile-first users seeking specific functionality.",
      "tags": ["mobile", "app", "downloads"]
    },
    {
      "id": "real_estate_leads",
      "category": "Real Estate",
      "title": "Real Estate Lead Generation",
      "emoji": "🏠",
      "intent": "Real estate agency or agent website focused on generating property inquiry leads. Goal is to showcase listings, build agent credibility, and capture contact information from interested buyers/renters. Design should feel premium, trustworthy, and include strong visual property displays. Target audience is homebuyers, renters, and property investors.",
      "tags": ["real-estate", "lead-gen", "local-business"]
    }
  ];

  const handleUseIntent = (intent) => {
    navigate('/agent', { state: { prefilledIntent: intent } });
  };

  const handleOpenModal = (template) => {
    setSelectedIntent(template);
  };

  const handleCloseModal = () => {
    setSelectedIntent(null);
  };

  const filteredTemplates = intentTemplates.filter((template) => {
    const query = searchQuery.toLowerCase();
    return (
      template.title.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.intent.toLowerCase().includes(query) ||
      template.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className={styles.container}>
      <AuthNavbar />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Audit Resources</h1>
          <p className={styles.subtitle}>
            Pre-configured audit intents for common website analysis scenarios
          </p>
          
          <div className={styles.infoBanner}>
            <Info size={18} className={styles.infoIcon} />
            <span className={styles.infoText}>
              Custom intent upload feature coming soon! For now, choose from our curated templates.
            </span>
          </div>

          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by category, title, or tags..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.resourcesGrid}>
          {filteredTemplates.map((template) => {
            return (
              <div key={template.id} className={styles.resourceCard}>
                <div className={styles.resourceHeader}>
                  <div className={styles.resourceIcon}>
                    {template.emoji}
                  </div>
                  <div className={styles.resourceHeaderText}>
                    <div className={styles.resourceCategory}>{template.category}</div>
                    <h3 className={styles.resourceTitle}>{template.title}</h3>
                  </div>
                </div>
                
                <div className={styles.resourceIntent}>
                  <div className={styles.intentLabel}>Intent Preview:</div>
                  <p className={styles.intentText}>{template.intent}</p>
                </div>

                <div className={styles.resourceTags}>
                  {template.tags.map((tag, index) => (
                    <span key={index} className={styles.resourceTag}>{tag}</span>
                  ))}
                </div>

                <button 
                  className={styles.openBtn}
                  onClick={() => handleOpenModal(template)}
                >
                  Open
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedIntent && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <X size={20} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalEmoji}>{selectedIntent.emoji}</div>
              <div>
                <div className={styles.modalCategory}>{selectedIntent.category}</div>
                <h2 className={styles.modalTitle}>{selectedIntent.title}</h2>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Full Intent Description</h3>
                <p className={styles.modalIntent}>{selectedIntent.intent}</p>
              </div>

              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Tags</h3>
                <div className={styles.modalTags}>
                  {selectedIntent.tags.map((tag, index) => (
                    <span key={index} className={styles.modalTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.modalUseBtn}
                onClick={() => handleUseIntent(selectedIntent.intent)}
              >
                Use This Intent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesPage;
