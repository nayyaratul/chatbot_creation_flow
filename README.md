# Chatbot Creation Flow

A comprehensive chatbot creation system with a listing page, multi-step creation wizard, live preview, and knowledge base selection.

## Features

- **Agent Listing Page**: View all agents with sorting, filtering, and quick actions
- **4-Step Creation Wizard**:
  1. Identity & Purpose
  2. Behavior & Conversation Settings
  3. Knowledge Base Selection
  4. Summary & Quick Test
- **Live Preview**: Real-time preview of agent configuration
- **Preview Drawer**: Test agents directly from the listing page
- **Knowledge Base Management**: Select and attach knowledge base files
- **System Prompt Generation**: Auto-generated system prompts based on configuration

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- JSON file storage (for MVP)

### Frontend
- React + TypeScript
- Vite
- Ant Design v5
- React Router

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create the data directory (if it doesn't exist):
```bash
mkdir -p src/data
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
/backend
  /src
    /routes          # API routes
    /services         # Business logic
    /models           # Data models
    /middleware       # Auth middleware
    /data             # JSON file storage
    /utils            # Utility functions

/frontend
  /src
    /pages            # Page components
    /components       # Reusable components
      /agents         # Agent-related components
      /wizard         # Wizard step components
      /shared         # Shared components
    /services         # API client
    /types            # TypeScript types
    /utils            # Utility functions
```

## API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Knowledge Bases
- `GET /api/knowledge-bases` - List all knowledge bases (with filters)
- `GET /api/knowledge-bases/:id` - Get knowledge base by ID

### Preview
- `POST /api/preview` - Generate preview response

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000/agents`
3. Click "Create Agent" to start the wizard
4. Complete all 4 steps:
   - Step 1: Enter agent identity and purpose
   - Step 2: Configure behavior and conversation settings
   - Step 3: Select knowledge base files
   - Step 4: Review summary and test the agent
5. Click "Create Agent" or "Save as Draft" to save

## Features in Detail

### Agent Listing
- View all agents in a sortable table
- Preview agents in a slide-over drawer
- Edit or delete agents
- Filter by status, owner, etc.

### Creation Wizard
- Step-by-step guided flow
- Live preview panel on the right
- Form validation at each step
- Ability to go back and edit previous steps

### Preview System
- Real-time preview of agent responses
- Test chat interface
- System prompt preview
- Sample response generation

## Development Notes

- The project uses mock authentication (hardcoded user)
- Knowledge bases are stored as JSON files
- LLM preview uses mock responses based on configuration
- All data is stored in JSON files (backend/src/data/)

## Future Enhancements

- Real LLM integration (OpenAI/Azure OpenAI)
- Database integration (PostgreSQL/MongoDB)
- Real file upload and storage
- Multi-language support
- Voice mode
- Analytics and logging
- Advanced guardrails
- KB versioning
