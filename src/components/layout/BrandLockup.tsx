type BrandLockupProps = {
  companyName: string;
  location: string;
  footer?: boolean;
};

export function BrandLockup({ companyName, location, footer = false }: BrandLockupProps) {
  return (
    <div className={`brand-lockup flex min-w-0 items-center gap-3 ${footer ? 'brand-lockup-footer' : ''}`}>
      <svg aria-hidden="true" viewBox="0 0 48 48" className="brand-mark h-11 w-11 shrink-0">
        <circle cx="24" cy="24" r="23" fill="#101c65" />
        <circle cx="24" cy="24" r="19.5" fill="none" stroke="white" strokeOpacity=".72" />
        <path d="M28.5 12.5v16.2c0 5.2-3.1 8.2-8.3 8.2h-4.8" fill="none" stroke="white" strokeLinecap="round" strokeWidth="5.4" />
        <path d="M29 13h8v6h-8" fill="#36c8eb" />
        <path d="M15.5 31.7v5.1h4.8c1.7 0 3.2-.3 4.5-1" fill="none" stroke="#36c8eb" strokeLinecap="round" strokeWidth="4.8" />
      </svg>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[15px] font-bold leading-tight tracking-[-0.03em] text-[#172019] sm:text-base">{companyName}</span>
        <span className="mt-1 flex min-w-0 items-center gap-1.5 text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#56615a] sm:text-[10px] sm:tracking-[0.16em]">
          <span className="truncate">{location}</span>
        </span>
      </span>
    </div>
  );
}
