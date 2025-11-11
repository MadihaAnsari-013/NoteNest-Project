// src/api/url.js
import axios from "axios";

const BACKEND_URL = axios.create({
  baseURL: "http://localhost:4002/api/v1/noteapp", // ← Changed to 4002
});

export default BACKEND_URL;