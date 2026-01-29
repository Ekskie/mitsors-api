"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyMessage = "No option found.",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = options.find((option) => option.value === value)
  
  const filteredOptions = React.useMemo(() => {
    const result = inputValue
      ? options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      : options

    // Sort alphabetically A-Z, case-insensitive, without mutating the source array
    return [...result].sort((a, b) =>
      a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })
    )
  }, [options, inputValue])

  // Initialize input value with selected option when value changes externally (but not from open state)
  React.useEffect(() => {
    if (selectedOption && !open) {
      setInputValue(selectedOption.label)
    }
  }, [selectedOption])

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value
              setInputValue(newValue)
              onValueChange(newValue)
              if (!open) {
                setOpen(true)
              }
            }}
            onClick={() => {
              if (!open) {
                setOpen(true)
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-8", className)}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(!open)
            }}
            disabled={disabled}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4 opacity-50 pointer-events-none" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div 
          className="max-h-[300px] overflow-y-auto"
          onWheel={(e) => {
            // Allow natural scrolling behavior
            e.stopPropagation()
          }}
        >
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onValueChange(option.value)
                    setInputValue(option.label)
                    setOpen(false)
                    setTimeout(() => inputRef.current?.focus(), 0)
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-left outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
