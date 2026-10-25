import { X as XIcon, UtensilsCrossed } from "lucide-react";
import { isImageSource } from "../../../lib/images";
import { discountedPrice } from "../../../lib/promoRules";

// Shows the real price and, once a valid discount is typed, the price with it.
function PriceTag({ price, discount }) {
  const valid = Number.isInteger(discount) && discount >= 1 && discount <= 99;
  if (!valid) {
    return (
      <span className="block text-[11px] text-ink-500">
        ${Number(price).toFixed(2)}
      </span>
    );
  }
  return (
    <span className="block text-[11px]">
      <span className="text-ink-300 line-through mr-1">
        ${Number(price).toFixed(2)}
      </span>
      <span className="text-teal-700 font-semibold">
        ${discountedPrice(price, discount).toFixed(2)}
      </span>
    </span>
  );
}

export default function DiscountProductOption({ product, discount, chosen, blocked, onToggle }) {
  return (
    <button
      type="button"
      disabled={blocked}
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
        chosen
          ? "border-teal-500 bg-teal-50"
          : blocked
            ? "border-ink-100 bg-ink-50 opacity-50 cursor-not-allowed"
            : "border-ink-100 hover:bg-ink-50"
      }`}
    >
      {isImageSource(product.image) ? (
        <img
          src={product.image}
          alt=""
          className="w-7 h-7 rounded-md object-cover shrink-0"
        />
      ) : (
        <UtensilsCrossed size={16} className="text-ink-400 shrink-0" />
      )}
      <span className="text-xs font-medium text-ink-900 truncate">
        {product.name}
        <PriceTag price={product.price} discount={discount} />
        {blocked && (
          <span className="block text-[10px] text-ink-400">
            Ya en otro descuento
          </span>
        )}
      </span>
      {chosen && (
        <XIcon size={13} className="text-teal-600 ml-auto shrink-0" />
      )}
    </button>
  );
}
