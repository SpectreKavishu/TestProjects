// API Revenue & Cost Calculator JavaScript

// Application data
const apiData = {
  complexity_levels: [
    {
      name: "Simple API",
      cost_range: [5000, 20000],
      development_time: "2-4 months",
      examples: "Basic CRUD operations, simple data retrieval",
      maintenance_cost_percentage: 15
    },
    {
      name: "Moderate API", 
      cost_range: [15000, 50000],
      development_time: "4-8 months",
      examples: "User authentication, payment processing, multi-platform integration",
      maintenance_cost_percentage: 20
    },
    {
      name: "Complex API",
      cost_range: [50000, 150000], 
      development_time: "8-18 months",
      examples: "Enterprise-grade security, real-time processing, advanced analytics",
      maintenance_cost_percentage: 25
    }
  ],
  monetization_models: [
    {
      name: "Pay-per-use",
      description: "Charge based on API calls or data consumption",
      typical_pricing: "$0.001 - $0.10 per call",
      revenue_predictability: "Variable",
      best_for: "APIs with fluctuating usage"
    },
    {
      name: "Subscription",
      description: "Fixed monthly/annual fee with usage limits", 
      typical_pricing: "$29 - $999+ per month",
      revenue_predictability: "High",
      best_for: "B2B customers, predictable usage"
    },
    {
      name: "Freemium",
      description: "Free basic tier, paid premium features",
      typical_pricing: "Free + $19-$299/month for premium",
      revenue_predictability: "Medium", 
      best_for: "Developer adoption, viral growth"
    },
    {
      name: "Revenue Sharing",
      description: "Percentage of transactions processed",
      typical_pricing: "2-10% of transaction value",
      revenue_predictability: "Variable",
      best_for: "Payment/marketplace APIs"
    }
  ],
  market_categories: [
    {
      name: "AI/ML APIs",
      demand: "Very High",
      competition: "High", 
      avg_pricing: "$0.01-$0.20 per request",
      examples: "Text processing, image recognition, chatbots"
    },
    {
      name: "Payment APIs",
      demand: "High",
      competition: "Medium",
      avg_pricing: "2.9% + $0.30 per transaction",
      examples: "Payment processing, wallet integration"
    },
    {
      name: "Data APIs",
      demand: "High", 
      competition: "Medium",
      avg_pricing: "$0.001-$0.05 per call",
      examples: "Weather, financial data, social media"
    },
    {
      name: "Communication APIs",
      demand: "Medium",
      competition: "Medium",
      avg_pricing: "$0.01-$0.05 per message/call",
      examples: "SMS, email, voice calls"
    }
  ],
  success_factors: [
    "Clear and comprehensive documentation",
    "Easy integration with popular programming languages", 
    "Reliable uptime and performance",
    "Responsive developer support",
    "Competitive and transparent pricing",
    "Strong security and compliance",
    "Active developer community",
    "Regular feature updates and improvements"
  ]
};

// Global state
let currentCalculations = {
  developmentCost: 12500,
  maintenanceCost: 1875,
  operationalCost: 700,
  monthlyRevenue: 1000,
  annualRevenue: 12000
};

let costChart = null;
let profitChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing application...');
  
  // Set default active tab
  setDefaultActiveTab();
  
  // Initialize components
  initializeTabs();
  initializeFormElements();
  populateMarketInsights();
  
  // Wait a bit for DOM to be fully ready, then update calculations and create charts
  setTimeout(() => {
    updateAllCalculations();
    createCharts();
  }, 100);
});

// Set default active tab
function setDefaultActiveTab() {
  // Remove active from all tabs and contents
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Set Cost Estimation as default active
  const defaultTabBtn = document.querySelector('[data-tab="cost-estimation"]');
  const defaultTabContent = document.getElementById('cost-estimation');
  
  if (defaultTabBtn && defaultTabContent) {
    defaultTabBtn.classList.add('active');
    defaultTabContent.classList.add('active');
  }
}

