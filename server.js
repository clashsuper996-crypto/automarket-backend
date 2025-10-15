// AutoMarketUA backend (ready for GitHub -> Render)
// Simple Express + SQLite (better-sqlite3). Demo DB seeded with listings.
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));

const DB_PATH = path.join(__dirname,'data.db');
const db = new Database(DB_PATH);

// create tables
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', created INTEGER);
CREATE TABLE IF NOT EXISTS listings (id TEXT PRIMARY KEY, title TEXT, make TEXT, model TEXT, year INTEGER, price REAL, fuel TEXT, mileage INTEGER, desc TEXT, images TEXT, owner TEXT, approved INTEGER DEFAULT 1, created INTEGER);`);

// seed demo data if empty
const count = db.prepare('SELECT COUNT(*) as c FROM listings').get().c;
if(count === 0){
  const demo = [
    {id:'l_vw', title:'Volkswagen Golf 2012', make:'Volkswagen', model:'Golf', year:2012, price:9200, fuel:'Бензин', mileage:140000, desc:'Чудовий техстан, один власник', images:JSON.stringify([]), owner:'system', approved:1, created:Date.now()},
    {id:'l_bmw', title:'BMW 320i 2015', make:'BMW', model:'320i', year:2015, price:15800, fuel:'Бензин', mileage:98000, desc:'Спортивний характер, сервісна історія', images:JSON.stringify([]), owner:'system', approved:1, created:Date.now()},
    {id:'l_mer', title:'Mercedes C200 2014', make:'Mercedes', model:'C200', year:2014, price:13500, fuel:'Дизель', mileage:120000, desc:'Комфортний та економічний', images:JSON.stringify([]), owner:'system', approved:1, created:Date.now()}
  ];
  const stmt = db.prepare('INSERT INTO listings (id,title,make,model,year,price,fuel,mileage,desc,images,owner,approved,created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for(const d of demo){ stmt.run(d.id,d.title,d.make,d.model,d.year,d.price,d.fuel,d.mileage,d.desc,d.images,d.owner,d.approved,d.created); }
  console.log('Seeded demo listings');
}

app.get('/api/listings',(req,res)=>{
  const rows = db.prepare('SELECT * FROM listings WHERE approved=1 ORDER BY created DESC').all();
  rows.forEach(r=>{ try{ r.images = JSON.parse(r.images||'[]'); }catch(e){ r.images=[]; } });
  res.json(rows);
});

// health
app.get('/.well-known/health',(req,res)=> res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('AutoMarketUA backend listening on', PORT));
