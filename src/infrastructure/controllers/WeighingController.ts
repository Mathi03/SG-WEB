import {
  weighingSchema,
  WeighingSchema,
} from "@infrastructure/validations/weighingValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: { farmId?: number }): Promise<WeighingSchema[]> {
  const res = await ApiHandler.get(`/animal-weights`, { params });
  return array(weighingSchema).parse(res);
}

async function searchOne(id: number): Promise<WeighingSchema> {
  const res = await ApiHandler.get(`/animal-weights/${id}`, {});
  return weighingSchema.parse(res);
}

async function create(data: WeighingSchema): Promise<WeighingSchema> {
  const res = await ApiHandler.post(`/animal-weights`, { data });
  return weighingSchema.parse(res);
}

function update(id: number, data: WeighingSchema) {
  return ApiHandler.put(`/animal-weights/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/animal-weights/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
