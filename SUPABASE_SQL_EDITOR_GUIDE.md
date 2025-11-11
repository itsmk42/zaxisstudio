# Supabase SQL Editor - Step-by-Step Guide

## How to Access Supabase SQL Editor

### Step 1: Login to Supabase
1. Open browser and go to: **https://app.supabase.com**
2. Login with your email and password
3. You should see your projects list

### Step 2: Select Your Project
1. Look for **"zaxisstudio"** in the projects list
2. Click on it to open the project dashboard

### Step 3: Open SQL Editor
1. In the left sidebar, look for **"SQL Editor"** (under "Development" section)
2. Click on **"SQL Editor"**
3. You should see a blank query editor

### Step 4: Create New Query
1. Click the **"New Query"** button (or the "+" icon)
2. A new blank query window will open
3. You're ready to paste SQL code

---

## How to Run SQL Commands

### Method 1: Using the Run Button
1. Paste your SQL code into the editor
2. Click the blue **"Run"** button in the top right
3. Wait for the query to execute
4. You'll see results below

### Method 2: Using Keyboard Shortcut
1. Paste your SQL code into the editor
2. Press **`Ctrl+Enter`** (Windows/Linux) or **`Cmd+Enter`** (Mac)
3. Query executes immediately

### Method 3: Run Multiple Queries
1. If you have multiple SQL statements separated by semicolons
2. Click **"Run"** to execute all of them
3. Results will show for each query

---

## Step-by-Step: Create Categories Table

### Step 1: Copy the SQL Code
Copy this entire block:

```sql
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
```

### Step 2: Open SQL Editor
1. Go to https://app.supabase.com
2. Select "zaxisstudio" project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"

### Step 3: Paste the Code
1. Click in the editor area
2. Press **`Ctrl+A`** to select all (if there's existing text)
3. Press **`Ctrl+V`** to paste the SQL code
4. The code should now be in the editor

### Step 4: Run the Query
1. Click the blue **"Run"** button
2. Wait 2-3 seconds for execution
3. You should see: **"Success"** message

### Step 5: Verify Success
1. You should see no error messages
2. The query execution time will be shown
3. Status should show "Success"

---

## Verification: Check if Table Exists

### After Creating the Table

Run this verification query:

```sql
SELECT * FROM public.categories;
```

**Expected Result:**
- Query runs without error
- Shows: `(0 rows)` - This is correct! Table exists but is empty
- No error message like "table does not exist"

---

## Common Issues & Solutions

### Issue 1: "Syntax Error"
**Cause:** SQL code has typo or formatting issue

**Solution:**
1. Check for missing semicolons at end of statements
2. Check for missing commas between columns
3. Copy the code again from the provided files
4. Make sure you're using the exact code provided

### Issue 2: "Permission Denied"
**Cause:** You don't have admin access to the project

**Solution:**
1. Make sure you're logged in as the project owner
2. Check your Supabase account permissions
3. Ask the project owner to run the SQL

### Issue 3: "Table Already Exists"
**Cause:** The table was already created

**Solution:**
1. This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
2. It won't recreate the table
3. Just run the verification query to confirm it exists

### Issue 4: Query Doesn't Run
**Cause:** Editor might be frozen or not responding

**Solution:**
1. Refresh the page: Press `F5`
2. Wait 10 seconds
3. Try again
4. If still not working, try a different browser

### Issue 5: Can't Find SQL Editor
**Cause:** Sidebar might be collapsed or you're in wrong section

**Solution:**
1. Look for menu icon (three horizontal lines) in top left
2. Click it to expand sidebar
3. Scroll down in sidebar to find "SQL Editor"
4. It should be under "Development" section

---

## Running Multiple Tables at Once

If you want to create all 4 tables at once:

1. Copy the entire `database-setup.sql` file content
2. Paste it into SQL Editor
3. Click "Run"
4. Wait for all queries to complete
5. You should see "Success" for each table creation

---

## Viewing Table Data

### View All Data in a Table
```sql
SELECT * FROM public.categories;
```

### View Specific Columns
```sql
SELECT id, name FROM public.categories;
```

### View with Conditions
```sql
SELECT * FROM public.categories WHERE name = 'Keychains';
```

### Count Rows
```sql
SELECT COUNT(*) as total_rows FROM public.categories;
```

---

## Editing Tables After Creation

### Add a New Column
```sql
ALTER TABLE public.categories ADD COLUMN slug VARCHAR(255);
```

### Rename a Column
```sql
ALTER TABLE public.categories RENAME COLUMN description TO category_description;
```

### Delete a Column
```sql
ALTER TABLE public.categories DROP COLUMN description;
```

### Change Column Type
```sql
ALTER TABLE public.categories ALTER COLUMN name TYPE TEXT;
```

---

## Useful SQL Commands

### List All Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### View Table Structure
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
```

### Delete All Data (Keep Table)
```sql
DELETE FROM public.categories;
```

### Drop Table (Delete Everything)
```sql
DROP TABLE IF EXISTS public.categories;
```

---

## Tips & Best Practices

1. **Always use `IF NOT EXISTS`** - Prevents errors if table already exists
2. **Use semicolons** - End each SQL statement with `;`
3. **Test queries first** - Run verification queries after creating tables
4. **Keep backups** - Save your SQL scripts in version control
5. **Use meaningful names** - Table and column names should be descriptive
6. **Add indexes** - Improves query performance on large tables
7. **Enable RLS** - Always enable Row Level Security for security

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` / `Cmd+Enter` | Run query |
| `Ctrl+A` | Select all |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+F` | Find |
| `Ctrl+H` | Find & Replace |

---

## Need Help?

1. Check the error message carefully
2. Review the SQL syntax
3. Verify table names are correct
4. Check column names and data types
5. Look at the provided SQL files for reference
6. Visit Supabase docs: https://supabase.com/docs

---

## Next Steps After Creating Tables

1. ✅ Create all tables using SQL
2. ✅ Verify tables exist using verification queries
3. ✅ Restart your development server: `npm run dev`
4. ✅ Test admin panel:
   - Add a category
   - Add a product
   - Add carousel slide
5. ✅ Verify no errors appear

Done! 🎉

