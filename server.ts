import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "Detected" : "MISSING");
console.log("Supabase Key:", supabaseKey ? `Detected (${supabaseKey.substring(0, 5)}...)` : "MISSING");

if (supabaseKey && supabaseKey.startsWith("sb_publishable")) {
  console.error("WARNING: Your Supabase Key seems to have an invalid prefix ('sb_publishable'). Please use only the JWT string starting with 'eyJ'.");
}

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase URL or API Key is missing in environment variables.");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer setup for temporary storage before uploading to Supabase
  const upload = multer({ storage: multer.memoryStorage() });

  // Helper function to upload to Supabase Storage
  async function uploadToSupabase(file: Express.Multer.File, bucket: string = 'uploads') {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrl;
  }

  // Helper to fetch all rows from a table (handling Supabase pagination)
  async function fetchAll(table: string, select: string = '*', applyFilters?: (query: any) => any) {
    let allData: any[] = [];
    let page = 0;
    const pageSize = 1000;
    
    console.log(`Starting fetchAll for table: ${table}`);
    
    while (true) {
      try {
        let query = supabase.from(table).select(select);
        if (applyFilters) query = applyFilters(query);
        
        // Use a stable sort for pagination. Try 'id' first, then 'created_at', then 'student_number'
        // We'll try to be smart about it.
        query = query.order('id', { ascending: true }).range(page * pageSize, (page + 1) * pageSize - 1);
        
        const { data, error } = await query;
        
        if (error) {
          // If 'id' doesn't exist, try without explicit order or with a different one
          if (error.code === '42703') { // Undefined column
            console.warn(`Column 'id' not found in ${table}, trying without explicit order`);
            const fallbackQuery = supabase.from(table).select(select);
            if (applyFilters) query = applyFilters(fallbackQuery);
            const { data: fallbackData, error: fallbackError } = await query.range(page * pageSize, (page + 1) * pageSize - 1);
            if (fallbackError) throw fallbackError;
            if (!fallbackData || fallbackData.length === 0) break;
            allData = [...allData, ...fallbackData];
            if (fallbackData.length < pageSize) break;
          } else {
            throw error;
          }
        } else {
          if (!data || data.length === 0) break;
          allData = [...allData, ...data];
          console.log(`Fetched ${data.length} rows from ${table} (total: ${allData.length})`);
          if (data.length < pageSize) break;
        }
        page++;
      } catch (err) {
        console.error(`Error in fetchAll for ${table}:`, err);
        throw err;
      }
    }
    return allData;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- API Routes ---

  // Auth
  app.post("/api/login", async (req, res) => {
    const { password, isAdmin } = req.body;
    if (isAdmin) {
      const { data: adminPass, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();
        
      if (error) return res.status(500).json({ success: false, message: error.message });
      
      if (password === adminPass.value) {
        return res.json({ success: true, role: "admin" });
      }
      return res.status(401).json({ success: false, message: "Invalid admin password" });
    } else {
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_number', password)
        .single();
        
      if (error || !student) {
        return res.status(401).json({ success: false, message: "Invalid student number" });
      }
      return res.json({ success: true, role: "student", student });
    }
  });

  // Student Profile Update
  app.post("/api/students/update", async (req, res) => {
    const { id, name, year, section } = req.body;
    const { error } = await supabase
      .from('students')
      .update({ name, year, section })
      .eq('id', id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Home Content
  app.get("/api/home-content", async (req, res) => {
    const { data, error } = await supabase
      .from('home_content')
      .select('*')
      .order('order_index', { ascending: true });
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/home-content", async (req, res) => {
    const { title, content, section_key } = req.body;
    const key = section_key || `custom_${Date.now()}`;
    
    const { data: maxOrderData } = await supabase
      .from('home_content')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);
      
    const nextOrder = ((maxOrderData?.[0]?.order_index) || 0) + 1;
    
    const { error } = await supabase
      .from('home_content')
      .insert([{ section_key: key, title, content, order_index: nextOrder }]);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/home-content/:id", async (req, res) => {
    const { title, content } = req.body;
    const { error } = await supabase
      .from('home_content')
      .update({ title, content })
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/home-content/:id", async (req, res) => {
    const { error } = await supabase
      .from('home_content')
      .delete()
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // News
  app.get("/api/news", async (req, res) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/news", upload.single("image"), async (req, res) => {
    const { title, content, date } = req.body;
    let image_url = "";
    
    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('news')
      .insert([{ title, content, date, image_url }]);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/news/:id", upload.single("image"), async (req, res) => {
    const { title, content, date } = req.body;
    const updateData: any = { title, content, date };
    
    if (req.file) {
      try {
        updateData.image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/news/:id", async (req, res) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Officers
  app.get("/api/officers", async (req, res) => {
    const { data, error } = await supabase.from('officers').select('*');
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/officers", upload.single("image"), async (req, res) => {
    const { name, position, year, category } = req.body;
    let image_url = "";
    
    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('officers')
      .insert([{ name, position, year, image_url, is_current: true, category: category || 'Executive' }]);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/officers/:id", upload.single("image"), async (req, res) => {
    const { name, position, year, category } = req.body;
    const updateData: any = { name, position, year, category };
    
    if (req.file) {
      try {
        updateData.image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('officers')
      .update(updateData)
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/officers/:id", async (req, res) => {
    const { error } = await supabase.from('officers').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Memories
  app.get("/api/memories", async (req, res) => {
    const { data, error } = await supabase.from('memories').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/memories", upload.single("image"), async (req, res) => {
    const { caption, batch } = req.body;
    let image_url = "";
    
    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('memories')
      .insert([{ image_url, caption, batch }]);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/memories/:id", upload.single("image"), async (req, res) => {
    const { caption, batch } = req.body;
    const updateData: any = { caption, batch };
    
    if (req.file) {
      try {
        updateData.image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase
      .from('memories')
      .update(updateData)
      .eq('id', req.params.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/memories/:id", async (req, res) => {
    const { error } = await supabase.from('memories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Terms
  app.get("/api/terms", async (req, res) => {
    const { data, error } = await supabase.from('terms').select('*');
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/terms", async (req, res) => {
    const { name } = req.body;
    const { error } = await supabase.from('terms').insert([{ name }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/terms/:id/activate", async (req, res) => {
    const { error: deactivateError } = await supabase.from('terms').update({ is_active: false }).neq('id', -1);
    if (deactivateError) return res.status(500).json({ success: false, message: deactivateError.message });
    
    const { error: activateError } = await supabase.from('terms').update({ is_active: true }).eq('id', req.params.id);
    if (activateError) return res.status(500).json({ success: false, message: activateError.message });
    
    res.json({ success: true });
  });

  app.delete("/api/terms/:id", async (req, res) => {
    const { id } = req.params;
    // Supabase handles cascading if configured in DB
    const { error } = await supabase.from('terms').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Partylists
  app.get("/api/partylists", async (req, res) => {
    const { data, error } = await supabase.from('partylists').select('*');
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/partylists", upload.single("platform_image"), async (req, res) => {
    const { name } = req.body;
    let platform_image_url = "";
    
    if (req.file) {
      try {
        platform_image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }
    
    const { error } = await supabase.from('partylists').insert([{ name, platform_image_url }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/partylists/:id", async (req, res) => {
    const { error } = await supabase.from('partylists').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Positions
  app.get("/api/positions", async (req, res) => {
    const { data, error } = await supabase.from('positions').select('*').order('order_index', { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.post("/api/positions", async (req, res) => {
    const { name, category, order_index } = req.body;
    const { error } = await supabase.from('positions').insert([{ name, category, order_index: order_index || 0 }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/positions/:id", async (req, res) => {
    const { order_index, name, category } = req.body;
    const { error } = await supabase.from('positions').update({ order_index, name, category }).eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/positions/:id", async (req, res) => {
    const { data: position } = await supabase.from('positions').select('name').eq('id', req.params.id).single();
    if (!position) return res.status(404).json({ success: false, message: "Position not found" });

    const { data: inUseCandidate } = await supabase.from('candidates').select('id').eq('position', position.name).limit(1);
    const { data: inUseOfficer } = await supabase.from('officers').select('id').eq('position', position.name).limit(1);

    if (inUseCandidate?.length || inUseOfficer?.length) {
      return res.status(400).json({ success: false, message: "Position is currently in use by candidates or officers." });
    }

    const { error } = await supabase.from('positions').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Voting
  app.get("/api/candidates", async (req, res) => {
    const { data: activeTerm } = await supabase.from('terms').select('id').eq('is_active', true).single();
    if (!activeTerm) return res.json([]);
    
    const { data, error } = await supabase
      .from('candidates')
      .select('*, partylists(name)')
      .eq('term_id', activeTerm.id);
      
    if (error) return res.status(500).json({ success: false, message: error.message });
    
    // Flatten partylist name
    const candidates = data.map((c: any) => ({
      ...c,
      partylist_name: c.partylists?.name || 'Independent'
    }));
    
    res.json(candidates);
  });

  app.post("/api/candidates", upload.single("image"), async (req, res) => {
    const { name, position, grade_level, partylist_id, category, term_id, voting_restriction } = req.body;
    let image_url = null;

    if (req.file) {
      try {
        image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }

    const { error } = await supabase.from('candidates').insert([{
      name, position, grade_level, 
      partylist_id: partylist_id || null, 
      category, term_id, 
      voting_restriction: voting_restriction || 'everyone', 
      image_url
    }]);
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/candidates/:id", async (req, res) => {
    const { error } = await supabase.from('candidates').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.put("/api/candidates/:id", upload.single("image"), async (req, res) => {
    const { name, position, grade_level, partylist_id, category, term_id, voting_restriction } = req.body;
    const updateData: any = {
      name, position, grade_level, 
      partylist_id: partylist_id || null, 
      category, term_id, 
      voting_restriction: voting_restriction || 'everyone'
    };

    if (req.file) {
      try {
        updateData.image_url = await uploadToSupabase(req.file);
      } catch (err: any) {
        return res.status(500).json({ success: false, message: "Upload failed: " + err.message });
      }
    }

    const { error } = await supabase.from('candidates').update(updateData).eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.post("/api/vote", async (req, res) => {
    const { student_id, votes } = req.body;
    
    const { data: student } = await supabase.from('students').select('has_voted').eq('id', student_id).single();
    if (student?.has_voted) {
      return res.status(400).json({ success: false, message: "Already voted" });
    }

    const voteInserts = votes.map((v: any) => ({
      student_id,
      candidate_id: v.candidate_id,
      position: v.position
    }));

    const { error: voteError } = await supabase.from('votes').insert(voteInserts);
    if (voteError) return res.status(500).json({ success: false, message: voteError.message });
    
    const { error: studentError } = await supabase.from('students').update({ has_voted: true }).eq('id', student_id);
    if (studentError) return res.status(500).json({ success: false, message: studentError.message });
    
    res.json({ success: true });
  });

  app.get("/api/voting-stats", async (req, res) => {
    try {
      console.log("Fetching voting stats...");
      // Get active term
      const { data: activeTerm } = await supabase.from('terms').select('id').eq('is_active', true).maybeSingle();
      
      const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: votedCount } = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('has_voted', true);
      
      // Fetch candidates
      const candidates = await fetchAll('candidates', '*, partylists(name)', (q) => {
        if (activeTerm) return q.eq('term_id', activeTerm.id);
        return q;
      });
      
      // Fetch ALL votes to ensure we don't miss anything
      // We'll filter them in memory to match the candidates
      const votes = await fetchAll('votes', 'candidate_id');
      
      console.log(`Calculating results for ${candidates.length} candidates using ${votes.length} total votes`);
      if (candidates.length > 0 && votes.length > 0) {
        console.log("Sample Candidate ID:", candidates[0].id, typeof candidates[0].id);
        console.log("Sample Vote Candidate ID:", votes[0].candidate_id, typeof votes[0].candidate_id);
      }
      
      const results = candidates.map(c => {
        // Use loose equality or cast to string to ensure match
        const count = votes.filter(v => String(v.candidate_id) === String(c.id)).length || 0;
        return { 
          ...c, 
          votes: count,
          partylist_name: c.partylists?.name || 'Independent'
        };
      });
      
      // Fetch all students to get accurate turnout by grade level
      const voters = await fetchAll('students', 'id, name, year, section, has_voted, student_number');
      
      res.json({ 
        totalStudents: totalStudents || 0, 
        votedCount: votedCount || 0, 
        results, 
        voters 
      });
    } catch (error: any) {
      console.error("Error in voting-stats:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Settings
  app.post("/api/settings/logo", upload.single("logo"), async (req, res) => {
    const { key } = req.body;
    if (req.file) {
      try {
        const url = await uploadToSupabase(req.file);
        await supabase.from('settings').update({ value: url }).eq('key', key);
        res.json({ success: true, url });
      } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
      }
    } else {
      res.status(400).json({ success: false });
    }
  });

  app.delete("/api/settings/logo/:key", async (req, res) => {
    await supabase.from('settings').update({ value: '' }).eq('key', req.params.key);
    res.json({ success: true });
  });

  app.get("/api/settings", async (req, res) => {
    const { data } = await supabase.from('settings').select('*');
    const obj = data?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || {};
    res.json(obj);
  });

  app.post("/api/settings/voting-restriction", async (req, res) => {
    const { value } = req.body;
    await supabase.from('settings').update({ value }).eq('key', 'voting_restriction');
    res.json({ success: true });
  });

  app.post("/api/settings/change-password", async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { data: adminPass } = await supabase.from('settings').select('value').eq('key', 'admin_password').single();
    
    if (currentPassword !== adminPass?.value) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }
    
    await supabase.from('settings').update({ value: newPassword }).eq('key', 'admin_password');
    res.json({ success: true });
  });

  // Sections
  app.get("/api/sections", async (req, res) => {
    const { data } = await supabase.from('sections').select('*').order('year').order('name');
    res.json(data || []);
  });

  app.post("/api/sections", async (req, res) => {
    const { year, name } = req.body;
    await supabase.from('sections').insert([{ year, name }]);
    res.json({ success: true });
  });

  app.delete("/api/sections/:id", async (req, res) => {
    await supabase.from('sections').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  app.post("/api/students", async (req, res) => {
    const { student_number, name, year, section } = req.body;
    const { error } = await supabase.from('students').insert([{ student_number, name, year, section }]);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.delete("/api/students/:id", async (req, res) => {
    await supabase.from('students').delete().eq('id', req.params.id);
    res.json({ success: true });
  });

  app.post("/api/students/:id/reset-vote", async (req, res) => {
    await supabase.from('votes').delete().eq('student_id', req.params.id);
    await supabase.from('students').update({ has_voted: false }).eq('id', req.params.id);
    res.json({ success: true });
  });

  app.post("/api/students/reset-all-votes", async (req, res) => {
    await supabase.from('votes').delete().neq('id', -1);
    await supabase.from('students').update({ has_voted: false }).neq('id', -1);
    res.json({ success: true });
  });

  app.post("/api/students/clear-all", async (req, res) => {
    await supabase.from('votes').delete().neq('id', -1);
    await supabase.from('students').delete().neq('id', -1);
    res.json({ success: true });
  });

  app.post("/api/upload-students", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false });
    const fileContent = req.file.buffer.toString("utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const students = records.map((s: any) => ({
      student_number: s.student_number || s['Student Number'] || s['ID Number'],
      name: s.name || s['Name'] || '',
      year: s.year || s['Year'] || s['Grade'] || '',
      section: s.section || s['Section'] || ''
    }));

    const { error } = await supabase.from('students').upsert(students, { onConflict: 'student_number' });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, count: records.length });
  });

  // Inquiries
  app.post("/api/inquiries", async (req, res) => {
    const { name, email, subject, message } = req.body;
    const { error } = await supabase.from('inquiries').insert([{ name, email, subject, message }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.get("/api/inquiries", async (req, res) => {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.delete("/api/inquiries/:id", async (req, res) => {
    const { error } = await supabase.from('inquiries').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  // Suggestions
  app.post("/api/suggestions", async (req, res) => {
    const { category, content, is_anonymous, student_id } = req.body;
    const { error } = await supabase.from('suggestions').insert([{ 
      category, 
      content, 
      is_anonymous, 
      student_id: is_anonymous ? null : student_id 
    }]);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
  });

  app.get("/api/suggestions", async (req, res) => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*, students(name, year, section)')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json(data);
  });

  app.delete("/api/suggestions/:id", async (req, res) => {
    const { error } = await supabase.from('suggestions').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true });
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
