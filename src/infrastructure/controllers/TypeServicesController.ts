import {
  TypeServiceSchema,
  typeServiceSchema,
} from "@infrastructure/validations/typeServicesValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
}): Promise<TypeServiceSchema[]> {
  const res = await ApiHandler.get(`/reproductive-methods`, { params });
  return array(typeServiceSchema).parse(res);
}

async function searchOne(id: number): Promise<TypeServiceSchema> {
  const res = await ApiHandler.get(`/reproductive-methods/${id}`, {});
  return typeServiceSchema.parse(res);
}

async function create(data: TypeServiceSchema): Promise<TypeServiceSchema> {
  const res = await ApiHandler.post(`/reproductive-methods`, { data });
  return typeServiceSchema.parse(res);
}

function update(id: number, data: TypeServiceSchema) {
  return ApiHandler.put(`/reproductive-methods/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/reproductive-methods/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
