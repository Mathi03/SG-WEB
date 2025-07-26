import {
  palpationsSchema,
  PalpationsSchema,
} from "@infrastructure/validations/palpationsValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
}): Promise<PalpationsSchema[]> {
  const res = await ApiHandler.get(`/palpations`, { params });
  return array(palpationsSchema).parse(res);
}

async function searchOne(id: number): Promise<PalpationsSchema> {
  const res = await ApiHandler.get(`/palpations/${id}`, {});
  return palpationsSchema.parse(res);
}

async function create(data: PalpationsSchema): Promise<PalpationsSchema> {
  const res = await ApiHandler.post(`/palpations`, { data });
  return palpationsSchema.parse(res);
}

function update(id: number, data: PalpationsSchema) {
  return ApiHandler.put(`/palpations/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/palpations/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
