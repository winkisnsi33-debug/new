const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure companies.json exists
const companiesFile = path.join(dataDir, 'companies.json');
if (!fs.existsSync(companiesFile)) {
  fs.writeFileSync(companiesFile, JSON.stringify([], null, 2));
}

// Load companies from file
let companies = [];
try {
  const companiesData = fs.readFileSync(companiesFile, 'utf8');
  companies = JSON.parse(companiesData);
} catch (error) {
  console.log('Creating new companies file...');
  companies = [];
}

// Save companies to file
const saveCompanies = () => {
  try {
    fs.writeFileSync(companiesFile, JSON.stringify(companies, null, 2));
  } catch (error) {
    console.error('Error saving companies:', error);
  }
};

// In-memory storage (in production, use a real database)
let properties = [
  {
    id: 1,
    title: 'Moderne Eigentumswohnung',
    type: 'Eigentumswohnung',
    location: 'München-Schwabing',
    price: '850.000',
    size: '95',
    rooms: '3.5',
    images: [
      '/WhatsApp Image 2025-09-01 at 21.35.38 (1).jpeg',
      '/WhatsApp Image 2025-09-01 at 21.28.14.jpeg',
      '/WhatsApp Image 2025-09-01 at 21.33.23.jpeg'
    ],
    description: 'Exklusive 3,5-Zimmer-Wohnung in begehrter Lage von München-Schwabing. Hochwertige Ausstattung, moderne Küche und großzügiger Balkon mit Südausrichtung.',
    features: [
      'Hochwertige Einbauküche',
      'Parkett in allen Räumen',
      'Fußbodenheizung',
      'Tiefgaragenstellplatz',
      'Balkon mit Südausrichtung',
      'Aufzug vorhanden'
    ],
    contact: {
      email: 'wohnung@immobilienmakler.de',
      phone: '+49 89 123 456'
    },
    details: {
      yearBuilt: '2018',
      condition: 'Neuwertig',
      heating: 'Fußbodenheizung',
      parking: 'Tiefgarage',
      balcony: true,
      elevator: true
    }
  },
  {
    id: 2,
    title: 'Einfamilienhaus mit Garten',
    type: 'Einfamilienhaus',
    location: 'München-Bogenhausen',
    price: '1.250.000',
    size: '140',
    rooms: '5',
    images: [
      '/WhatsApp Image 2025-09-01 at 21.33.23 copy.jpeg',
      '/WhatsApp Image 2025-09-01 at 21.35.38 (1) copy.jpeg'
    ],
    description: 'Charmantes Einfamilienhaus in ruhiger Wohnlage mit großem Garten. Perfekt für Familien mit viel Platz und Gestaltungsmöglichkeiten.',
    features: [
      'Großer Garten (400m²)',
      'Offener Wohn-/Essbereich',
      'Moderne Küche',
      'Gäste-WC',
      'Keller mit Hobbyraum',
      'Carport für 2 Fahrzeuge'
    ],
    contact: {
      email: 'haus@immobilienmakler.de',
      phone: '+49 89 234 567'
    },
    details: {
      yearBuilt: '1995',
      condition: 'Renoviert',
      heating: 'Gasheizung',
      parking: 'Carport',
      garden: true,
      elevator: false
    }
  }
];

// Initialize companies with default data if empty
if (companies.length === 0) {
  companies = [
    {
      id: 1,
      name: 'TechStart GmbH',
      industry: 'Software Development',
      location: 'München-Maxvorstadt',
      employees: '25-50',
      founded: '2019',
      revenue: '2.5M',
      images: ['/WhatsApp Image 2025-09-01 at 21.28.14.jpeg'],
      description: 'Innovative Software-Entwicklung für digitale Lösungen im B2B-Bereich',
      highlights: [
        'Agile Entwicklungsmethoden',
        'Cloud-native Architektur',
        'Internationale Kunden',
        'Starkes Wachstum (+40% p.a.)'
      ],
      contact: {
        email: 'info@techstart.de',
        phone: '+49 89 123 456'
      },
      details: {
        website: 'www.techstart.de',
        legalForm: 'GmbH',
        specialties: ['SaaS-Entwicklung', 'Mobile Apps', 'Cloud-Integration'],
        certifications: ['ISO 27001', 'GDPR-konform']
      }
    },
    {
      id: 2,
      name: 'Baumeister & Co KG',
      industry: 'Baugewerbe',
      location: 'München-Sendling',
      employees: '100-200',
      founded: '1995',
      revenue: '15M',
      images: ['/WhatsApp Image 2025-09-01 at 21.33.23.jpeg'],
      description: 'Traditionelles Bauunternehmen mit moderner Ausrichtung und nachhaltigen Konzepten',
      highlights: [
        '30 Jahre Erfahrung',
        'Nachhaltige Bauweise',
        'Komplettlösungen',
        'Zertifizierte Qualität'
      ],
      contact: {
        email: 'kontakt@baumeister-co.de',
        phone: '+49 89 234 567'
      },
      details: {
        legalForm: 'KG',
        specialties: ['Wohnungsbau', 'Gewerbebau', 'Sanierung'],
        certifications: ['DGNB Gold', 'Handwerkskammer München']
      }
    }
  ];
  saveCompanies();
}

// Admin credentials (in production, store hashed passwords in database)
const adminCredentials = {
  username: 'admin',
  password: bcrypt.hashSync('password', 10)
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== adminCredentials.username) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isValidPassword = await bcrypt.compare(password, adminCredentials.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign(
      { username: adminCredentials.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      message: 'Login erfolgreich'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Properties routes
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.post('/api/properties', authenticateToken, (req, res) => {
  try {
    const newProperty = {
      id: Math.max(...properties.map(p => p.id), 0) + 1,
      ...req.body,
      contact: req.body.contact || {
        email: 'info@immobilienmakler.de',
        phone: '+49 89 123 456'
      },
      features: req.body.features || [],
      details: req.body.details || {}
    };
    
    properties.push(newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Immobilie' });
  }
});

app.put('/api/properties/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Immobilie nicht gefunden' });
    }
    
    properties[index] = { ...properties[index], ...req.body, id };
    res.json(properties[index]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Immobilie' });
  }
});

app.delete('/api/properties/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Immobilie nicht gefunden' });
    }
    
    properties.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Immobilie' });
  }
});

// Companies routes
app.get('/api/companies', (req, res) => {
  res.json(companies);
});

app.post('/api/companies', authenticateToken, (req, res) => {
  try {
    const newCompany = {
      id: Math.max(...companies.map(c => c.id), 0) + 1,
      ...req.body,
      contact: req.body.contact || {
        email: 'info@immobilienmakler.de',
        phone: '+49 89 123 456'
      },
      highlights: req.body.highlights || [],
      details: req.body.details || {}
    };
    
    companies.push(newCompany);
    saveCompanies();
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Unternehmens' });
  }
});

app.put('/api/companies/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = companies.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Unternehmen nicht gefunden' });
    }
    
    companies[index] = { ...companies[index], ...req.body, id };
    saveCompanies();
    res.json(companies[index]);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Unternehmens' });
  }
});

app.delete('/api/companies/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = companies.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Unternehmen nicht gefunden' });
    }
    
    companies.splice(index, 1);
    saveCompanies();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Unternehmens' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
  console.log(`📊 API verfügbar unter http://localhost:${PORT}/api`);
  console.log(`🔐 Admin Login: username=admin, password=password`);
});