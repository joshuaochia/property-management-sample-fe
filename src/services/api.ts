import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? "https://property-management-sample.onrender.com/"
    : "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PropertyAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentDTO {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export const agentService = {
  createAgent(data: CreateAgentDTO): Promise<PropertyAgent> {
    return api.post("/agents", data).then((res) => res.data);
  },

  getAllAgents(): Promise<PropertyAgent[]> {
    return api.get("/agents").then((res) => res.data);
  },

  getAgentById(id: string): Promise<PropertyAgent> {
    return api.get(`/agents/${id}`).then((res) => res.data);
  },

  updateAgent(
    id: string,
    data: Partial<CreateAgentDTO>,
  ): Promise<PropertyAgent> {
    return api.put(`/agents/${id}`, data).then((res) => res.data);
  },

  deleteAgent(id: string): Promise<PropertyAgent> {
    return api.delete(`/agents/${id}`).then((res) => res.data);
  },
};