// Tab Navigation
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetTab = this.getAttribute('data-tab');
      
      console.log('Switching to tab:', targetTab);
      
      // Remove active class from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// Initialize Form Elements
function initializeFormElements() {
  // API Complexity selector
  const complexitySelect = document.getElementById('api-complexity');
  if (complexitySelect) {
    complexitySelect.addEventListener('change', function() {
      console.log('Complexity changed to:', this.value);
      updateCostCalculations();
    });
  }

  // Custom development cost input
  const customDevCost = document.getElementById('custom-dev-cost');
  if (customDevCost) {
    customDevCost.addEventListener('input', updateCostCalculations);
  }

  // Hosting and marketing costs
  const hostingCost = document.getElementById('hosting-cost');
  const marketingCost = document.getElementById('marketing-cost');
  if (hostingCost) hostingCost.addEventListener('input', updateCostCalculations);
  if (marketingCost) marketingCost.addEventListener('input', updateCostCalculations);

  // Monetization model selector
  const monetizationModel = document.getElementById('monetization-model');
  if (monetizationModel) {
    monetizationModel.addEventListener('change', function() {
      console.log('Monetization model changed to:', this.value);
      updatePricingInputs();
    });
  }

  // Revenue inputs
  const pricePerCall = document.getElementById('price-per-call');
  const subscriptionPrice = document.getElementById('subscription-price');
  const revenueShare = document.getElementById('revenue-share');
  const expectedUsers = document.getElementById('expected-users');
  const callsPerUser = document.getElementById('calls-per-user');

  [pricePerCall, subscriptionPrice, revenueShare, expectedUsers, callsPerUser].forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        console.log('Revenue input changed:', this.id, this.value);
        updateRevenueCalculations();
      });
    }
  });

  // Market penetration slider
  const marketPenetration = document.getElementById('market-penetration');
  if (marketPenetration) {
    marketPenetration.addEventListener('input', function() {
      const valueDisplay = document.getElementById('penetration-value');
      if (valueDisplay) {
        valueDisplay.textContent = this.value + '%';
      }
      updateRevenueCalculations();
    });
    
    // Initialize market penetration display
    const valueDisplay = document.getElementById('penetration-value');
    if (valueDisplay) {
      valueDisplay.textContent = marketPenetration.value + '%';
    }
  }
}

// Update pricing inputs based on monetization model
function updatePricingInputs() {
  const modelSelect = document.getElementById('monetization-model');
  if (!modelSelect) return;
  
  const model = modelSelect.value;
  const pricePerCallGroup = document.getElementById('price-per-call-group');
  const subscriptionPriceGroup = document.getElementById('subscription-price-group');
  const revenueShareGroup = document.getElementById('revenue-share-group');

  // Hide all pricing inputs
  if (pricePerCallGroup) pricePerCallGroup.classList.add('hidden');
  if (subscriptionPriceGroup) subscriptionPriceGroup.classList.add('hidden');
  if (revenueShareGroup) revenueShareGroup.classList.add('hidden');

  // Show relevant pricing input
  switch(model) {
    case 'pay-per-use':
    case 'freemium':
      if (pricePerCallGroup) pricePerCallGroup.classList.remove('hidden');
      break;
    case 'subscription':
      if (subscriptionPriceGroup) subscriptionPriceGroup.classList.remove('hidden');
      break;
    case 'revenue-sharing':
      if (revenueShareGroup) revenueShareGroup.classList.remove('hidden');
      break;
  }

  updateRevenueCalculations();
}

