This technical specification is designed to guide **Claude Code** in developing a pioneering, sensory-rich early learning platform for children aged **3–8**. The app must transition from a passive screen to a responsive "learning laboratory" that bridges physical movement with digital symbols.

### **I. Core Architectural Strategy**
*   **Offline-First & Privacy:** The system must be a **single HTML file or PWA** to ensure all sensor data (camera, microphone) is processed locally to meet strict safety standards.
*   **Bilingual Engine:** Support a seamless toggle between **English and Hebrew**, implementing **RTL (right-to-left) layout** and **nikud (vowels)** for Hebrew.
*   **Audio-First UX:** Since the target age includes non-readers, every task must be preceded by **audio instructions** using the Web Speech API (`he-IL` and `en-US`).

---

### **II. Sensory Interface & Interaction (The Toolbox)**

#### **1. Camera & Computer Vision (CV) Framework**
Claude Code should utilize **MediaPipe** (via WebAssembly) for a low-latency, "simple" gesture vocabulary.
*   **Hand Tracking (The Physical-to-Digital Bridge):** Children use **finger counting** to answer math questions (e.g., holding up three fingers to answer "3").
*   **Head Movement & Gaze:** Implement simple head-nods for "Yes" or gaze-based selection for children with developing motor control.
*   **Mood/Emotion Detection:** Use CV to track child indicators like **smiles or frustration**. If the system detects sadness or prolonged hesitation, the AI should offer a gentle prompt or switch to an easier "small win" task to maintain curiosity.

#### **2. Touchscreen & Handwriting "Beautification"**
*   **Interactive Canvas:** Provide a module for tracing letters and numbers.
*   **Beautification Logic:** Because 3–5 year olds produce "noisy" and inconsistent strokes, Claude Code must implement a preprocessing step to **snap shaky lines into clean curves**. This provides immediate positive reinforcement, making the child feel like a master writer.
*   **HCI Targets:** All touch targets must be at least **96x96px** to accommodate young children's lower touch accuracy.

#### **3. Microphone & Voice Interaction**
*   **Speech-to-Text:** Allow children to name objects or letters.
*   **Encouraging Feedback:** If a child mispronounces a word, the AI should provide a different visual or auditory cue rather than a "wrong" buzzer to prevent motivation loss.

---

### **III. The Curio-Adaptive "Brain" (AI Logic)**

The app must move away from static worksheets to an **Adaptive Learning System (ALS)** that keeps the child in their **"Zone of Proximal Development"**.
*   **localStorage Schema:** Track per-concept accuracy and **hesitation time**.
*   **Question Weighting:** Symbols or math concepts with an accuracy below **70%** should be injected into the pool **2x more frequently**.
*   **No Dead Ends:** If a child fails a task twice, the AI must **reveal the correct answer** visually within 100ms and move on to keep the experience fun and rewarding.

---

### **IV. Visual Design (Gestalt Framework)**
Apply **Gestalt Theory** to ensure the screen is not overwhelming for a developing brain.
*   **Figure-Ground:** The main symbol (letter/number) must be prominent and separated from the background.
*   **Similarity & Proximity:** Group related objects (like 5 stars) to help children develop **subitizing skills** (instantly recognizing quantity).
*   **Typography:** Use rounded, child-friendly fonts like **Varela Round** and **Rubik** at sizes of **130–160px** for recognition tasks.

---

### **V. Curriculum Modules by Age Band**
*   **Ages 3–5 (Foundational):** Focus on concrete tasks like shape matching, color recognition, and basic counting. Interactions should rely on simple swipes, waves, and voice.
*   **Ages 6–8 (Academic Readiness):** Introduce **STEM logic**, pattern completion, number composition (breaking 5 into 3+2), and full letter tracing.

**Instruction to Claude Code:** Begin by generating the unified `input.js` to handle concurrent touch and CV inputs, then build the `adaptive.js` engine to manage the local database. Ensure the **RTL toggle** is a core component of the CSS architecture from the first line of code.