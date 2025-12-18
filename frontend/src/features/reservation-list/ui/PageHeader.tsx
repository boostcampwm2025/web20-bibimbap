import { ICONS } from '../../../constants/icons.constants';
import { CURRENT_USER } from '../../../constants/auth.constants';
import { MESSAGES } from '../../../constants/messages.constants';

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
        {ICONS.BACK_ARROW}
      </button>
      <h1 className="flex-1 mx-md my-0 text-xl font-semibold text-primary-dark">
        {title}
      </h1>
      <div className="flex items-center gap-md">
        <span className="text-md text-text-primary">{CURRENT_USER.id} {CURRENT_USER.name}</span>
        <button className="px-md py-xs bg-transparent border border-border-main rounded-sm text-sm text-primary cursor-pointer hover:bg-gray-100">
          {MESSAGES.LOGOUT}
        </button>
      </div>
    </header>
  );
}

export default PageHeader;
