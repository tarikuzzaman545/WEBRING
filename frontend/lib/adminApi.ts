import { getToken } from "./adminAuth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getHeaders = (isFormData = false) => {
  const headers: any = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
};

const handleRes = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API Error");
  return data;
};

export const login = async (password: string) => {
  const res = await fetch(`${API}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
  return handleRes(res);
};

export const verifyToken = async () => {
  const res = await fetch(`${API}/api/auth/verify`, { headers: getHeaders() });
  return handleRes(res);
};

export const getContent = async () => handleRes(await fetch(`${API}/api/content`));
export const updateContent = async (data: any) => handleRes(await fetch(`${API}/api/content`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }));

export const getImages = async () => handleRes(await fetch(`${API}/api/images`));
export const uploadImage = async (file: File, category: string, key: string, subIndex?: number) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", category);
  formData.append("key", key);
  if (subIndex !== undefined) formData.append("subIndex", subIndex.toString());
  const res = await fetch(`${API}/api/images/upload`, { method: "POST", headers: getHeaders(true), body: formData });
  return handleRes(res);
};

export const getPortfolio = async () => handleRes(await fetch(`${API}/api/portfolio`));
export const addPortfolioItem = async (data: any) => handleRes(await fetch(`${API}/api/portfolio`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }));
export const updatePortfolioItem = async (id: string, data: any) => handleRes(await fetch(`${API}/api/portfolio/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }));
export const deletePortfolioItem = async (id: string) => handleRes(await fetch(`${API}/api/portfolio/${id}`, { method: "DELETE", headers: getHeaders() }));

export const getTeam = async () => handleRes(await fetch(`${API}/api/team`));
export const updateTeamMember = async (id: string, data: any) => handleRes(await fetch(`${API}/api/team/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }));

export const getPricing = async () => handleRes(await fetch(`${API}/api/pricing`));
export const updatePricingTier = async (tierId: string, data: any) => handleRes(await fetch(`${API}/api/pricing/${tierId}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }));

export const getMessages = async () => handleRes(await fetch(`${API}/api/messages`, { headers: getHeaders() }));
export const markMessageRead = async (id: string) => handleRes(await fetch(`${API}/api/messages/${id}/read`, { method: "PUT", headers: getHeaders() }));
export const deleteMessage = async (id: string) => handleRes(await fetch(`${API}/api/messages/${id}`, { method: "DELETE", headers: getHeaders() }));

export const getBookings = async () => handleRes(await fetch(`${API}/api/bookings`, { headers: getHeaders() }));
export const updateBookingStatus = async (id: string, status: string) => handleRes(await fetch(`${API}/api/bookings/${id}/status`, { method: "PUT", headers: getHeaders(), body: JSON.stringify({ status }) }));

export const getAvailableDates = async () => handleRes(await fetch(`${API}/api/booking/dates`));
export const updateAvailableDates = async (dates: string[], timeSlots: string[]) => handleRes(await fetch(`${API}/api/booking/dates`, { method: "PUT", headers: getHeaders(), body: JSON.stringify({ dates, timeSlots }) }));
