import {
  animalSchema,
  AnimalSchema,
} from "@infrastructure/validations/animalValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
  status?: string;
  gender?: string;
}): Promise<AnimalSchema[]> {
  const res = await ApiHandler.get(`/animals`, { params });
  return array(animalSchema).parse(res);
}

async function searchOne(id: number): Promise<AnimalSchema> {
  const res = await ApiHandler.get(`/animals/${id}`, {});
  return animalSchema.parse(res);
}

async function create(data: AnimalSchema): Promise<AnimalSchema> {
  const res = await ApiHandler.post(`/animals`, { data });
  return animalSchema.parse(res);
}

function update(id: number, data: AnimalSchema) {
  return ApiHandler.put(`/animals/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/animals/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
