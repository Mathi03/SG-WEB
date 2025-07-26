import {
  milkProductionSchema,
  MilkProductionSchema,
} from "@infrastructure/validations/milkProductionValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: {
  farmId?: number;
}): Promise<MilkProductionSchema[]> {
  const res = await ApiHandler.get(`/milk-productions`, { params });
  return array(milkProductionSchema).parse(res);
}

async function searchOne(id: number): Promise<MilkProductionSchema> {
  const res = await ApiHandler.get(`/milk-productions/${id}`, {});
  return milkProductionSchema.parse(res);
}

async function create(
  data: MilkProductionSchema
): Promise<MilkProductionSchema> {
  const res = await ApiHandler.post(`/milk-productions`, { data });
  return milkProductionSchema.parse(res);
}

function update(id: number, data: MilkProductionSchema) {
  return ApiHandler.put(`/milk-productions/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/milk-productions/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
