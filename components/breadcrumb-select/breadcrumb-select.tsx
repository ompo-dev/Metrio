"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BreadcrumbSelectItemProps = {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  isSelect?: boolean;
  selectProps?: {
    defaultValue?: string;
    placeholder?: string;
    options: { value: string; label: string }[];
    onChange?: (value: string) => void;
  };
};

type BreadcrumbSelectProps = {
  items: BreadcrumbSelectItemProps[];
  className?: string;
};

const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50",
      className
    )}
  >
    {children}
  </div>
);

export function BreadcrumbSelect({ items, className }: BreadcrumbSelectProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isSelect ? (
                <Select
                  defaultValue={item.selectProps?.defaultValue}
                  onValueChange={item.selectProps?.onChange}
                >
                  <SelectTrigger
                    className={cn("relative gap-2", item.icon && "ps-9")}
                    aria-label={
                      item.selectProps?.placeholder || "Select option"
                    }
                  >
                    {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                    <SelectValue
                      placeholder={
                        item.selectProps?.placeholder || "Select option"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {item.selectProps?.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <BreadcrumbLink
                  href={item.href || "#"}
                  className={cn("flex items-center gap-2", item.icon && "ps-1")}
                >
                  {item.icon && (
                    <span className="text-muted-foreground/80">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
