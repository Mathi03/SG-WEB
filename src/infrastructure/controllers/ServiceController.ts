import {
  serviceSchema,
  ServiceSchema,
} from "@infrastructure/validations/serviceValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: { farmId?: number }): Promise<ServiceSchema[]> {
  const res = await ApiHandler.get(`/reproductive-records`, { params });
  return array(serviceSchema).parse(res);
}

async function searchOne(id: number): Promise<ServiceSchema> {
  const res = await ApiHandler.get(`/reproductive-records/${id}`, {});
  return serviceSchema.parse(res);
}

async function create(data: ServiceSchema): Promise<ServiceSchema> {
  const res = await ApiHandler.post(`/reproductive-records`, { data });
  return serviceSchema.parse(res);
}

function update(id: number, data: ServiceSchema) {
  return ApiHandler.put(`/reproductive-records/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/reproductive-records/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
