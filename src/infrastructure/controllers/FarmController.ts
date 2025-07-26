/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiHandler from "@utils/ApiHandler";

async function search(): Promise<any> {
  const res = await ApiHandler.get(`/farms`, {});
  return res;
}

async function searchOne(id: number): Promise<any> {
  const res = await ApiHandler.get(`/farms/${id}`, {});
  return res;
}

async function create(data: any): Promise<any> {
  const res = await ApiHandler.post(`/farms`, { data });
  return res;
}

async function update(id: number, data: any): Promise<any> {
  const res = await ApiHandler.put(`/farms/${id}`, { data });
  return res;
}

async function remove(id: number): Promise<any> {
  const res = await ApiHandler.delete(`/farms/${id}`, {});
  return res;
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
