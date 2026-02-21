<h1 align="center">🦊 FoxBrain AI</h1>
<h3 align="center"><em>RAG-Powered AI Agent & Knowledge Assistant for Team Foxtrot GIKI</em></h3>

<p align="center">
  <img src="https://img.shields.io/badge/n8n-Workflow%20Automation-FF6D5A?style=flat-square&logo=n8n&logoColor=white" />
  <img src="https://img.shields.io/badge/Oracle%20Cloud-n8n%20Hosting-F80000?style=flat-square&logo=oracle&logoColor=white" />
  <img src="https://img.shields.io/badge/Caddy-SSL%2FTLS-004820?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" />
</p>

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Data Ingestion Pipeline](#-data-ingestion-pipeline)
  - [Parent Workflow](#parent-workflow--foxtrot_dataflow_parent)
  - [Child Workflow](#child-workflow--foxtrot_dataflow_child)
- [Deploying to Vercel](#-deploying-to-vercel-password-reset)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 The Problem

**Team Foxtrot** is a multidisciplinary engineering team at **GIKI (Ghulam Ishaq Khan Institute)** with subteams spanning Software Development and Embedded Systems (SDES). The team maintains a growing number of repositories containing Python scripts, Lua autopilot code, Jupyter notebooks, drone waypoint files, configuration files, and extensive documentation.

Every year, **freshers (new recruits)** face a recurring set of challenges:

| Pain Point | Description |
|---|---|
| **Information Overload** | Dozens of repositories with thousands of files — no single entry point to understand what's going on. |
| **Lack of Technical Depth** | Freshers often don't have the background to understand the projects at first glance, even after senior members explain them. |
| **Fear of Asking Again** | Many freshers feel **shy or hesitant** to ask seniors to re-explain concepts they didn't fully grasp the first time. |
| **Knowledge Silos** | Tribal knowledge lives in the heads of senior members and gets lost when they graduate. |
| **Onboarding Bottleneck** | Seniors spend significant time repeatedly answering the same foundational questions every recruitment cycle. |

This creates a **knowledge gap** that slows down onboarding, reduces productivity, and makes it harder for new members to contribute meaningfully to ongoing projects.

---

## 💡 The Solution

**FoxBrain** is an AI-powered **Retrieval-Augmented Generation (RAG) chatbot** that serves as an always-available, intelligent knowledge assistant for Team Foxtrot.

Instead of asking a senior (and feeling awkward about it), freshers can simply **ask FoxBrain**:

> *"How does the PID controller work in our drone autopilot?"*
> *"What does the `mission_planner.py` script do?"*
> *"Explain the communication protocol between the ground station and the drone."*

FoxBrain will:
1. **Search** through all of Team Foxtrot's GitHub repositories
2. **Retrieve** the most relevant code snippets, documentation, and notebooks
3. **Generate** a clear, context-aware answer using Google Gemini LLM
4. **Remember** conversation context for natural follow-up questions

### Key Benefits

- 🕐 **Available 24/7** — No need to wait for a senior to be free
- 🤫 **No Judgment** — Ask the same question 100 times without feeling shy
- 📚 **Always Up-to-Date** — Automatically ingests the latest code from GitHub
- 🧠 **Context-Aware** — Understands code, docs, and notebooks in depth
- 💬 **Conversational** — Maintains chat history for natural dialogue

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FoxBrain Architecture                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐    ┌──────────────────────┐    ┌─────────────────┐  │
│   │  GitHub   │───▶│  n8n (Oracle Cloud)  │───▶│  Pinecone       │  │
│   │  Repos    │    │  + Caddy (SSL/TLS)   │    │  Vector DB      │  │
│   └──────────┘    └──────────┬───────────┘    └────────┬────────┘  │
│                              │                           │          │
│                              ▼                           ▼          │
│   ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   │  React Frontend  │───▶│  RAG Agent (n8n)  │◀───│  Supabase       │
│   │  (Vercel)        │    │  + Gemini LLM     │    │  DB + Auth      │
│   └──────────────────┘    └──────────────────┘    └─────────────────┘
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SDES_Chatbot/
│
├── 📄 README.md                              # Documentation
├── 📄 LICENSE                                 # Project license
├── 🤖 RAGAgent.json                          # n8n RAG Agent workflow
├── Backend/
│   ├── RAGAgent.json                         # RAG Agent configuration
│   └── Dataflow/
│       ├── Foxtrot_DataFlow_Parent.json      # Parent orchestrator workflow
│       └── Foxtrot_DataFlow_Child.json       # Per-repo processing workflow
│
└── Frontend/
    ├── src/                                  # React source code
    ├── package.json                          # Frontend dependencies
    └── [other frontend config files]         # TypeScript, Vite, Tailwind configs
```

---

## 🛠 Tech Stack

### **Backend & Automation**

| Technology | Purpose |
|---|---|
| **n8n** | Workflow automation for data ingestion pipeline and RAG agent orchestration |
| **Oracle Cloud** | Hosting platform for n8n workflows |
| **Caddy** | Reverse proxy and automatic SSL/TLS for n8n |
| **Pinecone** | Vector database for document embeddings and RAG retrieval |
| **Google Gemini** | LLM for generating answers |
| **HuggingFace Inference API** | Embedding generation for document chunks |
| **GitHub API** | Source repository access for automated knowledge ingestion |

### **Frontend**

| Technology | Purpose |
|---|---|
| **React 18** | Core frontend framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool and development server |
| **TailwindCSS** | Utility-first CSS framework |
| **shadcn/ui** | Reusable UI components library |
| **Vercel** | Frontend hosting and deployment |

### **Database & Authentication**

| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database for conversations and user data |
| **Supabase Auth** | User authentication, signup, login, and password reset |

### **Infrastructure**

| Technology | Purpose |
|---|---|
| **Oracle Cloud** | n8n server hosting |
| **Caddy** | TLS termination and reverse proxy for n8n |
| **Vercel** | Frontend hosting |
| **GitHub** | Source code and version control |

---

## 🔄 Data Ingestion Pipeline

The data pipeline is built using **n8n** workflows in a **Parent-Child architecture** to systematically crawl all repositories in the `Team-Foxtrot-GIKI` GitHub organization, extract relevant files, and embed them into the Pinecone vector database for retrieval by the RAG agent.

### Parent Workflow — `Foxtrot_DataFlow_Parent`

The orchestrator workflow that manages the entire ingestion process across all repositories.

**Purpose:** Fetches all repositories from the GitHub organization and schedules them for processing.

**Flow:**
```
Manual/Scheduled Trigger
         │
         ▼
Fetch All Repos (GitHub API)
         │
         ▼
Loop Over Each Repository
         │
         ▼
Call Child Workflow (per repo)
         │
         ▼
   (repeat for all repos)
```

**Key Features:**
- Iterates through all repositories in `Team-Foxtrot-GIKI` organization
- Calls the Child Workflow for each repository sequentially
- Error handling with retry logic enabled
- Returns summary of processed repositories

**Configuration:**
| Property | Value |
|---|---|
| **Organization** | `Team-Foxtrot-GIKI` |
| **Processing Mode** | Sequential (one repo at a time) |
| **Child Workflow** | `Foxtrot_DataFlow_Child` |
| **Error Handling** | Retry enabled with fallback |
| **Est. Runtime** | ~5–10 minutes per repository |

---

### Child Workflow — `Foxtrot_DataFlow_Child`

The worker workflow that processes a **single repository** end-to-end, from file discovery through vector embedding.

**Purpose:** Extracts supported file types from a repository and embeds them into Pinecone.

**Flow:**
```
Receive Repository Info
         │
         ▼
List Repository Contents (GitHub API)
         │
         ▼
    Branch by Type
    │                  │
    │ (Directories)    │ (Files)
    ▼                  ▼
Apply Dir Filter    Apply File Type Filter
    │                  │
    ▼                  ▼
(Recurse)          Fetch File Content
                        │
                        ▼
                   Embed into Pinecone
                   (with metadata)
```

**Processing Steps:**

1. **Directory Traversal** — Recursively list all files in the repository
2. **Directory Filtering** — Skip excluded directories to reduce noise
3. **File Type Filtering** — Only process supported file extensions
4. **Content Extraction** — Fetch file content from GitHub
5. **Embedding & Storage** — Convert file content to embeddings using HuggingFace API and store in Pinecone

---

### Excluded Directories

The following directories are **automatically skipped** to avoid processing unnecessary files:

```
.git              # Git metadata
.venv / env       # Virtual environments
__pycache__       # Python cache
site-packages     # Python packages
node_modules      # NPM dependencies
dist-info         # Distribution metadata
PackageCache      # Package cache
Artifacts         # Build artifacts
Logs              # Log files
UserSettings      # User-specific settings
assets            # Asset files
Plugins           # Plugin directories
Library           # Library directories
mavlink           # Drone protocol files
.github           # GitHub configuration
```

---

### Supported File Types

The pipeline processes the following file types to build the knowledge base:

| Extension | Type | Purpose |
|---|---|---|
| `.py` | Python source code | Team Foxtrot's primary language for UAV autopilot and utilities |
| `.md` | Markdown documentation | README files, guides, and inline documentation |
| `.lua` | Lua scripts | Drone autopilot scripting language |
| `.txt` | Plain text files | Configuration and documentation files |
| `.yaml` / `.yml` | Configuration files | Workflow and system configurations |
| `.ipynb` | Jupyter Notebooks | Data analysis and research notebooks |
| `.waypoints` | Drone waypoint files | UAV mission planning files |

**Excluded Types:** Images (`.png`, `.jpg`), binaries, `.docx`, compressed files, `.json` (to reduce noise), and other unsupported formats are automatically discarded.

---

### Vector Storage Configuration

**Database:** Pinecone  
**Index Name:** `foxtrot`  
**Namespace Strategy:** One namespace per repository (e.g., `autopilot`, `mission-planner`)  
**Embedding Model:** HuggingFace Inference API  
**Document Metadata:** File name, repository, file type, and content

Each embedded document includes:
- Original file content
- File path and repository name
- File type and extension
- Timestamp of ingestion

This enables the RAG agent to retrieve relevant code snippets with full context.

---

## 🤝 Contributing

This project is maintained by the **SDES (Software Development & Embedded Systems) subteam** of **Team Foxtrot, GIKI**.

If you're a team member and want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

<p align="center">
  <em>Because no question is a dumb question, especially when a bot is answering it. 🦊</em>
  <br/>
  <b>Team Foxtrot GIKI — SDES Subteam</b>
</p>
