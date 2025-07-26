import {
  geneticSchema,
  GeneticsSchema,
} from "@infrastructure/validations/geneticsValidation";
import ApiHandler from "@utils/ApiHandler";
import { array } from "zod";

async function search(params?: { farmId?: number }): Promise<GeneticsSchema[]> {
  const res = await ApiHandler.get(`/genetic-stocks`, { params });
  return array(geneticSchema).parse(res);
}

async function searchOne(id: number): Promise<GeneticsSchema> {
  const res = await ApiHandler.get(`/genetic-stocks/${id}`, {});
  return geneticSchema.parse(res);
}

async function create(data: GeneticsSchema): Promise<GeneticsSchema> {
  const res = await ApiHandler.post(`/genetic-stocks`, { data });
  return geneticSchema.parse(res);
}

function update(id: number, data: GeneticsSchema) {
  return ApiHandler.put(`/genetic-stocks/${id}`, { data });
}

function remove(id: number) {
  return ApiHandler.delete(`/genetic-stocks/${id}`, {});
}

export default {
  search,
  searchOne,
  create,
  update,
  remove,
};
