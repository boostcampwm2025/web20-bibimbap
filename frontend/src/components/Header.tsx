import { Link, useParams } from 'react-router';
import type { NavItem } from '@/Layout';
import { useAuth } from '@/store/AuthContext';
import LogoutIcon from '@/assets/icons/logout.svg?react';
import { useOrg } from '@/store/OrgContext';

interface HeaderProps {
  navItems: NavItem[];
}

function Header({ navItems }: HeaderProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const { user, logout } = useAuth();
  const { organization } = useOrg();

  return (
    <header className="border-neutral-border-default sticky top-0 z-100 flex h-14 w-full items-center justify-between border-b bg-white/50 px-8 backdrop-blur">
      <div className="flex h-full items-center gap-5">
        <Link to={orgId ? `/orgs/${orgId}` : '/'} className="flex gap-2">
          <img className="aspect-square h-6" src="/logo.webp" alt="로고" />
          <div className="hidden items-center gap-2 font-extrabold sm:flex">
            <span>bookstcamp</span>
            {organization && (
              <>
                <span className="text-neutral-border-default font-normal">|</span>
                <span className="text-neutral-text-secondary text-sm font-medium">
                  {organization.name}
                </span>
              </>
            )}
          </div>
        </Link>
        <nav className="text-12 flex min-w-0 gap-2 overflow-x-auto sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-neutral-text-secondary hover:text-neutral-text-primary shrink-0 cursor-pointer transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-14 text-gray-700">
            안녕하세요, {user.role === 'ADMIN' ? '운영진' : user.name}님
          </span>
          <button
            type="button"
            aria-label="로그아웃"
            onClick={logout}
            className="text-neutral-text-secondary hover:text-brand-500 hover:bg-neutral-surface-default flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