// Update cost calculations
function updateCostCalculations() {
  const complexitySelect = document.getElementById('api-complexity');
  const customCostInput = document.getElementById('custom-dev-cost');
  const hostingCostInput = document.getElementById('hosting-cost');
  const marketingCostInput = document.getElementById('marketing-cost');
  
  if (!complexitySelect) return;
  
  const complexity = complexitySelect.value;
  const customCost = parseFloat(customCostInput?.value) || 0;
  const hostingCost = parseFloat(hostingCostInput?.value) || 0;
  const marketingCost = parseFloat(marketingCostInput?.value) || 0;

  let complexityData;
  switch(complexity) {
    case 'simple':
      complexityData = apiData.complexity_levels[0];
      break;
    case 'moderate':
      complexityData = apiData.complexity_levels[1];
      break;
    case 'complex':
      complexityData = apiData.complexity_levels[2];
      break;
    default:
      complexityData = apiData.complexity_levels[0];
  }

  // Calculate development cost
  const developmentCost = customCost > 0 ? customCost : 
    (complexityData.cost_range[0] + complexityData.cost_range[1]) / 2;

  // Calculate maintenance cost (annual)
  const maintenanceCost = developmentCost * (complexityData.maintenance_cost_percentage / 100);

  // Calculate operational cost (monthly)
  const operationalCost = hostingCost + marketingCost;

  // Update global state
  currentCalculations.developmentCost = developmentCost;
  currentCalculations.maintenanceCost = maintenanceCost;
  currentCalculations.operationalCost = operationalCost;

  // Update display
  const devCostDisplay = document.getElementById('dev-cost-display');
  const maintenanceCostDisplay = document.getElementById('maintenance-cost-display');
  const operationalCostDisplay = document.getElementById('operational-cost-display');
  
  if (devCostDisplay) {
    if (customCost > 0) {
      devCostDisplay.textContent = `$${developmentCost.toLocaleString()}`;
    } else {
      devCostDisplay.textContent = 
        `$${complexityData.cost_range[0].toLocaleString()} - $${complexityData.cost_range[1].toLocaleString()}`;
    }
  }
  
  if (maintenanceCostDisplay) {
    maintenanceCostDisplay.textContent = `$${maintenanceCost.toLocaleString()}`;
  }
  
  if (operationalCostDisplay) {
    operationalCostDisplay.textContent = `$${operationalCost.toLocaleString()}`;
  }

  updateProfitCalculations();
  updateCostChart();
}

// Update revenue calculations
function updateRevenueCalculations() {
  const modelSelect = document.getElementById('monetization-model');
  const expectedUsersInput = document.getElementById('expected-users');
  const callsPerUserInput = document.getElementById('calls-per-user');
  const marketPenetrationInput = document.getElementById('market-penetration');
  
  if (!modelSelect || !expectedUsersInput || !callsPerUserInput || !marketPenetrationInput) {
    return;
  }
  
  const model = modelSelect.value;
  const expectedUsers = parseFloat(expectedUsersInput.value) || 0;
  const callsPerUser = parseFloat(callsPerUserInput.value) || 0;
  const penetrationRate = parseFloat(marketPenetrationInput.value) / 100;

  const effectiveUsers = expectedUsers * penetrationRate;
  let monthlyRevenue = 0;

  switch(model) {
    case 'pay-per-use':
    case 'freemium':
      const pricePerCallInput = document.getElementById('price-per-call');
      const pricePerCall = parseFloat(pricePerCallInput?.value) || 0;
      monthlyRevenue = effectiveUsers * callsPerUser * pricePerCall;
      break;
    case 'subscription':
      const subscriptionPriceInput = document.getElementById('subscription-price');
      const subscriptionPrice = parseFloat(subscriptionPriceInput?.value) || 0;
      monthlyRevenue = effectiveUsers * subscriptionPrice;
      break;
    case 'revenue-sharing':
      const revenueShareInput = document.getElementById('revenue-share');
      const revenueShare = parseFloat(revenueShareInput?.value) / 100 || 0;
      // Assume average transaction value of $100 for revenue sharing
      const avgTransactionValue = 100;
      monthlyRevenue = effectiveUsers * callsPerUser * avgTransactionValue * revenueShare;
      break;
  }

  const annualRevenue = monthlyRevenue * 12;

  // Update global state
  currentCalculations.monthlyRevenue = monthlyRevenue;
  currentCalculations.annualRevenue = annualRevenue;

  // Update display
  const monthlyRevenueDisplay = document.getElementById('monthly-revenue-display');
  const annualRevenueDisplay = document.getElementById('annual-revenue-display');
  
  if (monthlyRevenueDisplay) {
    monthlyRevenueDisplay.textContent = `$${monthlyRevenue.toLocaleString()}`;
  }
  
  if (annualRevenueDisplay) {
    annualRevenueDisplay.textContent = `$${annualRevenue.toLocaleString()}`;
  }

  updateProfitCalculations();
}

