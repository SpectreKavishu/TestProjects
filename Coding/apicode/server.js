const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

app.use('/api/', limiter);

// API Keys storage (in production, use a database)
const API_KEYS = {
  'demo_key_12345': {
    user: 'demo_user',
    tier: 'free',
    requestsToday: 0,
    maxRequests: 100,
    resetDate: new Date().toDateString()
  },
  'premium_key_67890': {
    user: 'premium_user', 
    tier: 'premium',
    requestsToday: 0,
    maxRequests: 10000,
    resetDate: new Date().toDateString()
  }
};

// API Key validation middleware
function validateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required', 
      message: 'Please provide your API key in the X-API-Key header' 
    });
  }
  
  const keyData = API_KEYS[apiKey];
  if (!keyData) {
    return res.status(403).json({ 
      error: 'Invalid API key', 
      message: 'The provided API key is not valid' 
    });
  }
  
  // Reset daily counter if needed
  if (keyData.resetDate !== new Date().toDateString()) {
    keyData.requestsToday = 0;
    keyData.resetDate = new Date().toDateString();
  }
  
  // Check rate limits
  if (keyData.requestsToday >= keyData.maxRequests) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: `Daily limit of ${keyData.maxRequests} requests exceeded`,
      tier: keyData.tier,
      resetTime: 'Midnight UTC'
    });
  }
  
  keyData.requestsToday++;
  req.apiUser = keyData;
  next();
}

// Calculator Logic (extracted from your frontend code)
class APIBusinessCalculator {
  constructor() {
    this.complexityLevels = {
      simple: {
        costRange: [5000, 20000],
        developmentTime: '2-4 months',
        maintenancePercentage: 15,
        examples: 'Basic CRUD operations, simple data retrieval'
      },
      moderate: {
        costRange: [15000, 50000], 
        developmentTime: '4-8 months',
        maintenancePercentage: 20,
        examples: 'User authentication, payment processing, integrations'
      },
      complex: {
        costRange: [50000, 150000],
        developmentTime: '8-18 months', 
        maintenancePercentage: 25,
        examples: 'Enterprise security, real-time processing, advanced analytics'
      }
    };
    
    this.monetizationModels = {
      'pay-per-use': {
        description: 'Charge based on API calls or data consumption',
        typicalPricing: '$0.001 - $0.10 per call',
        predictability: 'Variable',
        bestFor: 'APIs with fluctuating usage'
      },
      subscription: {
        description: 'Fixed monthly/annual fee with usage limits',
        typicalPricing: '$29 - $999+ per month', 
        predictability: 'High',
        bestFor: 'B2B customers, predictable usage'
      },
      freemium: {
        description: 'Free basic tier, paid premium features',
        typicalPricing: 'Free + $19-$299/month premium',
        predictability: 'Medium',
        bestFor: 'Developer adoption, viral growth'
      },
      'revenue-sharing': {
        description: 'Percentage of transactions processed',
        typicalPricing: '2-10% of transaction value',
        predictability: 'Variable', 
        bestFor: 'Payment/marketplace APIs'
      }
    };
    
    this.marketCategories = {
      'ai-ml': {
        demand: 'Very High',
        competition: 'High',
        avgPricing: '$0.01-$0.20 per request',
        examples: 'Text processing, image recognition, chatbots'
      },
      payment: {
        demand: 'High',
        competition: 'Medium',
        avgPricing: '2.9% + $0.30 per transaction', 
        examples: 'Payment processing, wallet integration'
      },
      data: {
        demand: 'High',
        competition: 'Medium',
        avgPricing: '$0.001-$0.05 per call',
        examples: 'Weather, financial data, social media'
      },
      communication: {
        demand: 'Medium',
        competition: 'Medium', 
        avgPricing: '$0.01-$0.05 per message/call',
        examples: 'SMS, email, voice calls'
      }
    };
  }
  
  calculateDevelopmentCost(complexity, customFeatures = 0) {
    if (!this.complexityLevels[complexity]) {
      throw new Error('Invalid complexity level');
    }
    
    const level = this.complexityLevels[complexity];
    const baseCost = (level.costRange[0] + level.costRange[1]) / 2;
    const featureCost = customFeatures * 2000; // $2000 per custom feature
    
    return {
      totalCost: baseCost + featureCost,
      baseCost: baseCost,
      customFeatureCost: featureCost,
      complexity: complexity,
      developmentTime: level.developmentTime,
      examples: level.examples
    };
  }
  
