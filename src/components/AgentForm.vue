<script setup lang="ts">
import { ref, reactive } from "vue";
import { agentService, type CreateAgentDTO } from "../services/api";

const emit = defineEmits(["success"]);

const mode = ref<"create" | "update">("create");
const loading = ref(false);
const successMessage = ref("");
const apiError = ref("");

const form = reactive({
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
});

const errors = reactive<Record<string, string>>({});

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (mode.value === "update" && !form.id.trim()) {
    errors.id = "Agent ID is required for updates";
    isValid = false;
  }

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  const phoneRegex = /^\+?[\d\s\-()]+$/;
  if (!form.mobileNumber.trim()) {
    errors.mobileNumber = "Mobile number is required";
    isValid = false;
  } else if (!phoneRegex.test(form.mobileNumber)) {
    errors.mobileNumber = "Please enter a valid phone number";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  successMessage.value = "";
  apiError.value = "";

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const payload: CreateAgentDTO = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNumber: form.mobileNumber,
    };

    if (mode.value === "create") {
      const result = await agentService.createAgent(payload);
      successMessage.value = `Agent created successfully! ID: ${result.id}`;
      emit("success", result);
    } else {
      const result = await agentService.updateAgent(form.id, payload);
      successMessage.value = `Agent updated successfully!`;
      emit("success", result);
    }

    setTimeout(() => {
      resetForm();
    }, 2000);
  } catch (error: any) {
    console.error("Error:", error);
    if (error.response?.data?.errors) {
      apiError.value = error.response.data.errors
        .map((e: any) => e.message)
        .join(", ");
    } else if (error.response?.data?.message) {
      apiError.value = error.response.data.message;
    } else {
      apiError.value =
        "Failed to connect to the server. Make sure the backend is running.";
    }
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.id = "";
  form.firstName = "";
  form.lastName = "";
  form.email = "";
  form.mobileNumber = "";
  Object.keys(errors).forEach((key) => delete errors[key]);
  successMessage.value = "";
  apiError.value = "";
};

const switchMode = (newMode: "create" | "update") => {
  mode.value = newMode;
  resetForm();
};
</script>

<template>
  <div class="agent-form">
    <div class="mode-toggle">
      <button
        :class="{ active: mode === 'create' }"
        @click="switchMode('create')"
      >
        Create New Agent
      </button>
      <button
        :class="{ active: mode === 'update' }"
        @click="switchMode('update')"
      >
        Update Agent
      </button>
    </div>

    <div v-if="successMessage" class="success-message">
      ✓ {{ successMessage }}
    </div>

    <div v-if="apiError" class="error-message api-error">
      <strong>Error:</strong> {{ apiError }}
    </div>

    <form @submit.prevent="submitForm">
      <div v-if="mode === 'update'" class="form-group">
        <label>Agent ID <span class="required">*</span></label>
        <input
          v-model="form.id"
          type="text"
          placeholder="Enter agent ID to update"
          :class="{ error: errors.id }"
        />
        <div v-if="errors.id" class="error-message">{{ errors.id }}</div>
      </div>

      <div class="form-group">
        <label>First Name <span class="required">*</span></label>
        <input
          v-model="form.firstName"
          type="text"
          placeholder="John"
          :class="{ error: errors.firstName }"
        />
        <div v-if="errors.firstName" class="error-message">
          {{ errors.firstName }}
        </div>
      </div>

      <div class="form-group">
        <label>Last Name <span class="required">*</span></label>
        <input
          v-model="form.lastName"
          type="text"
          placeholder="Doe"
          :class="{ error: errors.lastName }"
        />
        <div v-if="errors.lastName" class="error-message">
          {{ errors.lastName }}
        </div>
      </div>

      <div class="form-group">
        <label>Email <span class="required">*</span></label>
        <input
          v-model="form.email"
          type="email"
          placeholder="john.doe@example.com"
          :class="{ error: errors.email }"
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label>Mobile Number <span class="required">*</span></label>
        <input
          v-model="form.mobileNumber"
          type="tel"
          placeholder="+1234567890"
          :class="{ error: errors.mobileNumber }"
        />
        <div v-if="errors.mobileNumber" class="error-message">
          {{ errors.mobileNumber }}
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="loading"></span>
          <span v-else>{{
            mode === "create" ? "Create Agent" : "Update Agent"
          }}</span>
        </button>
        <button
          type="button"
          class="btn-secondary"
          @click="resetForm"
          :disabled="loading"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.agent-form {
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 6px;
}

.mode-toggle button {
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  transition: all 0.2s;
}

.mode-toggle button.active {
  background: #0d61a7;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 14px;
}

.required {
  color: #dc2626;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.2s;
  color: #1a1a1a;
}

input:focus {
  outline: none;
  border-color: #0d61a7;
  box-shadow: 0 0 0 3px rgba(13, 97, 167, 0.1);
}

input::placeholder {
  color: #9ca3af;
}

input.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 13px;
  margin-top: 6px;
}

.api-error {
  background: #fee2e2;
  border-left: 4px solid #dc2626;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.success-message {
  background: #d1fae5;
  border-left: 4px solid #10b981;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-weight: 500;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #0d61a7;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0a4d85;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 97, 167, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
