import { CartItem } from "../models/types";

export class CartService {
  static getSubtotal(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }

  static getCartCount(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }
}