  calculateMaintenanceCost(developmentCost, complexity) {
    if (!this.complexityLevels[complexity]) {
      throw new Error('Invalid complexity level');
    }
    
    const maintenanceRate = this.complexityLevels[complexity].maintenancePercentage / 100;
    const annualMaintenance = developmentCost * maintenanceRate;
    
    return {
      annualMaintenance: annualMaintenance,
      monthlyMaintenance: annualMaintenance / 12,
      maintenanceRate: maintenanceRate * 100
    };
  }
  
  calculateRevenueProjection(model, users, usagePerUser, pricing) {
    if (!this.monetizationModels[model]) {
      throw new Error('Invalid monetization model');
    }
    
    let monthlyRevenue = 0;
    
    switch(model) {
      case 'subscription':
        monthlyRevenue = users * pricing;
        break;
      case 'pay-per-use':
        monthlyRevenue = users * usagePerUser * pricing;
        break;
      case 'freemium':
        const conversionRate = 0.05; // 5% typical conversion
        monthlyRevenue = users * conversionRate * pricing;
        break;
      case 'revenue-sharing':
        const avgTransactionValue = 100; // $100 average
        const totalTransactionVolume = users * usagePerUser * avgTransactionValue;
        monthlyRevenue = totalTransactionVolume * (pricing / 100);
        break;
    }
    
    return {
      monthlyRevenue: monthlyRevenue,
      annualRevenue: monthlyRevenue * 12,
      model: model,
      users: users,
      usagePerUser: usagePerUser,
      pricing: pricing,
      modelInfo: this.monetizationModels[model]
    };
  }
  
  calculateROI(annualRevenue, developmentCost, annualMaintenance = 0) {
    const totalCosts = developmentCost + annualMaintenance;
    const annualProfit = annualRevenue - annualMaintenance;
    const roi = totalCosts > 0 ? ((annualProfit - developmentCost) / developmentCost) * 100 : 0;
    const paybackMonths = annualRevenue > 0 ? developmentCost / (annualRevenue / 12) : 0;
    
    return {
      roi: roi,
      annualProfit: annualProfit,
      totalCosts: totalCosts,
      paybackPeriodMonths: paybackMonths,
      breakEvenPoint: paybackMonths > 0 ? `${Math.ceil(paybackMonths)} months` : 'Unable to calculate'
    };
  }
}

const calculator = new APIBusinessCalculator();

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API Business Calculator API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      '/api/calculate/development-cost': 'POST - Calculate API development costs',
      '/api/calculate/revenue-projection': 'POST - Calculate revenue projections', 
      '/api/calculate/roi': 'POST - Calculate return on investment',
      '/api/market-data': 'GET - Get market category information',
      '/api/usage': 'GET - Check your API usage'
    }
  });
});

// Development Cost Calculation
app.post('/api/calculate/development-cost', validateAPIKey, (req, res) => {
  try {
    const { complexity, customFeatures = 0 } = req.body;
    
    if (!complexity) {
      return res.status(400).json({ 
        error: 'Missing required parameter: complexity',
        validOptions: Object.keys(calculator.complexityLevels)
      });
    }
    
    const costResult = calculator.calculateDevelopmentCost(complexity, customFeatures);
    const maintenanceResult = calculator.calculateMaintenanceCost(costResult.totalCost, complexity);
    
    res.json({
      success: true,
      data: {
        ...costResult,
        maintenance: maintenanceResult,
        currency: 'USD'
      }
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      validComplexityLevels: Object.keys(calculator.complexityLevels)
    });
  }
});

// Revenue Projection Calculation  
app.post('/api/calculate/revenue-projection', validateAPIKey, (req, res) => {
  try {
    const { model, users, usagePerUser, pricing } = req.body;
    
    if (!model || !users || !usagePerUser || !pricing) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['model', 'users', 'usagePerUser', 'pricing'],
        validModels: Object.keys(calculator.monetizationModels)
      });
    }
    
    const result = calculator.calculateRevenueProjection(model, users, usagePerUser, pricing);
    
    res.json({
      success: true,
      data: {
        ...result,
        currency: 'USD'
      }
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      validModels: Object.keys(calculator.monetizationModels)
    });
  }
});

