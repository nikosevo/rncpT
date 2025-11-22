# Research Paper Automation Tool

A modern web application that transforms informal bullet points into professionally formatted scientific papers using AI assistance.

## 🎯 What It Does

This app helps researchers and academics write scientific papers more efficiently by:

- **Converting bullet points to formal prose**: Write informal notes, get polished scientific paragraphs
- **Live PDF preview**: See your formatted paper in real-time as you write
- **LaTeX math support**: Automatically formats mathematical expressions properly
- **Draft management**: Save, update, and organize multiple paper drafts
- **AI chat assistant**: Get help with writing, equations, and scientific content

## ✨ Key Features

### 1. **Smart Editor**
- Add multiple sections to your paper
- Write informal bullet points or notes
- Specify citations for each section
- Auto-save drafts to Supabase

### 2. **AI-Powered Formatting**
- Converts your bullet points into formal scientific paragraphs
- Uses local LLM (Ollama with Phi-3) for privacy
- Maintains scientific rigor and proper terminology
- Formats mathematical expressions with LaTeX

### 3. **Live Preview**
- Real-time preview of your formatted paper
- Professional academic styling
- Automatic formatting updates as you type

### 4. **AI Chat Assistant**
- Ask questions about your research
- Get help with equations and formulas
- Receive suggestions for improving your writing
- All responses in proper scientific format

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Ollama** with Phi-3 model installed
3. **Supabase account** (for authentication and storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rncpT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Run this SQL in your Supabase SQL editor:
   ```sql
   -- Create drafts table
   CREATE TABLE drafts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     sections JSONB DEFAULT '[]'::jsonb,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

   -- Create policy for users to manage their own drafts
   CREATE POLICY "Users can manage their own drafts"
   ON drafts
   FOR ALL
   USING (auth.uid() = user_id);
   ```

5. **Install and run Ollama**
   
   ```bash
   # Install Ollama (visit https://ollama.ai)
   
   # Pull the Phi-3 model
   ollama pull phi3
   
   # Start Ollama (it runs as a service)
   ollama serve
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📖 How to Use

### Writing Your First Paper

1. **Login** with your email and password (or create an account)

2. **Create sections** 
   - Click "Add Section" in the editor
   - Give your section a title (e.g., "Introduction", "Methods")

3. **Write bullet points**
   - Add informal notes or bullet points
   - Include any mathematical expressions using LaTeX syntax
   - Example: `- Energy equation: E = mc^2`

4. **See the magic happen**
   - After 2 seconds, the AI processes your content
   - Watch the preview panel show formatted scientific paragraphs
   - Your bullet points become polished prose!

5. **Save your work**
   - Click "Update Draft" to save changes
   - Your draft is stored in Supabase

### Using the Chat Assistant

1. Click on the chat panel (right side)
2. Ask questions like:
   - "Help me write an introduction about quantum mechanics"
   - "Format this equation: integral from 0 to infinity"
   - "Improve this paragraph: [paste your text]"
3. Get formatted scientific responses with proper LaTeX

### Managing Drafts

- **Create**: Start writing and click "Update Draft"
- **Update**: Edit your content and click "Update Draft" again
- **Load**: Your drafts are automatically loaded when you login

## 🔧 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: Ollama (Phi-3 model, runs locally)
- **Icons**: Lucide React

## 🎨 Features in Detail

### LaTeX Math Support

The app automatically formats mathematical expressions:

- **Inline math**: `$E = mc^2$` → $E = mc^2$
- **Display equations**: `$$\int_0^\infty e^{-x^2} dx$$` → Centered equation
- **Greek letters**: `$\alpha, \beta, \gamma$`
- **Fractions**: `$\frac{a}{b}$`
- **Integrals**: `$\int, \sum, \prod$`

### AI Prompt Engineering

The LLM is instructed to:
- Use only the information you provide (no hallucinations)
- Keep paragraphs concise and focused
- Maintain formal academic tone
- Format all math with proper LaTeX
- Never return bullet points in output

## 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own drafts
- **Supabase Auth**: Secure authentication with email/password
- **Local LLM**: Your research data stays on your machine
- **Environment variables**: Sensitive keys stored in `.env`

## 🐛 Troubleshooting

### "Couldn't connect to local LLM"
- Make sure Ollama is running: `ollama serve`
- Verify Phi-3 is installed: `ollama list`
- Check Ollama is on port 11434

### "Authentication error"
- Verify your `.env` file has correct Supabase credentials
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Preview not updating
- Wait 2 seconds after typing (debounce delay)
- Check browser console for errors
- Verify Ollama is responding

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ for researchers who want to write better papers faster**
