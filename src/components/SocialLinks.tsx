import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";

interface Props {
  className?: string;
  direction?: "row" | "col";
}

const iconMap: Record<string, keyof typeof LucideIcons> = {
  instagram: "Instagram",
  linkedin: "Linkedin",
  "message-circle": "MessageCircle",
  "external-link": "ExternalLink",
  "graduation-cap": "GraduationCap",
  link: "Link",
};

const SocialLinks = ({ className = "", direction = "row" }: Props) => {
  const { data: links = [] } = useQuery({
    queryKey: ["social_links"],
    queryFn: async () => {
      const { data } = await supabase.from("social_links").select("*").order("sort_order");
      return data || [];
    },
  });

  return (
    <div className={`flex ${direction === "col" ? "flex-col" : "flex-row"} gap-4 ${className}`}>
      {links.map((link) => {
        const iconName = iconMap[link.icon] || "Link";
        const IconComponent = (LucideIcons as any)[iconName];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            aria-label={link.platform}
          >
            {IconComponent ? <IconComponent size={18} /> : <LucideIcons.Link size={18} />}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
