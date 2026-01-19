<script setup lang="ts">
import AgentForm from "./components/AgentForm.vue";
import { ref } from "vue";
import type { PropertyAgent } from "./services/api";

const lastCreatedAgent = ref<PropertyAgent | null>(null);

const handleSuccess = (agent: PropertyAgent) => {
  lastCreatedAgent.value = agent;
};
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1>Property Agent Management</h1>
        <p>Create and manage property agents</p>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <AgentForm @success="handleSuccess" />

        <div v-if="lastCreatedAgent" class="agent-preview">
          <h3>Last Created Agent</h3>
          <div class="preview-grid">
            <div class="preview-item">
              <span class="label">ID:</span>
              <span class="value">{{ lastCreatedAgent.id }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Name:</span>
              <span class="value"
                >{{ lastCreatedAgent.firstName }}
                {{ lastCreatedAgent.lastName }}</span
              >
            </div>
            <div class="preview-item">
              <span class="label">Email:</span>
              <span class="value">{{ lastCreatedAgent.email }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Mobile:</span>
              <span class="value">{{ lastCreatedAgent.mobileNumber }}</span>
            </div>
          </div>
        </div>

        <div class="info-box">
          <h3>API Testing Reference</h3>

          <div class="api-section">
            <h4>View All Agents</h4>
            <code>GET http://localhost:3000/agents</code>
            <pre>curl -X GET http://localhost:3000/agents</pre>
          </div>

          <div class="api-section">
            <h4>View Single Agent</h4>
            <code>GET http://localhost:3000/agents/:id</code>
            <pre>curl -X GET http://localhost:3000/agents/abc123</pre>
          </div>

          <div class="api-section">
            <h4>Delete Agent</h4>
            <code>DELETE http://localhost:3000/agents/:id</code>
            <pre>curl -X DELETE http://localhost:3000/agents/abc123</pre>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 Property Agent Management System</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #ffffff;
  color: #1a1a1a;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 0;
}

.header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-weight: 700;
}

.header p {
  color: #6b7280;
  font-size: 15px;
}

.main {
  flex: 1;
  padding: 48px 0;
  background: #fafafa;
}

.agent-preview {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.agent-preview h3 {
  margin-bottom: 16px;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
}

.preview-grid {
  display: grid;
  gap: 12px;
}

.preview-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-item .label {
  font-weight: 600;
  color: #374151;
  width: 120px;
  font-size: 14px;
}

.preview-item .value {
  color: #1a1a1a;
  font-size: 14px;
}

.info-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.info-box h3 {
  color: #1a1a1a;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.api-section {
  margin-bottom: 24px;
}

.api-section:last-child {
  margin-bottom: 0;
}

.api-section h4 {
  color: #374151;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info-box code {
  background: #f3f4f6;
  color: #0d61a7;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-block;
  font-family: "Courier New", monospace;
  margin-bottom: 8px;
}

.info-box pre {
  background: #1a1a1a;
  color: #10b981;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  overflow-x: auto;
  font-family: "Courier New", monospace;
}

.footer {
  background: #0a2343;
  color: white;
  padding: 24px 0;
  margin-top: auto;
}

.footer p {
  text-align: center;
  font-size: 14px;
  opacity: 0.9;
}
</style>
