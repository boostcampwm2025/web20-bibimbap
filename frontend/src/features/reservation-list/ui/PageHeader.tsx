interface PageHeaderProps {
  title: string;
}

function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between px-lg py-md bg-white shadow-sm">
      <button
        className="bg-transparent border-none text-xl cursor-pointer text-text-primary p-xs hover:opacity-70"
        onClick={() => window.history.back()}
      >
        ←
      </button>
      <h1 className="flex-1 mx-md my-0 text-xl font-semibold text-primary-dark">
        {title}
      </h1>
      <div className="flex items-center gap-md">
        <span className="text-md text-text-primary">J283 한지은</span>
        <button className="px-md py-xs bg-transparent border border-border-main rounded-sm text-sm text-primary cursor-pointer hover:bg-gray-100">
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default PageHeader;
