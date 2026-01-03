/**
 * Complete React example with Dashgram SDK
 */

import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import {
  DashgramProvider,
  useDashgram,
  useScreenTracking,
  useTrackMount,
  useTrackClick,
  useTrackSubmit
} from "@dashgram/react"

// ============================================================================
// Configuration
// ============================================================================

const DASHGRAM_CONFIG = {
  projectId: "your-project-id",
  trackLevel: 2 as const,
  debug: process.env.NODE_ENV === "development"
}

// ============================================================================
// App Component (with screen tracking)
// ============================================================================

function App() {
  useScreenTracking() // Automatically track page views

  return (
    <div className="app">
      <Navigation />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </div>
  )
}

// ============================================================================
// Navigation Component
// ============================================================================

function Navigation() {
  const { track } = useDashgram()

  const handleNavClick = (page: string) => {
    track("navigation_clicked", { destination: page })
  }

  return (
    <nav>
      <Link to="/" onClick={() => handleNavClick("home")}>
        Home
      </Link>
      <Link to="/products" onClick={() => handleNavClick("products")}>
        Products
      </Link>
      <Link to="/profile" onClick={() => handleNavClick("profile")}>
        Profile
      </Link>
    </nav>
  )
}

// ============================================================================
// Home Page
// ============================================================================

function HomePage() {
  useTrackMount("home_page_viewed") // Track when page mounts

  const handleHeroClick = useTrackClick("hero_cta_clicked", {
    location: "home_hero",
    button_text: "Get Started"
  })

  return (
    <div className="home-page">
      <h1>Welcome to Dashgram Demo</h1>
      <p>Analytics SDK for Telegram Mini Apps</p>

      <button onClick={handleHeroClick}>Get Started</button>

      <div data-track-visible="home-features">
        <h2>Features</h2>
        <ul>
          <li>Auto-tracking with 3 levels</li>
          <li>Manual event tracking</li>
          <li>User identification</li>
          <li>Session management</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Products Page
// ============================================================================

function ProductsPage() {
  const { track } = useDashgram()
  const [products] = useState([
    { id: 1, name: "Product A", price: 29.99 },
    { id: 2, name: "Product B", price: 49.99 },
    { id: 3, name: "Product C", price: 99.99 }
  ])

  useTrackMount("products_page_viewed", {
    product_count: products.length
  })

  const handleProductClick = (product: (typeof products)[0]) => {
    track("product_clicked", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price
    })
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    track("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      currency: "USD"
    })

    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button
              onClick={e => {
                e.stopPropagation()
                handleAddToCart(product)
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Profile Page
// ============================================================================

function ProfilePage() {
  const { track } = useDashgram()
  const [user, setUser] = useState({
    id: "user-123",
    email: "demo@example.com",
    name: "Demo User",
    plan: "free"
  })

  useTrackMount("profile_page_viewed", {
    user_plan: user.plan
  })

  const handleUpgrade = () => {
    track("upgrade_clicked", {
      current_plan: user.plan,
      target_plan: "premium"
    })

    setUser({ ...user, plan: "premium" })
    alert("Upgraded to Premium!")
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="user-info">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Plan:</strong> {user.plan}
        </p>
      </div>

      {user.plan === "free" && <button onClick={handleUpgrade}>Upgrade to Premium</button>}
    </div>
  )
}

// ============================================================================
// Checkout Page (with form tracking)
// ============================================================================

function CheckoutPage() {
  const { track } = useDashgram()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    card: ""
  })

  useTrackMount("checkout_page_viewed")

  const handleSubmit = useTrackSubmit("checkout_form_submitted", {
    payment_method: "card"
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)

    // Track successful purchase
    track("purchase_completed", {
      amount: 99.99,
      currency: "USD",
      payment_method: "card",
      items: [
        { id: 1, name: "Product A", price: 29.99 },
        { id: 2, name: "Product B", price: 49.99 }
      ]
    })

    alert("Purchase completed!")
    navigate("/")
  }

  const handleInputFocus = (field: string) => {
    track("checkout_field_focused", { field })
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => handleInputFocus("name")}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => handleInputFocus("email")}
            required
          />
        </div>

        <div>
          <label>Card Number</label>
          <input
            type="text"
            value={formData.card}
            onChange={e => setFormData({ ...formData, card: e.target.value })}
            onFocus={() => handleInputFocus("card")}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <button type="submit">Complete Purchase ($99.99)</button>
      </form>
    </div>
  )
}

// ============================================================================
// Root Component
// ============================================================================

export default function Root() {
  return (
    <BrowserRouter>
      <DashgramProvider {...DASHGRAM_CONFIG}>
        <App />
      </DashgramProvider>
    </BrowserRouter>
  )
}

// ============================================================================
// Styles (you would normally put this in a CSS file)
// ============================================================================

const styles = `
  .app {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  nav {
    background: #f5f5f5;
    padding: 15px;
    margin-bottom: 30px;
    border-radius: 8px;
  }

  nav a {
    margin-right: 20px;
    color: #0088cc;
    text-decoration: none;
  }

  button {
    padding: 12px 24px;
    background: #0088cc;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background: #006699;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .product-card {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: box-shadow 0.2s;
  }

  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  form div {
    margin-bottom: 15px;
  }

  form label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  form input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  .user-info {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
`
