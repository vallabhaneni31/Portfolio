/**
 * All portfolio content lives here. Every statement comes from verified background.
 * Edit this file to change copy; components never hardcode facts.
 *
 * Client names and confidential product names are intentionally generic.
 * Metrics are only listed where a real, stated number exists.
 */

export const profile = {
  name: 'Karthik',
  fullName: 'Vallabhaneni Uma Venkata Karthik',
  role: 'Associate Data Scientist',
  org: 'Motivity Labs',
  since: 'July 2025',
  statement:
    'I turn AI prototypes into systems that run: edge vision on Jetson, voice agents on phone lines, private LLMs on premises.',
  links: {
    github: 'https://github.com/VUVKC9999',
    linkedin: 'https://www.linkedin.com/in/v-u-v-karthik',
    /** Add an address to show an email action in the closing scene. */
    email: '',
    /** Drop a file in /public and set e.g. '/resume.pdf' to show a resume action. */
    resume: '',
  },
};

export const chapters = [
  { id: 'intro', n: '01', title: 'The introduction' },
  { id: 'journey', n: '02', title: 'The journey' },
  { id: 'universe', n: '03', title: 'The engineering universe' },
  { id: 'projects', n: '04', title: 'The projects' },
  { id: 'engineering', n: '05', title: 'Behind the engineering' },
  { id: 'mindset', n: '06', title: "The builder's mindset" },
  { id: 'beyond', n: '07', title: 'Beyond the code' },
  { id: 'contact', n: '08', title: "Let's build something" },
] as const;

export const introFacts = [
  { k: 'Role', v: 'Associate Data Scientist at Motivity Labs since July 2025, after a March to June 2025 AI/ML internship there.' },
  { k: 'Scope', v: 'A Center of Excellence team, working across the full lifecycle: planning, requirements, architecture, development, testing, deployment and maintenance.' },
  { k: 'Teaching', v: 'Trained 40+ interns and freshers.' },
];

export const introStatement =
  'The job is the whole system, not a slice of it. I describe my work as production-grade forward deployed engineering: requirements, architecture, code, testing, deployment, and what happens after.';

export const journey = [
  {
    period: '2021 to 2025',
    title: 'B.Tech, Data Science and Artificial Intelligence',
    org: 'ICFAI Foundation for Higher Education, Hyderabad',
    note: 'The foundation: data science and AI as a degree, four years in Hyderabad.',
  },
  {
    period: 'Jun to Jul 2023',
    title: 'Intern',
    org: 'SaNa Software Services',
    note: 'First time inside a software team.',
  },
  {
    period: 'Dec 2024 to Feb 2025',
    title: 'Software Engineer Intern',
    org: 'Genesys Info X',
    note: 'MERN stack and Node.js. Web engineering fundamentals that later carried into frontend and API work.',
  },
  {
    period: 'Mar to Jun 2025',
    title: 'AI/ML Intern',
    org: 'Motivity Labs',
    note: 'Moved from web engineering to applied AI, on the team I would later join full time.',
  },
  {
    period: 'Jul 2025 to now',
    title: 'Associate Data Scientist',
    org: 'Motivity Labs',
    note: 'On the Facial Recognition System project and a Center of Excellence team. Scope grew from models to edge development, frontend, technical documentation, project tooling in Azure DevOps and training 40+ interns and freshers.',
  },
];

export type Tier = 'built' | 'evaluated' | 'studied';

export const tiers: Record<Tier, { label: string; hint: string }> = {
  built: { label: 'Built with', hint: 'Used in work I shipped or prototyped.' },
  evaluated: { label: 'Evaluated or documented', hint: 'Tested, compared, or written into architecture decisions.' },
  studied: { label: 'Studied', hint: 'Coursework and certifications.' },
};

