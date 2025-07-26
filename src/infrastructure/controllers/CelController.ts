import {
  celSchema,
  CelSchema,
} from "@infrastructure/validations/celValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
  all?: boolean;
}): Promise<CelSchema[]> {
  const res = await ApiHandler.get(`/heat-cycles`, { params });
  return array(celSchema).parse(res);
}

async function searchOne(id: number): Promise<CelSchema> {
  const res = await ApiHandler.get(`/heat-cycles/${id}`, {});
  return celSchema.parse(res);
}

async function create(data: CelSchema): Promise<CelSchema> {
  const res = await ApiHandler.post(`/heat-cycles`, { data });
  return celSchema.parse(res);
}

function update(id: number, data: CelSchema) {
  return ApiHandler.put(`/heat-cycles/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/heat-cycles/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
