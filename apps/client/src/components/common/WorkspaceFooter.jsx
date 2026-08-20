export default function WorkspaceFooter() {
  return (
    <footer className="w-full border-t border-[#e2e8f0] bg-white">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[0.7rem] font-medium text-[#94a3b8]">
          © {new Date().getFullYear()} CATALOGGATE. All rights reserved.
        </div>

        <div className="flex items-center gap-5">
          <span className="text-[0.7rem] font-medium text-[#94a3b8]">
            Catalog Management Platform
          </span>

          <span className="h-3 w-px bg-[#e2e8f0]" />

          <span className="text-[0.7rem] font-semibold text-[#7aa0ff]">
            v1.0
          </span>
        </div>
      </div>
    </footer>
  );
}