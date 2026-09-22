"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors outline-none cursor-pointer data-[size=default]:h-[22px] data-[size=default]:w-[40px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px] data-checked:bg-red-500 data-unchecked:bg-[#46464E] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white ring-0 shadow-sm transition-transform group-data-[size=default]/switch:size-[18px] group-data-[size=sm]/switch:size-[12px] group-data-[size=default]/switch:data-checked:translate-x-[19px] group-data-[size=sm]/switch:data-checked:translate-x-[13px] group-data-[size=default]/switch:data-unchecked:translate-x-[2px] group-data-[size=sm]/switch:data-unchecked:translate-x-[2px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
