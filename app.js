const API_URL = "http://localhost:8000/api";

// Initial Realistic Sample Data (used as seamless fallback if backend is offline)
const INITIAL_FOOD_ITEMS = [
  {
    id: "f-1",
    name: "Organic Whole Milk",
    category: "Dairy",
    quantity: "2 Liters",
    addedDate: "2026-11-20",
    expiryDate: "2026-11-25",
    storage: "Refrigerator",
    notes: "Opened bottle, keep chilled"
  },
  {
    id: "f-2",
    name: "Fresh Whole Wheat Bread",
    category: "Bakery",
    quantity: "1 Loaf",
    addedDate: "2026-11-19",
    expiryDate: "2026-11-24",
    storage: "Pantry",
    notes: "From local bakery"
  },
  {
    id: "f-3",
    name: "Greek Yogurt (Berry)",
    category: "Dairy",
    quantity: "4 Cups",
    addedDate: "2026-11-15",
    expiryDate: "2026-11-22",
    storage: "Refrigerator",
    notes: "Sealed packs"
  },
  {
    id: "f-4",
    name: "Ripe Bananas",
    category: "Fruits",
    quantity: "6 Units",
    addedDate: "2026-11-18",
    expiryDate: "2026-11-24",
    storage: "Counter",
    notes: "Good for smoothies or baking"
  },
  {
    id: "f-5",
    name: "Baby Spinach Leaves",
    category: "Vegetables",
    quantity: "250 Grams",
    addedDate: "2026-11-21",
    expiryDate: "2026-11-27",
    storage: "Refrigerator",
    notes: "Hydroponic farm produce"
  },
  {
    id: "f-6",
    name: "Fresh Chicken Breast",
    category: "Meat & Poultry",
    quantity: "1.2 Kg",
    addedDate: "2026-11-21",
    expiryDate: "2026-11-24",
    storage: "Freezer",
    notes: "Vacuum sealed portion"
  },
  {
    id: "f-7",
    name: "Cottage Cheese (Paneer)",
    category: "Dairy",
    quantity: "400 Grams",
    addedDate: "2026-11-12",
    expiryDate: "2026-11-19", // Expired
    storage: "Refrigerator",
    notes: "Check smell before disposal"
  },
  {
    id: "f-8",
    name: "Basmati Rice Packet",
    category: "Grains",
    quantity: "5 Kg",
    addedDate: "2026-11-01",
    expiryDate: "2027-05-15",
    storage: "Pantry",
    notes: "Airtight container stored"
  }
];

const INITIAL_DONATIONS = [
  {
    id: "don-1",
    foodName: "Fresh Bagels & Croissants",
    quantity: "15 Pieces",
    category: "Bakery",
    recipient: "City Community Kitchen",
    donatedDate: "2026-11-21",
    status: "Delivered",
    impact: "Fed 8 individuals"
  },
  {
    id: "don-2",
    foodName: "Canned Tomato Soups",
    quantity: "12 Cans",
    category: "Packaged Goods",
    recipient: "Hope Shelter NGO",
    donatedDate: "2026-11-22",
    status: "Picked Up",
    impact: "Saved 6 kg CO2"
  },
  {
    id: "don-3",
    foodName: "Fresh Gala Apples",
    quantity: "5 Kg",
    category: "Fruits",
    recipient: "Campus Youth Food Bank",
    donatedDate: "2026-11-23",
    status: "In Transit",
    impact: "Nutritious snack pack"
  }
];

const FOOD_BANKS = [
  {
    name: "Campus Youth Food Pantry",
    location: "Student Center, Room 104",
    contact: "+1 (555) 329-8472",
    accepted: "Packaged, Dry Grains, Fresh Fruits",
    badge: "On-Campus"
  },
  {
    name: "City Harvest Food Bank",
    location: "452 Metro Green Ave",
    contact: "+1 (555) 782-9011",
    accepted: "All non-expired sealed foods",
    badge: "NGO Partner"
  },
  {
    name: "Hope Community Shelter",
    location: "128 Sunrise Blvd",
    contact: "+1 (555) 441-2099",
    accepted: "Bakery, Cooked meals, Dairy (unopened)",
    badge: "Shelter"
  }
];

