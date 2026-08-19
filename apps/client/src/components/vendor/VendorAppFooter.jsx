export default function VendorAppFooter() {
  return (
    <footer className="mt-auto py-3 px-8 text-xs text-[#64748b] border-t border-[#e2e8f0] bg-transparent">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-semibold text-[#1e293b]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 17V7" />
            <path d="M15 17V7" />
            <path d="M9 12h6" />
          </svg>
          CatalogGate Enterprise
        </div>
        <div>&copy; 2026 CatalogGate Enterprise Operations. All systems operational.</div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="#security" className="hover:underline">
            Security Compliance
          </a>
        </div>
      </div>
    </footer>
  );
}