export const categories = [
  { id: 'ai', label: 'AI and machine learning' },
  { id: 'cv', label: 'Computer vision' },
  { id: 'backend', label: 'Backend and APIs' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'cloud', label: 'Cloud and containers' },
  { id: 'data', label: 'Data systems' },
  { id: 'edge', label: 'Edge AI' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export interface Tech {
  id: string;
  label: string;
  cat: CategoryId;
  tier: Tier;
  evidence: string;
  projects: string[];
}

export const tech: Tech[] = [
  // AI
  { id: 'gemini', label: 'Gemini', cat: 'ai', tier: 'built', evidence: 'Core LLM in the recruitment copilot and in the voice agent.', projects: ['recruit', 'voice'] },
  { id: 'rag', label: 'RAG', cat: 'ai', tier: 'built', evidence: 'Retrieval over menus, company knowledge bases and legal documents.', projects: ['rag', 'voice', 'judicial'] },
  { id: 'langgraph', label: 'LangGraph', cat: 'ai', tier: 'built', evidence: 'Orchestrates intent checks, retrieval, reasoning and validation.', projects: ['judicial'] },
  { id: 'ollama', label: 'Ollama', cat: 'ai', tier: 'built', evidence: 'Local model runtime for private inference and Jetson model testing.', projects: ['judicial', 'jetsonllm'] },
  { id: 'azureopenai', label: 'Azure OpenAI', cat: 'ai', tier: 'built', evidence: 'AI/ML support for an internal company accelerator.', projects: ['recruit'] },
  { id: 'st', label: 'SentenceTransformers', cat: 'ai', tier: 'built', evidence: 'MiniLM-L6-v2 embeddings for retrieval.', projects: ['rag', 'voice'] },
  { id: 'genai', label: 'Generative AI', cat: 'ai', tier: 'studied', evidence: 'Google Cloud Intro to Generative AI (2024), Prompt Design, IBM Prompt Engineering Basics.', projects: [] },
  // CV
  { id: 'yolo', label: 'YOLOv8n-Face', cat: 'cv', tier: 'evaluated', evidence: 'Face detection stage in the FRS Jetson stack, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'adaface', label: 'AdaFace R100', cat: 'cv', tier: 'evaluated', evidence: 'Face embedding model in the FRS stack, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'busvideo', label: 'Video analytics', cat: 'cv', tier: 'evaluated', evidence: 'Architecture comparison for a fleet-scale facial recognition and occupancy PoC.', projects: ['bus'] },
  // Backend
  { id: 'fastapi', label: 'FastAPI', cat: 'backend', tier: 'built', evidence: 'Backend for the recruitment copilot and the judicial assistant.', projects: ['recruit', 'judicial'] },
  { id: 'keycloak', label: 'Keycloak', cat: 'backend', tier: 'built', evidence: 'Per-tenant sign-in realms with enforced second factor for privileged roles.', projects: ['agentic'] },
  { id: 'openfga', label: 'OpenFGA', cat: 'backend', tier: 'built', evidence: 'Relationship-based permissions, one store per tenant, with a drift test.', projects: ['agentic'] },
  { id: 'flask', label: 'Flask', cat: 'backend', tier: 'built', evidence: 'Telephony webhook for the voice agent.', projects: ['voice'] },
  { id: 'websocket', label: 'WebSockets', cat: 'backend', tier: 'built', evidence: 'Streams caller audio to speech recognition and synthesized speech back.', projects: ['voice'] },
  { id: 'node', label: 'Node.js and MERN', cat: 'backend', tier: 'built', evidence: 'Software engineering internship at Genesys Info X.', projects: [] },
  { id: 'python', label: 'Python', cat: 'backend', tier: 'built', evidence: 'Primary language across AI, backend and document automation work.', projects: ['recruit', 'voice', 'rag', 'judicial', 'frs'] },
  // Frontend
  { id: 'react', label: 'React', cat: 'frontend', tier: 'built', evidence: 'Dashboards for recruitment and the judicial assistant, and the canvas frontend of the workflow platform.', projects: ['recruit', 'judicial', 'agentic'] },
  { id: 'ts', label: 'TypeScript', cat: 'frontend', tier: 'built', evidence: 'FRS monorepo, including a multi-tenant login fix.', projects: ['frs', 'agentic'] },
  { id: 'vite', label: 'Vite', cat: 'frontend', tier: 'built', evidence: 'Build tool for the recruitment and judicial frontends.', projects: ['recruit', 'judicial'] },
  // Cloud
  { id: 'docker', label: 'Docker', cat: 'cloud', tier: 'built', evidence: 'Batch communication jobs and isolated model runs.', projects: ['recruit', 'jetsonllm'] },
  { id: 's3', label: 'AWS S3', cat: 'cloud', tier: 'built', evidence: 'Stores images and evidence in FRS.', projects: ['frs'] },
  { id: 'kvs', label: 'AWS Kinesis Video Streams', cat: 'cloud', tier: 'evaluated', evidence: 'Hands-on SDK setup and testing for the bus analytics PoC.', projects: ['bus'] },
  { id: 'gcp', label: 'GCP BigQuery and Firestore', cat: 'cloud', tier: 'built', evidence: 'Data warehouse and real-time sessions for the recruitment copilot.', projects: ['recruit'] },
  { id: 'ado', label: 'Azure DevOps', cat: 'cloud', tier: 'built', evidence: 'Structured the FRS requirements into a full product backlog.', projects: ['frs'] },
  { id: 'azurecicd', label: 'Azure CI/CD', cat: 'cloud', tier: 'built', evidence: 'Hands-on pipelines for deploying AI models to production.', projects: ['recruit'] },
  // Data
  { id: 'postgres', label: 'PostgreSQL', cat: 'data', tier: 'built', evidence: 'Transactional and access-control data in the judicial assistant design, and the workflow platform.', projects: ['judicial', 'agentic'] },
  { id: 'qdrant', label: 'Qdrant', cat: 'data', tier: 'built', evidence: 'Vector search in the judicial assistant.', projects: ['judicial'] },
  { id: 'neo4j', label: 'Neo4j', cat: 'data', tier: 'built', evidence: 'Graph of legal concepts, citations and relationships.', projects: ['judicial'] },
  { id: 'chroma', label: 'ChromaDB', cat: 'data', tier: 'built', evidence: 'Vector store for the voice agent knowledge base.', projects: ['voice'] },
  { id: 'faiss', label: 'FAISS', cat: 'data', tier: 'built', evidence: 'Fast retrieval for the restaurant chatbot.', projects: ['rag'] },
  { id: 'sqlite', label: 'SQLite', cat: 'data', tier: 'evaluated', evidence: 'Local store on the FRS edge box, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'dbdesign', label: 'Database design', cat: 'data', tier: 'studied', evidence: 'UC Irvine Database Design course.', projects: [] },
  // Edge
  { id: 'jetson', label: 'NVIDIA Jetson', cat: 'edge', tier: 'built', evidence: 'FRS edge development and local LLM testing on an Orin Nano.', projects: ['frs', 'jetsonllm', 'bus'] },
  { id: 'trt', label: 'TensorRT', cat: 'edge', tier: 'evaluated', evidence: 'Inference optimization layer in the FRS stack, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'onnx', label: 'ONNX', cat: 'edge', tier: 'evaluated', evidence: 'Model interchange format in the FRS stack, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'gst', label: 'GStreamer', cat: 'edge', tier: 'evaluated', evidence: 'Video pipeline in the FRS stack, recorded in an architecture decision record.', projects: ['frs'] },
  { id: 'cpp', label: 'C++ and CMake', cat: 'edge', tier: 'evaluated', evidence: 'Vision platform codebase in the FRS stack.', projects: ['frs'] },
  { id: 'hailo', label: 'Raspberry Pi 5 + Hailo', cat: 'edge', tier: 'evaluated', evidence: 'Hardware option evaluated for the bus analytics PoC.', projects: ['bus'] },
];

export interface Stage {
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  kicker: string;
  status: string;
  confidential?: boolean;
  problem: string;
  context: string;
  role: string;
  stack: string[];
  architecture: Stage[];
  decisions: { title: string; body: string }[];
  outcomes: string[];
  lessons: string[];
}

export const projects: Project[] = [
  {
    id: 'frs',
    title: 'Facial Recognition System',
    kicker: 'Edge AI on Jetson',
    status: 'Active, at Motivity Labs',
    problem:
      'Recognize faces at the edge, close to the camera, and keep the whole system understandable enough that a team can build, test and maintain it.',
    context:
      'A multi-repo product: a TypeScript monorepo, a JavaScript microservice layer, a C++ vision platform and the edge box itself. Images and evidence live in AWS S3. The edge stack runs on Jetson devices.',
    role:
      'Edge AI development, frontend work, technical documentation and project tooling. I turned the functional requirements document into the Azure DevOps backlog, produced the architecture decision records for the Jetson stack, built the diagrams in the Edge Box technical documentation, and fixed a subdomain-based workspace validation bug in the multi-tenant login flow.',
    stack: ['NVIDIA Jetson', 'YOLOv8n-Face', 'AdaFace R100', 'GStreamer', 'ONNX', 'TensorRT', 'C++ and CMake', 'Python', 'SQLite', 'TypeScript', 'AWS S3', 'Azure DevOps'],
    architecture: [
      { label: 'Camera stream', detail: 'GStreamer pipeline brings frames into the edge box.' },
      { label: 'Face detection', detail: 'YOLOv8n-Face finds faces in each frame.' },
      { label: 'Embedding', detail: 'AdaFace R100 turns a face crop into an embedding.' },
      { label: 'Optimized inference', detail: 'ONNX models run through TensorRT on the Jetson.' },
      { label: 'Local store', detail: 'SQLite holds data on the box.' },
      { label: 'Cloud evidence', detail: 'Images and evidence go to AWS S3 for the product.' },
    ],
    decisions: [
      { title: 'Write every stack choice down', body: 'Ten architecture decision records cover SQLite, YOLOv8n-Face, AdaFace R100, GStreamer, ONNX, TensorRT, C++ with CMake, and Python, so the reasoning outlives the meeting.' },
      { title: 'Source the backlog only from the requirements document', body: 'The backlog contains nothing that is not in the functional requirements document, so every story can be traced back.' },
      { title: 'Ship diagrams that survive any Word version', body: 'Native Word shape XML was unreliable across versions, so diagrams went in as PNGs with a companion editable PowerPoint.' },
    ],
    outcomes: [
      'An Azure DevOps backlog of 85 user stories and 288 tasks, built from the requirements document.',
      'Ten architecture decision records for the Jetson edge stack.',
      'Embedding architecture and data-flow diagrams in the Edge Box technical documentation, with an editable PowerPoint companion.',
      'Fixed the workspace validation bug in the multi-tenant login flow.',
    ],
    lessons: [
      'On an edge product, documentation is a feature: the next engineer is part of the system.',
      'Traceability from requirement to task makes scope conversations short.',
    ],
  },
  {
    id: 'voice',
    title: 'Voice customer-support agent',
    kicker: 'Real-time GenAI on a phone line',
    status: 'Proof of concept',
    confidential: true,
    problem:
      'Let a caller talk to a support agent that answers from the company knowledge base and collects booking details, without a human on the line.',
    context:
      'A client PoC for a freight and trucking company, with a second variant for a dairy company that works in Hindi. Client names are withheld.',
    role:
      'Built the end-to-end pipeline: telephony webhook, streaming speech recognition, retrieval and generation, and streamed speech back to the caller.',
    stack: ['Python', 'Flask', 'WebSockets', 'Deepgram', 'Gemini', 'ChromaDB', 'SentenceTransformers', 'LangChain', 'Supabase'],
    architecture: [
      { label: 'Inbound call', detail: 'A telephony provider hits a Flask webhook.' },
      { label: 'Audio stream', detail: 'Caller audio streams over a WebSocket server.' },
      { label: 'Speech to text', detail: 'Streaming recognition with voice activity detection.' },
      { label: 'Retrieve and answer', detail: 'Gemini answers using retrieval over a ChromaDB knowledge base.' },
      { label: 'Text to speech', detail: 'Synthesized speech streams back to the caller in chunks.' },
    ],
    decisions: [
      { title: 'One session per call', body: 'Each call gets its own ID, chat history, WebSocket mapping and speech client, so callers never see each other.' },
      { title: 'Keep the event loop free', body: 'Blocking SDK calls run in executors so concurrent callers do not stall each other.' },
      { title: 'Prompt-driven booking flow', body: 'The agent collects name, phone, pickup, destination, material and quantity, then suggests a truck type and summarizes.' },
    ],
    outcomes: [
      'Working multi-user pipeline from inbound call to spoken answer.',
      'A second language variant using Hindi speech recognition and synthesis.',
      'Interactions logged for review.',
      'Latency and accuracy are not yet measured, so none are claimed here.',
    ],
    lessons: [
      'Concurrency bugs in voice systems show up as silence. Isolate state per call from day one.',
      'A prototype is honest when it says what it has not measured.',
    ],
  },
  {
    id: 'judicial',
    title: 'Private AI case assistant',
    kicker: 'Confidential, regulated sector',
    status: 'Architecture and major development',
    confidential: true,
    problem:
      'Give judges, court clerks and administrators an assistant that searches case documents, cites its sources and drafts analysis, without any data leaving the premises.',
    context:
      'A confidential engagement, so client, product and country are withheld. Privacy rules out external model APIs, so inference runs locally. The first target is a proof of concept at roughly 1,000 cases, a capacity goal rather than a measured result.',
    role:
      'Architected the platform and did major development: services, AI orchestration, data layer and the role and permission model.',
    stack: ['React', 'Vite', 'FastAPI', 'LangGraph', 'PostgreSQL', 'MinIO', 'Qdrant', 'Neo4j', 'Ollama', 'BGE-M3', 'Keycloak'],
    architecture: [
      { label: 'Ingest', detail: 'Upload, validation, OCR, entity extraction, human review, secure indexing.' },
      { label: 'Stores', detail: 'PostgreSQL for transactions and access control, MinIO for documents, Qdrant for vectors, Neo4j for citations and relationships.' },
      { label: 'Orchestrate', detail: 'LangGraph runs intent and access checks, hybrid retrieval and reranking, reasoning with citations, then validation.' },
      { label: 'Local inference', detail: 'Embeddings, reranking and generation run on local models.' },
      { label: 'Role-aware UI', detail: 'Dashboards for admins, judges and clerks.' },
    ],
    decisions: [
      { title: 'Authorization in layers', body: 'Identity, tenant isolation, role permission, resource policy, workflow policy and audit, with case-level checks rather than roles alone.' },
      { title: 'A permission-code catalog', body: 'Permissions live in one catalog instead of role checks scattered through the code.' },
      { title: 'Local models only', body: 'Private inference instead of external APIs, so documents stay inside the boundary.' },
    ],
    outcomes: [
      'A documented lifecycle from case creation to decision, with a document sub-pipeline.',
      'Three roles with defined permission matrices.',
      'Some parts, such as the full schema and every integration, are baseline designs rather than completed implementations.',
    ],
    lessons: [
      'In regulated work, the authorization model is the product.',
      'Say plainly what is designed and what is built.',
    ],
  },
  {
    id: 'recruit',
    title: 'Recruitment copilot',
    kicker: 'GenAI for hiring workflows',
    status: 'Built at Motivity Labs',
    problem: 'Reduce manual effort in candidate screening, interview evaluation and candidate communication.',
    context: 'An internal AI-powered recruitment platform on Google Cloud, with Azure collaboration on an internal accelerator.',
    role:
      'Designed the assistant and built the backend, dashboard, batch communication and a voice-to-voice interview assistant. Supported the Data Engineering team on the Azure OpenAI accelerator.',
    stack: ['Gemini 2.5 Flash', 'FastAPI', 'BigQuery', 'Firestore', 'React', 'Vite', 'SendGrid', 'Docker', 'Azure OpenAI', 'Azure CI/CD'],
    architecture: [
      { label: 'Candidate data', detail: 'BigQuery as the data warehouse.' },
      { label: 'Screening and evaluation', detail: 'Gemini 2.5 Flash scores and summarizes through a FastAPI backend.' },
      { label: 'Live sessions', detail: 'Firestore holds real-time session state.' },
      { label: 'Recruiter dashboard', detail: 'Kanban boards and live candidate analytics.' },
      { label: 'Batch outreach', detail: 'A Dockerized job sends candidate communication through SendGrid.' },
    ],
    decisions: [
      { title: 'Context-aware voice', body: 'The voice interviewer keeps conversation memory so turn timing stays natural.' },
      { title: 'Separate batch from interactive', body: 'Bulk candidate communication runs as its own containerized job.' },
    ],
    outcomes: [
      'Screening and interview evaluation automated end to end.',
      'A recruiter dashboard with Kanban boards and analytics.',
      'Hands-on experience deploying AI models through Azure CI/CD pipelines.',
    ],
    lessons: ['A copilot earns trust in the workflow, so the dashboard mattered as much as the model.'],
  },
  {
    id: 'bus',
    title: 'Smart bus video analytics',
    kicker: 'Client PoC, architecture and hardware',
    status: 'Proof of concept',
    confidential: true,
    problem: 'Facial recognition and occupancy monitoring across a fleet of hundreds of buses.',
    context: 'A client-facing PoC for a large real-estate group. Client name withheld.',
    role:
      'Contributed to the architecture comparison and hardware evaluation, set up and tested the AWS Kinesis Video Streams SDK, and wrote the pre-development checklist and AWS architecture test guide.',
    stack: ['NVIDIA Jetson Orin Nano', 'Raspberry Pi 5 + Hailo', 'AWS Kinesis Video Streams', 'Ubuntu'],
    architecture: [
      { label: 'Full edge', detail: 'All inference on the bus.' },
      { label: 'Edge-lite', detail: 'Light processing on the bus, heavier work elsewhere.' },
      { label: 'Cloud only', detail: 'Stream video and run everything in the cloud.' },
      { label: 'Decision', detail: 'Compare the three on fleet scale, hardware and streaming.' },
    ],
    decisions: [
      { title: 'Compare three architectures before building', body: 'Full edge, edge-lite and cloud-only were weighed against fleet size and hardware.' },
      { title: 'Test streaming early', body: 'Kinesis Video Streams was set up and tested on a local Ubuntu machine before any commitments.' },
    ],
    outcomes: ['An architecture comparison, a hardware evaluation, a discussion checklist and an AWS test guide.'],
    lessons: ['At fleet scale, the cost of a wrong architecture is multiplied by hundreds of buses.'],
  },
  {
    id: 'rag',
    title: 'Restaurant RAG chatbot',
    kicker: 'Personal project',
    status: 'Built',
    problem: 'Let customers ask natural questions about a restaurant menu and services and get answers grounded in the actual data.',
    context: 'A personal project on a custom restaurant dataset.',
    role: 'Built the whole thing: embeddings, retrieval index and the chat interface.',
    stack: ['Python', 'FAISS', 'SentenceTransformers (MiniLM-L6-v2)', 'Gradio'],
    architecture: [
      { label: 'Dataset', detail: 'Custom restaurant menu and service data.' },
      { label: 'Embed', detail: 'MiniLM-L6-v2 embeddings for each document.' },
      { label: 'Retrieve', detail: 'FAISS returns the closest matches for a query.' },
      { label: 'Answer', detail: 'A Gradio chat interface presents contextual answers.' },
    ],
    decisions: [{ title: 'Small embedding model, fast index', body: 'MiniLM-L6-v2 with FAISS keeps retrieval fast on modest hardware.' }],
    outcomes: ['More than 90% retrieval relevance on the custom restaurant dataset.'],
    lessons: ['A narrow domain and clean data beat a clever model.'],
  },
  {
    id: 'jetsonllm',
    title: 'Local LLMs on a Jetson Orin Nano',
    kicker: 'Experiment',
    status: 'In progress',
    problem: 'Find out which open-weight models can run self-hosted, with no external API calls, on a 4 GB edge board.',
    context: 'A Jetson Orin Nano 4 GB box on JetPack 5.1.3 with 3.3 GiB of RAM plus 8 GiB of swap.',
    role: 'Designing and running the test setup.',
    stack: ['NVIDIA Jetson Orin Nano', 'Ollama', 'Docker', 'llama3.1:8b', 'gemma3:12b', 'deepseek-r1:14b', 'qwen3:1.7b'],
    architecture: [
      { label: 'Container', detail: 'Ollama runs in Docker, isolated from the host.' },
      { label: 'One model at a time', detail: 'Each model is loaded alone given the memory pool.' },
      { label: 'Test scripts', detail: 'A separate workspace holds scripts and article data.' },
    ],
    decisions: [{ title: 'Isolate everything', body: 'A container and a dedicated workspace keep the experiment away from project paths.' }],
    outcomes: ['Test setup defined. Benchmark numbers are not published yet.'],
    lessons: ['Constraints make the experiment more informative.'],
  },
  {
    id: 'agentic',
    title: 'Agentic workflow platform',
    kicker: 'Multi-tenant SaaS, in development',
    status: 'In development, not released',
    problem:
      'Let teams build workflows and agents on a visual canvas, as a multi-tenant product that also installs on a customer\'s own servers, and is delivered together with forward deployed engineers.',
    context:
      'Three tenant types (platform, business, consumer), one tenant per user, and an on-premises option that runs without any link to the cloud. Identity, authorization and tenant setup had to be right before any workflow feature, because every later feature depends on them.',
    role:
      'I am designing the system and building it with Claude Code: identity and access, tenant provisioning, the plan and entitlement model, the flow schema, and the new workflow backend and frontend. I also keep the technical status and plan document.',
    stack: ['Keycloak', 'OpenFGA', 'Spring Boot', 'PostgreSQL', 'Flyway', 'Node.js and TypeScript', 'Fastify', 'pg-boss', 'JSONata', 'React 19', 'React Flow', 'TanStack Query', 'Docker'],
    architecture: [
      { label: 'Sign-in', detail: 'The user is redirected to the sign-in realm of their own tenant. The tenant is read only from the verified token, never from a header or a request body.' },
      { label: 'Gateway', detail: 'Checks the token and its scopes at the edge and routes the call. Anything it cannot verify is refused.' },
      { label: 'Control plane', detail: 'Identity, tenants, plans and the audit trail. Creating a tenant starts a nine-step provisioning run that can resume from the step that failed.' },
      { label: 'Authorization', detail: 'A permissions store per tenant. The database is the source of truth, changes flow out through an outbox, and a periodic reconcile repairs drift.' },
      { label: 'Workflow cell', detail: 'Flows are stored as a graph that the canvas renders directly. Every run and every step is persisted, with retries, a concurrency cap per tenant and cancel.' },
    ],
    decisions: [
      { title: 'Authenticate and authorize separately', body: 'One system proves who the user is, another decides what they may do. Roles are not put in the token. The interface asks the server for permissions and only hides what the server would refuse.' },
      { title: 'Separation of duties in the model', body: 'The person who builds a flow can never approve its publication. The tenant admin cannot be the engineer who builds. These are rules in the authorization model, not UI checks.' },
      { title: 'A graph, not a nested tree, as the flow format', body: 'Flows are nodes and edges, so the canvas can render them directly. Both frontend and backend were built against this one contract.' },
      { title: 'Expressions that cannot run code', body: 'Values are computed with a query language that cannot execute arbitrary code, and the first release has no code step. Tenant code never runs, so the sandbox is not a release gate.' },
      { title: 'Replace the borrowed engine', body: 'The first demo ran on an open-source workflow engine. I chose to build our own backend and frontend, and accepted the cost: far fewer ready-made connectors, so the first release ships with three first-party ones.' },
    ],
    outcomes: [
      'A local demo runs end to end: sign-in, per-tenant permissions, automatic tenant setup, and a flow that is built, approved by a different person, published and triggered by a webhook, using safe steps only.',
      'The tenant provisioning scenario passes 51 of 51 checks, including suspend, resume, plan change and isolation between tenants.',
      'The permissions model passes 59 of 59 checks, and a drift test against a real permissions store passes 10 of 10.',
      'Not yet proven: connections to live third-party accounts, and running any customer code in isolation. No customer code is cleared to run.',
    ],
    lessons: [
      'A status document that lists what is not verified is more useful than one that lists what works.',
      'Fix the contract between frontend and backend first. Both sides then move without waiting on each other.',
      'Several issues were found by reading code, not by an incident. They get re-checked once the new stack exists.',
    ],
  },
];

export interface Story {
  id: string;
  title: string;
  steps: { label: string; body: string }[];
}

export const stories: Story[] = [
  {
    id: 'orin',
    title: 'Four open-weight models, one 4 GB board',
    steps: [
      { label: 'The challenge', body: 'Run llama3.1:8b, gemma3:12b, deepseek-r1:14b and qwen3:1.7b self-hosted on a Jetson Orin Nano with 3.3 GiB of RAM.' },
      { label: 'The investigation', body: 'The box has 8 GiB of swap on top of its RAM, an 11.3 GiB pool in total. No external API calls allowed.' },
      { label: 'The decision', body: 'Load one model at a time, inside a container, in a workspace separate from project paths.' },
      { label: 'The implementation', body: 'Ollama through its Docker-based installation, with scripts and article data in their own folder.' },
      { label: 'The result', body: 'The harness is set up. Benchmarks are still to come, and none are claimed here.' },
    ],
  },
  {
    id: 'docx',
    title: 'Diagrams that survive every Word version',
    steps: [
      { label: 'The challenge', body: 'Embed architecture and data-flow diagrams in the FRS Edge Box technical documentation.' },
      { label: 'The investigation', body: 'Native Word shape XML rendered unreliably across Word versions.' },
      { label: 'The decision', body: 'Stop fighting the renderer. Use PNG diagrams in the document and keep an editable version elsewhere.' },
      { label: 'The implementation', body: 'A repeatable python-docx pipeline with XML patching for the document, plus a companion PowerPoint.' },
      { label: 'The result', body: 'A document that looks the same everywhere, with diagrams still editable by the team.' },
    ],
  },
  {
    id: 'calls',
    title: 'Many callers, one event loop',
    steps: [
      { label: 'The challenge', body: 'A voice agent has to serve several callers at the same time.' },
      { label: 'The investigation', body: 'Blocking SDK calls would stall the event loop and freeze every other call.' },
      { label: 'The decision', body: 'Give every call its own session and move blocking work off the loop.' },
      { label: 'The implementation', body: 'A UUID per call with its own history, socket mapping and speech client, and blocking calls run in executors.' },
      { label: 'The result', body: 'A multi-user proof of concept. Latency has not been measured yet, so I do not quote any.' },
    ],
  },
  {
    id: 'backlog',
    title: 'From a requirements document to a backlog',
    steps: [
      { label: 'The challenge', body: 'Turn the FRS functional requirements document into something a team can plan sprints from.' },
      { label: 'The investigation', body: 'The risk was invention: a backlog that contains things nobody asked for.' },
      { label: 'The decision', body: 'Source every item strictly from the document.' },
      { label: 'The implementation', body: 'An Excel workbook shaped for Azure DevOps import: epics, features, user stories and tasks.' },
      { label: 'The result', body: '85 user stories and 288 tasks, each traceable to the document.' },
    ],
  },
  {
    id: 'authz',
    title: 'Authorization that is not a pile of if statements',
    steps: [
      { label: 'The challenge', body: 'Judges, clerks and administrators need different access, and access to a case is not the same as holding a role.' },
      { label: 'The investigation', body: 'Role checks alone cannot express case-level rules, workflow state or tenant boundaries.' },
      { label: 'The decision', body: 'Layer the checks and keep every permission in one catalog.' },
      { label: 'The implementation', body: 'Identity, tenant, role, resource, workflow and audit layers, with sign-in through OIDC and PKCE.' },
      { label: 'The result', body: 'A documented permission matrix for three roles. Parts of the design are still proposals rather than finished code.' },
    ],
  },
];

export const mindset = [
  {
    title: 'Complexity gets written down.',
    body: 'When a system has many moving parts, I make the decisions visible before the code hardens.',
    proof: 'Ten architecture decision records for the FRS Jetson stack. A backlog of 85 stories and 288 tasks traced to one document.',
  },
  {
    title: 'Debugging starts at the boundary.',
    body: 'Most bugs live where two parts meet. I read the seam first.',
    proof: 'A workspace validation bug in a multi-tenant login flow, where the subdomain decides which tenant you are.',
  },
  {
    title: 'Experiments need constraints.',
    body: 'A small box tells you more than a big one. I pick hardware that forces honest answers.',
    proof: 'Four open-weight models, one at a time, on a Jetson Orin Nano with a 4 GB board.',
  },
  {
    title: 'A prototype says it is a prototype.',
    body: 'Production readiness is a list of things not yet true. I keep that list in view and out of marketing copy.',
    proof: 'Every case study here names what has not been measured.',
  },
  {
    title: 'Authorization is architecture.',
    body: 'Access rules shape the data model, so I design them first, not last.',
    proof: 'Layered permissions and a central catalog in a private, regulated-sector assistant.',
  },
];

export const beyond = {
  education: 'B.Tech, Data Science and Artificial Intelligence, ICFAI Foundation for Higher Education, Hyderabad, 2021 to 2025.',
  teaching: 'Trained 40+ interns and freshers.',
  exploring: 'Currently testing open-weight language models on a Jetson Orin Nano, with no external APIs.',
  certs: [
    { group: 'Google Cloud', items: ['Digital Transformation (2025)', 'Intro to Generative AI (2024)', 'Prompt Design'] },
    { group: 'IBM', items: ['watsonx Orchestrate, Build AI Assistant', 'Python for Data Science (2024)', 'Prompt Engineering Basics'] },
    { group: 'Community and courses', items: ['GDG Hyderabad DevFest (2025)', 'NSDC Python Programming (2025)', 'UC Irvine Database Design'] },
  ],
};
