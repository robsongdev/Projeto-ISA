'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navegacao() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-6"/>
              </svg>
              Resumo
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              href="/despesas"
              className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                pathname === '/despesas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <path d="M15 3h6v6"/>
                <path d="M10 14L21 3"/>
              </svg>
              Gerenciar Despesas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}