// Update profit calculations
function updateProfitCalculations() {
  const monthlyRevenue = currentCalculations.monthlyRevenue;
  const monthlyOperational = currentCalculations.operationalCost;
  const monthlyMaintenance = currentCalculations.maintenanceCost / 12;
  const totalMonthlyCosts = monthlyOperational + monthlyMaintenance;
  
  const monthlyProfit = monthlyRevenue - totalMonthlyCosts;
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;
  
  const developmentCost = currentCalculations.developmentCost;
  const annualProfit = monthlyProfit * 12;
  const roi = developmentCost > 0 ? (annualProfit / developmentCost) * 100 : 0;
  
  const breakEvenMonths = monthlyProfit > 0 ? developmentCost / monthlyProfit : Infinity;
  const profitabilityMonths = breakEvenMonths !== Infinity ? breakEvenMonths + 1 : Infinity;

  // Update display elements
  const monthlyProfitEl = document.getElementById('monthly-profit');
  const profitMarginEl = document.getElementById('profit-margin');
  const annualRoiEl = document.getElementById('annual-roi');
  const roiDescEl = document.getElementById('roi-description');
  const breakEvenTimeEl = document.getElementById('breakeven-time');
  const breakEvenDescEl = document.getElementById('breakeven-description');
  const profitabilityTimeEl = document.getElementById('profitability-time');
  
  if (monthlyProfitEl) {
    monthlyProfitEl.textContent = `$${monthlyProfit.toLocaleString()}`;
  }
  
  if (profitMarginEl) {
    profitMarginEl.textContent = `${profitMargin.toFixed(1)}% margin`;
    profitMarginEl.className = `metric-change ${profitMargin > 0 ? 'positive' : 'negative'}`;
  }

  if (annualRoiEl) {
    annualRoiEl.textContent = `${roi.toFixed(0)}%`;
  }
  
  if (roiDescEl) {
    roiDescEl.textContent = 
      roi > 100 ? 'Excellent return' : roi > 50 ? 'Good return' : roi > 0 ? 'Moderate return' : 'Needs optimization';
  }

  if (breakEvenTimeEl) {
    breakEvenTimeEl.textContent = 
      breakEvenMonths === Infinity ? 'Never' : `${breakEvenMonths.toFixed(1)} months`;
  }
  
  if (breakEvenDescEl) {
    breakEvenDescEl.textContent = 
      breakEvenMonths < 6 ? 'Very fast payback' : breakEvenMonths < 12 ? 'Fast payback' : 'Long payback';
  }

  if (profitabilityTimeEl) {
    profitabilityTimeEl.textContent = 
      profitabilityMonths === Infinity ? 'Never' : `${profitabilityMonths.toFixed(1)} months`;
  }

  updateProfitChart();
}

// Update all calculations
function updateAllCalculations() {
  console.log('Updating all calculations...');
  updateCostCalculations();
  updatePricingInputs();
  updateRevenueCalculations();
}

