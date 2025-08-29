import React from "react";
import Layout from "../Layout/Layout";

export default function Home() {

  console.log("Home component rendered");
  return (
    <Layout>
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          🚀 Welcome to <span style={{ color: "#007acc" }}>mjs</span>
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
          <strong>mjs</strong> is a lightweight, blazing-fast fullstack framework built on top of React and Express.
          It combines the best of both worlds with zero configuration, providing:
        </p>

        <ul style={{ listStyle: "none", marginTop: "2rem", padding: 0 }}>
          <li>✅ Simple file structure — no more complex Next.js folders</li>
          <li>✅ Built-in Webpack bundler</li>
          <li>✅ Built-in routing (frontend + backend)</li>
          <li>✅ Environment variable support with <code>.env</code></li>
          <li>✅ Runs frontend and backend together seamlessly</li>
          <li>✅ Static files support via <code>/public</code></li>
        </ul>

        <img src="/img.jpg" alt="Logo" width="250" style={{ marginTop: "2rem", borderRadius: "12px" }} />

        <section style={{ marginTop: "3rem", textAlign: "left", maxWidth: "800px", marginInline: "auto" }}>
          <h2>📦 How to Use</h2>
          <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
{`# 1. Clone or install
npm install mjs

# 2. Add .env file
REACT_APP_TITLE=MyApp
REACT_APP_API_URL=http://localhost:3000/api

# 3. Start development (frontend + backend)
npm run dev

# 4. Build for production
npm run build

# 5. Serve production build
npm start`}
          </pre>

          <h2 style={{ marginTop: "2rem" }}>⚡ Why mjs?</h2>
          <p>
            Unlike Vite or Create React App, <strong>mjs</strong> is custom-optimized to run both frontend and backend as
            a single unit — no proxies, no configs. It's faster and more efficient, making it ideal for real-world fullstack apps.
          </p>

          <p>
            Forget the complexity of Next.js — <strong>mjs</strong> gives you complete control over React, Express, routing, and environment without the overhead.
          </p>
        </section>
      </section>
    </Layout>
  );
}
