"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type SheetContextValue = {
  open?: boolean
  actionsRef: React.RefObject<{ unmount: () => void; close: () => void } | null>
}

const SheetContext = React.createContext<SheetContextValue>({
  actionsRef: { current: null },
})

function Sheet({
  open,
  onOpenChange,
  ...props
}: SheetPrimitive.Root.Props) {
  const actionsRef = React.useRef<{
    unmount: () => void
    close: () => void
  } | null>(null)
  return (
    <SheetContext.Provider value={{ open, actionsRef }}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={open}
        onOpenChange={onOpenChange}
        actionsRef={
          actionsRef as React.ComponentProps<typeof SheetPrimitive.Root>["actionsRef"]
        }
        {...props}
      />
    </SheetContext.Provider>
  )
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  overlayRef,
  ...props
}: SheetPrimitive.Backdrop.Props & {
  overlayRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <SheetPrimitive.Backdrop
      ref={overlayRef}
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-[80] bg-black/20 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-md",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const { open, actionsRef } = React.useContext(SheetContext)
  const cleanupRef = React.useRef<(() => void) | null>(null)
  const hasTriggeredCloseRef = React.useRef(false)

  React.useEffect(() => {
    if (open) hasTriggeredCloseRef.current = false
  }, [open])

  const overlayRef = React.useCallback((node: HTMLDivElement | null) => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    if (!node) return

    const SCROLL_THRESHOLD = 10
    let wheelDelta = 0
    let touchStartY: number | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const detach = () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }

    const close = () => {
      if (hasTriggeredCloseRef.current) return
      hasTriggeredCloseRef.current = true
      detach()
      actionsRef.current?.close()
    }

    const onWheel = (e: WheelEvent) => {
      if (hasTriggeredCloseRef.current) return
      wheelDelta += Math.abs(e.deltaY)
      if (timer === null) {
        timer = setTimeout(() => {
          wheelDelta = 0
          timer = null
        }, 150)
      }
      if (wheelDelta > SCROLL_THRESHOLD) close()
    }

    const onTouchStart = (e: TouchEvent) => {
      if (hasTriggeredCloseRef.current) return
      touchStartY = e.touches[0]?.clientY ?? null
      wheelDelta = 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (hasTriggeredCloseRef.current || touchStartY === null) return
      const y = e.touches[0]?.clientY
      if (y === undefined) return
      const delta = Math.abs(y - touchStartY)
      if (delta > SCROLL_THRESHOLD) {
        close()
        return
      }
      touchStartY = y
    }

    const onTouchEnd = () => {
      touchStartY = null
      wheelDelta = 0
    }

    node.addEventListener("wheel", onWheel, { passive: true })
    node.addEventListener("touchstart", onTouchStart, { passive: true })
    node.addEventListener("touchmove", onTouchMove, { passive: true })
    node.addEventListener("touchend", onTouchEnd, { passive: true })
    cleanupRef.current = () => {
      node.removeEventListener("wheel", onWheel)
      node.removeEventListener("touchstart", onTouchStart)
      node.removeEventListener("touchmove", onTouchMove)
      node.removeEventListener("touchend", onTouchEnd)
      if (timer !== null) clearTimeout(timer)
    }
  }, [actionsRef])

  return (
    <SheetPortal>
      <SheetOverlay overlayRef={overlayRef} />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-[80] flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[translate,opacity] data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-[max(env(safe-area-inset-top,0px),0.75rem)] right-3 h-11 w-11 rounded-full"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
