import {
  vaccinesSchema,
  VaccinesSchema,
} from "@infrastructure/validations/vaccinesValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: { farmId?: number }): Promise<VaccinesSchema[]> {
  const res = await ApiHandler.get(`/animal-vaccinations`, { params });
  return array(vaccinesSchema).parse(res);
}

async function searchOne(id: number): Promise<VaccinesSchema> {
  const res = await ApiHandler.get(`/animal-vaccinations/${id}`, {});
  return vaccinesSchema.parse(res);
}

async function create(data: VaccinesSchema): Promise<VaccinesSchema> {
  const res = await ApiHandler.post(`/animal-vaccinations`, { data });
  return vaccinesSchema.parse(res);
}

function update(id: number, data: VaccinesSchema) {
  return ApiHandler.put(`/animal-vaccinations/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/animal-vaccinations/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
