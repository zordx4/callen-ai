// PagePlaceholder — consistent header + content area for not-yet-built pages.
// Used by all dashboard routes until their real content lands.

import { LucideIcon } from "lucide-react";

type PagePlaceholderProps = {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
  comingNote: string;
};

export function PagePlaceholder({ title, subtitle, badge, icon: Icon, comingNote }: PagePlaceholderProps) {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        {badge && (
          <span className="inline-block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-neutral-500 max-w-2xl">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 lg:p-16 text-center">
        {Icon && (
          <div className="size-12 rounded-2xl bg-neutral-100 mx-auto mb-4 flex items-center justify-center">
            <Icon className="size-5 text-neutral-700" />
          </div>
        )}
        <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">{comingNote}</p>
      </div>
    </div>
  );
}