// ROI Calculation
app.post('/api/calculate/roi', validateAPIKey, (req, res) => {
  try {
    const { annualRevenue, developmentCost, annualMaintenance = 0 } = req.body;
    
    if (!annualRevenue || !developmentCost) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['annualRevenue', 'developmentCost'],
        optional: ['annualMaintenance']
      });
    }
    
    const result = calculator.calculateROI(annualRevenue, developmentCost, annualMaintenance);
    
    res.json({
      success: true,
      data: {
        ...result,
        currency: 'USD'
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Market Data
app.get('/api/market-data', validateAPIKey, (req, res) => {
  res.json({
    success: true,
    data: {
      categories: calculator.marketCategories,
      monetizationModels: calculator.monetizationModels,
      complexityLevels: calculator.complexityLevels
    }
  });
});

// Usage Information
app.get('/api/usage', validateAPIKey, (req, res) => {
  const user = req.apiUser;
  res.json({
    success: true,
    data: {
      user: user.user,
      tier: user.tier,
      requestsToday: user.requestsToday,
      requestsRemaining: user.maxRequests - user.requestsToday,
      maxDailyRequests: user.maxRequests,
      resetTime: 'Midnight UTC'
    }
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'API Business Calculator API',
    version: '1.0.0',
    description: 'Calculate development costs, revenue projections, and ROI for API businesses',
    baseUrl: req.protocol + '://' + req.get('host'),
    authentication: {
      type: 'API Key',
      header: 'X-API-Key',
      description: 'Include your API key in the X-API-Key header'
    },
    endpoints: {
      'POST /api/calculate/development-cost': {
        description: 'Calculate API development costs',
        parameters: {
          complexity: {
            type: 'string',
            required: true,
            options: Object.keys(calculator.complexityLevels),
            description: 'API complexity level'
          },
          customFeatures: {
            type: 'number',
            required: false,
            default: 0,
            description: 'Number of custom features ($2000 each)'
          }
        },
        example: {
          request: {
            complexity: 'moderate',
            customFeatures: 2
          },
          response: {
            success: true,
            data: {
              totalCost: 36500,
              baseCost: 32500,
              customFeatureCost: 4000,
              complexity: 'moderate',
              developmentTime: '4-8 months'
            }
          }
        }
      },
      'POST /api/calculate/revenue-projection': {
        description: 'Calculate revenue projections',
        parameters: {
          model: {
            type: 'string', 
            required: true,
            options: Object.keys(calculator.monetizationModels)
          },
          users: {
            type: 'number',
            required: true,
            description: 'Number of users/customers'
          },
          usagePerUser: {
            type: 'number',
            required: true, 
            description: 'API calls per user per month'
          },
          pricing: {
            type: 'number',
            required: true,
            description: 'Price per unit (varies by model)'
          }
        }
      },
      'POST /api/calculate/roi': {
        description: 'Calculate return on investment',
        parameters: {
          annualRevenue: {
            type: 'number',
            required: true,
            description: 'Expected annual revenue'
          },
          developmentCost: {
            type: 'number', 
            required: true,
            description: 'Total development cost'
          },
          annualMaintenance: {
            type: 'number',
            required: false,
            default: 0,
            description: 'Annual maintenance cost'
          }
        }
      },
      'GET /api/market-data': {
        description: 'Get market categories and monetization models data'
      },
      'GET /api/usage': {
        description: 'Check your current API usage and limits'
      }
    },
    pricing: {
      free: {
        dailyRequests: 100,
        cost: '$0/month',
        features: ['All calculation endpoints', 'Basic support']
      },
      premium: {
        dailyRequests: 10000,
        cost: '$29/month', 
        features: ['All calculation endpoints', 'Priority support', 'Usage analytics']
      }
    },
    errorCodes: {
      400: 'Bad Request - Invalid parameters',
      401: 'Unauthorized - Missing API key',
      403: 'Forbidden - Invalid API key', 
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    documentation: '/api/docs'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Business Calculator API running on port ${PORT}`);
  console.log(`📚 Documentation available at http://localhost:${PORT}/api/docs`);
  console.log(`🔑 Demo API key: demo_key_12345`);
});

module.exports = app;