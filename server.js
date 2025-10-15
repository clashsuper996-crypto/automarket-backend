// Demo backend ready for Render. Uses SQLite and supports Cloudinary uploads if CLOUDINARY_URL is set.
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname,'data.db');
const db = new Database(DB_PATH);
// create tables
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', created INTEGER);
CREATE TABLE IF NOT EXISTS listings (id TEXT PRIMARY KEY, title TEXT, make TEXT, model TEXT, year INTEGER, price REAL, fuel TEXT, mileage INTEGER, desc TEXT, images TEXT, owner TEXT, approved INTEGER DEFAULT 1, created INTEGER);`);

app.get('/api/listings',(req,res)=>{
  const rows = db.prepare('SELECT * FROM listings WHERE approved=1 ORDER BY created DESC').all();
  rows.forEach(r=>{ try{ r.images = JSON.parse(r.images||'[]'); }catch(e){ r.images=[]; } });
  res.json(rows);
});

// basic health
app.get('/.well-known/health', (req,res)=> res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
