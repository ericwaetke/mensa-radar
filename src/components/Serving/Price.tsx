import { VoidComponent } from "solid-js";

export const Price: VoidComponent<{
  pricePrimary?: string | null;
  priceSecondary?: string | null;
}> = (props) => {
  return (
    <div class="flex items-center bg-[#D3D6D4] px-2 py-1 rounded-[4px] font-noto text-[12px] gap-1 font-semibold">
      <span>{props.pricePrimary} €</span>
      <span class="opacity-50">·</span>
      <span class="opacity-50">{props.priceSecondary} €</span>
    </div>
  );
};
