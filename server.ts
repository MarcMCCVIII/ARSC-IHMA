import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

const db = new Database("arsc.db");
db.pragma('foreign_keys = ON');

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize Database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_number TEXT UNIQUE,
      name TEXT,
      year TEXT,
      section TEXT,
      has_voted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS officers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      position TEXT,
      year TEXT,
      image_url TEXT,
      is_current INTEGER DEFAULT 1,
      category TEXT DEFAULT 'Executive'
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      position TEXT,
      grade_level TEXT,
      partylist_id INTEGER,
      category TEXT,
      term_id INTEGER,
      voting_restriction TEXT DEFAULT 'everyone',
      image_url TEXT,
      FOREIGN KEY(partylist_id) REFERENCES partylists(id) ON DELETE SET NULL,
      FOREIGN KEY(term_id) REFERENCES terms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT,
      caption TEXT,
      batch TEXT
    );

    CREATE TABLE IF NOT EXISTS terms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      is_active INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS partylists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      platform_image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      candidate_id INTEGER,
      position TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY(candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS home_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE,
      title TEXT,
      content TEXT,
      order_index INTEGER DEFAULT 0
    );

    INSERT OR IGNORE INTO home_content (section_key, title, content, order_index) VALUES ('what_is_arsc', 'What is ARSC?', 'The Archdiocesan Religious Student Council (ARSC) is the highest student governing body...', 1);
    INSERT OR IGNORE INTO home_content (section_key, title, content, order_index) VALUES ('mission', 'Mission', 'To serve as a catalyst for spiritual and academic growth...', 2);
    INSERT OR IGNORE INTO home_content (section_key, title, content, order_index) VALUES ('vision', 'Vision', 'A community of student leaders dedicated to service...', 3);
    INSERT OR IGNORE INTO home_content (section_key, title, content, order_index) VALUES ('values', 'Values', 'Faith, Service, Excellence, Integrity', 4);
    INSERT OR IGNORE INTO home_content (section_key, title, content, order_index) VALUES ('contact_info', 'Contact Info', 'Email: arsc@ihma.edu.ph\nPhone: (123) 456-7890', 5);

    INSERT OR IGNORE INTO settings (key, value) VALUES ('logo1', '');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('logo2', '');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('voting_restriction', 'everyone');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'ARSCOfficers');
  `);

  // Ensure candidates table has image_url column
  try {
    db.prepare("ALTER TABLE candidates ADD COLUMN image_url TEXT").run();
  } catch (e) {
    // Column already exists
  }
} catch (err) {
  console.error("Database initialization failed:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer setup for uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });

  app.use("/uploads", express.static("uploads"));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- API Routes ---

  // Auth
  app.post("/api/login", (req, res) => {
    const { password, isAdmin } = req.body;
    if (isAdmin) {
      const adminPass = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get() as any;
      if (password === adminPass.value) {
        return res.json({ success: true, role: "admin" });
      }
      return res.status(401).json({ success: false, message: "Invalid admin password" });
    } else {
      const student = db.prepare("SELECT * FROM students WHERE student_number = ?").get(password);
      if (student) {
        return res.json({ success: true, role: "student", student });
      }
      return res.status(401).json({ success: false, message: "Invalid student number" });
    }
  });

  // Student Profile Update
  app.post("/api/students/update", (req, res) => {
    const { id, name, year, section } = req.body;
    db.prepare("UPDATE students SET name = ?, year = ?, section = ? WHERE id = ?").run(name, year, section, id);
    res.json({ success: true });
  });

  // Home Content
  app.get("/api/home-content", (req, res) => {
    const content = db.prepare("SELECT * FROM home_content ORDER BY order_index ASC").all();
    res.json(content);
  });

  app.post("/api/home-content", (req, res) => {
    const { title, content, section_key } = req.body;
    const key = section_key || `custom_${Date.now()}`;
    const maxOrder = db.prepare("SELECT MAX(order_index) as max_order FROM home_content").get() as any;
    const nextOrder = (maxOrder?.max_order || 0) + 1;
    db.prepare("INSERT INTO home_content (section_key, title, content, order_index) VALUES (?, ?, ?, ?)").run(key, title, content, nextOrder);
    res.json({ success: true });
  });

  app.put("/api/home-content/:id", (req, res) => {
    const { title, content } = req.body;
    db.prepare("UPDATE home_content SET title = ?, content = ? WHERE id = ?").run(title, content, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/home-content/:id", (req, res) => {
    db.prepare("DELETE FROM home_content WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // News
  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY id DESC").all();
    res.json(news);
  });

  app.post("/api/news", upload.single("image"), (req, res) => {
    const { title, content, date } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    const image_url = file ? `/uploads/${file.filename}` : "";
    db.prepare("INSERT INTO news (title, content, date, image_url) VALUES (?, ?, ?, ?)").run(title, content, date, image_url);
    res.json({ success: true });
  });

  app.put("/api/news/:id", upload.single("image"), (req, res) => {
    const { title, content, date } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      const image_url = `/uploads/${file.filename}`;
      db.prepare("UPDATE news SET title = ?, content = ?, date = ?, image_url = ? WHERE id = ?").run(title, content, date, image_url, req.params.id);
    } else {
      db.prepare("UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?").run(title, content, date, req.params.id);
    }
    res.json({ success: true });
  });

  app.delete("/api/news/:id", (req, res) => {
    db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Officers
  app.get("/api/officers", (req, res) => {
    const officers = db.prepare("SELECT * FROM officers").all();
    res.json(officers);
  });

  app.post("/api/officers", upload.single("image"), (req, res) => {
    const { name, position, year, category } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    const image_url = file ? `/uploads/${file.filename}` : "";
    db.prepare("INSERT INTO officers (name, position, year, image_url, is_current, category) VALUES (?, ?, ?, ?, 1, ?)").run(
      name, position, year, image_url, category || 'Executive'
    );
    res.json({ success: true });
  });

  app.put("/api/officers/:id", upload.single("image"), (req, res) => {
    const { name, position, year, category } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      const image_url = `/uploads/${file.filename}`;
      db.prepare("UPDATE officers SET name = ?, position = ?, year = ?, image_url = ?, category = ? WHERE id = ?").run(
        name, position, year, image_url, category, req.params.id
      );
    } else {
      db.prepare("UPDATE officers SET name = ?, position = ?, year = ?, category = ? WHERE id = ?").run(
        name, position, year, category, req.params.id
      );
    }
    res.json({ success: true });
  });

  app.delete("/api/officers/:id", (req, res) => {
    db.prepare("DELETE FROM officers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Memories
  app.get("/api/memories", (req, res) => {
    const memories = db.prepare("SELECT * FROM memories ORDER BY id DESC").all();
    res.json(memories);
  });

  app.post("/api/memories", upload.single("image"), (req, res) => {
    const { caption, batch } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    const image_url = file ? `/uploads/${file.filename}` : "";
    db.prepare("INSERT INTO memories (image_url, caption, batch) VALUES (?, ?, ?)").run(image_url, caption, batch);
    res.json({ success: true });
  });

  app.put("/api/memories/:id", upload.single("image"), (req, res) => {
    const { caption, batch } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      const image_url = `/uploads/${file.filename}`;
      db.prepare("UPDATE memories SET caption = ?, batch = ?, image_url = ? WHERE id = ?").run(caption, batch, image_url, req.params.id);
    } else {
      db.prepare("UPDATE memories SET caption = ?, batch = ? WHERE id = ?").run(caption, batch, req.params.id);
    }
    res.json({ success: true });
  });

  app.delete("/api/memories/:id", (req, res) => {
    db.prepare("DELETE FROM memories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Terms
  app.get("/api/terms", (req, res) => {
    const terms = db.prepare("SELECT * FROM terms").all();
    res.json(terms);
  });

  app.post("/api/terms", (req, res) => {
    const { name } = req.body;
    db.prepare("INSERT INTO terms (name) VALUES (?)").run(name);
    res.json({ success: true });
  });

  app.put("/api/terms/:id/activate", (req, res) => {
    db.transaction(() => {
      db.prepare("UPDATE terms SET is_active = 0").run();
      db.prepare("UPDATE terms SET is_active = 1 WHERE id = ?").run(req.params.id);
    })();
    res.json({ success: true });
  });

  app.delete("/api/terms/:id", (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      // Delete votes of candidates of this term
      db.prepare(`
        DELETE FROM votes 
        WHERE candidate_id IN (SELECT id FROM candidates WHERE term_id = ?)
      `).run(id);
      // Delete candidates of this term
      db.prepare("DELETE FROM candidates WHERE term_id = ?").run(id);
      // Delete the term
      db.prepare("DELETE FROM terms WHERE id = ?").run(id);
    })();
    res.json({ success: true });
  });

  // Partylists
  app.get("/api/partylists", (req, res) => {
    const partylists = db.prepare("SELECT * FROM partylists").all();
    res.json(partylists);
  });

  app.post("/api/partylists", upload.single("platform_image"), (req, res) => {
    const { name } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    const platform_image_url = file ? `/uploads/${file.filename}` : "";
    db.prepare("INSERT INTO partylists (name, platform_image_url) VALUES (?, ?)").run(name, platform_image_url);
    res.json({ success: true });
  });

  app.delete("/api/partylists/:id", (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      // Unlink candidates from this partylist
      db.prepare("UPDATE candidates SET partylist_id = NULL WHERE partylist_id = ?").run(id);
      // Delete the partylist
      db.prepare("DELETE FROM partylists WHERE id = ?").run(id);
    })();
    res.json({ success: true });
  });

  // Positions
  app.get("/api/positions", (req, res) => {
    const positions = db.prepare("SELECT * FROM positions").all();
    res.json(positions);
  });

  app.post("/api/positions", (req, res) => {
    const { name, category } = req.body;
    db.prepare("INSERT INTO positions (name, category) VALUES (?, ?)").run(name, category);
    res.json({ success: true });
  });

  app.delete("/api/positions/:id", (req, res) => {
    const position = db.prepare("SELECT name FROM positions WHERE id = ?").get(req.params.id) as any;
    if (!position) return res.status(404).json({ success: false, message: "Position not found" });

    const inUseCandidate = db.prepare("SELECT id FROM candidates WHERE position = ?").get(position.name);
    const inUseOfficer = db.prepare("SELECT id FROM officers WHERE position = ?").get(position.name);

    if (inUseCandidate || inUseOfficer) {
      return res.status(400).json({ success: false, message: "Position is currently in use by candidates or officers." });
    }

    db.prepare("DELETE FROM positions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Voting
  app.get("/api/candidates", (req, res) => {
    const activeTerm = db.prepare("SELECT id FROM terms WHERE is_active = 1").get();
    if (!activeTerm) return res.json([]);
    const candidates = db.prepare(`
      SELECT c.*, p.name as partylist_name 
      FROM candidates c 
      LEFT JOIN partylists p ON c.partylist_id = p.id 
      WHERE c.term_id = ?
    `).all(activeTerm.id);
    res.json(candidates);
  });

  app.post("/api/candidates", upload.single("image"), (req, res) => {
    const { name, position, grade_level, partylist_id, category, term_id, voting_restriction } = req.body;
    const file = req.file as Express.Multer.File | undefined;
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    db.prepare(`
      INSERT INTO candidates (name, position, grade_level, partylist_id, category, term_id, voting_restriction, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, position, grade_level, partylist_id || null, category, term_id, voting_restriction || 'everyone', imageUrl);
    res.json({ success: true });
  });

  app.delete("/api/candidates/:id", (req, res) => {
    const { id } = req.params;
    db.transaction(() => {
      // Delete votes for this candidate
      db.prepare("DELETE FROM votes WHERE candidate_id = ?").run(id);
      // Delete the candidate
      db.prepare("DELETE FROM candidates WHERE id = ?").run(id);
    })();
    res.json({ success: true });
  });

  app.post("/api/vote", (req, res) => {
    const { student_id, votes } = req.body; // votes is array of { candidate_id, position }
    
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(student_id);
    if (student.has_voted) {
      return res.status(400).json({ success: false, message: "Already voted" });
    }

    const transaction = db.transaction(() => {
      for (const vote of votes) {
        db.prepare("INSERT INTO votes (student_id, candidate_id, position) VALUES (?, ?, ?)").run(student_id, vote.candidate_id, vote.position);
      }
      db.prepare("UPDATE students SET has_voted = 1 WHERE id = ?").run(student_id);
    });
    transaction();
    res.json({ success: true });
  });

  app.get("/api/voting-stats", (req, res) => {
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM students").get().count;
    const votedCount = db.prepare("SELECT COUNT(*) as count FROM students WHERE has_voted = 1").get().count;
    const candidates = db.prepare("SELECT * FROM candidates").all();
    const results = candidates.map(c => {
      const votes = db.prepare("SELECT COUNT(*) as count FROM votes WHERE candidate_id = ?").get(c.id).count;
      return { ...c, votes };
    });
    const voters = db.prepare("SELECT id, name, year, section, has_voted FROM students").all();
    res.json({ totalStudents, votedCount, results, voters });
  });

  // Settings & Database Upload
  app.post("/api/settings/logo", upload.single("logo"), (req, res) => {
    const { key } = req.body; // logo1 or logo2
    const file = req.file as Express.Multer.File | undefined;
    if (file) {
      const url = `/uploads/${file.filename}`;
      db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(url, key);
      res.json({ success: true, url });
    } else {
      res.status(400).json({ success: false });
    }
  });

  app.delete("/api/settings/logo/:key", (req, res) => {
    const { key } = req.params;
    db.prepare("UPDATE settings SET value = '' WHERE key = ?").run(key);
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const obj = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(obj);
  });

  app.post("/api/settings/voting-restriction", (req, res) => {
    const { value } = req.body;
    db.prepare("UPDATE settings SET value = ? WHERE key = 'voting_restriction'").run(value);
    res.json({ success: true });
  });

  app.post("/api/settings/change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const adminPass = db.prepare("SELECT value FROM settings WHERE key = 'admin_password'").get() as any;
    
    if (currentPassword !== adminPass.value) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }
    
    db.prepare("UPDATE settings SET value = ? WHERE key = 'admin_password'").run(newPassword);
    res.json({ success: true });
  });

  // Sections Management
  app.get("/api/sections", (req, res) => {
    const sections = db.prepare("SELECT * FROM sections ORDER BY year, name").all();
    res.json(sections);
  });

  app.post("/api/sections", (req, res) => {
    const { year, name } = req.body;
    db.prepare("INSERT INTO sections (year, name) VALUES (?, ?)").run(year, name);
    res.json({ success: true });
  });

  app.delete("/api/sections/:id", (req, res) => {
    db.prepare("DELETE FROM sections WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/students", (req, res) => {
    const { student_number, name, year, section } = req.body;
    try {
      db.prepare("INSERT INTO students (student_number, name, year, section) VALUES (?, ?, ?, ?)").run(student_number, name, year, section);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM votes WHERE student_id = ?").run(id);
      db.prepare("DELETE FROM students WHERE id = ?").run(id);
    });
    transaction();
    res.json({ success: true });
  });

  app.post("/api/students/:id/reset-vote", (req, res) => {
    const { id } = req.params;
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM votes WHERE student_id = ?").run(id);
      db.prepare("UPDATE students SET has_voted = 0 WHERE id = ?").run(id);
    });
    transaction();
    res.json({ success: true });
  });

  app.post("/api/students/reset-all-votes", (req, res) => {
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM votes").run();
      db.prepare("UPDATE students SET has_voted = 0").run();
    });
    transaction();
    res.json({ success: true });
  });

  app.post("/api/students/clear-all", (req, res) => {
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM votes").run();
      db.prepare("DELETE FROM students").run();
    });
    transaction();
    res.json({ success: true });
  });

  app.post("/api/upload-students", upload.single("file"), (req, res) => {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ success: false });
    
    const fileContent = fs.readFileSync(file.path, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const insert = db.prepare("INSERT OR IGNORE INTO students (student_number, name, year, section) VALUES (?, ?, ?, ?)");
    const transaction = db.transaction((students) => {
      for (const s of students) {
        insert.run(
          s.student_number || s['Student Number'] || s['ID Number'],
          s.name || s['Name'] || '',
          s.year || s['Year'] || s['Grade'] || '',
          s.section || s['Section'] || ''
        );
      }
    });
    transaction(records);
    res.json({ success: true, count: records.length });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