// Helper: Calculate days left
function getDaysRemaining(expiryDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Get status details
function getItemStatus(expiryDateStr) {
  const days = getDaysRemaining(expiryDateStr);
  if (days < 0) {
    return {
      status: "Expired",
      daysText: `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`,
      badgeClass: "bg-red-100 text-red-700 border-red-200",
      cardBorder: "border-red-300 bg-red-50/50",
      type: "expired"
    };
  } else if (days <= 3) {
    return {
      status: "Expiring Soon",
      daysText: days === 0 ? "Expires Today!" : `Expires in ${days} day${days === 1 ? '' : 's'}`,
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      cardBorder: "border-amber-300 bg-amber-50/50",
      type: "warning"
    };
  } else {
    return {
      status: "Fresh",
      daysText: `${days} days left`,
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cardBorder: "border-emerald-200 bg-emerald-50/20",
      type: "fresh"
    };
  }
}

// Main React App Component
function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = React.useState('landing');
  const [user, setUser] = React.useState({
    name: "Alex Morgan",
    email: "alex.morgan@college.edu",
    role: "Campus Household & Dining"
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('login');

  // Food Items State (persisted to LocalStorage if available)
  const [foodItems, setFoodItems] = React.useState(() => {
    try {
      const saved = localStorage.getItem("fw_food_items");
      return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
    } catch (e) {
      return INITIAL_FOOD_ITEMS;
    }
  });

  // Donations State
  const [donations, setDonations] = React.useState(() => {
    try {
      const saved = localStorage.getItem("fw_donations");
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch (e) {
      return INITIAL_DONATIONS;
    }
  });

  // Backend status indicator
  const [isBackendConnected, setIsBackendConnected] = React.useState(false);

  // Sync from backend on initial mount
  React.useEffect(() => {
    fetch(`${API_URL}/foods`)
      .then(res => {
        if (!res.ok) throw new Error("Backend not responding");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFoodItems(data);
          setIsBackendConnected(true);
        }
      })
      .catch(() => {
        setIsBackendConnected(false);
      });

    fetch(`${API_URL}/donations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDonations(data);
        }
      })
      .catch(() => {});
  }, []);

  // Quick Notification Toast
  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync with LocalStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("fw_food_items", JSON.stringify(foodItems));
    } catch (e) {}
  }, [foodItems]);

  React.useEffect(() => {
    try {
      localStorage.setItem("fw_donations", JSON.stringify(donations));
    } catch (e) {}
  }, [donations]);

  // Re-run icons on page/view changes
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [currentPage, foodItems, donations]);

  // Handler: Add Item
  const handleAddFood = async (newItem) => {
    try {
      const res = await fetch(`${API_URL}/foods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const saved = await res.json();
        setFoodItems(prev => [saved, ...prev]);
        showToast(`"${newItem.name}" saved to database!`);
        setCurrentPage('inventory');
        return;
      }
    } catch (e) {}

    // Fallback if backend is unavailable
    const itemWithId = { ...newItem, id: "f-" + Date.now() };
    setFoodItems(prev => [itemWithId, ...prev]);
    showToast(`"${newItem.name}" added to inventory successfully!`);
    setCurrentPage('inventory');
  };

  // Handler: Delete Item
  const handleDeleteFood = async (id, name) => {
    if (confirm(`Remove "${name}" from inventory?`)) {
      try {
        await fetch(`${API_URL}/foods/${id}`, { method: "DELETE" });
      } catch (e) {}
      setFoodItems(prev => prev.filter(item => item.id !== id));
      showToast(`Removed "${name}".`, "info");
    }
  };

  // Handler: Donate Item
  const handleDonateItem = async (item, recipientOrg) => {
    const payload = {
      foodName: item.name,
      quantity: item.quantity,
      category: item.category,
      recipient: recipientOrg || "Campus Youth Food Pantry",
      donatedDate: new Date().toISOString().split('T')[0],
      status: "Initiated",
      impact: "Redirected to food-insecure students"
    };

    try {
      const res = await fetch(`${API_URL}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedDonation = await res.json();
        setDonations(prev => [savedDonation, ...prev]);
        await fetch(`${API_URL}/foods/${item.id}`, { method: "DELETE" });
        setFoodItems(prev => prev.filter(f => f.id !== item.id));
        showToast(`"${item.name}" pledged for donation to ${payload.recipient}!`);
        return;
      }
    } catch (e) {}

    // Fallback
    const newDonation = { ...payload, id: "don-" + Date.now() };
    setDonations(prev => [newDonation, ...prev]);
    setFoodItems(prev => prev.filter(f => f.id !== item.id));
    showToast(`"${item.name}" pledged for donation to ${newDonation.recipient}!`);
  };

  // Calculations for KPI Cards
  const stats = React.useMemo(() => {
    let expiredCount = 0;
    let warningCount = 0;
    let freshCount = 0;

    foodItems.forEach(item => {
      const { type } = getItemStatus(item.expiryDate);
      if (type === "expired") expiredCount++;
      else if (type === "warning") warningCount++;
      else freshCount++;
    });

    return {
      total: foodItems.length,
      expiringSoon: warningCount,
      expired: expiredCount,
      fresh: freshCount,
      donated: donations.length
    };
  }, [foodItems, donations]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Global Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo */}
            <div 
              onClick={() => setCurrentPage('landing')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <i data-lucide="leaf" className="w-5 h-5"></i>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-brand-800 via-brand-600 to-emerald-600 bg-clip-text text-transparent">FoodSaver</span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-medium ml-2 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">Campus Edition</span>
                {isBackendConnected && (
                  <span className="hidden md:inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-2 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>API Connected</span>
                  </span>
                )}
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'landing', label: 'Home', icon: 'home' },
                { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
                { id: 'inventory', label: 'Inventory', icon: 'boxes' },
                { id: 'add-food', label: 'Add Food', icon: 'plus-circle' },
                { id: 'expiry-tracking', label: 'Expiry Tracker', icon: 'alert-triangle' },
                { id: 'donations', label: 'Donations', icon: 'heart-handshake' },
                { id: 'reports', label: 'Reports', icon: 'bar-chart-3' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ${
                    currentPage === item.id
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  <i data-lucide={item.icon} className="w-4 h-4"></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* User Profile / Auth Button */}
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-sm border border-brand-200">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-brand-600 font-medium">Logged In</p>
                  </div>
                  <button 
                    onClick={() => {
                      setUser(null);
                      showToast("Signed out successfully.", "info");
                    }}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <i data-lucide="log-out" className="w-4 h-4"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-brand-600/30 transition flex items-center space-x-2"
                >
                  <i data-lucide="user" className="w-4 h-4"></i>
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden border-t border-slate-200 bg-white px-2 py-2 flex overflow-x-auto space-x-1">
          {[
            { id: 'landing', label: 'Home' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'add-food', label: 'Add' },
            { id: 'expiry-tracking', label: 'Tracker' },
            { id: 'donations', label: 'Donate' },
            { id: 'reports', label: 'Reports' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                currentPage === item.id
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage 
            onGetStarted={() => setCurrentPage('dashboard')}
            onExploreInventory={() => setCurrentPage('inventory')}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage 
            stats={stats}
            foodItems={foodItems}
            donations={donations}
            onNavigate={(page) => setCurrentPage(page)}
            onDonateItem={handleDonateItem}
          />
        )}

        {currentPage === 'inventory' && (
          <InventoryPage 
            foodItems={foodItems}
            onDelete={handleDeleteFood}
            onDonate={handleDonateItem}
            onAddNew={() => setCurrentPage('add-food')}
          />
        )}

        {currentPage === 'add-food' && (
          <AddFoodPage 
            onAddFood={handleAddFood}
            onCancel={() => setCurrentPage('inventory')}
          />
        )}

        {currentPage === 'expiry-tracking' && (
          <ExpiryTrackingPage 
            foodItems={foodItems}
            onDonate={handleDonateItem}
            onDelete={handleDeleteFood}
          />
        )}

        {currentPage === 'donations' && (
          <DonationsPage 
            donations={donations}
            foodItems={foodItems}
            onDonate={handleDonateItem}
          />
        )}

        {currentPage === 'reports' && (
          <ReportsPage 
            stats={stats}
            foodItems={foodItems}
            donations={donations}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <AuthModal 
          mode={authMode} 
          setMode={setAuthMode} 
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(userData) => {
            setUser(userData);
            setIsAuthModalOpen(false);
            showToast(`Welcome back, ${userData.name}!`);
          }}
        />
      )}

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <i data-lucide="leaf" className="w-4 h-4"></i>
                </div>
                <span className="font-bold text-slate-800 text-lg">FoodSaver</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering college campuses, dining facilities, and households to eliminate food waste through smart expiry monitoring and community food sharing.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Navigation</h4>
              <ul className="text-xs space-y-2 text-slate-600">
                <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-brand-600">Overview Dashboard</button></li>
                <li><button onClick={() => setCurrentPage('inventory')} className="hover:text-brand-600">Inventory Tracker</button></li>
                <li><button onClick={() => setCurrentPage('expiry-tracking')} className="hover:text-brand-600">Color-Coded Expiry</button></li>
                <li><button onClick={() => setCurrentPage('donations')} className="hover:text-brand-600">Donation Network</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Project Specs</h4>
              <ul className="text-xs space-y-1.5 text-slate-500">
                <li>Theme: Modern Green & Clean Slate</li>
                <li>Stack: React 18, HTML5, CSS3, JS</li>
                <li>Visuals: Chart.js & Tailwind CSS</li>
                <li>Type: College Capstone Project</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Impact Goal</h4>
              <div className="bg-brand-50 p-3.5 rounded-xl border border-brand-100">
                <p className="text-xs font-medium text-brand-800 mb-1">Target: Zero Food to Landfill</p>
                <div className="w-full bg-brand-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full w-[78%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-brand-700 mt-1.5 font-semibold">78% waste reduction achieved this semester</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© 2026 Food Waste Reduction & Expiry Management System. Built for academic excellence.</p>
            <p className="mt-2 sm:mt-0 flex items-center space-x-1 text-slate-500">
              <span>Made with</span>
              <span className="text-emerald-500">🌱</span>
              <span>for a sustainable planet</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. LANDING PAGE
// ----------------------------------------------------------------------
function LandingPage({ onGetStarted, onExploreInventory }) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-16 pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <i data-lucide="sparkles" className="w-3.5 h-3.5 text-emerald-600"></i>
            <span>College Project • Food Waste Reduction & Expiry System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Track Expirations. Cut Waste. <br />
            <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
              Share Food With Your Community.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent, automated food tracking platform designed for campus hostels, dining halls, and households. Monitor expiry dates with proactive color-coded alerts and donate excess edible items to local charities seamlessly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch Dashboard</span>
              <i data-lucide="arrow-right" className="w-4 h-4"></i>
            </button>
            <button
              onClick={onExploreInventory}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <i data-lucide="package-search" className="w-4 h-4 text-slate-500"></i>
              <span>View Inventory</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: "1.3B+", label: "Tons of Food Wasted Annually", icon: "alert-octagon" },
              { val: "30-40%", label: "Supply Chain Food Lost", icon: "trending-down" },
              { val: "1-Click", label: "NGO Donation Pipeline", icon: "heart" },
              { val: "100%", label: "Zero Backend Needed (Client)", icon: "shield-check" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <p className="text-2xl lg:text-3xl font-extrabold text-brand-700">{stat.val}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Project Introduction & Motivation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600">The Problem & Our Vision</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
                Why Food Expiry Management Matters on Campus
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                In student housing, mess halls, and shared kitchens, large amounts of perishable groceries are forgotten at the back of refrigerators until they spoil. This not only burdens student budgets but also emits methane gas in landfills while food-insecure peers remain in need.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                Our <strong>Food Waste Reduction and Expiry Management System</strong> bridges the gap between proactive inventory logging, clear visual warnings before food spoils, and a community donation handoff.
              </p>
              
              <div className="space-y-3">
                {[
                  "Early warnings before food passes its prime (3-day threshold).",
                  "Simplified categorization for dairy, produce, baked goods, and pantry grains.",
                  "Direct integration with campus shelters and community youth pantries."
                ].map((feat, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <i data-lucide="check" className="w-3.5 h-3.5"></i>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustrative Card */}
            <div className="bg-gradient-to-br from-brand-50 to-emerald-50 rounded-3xl p-8 border border-brand-100 shadow-xl relative overflow-hidden">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live System Alert</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Expiring in 2 Days
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Whole Grain Loaf & Greek Yogurt</h4>
                <p className="text-xs text-slate-500 mt-1">Recommended Action: Pledged for donation or consume today.</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={onGetStarted} className="px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700">
                    Pledge to Pantry
                  </button>
                  <button onClick={onExploreInventory} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200">
                    View in Inventory
                  </button>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <i data-lucide="heart-handshake" className="w-5 h-5"></i>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Campus Youth Food Bank</h5>
                    <p className="text-xs text-slate-500">Pickups available every afternoon</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Verified Partner</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600">Core Capabilities</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
            Engineered For Seamless Food Preservation
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm mb-12">
            Every feature is crafted to make logging effortless, monitoring intuitive, and waste prevention rewarding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "layout-dashboard",
                title: "SaaS Dashboard & Analytics",
                desc: "Real-time summary counts of fresh groceries, expiring products, and recorded donations with interactive charts."
              },
              {
                icon: "traffic-cone",
                title: "Smart Color-Coded Expiry",
                desc: "Instant visual cues: Green for fresh, Amber for ≤3 days countdown warning, and Red for past-due items."
              },
              {
                icon: "plus-circle",
                title: "Fast Item Intake Form",
                desc: "Quickly record item name, quantity, category, purchase date, storage place, and expiry date with client validation."
              },
              {
                icon: "boxes",
                title: "Filterable Inventory",
                desc: "Sort and search your pantry items by category, days remaining, or location with instant live filtering."
              },
              {
                icon: "gift",
                title: "Community Donation Hub",
                desc: "Turn impending waste into shared meals. Connect directly with campus charities and food banks."
              },
              {
                icon: "line-chart",
                title: "Visual Impact Reports",
                desc: "Track kilograms saved, CO2 footprint mitigated, and category-level wastage trends through Chart.js."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition text-left group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition">
                  <i data-lucide={feature.icon} className="w-6 h-6"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-gradient-to-r from-brand-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold">Ready to test the live system?</h3>
              <p className="text-emerald-100 text-sm mt-1">Jump into the dashboard and explore the sample inventory records.</p>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 bg-white text-brand-800 font-bold rounded-xl hover:bg-emerald-50 transition shadow-md whitespace-nowrap"
            >
              Go to Dashboard
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. DASHBOARD PAGE
// ----------------------------------------------------------------------
function DashboardPage({ stats, foodItems, donations, onNavigate, onDonateItem }) {
  // Items needing attention (expired or expiring in <= 3 days)
  const urgentItems = foodItems
    .map(item => ({ ...item, statusMeta: getItemStatus(item.expiryDate) }))
    .filter(item => item.statusMeta.type === 'expired' || item.statusMeta.type === 'warning')
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Food Overview & Control Center</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor perishable inventory, trigger urgent donations, and check alerts.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('add-food')}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-sm transition"
          >
            <i data-lucide="plus" className="w-4 h-4"></i>
            <span>Add Food Item</span>
          </button>
          <button
            onClick={() => onNavigate('expiry-tracking')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-sm transition"
          >
            <i data-lucide="alert-circle" className="w-4 h-4 text-amber-500"></i>
            <span>Track Expiries</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Food Items */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Food Items</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-100 text-slate-600 group-hover:text-brand-700 flex items-center justify-center transition">
              <i data-lucide="boxes" className="w-5 h-5"></i>
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
            <span className="text-xs font-semibold text-emerald-600">{stats.fresh} Fresh</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Logged across all categories</p>
        </div>

        {/* Expiring Soon */}
        <div 
          onClick={() => onNavigate('expiry-tracking')}
          className="bg-white p-6 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Expiring Soon (≤3d)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <i data-lucide="clock" className="w-5 h-5"></i>
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600">{stats.expiringSoon}</span>
            <span className="text-xs font-semibold text-amber-700">Needs prompt action</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Eligible for expedited donation</p>
        </div>

        {/* Expired Items */}
        <div 
          onClick={() => onNavigate('expiry-tracking')}
          className="bg-white p-6 rounded-2xl border border-red-200/80 bg-red-50/20 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Expired Items</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <i data-lucide="alert-octagon" className="w-5 h-5"></i>
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-red-600">{stats.expired}</span>
            <span className="text-xs font-semibold text-red-700">Review for compost</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Past recommended use-by date</p>
        </div>

        {/* Food Donated */}
        <div 
          onClick={() => onNavigate('donations')}
          className="bg-white p-6 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Food Donated</span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <i data-lucide="heart" className="w-5 h-5"></i>
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-blue-600">{stats.donated}</span>
            <span className="text-xs font-semibold text-blue-700">Active pledges</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Given to campus food drives</p>
        </div>

      </div>

      {/* Grid: Urgent Attention List & Quick Donation Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Urgent Attention Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Priority Expiry Alerts</h2>
              <p className="text-xs text-slate-500">Items that are expired or expiring within 72 hours</p>
            </div>
            <button 
              onClick={() => onNavigate('expiry-tracking')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View Full Tracker →
            </button>
          </div>

          {urgentItems.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <i data-lucide="check-circle-2" className="w-10 h-10 text-emerald-500 mx-auto mb-2"></i>
              <p className="text-sm font-semibold text-slate-700">No urgent items!</p>
              <p className="text-xs text-slate-400 mt-1">All your groceries are well within their fresh dates.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {urgentItems.map(item => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      item.statusMeta.type === 'expired' ? 'bg-red-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600">{item.quantity}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.storage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.statusMeta.badgeClass}`}>
                      {item.statusMeta.daysText}
                    </span>
                    {item.statusMeta.type === 'warning' && (
                      <button
                        onClick={() => onDonateItem(item)}
                        className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold border border-brand-200 transition"
                      >
                        Donate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Donation Activity & Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Recent Community Shares</h3>
            <p className="text-xs text-slate-500 mb-4">Latest items redirected to shelters</p>

            <div className="space-y-3">
              {donations.slice(0, 3).map(don => (
                <div key={don.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-800">{don.foodName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {don.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{don.quantity} • To: {don.recipient}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('donations')}
              className="w-full mt-4 py-2 text-center text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-lg border border-brand-200 transition"
            >
              Open Donation Directory
            </button>
          </div>

          {/* Sustainable Habit Card */}
          <div className="bg-gradient-to-tr from-emerald-800 to-brand-700 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <i data-lucide="lightbulb" className="w-4 h-4 text-yellow-300"></i>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Daily Waste Tip</span>
            </div>
            <p className="text-xs text-emerald-50 leading-relaxed">
              "Store ripe bananas apart from other fruits. Ethylene gas speeds up ripening in adjacent apples and leafy greens!"
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// 3. INVENTORY MANAGEMENT PAGE
// ----------------------------------------------------------------------
function InventoryPage({ foodItems, onDelete, onDonate, onAddNew }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const categories = ["All", "Dairy", "Bakery", "Fruits", "Vegetables", "Meat & Poultry", "Grains", "Packaged Goods"];

  const filteredItems = foodItems.filter(item => {
    const meta = getItemStatus(item.expiryDate);
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" ||
                          (statusFilter === "Fresh" && meta.type === "fresh") ||
                          (statusFilter === "Expiring Soon" && meta.type === "warning") ||
                          (statusFilter === "Expired" && meta.type === "expired");
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Food Inventory Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Review quantities, track expiry dates, and manage items.</p>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
        >
          <i data-lucide="plus" className="w-4 h-4"></i>
          <span>Add New Food</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
          <input
            type="text"
            placeholder="Search food by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 py-2 px-3 text-sm bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Fresh">🟢 Fresh</option>
            <option value="Expiring Soon">🟡 Expiring Soon</option>
            <option value="Expired">🔴 Expired</option>
          </select>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Food Item</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Quantity</th>
                <th className="py-4 px-4">Storage</th>
                <th className="py-4 px-4">Added Date</th>
                <th className="py-4 px-4">Expiry Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <i data-lucide="package-x" className="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
                    <p className="font-medium text-slate-600">No matching food items found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the search filters or add a new record.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const meta = getItemStatus(item.expiryDate);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                      
                      {/* Name & Notes */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        {item.notes && <div className="text-[11px] text-slate-400 line-clamp-1">{item.notes}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {item.quantity}
                      </td>

                      {/* Storage */}
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {item.storage || "Pantry"}
                      </td>

                      {/* Added Date */}
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {item.addedDate}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {item.expiryDate}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${meta.badgeClass}`}>
                          {meta.status} ({meta.daysText})
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                        {meta.type !== 'expired' && (
                          <button
                            onClick={() => onDonate(item)}
                            title="Donate this item"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <i data-lucide="heart" className="w-4 h-4"></i>
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(item.id, item.name)}
                          title="Remove item"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <i data-lucide="trash-2" className="w-4 h-4"></i>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Summary Footer */}
        <div className="py-3 px-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredItems.length} of {foodItems.length} total food items</span>
          <span>Automatic date-based status computing enabled</span>
        </div>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// 4. ADD FOOD FORM
// ----------------------------------------------------------------------
function AddFoodPage({ onAddFood, onCancel }) {
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Dairy",
    quantity: "",
    addedDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    storage: "Refrigerator",
    notes: ""
  });

  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Food name is required";
    if (!formData.quantity.trim()) errs.quantity = "Quantity is required (e.g., 2 Liters, 500g)";
    if (!formData.expiryDate) errs.expiryDate = "Expiry date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAddFood(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10">
        
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <i data-lucide="plus-circle" className="w-5 h-5"></i>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Add New Food Item</h1>
              <p className="text-xs text-slate-500 mt-0.5">Register food into the system for real-time expiry monitoring.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Food Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Food Item Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Low Fat Greek Yogurt, Brown Sliced Bread"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50/50'
              } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Category & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Meat & Poultry">Meat & Poultry</option>
                <option value="Grains">Grains</option>
                <option value="Packaged Goods">Packaged Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quantity & Unit *
              </label>
              <input
                type="text"
                placeholder="e.g., 2 Liters, 6 Units, 500 Grams"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.quantity ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50/50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1 font-medium">{errors.quantity}</p>}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date Added
              </label>
              <input
                type="date"
                value={formData.addedDate}
                onChange={(e) => setFormData({ ...formData, addedDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.expiryDate ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50/50'
                } focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500`}
              />
              {errors.expiryDate && <p className="text-xs text-red-500 mt-1 font-medium">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Storage Condition */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Storage Location
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Refrigerator', 'Freezer', 'Pantry'].map(loc => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setFormData({ ...formData, storage: loc })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.storage === loc
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g., Opened pack, store in airtight container"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/30 transition flex items-center space-x-2"
            >
              <i data-lucide="check" className="w-4 h-4"></i>
              <span>Save Food Item</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. EXPIRY TRACKING PAGE (Color-Coded Status)
// ----------------------------------------------------------------------
function ExpiryTrackingPage({ foodItems, onDonate, onDelete }) {
  const [activeTab, setActiveTab] = React.useState("all");

  const categorizedItems = React.useMemo(() => {
    const expired = [];
    const warning = [];
    const fresh = [];

    foodItems.forEach(item => {
      const meta = getItemStatus(item.expiryDate);
      const enhanced = { ...item, meta };
      if (meta.type === 'expired') expired.push(enhanced);
      else if (meta.type === 'warning') warning.push(enhanced);
      else fresh.push(enhanced);
    });

    return { expired, warning, fresh };
  }, [foodItems]);

  const itemsToRender = activeTab === "all"
    ? [...categorizedItems.expired, ...categorizedItems.warning, ...categorizedItems.fresh]
    : activeTab === "expired"
    ? categorizedItems.expired
    : activeTab === "warning"
    ? categorizedItems.warning
    : categorizedItems.fresh;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Title & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Color-Coded Expiry Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Live traffic-light classification based on current date calculations.</p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 sm:space-x-4 bg-white p-2 rounded-xl border border-slate-200 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-red-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Expired ({categorizedItems.expired.length})</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>≤ 3 Days ({categorizedItems.warning.length})</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Fresh ({categorizedItems.fresh.length})</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'All Items', count: foodItems.length },
          { id: 'warning', label: 'Expiring Soon', count: categorizedItems.warning.length, color: 'text-amber-700' },
          { id: 'expired', label: 'Expired', count: categorizedItems.expired.length, color: 'text-red-600' },
          { id: 'fresh', label: 'Fresh Items', count: categorizedItems.fresh.length, color: 'text-emerald-700' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-white text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {itemsToRender.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <i data-lucide="inbox" className="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
          <h3 className="text-base font-bold text-slate-700">No items under this status</h3>
          <p className="text-xs text-slate-400 mt-1">Select another tab or add new items to the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsToRender.map(item => (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                item.meta.type === 'expired' 
                  ? 'border-red-300 bg-red-50/10' 
                  : item.meta.type === 'warning' 
                  ? 'border-amber-300 bg-amber-50/10' 
                  : 'border-emerald-200 bg-emerald-50/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${item.meta.badgeClass}`}>
                    {item.meta.daysText}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stored in:</span>
                    <span className="font-semibold">{item.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-semibold">{item.expiryDate}</span>
                  </div>
                  {item.notes && (
                    <div className="pt-2 text-[11px] text-slate-500 italic">
                      "{item.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                {item.meta.type === 'expired' ? (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-red-600 font-semibold flex items-center space-x-1">
                      <i data-lucide="alert-triangle" className="w-3.5 h-3.5"></i>
                      <span>Unsafe to donate</span>
                    </span>
                    <button
                      onClick={() => onDelete(item.id, item.name)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition"
                    >
                      Dispose / Compost
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <button
                      onClick={() => onDelete(item.id, item.name)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Mark Consumed
                    </button>
                    <button
                      onClick={() => onDonate(item)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1 shadow-sm"
                    >
                      <i data-lucide="heart" className="w-3 h-3"></i>
                      <span>Donate Item</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------------------------
// 6. FOOD DONATION PAGE
// ----------------------------------------------------------------------
function DonationsPage({ donations, foodItems, onDonate }) {
  const [selectedRecipient, setSelectedRecipient] = React.useState(FOOD_BANKS[0].name);

  // Eligible items (not expired)
  const eligibleItems = foodItems.filter(item => getItemStatus(item.expiryDate).type !== 'expired');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Food Donation Network</h1>
          <p className="text-sm text-slate-500 mt-1">Connect excess safe food with local campus shelters and NGOs.</p>
        </div>
        <div className="bg-brand-50 border border-brand-200 px-4 py-2 rounded-xl text-brand-800 text-xs font-bold flex items-center space-x-2">
          <i data-lucide="check-circle" className="w-4 h-4 text-brand-600"></i>
          <span>{donations.length} Active Pledges Fulfilled</span>
        </div>
      </div>

      {/* Grid: Partner NGOs Directory */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Partner Drop-off Locations & NGOs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FOOD_BANKS.map(bank => (
            <div key={bank.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {bank.badge}
                  </span>
                  <i data-lucide="map-pin" className="w-4 h-4 text-slate-400"></i>
                </div>
                <h3 className="text-base font-bold text-slate-900">{bank.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{bank.location}</p>
                
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-700">Accepts:</span> {bank.accepted}</p>
                  <p><span className="font-semibold text-slate-700">Contact:</span> {bank.contact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Pledge Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Pledge Food from Current Inventory</h2>
        <p className="text-xs text-slate-500 mb-6">Select an item from your pantry to transfer directly to a community kitchen.</p>

        {eligibleItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No eligible items in inventory right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.quantity} • {item.category}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">Exp: {item.expiryDate}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Eligible</span>
                  <button
                    onClick={() => onDonate(item, selectedRecipient)}
                    className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Donation Log & Impact Record</h3>
            <p className="text-xs text-slate-500">Every donation tracked transparently.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {donations.length} Completed Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Food Item</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Recipient Charity</th>
                <th className="py-3 px-4">Pledged Date</th>
                <th className="py-3 px-4">Impact Notes</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map(don => (
                <tr key={don.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{don.foodName}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{don.quantity}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">{don.recipient}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{don.donatedDate}</td>
                  <td className="py-3.5 px-4 text-xs text-emerald-700 font-semibold">{don.impact}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {don.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// 7. REPORTS & ANALYTICS PAGE (Chart.js)
// ----------------------------------------------------------------------
function ReportsPage({ stats, foodItems, donations }) {
  const chartRef1 = React.useRef(null);
  const chartRef2 = React.useRef(null);
  const chartInstance1 = React.useRef(null);
  const chartInstance2 = React.useRef(null);

  React.useEffect(() => {
    // Count items by category
    const categoryCounts = {};
    foodItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const categories = Object.keys(categoryCounts);
    const categoryValues = Object.values(categoryCounts);

    // Render Doughnut Chart: Category Breakdown
    if (chartRef1.current) {
      if (chartInstance1.current) chartInstance1.current.destroy();
      const ctx = chartRef1.current.getContext('2d');
      chartInstance1.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories.length ? categories : ['No Data'],
          datasets: [{
            data: categoryValues.length ? categoryValues : [1],
            backgroundColor: [
              '#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6', '#64748B'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // Render Bar Chart: Waste Prevention Outcome
    if (chartRef2.current) {
      if (chartInstance2.current) chartInstance2.current.destroy();
      const ctx2 = chartRef2.current.getContext('2d');
      chartInstance2.current = new window.Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Fresh Groceries', 'Expiring Soon', 'Expired / Loss', 'Donated to Pantry'],
          datasets: [{
            label: 'Total Items',
            data: [stats.fresh, stats.expiringSoon, stats.expired, stats.donated],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [foodItems, stats]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Food Waste Analytics & Impact</h1>
        <p className="text-sm text-slate-500 mt-1">Measurable carbon emissions, meal preservation, and item breakdown.</p>
      </div>

      {/* Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs uppercase font-bold text-slate-400">Meals Salvaged</p>
          <p className="text-3xl font-extrabold text-brand-600 mt-2">
            {(stats.donated * 4) + (stats.fresh * 2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Estimated meal portions saved</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs uppercase font-bold text-slate-400">Carbon Offset</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {(stats.donated * 2.5).toFixed(1)} kg
          </p>
          <p className="text-xs text-slate-500 mt-1">CO2 equivalent averted from landfills</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs uppercase font-bold text-slate-400">Efficiency Rate</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {stats.total > 0 ? Math.round(((stats.total - stats.expired) / stats.total) * 100) : 100}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Food consumed or donated prior to expiry</p>
        </div>
      </div>

      {/* Two Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Inventory by Food Category</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution of registered items in storage</p>
          <div className="relative h-64 w-full">
            <canvas ref={chartRef1}></canvas>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Status & Preservation Funnel</h3>
          <p className="text-xs text-slate-500 mb-6">Count of fresh, impending expiry, lost, and rescued goods</p>
          <div className="relative h-64 w-full">
            <canvas ref={chartRef2}></canvas>
          </div>
        </div>

      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// 8. AUTH MODAL (Login & Registration)
// ----------------------------------------------------------------------
function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [email, setEmail] = React.useState("alex.morgan@college.edu");
  const [password, setPassword] = React.useState("password123");
  const [name, setName] = React.useState("Alex Morgan");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess({
      name: mode === 'login' ? (email.split('@')[0].replace('.', ' ') || "College User") : name,
      email: email,
      role: "Student Housing Coordinator"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <i data-lucide="x" className="w-5 h-5"></i>
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 mx-auto flex items-center justify-center mb-3">
            <i data-lucide="leaf" className="w-6 h-6"></i>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' ? 'Sign in to access your pantry and donations' : 'Join the campus food waste reduction initiative'}
          </p>
        </div>

        {/* Demo credentials callout */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-6 text-center text-xs text-emerald-800">
          <span className="font-bold">Demo Mode:</span> Click "Sign In" with pre-filled test credentials.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="user@college.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-600/30 transition text-sm"
          >
            {mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>

        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="font-bold text-brand-600 hover:underline">
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="font-bold text-brand-600 hover:underline">
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// Mount the React Application
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
