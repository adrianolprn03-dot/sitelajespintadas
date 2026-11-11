interface PreviaSectionTitleProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    centered?: boolean;
}

export default function PreviaSectionTitle({
    title,
    subtitle,
    action,
    centered = false,
}: PreviaSectionTitleProps) {
    return (
        <div className={`mb-8 ${centered ? "text-center" : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"}`}>
            <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12304A] font-heading tracking-tight leading-tight">
                    {title}
                </h2>
                {/* Traço em Laranja #F39A32 sob o título */}
                <div
                    className={`h-1 w-14 bg-[#F39A32] rounded-full mt-2.5 mb-2 ${
                        centered ? "mx-auto" : ""
                    }`}
                />
                {subtitle && (
                    <p className="text-sm text-[#5B738B] max-w-2xl leading-relaxed mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

