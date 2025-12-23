import axios, { type CreateAxiosDefaults } from "axios";
import { env } from "../config/env";

const config: CreateAxiosDefaults = {
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: null,
  },
};

export const publicApi = axios.create(config);
