import { groq } from "next-sanity";

export const settingsQuery = groq`*[_type == "settings"][0]`;
export const servicesQuery = groq`*[_type == "service"]`;
export const portfolioQuery = groq`*[_type == "portfolio"]`;
export const teamQuery = groq`*[_type == "team"]`;
export const pricingQuery = groq`*[_type == "pricing"]`;