// Populate market insights
function populateMarketInsights() {
  // Populate API categories
  const categoriesContainer = document.getElementById('api-categories');
  if (categoriesContainer) {
    categoriesContainer.innerHTML = ''; // Clear existing content
    
    apiData.market_categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category-item';
      
      const demandClass = category.demand.toLowerCase().replace(/\s+/g, '-');
      
      categoryDiv.innerHTML = `
        <div class="category-name">${category.name}</div>
        <div class="category-details">
          <div class="category-demand ${demandClass}">Demand: ${category.demand}</div>
          <div class="category-pricing">${category.avg_pricing}</div>
        </div>
      `;
      
      categoriesContainer.appendChild(categoryDiv);
    });
  }

  // Populate success factors
  const successContainer = document.getElementById('success-factors');
  if (successContainer) {
    successContainer.innerHTML = ''; // Clear existing content
    
    apiData.success_factors.forEach(factor => {
      const factorDiv = document.createElement('div');
      factorDiv.className = 'success-item';
      
      factorDiv.innerHTML = `
        <div class="success-icon"></div>
        <div class="success-text">${factor}</div>
      `;
      
      successContainer.appendChild(factorDiv);
    });
  }
}

// Create charts
function createCharts() {
  createCostChart();
  createProfitChart();
}

// Create cost breakdown chart
function createCostChart() {
  const canvas = document.getElementById('cost-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  costChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Development', 'Annual Maintenance', 'Annual Operational'],
      datasets: [{
        data: [
          currentCalculations.developmentCost,
          currentCalculations.maintenanceCost,
          currentCalculations.operationalCost * 12
        ],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': $' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Update cost chart
function updateCostChart() {
  if (costChart) {
    costChart.data.datasets[0].data = [
      currentCalculations.developmentCost,
      currentCalculations.maintenanceCost,
      currentCalculations.operationalCost * 12
    ];
    costChart.update();
  }
}

// Create profit projection chart
function createProfitChart() {
  const canvas = document.getElementById('profit-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Generate 24 months of data
  const months = [];
  const revenue = [];
  const costs = [];
  const cumulativeProfit = [];
  
  let cumulativeTotal = -currentCalculations.developmentCost; // Start with negative development cost
  
  for (let i = 1; i <= 24; i++) {
    months.push(`Month ${i}`);
    
    const monthlyRevenue = currentCalculations.monthlyRevenue;
    const monthlyCost = currentCalculations.operationalCost + (currentCalculations.maintenanceCost / 12);
    const monthlyProfit = monthlyRevenue - monthlyCost;
    
    revenue.push(monthlyRevenue);
    costs.push(monthlyCost);
    
    cumulativeTotal += monthlyProfit;
    cumulativeProfit.push(cumulativeTotal);
  }
  
  profitChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: revenue,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Monthly Costs',
          data: costs,
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.1)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Cumulative Profit',
          data: cumulativeProfit,
          borderColor: '#5D878F',
          backgroundColor: 'rgba(93, 135, 143, 0.1)',
          fill: true,
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Monthly Amount ($)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Cumulative Profit ($)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Update profit chart
function updateProfitChart() {
  if (profitChart) {
    // Recalculate data
    const revenue = [];
    const costs = [];
    const cumulativeProfit = [];
    
    let cumulativeTotal = -currentCalculations.developmentCost;
    
    for (let i = 1; i <= 24; i++) {
      const monthlyRevenue = currentCalculations.monthlyRevenue;
      const monthlyCost = currentCalculations.operationalCost + (currentCalculations.maintenanceCost / 12);
      const monthlyProfit = monthlyRevenue - monthlyCost;
      
      revenue.push(monthlyRevenue);
      costs.push(monthlyCost);
      
      cumulativeTotal += monthlyProfit;
      cumulativeProfit.push(cumulativeTotal);
    }
    
    profitChart.data.datasets[0].data = revenue;
    profitChart.data.datasets[1].data = costs;
    profitChart.data.datasets[2].data = cumulativeProfit;
    profitChart.update();
  }
}