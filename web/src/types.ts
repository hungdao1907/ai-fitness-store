/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  badge?: string;
  description: string;
  details: string[];
  specs: {
    material: string;
    fit: string;
    care: string;
  };
  isSoldOut?: boolean;
  category?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface RecommendationQuery {
  goal: string;
  discipline: string;
  experience: string;
  customMessage: string;
}
