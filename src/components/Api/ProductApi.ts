import {
  IApi,
  IGetProductsApiResponse,
  IOrderApiRequest,
  IOrderApiResponse,
} from "../../types";

export class ProductApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IGetProductsApiResponse> {
    return await this.api.get<IGetProductsApiResponse>("/product");
  }

  async order(data: IOrderApiRequest): Promise<IOrderApiResponse> {
    return await this.api.post("/order", data);
  }
}
