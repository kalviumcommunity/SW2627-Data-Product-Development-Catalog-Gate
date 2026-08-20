export default function WorkspaceFooter() {
  return (
    <footer className="flex-shrink-0 px-8 pb-5 pt-4">
      <div className="max-w-[1440px] w-full mx-auto border-t border-[#e2e8f0] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] text-slate-700">
          <div>
            © {new Date().getFullYear()} CATALOGGATE. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-700 p-5">
            <span>Enterprise Catalog Validation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}